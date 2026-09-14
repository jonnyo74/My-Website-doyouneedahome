import type { ExcludedCommunity, PaddleCommunity, PublicAnchor } from './types'

/**
 * Residential communities with resident water access, Jupiter through North Palm Beach.
 *
 * Sorted into four access tiers because "waterfront community" is the single most
 * misleading phrase in this market. A community whose docks belong to individual
 * lots is a different product from one with a shared launch, and both are different
 * again from one where the marina is a separate purchase — but all three are
 * marketed with the same three words.
 *
 * Nothing is listed on branding alone. Every entry has a source that states a
 * qualifying access type, quoted in `quote` so the reader can weigh it. Where the
 * only source is one marketing page, `sourcing` is 'single' and the page says so.
 */
export const paddleCommunities: PaddleCommunity[] = [
  {
    id: 'jonathans-landing',
    name: "Jonathan's Landing",
    town: 'Jupiter',
    area: 'north',
    tier: 'racks',
    openTo: 'Residents, POA registration',
    water: 'Salt and fresh canal network',
    route: 'open',
    sourcing: 'confirmed',
    housing:
      'Mixed — waterfront estates, golf villas, condos and townhomes, developed from the 1970s on. Gated.',
    quote:
      'Kayak racks are provided both on fresh and salt waterways… Space is limited and POA registration is required.',
    detail:
      'The only community in this guide with a documented, association-run kayak rack programme. Racks sit on Butterfly Island and across from the marina, and South Rec Park has fresh water on one side and salt on the other. Many villages have per-lot private docks; Casseekey Island holds 25 individually owned condominium boat docks, and The Anchorage leases docks through the HOA.',
    flag:
      'The two water systems are not the same. The saltwater courses reach the Intracoastal and the inlet; the freshwater courses are controlled and landlocked — paddle-only, catch and release. Ask which side the rack you are being shown sits on.',
    sources: [
      { label: "Jonathan's Landing POA — amenities", href: 'https://www.jonathanslandingpoa.com/about/amenities/' },
    ],
  },
  {
    id: 'jupiter-cove',
    name: 'Jupiter Cove',
    town: 'Tequesta',
    area: 'north',
    tier: 'racks',
    openTo: 'All owners (racks and beach)',
    water: 'Intracoastal at the inlet',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Condo — three six-storey buildings, 138 units. Gated.',
    quote:
      'sand tiki bar on the west end featuring grills, tables and outside SUP/kayak stands',
    detail:
      'A second independent source describes the same amenity as a “Pelican Tiki Park with beach seating, BBQ area, and kayak racks.” There is also a private marina with individually held slips, and direct ocean access through the Jupiter Inlet with no fixed bridges — the shortest run to open water of anything in this guide.',
    flag:
      'The tiki beach and racks read as common elements available to all owners; marina slips are bought or rented separately. Confirm the rack policy with the association rather than the listing agent.',
    sources: [
      { label: 'Meyer Lucas — Jupiter Cove', href: 'https://meyerlucas.com/neighborhoods/jupiter-cove' },
      { label: 'Jupiter Ocean Condos — Jupiter Cove', href: 'https://www.jupiteroceancondos.com/jupiter-cove/' },
    ],
  },
  {
    id: 'north-passage',
    name: 'North Passage',
    town: 'Tequesta address, Martin County',
    area: 'north',
    tier: 'racks',
    openTo: 'Residents',
    water: 'Loxahatchee River, two canals',
    route: 'bridged',
    sourcing: 'corroborated',
    housing:
      'Mixed — single-family plus 52 two-storey townhomes, early 1990s. Twenty-four-hour manned gate.',
    quote: 'Kayak launch',
    detail:
      'Listed among the community amenities alongside a nine-hole golf course, tennis, clubhouse and pool. A second source describes a boat ramp plus deep-water docks exceeding forty feet, and a twenty-minute boat run to the Jupiter Inlet. The community sits along the northern edge of the river adjacent to Jonathan Dickinson State Park.',
    flag:
      'Physically in Martin County despite the Tequesta mailing address, so taxes, schools and services all differ. Two fixed bridges downstream. The kayak launch is named on one site and the ramp on another — confirm both with the HOA.',
    sources: [
      { label: 'Meyer Lucas — North Passage', href: 'https://meyerlucas.com/neighborhoods/north-passage' },
      { label: 'PRP Jupiter — North Passage', href: 'https://prpjupiter.com/tequesta-loxahatchee-riverfront-homes-for-sale/north-passage-tequesta-waterfront-homes/' },
    ],
  },
  {
    id: 'bay-colony',
    name: 'Bay Colony',
    town: 'Juno Beach',
    area: 'south',
    tier: 'racks',
    openTo: 'Verify — marina-wide?',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Condo — 215 units in ten low-rise buildings, built 1987 to 2015. Controlled access.',
    quote: 'launch kayaks and paddleboards from the marina',
    detail:
      'A private 32-boat marina for craft up to forty feet, with deeded docks steps from the residences. Slips resell in the twenty to fifty-one foot range. The best paddle-specific find south of the inlet.',
    flag:
      'The launch language reads as marina-wide but is not confirmed in an association document. Ask the COA directly whether an owner without a slip may launch — that answer decides whether this belongs on a buyer’s list at all.',
    sources: [
      { label: 'Waterfront Properties — Bay Colony', href: 'https://www.waterfront-properties.com/junobeachbaycolony.php' },
      { label: 'Frankel Realty — Bay Colony', href: 'https://www.frankel-realty.com/bay-colony-juno-beach.php' },
    ],
  },
  {
    id: 'prosperity-harbor',
    name: 'Prosperity Harbor',
    town: 'North Palm Beach',
    area: 'south',
    tier: 'racks',
    openTo: 'All residents (day docks)',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Mixed — roughly 80 single-family plus 40-odd townhomes. Manned gate.',
    quote: 'day docks for non-waterfront properties',
    detail:
      'The rare community that thought about the non-waterfront buyer: private docks with no fixed bridges for the waterfront lots, and community day docks the rest of the neighbourhood can launch from. Paddleboards are permitted at the day docks, and it is a short run to the Palm Beach Inlet.',
    flag:
      'Storage is not allowed at the day docks — the board goes home with you every time. Worth knowing before someone buys the townhome expecting a rack.',
    sources: [
      { label: 'prosperityharbor.com', href: 'https://prosperityharbor.com/' },
      { label: 'R&R Realty — Prosperity Harbor', href: 'https://randrflorida.com/north-palm-beach-florida-homes-for-sale/prosperity-harbor/' },
    ],
  },
  {
    id: 'tequesta-country-club',
    name: 'Tequesta Country Club',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Members — $200/yr plus $250 ramp key',
    water: 'Loxahatchee main stem',
    route: 'open',
    sourcing: 'confirmed',
    housing:
      'About 550 single-family residences with garden, golf or waterfront exposure. Not gated.',
    quote: 'a unique neighborhood with private parks, and a boat ramp with dock',
    detail:
      'The best-documented community launch in the northern half of this guide, and the association says it in its own words. Three riverside parks — North, South and Country Club Drive — plus a day dock and ramp, with a clear run to the inlet and no fixed bridges on the route.',
    flag:
      'Membership in the civic association is voluntary at $200 a year, with the boat-ramp key an optional $250 on top. Trailer parking is limited to the grass and the ramp is use-at-your-own-risk. For a kayak, the waterfront parks may give you bank access without the key at all — confirm that, because it changes the maths.',
    sources: [
      { label: 'Tequesta Country Club Civic Association', href: 'https://tccca.online/about-us' },
      { label: 'Waterfront Properties — Tequesta Country Club', href: 'https://www.waterfront-properties.com/loxahatcheetequestacountryclub.php' },
    ],
  },
  {
    id: 'bermuda-terrace',
    name: 'Bermuda Terrace',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Association — terms unverified',
    water: 'North Fork',
    route: 'bridged',
    sourcing: 'corroborated',
    housing:
      'Single-family — 1950s and 60s CBS ranches around 1,200 to 1,400 sq ft mixed with newer homes over 4,000. Not gated.',
    quote: 'well-known for its communal dock, private boat ramp, and dry boat storage',
    detail:
      'Three independent sources agree on the combination of communal dock, ramp and dry storage — unusual for a non-gated neighbourhood of modest older houses, and the reason this one deserves a serious look from a paddling buyer who is not chasing a trophy home.',
    flag:
      'The HOA site has a Dock/Dues page that could not be loaded, so slot allocation, waitlists and fees are unknown. Call the association before showing it as a selling point. On the North Fork, so fixed bridges sit between here and the inlet — irrelevant paddling, decisive for a powerboat.',
    sources: [
      { label: 'Echo Fine Properties — Bermuda Terrace', href: 'https://www.echofineproperties.com/communities/tequesta-communities/bermuda-terrace/' },
      { label: 'Kristin Wallace — Jupiter boating communities', href: 'https://kristinwallacerealestate.com/blog/jupiter-boating-communities' },
    ],
  },
  {
    id: 'sims-creek',
    name: 'Sims Creek',
    town: 'Jupiter',
    area: 'north',
    tier: 'shared',
    openTo: 'All residents, first come first served',
    water: 'Sims Creek to the Loxahatchee',
    route: 'bridged',
    sourcing: 'corroborated',
    housing:
      '53 DiVosta poured-concrete single-family homes plus a condo section — about 201 homes across the group. Not gated.',
    quote:
      'There is also a community dock with clubhouse and pool on a first-come, first-serve basis',
    detail:
      'A tidal tributary of the Loxahatchee with a genuine shared dock. The Town’s planned Sims Creek Preserve launch sits on the same creek, which would give this pocket two put-ins on foot.',
    flag:
      'Two things the marketing skips. Only the west side is true waterfront — homes near the entrance face a lake and the south side faces preserve. And the Center Street bridge over Sims Creek clears just 4.5 feet at high water: perfect for a kayak, impossible for anything with a windshield, whatever “ocean access” implies.',
    sources: [
      { label: 'Echo Fine Properties — Sims Creek', href: 'https://www.echofineproperties.com/communities/jupiter-homes/sims-creek/' },
      { label: 'Jupiter bridge clearances', href: 'https://www.luxuryfloridaproperties.com/blog/jupiter-bridges' },
    ],
  },
  {
    id: 'jupiter-harbour',
    name: 'Jupiter Harbour',
    town: 'Jupiter',
    area: 'north',
    tier: 'shared',
    openTo: 'Residents (shoreline)',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing:
      'Mixed — 1980s condos, townhomes from the 1980s to 2005, a few single-family. Gated, private marina.',
    quote: 'residents can launch their kayaks from the shoreline',
    detail:
      'Sits where the Intracoastal turns south across from Sawfish Bay, with a walking path along the water and townhouse docks that take 65-foot boats. No fixed bridges between here and the Jupiter Inlet.',
    flag:
      'The shoreline-launch phrasing comes from one source; the marina and the no-fixed-bridge claim are corroborated. Verify the launch itself with the association.',
    sources: [
      { label: 'Jupiter Ocean Condos — Jupiter Harbour', href: 'https://www.jupiteroceancondos.com/jupiter-harbour/' },
      { label: 'PRP Jupiter — Jupiter Harbour townhomes', href: 'https://prpjupiter.com/jupiter-intracoastal-waterfront-homes-for-sale/jupiter-harbour-waterfront-townhomes/' },
    ],
  },
  {
    id: 'waterway-village',
    name: 'Waterway Village',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Residents (park and day dock)',
    water: 'Intracoastal plus canals',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Single-family on an interior canal system with Intracoastal frontage.',
    quote: 'Community park and day dock',
    detail:
      'A second source describes Lot B as a private waterfront park overlooking the Intracoastal, used by residents for fishing, picnics, snorkelling, basketball and shuffleboard. No fixed bridges and easy ocean access. Individual homes have private docks.',
    flag:
      'Gated status is not published. Confirm whether the day dock carries a time limit — day docks usually do.',
    sources: [
      { label: 'Meyer Lucas — Waterway Village', href: 'https://meyerlucas.com/neighborhoods/waterway-village' },
      { label: 'Waterfront Properties — Waterway Village', href: 'https://www.waterfront-properties.com/tequestawaterwayvillage.php' },
    ],
  },
  {
    id: 'scrimshaw',
    name: 'Scrimshaw on the Bay',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Every unit (dock) plus shared beach',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Townhomes directly on the Intracoastal.',
    quote: 'each unit has their own private boat dock',
    detail:
      'Dockage to thirty feet, minutes to the inlet, and a sandy beach shared by the community. Because a dock is assigned to every unit, effectively every resident has water access — but the dock is not a shared launch, the beach is.',
    flag:
      'Small community, so inventory is thin. Confirm dock condition and any assignment restrictions in the association documents.',
    sources: [
      { label: 'Jupiter1 Oceanfront — Scrimshaw', href: 'https://www.jupiter1oceanfront.com/Scrimshaw.php' },
    ],
  },
  {
    id: 'mariners-cove',
    name: "Mariner's Cove",
    town: 'Palm Beach Gardens',
    area: 'south',
    tier: 'shared',
    openTo: 'Depends which sub-association',
    water: 'Fresh basin plus ICW frontage',
    route: 'lift',
    sourcing: 'corroborated',
    housing:
      'Mixed — 24 single-family around the lake, 13 on Mangrove Island, 87 attached townhouses. Unmanned gate.',
    quote: 'Freshwater marina with 29 slips for boats up to 26′',
    detail:
      'Two entirely different waters in one community. The freshwater basin has a 29-slip marina reached by a self-operated travel lift over the seawall; Mangrove Island homes have two 70-foot salt slips directly on the Intracoastal, and there is a bench park on the ICW itself.',
    flag:
      'The freshwater marina is not navigable to the Intracoastal under its own power — boats are lifted over the seawall. A kayak is trivially portaged, so this is a non-issue for paddlers and a serious one for anyone picturing a powerboat. Four sub-associations control different water rights; ask which one the unit belongs to.',
    sources: [
      { label: "Harbor Management — Mariners Cove", href: 'https://harborfla.com/communities/mariners-cove.html' },
      { label: "R&R Realty — Mariner's Cove", href: 'https://randrflorida.com/palm-beach-gardens-florida-homes-for-sale/mariners-cove/' },
    ],
  },
  {
    id: 'oak-harbour',
    name: 'Oak Harbour',
    town: 'Juno Beach',
    area: 'south',
    tier: 'shared',
    openTo: 'Slip terms not published',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Mixed — condominiums, townhouses and single-family. Twenty-four-hour security.',
    quote:
      'on-site marina with deep water dockage, no fixed bridges and direct access to the Atlantic Ocean',
    detail:
      'A community-owned marina rather than an adjacent commercial one, which is the distinction that matters here. Kayak racks are not mentioned anywhere — they are common and under-marketed, so ask.',
    flag:
      'Slip assignment and lease terms are not published. Confirm whether marina use is a residency right or a separate waiting list.',
    sources: [
      { label: 'R&R Realty — Oak Harbour', href: 'https://randrflorida.com/juno-beach-florida-homes-for-sale/oak-harbour/' },
    ],
  },
  {
    id: 'juno-isles',
    name: 'Juno Isles',
    town: 'Juno Beach / North Palm Beach',
    area: 'south',
    tier: 'shared',
    openTo: "Separate Boat Owner's Association",
    water: 'Interior canals',
    route: 'lift',
    sourcing: 'confirmed',
    housing:
      'Single-family. Not gated — the civic association states all are welcome, no approval required.',
    quote: 'the lift on the canal in Juno Isles',
    detail:
      "The Juno Isles Boat Owner's Association owns and operates a boat lift on the canal — a genuinely unusual arrangement, and one worth understanding before writing an offer.",
    flag:
      "A lift is strong evidence the canals are not freely navigable to the Intracoastal. Some Juno Isles lots are flagged as navigable water in MLS, so the system likely has both lift-served and directly connected sections — verify lot by lot. And the lift belongs to a Boat Owner's Association separate from the civic association, so it is a second membership, not a neighbourhood amenity.",
    sources: [
      { label: 'Juno Isles Civic Association', href: 'https://junoisles.org/site/' },
    ],
  },
  {
    id: 'anchorage-point',
    name: 'Anchorage Point',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Stated as waterview homes',
    water: 'Loxahatchee River',
    route: 'open',
    sourcing: 'single',
    housing:
      'Forty single-family homes built between 1960 and 2009, 1,500 to 7,400 sq ft. Gated.',
    quote: 'There is also a community dockage available for waterview homes',
    detail:
      'Many houses have private docks and direct river access; the community dockage appears to be the compensation for the non-waterfront lots.',
    flag:
      'Single detailed source, and the “waterview homes” phrasing implies allocation rather than open use. Confirm before it becomes a selling point.',
    sources: [
      { label: 'Echo Fine Properties — Anchorage Point', href: 'https://www.echofineproperties.com/communities/tequesta-communities/anchorage-point/' },
    ],
  },
  {
    id: 'tequesta-cove',
    name: 'Tequesta Cove',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Association common element',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'single',
    housing: 'Condo — three-storey complex, 24 units, originally built 1985.',
    quote: 'day dock on the Intracoastal waterway',
    detail:
      'Directly on the Intracoastal north of the inlet with no fixed bridges. Small enough that a day dock is a meaningful amenity per unit.',
    flag:
      'One source only, and no slips or kayak-specific facility are mentioned. Verify with the association.',
    sources: [
      { label: 'PRP Jupiter — Tequesta Cove', href: 'https://prpjupiter.com/tequesta-condos-for-sale/tequesta-cove-waterfront-condos/' },
    ],
  },
  {
    id: 'broadview',
    name: 'Broadview at Intracoastal Place',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Unverified',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'single',
    housing: 'Condo, originally built in the late 1970s.',
    quote: 'day dock and several marinas next door',
    detail: 'On the Intracoastal with marinas adjacent.',
    flag:
      'The community’s own listing page does not mention the day dock at all. Treat as soft until the association confirms it.',
    sources: [
      { label: 'Jupiter1 Oceanfront — Tequesta', href: 'https://www.jupiter1oceanfront.com/Tequesta.php' },
    ],
  },
  {
    id: 'sandpointe-bay',
    name: 'Sandpointe Bay',
    town: 'Tequesta',
    area: 'north',
    tier: 'shared',
    openTo: 'Unverified',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'single',
    housing: 'Condo — two six-storey buildings, 96 units, built 1982. Lighthouse views.',
    quote: 'a private dock, perfect for boaters looking to explore the surrounding waterways',
    detail:
      'One aggregator also lists kayak and paddleboard access but names no specific facility — exactly the kind of claim that evaporates on a phone call.',
    flag:
      'Availability and terms unspecified. Confirm whether the dock is day-use, assigned, or leased.',
    sources: [
      { label: 'Ampro Realty — Sandpointe Bay', href: 'https://amprorealty.com/palm-beach-county/tequesta-fl-real-estate/sandpointe-bay/' },
    ],
  },
  {
    id: 'fishermans-landing',
    name: "Fisherman's Landing",
    town: 'Jupiter',
    area: 'north',
    tier: 'shared',
    openTo: 'Ramp described as community',
    water: 'Canal system',
    route: 'bridged',
    sourcing: 'single',
    housing: 'Single-family, described elsewhere as 55+.',
    quote: 'boat trailer storage available and a community boat ramp for easy water access',
    detail:
      'A ramp, slips and trailer storage together in a 55+ community is genuinely unusual, and would be a strong entry if it holds up.',
    flag:
      'Single listing remark — and, critically, whether the canal reaches the river or dead-ends could not be confirmed. Do not repeat the “easy water access” line until you know. One call to the HOA settles both questions.',
    sources: [
      { label: 'Redfin — Jupiter community boat ramp listings', href: 'https://www.redfin.com/city/9126/FL/Jupiter/amenity/community+boat+ramp' },
    ],
  },
  {
    id: 'jupiter-landings',
    name: 'Jupiter Landings',
    town: 'Jupiter',
    area: 'north',
    tier: 'shared',
    openTo: 'Stated for non-waterfront owners',
    water: 'Interior canals',
    route: 'bridged',
    sourcing: 'single',
    housing: 'Single-family, built 1985 to 1986. Not gated.',
    quote: 'Boating access via community canals',
    detail:
      'One marketing source describes a community boat ramp offered specifically for non-waterfront property owners — the right idea, if it is real.',
    flag:
      'Whether the canals reach the Loxahatchee or dead-end is stated nowhere. Verify before claiming any kind of access.',
    sources: [
      { label: 'Echo Fine Properties — Jupiter Landings', href: 'https://www.echofineproperties.com/communities/jupiter-homes/jupiter-landings/' },
    ],
  },
  {
    id: 'eagles-nest',
    name: 'Eagles Nest',
    town: 'Jupiter',
    area: 'north',
    tier: 'shared',
    openTo: 'Ramp ownership unclear',
    water: 'Southwest Fork corridor',
    route: 'bridged',
    sourcing: 'single',
    housing: '98 single-family homes around 1,800 sq ft, HOA-governed. Not gated.',
    quote: 'private boat ramp across the street',
    detail:
      'Two sources describe a private community boat ramp — but one says “nearby” and the other says “across the street,” which strongly suggests the ramp is not inside Eagles Nest.',
    flag:
      'Do not publish this as an Eagles Nest amenity without confirming who owns the ramp. And if the ramp is on the Southwest Fork, the Loxahatchee River Road bridge clears 4.5 feet — kayak and paddleboard only, no powerboat passage downstream.',
    sources: [
      { label: 'Echo Fine Properties — Eagles Nest', href: 'https://www.echofineproperties.com/communities/jupiter-homes/eagles-nest/' },
    ],
  },
  {
    id: 'heritage-oaks',
    name: 'Heritage Oaks',
    town: 'Tequesta',
    area: 'north',
    tier: 'lot',
    openTo: '27 river lots only',
    water: 'North Fork plus interior lakes',
    route: 'bridged',
    sourcing: 'single',
    housing:
      '204 single-family homes, three to five bed, roughly 2,000 to 4,800+ sq ft. Twenty-four-hour manned guard gate.',
    quote: '27 homes on the Loxahatchee River with private dock access',
    detail:
      'One source also mentions a boat storage area. The HOA publishes no amenity detail at all.',
    flag:
      'Twenty-seven of 204 homes touch the river. The rest face interior lakes. No community launch, ramp or rack is confirmed anywhere — so unless the buyer lands one of those 27 lots, this is a lake community with a river view down the street.',
    sources: [
      { label: 'Optima Properties — Heritage Oaks', href: 'https://www.optimaproperties.com/heritage-oaks-tequesta/' },
    ],
  },
  {
    id: 'islands-of-jupiter',
    name: 'Islands of Jupiter',
    town: 'Jupiter (Martin tax rolls)',
    area: 'north',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'North Fork',
    route: 'bridged',
    sourcing: 'corroborated',
    housing:
      'Luxury estates on large waterfront lots across five enclaves — Reach, Harbour, Palm, Somerset and Compass Island. Two gated entrances.',
    quote: 'keep your boat in your backyard',
    detail:
      'Every waterfront lot has a genuine river put-in. There is no community launch, ramp or rack — access is entirely per-lot.',
    flag:
      'Three fixed bridges compound here: Island Way into the community clears twelve feet, with Tequesta Drive and Alt A1A downstream. A paddler’s dream and a big-boat owner’s problem.',
    sources: [
      { label: 'Meyer Lucas — Islands of Jupiter', href: 'https://meyerlucas.com/neighborhoods/the-islands-of-jupiter' },
      { label: 'Jupiter bridge clearances', href: 'https://www.luxuryfloridaproperties.com/blog/jupiter-bridges' },
    ],
  },
  {
    id: 'rivercrest',
    name: 'Rivercrest',
    town: 'Tequesta',
    area: 'north',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'Loxahatchee River',
    route: 'bridged',
    sourcing: 'corroborated',
    housing: 'Mixed housing from the 1940s to the present, on the river.',
    quote: 'large boat docks with lifts in the backyard',
    detail: 'Per-lot docks with lifts. No community dock, ramp or launch.',
    flag:
      'Sources state plainly that two fixed bridges — Tequesta Drive and A1A — sit between Rivercrest and the Intracoastal. Rare honesty in marketing copy, and worth quoting back.',
    sources: [
      { label: 'Echo Fine Properties — Tequesta communities', href: 'https://www.echofineproperties.com/communities/tequesta-communities/' },
    ],
  },
  {
    id: 'pennock-point',
    name: 'Pennock Point',
    town: 'Jupiter',
    area: 'north',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'Loxahatchee River',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Estate lots on the river peninsula. No HOA at all.',
    quote: 'private docks',
    detail:
      'On-property boat storage is permitted, which is unusual and valuable. Because there is no HOA there is no community facility of any kind — access is the deed or nothing.',
    flag:
      'No HOA also means no shared amenity to inherit and no association to call. Everything is parcel-specific; read the survey.',
    sources: [
      { label: 'Echo Fine Properties — Pennock Point', href: 'https://www.echofineproperties.com/communities/jupiter-homes/pennock-point/' },
    ],
  },
  {
    id: 'jupiter-river-estates',
    name: 'Jupiter River Estates',
    town: 'Jupiter',
    area: 'north',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'Loxahatchee River',
    route: 'open',
    sourcing: 'single',
    housing: 'Custom estates built 1952 to 2002 on half-acre-plus lots.',
    quote: 'private docks that can accommodate vessels of various sizes',
    detail: 'Per-lot docks. No community dock, ramp or launch found.',
    flag:
      'Verify dock permits and seawall condition on any home built in the 1950s or 60s — that vintage is where deferred marine work hides.',
    sources: [
      { label: 'Echo Fine Properties — Jupiter River Estates', href: 'https://www.echofineproperties.com/communities/jupiter-homes/jupiter-river-estates/' },
    ],
  },
  {
    id: 'bay-harbor',
    name: 'Bay Harbor',
    town: 'Tequesta',
    area: 'north',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'Loxahatchee River',
    route: 'open',
    sourcing: 'single',
    housing: 'Nineteen custom homes on a protected peninsula. Not gated.',
    quote: 'private dockage for your yacht',
    detail: 'Nineteen homes, protected water, per-lot dockage. No community launch or dock.',
    flag: 'Tiny community — inventory almost never comes up, which is itself a talking point.',
    sources: [
      { label: 'Waterfront Properties — Tequesta waterfront', href: 'https://www.waterfront-properties.com/tequestawaterfronthomes.php' },
    ],
  },
  {
    id: 'prosperity-bay-village',
    name: 'Prosperity Bay Village',
    town: 'Palm Beach Gardens',
    area: 'south',
    tier: 'lot',
    openTo: 'Every home has a dock',
    water: 'Wide salt canal off the ICW',
    route: 'open',
    sourcing: 'single',
    housing: 'Single-family, gated entry.',
    quote:
      "The private docks that come with every house… one of Palm Beach Gardens' biggest and deepest",
    detail:
      'Because a dock comes with every home, access here is effectively universal — but delivered lot by lot rather than through a shared facility. No fixed bridges, direct Intracoastal access.',
    flag:
      'There is no community launch, so a non-waterfront listing in this subdivision would have no access at all. Per the source there are none — confirm that before assuming.',
    sources: [
      { label: 'Echo Fine Properties — Prosperity Bay Village', href: 'https://www.echofineproperties.com/communities/palm-beach-gardens-homes/prosperity-bay-village/' },
    ],
  },
  {
    id: 'frenchmans-harbor',
    name: "Frenchman's Harbor",
    town: 'North Palm Beach',
    area: 'south',
    tier: 'lot',
    openTo: '48 homes with attached docks',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing:
      "Mixed — 48 single-family plus the Carriage Homes at Frenchman's Harbor. Gated.",
    quote:
      '48 single-family homes, all with attached docks providing direct access to the Intracoastal Waterway',
    detail: 'Listings reference numbered boat slips. North of the PGA Boulevard bridge.',
    flag:
      'Whether carriage-home owners have any water access is not stated anywhere. That is the question to ask, because the carriage homes are the affordable half.',
    sources: [
      { label: "Echo Fine Properties — Frenchman's Harbor", href: 'https://www.echofineproperties.com/communities/north-palm-beach-homes/frenchmans-harbor/' },
    ],
  },
  {
    id: 'ellison-wilson-landing',
    name: 'Ellison Wilson Landing',
    town: 'North Palm Beach',
    area: 'south',
    tier: 'lot',
    openTo: 'Deeded to every unit',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'single',
    housing: 'Townhomes built 2006. Appears non-gated.',
    quote: 'a deeded 40 feet boat dock',
    detail:
      'Deeded per unit, so universal within the community, and small enough that sliding a kayak off the dock is realistic.',
    flag:
      'Single brokerage page. Confirm the deeded-dock language appears in the actual deed and not just the marketing.',
    sources: [
      { label: 'NV Realty — Ellison Wilson Landing', href: 'https://www.nvrealtygroup.com/fl/north-palm-beach/ellison-wilson-landing.php' },
    ],
  },
  {
    id: 'hidden-captains-key',
    name: 'Hidden Key & Captains Key',
    town: 'North Palm Beach',
    area: 'south',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'Canals and Little Lake Worth',
    route: 'bridged',
    sourcing: 'single',
    housing:
      "Single-family on half-acre-plus lots — Captain's Key 25 homes, Hidden Key 93. Both gated.",
    quote: 'boat dockage and boating access to the Intracoastal and ocean',
    detail:
      'Per-home docks on the canal system connecting to Little Lake Worth and south to Lake Worth.',
    flag:
      'Fixed-bridge clearances on the North Palm Beach canal crossings are not specified in any source, and several are low spans that stop sailboats but not kayaks. Get the numbers before repeating “ocean access.”',
    sources: [
      { label: 'Russo Group — Hidden Key / Captains Key', href: 'https://russo-group.com/community/hidden-key-captains-key/' },
    ],
  },
  {
    id: 'harbour-isles',
    name: 'Harbour Isles',
    town: 'North Palm Beach',
    area: 'south',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'NPB waterway / ICW',
    route: 'open',
    sourcing: 'corroborated',
    housing: '99 Mediterranean single-family homes on 76 acres. Gated.',
    quote: 'access to the Atlantic Ocean, and docks able to accommodate yachts',
    detail: 'Wide canals, private docks, wide-water views. No community launch documented.',
    flag:
      'Non-waterfront lots in a gated community with no shared facility have no access — check the plat before assuming the water conveys.',
    sources: [
      { label: 'Waterfront Properties — Harbour Isles', href: 'https://www.waterfront-properties.com/npbharbourisles.php' },
    ],
  },
  {
    id: 'lost-tree-village',
    name: 'Lost Tree Village',
    town: 'North Palm Beach',
    area: 'south',
    tier: 'lot',
    openTo: 'Waterfront lots only',
    water: 'ICW plus ornamental lakes',
    route: 'open',
    sourcing: 'single',
    housing:
      '524 residences on 450 acres, ocean to Intracoastal. Private gated enclave with a beach club.',
    quote: 'Launch a yacht from your private dock and cruise the Intracoastal Waterway',
    detail:
      'Real Intracoastal frontage on the water side. No community paddle launch or rack found.',
    flag:
      'The “tranquil inland lakes” in the marketing are ornamental. Only the Intracoastal-side lots have access that means anything.',
    sources: [
      { label: 'Lost Tree Realty', href: 'https://www.losttreerealty.com/village' },
    ],
  },
  {
    id: 'jupiter-yacht-club',
    name: 'Jupiter Yacht Club',
    town: 'Jupiter',
    area: 'north',
    tier: 'slip',
    openTo: 'Slip owners only',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'confirmed',
    housing:
      'Condo — five buildings, the last completed 2006. Gated with electronic key access.',
    quote:
      'All Slips at Jupiter Yacht Club Marina are individually owned with some available for sale or rent by the owners',
    detail:
      '79 slips up to 65 feet, one mile from the Jupiter Inlet with no fixed bridge. A superb boating address.',
    flag:
      'The paddleboard and kayak launching widely attributed to JYC is on the Town of Jupiter’s public Riverwalk, which runs through the property. It is public, not a community amenity, and not exclusive to residents. Correct this one out loud — it comes up constantly.',
    sources: [
      { label: 'Jupiter1 Oceanfront — Jupiter Yacht Club', href: 'https://www.jupiter1oceanfront.com/JupiterYachtClub.php' },
    ],
  },
  {
    id: 'marina-at-the-bluffs',
    name: 'The Marina at the Bluffs',
    town: 'Jupiter',
    area: 'north',
    tier: 'slip',
    openTo: 'Dockominium owners',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'confirmed',
    housing:
      'Within The Bluffs — seven neighbourhoods of single-family, townhomes and condos begun in 1984 by Burg & DiVosta.',
    quote: 'A Dockominium is Real Estate… bought and sold just like any other property',
    detail:
      'A fourteen-acre yacht basin at Channel Marker 25, with ocean access via the Jupiter Inlet or the Palm Beach Inlet.',
    flag:
      'Slips are dockominiums traded on the open market — emphatically not an amenity of living in The Bluffs. No kayak launch or rack found anywhere on the property.',
    sources: [
      { label: 'The Bluffs Marina', href: 'https://www.thebluffsmarina.com/jupiter-florida-marina/' },
    ],
  },
  {
    id: 'admirals-cove',
    name: 'Admirals Cove',
    town: 'Jupiter',
    area: 'north',
    tier: 'slip',
    openTo: 'Members and dock owners',
    water: 'ICW plus canal network',
    route: 'open',
    sourcing: 'confirmed',
    housing:
      'Gated club community with per-lot dockage and a marina for vessels to 165 feet.',
    quote: 'deep-water dockage with no fixed bridges',
    detail:
      'A fuel dock, a full-service marina, and one of the most boat-oriented addresses in the county.',
    flag:
      'No kayak launch, rack, or beach put-in appears anywhere on the club’s own amenities page. Famous for boating is not the same as good for paddling — worth saying plainly to a buyer who paddles.',
    sources: [
      { label: 'Admirals Cove — amenities', href: 'https://www.admiralscove.net/amenities' },
    ],
  },
  {
    id: 'casseekey-island',
    name: 'Casseekey Island',
    town: 'Jupiter',
    area: 'north',
    tier: 'slip',
    openTo: 'Dock owners',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing: "Within Jonathan's Landing.",
    quote: '25 individually owned condominium boat docks',
    detail: 'Docks sized for 40 to 100 foot yachts.',
    flag:
      "No kayak facility here — but residents fall under the Jonathan's Landing POA, so the rack programme applies. Two different amenities with two different sets of rules.",
    sources: [
      { label: "Jonathan's Landing for boaters", href: 'https://faxonandstanko.com/blog/jonathans-landing-for-boaters-canals-river-and-inlet' },
    ],
  },
  {
    id: 'marina-gardens',
    name: 'Marina Gardens',
    town: 'Palm Beach Gardens',
    area: 'south',
    tier: 'slip',
    openTo: 'Slip purchasers',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'corroborated',
    housing: 'Townhomes, two to three storeys, 1,888 to 3,300 sq ft. Gated.',
    quote: '146 slips for yachts ranging from 30 to 75 feet',
    detail:
      'Soverel Harbour Marina sits adjacent at 2401 PGA Boulevard, and residents can purchase slips in the 45 to 55 foot range.',
    flag:
      'The marina is commercial inventory, not an HOA asset — a slip is a separate transaction. No kayak launch or rack documented.',
    sources: [
      { label: 'Echo Fine Properties — Marina Gardens', href: 'https://www.echofineproperties.com/communities/palm-beach-gardens-homes/marina-gardens/' },
      { label: 'Soverel Harbour Marina', href: 'https://soverelmarina.com/marina-information/' },
    ],
  },
  {
    id: 'azure',
    name: 'Azure Palm Beaches',
    town: 'Palm Beach Gardens',
    area: 'south',
    tier: 'slip',
    openTo: 'Marina privileges',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'single',
    housing: 'Condo — two low-rise buildings, 101 units. Twenty-four-hour security and concierge.',
    quote: 'yacht slips, and marina privileges',
    detail:
      'Sits at Loggerhead Marina on the Intracoastal at Donald Ross Road. Building data records a community boat dock.',
    flag:
      'A major listing portal shows a kayak launch on this building’s page. On inspection it resolves to Bert Winters Park — a public county facility down the road, not an Azure amenity. Do not repeat it.',
    sources: [
      { label: 'NV Realty — Azure', href: 'https://www.nvrealtygroup.com/fl/palm-beach-gardens/azure-luxury-waterfront.php' },
    ],
  },
  {
    id: 'cypress-island',
    name: 'Cypress Island',
    town: 'Palm Beach Gardens',
    area: 'south',
    tier: 'slip',
    openTo: 'Dock owners or marina renters',
    water: 'Intracoastal',
    route: 'open',
    sourcing: 'single',
    housing:
      'Mixed — an island community of condos and single-family homes on the Intracoastal.',
    quote:
      'private docking facilities or easy access to the adjacent marina, with boat slips for sale or rent',
    detail: 'Either own a dock or buy or rent an adjacent marina slip.',
    flag: 'No community paddle launch documented. Gated status not stated.',
    sources: [
      { label: 'Waterfront Properties — Cypress Island', href: 'https://www.waterfront-properties.com/pbgcypressisland.php' },
    ],
  },
  {
    id: 'frenchmans-creek',
    name: "Frenchman's Creek",
    town: 'Palm Beach Gardens',
    area: 'south',
    tier: 'slip',
    openTo: 'Dock owners or a Loggerhead slip',
    water: 'ICW plus interior creek system',
    route: 'open',
    sourcing: 'corroborated',
    housing:
      'Roughly 600 homes on 700 acres, carriage homes to waterfront estates. Gated, mandatory club membership.',
    quote: 'private docks and large watercraft',
    detail:
      'Waterfront homeowners have their own docks; everyone else uses the full-service Loggerhead Club and Marina. Positioned between two inlets without fixed bridge obstructions.',
    flag:
      'Two-tier access with a mandatory club membership on top. No kayak launch or rack is documented as a club amenity — a notable omission for a community this size.',
    sources: [
      { label: "Homes.com — Frenchman's Creek neighborhood guide", href: 'https://www.homes.com/local-guide/palm-beach-gardens-fl/frenchmans-creek-neighborhood/' },
    ],
  },
  {
    id: 'old-port-cove',
    name: 'Old Port Cove — Harbor Village',
    town: 'North Palm Beach',
    area: 'south',
    tier: 'slip',
    openTo: 'Slip holders',
    water: 'North Lake Worth / ICW',
    route: 'open',
    sourcing: 'confirmed',
    housing: 'Condo — eight towers plus a low-rise. Manned gate, 24/7.',
    quote: 'its own breathtaking marina… complete with fifty-six boat slips',
    detail:
      'Deepwater immediately inside the Lake Worth Inlet approach, no fixed bridges, plus a two-mile walking path along the water.',
    flag:
      'None of the three association sites documents a kayak launch, rack or floating platform, and the Towers’ amenity list conspicuously omits any water access beyond views. Racks are common and under-marketed — ask, but do not assume.',
    sources: [
      { label: 'Harbor Village at Old Port Cove', href: 'https://harborvillageopc.com/' },
      { label: 'Old Port Cove Towers', href: 'https://opctowers.com/' },
    ],
  },
]

/**
 * Communities with water and no paddling value.
 *
 * Published deliberately. Being the page that says "that one is a retention pond"
 * is worth more to a buyer than being the page with the longest list.
 */
export const excludedCommunities: ExcludedCommunity[] = [
  {
    name: 'River Ridge',
    town: 'Tequesta',
    notable: true,
    why: 'Two landlocked lakes where kayaking is permitted and powerboats are banned — no outlet. Forty-three of its 173 homes do touch the North Fork via private docks; forty-eight overlook the lakes only. There is no community river access. The sharpest trap in this market.',
  },
  { name: 'Rialto', town: 'Jupiter', why: 'Interior lakes. The “Loxahatchee Reserve” name describes nothing navigable.' },
  { name: 'Botanica', town: 'Jupiter', why: 'Sixty acres of preserve and ornamental lakes. No launch.' },
  { name: 'Egret Landing', town: 'Jupiter', why: 'Retention lakes. Pools, tennis, playground.' },
  { name: 'Paseos', town: 'Jupiter', why: 'No water amenity of any kind.' },
  { name: 'Abacoa', town: 'Jupiter', why: 'Every neighbourhood. Lakes and preserves, no navigable water.' },
  { name: 'Jupiter Country Club', town: 'Jupiter', why: 'Golf-course lakes.' },
  { name: 'Evergrene', town: 'Palm Beach Gardens', why: 'A 36-acre retention lake. No boating amenity published anywhere.' },
  {
    name: "Frenchman's Reserve",
    town: 'Palm Beach Gardens',
    notable: true,
    why: "Golf, no water access. Not to be confused with Frenchman's Creek or Frenchman's Harbor, which have real docks.",
  },
  { name: "Frenchman's Landing", town: 'Palm Beach Gardens', why: 'Gated, tennis. The name is branding.' },
  { name: 'PGA National', town: 'Palm Beach Gardens', why: 'Course hazards. Its own site sends guests to public beaches.' },
  { name: 'BallenIsles', town: 'Palm Beach Gardens', why: 'Country club lakes.' },
  { name: 'Mirasol', town: 'Palm Beach Gardens', why: 'Ornamental lakes only.' },
  { name: 'Old Palm Golf Club', town: 'Palm Beach Gardens', why: 'Golf community, ornamental lakes.' },
  { name: 'Alton', town: 'Palm Beach Gardens', why: 'The only water reference on its own amenities page is off-site third-party marinas.' },
  {
    name: 'Harbour Oaks',
    town: 'Palm Beach Gardens',
    notable: true,
    why: '“Private lake views” — ornamental. The nautical name misleads.',
  },
  { name: 'Crystal Pointe', town: 'Palm Beach Gardens', why: '280 homes, no water body at all.' },
  { name: 'Bay Hill Estates', town: 'Palm Beach Gardens', why: 'Near the C-17 but no documented access.' },
]

/**
 * Public launches in the southern half of the market.
 *
 * These belong on the communities page rather than the launch map because they
 * are the reason so few HOAs down here bothered to build their own — several
 * communities' "kayak access" claims resolve to one of these on inspection.
 */
export const southernPublicAnchors: PublicAnchor[] = [
  {
    name: 'Anchorage Park',
    where: '603 Anchorage Drive, North Palm Beach',
    note: 'The best dedicated paddle put-in in the county: a walk-up kayak launch platform on the C-17 / Earman River, and the Village states plainly that it needs no permit to use. The trailer ramp beside it is residents-only by annual decal. If a buyer paddles, proximity to this park beats most waterfront branding.',
  },
  {
    name: 'Bert Winters Park',
    where: '13425 Ellison Wilson Road, Juno Beach',
    note: 'County park on the Intracoastal. Renovated two-lane ramp, three floating staging docks, 45 added car and trailer spaces, ADA restrooms. Trailers need a county permit; walk-on paddlers generally launch free. Sunrise to sunset.',
  },
  {
    name: 'Lake Park Harbor Marina',
    where: '535 Park Avenue, Lake Park',
    note: 'Dual ramps into the Lake Worth Lagoon. No dedicated kayak launch — paddlers use the ramp. Ten dollars per launch, $210 annual, enforced around the clock through the Passport app. Trailer lots are for tow vehicles only.',
  },
  {
    name: 'MacArthur Beach State Park',
    where: '10900 Jack Nicklaus Drive, North Palm Beach',
    note: 'Hand launch into the Lake Worth Cove estuary, with a paddle under Burnt Bridge into the lagoon and out to Munyon Island. Per-vehicle state park entry; rentals through Friends of MacArthur Beach.',
  },
  {
    name: 'Sandhill Crane Access Park',
    where: 'Loxahatchee Slough, west Palm Beach Gardens',
    note: 'The only public paddle launch inside Palm Beach Gardens itself. Freshwater slough, observation tower, multi-use trails. No connection to the Intracoastal — a different kind of morning entirely.',
  },
  {
    name: 'Not a launch',
    where: 'Juno Beach Park · Loggerhead Park',
    note: 'Both are ocean beach and pier only, with no paddlecraft launch. A surf launch is possible and is not what anyone means when they ask. Listed so nobody drives there with a roof rack.',
  },
]

export const COMMUNITY_DISCLAIMER =
  'Amenities, fees and association rules change. Verify with the association and the governing documents before writing an offer — nothing on this page is a representation about any specific property.'
