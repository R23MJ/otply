"use server";

import { Resend } from "resend";
import { generateOTP } from "../server-utils";
import { OTP_EMAIL_SUBJECT } from "../constants";
import OtpEmailTemplate from "@/components/otp-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const from_email = process.env.RESEND_FROM_EMAIL;

export async function SendOtpEmail(email: string, url?: string) {
  const otp = await generateOTP(email);

  if (process.env.NODE_ENV === "development") {
    console.log(`OTP for ${email}: ${otp}`);
    return new Response(JSON.stringify({ otp: otp, url: url || null }), {
      status: 200,
    });
  }

  try {
    const { error } = await resend.emails.send({
      from: from_email!,
      to: email,
      subject: OTP_EMAIL_SUBJECT,
      react: OtpEmailTemplate({ otp: otp, url: url || null }),
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
