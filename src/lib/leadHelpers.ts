// Pure helpers for building the Follow Up Boss payload from a /api/leads
// submission, plus the HMAC tokens that gate the PDF download route. Kept
// separate from route.ts so they're testable without a Next request/response.

import { createHmac, timingSafeEqual } from 'node:crypto'
import { isLeadMagnetKey, leadMagnets, type LeadMagnetKey } from '@/lib/leadMagnets'
import { SITE_URL } from '@/lib/site'
import { formatConsentLine, NO_PHONE_CONSENT_TAG } from '@/lib/consent'

export const INTEREST_OPTIONS = [
  'Buying',
  'Selling',
  'Buying and selling',
  'Just researching',
] as const

export type Interest = (typeof INTEREST_OPTIONS)[number]

/**
 * Optional second-step answers. Deliberately NOT on the initial form — every
 * extra required field costs conversions, so these are asked once the visitor
 * already has their download.
 */
export const AREA_OPTIONS = [
  'Northern Palm Beach County',
  'Central Palm Beach County',
  'Southern Palm Beach County',
  'Western Palm Beach County',
  'Martin County / Treasure Coast',
  'St. Lucie County',
  'Still deciding',
] as const

export const TIMELINE_OPTIONS = [
  'Within 3 months',
  '3 to 6 months',
  '6 to 12 months',
  'More than a year',
  'No specific timeline',
] as const

export type AreaOfInterest = (typeof AREA_OPTIONS)[number]
export type LeadTimeline = (typeof TIMELINE_OPTIONS)[number]

export interface LeadSubmission {
  firstName?: string
  email?: string
  phone?: string
  interest?: string
  /** Registry key of the magnet being requested. */
  magnetKey?: string
  /** Edition label at the time of submission, recorded in the CRM note. */
  magnetEdition?: string
  honeypot?: string
  /** Full URL of the page where the conversion happened */
  sourcePageUrl?: string
  /** Page category label, e.g. 'community', 'blog', 'landing-page' */
  pageCategory?: string
  /** Where on the page the CTA lived, e.g. 'sidebar', 'inline', 'exit-intent' */
  ctaPlacement?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
  // Contact-consent record. consentCapturedAt is stamped server-side in the
  // route handler — the client value is not trusted for an audit record.
  consentVersion?: string
  /** true = ticked the call/text box, false = gave a number but did not tick,
   *  undefined = no phone number provided. */
  phoneConsent?: boolean
  consentCapturedAt?: string
  submittedAt?: string
  /** Optional second-step enrichment — see AREA_OPTIONS / TIMELINE_OPTIONS. */
  followUp?: boolean
  areaOfInterest?: string
  timeline?: string
}

export function isValidMagnetKey(value: string | undefined): value is LeadMagnetKey {
  return isLeadMagnetKey(value)
}

export function isValidFirstName(name: string | undefined): boolean {
  const trimmed = (name ?? '').trim()
  if (!trimmed || trimmed.length > 60) return false
  // Random-keyboard-mash bot names tend to be one long consonant run.
  return !/^[b-df-hj-np-tv-z]{8,}$/i.test(trimmed)
}

export function isValidEmail(email: string | undefined): boolean {
  return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidInterest(interest: string | undefined): interest is Interest {
  return INTEREST_OPTIONS.includes((interest ?? '') as Interest)
}

export function isValidArea(area: string | undefined): area is AreaOfInterest {
  return AREA_OPTIONS.includes((area ?? '') as AreaOfInterest)
}

export function isValidTimeline(timeline: string | undefined): timeline is LeadTimeline {
  return TIMELINE_OPTIONS.includes((timeline ?? '') as LeadTimeline)
}

export function buildLeadTags(sub: LeadSubmission): string[] {
  if (!isValidMagnetKey(sub.magnetKey)) return []
  const magnet = leadMagnets[sub.magnetKey]
  const tags = [
    magnet.crmTag,
    sub.interest ? `Interest: ${sub.interest}` : null,
    isValidArea(sub.areaOfInterest) ? `Area: ${sub.areaOfInterest}` : null,
    isValidTimeline(sub.timeline) ? `Timeline: ${sub.timeline}` : null,
    // Surfaced as a tag, not just a note line — a note is easy to scroll
    // past, and calling this person would be the actual violation.
    sub.phoneConsent === false ? NO_PHONE_CONSENT_TAG : null,
  ].filter(Boolean) as string[]
  return Array.from(new Set(tags))
}

export function buildLeadNote(sub: LeadSubmission): string {
  const magnet = isValidMagnetKey(sub.magnetKey) ? leadMagnets[sub.magnetKey] : undefined
  if (sub.followUp) {
    return [
      magnet
        ? `Answered the optional follow-up after downloading "${magnet.title}".`
        : 'Answered the optional lead-magnet follow-up.',
      isValidArea(sub.areaOfInterest) ? `Area of interest: ${sub.areaOfInterest}` : null,
      isValidTimeline(sub.timeline) ? `Timeline: ${sub.timeline}` : null,
      sub.sourcePageUrl ? `Answered on: ${sub.sourcePageUrl}` : null,
      sub.submittedAt ? `Submitted at: ${sub.submittedAt}` : null,
    ]
      .filter(Boolean)
      .join('\n')
  }

  const lines = [
    magnet
      ? `Downloaded "${magnet.title}" (${sub.magnetEdition ?? magnet.edition} edition, id ${magnet.id}) from doyouneedahome.com.`
      : null,
    sub.interest ? `Primarily interested in: ${sub.interest}.` : null,
    sub.phone ? 'Phone was provided.' : 'Phone was not provided.',
    magnet ? `Lead magnet landing page: ${SITE_URL}${magnet.landingPage}` : null,
    sub.sourcePageUrl ? `Converted on: ${sub.sourcePageUrl}` : null,
    sub.pageCategory ? `Page category: ${sub.pageCategory}.` : null,
    sub.ctaPlacement ? `CTA placement: ${sub.ctaPlacement}.` : null,
    sub.submittedAt ? `Submitted at: ${sub.submittedAt}` : null,
  ]
  const utmParts = [
    sub.utmSource ? `source=${sub.utmSource}` : null,
    sub.utmMedium ? `medium=${sub.utmMedium}` : null,
    sub.utmCampaign ? `campaign=${sub.utmCampaign}` : null,
    sub.utmContent ? `content=${sub.utmContent}` : null,
  ].filter(Boolean)
  if (utmParts.length) lines.push(`UTM: ${utmParts.join(', ')}`)
  if (sub.referrer) lines.push(`Referrer: ${sub.referrer}`)
  // Consent record last, so it doesn't push the property/message details
  // out of view when the lead is worked in Follow Up Boss.
  if (sub.consentCapturedAt) {
    lines.push(formatConsentLine(sub.consentVersion, sub.phoneConsent, sub.consentCapturedAt))
  }
  return lines.filter(Boolean).join('\n')
}

// ── Download tokens ──────────────────────────────────────────────────────────
// Raw PDF URLs are never public: /api/reports/[reportType] only serves the file
// with a valid, short-lived HMAC token issued by /api/leads after a successful
// submission. LEAD_MAGNET_DOWNLOAD_SECRET is preferred; FUB_API_KEY works as a
// fallback so no extra env var is strictly required.

const TOKEN_TTL_MS = 30 * 60 * 1000 // 30 minutes — enough for retries, too short to share

function tokenSecret(): string {
  return (
    process.env.LEAD_MAGNET_DOWNLOAD_SECRET ??
    process.env.FUB_API_KEY ??
    'dev-only-secret-set-LEAD_MAGNET_DOWNLOAD_SECRET'
  )
}

function sign(payload: string): string {
  return createHmac('sha256', tokenSecret()).update(payload).digest('hex')
}

export function createDownloadToken(magnetKey: LeadMagnetKey, now = Date.now()): string {
  const expiry = now + TOKEN_TTL_MS
  return `${expiry}.${sign(`${magnetKey}.${expiry}`)}`
}

export function verifyDownloadToken(
  magnetKey: LeadMagnetKey,
  token: string | null,
  now = Date.now(),
): boolean {
  if (!token) return false
  const [expiryStr, sig] = token.split('.')
  const expiry = Number(expiryStr)
  if (!expiry || !sig || expiry < now) return false
  const expected = sign(`${magnetKey}.${expiry}`)
  if (sig.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))
}
