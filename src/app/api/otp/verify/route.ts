import { EmailSchema } from "@/lib/schemas/email";
import { OtpSchema } from "@/lib/schemas/otp";
import { verifyOTP } from "@/lib/server-utils";
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

  const isValid = await verifyOTP(data.otp, data.email);

  if (!isValid) {
    console.log("Invalid OTP");
    return new Response(JSON.stringify({ error: "Invalid OTP" }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
