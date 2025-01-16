"use server";

import { prisma } from "../prisma-client-inst";
import bcrypt from "bcryptjs";

export async function verifyOTP(input: string, email: string) {
  const otp = await prisma.oTPCode.findUnique({
    where: {
      email: email,
    },
  });

  if (!otp) {
    return new Response(JSON.stringify({ error: "Invalid OTP" }), {
      status: 400,
    });
  }

  if (otp.expiresAt < new Date()) {
    await prisma.oTPCode.delete({
      where: {
        id: otp.id,
      },
    });

    return new Response(JSON.stringify({ error: "OTP expired" }), {
      status: 400,
    });
  }

  const isMatch = await bcrypt.compare(input, otp.code);

  if (isMatch) {
    await prisma.oTPCode.delete({
      where: {
        id: otp.id,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid OTP" }), {
    status: 400,
  });
}
