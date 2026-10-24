import { NextRequest, NextResponse } from 'next/server'
import {
  CURRENT_CONSENT_VERSION,
  formatConsentLine,
  NO_PHONE_CONSENT_TAG,
  PHONE_CONSENT_TAG,
} from '@/lib/consent'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { isValidAddress, isValidEmail, isValidName, splitName } from '@/lib/sellerLeadHelpers'

// Lead capture for the mailed seller postcard (/value). Separate from
// /api/seller-leads: that route is routed to an agent and requires a timeline;
// a postcard scan has neither, and its source/system/tags are how Follow Up Boss
// tells a card response apart from a /sell visitor.

const FUB_EVENTS_URL = 'https://api.followupboss.com/v1/events'

const MAX_BODY_BYTES = 8 * 1024
// A homeowner submits once, maybe twice after a typo. Five per 15 minutes per IP
// leaves room for a shared office or carrier-grade NAT without helping a bot.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 15 * 60 * 1000

interface ValueLeadBody {
  name?: unknown
  email?: unknown
  phone?: unknown
  address?: unknown
  payoff?: unknown
  honeypot?: unknown
  phoneConsent?: unknown
  sourcePageUrl?: unknown
  utmSource?: unknown
  utmMedium?: unknown
  utmCampaign?: unknown
  utmContent?: unknown
  utmTerm?: unknown
}

/**
 * Single-line text: control characters and newlines become spaces, runs of
 * whitespace collapse. Newlines matter because these values are written into
 * the multi-line CRM note, where a line break in the address could forge a
 * line such as the consent record.
 *
 * Returns undefined when absent/empty, null when invalid (wrong type, or longer
 * than `max` — rejected rather than truncated so an over-long email can never
 * be silently cut into a different, valid-looking address).
 */
function clean(value: unknown, max: number): string | undefined | null {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value !== 'string') return null
  const text = value
    .replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return undefined
  return text.length > max ? null : text
}

/** Same cleaning, but over-long or non-string input is dropped, not rejected. */
function optional(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = clean(value, 10_000)
  return text ? text.slice(0, max) : undefined
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15 && /^[\d\s()+.\-x]+$/i.test(phone)
}

const OWN_HOSTS = /(^|\.)doyouneedahome\.com$/
const DEV_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/** Only accept the page URL if it is this site's own /value page. */
function safePageUrl(value: unknown): URL | undefined {
  const raw = optional(value, 500)
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined
    if (url.pathname !== '/value') return undefined
    if (!OWN_HOSTS.test(url.hostname) && !DEV_HOSTS.has(url.hostname)) return undefined
    return url
  } catch {
    return undefined
  }
}

/**
 * Dry-run mode builds the Follow Up Boss payload and returns it instead of
 * sending it. Enabled by DRY_RUN=true in the environment or an
 * `x-dry-run: true` request header, and always ignored in the Vercel
 * production environment so a stray env var or header can never swallow real
 * leads there.
 */
function isDryRun(req: NextRequest): boolean {
  const requested = process.env.DRY_RUN === 'true' || req.headers.get('x-dry-run') === 'true'
  if (!requested) return false
  if (process.env.VERCEL_ENV === 'production') {
    console.error('[value-lead] DRY_RUN requested in production — ignored')
    return false
  }
  return true
}

interface UndeliveredLead {
  name: string
  email: string
  phone?: string
  address: string
  phoneConsent?: boolean
}

/**
 * Last-resort record when the lead could not be delivered to Follow Up Boss, so
 * it can be recovered from the server logs and followed up by hand. Carries the
 * contact details and call/text consent only: never the API key, request
 * headers, or the mortgage balance.
 */
function logUndelivered(reason: string, lead: UndeliveredLead) {
  console.error(
    '[value-lead] UNDELIVERED LEAD — follow up manually',
    JSON.stringify({ reason, at: new Date().toISOString(), ...lead })
  )
}

const bad = (status: number, error: string, headers?: Record<string, string>) =>
  NextResponse.json({ error }, { status, headers })

export async function POST(req: NextRequest) {
  const dryRun = isDryRun(req)

  if (!(req.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    return bad(415, 'Expected application/json')
  }

  if (!dryRun) {
    const limit = rateLimit(`value-lead:${clientIp(req.headers)}`, RATE_LIMIT, RATE_WINDOW_MS)
    if (!limit.allowed) {
      return bad(429, 'Too many requests', { 'Retry-After': String(limit.retryAfter) })
    }
  }

  // Read as text so the size cap applies to what was actually sent, not to a
  // Content-Length header the client controls.
  let raw: string
  try {
    raw = await req.text()
  } catch {
    return bad(400, 'Invalid request')
  }
  if (raw.length > MAX_BODY_BYTES) return bad(413, 'Request too large')

  let body: ValueLeadBody
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object')
    body = parsed as ValueLeadBody
  } catch {
    return bad(400, 'Invalid request')
  }

  // Honeypot — bots that fill the hidden field get a fake success so they don't
  // learn the submission was rejected. Nothing is sent to FUB, and nothing the
  // bot typed is logged.
  if (typeof body.honeypot === 'string' ? body.honeypot.trim() : body.honeypot) {
    console.warn('[value-lead] blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, 80)
  const email = clean(body.email, 200)
  const address = clean(body.address, 200)
  const phone = clean(body.phone, 30)

  if (!name || !isValidName(name)) return bad(400, 'Invalid submission')
  if (!email || !isValidEmail(email)) return bad(400, 'Invalid submission')
  if (!address || !isValidAddress(address)) return bad(400, 'Invalid submission')
  if (phone === null || (phone && !isValidPhone(phone))) return bad(400, 'Invalid submission')
  if (body.phoneConsent !== undefined && typeof body.phoneConsent !== 'boolean') {
    return bad(400, 'Invalid submission')
  }

  // Not critical to the lead, so over-long values are trimmed rather than rejected.
  const payoff = optional(body.payoff, 60)

  // true = ticked, false = gave a number but did not tick, undefined = no number.
  const phoneConsent = phone ? body.phoneConsent === true : undefined
  const pageUrl = safePageUrl(body.sourcePageUrl)
  const capturedAt = new Date().toISOString()

  // UTM values come from the client's explicit fields first (which include
  // first-touch values saved earlier in the session) and fall back to the page
  // URL's own query string.
  const fromUrl = (key: string) => optional(pageUrl?.searchParams.get(key) ?? undefined, 100)
  const utm = {
    source: optional(body.utmSource, 100) ?? fromUrl('utm_source'),
    medium: optional(body.utmMedium, 100) ?? fromUrl('utm_medium'),
    campaign: optional(body.utmCampaign, 100) ?? fromUrl('utm_campaign'),
    content: optional(body.utmContent, 100) ?? fromUrl('utm_content'),
    term: optional(body.utmTerm, 100) ?? fromUrl('utm_term'),
  }
  const hasUtm = Object.values(utm).some(Boolean)

  const { firstName, lastName } = splitName(name)

  const tags = ['Hand-Raiser', 'Seller Prospect', 'Seller Card']
  if (phoneConsent === false) tags.push(NO_PHONE_CONSENT_TAG)
  if (phoneConsent === true) tags.push(PHONE_CONSENT_TAG)

  const message = [
    `Scanned the seller postcard and asked for a home value review of: ${address}`,
    payoff ? `Approximate mortgage balance (for net proceeds): ${payoff}` : 'Mortgage balance: not provided',
    `Phone/text consent: ${phoneConsent === true ? 'yes' : 'no'}${phone ? '' : ' (no phone provided)'}`,
    formatConsentLine(CURRENT_CONSENT_VERSION, phoneConsent, capturedAt),
  ]
    .filter(Boolean)
    .join('\n')

  const fubBody = {
    source: 'Seller Card QR',
    system: 'DYNAH Value Page',
    type: 'Seller Inquiry',
    message,
    ...(pageUrl ? { pageUrl: pageUrl.toString() } : {}),
    property: { street: address },
    person: {
      firstName,
      ...(lastName ? { lastName } : {}),
      emails: [{ value: email }],
      phones: phone ? [{ value: phone, type: 'mobile' }] : [],
      addresses: [{ type: 'home', street: address }],
      tags,
    },
    ...(hasUtm ? { campaign: utm } : {}),
  }

  const apiKey = process.env.FUB_API_KEY
  const systemKey = process.env.FUB_SYSTEM_KEY

  if (dryRun) {
    // Everything except the secrets: the key and system key are shown only as
    // "set / not set".
    return NextResponse.json({
      dryRun: true,
      sent: false,
      fubRequest: {
        method: 'POST',
        url: FUB_EVENTS_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey ? 'Basic <base64(FUB_API_KEY:) — redacted>' : '<FUB_API_KEY not set>',
          'X-System': 'DYNAH',
          ...(systemKey ? { 'X-System-Key': '<FUB_SYSTEM_KEY — redacted>' } : {}),
        },
        body: fubBody,
      },
    })
  }

  const lead: UndeliveredLead = { name, email, phone, address, phoneConsent }

  if (!apiKey) {
    // Local development without the key: log the lead so the flow is testable.
    // Anywhere deployed must be configured — a seller lead must never be
    // dropped silently.
    if (process.env.NODE_ENV === 'production') {
      logUndelivered('FUB_API_KEY is not set', lead)
      return bad(500, 'Server misconfiguration')
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Value lead:', {
      name,
      email,
      address,
      phoneConsent,
    })
    return NextResponse.json({ ok: true })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    'X-System': 'DYNAH',
  }
  if (systemKey) headers['X-System-Key'] = systemKey

  try {
    const res = await fetch(FUB_EVENTS_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(fubBody),
      signal: AbortSignal.timeout(10_000),
    })

    if (res.status !== 200 && res.status !== 201) {
      // Status and a slice of FUB's reply only — never the request headers,
      // which carry the key.
      const text = await res.text().catch(() => '')
      console.error(`[value-lead] FUB responded ${res.status}`, text.slice(0, 500))
      logUndelivered(`FUB responded ${res.status}`, lead)
      return bad(502, 'Lead submission failed')
    }
  } catch (err) {
    const reason = err instanceof Error ? err.name : 'unknown error'
    console.error('[value-lead] FUB request threw', reason)
    logUndelivered(`FUB request failed: ${reason}`, lead)
    return bad(502, 'Lead submission failed')
  }

  return NextResponse.json({ ok: true })
}
