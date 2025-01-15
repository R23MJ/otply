import { prisma } from "@/lib/prisma-client-inst";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const clientId = req.nextUrl.searchParams.get("clientId");

  if (!email && !clientId) {
    return new Response("Email or clientId is required", {
      status: 400,
    });
  }

  let user;
  if (email) {
    user = await prisma.user.findUnique({
      where: { email: email as string },
    });
  } else if (clientId) {
    user = await prisma.user.findUnique({
      where: { id: clientId as string },
    });
  }

  if (!user) {
    return new Response("User not found", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
  });
}
