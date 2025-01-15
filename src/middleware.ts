import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  handleRateLimiting,
  redirectToPage,
  validateApiKey,
} from "./lib/middleware-utils";

const PROTECTED_ROUTES = ["/dashboard"];
const RATE_LIMIT_ROUTES = ["/api"];

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/((?!api/auth|api/key|api/user).*)",
  ],
};

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;
  const isTwoFactorAuthed = !!req.auth?.twoFactorAuthed;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/key") ||
    pathname.startsWith("/api/user")
  ) {
    return NextResponse.next();
  }

  if (RATE_LIMIT_ROUTES.some((route) => pathname.startsWith(route))) {
    return await handleRateLimiting(req);
  }

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

  if (
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
    !isAuthed
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});
