import { z } from "zod";

export const createProjectProposalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Project title must be at least 5 characters")
    .max(150, "Project title must not exceed 150 characters"),

  team: z
    .object({
      size: z
        .number()
        .int("Team size must be an integer")
        .min(1, "Team must have at least 1 member")
        .max(10, "Team cannot have more than 10 members"),

      members: z
        .array(
          z.object({
            name: z
              .string()
              .trim()
              .min(2, "Team member name must be at least 2 characters")
              .max(50, "Team member name must not exceed 50 characters"),
          }),
        )
        .min(1, "At least one team member is required"),
    })
    .refine((team) => team.size === team.members.length, {
      message: "Team size must match the number of team members",
      path: ["size"],
    }),
});

export const validateCreateProjectProposal = (req, res, next) => {
  try {
    if (typeof req.body.team === "string") {
      req.body.team = JSON.parse(req.body.team);
    }
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid team data",
      errors: [],
    });
  }

  const result = createProjectProposalSchema.safeParse(req.body);

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

export const updateProjectProposalSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Project title must be at least 5 characters")
      .max(150, "Project title must not exceed 150 characters")
      .optional(),

    team: z
      .object({
        size: z
          .number()
          .int("Team size must be an integer")
          .min(1, "Team must have at least 1 member")
          .max(10, "Team cannot have more than 10 members"),

        members: z
          .array(
            z.object({
              name: z
                .string()
                .trim()
                .min(2, "Team member name must be at least 2 characters")
                .max(50, "Team member name must not exceed 50 characters"),
            }),
          )
          .min(1, "At least one team member is required"),
      })
      .refine((team) => team.size === team.members.length, {
        message: "Team size must match the number of team members",
        path: ["size"],
      })
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.team !== undefined, {
    message: "At least one field must be provided for update",
  });

export const validateUpdateProjectProposal = (req, res, next) => {
  try {
    if (typeof req.body.team === "string") {
      req.body.team = JSON.parse(req.body.team);
    }
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid team data",
      errors: [],
    });
  }

  const result = updateProjectProposalSchema.safeParse(req.body);

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
