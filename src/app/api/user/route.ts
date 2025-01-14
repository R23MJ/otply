import { prisma } from "@/lib/prisma-client-inst";

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || req.headers.get("referer");

  console.log("origin", origin);

  if (origin?.includes(`${process.env.OTPLY_URL}`)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const data = await req.json();
  const { username } = data;

  const user = await prisma.user.findUnique({
    where: {
      email: username,
    },
  });

  return new Response(JSON.stringify(user), {
    status: 200,
  });
}
