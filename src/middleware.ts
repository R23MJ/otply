import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PROTECTED_ROUTES } from "./lib/constants";
import { headers } from "next/headers";

export default auth(async (req) => {
  const isAuthed = !!req.auth;
  const isTwoFactorAuthed = !!req.auth?.twoFactorAuthed;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (
    req.nextUrl.pathname.includes("/api/otp") ||
    req.nextUrl.pathname.includes("/api/totp")
  ) {
    const headersList = await headers();
    const auth_header = headersList.get("Authorization");

    if (!auth_header) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing" }),
        {
          status: 401,
        }
      );
    }

    const otply_api_key = auth_header.split(" ")[1];

    if (!otply_api_key) {
      return new Response(JSON.stringify({ error: "API key missing" }), {
        status: 401,
      });
    }

    const data = await req.json();
    const { clientId } = data;

    const keyIsValid = await fetch(process.env.OTPLY_KEY_VERIFY_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: clientId,
        key: otply_api_key,
      }),
    });

    if (!keyIsValid) {
      return new Response(JSON.stringify({ error: "Invalid API key" }), {
        status: 401,
      });
    }

    return NextResponse.next();
  }

  if (req.nextUrl.pathname == "/sign-in") {
    if (isAuthed && isTwoFactorAuthed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (isAuthed && !isTwoFactorAuthed) {
      return NextResponse.redirect(new URL("/2fa", req.url));
    }
  }

  if (req.nextUrl.pathname == "/2fa") {
    if (isAuthed && isTwoFactorAuthed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (!isAuthed) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (isProtectedRoute && !isAuthed) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|api/key|_next/static|_next/image|favicon.ico).*)"],
};
