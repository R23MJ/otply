import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;
  const isProtectedRoute = pathname.includes("/dashboard");

  if (isProtectedRoute && !isAuthed) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|api/key|_next/static|_next/image|favicon.ico).*)"],
};
