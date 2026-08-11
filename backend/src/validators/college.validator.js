import { z } from "zod";

export const collegeRegisterSchema = z.object({
  collegeName: z
    .string()
    .min(3, "College name must be at least 3 characters")
    .max(100, "College name cannot exceed 100 characters")
    .trim(),

  adminName: z
    .string()
    .min(3, "Admin name must be at least 3 characters")
    .max(50, "Admin name cannot exceed 50 characters")
    .trim(),

  email: z.string().email("Invalid email address").toLowerCase().trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters"),
});
