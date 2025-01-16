import { verifyAPIKey } from "@/lib/server-utils";
import { z } from "zod";

const RequestSchema = z.object({
  clientId: z.string().trim().cuid(),
  key: z.string().trim().startsWith("otply_"),
});

export async function POST(req: Request) {
  const { data, error } = RequestSchema.safeParse(req.json());

  if (error) {
    return new Response(
      JSON.stringify({ errors: error.flatten().fieldErrors }),
      {
        status: 400,
      }
    );
  }

  const keyIsValid = await verifyAPIKey(data.key, data.clientId);

  if (!keyIsValid) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
