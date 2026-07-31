// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL MARKET-REPORT CONFIGURATION
//
// This file is the single place to update when a new month's reports arrive.
// Monthly update checklist:
//   1. Drop the two new PDFs into  private/reports/
//   2. Update `fileName`, `edition`, `dataMonth`, `id`, `keyStats`,
//      `takeaways`, and `marketSummary` below for each report.
//   3. Update the REPORTS list in scripts/generate-report-covers.mjs to the new
//      filenames, then run:  node scripts/generate-report-covers.mjs
//   4. Delete the previous month's PDFs from private/reports/ (optional).
// Every CTA, modal, landing page, and the download API read from this file —
// nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────

export type ReportType = 'single-family' | 'condo-townhome'
export type ReportSelection = ReportType | 'both'

export interface ReportStat {
  value: string
  label: string
  sub?: string
}

export interface ReportFaq {
  q: string
  a: string
}

export interface MarketReport {
  /** Unique per edition — used as the lead-magnet id in FUB notes + analytics */
  id: string
  type: ReportType
  title: string
  shortTitle: string
  /** Property-type category label shown on cards */
  category: string
  /** Month the report was published */
  edition: string
  /** Month the underlying MLS data covers */
  dataMonth: string
  /** PDF filename inside private/reports/ (never publicly served) */
  fileName: string
  coverImage: string
  coverImageLarge: string
  coverAlt: string
  /** Exact tag applied to the lead in Follow Up Boss */
  crmTag: string
  landingPage: string
  ctaHeadline: string
  ctaDescription: string
  benefits: string[]
  keyStats: ReportStat[]
  /** One-paragraph crawlable market summary used on the landing page */
  marketSummary: string
  /** "Key takeaways" bullets on the landing page */
  takeaways: string[]
  buyerPoints: string[]
  sellerPoints: string[]
  faqs: ReportFaq[]
}

/** Publication month of the current reports — used in CTA copy sitewide. */
export const REPORT_EDITION = 'July 2026'
/** The month the MLS statistics actually cover. Always cite stats as this. */
export const REPORT_DATA_MONTH = 'June 2026'

export const marketReports: Record<ReportType, MarketReport> = {
  'single-family': {
    id: 'pbc-single-family-report-2026-07',
    type: 'single-family',
    title: 'Palm Beach County Single Family Home Market Report',
    shortTitle: 'Single Family Home Report',
    category: 'Single Family Homes',
    edition: REPORT_EDITION,
    dataMonth: REPORT_DATA_MONTH,
    fileName: 'pbc-single-family-home-market-report-july-2026.pdf',
    coverImage: '/images/reports/single-family-cover.webp',
    coverImageLarge: '/images/reports/single-family-cover-lg.webp',
    coverAlt:
      'Cover of the Palm Beach County Single Family Home Market Report, July 2026 Edition, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - PBC Single Family Market Report',
    landingPage: '/palm-beach-county-single-family-home-market-report',
    ctaHeadline: 'Get the July 2026 Single Family Home Market Report',
    ctaDescription:
      'Home prices, inventory, sales activity, buyer demand, and negotiating conditions across Palm Beach County — in one free PDF.',
    benefits: [
      'Median price, closed sales, and inventory trends with year-over-year context',
      'What the numbers mean if you are selling — and if you are buying',
      'The negotiating windows to watch through fall 2026',
    ],
    keyStats: [
      { value: '$700,000', label: 'Median Sale Price', sub: '+11.8% year over year' },
      { value: '1,482', label: 'Closed Sales', sub: '+24.9% year over year' },
      { value: '3.9', label: 'Months of Inventory', sub: 'down from 5.7' },
      { value: '42', label: 'Median Days to Contract' },
    ],
    marketSummary:
      "Palm Beach County's single family home market posted one of its strongest months in years in June 2026. Closed sales jumped 24.9% over June 2025 while active inventory fell 23.6% — a combination that pushed the median sale price to $700,000, up 11.8% year over year. At 3.9 months of supply, the single family market has moved firmly into seller's-market territory, yet sellers still received 94.7% of original list price on average, which means buyers retain real room to negotiate on well-chosen homes.",
    takeaways: [
      'The median single family home sold for $700,000 — $74,000 more than in June 2025.',
      'Closed sales surged 24.9% year over year to 1,482 while active inventory declined 23.6%.',
      'At 3.9 months of supply (down from 5.7), conditions now firmly favor sellers.',
      'Roughly 44% of closings were all-cash — up 32.7% from a year ago.',
      'The median home went under contract in 42 days, giving buyers time for real diligence.',
    ],
    buyerPoints: [
      'Understand what 3.9 months of supply means for your offer strategy — and why waiting has a measurable cost.',
      'See why summer is historically the best negotiating window before seasonal demand returns in October.',
      'Learn how to compete when nearly half of buyers are paying cash.',
    ],
    sellerPoints: [
      'Benchmark your home against the strongest seller backdrop in several years.',
      'See why pricing to today’s comparables — not last year’s — captures the surge in closed sales.',
      'Know what buyers are negotiating off asking price, and how preparation closes that gap.',
    ],
    faqs: [
      {
        q: 'What data is in the Palm Beach County Single Family Home Market Report?',
        a: 'The July 2026 edition covers June 2026 BeachesMLS market data for Palm Beach County single family homes: median sale price, closed sales, cash sales, list-price-received percentage, median days to contract, active inventory, and months of supply, each compared with June 2025 — plus plain-English guidance for buyers and sellers.',
      },
      {
        q: 'Is the report really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Is Palm Beach County a seller’s market for single family homes right now?',
        a: 'Based on June 2026 data published in the July 2026 report, yes — at 3.9 months of supply (a balanced market is roughly 5.5 months), single family homes are in seller’s-market territory, though sellers still conceded about 5% from original list price on average.',
      },
      {
        q: 'How often is the report updated?',
        a: 'Monthly. Each edition is prepared by Christine Dekant and John Oliver of DO Homes Group using the latest BeachesMLS market snapshot for Palm Beach County.',
      },
      {
        q: 'Who prepares the report?',
        a: 'Christine Dekant and John Oliver, REALTORS® with DO Homes Group at Premier Brokers International in Palm Beach Gardens, serving buyers and sellers across Palm Beach County and the Treasure Coast.',
      },
    ],
  },
  'condo-townhome': {
    id: 'pbc-condo-townhome-report-2026-07',
    type: 'condo-townhome',
    title: 'Palm Beach County Condo & Townhome Market Report',
    shortTitle: 'Condo & Townhome Report',
    category: 'Condos & Townhomes',
    edition: REPORT_EDITION,
    dataMonth: REPORT_DATA_MONTH,
    fileName: 'pbc-condo-townhome-market-report-july-2026.pdf',
    coverImage: '/images/reports/condo-townhome-cover.webp',
    coverImageLarge: '/images/reports/condo-townhome-cover-lg.webp',
    coverAlt:
      'Cover of the Palm Beach County Condo & Townhome Market Report, July 2026 Edition, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - PBC Condo Market Report',
    landingPage: '/palm-beach-county-condo-townhome-market-report',
    ctaHeadline: 'Get the July 2026 Condo & Townhome Market Report',
    ctaDescription:
      'Condo and townhome prices, inventory, cash activity, buyer leverage, and association concerns across Palm Beach County — in one free PDF.',
    benefits: [
      'Median price, closed sales, and inventory trends with year-over-year context',
      'Cash-buyer activity and what it signals about the pricing cycle',
      'HOA, milestone-inspection, and reserve-funding factors that now drive value',
    ],
    keyStats: [
      { value: '$325,000', label: 'Median Sale Price', sub: '+3.2% year over year' },
      { value: '974', label: 'Closed Sales', sub: '+18.6% year over year' },
      { value: '7.2', label: 'Months of Inventory', sub: 'down from 9.7' },
      { value: '59%', label: 'Of Sales Paid in Cash' },
    ],
    marketSummary:
      'The Palm Beach County condo and townhome market showed clear signs of a turn in June 2026. Closed sales rose 18.6% over June 2025 and active inventory fell 19% — the first sustained absorption of the supply that built up through 2024–2025. The median sale price edged up 3.2% to $325,000, and nearly 59% of closings were all-cash purchases. At 7.2 months of supply, buyers still hold leverage, but the direction of travel now favors sellers — especially in buildings with completed milestone inspections and funded reserves.',
    takeaways: [
      'The median condo or townhome sold for $325,000 — up 3.2% from June 2025.',
      'Closed sales rose 18.6% year over year to 974 while active inventory declined 19%.',
      'Months of supply fell from 9.7 to 7.2 — still a buyer’s window, but a closing one.',
      'Nearly 59% of purchases were all-cash, up 23.3% from a year ago.',
      'Buildings with clean association paperwork are increasingly trading like a separate, stronger market.',
    ],
    buyerPoints: [
      'See why this is the best buyer’s window in Palm Beach County right now — and why the data says it is starting to close.',
      'Know what sellers are conceding from original list price, and where your leverage is strongest.',
      'Get the HOA, reserve-funding, and special-assessment questions to ask before you write an offer.',
    ],
    sellerPoints: [
      'Understand what the 18.6% jump in closed sales means for your pricing strategy.',
      'See the profile shared by the units that are actually selling in a 7.2-month-supply market.',
      'Learn why milestone inspections, funded reserves, and stable HOA fees now command a premium.',
    ],
    faqs: [
      {
        q: 'What data is in the Palm Beach County Condo & Townhome Market Report?',
        a: 'The July 2026 edition covers June 2026 BeachesMLS market data for Palm Beach County townhouses and condos: median sale price, closed sales, cash sales, list-price-received percentage, median days to contract, active inventory, and months of supply, each compared with June 2025 — plus buyer and seller guidance and an association-health checklist.',
      },
      {
        q: 'Is the report really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Is it a buyer’s market for Palm Beach County condos right now?',
        a: 'Based on June 2026 data published in the July 2026 report, yes — 7.2 months of supply still gives buyers choice and negotiating room. But inventory is down 19% year over year and sales are accelerating, so that leverage is shrinking.',
      },
      {
        q: 'Why does the report talk about HOAs and milestone inspections?',
        a: 'Because they now drive condo values in Florida. Buildings with completed milestone inspections, funded reserves, and stable fees are commanding a clear premium, and lenders scrutinize association health. The report explains what to check as a buyer or prepare as a seller.',
      },
      {
        q: 'How often is the report updated?',
        a: 'Monthly. Each edition is prepared by Christine Dekant and John Oliver of DO Homes Group using the latest BeachesMLS market snapshot for Palm Beach County.',
      },
    ],
  },
}

export const allReports: MarketReport[] = [
  marketReports['single-family'],
  marketReports['condo-townhome'],
]

/** API path that streams the PDF (tokenized — issued by /api/leads on success). */
export function reportDownloadApiPath(type: ReportType): string {
  return `/api/reports/${type}`
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT-SELECTION LOGIC
//
// Condo signals win the condo report, single-family signals win the SFH
// report, and anything ambiguous shows BOTH reports rather than guessing.
// ─────────────────────────────────────────────────────────────────────────────

const CONDO_RE =
  /\bcondos?\b|\bcondominiums?\b|\btown\s?homes?\b|\btownhouses?\b|high[-\s]?rise|condo building|downtown condo|waterfront condo|oceanfront condo|55\+/gi

const SINGLE_FAMILY_RE =
  /single[-\s]?family|\bhouses?\b|\bestates?\b|gated communit|golf communit|equestrian|waterfront home|luxury home|new[-\s]construction home|\bneighborhoods?\b|\bsubdivisions?\b|acreage/gi

function countMatches(re: RegExp, text: string): number {
  re.lastIndex = 0
  return (text.match(re) ?? []).length
}

/**
 * Classify arbitrary page text. A side must clearly dominate (the other side
 * absent, or at least 3× the signals) — otherwise show both reports.
 */
export function selectReportFromText(text: string): ReportSelection {
  // "real estate" would otherwise count as an "estate" (single-family) signal.
  const cleaned = text.replace(/real\s+estate/gi, '')
  const condo = countMatches(CONDO_RE, cleaned)
  const sfh = countMatches(SINGLE_FAMILY_RE, cleaned)
  if (condo === 0 && sfh === 0) return 'both'
  if (sfh === 0) return 'condo-townhome'
  if (condo === 0) return 'single-family'
  if (condo >= sfh * 3) return 'condo-townhome'
  if (sfh >= condo * 3) return 'single-family'
  return 'both'
}

// ─────────────────────────────────────────────────────────────────────────────
// GEOGRAPHIC COVERAGE
//
// Both reports are built from Palm Beach County BeachesMLS data. The Treasure
// Coast cities we cover sit in Martin and St. Lucie counties — a different
// county and a different MLS — so a PBC report does not describe the market a
// reader on those pages is looking at. Every report CTA is suppressed there
// rather than offering numbers for the wrong county.
//
// Mirrors the 'Treasure Coast' entries in REGION_GROUP / CITY_REGIONS in
// articles.ts. Held as a literal here so the sitewide client component doesn't
// have to pull the full article dataset into the browser bundle. If a Treasure
// Coast city is added to CITY_REGIONS, add its slug here too.
// ─────────────────────────────────────────────────────────────────────────────

const UNCOVERED_CITY_SLUGS = [
  'stuart',
  'palm-city',
  'hobe-sound',
  'port-salerno',
  'port-st-lucie',
] as const

/** True when the reports actually describe this city's market. */
export function reportsCoverCity(citySlug: string): boolean {
  return !UNCOVERED_CITY_SLUGS.some((slug) => slug === citySlug)
}

/**
 * Path-based equivalent for the sitewide sticky bar and exit-intent offer,
 * which only know the pathname. Blog and community URLs both embed the city
 * slug (/blog/cost-of-living-in-stuart-florida, /communities/hobe-sound).
 */
export function reportsCoverPath(pathname: string): boolean {
  return !UNCOVERED_CITY_SLUGS.some((slug) => pathname.includes(slug))
}

interface CommunityLike {
  type?: string
  name: string
  description?: string
  metaTitle?: string
  priceRanges?: Array<{ type: string; propertyTypes?: string[] }>
}

/**
 * Community pages classify on name + meta title + description (plus price-range
 * rows for neighborhoods). The 3× dominance rule in selectReportFromText keeps
 * mixed cities on 'both' — e.g. a barrier island described as "high-rise
 * oceanfront condos" gets the condo report, an equestrian/gated-community town
 * gets single family, and a general coastal city shows both.
 */
export function selectReportForCommunity(community: CommunityLike): ReportSelection {
  const nameAndTitle = `${community.name} ${community.metaTitle ?? ''}`
  if (community.type === 'City') {
    return selectReportFromText(`${nameAndTitle} ${community.description ?? ''}`)
  }
  const priceRangeText = (community.priceRanges ?? [])
    .map((pr) => `${pr.type} ${(pr.propertyTypes ?? []).join(' ')}`)
    .join(' ')
  return selectReportFromText(`${nameAndTitle} ${community.description ?? ''} ${priceRangeText}`)
}

/**
 * Blog articles: classify on title/keywords only — article bodies mention both
 * property types too often to be a reliable signal.
 */
export function selectReportForArticle(article: {
  h1: string
  primaryKeyword?: string
  secondaryKeywords?: string[]
  metaTitle?: string
}): ReportSelection {
  return selectReportFromText(
    `${article.h1} ${article.metaTitle ?? ''} ${article.primaryKeyword ?? ''} ${(article.secondaryKeywords ?? []).join(' ')}`,
  )
}

/** URL-based fallback used by the sitewide sticky CTA and exit-intent offer. */
export function selectReportForPath(pathname: string): ReportSelection {
  return selectReportFromText(pathname.replace(/[-/]/g, ' '))
}
