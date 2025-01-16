import { z } from "zod";

export const CredentialsSchema = z.object({
  Username: z
    .string()
    .trim()
    .min(1, { message: "Must include an email" })
    .email({ message: "Invalid email" }),
  Password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const RegisterSchema = z.object({
  username: z.string().trim().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
