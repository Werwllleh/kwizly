import {z} from "zod";


export const authSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(12)
})

export type AuthDto = z.infer<typeof authSchema>
