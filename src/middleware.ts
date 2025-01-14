import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirectToPage } from "./lib/middleware-utils";

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;
  // const isTwoFactorAuthed = !!req.auth?.twoFactorAuthed;
  const isProtectedRoute = pathname.includes("/dashboard");

  const redirectResponse = redirectToPage(
    req,
    pathname,
    isAuthed
    // isTwoFactorAuthed
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
