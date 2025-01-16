import { z } from "zod";

export const PasswordSchema = z
  .string()
  .trim()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(100, { message: "Password must be at most 100 characters" })
  .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
  .regex(/\d/, { message: "Password must include a number" })
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/]/, {
    message: "Password must include a special character",
  });
