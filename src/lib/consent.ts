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

export interface ConsentCopy {
  /** Shown under every form. Covers email contact, which needs no checkbox. */
  base: string
  /**
   * Checkbox label, shown only once a phone number has actually been entered.
   * Ticking it is the affirmative record of call/text permission.
   */
  phoneCheckbox: string | null
}

export const CONSENT_VERSIONS: Record<string, ConsentCopy> = {
  // Original wording: one paragraph, no checkbox. Retained because leads were
  // captured under it.
  '2026-08': {
    base:
      'No spam — your information is never shared or sold. By submitting, you agree that DO Homes Group and ' +
      'Premier Brokers International may contact you at the phone number and email address you provided — ' +
      'including by phone, text message, and automated or prerecorded means — about your inquiry and Palm ' +
      'Beach County real estate. Consent is not a condition of any purchase. Message and data rates may apply. ' +
      'Reply STOP to opt out of texts.',
    phoneCheckbox: null,
  },
  // Matches the consent pattern already running on search.doyouneedahome.com:
  // an explicit checkbox for calls and texts, shown only when a phone number is
  // given. Deliberately omits the "AI voice call" clause Ylopo carries — this
  // team does not use AI calling or texting.
  '2026-08b': {
    base:
      'No spam — your information is never shared or sold. By submitting, you agree that DO Homes Group and ' +
      'Premier Brokers International may email you about your request and Palm Beach County real estate. ' +
      'You can unsubscribe at any time.',
    phoneCheckbox:
      'By checking this box, you consent to allow DO Homes Group and Premier Brokers International to contact ' +
      'you at the number provided with marketing communications via voice call, text message or similar ' +
      'automated means. Consent is not a condition of any purchase. Message and data rates may apply. ' +
      'Message frequency may vary. Reply STOP to opt out or HELP for help.',
  },
}

export const CURRENT_CONSENT_VERSION = '2026-08b'

/** Trailing sentence that carries the Privacy Policy link when rendered. */
export const PRIVACY_PROMPT = 'See our'
export const PRIVACY_LINK_LABEL = 'Privacy Policy'

/**
 * The disclaimer as the visitor saw it, flattened to plain text. The `prefix`
 * some forms pass ("Free instant PDF download.") is marketing framing, not
 * consent language, so it is deliberately not recorded.
 * Returns null for an unknown version rather than guessing.
 */
export function getConsentText(version: string, includeCheckbox = false): string | null {
  const copy = CONSENT_VERSIONS[version]
  if (!copy) return null
  const parts = [copy.base]
  if (includeCheckbox && copy.phoneCheckbox) parts.push(copy.phoneCheckbox)
  parts.push(`${PRIVACY_PROMPT} ${PRIVACY_LINK_LABEL}.`)
  return parts.join(' ')
}

/**
 * One-line consent record for the Follow Up Boss note. The version id resolves
 * to the exact wording via CONSENT_VERSIONS, which is retained permanently.
 *
 * phoneConsent: true = ticked the box, false = gave a number but did NOT tick,
 * undefined = no phone number provided, so there was nothing to consent to.
 */
export function formatConsentLine(
  version: string | undefined,
  phoneConsent: boolean | undefined | null,
  capturedAt: string
): string | null {
  if (!version || !CONSENT_VERSIONS[version]) return null
  const scope =
    phoneConsent === true
      ? 'call/text consent given'
      : phoneConsent === false
        ? 'NO call/text consent — email only, do not call or text'
        : 'email only, no phone provided'
  return `Contact consent captured ${capturedAt} — wording v${version} (${scope})`
}

/** Tag applied when someone hands over a number but withholds call/text permission. */
export const NO_PHONE_CONSENT_TAG = 'No Call/Text Consent'
