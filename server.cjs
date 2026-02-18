const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const port = 8080;
const cwd = process.cwd();

const mimes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

// In-memory room state (shared by all devices using this server)
const rooms = {};

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const rawPath = req.url.split('?')[0];
  const pathParts = rawPath.replace(/^\//, '').split('/').filter(Boolean);

  if (pathParts[0] === 'api' && pathParts[1] === 'rooms') {
    if (pathParts.length === 2 && req.method === 'GET') {
      const list = Object.keys(rooms)
        .filter((id) => rooms[id].players && rooms[id].players.length > 0)
        .map((id) => ({ roomId: id, playerCount: rooms[id].players.length }));
      sendJson(res, 200, list);
      return;
    }
    const roomId = pathParts[2];
    if (!roomId) {
      sendJson(res, 400, { error: 'missing roomId' });
      return;
    }
    if (!rooms[roomId]) rooms[roomId] = { players: [], state: { status: 'waiting' } };
    if (!rooms[roomId].state) rooms[roomId].state = { status: 'waiting' };

    if (pathParts[3] === 'players') {
      if (req.method === 'GET') {
        sendJson(res, 200, rooms[roomId].players || []);
        return;
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const players = Array.isArray(body) ? body : (body.players || []);
        const state = rooms[roomId].state || { status: 'waiting' };
        if (state.status === 'playing') {
          const current = rooms[roomId].players || [];
          const currentIds = new Set(current.map((p) => p.id));
          const hasNewPlayer = players.some((p) => !currentIds.has(p.id));
          if (hasNewPlayer) {
            sendJson(res, 403, { error: '游戏已开始，无法加入' });
            return;
          }
        }
        rooms[roomId].players = players;
        sendJson(res, 200, rooms[roomId].players);
        return;
      }
    }
    if (pathParts[3] === 'state') {
      if (req.method === 'GET') {
        const state = rooms[roomId].state || { status: 'waiting' };
        const out = { ...state };
        if (out.countdownEndTime && out.status === 'waiting') {
          const remaining = Math.max(0, Math.floor((out.countdownEndTime - Date.now()) / 1000));
          out.countdownRemaining = remaining;
        }
        sendJson(res, 200, out);
        return;
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        if (!rooms[roomId].state) rooms[roomId].state = { status: 'waiting' };
        const prevRound = rooms[roomId].state.currentRound;
        Object.assign(rooms[roomId].state, body);
        if (body.currentRound != null && body.currentRound !== prevRound) {
          rooms[roomId].state.guesses = [];
          rooms[roomId].state.canvasData = null;
        }
        sendJson(res, 200, rooms[roomId].state);
        return;
      }
    }
    if (pathParts[3] === 'confirm' && req.method === 'POST') {
      const body = await parseBody(req);
      const playerId = body && body.playerId;
      if (!playerId) {
        sendJson(res, 400, { error: 'missing playerId' });
        return;
      }
      if (!rooms[roomId].state.confirmedPlayerIds) rooms[roomId].state.confirmedPlayerIds = [];
      if (!rooms[roomId].state.confirmedPlayerIds.includes(playerId)) {
        rooms[roomId].state.confirmedPlayerIds.push(playerId);
      }
      sendJson(res, 200, rooms[roomId].state);
      return;
    }
    if (pathParts[3] === 'guess' && req.method === 'POST') {
      const body = await parseBody(req);
      const { playerId, playerName, content, correct, timestamp } = body || {};
      if (!playerId || content == null) {
        sendJson(res, 400, { error: 'missing playerId or content' });
        return;
      }
      if (!rooms[roomId].state.guesses) rooms[roomId].state.guesses = [];
      rooms[roomId].state.guesses.push({
        playerId,
        playerName: playerName || '?',
        content: String(content).trim(),
        correct: !!correct,
        timestamp: typeof timestamp === 'number' ? timestamp : Date.now()
      });
      sendJson(res, 200, rooms[roomId].state);
      return;
    }
    sendJson(res, 404, { error: 'not found' });
    return;
  }

  let filePath = rawPath;
  if (filePath === '/') filePath = '/index-standalone.html';
  const relativePath = filePath.replace(/^\//, '').replace(/\\/g, '/');
  const fullPath = path.resolve(cwd, relativePath);

  if (!fullPath.startsWith(path.resolve(cwd))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found: ' + rawPath);
      return;
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': mimes[ext] || 'text/plain' });
    res.end(data);
  });
});

function getLanIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return null;
}

server.listen(port, () => {
  const lan = getLanIp();
  console.log('');
  console.log('  Server running:');
  console.log('  http://localhost:' + port);
  if (lan) {
    console.log('  Phone + PC same room -> use this on BOTH devices:');
    console.log('  http://' + lan + ':' + port + '/index-standalone.html');
  } else {
    console.log('  (Run "ipconfig" to get your IP for phone)');
  }
  console.log('');
});
