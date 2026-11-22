// What the 404 beacon is allowed to put in the server log.
//
// The values arrive from a browser, so they are treated as untrusted text:
// length-capped, stripped of control characters (a newline would let a request
// forge extra log lines), and cut back to origin + path so query strings, which
// can carry email addresses or tokens, never reach the log.

const MAX = 300

function clean(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, MAX)
}

/** "/old-page?x=1#y" → "/old-page". Empty string if it is not a site path. */
export function cleanPath(value: unknown): string {
  const text = clean(value)
  if (!text.startsWith('/') || text.startsWith('//')) return ''
  return text.split(/[?#]/)[0]
}

/** A full referrer URL → "https://example.com/their-page". Empty if absent or malformed. */
export function cleanReferrer(value: unknown): string {
  const text = clean(value)
  if (!text) return ''
  try {
    const url = new URL(text)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
    return `${url.origin}${url.pathname}`.slice(0, MAX)
  } catch {
    return ''
  }
}

/**
 * One greppable line per dead URL. Filter Vercel's runtime logs on "[404]";
 * a line with a referrer on another domain is an inbound link to redirect.
 */
export function formatNotFoundLog(path: string, referrer: string): string {
  return `[404] path=${path} referrer=${referrer || '(none)'}`
}
