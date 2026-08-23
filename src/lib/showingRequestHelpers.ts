// Pure helpers for building the Follow Up Boss payload from an
// /api/showing-requests submission. Same testable split as
// sellerLeadHelpers.ts / leadHelpers.ts, and deliberately not folded into
// either: those flows gate PDFs and valuations; this one books private
// showings of a specific listing.

import { formatConsentLine, NO_PHONE_CONSENT_TAG } from '@/lib/consent'

// The one listing this route currently serves. Keyed so a second standalone
// listing page can register itself without loosening validation.
export const SHOWING_LISTINGS = {
  '8804-skyward-street': {
    address: '8804 Skyward Street',
    city: 'Boca Raton',
    state: 'FL',
    zip: '33496',
    price: 2799999,
    crmTag: 'Listing: 8804 Skyward Street',
  },
} as const

export type ShowingListingKey = keyof typeof SHOWING_LISTINGS

export const SHOWING_WINDOWS = [
  'Weekday morning',
  'Weekday afternoon',
  'Weekend morning',
  'Weekend afternoon',
  'Flexible — first available',
] as const

export type ShowingWindow = (typeof SHOWING_WINDOWS)[number]

export const AGENT_AFFILIATIONS = [
  'I am not working with an agent',
  'I am working with an agent',
  'I am a buyer’s agent inquiring for a client',
] as const

export type AgentAffiliation = (typeof AGENT_AFFILIATIONS)[number]

export interface ShowingRequestSubmission {
  listingKey?: string
  name?: string
  email?: string
  phone?: string
  affiliation?: string
  window?: string
  notes?: string
  honeypot?: string
  sourcePageUrl?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
  consentVersion?: string
  /** true = ticked the call/text box, false = gave a number but did not tick,
   *  undefined = no phone number provided. */
  phoneConsent?: boolean
  consentCapturedAt?: string
  submittedAt?: string
}

export function isValidListingKey(key: string | undefined): key is ShowingListingKey {
  return !!key && key in SHOWING_LISTINGS
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

// A showing can't be confirmed, or the gate cleared, without a callback number.
export function isValidPhone(phone: string | undefined): boolean {
  const digits = (phone ?? '').replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export function isValidWindow(window: string | undefined): window is ShowingWindow {
  return SHOWING_WINDOWS.includes((window ?? '') as ShowingWindow)
}

export function isValidAffiliation(a: string | undefined): a is AgentAffiliation {
  return AGENT_AFFILIATIONS.includes((a ?? '') as AgentAffiliation)
}

export function buildShowingTags(
  sub: ShowingRequestSubmission,
  listing: (typeof SHOWING_LISTINGS)[ShowingListingKey]
): string[] {
  const tags = [
    'Buyer Lead',
    'Showing Request',
    listing.crmTag,
    sub.affiliation === 'I am a buyer’s agent inquiring for a client' ? "Buyer's Agent" : null,
    sub.phoneConsent === false ? NO_PHONE_CONSENT_TAG : null,
  ].filter(Boolean) as string[]
  return Array.from(new Set(tags))
}

export function buildShowingNote(
  sub: ShowingRequestSubmission,
  listing: (typeof SHOWING_LISTINGS)[ShowingListingKey]
): string {
  const lines = [
    `Requested a private showing of ${listing.address}, ${listing.city}.`,
    sub.window ? `Preferred window: ${sub.window}` : null,
    sub.affiliation ? `Agent status: ${sub.affiliation}` : null,
    sub.notes?.trim() ? `Notes: ${sub.notes.trim()}` : null,
    'Reminder: 24-hour notice, listing agent accompanies, guests must be pre-registered at the Lotus gate.',
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
  // Consent record last, so it doesn't push the showing details out of view
  // when the lead is worked in Follow Up Boss.
  if (sub.consentCapturedAt) {
    lines.push(formatConsentLine(sub.consentVersion, sub.phoneConsent, sub.consentCapturedAt))
  }
  return lines.filter(Boolean).join('\n')
}

/** FUB wants first/last split; the form asks for one "full name" field. */
export function splitName(name: string): { firstName: string; lastName?: string } {
  const [firstName, ...rest] = name.trim().split(/\s+/)
  const lastName = rest.join(' ')
  return { firstName, lastName: lastName || undefined }
}
