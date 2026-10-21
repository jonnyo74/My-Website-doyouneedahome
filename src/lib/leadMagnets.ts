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

export type LeadMagnetKey =
  | 'palm-beach-county-market-report'
  | 'martin-county-market-report'
  | 'st-lucie-county-market-report'
  | 'relocation-decision-guide'
  | 'condo-due-diligence'

/**
 * What a CTA or the sitewide layer decided to offer. Everything resolves to
 * exactly one magnet except 'martin-and-palm-beach-county', which offers a pair
 * side by side and lets the visitor pick. It exists for Jupiter Island only: the
 * town is in Martin County, but the site files it as a Jupiter neighborhood.
 */
export type LeadMagnetSelection = LeadMagnetKey | MultiMagnetSelection
export type MultiMagnetSelection = 'martin-and-palm-beach-county'

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
  /**
   * Magnets for the landing page's "also free" rail. Omitted = the first other
   * published magnets in registry order.
   */
  related?: LeadMagnetKey[]
  /** false = not routed, not in the sitemap, landing page 404s in production. */
  published: boolean
}

/** Year label carried by the evergreen guides. */
export const GUIDE_EDITION = '2026 Edition'
/**
 * Publication month of the three county market reports (Palm Beach, Martin,
 * St. Lucie). The edition month and the data month are the same month.
 */
export const COUNTY_REPORT_EDITION = 'September 2026'
/** The month the county report statistics actually cover. */
export const COUNTY_REPORT_DATA_MONTH = 'September 2026'
/** Source line printed in all three county report PDFs. */
export const COUNTY_REPORT_SOURCE =
  'BeachesMLS (Broward, Palm Beaches & St. Lucie Realtors®), September 2026'

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

export const leadMagnets: Record<LeadMagnetKey, LeadMagnet> = {
  // ───────────────────────────────────────────────────────────────────────────
  // Built by scripts/pbc-county-report/ from data/pbc-market-2026-09.json, which
  // the landing-page tables also read. Replaces the two July-data Palm Beach
  // County reports (single-family and condo-townhome) — both property types are
  // in this one PDF. Past activity only: no predictions, no valuation claims.
  'palm-beach-county-market-report': {
    key: 'palm-beach-county-market-report',
    id: 'palm-beach-county-market-report-2026-09',
    kind: 'market-report',
    title: 'Palm Beach County Market Report',
    shortTitle: 'Palm Beach County Market Report',
    category: 'Palm Beach County',
    edition: COUNTY_REPORT_EDITION,
    dataMonth: COUNTY_REPORT_DATA_MONTH,
    dataAttribution: `${COUNTY_REPORT_DATA_MONTH} Palm Beach County market data (BeachesMLS)`,
    fileName: 'palm-beach-county-market-report-september-2026.pdf',
    coverImage: '/images/reports/palm-beach-county-cover.webp',
    coverImageLarge: '/images/reports/palm-beach-county-cover-lg.webp',
    coverAlt:
      'Cover of the Palm Beach County Market Report, September 2026, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - Palm Beach County Market Report',
    landingPage: '/palm-beach-county-market-report',
    ctaEyebrow: `Free — ${COUNTY_REPORT_DATA_MONTH} Palm Beach County Numbers`,
    ctaHeadline: 'What Palm Beach County Homes Actually Sold For',
    ctaDescription:
      `In ${COUNTY_REPORT_DATA_MONTH}, the typical house sold for $656,000 and went under contract in 43 days, at 94.7% of asking. Condos are a different market: 6.8 months of supply and 53 days. See both, and what each means for your offer or your asking price.`,
    ctaButtonLabel: 'Send Me the Numbers',
    benefits: [
      `What houses and condos actually sold for in ${COUNTY_REPORT_DATA_MONTH}, and how fast`,
      'How much sellers came down from asking — your room to negotiate',
      'How much is for sale now versus a year ago, so you can see who has the upper hand',
    ],
    keyStats: [
      { value: '$656,000', label: 'Single-Family Median', sub: '+6.7% year over year' },
      { value: '3.6', label: 'Single-Family Months of Supply', sub: 'down from 5.0' },
      { value: '$310,000', label: 'Condo/Townhome Median', sub: '+3.3% year over year' },
      { value: '6.8', label: 'Condo/Townhome Months of Supply', sub: 'down from 8.8' },
    ],
    subheadline:
      'Prices, inventory, pace and negotiating conditions across Palm Beach County, with single-family homes and condos/townhomes measured separately.',
    metaTitle: `Palm Beach County Real Estate Market Report | ${COUNTY_REPORT_EDITION}`,
    metaDescription:
      'Palm Beach County September 2026: single-family median $656,000 at 3.6 months of supply; condos/townhomes $310,000 at 6.8 months. Free PDF with year-over-year tables.',
    summaryHeading: `What the ${COUNTY_REPORT_DATA_MONTH} Numbers Say`,
    summary:
      'Single-family homes and condos/townhomes behaved like two different markets in Palm Beach County in September 2026. Single-family supply tightened from 5.0 to 3.6 months as active inventory fell 19.6% to 4,481, and median days to contract dropped from 51 to 43, even though closed sales slipped 2.7% to 1,132. The median sale price was $656,000, against $615,000 a year earlier, and the typical sale closed at 94.7% of original list price. That reads as seller-leaning. Condos and townhomes still leave more room to negotiate at 6.8 months of supply, with a median of 53 days to contract and sales closing at 93.2% of original list price, but inventory fell 15.3% and supply is down from 8.8 months, so that room is narrower than it was a year ago.',
    takeaways: [
      'Single-family: 1,132 closed sales (−2.7%), median $656,000 (+6.7%), 3.6 months of supply, down from 5.0.',
      'Single-family median days to contract fell from 51 to 43, and sales closed at 94.7% of original list price, up from 93.4%.',
      'Condo/townhome: 782 closed sales (−4.3%), median $310,000 (+3.3%), 6.8 months of supply, down from 8.8.',
      'Condo/townhome sales closed at 93.2% of original list price, with a median of 53 days to contract, down from 65.',
      'Active inventory fell 19.6% for single-family homes and 15.3% for condos and townhomes.',
      '44.7% of single-family and 61.1% of condo/townhome closings were paid in cash, calculated from the reported counts.',
    ],
    audienceColumns: [
      {
        heading: 'If You Are Buying',
        points: [
          'See how 3.6 months of single-family supply and a 43-day median contract time shape how ready you need to be.',
          'Understand the negotiating room 6.8 months of condo/townhome supply still gives buyers, and why it is narrower than a year ago.',
          'Base offers on what homes actually closed at relative to original list price, not on asking prices.',
        ],
      },
      {
        heading: 'If You Are Selling',
        points: [
          'Benchmark against Palm Beach County closings for your property type.',
          'See why the first list price matters when the typical sale closes below original list price in both segments.',
          'Know what serious condo buyers ask for first, and have it ready on day one.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What data is in the Palm Beach County Market Report?',
        a: 'September 2026 county-level figures for Palm Beach County single-family homes and condos/townhomes: closed sales, paid-in-cash sales, median sale price, percent of original list price received, median days to contract, active inventory and months of supply, each compared with September 2025, plus guidance for buyers and sellers. Source: BeachesMLS (Broward, Palm Beaches & St. Lucie Realtors®).',
      },
      {
        q: 'Does it include figures for my city or neighborhood?',
        a: 'No. Every figure is a Palm Beach County total. County numbers blend dozens of very different communities, and your street, building or neighborhood can be moving differently. For a specific area, we pull the recent closed sales and active competition there with you.',
      },
      {
        q: 'Does it cover condos as well as houses?',
        a: 'Yes. Single-family homes and condos/townhomes are reported separately, because in September 2026 they were behaving like two different markets: 3.6 months of supply for single-family homes against 6.8 for condos and townhomes.',
      },
      {
        q: 'Is the report really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Who prepares the report?',
        a: 'Christine Dekant and John Oliver, REALTORS® with DO Homes Group at Premier Brokers International, serving buyers and sellers across Palm Beach County and the Treasure Coast.',
      },
    ],
    internalLinks: [
      { label: 'Buying in Palm Beach County', href: '/buy' },
      { label: 'Selling Your Home', href: '/sell' },
      { label: 'All Communities', href: '/communities' },
      { label: 'Jupiter Real Estate', href: '/communities/jupiter' },
      { label: 'Palm Beach Gardens Real Estate', href: '/communities/palm-beach-gardens' },
      { label: 'West Palm Beach Real Estate', href: '/communities/west-palm-beach' },
      { label: 'Boca Raton Real Estate', href: '/communities/boca-raton' },
      { label: 'Condo Buyer’s Due-Diligence Checklist', href: '/florida-condo-buyers-due-diligence-checklist' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    disclaimer:
      'This report describes past market activity in Palm Beach County for the months shown. It is not an appraisal, a prediction of future prices, or financial, legal or investment advice. County-level medians do not reflect the value of any specific property. Cash-share percentages were calculated by DO Homes Group from the reported closed-sales and paid-in-cash counts. Information is believed reliable but not guaranteed. If your property is currently listed with a real estate broker, this is not intended as a solicitation of that listing.',
    nextStep: {
      headline: 'You already have the Palm Beach County report',
      description:
        'County numbers blend very different communities. Tell us the area or building you care about and we will pull the recent closed sales and active competition there.',
      label: 'Request Neighborhood Numbers',
      href: '/contact?from=palm-beach-county-market-report#contact-form',
    },
    related: ['relocation-decision-guide', 'condo-due-diligence'],
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
      'Almost everyone who calls us about relocating is choosing between two versions of the same life: the coastal, more expensive, better-connected version in northern Palm Beach County, and the quieter, roomier, further-out version on the Treasure Coast. The trade is consistent. Moving north buys you more house, more land and more waterfront per dollar, plus the Martin County school district and Cleveland Clinic hospitals. It costs you proximity — DJT Airport goes from fifteen or thirty minutes away to an hour. This guide lays out every area we work in against the same set of questions so you can see where your own priorities land, instead of guessing from a map.',
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
        a: 'The price ranges are the same asking-price ranges published on our community pages for each area, and the hospital and drive-time details come from the same pages. They are ranges for orientation, not MLS medians — for current sale statistics, see our county market reports.',
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
      href: '/contact?from=relocation-decision-guide#contact-form',
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
      { label: 'Palm Beach County Market Report', href: '/palm-beach-county-market-report' },
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
      href: '/contact?from=condo-due-diligence#contact-form',
    },
    published: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // The Martin and St. Lucie county reports. Every figure below comes from the
  // September 2026 data files the PDFs are built from — scripts/pbc-county-report/
  // data/{martin,st-lucie}-market-2026-09.json — and the landing-page tables
  // read those same files. Past activity only: no predictions, no valuation
  // claims. Both condo medians rest on small samples (90 and 91 closings) and
  // must never be presented as a blanket increase in condo values.
  'martin-county-market-report': {
    key: 'martin-county-market-report',
    id: 'martin-county-market-report-2026-09',
    kind: 'market-report',
    title: 'Martin County Market Report',
    shortTitle: 'Martin County Market Report',
    category: 'Martin County',
    edition: COUNTY_REPORT_EDITION,
    dataMonth: COUNTY_REPORT_DATA_MONTH,
    dataAttribution: `${COUNTY_REPORT_DATA_MONTH} Martin County market data (BeachesMLS)`,
    fileName: 'martin-county-market-report-september-2026.pdf',
    coverImage: '/images/reports/martin-county-cover.webp',
    coverImageLarge: '/images/reports/martin-county-cover-lg.webp',
    coverAlt:
      'Cover of the Martin County Market Report, September 2026, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - Martin County Market Report',
    landingPage: '/martin-county-market-report',
    ctaEyebrow: `Free — ${COUNTY_REPORT_DATA_MONTH} Martin County Numbers`,
    ctaHeadline: 'Martin County Houses Are Selling Three Weeks Faster',
    ctaDescription:
      `In ${COUNTY_REPORT_DATA_MONTH}, houses went under contract in 39 days, down from 62 a year ago, and what is for sale dropped by nearly a fifth. The typical house sold for $600,000. Every number is Martin County \u2014 Stuart, Palm City, Hobe Sound and Port Salerno \u2014 not Palm Beach County.`,
    ctaButtonLabel: 'Send Me the Numbers',
    benefits: [
      `What houses and condos actually sold for in ${COUNTY_REPORT_DATA_MONTH}, and how fast`,
      'How much sellers came down from asking — your room to negotiate',
      'Martin County only, never blended with Palm Beach County',
    ],
    keyStats: [
      { value: '$600,000', label: 'Single-Family Median', sub: '+5.3% year over year' },
      { value: '3.6', label: 'Single-Family Months of Supply', sub: 'down from 5.1' },
      { value: '39', label: 'Single-Family Days to Contract', sub: 'down from 62' },
      { value: '5.1', label: 'Condo/Townhome Months of Supply', sub: 'down from 7.9' },
    ],
    subheadline:
      'Stuart, Palm City, Hobe Sound, Port Salerno and the rest of Martin County, measured on their own county’s numbers rather than Palm Beach County’s.',
    metaTitle: `Martin County Real Estate Market Report | ${COUNTY_REPORT_EDITION}`,
    metaDescription:
      'Martin County September 2026: single-family median $600,000 at 3.6 months of supply; condos/townhomes at 5.1 months. Year-over-year tables in a free PDF.',
    summaryHeading: `What the ${COUNTY_REPORT_DATA_MONTH} Numbers Say`,
    summary:
      'Martin County recorded fewer active listings in September 2026 than a year earlier, for both property types. Single-family closed sales fell 4.0% to 168 while active inventory fell 18.1% to 682, taking months of supply from 5.1 to 3.6. Median days to contract dropped from 62 to 39, the typical sale closed at 94.6% of original list price, and the median sale price was $600,000, compared with $570,000 in September 2025. That combination reads as seller-leaning. Condos and townhomes are closer to balanced: supply fell from 7.9 to 5.1 months, the largest move in either property type, and sales closed at 92.3% of original list price, up from 89.0%. Closings rose 13.9% to 90, though median days to contract lengthened from 80 to 89. The condo/townhome median rose 8.0% to $237,500, but it rests on only 90 closings, so it reflects the mix of units that happened to sell rather than a change in what any particular condo is worth.',
    takeaways: [
      'Single-family: 168 closed sales (−4.0%), median $600,000 (+5.3%), 3.6 months of supply, down from 5.1.',
      'Single-family median days to contract fell from 62 to 39, and sales closed at 94.6% of original list price, up from 93.1%.',
      'Condo/townhome: 90 closed sales (+13.9%), 5.1 months of supply, down from 7.9, at 92.3% of original list price.',
      'The +8.0% condo/townhome median rests on only 90 closings. It is not a blanket conclusion about condo values.',
      'Active inventory fell 18.1% for single-family homes and 24.8% for condos and townhomes.',
      '33.3% of single-family and 58.9% of condo/townhome closings were paid in cash, calculated from the reported counts.',
    ],
    audienceColumns: [
      {
        heading: 'If You Are Buying',
        points: [
          'See how 3.6 months of single-family supply and a 39-day median contract time shape how ready you need to be.',
          'Anchor offers to what homes actually closed at, relative to original list price, by property type.',
          'Know which condo and townhome figures rest on small samples before you read too much into them.',
        ],
      },
      {
        heading: 'If You Are Selling',
        points: [
          'Benchmark against Martin County closings, not Palm Beach County’s or the Treasure Coast as a whole.',
          'See what share of original list price sellers received, and how long homes took to go under contract.',
          'Understand why a county condo median is no substitute for comparable sales in your own building or community.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What data is in the Martin County Market Report?',
        a: 'September 2026 county-level figures for Martin County single-family homes and condos/townhomes: closed sales, paid-in-cash sales, median sale price, percent of original list price received, median days to contract, active inventory and months of supply, each compared with September 2025. Source: BeachesMLS (Broward, Palm Beaches & St. Lucie Realtors®).',
      },
      {
        q: 'Does it include figures for Stuart, Palm City, Hobe Sound or Port Salerno?',
        a: 'No. Every figure is a Martin County total. County numbers blend distinct local markets, and conditions in any one town or neighborhood can differ from the county median. For a specific area, we review recent sales and active competition there with you.',
      },
      {
        q: 'Did Martin County condo values go up 8.0%?',
        a: 'Not in any general sense. The condo/townhome median sale price was $237,500 in September 2026, compared with $220,000 a year earlier, but that median is based on only 90 closings. A sample that small moves with the mix of units that happened to sell, so it says nothing reliable about what any particular condo or townhome is worth.',
      },
      {
        q: 'Is the report really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Who prepares the report?',
        a: 'Christine Dekant and John Oliver, REALTORS® with DO Homes Group at Premier Brokers International, serving buyers and sellers across Palm Beach County and the Treasure Coast.',
      },
    ],
    internalLinks: [
      { label: 'Stuart Real Estate', href: '/communities/stuart' },
      { label: 'Palm City Real Estate', href: '/communities/palm-city' },
      { label: 'Hobe Sound Real Estate', href: '/communities/hobe-sound' },
      { label: 'Port Salerno Real Estate', href: '/communities/port-salerno' },
      { label: 'Relocation Decision Guide', href: '/palm-beach-county-treasure-coast-relocation-guide' },
      { label: 'Buying a Home', href: '/buy' },
      { label: 'Selling Your Home', href: '/sell' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    disclaimer:
      'This report summarizes past market activity in Martin County for the months shown. It is not an appraisal, a prediction of future prices, or investment advice, and county medians do not reflect the value of any specific property. Cash shares were calculated by DO Homes Group from the reported counts. Information is believed reliable but not guaranteed. Not intended to solicit properties currently listed with another broker.',
    nextStep: {
      headline: 'You already have the Martin County report',
      description:
        'County medians are a starting point. Tell us the neighborhood and property type and we will look at recent sales and active competition there with you.',
      label: 'Start a Strategy Conversation',
      href: '/contact?from=martin-county-market-report#contact-form',
    },
    related: ['relocation-decision-guide', 'condo-due-diligence'],
    published: true,
  },

  // ───────────────────────────────────────────────────────────────────────────
  'st-lucie-county-market-report': {
    key: 'st-lucie-county-market-report',
    id: 'st-lucie-county-market-report-2026-09',
    kind: 'market-report',
    title: 'St. Lucie County Market Report',
    shortTitle: 'St. Lucie County Market Report',
    category: 'St. Lucie County',
    edition: COUNTY_REPORT_EDITION,
    dataMonth: COUNTY_REPORT_DATA_MONTH,
    dataAttribution: `${COUNTY_REPORT_DATA_MONTH} St. Lucie County market data (BeachesMLS)`,
    fileName: 'st-lucie-county-market-report-september-2026.pdf',
    coverImage: '/images/reports/st-lucie-county-cover.webp',
    coverImageLarge: '/images/reports/st-lucie-county-cover-lg.webp',
    coverAlt:
      'Cover of the St. Lucie County Market Report, September 2026, prepared by Christine Dekant and John Oliver of DO Homes Group',
    crmTag: 'Lead Magnet - St. Lucie County Market Report',
    landingPage: '/st-lucie-county-market-report',
    ctaEyebrow: `Free — ${COUNTY_REPORT_DATA_MONTH} St. Lucie County Numbers`,
    ctaHeadline: 'Houses Are Near Balanced. Condo Buyers Still Have Choice.',
    ctaDescription:
      `In ${COUNTY_REPORT_DATA_MONTH}, houses sold at 95.7% of asking in 52 days, so there was less room than most buyers expect. Condos ran 7.8 months of supply and 117 days, which is a different negotiation entirely. Both sets of numbers, in one free PDF.`,
    ctaButtonLabel: 'Send Me the Numbers',
    benefits: [
      `What houses and condos actually sold for in ${COUNTY_REPORT_DATA_MONTH}, and how fast`,
      'How much sellers came down from asking — your room to negotiate',
      'St. Lucie County only, never blended with Palm Beach County',
    ],
    keyStats: [
      { value: '$395,000', label: 'Single-Family Median', sub: '−1.3% year over year' },
      { value: '5.2', label: 'Single-Family Months of Supply', sub: 'down from 5.5' },
      { value: '95.7%', label: 'Single-Family List Price Received', sub: 'up from 95.0%' },
      { value: '7.8', label: 'Condo/Townhome Months of Supply', sub: 'down from 9.5' },
    ],
    subheadline:
      'Port St. Lucie and the rest of St. Lucie County, measured on their own county’s numbers rather than Palm Beach County’s.',
    metaTitle: `St. Lucie County Real Estate Market Report | ${COUNTY_REPORT_EDITION}`,
    metaDescription:
      'St. Lucie County September 2026: single-family median $395,000 at 5.2 months of supply; condos/townhomes at 7.8 months. Year-over-year tables in a free PDF.',
    summaryHeading: `What the ${COUNTY_REPORT_DATA_MONTH} Numbers Say`,
    summary:
      'St. Lucie County’s two property types sent different signals in September 2026. Single-family homes were close to balanced: supply eased from 5.5 to 5.2 months and the typical sale closed at 95.7% of original list price, up from 95.0%, but median days to contract rose from 44 to 52. The median sale price was $395,000, against $400,000 a year earlier, and closed sales slipped 8.7% to 464. Condos and townhomes remained buyer-leaning. Active inventory fell 10.6% to 635 and supply dropped from 9.5 months, yet 7.8 months still leaves buyers with options, and median days to contract lengthened from 69 to 117. The condo/townhome median rose 24.1% to $337,500, but it is based on only 91 closings in a county without much condo stock, so which buildings happened to trade moves it more than any change in what units are worth. Read it alongside supply and list-price-received figures, not as an increase in condo values.',
    takeaways: [
      'Single-family: 464 closed sales (−8.7%), median $395,000 (−1.3%), 5.2 months of supply, down from 5.5.',
      'Single-family sales closed at 95.7% of original list price, but median days to contract rose from 44 to 52.',
      'Condo/townhome: 91 closed sales (−3.2%), 7.8 months of supply, down from 9.5, with median days to contract up from 69 to 117.',
      'The +24.1% condo/townhome median rests on only 91 closings. It is not a universal increase in condo values.',
      'Active inventory fell 1.3% to 2,384 single-family homes and 10.6% to 635 condos and townhomes.',
      '27.6% of single-family and 42.9% of condo/townhome closings were paid in cash, calculated from the reported counts.',
    ],
    audienceColumns: [
      {
        heading: 'If You Are Buying',
        points: [
          'See why single-family sales closing at 95.7% of original list price can mean less room than you expect.',
          'Understand the leverage 7.8 months of condo/townhome supply and a 117-day median contract time give buyers.',
          'Judge a condo on its own building’s sales and finances, not a county median built on 91 closings.',
        ],
      },
      {
        heading: 'If You Are Selling',
        points: [
          'Benchmark against St. Lucie County closings, not Palm Beach County’s or the Treasure Coast as a whole.',
          'See how days to contract differ between single-family homes and condos/townhomes.',
          'Understand why precise first pricing matters more when buyers have options.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What data is in the St. Lucie County Market Report?',
        a: 'September 2026 county-level figures for St. Lucie County single-family homes and condos/townhomes: closed sales, paid-in-cash sales, median sale price, percent of original list price received, median days to contract, active inventory and months of supply, each compared with September 2025. Source: BeachesMLS (Broward, Palm Beaches & St. Lucie Realtors®).',
      },
      {
        q: 'Does it include figures for Port St. Lucie?',
        a: 'No. Every figure is a St. Lucie County total. County numbers blend varied local markets, and conditions in any one city or neighborhood can differ from the county median. For a specific area, we review recent sales and active competition there with you.',
      },
      {
        q: 'Did St. Lucie County condo values go up 24.1%?',
        a: 'Not in any general sense. The condo/townhome median sale price was $337,500 in September 2026, compared with $272,000 a year earlier, but it is based on only 91 closings in a county without much condo stock. Read it alongside 7.8 months of supply, 635 active listings and 93.3% of original list price received, not as a universal increase in condo values.',
      },
      {
        q: 'Is the report really free?',
        a: 'Yes. Enter your name and email and the PDF downloads immediately — no payment, no obligation, and your information is never shared or sold.',
      },
      {
        q: 'Who prepares the report?',
        a: 'Christine Dekant and John Oliver, REALTORS® with DO Homes Group at Premier Brokers International, serving buyers and sellers across Palm Beach County and the Treasure Coast.',
      },
    ],
    internalLinks: [
      { label: 'Port St. Lucie Real Estate', href: '/communities/port-st-lucie' },
      { label: 'Relocation Decision Guide', href: '/palm-beach-county-treasure-coast-relocation-guide' },
      { label: 'Condo Buyer’s Due-Diligence Checklist', href: '/florida-condo-buyers-due-diligence-checklist' },
      { label: 'Buying a Home', href: '/buy' },
      { label: 'Selling Your Home', href: '/sell' },
      { label: 'Relocation Guides & Blog', href: '/blog' },
    ],
    disclaimer:
      'These statistics describe past sales activity in St. Lucie County for the months shown. They are not an appraisal, a prediction of future prices, or investment advice, and county medians do not reflect the value of any specific property. Cash shares were calculated by DO Homes Group from the reported counts. Information is believed reliable but not guaranteed. Not intended to solicit properties currently listed with another broker.',
    nextStep: {
      headline: 'You already have the St. Lucie County report',
      description:
        'County figures only go so far. Tell us the neighborhood or building and we will map out a plan around recent sales there and your timing.',
      label: 'Request a Neighborhood Game Plan',
      href: '/contact?from=st-lucie-county-market-report#contact-form',
    },
    related: ['relocation-decision-guide', 'condo-due-diligence'],
    published: true,
  },
}

export const allLeadMagnets: LeadMagnet[] = Object.values(leadMagnets)

/** Every magnet that may be routed onto a page, linked, or listed in the sitemap. */
export const publishedLeadMagnets: LeadMagnet[] = allLeadMagnets.filter((m) => m.published)

/** The pairs offered by each multi-magnet selection, in picker order. */
const multiMagnetSelections: Record<MultiMagnetSelection, LeadMagnet[]> = {
  'martin-and-palm-beach-county': [
    leadMagnets['martin-county-market-report'],
    leadMagnets['palm-beach-county-market-report'],
  ],
}

export function isLeadMagnetKey(value: string | undefined): value is LeadMagnetKey {
  return !!value && Object.prototype.hasOwnProperty.call(leadMagnets, value)
}

/** True for any value a page may publish as its lead-magnet selection. */
export function isLeadMagnetSelection(value: string | undefined): value is LeadMagnetSelection {
  return (
    isLeadMagnetKey(value) ||
    (!!value && Object.prototype.hasOwnProperty.call(multiMagnetSelections, value))
  )
}

export function getLeadMagnet(key: LeadMagnetKey): LeadMagnet {
  return leadMagnets[key]
}

/** Resolve a selection to the magnets it offers — one, or a pair for the picker. */
export function magnetsForSelection(selection: LeadMagnetSelection): LeadMagnet[] {
  return isLeadMagnetKey(selection)
    ? [leadMagnets[selection]]
    : multiMagnetSelections[selection].filter((m) => m.published)
}

/** API path that streams the PDF (tokenized — issued by /api/leads on success). */
export function magnetDownloadApiPath(key: LeadMagnetKey): string {
  return `/api/reports/${key}`
}

/** Up to `limit` other published magnets, for the "also available" rail. */
export function relatedMagnets(key: LeadMagnetKey, limit = 2): LeadMagnet[] {
  const preferred = leadMagnets[key].related
  if (preferred) {
    return preferred
      .map((k) => leadMagnets[k])
      .filter((m) => m.published && m.key !== key)
      .slice(0, limit)
  }
  return publishedLeadMagnets.filter((m) => m.key !== key).slice(0, limit)
}
