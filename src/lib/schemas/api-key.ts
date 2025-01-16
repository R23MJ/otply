import { z } from "zod";

export const ApiKeySchema = z
  .string()
  .trim()
  .length(70)
  .regex(/^otply_[a-zA-Z0-9]{64}$/);
