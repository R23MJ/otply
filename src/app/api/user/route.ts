import { prisma } from "@/lib/prisma-client-inst";
import { NextRequest } from "next/server";
import { z } from "zod";

const RequestSchema = z
  .object({
    email: z.string().trim().email().optional(),
    clientId: z.string().trim().cuid().optional(),
  })
  .refine(
    (data) => {
      return !!data.email || !!data.clientId;
    },
    {
      message: "No search parameters provided",
      path: ["email", "clientId"],
    }
  );

export async function GET(req: NextRequest) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const { data, error } = RequestSchema.safeParse(searchParams);

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: data.email ? { email: data.email } : { id: data.clientId },
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
