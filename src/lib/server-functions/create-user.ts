"use server";

import { z } from "zod";
import { prisma } from "../prisma-client-inst";
import { CreateUserRequestSchema } from "../schemas/create-user-request";

export async function createUser({
  email,
  clientId,
}: z.infer<typeof CreateUserRequestSchema>) {
  const user = await prisma.user.findUnique({
    where: email ? { email: email } : { id: clientId },
  });

  if (!user) {
    return new Response("User not found", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
  });
}
