import { z } from "zod";

export const rejectProjectProposalSchema = z.object({
  adminRemarks: z
    .string()
    .trim()
    .min(5, "Rejection remarks must be at least 5 characters")
    .max(800, "Rejection remarks must not exceed 800 characters"),
});

export const validateRejectProjectProposal = (req, res, next) => {
  const result = rejectProjectProposalSchema.safeParse(req.body);

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
