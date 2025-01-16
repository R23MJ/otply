import { Register } from "@/lib/register";
import { CredentialsSchema } from "@/lib/schemas/credentials";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { data, error } = CredentialsSchema.safeParse(req.json());

  if (!data) {
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }

  return Register(data);
}
