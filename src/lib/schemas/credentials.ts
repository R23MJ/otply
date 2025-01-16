import { z } from "zod";
import { EmailSchema } from "./email";
import { PasswordSchema } from "./password";

export const CredentialsSchema = z.object({
  username: EmailSchema,
  password: PasswordSchema,
});
