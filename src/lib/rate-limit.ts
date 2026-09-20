/**
 * In-memory fixed-window rate limiter.
 *
 * Scope: one Node process. On a single server (or a single warm serverless
 * instance) this is exact; across several instances each one keeps its own
 * counters, so the effective limit is `limit × instances`. That is still a
 * useful ceiling on abuse and costs nothing to run. If traffic ever justifies
 * it, swap the `Map` here for a shared store (Upstash/Redis) — every caller
 * goes through `rateLimit()`, so nothing else changes.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bound the map so a flood of unique keys (spoofed IPs, random cookies) can't
// grow it forever. Pruning is done inline every so often rather than on a
// timer, which keeps the module free of side effects at import time.
const MAX_BUCKETS = 50_000;
const PRUNE_EVERY = 500;
let opsSincePrune = 0;

function prune(now: number) {
  opsSincePrune = 0;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Still too big after dropping expired entries: evict oldest-inserted.
  if (buckets.size > MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS;
    let i = 0;
    for (const key of buckets.keys()) {
      if (i++ >= excess) break;
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

/**
 * Count one hit against `key` and report whether it is still within `limit`
 * for the current `windowMs` window.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (++opsSincePrune >= PRUNE_EVERY) prune(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const ok = bucket.count <= limit;
  return {
    ok,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/** Apply several limits at once (e.g. per-minute and per-day); the first one exceeded wins. */
export function rateLimitAll(
  rules: Array<{ key: string; limit: number; windowMs: number }>,
): RateLimitResult {
  let result: RateLimitResult = { ok: true, limit: 0, remaining: 0, retryAfter: 0 };
  for (const rule of rules) {
    result = rateLimit(rule.key, rule.limit, rule.windowMs);
    if (!result.ok) return result;
  }
  return result;
}

/** Backwards-compatible boolean form used by the older form routes. */
export function withinRateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  return rateLimit(key, limit, windowMs).ok;
}

/**
 * Best-effort client IP.
 *
 * `x-forwarded-for` can be set by the client, so it is only trusted when the
 * app sits behind a proxy that overwrites it (Vercel, nginx with
 * `proxy_set_header`, Cloudflare). Platform-set headers are preferred when
 * present since the client cannot forge those.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const direct =
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-vercel-forwarded-for');
  if (direct) return direct.trim();

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // Proxies append; the entry they added is the last one, and that is the
    // only hop we can vouch for.
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return 'unknown';
}

/** A 429 with the standard headers so clients can back off correctly. */
export function tooManyRequests(result: RateLimitResult, message = 'Too many requests. Please try again shortly.') {
  return Response.json(
    { error: message },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    },
  );
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
export const WINDOW = { MINUTE, HOUR, DAY } as const;
