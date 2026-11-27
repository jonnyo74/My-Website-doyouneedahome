// Copy, facts and sources for /communities/admirals-cove.
//
// RULES FOR THIS FILE
//  * Every factual statement traces to an entry in SOURCES. County figures are
//    read from admiralsCoveData.generated.json, never typed in.
//  * Where official sources disagree, both figures are shown with their source.
//    Nothing is averaged or quietly picked.
//  * No membership fee, dues figure or association fee appears here. See
//    lib/clubFees.ts for the policy.
//  * What could NOT be confirmed from a primary source is written as a question
//    for the buyer to put to the club or the association, never as a fact:
//      - whether club membership is required with a given property, and from
//        when (the club's public pages do not say; brokerages and listings do)
//      - the marina's current slip count (the club publishes none)
//      - "more than 500 private docks" (brokerage figure only)
//      - golf wait lists, upgrade and downgrade rules, transfer on resale
//      - who dredges the canals and who owns each seawall
//      - gate locations for Golf Village
//  * Do not write "no fixed bridges" as a selling line. The run to the inlet
//    has two drawbridges; say that.
//
// EVERGREEN vs CHANGING
//  * Evergreen: history, layout, plat counts, bridge types.
//  * Review when announced: membership categories, amenities, dock rules,
//    Town projects (REVIEWED.policies).
//  * Frequently changing: listings and sales. Both come from the live MLS
//    feed (active and sold widgets), so nothing here goes stale.

import raw from './admiralsCoveData.generated.json' with { type: 'json' }

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** Dates of the last real review. Change one only when that material was actually re-checked. */
export const REVIEWED = {
  /** Club, association, Town and federal sources read on this date. */
  facts: 'November 24, 2026',
  factsIso: '2026-11-24',
  /** County parcel records (counts, map): the date the build script ran. */
  records: longDate(raw.retrieved),
  recordsIso: raw.retrieved,
}

// ── Sources ──────────────────────────────────────────────────────────────

const CLUB = 'https://www.admiralscove.net'
const MPOA = 'https://www.acmpoa.com'

export const URLS = {
  clubAbout: `${CLUB}/About`,
  clubAmenities: `${CLUB}/amenities`,
  clubSports: `${CLUB}/sports`,
  clubMembership: `${CLUB}/Membership`,
  clubDining: `${CLUB}/Dining_Events`,
  clubWellness: `${CLUB}/Wellness`,
  clubDockage: `${CLUB}/Amenities/Dockage_Inquiries`,
  mpoa: `${MPOA}/`,
  mpoaAbout: `${MPOA}/about.html`,
  mpoaDocks: `${MPOA}/docks.html`,
  mpoaSecurity: `${MPOA}/security.html`,
  mpoaLeasing: `${MPOA}/home-leasing.html`,
  golfVillagePoa: 'https://www.golfvillagempoa.com/',
  sunbiz: 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByName',
  townProjects: 'https://www.jupiter.fl.us/1657/Current-Major-Projects',
  townFlood: 'https://www.jupiter.fl.us/377/Flood-Zones-Insurance-Information',
  countyFlood: 'https://discover.pbc.gov/pzb/Pages/Update-on-Flood-Zones.aspx',
  fema: 'https://msc.fema.gov/portal/search',
  evacuation: 'https://discover.pbc.gov/oem/Pages/Know-Your-Zone.aspx',
  coastPilotIcw: 'https://nauticalcharts.noaa.gov/publications/coast-pilot/files/cp4/CPB4_C12_WEB.pdf',
  coastPilotInlet: 'https://nauticalcharts.noaa.gov/publications/coast-pilot/files/cp4/CPB4_C10_WEB.pdf',
  bridgeRule: 'https://www.law.cornell.edu/cfr/text/33/117.261',
  fdotBridge: 'https://www.fdot.gov/projects/jupiterus1bridge/about',
  inletDistrict: 'https://www.jupiterinletdistrict.org/jupiter-inlet-district',
  papa: 'https://www.pbcpao.gov/',
  papaHomestead: 'https://www.pbcpao.gov/homestead-exemption.htm',
  schoolFinder:
    'https://arcgis.palmbeachschools.org/arcgisportal/apps/experiencebuilder/experience?id=0468f231866f42ae8cb11da91b97b92e',
}

export const SOURCES: { group: string; items: { label: string; url: string; used: string }[] }[] = [
  {
    group: 'The club and the associations',
    items: [
      { label: 'The Club at Admirals Cove: About (history)', url: URLS.clubAbout, used: 'Land, developer, dates, equity ownership, original marina' },
      { label: 'The Club at Admirals Cove: Amenities', url: URLS.clubAmenities, used: 'Marina vessel length, location, private hotel' },
      { label: 'The Club at Admirals Cove: Sports', url: URLS.clubSports, used: 'Golf holes and architects, racquets' },
      { label: 'The Club at Admirals Cove: Membership', url: URLS.clubMembership, used: 'Yacht Club, on-site brokerage' },
      { label: 'The Club at Admirals Cove: Dining', url: URLS.clubDining, used: 'Dining venues' },
      { label: 'The Club at Admirals Cove: Wellness', url: URLS.clubWellness, used: 'Bluewater Wellness' },
      { label: 'Admirals Cove Master Property Owners Association', url: URLS.mpoaAbout, used: 'Home count, acreage, the six associations' },
      { label: 'Admirals Cove Master POA: Docks', url: URLS.mpoaDocks, used: 'Boat-length rules, dock upkeep' },
      { label: 'Admirals Cove Master POA: Security', url: URLS.mpoaSecurity, used: 'Security and marine patrol' },
      { label: 'Golf Village at Admirals Cove Master POA', url: URLS.golfVillagePoa, used: 'The separate Golf Village association' },
      { label: 'Admirals Cove Master POA: community map, July 2024 (linked from the association’s site)', url: URLS.mpoa, used: 'Home counts by type, entrance, canal depths' },
      { label: 'Florida Division of Corporations (Sunbiz): entity records', url: URLS.sunbiz, used: 'Legal names and filing dates of the club and each association' },
    ],
  },
  {
    group: 'Government and navigation',
    items: [
      { label: 'Palm Beach County Property Appraiser', url: URLS.papa, used: 'Parcel counts by plat and use, Homestead rules' },
      { label: 'Palm Beach County GIS: parcel layer', url: raw.sources.parcels, used: 'The data behind the counts and the map' },
      { label: 'Palm Beach County GIS: water bodies', url: raw.sources.water, used: 'Canals, Intracoastal and lakes on the map; lots that adjoin navigable water' },
      { label: 'Palm Beach County GIS: flood hazard layer', url: raw.sources.flood, used: 'Flood zone at the centre of each residential parcel' },
      { label: 'Palm Beach County: flood map update', url: URLS.countyFlood, used: 'Effective date of the current flood maps' },
      { label: 'Town of Jupiter: Current Major Projects', url: URLS.townProjects, used: 'Projects inside Admirals Cove now before the Town' },
      { label: 'Town of Jupiter: Flood Zones and Insurance', url: URLS.townFlood, used: 'Where to look up a property' },
      { label: 'NOAA Coast Pilot 4, chapter 12 (Intracoastal Waterway)', url: URLS.coastPilotIcw, used: 'Bridge types and clearances' },
      { label: 'NOAA Coast Pilot 4, chapter 10 (Jupiter Inlet)', url: URLS.coastPilotInlet, used: 'Inlet conditions' },
      { label: '33 CFR 117.261: drawbridge schedules', url: URLS.bridgeRule, used: 'Indiantown Road bridge openings' },
      { label: 'Florida DOT: US-1 Jupiter Federal Bridge', url: URLS.fdotBridge, used: 'The replacement bridge and its stated clearance' },
      { label: 'Jupiter Inlet District', url: URLS.inletDistrict, used: 'Who maintains the inlet' },
      { label: 'FEMA Flood Map Service Center', url: URLS.fema, used: 'Address-level flood zone lookup' },
    ],
  },
]

/** Stated plainly on the page: what we looked for and could not confirm. */
export const NOT_VERIFIED: string[] = [
  'Whether club membership is required with every property. Brokerages and listing remarks say it is; the club’s public pages do not state the rule or any exceptions.',
  'The marina’s current number of slips. The club publishes no count. Its history page says the original marina had 57. Brokerage and directory figures range from 58 to 76.',
  'The number of private docks. “More than 500” appears only on brokerage pages. County maps show the lots that adjoin the canals, not the docks.',
  'Golf wait lists, rules for moving between membership categories, and what happens to a membership on resale.',
  'Who is responsible for dredging the canals, and for each seawall.',
  'The exact distance by water to Jupiter Inlet. The club says two miles; our own straight-line measurement is longer.',
]

// ── County record figures ────────────────────────────────────────────────

const c = raw.parcels.counts
export const COUNTS = {
  eastHouses: c.east.house,
  eastCondos: c.east.condo,
  eastVacant: c.east.vacant,
  gvHouses: c.golfVillage.house,
  gvTownhomes: c.golfVillage.townhouse,
  gvVacant: c.golfVillage.vacant,
  east: c.east.house + c.east.condo + c.east.townhouse,
  golfVillage: c.golfVillage.house + c.golfVillage.condo + c.golfVillage.townhouse,
  get residences() {
    return this.east + this.golfVillage
  },
  get vacant() {
    return this.eastVacant + this.gvVacant
  },
  acres: raw.parcels.acres,
  condos: raw.parcels.condos as { name: string; units: number }[],
  waterLots: raw.parcels.waterLots,
}

const fz = raw.floodZones as { east: Record<string, number>; golfVillage: Record<string, number> }
export const FLOOD = {
  eastX: fz.east.X ?? 0,
  eastShaded: fz.east['X-shaded'] ?? 0,
  eastAE: fz.east.AE ?? 0,
  eastVE: fz.east.VE ?? 0,
  gvX: (fz.golfVillage.X ?? 0) + (fz.golfVillage.unmapped ?? 0),
  gvOther: Object.entries(fz.golfVillage).filter(([k]) => k !== 'X' && k !== 'unmapped').reduce((s, [, n]) => s + n, 0),
}

// ── Quick facts ──────────────────────────────────────────────────────────

export interface Fact {
  label: string
  value: string
  /** Short source name shown beside the value. */
  source: string
  url?: string
}

export const QUICK_FACTS: Fact[] = [
  { label: 'Municipality', value: 'Town of Jupiter, Palm Beach County. Every parcel is inside the town limits.', source: 'County parcel records', url: URLS.papa },
  { label: 'ZIP codes', value: '33477 on the East Side, 33458 in Golf Village', source: 'Club and association addresses; MLS listings' },
  { label: 'Land', value: 'The John D. and Catherine T. MacArthur Foundation offered the 727-acre tract, “Project 57”, in 1985', source: 'Club history', url: URLS.clubAbout },
  { label: 'Original developer', value: 'Ben Frankel, in partnership with Mutual Benefit Life Insurance', source: 'Club history', url: URLS.clubAbout },
  { label: 'Development began', value: '1986', source: 'Club history', url: URLS.clubAbout },
  { label: 'First residents', value: 'The winter season of 1987–88', source: 'Club history', url: URLS.clubAbout },
  { label: 'Size today', value: `“Nearly 1,000 acres”, per the master association. Parcels platted as Admirals Cove total about ${COUNTS.acres} acres in county records, which leaves out roads and open water.`, source: 'Master POA; county parcel records', url: URLS.mpoaAbout },
  { label: 'Residences', value: `893 homes, per the master association. County records show ${COUNTS.residences} improved residential parcels and ${COUNTS.vacant} vacant lots.`, source: 'Master POA; county parcel records', url: URLS.mpoaAbout },
  { label: 'Property types', value: `${COUNTS.eastHouses + COUNTS.gvHouses} single-family houses, ${COUNTS.eastCondos} condominium residences in four associations, ${COUNTS.gvTownhomes} townhomes`, source: 'County parcel records', url: URLS.papa },
  { label: 'Golf', value: '45 holes: the 18-hole East Course and three nines in Golf Village', source: 'Club', url: URLS.clubSports },
  { label: 'Clubhouses', value: 'The main clubhouse on the East Side (completed 1989) and a second at Golf Village', source: 'Club history; county parcel records', url: URLS.clubAbout },
  { label: 'Marina', value: 'A private club marina for vessels up to 165 feet. The club does not publish a slip count.', source: 'Club', url: URLS.clubAmenities },
  { label: 'Homes on the canals', value: `${COUNTS.waterLots.eastHouses} of the ${COUNTS.waterLots.eastHousesTotal} East Side house lots adjoin the canal system or the Intracoastal. None in Golf Village do.`, source: 'Our measurement from county parcel and water maps' },
  { label: 'Navigable waterways', value: 'The club’s pages say 5.5 miles and 6 miles; the master association says seven', source: 'Club; Master POA', url: URLS.mpoa },
  { label: 'Security', value: 'Gated, with 24-hour security staff and a marine patrol on the waterway entrance, run by the master association', source: 'Master POA', url: URLS.mpoaSecurity },
  { label: 'Club ownership', value: 'An equity club since 1988. “Full member equity ownership began in November 1999.”', source: 'Club history', url: URLS.clubAbout },
  { label: 'Membership', value: 'Four categories on the club’s fee schedule: Golf, Sports, Tennis and Social. Marina dockage is arranged separately.', source: 'Club fee schedule' },
  { label: 'Master association', value: 'Admirals Cove Master Property Owners Association, a Florida not-for-profit formed in 1986. Separate from the club.', source: 'Sunbiz; Master POA', url: URLS.sunbiz },
  { label: 'Other associations', value: 'Golf Village Master POA (1992) and four condominium associations: Captains Way, Spyglass, Waterside and Nautical Way', source: 'Sunbiz; Master POA', url: URLS.mpoaAbout },
]

// ── East Side vs Golf Village ────────────────────────────────────────────

export const SIDES: { row: string; east: string; golfVillage: string }[] = [
  {
    row: 'Where',
    east: 'Between Alternate A1A and the Intracoastal Waterway, north of Frederick Small Road. Entered from Alternate A1A at Admirals Cove Boulevard.',
    golfVillage: 'West of Alternate A1A and the railway, north of Frederick Small Road. It has its own security post.',
  },
  {
    row: 'Homes in county records',
    east: `${COUNTS.eastHouses} houses and ${COUNTS.eastCondos} condominium residences`,
    golfVillage: `${COUNTS.gvHouses} houses and ${COUNTS.gvTownhomes} townhomes`,
  },
  {
    row: 'Property types',
    east: 'Custom houses, patio homes and villas, club cottages, and “Harbor Home” condominiums',
    golfVillage: 'Houses and townhomes. No condominiums.',
  },
  {
    row: 'Boat access',
    east: `${COUNTS.waterLots.eastHouses} house lots adjoin the canals or the Intracoastal. Harbor Home condominiums have their own, shorter, boat limits.`,
    golfVillage: 'None. The water here is golf course lakes. Dockage would be at the club marina, if available.',
  },
  {
    row: 'Golf outside the door',
    east: 'The 18-hole East Course',
    golfVillage: 'Three nine-hole courses',
  },
  {
    row: 'Clubhouse',
    east: 'The main clubhouse, with the private hotel, Bluewater Wellness and the marina alongside',
    golfVillage: 'The Golf Village clubhouse, on Golf Village Boulevard',
  },
  {
    row: 'Associations',
    east: 'The Master POA, plus a condominium association if the home is in Captains Way, Spyglass, Waterside or Nautical Way',
    golfVillage: 'The Golf Village Master POA, which the Master POA’s staff manage',
  },
  {
    row: 'Club membership',
    east: 'Confirm the requirement and the category choices for the specific property, in writing, with the club',
    golfVillage: 'The same. Do not assume the terms match the East Side, or the home next door.',
  },
]

// ── Membership ───────────────────────────────────────────────────────────

export const MEMBERSHIP_STRUCTURE: { title: string; body: string }[] = [
  {
    title: 'Four categories',
    body: 'The club’s fee schedule lists Golf, Sports, Tennis and Social. Each has its own joining fee and its own annual dues. Read the club’s current written description of each before choosing: how much golf a non-golf category allows, and in which months, is set by the club and can change.',
  },
  {
    title: 'A joining fee, paid once',
    body: 'Each category has an initiation fee due when you join. The club’s current schedule shows no refundable portion in any category. Older broker material describes a partly refundable equity fee; treat that as out of date and ask the club what, if anything, comes back when you sell.',
  },
  {
    title: 'Annual charges, in more than one line',
    body: 'The schedule separates operating dues from capital dues, lists a debt service assessment tied to past club improvements, sets a food and beverage minimum, and charges a trail fee if you keep your own golf cart. Add every line, not only the one labeled dues.',
  },
  {
    title: 'The club is not the association',
    body: 'The master association says plainly that it and the club are “two separate entities”. Association assessments pay for security, roads and common areas. Club charges pay for golf, dining, wellness and the rest. You will get separate bills, and a condominium adds a third.',
  },
  {
    title: 'Marina dockage is separate',
    body: 'Dockage at the club marina is not a membership category on the fee schedule. The club takes inquiries for annual, seasonal and transient dockage and quotes rates through its marina office. We could not confirm from the club who is eligible for a slip, so ask before you count on one.',
  },
  {
    title: 'The Yacht Club',
    body: 'The Admirals Cove Yacht Club was “established in 1990 by residents”. It is a social boating group within the community, not the marina and not a membership category.',
  },
]

export const MEMBERSHIP_QUESTIONS: string[] = [
  'Is membership required with this property? If so, which is the minimum category?',
  'Is the category I want open now, or is there a wait?',
  'What is the initiation fee today, when is it due, and is any part refundable?',
  'What are this year’s operating dues, capital dues, assessments and minimums for that category?',
  'Has the board approved, or is it considering, any new assessment or capital project?',
  'Can I move up or down a category later, and what does that cost?',
  'What happens to the membership when I sell, and must the buyer be approved first?',
  'What are the guest rules, and who can sponsor a stay in the private hotel?',
]

// ── Cost of ownership ────────────────────────────────────────────────────

export const COSTS: { group: string; items: { name: string; note: string }[] }[] = [
  {
    group: 'Paid once',
    items: [
      { name: 'Purchase price and closing costs', note: 'Including Florida documentary stamp tax and title insurance.' },
      { name: 'Club initiation fee', note: 'Set by membership category. Due at joining. Ask what is refundable; the current schedule shows none.' },
      { name: 'Association application and transfer charges', note: 'Each association can charge its own. Ask for the estoppel letter early.' },
    ],
  },
  {
    group: 'Paid to the club each year',
    items: [
      { name: 'Operating dues', note: 'By category.' },
      { name: 'Capital dues', note: 'A separate line from operating dues.' },
      { name: 'Debt service or other assessments', note: 'The current schedule carries one from past improvements. Ask what else is planned.' },
      { name: 'Food and beverage minimum', note: 'What you do not spend is billed at the club’s fiscal year end.' },
      { name: 'Trail fee, cart, locker, bag storage', note: 'Only if you use them.' },
    ],
  },
  {
    group: 'Paid to the associations',
    items: [
      { name: 'Master association assessment', note: 'Security, roads and common areas. Golf Village has its own master association.' },
      { name: 'Condominium assessment', note: 'Only in Captains Way, Spyglass, Waterside and Nautical Way. Covers the building, its insurance and its reserves.' },
      { name: 'Special assessments', note: 'Ask each association in writing for any that are approved or under discussion.' },
    ],
  },
  {
    group: 'Paid for the property',
    items: [
      { name: 'Property tax', note: 'Reset by your purchase. See below.' },
      { name: 'Homeowners and windstorm insurance', note: 'Quote it for the specific roof, openings and year built.' },
      { name: 'Flood insurance', note: 'A lender may not require it in zone X. Price it anyway.' },
      { name: 'Dock, lift and seawall', note: 'The owner maintains the dock. Budget for inspection now and repair later.' },
      { name: 'Marina dockage', note: 'If the boat will not fit, or cannot stay, behind the house.' },
      { name: 'Landscaping, pool and upkeep', note: 'A salt-air house on the water asks more than an inland one.' },
    ],
  },
]

// ── Boating ──────────────────────────────────────────────────────────────

export const BRIDGES: { name: string; where: string; type: string; clearance: string; opens: string }[] = [
  {
    name: 'Indiantown Road (SR 706)',
    where: 'Intracoastal mile 1006.2, north of Admirals Cove',
    type: 'Drawbridge (bascule)',
    clearance: '35 feet at the center when closed',
    opens: 'On the hour and half-hour',
  },
  {
    name: 'US-1, the Jupiter Federal Bridge',
    where: 'Mile 1004.8, between the Intracoastal and the inlet',
    type: 'Drawbridge (bascule), replaced and accepted by the state in December 2025',
    clearance: 'NOAA’s Coast Pilot lists 38 feet. Florida DOT describes the new bridge as “up to 42 feet”.',
    opens: 'Not on a fixed schedule in the federal rule we read. Confirm with the bridge tender.',
  },
]

export const DOCK_RULES: string[] = [
  'Lots up to 70 feet wide at the shoreline: boat length is half the lot width plus 10 percent. A 70-foot lot works out to 38.5 feet.',
  'Lots wider than 70 feet: the boat must sit 15 feet inside each side lot line.',
  'Captains Way Villas: 40 feet. Captains Way Harbor Homes: 35 feet, with no flybridge or tower.',
  'Spyglass and Waterside Harbor Homes: 34 feet.',
  'Every case is “subject to accessibility”: depth, canal width and tide can set a lower limit than the formula.',
]

export const BOAT_CHECKLIST: { item: string; why: string }[] = [
  { item: 'Length overall', why: 'Against the association’s formula for that lot, including pulpit and platform.' },
  { item: 'Beam', why: 'Against the dock, the lift and the canal width where you turn.' },
  { item: 'Draft', why: 'Against the depth at that dock at low water. The association’s canal map marks depths from 4 to 8 feet.' },
  { item: 'Height above the water', why: 'Against 35 feet at Indiantown Road, or plan around openings.' },
  { item: 'Dock dimensions and lift rating', why: 'Measure them. Listing remarks are not a survey.' },
  { item: 'Bridge schedule', why: 'Two drawbridges stand between the canals and the ocean.' },
  { item: 'Seawall', why: 'Age, cap height, tie-backs and the last inspection, by a marine contractor.' },
  { item: 'Dock and lift inspection', why: 'Pilings, framing, wiring and the lift motor.' },
  { item: 'Permits', why: 'For the dock, lift and seawall as built, and what a larger one would need.' },
  { item: 'Shore power', why: 'Amperage at the dock against what the boat draws.' },
  { item: 'Dock license and upkeep', why: 'The association uses a Dock License Agreement and makes the owner responsible for maintenance.' },
  { item: 'Association rules', why: 'Transponders, liveaboards, commercial use and anything else in the current rules.' },
]

// ── Golf and club ────────────────────────────────────────────────────────

export const AMENITIES: { title: string; body: string }[] = [
  {
    title: 'East Course',
    body: 'Eighteen holes by Robert von Hagge, opened with the marina in 1988. It runs through the East Side, crossing the canals. The club says it has hosted a U.S. Open qualifier for more than a decade.',
  },
  {
    title: 'Golf Village',
    body: 'Three nine-hole courses played in rotation, redesigned by Kipp Schulties in 2015. The club’s Golf Performance Center is 4,800 square feet, with four hitting bays and launch monitors.',
  },
  {
    title: 'Racquets',
    body: 'Nine Hydro-Court tennis courts, four of them lighted, and twelve pickleball courts. The Town is reviewing a shade structure over four of the pickleball courts.',
  },
  {
    title: 'Bluewater Wellness',
    body: 'Spa, salon, barber and fitness studio in the main clubhouse. The spa and wellness center were renovated in a project finished in early 2020.',
  },
  {
    title: 'Dining',
    body: 'Four venues named by the club: 27 West, Latitude, Marina Café and NEXT.',
  },
  {
    title: 'Private hotel',
    body: 'Waterside has 32 rooms on the third and fourth floors of the main clubhouse. “Sponsorship by a current club member is required for all bookings.”',
  },
]

// ── Due diligence ────────────────────────────────────────────────────────

export const DUE_DILIGENCE: { title: string; body: string; link?: { label: string; url: string } }[] = [
  {
    title: 'Flood zone and elevation',
    body: `On the county’s copy of FEMA’s flood layer, the centre of ${FLOOD.eastX} East Side residential parcels falls in zone X, ${FLOOD.eastShaded} in shaded X (the 0.2 percent annual chance area) and ${FLOOD.eastAE + FLOOD.eastVE} in a special flood hazard area. Every Golf Village parcel is in zone X or outside the mapped hazard area. That is the middle of the lot. A waterfront lot’s seawall, dock and rear yard can sit in a different zone from the house, and the current maps took effect December 20, 2024. Look up the address and ask the seller for an elevation certificate.`,
    link: { label: 'FEMA flood map, search by address', url: URLS.fema },
  },
  {
    title: 'Storm surge is a separate question',
    body: 'A flood zone prices insurance. An evacuation zone tells you when you must leave. A home in zone X beside tidal water can still be in an evacuation zone. Look up the address on the county’s evacuation map.',
    link: { label: 'Palm Beach County: Know Your Zone', url: URLS.evacuation },
  },
  {
    title: 'Wind, roof and insurance',
    body: 'Development began in 1986, so an original roof, set of windows or seawall may be near the end of its life unless it has been replaced. Insurers price the roof’s age and shape, the openings and the year of construction. Get a wind mitigation report and firm quotes for homeowners, wind and flood during the inspection period, not after.',
  },
  {
    title: 'Seawall, dock and water depth',
    body: 'Have a marine contractor inspect the seawall and dock. Ask for permits and for the depth at the dock at low water. We could not confirm from a public source who dredges the canals or how the cost is shared, so put that question to the master association.',
    link: { label: 'Master POA dock rules', url: URLS.mpoaDocks },
  },
  {
    title: 'Club obligations',
    body: 'Before you sign, get the club’s current fee schedule, its written answer on whether membership is required with this property, and any approved or proposed assessment. A buyer who learns the joining fee after contract has little room to negotiate.',
  },
  {
    title: 'Association documents',
    body: 'Ask for the declaration, rules, budget, reserve schedule and minutes for every association the home belongs to, and an estoppel letter showing what is owed. Check for pending special assessments, the application process and any approval step for buyers.',
  },
  {
    title: 'Renovation and rebuilding',
    body: 'The master association runs architectural design review, and the Town of Jupiter issues the permits under the Admirals Cove planned unit development. If you are buying to renovate or rebuild, read the design standards and talk to both before the inspection period ends.',
  },
  {
    title: 'Leasing, guests and pets',
    body: 'Leasing is governed by the association for that home, and the association says the club’s rules for tenants are separate from its own. Minimum terms, how often you may lease, guest access and pet limits differ between the master association and each condominium. Read the current rules for the specific home.',
    link: { label: 'Master POA: home leasing', url: URLS.mpoaLeasing },
  },
  {
    title: 'Condominium reserves and inspections',
    body: 'For Captains Way, Spyglass, Waterside and Nautical Way, ask for the reserve study, the reserve balance and the insurance certificate. Florida’s milestone inspection and structural reserve study laws apply to condominium buildings of three or more habitable stories. Ask each association in writing whether its buildings fall under them and what was found.',
  },
]

// ── Compare ──────────────────────────────────────────────────────────────

export const COMPARE: { name: string; href: string; where: string; golf: string; boating: string; homes: string; note: string }[] = [
  {
    name: 'Jonathan’s Landing',
    href: '/communities/jonathans-landing',
    where: 'Jupiter, on the Intracoastal just to the north',
    golf: 'Three courses',
    boating: 'Marina and Intracoastal homes',
    homes: 'Condominiums through estate homes',
    note: 'The closest match for golf plus boat. Its property owners association describes golf and marina memberships as optional, so the cost structure is different. Confirm current terms.',
  },
  {
    name: 'The Bear’s Club',
    href: '/communities/bears-club',
    where: 'Jupiter, inland',
    golf: 'One Jack Nicklaus course',
    boating: 'None',
    homes: 'Custom estates',
    note: 'For a buyer who wants golf first and no boat. Membership is by the club’s own process.',
  },
  {
    name: 'The Loxahatchee Club',
    href: '/communities/loxahatchee-club',
    where: 'Jupiter, inland',
    golf: 'One Jack Nicklaus course',
    boating: 'None',
    homes: 'Houses on golf and lake lots',
    note: 'A golf club with homes around it, without the marina, hotel or racquets program.',
  },
  {
    name: 'Jupiter Yacht Club',
    href: '/communities/jupiter-yacht-club',
    where: 'Jupiter, on the Intracoastal near Indiantown Road',
    golf: 'None',
    boating: 'A marina whose slips are bought separately',
    homes: 'Condominiums',
    note: 'For a boat and a lock-and-leave condominium, without a country club.',
  },
  {
    name: 'Jupiter Inlet Colony',
    href: '/communities/jupiter-inlet-colony',
    where: 'Its own town at the inlet',
    golf: 'None',
    boating: 'Intracoastal and inlet lots with private docks',
    homes: 'Single-family only',
    note: 'A town, not a club community: no gate, no mandatory club, and the ocean on one side.',
  },
  {
    name: 'Mirasol',
    href: '/communities/mirasol',
    where: 'Palm Beach Gardens, inland',
    golf: 'Two courses',
    boating: 'None',
    homes: 'Houses and villas',
    note: 'A larger golf-club community with required membership and no boating. See our membership guide.',
  },
  {
    name: 'Trump National Jupiter',
    href: '/communities/trump-national-jupiter',
    where: 'Jupiter, inland',
    golf: 'One Jack Nicklaus course',
    boating: 'None',
    homes: 'Houses and courtyard homes',
    note: 'A privately owned club rather than a member-owned one. Ask how that changes fees and control.',
  },
]

// ── FAQ (also emitted as FAQPage JSON-LD) ────────────────────────────────

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Where is Admirals Cove located?',
    a: 'In the Town of Jupiter, in northern Palm Beach County, Florida. The East Side lies between Alternate A1A and the Intracoastal Waterway, north of Frederick Small Road, in ZIP code 33477. Golf Village is west of Alternate A1A, in 33458. The name has no apostrophe, although the legal names of the club and the associations are spelled “Admiral’s Cove” in state records.',
  },
  {
    q: 'Is Admirals Cove a gated community?',
    a: 'Yes. The master association runs security around the clock, with separate security posts for the East Side and Golf Village and a marine patrol at the waterway entrance from the Intracoastal. Boats need an association transponder.',
  },
  {
    q: 'Is club membership mandatory in Admirals Cove?',
    a: 'Brokerages and listing remarks describe membership in The Club at Admirals Cove as required with a purchase. The club’s public pages do not state the rule, the minimum category or any exceptions, so we do not state them either. Ask the club’s membership office to confirm, in writing, what applies to the specific property before you sign a contract.',
  },
  {
    q: 'How much does Admirals Cove membership cost?',
    a: "It depends on the category, and the club resets its figures each club year from November 1, so we do not print them here. You pay a one-time initiation fee, then annual charges in several lines: operating dues, capital dues, any assessment, a food and beverage minimum and a trail fee if you keep your own cart. Use the form on this page to ask for the club’s current schedule; we will send it with the association charges for the home you are considering.",
  },
  {
    q: 'Can buyers choose their membership category?',
    a: 'The club’s schedule lists four: Golf, Sports, Tennis and Social. Whether every category is open to a new member at a given time, and whether a particular property carries a minimum, are questions for the club. We could not confirm a wait list or the rules for changing category from a public source.',
  },
  {
    q: 'What is the difference between the East Side and Golf Village?',
    a: `They are two separate gated areas on either side of Alternate A1A. The East Side has ${COUNTS.east} residences, the main clubhouse, the marina, the East Course and every home with boat access. Golf Village has ${COUNTS.golfVillage} houses and townhomes around three nine-hole courses, its own clubhouse and its own master association. It has no navigable water.`,
  },
  {
    q: 'Can I keep a yacht at my house?',
    a: 'Only if the lot, the dock and the water allow that boat. The master association sets boat length by lot width: on lots up to 70 feet wide, half the width plus 10 percent. Harbor Home condominiums are limited to 34 or 35 feet. Depth and canal width can lower the limit further. Larger yachts are kept at the club marina, which takes vessels up to 165 feet.',
  },
  {
    q: 'Are there bridge restrictions between Admirals Cove and the ocean?',
    a: "Admirals Cove reaches the ocean by the Intracoastal Waterway and Jupiter Inlet, past two drawbridges and no fixed bridge. Indiantown Road has 35 feet of clearance when closed and opens on the hour and half-hour. The US-1 Jupiter Federal Bridge is listed at 38 feet by NOAA and “up to 42 feet” by Florida DOT. A taller boat waits for an opening. NOAA advises local knowledge for Jupiter Inlet itself.",
  },
  {
    q: 'Can residents without a waterfront home keep a boat at the marina?',
    a: 'The club takes dockage inquiries for annual, seasonal and transient stays. We could not confirm from the club who is eligible, whether there is a wait, or how slips are allocated. Ask the marina office before you buy on the assumption that a slip will be available.',
  },
  {
    q: 'Are there condominiums in Admirals Cove?',
    a: `Yes, ${COUNTS.eastCondos} of them, all on the East Side, in four associations: Captains Way (${COUNTS.condos[0].units}), Waterside (${COUNTS.condos[1].units}), Spyglass (${COUNTS.condos[2].units}) and Nautical Way (${COUNTS.condos[3].units}). Many are sold as “Harbor Homes”. Golf Village has townhomes but no condominiums.`,
  },
  {
    q: 'Are there HOA fees separate from the club?',
    a: 'Yes. The master association and the club are separate organizations and bill separately. A condominium owner also pays the condominium association, and Golf Village has its own master association. Ask each one for its current assessment and any special assessment.',
  },
  {
    q: 'Are membership fees refundable?',
    a: 'The club’s current schedule shows no refundable portion of the initiation fee in any category. Older material describes a partly refundable equity fee. Ask the club to confirm what applies to a membership bought today.',
  },
  {
    q: 'Can owners rent out their homes?',
    a: 'Leasing is governed by the association for that home, and the rules differ between the master association and each condominium. The master association also notes that it and the club are separate, so a tenant’s use of the club is the club’s decision. Read the current leasing rules for the specific home.',
  },
  {
    q: 'What insurance should a buyer plan for?',
    a: 'Homeowners, windstorm and flood. Most parcels are in flood zone X at their centre, where a lender may not require flood insurance, but a waterfront lot is still beside tidal water. Get quotes during the inspection period, with a wind mitigation report and an elevation certificate in hand.',
  },
  {
    q: 'Can guests stay in the private hotel?',
    a: 'Yes, with a sponsor. Waterside, the club’s 32-room hotel in the main clubhouse, is for members and their guests, and the club requires sponsorship by a current member for every booking.',
  },
  {
    q: 'What should I verify before signing a contract?',
    a: 'The club’s written answer on membership for that property and its current fee schedule; every association’s budget, rules and pending assessments; the flood zone, elevation certificate and insurance quotes; and, on the water, the seawall, the dock, the depth at low tide and the boat length the association will allow.',
  },
  {
    q: 'How do I arrange a private showing?',
    a: 'Call DO Homes Group at (561) 783-7733 or use the form on this page. Admirals Cove is gated, so showings are by appointment with a licensed agent, and we arrange gate access in advance.',
  },
]

// ── Geography ────────────────────────────────────────────────────────────

export const MAP_DESCRIPTION =
  'Map of Admirals Cove in Jupiter, Florida. The community is in two parts. The East Side is the larger part: ' +
  'it runs from Alternate A1A on the west to the Intracoastal Waterway on the east, with Frederick Small Road to the south. ' +
  'Canals reach in from the Intracoastal and branch through the East Side, and most house lots back onto them. ' +
  'The main clubhouse and the marina sit together near the middle of the East Side, close to the Intracoastal. ' +
  'The East Course winds between the homes. Golf Village is the smaller part, west of Alternate A1A and the railway and east of Military Trail. ' +
  'Its homes sit around golf holes and lakes, with the Golf Village clubhouse near the middle, and it has no canals. ' +
  'The East Side entrance is where Admirals Cove Boulevard meets Alternate A1A. Jupiter Inlet is off the map to the north, reached by the Intracoastal Waterway.'
