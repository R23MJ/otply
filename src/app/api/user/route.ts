import { CreateUserRequestSchema } from "@/lib/schemas/create-user-request";
import { createUser } from "@/lib/server-functions/create-user";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const { data, error } = CreateUserRequestSchema.safeParse(searchParams);

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }

  return await createUser(data);
}
