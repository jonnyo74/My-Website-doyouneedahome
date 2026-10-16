// Content for the "Choose Your Loxahatchee" decision module in the Loxahatchee
// areas guide. Four ways of living here, described by fit. It is not a ranking:
// no scores, no prices, no promises about what any parcel allows.

export type LoxPathKey = 'independent' | 'town-and-country' | 'equestrian' | 'big-land'

export interface LoxPath {
  key: LoxPathKey
  title: string
  tagline: string
  feels: string
  fitsIf: string
  keepInMind: string
  read: Array<{ label: string; href: string }>
}

export const LOX_PATHS: LoxPath[] = [
  {
    key: 'independent',
    title: 'Independent Acreage',
    tagline: 'Space, privacy, projects, and fewer layers around daily life.',
    feels:
      'Acre-plus homesites, a road-and-canal grid and a less managed rhythm, with a mix of mature homes, rebuilds and rawer parcels sometimes on the same road.',
    fitsIf: 'You want room for projects, equipment, gardens or privacy and are comfortable deciding most things yourself.',
    keepInMind:
      'Lot size, zoning, road character, utilities and restrictions vary by property, and one road can feel very different from the next.',
    read: [
      { label: 'A local guide to how it works', href: '/blog/local-guide-to-loxahatchee-florida' },
      { label: 'What it is really like to live here', href: '/blog/what-its-really-like-living-in-loxahatchee-florida' },
    ],
  },
  {
    key: 'town-and-country',
    title: 'Town-and-Country Rhythm',
    tagline: 'Loxahatchee Groves character, agricultural texture, and a stronger local identity.',
    feels:
      'An incorporated town with its own Town Council, groves, nurseries and working-land texture, and a more distinct sense of place than the broader Acreage area.',
    fitsIf: 'You want rural character with a clearer local identity around it.',
    keepInMind:
      'The town is its own jurisdiction, separate from The Acreage. Confirm which one an address sits in before assuming anything about services or rules.',
    read: [
      { label: 'Compare the areas with nearby towns', href: '/blog/loxahatchee-vs-nearby-cities' },
      { label: 'Weigh the pros and cons', href: '/blog/pros-and-cons-of-living-in-loxahatchee-florida' },
    ],
  },
  {
    key: 'equestrian',
    title: 'Equestrian Focus',
    tagline: 'Land and horse-life priorities, with a choice between independent acreage and more defined equestrian pockets.',
    feels:
      'Barns, paddocks and riding in mind, either on an independent parcel or in a named pocket that is built around horse properties, with Wellington\'s equestrian world nearby.',
    fitsIf: 'Horses drive your decision and you want to know whether you prefer independence or a more organized setting.',
    keepInMind:
      'What is allowed depends on the exact parcel, zoning and jurisdiction. Confirm the location and character of any named pocket before you rely on it.',
    read: [
      { label: 'Who should (and should not) move here', href: '/blog/who-should-move-to-loxahatchee-florida' },
      { label: 'The Loxahatchee community guide', href: '/communities/loxahatchee' },
    ],
  },
  {
    key: 'big-land',
    title: 'Big-Land Possibility',
    tagline: 'Buyers whose plans involve larger acreage, barns, agriculture, workshops, or a true compound-style setup.',
    feels:
      'Larger tracts and working-rural parcels where the land itself is the plan: barns, nurseries, workshops, storage or room for more than one household.',
    fitsIf: 'You have a real use for acreage, not just a wish for it.',
    keepInMind:
      'No use is assumed to be allowed on any parcel. The plan has to fit the specific property, its zoning and its jurisdiction.',
    read: [
      { label: 'What it costs to live here', href: '/blog/cost-of-living-in-loxahatchee-florida' },
      { label: 'Who should move here', href: '/blog/who-should-move-to-loxahatchee-florida' },
    ],
  },
]
