/**
 * Shared types for the two paddle-access guides.
 *
 * The pair is deliberately split by search intent: `/kayak-launches-jupiter-tequesta`
 * answers "where can I put a boat in the water" (informational, top of funnel) and
 * `/communities-with-kayak-launches` answers "which neighbourhood should I buy in"
 * (transactional). They share this vocabulary so a fact stated on one page cannot
 * drift from the same fact on the other.
 */

/** How a paddler actually gets the boat wet. */
export type LaunchKind =
  /** Carry-in from a beach, bank, or paver ramp. No trailer involved. */
  | 'hand'
  /** A concrete trailer ramp that a paddler can also use. */
  | 'ramp'
  /** Reachable only by water — a destination, not a put-in. */
  | 'water-only'
  /** Built or permitted but not confirmed open, or an informal unimproved spot. */
  | 'unconfirmed'

/** Whether the water at a site leads anywhere. */
export type RouteOut =
  /** Clear run to the inlet with no fixed bridges reported. */
  | 'open'
  /** Fixed bridges sit between the site and open water — irrelevant paddling, decisive for a powerboat. */
  | 'bridged'
  /** Boats leave by travel lift rather than under their own power. */
  | 'lift'
  /** No outlet at all. */
  | 'closed'

/**
 * How well sourced a claim is. Published on the page next to the claim itself.
 *
 * Agencies move launches, close concessions, and change fees without updating
 * the marketing sites that describe them, so a guide that presents a single
 * brokerage page with the same confidence as a county parks page is the guide
 * that eventually embarrasses the agent on a showing.
 */
export type Sourcing =
  /** The managing agency or association states it on its own site or documents. */
  | 'confirmed'
  /** Two or more independent sources agree. */
  | 'corroborated'
  /** One marketing page or listing remark and nothing else. A lead, not a fact. */
  | 'single'

export interface SourceLink {
  label: string
  href: string
}

export interface LaunchSite {
  /** Stable key. Also the map marker's `data-launch` value and the list anchor id. */
  id: string
  /** Index shown in the marker and beside the entry. Ordered by section, not by rank. */
  n: number
  name: string
  /** Managing agency and municipality, e.g. "Town of Jupiter" or "Palm Beach County". */
  operator: string
  address: string
  lat: number
  lng: number
  /**
   * True when lat/lng were published by a source, false when derived from a
   * mapped address. Rendered as a caveat rather than hidden, because a pin
   * that is confidently wrong sends someone to the wrong side of a bridge.
   */
  coordsPublished: boolean
  kind: LaunchKind
  route: RouteOut
  sourcing: Sourcing
  /** 'tidal' = everyday salt water, 'wild' = the Wild & Scenic run, 'other' = destinations and unconfirmed sites. */
  group: 'tidal' | 'wild' | 'other'
  free: boolean
  /** Suitable for a first-timer on a calm morning. Drives the "calm / beginner" filter. */
  beginnerFriendly: boolean
  water: string
  launch: string
  parking: string
  hours: string
  /** Current, traffic, and anything that could ruin someone's morning. */
  conditions: string
  /** Restrooms, rentals, showers, what else is on site. */
  onSite: string
  /** Two or three sentences of why this launch is worth knowing. */
  description: string
  /** What this launch means to someone shopping for a house nearby. */
  buyerAngle: string
  sources: SourceLink[]
}

/** What a resident of a community can actually do with the water. */
export type AccessTier =
  /** Kayak or SUP storage racks, or a purpose-built paddlecraft launch. */
  | 'racks'
  /** A dock, ramp, or shoreline any resident can use. */
  | 'shared'
  /** Docks belong to individual waterfront lots. Buy the wrong house, get a view. */
  | 'lot'
  /** Marina access is a separate purchase or lease, not a residency right. */
  | 'slip'

export interface PaddleCommunity {
  id: string
  name: string
  town: string
  /** 'north' = Jupiter and Tequesta, 'south' = Palm Beach Gardens, Juno Beach, North Palm Beach. */
  area: 'north' | 'south'
  tier: AccessTier
  /** Who may use the access, in as few words as fit a table cell. */
  openTo: string
  water: string
  route: RouteOut
  sourcing: Sourcing
  housing: string
  /** The source's own words. Quoted on the page so the reader can weigh the claim themselves. */
  quote: string
  detail: string
  /**
   * The caveat that would otherwise surface at the worst possible moment —
   * a bridge clearance, a landlocked basin, a second association, a fee.
   */
  flag: string
  sources: SourceLink[]
}

/**
 * Communities with water and no paddling value.
 *
 * These are published, not omitted. A buyer who has been told "River Ridge has
 * kayaking" needs to hear why that is a landlocked lake before they write an
 * offer, and being the page that says so is worth more than being the page with
 * the longest list.
 */
export interface ExcludedCommunity {
  name: string
  town: string
  why: string
  /** Set for the ones whose branding actively misleads — rendered with more emphasis. */
  notable?: boolean
}

/** A public launch that anchors the southern half of the market. */
export interface PublicAnchor {
  name: string
  where: string
  note: string
}
