export type ListingStatus = 'Active' | 'Active Under Contract' | 'Pending' | 'Coming Soon' | 'Sold'

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

// Shots of the community rather than the home itself. Kept in a separate,
// captioned gallery: the main gallery carries no captions, so an amenity photo
// sitting in it would read as part of the house.
export interface CommunityPhoto extends ListingPhoto {
  caption: string
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
  // Absent on Coming Soon listings that haven't hit the MLS yet.
  mlsNumber?: string

  address: string
  city: string
  citySlug: string // matches a slug in communities.ts for internal linking
  county: string
  state: string
  zip: string
  subdivision?: string
  legalDescription?: string

  // Withheld on Coming Soon listings until a list date is set — the page then
  // reads "Price Upon Request" everywhere a dollar figure would normally sit.
  price?: number
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
  communityPhotos?: CommunityPhoto[]
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
  credentials: 'REALTOR® · ABR · RENE · RSPS · SRS',
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
  // ─────────────────────────────────────────────────────────────────────────
  // Beds, baths, square footage, finishes and equipment below come from John's
  // own "What's special" notes on the property. Still unconfirmed and still
  // sourced from public records or estimate: lotSqft/lotAcres,
  // totalUnderRoofSqft, hoa.fee, and taxAnnual (absent). Still to add:
  // mlsNumber, price, listingDateDisplay, and photos of the interior.
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: '8804-skyward-street',
    status: 'Coming Soon',

    address: '8804 Skyward Street',
    city: 'Boca Raton',
    citySlug: 'boca-raton',
    county: 'Palm Beach',
    state: 'FL',
    zip: '33496',
    subdivision: 'Lotus',

    propertyType: 'Single-Family Residence',
    beds: 5,
    bathsFull: 6,
    bathsHalf: 1,
    livingSqft: 4932,
    totalUnderRoofSqft: 6263,
    lotSqft: 7840,
    lotAcres: 0.18,
    yearBuilt: 2021,
    stories: 2,
    garageSpaces: 3,

    pool: {
      private: true,
      features: [
        'Oversized custom pool',
        'Saltwater system',
        'Heated',
        'Marble pool deck and rear patio',
        'Full cabana bath with a French door to the deck',
        'Permitted pool safety barrier',
      ],
    },
    waterfront: true,
    view: 'Lake',
    hoa: {
      hasHoa: true,
      fee: 'Approx. $420/month',
      notes:
        'Lotus is a guard-gated GL Homes community with a 24-hour manned gate. The HOA assessment covers the gate, lawn maintenance for each home, the common areas, the clubhouse, and a full-time social director — so the monthly figure carries more than a typical Boca Raton association fee does. Confirm the current assessment and what it includes with the association before writing an offer.',
    },

    roof: 'Concrete tile',
    cooling: ['Central air conditioning'],
    heating: ['Central heat'],
    constructionMaterials: ['Concrete block', 'Stucco'],
    flooring: ['Wood — all second-floor bedrooms and the loft', 'Tile'],
    stormProtection: 'Impact-resistant glass windows and doors throughout',
    sewer: 'Public sewer',
    waterSource: 'Public',
    gated: true,
    appliances: ['Stainless steel appliance package', 'Central vacuum', 'Whole-house standby generator'],
    interiorFeatures: [
      'All five bedrooms en suite, with the primary suite on the first floor',
      '22-foot entry with an open floor plan beyond it',
      'Gourmet kitchen — quartz countertops, cabinetry run to the ceiling, stainless appliances',
      'Office/den, formal dining room, living room and breakfast area',
      'Loft, media room, and a gym with mirrored walls',
      'Built-in closets throughout',
      'Sound insulation around the primary suite and the media room',
      'Upgraded smooth-finish ceilings',
      'Central vacuum',
    ],
    exteriorFeatures: [
      'Oversized custom saltwater pool, heated',
      'Marble pool deck and rear patio',
      'Cabana bath opening to the deck through a French door',
      'Lake frontage behind the pool deck',
    ],

    highlights: [
      'Lake-front homesite with an oversized custom saltwater pool, heated, on a marble deck',
      'All five bedrooms are en suite — 6.5 baths in total — with the primary suite on the first floor',
      'A whole-house standby generator, already installed',
      'Impact glass windows and doors throughout — no shutters to put up',
      'Office/den, formal dining, living room, breakfast area, loft, media room, and a mirrored gym: the rooms are there without converting a bedroom',
      'Full cabana bath opening to the pool deck through a French door',
      'Gourmet kitchen with quartz counters and cabinetry run all the way to the ceiling',
      'A 22-foot entry, upgraded smooth-finish ceilings, and sound insulation around the primary suite and media room',
      'Three-car garage with epoxy floors, plus central vacuum throughout',
      'Guard-gated Lotus, with a manned gate, a full-time social director, and the full resort amenity package',
    ],

    overview: [
      "This is a Sumatra on the water: 4,932 square feet built in 2021, on a lake-front lot in Lotus, with an oversized custom pool — salt, heated, marble deck — running along the back. Waterfront homesites were never a large share of what Lotus released. The pool deck here looks out over the water rather than into a neighbor's screen enclosure, which is the practical difference buyers are paying for.",
      "The room count is the real story. Five bedrooms, every one of them en suite, 6.5 baths in total, and the primary suite on the first floor. Beyond the bedrooms there is an office/den, a formal dining room, a living room, a breakfast area, a loft, a media room, and a gym with mirrored walls — so the home office and the workout space exist without giving up a bedroom for either. A 22-foot entry opens onto the floor plan, ceilings carry an upgraded smooth finish, and the primary suite and media room are sound-insulated.",
      "The expensive decisions are already made. Impact glass on every window and door, so there is nothing to put up before a storm. A whole-house standby generator. Central vacuum, built-in closets throughout, quartz counters with cabinetry run to the ceiling, wood floors through the upstairs bedrooms and loft, and epoxy floors in the three-car garage. Add a full cabana bath opening to the deck through a French door, and the house needs nothing on day one.",
      "Lotus is the other half of what a buyer is purchasing here. It is guard-gated with a manned gate around the clock, and the amenity package — clubhouse and restaurant, resort and lap pools, fitness center, lighted clay tennis courts, pickleball, an indoor sports complex, game room, playground, and splash pad — runs under a full-time social director rather than a volunteer board. The monthly assessment reflects that, and it also covers lawn maintenance on each home. There are photographs of all of it further down this page.",
    ],

    ownershipConsiderations: [
      'This home is Coming Soon and has not yet reached the MLS. The list price will be published here once a list date is set — reach out in the meantime and we will send it to you as soon as it is.',
      'Lotus carries a mandatory homeowners association with a monthly assessment that covers the manned gate, lawn maintenance, common areas, clubhouse, and social programming. Review the association documents, the current budget, and any pending assessments during your inspection period.',
      'The community and the home are subject to HOA architectural and use restrictions, and GL Homes communities typically limit leasing. Confirm the current leasing rules with the association if a rental is part of your plan.',
      'Property taxes in Palm Beach County are commonly reassessed after a sale, and the seller\'s current exemptions do not transfer. Ask us to run the expected post-sale tax figure for your situation rather than relying on the current bill.',
      'A standard home inspection is recommended, as with any purchase — a 2021 build is early in its life, but it is not a warranty.',
    ],

    locationNotes: [
      'Lotus sits along Lyons Road in west Boca Raton, north of Clint Moore Road, with straightforward access to the Turnpike and I-95.',
      'Everyday shopping, dining, and medical offices are clustered along Glades Road and the Lyons/Yamato corridor, a short drive from the gate.',
      'Mizner Park, downtown Boca, and the Boca Raton beaches are roughly 20–25 minutes east.',
      'Boca Raton Regional Hospital and Florida Atlantic University are both within the city, and Palm Beach International and Fort Lauderdale–Hollywood airports are each about 35–45 minutes out.',
    ],

    upgrades: [
      { item: 'Oversized custom saltwater pool, heated, with a marble deck and rear patio' },
      { item: 'Whole-house standby generator' },
      { item: 'Impact-resistant glass windows and doors throughout' },
      { item: 'Central vacuum' },
      { item: 'Epoxy garage floors' },
      { item: 'Upgraded smooth-finish ceilings' },
      { item: 'Sound insulation around the primary suite and media room' },
      { item: 'Built-in closets throughout' },
      { item: 'Kitchen cabinetry run to the ceiling with quartz countertops' },
      { item: 'Appliance service protection plan in place' },
    ],

    assignedSchools: [
      { level: 'Elementary', name: 'Whispering Pines Elementary School' },
      { level: 'Middle', name: 'Eagles Landing Middle School' },
      { level: 'High', name: 'Olympic Heights Community High School' },
    ],

    heroPhoto: {
      src: '/images/listings/8804-skyward-street/01-exterior-front.jpg',
      alt: 'Front exterior of 8804 Skyward Street — a two-story contemporary home in white stucco with a stone-veneer entry column, three-car garage, and paver driveway',
    },
    ogImage: {
      src: '/images/listings/8804-skyward-street/og-image.jpg',
      alt: 'Front exterior of 8804 Skyward Street in Lotus, Boca Raton',
    },

    // Interiors and the lake/pool side go here once they are shot — until then
    // the gallery says so rather than filling the slot with amenities.
    photos: [],

    communityPhotos: [
      {
        src: '/images/listings/8804-skyward-street/lotus-entrance-monument.jpg',
        alt: 'The Lotus Boca Raton entrance monument and water feature at the community gate on Lyons Road',
        caption: 'The entrance monument on Lyons Road. Past it the gate is manned around the clock.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-01-resort-pool.jpg',
        alt: 'Resort pool and clubhouse building at Lotus Boca Raton, with loungers and cabanas along the paver deck',
        caption: 'The resort pool sits directly off the clubhouse. Everything in this gallery — plus the manned gate and the lawn care on each home — is what the monthly assessment buys.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-02-pool-deck.jpg',
        alt: 'Wide view of the resort pool deck at Lotus Boca Raton with rows of loungers and shade cabanas',
        caption: 'The deck runs the full length of the pool, with shaded cabanas at the far end and a separate lap pool alongside.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-03-pool-loungers.jpg',
        alt: 'Loungers and side tables arranged along the pool deck at Lotus Boca Raton',
        caption: 'Seating is set out and maintained by the club rather than claimed by residents.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-04-clubhouse-exterior.jpg',
        alt: 'Exterior of the Lotus Boca Raton clubhouse seen from the drive, framed by royal palms',
        caption: 'The clubhouse from the drive. The restaurant, fitness center, game room, playroom, and indoor sports complex are all under this roof.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-05-sports-complex.jpg',
        alt: 'Indoor sports complex court at Lotus Boca Raton with the Lotus emblem at center court',
        caption: 'The indoor sports complex — a full air-conditioned court, which is rare even among Boca clubs at this level.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-06-basketball-court.jpg',
        alt: 'Indoor basketball court at Lotus Boca Raton with clerestory windows along the upper wall',
        caption: 'The same court from the baseline. It converts for pickleball and volleyball as well.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-07-fitness-cardio.jpg',
        alt: 'Row of treadmills and cardio machines along the window wall of the Lotus Boca Raton fitness center',
        caption: 'Cardio runs along the window wall of the fitness center, looking out to the pool deck.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-08-fitness-strength.jpg',
        alt: 'Free weights and strength training machines in the Lotus Boca Raton fitness center',
        caption: 'Free weights and strength machines share the same room — no separate membership or class fee.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-09-kids-playroom.jpg',
        alt: "Indoor children's playroom at Lotus Boca Raton with a soft-play climbing frame and slide",
        caption: "The children's playroom: soft play, a climbing frame and a slide, indoors and air-conditioned.",
      },
      {
        src: '/images/listings/8804-skyward-street/community-10-kids-playroom-2.jpg',
        alt: "Second view of the children's playroom at Lotus Boca Raton showing the climbing structure and play panels",
        caption: 'A second view of the same room. It is a genuine draw for buyers moving with young children in August heat.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-11-entrance-drive.jpg',
        alt: 'The entrance drive at Lotus Boca Raton with fountains in the reflecting pool alongside',
        caption: 'The approach to the manned gate, with fountains running the length of the entry drive.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-12-activity-calendar.jpg',
        alt: 'A printed monthly resident activity calendar on a desk in the Lotus Boca Raton clubhouse',
        caption: 'One month of resident programming — coffee talks, food trucks, fitness classes. This is what a full-time social director produces, and it is the part of the assessment buyers tend to underestimate.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-13-sports-complex-2.jpg',
        alt: 'Wide view of the indoor sports complex court at Lotus Boca Raton from the sideline',
        caption: 'The sports complex from the sideline — full ceiling height, padded walls, and clerestory glass along the top.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-14-fitness-cardio-2.jpg',
        alt: 'Cardio machines and a weight rack in the Lotus Boca Raton fitness center, with the pool deck visible outside',
        caption: 'The other end of the fitness center. Nothing here is on a booking system — residents walk in.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-15-entrance-monument-drive.jpg',
        alt: 'The Lotus Boca Raton entrance drive with the monument sign and reflecting-pool fountains alongside',
        caption: 'The monument and reflecting pool as you turn in off Lyons Road.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-16-entrance-fountains.jpg',
        alt: 'Fountains running along the reflecting pool beside the entrance drive at Lotus Boca Raton',
        caption: 'The fountains run the length of the entry — the first thing your guests see.',
      },
      {
        src: '/images/listings/8804-skyward-street/community-17-entrance-approach.jpg',
        alt: 'The approach road into Lotus Boca Raton, divided and landscaped, leading toward the manned gate',
        caption: 'The approach to the gatehouse. Everything past this point is residents and their guests.',
      },
    ],

    listingAgent: JOHN,
    coListingAgent: CHRISTINE,
    brokerage: 'Premier Brokers International',

    metaTitle: '8804 Skyward Street: Coming Soon Lakefront Pool Home in Lotus, Boca Raton',
    metaDescription:
      'Coming Soon in Lotus, Boca Raton — a lakefront Sumatra with 5 en-suite bedrooms, 6.5 baths, 4,932 sq ft, a heated saltwater pool, impact glass and a whole-house generator. Ask for early access.',
  },
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

    price: 599000,
    originalPrice: 625000,
    pricePerSqft: 423.02,

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
    metaDescription: "3BR/2BA pool home in Hobe Sound's Poinciana Gardens — no HOA, owned solar, new septic, impact windows. $599,000. Schedule your private showing today.",
  },
  {
    slug: '982-sw-worcester-lane',
    status: 'Active Under Contract',
    mlsNumber: 'R11155179DX',

    address: '982 SW Worcester Lane',
    city: 'Port St. Lucie',
    citySlug: 'port-st-lucie',
    county: 'St. Lucie',
    state: 'FL',
    zip: '34953',
    legalDescription: 'Port St. Lucie - Section 12, Block 1290, Lot 38 (Map 44/07S)',

    price: 390000,
    originalPrice: 420000,
    pricePerSqft: 228.07,

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
      "This three-bedroom home in Port St. Lucie has already had the hard work done. Fresh paint covers the interior from end to end, the kitchen cabinetry has been newly painted, and the backyard has a custom metal-roofed patio cover already built over a spacious paver patio — complete with lighting and a ceiling fan. There's room to add a screened enclosure later if a future owner wants one.",
      "The home sits on a quarter-acre with no HOA, a fully fenced backyard, and a neatly kept lawn framed by a soft blue exterior with real curb appeal. Inside, a split-bedroom layout, cathedral and vaulted ceilings, and a bonus den give the floor plan flexibility beyond the three bedrooms — room for a home office, playroom, or second sitting area.",
    ],

    ownershipConsiderations: [
      'Public water and sewer service — no well or septic system to maintain.',
      'Storm protection is provided by accordion/panel hurricane shutters rather than impact windows.',
      "Annual property taxes are currently $8,040.83 (2025), reflecting both city and county millage; buyers should confirm expected taxes after a sale with their agent or the St. Lucie County Property Appraiser, since assessments can change with a change in ownership or homestead status.",
      'Accepted financing types include cash, conventional, FHA, and VA loans.',
      'A standard resale — a home inspection is recommended, as with any purchase.',
    ],

    locationNotes: [
      "Located off Port St. Lucie Boulevard in an established Port St. Lucie neighborhood.",
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
    metaDescription: 'Move-in-ready 3BR/2BA home in Port St. Lucie — no HOA, fresh paint, custom patio cover, fully fenced yard. $390,000. Vacant and easy to show.',
  },
]

export function getListingBySlug(slug: string) {
  return listings.find((l) => l.slug === slug)
}

export function getListingPaths() {
  return listings.map((l) => ({ slug: l.slug }))
}

export function getActiveListings() {
  return listings.filter((l) => l.status !== 'Sold')
}

// "Available" means a buyer can still act on it normally — not under contract,
// pending, or sold.
export function isAvailable(status: ListingStatus) {
  return status === 'Active' || status === 'Coming Soon'
}

// Only an available listing gets the green badge — anything under contract or
// already sold reads as available if it shares that color.
export function statusBadgeClasses(status: ListingStatus, tone: 'solid' | 'soft') {
  if (tone === 'solid') {
    return isAvailable(status) ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-white'
  }
  return isAvailable(status) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
}

// A price cut only sells the home while it's still on the market. Once it's under
// contract the badge is noise sitting next to a status that already says more.
export function showsPriceReduced(listing: Listing) {
  return (
    isAvailable(listing.status) &&
    Boolean(listing.price && listing.originalPrice && listing.originalPrice > listing.price)
  )
}

// Every dollar figure on a listing goes through here so an unpriced Coming Soon
// listing reads the same way in the hero, the card, and the sticky sidebar.
export function priceDisplay(listing: Listing) {
  return listing.price ? `$${listing.price.toLocaleString('en-US')}` : 'Price Upon Request'
}

// Photo-rotation speed for each listing card. Two cards crossfading in step
// looks like a glitch rather than a slideshow, so every listing gets its own
// interval and no two can collide.
//
// Keyed off slug order, not array order: hashing the slug produced duplicate
// intervals, and using the display index meant reordering the listings swapped
// the cards' rhythms around with them.
const ROTATION_BASE_MS = 3400
const ROTATION_STEP_MS = 650
const rotationBySlug = new Map(
  listings
    .map((l) => l.slug)
    .sort()
    .map((slug, i) => [slug, ROTATION_BASE_MS + i * ROTATION_STEP_MS] as const),
)

export function cardRotationMs(slug: string) {
  return rotationBySlug.get(slug) ?? ROTATION_BASE_MS
}
