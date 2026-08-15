import { z } from "zod";

const teamMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Team member name must be at least 2 characters")
    .max(100, "Team member name cannot exceed 100 characters"),

  role: z
    .string()
    .trim()
    .max(100, "Team member role cannot exceed 100 characters")
    .optional(),
});

const resourceAccessSchema = z.object({
  url: z.string().trim().url("Invalid URL").optional(),

  access: z.enum(["public", "protected"]).default("public"),
});

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Project title must be at least 3 characters")
    .max(100, "Project title cannot exceed 100 characters"),

  summary: z
    .string()
    .trim()
    .min(20, "Project summary must be at least 20 characters")
    .max(500, "Project summary cannot exceed 500 characters"),

  description: z
    .string()
    .trim()
    .min(50, "Project description must be at least 50 characters")
    .max(5000, "Project description cannot exceed 5000 characters"),

  technologies: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Technology name cannot be empty")
        .max(50, "Technology name cannot exceed 50 characters"),
    )
    .min(1, "At least one technology is required"),

  domain: z
    .string()
    .trim()
    .min(2, "Domain must be at least 2 characters")
    .max(50, "Domain cannot exceed 50 characters"),

  department: z
    .string()
    .trim()
    .min(2, "Department must be at least 2 characters")
    .max(100, "Department cannot exceed 100 characters"),

  academicYear: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, "Academic year must be in YYYY-YY format"),

  teamMembers: z
    .array(teamMemberSchema)
    .min(1, "At least one team member is required"),

  github: resourceAccessSchema.optional(),

  deployedLink: resourceAccessSchema.optional(),

  supportingDocuments: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, "Document name is required")
          .max(150, "Document name cannot exceed 150 characters"),

        access: z.enum(["public", "protected"]).default("public"),
      }),
    )
    .optional(),
});

export const updateProjectSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Project title must be at least 3 characters")
      .max(100, "Project title cannot exceed 100 characters")
      .optional(),

    summary: z
      .string()
      .trim()
      .min(20, "Project summary must be at least 20 characters")
      .max(500, "Project summary cannot exceed 500 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(50, "Project description must be at least 50 characters")
      .max(5000, "Project description cannot exceed 5000 characters")
      .optional(),

    technologies: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Technology name cannot be empty")
          .max(50, "Technology name cannot exceed 50 characters"),
      )
      .min(1, "At least one technology is required")
      .optional(),

    domain: z
      .string()
      .trim()
      .min(2, "Domain must be at least 2 characters")
      .max(50, "Domain cannot exceed 50 characters")
      .optional(),

    department: z
      .string()
      .trim()
      .min(2, "Department must be at least 2 characters")
      .max(100, "Department cannot exceed 100 characters")
      .optional(),

    academicYear: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}$/, "Academic year must be in YYYY-YY format")
      .optional(),

    teamMembers: z
      .array(teamMemberSchema)
      .min(1, "At least one team member is required")
      .optional(),

    github: resourceAccessSchema.optional(),

    deployedLink: resourceAccessSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update the project",
  });
