import { prisma } from "@/lib/prisma-client-inst";
import { ClientIdSchema } from "@/lib/schemas/client-id";
import { EmailSchema } from "@/lib/schemas/email";
import { NextRequest } from "next/server";
import { z } from "zod";

const RequestSchema = z
  .object({
    email: EmailSchema.optional(),
    clientId: ClientIdSchema.optional(),
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
