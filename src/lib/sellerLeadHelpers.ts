// Pure helpers for building the Follow Up Boss payload from a /api/seller-leads
// submission. Kept separate from route.ts so they're testable without a Next
// request/response — same split as leadHelpers.ts.
//
// Deliberately NOT folded into leadHelpers.ts: that module is the market-report
// lead magnet, and its validators require a reportType and mint a PDF download
// token. A valuation request has neither, so it gets its own path rather than
// loosening validation on the flow that gates the reports.

import { getValuationRoute, TEAM_ROUTE_SLUG, type ValuationRoute } from '@/lib/agents'
import { formatConsentLine } from '@/lib/consent'

export const TIMELINE_OPTIONS = [
  'As soon as possible',
  'Within 3 months',
  '3 to 6 months',
  '6 to 12 months',
  'Just curious about the value',
] as const

export type Timeline = (typeof TIMELINE_OPTIONS)[number]

export interface SellerLeadSubmission {
  name?: string
  email?: string
  phone?: string
  /** Street address of the property being valued — the whole point of the form. */
  address?: string
  timeline?: string
  /** Free-text "anything we should know" box. */
  notes?: string
  /** Which valuation route this came from — an agent slug, or 'team'. */
  agentSlug?: string
  honeypot?: string
  sourcePageUrl?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
  // Contact-consent record. consentCapturedAt is stamped server-side in the
  // route handler — the client value is not trusted for an audit record.
  consentVersion?: string
  consentCapturedAt?: string
  submittedAt?: string
}

export function isValidName(name: string | undefined): boolean {
  const trimmed = (name ?? '').trim()
  if (!trimmed || trimmed.length > 80) return false
  // Random-keyboard-mash bot names tend to be one long consonant run.
  return !/^[b-df-hj-np-tv-z]{8,}$/i.test(trimmed)
}

export function isValidEmail(email: string | undefined): boolean {
  return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidAddress(address: string | undefined): boolean {
  const trimmed = (address ?? '').trim()
  // Loose on purpose — "1234 Ocean Dr" and "The Bristol #12A" are both valid
  // answers. Just needs to be more than a stray character and not an essay.
  return trimmed.length >= 5 && trimmed.length <= 200
}

export function isValidTimeline(timeline: string | undefined): timeline is Timeline {
  return TIMELINE_OPTIONS.includes((timeline ?? '') as Timeline)
}

export function isValidAgentSlug(slug: string | undefined): boolean {
  return !!getValuationRoute(slug)
}

/** How the lead described itself in the CRM note. */
function routeSourceLabel(route: ValuationRoute): string {
  return route.slug === TEAM_ROUTE_SLUG
    ? 'the pricing & net proceeds review on /sell'
    : `${route.name}'s valuation page`
}

export function buildSellerLeadTags(sub: SellerLeadSubmission, agent: ValuationRoute): string[] {
  const tags = [
    'Seller Lead',
    'Home Valuation Request',
    agent.crmTag,
    isValidTimeline(sub.timeline) ? `Timeline: ${sub.timeline}` : null,
  ].filter(Boolean) as string[]
  return Array.from(new Set(tags))
}

export function buildSellerLeadNote(sub: SellerLeadSubmission, agent: ValuationRoute): string {
  const lines = [
    `Requested a home valuation from ${routeSourceLabel(agent)}.`,
    sub.address ? `Property: ${sub.address.trim()}` : null,
    sub.timeline ? `Selling timeline: ${sub.timeline}` : null,
    sub.notes?.trim() ? `Notes: ${sub.notes.trim()}` : null,
    sub.phone?.trim() ? 'Phone was provided.' : 'Phone was not provided.',
    sub.sourcePageUrl ? `Converted on: ${sub.sourcePageUrl}` : null,
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
    lines.push(formatConsentLine(sub.consentVersion, sub.consentCapturedAt))
  }
  return lines.filter(Boolean).join('\n')
}

/** FUB wants first/last split; the form asks for one "full name" field. */
export function splitName(name: string): { firstName: string; lastName?: string } {
  const [firstName, ...rest] = name.trim().split(/\s+/)
  const lastName = rest.join(' ')
  return { firstName, lastName: lastName || undefined }
}
