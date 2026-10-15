// Pure helpers for building the Follow Up Boss payload from an
// /api/contact-requests submission — the general "get in touch" form on
// /contact. Same testable split as showingRequestHelpers.ts. Reuses that
// file's name/email/splitName rules so every form on the site accepts and
// rejects the same inputs.

import { formatConsentLine, NO_PHONE_CONSENT_TAG, PHONE_CONSENT_TAG } from '@/lib/consent'
import { isLeadMagnetKey, leadMagnets } from '@/lib/leadMagnets'
import { isValidEmail, isValidName, splitName } from '@/lib/showingRequestHelpers'

export { isValidEmail, isValidName, splitName }

export const MAX_MESSAGE_LENGTH = 2000

export const CONTACT_PLACEMENTS = ['contact-page', 'community-inline'] as const

export function isValidPlacement(p: string | undefined): boolean {
  return p === undefined || (CONTACT_PLACEMENTS as readonly string[]).includes(p)
}

export function isValidPageName(name: string | undefined): boolean {
  return name === undefined || (typeof name === 'string' && name.length <= 100)
}

export interface ContactRequestSubmission {
  name?: string
  email?: string
  phone?: string
  message?: string
  honeypot?: string
  /** Where the form lives. Only the values in CONTACT_PLACEMENTS are honored. */
  ctaPlacement?: string
  /** Community the visitor was reading when they asked. */
  pageName?: string
  /** Full URL of /contact at submit time — carries `?from=<magnet key>` when the
   *  visitor arrived from a lead-magnet "next step" link. */
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

/** Phone is optional, but a value that is present must look like a number. */
export function isValidOptionalPhone(phone: string | undefined): boolean {
  const trimmed = (phone ?? '').trim()
  if (!trimmed) return true
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

export function isValidMessage(message: string | undefined): boolean {
  return (message ?? '').length <= MAX_MESSAGE_LENGTH
}

/**
 * The lead magnet the visitor came from, if the source URL names one. Only a
 * registered key is honored — the query string is untrusted input.
 */
export function magnetFromSourceUrl(sourcePageUrl: string | undefined) {
  if (!sourcePageUrl) return undefined
  try {
    const from = new URL(sourcePageUrl).searchParams.get('from') ?? undefined
    return isLeadMagnetKey(from) ? leadMagnets[from] : undefined
  } catch {
    return undefined
  }
}

export function buildContactTags(sub: ContactRequestSubmission): string[] {
  const magnet = magnetFromSourceUrl(sub.sourcePageUrl)
  const tags = [
    'Website Inquiry',
    sub.ctaPlacement === 'community-inline' ? 'Community Inquiry' : 'Contact Form',
    // A plain label, not the magnet's own crmTag: that tag is what FUB
    // automations key on for a fresh download, and this person is past that.
    magnet ? `Came From: ${magnet.shortTitle}` : null,
    sub.phoneConsent === false ? NO_PHONE_CONSENT_TAG : null,
    sub.phoneConsent === true ? PHONE_CONSENT_TAG : null,
  ].filter(Boolean) as string[]
  return Array.from(new Set(tags))
}

export function buildContactNote(sub: ContactRequestSubmission): string {
  const magnet = magnetFromSourceUrl(sub.sourcePageUrl)
  const lines = [
    sub.ctaPlacement === 'community-inline' && sub.pageName
      ? `Asked a question from the ${sub.pageName} community page on doyouneedahome.com.`
      : 'Sent a message through the contact form on doyouneedahome.com.',
    sub.ctaPlacement ? `CTA placement: ${sub.ctaPlacement}.` : null,
    magnet ? `Arrived from the "${magnet.title}" download's next-step link.` : null,
    sub.message?.trim() ? `Message: ${sub.message.trim()}` : 'No message was included.',
    // Said here because the record names no agent. Never say "call" when the
    // visitor declined call/text consent.
    sub.phoneConsent === false || !sub.phone?.trim()
      ? 'In rotation — reach out by email.'
      : 'In rotation — call this lead.',
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
  // Consent record last, so it doesn't push the message out of view.
  if (sub.consentCapturedAt) {
    lines.push(formatConsentLine(sub.consentVersion, sub.phoneConsent, sub.consentCapturedAt))
  }
  return lines.filter(Boolean).join('\n')
}
