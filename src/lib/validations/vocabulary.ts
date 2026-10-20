import { z } from "zod";

export const wordAdminSchema = z.object({
  id: z.string().optional(),
  word: z.string().min(1, "So'z kiritilishi shart"),
  unit_id: z.number().int().min(1).max(30),
  part_of_speech: z.enum(["verb", "noun", "adjective", "adverb", "other"]),
  ipa_us: z.string().optional(),
  ipa_uk: z.string().optional(),
  definition_en: z.string().min(5, "Inglizcha ta'rif kiritilishi shart"),
  definition_uz: z.string().optional(),
  translation_uz: z.string().min(1, "O'zbekcha tarjima kiritilishi shart"),
  translation_ru: z.string().optional(),
  example_sentence_en: z.string().min(5, "Misol gap kiritilishi shart"),
  example_translation_uz: z.string().optional(),
  synonyms: z.array(z.string()).default([]),
  collocations: z.array(z.string()).default([]),
  difficulty_level: z.enum(["B1", "B2", "C1", "C2"]).default("B2"),
  is_published: z.boolean().default(true),
});

export const unitAdminSchema = z.object({
  id: z.number().int().min(1),
  title: z.string().min(3),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  category: z.string().default("Foundation & Academic"),
  is_published: z.boolean().default(true),
});
