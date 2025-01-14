import OtpEmailTemplate from "@/components/otp-email-template";
import { OTP_EMAIL_SUBJECT } from "@/lib/constants";
import { generateOTP } from "@/lib/server-utils";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from_email = process.env.RESEND_FROM_EMAIL;

export async function POST(req: Request) {
  if (!from_email) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }

  const data = await req.json();
  const { email } = data;

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  const otp = await generateOTP(email);

  try {
    const { error } = await resend.emails.send({
      from: from_email,
      to: email,
      subject: OTP_EMAIL_SUBJECT,
      react: OtpEmailTemplate({ otp: otp }),
    });

    if (error) {
      return new Response(JSON.stringify({ error: error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
