import { z } from "zod";

export const quizAnswerItemSchema = z.object({
  wordId: z.string(),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
  responseTimeMs: z.number().int().nonnegative().optional().default(0),
});

export const submitQuizSchema = z.object({
  quizType: z.enum(["quiz", "recall", "cloze", "flashcards"]),
  unitId: z.union([z.number().int(), z.literal("all")]),
  totalQuestions: z.number().int().min(1).max(50),
  correctAnswers: z.number().int().min(0),
  durationSeconds: z.number().int().min(0),
  answers: z.array(quizAnswerItemSchema).min(1),
});
