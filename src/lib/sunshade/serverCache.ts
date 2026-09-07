/**
 * A tiny in-process cache with request coalescing, for the upstream services
 * the analyzer leans on.
 *
 * Both of those services punish repetition. Overpass answers a second
 * identical query with HTTP 429 and stops talking to you for a while; the
 * Florida cadastral service answers a cold query in ~18 seconds. Edge caching
 * via `Cache-Control` handles repeat visitors, but it does nothing for the case
 * that actually bit during development: two identical requests arriving at the
 * same instant from one page load, neither of which is in any cache yet.
 *
 * So this does two things. It remembers recent answers for `ttlMs`, and — more
 * importantly — it keeps a map of IN-FLIGHT requests, so concurrent callers
 * asking for the same key all await the same upstream promise instead of each
 * starting their own.
 *
 * Deliberately not Redis or a KV store. This is per-instance and evaporates on
 * redeploy, which is the right trade for data whose real cache lives at the
 * edge — it exists to stop one page load from stampeding, not to be durable.
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class RequestCache<T> {
  private readonly entries = new Map<string, CacheEntry<T>>()
  private readonly inFlight = new Map<string, Promise<T>>()

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries = 200
  ) {}

  async fetch(key: string, load: () => Promise<T>): Promise<T> {
    const cached = this.entries.get(key)
    if (cached && cached.expiresAt > Date.now()) return cached.value

    const pending = this.inFlight.get(key)
    if (pending) return pending

    const promise = load()
      .then((value) => {
        this.store(key, value)
        return value
      })
      .finally(() => {
        this.inFlight.delete(key)
      })

    this.inFlight.set(key, promise)
    return promise
  }

  private store(key: string, value: T): void {
    // Insertion-ordered eviction. A serverless instance handles few enough
    // distinct properties that a true LRU would not earn its complexity.
    if (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next().value
      if (oldest !== undefined) this.entries.delete(oldest)
    }
    this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs })
  }
}
