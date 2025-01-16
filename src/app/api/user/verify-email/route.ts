import { EmailSchema } from "@/lib/schemas/email";
import { OtpSchema } from "@/lib/schemas/otp";
import { z } from "zod";

const RequestSchema = z.object({
  email: EmailSchema,
  otp: OtpSchema,
});

export async function POST(req: Request) {
  const { data, error } = RequestSchema.safeParse(req.json());

  if (!data) {
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }
}
