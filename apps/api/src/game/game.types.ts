export type GameStatus =
  | 'LOBBY'
  | 'QUESTION'
  | 'QUESTION_RESULT'
  | 'LEADERBOARD'
  | 'FINISHED';

export type TPlayer = {
  socketId: string,
  nickname: string,
  score: number,
  hasAnswered: boolean
}

export type TGameSession = {
  roomId: string,
  hostSocketId: string,
  quizId: string,
  pin: string | null,
  status: GameStatus,
  currentQuestionIndex: number,
  players: Record<string, TPlayer>,
  createdAt: number
}

