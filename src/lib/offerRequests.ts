// Definitions, validation and Follow Up Boss payload for the four short
// "personal reply" offers (neighborhood shortlist, condo building review, boat
// fit, Avenir move-in comparison). One definition drives the form the visitor
// sees, the checks the server runs, and the note the team reads in Follow Up
// Boss, so the three cannot drift apart.
//
// The fifth offer (seller net proceeds) is deliberately NOT here: it links to
// the one existing seller form on /sell, which already owns that flow.
//
// No imports beyond ./consent.ts, and a .ts extension on it, so `node --test`
// can run the unit tests without a bundler (same pattern as leads/validate.ts).

import { formatConsentLine } from './consent.ts'

export const OFFER_KEYS = [
  'neighborhood-shortlist',
  'condo-building-review',
  'boat-fit',
  'avenir-move-in',
] as const

export type OfferKey = (typeof OFFER_KEYS)[number]

export function isOfferKey(value: unknown): value is OfferKey {
  return typeof value === 'string' && (OFFER_KEYS as readonly string[]).includes(value)
}

export const BUDGET_OPTIONS = [
  'Under $400,000',
  '$400,000 – $600,000',
  '$600,000 – $800,000',
  '$800,000 – $1,000,000',
  '$1,000,000 – $1,500,000',
  '$1,500,000 – $2,500,000',
  '$2,500,000 and up',
] as const

export const MOVE_TIMING_OPTIONS = [
  'Within 3 months',
  '3 to 6 months',
  '6 to 12 months',
  'More than a year',
  'No specific timeline',
] as const

export type FieldKind = 'select' | 'text' | 'number' | 'date'

export interface OfferField {
  id: string
  label: string
  kind: FieldKind
  /** Shown in the CRM note. Defaults to `label`. */
  noteLabel?: string
  options?: readonly string[]
  placeholder?: string
  /** Short helper line under the input. */
  hint?: string
  /** Number fields: inclusive bounds. */
  min?: number
  max?: number
  /** Number fields: appended to the value in the note, e.g. 'ft'. */
  unit?: string
  autoComplete?: string
}

export interface OfferDefinition {
  key: OfferKey
  /** Short name used in analytics-adjacent labels and the CRM note. */
  name: string
  /** Exact tag applied to the lead in Follow Up Boss. */
  crmTag: string
  eyebrow: string
  headline: string
  description: string
  /** Primary button on the card, and the form's heading. */
  buttonLabel: string
  submitLabel: string
  fields: OfferField[]
  /** Reassurance line directly under the submit button. */
  reassurance: string
  successTitle: string
  successBody: string
}

export const OFFERS: Record<OfferKey, OfferDefinition> = {
  'neighborhood-shortlist': {
    key: 'neighborhood-shortlist',
    name: 'Neighborhood Shortlist',
    crmTag: 'Offer Request - Neighborhood Shortlist',
    eyebrow: 'Free, Personal Reply',
    headline: 'Not Sure Which Neighborhood Fits?',
    description:
      'Tell us your budget, your timing and the two things you will not compromise on. Christine or John will reply with three communities, one trade-off for each, and links to matching listings.',
    buttonLabel: 'Find My 3 Neighborhoods',
    submitLabel: 'Find My 3 Neighborhoods',
    fields: [
      { id: 'budget', label: 'Budget range', kind: 'select', options: BUDGET_OPTIONS },
      { id: 'timing', label: 'When do you plan to move?', noteLabel: 'Move timing', kind: 'select', options: MOVE_TIMING_OPTIONS },
      {
        id: 'mustHave1',
        label: 'Must-have #1',
        kind: 'text',
        placeholder: 'e.g. walk to restaurants',
      },
      {
        id: 'mustHave2',
        label: 'Must-have #2',
        kind: 'text',
        placeholder: 'e.g. boat dockage, no HOA',
      },
    ],
    reassurance: 'A person writes the reply, not software. No obligation.',
    successTitle: 'Got it. Your shortlist is on its way.',
    successBody:
      'Christine or John will email you three communities, one trade-off for each, and links to matching listings.',
  },
  'condo-building-review': {
    key: 'condo-building-review',
    name: 'Condo Building Review',
    crmTag: 'Offer Request - Condo Building Review',
    eyebrow: 'Free, Personal Reply',
    headline: 'Thinking About a Specific Building?',
    description:
      'Send us the building or the listing. You will get a brief reply on what is known about its dues, reserves, assessments and inspections, and what you still need to verify before you rely on any of it.',
    buttonLabel: 'Request a Building Review',
    submitLabel: 'Request a Building Review',
    fields: [
      {
        id: 'building',
        label: 'Building name or listing link',
        kind: 'text',
        placeholder: 'e.g. The Bristol, or a listing URL',
        hint: 'Either one is fine.',
      },
    ],
    reassurance: 'We will tell you what we could and could not confirm. No obligation.',
    successTitle: 'Got it. We will review the building.',
    successBody:
      'Christine or John will email a brief summary of what is known about dues, reserves, assessments and inspections, and what you still need to verify.',
  },
  'boat-fit': {
    key: 'boat-fit',
    name: 'Boat Fit Check',
    crmTag: 'Offer Request - Boat Fit Check',
    eyebrow: 'Free, Personal Reply',
    headline: 'Will Your Boat Work at This Home?',
    description:
      'Send us the property and your boat’s dimensions. You will get a preliminary list of the dock dimensions, bridge clearances and route details to verify for that property.',
    buttonLabel: 'Check This Home for My Boat',
    submitLabel: 'Check This Home for My Boat',
    fields: [
      {
        id: 'property',
        label: 'Property link or address',
        kind: 'text',
        placeholder: 'Listing URL or street address',
        autoComplete: 'off',
      },
      {
        id: 'boatLength',
        label: 'Boat length (ft)',
        kind: 'number',
        min: 5,
        max: 250,
        unit: 'ft',
        noteLabel: 'Boat length',
        placeholder: 'e.g. 32',
      },
      {
        id: 'draft',
        label: 'Draft (ft)',
        kind: 'number',
        min: 0.5,
        max: 30,
        unit: 'ft',
        noteLabel: 'Draft',
        placeholder: 'e.g. 2.5',
      },
      {
        id: 'airDraft',
        label: 'Height above water (ft)',
        kind: 'number',
        min: 1,
        max: 150,
        unit: 'ft',
        noteLabel: 'Height above water',
        placeholder: 'e.g. 12',
        hint: 'Highest point, including any tower or antenna.',
      },
    ],
    reassurance:
      'This is a preliminary checklist of what to verify, not a guarantee of fit. No obligation.',
    successTitle: 'Got it. We will check the property against your boat.',
    successBody:
      'Christine or John will email a preliminary list of dock dimensions, bridge clearances and route details to verify for that property.',
  },
  'avenir-move-in': {
    key: 'avenir-move-in',
    name: 'Avenir Move-In Comparison',
    crmTag: 'Offer Request - Avenir Move-In Comparison',
    eyebrow: 'Free, Personal Reply',
    headline: 'Want a Home You Can Move Into Soon?',
    description:
      'Tell us your budget and the date you would like to be in. We will send up to three available Avenir options with the builder, asking price, expected completion, and any lot premiums or incentives we have confirmed.',
    buttonLabel: 'Compare Avenir Homes Ready Soon',
    submitLabel: 'Compare Avenir Homes Ready Soon',
    fields: [
      { id: 'budget', label: 'Budget range', kind: 'select', options: BUDGET_OPTIONS },
      {
        id: 'moveDate',
        label: 'Desired move date',
        kind: 'date',
        autoComplete: 'off',
      },
    ],
    reassurance:
      'Completion dates come from builders and can change. We will say what is confirmed. No obligation.',
    successTitle: 'Got it. We will compare what is available.',
    successBody:
      'Christine or John will email up to three Avenir options with the builder, asking price, expected completion and any confirmed lot premiums or incentives.',
  },
}

// ── Validation ───────────────────────────────────────────────────────────────

const TEXT_MAX = 200
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Collapse whitespace and control characters so a value is always one line. */
export function cleanText(raw: unknown): string {
  return typeof raw === 'string' ? raw.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim() : ''
}

function todayIso(now: Date): string {
  return now.toISOString().slice(0, 10)
}

/**
 * Error message for one field, or null if the value is acceptable. Used by the
 * form for inline errors and by the route as the authoritative check.
 */
export function fieldProblem(field: OfferField, raw: unknown, now: Date = new Date()): string | null {
  const value = cleanText(raw)
  if (!value) return `Please enter ${field.label.toLowerCase().replace(/ \(ft\)$/, '')}.`

  switch (field.kind) {
    case 'select':
      return field.options?.includes(value) ? null : `Please choose ${field.label.toLowerCase()}.`
    case 'text':
      return value.length >= 3 && value.length <= TEXT_MAX
        ? null
        : value.length < 3
          ? `Please add a little more detail for ${field.label.toLowerCase()}.`
          : `Please keep ${field.label.toLowerCase()} under ${TEXT_MAX} characters.`
    case 'number': {
      // Accept "2.5" and "2,5"-free input only; no units or ranges.
      if (!/^\d{1,3}(\.\d{1,2})?$/.test(value)) return `Please enter a number for ${field.label.toLowerCase()}.`
      const n = Number(value)
      if (field.min !== undefined && n < field.min) return `That looks too small for ${field.label.toLowerCase()}.`
      if (field.max !== undefined && n > field.max) return `That looks too large for ${field.label.toLowerCase()}.`
      return null
    }
    case 'date': {
      if (!DATE_RE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
        return 'Please choose a date.'
      }
      // One day of slack either side of "today" covers the visitor's timezone.
      const earliest = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const latest = new Date(now.getTime() + 3 * 366 * 24 * 60 * 60 * 1000)
      if (value < todayIso(earliest)) return 'Please choose a date that has not passed.'
      if (value > todayIso(latest)) return 'Please choose a date within the next three years.'
      return null
    }
  }
}

/** Per-field errors for a whole submission. Empty object = valid. */
export function validateOfferDetails(
  offer: OfferKey,
  details: Record<string, unknown> | undefined,
  now: Date = new Date(),
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of OFFERS[offer].fields) {
    const problem = fieldProblem(field, details?.[field.id], now)
    if (problem) errors[field.id] = problem
  }
  return errors
}

// ── Follow Up Boss payload ───────────────────────────────────────────────────

export interface OfferRequestSubmission {
  offer?: string
  email?: string
  details?: Record<string, unknown>
  honeypot?: string
  /** Full URL the visitor was on. */
  sourcePageUrl?: string
  /** Where on that page the CTA sat, e.g. 'article', 'download-confirmation'. */
  ctaLocation?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
  consentVersion?: string
  /** Stamped server-side; the client value is ignored. */
  consentCapturedAt?: string
  submittedAt?: string
}

export function buildOfferTags(offer: OfferKey): string[] {
  return ['Offer Request', OFFERS[offer].crmTag]
}

function short(raw: unknown, max = 300): string {
  return cleanText(raw).slice(0, max)
}

export function buildOfferNote(sub: OfferRequestSubmission, offer: OfferKey): string {
  const def = OFFERS[offer]
  const lines: Array<string | null> = [
    `OFFER REQUESTED: ${def.name} ("${def.buttonLabel}")`,
    sub.sourcePageUrl ? `Originating page: ${short(sub.sourcePageUrl)}` : null,
    sub.ctaLocation ? `CTA placement: ${short(sub.ctaLocation, 60)}` : null,
    '',
    ...def.fields.map((f) => {
      const value = short(sub.details?.[f.id])
      return `${f.noteLabel ?? f.label}: ${value}${f.kind === 'number' && f.unit ? ` ${f.unit}` : ''}`
    }),
    '',
    'ACTION: The visitor was told Christine or John will reply personally by email. Prepare the reply by hand.',
    'Phone was not collected. Contact by email only.',
    sub.submittedAt ? `Submitted at: ${short(sub.submittedAt, 40)}` : null,
  ]
  const utmParts = [
    sub.utmSource ? `source=${short(sub.utmSource, 80)}` : null,
    sub.utmMedium ? `medium=${short(sub.utmMedium, 80)}` : null,
    sub.utmCampaign ? `campaign=${short(sub.utmCampaign, 80)}` : null,
    sub.utmContent ? `content=${short(sub.utmContent, 80)}` : null,
  ].filter(Boolean)
  if (utmParts.length) lines.push(`UTM: ${utmParts.join(', ')}`)
  if (sub.referrer) lines.push(`Referrer: ${short(sub.referrer)}`)
  if (sub.consentCapturedAt) {
    // No phone is collected, so the scope is always "email only".
    lines.push(formatConsentLine(sub.consentVersion, undefined, sub.consentCapturedAt))
  }
  return lines.filter((l) => l !== null).join('\n')
}
