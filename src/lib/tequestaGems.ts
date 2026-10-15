// Single source of truth for the Tequesta hidden-gems article. The article body,
// the quick-reference table and the destination explorer are all generated from
// this list, so a fact lives in one place.
//
// Every entry carries only what was checked against an official or operator
// source (or is marked as reported). No coordinates are stored: directions links
// are built from the name and address text, so nothing here is an invented
// map position. Hours and fees change. Entries say so and point to the source.

export type GemCategory = 'arts' | 'food' | 'parks' | 'water' | 'nearby'

export type GemArea =
  | 'village' // inside the incorporated Village of Tequesta
  | 'tequesta-county' // Palm Beach County facility with a Tequesta address
  | 'martin-mailing' // Tequesta mailing address; the address points to Martin County
  | 'jupiter'
  | 'juno-beach'
  | 'jupiter-island' // Town of Jupiter Island, Martin County
  | 'martin' // unincorporated or other Martin County

export const AREA_LABEL: Record<GemArea, string> = {
  village: 'Village of Tequesta',
  'tequesta-county': 'Tequesta (County park)',
  'martin-mailing': 'Tequesta address, Martin County',
  jupiter: 'Jupiter',
  'juno-beach': 'Juno Beach',
  'jupiter-island': 'Jupiter Island, Martin County',
  martin: 'Martin County',
}

export const CATEGORY_LABEL: Record<GemCategory, string> = {
  arts: 'Arts and village',
  food: 'Cafés and food',
  parks: 'Parks and nature',
  water: 'Waterfront',
  nearby: 'Nearby, outside the Village',
}

export interface Gem {
  id: string
  name: string
  category: GemCategory
  area: GemArea
  /** Verified address or location description, as stated by the source. */
  where: string
  /** Text used to build a directions link. Name plus address, never coordinates. */
  mapQuery: string
  special: string
  when: string
  access: string
  tip: string
  sourceLabel: string
  sourceUrl: string
  /** What the reader should still confirm before going. */
  confirm: string
}

export const GEMS: Gem[] = [
  {
    id: 'lighthouse-artcenter',
    name: 'Lighthouse ArtCenter Gallery',
    category: 'arts',
    area: 'village',
    where: '373 Tequesta Drive, in Gallery Square North',
    mapQuery: 'Lighthouse ArtCenter, 373 Tequesta Drive, Tequesta, FL 33469',
    special:
      'A nonprofit art museum and gallery founded in 1964, with changing exhibitions in a village-scale setting. It is the cultural anchor of the Tequesta Drive arts corner.',
    when: 'Check the exhibition calendar before you go, since shows change through the year.',
    access:
      'Sources disagree on hours and admission, and the most recent listings we found were several years old, so confirm both with the ArtCenter. It sits about half a mile west of US-1.',
    tip: 'Pair it with a coffee a short walk away on the same street, and ask at the front desk what is currently on view.',
    sourceLabel: 'Lighthouse ArtCenter',
    sourceUrl: 'https://www.lighthousearts.org/about-us',
    confirm: 'Current hours, admission and exhibitions.',
  },
  {
    id: 'lighthouse-school',
    name: 'Lighthouse ArtCenter School of Art',
    category: 'arts',
    area: 'village',
    where: '395 Seabrook Road, a separate building from the gallery',
    mapQuery: 'Lighthouse ArtCenter School of Art, 395 Seabrook Road, Tequesta, FL 33469',
    special:
      'Classes for children and adults at beginner through professional levels, in subjects including ceramics, drawing, painting, jewelry, photography and sculpture.',
    when: 'Class schedules change by term, so look at the current listings rather than planning around a fixed day.',
    access: 'The school is a different address from the gallery, so make sure your directions point to Seabrook Road.',
    tip: 'If you are new to Tequesta, a class is one of the quickest ways to meet people who live here year-round.',
    sourceLabel: 'Lighthouse ArtCenter',
    sourceUrl: 'https://www.lighthousearts.org/about-us',
    confirm: 'Current class offerings and registration.',
  },
  {
    id: 'perk-coffee',
    name: 'Perk Coffee House',
    category: 'food',
    area: 'village',
    where: '384 Tequesta Drive, Gallery Square area',
    mapQuery: 'Perk Coffee House, 384 Tequesta Drive, Tequesta, FL 33469',
    special: 'An independent coffee shop in the village center, reported to host live music on its patio on Sunday mornings.',
    when: 'Mornings, and Sunday mornings if the patio music is running.',
    access: 'Reported hours differ between sources, so call ahead or check before you drive over.',
    tip: 'Go before the ArtCenter. It is a pleasant way to start a Tequesta Drive walk.',
    sourceLabel: 'Local coffee guide (AOL)',
    sourceUrl: 'https://www.aol.com/news/want-coffee-tequesta-check-seven-092048511.html',
    confirm: 'Current hours and whether Sunday music is running.',
  },
  {
    id: 'hog-snappers',
    name: 'Hog Snappers Shack & Sushi',
    category: 'food',
    area: 'village',
    where: '279 US-1, Tequesta',
    mapQuery: 'Hog Snappers, 279 US-1, Tequesta, FL 33469',
    special: 'A long-running local restaurant known for sushi and seafood in a casual, kid-friendly setting, with a Tequesta roll that reviewers single out.',
    when: 'Dinner, with hours that vary by source.',
    access: 'On the US-1 corridor. Confirm hours before you go.',
    tip: 'Ask what the kitchen recommends, since the menu runs from sushi to American favorites.',
    sourceLabel: 'Restaurant listing',
    sourceUrl: 'https://www.restaurantji.com/fl/tequesta/hog-snappers-shack-and-sushi-teq-/',
    confirm: 'Current hours and menu.',
  },
  {
    id: 'tequesta-brewing',
    name: 'Tequesta Brewing Company',
    category: 'food',
    area: 'village',
    where: '287 S US Highway 1, Tequesta',
    mapQuery: 'Tequesta Brewing Company, 287 S US Highway 1, Tequesta, FL 33469',
    special: 'A local microbrewery with a tasting room and growler fills.',
    when: 'Afternoons and evenings. A directory lists noon openings, but we could not confirm current hours.',
    access: 'On US-1. Check the brewery’s site for hours and current taps.',
    tip: 'Bring a clean growler if you want to take something home.',
    sourceLabel: 'Tequesta Brewing Company',
    sourceUrl: 'https://www.brewbound.com/breweries/tequesta-brewing-co',
    confirm: 'That the taproom is open and its current hours.',
  },
  {
    id: 'remembrance-park',
    name: 'Remembrance Park',
    category: 'parks',
    area: 'village',
    where: 'A Village of Tequesta park. See the Village page for the address.',
    mapQuery: 'Remembrance Park, Tequesta, FL',
    special:
      'A quiet passive park of roughly an acre and three-quarters, with two shade pavilions, a butterfly garden and interpretive markers.',
    when: 'The Village lists weekday and Saturday hours on its park page, so check them before you go.',
    access: 'A small permeable-paver parking lot, according to the Village.',
    tip: 'Come for a slow ten minutes, not a workout. It is built for sitting and reading the markers.',
    sourceLabel: 'Village of Tequesta',
    sourceUrl: 'https://tequesta.org/1536/Remembrance-Park',
    confirm: 'Current hours.',
  },
  {
    id: 'constitution-park',
    name: 'Constitution Park',
    category: 'parks',
    area: 'village',
    where: 'A Village of Tequesta park near Seabrook Road',
    mapQuery: 'Constitution Park, Tequesta, FL',
    special: 'The Village’s community park, where it has held events such as concerts and Tequesta Fest, with a playground and pavilions.',
    when: 'Check the Village community calendar for events, since the park can close for event setup.',
    access: 'Pavilion reservations go through the Village, so ask before planning a group.',
    tip: 'If an event is on, check the Village page first. Some events charge nonresidents.',
    sourceLabel: 'Village of Tequesta Parks and Recreation',
    sourceUrl: 'https://www.tequesta.org/102/Parks-and-Recreation',
    confirm: 'Current events and park access.',
  },
  {
    id: 'coral-cove',
    name: 'Coral Cove Park',
    category: 'parks',
    area: 'tequesta-county',
    where: '1600 Beach Road, Tequesta',
    mapQuery: 'Coral Cove Park, 1600 Beach Road, Tequesta, FL 33469',
    special:
      'A Palm Beach County park with Atlantic beach and Intracoastal frontage in one place. Rock formations just offshore are what visitors come to see, and the County lists it as a snorkeling location.',
    when: 'Check the County’s beach conditions the day you go. Surf and conditions change a lot.',
    access:
      'The County lists parking, restrooms, showers, picnic areas and a playground. Its page describes guarded beach frontage plus a longer unguarded stretch reached by dune crossovers south of the park. Saltwater fishing is allowed, but not inside the guarded swimming area.',
    tip: 'If you want a lifeguard, stay in the guarded section and follow the flags. Wear shoes you can walk in near rocks.',
    sourceLabel: 'Palm Beach County Parks',
    sourceUrl: 'https://discover.pbc.gov/parks/Locations/Coral-Cove.aspx',
    confirm: 'Beach conditions and lifeguard coverage on the day.',
  },
  {
    id: 'blue-pointe',
    name: 'Blue Pointe Bar & Grill',
    category: 'water',
    area: 'martin-mailing',
    where: '18701 SE Federal Highway, Tequesta mailing address (Martin County address style)',
    mapQuery: 'Blue Pointe Bar and Grill, 18701 SE Federal Highway, Tequesta, FL 33469',
    special: 'A waterfront bar and grill on the Intracoastal with covered outdoor seating, a pool in the middle of the seating area, and regular live music reported.',
    when: 'Late afternoon into evening for water views. Reported hours run roughly midday to 9 or 10 p.m.',
    access: 'A casual spot where families are common. Confirm hours and music before you go.',
    tip: 'This is a good example of a Tequesta address that is not the incorporated Village. It is listed in Martin County’s visitor directory.',
    sourceLabel: 'Discover Martin directory',
    sourceUrl: 'https://discovermartin.com/directory/blue-pointe-bar-and-grill/',
    confirm: 'Current hours, music schedule and municipal location.',
  },
  {
    id: 'tiki-52',
    name: 'Tiki 52',
    category: 'water',
    area: 'martin-mailing',
    where: '18487 SE Federal Highway, Tequesta mailing address (Martin County address style)',
    mapQuery: 'Tiki 52, 18487 SE Federal Highway, Tequesta, FL 33469',
    special: 'An open-air, palapa-style bar overlooking the marina and the Intracoastal, with live music reported.',
    when: 'Late afternoon into evening. Reviews mention that it can be busy.',
    access: 'Contact numbers differ between listings, so confirm hours before you drive over.',
    tip: 'Like Blue Pointe, its address points to Martin County, so do not assume it is inside the Village.',
    sourceLabel: 'Waterfront guide (AOL)',
    sourceUrl: 'https://www.aol.com/articles/best-restaurants-water-tequesta-jupiter-144816669.html',
    confirm: 'Current hours, contact details and municipal location.',
  },
  {
    id: 'blowing-rocks',
    name: 'Blowing Rocks Preserve',
    category: 'nearby',
    area: 'jupiter-island',
    where: '574 South Beach Road, Jupiter Island (Martin County)',
    mapQuery: 'Blowing Rocks Preserve, 574 South Beach Road, Hobe Sound, FL 33455',
    special: 'A Nature Conservancy preserve where limestone shoreline meets the Atlantic. Water can spray up through the rock when high tide and a rough sea line up.',
    when: 'The spray is a high-tide, rough-sea effect and is most common in winter. A guide suggests low tide for walking and swimming below the rocks. Weekdays in cooler months tend to be quieter.',
    access:
      'The Nature Conservancy lists daily hours with last entry shortly before closing and a handful of holiday closures. Parking is free, street parking is not allowed, and there are no lifeguards. Fee details differ across sources.',
    tip: 'Watch the surf forecast. A calm day shows you interesting rock, while rough water shows you the spectacle.',
    sourceLabel: 'The Nature Conservancy',
    sourceUrl: 'https://www.nature.org/en-us/get-involved/how-to-help/places-we-protect/blowing-rocks-preserve/',
    confirm: 'Current hours, admission and conditions.',
  },
  {
    id: 'lighthouse-ona',
    name: 'Jupiter Inlet Lighthouse Outstanding Natural Area',
    category: 'nearby',
    area: 'jupiter',
    where: 'At Jupiter Inlet, with trails on both sides of Beach Road (see the lighthouse site)',
    mapQuery: 'Jupiter Inlet Lighthouse Outstanding Natural Area, Jupiter, FL',
    special: 'A federally designated natural area of about 120 acres where the Indian River Lagoon meets the Loxahatchee River, with scrub, hammock and mangrove habitat and a lagoon overlook.',
    when: 'Open daily from dawn to dusk, per the site’s description.',
    access: 'The north side has a small parking lot, a kiosk, a trail and boardwalk, and an observation deck. Part of the area is closed for Coast Guard operations.',
    tip: 'Stay on the marked trail, and check the lighthouse site for tour dates rather than assuming one.',
    sourceLabel: 'Jupiter Inlet Lighthouse',
    sourceUrl: 'https://www.jupiterlighthouse.org/explore/outstanding-natural-area/',
    confirm: 'Current trail access and closures.',
  },
  {
    id: 'juno-dunes',
    name: 'Juno Dunes Natural Area',
    category: 'nearby',
    area: 'juno-beach',
    where: 'Oceanfront tract entered through Loggerhead Park; west tract entered west of US-1',
    mapQuery: 'Juno Dunes Natural Area, Juno Beach, FL',
    special: 'A county natural area of scrub, dunes and wetland running from the ocean side to the Intracoastal, with an observation platform and boardwalk trails.',
    when: 'Sunrise to sunset daily, per the County.',
    access: 'The oceanfront tract has parking, restrooms and drinking water at Loggerhead Park. The west tract has a boardwalk and floating docks for boaters.',
    tip: 'Bring water and sun protection, and check conditions before you go.',
    sourceLabel: 'Palm Beach County Natural Areas',
    sourceUrl: 'https://discover.pbc.gov/erm/naturalareas/juno-dunes.aspx',
    confirm: 'Current trail conditions and hours.',
  },
  {
    id: 'riverbend',
    name: 'Riverbend Park',
    category: 'nearby',
    area: 'jupiter',
    where: '9060 W. Indiantown Road, Jupiter',
    mapQuery: 'Riverbend Park, 9060 W Indiantown Road, Jupiter, FL 33478',
    special: 'The County park where the Northwest Fork of the Loxahatchee, the federally designated Wild & Scenic reach, begins, with paddling, hiking, biking and equestrian trails.',
    when: 'Cooler months and early starts are the comfortable choice in Florida heat. Check conditions first.',
    access: 'The County lists the park as about 680 acres with roughly 10 miles of hiking and biking trails, 7 of equestrian trails and 5 of canoe and kayak trails. Rentals and conditions change, so confirm current operator information.',
    tip: 'This is the Wild & Scenic Northwest Fork. Tequesta’s own water is the lower river and the Intracoastal, which are different.',
    sourceLabel: 'Palm Beach County Parks',
    sourceUrl: 'https://discover.pbc.gov/parks/pages/riverbend.aspx',
    confirm: 'Rentals, trail conditions and water levels.',
  },
  {
    id: 'hobe-mountain',
    name: 'Hobe Mountain, Jonathan Dickinson State Park',
    category: 'nearby',
    area: 'martin',
    where: 'Jonathan Dickinson State Park, Hobe Sound (Martin County)',
    mapQuery: 'Hobe Mountain, Jonathan Dickinson State Park, Hobe Sound, FL',
    special: 'A sand dune that Florida State Parks gives as 86 feet above sea level, with an observation tower adding about 27 feet. Sources vary by a few feet on the elevation.',
    when: 'Cooler months and clear mornings for the view.',
    access: 'A short boardwalk climbs through the scrub. The park reports that concessions such as rentals and tours are currently unavailable, so bring your own gear.',
    tip: 'Do not plan around a boat tour to historic sites without confirming with the park first.',
    sourceLabel: 'Florida State Parks',
    sourceUrl: 'https://www.floridastateparks.org/parks-and-trails/jonathan-dickinson-state-park',
    confirm: 'Current services, fees and tower access.',
  },
]

export function directionsUrl(g: Gem): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(g.mapQuery)}`
}
