import { z } from "zod";

const STANDARD_CRITERION_KEYS = [
  "clear_problem",
  "problem_relevance",
  "scope_feasibility",
  "technical_depth",
  "originality",
  "solution_quality",
  "academic_value",
];

const standardCriterionSchema = z.object({
  key: z.enum(STANDARD_CRITERION_KEYS),

  enabled: z.boolean(),

  required: z.boolean(),
});

const customCriterionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Custom criterion name must be at least 3 characters")
    .max(100, "Custom criterion name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Custom criterion description must be at least 10 characters")
    .max(500, "Custom criterion description must not exceed 500 characters"),

  enabled: z.boolean(),

  required: z.boolean(),
});

export const updateProjectReviewCriteriaSchema = z.object({
  standardCriteria: z
    .array(standardCriterionSchema)
    .min(1, "At least one standard criterion is required")
    .refine(
      (criteria) => {
        const keys = criteria.map((criterion) => criterion.key);

        return new Set(keys).size === keys.length;
      },
      {
        message: "Duplicate standard criteria are not allowed",
      },
    ),

  customCriteria: z
    .array(customCriterionSchema)
    .max(20, "You cannot have more than 20 custom criteria"),

  autoReview: z.object({
    enabled: z.boolean(),

    confidenceThreshold: z
      .number()
      .min(0.5, "Confidence threshold cannot be below 0.5")
      .max(1, "Confidence threshold cannot exceed 1"),
  }),
});

export const validateUpdateProjectReviewCriteria = (req, res, next) => {
  const result = updateProjectReviewCriteriaSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;

  next();
};
