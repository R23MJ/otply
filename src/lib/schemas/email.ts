import { z } from "zod";

export const EmailSchema = z
  .string()
  .trim()
  .min(1, { message: "Must include an email" })
  .email({ message: "Invalid email" });
