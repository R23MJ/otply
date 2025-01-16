"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "./prisma-client-inst";

const SALT_ROUNDS = 10;
const API_KEY_PREFIX = "otply_";

function generateBytes(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateOTP(email: string) {
  const otp = generateBytes(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

  const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

  const existingOtp = await prisma.oTPCode.findUnique({
    where: {
      email: email,
    },
  });

  if (existingOtp) {
    await prisma.oTPCode.update({
      where: { email: email },
      data: {
        code: hashedOtp,
        expiresAt: expiresAt,
      },
    });

    return otp;
  }

  await prisma.oTPCode.create({
    data: {
      code: hashedOtp,
      expiresAt: expiresAt,
      email: email,
    },
  });

  return otp;
}

export async function generateAPIKey() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const apiKey = `${API_KEY_PREFIX}${generateBytes(32)}`;
  const hashedKey = await bcrypt.hash(apiKey, SALT_ROUNDS);

  console.log("hashedKey", hashedKey);
  await prisma.aPIKey.create({
    data: {
      key: hashedKey,
      userId: session.user.id,
    },
  });

  return apiKey;
}
