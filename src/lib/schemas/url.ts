import { z } from "zod";

export const UrlSchema = z
  .string()
  .trim()
  .url()
  .refine((url) => new URL(url).protocol === "https:", {
    message: "HTTPS protocol is required",
  });
