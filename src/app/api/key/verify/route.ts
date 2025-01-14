import { verifyAPIKey } from "@/lib/server-utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const data = await req.json();
  const { clientId, key } = data;

  if (!clientId || !key) {
    return new Response(
      JSON.stringify({ error: "Client ID and key are required" }),
      {
        status: 400,
      }
    );
  }

  if (!key.startsWith("otply_")) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401,
    });
  }

  const keyIsValid = await verifyAPIKey(key, clientId);

  if (!keyIsValid) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
