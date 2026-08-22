import { z } from "zod";

export const createRecommendationSchema = z.object({
  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Skill cannot be empty")
        .max(50, "Skill cannot exceed 50 characters"),
    )
    .min(1, "At least one skill is required")
    .max(15, "Maximum 15 skills are allowed"),

  domain: z
    .string()
    .trim()
    .min(2, "Domain must be at least 2 characters")
    .max(50, "Domain cannot exceed 50 characters"),

  teamSize: z
    .number()
    .int("Team size must be a whole number")
    .min(1, "Team size must be at least 1")
    .max(2, "Team size cannot exceed 2"),

  difficulty: z.enum(
    ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    "Invalid difficulty level",
  ),

  projectType: z.enum(
    ["ACADEMIC", "REAL_WORLD", "INNOVATIVE", "RESEARCH"],
    "Invalid project type",
  ),
});
