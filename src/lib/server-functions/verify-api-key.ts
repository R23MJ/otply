"use server";

import { prisma } from "../prisma-client-inst";
import bcrypt from "bcryptjs";

export async function verifyAPIKey(apiKey: string, userId: string) {
  const keys = await prisma.aPIKey.findMany({
    where: {
      userId: userId,
    },
  });

  if (!keys) {
    return new Response(JSON.stringify({ error: "Invalid API Key" }), {
      status: 400,
    });
  }

  const isMatch = keys.some(async (key) => {
    return await bcrypt.compare(apiKey, key.key);
  });

  if (isMatch) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid API Key" }), {
    status: 400,
  });
}
