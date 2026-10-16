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


export const createQuestionOptionSchema = z.object({
  text: z.string().nonempty(),
  isCorrect: z.boolean().default(false),
  order: z.number().int().min(0),
  mediaUrl: z.string().min(1).optional(),
})

export const createQuestionSchema = z.object({
  text: z.string().min(3),
  order: z.number().int().min(0),
  timeLimit: z.number().int().min(5).default(60),
  points: z.number().int().min(0).default(10),
  mediaUrl: z.string().min(1).optional(),
  options: z.array(createQuestionOptionSchema).min(2).refine((opt) => opt.some(opt => opt.isCorrect), {
    error: "Хотя бы один вариант ответа должен быть правильным!"
  }),
})

export const updateQuestionSchema = createQuestionSchema.partial();

export type QuizQuestionOptionDto = z.infer<typeof createQuestionOptionSchema>
export type QuizQuestionDto = z.infer<typeof createQuestionSchema>
export type QuizUpdateQuestionDto = z.infer<typeof updateQuestionSchema>
