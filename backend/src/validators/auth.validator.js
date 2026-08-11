import { z } from "zod";

export const studentRegisterSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .trim(),

  email: z.string().email("Invalid email address").toLowerCase().trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters"),

  collegeCode: z.string().min(5).max(15).toUpperCase().trim(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resendVerificationEmailSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});