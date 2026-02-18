import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const MOCK_RESULT = {
  word: 'CAT',
  painterName: 'Alice',
  correct: [
    { playerName: 'Bob', score: 100 },
    { playerName: 'Carol', score: 80 },
  ],
  painterScore: 40,
}

export default function RoundEnd() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate(`/game/${roomId}`), 3000)
    return () => clearTimeout(t)
  }, [roomId, navigate])

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>回合结束</h2>
        <p className="card-title">正确答案</p>
        <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          {MOCK_RESULT.word}
        </p>
        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          {MOCK_RESULT.correct.map((c, i) => (
            <div key={i} style={{ padding: '0.25rem 0', color: 'var(--success)' }}>
              {c.playerName} +{c.score}
            </div>
          ))}
          <div style={{ padding: '0.25rem 0', color: 'var(--text-muted)' }}>
            画家 {MOCK_RESULT.painterName} +{MOCK_RESULT.painterScore}
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          3 秒后进入下一轮...
        </p>
      </div>
    </div>
  )
}
