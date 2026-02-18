import { useNavigate, useParams } from 'react-router-dom'

const MOCK_RANKING = [
  { rank: 1, name: 'Bob', score: 320 },
  { rank: 2, name: 'Alice', score: 280 },
  { rank: 3, name: 'Carol', score: 210 },
]

export default function GameEnd() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const playAgain = () => navigate(`/room/${roomId}`)
  const backToLobby = () => navigate('/lobby')

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 420, textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>🏆 游戏结束</h1>
        <p className="card-title" style={{ marginBottom: '1.5rem' }}>最终排名</p>
        <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
          {MOCK_RANKING.map((r) => (
            <li
              key={r.rank}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: r.rank === 1 ? 'rgba(124, 58, 237, 0.2)' : 'var(--bg)',
                borderRadius: 'var(--radius)',
                marginBottom: '0.5rem',
              }}
            >
              <span>
                {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : '🥉'} 第{r.rank}名 {r.name}
              </span>
              <span style={{ fontWeight: 600 }}>{r.score} 分</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button type="button" onClick={playAgain} style={{ width: '100%' }}>
            再来一局
          </button>
          <button
            type="button"
            onClick={backToLobby}
            style={{ width: '100%', background: 'var(--surface-hover)' }}
          >
            回到大厅
          </button>
        </div>
      </div>
    </div>
  )
}
