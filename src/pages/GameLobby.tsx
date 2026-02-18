import { useNavigate } from 'react-router-dom'

const GAMES = [
  { id: 'draw-guess', name: '你画我猜', icon: '🎨', path: '/lobby/draw-guess' },
  { id: 'undercover', name: '谁是卧底', icon: '🕵', path: '/lobby/undercover', disabled: true },
  { id: 'quiz', name: '快速问答', icon: '⚡', path: '/lobby/quiz', disabled: true },
]

export default function GameLobby() {
  const navigate = useNavigate()
  const onlineCount = 128 // TODO: 从后端拉取

  const handleCreateRoom = (gameId: string) => {
    if (gameId === 'undercover' || gameId === 'quiz') return
    // TODO: 调用创建房间 API，跳转到 /room/:roomId
    const mockRoomId = '1234'
    navigate(`/room/${mockRoomId}`)
  }

  const handleJoinRoom = () => {
    const code = window.prompt('请输入房间号')
    if (code) navigate(`/room/${code}`)
  }

  return (
    <div className="page">
      <div style={{ maxWidth: 480, width: '100%' }}>
        <h1 className="page-title">游戏大厅</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          在线人数：{onlineCount}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {GAMES.map((g) => (
            <div
              key={g.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                cursor: g.disabled ? 'not-allowed' : 'pointer',
                opacity: g.disabled ? 0.6 : 1,
              }}
              onClick={() => !g.disabled && handleCreateRoom(g.id)}
            >
              <span style={{ fontSize: '2rem' }}>{g.icon}</span>
              <span style={{ flex: 1, marginLeft: '1rem', fontWeight: 600 }}>{g.name}</span>
              {g.disabled ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>即将推出</span>
              ) : (
                <button type="button" onClick={(e) => { e.stopPropagation(); handleCreateRoom(g.id); }}>
                  进入游戏
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleJoinRoom}
          style={{ width: '100%', marginTop: '1rem', background: 'var(--surface-hover)' }}
        >
          加入房间
        </button>
      </div>
    </div>
  )
}
