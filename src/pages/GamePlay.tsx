import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Player, ChatMessage } from '../types/game'

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'Alice', ready: true, score: 120, isPainter: true },
  { id: '2', name: 'Bob', ready: true, score: 90, isPainter: false },
  { id: '3', name: 'Carol', ready: true, score: 70, isPainter: false },
]

const MOCK_CHAT: ChatMessage[] = [
  { id: '1', playerId: '2', playerName: 'Bob', content: '猫？', type: 'guess', correct: false, timestamp: Date.now() - 20000 },
  { id: '2', playerId: '3', playerName: 'Carol', content: '狗？', type: 'guess', correct: false, timestamp: Date.now() - 15000 },
  { id: '3', playerId: '2', playerName: 'Bob', content: 'CAT', type: 'guess', correct: true, timestamp: Date.now() - 5000 },
]

export default function GamePlay() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPainter] = useState(true)
  const [roundTime, setRoundTime] = useState(45)
  const [currentRound, setCurrentRound] = useState(2)
  const [maxRounds] = useState(8)
  const [wordHint] = useState('C _ T')
  const [painterWord] = useState('CAT')
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT)
  const [guessInput, setGuessInput] = useState('')
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush')
  const [brushColor, setBrushColor] = useState('#ffffff')
  const [brushSize, setBrushSize] = useState(4)

  useEffect(() => {
    const t = setInterval(() => setRoundTime((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  // 画板绘制逻辑（画家端）
  useEffect(() => {
    if (!isPainter || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let drawing = false
    let lastX = 0
    let lastY = 0

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      if ('touches' in e) {
        return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY }
      }
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
    }

    const start = (e: MouseEvent | TouchEvent) => {
      drawing = true
      const pos = getPos(e)
      lastX = pos.x
      lastY = pos.y
    }
    const move = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return
      const pos = getPos(e)
      ctx.strokeStyle = tool === 'eraser' ? '#1e1e2e' : brushColor
      ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
      lastX = pos.x
      lastY = pos.y
    }
    const end = () => { drawing = false }

    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', move)
    canvas.addEventListener('mouseup', end)
    canvas.addEventListener('mouseleave', end)
    canvas.addEventListener('touchstart', start, { passive: true })
    canvas.addEventListener('touchmove', move, { passive: true })
    canvas.addEventListener('touchend', end)
    return () => {
      canvas.removeEventListener('mousedown', start)
      canvas.removeEventListener('mousemove', move)
      canvas.removeEventListener('mouseup', end)
      canvas.removeEventListener('mouseleave', end)
      canvas.removeEventListener('touchstart', start)
      canvas.removeEventListener('touchmove', move)
      canvas.removeEventListener('touchend', end)
    }
  }, [isPainter, tool, brushColor, brushSize])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleGuess = () => {
    if (!guessInput.trim()) return
    const correct = guessInput.trim().toUpperCase() === painterWord
    setMessages((m) => [
      ...m,
      {
        id: String(Date.now()),
        playerId: 'me',
        playerName: '我',
        content: guessInput.trim(),
        type: 'guess',
        correct,
        timestamp: Date.now(),
      },
    ])
    setGuessInput('')
    if (correct) {
      setTimeout(() => navigate(`/round-end/${roomId}`), 500)
    }
  }

  const painter = MOCK_PLAYERS.find((p) => p.isPainter)

  return (
    <div className="game-play">
      <header className="game-play-header">
        <span>房间：{roomId}</span>
        <span>第 {currentRound} / {maxRounds} 轮</span>
      </header>

      <div className="game-play-body">
        {/* A. 作画区域 */}
        <section className="game-section draw-section">
          <div className="canvas-wrap">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              style={{
                background: '#1e1e2e',
                borderRadius: 'var(--radius)',
                touchAction: 'none',
              }}
            />
          </div>
          {isPainter && (
            <div className="toolbar">
              <button
                type="button"
                className={tool === 'brush' ? 'active' : ''}
                onClick={() => setTool('brush')}
              >
                画笔
              </button>
              <button
                type="button"
                className={tool === 'eraser' ? 'active' : ''}
                onClick={() => setTool('eraser')}
              >
                橡皮
              </button>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                style={{ width: 36, height: 36, padding: 0, border: 'none', cursor: 'pointer' }}
              />
              <input
                type="range"
                min={2}
                max={20}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ width: 80 }}
              />
              <button type="button" onClick={clearCanvas}>清空画板</button>
            </div>
          )}
        </section>

        {/* B. 聊天猜词区 + C. 游戏状态 + D. 积分 + E. 词语提示 */}
        <aside className="game-aside">
          <div className="card game-state-card">
            <p className="card-title">游戏状态</p>
            <p>画家：{painter?.name ?? '-'}</p>
            <p>时间：{roundTime} 秒</p>
            <p>轮数：第 {currentRound} / {maxRounds} 轮</p>
          </div>

          <div className="card word-hint-card">
            <p className="card-title">当前词语</p>
            <p style={{ fontSize: '1.5rem', letterSpacing: 4, fontWeight: 700 }}>
              {isPainter ? painterWord : wordHint}
            </p>
          </div>

          <div className="card score-card">
            <p className="card-title">积分榜</p>
            <ul style={{ listStyle: 'none' }}>
              {MOCK_PLAYERS.sort((a, b) => b.score - a.score).map((p, i) => (
                <li key={p.id} style={{ padding: '0.25rem 0' }}>
                  {i + 1}. {p.name} - {p.score}
                </li>
              ))}
            </ul>
          </div>

          <div className="card chat-card">
            <p className="card-title">猜词 / 聊天</p>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    color: msg.correct ? 'var(--success)' : undefined,
                    marginBottom: '0.25rem',
                  }}
                >
                  {msg.playerName}: {msg.content}
                  {msg.correct && ' ✓'}
                </div>
              ))}
            </div>
            {!isPainter && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                  placeholder="输入你的答案..."
                />
                <button type="button" onClick={handleGuess}>发送</button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
