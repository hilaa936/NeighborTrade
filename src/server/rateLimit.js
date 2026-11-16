import { ApiError } from "./errors";

// In-memory fixed-window limiter. Good enough for one server instance;
// on a multi-instance host (e.g. Vercel) swap the store for Redis/Upstash.
const buckets = new Map();

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > limit) throw new ApiError(429, "rate_limited");
}

export const clientIp = (request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

// Drop expired buckets now and then so the map does not grow forever
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
}, 60_000).unref?.();
