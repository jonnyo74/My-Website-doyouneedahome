// Copy and sources for /communities/jupiter-inlet-colony.
//
// Every factual statement here traces to one of SOURCES, checked 2026-11-23.
// What could NOT be confirmed from a public source is written as a question
// for the buyer to ask, never as a fact:
//  * Jupiter Inlet Beach Club membership terms, fees or any wait list
//  * who may use each Town beach walkway
//  * dock, lift and seawall rules in the Town code
// Do not add a gate, a walk time, a drive time or a "no traffic" line.

import raw from './colonyMapData.generated.json' with { type: 'json' }

export const COLONY_CHECKED = 'November 23, 2026'

const TOWN = 'https://www.jupiterinletcolony.gov'
export const AGENDA_NOV = `${TOWN}/AgendaCenter/ViewFile/Agenda/_11092026-74`
export const AGENDA_OCT = `${TOWN}/AgendaCenter/ViewFile/Agenda/_10192026-72`
export const PLANNING_URL = `${TOWN}/270/Planning-Zoning`
export const FEMA_URL = 'https://msc.fema.gov/portal/search'
export const SCHOOL_FINDER_URL =
  'https://arcgis.palmbeachschools.org/arcgisportal/apps/experiencebuilder/experience?id=0468f231866f42ae8cb11da91b97b92e'
export const SCHOOL_CATALOG_URL =
  'https://www.palmbeachschools.org/departments/planning-and-intergovernmental-relations/gis-map-catalog'
export const LIGHTHOUSE_URL = 'https://www.jupiterlighthouse.org/directions-hours'

export const SOURCES: { label: string; url: string }[] = [
  { label: 'Town of Jupiter Inlet Colony: commission agenda packet, November 9, 2026 (town overview, vulnerability assessment, special assessment)', url: AGENDA_NOV },
  { label: 'Town of Jupiter Inlet Colony: commission agenda packet, October 19, 2026', url: AGENDA_OCT },
  { label: 'Town of Jupiter Inlet Colony: Planning & Zoning', url: PLANNING_URL },
  { label: 'Town of Jupiter Inlet Colony: Building Permits', url: `${TOWN}/276/Building-Permits` },
  { label: 'Town of Jupiter Inlet Colony: dog rules', url: `${TOWN}/290/JIC-Good-Dog-Club-Rules` },
  { label: 'Palm Beach County municipal boundaries', url: raw.sources.boundary },
  { label: 'Palm Beach County Property Appraiser parcel records', url: raw.sources.parcels },
  { label: 'Palm Beach County road centerlines', url: raw.sources.centerline },
  { label: 'Jupiter Inlet Lighthouse & Museum: directions', url: LIGHTHOUSE_URL },
  { label: 'FEMA Flood Map Service Center', url: FEMA_URL },
  { label: 'School District of Palm Beach County: GIS map catalog', url: SCHOOL_CATALOG_URL },
]

// ── County record counts ─────────────────────────────────────────────────

const use = raw.parcels.byUse as Record<string, number>
export const PARCELS = {
  total: raw.parcels.total,
  singleFamily: use['SINGLE FAMILY'] ?? 0,
  vacant: use.VACANT ?? 0,
}

// ── Recorded sales ───────────────────────────────────────────────────────

export interface RecordedSale {
  date: string
  street: string
  price: number
}

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const monthYear = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
export const usd = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 100_000 === 0 ? 1 : 2).replace(/\.0$/, '')}M` : `$${n.toLocaleString('en-US')}`

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/** Summary of the recorded sales, or null when the window holds too few to describe. */
export function salesSummary(sales: RecordedSale[] = raw.sales.singleFamily) {
  if (sales.length < 3) return null
  const prices = sales.map((s) => s.price)
  return {
    count: sales.length,
    low: Math.min(...prices),
    high: Math.max(...prices),
    median: median(prices),
    rows: sales.map((s) => ({ month: monthYear(s.date), street: s.street, price: usd(s.price) })),
  }
}

export const SALES_PERIOD = {
  from: longDate(raw.sales.from),
  to: longDate(raw.sales.to),
  excludedOtherUse: raw.sales.excludedOtherUse,
}

// ── Property types ───────────────────────────────────────────────────────

export const PROPERTY_TYPES: { id: string; title: string; where: string; body: string; check: string[] }[] = [
  {
    id: 'interior',
    title: 'Interior homes',
    where: 'Beacon Lane, Shelter Lane, Colony Road and the three short cross streets',
    body:
      'Most of the town. These lots have a neighbor on each side and no water frontage of their own, so the questions are how you reach the beach from that address, how the street handles heavy rain, and what the Town will let you build if you plan to renovate or replace the house.',
    check: [
      'Which Town beach walkway serves the address, and the rules for using it',
      'Lot elevation and the flood zone for that parcel',
      'Whether the sewer and stormwater special assessment is paid off',
    ],
  },
  {
    id: 'oceanfront',
    title: 'Atlantic oceanfront homes',
    where: 'Along Ocean Drive, on the Atlantic side',
    body:
      'These lots run to the beach. They carry the most wind and surge exposure in town, and the Town’s 2026 vulnerability assessment lists the Atlantic shoreline among the assets needing attention. Work on the ocean side of a lot may also need a state coastal construction permit on top of the Town’s review.',
    check: [
      'The surveyed lot line against today’s dune and beach',
      'Wind and flood insurance quotes for that house, before you offer',
      'Whether planned work falls seaward of the state Coastal Construction Control Line',
    ],
  },
  {
    id: 'waterway',
    title: 'Inlet and Intracoastal homes',
    where: 'Along Lighthouse Drive on the west side, and lots near the inlet at the south end',
    body:
      'These lots face the Intracoastal Waterway or Jupiter Inlet. A dock, a lift and a seawall belong to the lot, not the town, so each one has to be checked on its own. The Town’s draft adaptation plan proposes surveying public and private seawalls and may lead to minimum seawall heights, which would matter to an owner with an older wall.',
    check: [
      'Permits and as-built drawings for the dock, lift and seawall',
      'Seawall age, cap elevation and the last inspection',
      'Water depth at the dock at low tide, and current near the inlet',
    ],
  },
]

// ── Due diligence ────────────────────────────────────────────────────────

export const DUE_DILIGENCE: { title: string; body: string; link?: { label: string; url: string } }[] = [
  {
    title: 'Beach access, address by address',
    body:
      'Oceanfront lots reach the beach from their own land. For every other address, ask the Town which of its beach walkways serves that home and who may use it. The Town owns a north and a south walkway and patrols them. The Jupiter Inlet Beach Club at 244 Ocean Drive is something else: a private club on its own land, with its own membership.',
  },
  {
    title: 'Beach Club membership',
    body:
      'County records show the club parcel is owned by Jupiter Inlet Beach Club Inc., not by the Town. The Town does not publish the club’s membership terms, and we could not confirm them from a public source. Ask the club, in writing, whether a buyer of that address can join, what it costs, and whether there is a wait. Do not assume a membership transfers with a house.',
  },
  {
    title: 'Elevation and insurance',
    body:
      'Look up the flood zone for the parcel on FEMA’s map, ask the seller for an elevation certificate, and get wind and flood quotes before you offer. The Town’s July 2026 vulnerability assessment found that heavy rain can flood the interior of town, not only the shoreline, and named Lighthouse Drive and the Colony Road and Shelter Lane intersection for near-term work.',
    link: { label: 'FEMA flood map, search by address', url: FEMA_URL },
  },
  {
    title: 'Permits and rebuild review',
    body:
      'New construction and major renovations go to the Town’s Building and Zoning Committee before a building permit, and the Town requires a pre-application meeting with the owner and the design professional. If you are buying to rebuild, read the zoning code and talk to the Town before your inspection period ends.',
    link: { label: 'Town Planning & Zoning', url: PLANNING_URL },
  },
  {
    title: 'Docks, lifts and seawalls',
    body:
      'Only waterfront lots on the west and south sides can have one. Ask for the permit history for each structure, and check what the Town, the county, the state and the Army Corps would each require before you plan a new dock or a larger lift. We have not verified the Town’s dock rules, so treat any size or setback you are told as something to confirm with the Town.',
  },
  {
    title: 'Sewer and stormwater assessment',
    body:
      'The Town financed a sewer, stormwater and road project with a special assessment on each property. Its November 9, 2026 agenda says 153 parcels paid their balance in full by August 30, 2026, and estimates about $3,078 a year for five years for the 71 that did not. Ask which group the house is in.',
    link: { label: 'November 9, 2026 agenda packet', url: AGENDA_NOV },
  },
]

// ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is Jupiter Inlet Colony part of Jupiter?',
    a: 'No. It is its own town, incorporated in 1959, with its own commission, police department and building rules. It sits at the southern tip of Jupiter Island, across the inlet from the Town of Jupiter. Listings can show either "Jupiter" or "Jupiter Inlet Colony" as the mailing city, and the ZIP code, 33469, is shared with Tequesta. The county parcel record names the municipality.',
  },
  {
    q: 'How many homes are in Jupiter Inlet Colony?',
    a: `About 236. Palm Beach County Property Appraiser records checked on ${COLONY_CHECKED} show ${PARCELS.singleFamily} single-family parcels and ${PARCELS.vacant} vacant lots on eight streets. The 2020 Census counted 405 residents. Every home is single-family; there are no condominiums or townhomes.`,
  },
  {
    q: 'Is Jupiter Inlet Colony a gated community?',
    a: 'It is a municipality, not a private association. The streets are Town streets and the Town has its own police department. The one road in is Beach Road, which comes through the Village of Tequesta.',
  },
  {
    q: 'Does every home have beach access?',
    a: 'Not in the same way. Oceanfront lots on Ocean Drive reach the beach from their own land. The Town owns a north and a south beach walkway for other addresses. Ask the Town which walkway serves the home you are considering and what the rules are. The Jupiter Inlet Beach Club is a separate private club.',
  },
  {
    q: 'Does a home come with Jupiter Inlet Beach Club membership?',
    a: 'Do not assume so. The club is a private corporation that owns its own land at 244 Ocean Drive. Its membership terms are not published by the Town, and we could not confirm them from a public source. Ask the club in writing before you rely on it.',
  },
  {
    q: 'Can I tear down and rebuild?',
    a: 'New construction and major renovations must be reviewed by the Town’s Building and Zoning Committee before you apply for a building permit, and a pre-application meeting is required. Check the zoning code for the lot with the Town before you commit to a design.',
  },
  {
    q: 'Which schools serve Jupiter Inlet Colony?',
    a: 'Assignments follow the address and can change. Use the School District of Palm Beach County’s Find My School tool to look up the address you are considering.',
  },
  {
    q: 'Is the Jupiter Inlet Lighthouse in the Colony?',
    a: 'No. The lighthouse is at 500 Captain Armour’s Way in Jupiter, in Lighthouse Park, across the Intracoastal Waterway to the west. It is a nearby landmark, not part of the town.',
  },
]

// ── Comparable communities ───────────────────────────────────────────────

export const COMPARE: { name: string; href: string; kind: string; why: string }[] = [
  {
    name: 'Jupiter Island',
    href: '/communities/jupiter-island',
    kind: 'A separate town, in Martin County',
    why: 'Farther north on the same barrier island. Compare it if you want the island setting with more homes to choose from. It is a different town in a different county, so the government and the tax bill both change.',
  },
  {
    name: 'Tequesta',
    href: '/communities/tequesta',
    kind: 'The village next door',
    why: 'You drive through it to reach the Colony, and it shares the ZIP code. Compare it for Beach Road condominiums, which the Colony does not have, and for river and Intracoastal homes on the mainland side.',
  },
  {
    name: 'Admirals Cove',
    href: '/communities/admirals-cove',
    kind: 'A club community in Jupiter',
    why: 'Compare it if the boat comes first. It is a country club community on the Intracoastal with deep-water dockage and golf, run by an association and a club instead of a town.',
  },
  {
    name: 'Juno Beach',
    href: '/communities/juno-beach',
    kind: 'A small oceanfront town to the south',
    why: 'Compare it if you like a small town on the ocean but want a condominium or townhome, which the Colony does not have.',
  },
  {
    name: 'Jupiter',
    href: '/communities/jupiter',
    kind: 'The town across the inlet',
    why: 'Compare it for range. Jupiter has oceanfront condos, riverfront homes, golf communities and inland neighborhoods at many price points.',
  },
]
