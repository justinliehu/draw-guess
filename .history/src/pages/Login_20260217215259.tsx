import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [loginType, setLoginType] = useState<'wallet' | 'anonymous'>('anonymous')

  const handleEnter = () => {
    const name = nickname.trim() || '匿名玩家'
    // TODO: 实际登录逻辑（钱包/匿名），存储用户信息
    sessionStorage.setItem('playerName', name)
    sessionStorage.setItem('loginType', loginType)
    navigate('/lobby')
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 380 }}>
        <h1 className="page-title">你画我猜 · 线上版</h1>
        <p className="card-title">选择登录方式</p>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setLoginType('wallet')}
            style={{
              flex: 1,
              background: loginType === 'wallet' ? 'var(--primary)' : 'var(--surface-hover)',
            }}
          >
            连接钱包
          </button>
          <button
            type="button"
            onClick={() => setLoginType('anonymous')}
            style={{
              flex: 1,
              background: loginType === 'anonymous' ? 'var(--primary)' : 'var(--surface-hover)',
            }}
          >
            匿名登录
          </button>
        </div>
        <p className="card-title">输入昵称</p>
        <input
          type="text"
          placeholder="请输入昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          style={{ marginBottom: '1.25rem' }}
        />
        <button type="button" onClick={handleEnter} style={{ width: '100%' }}>
          进入游戏
        </button>
      </div>
    </div>
  )
}
