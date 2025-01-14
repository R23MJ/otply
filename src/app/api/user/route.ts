import { prisma } from "@/lib/prisma-client-inst";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  const { email } = req.query;

  if (!email) {
    return new Response("Email is required", {
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
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
