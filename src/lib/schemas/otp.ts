import { z } from "zod";

export const OtpSchema = z.string().trim().length(64);
