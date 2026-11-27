// Copy, facts and sources for /communities/ballen-isles.
//
// RULES FOR THIS FILE (same as admiralsCove.ts; see docs/country-club-page-playbook.md)
//  * Every factual statement traces to an entry in SOURCES.
//  * Where official sources disagree, both figures are shown with their source.
//    The club's own pages disagree on the tennis court count (20 vs 21) and on
//    the Sports & Lifestyle Complex (71,000 vs 76,000 sq ft). Both are stated.
//  * No membership fee, dues figure or association fee appears here, and no
//    sale count, median or appreciation claim. Sales are a live widget.
//  * What the club's public material leaves open is written as a question for
//    the membership office, never as a fact. See NOT_VERIFIED.
//  * No in-body links to the club's site (it runs a "preferred agents"
//    program). Sources are linked only in the Sources section.

/** Dates of the last real review. Change one only when that material was actually re-checked. */
export const REVIEWED = {
  facts: 'November 27, 2026',
  factsIso: '2026-11-27',
}

// ── Sources ──────────────────────────────────────────────────────────────

const CLUB = 'https://www.ballenisles.org'

export const URLS = {
  clubMembership: `${CLUB}/membership`,
  clubRealEstate: `${CLUB}/real-estate`,
  clubCommunities: `${CLUB}/real-estate/communities`,
  clubCommunityMap: `${CLUB}/files/BI%20Community%20Map%202023.pdf`,
  clubGolf: `${CLUB}/golf`,
  clubTennis: `${CLUB}/tennis`,
  clubFitness: `${CLUB}/fitness`,
  clubDining: `${CLUB}/about-the-club/dining`,
  clubHistory: `${CLUB}/about-the-club/history`,
  clubAssociation: `${CLUB}/community-association`,
  bicaRules2025: 'https://cdngeneralcf.rentcafe.com/dmslivecafe/3/1101240/3_1101240_28376221.pdf',
  bica: 'https://www.ballenislescommunity.com/',
  papa: 'https://www.pbcpao.gov/',
  papaHomestead: 'https://www.pbcpao.gov/homestead-exemption.htm',
  sunbiz: 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByName',
  fema: 'https://msc.fema.gov/portal/search',
  pbgCity: 'https://www.pbgfl.gov/',
  schoolFinder:
    'https://arcgis.palmbeachschools.org/arcgisportal/apps/experiencebuilder/experience?id=0468f231866f42ae8cb11da91b97b92e',
}

export const SOURCES: { group: string; items: { label: string; url: string; used: string }[] }[] = [
  {
    group: 'The club and the community association',
    items: [
      { label: 'BallenIsles Country Club: Membership', url: URLS.clubMembership, used: 'Mandatory membership, the four categories and what each includes' },
      { label: 'BallenIsles Country Club: Real Estate', url: URLS.clubRealEstate, used: 'Residence count, home types, every new resident becomes a member' },
      { label: 'BallenIsles Country Club: Real Estate Communities', url: URLS.clubCommunities, used: 'The 33 neighborhoods, home counts, home types, locations and views' },
      { label: 'BallenIsles Country Club: Community Map (2023)', url: URLS.clubCommunityMap, used: 'Where each neighborhood sits' },
      { label: 'BallenIsles Country Club: Golf', url: URLS.clubGolf, used: 'Courses, architects, renovations, practice facilities' },
      { label: 'BallenIsles Country Club: Tennis', url: URLS.clubTennis, used: 'Court count and surface' },
      { label: 'BallenIsles Country Club: Sports & Lifestyle Complex', url: URLS.clubFitness, used: 'Fitness, spa, pool, complex size and 2024 renovation' },
      { label: 'BallenIsles Country Club: Dining', url: URLS.clubDining, used: 'Six dining venues' },
      { label: 'BallenIsles Country Club: History', url: URLS.clubHistory, used: 'PGA National Golf Club, JDM Country Club, the 1988 sale and renaming' },
      { label: 'BallenIsles Country Club: Community Association', url: URLS.clubAssociation, used: 'Acreage; the association is separate from the club' },
      { label: 'BallenIsles Country Club: 2026 Equity Membership Schedule, effective January 1, 2026 (a copy circulating among brokerages; ask the club for the current one)', url: URLS.clubMembership, used: 'The kinds of charges, guest-play limits for non-golf categories, refund terms' },
      { label: 'BallenIsles Community Association: Community Rules & Guidelines, revised July 16, 2025 (copy hosted by the association’s management portal)', url: URLS.bicaRules2025, used: 'Leasing, modifications approval, resale and gate rules' },
      { label: 'BallenIsles Community Association', url: URLS.bica, used: 'The master association' },
    ],
  },
  {
    group: 'Government and public records',
    items: [
      { label: 'Palm Beach County Property Appraiser', url: URLS.papa, used: 'Parcel, plat and tax records; Homestead rules' },
      { label: 'Palm Beach County Property Appraiser: Homestead exemption', url: URLS.papaHomestead, used: 'The filing deadline and how a sale resets assessed value' },
      { label: 'Florida Division of Corporations (Sunbiz)', url: URLS.sunbiz, used: 'Association and club entity records' },
      { label: 'FEMA Flood Map Service Center', url: URLS.fema, used: 'Address-level flood zone lookup' },
      { label: 'School District of Palm Beach County: Find My School', url: URLS.schoolFinder, used: 'School assignment by address' },
    ],
  },
  {
    group: 'Listings and sales',
    items: [
      { label: 'Beaches MLS and partner MLS feeds, through our search site', url: 'https://search.doyouneedahome.com/', used: 'Active listings and recent closed sales, updated live' },
    ],
  },
]

/** Stated plainly on the page: what we looked for and could not confirm. */
export const NOT_VERIFIED: string[] = [
  'Whether any home carries a required minimum membership category. The club’s public pages say membership is mandatory and that every new resident becomes a member; they do not say whether a buyer may choose any of the four categories for every home.',
  'Whether the buyer takes over the seller’s membership or joins new, and how the seller’s category affects the buyer. The club’s documents describe memberships being reissued on resale but do not publish the mechanics.',
  'The rules and any wait for moving up or down a category, and how many Social/Fitness memberships are available. The club says only that availability is limited.',
  'When membership became mandatory, and whether the requirement sits in the recorded community declaration or only in the club’s bylaws.',
  'Whether a tenant receives club privileges, and on what terms.',
  'The tennis court count. The club’s tennis page says 20 Har-Tru clay courts and 13 pickleball courts within “34 courts”; its Sports & Lifestyle Complex page says 21 tennis and 13 pickleball.',
  'The size of the Sports & Lifestyle Complex: 76,000 square feet on its own page, 71,000 on the golf page.',
  'Neighborhood home counts. The club’s figures are from its neighborhood descriptions, some of which are dated (Coconut Key is described as “nearing completion”). Its Grand Palm description repeats Banyan Isles word for word, so we do not describe Grand Palm beyond its name.',
]

// ── Quick facts ──────────────────────────────────────────────────────────

export interface Fact {
  label: string
  value: string
  source: string
}

export const QUICK_FACTS: Fact[] = [
  { label: 'Where', value: 'City of Palm Beach Gardens, ZIP 33418, between PGA Boulevard and Northlake Boulevard west of Alternate A1A', source: 'Club; county parcel records' },
  { label: 'Size', value: 'About 1,300 acres', source: 'Club (Community Association page)' },
  { label: 'Residences', value: 'Nearly 1,600, in 33 neighborhoods', source: 'Club (Real Estate page)' },
  { label: 'Home types', value: 'Patio homes, golf villas, courtyard homes, coach-home condominiums and estate homes', source: 'Club (Real Estate and Communities pages)' },
  { label: 'Gates', value: 'Gatehouses at Military Trail, PGA Boulevard and Northlake Boulevard; an inner gate at The Grands', source: 'Club (Communities page)' },
  { label: 'Membership', value: 'Mandatory. The club calls itself a mandatory membership equity club, open to residents only', source: 'Club (Membership page)' },
  { label: 'Categories', value: 'Full Golf, Sports, Racquets (tennis and pickleball) and Social/Fitness (limited availability)', source: 'Club (Membership page)' },
  { label: 'Golf', value: 'Three 18-hole courses: East and North (Dick Wilson and Joe Lee), South (redesigned by Rees Jones, reopened January 2020). The East Course was renovated by Nicklaus Design and reopened in January 2023', source: 'Club (Golf page)' },
  { label: 'Racquets', value: 'A 34-court complex: Har-Tru clay tennis courts (20 or 21, the club’s pages differ), 13 pickleball courts and a 500-seat stadium court', source: 'Club (Tennis and Complex pages)' },
  { label: 'Fitness and spa', value: 'Sports & Lifestyle Complex, renovated and expanded in a project completed in November 2024: fitness, Pilates, physical therapy, spa and salon, a resort-style pool', source: 'Club (Complex page)' },
  { label: 'Dining', value: 'Six venues: Evolution, Circle 100, Harry’s Lounge, The BallenIsles Grille, Artisan and Skinny Palms', source: 'Club (Dining page)' },
  { label: 'History', value: 'PGA National Golf Club 1964–1973 (host of the 1971 PGA Championship), JDM Country Club 1973–1988, BallenIsles since the 1988 sale by the MacArthur Foundation', source: 'Club (History page)' },
  { label: 'Association', value: 'BallenIsles Community Association, separate from the club. Many neighborhoods also have their own association', source: 'Club; association rules' },
]

// ── Membership ───────────────────────────────────────────────────────────

export type Cat = 'fullGolf' | 'sports' | 'racquets' | 'social'

export const CATEGORIES: { key: Cat; name: string; short: string }[] = [
  { key: 'fullGolf', name: 'Full Golf', short: 'Every amenity, golf year-round' },
  { key: 'sports', name: 'Sports', short: 'Golf with a winter afternoon limit' },
  { key: 'racquets', name: 'Racquets', short: 'Tennis and pickleball, no member golf' },
  { key: 'social', name: 'Social/Fitness', short: 'Dining, fitness and pool. Limited availability' },
]

/** The comparison table. Every cell paraphrases the club's Membership page or its 2026 schedule. */
export const MEMBERSHIP_TABLE: { row: string; cells: Record<Cat, string> }[] = [
  {
    row: 'Golf',
    cells: {
      fullGolf: 'Any time, year-round. Tee times seven days ahead, greens fees included, range and range balls, the golf associations.',
      sports: 'May–October any time; November–April after 12 noon only. Tee times five days ahead, greens fees included, range.',
      racquets: 'Lessons. Up to 12 rounds a year as the accompanied guest of a Full Golf or Sports member, paying guest fees.',
      social: 'Lessons. Up to 12 rounds a year as the accompanied guest of a Full Golf or Sports member, paying guest fees.',
    },
  },
  {
    row: 'Tennis and pickleball',
    cells: {
      fullGolf: 'Courts booked seven days ahead; pickleball',
      sports: 'Courts booked seven days ahead; pickleball',
      racquets: 'Courts booked seven days ahead; pickleball',
      social: 'Lessons. Up to 12 times a year as the accompanied guest of a Full Golf, Sports or Racquets member, paying guest fees'
    },
  },
  {
    row: 'Fitness, spa and pool',
    cells: {
      fullGolf: 'Yes: classes, Pilates, personal training, physical therapy, spa, salon, pool',
      sports: 'Yes, the same',
      racquets: 'Yes, the same',
      social: 'Yes, the same',
    },
  },
  {
    row: 'Dining and social',
    cells: {
      fullGolf: 'All six dining venues and all club events',
      sports: 'All six dining venues and all club events',
      racquets: 'All six dining venues and all club events',
      social: 'All six dining venues and all club events',
    },
  },
  {
    row: 'Reciprocal golf',
    cells: {
      fullGolf: 'Troon Privé properties',
      sports: 'Troon Privé properties',
      racquets: 'Not listed',
      social: 'Not listed',
    },
  },
  {
    row: 'Availability',
    cells: {
      fullGolf: 'No limit published',
      sports: 'No limit published',
      racquets: 'No limit published',
      social: 'The club says availability is limited',
    },
  },
]

/** "I found a house I like. Can I get the membership I want?" What is settled club-wide, and what is not. */
export const MEMBERSHIP_ANSWER: { settled: string[]; askFirst: string[] } = {
  settled: [
    'Membership is not optional. The club describes itself as a mandatory membership equity club, and says every new resident becomes a member. Budget for a membership with every home here.',
    'Membership is for residents. You buy the home, then apply. The club’s board approves applications.',
    'Each membership is an equity membership: a one-time equity contribution plus a non-refundable initiation fee, then annual dues billed monthly. The club sets these by category and says they, and its refund percentages, can change at any time.',
    'Refunds changed in 2025. The club’s 2026 schedule says a membership refunds 80% of the equity contribution at resale, except memberships bought new or upgraded on or after March 1, 2025, which get no refund when the membership is resigned and reissued. Ask the club which terms you would join under.',
    'A category decides how you use the club, not which home you can buy. The four categories differ mainly on golf; fitness, spa, pool, dining and social events come with all four.',
  ],
  askFirst: [
    'Is there a minimum category for this address, or may I choose any of the four?',
    'Is the category I want open now, or is there a wait? Social/Fitness is limited.',
    'Do I take over the seller’s membership or join new, and does the seller’s category change anything for me?',
    'Which refund terms would apply to my equity contribution when I sell, under the schedule in force today?',
    'Can I move up or down a category later? What would that cost, and is there a wait?',
    'Which assessments are in place or approved, and for which categories?',
  ],
}

/** Charges to request. Names only, never amounts. */
export const CLUB_CHARGES: { name: string; note: string }[] = [
  { name: 'Equity contribution', note: 'Paid once when you join, by category. Under the 2026 schedule, memberships bought new or upgraded since March 1, 2025 get no refund of it on resale. Ask which terms would apply to you.' },
  { name: 'Initiation fee', note: 'Paid once, by category. Non-refundable.' },
  { name: 'Annual dues', note: 'By category, billed monthly. They include operating and capital dues; sales tax applies to the operating part. The club charges no gratuities on club services.' },
  { name: 'Assessments', note: 'The 2026 schedule carries a golf projects assessment on Full Golf and Sports, running through May 2027. Ask for any other approved or proposed.' },
  { name: 'Upgrade charges', note: 'If you move up a category later. Ask how they are worked out.' },
  { name: 'Usage charges', note: 'Guest fees, the private golf cart trail fee, lessons, spa and dining. Ask whether there is a food and beverage minimum.' },
]

// ── Neighborhoods ────────────────────────────────────────────────────────

export type HomeType = 'Estate homes' | 'Single-family homes' | 'Patio homes' | 'Coach homes (condominium)'

export interface Neighborhood {
  name: string
  type: HomeType
  /** The club's figure. */
  homes?: number
  /** Golf, lake and setting, as the club describes them. Empty when the club says nothing we can repeat. */
  setting: string
  /** Where, as the club describes it. */
  where: string
}

/** All 33, from the club's Communities page. Grouped and ordered on the page by home type. */
export const NEIGHBORHOODS: Neighborhood[] = [
  // Estate homes
  { name: 'Estates of St. George', type: 'Estate homes', homes: 66, setting: 'Custom homes, lake and golf views', where: 'End of St. George Place' },
  { name: 'Estates of St. James', type: 'Estate homes', homes: 68, setting: 'Custom homes, lake and golf views', where: 'Fairwinds Avenue at BallenIsles Drive' },
  { name: 'Estates of St. Martin', type: 'Estate homes', homes: 34, setting: 'Golf course and lake settings', where: 'Off Fairwinds Avenue' },
  { name: 'Estates of St. Edward', type: 'Estate homes', homes: 26, setting: 'Estate homes', where: 'Off Fairwinds Avenue' },
  { name: 'Estates of St. Thomas', type: 'Estate homes', homes: 40, setting: 'Estate homes', where: 'Off Coquina Way' },
  { name: 'Grand Isle', type: 'Estate homes', homes: 45, setting: 'A private island with waterways and fairways', where: 'North of the Northlake gatehouse, off BallenIsles Drive' },
  { name: 'Grand Key Estates', type: 'Estate homes', homes: 12, setting: 'Twelve homes behind a second gate', where: 'Inside The Grands gate, off Fairwinds Avenue' },
  { name: 'Grand Pointe', type: 'Estate homes', homes: 31, setting: 'Behind a second gate', where: 'Inside The Grands gate, end of Fairwinds Avenue' },
  // Single-family
  { name: 'VintageIsle', type: 'Single-family homes', homes: 68, setting: 'On holes 9 to 14 of the South Course; homes of about 3,300 to 3,400 square feet', where: 'Off West Island Avenue' },
  { name: 'Cayman Isle', type: 'Single-family homes', homes: 64, setting: 'Many with golf and water views', where: 'Off Coquina Way' },
  { name: 'Orchid Cay', type: 'Single-family homes', homes: 66, setting: 'Many with East Course and water views', where: 'From Fairwinds Avenue or East Island Avenue' },
  { name: 'Coquina Estates', type: 'Single-family homes', homes: 32, setting: 'Golf and lakefront homes', where: 'Off Coquina Way' },
  { name: 'Coconut Key', type: 'Single-family homes', homes: 35, setting: 'Golf course views', where: 'End of West Island Avenue' },
  { name: 'San Marita', type: 'Single-family homes', homes: 16, setting: 'Views of the South Course’s 10th hole', where: 'Off West Island Avenue' },
  { name: 'Windward Cove', type: 'Single-family homes', homes: 75, setting: 'Water and golf views, close to the club', where: 'Windward Drive' },
  { name: 'Coral Cay', type: 'Single-family homes', homes: 105, setting: 'A neighborhood pool', where: 'South of the PGA gatehouse, off BallenIsles Drive' },
  { name: 'Crystal Bay', type: 'Single-family homes', homes: 52, setting: '', where: 'Off St. George Place' },
  { name: 'Emerald Key', type: 'Single-family homes', homes: 31, setting: 'Lake views', where: 'Off BallenIsles Drive' },
  { name: 'Island Cove', type: 'Single-family homes', homes: 22, setting: 'Lake views', where: 'Off East Island Avenue' },
  { name: 'Sabal Pointe', type: 'Single-family homes', homes: 38, setting: 'Lake views; island colonial architecture', where: 'North of the Military Trail gatehouse, East Island Avenue' },
  { name: 'Arbor Chase', type: 'Single-family homes', homes: 23, setting: 'Island colonial style', where: 'North of the Military Trail gatehouse' },
  { name: 'Sunesta Cove', type: 'Single-family homes', homes: 23, setting: 'A water feature', where: 'Off East Island Avenue' },
  { name: 'Windsor Pointe', type: 'Single-family homes', homes: 20, setting: '', where: 'Off East Island Avenue' },
  { name: 'Bermuda Bay', type: 'Single-family homes', setting: '', where: 'North of the Northlake entrance, BallenIsles Drive' },
  // Patio homes
  { name: 'Sunset Bay', type: 'Patio homes', homes: 90, setting: 'Lakeside or golf views; a neighborhood pool', where: 'Off Coquina Way' },
  { name: 'Laguna', type: 'Patio homes', homes: 70, setting: 'Set around four lakes', where: 'Off East Island Avenue' },
  { name: 'Banyan Isles', type: 'Patio homes', homes: 48, setting: 'East Course views', where: 'East Island Avenue' },
  { name: 'San Marco', type: 'Patio homes', homes: 40, setting: 'The East Course’s 8th fairway, or a lake', where: 'Fairwinds Avenue' },
  { name: 'Sunset Cove', type: 'Patio homes', homes: 32, setting: 'Lake and golf views', where: 'Off West Island Avenue' },
  { name: 'Victoria Bay', type: 'Patio homes', homes: 28, setting: 'Island colonial style', where: 'Off East Island Avenue' },
  { name: 'Grand Palm', type: 'Patio homes', setting: '', where: 'Ask us' },
  // Coach homes
  { name: 'Palm Bay Club', type: 'Coach homes (condominium)', homes: 112, setting: '28 buildings, with its own pool and clubhouse', where: 'Off East Island Avenue' },
  { name: 'The Palms', type: 'Coach homes (condominium)', homes: 84, setting: 'Lake and golf course views; a neighborhood pool', where: 'Off Fairwinds Avenue' },
]

/** One line per home type: who it suits and what to check. Drives the "where to tour" cards. */
export const HOME_TYPES: { type: HomeType; who: string; check: string }[] = [
  {
    type: 'Estate homes',
    who: 'Custom homes on the larger lots, most with lake or golf views. Grand Key Estates and Grand Pointe sit behind a second gate at The Grands.',
    check: 'Renovation history and any plans in the modifications approval file. Many have been rebuilt or remodeled; condition, not the neighborhood, drives price.',
  },
  {
    type: 'Single-family homes',
    who: 'The widest choice, from VintageIsle on the South Course to Coral Cay, the largest neighborhood. Golf, lake or garden settings.',
    check: 'Which way the lot faces the course or lake, the neighborhood association’s budget, and whether there is a neighborhood pool.',
  },
  {
    type: 'Patio homes',
    who: 'Smaller lots and less yard to keep, often on a lake or fairway. A common choice for seasonal owners.',
    check: 'What the neighborhood association maintains (roofs, exteriors, landscaping) and what it charges for it.',
  },
  {
    type: 'Coach homes (condominium)',
    who: 'Palm Bay Club and The Palms: residences in small buildings, each neighborhood with its own pool.',
    check: 'The condominium association’s budget, reserves, insurance and any special assessment, on top of the master association and the club.',
  },
]

// ── Cost of ownership ────────────────────────────────────────────────────

export const COSTS: { group: string; items: { name: string; how: string }[] }[] = [
  {
    group: 'The club',
    items: [
      { name: 'Equity contribution and initiation fee', how: 'The club’s current schedule, for the category you want. We request it for you.' },
      { name: 'Annual dues and assessments', how: 'The same schedule. Ask which assessments are approved and which are proposed.' },
    ],
  },
  {
    group: 'The associations',
    items: [
      { name: 'BallenIsles Community Association assessment', how: 'Gates, security, roads and common areas. Ask the association or the listing agent for the current budget.' },
      { name: 'Neighborhood association assessment', how: 'Most neighborhoods have their own. Ask which applies to the address and what it covers.' },
      { name: 'Condominium assessment', how: 'Palm Bay Club and The Palms. Ask for the budget, reserve study and insurance summary.' },
      { name: 'Special assessments and transfer charges', how: 'Ask each association in writing, and read the estoppel letters.' },
    ],
  },
  {
    group: 'The home',
    items: [
      { name: 'Property tax', how: 'Estimate from the purchase price, not the seller’s bill: a sale resets the assessed value the next January 1. Apply for Homestead by March 1 if it is your permanent home.' },
      { name: 'Homeowners and windstorm insurance', how: 'A quote for the specific roof, windows and year built.' },
      { name: 'Flood insurance', how: 'Look up the address on FEMA’s flood map and price a policy even if a lender does not require one.' },
      { name: 'Upkeep', how: 'Landscaping, pool, roof and exterior, unless the neighborhood association covers them. Ask what it covers.' },
    ],
  },
]

export const BEFORE_OFFER: { item: string; detail: string }[] = [
  { item: 'The membership the home allows', detail: 'In writing from the membership office: any minimum category, whether your category is open, and whether you join new or take over the seller’s.' },
  { item: 'The current fee schedule', detail: 'Equity contribution, initiation fee, dues and assessments for your category, with the refund terms that would apply to you.' },
  { item: 'Association budgets and assessments', detail: 'Master association, neighborhood association and, for a coach home, the condominium: budgets, reserves, special assessments, estoppel letters.' },
  { item: 'Renovation rules', detail: 'The association’s modifications committee must approve exterior work, landscaping and screened areas before any work starts, on top of city permits.' },
  { item: 'Leasing rules', detail: 'The association’s 2025 rules require notice before leasing, a whole-home lease of at least 30 days, and allow one new lease per fiscal year. Ask whether a tenant gets club privileges.' },
  { item: 'Insurance and flood zone', detail: 'Quotes for the address before your inspection period ends.' },
]

// ── Compare ──────────────────────────────────────────────────────────────

export const COMPARE: { name: string; href: string; golf: string; membership: string; note: string }[] = [
  {
    name: 'Mirasol',
    href: '/communities/mirasol',
    golf: 'Two 18-hole courses',
    membership: 'Comes with the home and is mandatory',
    note: 'The closest like-for-like in Palm Beach Gardens. Our Mirasol guide explains its equity payment.',
  },
  {
    name: 'PGA National',
    href: '/communities/pga-national',
    golf: 'Anchored by PGA National Resort',
    membership: 'Not tied to the home in the same way; confirm for the neighborhood',
    note: 'Dozens of neighborhoods and a wider price range. For a buyer who wants golf nearby without a required club.',
  },
]

// ── FAQs ─────────────────────────────────────────────────────────────────

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is club membership mandatory in BallenIsles?',
    a: 'Yes. BallenIsles Country Club describes itself as a mandatory membership equity club, and says every new resident becomes a member. Plan on a membership with any home you buy here, and get the club’s written terms for that home before you sign.',
  },
  {
    q: 'Can I get a Full Golf membership with a particular home?',
    a: 'The club’s public pages do not say that any home is limited to a category, and they publish no wait for Full Golf. They also do not rule either out. Before you make an offer, ask the membership office in writing whether Full Golf is open to you at that address. We can make that request for you.',
  },
  {
    q: 'Are association fees separate from club dues?',
    a: 'Yes. The club and the BallenIsles Community Association are separate, and send separate bills. Most neighborhoods also have their own association, and the coach-home neighborhoods have a condominium association. Ask for each budget.',
  },
  {
    q: 'What does the Sports membership allow?',
    a: 'Golf any time from May through October, and after 12 noon from November through April, with tee times five days ahead. Everything else matches Full Golf.',
  },
  {
    q: 'How do I compare the 33 neighborhoods?',
    a: 'Start with the home type you want: estate homes, single-family homes, patio homes or coach homes. Then decide on golf, lake or a quieter setting. Our neighborhood table on this page groups all 33 that way, and we can send you recent sales for the ones you shortlist.',
  },
  {
    q: 'Can I rent out a BallenIsles home?',
    a: 'Under the association’s rules revised in July 2025, an owner must file notice before leasing, lease the whole home for at least 30 days, and may begin one lease per fiscal year. Ask whether a tenant would receive club privileges.',
  },
  {
    q: 'How do I schedule a showing?',
    a: 'Choose “Arrange a Private Showing” in the form on this page with the address or listing link. Visitors need to be pre-authorized at the gate, so we arrange access ahead of time.',
  },
]
