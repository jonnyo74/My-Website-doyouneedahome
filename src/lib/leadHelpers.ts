// Pure helpers for building the Follow Up Boss payload from a /api/leads
// submission, plus the HMAC tokens that gate the PDF download route. Kept
// separate from route.ts so they're testable without a Next request/response.

import { createHmac, timingSafeEqual } from 'node:crypto'
import { marketReports, type ReportType } from '@/lib/marketReports'
import { SITE_URL } from '@/lib/site'

export const INTEREST_OPTIONS = [
  'Buying',
  'Selling',
  'Buying and selling',
  'Just researching',
] as const

export type Interest = (typeof INTEREST_OPTIONS)[number]

export interface LeadSubmission {
  firstName?: string
  email?: string
  phone?: string
  interest?: string
  reportType?: string
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
  submittedAt?: string
}

export function isValidReportType(value: string | undefined): value is ReportType {
  return value === 'single-family' || value === 'condo-townhome'
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

export function buildLeadTags(sub: LeadSubmission): string[] {
  if (!isValidReportType(sub.reportType)) return []
  const report = marketReports[sub.reportType]
  const tags = [
    report.crmTag,
    sub.interest ? `Interest: ${sub.interest}` : null,
  ].filter(Boolean) as string[]
  return Array.from(new Set(tags))
}

export function buildLeadNote(sub: LeadSubmission): string {
  const report = isValidReportType(sub.reportType) ? marketReports[sub.reportType] : undefined
  const lines = [
    report
      ? `Downloaded "${report.title}" (${report.edition} edition) from doyouneedahome.com.`
      : null,
    sub.interest ? `Primarily interested in: ${sub.interest}.` : null,
    sub.phone ? 'Phone was provided.' : 'Phone was not provided.',
    report ? `Report landing page: ${SITE_URL}${report.landingPage}` : null,
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
  return lines.filter(Boolean).join('\n')
}

// ── Download tokens ──────────────────────────────────────────────────────────
// Raw PDF URLs are never public: /api/reports/[type] only serves the file with
// a valid, short-lived HMAC token issued by /api/leads after a successful
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

export function createDownloadToken(reportType: ReportType, now = Date.now()): string {
  const expiry = now + TOKEN_TTL_MS
  return `${expiry}.${sign(`${reportType}.${expiry}`)}`
}

export function verifyDownloadToken(
  reportType: ReportType,
  token: string | null,
  now = Date.now(),
): boolean {
  if (!token) return false
  const [expiryStr, sig] = token.split('.')
  const expiry = Number(expiryStr)
  if (!expiry || !sig || expiry < now) return false
  const expected = sign(`${reportType}.${expiry}`)
  if (sig.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))
}
