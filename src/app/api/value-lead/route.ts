import { NextRequest, NextResponse } from 'next/server'
import {
  CURRENT_CONSENT_VERSION,
  formatConsentLine,
  NO_PHONE_CONSENT_TAG,
  PHONE_CONSENT_TAG,
} from '@/lib/consent'
import { isValidAddress, isValidEmail, isValidName, splitName } from '@/lib/sellerLeadHelpers'

// Lead capture for the mailed seller postcard (/value). Separate from
// /api/seller-leads: that route is routed to an agent and requires a timeline;
// a postcard scan has neither, and its source/system/tags are how Follow Up Boss
// tells a card response apart from a /sell visitor.

const FUB_EVENTS_URL = 'https://api.followupboss.com/v1/events'

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

/** Trimmed string, capped so a hostile client can't push an essay into the CRM. */
function str(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().slice(0, max)
  return trimmed || undefined
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15 && /^[\d\s()+.\-x]+$/i.test(phone)
}

/** Only accept the page URL if it is actually this site's /value page. */
function safePageUrl(value: unknown): string | undefined {
  const raw = str(value, 500)
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    if (url.pathname !== '/value') return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

export async function POST(req: NextRequest) {
  let body: ValueLeadBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot — bots that fill the hidden field get a fake success so they don't
  // learn the submission was rejected. Nothing is sent to FUB.
  if (str(body.honeypot, 200)) {
    console.warn('Value lead blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  const name = str(body.name, 80)
  const email = str(body.email, 200)
  const address = str(body.address, 200)
  const phone = str(body.phone, 30)
  const payoff = str(body.payoff, 60)

  if (!isValidName(name) || !isValidEmail(email) || !isValidAddress(address)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  // true = ticked, false = gave a number but did not tick, undefined = no number.
  const phoneConsent = phone ? body.phoneConsent === true : undefined
  const pageUrl = safePageUrl(body.sourcePageUrl)
  const capturedAt = new Date().toISOString()

  const apiKey = process.env.FUB_API_KEY
  if (!apiKey) {
    // Local development without the key: log the lead so the flow is testable.
    // Production must be configured — a seller lead must never be dropped silently.
    if (process.env.NODE_ENV === 'production') {
      console.error('FUB_API_KEY is not set — value lead dropped')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Value lead:', {
      name,
      email,
      address,
      phoneConsent,
    })
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName } = splitName(name!)

  const tags = ['Hand-Raiser', 'Seller Prospect', 'Seller Card']
  if (phoneConsent === false) tags.push(NO_PHONE_CONSENT_TAG)
  if (phoneConsent === true) tags.push(PHONE_CONSENT_TAG)

  const utm = {
    source: str(body.utmSource, 100),
    medium: str(body.utmMedium, 100),
    campaign: str(body.utmCampaign, 100),
    content: str(body.utmContent, 100),
    term: str(body.utmTerm, 100),
  }
  const hasUtm = Object.values(utm).some(Boolean)

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
    ...(pageUrl ? { pageUrl } : {}),
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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    'X-System': 'DYNAH',
  }
  if (process.env.FUB_SYSTEM_KEY) headers['X-System-Key'] = process.env.FUB_SYSTEM_KEY

  try {
    const res = await fetch(FUB_EVENTS_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(fubBody),
      signal: AbortSignal.timeout(10_000),
    })

    if (res.status !== 200 && res.status !== 201) {
      // Status and body only — never the request headers, which carry the key.
      const text = await res.text().catch(() => '')
      console.error(`FUB value lead failed: ${res.status}`, text.slice(0, 1000))
      return NextResponse.json({ error: 'Lead submission failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('FUB value lead request error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: 'Lead submission failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
