import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { PLAN_LIMITS } from "./constants";
import { z } from "zod";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// const timebasedLimiter = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(10, "1m"),
// });

const freePlanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(PLAN_LIMITS.free.rateLimit, "30 d"),
});

const standardPlanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(PLAN_LIMITS.standard.rateLimit, "30 d"),
});

const proPlanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(PLAN_LIMITS.pro.rateLimit, "30 d"),
});

const AuthHeaderSchema = z.object({
  clientId: z.string().cuid(),
  authorization: z
    .string()
    .regex(/^Bearer (.+)$/)
    .refine((val) => {
      return val.split(" ")[1]?.length > 0;
    })
    .transform((val) => val.split(" ")[1]),
});

export const validateApiKey = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  const clientId = req.headers.get("x-client-id");

  const { data, error } = AuthHeaderSchema.safeParse({
    clientId,
    authorization: authHeader,
  });

  if (error) return new Response("Unauthorized", { status: 401 });

  if (
    data.authorization === process.env.OTPLY_API_KEY &&
    data.clientId === process.env.OTPLY_CLIENT_ID
  )
    return NextResponse.next(); // This is an internal call, we do not want to validate the key

  const keyIsValid = await fetch(`${process.env.OTPLY_KEY_VERIFY_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OTPLY_API_KEY}`,
      "x-client-id": process.env.OTPLY_CLIENT_ID!,
    },
    body: JSON.stringify({ clientId: data.clientId, key: data.authorization }),
  });

  return keyIsValid
    ? NextResponse.next()
    : new Response("Unauthorized", { status: 401 });
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

const ClientIdSchema = z.object({
  clientId: z.string().cuid(),
});

export const handleRateLimiting = async (req: Request) => {
  const { data, error } = ClientIdSchema.safeParse(
    req.headers.get("x-client-id")
  );

  if (error) return new Response("Unauthorized", { status: 401 });

  let plan = "free";

  if (data.clientId !== process.env.OTPLY_CLIENT_ID) {
    const response = await fetch(
      `${process.env.OTPLY_URL}/api/user/?clientId=${data.clientId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OTPLY_API_KEY}`,
          "x-client-id": process.env.OTPLY_CLIENT_ID!,
        },
      }
    );
    if (!response.ok)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await response.json();

    plan = client.plan || "free";
  } else {
    plan = "pro";
  }

  let ratelimiter;
  if (plan === "standard") ratelimiter = standardPlanLimiter;
  else if (plan === "pro") ratelimiter = proPlanLimiter;
  else ratelimiter = freePlanLimiter;

  const { success, limit, reset } = await ratelimiter.limit(
    `ratelimit_${data.clientId}_${plan}`
  );
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded", limit, reset, remaining: 0 },
      { status: 429 }
    );
  }
};
