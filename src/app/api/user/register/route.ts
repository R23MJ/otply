import { Register } from "@/lib/register";
import { RegisterSchema } from "@/lib/schemas";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { data, error } = RegisterSchema.safeParse(req.json());

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
