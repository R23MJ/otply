"use server";

import { z } from "zod";
import { prisma } from "./prisma-client-inst";
import bcrypt from "bcryptjs";
import { CredentialsSchema } from "./schemas/credentials";

export async function Register({
  username,
  password,
}: z.infer<typeof CredentialsSchema>) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.findUnique({
    where: { email: username.toLowerCase() },
  });

  if (user) {
    return new Response(
      JSON.stringify({
        errors: { "Failed to register": ["User already exists"] },
      }),
      { status: 400 }
    );
  }

  const newUser = await prisma.user.create({
    data: {
      email: username.toLowerCase(),
      password: hashedPassword,
    },
  });

  return new Response(JSON.stringify(newUser), { status: 201 });
}
