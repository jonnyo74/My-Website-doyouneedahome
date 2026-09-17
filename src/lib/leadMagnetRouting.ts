// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTUAL LEAD-MAGNET ROUTING
//
// One page gets one primary offer. This module is the only place that decides
// which one, so a community page, a blog post, the mobile sticky bar and the
// exit-intent modal can never disagree with each other.
//
// Priority, highest first:
//   1. Treasure Coast geography  → that county's own market report
//      Martin County    (Stuart, Palm City, Hobe Sound, Port Salerno)
//                       → Martin County Market Report
//      St. Lucie County (Port St. Lucie)
//                       → St. Lucie County Market Report
//      A county report that is unpublished falls back to the Relocation
//      Decision Guide. A Martin page never gets the St. Lucie report or the
//      reverse, and neither ever gets a Palm Beach County report — each
//      describes a different county.
//   2. Relocation intent          → Relocation Decision Guide
//      (cost of living, city-vs-city, pros and cons, who should move here,
//      moving/relocating content.)
//   3. Condo due-diligence intent → Florida Condo Due-Diligence Checklist
//      (condo/townhome content that is also about the building: high-rise,
//      oceanfront condo, HOA, association, assessments, buying a condo.)
//   4. Everything else            → Palm Beach County Market Report
//      (one report covers both property types.)
//
// One named exception sits above all of these: Jupiter Island is a Martin County
// town that communities.ts files as a Jupiter neighborhood, so its page offers
// both the Martin County and the Palm Beach County report, as a picker.
//
// Kept literal and dependency-free on purpose: the sitewide client component
// imports it, and pulling the article or community datasets in would ship the
// whole content library to the browser.
// ─────────────────────────────────────────────────────────────────────────────

import { leadMagnets, type LeadMagnetSelection } from '@/lib/leadMagnets'

// ── Geography ────────────────────────────────────────────────────────────────
// Mirrors CITY_REGIONS in articles.ts ('Martin County' / 'St. Lucie County')
// and the region: 'Treasure Coast' communities in communities.ts. If a Treasure
// Coast city is added there, add its slug to the right county here too — a
// region: 'Treasure Coast' community whose slug is in neither list gets the
// Relocation Decision Guide rather than a guessed county.

const MARTIN_COUNTY_CITY_SLUGS = ['stuart', 'palm-city', 'hobe-sound', 'port-salerno'] as const

const ST_LUCIE_COUNTY_CITY_SLUGS = ['port-st-lucie'] as const

type TreasureCoastCounty = 'martin' | 'st-lucie'

/** Which Treasure Coast county a city slug belongs to, if any. */
function treasureCoastCountyForCity(
  citySlug: string | undefined,
): TreasureCoastCounty | undefined {
  if (!citySlug) return undefined
  if (MARTIN_COUNTY_CITY_SLUGS.some((slug) => slug === citySlug)) return 'martin'
  if (ST_LUCIE_COUNTY_CITY_SLUGS.some((slug) => slug === citySlug)) return 'st-lucie'
  return undefined
}

/**
 * The slug as a whole hyphen/slash-delimited run of the path, so 'palm-city'
 * matches /communities/palm-city and /blog/cost-of-living-in-palm-city-florida
 * but not a longer, unrelated slug that merely contains those letters.
 */
function pathContainsSlug(pathname: string, slug: string): boolean {
  return new RegExp(`(^|[/-])${slug}([/-]|$)`).test(pathname)
}

/**
 * Path-based equivalent for the sitewide sticky bar and exit-intent offer,
 * which only know the pathname. Blog and community URLs both embed the city
 * slug (/blog/cost-of-living-in-stuart-florida, /communities/hobe-sound).
 * Martin is checked first; no current URL names a city from both counties.
 */
function treasureCoastCountyForPath(pathname: string): TreasureCoastCounty | undefined {
  if (MARTIN_COUNTY_CITY_SLUGS.some((slug) => pathContainsSlug(pathname, slug))) return 'martin'
  if (ST_LUCIE_COUNTY_CITY_SLUGS.some((slug) => pathContainsSlug(pathname, slug))) return 'st-lucie'
  return undefined
}

/** Jupiter Island: Martin County geography, filed under Jupiter. */
const TWO_COUNTY_COMMUNITY_SLUGS = ['jupiter-island'] as const

function isTwoCountyCommunity(slug: string | undefined): boolean {
  return !!slug && TWO_COUNTY_COMMUNITY_SLUGS.some((s) => s === slug)
}

function twoCountyMagnet(): LeadMagnetSelection {
  return leadMagnets['martin-county-market-report'].published
    ? 'martin-and-palm-beach-county'
    : 'palm-beach-county-market-report'
}

/**
 * What a Treasure Coast page gets: its own county's report. If that report is
 * ever unpublished, the page falls back to the Relocation Decision Guide — never
 * to the other county's report, and never to a Palm Beach County report.
 */
function countyMagnet(county: TreasureCoastCounty | undefined): LeadMagnetSelection {
  const key =
    county === 'martin'
      ? 'martin-county-market-report'
      : county === 'st-lucie'
        ? 'st-lucie-county-market-report'
        : undefined
  return key && leadMagnets[key].published ? key : 'relocation-decision-guide'
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
 * This is what separates rule 3 (due-diligence checklist) from rule 4 (market
 * report): "condos in Delray Beach" is a market question, "buying a high-rise
 * oceanfront condo" is a building question.
 */
const CONDO_DILIGENCE_RE =
  /due[-\s]diligence|\bhoa\b|homeowners? association|condo association|\bassociation\b|special assessment|\bassessments?\b|\breserves?\b|milestone inspection|structural integrity|estoppel|buyer'?s guide|\bbuying a condo\b|condo buyer|high[-\s]?rise|oceanfront condo|condo building|condo fees|rental restriction/gi

function countMatches(re: RegExp, text: string): number {
  re.lastIndex = 0
  return (text.match(re) ?? []).length
}

/**
 * Classify arbitrary Palm Beach County page text. The due-diligence checklist
 * needs condo signals to clearly dominate (no single-family signals, or at
 * least 3x as many) plus a building-level signal; everything that is neither
 * that nor relocation content gets the Palm Beach County Market Report.
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

  return 'palm-beach-county-market-report'
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
  if (isTwoCountyCommunity(community.slug)) return twoCountyMagnet()

  const county = treasureCoastCountyForCity(citySlug ?? community.slug)
  if (county || community.region === 'Treasure Coast') {
    return countyMagnet(county)
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
  const county = treasureCoastCountyForCity(article.citySlug)
  if (county) return countyMagnet(county)
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
  if (TWO_COUNTY_COMMUNITY_SLUGS.some((slug) => pathname === `/communities/${slug}`)) {
    return twoCountyMagnet()
  }
  const county = treasureCoastCountyForPath(pathname)
  if (county) return countyMagnet(county)
  return selectMagnetFromText(pathname.replace(/[-/]/g, ' '))
}

// ── Sitewide suppression ─────────────────────────────────────────────────────
// Pages that already carry their own form or CTAs, plus conversion pages where
// an interruption would hurt more than help.

const EXCLUDED_PATH_PREFIXES = [
  '/contact',
  '/sell', // /sell and /sell/[agent] both run the valuation funnel
  // Standalone listing microsite — carries its own showing-request form, and a
  // market-report interruption would undercut a $2.8M conversion page.
  '/listings/8804-skyward-street',
  ...Object.values(leadMagnets).map((m) => m.landingPage),
]

/** True on pages the sitewide sticky bar and exit-intent offer must skip. */
export function isGlobalOfferExcluded(pathname: string): boolean {
  return EXCLUDED_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
