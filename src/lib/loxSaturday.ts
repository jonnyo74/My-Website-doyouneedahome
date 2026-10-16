// Content for the "Pick Your Kind of Saturday" chooser in the Loxahatchee
// things-to-do guide. Every route points at a section of the article and, where
// it names a public place, at that place's official page. Facts here are taken
// from Palm Beach County and U.S. Fish & Wildlife Service pages. No prices,
// drive times or coordinates.

export interface SaturdayRoute {
  key: string
  title: string
  vibe: string
  where: string
  good: string
  /** Heading of the article section that covers the route. */
  section: string
  official?: { label: string; href: string }
}

export const SATURDAY_ROUTES: SaturdayRoute[] = [
  {
    key: 'nature-walk',
    title: 'A quiet local nature walk',
    vibe: 'A boardwalk over wetlands, a paved nature trail, and a sandy path through slash pines and saw palmettos.',
    where: 'Acreage Pines Natural Area, 6405 140th Ave. N., Loxahatchee',
    good: 'Open sunrise to sunset, 365 days a year.',
    section: 'Start Local: Acreage Pines Natural Area',
    official: { label: 'Palm Beach County page', href: 'https://discover.pbc.gov/erm/NaturalAreas/Acreage-Pines.aspx' },
  },
  {
    key: 'trail-morning',
    title: 'A bigger trail morning',
    vibe: 'Pine flatwoods, wet prairie and long loops, in county preserves north of Loxahatchee.',
    where: 'Hungryland Slough Natural Area or Loxahatchee Slough Natural Area',
    good: 'Hungryland Slough has a 3.75-mile loop that is hiking only.',
    section: 'Hungryland Slough Natural Area',
    official: { label: 'Hungryland Slough page', href: 'https://discover.pbc.gov/erm/NaturalAreas/Hungryland-Slough.aspx' },
  },
  {
    key: 'horse-country',
    title: 'Horse and country time',
    vibe: 'Trailers pulling in early, open green space, and a mile of equestrian trail.',
    where: 'Loxahatchee Groves Park, 13901 Southern Boulevard',
    good: 'Parking is sized for horse trailers. Open sunrise to sunset.',
    section: 'Loxahatchee Groves Park and the Horse-Country Rhythm',
    official: { label: 'Palm Beach County page', href: 'https://discover.pbc.gov/parks/Locations/Loxahatchee-Groves.aspx' },
  },
  {
    key: 'everglades',
    title: 'An Everglades-scale outing',
    vibe: 'Levee trails, canals and a very big sky at the edge of the Everglades.',
    where: 'Arthur R. Marshall Loxahatchee National Wildlife Refuge',
    good: 'The 20 Mile Bend access is in Loxahatchee. The boardwalk and visitor center are in Boynton Beach.',
    section: 'Arthur R. Marshall Loxahatchee National Wildlife Refuge',
    official: { label: 'Refuge visitor information', href: 'https://www.fws.gov/refuge/arthur-r-marshall-loxahatchee/visit-us' },
  },
  {
    key: 'stay-home',
    title: 'An afternoon on your own land',
    vibe: 'Gardens, projects and a long sunset, wherever your property and its rules allow.',
    where: 'Your own property',
    good: 'The weekend most people here are actually after.',
    section: 'The Part Visitors Miss: Your Own Land Can Be the Plan',
  },
]
