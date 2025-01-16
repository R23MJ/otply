import { z } from "zod";
import { EmailSchema } from "./email";
import { ClientIdSchema } from "./client-id";

export const CreateUserRequestSchema = z
  .object({
    email: EmailSchema.optional(),
    clientId: ClientIdSchema.optional(),
  })
  .refine(
    (data) => {
      return !!data.email || !!data.clientId;
    },
    {
      message: "No search parameters provided",
      path: ["email", "clientId"],
    }
  );
