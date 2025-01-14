import { z } from "zod";

export const CredentialsSchema = z.object({
  Username: z
    .string()
    .trim()
    .min(1, { message: "Must include an email" })
    .email({ message: "Invalid email" }),
  Password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" }),
});
