import { z } from "zod";

const criterionResultSchema = z.object({
  key: z.string().min(1),

  name: z.string().min(1),

  result: z.enum(["PASS", "FAIL", "PARTIAL"]),

  reason: z.string().trim().min(1).max(1000),
});

export const proposalAIResponseSchema = z.object({
  recommendation: z.enum(["APPROVE", "REJECT", "NEEDS_IMPROVEMENT"]),

  confidenceScore: z.number().min(0).max(1),

  summary: z.string().trim().min(1).max(1500),

  reasons: z.array(z.string().trim().min(1).max(500)).min(1).max(10),

  improvementSuggestions: z.array(z.string().trim().min(1).max(500)).max(10),

  criteriaBreakdown: z.array(criterionResultSchema).min(1),
});
