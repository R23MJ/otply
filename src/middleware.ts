import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirectToPage, validateApiKey } from "./lib/middleware-utils";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const PROTECTED_ROUTES = ["/dashboard"];
const RATE_LIMIT_ROUTES = ["/api"];

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 m"),
});

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;
  const isTwoFactorAuthed = !!req.auth?.twoFactorAuthed;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isRateLimitRoute = RATE_LIMIT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isRateLimitRoute) {
    const clientId = req.headers.get("x-client-id");

    if (!clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success, limit, reset } = await ratelimiter.limit(
      `ratelimit_${clientId}`
    );

    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          limit,
          reset: reset,
          remaining: 0,
        },
        { status: 429 }
      );
    }
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

  if (isProtectedRoute && !isAuthed) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|api/key|_next/static|_next/image|favicon.ico).*)"],
};
