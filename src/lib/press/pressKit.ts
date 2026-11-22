// ─────────────────────────────────────────────────────────────────────────────
// PRESS KIT — the one file to edit for /press.
//
// Anything a journalist might quote or act on (bio copy, a phone number, a
// promised response time, what data we will hand over) has to come from
// Christine and John, not from whoever built the page. Those fields start as
// PLACEHOLDER_* strings below. Replace each one with the real text.
//
// While ANY placeholder remains, /press 404s in production, the footer link is
// hidden and the page stays out of the sitemap, the same way an unpublished
// lead magnet behaves. It still renders under `next dev` with the unfilled
// fields flagged, so the page can be reviewed. Fill the last placeholder and
// all three switch on with no other change.
//
// Names, credentials, licence numbers and the county report links are NOT
// here: they are read from src/lib/agents.ts and src/lib/leadMagnets.ts so they
// cannot drift from the rest of the site.
// ─────────────────────────────────────────────────────────────────────────────

const PLACEHOLDER_PREFIX = 'PLACEHOLDER_'

export function isPlaceholder(value: string): boolean {
  return value.startsWith(PLACEHOLDER_PREFIX)
}

export interface PressPerson {
  /** Slug in src/lib/agents.ts — name, credentials and licence come from there. */
  agentSlug: 'john' | 'christine'
  /** Two or three sentences, third person, written or approved by the agent. */
  shortBio: string
  headshot: {
    /** Public path of the full-resolution file offered for download. */
    src: string
    /** Filename the browser saves it as. */
    downloadName: string
    width: number
    height: number
    alt: string
  }
}

export interface PressKit {
  contact: {
    /** Direct line for press, formatted for display, e.g. (561) 555-0100. */
    phone: string
    /** Direct email for press enquiries. */
    email: string
    /** One sentence, e.g. how quickly a journalist on deadline hears back. */
    responseTime: string
  }
  people: PressPerson[]
  /**
   * What we will supply to a journalist on request. One entry per item. Only
   * list data we actually hold and are allowed to share.
   */
  dataOnRequest: string[]
}

export const pressKit: PressKit = {
  contact: {
    phone: 'PLACEHOLDER_PRESS_PHONE',
    email: 'PLACEHOLDER_PRESS_EMAIL',
    responseTime: 'PLACEHOLDER_PRESS_RESPONSE_TIME',
  },
  people: [
    {
      agentSlug: 'john',
      shortBio: 'PLACEHOLDER_JOHN_OLIVER_SHORT_BIO',
      headshot: {
        // The same headshots the article bylines use (src/lib/authors.ts).
        src: '/images/john-professional.jpg',
        downloadName: 'john-oliver-do-homes-group.jpg',
        width: 3472,
        height: 3935,
        alt: 'John Oliver',
      },
    },
    {
      agentSlug: 'christine',
      shortBio: 'PLACEHOLDER_CHRISTINE_DEKANT_SHORT_BIO',
      headshot: {
        src: '/images/christine.jpg',
        downloadName: 'christine-dekant-do-homes-group.jpg',
        width: 1024,
        height: 1536,
        alt: 'Christine Dekant',
      },
    },
  ],
  dataOnRequest: ['PLACEHOLDER_DATA_ON_REQUEST_LIST'],
}

/** Every field still holding a placeholder, by name. Empty = ready to publish. */
export function pressKitPlaceholders(kit: PressKit = pressKit): string[] {
  const values = [
    kit.contact.phone,
    kit.contact.email,
    kit.contact.responseTime,
    ...kit.people.map((p) => p.shortBio),
    ...kit.dataOnRequest,
  ]
  const open = values.filter(isPlaceholder)
  if (kit.dataOnRequest.length === 0) open.push('PLACEHOLDER_DATA_ON_REQUEST_LIST')
  return open
}

/** True once every placeholder above has been replaced with real copy. */
export const PRESS_KIT_READY = pressKitPlaceholders().length === 0

/** "(561) 555-0100" → "tel:+15615550100". US numbers only. */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `tel:+${digits.length === 10 ? '1' : ''}${digits}`
}
