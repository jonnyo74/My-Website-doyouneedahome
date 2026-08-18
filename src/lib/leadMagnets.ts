// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL LEAD-MAGNET REGISTRY
//
// Every downloadable offer on the site is one entry in `leadMagnets` below.
// CTAs, the modal, the landing-page template, the sitemap, the download API and
// the FUB payload all read from here — adding an offer means adding a record,
// not writing a component.
//
// Two kinds of magnet, distinguished by `kind`:
//   'market-report' — dated, replaced on a schedule, carries MLS statistics.
//                     `edition` / `dataMonth` matter and appear in the copy.
//   'guide'         — evergreen. `edition` is a year label, `dataMonth` unused.
//
// `published: false` takes a magnet completely out of circulation: it is never
// routed onto a page, never appears in the sitemap, and its landing page 404s
// in production (it still renders in `next dev` so the flow can be tested).
// That is how a magnet whose content is not yet verified gets built without
// shipping placeholder numbers.
//
// Monthly market-report update checklist lives in MARKET-REPORTS.md.
// ─────────────────────────────────────────────────────────────────────────────

import relocationGuide from '@/content/relocation-guide.json'
import condoDueDiligence from '@/content/condo-due-diligence.json'
import treasureCoastMarket from '@/content/treasure-coast-market.json'

export type LeadMagnetKey =
  | 'single-family'
  | 'condo-townhome'
  | 'treasure-coast-market-report'
  | 'relocation-decision-guide'
  | 'condo-due-diligence'

/**
 * What a CTA or the sitewide layer decided to offer. 'pbc-both' is the one
 * multi-magnet value: a general Palm Beach County page where the property type
 * is genuinely ambiguous shows the two county reports side by side and lets the
 * visitor pick. Everything else resolves to exactly one magnet.
 */
export type LeadMagnetSelection = LeadMagnetKey | 'pbc-both'

export interface ReportStat {
  value: string
  label: string
  sub?: string
}

export interface ReportFaq {
  q: string
  a: string
}

export interface LeadMagnetSection {
  heading: string
  intro?: string
  items: Array<{ title: string; body: string }>
}

export interface LeadMagnet {
  /** Stable key. Used in /api/reports/[reportType], analytics, and storage. */
  key: LeadMagnetKey
  /** Unique per edition — the lead-magnet id recorded in FUB notes + analytics. */
  id: string
  kind: 'market-report' | 'guide'
  title: string
  shortTitle: string
  /** Property-type / topic label shown on cards. */
  category: string
  /** Publication label: 'July 2026' for reports, '2026 Edition' for guides. */
  edition: string
  /** Market reports only — the month the underlying MLS data covers. */
  dataMonth?: string
  /** Source line printed under any statistics, e.g. 'BeachesMLS, June 2026'. */
  dataAttribution?: string
  /** PDF filename inside private/reports/ (never publicly served). */
  fileName: string
  coverImage: string
  coverImageLarge: string
  coverAlt: string
  /** Exact tag applied to the lead in Follow Up Boss. */
  crmTag: string
  landingPage: string
  /** Small uppercase label above a CTA headline. */
  ctaEyebrow: string
  ctaHeadline: string
  ctaDescription: string
  /** Primary button label used by every CTA and the modal's submit button. */
  ctaButtonLabel: string
  benefits: string[]
  keyStats: ReportStat[]
  /** Landing-page hero subheadline. */
  subheadline: string
  metaTitle: string
  metaDescription: string
  /** One-paragraph crawlable summary on the landing page. */
  summary: string
  /** Heading above `summary` — 'What the June 2026 Numbers Say' etc. */
  summaryHeading: string
  takeaways: string[]
  /** Two audience columns on the landing page (buyer/seller, or equivalent). */
  audienceColumns: [
    { heading: string; points: string[] },
    { heading: string; points: string[] },
  ]
  /** Extra crawlable body sections rendered between the takeaways and the FAQ. */
  sections?: LeadMagnetSection[]
  faqs: ReportFaq[]
  internalLinks: Array<{ label: string; href: string }>
  /** Shown at the foot of the landing page and under any statistics. */
  disclaimer?: string
  /**
   * The logical next thing to offer someone who already downloaded this magnet.
   * Replaces the repeat offer in CTAs and the mobile sticky bar.
   */
  nextStep: { headline: string; description: string; label: string; href: string }
  /** false = not routed, not in the sitemap, landing page 404s in production. */
  published: boolean
}

/** Publication month of the current Palm Beach County reports. */
export const REPORT_EDITION = 'August 2026'
/** The month the Palm Beach County MLS statistics actually cover. */
export const REPORT_DATA_MONTH = 'July 2026'
/** Year label carried by the evergreen guides. */
export const GUIDE_EDITION = '2026 Edition'
/** Publication month of the current Treasure Coast report. */
export const TREASURE_COAST_EDITION = 'August 2026'
/** The month the Martin / St. Lucie statistics actually cover. */
export const TREASURE_COAST_DATA_MONTH = 'July 2026'

// Counts printed on the guide landing pages and covers are derived from the
// content files so they can never drift out of sync with what is actually in
// the PDF.
const RELOCATION_AREA_COUNT = relocationGuide.areas.length
const RELOCATION_CATEGORY_COUNT = relocationGuide.categories.length
const CONDO_SECTION_COUNT = condoDueDiligence.sections.length
const CONDO_RED_FLAG_COUNT = condoDueDiligence.redFlags.length
const CONDO_DOCUMENT_COUNT =
  condoDueDiligence.sections.find((s) => s.heading.startsWith('Documents to Review'))?.items
    .length ?? 0
const CONDO_QUESTION_COUNT =
  condoDueDiligence.sections.find((s) => s.heading.startsWith('Questions to Ask'))?.items.length ??
  0

/** True while the Treasure Coast report has no verified MLS data behind it. */
export const TREASURE_COAST_DATA_PENDING = treasureCoastMarket.dataStatus === 'awaiting-data'

export const leadMagnets: Record<LeadMagnetKey, LeadMagnet> = {
  // ───────────────────────────────────────────────────────────────────────────
  'single-family': {
    key: 'single-family',
    id: 'pbc-single-family-report-2026-08',
    kind: 'market-report',
    title: 'Palm Beach County Single Family Home Market Report',
    shortTitle: 'Single Family Home Report',
    category: 'Single Family Homes',
    edition: REPORT_EDITION,
    dataMonth: REPORT_DATA_MONTH,
    dataAttribution: `${REPORT_DATA_MONTH} Palm Beach County market data (BeachesMLS)`,
    fileName: 'pbc-single-family-home-market-report-august-2026.pdf',
    coverImage: '/images/reports/single-family-cover.webp',
    coverImageLarge: '/images/reports/single-family-cover-lg.webp',
    coverAlt:
      'Cover of the Palm Beach County Single Family Home Market Report, August 2026 Edition, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - PBC Single Family Market Report',
    landingPage: '/palm-beach-county-single-family-home-market-report',
    ctaEyebrow: `Free ${REPORT_EDITION} Market Report`,
    ctaHeadline: `Get the ${REPORT_EDITION} Single Family Home Market Report`,
    ctaDescription:
      'Home prices, inventory, sales activity, buyer demand, and negotiating conditions across Palm Beach County — in one free PDF.',
    ctaButtonLabel: 'Download the Free Report',
    benefits: [
      'Median price, closed sales, and inventory trends with year-over-year context',
      'What the numbers mean if you are selling — and if you are buying',
      'The negotiating windows to watch through fall 2026',
    ],
    keyStats: [
      { value: '$660,090', label: 'Median Sale Price', sub: '+7.6% year over year' },
      { value: '1,336', label: 'Closed Sales', sub: '+12.7% year over year' },
      { value: '3.7', label: 'Months of Inventory', sub: 'down from 5.5' },
      { value: '41', label: 'Median Days to Contract' },
    ],
    subheadline:
      'See what is happening with home prices, inventory, sales activity, buyer demand, and negotiating conditions across Palm Beach County.',
    metaTitle: `Palm Beach County Single Family Home Market Report (${REPORT_EDITION}) | Free PDF`,
    metaDescription: `Free ${REPORT_EDITION} Palm Beach County single family home market report: $660,090 median price, 1,336 closed sales, 3.7 months of inventory. ${REPORT_DATA_MONTH} MLS data — instant download.`,
    summaryHeading: `What the ${REPORT_DATA_MONTH} Numbers Say`,
    summary:
      "Palm Beach County's single family home market carried its momentum into July 2026. Closed sales rose 12.7% over July 2025 while active inventory fell 23.3% — a combination that lifted the median sale price to $660,090, up 7.6% year over year. At 3.7 months of supply, down from 5.5, the single family market remains firmly in seller's-market territory, yet sellers still received 95.1% of original list price on average, which means buyers retain real room to negotiate on well-chosen homes.",
    takeaways: [
      'The median single family home sold for $660,090 — $46,840 more than in July 2025.',
      'Closed sales rose 12.7% year over year to 1,336 while active inventory declined 23.3%.',
      'At 3.7 months of supply (down from 5.5), conditions firmly favor sellers.',
      'Roughly 41% of closings were all-cash — up 24.4% from a year ago.',
      'The median home went under contract in 41 days, five days faster than a year ago.',
    ],
    audienceColumns: [
      {
        heading: "If You're Buying",
        points: [
          'Understand what 3.7 months of supply means for your offer strategy — and why waiting has a measurable cost.',
          'See why late summer is historically the best negotiating window before seasonal demand returns in October.',
          'Learn how to compete when nearly half of buyers are paying cash.',
        ],
      },
      {
        heading: "If You're Selling",
        points: [
          'Benchmark your home against the strongest seller backdrop in several years.',
          'See why pricing to today’s comparables — not last year’s — captures the 12.7% rise in closed sales.',
          'Know what buyers are negotiating off asking price, and how preparation closes that gap.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What data is in the Palm Beach County Single Family Home Market Report?',
        a: 'The August 2026 edition covers July 2026 BeachesMLS market data for Palm Beach County single family homes: median sale price, closed sales, cash sales, list-price-received percentage, median days to contract, active inventory, and months of supply, each compared with July 2025 — plus plain-English guidance for buyers and sellers.',
      },
      {
        q: 'Is the report really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Is Palm Beach County a seller’s market for single family homes right now?',
        a: 'Based on July 2026 data published in the August 2026 report, yes — at 3.7 months of supply (a balanced market is roughly 5.5 months), single family homes are in seller’s-market territory, though sellers still conceded about 5% from original list price on average.',
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
    internalLinks: [
      { label: 'Buying in Palm Beach County', href: '/buy' },
      { label: 'Selling Your Home', href: '/sell' },
      { label: 'All Communities', href: '/communities' },
      { label: 'Jupiter Real Estate', href: '/communities/jupiter' },
      { label: 'Palm Beach Gardens Real Estate', href: '/communities/palm-beach-gardens' },
      { label: 'Wellington Real Estate', href: '/communities/wellington' },
      { label: 'West Palm Beach Real Estate', href: '/communities/west-palm-beach' },
      { label: 'Boca Raton Real Estate', href: '/communities/boca-raton' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    nextStep: {
      headline: 'You already have the single family report',
      description:
        'The next useful step is a shortlist built around your budget and the neighborhoods you are actually considering.',
      label: 'Request a Personalized Shortlist',
      href: '/contact',
    },
    published: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  'condo-townhome': {
    key: 'condo-townhome',
    id: 'pbc-condo-townhome-report-2026-08',
    kind: 'market-report',
    title: 'Palm Beach County Condo & Townhome Market Report',
    shortTitle: 'Condo & Townhome Report',
    category: 'Condos & Townhomes',
    edition: REPORT_EDITION,
    dataMonth: REPORT_DATA_MONTH,
    dataAttribution: `${REPORT_DATA_MONTH} Palm Beach County market data (BeachesMLS)`,
    fileName: 'pbc-condo-townhome-market-report-august-2026.pdf',
    coverImage: '/images/reports/condo-townhome-cover.webp',
    coverImageLarge: '/images/reports/condo-townhome-cover-lg.webp',
    coverAlt:
      'Cover of the Palm Beach County Condo & Townhome Market Report, August 2026 Edition, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - PBC Condo Market Report',
    landingPage: '/palm-beach-county-condo-townhome-market-report',
    ctaEyebrow: `Free ${REPORT_EDITION} Market Report`,
    ctaHeadline: `Get the ${REPORT_EDITION} Condo & Townhome Market Report`,
    ctaDescription:
      'Condo and townhome prices, inventory, cash activity, buyer leverage, and association concerns across Palm Beach County — in one free PDF.',
    ctaButtonLabel: 'Download the Free Report',
    benefits: [
      'Median price, closed sales, and inventory trends with year-over-year context',
      'Cash-buyer activity and what it signals about the pricing cycle',
      'HOA, milestone-inspection, and reserve-funding factors that now drive value',
    ],
    keyStats: [
      { value: '$312,500', label: 'Median Sale Price', sub: '+4.0% year over year' },
      { value: '914', label: 'Closed Sales', sub: '+18.5% year over year' },
      { value: '6.7', label: 'Months of Inventory', sub: 'down from 9.3' },
      { value: '57%', label: 'Of Sales Paid in Cash' },
    ],
    subheadline:
      'Condo and townhome prices, inventory, cash activity, and the association factors that now decide what a unit is worth across Palm Beach County.',
    metaTitle: `Palm Beach County Condo & Townhome Market Report (${REPORT_EDITION}) | Free PDF`,
    metaDescription: `Free ${REPORT_EDITION} Palm Beach County condo and townhome market report: $312,500 median price, 914 closed sales, 6.7 months of inventory. ${REPORT_DATA_MONTH} MLS data — instant download.`,
    summaryHeading: `What the ${REPORT_DATA_MONTH} Numbers Say`,
    summary:
      'The Palm Beach County condo and townhome market continued its turn in July 2026. Closed sales rose 18.5% over July 2025 and active inventory fell 19.3% — the clearest absorption yet of the supply that built up through 2024–2025. The median sale price rose 4% to $312,500, and 57% of closings were all-cash purchases. At 6.7 months of supply, down from 9.3, buyers still hold leverage, but the direction of travel now favors sellers — especially in buildings with completed milestone inspections and funded reserves.',
    takeaways: [
      'The median condo or townhome sold for $312,500 — up 4% from July 2025.',
      'Closed sales rose 18.5% year over year to 914 while active inventory declined 19.3%.',
      'Months of supply fell from 9.3 to 6.7 — still a buyer’s window, but a closing one.',
      '57% of purchases were all-cash, up 20.2% from a year ago.',
      'Sellers received 92.2% of original list price — nearly three points below what single family sellers achieved.',
      'Buildings with clean association paperwork are increasingly trading like a separate, stronger market.',
    ],
    audienceColumns: [
      {
        heading: "If You're Buying",
        points: [
          'See why this is the best buyer’s window in Palm Beach County right now — and why the data says it is starting to close.',
          'Know what sellers are conceding from original list price, and where your leverage is strongest.',
          'Get the HOA, reserve-funding, and special-assessment questions to ask before you write an offer.',
        ],
      },
      {
        heading: "If You're Selling",
        points: [
          'Understand what the 18.5% jump in closed sales means for your pricing strategy.',
          'See the profile shared by the units that are actually selling in a 6.7-month-supply market.',
          'Learn why milestone inspections, funded reserves, and stable HOA fees now command a premium.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What data is in the Palm Beach County Condo & Townhome Market Report?',
        a: 'The August 2026 edition covers July 2026 BeachesMLS market data for Palm Beach County townhouses and condos: median sale price, closed sales, cash sales, list-price-received percentage, median days to contract, active inventory, and months of supply, each compared with July 2025 — plus buyer and seller guidance and an association-health checklist.',
      },
      {
        q: 'Is the report really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Is it a buyer’s market for Palm Beach County condos right now?',
        a: 'Based on July 2026 data published in the August 2026 report, yes — 6.7 months of supply still gives buyers choice and negotiating room. But inventory is down 19.3% year over year and sales are accelerating, so that leverage is shrinking.',
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
    internalLinks: [
      { label: 'Buying in Palm Beach County', href: '/buy' },
      { label: 'Condo Buyer’s Due-Diligence Checklist', href: '/florida-condo-buyers-due-diligence-checklist' },
      { label: 'Selling Your Home', href: '/sell' },
      { label: 'All Communities', href: '/communities' },
      { label: 'West Palm Beach Real Estate', href: '/communities/west-palm-beach' },
      { label: 'Singer Island Real Estate', href: '/communities/singer-island' },
      { label: 'Boca Raton Real Estate', href: '/communities/boca-raton' },
      { label: 'Delray Beach Real Estate', href: '/communities/delray-beach' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    nextStep: {
      headline: 'You already have the condo & townhome report',
      description:
        'The building matters more than the unit. Send us the address and we will tell you what we know about the association before you write an offer.',
      label: 'Ask a Condo-Building Question',
      href: '/contact',
    },
    published: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  'relocation-decision-guide': {
    key: 'relocation-decision-guide',
    id: 'pbc-treasure-coast-relocation-guide-2026',
    kind: 'guide',
    title: 'Palm Beach County vs. the Treasure Coast: 2026 Relocation Decision Guide',
    shortTitle: 'Relocation Decision Guide',
    category: 'Relocation',
    edition: GUIDE_EDITION,
    fileName: 'palm-beach-county-treasure-coast-relocation-decision-guide-2026.pdf',
    coverImage: '/images/reports/relocation-guide-cover.webp',
    coverImageLarge: '/images/reports/relocation-guide-cover-lg.webp',
    coverAlt:
      'Cover of the Palm Beach County vs. the Treasure Coast 2026 Relocation Decision Guide, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - Relocation Decision Guide',
    landingPage: '/palm-beach-county-treasure-coast-relocation-guide',
    ctaEyebrow: 'Free Relocation Decision Guide',
    ctaHeadline: 'Palm Beach County or the Treasure Coast?',
    ctaDescription: `A side-by-side comparison of ${RELOCATION_AREA_COUNT} areas we actually work in — from Boca Raton to Port St. Lucie — across ${RELOCATION_CATEGORY_COUNT} things that decide where you should live.`,
    ctaButtonLabel: 'Find the Area That Fits Your Life',
    benefits: [
      `All ${RELOCATION_AREA_COUNT} areas compared on price range, water access, golf, 55+, new construction, HOAs, healthcare and airport access`,
      'The honest trade-off for each area — what you give up, not just what you get',
      'Shortcuts from your one non-negotiable to a shortlist of two or three areas',
    ],
    keyStats: [
      { value: String(RELOCATION_AREA_COUNT), label: 'Areas Compared' },
      { value: String(RELOCATION_CATEGORY_COUNT), label: 'Decision Categories' },
      { value: '3', label: 'Counties Covered', sub: 'Palm Beach, Martin, St. Lucie' },
      { value: '$0', label: 'Cost, and No Obligation' },
    ],
    subheadline:
      'Jupiter or Stuart. Palm Beach Gardens or Palm City. Delray Beach or Port St. Lucie. This guide puts the areas we work in side by side so you can see what each one actually trades away.',
    metaTitle:
      'Palm Beach County vs. Treasure Coast: 2026 Relocation Decision Guide | Free PDF',
    metaDescription: `Free 2026 relocation guide comparing ${RELOCATION_AREA_COUNT} Palm Beach County and Treasure Coast areas — Jupiter, Palm Beach Gardens, Stuart, Hobe Sound, Palm City, Port St. Lucie and more — on price, water access, golf, 55+, HOAs, healthcare and commute. Instant download.`,
    summaryHeading: 'The Decision Most People Are Actually Making',
    summary:
      'Almost everyone who calls us about relocating is choosing between two versions of the same life: the coastal, more expensive, better-connected version in northern Palm Beach County, and the quieter, roomier, further-out version on the Treasure Coast. The trade is consistent. Moving north buys you more house, more land and more waterfront per dollar, plus the Martin County school district and Cleveland Clinic hospitals. It costs you proximity — PBI Airport goes from fifteen or thirty minutes away to an hour. This guide lays out every area we work in against the same set of questions so you can see where your own priorities land, instead of guessing from a map.',
    takeaways: [
      `${RELOCATION_AREA_COUNT} areas across Palm Beach, Martin and St. Lucie counties, compared on the same ${RELOCATION_CATEGORY_COUNT} questions.`,
      'Price ranges by property type for every area — condos, single-family, gated, waterfront, golf and 55+.',
      'Which areas actually have dockage, which have private clubs, and which have neither.',
      'Where you can still buy without an HOA, and where you cannot.',
      'Hospital and airport access for each area, because those two things quietly decide a lot of moves.',
      'The specific trade-off each area asks you to accept — written the way we would tell a client.',
    ],
    audienceColumns: [
      {
        heading: 'If You Are Moving From Out of State',
        points: [
          'See the whole service area at once instead of piecing it together from fourteen separate city pages.',
          'Understand what "an hour from West Palm Beach" means in practice before you rule an area in or out.',
          'Learn which trade-offs are permanent (geography, zoning, county lines) and which are just this year.',
        ],
      },
      {
        heading: 'If You Already Live Here',
        points: [
          'Compare what your budget buys one county north — the gap is larger than most people expect.',
          'See where the school district, the dock, or the club you want actually exists.',
          'Find the two or three areas worth a Saturday, so you are not spending six weekends narrowing it down.',
        ],
      },
    ],
    sections: relocationGuide.shortlists,
    faqs: [
      {
        q: 'Which areas does the relocation guide cover?',
        a: 'Fourteen: Jupiter, Palm Beach Gardens, West Palm Beach, Boca Raton, Delray Beach, Wellington, North Palm Beach, Juno Beach and Tequesta in Palm Beach County; Stuart, Hobe Sound, Palm City and Port Salerno in Martin County; and Port St. Lucie in St. Lucie County. These are the markets we work in — it is not a generic Florida guide.',
      },
      {
        q: 'What is actually compared?',
        a: 'Home price ranges by property type, coastal versus inland setting, boating and waterfront access, golf and private-club living, 55+ options, new construction, HOA versus non-HOA living, healthcare access, airport and transportation access, general pace and community character, which buyer each area fits best, and the trade-off each one asks you to accept.',
      },
      {
        q: 'Where do the numbers come from?',
        a: 'The price ranges are the same asking-price ranges published on our community pages for each area, and the hospital and drive-time details come from the same pages. They are ranges for orientation, not MLS medians — for current sale statistics, see our Palm Beach County market reports.',
      },
      {
        q: 'Is the guide really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Is Palm Beach County or the Treasure Coast better?',
        a: 'Neither, and any guide that answers that question for you is selling something. Palm Beach County wins on proximity, transit and amenity density. The Treasure Coast wins on price per square foot, land, and pace, and Martin County has its own well-regarded school district. The guide is built to help you work out which side of that trade you are on.',
      },
    ],
    internalLinks: [
      { label: 'All Communities', href: '/communities' },
      { label: 'Jupiter Real Estate', href: '/communities/jupiter' },
      { label: 'Palm Beach Gardens Real Estate', href: '/communities/palm-beach-gardens' },
      { label: 'Stuart Real Estate', href: '/communities/stuart' },
      { label: 'Hobe Sound Real Estate', href: '/communities/hobe-sound' },
      { label: 'Palm City Real Estate', href: '/communities/palm-city' },
      { label: 'Port St. Lucie Real Estate', href: '/communities/port-st-lucie' },
      { label: 'Buying a Home', href: '/buy' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    disclaimer:
      'Price ranges in this guide are the asking-price ranges published on our community pages, provided for orientation only. They are not appraisals, not MLS medians, and not a prediction of what any specific home will sell for. School district boundaries, HOA rules, club membership requirements and insurance costs vary by property and change over time — verify anything that will affect your decision for the specific address you are considering.',
    nextStep: {
      headline: 'You already have the relocation guide',
      description:
        'The fastest next step is a conversation. Tell us the two or three areas you narrowed it down to and we will tell you what the guide could not.',
      label: 'Schedule a Relocation Consultation',
      href: '/contact',
    },
    published: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  'condo-due-diligence': {
    key: 'condo-due-diligence',
    id: 'florida-condo-due-diligence-checklist-2026',
    kind: 'guide',
    title: 'Florida Condo Buyer’s Due-Diligence and Red-Flag Checklist',
    shortTitle: 'Condo Due-Diligence Checklist',
    category: 'Condo Buyers',
    edition: GUIDE_EDITION,
    fileName: 'florida-condo-buyers-due-diligence-checklist-2026.pdf',
    coverImage: '/images/reports/condo-due-diligence-cover.webp',
    coverImageLarge: '/images/reports/condo-due-diligence-cover-lg.webp',
    coverAlt:
      'Cover of the Florida Condo Buyer’s Due-Diligence and Red-Flag Checklist, 2026 Edition, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - Florida Condo Due Diligence',
    landingPage: '/florida-condo-buyers-due-diligence-checklist',
    ctaEyebrow: 'Free Condo Buyer’s Checklist',
    ctaHeadline: 'Check the Building Before You Buy the Unit',
    ctaDescription: `${CONDO_SECTION_COUNT} sections of documents to request and questions to ask — reserves, assessments, milestone inspections, insurance, financing, rental rules — plus ${CONDO_RED_FLAG_COUNT} red flags worth walking away from.`,
    ctaButtonLabel: 'Check the Building Before You Buy the Unit',
    benefits: [
      'Every association document to request, and what you are actually looking for in each one',
      `${CONDO_QUESTION_COUNT} questions to ask before you make an offer — not after`,
      `${CONDO_RED_FLAG_COUNT} red flags that should slow a purchase down`,
    ],
    keyStats: [
      { value: String(CONDO_SECTION_COUNT), label: 'Checklist Sections' },
      { value: String(CONDO_DOCUMENT_COUNT), label: 'Documents to Request' },
      { value: String(CONDO_QUESTION_COUNT), label: 'Questions Before You Offer' },
      { value: String(CONDO_RED_FLAG_COUNT), label: 'Red Flags to Watch' },
    ],
    subheadline:
      'In Florida, the association is half the purchase. This is the checklist we walk our own condo buyers through — the documents to request, what to look for in each, and the questions to ask while you can still walk away.',
    metaTitle: 'Florida Condo Buyer’s Due-Diligence & Red-Flag Checklist | Free PDF',
    metaDescription:
      'Free Florida condo due-diligence checklist: association financials, reserves, milestone inspections, special assessments, insurance, financing eligibility, litigation, rental and pet rules, transfer fees, and the questions to ask before you make an offer.',
    summaryHeading: 'Why the Building Matters More Than the Unit',
    summary:
      'Two identical units on the same street can be very different purchases. One sits in a building with funded reserves, a completed structural inspection and stable dues. The other sits in a building carrying a loan, an inspection it has not scheduled, and a board discussing an assessment in minutes nobody sent you. The unit tour tells you nothing about which is which — the association’s paperwork does. This checklist is the sequence we use with our own condo buyers: what to request, what to look for in it, what to ask before making an offer, and what should make you slow down.',
    takeaways: [
      'The association’s financial statements, reserve schedule and meeting minutes tell you more about your future cost than the unit does.',
      'Reserves that are waived or minimally funded do not remove a cost — they move it into your future as an assessment.',
      'Tell your lender the building name before you write the offer. In a condo purchase the building has to qualify too.',
      'Ask about assessments twice: one already levied, and one being discussed but not yet voted.',
      'Rental and pet rules, buyer approval, and one-time transfer costs are the most common post-closing surprises, and all are verifiable in advance.',
      'Every item here is a question for the association’s own documents and your own professionals — not a substitute for them.',
    ],
    audienceColumns: [
      {
        heading: 'If You Are Buying',
        points: [
          'Work through the list in order and you will know more about the building than most owners in it.',
          'Ask the financing question first — it is the most common avoidable reason a condo deal falls apart.',
          'Use the review period deliberately: request everything in writing and date-stamp what you received.',
        ],
      },
      {
        heading: 'If You Are Selling a Condo',
        points: [
          'Every item a buyer will ask for is an item you can have ready before you list.',
          'Buildings with clean, complete, quickly produced paperwork are trading differently from buildings without it.',
          'Knowing your association’s weak spot in advance lets you price and position for it instead of discovering it in escrow.',
        ],
      },
    ],
    sections: condoDueDiligence.sections.slice(0, 4),
    faqs: [
      {
        q: 'What does the condo due-diligence checklist cover?',
        a: 'Association financial documents, budgets and reserves, structural and milestone inspection documentation, special assessments, association insurance, your own unit-owner insurance considerations, financing and building eligibility, pending litigation, rental restrictions, pet restrictions, application and approval requirements, capital contributions and transfer fees, maintenance responsibilities, the questions to ask before making an offer, and the documents to review during your contractual review period.',
      },
      {
        q: 'Is this legal advice?',
        a: 'No. It is general information for buyers — a list of documents to request and questions to ask. It is not legal, financial, tax, insurance, engineering or inspection advice, and it does not replace a Florida real estate attorney, your lender, a licensed insurance agent, or a licensed inspector. Requirements differ by building, age, county and municipality, and they change.',
      },
      {
        q: 'When should I use it?',
        a: 'Start before you make an offer — the financing question and the dues, assessment and rule questions can all be asked while you are still shopping. Then use the document list during your contractual review period, and give your attorney time to actually read what arrives.',
      },
      {
        q: 'Does it apply outside Palm Beach County?',
        a: 'The document and question list applies to Florida condominium purchases generally. Specific inspection, disclosure and approval requirements vary by building and by local jurisdiction, so confirm what applies to your building with the association and your attorney.',
      },
      {
        q: 'Is the checklist really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
    ],
    internalLinks: [
      { label: 'Buying a Home', href: '/buy' },
      { label: 'Palm Beach County Condo & Townhome Market Report', href: '/palm-beach-county-condo-townhome-market-report' },
      { label: 'West Palm Beach Real Estate', href: '/communities/west-palm-beach' },
      { label: 'Singer Island Real Estate', href: '/communities/singer-island' },
      { label: 'Juno Beach Real Estate', href: '/communities/juno-beach' },
      { label: 'Boca Raton Real Estate', href: '/communities/boca-raton' },
      { label: 'Delray Beach Real Estate', href: '/communities/delray-beach' },
      { label: 'All Communities', href: '/communities' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    disclaimer: condoDueDiligence.disclaimer,
    nextStep: {
      headline: 'You already have the due-diligence checklist',
      description:
        'Send us the building you are considering. We will tell you what we know about it, and what we would ask the association first.',
      label: 'Ask a Condo-Building Question',
      href: '/contact',
    },
    published: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // First edition published August 2026 from the BeachesMLS July 2026 Market
  // Snapshots for Martin and St. Lucie counties. Every figure lives in
  // src/content/treasure-coast-market.json — update that file, regenerate the
  // PDF and cover, and bump `edition` / `dataMonth` / `id` here.
  'treasure-coast-market-report': {
    key: 'treasure-coast-market-report',
    id: 'treasure-coast-market-report-2026-08',
    kind: 'market-report',
    title: 'Treasure Coast Real Estate Market Report',
    shortTitle: 'Treasure Coast Market Report',
    category: 'Martin & St. Lucie Counties',
    edition: TREASURE_COAST_EDITION,
    dataMonth: TREASURE_COAST_DATA_MONTH,
    dataAttribution: `${TREASURE_COAST_DATA_MONTH} Martin County and St. Lucie County market data (BeachesMLS)`,
    fileName: 'treasure-coast-real-estate-market-report.pdf',
    coverImage: '/images/reports/treasure-coast-cover.webp',
    coverImageLarge: '/images/reports/treasure-coast-cover-lg.webp',
    coverAlt:
      'Cover of the Treasure Coast Real Estate Market Report covering Martin and St. Lucie counties, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - Treasure Coast Market Report',
    landingPage: '/treasure-coast-real-estate-market-report',
    ctaEyebrow: `Free ${TREASURE_COAST_EDITION} Treasure Coast Market Report`,
    ctaHeadline: 'Get the Treasure Coast Market Report',
    ctaDescription:
      'Martin and St. Lucie county prices, inventory, closed sales, days to contract and negotiating conditions — single-family and condo, in one free PDF.',
    ctaButtonLabel: 'Get the Treasure Coast Market Report',
    benefits: [
      'Separate Martin County and St. Lucie County sections',
      'Single-family and condo/townhome figures where the data supports them',
      'Plain-English guidance for buyers and for sellers on both sides of the county line',
    ],
    keyStats: [
      { value: '$599,900', label: 'Martin County Median', sub: 'single family, +4.3% year over year' },
      { value: '$394,995', label: 'St. Lucie County Median', sub: 'single family, +2.6% year over year' },
      { value: '3.7', label: 'Martin Months of Supply', sub: 'down from 5.6' },
      { value: '4.9', label: 'St. Lucie Months of Supply', sub: 'down from 5.7' },
    ],
    subheadline:
      'Stuart, Palm City, Hobe Sound, Port Salerno and Port St. Lucie sit in a different county and a different market from Palm Beach County. This report covers them on their own terms.',
    metaTitle: `Treasure Coast Real Estate Market Report (${TREASURE_COAST_EDITION}) | Martin & St. Lucie`,
    metaDescription: `Free ${TREASURE_COAST_EDITION} Treasure Coast market report: Martin County single family median $599,900 at 3.7 months of supply, St. Lucie $394,995 at 4.9 months. ${TREASURE_COAST_DATA_MONTH} BeachesMLS data for both counties — instant download.`,
    summaryHeading: 'Martin and St. Lucie, on Their Own Terms',
    summary:
      'The Treasure Coast is not a cheaper version of Palm Beach County — it is a different market moving on its own cycle. In July 2026 both counties tightened. Martin County single family closings rose 23.4% while inventory fell 21.3%, taking months of supply from 5.6 to 3.7 and the median to $599,900. St. Lucie moved more gently — closings up 2.4%, supply down from 5.7 to 4.9 months, median $394,995 — but its sellers received 96% of original list price, the strongest figure in either county. Condos are the split story: supply fell hard in both counties, yet Martin’s median dropped 10.7% while St. Lucie’s rose 13.3%, on 77 and 82 closings respectively. This report covers each county separately so the numbers you are reading describe the market you are actually buying or selling in.',
    takeaways: [
      'Martin County single family: median $599,900 (+4.3%), 211 closings (+23.4%), 3.7 months of supply — down from 5.6.',
      'St. Lucie County single family: median $394,995 (+2.6%), 517 closings (+2.4%), 4.9 months of supply — down from 5.7.',
      'Inventory fell in all four segments, by 8.2% to 21.3% year over year.',
      'St. Lucie single family sellers received 96% of original list price — the strongest in either county; Martin condo sellers received 92.2%, the weakest.',
      'St. Lucie single family is the one segment where time moved toward buyers: 63 median days to contract, up from 52.',
      'Two of every three Martin County condo closings were all-cash, and just over half of St. Lucie’s.',
      'St. Lucie condos at 7.8 months of supply are the last clear buyer’s window — down from 10.6 a year ago.',
    ],
    audienceColumns: [
      {
        heading: 'If You Are Buying',
        points: [
          'See Martin and St. Lucie inventory and negotiating conditions separately, rather than inferring them from Palm Beach County.',
          'Understand where the two counties are in their own cycle.',
          'Know what sellers are conceding from asking price on this side of the county line.',
        ],
      },
      {
        heading: 'If You Are Selling',
        points: [
          'Benchmark against your own county, not the county to the south.',
          'See how long comparable homes are taking to go under contract.',
          'Understand which property types are absorbing and which are sitting.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which areas does the Treasure Coast Market Report cover?',
        a: 'Martin County — including Stuart, Palm City, Hobe Sound and Port Salerno — and St. Lucie County, including Port St. Lucie. It is a single combined report with a separate section for each county.',
      },
      {
        q: 'Why is this separate from the Palm Beach County reports?',
        a: 'Because it is a different market. Martin and St. Lucie counties are a different MLS from Palm Beach County, and their prices, inventory and pace do not track Palm Beach County’s. Offering a Palm Beach County report to a Stuart buyer would be giving them the wrong county’s numbers.',
      },
      {
        q: 'Does it cover condos as well as houses?',
        a: 'It covers single-family homes for both counties, and condos and townhomes where the sample size supports reliable figures. Where it does not, the report says so rather than publishing a number built on a handful of sales.',
      },
      {
        q: 'How often is it updated?',
        a: 'Monthly, alongside the Palm Beach County reports. Each edition is prepared by Christine Dekant and John Oliver of DO Homes Group from the latest BeachesMLS market snapshot for Martin and St. Lucie counties.',
      },
      {
        q: 'Why does the report caution about the condo medians?',
        a: 'Because the samples are small. Martin County recorded 77 condo and townhouse closings in July 2026 and St. Lucie 82, so which buildings and price tiers happened to trade in a given month can move the median on its own. The report reads those medians alongside inventory, months of supply and percent of original list price received rather than treating them as a standalone signal.',
      },
    ],
    internalLinks: [
      { label: 'Stuart Real Estate', href: '/communities/stuart' },
      { label: 'Palm City Real Estate', href: '/communities/palm-city' },
      { label: 'Hobe Sound Real Estate', href: '/communities/hobe-sound' },
      { label: 'Port Salerno Real Estate', href: '/communities/port-salerno' },
      { label: 'Port St. Lucie Real Estate', href: '/communities/port-st-lucie' },
      { label: 'Relocation Decision Guide', href: '/palm-beach-county-treasure-coast-relocation-guide' },
      { label: 'Buying a Home', href: '/buy' },
      { label: 'Selling Your Home', href: '/sell' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    nextStep: {
      headline: 'You already have the Treasure Coast report',
      description:
        'Tell us the town and the property type you are focused on and we will send a shortlist that matches.',
      label: 'Request a Personalized Shortlist',
      href: '/contact',
    },
    published: !TREASURE_COAST_DATA_PENDING,
  },
}

export const allLeadMagnets: LeadMagnet[] = Object.values(leadMagnets)

/** Every magnet that may be routed onto a page, linked, or listed in the sitemap. */
export const publishedLeadMagnets: LeadMagnet[] = allLeadMagnets.filter((m) => m.published)

/** The two Palm Beach County market reports, in the order the picker shows them. */
export const pbcReports: LeadMagnet[] = [
  leadMagnets['single-family'],
  leadMagnets['condo-townhome'],
]

export function isLeadMagnetKey(value: string | undefined): value is LeadMagnetKey {
  return !!value && Object.prototype.hasOwnProperty.call(leadMagnets, value)
}

export function getLeadMagnet(key: LeadMagnetKey): LeadMagnet {
  return leadMagnets[key]
}

/** Resolve a selection to the magnets it offers — one, or the two PBC reports. */
export function magnetsForSelection(selection: LeadMagnetSelection): LeadMagnet[] {
  return selection === 'pbc-both' ? pbcReports : [leadMagnets[selection]]
}

/** API path that streams the PDF (tokenized — issued by /api/leads on success). */
export function magnetDownloadApiPath(key: LeadMagnetKey): string {
  return `/api/reports/${key}`
}

/** Up to `limit` other published magnets, for the "also available" rail. */
export function relatedMagnets(key: LeadMagnetKey, limit = 2): LeadMagnet[] {
  return publishedLeadMagnets.filter((m) => m.key !== key).slice(0, limit)
}
