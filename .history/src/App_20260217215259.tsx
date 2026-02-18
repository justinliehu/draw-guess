import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import GameLobby from './pages/GameLobby'
import RoomLobby from './pages/RoomLobby'
import GamePlay from './pages/GamePlay'
import RoundEnd from './pages/RoundEnd'
import GameEnd from './pages/GameEnd'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/lobby" element={<GameLobby />} />
      <Route path="/room/:roomId" element={<RoomLobby />} />
      <Route path="/game/:roomId" element={<GamePlay />} />
      <Route path="/round-end/:roomId" element={<RoundEnd />} />
      <Route path="/game-end/:roomId" element={<GameEnd />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
