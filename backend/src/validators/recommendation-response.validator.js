import { z } from "zod";

export const recommendationResponseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Recommendation title must be at least 3 characters")
    .max(150, "Recommendation title cannot exceed 150 characters"),

  whyRecommended: z
    .string()
    .trim()
    .min(20, "Recommendation reason must be at least 20 characters"),

  introduction: z
    .string()
    .trim()
    .min(50, "Introduction must be at least 50 characters"),

  problemStatement: z
    .string()
    .trim()
    .min(50, "Problem statement must be at least 50 characters"),

  proposedSolution: z
    .string()
    .trim()
    .min(50, "Proposed solution must be at least 50 characters"),

  keyFeatures: z
    .array(
      z
        .string()
        .trim()
        .min(5, "Key feature cannot be too short")
        .max(300, "Key feature cannot exceed 300 characters"),
    )
    .min(3, "At least 3 key features are required")
    .max(8, "Maximum 8 key features are allowed"),

  technologies: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Technology name cannot be empty")
        .max(50, "Technology name cannot exceed 50 characters"),
    )
    .min(1, "At least one technology is required")
    .max(15, "Maximum 15 technologies are allowed"),

  expectedOutcome: z
    .string()
    .trim()
    .min(30, "Expected outcome must be at least 30 characters"),

  conclusion: z
    .string()
    .trim()
    .min(30, "Conclusion must be at least 30 characters"),
});
