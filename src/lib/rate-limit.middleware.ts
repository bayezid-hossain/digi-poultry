import { TRPCError } from "@trpc/server";
import { redis } from "@/lib/redis";
import { Session } from "lucia";
type WindowType = "seconds" | "minutes" | "hours" | "days" | "weeks";
export type RateLimitConfig = {
  maxRequests: number;
  per: [number, WindowType];
  uniqueId: string;
  enabled?: boolean;
};
export type RateLimitOptions = Record<string, RateLimitConfig>;

function convertToSeconds(amount: number, type: WindowType): number {
  switch (type) {
    case "seconds":
      return amount;
    case "minutes":
      return amount * 60;
    case "hours":
      return amount * 60 * 60;
    case "days":
      return amount * 60 * 60 * 24;
    case "weeks":
      return amount * 60 * 60 * 24 * 7;
    default:
      return amount;
  }
}

export async function rateLimitMiddleware(session: Session, args: RateLimitConfig): Promise<void> {
  if (args.enabled === false) {
    return;
  }

  const [window, windowType] = args.per;
  const key = `rate-limit:${args.uniqueId}:${session.id}`;
  const current = Number(await redis.get(key));

  if (current >= args.maxRequests) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests, calm down",
    });
  }

  const windowInSeconds = convertToSeconds(window, windowType);

  const pipeline = redis.pipeline();
  pipeline.incr(key);
  if (current === 0) {
    pipeline.expire(key, windowInSeconds);
  }

  void pipeline.exec();
}
