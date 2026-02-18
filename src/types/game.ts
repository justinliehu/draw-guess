/** 玩家信息 */
export interface Player {
  id: string
  name: string
  ready: boolean
  score: number
  isPainter?: boolean
}

/** 房间信息 */
export interface Room {
  id: string
  roomCode: string
  gameType: 'draw-guess' | 'undercover' | 'quiz'
  players: Player[]
  status: 'waiting' | 'counting' | 'playing' | 'round-end' | 'ended'
  countdown?: number
  maxRounds?: number
  currentRound?: number
}

/** 聊天消息 */
export interface ChatMessage {
  id: string
  playerId: string
  playerName: string
  content: string
  type: 'guess' | 'system' | 'chat'
  correct?: boolean
  timestamp: number
}

/** 回合结果 */
export interface RoundResult {
  word: string
  painterId: string
  correctPlayers: { playerId: string; playerName: string; score: number }[]
  painterScore: number
}

/** 最终排名 */
export interface FinalRanking {
  playerId: string
  playerName: string
  score: number
  rank: number
}
