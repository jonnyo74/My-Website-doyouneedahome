// Single source of truth for the Tequesta dining guide. The venue profiles, the
// quick-picks table and the dining finder are generated from this list.
//
// Every entry carries only what a source stated, and says when it is "reported".
// No coordinates are stored, and no prices, ratings, happy hours or drive times
// appear. Directions links are built from the name and address text. Hours and
// operating status change, so every entry carries a "confirm" line.

export type DiningTag = 'waterfront' | 'seafood' | 'coffee' | 'date' | 'casual' | 'music' | 'jupiter'

export const DINING_TAGS: Array<{ key: DiningTag; label: string }> = [
  { key: 'waterfront', label: 'Waterfront' },
  { key: 'seafood', label: 'Seafood' },
  { key: 'coffee', label: 'Coffee and breakfast' },
  { key: 'date', label: 'Date night' },
  { key: 'casual', label: 'Casual dining' },
  { key: 'music', label: 'Live music' },
  { key: 'jupiter', label: 'Nearby Jupiter' },
]

export type DiningArea = 'village' | 'martin-mailing' | 'jupiter'

export const DINING_AREA_LABEL: Record<DiningArea, string> = {
  village: 'Tequesta (US-1 or Tequesta Drive)',
  'martin-mailing': 'Tequesta address, Martin County',
  jupiter: 'Jupiter (not Tequesta)',
}

export interface Venue {
  id: string
  name: string
  area: DiningArea
  /** Address as reported by the source. Empty string when we could not confirm one. */
  address: string
  /** Text for the directions link: name and address, never coordinates. */
  mapQuery: string
  experience: string
  special: string
  suits: string
  highlights: string
  seating: string
  reservations: string
  tip: string
  tags: DiningTag[]
  websiteUrl?: string
  sourceLabel: string
  sourceUrl: string
  confirm: string
  /** True for the four venues that get full editorial profiles. */
  featured?: boolean
}

export const VENUES: Venue[] = [
  {
    id: 'hog-snappers',
    name: 'Hog Snappers Shack & Sushi',
    area: 'village',
    address: '279 US-1, Tequesta',
    mapQuery: 'Hog Snappers, 279 US-1, Tequesta, FL 33469',
    experience: 'Sushi and seafood in a casual, funky setting',
    special:
      'A long-running local favorite that pairs a sushi bar with a seafood-and-American menu, in a relaxed and kid-friendly room. It was featured on PBS’s Check Please! South Florida, and reviewers single out the Tequesta roll.',
    suits: 'Families, groups, and anyone who wants sushi without dressing up.',
    highlights: 'Sushi rolls, including the Tequesta roll, plus appetizers and main courses, per reviewers and the restaurant listing.',
    seating: 'A casual dining room. We could not confirm outdoor seating.',
    reservations: 'We could not verify a reservation policy. Call ahead for larger groups.',
    tip: 'Hours differ between sources, with Friday and Saturday closing reported later than weeknights, so check before you drive over.',
    tags: ['seafood', 'casual'],
    sourceLabel: 'Restaurant listing',
    sourceUrl: 'https://www.restaurantji.com/fl/tequesta/hog-snappers-shack-and-sushi-teq-/',
    confirm: 'Current hours and menu.',
    featured: true,
  },
  {
    id: 'blue-pointe',
    name: 'Blue Pointe Bar & Grill',
    area: 'martin-mailing',
    address: '18701 SE Federal Highway, Tequesta mailing address',
    mapQuery: 'Blue Pointe Bar and Grill, 18701 SE Federal Highway, Tequesta, FL 33469',
    experience: 'A family-friendly waterfront bar and grill with a pool and music',
    special:
      'Blue Pointe is built around the water and the crowd. Listings describe covered outdoor seating on the Intracoastal with a pool in the middle of it, which is why families are common, plus a steady lineup of live music.',
    suits: 'Families, boaters, and groups that want a lively day on the water rather than a quiet dinner.',
    highlights: 'Reviewers mention ahi tuna nachos, mahi tacos, a blackened mahi reuben and coconut shrimp, along with tropical cocktails and draft beer.',
    seating: 'Covered outdoor seating with a pool. A listing says the pool is heated, which we could not confirm with the venue.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'Listings say there are five boat slips to the north for arriving by water, and that a golf cart shuttles guests between the parking lot and the bar. Confirm slip rules and parking before you go. Live music frequency varies by source, from daily to nightly, so check the schedule.',
    tags: ['waterfront', 'seafood', 'music', 'casual'],
    sourceLabel: 'WPTV Hidden Gems',
    sourceUrl: 'https://www.wptv.com/lifestyle/hidden-gems/blue-pointe-bar-and-grill',
    confirm: 'Hours, music schedule, slip and visitor rules, and municipal location. The address points to Martin County, not the Village.',
    featured: true,
  },
  {
    id: 'tiki-52',
    name: 'Tiki 52 Bar & Grill',
    area: 'martin-mailing',
    address: '18487 SE Federal Highway, Tequesta mailing address, at Blowing Rocks Marina',
    mapQuery: 'Tiki 52, 18487 SE Federal Highway, Tequesta, FL 33469',
    experience: 'An open-air tiki bar on a working marina',
    special:
      'Where Blue Pointe is about the pool and the crowd, Tiki 52 is about the marina. It sits inside Blowing Rocks Marina, with a sandy patio of colorful tables and umbrellas under palapa roofs, looking over the boats and the Intracoastal.',
    suits: 'Boaters, anglers, and people who like a marina-bar feel with music and a Caribbean mood.',
    highlights: 'Seafood, sandwiches, burgers and cocktails, with steaks, shrimp, fish tacos, tuna nachos and coconut shrimp mentioned by reviewers.',
    seating: 'Open-air patio with palapa roofs overlooking the marina and Intracoastal.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'A guide says the kitchen will cook your catch, and guides report live music Thursday through Sunday, with trivia nights mentioned elsewhere. Confirm both with the restaurant. Listings carry two different phone numbers, so verify before you call.',
    tags: ['waterfront', 'seafood', 'music', 'casual'],
    websiteUrl: 'https://tiki52tequesta.com',
    sourceLabel: 'Discover Martin',
    sourceUrl: 'https://discovermartin.com/?p=34313',
    confirm: 'Hours, live-music nights, contact details and the marina’s current service. The address points to Martin County.',
    featured: true,
  },
  {
    id: 'papichulo',
    name: 'PapiChulo Tacos (Tequesta)',
    area: 'village',
    address: 'On US-1 in Tequesta. We could not confirm the street address.',
    mapQuery: 'PapiChulo Tacos, Tequesta, FL',
    experience: 'Mexican street-style tacos and tequila',
    special:
      'A taqueria that grew from a Jupiter flagship opened in 2018 around tacos, tequila and a beachy mood. The Tequesta location is reported to be on US-1 and to get crowded.',
    suits: 'Casual, quick dinners and groups, and a taco-and-margarita night.',
    highlights: 'Tacos and margaritas. Reviews of the original Jupiter location mention Taco Tuesday margaritas and a dog-friendly patio, so confirm both for Tequesta.',
    seating: 'Confirm patio and seating details with the restaurant.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'Because it can get crowded, plan for a wait at peak times.',
    tags: ['casual'],
    websiteUrl: 'https://papichulotacos.com',
    sourceLabel: 'PapiChulo Tacos',
    sourceUrl: 'https://papichulotacos.com',
    confirm: 'The Tequesta street address, hours and menu.',
    featured: true,
  },
  {
    id: 'evo-italian',
    name: 'EVO Italian',
    area: 'village',
    address: '150 N US Highway 1, Suites 11-13, Tequesta',
    mapQuery: 'EVO Italian, 150 N US Highway 1, Tequesta, FL 33469',
    experience: 'A dinner-only Italian restaurant',
    special: 'A dinner restaurant on the US-1 corridor with a smart-casual dress code, led by executive chef Erik Pettersen according to a listing.',
    suits: 'A planned dinner out or a date.',
    highlights: 'We have not verified specific dishes. Check the current menu.',
    seating: 'Indoor dining.',
    reservations: 'Reservations are available through OpenTable, and takeout is by phone at (561) 745-2444, per the listing.',
    tip: 'Listed dinner hours run roughly 4:30 to 10 p.m. Monday through Thursday and until 11 p.m. Friday and Saturday. Confirm before you go.',
    tags: ['date'],
    sourceLabel: 'Waterfront Properties',
    sourceUrl: 'https://www.waterfront-properties.com/blog/evo-italian-eatery-tequesta.html',
    confirm: 'Hours, menu and reservations.',
  },
  {
    id: 'gallery-grille',
    name: 'Gallery Grille',
    area: 'village',
    address: '383 Tequesta Drive, Gallery Square North (one listing gives a Jupiter ZIP code)',
    mapQuery: 'Gallery Grille, 383 Tequesta Drive, Tequesta, FL',
    experience: 'A breakfast and lunch spot in Gallery Square North',
    special: 'Locals are reported to love it for breakfast, with a Cuban Benedict and a Florentine mentioned, plus a lobster wrap and pastries.',
    suits: 'Breakfast before a Tequesta Drive walk.',
    highlights: 'Cuban Benedict, Florentine, lobster wrap and pastries, per one local guide.',
    seating: 'Confirm with the restaurant.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'It sits in the same square as the Lighthouse ArtCenter, so it pairs well with a gallery visit.',
    tags: ['coffee', 'casual'],
    sourceLabel: 'Waterfront Properties dining guide',
    sourceUrl: 'https://www.waterfront-properties.com/blog/4-great-restaurants-to-visit-in-tequesta-waterfront-properties.html',
    confirm: 'That it is open, its hours and its address.',
  },
  {
    id: 'perk-coffee',
    name: 'Perk Coffee House',
    area: 'village',
    address: '384 Tequesta Drive, Tequesta',
    mapQuery: 'Perk Coffee House, 384 Tequesta Drive, Tequesta, FL 33469',
    experience: 'An independent coffee shop in the village center',
    special: 'A neighborhood coffee shop on Tequesta Drive, reported to host live music on its patio on Sunday mornings.',
    suits: 'A morning coffee, or a Sunday-morning stop.',
    highlights: 'Coffee and café fare. We have not verified specific items.',
    seating: 'A patio is reported.',
    reservations: 'Not applicable for a counter-service café.',
    tip: 'Reported hours differ between sources, so check before you go.',
    tags: ['coffee', 'music'],
    sourceLabel: 'Local coffee guide (AOL)',
    sourceUrl: 'https://www.aol.com/news/want-coffee-tequesta-check-seven-092048511.html',
    confirm: 'Hours, and whether Sunday music is running.',
  },
  {
    id: 'carve-coffee',
    name: 'Carve Surf & Coffee',
    area: 'village',
    address: 'Tequesta. We could not confirm the street address.',
    mapQuery: 'Carve Surf & Coffee, Tequesta, FL',
    experience: 'A coffee shop with a surf-shop side',
    special: 'A locally owned shop founded in 2018 that serves Panther Coffee espresso drinks and Rishi teas, with vegan and gluten-free pastries, a surf-club membership and surfboard rentals, per a guide.',
    suits: 'Coffee with a beach mood.',
    highlights: 'Panther Coffee drinks and Rishi teas, plus vegan and gluten-free pastries, per the guide.',
    seating: 'Confirm with the shop.',
    reservations: 'Not applicable.',
    tip: 'Confirm the address and hours first, since we could not verify either.',
    tags: ['coffee'],
    sourceLabel: 'Wanderlog listing',
    sourceUrl: 'https://wanderlog.com/place/details/10856103/carve-surf--coffee',
    confirm: 'The address, hours and whether it is open.',
  },
  {
    id: 'palm-beach-ice-cream',
    name: 'Palm Beach Ice Cream (Tequesta)',
    area: 'village',
    address: '239 S US Highway 1, Tequesta',
    mapQuery: 'Palm Beach Ice Cream, 239 S US Highway 1, Tequesta, FL 33469',
    experience: 'A homemade ice cream shop',
    special: 'A local shop with a Tequesta location and a second in Jupiter, described as in business for over 30 years.',
    suits: 'A dessert stop.',
    highlights: 'Ice cream, yogurt, sorbets and sherbets, including no-sugar-added and seasonal flavors, per a review site.',
    seating: 'Confirm with the shop.',
    reservations: 'Not applicable.',
    tip: 'Check hours first, since we could not verify them.',
    tags: ['casual'],
    sourceLabel: 'Waterfront Properties ice cream guide',
    sourceUrl: 'https://www.waterfront-properties.com/blog/ice-cream-shops-to-try-in-jupiter.html',
    confirm: 'Hours and that the Tequesta shop is open.',
  },
  {
    id: 'tequesta-brewing',
    name: 'Tequesta Brewing Company',
    area: 'village',
    address: '287 S US Highway 1, Tequesta',
    mapQuery: 'Tequesta Brewing Company, 287 S US Highway 1, Tequesta, FL 33469',
    experience: 'A local microbrewery with a tasting room',
    special: 'A microbrewery with a tasting room and growler fills on the US-1 corridor.',
    suits: 'A relaxed beer stop.',
    highlights: 'House beers and growler fills. We have not verified the current taps.',
    seating: 'A tasting room.',
    reservations: 'Not applicable for a tasting room.',
    tip: 'A directory lists noon openings and late-evening closings, but we could not confirm current hours, so check the brewery’s site.',
    tags: ['casual'],
    websiteUrl: 'https://tequestabrewingco.com',
    sourceLabel: 'Brewbound listing',
    sourceUrl: 'https://www.brewbound.com/breweries/tequesta-brewing-co',
    confirm: 'That the taproom is open and its current hours.',
  },
  {
    id: 'vulcanos',
    name: 'Vulcano’s Italian Pizzeria',
    area: 'village',
    address: 'Tequesta Village Square, on US-1 (241 to 289 US Highway 1). We could not confirm the unit.',
    mapQuery: 'Vulcano’s Italian Pizzeria, Tequesta Village Square, US Highway 1, Tequesta, FL',
    experience: 'A casual Italian pizzeria',
    special: 'A neighborhood pizzeria described as serving hearty pastas and classic pizzas.',
    suits: 'A casual family dinner or takeout.',
    highlights: 'Pastas and pizzas, per a local guide.',
    seating: 'Confirm with the restaurant.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'It shares the Village Square center with Bellini’s Eatery. Confirm that both are open.',
    tags: ['casual'],
    sourceLabel: 'Waterfront Properties dining guide',
    sourceUrl: 'https://www.waterfront-properties.com/blog/4-great-restaurants-to-visit-in-tequesta-waterfront-properties.html',
    confirm: 'That it is open, its hours and its exact address.',
  },
  {
    id: 'bellinis',
    name: 'Bellini’s Eatery',
    area: 'village',
    address: 'Tequesta Village Square, on US-1. We could not confirm the unit.',
    mapQuery: 'Bellini’s Eatery, Tequesta, FL',
    experience: 'A casual Italian and American eatery',
    special: 'An eatery described as serving pizza, pasta, wings and comfort-food favorites, including risotto and chicken parmigiana.',
    suits: 'A casual lunch or dinner.',
    highlights: 'Pizza, pasta, wings, risottos, gnocchi and chicken parmigiana, per local guides.',
    seating: 'Confirm with the restaurant.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'Confirm hours first.',
    tags: ['casual'],
    sourceLabel: 'Waterfront Properties dining guide',
    sourceUrl: 'https://www.waterfront-properties.com/blog/5-great-restaurants-in-tequesta.html',
    confirm: 'That it is open, its hours and its exact address.',
  },
  {
    id: 'food-shack',
    name: 'Little Moir’s Food Shack',
    area: 'jupiter',
    address: '103 S US Highway 1, Unit D3, Jupiter',
    mapQuery: 'Little Moir’s Food Shack, 103 S US Highway 1, Jupiter, FL 33477',
    experience: 'Casual seafood and comfort food in Jupiter',
    special: 'A Jupiter favorite that Diners, Drive-ins and Dives fans list among their recommendations. It is in Jupiter, not Tequesta.',
    suits: 'A casual seafood meal in Jupiter.',
    highlights: 'Seafood, per local guides. We have not verified specific dishes.',
    seating: 'Confirm with the restaurant.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'There are related Little Moir’s locations, so make sure your directions point to the right one.',
    tags: ['seafood', 'casual', 'jupiter'],
    sourceLabel: 'Food Shack listing',
    sourceUrl: 'https://www.flavortownusa.com/recommends/3078/the-food-shack-in-jupiter-fl',
    confirm: 'Which location, hours and the menu.',
  },
  {
    id: 'leftovers',
    name: 'Leftovers Cafe (Little Moir’s Leftovers)',
    area: 'jupiter',
    address: '451 University Boulevard, Jupiter (Abacoa)',
    mapQuery: 'Little Moir’s Leftovers, 451 University Blvd, Jupiter, FL 33458',
    experience: 'A casual café run by the Little Moir’s family',
    special: 'Leftovers Cafe is in Jupiter’s Abacoa neighborhood, not in Tequesta. It has appeared on PBS’s Check Please! South Florida.',
    suits: 'A casual Jupiter meal, especially if you are in Abacoa.',
    highlights: 'We have not verified specific dishes.',
    seating: 'Confirm with the restaurant.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'Older write-ups sometimes place it in Tequesta, but it is in Jupiter.',
    tags: ['casual', 'jupiter'],
    sourceLabel: 'PBS Check Please! South Florida',
    sourceUrl: 'https://www.pbs.org/video/leftovers-cafe-check-please-south-florida-kz9n3p/',
    confirm: 'Hours and the menu.',
  },
  {
    id: 'guanabanas',
    name: 'Guanabanas',
    area: 'jupiter',
    address: '960 N Highway A1A, Jupiter',
    mapQuery: 'Guanabanas, 960 N Highway A1A, Jupiter, FL 33477',
    experience: 'A lush, open-air waterfront restaurant on the Intracoastal',
    special: 'A Jupiter waterfront spot described as tropical and Old Florida in feel, on the Intracoastal near the Jupiter Inlet Lighthouse.',
    suits: 'A waterfront evening in Jupiter.',
    highlights: 'We have not verified specific dishes.',
    seating: 'Outdoor, waterfront seating.',
    reservations: 'We could not verify a reservation policy.',
    tip: 'It is in Jupiter, so treat it as a short trip from Tequesta, and check hours first.',
    tags: ['waterfront', 'jupiter'],
    sourceLabel: 'Waterfront Properties',
    sourceUrl: 'https://www.waterfront-properties.com/blog/lush-and-laidback-one-of-jupiters-favorite-waterfront-spots-guanabanas.html',
    confirm: 'Hours, the menu and reservations.',
  },
]

export function diningDirectionsUrl(v: Venue): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(v.mapQuery)}`
}
