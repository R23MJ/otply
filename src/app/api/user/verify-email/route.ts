import { prisma } from "@/lib/prisma-client-inst";
import { EmailSchema } from "@/lib/schemas/email";
import { OtpSchema } from "@/lib/schemas/otp";
import { verifyOTP } from "@/lib/server-functions/verify-otp";
import { NextRequest } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  email: EmailSchema,
  otp: OtpSchema,
});

export async function GET(req: NextRequest) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const { data, error } = RequestSchema.safeParse(searchParams);

  if (!data) {
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }

  const response = await verifyOTP(data.otp, data.email);

  if (response.ok) {
    await prisma.user.update({
      where: { email: data.email },
      data: {
        emailVerified: true,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return response;
}
