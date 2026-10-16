// Editorial data behind the Tequesta comparison matrix and the "which community
// fits" selector. Everything here is qualitative. There are no prices, drive
// times, school ratings or rankings, and nothing is derived from proprietary
// market statistics. A tag means a community offers or contains the feature, as
// described by the cited geography, not that it is better at it than another.

export type FitTag =
  | 'beach'
  | 'boating'
  | 'acreage'
  | 'newer'
  | 'golf'
  | 'walkable'
  | 'lowMaintenance'
  | 'privacy'
  | 'shopping'

export const FIT_TAGS: Array<{ key: FitTag; label: string; criterion: string }> = [
  { key: 'beach', label: 'Beach access', criterion: 'Ocean beach in the community, or on its barrier island or nearest coast.' },
  { key: 'boating', label: 'Boating', criterion: 'Intracoastal, river or lagoon waterfront in the community.' },
  { key: 'acreage', label: 'Acreage', criterion: 'Areas of larger residential lots, as described in public sources.' },
  { key: 'newer', label: 'Newer housing', criterion: 'Master-planned communities with more recently built homes.' },
  { key: 'golf', label: 'Golf and country club lifestyle', criterion: 'Golf communities or clubs located in the community.' },
  { key: 'walkable', label: 'Walkable amenities', criterion: 'A downtown, village center or district designed for walking.' },
  { key: 'lowMaintenance', label: 'Lower-maintenance ownership', criterion: 'Condominium, townhome or villa formats are available.' },
  { key: 'privacy', label: 'Privacy', criterion: 'Small, low-density, or larger-lot settings.' },
  { key: 'shopping', label: 'Shopping and services nearby', criterion: 'A concentrated retail and services area in or beside the community.' },
]

export interface Community {
  id: string
  name: string
  /** Plain-language jurisdiction: what kind of place it is, and which county. */
  jurisdiction: string
  /** Matrix cells. Short and qualitative. */
  housing: string
  water: string
  character: string
  assoc: string
  costs: string
  convenience: string
  verify: string
  /** Why the community carries each tag. Absent means it does not carry that tag. */
  tags: Partial<Record<FitTag, string>>
  /** Existing site pages only. */
  guideHref?: string
  compareHref?: string
}

export const COMMUNITIES: Community[] = [
  {
    id: 'tequesta',
    name: 'Tequesta',
    jurisdiction: 'Incorporated Village, Palm Beach County. Some Tequesta-addressed homes sit elsewhere.',
    housing: 'Older single-family homes, riverside and Intracoastal homes, golf-area homes, and Beach Road condominiums.',
    water: 'Intracoastal and lower Loxahatchee River. Coral Cove Park on Beach Road. Varies a lot by street.',
    character: 'Village scale, mature trees, homes of varied ages.',
    assoc: 'Some homes are in associations and many older pockets are not. Any club connection is specific to the home.',
    costs: 'Village water and services. Tax district and insurance are set by the parcel.',
    convenience: 'A small center on Tequesta Drive and the US-1 corridor, with Jupiter next door.',
    verify: 'County and municipality, flood zone, roof, any waterfront structures.',
    tags: {
      beach: 'Coral Cove Park on Beach Road has Atlantic frontage, though beach access is specific to location.',
      boating: 'The Intracoastal and lower river border parts of the Village.',
      golf: 'Tequesta Country Club and other golf communities sit in and around the Village.',
      lowMaintenance: 'Condominiums line the Beach Road and Intracoastal corridor.',
      walkable: 'A small village center around Tequesta Drive, modest in scale.',
    },
    guideHref: '/communities/tequesta',
    compareHref: '/blog/best-neighborhoods-in-tequesta-florida',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    jurisdiction: 'Town of Jupiter, Palm Beach County.',
    housing: 'Single-family homes, condominiums, townhomes and waterfront homes across many neighborhoods.',
    water: 'Atlantic beaches, Jupiter Inlet, the Loxahatchee River and the Intracoastal.',
    character: 'A larger town with a wider mix of neighborhoods and a bigger commercial base.',
    assoc: 'Many communities have associations, and some have clubs. Structures vary by community.',
    costs: 'Its own town services and tax districts. Compare actual parcels, not towns.',
    convenience: 'A larger restaurant, retail and services base, including walkable districts such as Harbourside Place and the Riverwalk.',
    verify: 'Tax district, flood zone, association structure, waterfront structures.',
    tags: {
      beach: 'Jupiter has Atlantic beaches along its coast.',
      boating: 'The inlet, river and Intracoastal run through the town.',
      walkable: 'Districts such as Harbourside Place and the Riverwalk are built for walking.',
      lowMaintenance: 'Condominiums and townhomes are widely available.',
      shopping: 'A larger concentration of restaurants, retail and services.',
    },
    guideHref: '/communities/jupiter',
    compareHref: '/blog/jupiter-vs-nearby-cities',
  },
  {
    id: 'hobe-sound',
    name: 'Hobe Sound',
    jurisdiction: 'Unincorporated community in Martin County. It is not a municipality.',
    housing: 'Primarily single-family homes, with some waterfront options.',
    water: 'Intracoastal and lagoon frontage. Hobe Sound Public Beach is in the separate Town of Jupiter Island.',
    character: 'Small-scale, with preserve and park land nearby.',
    assoc: 'Varies by community.',
    costs: 'Martin County services and tax districts. Compare against Palm Beach County parcels carefully.',
    convenience: 'Smaller-scale services, with larger centers a drive away.',
    verify: 'County, whether the property is in the Town of Jupiter Island or unincorporated, flood zone.',
    tags: {
      boating: 'Intracoastal and lagoon waterfront is part of the community.',
      beach: 'Hobe Sound Public Beach is nearby, in the Town of Jupiter Island.',
      privacy: 'Smaller-scale, with conservation land nearby.',
    },
    guideHref: '/communities/hobe-sound',
    compareHref: '/blog/hobe-sound-vs-nearby-cities',
  },
  {
    id: 'juno-beach',
    name: 'Juno Beach',
    jurisdiction: 'Town of Juno Beach, Palm Beach County, between Palm Beach Gardens and Jupiter.',
    housing: 'Oceanfront and near-ocean condominiums, plus single-family neighborhoods.',
    water: 'Atlantic beach and a public fishing pier, with the Intracoastal on the west side.',
    character: 'A small coastal town with a strong beach orientation.',
    assoc: 'Condominium and association structures are common.',
    costs: 'Condominium costs and coastal insurance considerations are property-specific.',
    convenience: 'Small in itself, and close to larger centers in neighboring towns.',
    verify: 'Condominium and association costs, flood and wind insurance, evacuation zone.',
    tags: {
      beach: 'An oceanfront town with a public pier.',
      lowMaintenance: 'Many condominiums, including on the ocean.',
    },
    guideHref: '/communities/juno-beach',
    compareHref: '/blog/juno-beach-vs-nearby-cities',
  },
  {
    id: 'palm-beach-gardens',
    name: 'Palm Beach Gardens',
    jurisdiction: 'City of Palm Beach Gardens, Palm Beach County.',
    housing: 'Master-planned and gated communities, townhomes, villas and condominiums.',
    water: 'Mostly inland. Some communities have lakes and golf frontage.',
    character: 'A larger city with many master-planned communities, some more recently built.',
    assoc: 'Associations are common, and golf or social clubs are part of many communities.',
    costs: 'City services and tax districts. Association structures differ by community.',
    convenience: 'A concentrated retail and dining area, including Downtown at the Gardens.',
    verify: 'Association and club structure, tax district, flood zone, community-specific rules.',
    tags: {
      newer: 'Includes master-planned communities with more recently built homes, such as newer sections of PGA National.',
      golf: 'Home to PGA National and other golf communities.',
      lowMaintenance: 'Townhomes, villas and condominiums are common.',
      walkable: 'Downtown at the Gardens is a shopping and dining district.',
      shopping: 'A concentrated retail and dining area along PGA Boulevard.',
    },
    guideHref: '/communities/palm-beach-gardens',
    compareHref: '/blog/palm-beach-gardens-vs-nearby-cities',
  },
  {
    id: 'jupiter-inlet-colony',
    name: 'Jupiter Inlet Colony',
    jurisdiction: 'Town of Jupiter Inlet Colony, Palm Beach County. Separate from Jupiter Island.',
    housing: 'A residential town of very limited size.',
    water: 'On the barrier island beside Jupiter Inlet.',
    character: 'A very small, residential town. It is not the same place as Jupiter Island.',
    assoc: 'Varies by property.',
    costs: 'Property-specific. Waterfront structures and coastal insurance matter.',
    convenience: 'Very small in itself, close to Jupiter’s services.',
    verify: 'Municipality, flood and wind exposure, waterfront structures.',
    tags: {
      beach: 'On the barrier island beside the inlet.',
      boating: 'Inlet and Intracoastal frontage.',
      privacy: 'A very small, residential town.',
    },
  },
  {
    id: 'jupiter-island',
    name: 'Jupiter Island',
    jurisdiction: 'Town of Jupiter Island, Martin County, on the barrier island. Separate from Jupiter Inlet Colony and Hobe Sound.',
    housing: 'Residential, with oceanfront and Intracoastal properties.',
    water: 'Atlantic frontage and Intracoastal frontage, with a public beach.',
    character: 'A small, low-density barrier-island town.',
    assoc: 'Varies by property.',
    costs: 'Martin County and town services. Coastal insurance and waterfront structures are property-specific.',
    convenience: 'Small in itself, with larger centers a drive away.',
    verify: 'Municipality and county, flood and wind exposure, waterfront structures.',
    tags: {
      beach: 'A barrier-island town with Atlantic frontage and a public beach.',
      boating: 'Intracoastal frontage on the west side of the island.',
      privacy: 'A small, low-density town.',
    },
  },
  {
    id: 'stuart',
    name: 'Stuart',
    jurisdiction: 'City of Stuart, Martin County seat.',
    housing: 'Single-family homes, condominiums and waterfront homes, with a historic downtown.',
    water: 'The St. Lucie River and nearby waterways.',
    character: 'A small city with a historic downtown.',
    assoc: 'Varies by neighborhood.',
    costs: 'Martin County and city services. Compare against Palm Beach County parcels carefully.',
    convenience: 'A walkable historic downtown and its own services.',
    verify: 'County, tax district, flood zone, waterfront structures.',
    tags: {
      boating: 'River and waterway frontage.',
      walkable: 'A historic downtown.',
      shopping: 'A city with its own retail and services.',
      lowMaintenance: 'Condominiums are available.',
    },
    guideHref: '/communities/stuart',
    compareHref: '/blog/stuart-vs-nearby-cities',
  },
  {
    id: 'palm-city',
    name: 'Palm City',
    jurisdiction: 'Unincorporated community in Martin County. It is not a municipality.',
    housing: 'Primarily single-family neighborhoods, including golf and waterfront communities.',
    water: 'The South Fork of the St. Lucie River.',
    character: 'A residential community beside Stuart.',
    assoc: 'Many neighborhoods have associations. Structures vary.',
    costs: 'Martin County services and tax districts.',
    convenience: 'Residential, with Stuart’s downtown and services next door.',
    verify: 'County, association structure, flood zone, waterfront structures.',
    tags: {
      boating: 'The South Fork of the St. Lucie River borders the community.',
      golf: 'Golf communities are part of the area.',
    },
    guideHref: '/communities/palm-city',
    compareHref: '/blog/palm-city-vs-nearby-cities',
  },
  {
    id: 'jupiter-farms',
    name: 'Jupiter Farms and western communities',
    jurisdiction: 'Unincorporated Palm Beach County, west of I-95 along Indiantown Road.',
    housing: 'Single-family homes on larger lots, often one to five acres, with equestrian use common.',
    water: 'Inland. Nearby trails connect toward Riverbend Park.',
    character: 'Rural and equestrian in feel, with a county park and riding arena.',
    assoc: 'Sources describe most of the area as having no HOA, though some subareas have restrictions. Verify by parcel.',
    costs: 'Property-specific. Utilities vary by parcel, so confirm water and sewer service.',
    convenience: 'More driving for everyday errands.',
    verify: 'Utility services, deed restrictions, flood zone, road access.',
    tags: {
      acreage: 'Lots of one to five acres are described in public sources.',
      privacy: 'Larger lots and a rural setting.',
    },
  },
]

/** Communities that carry every selected tag. */
export function matchCommunities(selected: FitTag[]): Community[] {
  if (selected.length === 0) return []
  return COMMUNITIES.filter((c) => selected.every((t) => c.tags[t]))
}

/** Communities that carry at least one selected tag, with how many they carry. */
export function partialMatches(selected: FitTag[]): Array<{ community: Community; count: number }> {
  if (selected.length === 0) return []
  return COMMUNITIES.map((community) => ({ community, count: selected.filter((t) => community.tags[t]).length }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count)
}
