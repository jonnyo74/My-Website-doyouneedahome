import type { LaunchSite } from './types'

/**
 * Public paddlecraft access on the Loxahatchee River system, the Jupiter Inlet,
 * and the adjacent Intracoastal.
 *
 * Compiled September 2026 from the managing agencies wherever one publishes the
 * facility: the Town of Jupiter, Palm Beach County Parks and ERM, Florida State
 * Parks, the BLM, the FDEP Loxahatchee River paddling guide, and the Village of
 * Tequesta. Where only a secondary source describes a site, `sourcing` says so
 * on the page rather than in a comment.
 *
 * Two deliberate inclusions that are NOT launches: Trapper Nelson (reachable
 * only by water) and the Sims Creek / Jones Creek preserves (permitted but not
 * confirmed open). Both are here because leaving them out is how someone wastes
 * a Saturday, and the entries say plainly what they are.
 *
 * Two deliberate exclusions: "Cato's Bridge" and Loxahatchee River Road. Both
 * circulate locally as launches; neither appears in any agency inventory, and
 * Loxahatchee River Road is a private gated community. They are addressed in the
 * page copy so a reader who has heard the names gets an answer.
 */
export const launches: LaunchSite[] = [
  {
    id: 'sawfish-bay',
    n: 1,
    name: 'Sawfish Bay Park',
    operator: 'Town of Jupiter',
    address: '1133 Alt A1A, Jupiter — at the Alternate A1A bridge',
    lat: 26.94603,
    lng: -80.09068,
    coordsPublished: false,
    kind: 'hand',
    route: 'open',
    sourcing: 'corroborated',
    group: 'tidal',
    free: true,
    beginnerFriendly: true,
    water: 'Loxahatchee River main stem, at the Intracoastal junction',
    launch: 'Gently sloping sand beach — carry-in',
    parking: 'Small dedicated lot. Fills on weekends, and there is no street overflow.',
    hours: 'Dawn to dusk (the Town does not publish posted hours)',
    conditions:
      'Current runs through the bridge channel. Launch on slack or a flooding tide if you are heading east toward the inlet.',
    onSite:
      'New restrooms, drinking water, pavilion, fishing pier, boardwalk, and a historic 1915 train depot. No dogs, no alcohol.',
    description:
      'The best all-round put-in inside town limits, and the one locals name first. From this one small beach you can turn east toward the lighthouse and the sandbar, north or south on the Intracoastal, or west into the river’s quiet backwaters — three completely different paddles.',
    buyerAngle:
      'Puts the whole river system inside a fifteen-minute paddle without ever crossing the inlet. Anything within a mile of the Alt A1A bridge corridor is a legitimate “walk the kayak down” address.',
    sources: [
      { label: 'Town of Jupiter — Fishing & parks', href: 'https://www.jupiter.fl.us/461/Fishing' },
      { label: 'Paddling.com — Sawfish Bay Park', href: 'https://paddling.com/paddle/locations/sawfish-bay-park' },
    ],
  },
  {
    id: 'burt-reynolds',
    n: 2,
    name: 'Burt Reynolds Park',
    operator: 'Palm Beach County / Town of Jupiter',
    address: '805 N US Highway 1 (east) · 800 N US Highway 1 (west), Jupiter',
    lat: 26.94195,
    lng: -80.08377,
    coordsPublished: true,
    kind: 'ramp',
    route: 'open',
    sourcing: 'confirmed',
    group: 'tidal',
    free: true,
    beginnerFriendly: true,
    water: 'Loxahatchee River and Intracoastal, one mile above the inlet',
    launch:
      'A dedicated non-motorized launching beach, set apart from two two-lane concrete ramps',
    parking:
      'About 200 spaces across both sides. Car parking is free; the county lists a $15 daily boat-trailer permit.',
    hours: 'Park dawn to dusk; the boat ramps are open 24 hours',
    conditions:
      'Real tidal current in the channel and heavy motorboat traffic on weekends. The calm days here are weekday mornings.',
    onSite:
      'Restrooms, picnic shelters, grills, fish-cleaning station, playground, the Loxahatchee River Center aquarium, and a self-serve PADL board rental kiosk.',
    description:
      'The most forgiving launch on the salt side: a sandy beach for paddlers physically separated from the trailer ramps, open around the clock, with a gentle run down to Fullerton Island and Sawfish Bay. If someone in the household is new to a kayak, this is where they learn.',
    buyerAngle:
      'The Riverwalk corridor and the US-1 condos sit within a short cart ride. For a downsizing buyer who wants water without the cost of a dock, this is the strongest argument in Jupiter.',
    sources: [
      { label: 'Town of Jupiter — Boating & ramps', href: 'https://www.jupiter.fl.us/463/BoatingRamps' },
      { label: 'Palm Beach County Parks — Burt Reynolds', href: 'https://discover.pbc.gov/parks/Locations/Burt-Reynolds.aspx' },
    ],
  },
  {
    id: 'dubois',
    n: 3,
    name: 'DuBois Park',
    operator: 'Palm Beach County',
    address: '19075 DuBois Road, Jupiter',
    lat: 26.94238,
    lng: -80.07638,
    coordsPublished: true,
    kind: 'hand',
    route: 'open',
    sourcing: 'confirmed',
    group: 'tidal',
    free: true,
    beginnerFriendly: false,
    water: 'Jupiter Inlet, at the river and lagoon confluence',
    launch: 'Non-motorized launch onto the protected tidal lagoon beach. Eighteen day-use slips.',
    parking: 'Large lot that fills completely on weekends and holidays — arrive before nine.',
    hours: 'Dawn to dusk; lifeguards roughly 9:00 to 5:20 in season',
    conditions:
      'The most current-sensitive site in this guide. Swift inlet flow, a persistent rip along the jetty, and constant boat traffic through the cut. Launch inside the lagoon and time your exit for slack water.',
    onSite:
      'Restrooms with showers, grills, pavilions, playground, and the historic DuBois pioneer home.',
    description:
      'Postcard water, and the single most beautiful launch in the county — with the strongest current. The lagoon itself is calm and shallow enough for children; the inlet fifty yards away is not. Know which side of that line you are on before you push off.',
    buyerAngle:
      'Jupiter Inlet Colony, the Beach Road condos and the Jupiter Beach Road corridor all sit within a cart ride. Weekend parking is the real constraint here, which is exactly why walkability to it carries a genuine premium.',
    sources: [
      { label: 'Palm Beach County Parks — DuBois', href: 'https://discover.pbc.gov/parks/Locations/DuBois.aspx' },
      { label: 'Jupiter Inlet District', href: 'https://www.jupiterinletdistrict.org/boating-and-outdoor-recreation' },
    ],
  },
  {
    id: 'coral-cove',
    n: 4,
    name: 'Coral Cove Park',
    operator: 'Palm Beach County — Tequesta address',
    address: '1600 Beach Road (SR A1A), Tequesta',
    lat: 26.9641,
    lng: -80.0793,
    coordsPublished: true,
    kind: 'hand',
    route: 'open',
    sourcing: 'confirmed',
    group: 'tidal',
    free: true,
    beginnerFriendly: true,
    water: 'Intracoastal and Jupiter Sound on the west side; the Atlantic on the east',
    launch: 'Sand-and-rock shoreline hand launch on the Intracoastal side',
    parking: 'County lot plus roadside spaces along A1A, mostly on the ocean side.',
    hours: 'Sunrise to sunset, daily',
    conditions:
      'Best at high tide — it goes thin and rocky on the low. Current builds on the ebb because the inlet is just south.',
    onSite:
      'Restrooms, outdoor showers, grills, playground, and a lifeguarded 600-foot ocean beach. The Loxahatchee River District runs its public guided kayak tours from here.',
    description:
      'The only genuine public launch with a Tequesta address, and it earns the spot: clear shallow water, rays and turtles on a calm morning, and an ocean beach across the road for whoever in the family is not paddling.',
    buyerAngle:
      'This is the launch that makes Jupiter Island and east Tequesta work. Read the address carefully — it is a county park, open to everyone, with no residency requirement.',
    sources: [
      { label: 'Palm Beach County Parks — Coral Cove', href: 'https://discover.pbc.gov/parks/Locations/Coral-Cove.aspx' },
      { label: 'Loxahatchee River Center — Coral Cove kayak tour', href: 'https://lrdrivercenter.org/events-calendar/public-kayak-tour-coral-cove-park/' },
    ],
  },
  {
    id: 'waterway-park',
    n: 5,
    name: 'Waterway Park',
    operator: 'Palm Beach County',
    address: '3630 Indiantown Road, Jupiter — west side of the Intracoastal',
    lat: 26.9345,
    lng: -80.0885,
    coordsPublished: false,
    kind: 'ramp',
    route: 'open',
    sourcing: 'confirmed',
    group: 'tidal',
    free: true,
    beginnerFriendly: false,
    water: 'Intracoastal Waterway',
    launch:
      'Three concrete ramps into a 170-foot basin with four 40-foot floating staging docks; hand launch from the basin',
    parking:
      '52 car and trailer spaces plus 24 car-only. Trailer permit listed at $10 a day. No overnight parking.',
    hours: 'Sunrise to sunset',
    conditions:
      'A working trailer ramp on an open stretch of the Intracoastal — expect wake, wind chop, and Indiantown Road noise.',
    onSite: 'Restrooms, fishing pier, boardwalk. Opened 2017.',
    description:
      'Purpose-built for powerboats and useful to paddlers mainly as a southern Intracoastal put-in. If the goal is a quiet morning, launch somewhere else; if the goal is distance on open water, this is the door.',
    buyerAngle:
      'Serves the Indiantown Road corridor west of the Intracoastal. Solid for a boat-owning household, secondary for a paddling one.',
    sources: [
      { label: 'Palm Beach County Parks — Waterway Park', href: 'https://discover.pbc.gov/parks/Locations/Waterway.aspx' },
      { label: 'Town of Jupiter — Boating & ramps', href: 'https://www.jupiter.fl.us/463/BoatingRamps' },
    ],
  },
  {
    id: 'limestone-creek',
    n: 6,
    name: 'Limestone Creek Natural Area',
    operator: 'PBC Environmental Resources Management',
    address:
      '6570 Church Street trailhead, Jupiter — the launch itself is off Central Blvd, south side of the C-18',
    lat: 26.94142,
    lng: -80.13537,
    coordsPublished: true,
    kind: 'hand',
    route: 'open',
    sourcing: 'confirmed',
    group: 'tidal',
    free: true,
    beginnerFriendly: true,
    water: 'C-18 Canal and the Southwest Fork of the Loxahatchee — brackish',
    launch:
      'Paver-block hand launch, no dock. Reviewers call it steep, which is awkward with a heavy boat.',
    parking:
      'Five cars plus a bus at the Church Street trailhead, and two more lots on the south side of the canal. Limestone surface at the launch.',
    hours: 'Sunrise to sunset, 365 days',
    conditions:
      'Almost no motorboat traffic. Low tide brings wading birds; high tide brings the manatee odds.',
    onSite:
      'No restrooms and no drinking water. No dogs. Fifty-two acres of flatwoods, hydric hammock and mangrove with a trail along both banks.',
    description:
      'The quiet one. Brackish, sheltered, and close to nothing, which is the point. Bring water, leave the dog, and note that the launch is not at the Church Street trailhead most map apps will send you to.',
    buyerAngle:
      'The launch that serves inland west Jupiter. For a buyer priced out of the river, this is the argument that you do not have to be on the water to be in the water.',
    sources: [
      { label: 'PBC ERM — Limestone Creek Natural Area', href: 'https://discover.pbc.gov/erm/NaturalAreas/Limestone-Creek.aspx' },
      { label: 'Town of Jupiter — facility detail', href: 'https://www.jupiter.fl.us/facilities/Facility/Details/40' },
    ],
  },
  {
    id: 'riverbend',
    n: 7,
    name: 'Riverbend Park',
    operator: 'Palm Beach County',
    address: '9060 W Indiantown Road, Jupiter',
    lat: 26.9346,
    lng: -80.1765,
    coordsPublished: true,
    kind: 'hand',
    route: 'open',
    sourcing: 'confirmed',
    group: 'wild',
    free: true,
    beginnerFriendly: false,
    water: 'Upper Northwest Fork — freshwater cypress river',
    launch:
      'Hand launch at the outfitter concession, with a second put-in at Picnic Island that avoids the crowd',
    parking:
      'Large paved lot plus a separate equestrian and trailer lot. Everything out by closing.',
    hours: 'Sunrise to sunset',
    conditions:
      'Slow current, but two dams to portage — Lainhart about twenty minutes down, Masten 1.8 miles further — plus log jams that multiply after storms. Short boats, nine to fourteen feet.',
    onSite:
      'Port-o-lets only, no permanent restrooms. Jupiter Outdoor Center runs rentals and the shuttle down to Jonathan Dickinson.',
    description:
      'Mile zero of the 8.5-mile state-designated paddling trail, and the prettiest water in Palm Beach County — cypress knees, overhung canopy, alligators on the bank. The standard outing is out and back to Masten Dam in two or three hours; the full run to Jonathan Dickinson is 8.3 miles and about five and a half hours with a paid shuttle home.',
    buyerAngle:
      'The reason western Jupiter and the Jupiter Farms corridor sell on lifestyle rather than proximity. Fifteen minutes from Indiantown Road addresses that will never see the Intracoastal.',
    sources: [
      { label: 'Palm Beach County Parks — Riverbend', href: 'https://discover.pbc.gov/parks/Locations/Riverbend.aspx' },
      { label: 'FDEP — Loxahatchee River Paddling Guide (PDF)', href: 'https://floridadep.gov/sites/default/files/Lox_guide_0.pdf' },
    ],
  },
  {
    id: 'jonathan-dickinson',
    n: 8,
    name: 'Jonathan Dickinson State Park',
    operator: 'Florida State Parks — Martin County',
    address: '16450 SE Federal Highway (US 1), Hobe Sound',
    lat: 26.988,
    lng: -80.1428,
    coordsPublished: true,
    kind: 'ramp',
    route: 'open',
    sourcing: 'confirmed',
    group: 'wild',
    free: false,
    beginnerFriendly: false,
    water: 'Loxahatchee River, tidal Northwest Fork',
    launch: 'Rebuilt two-lane concrete ramp with a courtesy dock; doubles as the paddle launch',
    parking: 'Eight paved trailer spaces at the ramp plus general park parking.',
    hours: '8 a.m. to sunset, 365 days',
    conditions:
      'Broad and tidal here. Go upriver on the flood and ride the ebb home — the reverse turns a pleasant afternoon into work.',
    onSite:
      'Portable toilet and a small pavilion at the ramp; full restrooms and showers at the campgrounds. All concessions are closed as of 2026 — no rentals, no boat tours, no store.',
    description:
      'The downstream anchor of the Wild & Scenic run and the practical way to reach Trapper Nelson’s homestead, about three and a half river miles upstream through mangrove-lined water. Six dollars a vehicle, 11,500 acres, and the best chance in the county of seeing nobody for an hour.',
    buyerAngle:
      'Twenty minutes from most of Tequesta. For a second-home buyer weighing Jupiter against the Treasure Coast, this park is the thing that closes the gap.',
    sources: [
      { label: 'Florida State Parks — Jonathan Dickinson', href: 'https://www.floridastateparks.org/parks-and-trails/jonathan-dickinson-state-park' },
      { label: 'FDEP — Loxahatchee River Paddling Guide (PDF)', href: 'https://floridadep.gov/sites/default/files/Lox_guide_0.pdf' },
    ],
  },
  {
    id: 'trapper-nelson',
    n: 9,
    name: 'Trapper Nelson Interpretive Site',
    operator: 'Florida State Parks — water access only',
    address: 'No road access. Reached by boat on the Northwest Fork.',
    lat: 26.9761,
    lng: -80.1633,
    coordsPublished: true,
    kind: 'water-only',
    route: 'open',
    sourcing: 'confirmed',
    group: 'other',
    free: false,
    beginnerFriendly: false,
    water: 'Loxahatchee River, Northwest Fork — about mile six of the designated trail',
    launch: 'A landing and dock for paddlers and small craft. There is no way to drive here.',
    parking: 'None. Park at Jonathan Dickinson or Riverbend and paddle.',
    hours:
      'Site open 9:30 a.m. to 4:30 p.m. Operating days conflict between official sources, so call before you commit.',
    conditions:
      'Three and a half river miles upstream of the state park ramp, or roughly two and a half hours down from Riverbend with the portages. Motorboats and tour craft concentrate near the cabin at midday.',
    onSite:
      'The homestead of the “Wild Man of the Loxahatchee.” Day use only — no camping and no overnight landing.',
    description:
      'The destination that gives the whole river its story, and the only site here you have to earn. The state park publishes Wednesday to Monday and the FDEP paddling guide publishes Thursday to Monday, so phone the park rather than gamble a seven-mile round trip on it.',
    buyerAngle:
      'Not a launch. It is the answer to “where does this river actually go,” which is the question every out-of-state buyer asks on the second showing.',
    sources: [
      { label: 'Florida State Parks — Jonathan Dickinson', href: 'https://www.floridastateparks.org/parks-and-trails/jonathan-dickinson-state-park' },
      { label: 'FDEP — Loxahatchee River Paddling Guide (PDF)', href: 'https://floridadep.gov/sites/default/files/Lox_guide_0.pdf' },
    ],
  },
  {
    id: 'jilona',
    n: 10,
    name: 'Jupiter Inlet Lighthouse Outstanding Natural Area',
    operator: 'Bureau of Land Management',
    address: 'About 600 State Road 707 (Beach Road), Jupiter',
    lat: 26.95201,
    lng: -80.08226,
    coordsPublished: true,
    kind: 'unconfirmed',
    route: 'open',
    sourcing: 'corroborated',
    group: 'other',
    free: true,
    beginnerFriendly: false,
    water: 'Indian River Lagoon and the Loxahatchee at the inlet — lagoon side',
    launch:
      'An informal hand launch off the lagoon beach near the drawbridge. The BLM lists paddling as permitted but publishes no designated launch facility.',
    parking:
      'Dispersed-use lots: eight spaces north, twenty-two south, plus accessible spaces in the historic corridor.',
    hours: 'Sunrise to sunset',
    conditions:
      'The strongest current in this guide — you are effectively launching into the inlet. Experienced paddlers on a slack tide only.',
    onSite:
      'Sea urchins and jellyfish on the lagoon beaches, so wear footwear. No dogs, no bicycles. Confirm the launch spot with the museum at (561) 747-8380 x101.',
    description:
      'Included because guided tours use it and people will tell you about it, not because it is a maintained facility. Treat it as an informal put-in with a serious current, and go to Sawfish Bay instead if you are new here.',
    buyerAngle:
      'Useful context rather than a selling point: it explains why the lighthouse-view addresses have superb water views and difficult water access.',
    sources: [
      { label: 'BLM — Jupiter Inlet Lighthouse ONA', href: 'https://www.blm.gov/visit/jupiter-inlet-lighthouse-outstanding-natural-area' },
      { label: 'Jupiter Inlet District', href: 'https://www.jupiterinletdistrict.org/boating-and-outdoor-recreation' },
    ],
  },
  {
    id: 'sims-jones-creek',
    n: 11,
    name: 'Sims Creek & Jones Creek Preserves',
    operator: 'Town of Jupiter — status unconfirmed',
    address:
      'Sims Creek: Center St & Thelma Ave · Jones Creek: about 920 W Indiantown Road, Jupiter',
    lat: 26.9345,
    lng: -80.102,
    coordsPublished: false,
    kind: 'unconfirmed',
    route: 'bridged',
    sourcing: 'single',
    group: 'other',
    free: true,
    beginnerFriendly: true,
    water: 'Sims Creek and Jones Creek — mangrove tributaries of the Loxahatchee',
    launch:
      'Non-motorized launches designed into existing mangrove gaps, permitted through FDEP and the Corps. The design firm describes them as built; the Town’s own open-space brochure still lists them as planned.',
    parking:
      'Grass-pave lot at Sims Creek; limited parking at Jones Creek behind an easy-to-miss driveway entrance.',
    hours: 'Unpublished',
    conditions: 'Small sheltered creeks — the calmest water in town, if and when they open.',
    onSite: 'Call Town of Jupiter Natural Resources at (561) 741-2565 before you drive out.',
    description:
      'Two small town preserves with kayak launches somewhere between permitted and open. Worth a phone call before a drive, and worth tracking — a new public launch on a mangrove creek quietly changes what the surrounding blocks are worth.',
    buyerAngle:
      'The one genuinely forward-looking item on this map. If Sims Creek opens, the Center Street pocket gets a walkable put-in it has never had.',
    sources: [
      { label: 'Town of Jupiter — Current major projects', href: 'https://www.jupiter.fl.us/1657/Current-Major-Projects' },
      { label: 'Town of Jupiter — Open Space brochure (PDF)', href: 'https://www.jupiter.fl.us/DocumentCenter/View/21781/Open-Space-Brochure' },
    ],
  },
]

/** Map view that frames every pin above without cropping Riverbend or Jonathan Dickinson. */
export const MAP_CENTRE = { lat: 26.958, lng: -80.126 }
export const MAP_ZOOM = 12

export const LAUNCH_DISCLAIMER =
  'Hours, fees and facility status change without notice. Verify with the managing agency before you go. Nothing on this page is a representation about any specific property’s water access.'
