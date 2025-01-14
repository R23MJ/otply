import { NextResponse } from "next/server";

export const validateApiKey = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader)
    return new Response(
      JSON.stringify({ error: "Authorization header missing" }),
      { status: 401 }
    );

  const otplyApiKey = authHeader.split(" ")[1];
  if (!otplyApiKey)
    return new Response(JSON.stringify({ error: "API key missing" }), {
      status: 401,
    });

  const { clientId } = await req.json();
  const keyIsValid = await fetch(`${process.env.OTPLY_KEY_VERIFY_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, key: otplyApiKey }),
  });

  return keyIsValid
    ? NextResponse.next()
    : new Response(JSON.stringify({ error: "Invalid API key" }), {
        status: 401,
      });
};

export const redirectToPage = (
  req: Request,
  pathname: string,
  isAuthed: boolean
) => {
  if (pathname === "/sign-in") {
    return isAuthed
      ? NextResponse.redirect(new URL("/dashboard", req.url))
      : null;
  }

  return null;
};
