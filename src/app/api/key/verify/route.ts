import { ApiKeySchema } from "@/lib/schemas/api-key";
import { ClientIdSchema } from "@/lib/schemas/client-id";
import { verifyAPIKey } from "@/lib/server-functions/verify-api-key";
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

  return await verifyAPIKey(data.key, data.clientId);
}
