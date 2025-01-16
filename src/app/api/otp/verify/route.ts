import { EmailSchema } from "@/lib/schemas/email";
import { OtpSchema } from "@/lib/schemas/otp";
import { verifyOTP } from "@/lib/server-functions/verify-otp";
import { z } from "zod";

const RequestSchema = z.object({
  otp: OtpSchema,
  email: EmailSchema,
});

export async function POST(req: Request) {
  const { data, error } = RequestSchema.safeParse(req.body);

  if (error) {
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }

  return await verifyOTP(data.otp, data.email);
}
