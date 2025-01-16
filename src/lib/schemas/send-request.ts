import { z } from "zod";
import { EmailSchema } from "./email";
import { UrlSchema } from "./url";

export const SendRequestSchema = z.object({
  email: EmailSchema,
  url: UrlSchema.optional(),
});
