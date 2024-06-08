// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import path from "path";

const redis = new Redis({
  url: process.env.REDIS_URL_ONLY,
  token: process.env.REDIS_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "10 s"),
});

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // const { user } = await validateRequest();

  if (request.url.includes("/verify-email")) {
    const ip = request.ip ?? "127.0.0.1";
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
    return success
      ? NextResponse.next()
      : NextResponse.json({ error: "too many requests", code: 420 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)", "/api/:path*"],
};
