import { ApiKeySchema } from "@/lib/schemas/api-key";
import { ClientIdSchema } from "@/lib/schemas/client-id";
import { verifyAPIKey } from "@/lib/server-utils";
import { z } from "zod";

const RequestSchema = z.object({
  clientId: ClientIdSchema,
  key: ApiKeySchema,
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
