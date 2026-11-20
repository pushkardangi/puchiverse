import "server-only";

type Bucket = { count: number; resetAt: number };

declare global {
  var rateLimitBuckets: Map<string, Bucket> | undefined;
}

const buckets = (globalThis.rateLimitBuckets ??= new Map<string, Bucket>());

export type RateLimit = { limit: number; windowMs: number };

export const SEARCH_RATE_LIMIT: RateLimit = { limit: 10, windowMs: 60_000 };
export const REQUEST_RATE_LIMIT: RateLimit = { limit: 10, windowMs: 60_000 };

// Fixed-window limiter kept in process memory: it is per server instance, so a
// shared store is required for strict limits across multiple instances.
export function checkRateLimit(key: string, { limit, windowMs }: RateLimit, now = Date.now()) {
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}
