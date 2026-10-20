import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Haqiqiy email manzilini kiriting"),
  password: z.string().min(4, "Parol kamida 4 ta belgidan iborat bo'lishi kerak"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  email: z.string().email("Haqiqiy email manzilini kiriting"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  targetBand: z.enum(["Band 6.5", "Band 7.0", "Band 7.5", "Band 8.0", "Band 8.5+"]).default("Band 7.5"),
});

export const updateProfileSchema = z.object({
  display_name: z.string().min(2).optional(),
  target_band: z.string().optional(),
  preferred_pronunciation_accent: z.enum(["US", "UK"]).optional(),
  daily_learning_goal: z.number().int().min(1).max(50).optional(),
  timezone: z.string().optional(),
});
