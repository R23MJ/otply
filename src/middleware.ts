import { auth } from "@/auth";
import { NextResponse } from "next/server";

const validateApiKey = async (req: Request) => {
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

const redirectToPage = (
  req: Request,
  pathname: string,
  isAuthed: boolean,
  isTwoFactorAuthed: boolean
) => {
  if (pathname === "/sign-in") {
    if (isAuthed) {
      return isTwoFactorAuthed
        ? NextResponse.redirect(new URL("/dashboard", req.url))
        : NextResponse.redirect(new URL("/2fa", req.url));
    }
  }

  if (pathname === "/2fa" && !isAuthed) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (pathname === "/2fa" && isAuthed && isTwoFactorAuthed) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return null;
};

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;
  const isTwoFactorAuthed = !!req.auth?.twoFactorAuthed;
  const isProtectedRoute = pathname.includes("/dashboard");

  if (pathname.includes("/api/otp") || pathname.includes("/api/totp")) {
    return validateApiKey(req);
  }

  const redirectResponse = redirectToPage(
    req,
    pathname,
    isAuthed,
    isTwoFactorAuthed
  );
  if (redirectResponse) return redirectResponse;

  if (isProtectedRoute && !isAuthed) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|api/key|_next/static|_next/image|favicon.ico).*)"],
};
