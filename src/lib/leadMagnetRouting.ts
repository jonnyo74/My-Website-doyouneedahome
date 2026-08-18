// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTUAL LEAD-MAGNET ROUTING
//
// One page gets one primary offer. This module is the only place that decides
// which one, so a community page, a blog post, the mobile sticky bar and the
// exit-intent modal can never disagree with each other.
//
// Priority, highest first:
//   1. Treasure Coast geography  → Treasure Coast Market Report
//      (falls back to the Relocation Decision Guide while that report is
//      unpublished — a Palm Beach County report is never offered here, because
//      it describes a different county and a different MLS.)
//   2. Relocation intent          → Relocation Decision Guide
//      (cost of living, city-vs-city, pros and cons, who should move here,
//      moving/relocating content.)
//   3. Condo due-diligence intent → Florida Condo Due-Diligence Checklist
//      (condo/townhome content that is also about the building: high-rise,
//      oceanfront condo, HOA, association, assessments, buying a condo.)
//   4. General PBC single-family  → PBC Single Family Home Market Report
//   5. General PBC condo          → PBC Condo & Townhome Market Report
//   Ambiguous Palm Beach County   → 'pbc-both' (the two county reports, picker)
//
// Kept literal and dependency-free on purpose: the sitewide client component
// imports it, and pulling the article or community datasets in would ship the
// whole content library to the browser.
// ─────────────────────────────────────────────────────────────────────────────

import { leadMagnets, type LeadMagnetSelection } from '@/lib/leadMagnets'

// ── Geography ────────────────────────────────────────────────────────────────
// Mirrors the 'Treasure Coast' entries in REGION_GROUP / CITY_REGIONS in
// articles.ts and the region: 'Treasure Coast' communities in communities.ts.
// If a Treasure Coast city is added there, add its slug here too.

const TREASURE_COAST_CITY_SLUGS = [
  'stuart',
  'palm-city',
  'hobe-sound',
  'port-salerno',
  'port-st-lucie',
] as const

/** True when this city sits in Martin or St. Lucie county, not Palm Beach. */
export function isTreasureCoastCity(citySlug: string | undefined): boolean {
  return !!citySlug && TREASURE_COAST_CITY_SLUGS.some((slug) => slug === citySlug)
}

/**
 * Path-based equivalent for the sitewide sticky bar and exit-intent offer,
 * which only know the pathname. Blog and community URLs both embed the city
 * slug (/blog/cost-of-living-in-stuart-florida, /communities/hobe-sound).
 */
export function isTreasureCoastPath(pathname: string): boolean {
  return TREASURE_COAST_CITY_SLUGS.some((slug) => pathname.includes(slug))
}

/**
 * What a Treasure Coast page gets. Once the Treasure Coast report has verified
 * Martin / St. Lucie data and `published` flips to true, every Treasure Coast
 * page switches to it automatically — nothing else has to change.
 */
function treasureCoastMagnet(): LeadMagnetSelection {
  return leadMagnets['treasure-coast-market-report'].published
    ? 'treasure-coast-market-report'
    : 'relocation-decision-guide'
}

// ── Intent signals ───────────────────────────────────────────────────────────

const RELOCATION_RE =
  /\brelocat|\bmoving to\b|\bmove to\b|should (i|you|we) move|who should move|cost of living|\bvs\.?\b|\bversus\b|pros and cons|compare|comparison|best place to live|is .{0,30}a good place to live|living in|new to (the )?(area|florida)|snowbird|out[-\s]of[-\s]state/gi

const CONDO_RE =
  /\bcondos?\b|\bcondominiums?\b|\btown\s?homes?\b|\btownhouses?\b|high[-\s]?rise|condo building|downtown condo|waterfront condo|oceanfront condo|55\+/gi

const SINGLE_FAMILY_RE =
  /single[-\s]?family|\bhouses?\b|\bestates?\b|gated communit|golf communit|equestrian|waterfront home|luxury home|new[-\s]construction home|\bneighborhoods?\b|\bsubdivisions?\b|acreage/gi

/**
 * Condo content that is about the *building* rather than the neighborhood.
 * This is what separates rule 3 (due-diligence checklist) from rule 5 (condo
 * market report): "condos in Delray Beach" is a market question, "buying a
 * high-rise oceanfront condo" is a building question.
 */
const CONDO_DILIGENCE_RE =
  /due[-\s]diligence|\bhoa\b|homeowners? association|condo association|\bassociation\b|special assessment|\bassessments?\b|\breserves?\b|milestone inspection|structural integrity|estoppel|buyer'?s guide|\bbuying a condo\b|condo buyer|high[-\s]?rise|oceanfront condo|condo building|condo fees|rental restriction/gi

function countMatches(re: RegExp, text: string): number {
  re.lastIndex = 0
  return (text.match(re) ?? []).length
}

/**
 * Classify arbitrary Palm Beach County page text into one of the county
 * offers. A property-type side must clearly dominate (the other absent, or at
 * least 3x the signals) — otherwise both county reports are offered and the
 * visitor picks.
 */
export function selectMagnetFromText(text: string): LeadMagnetSelection {
  // "real estate" would otherwise count as an "estate" (single-family) signal.
  const cleaned = text.replace(/real\s+estate/gi, '')

  if (countMatches(RELOCATION_RE, cleaned) > 0) return 'relocation-decision-guide'

  const condo = countMatches(CONDO_RE, cleaned)
  const sfh = countMatches(SINGLE_FAMILY_RE, cleaned)
  const condoDominant = condo > 0 && (sfh === 0 || condo >= sfh * 3)

  if (condoDominant && countMatches(CONDO_DILIGENCE_RE, cleaned) > 0) {
    return 'condo-due-diligence'
  }

  if (condo === 0 && sfh === 0) return 'pbc-both'
  if (sfh === 0) return 'condo-townhome'
  if (condo === 0) return 'single-family'
  if (condo >= sfh * 3) return 'condo-townhome'
  if (sfh >= condo * 3) return 'single-family'
  return 'pbc-both'
}

// ── Entry points ─────────────────────────────────────────────────────────────

interface CommunityLike {
  type?: string
  slug?: string
  region?: string
  name: string
  description?: string
  metaTitle?: string
  priceRanges?: Array<{ type: string; propertyTypes?: string[] }>
}

/**
 * Community pages classify on name + meta title + description (plus price-range
 * rows for neighborhoods). `citySlug` is the parent city for a neighborhood, so
 * a neighborhood inside Stuart is routed as Treasure Coast too.
 */
export function selectMagnetForCommunity(
  community: CommunityLike,
  citySlug?: string,
): LeadMagnetSelection {
  if (
    community.region === 'Treasure Coast' ||
    isTreasureCoastCity(citySlug ?? community.slug)
  ) {
    return treasureCoastMagnet()
  }

  const nameAndTitle = `${community.name} ${community.metaTitle ?? ''}`
  if (community.type === 'City') {
    return selectMagnetFromText(`${nameAndTitle} ${community.description ?? ''}`)
  }
  const priceRangeText = (community.priceRanges ?? [])
    .map((pr) => `${pr.type} ${(pr.propertyTypes ?? []).join(' ')}`)
    .join(' ')
  return selectMagnetFromText(
    `${nameAndTitle} ${community.description ?? ''} ${priceRangeText}`,
  )
}

/**
 * Blog articles classify on title / type / keywords only — article bodies
 * mention both property types too often to be a reliable signal. The article
 * `type` is the strongest relocation signal we have ("Cost Of Living In",
 * "Pros And Cons Of Living In", "Who Should Move To", "City vs Nearby Cities").
 */
export function selectMagnetForArticle(article: {
  h1: string
  citySlug?: string
  type?: string
  primaryKeyword?: string
  secondaryKeywords?: string[]
  metaTitle?: string
}): LeadMagnetSelection {
  if (isTreasureCoastCity(article.citySlug)) return treasureCoastMagnet()
  return selectMagnetFromText(
    [
      article.h1,
      article.type ?? '',
      article.metaTitle ?? '',
      article.primaryKeyword ?? '',
      (article.secondaryKeywords ?? []).join(' '),
    ].join(' '),
  )
}

/** URL-based fallback used by the sitewide sticky CTA and exit-intent offer. */
export function selectMagnetForPath(pathname: string): LeadMagnetSelection {
  if (isTreasureCoastPath(pathname)) return treasureCoastMagnet()
  return selectMagnetFromText(pathname.replace(/[-/]/g, ' '))
}

// ── Sitewide suppression ─────────────────────────────────────────────────────
// Pages that already carry their own form or CTAs, plus conversion pages where
// an interruption would hurt more than help.

const EXCLUDED_PATH_PREFIXES = [
  '/contact',
  '/sell', // /sell and /sell/[agent] both run the valuation funnel
  ...Object.values(leadMagnets).map((m) => m.landingPage),
]

/** True on pages the sitewide sticky bar and exit-intent offer must skip. */
export function isGlobalOfferExcluded(pathname: string): boolean {
  return EXCLUDED_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
