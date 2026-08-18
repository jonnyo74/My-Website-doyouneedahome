// Single source of truth for the contact-permission wording shown under every
// lead form. FormConsent renders from these constants and the lead routes record
// which version a lead agreed to, so the displayed text and the recorded text
// cannot drift.
//
// NEVER edit an existing version's text. When the wording changes (e.g. after a
// broker or counsel review), add a NEW entry and point CURRENT_CONSENT_VERSION
// at it. Leads who consented under an older version must keep resolving to the
// exact words they were shown.
//
// Keep the wording in sync with the "Your Consent to Be Contacted" section of
// src/app/privacy-policy/page.tsx.
//
// Every form on this site collects a phone number, so unlike condowpb.com there
// is only one variant here.

export interface ConsentCopy {
  /** Lead-in shown before the consent sentence. */
  intro: string
  /** The consent sentence itself. */
  body: string
}

export const CONSENT_VERSIONS: Record<string, ConsentCopy> = {
  '2026-08': {
    intro: 'No spam — your information is never shared or sold.',
    body:
      'By submitting, you agree that DO Homes Group and Premier Brokers International may contact you at the phone ' +
      'number and email address you provided — including by phone, text message, and automated or ' +
      'prerecorded means — about your inquiry and Palm Beach County real estate. Consent is not a ' +
      'condition of any purchase. Message and data rates may apply. Reply STOP to opt out of texts.',
  },
}

export const CURRENT_CONSENT_VERSION = '2026-08'

/** Trailing sentence that carries the Privacy Policy link when rendered. */
export const PRIVACY_PROMPT = 'See our'
export const PRIVACY_LINK_LABEL = 'Privacy Policy'

/**
 * The complete disclaimer as the visitor saw it, flattened to plain text.
 * The `prefix` some forms pass ("Free instant PDF download.") is marketing
 * framing, not consent language, so it is deliberately not recorded.
 * Returns null for an unknown version rather than guessing.
 */
export function getConsentText(version: string): string | null {
  const copy = CONSENT_VERSIONS[version]
  if (!copy) return null
  return `${copy.intro} ${copy.body} ${PRIVACY_PROMPT} ${PRIVACY_LINK_LABEL}.`
}

/**
 * One-line consent record for the Follow Up Boss note. The version id resolves
 * to the exact wording via CONSENT_VERSIONS, which is retained permanently.
 */
export function formatConsentLine(
  version: string | undefined,
  capturedAt: string
): string | null {
  if (!version || !CONSENT_VERSIONS[version]) return null
  return `Contact consent captured ${capturedAt} — wording v${version}`
}
