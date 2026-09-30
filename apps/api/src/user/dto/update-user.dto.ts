import { createUserSchema} from './create-user.dto';
import {z} from "zod";

export const updateUserSchema = z.object({
  ...createUserSchema,
  token: z.string()
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
