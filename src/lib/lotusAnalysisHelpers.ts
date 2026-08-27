// Pure helpers for building the Follow Up Boss payload from a
// /api/property-analysis submission. Same testable split as
// sellerLeadHelpers.ts / showingRequestHelpers.ts / leadHelpers.ts.
//
// Deliberately NOT folded into sellerLeadHelpers.ts. That flow is the /sell and
// /sell/[agent] valuation funnel and it REQUIRES a selling timeline — the whole
// point of this one is that a Lotus owner never has to declare themselves a
// seller to get the analysis. Reusing that route would mean loosening the
// timeline validator on the live valuation funnel, so this gets its own path.
//
// Context: a Just Listed postcard for 8804 Skyward Street is mailed to every
// home in Lotus. Its printed QR points at the listing page with no UTM, so
// campaign attribution can only be asserted when a UTM actually arrives.

import { formatConsentLine, NO_PHONE_CONSENT_TAG } from '@/lib/consent'

/** The community this CTA serves. Keyed so a second postcard drop can register. */
export const LOTUS = {
  community: 'Lotus',
  city: 'Boca Raton',
  state: 'FL',
  zip: '33496',
  listingAddress: '8804 Skyward Street',
} as const

/**
 * The campaign this CTA belongs to. Applied to EVERY lead from it.
 *
 * The printed QR carries no UTM, so there is no technical proof any single
 * lead came off the postcard. But the mailing went to every home in Lotus, the
 * HOA bans for-sale signs, and this CTA exists nowhere else on the site and for
 * no other reason — so a Lotus owner asking about their own address here is the
 * postcard cohort in every way that matters for measuring the drop. The exact
 * arrival signature is still recorded per-lead in the note, so any individual
 * lead can be audited.
 *
 * WHEN THIS MAILING IS DONE: change or remove this tag before the page is
 * reused for another campaign, or later organic leads get counted against it.
 */
export const CAMPAIGN_TAG = 'Campaign: Lotus Just Listed Postcard'

/** utm_campaign values that positively identify the postcard drop. */
const POSTCARD_CAMPAIGNS = ['lotus-just-listed', 'lotus-postcard', 'lotus_just_listed']

export interface LotusAnalysisSubmission {
  /** Street address of the Lotus home to be analyzed — the point of the form. */
  address?: string
  /** Labelled "First name" on the form; a full name typed in still splits fine. */
  name?: string
  email?: string
  phone?: string
  /** Optional free text: upgrades and improvements the owner has made. */
  upgrades?: string
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
  /** true = ticked the call/text box, false = gave a number but did not tick. */
  phoneConsent?: boolean
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
  // Loose on purpose — "8804 Skyward St" and "8804 Skyward Street, Boca Raton"
  // are both correct answers. Just needs to be more than a stray character.
  return trimmed.length >= 5 && trimmed.length <= 200
}

// A property analysis is delivered by phone as often as by email, and the
// postcard promises a conversation — so unlike the valuation form, the number
// is required here.
export function isValidPhone(phone: string | undefined): boolean {
  const digits = (phone ?? '').replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export function isValidUpgrades(upgrades: string | undefined): boolean {
  return (upgrades ?? '').length <= 2000
}

/** True only when a UTM positively names the postcard drop. */
export function isPostcardCampaign(sub: LotusAnalysisSubmission): boolean {
  const campaign = (sub.utmCampaign ?? '').trim().toLowerCase()
  return POSTCARD_CAMPAIGNS.includes(campaign)
}

/**
 * One plain-English line describing how this visitor actually arrived, so the
 * cohort tag above can be audited lead by lead. Stated as the observation it
 * is — a phone arriving direct with no referrer is the signature of a QR scan,
 * not proof of one.
 */
export function describeArrival(sub: LotusAnalysisSubmission, isMobile: boolean): string {
  const utmParts = [
    sub.utmSource ? `source=${sub.utmSource}` : null,
    sub.utmMedium ? `medium=${sub.utmMedium}` : null,
    sub.utmCampaign ? `campaign=${sub.utmCampaign}` : null,
    sub.utmContent ? `content=${sub.utmContent}` : null,
  ].filter(Boolean)
  if (utmParts.length) return `Arrival: tagged link (${utmParts.join(', ')}).`
  if (sub.referrer) return `Arrival: followed a link from ${sub.referrer}.`
  return isMobile
    ? 'Arrival: direct, on a phone, no referrer — the signature of a QR scan.'
    : 'Arrival: direct on a desktop, no referrer — typed or bookmarked rather than scanned.'
}

export function buildAnalysisTags(sub: LotusAnalysisSubmission): string[] {
  const tags = [
    // Mirrors the vocabulary already in sellerLeadHelpers/showingRequestHelpers
    // so FUB smart lists keep working across all four lead flows.
    'Seller Lead',
    'Lotus Property Analysis',
    'Community: Lotus',
    `Listing: ${LOTUS.listingAddress}`,
    'Agent: John Oliver',
    CAMPAIGN_TAG,
    // A second, stricter tag for the leads where a tagged link proves the path,
    // so a confirmed subset can be separated from the cohort if that is ever
    // needed. Only reachable via a ?utm_campaign= link, not the printed QR.
    isPostcardCampaign(sub) ? 'Postcard Link (confirmed)' : null,
    sub.phoneConsent === false ? NO_PHONE_CONSENT_TAG : null,
  ].filter(Boolean) as string[]
  return Array.from(new Set(tags))
}

export function buildAnalysisNote(sub: LotusAnalysisSubmission, isMobile = false): string {
  const lines: Array<string | null> = [
    `Requested a property-specific analysis of their Lotus home from the ${LOTUS.listingAddress} listing page.`,
    sub.address ? `Their property: ${sub.address.trim()}` : null,
    sub.upgrades?.trim() ? `Upgrades / improvements they described: ${sub.upgrades.trim()}` : null,
    'Did NOT state a selling timeline — the form does not ask. Treat as curiosity, not a listing appointment.',
    'Deliverable promised: a property-specific analysis using relevant closed Lotus sales, current competing listings, model, square footage, lot and water position, view, upgrades, condition, and price-per-square-foot context. Reviewed before it goes out.',
    sub.sourcePageUrl ? `Converted on: ${sub.sourcePageUrl}` : null,
    sub.submittedAt ? `Submitted at: ${sub.submittedAt}` : null,
  ]
  lines.push(describeArrival(sub, isMobile))
  // Consent record last, so it doesn't push the property details out of view
  // when the lead is worked in Follow Up Boss.
  if (sub.consentCapturedAt) {
    lines.push(formatConsentLine(sub.consentVersion, sub.phoneConsent, sub.consentCapturedAt))
  }
  return lines.filter(Boolean).join('\n')
}

/** FUB wants first/last split; the form asks for a first name. */
export function splitName(name: string): { firstName: string; lastName?: string } {
  const [firstName, ...rest] = name.trim().split(/\s+/)
  const lastName = rest.join(' ')
  return { firstName, lastName: lastName || undefined }
}
