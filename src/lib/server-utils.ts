"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "./prisma-client-inst";

const SALT_ROUNDS = 10;
const API_KEY_PREFIX = "otply_";

function generateRandomInt(digits: number) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 1000000).toString().padStart(digits, "0");
}

function genKey(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateOTP(email: string) {
  const otp = generateRandomInt(6);
  const expiresAt = new Date(Date.now() + 1000 * 30);

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

export async function verifyOTP(input: string, email: string) {
  const otp = await prisma.oTPCode.findUnique({
    where: {
      email: email,
    },
  });

  if (!otp) {
    return false;
  }

  if (otp.expiresAt < new Date()) {
    await prisma.oTPCode.delete({
      where: {
        id: otp.id,
      },
    });

    return false;
  }

  const isMatch = await bcrypt.compare(input, otp.code);

  if (isMatch) {
    await prisma.oTPCode.delete({
      where: {
        id: otp.id,
      },
    });

    return true;
  }

  return false;
}

export async function generateAPIKey() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const apiKey = `${API_KEY_PREFIX}${genKey(32)}`;
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

export async function verifyAPIKey(apiKey: string, userId: string) {
  const keys = await prisma.aPIKey.findMany({
    where: {
      userId: userId,
    },
  });

  if (!keys) {
    return false;
  }

  const isMatch = keys.some(async (key) => {
    return await bcrypt.compare(apiKey, key.key);
  });

  return isMatch;
}
