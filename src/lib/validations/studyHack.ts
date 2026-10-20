import { z } from "zod";

export const studyHackSchema = z.object({
  title: z.string().min(2, "Mavzu sarlavhasi kamida 2 ta belgi bo'lishi kerak").max(100),
  content: z.string().min(5, "Tavsif kamida 5 ta belgi bo'lishi kerak").max(1000),
  related_word_id: z.string().optional().nullable(),
  related_unit_id: z.number().int().optional().nullable(),
  tag: z.enum([
    "Visual Hook",
    "Phonetic Hook",
    "Etymology",
    "Uzbek Cognate",
    "Collocation Trick",
    "Memory Hook"
  ]).default("Memory Hook"),
});
