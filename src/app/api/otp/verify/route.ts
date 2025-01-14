import { verifyOTP } from "@/lib/server-utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const data = await req.json();
  const { otp, email } = data;

  if (!otp) {
    console.log("OTP is required");
    return new Response(JSON.stringify({ error: "OTP is required" }), {
      status: 400,
    });
  }

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  const isValid = await verifyOTP(otp, email);

  if (!isValid) {
    console.log("Invalid OTP");
    return new Response(JSON.stringify({ error: "Invalid OTP" }), {
      status: 400,
    });
  }

  console.log("OTP Verified");
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
