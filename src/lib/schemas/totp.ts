import { z } from "zod";

export const TotpSchema = z
  .string()
  .trim()
  .length(6)
  .regex(/^\d{6}$/);
