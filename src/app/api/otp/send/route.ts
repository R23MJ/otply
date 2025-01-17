import VerifyEmailTemplate from "@/components/email-templates/verify";
import { SendRequestSchema } from "@/lib/schemas/send-request";
import { SendOtpEmail } from "@/lib/server-functions/send-otp-email";

export async function POST(req: Request) {
  const { data, error } = SendRequestSchema.safeParse(req.json());

  if (error) {
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }

  return await SendOtpEmail(data.email, VerifyEmailTemplate, data.url);
}
