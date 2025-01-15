import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const freePlanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "30 d"),
});

const standardPlanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "30 d"),
});

const proPlanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "30 d"),
});

export const validateApiKey = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader)
    return new Response("Authorization header missing", { status: 401 });

  const otplyApiKey = authHeader.split(" ")[1];
  if (!otplyApiKey) return new Response("API key missing", { status: 401 });

  const { clientId } = await req.json();
  const keyIsValid = await fetch(`${process.env.OTPLY_KEY_VERIFY_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, key: otplyApiKey }),
  });

  return keyIsValid
    ? NextResponse.next()
    : new Response("Invalid API key", { status: 401 });
};

export const redirectToPage = (
  req: Request,
  pathname: string,
  isAuthed: boolean,
  isTwoFactorAuthed: boolean
) => {
  if (pathname === "/sign-in" && isAuthed) {
    return isTwoFactorAuthed
      ? NextResponse.redirect(new URL("/dashboard", req.url))
      : NextResponse.redirect(new URL("/2fa", req.url));
  }

  if (pathname === "/2fa" && !isAuthed) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (pathname === "/2fa" && isAuthed && isTwoFactorAuthed) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return null;
};

export const handleRateLimiting = async (req: Request) => {
  const clientId = req.headers.get("x-client-id");
  if (!clientId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const response = await fetch(
    `${process.env.OTPLY_URL}/api/user/?clientId=${clientId}`
  );
  if (!response.ok)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await response.json();

  const plan = client.plan || "free";

  let ratelimiter;
  if (plan === "standard") ratelimiter = standardPlanLimiter;
  else if (plan === "pro") ratelimiter = proPlanLimiter;
  else ratelimiter = freePlanLimiter;

  const { success, limit, reset } = await ratelimiter.limit(
    `ratelimit_${clientId}`
  );
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded", limit, reset, remaining: 0 },
      { status: 429 }
    );
  }
};
