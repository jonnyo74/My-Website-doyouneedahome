// Minimal in-memory sliding-window rate limiter.
//
// LIMITS ON SERVERLESS: state lives in one function instance's memory. Each
// warm instance counts separately, a cold start resets the count, and
// concurrent instances (or other regions) don't share it. So this stops a
// single client hammering one instance, but it is a speed bump, not a hard
// quota. A hard limit needs shared storage (Redis/KV) or a Vercel Firewall
// rate-limit rule; neither is configured in this repo.

const hits = new Map<string, number[]>()
const MAX_TRACKED_KEYS = 5000

export interface RateLimitResult {
  allowed: boolean
  /** Seconds until the oldest hit in the window expires. 0 when allowed. */
  retryAfter: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)

  if (recent.length >= limit) {
    hits.set(key, recent)
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) }
  }

  recent.push(now)
  hits.set(key, recent)

  // Bound memory: when the map gets large, drop every key whose hits have all
  // expired, then the oldest keys if it is still over the cap.
  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k)
    }
    while (hits.size > MAX_TRACKED_KEYS) {
      const oldest = hits.keys().next().value
      if (oldest === undefined) break
      hits.delete(oldest)
    }
  }
  return { allowed: true, retryAfter: 0 }
}

/**
 * Client IP as set by the platform proxy. On Vercel, x-forwarded-for is
 * overwritten at the edge, so its first entry is the real client; elsewhere it
 * can be spoofed, which only makes the limit easier to dodge, not unsafe.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || 'unknown'
}
