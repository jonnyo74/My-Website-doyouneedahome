// Copy for the "Pick Your Loxahatchee Night" chooser in the food-and-hangout guide. Each route leads to a
// section of the article whose heading id is listed here (checked in the build). Plain text only: no hours,
// event dates, prices, rankings or delivery claims, which belong on each business's own site.

export const NIGHT_HEADING = 'Pick Your Loxahatchee Night'
export const NIGHT_HEADING_ID = 'pick-your-loxahatchee-night'
export const NIGHT_INTRO = 'Start with the kind of evening you want. Each route leads to the place that fits it.'

export const NIGHT_ROUTES: ReadonlyArray<{ title: string; text: string; place: string; anchor: string }> = [
  {
    title: 'Pizza and an easy weeknight',
    text: 'A casual, repeatable local stop.',
    place: "Jabrewski's Pizza Company",
    anchor: 'jabrewski-s-pizza-company',
  },
  {
    title: 'Live music, karaoke, or a social night out',
    text: 'A local hangout with a current event calendar.',
    place: 'Boonies Sports Bar & Grill',
    anchor: 'boonies-sports-bar-and-grill',
  },
  {
    title: 'Dinner and drinks without leaving the area',
    text: 'A relaxed restaurant-and-bar evening.',
    place: "Ray's Hideaway Restaurant & Bar",
    anchor: 'ray-s-hideaway-restaurant-and-bar',
  },
  {
    title: 'A bigger dinner night nearby',
    text: 'Royal Palm Beach or Wellington when the plan calls for more choice.',
    place: 'Royal Palm Beach and Wellington',
    anchor: 'where-loxahatchee-goes-when-dinner-is-the-whole-plan',
  },
]

export const REGULARS_HEADING = 'The Local Regulars at a Glance'
export const REGULARS_HEADING_ID = 'the-local-regulars-at-a-glance'
export const REGULARS_NOTE =
  'Addresses and official links, checked October 16, 2026. Menus, hours and events change, so use each official site for current details.'

export const REGULARS: ReadonlyArray<{
  name: string
  address: string
  bestFor: string
  links: ReadonlyArray<{ label: string; href: string }>
}> = [
  {
    name: "Jabrewski's Pizza Company",
    address: '7070 Seminole Pratt Whitney Rd, Loxahatchee',
    bestFor: 'Pizza night, takeout, an easy beer with friends',
    links: [{ label: 'Official site', href: 'https://www.jabrewskispizzaco.com/' }],
  },
  {
    name: 'Boonies Sports Bar & Grill',
    address: '14555 Southern Blvd, Loxahatchee Groves',
    bestFor: 'Live bands and DJs, karaoke, bingo and poker nights',
    links: [{ label: 'Official site and calendar', href: 'https://www.booniesfl.com/' }],
  },
  {
    name: "Ray's Hideaway Restaurant & Bar",
    address: '12041 Southern Blvd, Loxahatchee',
    bestFor: 'A casual meal, drinks, theme nights and a relaxed later night',
    links: [
      { label: 'Official site', href: 'https://rayshideawayfl.com/' },
      { label: 'Events', href: 'https://rayshideawayfl.com/events/' },
    ],
  },
]
