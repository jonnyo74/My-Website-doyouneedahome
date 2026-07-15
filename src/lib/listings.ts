export type ListingStatus = 'Active' | 'Pending' | 'Coming Soon' | 'Sold'

export interface RoomDimension {
  name: string
  dimensions: string
  level?: string
}

export interface ListingUpgrade {
  item: string
  year?: number
}

export interface ListingPhoto {
  src: string
  alt: string
}

export interface ListingAgentInfo {
  name: string
  role: string
  credentials: string
  phone: string
  phoneHref: string
  email: string
  license: string
  photo: string
}

export interface Listing {
  slug: string
  status: ListingStatus
  mlsNumber: string

  address: string
  city: string
  citySlug: string // matches a slug in communities.ts for internal linking
  county: string
  state: string
  zip: string
  subdivision?: string
  legalDescription?: string

  price: number
  originalPrice?: number
  pricePerSqft?: number

  propertyType: string
  beds: number
  bathsFull: number
  bathsHalf: number
  livingSqft: number
  livingSqftSource?: string
  totalUnderRoofSqft?: number
  lotSqft?: number
  lotAcres?: number
  yearBuilt: number
  stories: number
  garageSpaces?: number
  parkingTotal?: number

  pool?: { private: boolean; size?: string; features?: string[] }
  waterfront: boolean
  view?: string
  hoa: { hasHoa: boolean; fee?: string; notes?: string }

  taxAnnual?: number
  taxYear?: number
  homestead?: boolean

  roof?: string
  roofYear?: number
  cooling?: string[]
  heating?: string[]
  constructionMaterials?: string[]
  flooring?: string[]
  stormProtection?: string
  solar?: string
  sewer?: string
  waterSource?: string
  floodZone?: string
  zoning?: string
  gated?: boolean
  utilities?: string[]
  appliances?: string[]
  interiorFeatures?: string[]
  exteriorFeatures?: string[]
  lotFeatures?: string[]

  leasing?: { permitted: boolean; notes?: string }
  pets?: { allowed: boolean; notes?: string }
  furnished?: string
  occupancy?: string

  roomDimensions?: RoomDimension[]
  upgrades?: ListingUpgrade[]
  highlights: string[]
  // Original marketing copy, one paragraph per array entry — rewritten from source
  // remarks, never copied verbatim.
  overview: string[]
  ownershipConsiderations?: string[]
  locationNotes?: string[]
  assignedSchools?: Array<{ level: string; name: string }>

  listingDateDisplay?: string
  domCount?: number
  possession?: string
  financingTermsAccepted?: string[]

  virtualTourUrl?: string
  heroPhoto?: ListingPhoto
  // Pre-cropped 1200x630 image for social/link previews (Facebook, LinkedIn, etc.)
  // — falls back to heroPhoto if not set, but that risks an odd crop since hero
  // photos aren't shot in the 1.91:1 ratio social platforms expect.
  ogImage?: ListingPhoto
  photos: ListingPhoto[]
  floorPlan?: ListingPhoto

  listingAgent: ListingAgentInfo
  coListingAgent?: ListingAgentInfo
  brokerage: string

  metaTitle?: string
  metaDescription?: string
}

const JOHN: ListingAgentInfo = {
  name: 'John Oliver',
  role: 'Listing Agent',
  credentials: 'REALTOR® · ABR · RENE · SRS',
  phone: '(561) 786-3630',
  phoneHref: 'tel:+15617863630',
  email: 'john@doyouneedahome.com',
  license: '3355676',
  photo: '/images/john.jpg',
}

const CHRISTINE: ListingAgentInfo = {
  name: 'Christine Dekant',
  role: 'Co-Listing Agent',
  credentials: 'REALTOR® · RENE · GRI · CLA',
  phone: '(561) 778-7042',
  phoneHref: 'tel:+15617787042',
  email: 'christine@doyouneedahome.com',
  license: '3264840',
  photo: '/images/christine.jpg',
}

export const listings: Listing[] = [
  {
    slug: '6145-se-audubon-lane',
    status: 'Active',
    mlsNumber: 'B26040163DX',

    address: '6145 SE Audubon Lane',
    city: 'Hobe Sound',
    citySlug: 'hobe-sound',
    county: 'Martin',
    state: 'FL',
    zip: '33455',
    subdivision: 'Poinciana Gardens',
    legalDescription: "Poinciana Gardens Sec 2, W 5' of Lot 30 and All of Lot 31, Block 110",

    price: 615000,
    originalPrice: 625000,
    pricePerSqft: 434.32,

    propertyType: 'Single-Family Residence',
    beds: 3,
    bathsFull: 2,
    bathsHalf: 0,
    livingSqft: 1416,
    livingSqftSource: 'Martin County Property Appraiser',
    totalUnderRoofSqft: 2212,
    lotSqft: 10000,
    lotAcres: 0.23,
    yearBuilt: 1980,
    stories: 1,
    garageSpaces: 1,
    parkingTotal: 3,

    pool: { private: true, size: "15' x 30'", features: ['In-ground', 'Fenced pool area', 'Pool equipment included'] },
    waterfront: false,
    view: 'Pool',
    hoa: { hasHoa: false, notes: 'No homeowners association, no membership fee, and no association-imposed restrictions on the property.' },

    taxAnnual: 3011.92,
    taxYear: 2025,
    homestead: true,

    roof: 'Metal',
    roofYear: 2012,
    cooling: ['Central air conditioning', '3 ceiling fans'],
    heating: ['Central heat'],
    constructionMaterials: ['Frame', 'Stone accents'],
    flooring: ['Carpet', 'Laminate'],
    stormProtection: 'Hurricane-rated impact windows throughout the home',
    solar: 'Owned solar power system (not leased)',
    sewer: 'Septic tank (newly installed)',
    waterSource: 'Private well',
    floodZone: 'Zone X — a minimal-risk flood zone per FEMA',
    zoning: 'Residential',
    gated: false,
    utilities: ['Cable connected', 'Electric connected', 'Underground utility lines'],
    appliances: ['Dishwasher', 'Dryer', 'Electric range', 'Ice maker', 'Microwave', 'Refrigerator', 'Washer', 'Water heater', 'Water softener'],
    interiorFeatures: ['Split-bedroom floor plan', 'Cathedral and vaulted ceilings', 'Entrance foyer', 'Pantry', 'Walk-in closet'],
    exteriorFeatures: ['Covered patio', 'Open porch', 'Exterior lighting', 'Storage', 'Automatic sprinkler system'],
    lotFeatures: ['Landscaped', 'Mature trees', 'Fully fenced yard (vinyl, gated)'],

    leasing: { permitted: true, notes: 'Leasing is permitted, with no minimum lease term or annual-leasing-frequency limit noted on the listing.' },
    pets: { allowed: true, notes: 'No pet restrictions and no pet fee noted on the listing.' },
    furnished: 'Unfurnished',
    occupancy: 'Owner-occupied',

    roomDimensions: [
      { name: 'Living Area', dimensions: `16'1" x 16'0"`, level: 'Main' },
      { name: 'Kitchen', dimensions: `13'5" x 11'2"`, level: 'Main' },
      { name: 'Dining Area', dimensions: `7'9" x 14'10"`, level: 'Main' },
      { name: 'Primary Bedroom', dimensions: `12'11" x 14'0"`, level: 'Main' },
      { name: 'Primary Bathroom', dimensions: `7'8" x 5'10"`, level: 'Main' },
      { name: 'Walk-In Closet', dimensions: `7'7" x 4'9"`, level: 'Main' },
      { name: 'Guest Bedroom A', dimensions: `10'9" x 11'3"`, level: 'Main' },
      { name: 'Guest Bedroom B', dimensions: `12'11" x 14'11"`, level: 'Main' },
      { name: 'Guest Bathroom', dimensions: `7'5" x 6'11"`, level: 'Main' },
      { name: 'Foyer', dimensions: `4'9" x 11'4"`, level: 'Main' },
      { name: 'Garage', dimensions: `12'10" x 19'5"`, level: 'Main' },
      { name: 'Covered Porch', dimensions: `28'1" x 11'6"`, level: 'Main' },
      { name: 'Pool Patio', dimensions: `41'11" x 27'2"`, level: 'Main' },
    ],

    upgrades: [
      { item: 'Metal roof', year: 2012 },
      { item: 'Owned solar power system' },
      { item: 'New septic system' },
      { item: 'Hurricane impact windows (complete)' },
      { item: 'Renovated kitchen with granite counters and stone backsplash' },
    ],

    highlights: [
      'No HOA — no restrictions on parking a boat, trailer, or RV on the property',
      'Owned solar power system already in place, helping reduce the monthly electric bill',
      'Major systems already handled: metal roof (2012), a brand-new septic system, and complete hurricane impact windows',
      'Private 15x30 in-ground pool inside a fully fenced, vinyl-fenced yard',
      'Split-bedroom layout with cathedral and vaulted ceilings and a renovated granite kitchen',
      'County-only property taxes with a homestead exemption in place',
      'Leasing permitted with no restrictions noted — flexibility for investor buyers',
      'Minutes from Hobe Sound Beach, Jonathan Dickinson State Park, golf, and major commuter routes',
    ],

    overview: [
      "This three-bedroom pool home on a quarter-acre in Poinciana Gardens has already had its expensive decisions made. The current owners installed a metal roof in 2012, added an owned solar power system, put in a brand-new septic system, and replaced every window with hurricane-rated impact glass. What's left for a buyer is the part that's easy to enjoy: split bedrooms and cathedral ceilings inside, a renovated granite kitchen with a stone backsplash, and a private 15x30 pool set inside a fully fenced yard with genuine room for a boat, trailer, or RV.",
      "There's no HOA on this property and no association dictating what can sit in the driveway or side yard. The home sits in unincorporated Martin County, is taxed at the county rate only, and carries a homestead exemption — a meaningfully lighter carrying cost than a comparable home closer to the Palm Beach County line. It suits buyers who want a single-family home with real land and real privacy, without anyone signing off on how they use it.",
      'Hobe Sound Beach, Jonathan Dickinson State Park, and the area\'s golf courses are all a short drive away, with straightforward access to the commuter routes that connect Martin County to Jupiter and the rest of the Treasure Coast.',
    ],

    ownershipConsiderations: [
      'Water and sewer are provided by a private well and septic system rather than municipal utilities — factor in the periodic maintenance those systems require.',
      'The solar power system is owned outright rather than leased, so there is no separate solar lease payment or lease-assumption process for a buyer to qualify for.',
      "Property taxes are billed at the Martin County rate only (no city millage) and currently reflect the seller's homestead exemption; taxes are commonly reassessed after a sale, so buyers should confirm expected post-sale taxes with their agent or the Martin County Property Appraiser.",
      'The home is being sold as-is, which is a standard Florida contract structure rather than a reflection of the property\'s condition — a standard home inspection is still recommended, as with any purchase.',
      'Accepted financing types include cash, conventional, FHA, and VA loans.',
    ],

    locationNotes: [
      'Frontage on a paved, publicly maintained city street west of US-1, with direct access to the area\'s main commuter routes.',
      'Hobe Sound Beach and the Hobe Sound National Wildlife Refuge are a short drive east.',
      "Jonathan Dickinson State Park sits along the western edge of the Hobe Sound community.",
      'Jupiter — with its full range of shopping, dining, marina, and medical facilities — is about 10 minutes south.',
    ],

    assignedSchools: [
      { level: 'Elementary', name: 'SeaWind Elementary School' },
      { level: 'Middle', name: 'Murray Middle School' },
      { level: 'High', name: 'South Fork High School' },
    ],

    listingDateDisplay: 'June 12, 2026',
    domCount: 33,
    possession: 'Close of escrow',
    financingTermsAccepted: ['Cash', 'Conventional', 'FHA', 'VA Loan'],

    virtualTourUrl: 'https://www.propertypanorama.com/6145-SE-Audubon-Lane-Hobe-Sound-FL-33455/unbranded',

    heroPhoto: {
      src: '/images/listings/6145-se-audubon-lane/01-exterior-front-twilight.jpg',
      alt: 'Twilight view of the front exterior of 6145 SE Audubon Lane in Hobe Sound, FL, showing the owned solar panel array on the roof',
    },
    ogImage: {
      src: '/images/listings/6145-se-audubon-lane/og-image.jpg',
      alt: 'Twilight view of the front exterior of 6145 SE Audubon Lane in Hobe Sound, FL',
    },
    photos: [
      { src: '/images/listings/6145-se-audubon-lane/02-exterior-front-day.jpg', alt: 'Daytime front exterior view of the single-story home with stone accents and attached garage' },
      { src: '/images/listings/6145-se-audubon-lane/03-exterior-front-day-2.jpg', alt: 'Front exterior and landscaped front yard' },
      { src: '/images/listings/6145-se-audubon-lane/04-aerial-lot-overview.jpg', alt: 'Aerial view of the property showing the fenced quarter-acre lot, pool, and solar panels' },
      { src: '/images/listings/6145-se-audubon-lane/05-aerial-neighborhood.jpg', alt: 'Aerial view of the home and surrounding Poinciana Gardens neighborhood' },
      { src: '/images/listings/6145-se-audubon-lane/06-aerial-view.jpg', alt: 'Aerial view of the home and backyard pool' },
      { src: '/images/listings/6145-se-audubon-lane/07-pool-twilight.jpg', alt: 'Twilight view of the private in-ground pool and paver patio' },
      { src: '/images/listings/6145-se-audubon-lane/08-pool-1.jpg', alt: 'Private in-ground pool with paver deck and fully fenced backyard' },
      { src: '/images/listings/6145-se-audubon-lane/09-pool-2.jpg', alt: 'Pool and backyard view' },
      { src: '/images/listings/6145-se-audubon-lane/10-pool-3.jpg', alt: 'Pool and covered patio view' },
      { src: '/images/listings/6145-se-audubon-lane/11-pool-4.jpg', alt: 'Pool and fenced yard with mature landscaping' },
      { src: '/images/listings/6145-se-audubon-lane/12-porch-1.jpg', alt: 'Covered porch overlooking the pool' },
      { src: '/images/listings/6145-se-audubon-lane/13-porch-2.jpg', alt: 'Covered porch seating area' },
      { src: '/images/listings/6145-se-audubon-lane/14-porch-3.jpg', alt: 'Open porch adjoining the pool patio' },
      { src: '/images/listings/6145-se-audubon-lane/15-entryway-1.jpg', alt: 'Front entryway' },
      { src: '/images/listings/6145-se-audubon-lane/16-entryway-2.jpg', alt: 'Entry foyer' },
      { src: '/images/listings/6145-se-audubon-lane/17-living-area-1.jpg', alt: 'Living room with cathedral ceiling' },
      { src: '/images/listings/6145-se-audubon-lane/18-living-area-2.jpg', alt: 'Living room view toward the kitchen' },
      { src: '/images/listings/6145-se-audubon-lane/19-living-area-3.jpg', alt: 'Living room seating area' },
      { src: '/images/listings/6145-se-audubon-lane/20-kitchen-1.jpg', alt: 'Updated kitchen with granite countertops, stone backsplash, and stainless appliances' },
      { src: '/images/listings/6145-se-audubon-lane/21-kitchen-2.jpg', alt: 'Kitchen island seating with pool view through sliding glass doors' },
      { src: '/images/listings/6145-se-audubon-lane/22-kitchen-3.jpg', alt: 'Kitchen cabinetry and countertops' },
      { src: '/images/listings/6145-se-audubon-lane/23-kitchen-4.jpg', alt: 'Kitchen view' },
      { src: '/images/listings/6145-se-audubon-lane/24-kitchen-5.jpg', alt: 'Kitchen appliances and counter space' },
      { src: '/images/listings/6145-se-audubon-lane/25-dining-area-1.jpg', alt: 'Dining area adjoining the kitchen' },
      { src: '/images/listings/6145-se-audubon-lane/26-dining-area-2.jpg', alt: 'Dining area' },
      { src: '/images/listings/6145-se-audubon-lane/27-primary-bedroom-1.jpg', alt: 'Primary bedroom' },
      { src: '/images/listings/6145-se-audubon-lane/28-primary-bedroom-2.jpg', alt: 'Primary bedroom with natural light' },
      { src: '/images/listings/6145-se-audubon-lane/29-primary-bedroom-3.jpg', alt: 'Primary bedroom view' },
      { src: '/images/listings/6145-se-audubon-lane/30-primary-bedroom-4.jpg', alt: 'Primary bedroom' },
      { src: '/images/listings/6145-se-audubon-lane/31-primary-bedroom-5.jpg', alt: 'Primary bedroom closet area' },
      { src: '/images/listings/6145-se-audubon-lane/32-guest-area-1.jpg', alt: 'Guest bedroom hallway area' },
      { src: '/images/listings/6145-se-audubon-lane/33-guest-area-2.jpg', alt: 'Guest bedroom area' },
      { src: '/images/listings/6145-se-audubon-lane/34-guest-bedroom-a-1.jpg', alt: 'Guest bedroom A' },
      { src: '/images/listings/6145-se-audubon-lane/35-guest-bedroom-a-2.jpg', alt: 'Guest bedroom A view' },
      { src: '/images/listings/6145-se-audubon-lane/36-guest-bedroom-a-3.jpg', alt: 'Guest bedroom A' },
      { src: '/images/listings/6145-se-audubon-lane/37-jack-and-jill-bath-1.jpg', alt: 'Jack-and-Jill bathroom' },
      { src: '/images/listings/6145-se-audubon-lane/38-jack-and-jill-bath-2.jpg', alt: 'Jack-and-Jill bathroom vanity' },
      { src: '/images/listings/6145-se-audubon-lane/39-guest-bedroom-b-1.jpg', alt: 'Guest bedroom B' },
      { src: '/images/listings/6145-se-audubon-lane/40-guest-bedroom-b-2.jpg', alt: 'Guest bedroom B view' },
      { src: '/images/listings/6145-se-audubon-lane/41-guest-bedroom-b-3.jpg', alt: 'Guest bedroom B' },
      { src: '/images/listings/6145-se-audubon-lane/42-guest-bedroom-b-4.jpg', alt: 'Guest bedroom B closet' },
      { src: '/images/listings/6145-se-audubon-lane/43-garage.jpg', alt: 'Attached one-car garage with laundry area' },
      { src: '/images/listings/6145-se-audubon-lane/44-driveway.jpg', alt: 'Driveway and front parking area' },
    ],
    floorPlan: {
      src: '/images/listings/6145-se-audubon-lane/floor-plan.jpg',
      alt: 'Floor plan of 6145 SE Audubon Lane, Hobe Sound, FL, showing room layout and dimensions',
    },

    listingAgent: JOHN,
    coListingAgent: CHRISTINE,
    brokerage: 'Premier Brokers International',

    metaTitle: '6145 SE Audubon Lane: No-HOA Pool Home in Hobe Sound, FL',
    metaDescription: "3BR/2BA pool home in Hobe Sound's Poinciana Gardens — no HOA, owned solar, new septic, impact windows. $615,000. Schedule your private showing today.",
  },
  {
    slug: '982-sw-worcester-lane',
    status: 'Active',
    mlsNumber: 'R11155179DX',

    address: '982 SW Worcester Lane',
    city: 'Port St. Lucie',
    citySlug: 'port-st-lucie',
    county: 'St. Lucie',
    state: 'FL',
    zip: '34953',
    subdivision: 'Port St. Lucie Section 12',
    legalDescription: 'Port St. Lucie - Section 12, Block 1290, Lot 38 (Map 44/07S)',

    price: 400000,
    originalPrice: 420000,
    pricePerSqft: 233.92,

    propertyType: 'Single-Family Residence',
    beds: 3,
    bathsFull: 2,
    bathsHalf: 0,
    livingSqft: 1710,
    livingSqftSource: 'Public Records',
    totalUnderRoofSqft: 2232,
    lotSqft: 10000,
    lotAcres: 0.23,
    yearBuilt: 2007,
    stories: 1,
    garageSpaces: 2,

    waterfront: false,
    hoa: { hasHoa: false, notes: 'No homeowners association, no membership fee, and no association-imposed restrictions on the property.' },

    taxAnnual: 8040.83,
    taxYear: 2025,

    roof: 'Composition shingle',
    cooling: ['Central air conditioning'],
    heating: ['Central heat'],
    constructionMaterials: ['Block', 'CBS', 'Concrete'],
    stormProtection: 'Accordion/panel hurricane shutters (complete)',
    sewer: 'Public sewer',
    waterSource: 'Public',
    zoning: 'RS-2PS',
    gated: false,
    utilities: ['Cable available', 'Sewer available', 'Water available'],
    appliances: ['Dishwasher', 'Electric range', 'Microwave', 'Refrigerator', 'Washer', 'Water heater'],
    interiorFeatures: ['Split-bedroom floor plan', 'Cathedral and vaulted ceilings', 'Central vacuum', 'Pantry', 'Bonus den'],
    exteriorFeatures: ['Custom metal-roofed patio cover with lighting and a ceiling fan', 'Covered and open patio', 'Open porch'],
    lotFeatures: ['Fully fenced backyard', 'Neatly kept lawn'],

    pets: { allowed: true, notes: 'No pet restrictions noted on the listing.' },
    furnished: 'Unfurnished',
    occupancy: 'Vacant',

    roomDimensions: [
      { name: 'Living Room', dimensions: `14'0" x 14'0"`, level: 'Main' },
      { name: 'Kitchen', dimensions: `10'0" x 10'0"`, level: 'Main' },
      { name: 'Primary Bedroom', dimensions: `15'0" x 12'0"`, level: 'Main' },
    ],

    upgrades: [
      { item: 'Fresh interior paint throughout' },
      { item: 'Newly painted kitchen cabinetry' },
      { item: 'Custom metal-roofed patio cover added over the paver patio' },
    ],

    highlights: [
      'No HOA — no association fees or restrictions',
      'Move-in ready with fresh interior paint throughout and newly painted kitchen cabinetry',
      'Custom metal-roofed patio cover over a spacious paver patio, with lighting and a ceiling fan already in place',
      'Fully fenced backyard with a neatly kept lawn — room to add a screened enclosure if desired',
      'Split-bedroom floor plan with cathedral and vaulted ceilings plus a bonus den',
      'Two-car attached garage',
      'Vacant and easy to show, with flexible scheduling',
    ],

    overview: [
      "This three-bedroom home in Port St. Lucie's Section 12 has already had the hard work done. Fresh paint covers the interior from end to end, the kitchen cabinetry has been newly painted, and the backyard has a custom metal-roofed patio cover already built over a spacious paver patio — complete with lighting and a ceiling fan. There's room to add a screened enclosure later if a future owner wants one.",
      "The home sits on a quarter-acre with no HOA, a fully fenced backyard, and a neatly kept lawn framed by a soft blue exterior with real curb appeal. Inside, a split-bedroom layout, cathedral and vaulted ceilings, and a bonus den give the floor plan flexibility beyond the three bedrooms — room for a home office, playroom, or second sitting area.",
      'The property is vacant, which means showings can be scheduled with real flexibility — no coordinating around a tenant or an owner still living in the home.',
    ],

    ownershipConsiderations: [
      'Public water and sewer service — no well or septic system to maintain.',
      'Storm protection is provided by accordion/panel hurricane shutters rather than impact windows.',
      "Annual property taxes are currently $8,040.83 (2025), reflecting both city and county millage; buyers should confirm expected taxes after a sale with their agent or the St. Lucie County Property Appraiser, since assessments can change with a change in ownership or homestead status.",
      'Accepted financing types include cash, conventional, FHA, and VA loans.',
      'A standard resale — a home inspection is recommended, as with any purchase.',
    ],

    locationNotes: [
      "Located off Port St. Lucie Boulevard in the established Section 12 neighborhood.",
      'Tradition Town Center, PGA Golf Club, and Clover Park (New York Mets spring training) are all within the greater Port St. Lucie area.',
      'The Savannas Preserve State Park and the St. Lucie River offer paddling, fishing, and outdoor recreation nearby.',
    ],

    assignedSchools: [
      { level: 'Elementary', name: 'Windmill Point Elementary School' },
      { level: 'Middle', name: 'Manatee Academy K-8' },
      { level: 'High', name: 'St. Lucie West Centennial High School' },
    ],

    listingDateDisplay: 'January 15, 2026',
    domCount: 179,
    possession: 'Close of escrow; negotiable',
    financingTermsAccepted: ['Cash', 'Conventional', 'FHA', 'VA Loan'],

    virtualTourUrl: 'https://www.propertypanorama.com/982-SW-Worcester-Lane-Port-Saint-Lucie-FL-34953/unbranded',

    heroPhoto: {
      src: '/images/listings/982-sw-worcester-lane/01-exterior-twilight.jpg',
      alt: 'Twilight view of the powder-blue front exterior of 982 SW Worcester Lane in Port St. Lucie, FL',
    },
    ogImage: {
      src: '/images/listings/982-sw-worcester-lane/og-image.jpg',
      alt: 'Twilight view of the powder-blue front exterior of 982 SW Worcester Lane in Port St. Lucie, FL',
    },
    photos: [
      { src: '/images/listings/982-sw-worcester-lane/02-exterior-1.jpg', alt: 'Front exterior daytime view of the powder-blue single-story home' },
      { src: '/images/listings/982-sw-worcester-lane/03-exterior-2.jpg', alt: 'Front exterior and driveway' },
      { src: '/images/listings/982-sw-worcester-lane/04-exterior-3.jpg', alt: 'Front exterior view' },
      { src: '/images/listings/982-sw-worcester-lane/05-exterior-4.jpg', alt: 'Front exterior and landscaping' },
      { src: '/images/listings/982-sw-worcester-lane/06-exterior-5.jpg', alt: 'Front exterior daytime view' },
      { src: '/images/listings/982-sw-worcester-lane/07-exterior-6.jpg', alt: 'Front exterior view' },
      { src: '/images/listings/982-sw-worcester-lane/08-aerial-1.jpg', alt: 'Aerial view of the property and surrounding neighborhood' },
      { src: '/images/listings/982-sw-worcester-lane/09-aerial-2.jpg', alt: 'Aerial view of the home and fenced backyard' },
      { src: '/images/listings/982-sw-worcester-lane/10-aerial-3.jpg', alt: 'Aerial view of the property and lot' },
      { src: '/images/listings/982-sw-worcester-lane/11-entrance.jpg', alt: 'Front entrance' },
      { src: '/images/listings/982-sw-worcester-lane/12-foyer-1.jpg', alt: 'Entry foyer' },
      { src: '/images/listings/982-sw-worcester-lane/13-foyer-2.jpg', alt: 'Foyer view' },
      { src: '/images/listings/982-sw-worcester-lane/14-living-area-1.jpg', alt: 'Living room with cathedral ceiling' },
      { src: '/images/listings/982-sw-worcester-lane/15-living-area-2.jpg', alt: 'Living room view' },
      { src: '/images/listings/982-sw-worcester-lane/16-living-area-3.jpg', alt: 'Living room seating area' },
      { src: '/images/listings/982-sw-worcester-lane/17-dining-area-1.jpg', alt: 'Formal dining area' },
      { src: '/images/listings/982-sw-worcester-lane/18-dining-area-2.jpg', alt: 'Dining area view' },
      { src: '/images/listings/982-sw-worcester-lane/19-dining-area-3.jpg', alt: 'Dining area' },
      { src: '/images/listings/982-sw-worcester-lane/20-breakfast-nook-1.jpg', alt: 'Breakfast nook' },
      { src: '/images/listings/982-sw-worcester-lane/21-breakfast-nook-2.jpg', alt: 'Breakfast nook seating area' },
      { src: '/images/listings/982-sw-worcester-lane/22-breakfast-nook-3.jpg', alt: 'Breakfast nook adjoining the kitchen' },
      { src: '/images/listings/982-sw-worcester-lane/23-kitchen-1.jpg', alt: 'Kitchen with newly painted cabinetry' },
      { src: '/images/listings/982-sw-worcester-lane/24-kitchen-2.jpg', alt: 'Kitchen counters and appliances' },
      { src: '/images/listings/982-sw-worcester-lane/25-kitchen-3.jpg', alt: 'Kitchen view' },
      { src: '/images/listings/982-sw-worcester-lane/26-kitchen-4.jpg', alt: 'Kitchen cabinetry' },
      { src: '/images/listings/982-sw-worcester-lane/27-family-area-1.jpg', alt: 'Family room' },
      { src: '/images/listings/982-sw-worcester-lane/28-family-area-2.jpg', alt: 'Family room view' },
      { src: '/images/listings/982-sw-worcester-lane/29-family-area-3.jpg', alt: 'Family room seating area' },
      { src: '/images/listings/982-sw-worcester-lane/30-primary-bedroom-1.jpg', alt: 'Primary bedroom' },
      { src: '/images/listings/982-sw-worcester-lane/31-primary-bedroom-2.jpg', alt: 'Primary bedroom with natural light' },
      { src: '/images/listings/982-sw-worcester-lane/32-primary-bedroom-3.jpg', alt: 'Primary bedroom view' },
      { src: '/images/listings/982-sw-worcester-lane/33-primary-bedroom-4.jpg', alt: 'Primary bedroom' },
      { src: '/images/listings/982-sw-worcester-lane/34-primary-bedroom-5.jpg', alt: 'Primary bedroom closet area' },
      { src: '/images/listings/982-sw-worcester-lane/35-primary-bedroom-6.jpg', alt: 'Primary bedroom' },
      { src: '/images/listings/982-sw-worcester-lane/36-primary-bedroom-7.jpg', alt: 'Primary bedroom view' },
      { src: '/images/listings/982-sw-worcester-lane/37-primary-bedroom-8.jpg', alt: 'Primary bedroom' },
      { src: '/images/listings/982-sw-worcester-lane/38-primary-bedroom-9.jpg', alt: 'Primary bedroom' },
      { src: '/images/listings/982-sw-worcester-lane/39-primary-bathroom-1.jpg', alt: 'Primary bathroom' },
      { src: '/images/listings/982-sw-worcester-lane/40-primary-bathroom-2.jpg', alt: 'Primary bathroom vanity' },
      { src: '/images/listings/982-sw-worcester-lane/41-primary-bathroom-3.jpg', alt: 'Primary bathroom view' },
      { src: '/images/listings/982-sw-worcester-lane/42-primary-bathroom-4.jpg', alt: 'Primary bathroom shower' },
      { src: '/images/listings/982-sw-worcester-lane/43-primary-bathroom-5.jpg', alt: 'Primary bathroom' },
      { src: '/images/listings/982-sw-worcester-lane/44-guest-area.jpg', alt: 'Guest bedroom hallway area' },
      { src: '/images/listings/982-sw-worcester-lane/45-guest-bedroom-a-1.jpg', alt: 'Guest bedroom A' },
      { src: '/images/listings/982-sw-worcester-lane/46-guest-bedroom-a-2.jpg', alt: 'Guest bedroom A view' },
      { src: '/images/listings/982-sw-worcester-lane/47-guest-bedroom-a-3.jpg', alt: 'Guest bedroom A' },
      { src: '/images/listings/982-sw-worcester-lane/48-guest-bedroom-a-4.jpg', alt: 'Guest bedroom A closet' },
      { src: '/images/listings/982-sw-worcester-lane/49-guest-bedroom-a-5.jpg', alt: 'Guest bedroom A' },
      { src: '/images/listings/982-sw-worcester-lane/50-guest-bathroom-1.jpg', alt: 'Guest bathroom' },
      { src: '/images/listings/982-sw-worcester-lane/51-guest-bathroom-2.jpg', alt: 'Guest bathroom vanity' },
      { src: '/images/listings/982-sw-worcester-lane/52-guest-bedroom-b-1.jpg', alt: 'Guest bedroom B' },
      { src: '/images/listings/982-sw-worcester-lane/53-guest-bedroom-b-2.jpg', alt: 'Guest bedroom B view' },
      { src: '/images/listings/982-sw-worcester-lane/54-guest-bedroom-b-3.jpg', alt: 'Guest bedroom B' },
      { src: '/images/listings/982-sw-worcester-lane/55-guest-bedroom-b-4.jpg', alt: 'Guest bedroom B closet' },
      { src: '/images/listings/982-sw-worcester-lane/56-patio-1.jpg', alt: 'Covered paver patio with custom metal patio cover' },
      { src: '/images/listings/982-sw-worcester-lane/57-patio-2.jpg', alt: 'Patio and fully fenced backyard' },
      { src: '/images/listings/982-sw-worcester-lane/58-patio-3.jpg', alt: 'Patio view with ceiling fan and lighting' },
      { src: '/images/listings/982-sw-worcester-lane/59-patio-4.jpg', alt: 'Patio and backyard lawn' },
      { src: '/images/listings/982-sw-worcester-lane/60-patio-5.jpg', alt: 'Patio seating area' },
      { src: '/images/listings/982-sw-worcester-lane/61-patio-6.jpg', alt: 'Patio and yard view' },
      { src: '/images/listings/982-sw-worcester-lane/62-patio-7.jpg', alt: 'Backyard view from the patio' },
      { src: '/images/listings/982-sw-worcester-lane/63-patio-8.jpg', alt: 'Fenced backyard and lawn' },
      { src: '/images/listings/982-sw-worcester-lane/64-patio-9.jpg', alt: 'Patio and backyard' },
      { src: '/images/listings/982-sw-worcester-lane/65-laundry-room-1.jpg', alt: 'Laundry room' },
      { src: '/images/listings/982-sw-worcester-lane/66-laundry-room-2.jpg', alt: 'Laundry room with laundry tub' },
      { src: '/images/listings/982-sw-worcester-lane/67-garage-1.jpg', alt: 'Two-car attached garage' },
      { src: '/images/listings/982-sw-worcester-lane/68-garage-2.jpg', alt: 'Garage interior view' },
      { src: '/images/listings/982-sw-worcester-lane/69-garage-3.jpg', alt: 'Garage view' },
      { src: '/images/listings/982-sw-worcester-lane/70-exit-1.jpg', alt: 'Side exit view' },
      { src: '/images/listings/982-sw-worcester-lane/71-exit-2.jpg', alt: 'Side exit and yard access' },
    ],

    listingAgent: JOHN,
    coListingAgent: CHRISTINE,
    brokerage: 'Premier Brokers International',

    metaTitle: '982 SW Worcester Lane: Move-In Ready No-HOA Home in Port St. Lucie, FL',
    metaDescription: 'Move-in-ready 3BR/2BA home in Port St. Lucie — no HOA, fresh paint, custom patio cover, fully fenced yard. $400,000. Vacant and easy to show.',
  },
]

export function getListingBySlug(slug: string) {
  return listings.find((l) => l.slug === slug)
}

export function getListingPaths() {
  return listings.map((l) => ({ slug: l.slug }))
}

export function getActiveListings() {
  return listings.filter((l) => l.status === 'Active' || l.status === 'Coming Soon' || l.status === 'Pending')
}
