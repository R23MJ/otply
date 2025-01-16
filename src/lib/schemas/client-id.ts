import { z } from "zod";

export const ClientIdSchema = z.string().trim().cuid();
