import {z} from "zod";


export const createQuizSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(1000).optional(),
  artwork: z.string().min(1),
  isPublished: z.boolean().default(false),
});

export const updateQuizSchema = createQuizSchema.partial();

export type QuizCreateDto = z.infer<typeof createQuizSchema>
export type QuizUpdateDto = z.infer<typeof updateQuizSchema>
