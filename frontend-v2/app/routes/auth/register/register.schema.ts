import { z } from "zod";
export const registerValidationSchema = z
  .object({
    email: z.email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),
    terms: z.boolean().refine((value) => value, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
