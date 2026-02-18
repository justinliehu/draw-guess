import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Player } from '../types/game'

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'Alice', ready: true, score: 0 },
  { id: '2', name: 'Bob', ready: false, score: 0 },
  { id: '3', name: 'Carol', ready: true, score: 0 },
]

export default function RoomLobby() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [myReady, setMyReady] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ name: string; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')

  // 模拟：所有人 Ready 后 30 秒倒计时
  useEffect(() => {
    const allReady = players.length >= 2 && players.every((p) => p.ready)
    if (allReady && countdown === null) setCountdown(30)
  }, [players, countdown])

  useEffect(() => {
    if (countdown === null || countdown <= 0) return
    const t = setInterval(() => {
      setCountdown((c) => (c !== null && c > 0 ? c - 1 : null))
    }, 1000)
    return () => clearInterval(t)
  }, [countdown])

  useEffect(() => {
    if (countdown === 0) navigate(`/game/${roomId}`)
  }, [countdown, navigate, roomId])

  const toggleReady = () => {
    setMyReady((r) => !r)
    setPlayers((prev) =>
      prev.map((p) => (p.name === 'Bob' ? { ...p, ready: !myReady } : p))
    )
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    setChatMessages((m) => [...m, { name: '我', text: chatInput.trim() }])
    setChatInput('')
  }

  const exitRoom = () => navigate('/lobby')

  return (
    <div className="page" style={{ justifyContent: 'flex-start', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 600, marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>房间：{roomId}</h1>
        <button type="button" onClick={exitRoom} style={{ background: 'var(--surface-hover)' }}>
          退出房间
        </button>
      </div>
      <div className="card" style={{ maxWidth: 600, width: '100%', marginBottom: '1rem' }}>
        <p className="card-title">玩家列表</p>
        <ul style={{ listStyle: 'none' }}>
          {players.map((p) => (
            <li
              key={p.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--surface-hover)',
              }}
            >
              <span>{p.name}</span>
              <span>{p.ready ? '✅ Ready' : '❌ Not Ready'}</span>
            </li>
          ))}
        </ul>
        {countdown !== null && countdown > 0 && (
          <p style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 600 }}>
            游戏将在 {countdown} 秒后开始...
          </p>
        )}
      </div>
      <div className="card" style={{ maxWidth: 600, width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p className="card-title">聊天</p>
        <div
          style={{
            flex: 1,
            minHeight: 120,
            maxHeight: 200,
            overflowY: 'auto',
            marginBottom: '0.75rem',
            padding: '0.5rem',
            background: 'var(--bg)',
            borderRadius: 'var(--radius)',
          }}
        >
          {chatMessages.length === 0 && (
            <span style={{ color: 'var(--text-muted)' }}>暂无消息</span>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '0.25rem' }}>
              <strong>{msg.name}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            placeholder="输入消息..."
          />
          <button type="button" onClick={sendChat}>发送</button>
        </div>
      </div>
      <button
        type="button"
        onClick={toggleReady}
        style={{ marginTop: '1rem', minWidth: 160 }}
      >
        {myReady ? '取消准备' : '准备'}
      </button>
    </div>
  )
}
