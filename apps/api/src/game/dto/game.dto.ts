import {z} from "zod";

export const createGameRoomDto = z.object({
  quizId: z.string(),
  pin: z.string().optional(),
})

export const joinGameRoomDto = z.object({
  roomId: z.string(),
  nickname: z.string(),
  pin: z.string().optional(),
})

export type GameRoomCreateDto = z.infer<typeof createGameRoomDto>
export type GameRoomJoinDto = z.infer<typeof joinGameRoomDto>
