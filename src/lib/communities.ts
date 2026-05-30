export type CommunityType = 'City' | 'Neighborhood'

export interface CommunityItem {
  slug: string
  name: string
  type: CommunityType
  region: string
  description: string
  overview: string
  quickFacts: Array<{ label: string; value: string }>
  linkedNeighborhoods?: string[]
  priceRanges?: Array<{ type: string; range: string; minPrice?: number; maxPrice?: number }>
  highlights?: string[]
  photos?: string[]
  // Extended content fields
  lifestyle?: string
  localLoves?: string[]
  schoolOverview?: string
  schoolList?: Array<{ category: string; schools: Array<{ name: string; url?: string }> }>
  hospitals?: Array<{ name: string; url: string; note?: string }>
  commuteTimes?: Array<{ destination: string; time: string }>
  dining?: string[]
  outdoorActivities?: string[]
  hiddenGems?: string[]
  popularNeighborhoods?: string[]
  subNeighborhoods?: Array<{ name: string; description: string }>
  lat?: number
  lng?: number
}

export const cities: CommunityItem[] = [
  {
    slug: 'west-palm-beach',
    name: 'West Palm Beach',
    type: 'City',
    region: 'Palm Beach County',
    description: 'A vibrant coastal city with luxury waterfront homes, downtown lifestyle, and strong resale value.',
    overview:
      'West Palm Beach blends historic charm, waterfront neighborhoods, and urban amenities. From the arts district along Clematis Street to the waterfront estates of El Cid and North End, there\'s a neighborhood for every lifestyle. DO Homes Group helps buyers and sellers navigate this diverse and fast-moving market.',
    quickFacts: [
      { label: 'Market focus', value: 'Waterfront condos, infill single-family homes, investment property' },
      { label: 'Key advantage', value: 'Strong downtown demand and walkable districts' },
    ],
    linkedNeighborhoods: ['ibis', 'el-cid', 'harbour-islands', 'downtown-west-palm', 'singer-island', 'palm-beach-lakes'],
    priceRanges: [
      { type: 'Condos & High-Rise', range: '$300K – $800K' },
      { type: 'Single-Family Homes', range: '$500K – $1.5M' },
      { type: 'Historic Districts (El Cid, Flamingo Park)', range: '$600K – $2M' },
      { type: 'Waterfront Estates', range: '$2M – $10M+' },
    ],
    highlights: [
      'Walkable downtown with Clematis Street dining, nightlife, and Kravis Center arts',
      'Intracoastal waterfront access and direct ferry to Palm Beach island',
      'Strong rental demand from seasonal residents and corporate relocators',
      'Historic neighborhoods like El Cid and Flamingo Park with vintage Florida architecture',
      'Easy access to PBI Airport, I-95, and the Brightline station',
    ],
    photos: [
      '/public/West Palm/34A60333-DC57-49C0-93B2-C109DFF5D57E.jpg',
      '/public/West Palm/89AA5905-D3C1-419A-9263-4E0EE2B36011.jpg',
      '/public/West Palm/IMG_6757 (1).jpg',
      '/public/West Palm/IMG_8538.JPEG',
    ],
    lat: 26.7153, lng: -80.0534,
  },
  {
    slug: 'palm-beach-gardens',
    name: 'Palm Beach Gardens',
    type: 'City',
    region: 'Northern Palm Beach County',
    description: 'A premier master-planned city offering golf, shopping, top-rated schools, and some of the county\'s most desirable communities.',
    overview:
      'Palm Beach Gardens is where upscale living meets everyday ease. PGA Boulevard anchors a city full of world-class golf, shopping at The Gardens Mall, and beautifully planned neighborhoods. Whether you\'re looking for a lock-and-leave golf villa or a multi-million dollar estate, PBG delivers. DO Homes Group has deep roots here and knows every community from PGA National to the emerging Avenir master plan.',
    quickFacts: [
      { label: 'Market focus', value: 'Golf course estates, luxury townhomes, gated neighborhoods' },
      { label: 'Key advantage', value: 'Proximity to I-95, PGA Boulevard, and A-rated schools' },
    ],
    linkedNeighborhoods: ['pga-national', 'ballen-isles', 'avenir', 'mirasol', 'alton', 'east-palm-bay', 'panther-national', 'prado'],
    priceRanges: [
      { type: 'Townhomes & Villas', range: '$450K – $750K' },
      { type: 'Single-Family Homes', range: '$700K – $1.5M' },
      { type: 'Golf & Country Club Estates', range: '$1.5M – $5M+' },
      { type: 'New Construction (Avenir)', range: '$550K – $1.3M' },
    ],
    highlights: [
      'Home to PGA National Resort, BallenIsles, and Mirasol — three of Florida\'s top golf communities',
      'Avenir is one of South Florida\'s largest new master-planned developments with thousands of new homes',
      'PGA Boulevard corridor offers premier dining, retail, and easy highway access',
      'Top-rated Palm Beach County public and charter schools',
      'Short drive to Jupiter beaches and 30 minutes to Fort Lauderdale airport',
    ],
    photos: [
      '/public/Palm Beach Gardens/IMG_7081.JPG',
      '/public/Palm Beach Gardens/IMG_7085.JPG',
      '/public/Palm Beach Gardens/IMG_7086.JPG',
      '/public/Palm Beach Gardens/IMG_0869.JPG',
      '/public/Palm Beach Gardens/IMG_9348.JPG',
      '/public/Palm Beach Gardens/211.JPG',
    ],
    lat: 26.8233, lng: -80.1246,
  },
  {
    slug: 'jupiter',
    name: 'Jupiter',
    type: 'City',
    region: 'Northern Palm Beach County',
    description: 'A coastal town with oceanfront living, top private clubs, and a laid-back Florida lifestyle that attracts buyers from around the world.',
    overview:
      'Welcome to Jupiter — where sunrise paddleboarding, top-rated schools, pristine beaches, and small-town charm meet luxury South Florida living. Located at the northern tip of Palm Beach County, Jupiter offers an easygoing coastal lifestyle with quick access to I-95, Palm Beach International Airport, the Brightline, and downtown West Palm Beach. Whether you\'re searching for a waterfront condo, gated golf community, new construction home, or a lock-and-leave townhome — Jupiter delivers a lifestyle that feels like vacation every day.\n\nJupiter is relaxed, outdoorsy, and community-focused — but with just the right amount of luxury. You\'ll see golf carts at dinner, paddleboards on Jeeps, kids biking to school, and neighbors who actually wave back. Families, professionals, retirees, and second-home buyers all call Jupiter home. It\'s one of the most sought-after markets in all of Palm Beach County — and our team has the local knowledge to get you in.',
    lifestyle: 'Jupiter is one of those rare places where the lifestyle sells itself. The dog-friendly beach, the waterfront dining at Harbourside Place, the Saturday farmers markets, the golf cart nights in Abacoa — it\'s a community that draws people in and keeps them. Families move here for the schools and stay for the lifestyle. Second-home buyers come for a season and end up making it their primary residence. If you\'re looking for a place that feels like vacation but still feels like home, Jupiter is hard to beat.',
    localLoves: [
      'Dog-friendly Jupiter Beach and sunrise paddleboarding on the Intracoastal',
      'Weekend farmers markets and live music at Harbourside Place',
      'Golf cart living in Abacoa and Jupiter Farms',
      'Community events, art festivals, and waterfront dining year-round',
      'Golf, tennis, fishing, and coastal recreation at every level',
      'Bioluminescent kayaking on the Loxahatchee River in summer',
      'Painted Buntings at feeders in winter season',
      'Sandbar parties on weekends',
    ],
    schoolOverview: 'Jupiter is one of the top-ranking school zones in Florida, which consistently keeps demand high and resale values strong. Families move here specifically for the schools — and that tells you everything about the long-term strength of this market.',
    schoolList: [
      {
        category: 'Top Public Schools',
        schools: [
          { name: 'Jupiter Elementary School', url: 'https://je.palmbeachschools.org' },
          { name: 'Limestone Creek Elementary', url: 'https://lce.palmbeachschools.org' },
          { name: 'Jerry Thomas Elementary', url: 'https://jte.palmbeachschools.org' },
          { name: 'Independence Middle School', url: 'https://ims.palmbeachschools.org' },
          { name: 'Jupiter Middle School', url: 'https://jms.palmbeachschools.org' },
          { name: 'Jupiter High School — A-rated, medical & engineering academies', url: 'https://jhs.palmbeachschools.org' },
        ],
      },
      {
        category: 'Private & Charter',
        schools: [
          { name: 'The Benjamin School', url: 'https://www.thebenjaminschool.org' },
          { name: 'Jupiter Christian School', url: 'https://www.jupiterchristian.org' },
          { name: 'All Saints Catholic School', url: 'https://allsaintsjupiter.org' },
          { name: 'Franklin Academy', url: 'https://www.franklinacademy.net' },
        ],
      },
    ],
    hospitals: [
      { name: 'Jupiter Medical Center', url: 'https://www.jupitermed.com', note: 'Top-rated — ranked in top 10% nationally for quality & patient satisfaction' },
      { name: 'Palm Beach Gardens Medical Center', url: 'https://www.pbgmc.com', note: '15 minutes south via I-95' },
    ],
    commuteTimes: [
      { destination: 'West Palm Beach', time: '25 min' },
      { destination: 'PBI Airport', time: '30 min' },
      { destination: 'Brightline Station', time: '22 min' },
      { destination: 'Miami', time: '1 hr 20 min' },
      { destination: 'Orlando', time: '2 hr 15 min' },
    ],
    outdoorActivities: [
      'Jupiter Beach (dog-friendly)',
      'Carlin Park & DuBois Park',
      'John D. MacArthur State Park',
      'Jonathan Dickinson State Park',
      'Blowing Rocks Preserve',
      'Kayaking the Loxahatchee River',
      'Juno Beach Pier & Loggerhead MarineLife Center',
      'Abacoa Golf Club · Golf Club of Jupiter · Jupiter Dunes',
    ],
    dining: [
      'Guanabanas — tropical waterfront',
      'U-Tiki Beach — lighthouse views',
      'Square Grouper — waterfront bar & grill',
      'Little Moir\'s Food Shack — Jupiter institution',
      'Jetty\'s at the inlet',
      'Blue Pointe Bar & Grill — tiki vibes & poolside',
      'Harbourside Place — dining, live music & waterfront shops',
    ],
    hiddenGems: [
      'Sandbar parties on weekends off the inlet',
      'Paddle at sunrise from Coral Cove Park',
      'Painted Buntings at local feeders in winter',
      'Golf cart nights in Abacoa town center',
      'Bioluminescent kayaking on the Loxahatchee in summer',
    ],
    quickFacts: [
      { label: 'Market focus', value: 'Waterfront estates, gated golf communities, family neighborhoods, new construction' },
      { label: 'Key advantage', value: 'A-rated schools, coastal lifestyle, world-class private clubs, strong resale demand' },
      { label: 'Hospitals nearby', value: 'Jupiter Medical Center (top-rated), Palm Beach Gardens Medical Center' },
      { label: 'Shopping & dining', value: 'Harbourside Place, Riverwalk, Downtown at The Gardens, Legacy Place, Gardens Mall' },
    ],
    linkedNeighborhoods: ['abacoa', 'jupiter-country-club', 'admirals-cove', 'loxahatchee-club', 'jonathans-landing', 'trump-national-jupiter', 'bears-club', 'sonoma-isles', 'sonoma-bay', 'jupiter-island', 'sea-oats', 'river-road'],
    priceRanges: [
      { type: 'Condos & Townhomes', range: '$450K – $900K', minPrice: 450000, maxPrice: 900000 },
      { type: 'Gated Communities', range: '$700K – $1.5M', minPrice: 700000, maxPrice: 1500000 },
      { type: '55+ Communities', range: '$350K – $700K', minPrice: 350000, maxPrice: 700000 },
      { type: 'Golf & Country Club Homes', range: '$2M – $5M+', minPrice: 2000000 },
      { type: 'Waterfront Estates', range: '$3M – $20M+', minPrice: 3000000 },
    ],
    highlights: [
      'One of the top-ranked school zones in Florida — families move here just for the schools',
      'Home to Admiral\'s Cove, The Bear\'s Club, The Loxahatchee Club, and Jonathan\'s Landing — among Florida\'s most exclusive private clubs',
      'Harbourside Place and Riverwalk offer waterfront dining, shopping, and live music year-round',
      'Jupiter Beach and Carlin Park are dog-friendly and draw year-round outdoor lifestyle buyers',
      'Abacoa offers walkable town-center living — shops, restaurants, and Roger Dean Stadium steps away',
      'New construction between $700K–$1.5M is strong, with resort amenities and HOA perks common',
      '30 minutes to Palm Beach International Airport, 25 minutes to downtown West Palm Beach',
      'Jupiter Medical Center is one of the top-rated hospitals in Palm Beach County',
    ],
    popularNeighborhoods: ['Rialto', 'Abacoa', 'Egret Landing', 'Jonathan\'s Landing', 'Admiral\'s Cove', 'Jupiter Country Club', 'Sonoma Isles', 'Jupiter Inlet Colony', 'Jupiter Farms'],
    photos: [
      '/public/Jupiter/IMG_2429.JPG',
      '/public/Jupiter/IMG_2578.JPG',
      '/public/Jupiter/IMG_2579.JPG',
      '/public/Jupiter/IMG_2589.JPG',
      '/public/Jupiter/IMG_2622.JPG',
      '/public/Jupiter/IMG_2233.JPG',
    ],
    lat: 26.9342, lng: -80.0942,
  },
  {
    slug: 'wellington',
    name: 'Wellington',
    type: 'City',
    region: 'Western Palm Beach County',
    description: 'The equestrian capital of the world, with luxury gated communities, world-class show grounds, and top schools.',
    overview:
      'Wellington is globally recognized for its polo fields and equestrian culture, home to the Winter Equestrian Festival each season. But it\'s also a thriving residential community with excellent schools, planned neighborhoods, and a growing luxury market. DO Homes Group markets equestrian estates and family communities here with precision.',
    quickFacts: [
      { label: 'Market focus', value: 'Equestrian estates, golf communities, family neighborhoods' },
      { label: 'Key advantage', value: 'World-class equestrian infrastructure and top schools' },
    ],
    linkedNeighborhoods: ['seven-bridges', 'wellington-country-club', 'wellington-estates', 'lake-club'],
    priceRanges: [
      { type: 'Single-Family Homes', range: '$400K – $900K' },
      { type: 'Golf Community Homes', range: '$800K – $3M' },
      { type: 'Equestrian Estates', range: '$1M – $5M+' },
    ],
    highlights: [
      'Home of the Winter Equestrian Festival and Global Dressage Festival, drawing international buyers',
      'Seven Bridges, the Lake Club, and Wellington Country Club offer luxury gated living',
      'Outstanding A-rated public schools including Wellington High School',
      'Excellent value compared to coastal markets — more home for your money',
      'Close proximity to Lion Country Safari, shopping, and the Turnpike',
    ],
    photos: [
      '/public/Wellington/IMG_3619.JPEG',
      '/public/Wellington/IMG_3620.JPEG',
      '/public/Wellington/IMG_3621.JPEG',
      '/public/Wellington/IMG_3622.JPEG',
      '/public/Wellington/IMG_3623.JPEG',
      '/public/Wellington/IMG_3629.JPEG',
    ],
    lat: 26.6595, lng: -80.2686,
  },
  {
    slug: 'boca-raton',
    name: 'Boca Raton',
    type: 'City',
    region: 'Southern Palm Beach County',
    description: 'A polished coastal city with luxury golf clubs, white-sand beaches, and some of Florida\'s most prestigious residential addresses.',
    overview:
      'Boca Raton is synonymous with refined living. From oceanfront condos on the A1A to grand estates inside Boca West and Royal Palm Yacht & Country Club, the market here is consistently strong. Our agents know Boca\'s luxury segment inside and out and will position your home — or your search — for maximum results.',
    quickFacts: [
      { label: 'Market focus', value: 'Luxury waterfront residences and exclusive golf communities' },
      { label: 'Key advantage', value: 'Prestige brand value and consistent buyer demand' },
    ],
    linkedNeighborhoods: ['broken-sound', 'boca-west', 'royal-palm-yacht-cc', 'woodfield-country-club', 'delaire-country-club'],
    priceRanges: [
      { type: 'Condos & Townhomes', range: '$300K – $800K' },
      { type: 'Single-Family Homes', range: '$600K – $2M' },
      { type: 'Country Club & Golf Estates', range: '$1.5M – $10M+' },
      { type: 'Oceanfront Condos', range: '$1M – $5M+' },
    ],
    highlights: [
      'Red Reef Beach, South Inlet Park, and Mizner Park deliver a high-end coastal lifestyle',
      'Boca West is a nationally acclaimed golf community with four championship courses',
      'Broken Sound and Royal Palm Yacht & CC among the most prestigious addresses in South Florida',
      'FAU, top private schools, and elite prep academies serve the community',
      'Easy access to I-95, Tri-Rail, and Fort Lauderdale and PBI airports',
    ],
  },
  {
    slug: 'delray-beach',
    name: 'Delray Beach',
    type: 'City',
    region: 'Southern Palm Beach County',
    description: 'A lively beach town known for Atlantic Avenue\'s vibrant dining scene, arts culture, and a coastal real estate market with year-round demand.',
    overview:
      'Delray Beach has been named "Most Fun Small City in America" — and its real estate market reflects that popularity. Atlantic Avenue runs through the heart of the city offering boutiques, galleries, and acclaimed restaurants. Buyers choose Delray for the energy of the downtown corridor, the quality of the beach, and the diversity of home styles.',
    quickFacts: [
      { label: 'Market focus', value: 'Beach cottages, downtown condos, coastal single-family homes' },
      { label: 'Key advantage', value: 'Strong tourism demand and year-round buyer interest' },
    ],
    linkedNeighborhoods: ['ocean-side', 'delray-beach-harbor', 'seagate', 'shelborne'],
    priceRanges: [
      { type: 'Condos & Townhomes', range: '$300K – $700K' },
      { type: 'Beach Cottages & Homes', range: '$500K – $1.5M' },
      { type: 'Waterfront Estates', range: '$1.5M – $5M+' },
    ],
    highlights: [
      'Atlantic Avenue is one of Florida\'s premier restaurant and entertainment corridors',
      'Two miles of white-sand beach with public parking and beachfront dining',
      'Strong seasonal rental market — Delray attracts snowbirds and corporate travelers',
      'Old School Square, arts and cultural districts add unique lifestyle appeal',
      'Convenient to I-95 and the Brightline South Florida rail network',
    ],
  },
  {
    slug: 'boynton-beach',
    name: 'Boynton Beach',
    type: 'City',
    region: 'Southern Palm Beach County',
    description: 'A growing coastal city with waterfront access, new construction, and excellent value relative to its northern neighbors.',
    overview:
      'Boynton Beach is one of the most active markets in Southern Palm Beach County. New mixed-use developments, marina access, and affordable waterfront options attract buyers who want coastal living without the Boca price tag. Our local expertise ensures sellers get targeted marketing and buyers get the best value.',
    quickFacts: [
      { label: 'Market focus', value: 'Waterfront condos, townhomes, and infill neighborhoods' },
      { label: 'Key advantage', value: 'Improving resale values and strong redevelopment momentum' },
    ],
    linkedNeighborhoods: ['hammock-park', 'water-crest', 'boynton-beach-gardens', 'ocean-ridge'],
    priceRanges: [
      { type: 'Condos & Villas', range: '$200K – $500K' },
      { type: 'Single-Family Homes', range: '$350K – $800K' },
      { type: 'Waterfront & Luxury Homes', range: '$800K – $2.5M' },
    ],
    highlights: [
      'Boynton Beach Inlet and the marina district offer direct boating access to the Atlantic',
      'Town Square redevelopment is transforming the downtown core with new dining and retail',
      'Strong value compared to Boca and Delray — ideal for first-time luxury buyers',
      'Convenient access to I-95, Tri-Rail, and South Florida airports',
      'Active 55+ community market with numerous resort-style developments',
    ],
  },
  {
    slug: 'lake-worth-beach',
    name: 'Lake Worth Beach',
    type: 'City',
    region: 'Southern Palm Beach County',
    description: 'An artsy coastal community with retro charm, a lively downtown, and beachfront access at a fraction of the neighboring city prices.',
    overview:
      'Lake Worth Beach has a personality all its own. Its eclectic downtown, vintage bungalows, and beach access make it a favorite with buyers seeking character and value. The real estate market here rewards those who know it well — and our team does.',
    quickFacts: [
      { label: 'Market focus', value: 'Historic cottages, bungalow-style homes, downtown condos' },
      { label: 'Key advantage', value: 'Distinctive neighborhood character and undervalued market' },
    ],
    linkedNeighborhoods: ['lake-worth-estates', 'poinciana-park', 'lake-worth-gardens'],
    priceRanges: [
      { type: 'Historic Bungalows & Cottages', range: '$350K – $700K' },
      { type: 'Condos', range: '$200K – $500K' },
      { type: 'Luxury Homes', range: '$700K – $2M+' },
    ],
    highlights: [
      'Lake Worth Beach has one of the few true free public beaches in Palm Beach County',
      'Downtown Lake Worth is known for art galleries, independent restaurants, and street festivals',
      'Strong investment appeal — values rising as buyers discover this underrated market',
      'Lake Worth Lagoon provides kayaking, paddleboarding, and waterfront dining',
      'Minutes from downtown West Palm Beach and Palm Beach island',
    ],
  },
  {
    slug: 'royal-palm-beach',
    name: 'Royal Palm Beach',
    type: 'City',
    region: 'Western Palm Beach County',
    description: 'A family-friendly planned community with award-winning parks, excellent schools, and well-priced homes in a tight-knit neighborhood setting.',
    overview:
      'Royal Palm Beach is a master-planned community that\'s grown into one of the county\'s most popular family destinations. Great parks, excellent schools, and a genuine sense of community set it apart. Our team helps families find the right neighborhood within this well-established market.',
    quickFacts: [
      { label: 'Market focus', value: 'Family homes, planned communities, and gated neighborhoods' },
      { label: 'Key advantage', value: 'Strong schools, parks, and community-oriented lifestyle' },
    ],
    linkedNeighborhoods: ['pomelo-park', 'seneca-lakes', 'oakbrook', 'lake-clarence'],
    priceRanges: [
      { type: 'Single-Family Homes', range: '$400K – $700K' },
      { type: 'Newer Construction', range: '$450K – $900K' },
      { type: 'Larger Lots & Estates', range: '$800K – $1.5M' },
    ],
    highlights: [
      'Acreage communities and Royal Palm Beach Commons Park offer outdoor recreation and open space',
      'A-rated schools and highly regarded Palm Beach County school system',
      'Quick access to Wellington equestrian events and Lion Country Safari',
      'Strong value — larger homes for the price compared to coastal markets',
      'Close to Turnpike and major western county shopping corridors',
    ],
  },
  {
    slug: 'palm-beach',
    name: 'Palm Beach',
    type: 'City',
    region: 'Barrier Island',
    description: 'Iconic beachfront luxury and historic estates on one of America\'s most exclusive barrier islands.',
    overview:
      'Palm Beach is in a category of its own. This barrier island is home to some of the most prestigious addresses in the United States, with oceanfront estates, historic Worth Avenue, and a timeless luxury lifestyle. DO Homes Group provides white-glove service for buyers and sellers in this exceptional market.',
    quickFacts: [
      { label: 'Market focus', value: 'Coastal estates, ocean-to-lake properties, ultra-luxury condos' },
      { label: 'Key advantage', value: 'White-glove marketing and access to off-market properties' },
    ],
    linkedNeighborhoods: ['manalapan'],
    priceRanges: [
      { type: 'Condos', range: '$800K – $5M+' },
      { type: 'Single-Family Homes', range: '$3M – $20M+' },
      { type: 'Estate Properties', range: '$10M – $75M+' },
    ],
    highlights: [
      'Worth Avenue is one of the world\'s premier luxury shopping and dining destinations',
      'Direct ocean-to-Intracoastal lot configurations unique to the barrier island',
      'The Breakers, Bath & Tennis Club, and Everglades Club anchor private social life',
      'Highest concentration of historic landmark homes in the county',
      'Just minutes from Palm Beach International Airport via the Southern Bridge',
    ],
  },
  {
    slug: 'loxahatchee',
    name: 'Loxahatchee',
    type: 'City',
    region: 'Western Palm Beach County',
    description: 'A rural equestrian community with wide-open acreage, horse properties, and a country lifestyle close enough to Palm Beach County conveniences.',
    overview:
      'Loxahatchee offers a rural Florida lifestyle that\'s increasingly rare. With multi-acre parcels, horse-friendly zoning, and a tight-knit community feel, it attracts buyers who want space, privacy, and the ability to keep animals. Our team specializes in acreage properties and rural market transactions.',
    quickFacts: [
      { label: 'Market focus', value: 'Equestrian tracts, ranch-style homes, acreage properties' },
      { label: 'Key advantage', value: 'Rural lifestyle with proximity to Wellington show grounds' },
    ],
    linkedNeighborhoods: [],
    priceRanges: [
      { type: 'Acreage Lots (1–5 acres)', range: '$400K – $900K' },
      { type: 'Equestrian Estates', range: '$800K – $2.5M' },
      { type: 'Custom Ranch Homes', range: '$600K – $1.5M' },
    ],
    highlights: [
      'No HOA in most areas — build your barn, bring your horses, and live on your terms',
      'Minutes from Wellington\'s Palm Beach International Equestrian Center',
      'Low density zoning preserves the open, rural character buyers come here for',
      'Growing area with increasing home values as western county development expands',
      'Access to the Loxahatchee National Wildlife Refuge and Everglades headwaters',
    ],
  },
  {
    slug: 'juno-beach',
    name: 'Juno Beach',
    type: 'City',
    region: 'Northern Palm Beach County',
    description: 'A pristine coastal town with uncrowded beaches, sea turtle nesting grounds, and a quiet barrier-island lifestyle between Jupiter and Singer Island.',
    overview:
      'Juno Beach is a small, incorporated town on a barrier island in northern Palm Beach County — known for the Loggerhead Marinelife Center and some of the most beautiful, uncrowded Atlantic beaches in the region. Sandwiched between Jupiter to the north and Singer Island to the south, it offers a peaceful coastal lifestyle with easy access to everything Palm Beach County has to offer.',
    quickFacts: [
      { label: 'Market focus', value: 'Ocean-view condos, single-family homes, beachfront estates' },
      { label: 'Key advantage', value: 'Pristine natural beaches and quiet, low-density community' },
    ],
    priceRanges: [
      { type: 'Condos & Townhomes', range: '$400K – $900K' },
      { type: 'Single-Family Homes', range: '$700K – $2M' },
      { type: 'Oceanfront Estates', range: '$2M – $8M+' },
    ],
    highlights: [
      'Home to the Loggerhead Marinelife Center, one of the world\'s leading sea turtle hospitals',
      'Some of Palm Beach County\'s most pristine and uncrowded Atlantic beaches',
      'Close proximity to Jupiter, Palm Beach Gardens, and PBI Airport',
      'Small-town community feel with local dining and low-density residential character',
      'Easy access to the Intracoastal Waterway and full South Florida boating lifestyle',
    ],
    photos: [
      '/public/Juno Beach/IMG_1414.JPG',
      '/public/Juno Beach/IMG_1415.JPG',
    ],
  },
  {
    slug: 'north-palm-beach',
    name: 'North Palm Beach',
    type: 'City',
    region: 'Palm Beach County',
    description: 'An upscale waterfront village with a private marina, golf, and a relaxed coastal lifestyle between Jupiter and West Palm Beach.',
    overview:
      'North Palm Beach is a premier village community situated between Palm Beach Gardens and Riviera Beach, prized for its private marina, Intracoastal waterfront dining, and the North Palm Beach Country Club. Old Florida charm meets luxury waterfront living here — and the real estate market reflects it.',
    quickFacts: [
      { label: 'Market focus', value: 'Waterfront homes, marina communities, single-family residences' },
      { label: 'Key advantage', value: 'Private marina village with Intracoastal access and golf' },
    ],
    priceRanges: [
      { type: 'Single-Family Homes', range: '$500K – $1.5M' },
      { type: 'Waterfront Homes', range: '$1M – $5M+' },
      { type: 'Condos', range: '$350K – $800K' },
    ],
    highlights: [
      'North Palm Beach Country Club offers golf, tennis, and a resort-style pool',
      'Village Marina provides direct Intracoastal and Atlantic ocean access for boaters',
      'Walkable to waterfront dining — one of Palm Beach County\'s most charming village cores',
      'Premium location between Jupiter and West Palm — minutes from I-95 and PBI',
      'Small village governance means responsive services and a true neighborhood feel',
    ],
    photos: [
      '/public/North Palm/211.JPG',
      '/public/North Palm/123.JPG',
      '/public/North Palm/170.JPG',
      '/public/North Palm/171.JPG',
      '/public/North Palm/172.JPG',
    ],
  },
  {
    slug: 'tequesta',
    name: 'Tequesta',
    type: 'City',
    region: 'Northern Palm Beach County',
    description: 'A small coastal village where the Loxahatchee River meets the Intracoastal — peaceful waterfront living with Jupiter as your backyard.',
    overview:
      'Tequesta is one of Palm Beach County\'s best-kept secrets. This small, incorporated village sits at the northern tip of the county with marina access, riverfront homes, and a quiet residential character. Buyers who discover it rarely look elsewhere.',
    quickFacts: [
      { label: 'Market focus', value: 'Riverfront homes, canal properties, luxury single-family residences' },
      { label: 'Key advantage', value: 'Quiet village atmosphere with direct water access' },
    ],
    linkedNeighborhoods: ['powder-pointe'],
    priceRanges: [
      { type: 'Single-Family Homes', range: '$600K – $1.5M' },
      { type: 'Waterfront & Canal Homes', range: '$1M – $4M+' },
    ],
    highlights: [
      'Loxahatchee River access for kayaking, paddleboarding, and manatee watching',
      'The Intracoastal Waterway runs along the eastern edge with direct Atlantic inlet access',
      'Village character means low density, no high-rises, and a true neighborhood feel',
      'A-rated Jupiter schools serve Tequesta students',
      'Harborside Place dining and downtown Jupiter just minutes away',
    ],
  },
]

export const neighborhoods: CommunityItem[] = [
  // ── JUPITER ──────────────────────────────────────────────────
  {
    slug: 'abacoa',
    name: 'Abacoa',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A walkable New Urbanism master-planned community in Jupiter with charming streetscapes, top schools, golf, and a genuine hometown feel.',
    overview:
      'Abacoa is one of Jupiter\'s most beloved master-planned communities — known for its charming streetscapes, tree-lined sidewalks, golf, baseball, top schools, and a genuine "neighbors know neighbors" vibe. Built with New Urbanist design in mind, Abacoa blends residential living with walkable town centers, parks, and everyday convenience.\n\nUnlike many South Florida communities built around gates and isolated subdivisions, Abacoa was intentionally designed to feel like a real town — and it shows. Developed in the late 1990s and early 2000s as one of Palm Beach County\'s first large-scale New Urbanist communities, Abacoa has matured beautifully — with established landscaping, thriving commercial areas, and long-term homeowner pride. What was once "new" is now one of Jupiter\'s most proven and stable residential communities.',
    lifestyle: 'Abacoa feels active, social, and genuinely connected — without feeling crowded. The community draws families with school-age children, young professionals, golf enthusiasts, second-home buyers, and long-term Jupiter residents who want front-porch neighborhoods, community pools, and a downtown they can actually walk to. Roger Dean Chevrolet Stadium brings concerts, spring training games, and community events right to the neighborhood. It\'s rare to find this level of built-in activity in a residential community.',
    localLoves: [
      'Walkable town centers with restaurants, cafés, and local shops',
      'Roger Dean Chevrolet Stadium — MLB spring training and year-round events',
      'Front-porch neighborhoods and genuine "neighbors know neighbors" culture',
      'Community pools and neighborhood parks throughout',
      'Miles of sidewalks, bike paths, and lakes',
      'Quick access to Jupiter Beach, I-95, and downtown Jupiter',
      'Abacoa Golf Club — public course, recently redesigned',
    ],
    subNeighborhoods: [
      { name: 'Mallory Creek', description: 'Key West–style homes with metal roofs and wide sidewalks. One of the most charming and family-oriented sections of Abacoa.' },
      { name: 'Newhaven', description: 'Larger single-family homes with highly sought-after school zoning.' },
      { name: 'Osceola Woods', description: 'Townhomes and single-family homes in a quiet, park-adjacent setting.' },
      { name: 'Antigua', description: 'Single-family homes with lake views and mature landscaping.' },
      { name: 'Canterbury Place', description: 'Townhomes and condos near Abacoa Golf Club. An affordable entry point into the community.' },
      { name: 'Windsor Park', description: 'Single-family homes and townhomes with mature trees and a well-established neighborhood feel.' },
      { name: 'Valencia', description: 'Mediterranean-style condos and townhomes located near the heart of Abacoa.' },
      { name: 'Martinique', description: 'Modern townhomes offering a low-maintenance lifestyle near Abacoa Town Center.' },
      { name: 'Dakota / Tuscany', description: 'Smaller enclaves featuring a mix of townhomes and detached homes.' },
      { name: 'Charleston Court', description: 'A small townhome enclave offering a quiet setting with convenient access throughout Abacoa.' },
    ],
    priceRanges: [
      { type: 'Condos & Townhomes', range: '$400K – $600K', minPrice: 400000, maxPrice: 600000 },
      { type: 'Single-Family Homes', range: '$600K – $1.2M+', minPrice: 600000, maxPrice: 1200000 },
      { type: 'Golf Course Properties', range: '$900K – $1.4M+', minPrice: 900000 },
    ],
    highlights: [
      'New Urbanist design — walkable streetscapes, front porches, and town centers built from the ground up',
      'Roger Dean Chevrolet Stadium brings MLB spring training and live events to the neighborhood',
      'Abacoa Golf Club offers a public, recently redesigned course steps from residential streets',
      'Homes historically hold value well due to location, school zoning, and community design',
      'Diverse home types from condos under $400K to golf-front estates over $1.4M',
      'Beacon Cove, Eisenhower Middle, and William T. Dwyer High serve the community',
      '10 minutes to Jupiter Beach, 5 minutes to I-95, 25–30 minutes to PBI Airport',
    ],
    schoolOverview: 'Abacoa is highly regarded for both public and private school access. The community is zoned for its own dedicated school pipeline — different from the Jupiter High zone.',
    schoolList: [
      {
        category: 'Public Schools',
        schools: [
          { name: 'Beacon Cove Intermediate', url: 'https://bci.palmbeachschools.org' },
          { name: 'Dwight D. Eisenhower Middle School', url: 'https://ems.palmbeachschools.org' },
          { name: 'William T. Dwyer High School', url: 'https://dhs.palmbeachschools.org' },
        ],
      },
      {
        category: 'Nearby Private Schools',
        schools: [
          { name: 'Jupiter Christian School', url: 'https://www.jupiterchristian.org' },
          { name: 'St. Francis Catholic School', url: 'https://www.stfrancisfl.org' },
          { name: 'The Benjamin School', url: 'https://www.thebenjaminschool.org' },
        ],
      },
    ],
    commuteTimes: [
      { destination: 'Jupiter Beach', time: '10–12 min' },
      { destination: 'I-95', time: '5 min' },
      { destination: 'Florida Turnpike', time: '10 min' },
      { destination: 'Downtown Jupiter', time: '8–10 min' },
      { destination: 'The Gardens Mall', time: '15 min' },
      { destination: 'PBI Airport', time: '25–30 min' },
    ],
    outdoorActivities: [
      'Abacoa Golf Club (public, recently redesigned)',
      'Multiple neighborhood parks and playgrounds',
      'Miles of walking and biking paths',
      'Jupiter & Juno beaches — 10–12 minutes away',
      'Riverbend Park and Loxahatchee River access nearby',
    ],
    quickFacts: [
      { label: 'Home styles', value: 'Single-family homes, townhomes, condos — New Urbanist design' },
      { label: 'Community type', value: 'PUD (Planned Unit Development) within the City of Jupiter' },
      { label: 'Best for', value: 'Families, young professionals, golf enthusiasts, walkability buyers' },
      { label: 'Key draw', value: 'True walkable town center with Roger Dean Stadium, shops, and restaurants' },
    ],
  },
  {
    slug: 'jupiter-country-club',
    name: 'Jupiter Country Club',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A guard-gated golf community with a Greg Norman–designed championship course, Mediterranean architecture, and a true country club lifestyle without feeling overly formal.',
    overview:
      'Jupiter Country Club is a gated golf and country club community in Jupiter featuring a Greg Norman–designed 18-hole championship course with strategic layouts and water features throughout. The community is known for its consistent Mediterranean and Tuscan-inspired architecture, manicured palm-lined streets, and a balanced atmosphere — a true country club feel without being overly formal or restrictive. Home styles range from lower-maintenance residences to larger single-family homes, with golf course, lake, and preserve view options available. It appeals equally to full-time residents and seasonal buyers seeking a refined Jupiter lifestyle.',
    quickFacts: [
      { label: 'Homes', value: 'Villas, townhomes, and single-family homes' },
      { label: 'Amenities', value: 'Greg Norman golf, resort pools, tennis, fitness, clubhouse dining' },
    ],
    highlights: [
      'Greg Norman–designed 18-hole championship course with water features and strategic variety',
      'Mediterranean and Tuscan-inspired architecture maintained consistently throughout',
      'Guard-gated with manicured landscaping and palm-lined streets',
      'Clubhouse, resort-style pools, tennis, and fitness center',
      'Approachable country club atmosphere — elegant but not overly formal',
    ],
  },
  {
    slug: 'sonoma-isles',
    name: 'Sonoma Isles',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A newer gated community with lakefront homes, resort-style amenities, and a family-friendly atmosphere.',
    overview:
      'Sonoma Isles is one of Jupiter\'s newest and most popular communities, featuring beautifully designed single-family homes on lakefront lots with a spectacular resort-style amenity center.',
    quickFacts: [
      { label: 'Homes', value: 'Lakefront single-family homes' },
      { label: 'Amenities', value: 'Resort pool, fitness center, tennis, dog park' },
    ],
    photos: [
      '/public/Sonoma Bay/IMG_5896.jpeg',
      '/public/Sonoma Bay/IMG_5897.jpeg',
      '/public/Sonoma Bay/IMG_5898.jpeg',
      '/public/Sonoma Bay/IMG_5899.jpeg',
      '/public/Sonoma Bay/IMG_5900.jpeg',
      '/public/Sonoma Bay/pool.jpg',
    ],
  },
  {
    slug: 'jupiter-island',
    name: 'Jupiter Island',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'An ultra-exclusive barrier island community with oceanfront estates and exceptional privacy.',
    overview:
      'Jupiter Island is one of the most exclusive coastal addresses in Palm Beach County, ideal for luxury buyers seeking oceanfront living with the highest level of privacy.',
    quickFacts: [
      { label: 'Homes', value: 'Oceanfront estate homes' },
      { label: 'Amenities', value: 'Private beaches, luxury privacy' },
    ],
  },
  {
    slug: 'sea-oats',
    name: 'Sea Oats',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A gated community with canal-front homes, private docks, and waterfront amenities.',
    overview:
      'Sea Oats offers gated waterfront living in Jupiter with private docks and direct boat access to the Intracoastal.',
    quickFacts: [
      { label: 'Homes', value: 'Canal-front estates and homes' },
      { label: 'Amenities', value: 'Private docks, gated security' },
    ],
  },
  {
    slug: 'river-road',
    name: 'River Road',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A canal-side neighborhood with boat access and a relaxed, close-knit community appeal.',
    overview:
      'River Road is ideal for buyers wanting waterway living with a relaxed Jupiter lifestyle and direct access to the Loxahatchee River.',
    quickFacts: [
      { label: 'Homes', value: 'Canal waterfront homes' },
      { label: 'Amenities', value: 'Boat docks, quiet streets' },
    ],
  },

  // ── PALM BEACH GARDENS ───────────────────────────────────────
  {
    slug: 'pga-national',
    name: 'PGA National',
    type: 'Neighborhood',
    region: 'Palm Beach Gardens',
    description: 'One of Palm Beach Gardens\' most established and recognizable golf communities — dozens of individual neighborhoods within a gated master-planned setting anchored by PGA National Resort & Spa.',
    overview:
      'PGA National is one of the most established and recognizable golf communities in Palm Beach Gardens, offering a wide range of homes within a gated, master-planned setting. Unlike newer planned communities, PGA National is made up of dozens of individual neighborhoods, each with its own character, architecture, and price point — from custom estate homes on championship golf course lots to condos and townhomes built for seasonal and lock-and-leave buyers.\n\nThe centerpiece is PGA National Resort & Spa, which recently completed a full renovation including redesigned public spaces, The Butcher\'s Club steakhouse, and updated spa and wellness facilities. Resort and club memberships are optional for homeowners, giving buyers flexibility on how much of the lifestyle they want to participate in.',
    lifestyle: 'PGA National attracts both year-round residents and seasonal buyers who want the prestige of a championship golf address without the formality of some of Palm Beach Gardens\' more exclusive private clubs. The community has a mature, established feel — beautifully landscaped streets, consistent architecture, and a resident base that includes retirees, professionals, and second-home owners who return season after season.',
    subNeighborhoods: [
      { name: 'Eagleton', description: 'Custom estate homes with a strong luxury presence. One of the most sought-after single-family enclaves within PGA National.' },
      { name: 'Preston', description: 'Wide streets, mature landscaping, and golf course views. A consistently popular neighborhood for buyers wanting single-family living.' },
      { name: 'Marlwood Estates', description: 'Larger homes with established character and a quiet, residential feel within the community.' },
      { name: 'Monterey Pointe', description: 'Upscale single-family homes with strong curb appeal and proximity to community amenities.' },
      { name: 'Cypress Island', description: 'Smaller exclusive enclave with limited inventory and a more private setting.' },
      { name: 'Burwick', description: 'Custom homes on larger lots with consistently limited turnover — a strong long-term hold in the community.' },
      { name: 'Windermere', description: 'Larger condos with golf views and renovation potential. Popular with seasonal residents and second-home buyers.' },
      { name: 'Lexington Green', description: 'Popular townhome community with consistent resale demand. Ideal for lock-and-leave seasonal buyers and retirees.' },
    ],
    priceRanges: [
      { type: 'Condos & Townhomes', range: '$350K – $700K', minPrice: 350000, maxPrice: 700000 },
      { type: 'Single-Family Homes', range: '$700K – $2M', minPrice: 700000, maxPrice: 2000000 },
      { type: 'Custom Golf Course Estates', range: '$2M – $5M+', minPrice: 2000000 },
    ],
    highlights: [
      'PGA National Resort & Spa recently fully renovated — The Butcher\'s Club, redesigned spa, updated resort facilities',
      'Five championship golf courses including the legendary Champion Course host of The Honda Classic',
      'Dozens of distinct neighborhoods within one gated community — something for every buyer profile',
      'Optional resort and club memberships — flexibility to participate in as much or as little of the lifestyle as you want',
      'Minutes to PGA Boulevard dining, I-95, and Palm Beach International Airport',
      'Strong year-round and seasonal rental demand from golf buyers and snowbirds',
    ],
    quickFacts: [
      { label: 'Community type', value: 'Gated master-planned community within Palm Beach Gardens' },
      { label: 'Best for', value: 'Golf buyers, seasonal residents, retirees, lock-and-leave buyers, second-home owners' },
      { label: 'Club membership', value: 'Optional — resort and golf memberships available but not required for residents' },
      { label: 'Anchor amenity', value: 'PGA National Resort & Spa — recently fully renovated' },
    ],
    commuteTimes: [
      { destination: 'PGA Blvd / Downtown Gardens', time: '< 10 min' },
      { destination: 'Florida Turnpike', time: '5 min' },
      { destination: 'I-95', time: '5–10 min' },
      { destination: 'PBI Airport', time: '20–25 min' },
      { destination: 'Juno Beach', time: '15 min' },
      { destination: 'Jupiter', time: '20 min' },
    ],
    photos: [
      '/public/Palm Beach Gardens/PGA National/IMG_1908.JPG',
      '/public/Palm Beach Gardens/PGA National/IMG_1775.jpg',
      '/public/Palm Beach Gardens/PGA National/IMG_1777.jpg',
      '/public/Palm Beach Gardens/PGA National/IMG_1778.jpg',
      '/public/Palm Beach Gardens/PGA National/IMG_1780.jpg',
      '/public/Palm Beach Gardens/PGA National/IMG_1783.jpg',
    ],
    lat: 26.8371, lng: -80.1582,
  },
  {
    slug: 'ballen-isles',
    name: 'BallenIsles',
    type: 'Neighborhood',
    region: 'Palm Beach Gardens',
    description: 'A premier private golf and country club community with three championship courses, luxury estates, and an active social scene.',
    overview:
      'BallenIsles is a flagship gated community in Palm Beach Gardens featuring three championship golf courses, fine dining, a state-of-the-art sports complex, and estate homes on expansive lots. It\'s one of the most sought-after addresses in Northern Palm Beach County.',
    quickFacts: [
      { label: 'Homes', value: 'Estate homes and custom residences' },
      { label: 'Amenities', value: 'Three golf courses, tennis, spa, dining' },
    ],
  },
  {
    slug: 'avenir',
    name: 'Avenir',
    type: 'Neighborhood',
    region: 'Palm Beach Gardens',
    description: 'Palm Beach Gardens\' largest master-planned community — a luxury growth corridor spanning thousands of acres with multiple builder villages, resort amenities, and long-term upside.',
    overview:
      'Avenir is one of the largest and most significant luxury master-planned communities in Palm Beach Gardens. Spanning thousands of acres, Avenir was designed as a long-term lifestyle destination — combining estate-level homes, multiple residential villages, resort-style amenities, preserved natural space, and rapidly expanding retail and commercial development.\n\nThis is not a single neighborhood — it\'s an entire luxury growth corridor. Buyers entering now are still positioning ahead of full build-out, something that\'s no longer possible in most established Palm Beach Gardens communities. As retail fills in, infrastructure completes, and neighborhoods mature, Avenir is on track to become one of the county\'s most complete live-work-play destinations.',
    lifestyle: 'Avenir was built for buyers who want modern construction without compromise. Higher ceilings, open layouts, energy-efficient design, and larger lots than anything available in older Palm Beach Gardens communities. A second resort-style clubhouse is now complete, adding to an amenity package that includes resort pools, fitness centers, tennis, pickleball, and miles of walking paths. Wide roads and golf-cart-friendly design throughout. Major retail and dining is actively developing along the corridor — the community is still evolving, and that\'s precisely the opportunity.',
    localLoves: [
      'Resort-style amenity centers with pools, fitness, tennis, and pickleball',
      'Miles of walking paths, lakes, and preserved natural green space',
      'Modern new construction — open layouts, high ceilings, energy efficiency',
      'Larger lots than older Palm Beach Gardens communities at comparable prices',
      'Regency at Avenir — premier gated 55+ active adult community by Toll Brothers',
      'Golf-cart-friendly design throughout the community',
      'Panther National — ultra-luxury golf experience within Avenir',
    ],
    subNeighborhoods: [
      { name: 'Apex at Avenir', description: 'Luxury single-family homes with elevated finishes and private community amenities. One of the flagship estate neighborhoods within Avenir.' },
      { name: 'L\'Ambiance at Avenir', description: 'Estate-style homes by Kolter Homes with upscale architecture and refined finishes on larger homesites.' },
      { name: 'Panther National', description: 'Ultra-luxury golf community with a championship course and resort-caliber lifestyle. One of the most exclusive new addresses in Palm Beach County.' },
      { name: 'Avondale at Avenir', description: 'DiVosta-built homes with modern open layouts. A popular choice for families seeking value in new construction.' },
      { name: 'Solana Bay at Avenir', description: 'Contemporary single-family homes by Akel Homes with scenic water and preserve views.' },
      { name: 'Coral Isles at Avenir', description: 'Lakefront and preserve-view residences with natural surroundings and resort community access.' },
      { name: 'La Terre at Avenir', description: 'Boutique luxury neighborhood with refined finishes and a low-density feel within the larger Avenir community.' },
      { name: 'Watermark at Avenir', description: 'Scenic homes with water and green space views throughout the neighborhood.' },
      { name: 'Windgate at Avenir', description: 'Family-friendly new construction community with modern home designs and full resort amenity access.' },
      { name: 'Regency at Avenir', description: 'Gated 55+ luxury active adult community by Toll Brothers with a private clubhouse, resort pool, and full lifestyle programming.' },
    ],
    priceRanges: [
      { type: 'Single-Family Homes', range: '$700K – $1.3M', minPrice: 700000, maxPrice: 1300000 },
      { type: 'Estate & Luxury Homes', range: '$1.3M – $3M+', minPrice: 1300000 },
      { type: 'Panther National (Ultra-Luxury)', range: '$3M – $12M+', minPrice: 3000000 },
      { type: 'Regency at Avenir (55+)', range: '$700K – $1.2M', minPrice: 700000, maxPrice: 1200000 },
    ],
    highlights: [
      'One of the largest master-planned communities in Palm Beach County — still in active growth phase',
      'Multiple builder villages offer a range of styles from family new construction to ultra-luxury estates',
      'Panther National delivers a championship golf lifestyle within the community',
      'Regency at Avenir is Toll Brothers\' premier 55+ active adult offering in the county',
      'Second resort-style clubhouse now complete — tennis, pickleball, pools, fitness',
      'Modern construction with higher ceilings, open layouts, and energy efficiency throughout',
      'Rapidly expanding retail, dining, and services along the Avenir corridor',
      'Buyers entering now are still ahead of full build-out and peak appreciation',
    ],
    quickFacts: [
      { label: 'Community type', value: 'PUD (Planned Unit Development) within Palm Beach Gardens' },
      { label: 'Best for', value: 'Luxury new construction buyers, families, 55+ active adults, investors in growth markets' },
      { label: 'Builders', value: 'Kolter, DiVosta, Akel Homes, Toll Brothers, and others' },
      { label: 'Market outlook', value: 'Active growth phase — retail and infrastructure still expanding; pre-buildout opportunity' },
    ],
    commuteTimes: [
      { destination: 'PGA Boulevard (Gardens)', time: '10 min' },
      { destination: 'I-95', time: '15 min' },
      { destination: 'Florida Turnpike', time: '10 min' },
      { destination: 'PBI Airport', time: '25 min' },
      { destination: 'Jupiter Beach', time: '25 min' },
      { destination: 'The Gardens Mall', time: '15 min' },
    ],
    lat: 26.8553, lng: -80.2248,
  },
  {
    slug: 'mirasol',
    name: 'Mirasol',
    type: 'Neighborhood',
    region: 'Palm Beach Gardens',
    description: 'An ultra-exclusive gated golf community with custom estate homes surrounding two championship courses.',
    overview:
      'Mirasol is one of the most prestigious gated communities in Palm Beach Gardens, featuring two Arthur Hills-designed championship golf courses and custom estates. It\'s a members-only private club community offering the pinnacle of Palm Beach County luxury living.',
    quickFacts: [
      { label: 'Homes', value: 'Custom luxury estates' },
      { label: 'Amenities', value: 'Two championship golf courses, private club, tennis, spa' },
    ],
    photos: [
      '/public/Mirasol/246F3DF6-B95D-4998-8FAB-BFD58A8C4740.jpg',
      '/public/Mirasol/IMG_0514.JPEG',
      '/public/Mirasol/IMG_0547.JPEG',
      '/public/Mirasol/IMG_0548.JPEG',
      '/public/Mirasol/IMG_0549.JPEG',
      '/public/Mirasol/IMG_0550.JPEG',
    ],
  },
  {
    slug: 'alton',
    name: 'Alton',
    type: 'Neighborhood',
    region: 'Palm Beach Gardens',
    description: 'A contemporary urban village with single-family homes, townhomes, and walkable neighborhood design.',
    overview:
      'Alton is a vibrant new urbanist community in Palm Beach Gardens, featuring modern architecture, walkable streets, and a community green at its heart. It\'s a great choice for buyers who want new construction with a walkable, connected lifestyle.',
    quickFacts: [
      { label: 'Homes', value: 'Single-family homes and townhomes' },
      { label: 'Amenities', value: 'Community center, pool, trails, walkable retail nearby' },
    ],
  },
  {
    slug: 'east-palm-bay',
    name: 'East Palm Bay',
    type: 'Neighborhood',
    region: 'Palm Beach Gardens',
    description: 'An established residential community with mature landscaping, quality schools, and easy access to PGA Boulevard.',
    overview:
      'East Palm Bay is a sought-after neighborhood for families looking for roomy homes, community parks, and a convenient Palm Beach Gardens location.',
    quickFacts: [
      { label: 'Homes', value: 'Family single-family homes' },
      { label: 'Amenities', value: 'Schools, parks, proximity to I-95' },
    ],
  },

  // ── WEST PALM BEACH ──────────────────────────────────────────
  {
    slug: 'ibis',
    name: 'Ibis Golf & Country Club',
    type: 'Neighborhood',
    region: 'West Palm Beach',
    description: 'A premier gated golf community with three Nicklaus-family-designed courses, luxury residences, and a full country club lifestyle.',
    overview:
      'Ibis is one of West Palm Beach\'s finest private club communities, featuring three Nicklaus-family-designed golf courses, a lavish clubhouse, resort pools, and an active social calendar.',
    quickFacts: [
      { label: 'Homes', value: 'Estates, custom homes, cottages, villas' },
      { label: 'Amenities', value: 'Three golf courses, pools, tennis, fitness, dining' },
    ],
    photos: [
      '/public/Ibis Photos/Covershot with Sunrise2.jpg',
      '/public/Ibis Photos/Clubhouse Exterior 1.jpg',
      '/public/Ibis Photos/Pool Daytime.jpg',
      '/public/Ibis Photos/DJI_0571 IBIS Tennis Courts Evening 2.jpg',
      '/public/Ibis Photos/Panache 1.jpg',
      '/public/Ibis Photos/The CORE 1 2023.jpg',
    ],
  },
  {
    slug: 'el-cid',
    name: 'El Cid',
    type: 'Neighborhood',
    region: 'West Palm Beach',
    description: 'A historic, walkable neighborhood with Spanish Mediterranean homes and scenic Intracoastal frontage.',
    overview:
      'El Cid is one of West Palm Beach\'s most charming and historic districts, prized for its Mediterranean-style architecture, pedestrian-friendly streets, and waterfront access.',
    quickFacts: [
      { label: 'Homes', value: 'Historic Mediterranean cottages and luxury renovations' },
      { label: 'Amenities', value: 'Waterfront parks, marinas, walkable to restaurants' },
    ],
  },
  {
    slug: 'harbour-islands',
    name: 'Harbour Islands',
    type: 'Neighborhood',
    region: 'West Palm Beach',
    description: 'A gated waterfront community with private boat docks, luxury homes, and an island lifestyle just minutes from downtown.',
    overview:
      'Harbour Islands offers island-style living just minutes from downtown West Palm Beach, with private docks, waterfront access, and an intimate gated community atmosphere.',
    quickFacts: [
      { label: 'Homes', value: 'Waterfront estates and luxury condos' },
      { label: 'Amenities', value: 'Private boat docks, gated security' },
    ],
  },
  {
    slug: 'downtown-west-palm',
    name: 'Downtown West Palm Beach',
    type: 'Neighborhood',
    region: 'West Palm Beach',
    description: 'A vibrant urban district with condos, Clematis Street dining, cultural venues, and Intracoastal waterfront access.',
    overview:
      'Downtown West Palm Beach is ideal for buyers seeking active city living in a waterfront setting, with the Brightline station, Kravis Center, and Palm Beach Island ferry steps away.',
    quickFacts: [
      { label: 'Homes', value: 'High-rise condos and luxury apartments' },
      { label: 'Amenities', value: 'Dining, arts, Brightline rail, waterfront parks' },
    ],
  },
  {
    slug: 'singer-island',
    name: 'Singer Island',
    type: 'Neighborhood',
    region: 'Riviera Beach',
    description: 'A beachfront peninsula with oceanfront condos, resort amenities, and direct Atlantic access.',
    overview:
      'Singer Island is a destination for coastal living with private beach access, high-rise condos with ocean views, and a convenient connection to the Intracoastal and boating.',
    quickFacts: [
      { label: 'Homes', value: 'Oceanfront condos and luxury residences' },
      { label: 'Amenities', value: 'Beach access, boating, dining' },
    ],
    photos: [
      '/public/Singer Island/05CB8C4D-90B8-4D71-8600-712B25BD5CFC.jpg',
      '/public/Singer Island/431FF7F0-B668-4768-9A30-EC2D50DA2F9B.jpg',
      '/public/Singer Island/562273E8-1E56-460B-B810-46473799DD39.jpg',
      '/public/Singer Island/81AE7EA9-3B9E-4EAD-B42E-EBF8430561DB.jpg',
      '/public/Singer Island/94BDEB8B-EDAA-4615-A289-19486C18A000.jpg',
      '/public/Singer Island/DAD5AC6A-3988-4D08-BE51-91B89AC3ABC5.jpg',
    ],
  },
  {
    slug: 'palm-beach-lakes',
    name: 'Palm Beach Lakes',
    type: 'Neighborhood',
    region: 'West Palm Beach',
    description: 'A convenient residential community with easy access to shopping, the airport, and city amenities.',
    overview:
      'Palm Beach Lakes is popular for buyers seeking value, strong schools, and straightforward access to PBI Airport, I-95, and downtown West Palm Beach.',
    quickFacts: [
      { label: 'Homes', value: 'Single-family homes and townhomes' },
      { label: 'Amenities', value: 'Shopping, schools, dining, airport proximity' },
    ],
  },

  // ── WELLINGTON ───────────────────────────────────────────────
  {
    slug: 'seven-bridges',
    name: 'Seven Bridges',
    type: 'Neighborhood',
    region: 'Wellington',
    description: 'A modern gated community with lakefront homes and resort-style amenities in a private country club setting.',
    overview:
      'Seven Bridges is known for elegant estates and a private club lifestyle with pools, dining, a fitness center, and a signature golf course.',
    quickFacts: [
      { label: 'Homes', value: 'Luxury estates and executive homes' },
      { label: 'Amenities', value: 'Golf, clubhouse, resort pool, tennis' },
    ],
  },
  {
    slug: 'wellington-country-club',
    name: 'Wellington Country Club',
    type: 'Neighborhood',
    region: 'Wellington',
    description: 'A guard-gated golf and family community with resort-style amenities and eight golf courses.',
    overview:
      'Wellington Country Club offers active lifestyle living with eight golf courses, family amenities, and a dynamic social calendar.',
    quickFacts: [
      { label: 'Homes', value: 'Guard-gated luxury homes' },
      { label: 'Amenities', value: 'Golf, dining, fitness, social events' },
    ],
  },
  {
    slug: 'wellington-estates',
    name: 'Wellington Estates',
    type: 'Neighborhood',
    region: 'Wellington',
    description: 'A premier equestrian community with luxury residences, barn facilities, and horse-friendly acreage.',
    overview:
      'Wellington Estates offers upscale equestrian living with gated neighborhoods, world-class riding facilities nearby, and a community built around the horse lifestyle.',
    quickFacts: [
      { label: 'Homes', value: 'Equestrian estates and luxury homes' },
      { label: 'Amenities', value: 'Barn facilities, trails, gated security' },
    ],
  },
  {
    slug: 'lake-club',
    name: 'The Lake Club',
    type: 'Neighborhood',
    region: 'Wellington',
    description: 'A private gated community built around a scenic lake with custom homes and a tranquil lifestyle.',
    overview:
      'The Lake Club provides quiet gated living with custom homes surrounding a beautiful lake, perfect for buyers who value privacy and an intimate community feel.',
    quickFacts: [
      { label: 'Homes', value: 'Custom gated homes' },
      { label: 'Amenities', value: 'Lake views, private security' },
    ],
  },

  // ── BOCA RATON ───────────────────────────────────────────────
  {
    slug: 'broken-sound',
    name: 'Broken Sound',
    type: 'Neighborhood',
    region: 'Boca Raton',
    description: 'A top-ranked private country club community with two championship golf courses and luxury residences.',
    overview:
      'Broken Sound is one of Boca Raton\'s most respected private club communities, featuring grand homes, championship golf, and a full social calendar.',
    quickFacts: [
      { label: 'Homes', value: 'Luxury estates, villas, and condos' },
      { label: 'Amenities', value: 'Two golf courses, tennis, fitness, dining' },
    ],
  },
  {
    slug: 'boca-west',
    name: 'Boca West',
    type: 'Neighborhood',
    region: 'Boca Raton',
    description: 'A nationally acclaimed golf club community with four championship courses and a full resort lifestyle.',
    overview:
      'Boca West is a flagship lifestyle community offering four championship golf courses, a world-class spa, multiple dining venues, and an expansive range of home styles.',
    quickFacts: [
      { label: 'Homes', value: 'Estates, villas, coach homes' },
      { label: 'Amenities', value: 'Four golf courses, spa, dining, tennis' },
    ],
  },
  {
    slug: 'royal-palm-yacht-cc',
    name: 'Royal Palm Yacht & Country Club',
    type: 'Neighborhood',
    region: 'Boca Raton',
    description: 'Boca Raton\'s premier waterfront country club with private marina, yacht access, and luxury estate homes.',
    overview:
      'Royal Palm Yacht & Country Club is one of South Florida\'s most prestigious addresses, combining marina-front living with golf, tennis, and a legendary social scene.',
    quickFacts: [
      { label: 'Homes', value: 'Canal-front and Intracoastal estates' },
      { label: 'Amenities', value: 'Marina, yacht club, golf, tennis, dining' },
    ],
  },
  {
    slug: 'woodfield-country-club',
    name: 'Woodfield Country Club',
    type: 'Neighborhood',
    region: 'Boca Raton',
    description: 'A gated private golf community with luxury homes surrounding a beautifully maintained private course.',
    overview:
      'Woodfield Country Club appeals to buyers who want both championship golf and a tranquil, gated setting in Boca Raton.',
    quickFacts: [
      { label: 'Homes', value: 'Villas and estate homes' },
      { label: 'Amenities', value: 'Golf, pool, clubhouse, tennis' },
    ],
  },
  {
    slug: 'delaire-country-club',
    name: 'Delaire Country Club',
    type: 'Neighborhood',
    region: 'Boca Raton',
    description: 'A luxury private golf community with refined estate living and an intimate club atmosphere.',
    overview:
      'Delaire Country Club features lush grounds, elegant homes, and upscale club amenities in one of Boca Raton\'s most intimate private settings.',
    quickFacts: [
      { label: 'Homes', value: 'Resort-style luxury residences' },
      { label: 'Amenities', value: 'Golf, dining, social club, tennis' },
    ],
  },

  // ── DELRAY BEACH ─────────────────────────────────────────────
  {
    slug: 'ocean-side',
    name: 'Ocean Side',
    type: 'Neighborhood',
    region: 'Delray Beach',
    description: 'A beachfront neighborhood with direct Atlantic access, ocean views, and a laid-back coastal lifestyle.',
    overview:
      'Ocean Side is a top choice for buyers seeking direct beach access and ocean-facing living in Delray Beach, steps from the sand and surf.',
    quickFacts: [
      { label: 'Homes', value: 'Beach cottages and coastal homes' },
      { label: 'Amenities', value: 'Direct beach access, ocean views' },
    ],
  },
  {
    slug: 'delray-beach-harbor',
    name: 'Delray Beach Harbor',
    type: 'Neighborhood',
    region: 'Delray Beach',
    description: 'A waterfront community blending residential comfort with marina access and Intracoastal boating.',
    overview:
      'Delray Beach Harbor gives buyers access to boating, beaches, and downtown Delray\'s Atlantic Avenue within a calm residential waterfront setting.',
    quickFacts: [
      { label: 'Homes', value: 'Waterfront condos and single-family homes' },
      { label: 'Amenities', value: 'Marina access, Intracoastal views' },
    ],
  },
  {
    slug: 'seagate',
    name: 'Seagate',
    type: 'Neighborhood',
    region: 'Delray Beach',
    description: 'A private waterfront community with canal homes, private docks, and direct Intracoastal access.',
    overview:
      'Seagate is ideal for boaters seeking access to the Intracoastal and Atlantic Ocean from a private, established Delray Beach neighborhood.',
    quickFacts: [
      { label: 'Homes', value: 'Waterfront estate homes' },
      { label: 'Amenities', value: 'Private boat docks, canal access' },
    ],
  },
  {
    slug: 'shelborne',
    name: 'Shelborne',
    type: 'Neighborhood',
    region: 'Delray Beach',
    description: 'A beachside community with coastal homes and close proximity to the Atlantic.',
    overview:
      'Shelborne is a great fit for buyers seeking beach living with a close-knit neighborhood feel just steps from the ocean.',
    quickFacts: [
      { label: 'Homes', value: 'Beach cottages and coastal homes' },
      { label: 'Amenities', value: 'Beach access, ocean proximity' },
    ],
  },

  // ── BOYNTON BEACH ────────────────────────────────────────────
  {
    slug: 'hammock-park',
    name: 'Hammock Park',
    type: 'Neighborhood',
    region: 'Boynton Beach',
    description: 'A relaxed waterfront neighborhood with marina access and coastal charm.',
    overview:
      'Hammock Park appeals to buyers seeking boating access and a lower-key coastal community in Boynton Beach.',
    quickFacts: [
      { label: 'Homes', value: 'Canal homes and waterfront residences' },
      { label: 'Amenities', value: 'Marina access, parks' },
    ],
  },
  {
    slug: 'water-crest',
    name: 'Water Crest',
    type: 'Neighborhood',
    region: 'Boynton Beach',
    description: 'A luxury gated community with country club amenities and well-appointed estate homes.',
    overview:
      'Water Crest offers resort-style private community living with beautifully designed homes in a secure, amenity-rich setting.',
    quickFacts: [
      { label: 'Homes', value: 'Estate homes and villas' },
      { label: 'Amenities', value: 'Clubhouse, pool, fitness' },
    ],
  },
  {
    slug: 'boynton-beach-gardens',
    name: 'Boynton Beach Gardens',
    type: 'Neighborhood',
    region: 'Boynton Beach',
    description: 'A quiet residential neighborhood with family-friendly streets and convenient access to schools and shopping.',
    overview:
      'Boynton Beach Gardens is an attractive option for families who want a quiet neighborhood near all local conveniences.',
    quickFacts: [
      { label: 'Homes', value: 'Single-family homes' },
      { label: 'Amenities', value: 'Schools, shops, parks' },
    ],
  },
  {
    slug: 'ocean-ridge',
    name: 'Ocean Ridge',
    type: 'Neighborhood',
    region: 'Boynton Beach',
    description: 'A small, exclusive bayfront town with luxury estates and direct inlet access between Boca and Boynton.',
    overview:
      'Ocean Ridge offers quiet elegance and waterfront living between Palm Beach and Boynton Beach, with direct access to the Intracoastal and Atlantic inlet.',
    quickFacts: [
      { label: 'Homes', value: 'Bayfront estates and luxury homes' },
      { label: 'Amenities', value: 'Marina access, private beaches' },
    ],
  },

  // ── LAKE WORTH BEACH ─────────────────────────────────────────
  {
    slug: 'lake-worth-estates',
    name: 'Lake Worth Estates',
    type: 'Neighborhood',
    region: 'Lake Worth Beach',
    description: 'A boutique gated community with luxury homes and a private country club setting.',
    overview:
      'Lake Worth Estates offers an intimate luxury setting with manicured grounds and top-tier amenities in the heart of Lake Worth Beach.',
    quickFacts: [
      { label: 'Homes', value: 'Gated estate homes' },
      { label: 'Amenities', value: 'Country club, golf, dining' },
    ],
  },
  {
    slug: 'poinciana-park',
    name: 'Poinciana Park',
    type: 'Neighborhood',
    region: 'Lake Worth Beach',
    description: 'A coastal neighborhood with historic bungalows and eclectic local character near the beach.',
    overview:
      'Poinciana Park offers a charming, walkable neighborhood feel within easy reach of Lake Worth Beach and downtown attractions.',
    quickFacts: [
      { label: 'Homes', value: 'Bungalows, cottages, ranch homes' },
      { label: 'Amenities', value: 'Beach proximity, local dining' },
    ],
  },
  {
    slug: 'lake-worth-gardens',
    name: 'Lake Worth Gardens',
    type: 'Neighborhood',
    region: 'Lake Worth Beach',
    description: 'A community with golf, waterfront views, and a friendly residential atmosphere.',
    overview:
      'Lake Worth Gardens offers an active community lifestyle and easy access to beaches, shopping, and the Lake Worth waterfront.',
    quickFacts: [
      { label: 'Homes', value: 'Single-family homes and villas' },
      { label: 'Amenities', value: 'Golf, pool, lake views' },
    ],
  },

  // ── ROYAL PALM BEACH ─────────────────────────────────────────
  {
    slug: 'pomelo-park',
    name: 'Pomelo Park',
    type: 'Neighborhood',
    region: 'Royal Palm Beach',
    description: 'A family-friendly gated neighborhood with modern homes, parks, and walkable community amenities.',
    overview:
      'Pomelo Park is a welcoming community built for families, with open green space, a clubhouse, and neighborhood activities.',
    quickFacts: [
      { label: 'Homes', value: 'Modern single-family homes' },
      { label: 'Amenities', value: 'Park, clubhouse, pool' },
    ],
  },
  {
    slug: 'seneca-lakes',
    name: 'Seneca Lakes',
    type: 'Neighborhood',
    region: 'Royal Palm Beach',
    description: 'A gated lakeside community with newer homes and resort-style amenities in western Palm Beach County.',
    overview:
      'Seneca Lakes is ideal for buyers seeking a newer, amenity-rich gated community with scenic lake views in Royal Palm Beach.',
    quickFacts: [
      { label: 'Homes', value: 'Single-family homes and townhomes' },
      { label: 'Amenities', value: 'Fitness center, pool, playgrounds' },
    ],
  },
  {
    slug: 'oakbrook',
    name: 'Oakbrook',
    type: 'Neighborhood',
    region: 'Royal Palm Beach',
    description: 'A planned community with modern single-family homes, parks, and convenient western county access.',
    overview:
      'Oakbrook is popular with families for its newer homes, excellent schools, and convenient Royal Palm Beach location near shopping and major roads.',
    quickFacts: [
      { label: 'Homes', value: 'Newer single-family homes' },
      { label: 'Amenities', value: 'Parks, retail, schools nearby' },
    ],
  },
  {
    slug: 'lake-clarence',
    name: 'Lake Clarence',
    type: 'Neighborhood',
    region: 'Royal Palm Beach',
    description: 'A gated lakeside community with modern homes and family-friendly amenities.',
    overview:
      'Lake Clarence is popular with families and buyers seeking a newer community with generous home designs and scenic lake views.',
    quickFacts: [
      { label: 'Homes', value: 'Lakeside homes and single-family residences' },
      { label: 'Amenities', value: 'Pool, playgrounds, community spaces' },
    ],
  },

  // ── PALM BEACH ───────────────────────────────────────────────
  {
    slug: 'manalapan',
    name: 'Manalapan',
    type: 'Neighborhood',
    region: 'Palm Beach',
    description: 'An exclusive beachfront town offering some of the county\'s most prestigious oceanfront estates.',
    overview:
      'Manalapan delivers the highest level of privacy and luxury on the barrier island, with magnificent oceanfront and lakefront estates on expansive lots.',
    quickFacts: [
      { label: 'Homes', value: 'Oceanfront mega estates' },
      { label: 'Amenities', value: 'Private beaches, gated access' },
    ],
    photos: [
      '/public/Mega Mansion Manalapan walk through/IMG_5343.JPEG',
      '/public/Mega Mansion Manalapan walk through/IMG_5344.JPEG',
      '/public/Mega Mansion Manalapan walk through/IMG_5345.JPEG',
      '/public/Mega Mansion Manalapan walk through/IMG_5346.JPEG',
      '/public/Mega Mansion Manalapan walk through/IMG_5347.JPEG',
      '/public/Mega Mansion Manalapan walk through/IMG_5348.JPEG',
    ],
  },

  // ── JUPITER COUNTRY CLUBS ────────────────────────────────────
  {
    slug: 'admirals-cove',
    name: "Admiral's Cove",
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A premier waterfront country club on the Intracoastal — deep-water dockage, championship golf, and estate homes that attract discerning buyers seeking the ultimate private lifestyle.',
    overview:
      "Admiral's Cove is one of Jupiter's most prestigious waterfront club communities, set along the Intracoastal Waterway with direct ocean access and deep-water dockage for large yachts. The community offers a rare combination of protected dockage, championship golf, and a fully integrated club lifestyle — all within minutes of Jupiter's beaches, dining, and private aviation access. The club has undergone extensive modernization over the past decade, attracting a new generation of owners who value both prestige and privacy. A standout feature unique to Admiral's Cove is its private on-site hotel, allowing residents to host guests without compromising the privacy of their own homes. Inventory here is limited — long-term ownership and strong demand keep opportunities rare.",
    quickFacts: [
      { label: 'Homes', value: 'Waterfront estates, golf-front homes, private dock residences' },
      { label: 'Amenities', value: 'Deep-water marina, championship golf, private hotel, spa, dining' },
    ],
    priceRanges: [
      { type: 'Golf-Front Homes', range: '$1.5M – $4M' },
      { type: 'Waterfront Estates', range: '$3M – $15M+' },
    ],
    highlights: [
      'Extensive deep-water dockage with quick ocean access via the Intracoastal Waterway',
      'Private on-site hotel for residents and guests — a rare amenity found in very few communities',
      'Championship golf, enhanced dining, wellness facilities, and refined social spaces',
      'Community has modernized significantly while maintaining its legacy of prestige and discretion',
      'Limited inventory — long-term ownership and high demand make opportunities rare',
    ],
  },
  {
    slug: 'loxahatchee-club',
    name: 'The Loxahatchee Club',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'One of America\'s most exclusive golf clubs — Forbes Platinum-rated, Jack Nicklaus–designed, and referral-only — set in a serene Jupiter preserve with a pure golf philosophy.',
    overview:
      'The Loxahatchee Club is among the most prestigious private golf communities in the United States. The Jack Nicklaus–designed course earned Golf Digest recognition as one of the best new private courses upon debut, hosted the U.S. Senior Amateur Championship, and holds Platinum status on Forbes\' list of the 20 Most Exclusive Golf and Country Clubs in America. Nicklaus himself described it as "one of my most imaginative courses — and certainly one of the best I have ever done." Membership is by referral only, interior photography is strictly restricted to protect privacy, and a calm, unobtrusive atmosphere defines daily life here. Homes are positioned throughout the community with golf course or lake views. Opportunities are rare — long-term ownership and generational buyers mean inventory almost never comes to market.',
    quickFacts: [
      { label: 'Homes', value: 'Estate homes with golf course or lake views' },
      { label: 'Amenities', value: 'Jack Nicklaus championship golf, private clubhouse, referral-only membership' },
    ],
    priceRanges: [
      { type: 'Estate Homes', range: '$1.5M – $5M+' },
    ],
    highlights: [
      'Jack Nicklaus–designed course — Nicklaus called it "one of the best I have ever done"',
      'Forbes Platinum status: one of the 20 Most Exclusive Golf Clubs in America',
      'Hosted the U.S. Senior Amateur Championship',
      'Membership by referral only — a pure golf club philosophy with no lifestyle-amenity dilution',
      'Strict privacy standards, long-term ownership culture, and extremely limited inventory',
    ],
  },
  {
    slug: 'jonathans-landing',
    name: "Jonathan's Landing",
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A prestigious gated golf and boating community with three championship courses, deep-water marina access, and a diverse range of luxury home styles.',
    overview:
      "Jonathan's Landing is one of Jupiter's landmark private club communities, offering three championship golf courses, a full-service marina, and a wide variety of home types from condos to custom estates. The community spans lush waterways and preserves, delivering a resort lifestyle in one of Northern Palm Beach County's most established gated addresses.",
    quickFacts: [
      { label: 'Homes', value: 'Condos, townhomes, villas, and estate homes' },
      { label: 'Amenities', value: 'Three golf courses, marina, tennis, fitness, dining' },
    ],
    priceRanges: [
      { type: 'Condos & Villas', range: '$400K – $900K' },
      { type: 'Single-Family Homes', range: '$800K – $3M' },
      { type: 'Waterfront Estates', range: '$2M – $8M+' },
    ],
    highlights: [
      'Three championship golf courses with varied terrain and stunning water views',
      'Deep-water marina with direct Intracoastal access for boaters',
      'Wide range of home types makes it accessible at multiple price points',
      'Lush natural preserves and waterways throughout the community',
      'Active social calendar and full club amenity program year-round',
    ],
  },
  {
    slug: 'trump-national-jupiter',
    name: 'Trump National Jupiter',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A purpose-built luxury golf destination centered on a Jack Nicklaus Signature course, with estate homes, courtyard residences, and resort-caliber club amenities in Jupiter.',
    overview:
      'Trump National Golf Club Jupiter is a gated luxury residential community built around an 18-hole Jack Nicklaus Signature championship course. The development offers a curated range of home types — estate homes on large lots, courtyard homes designed for low-maintenance living, and golf residences with direct course views. Classic Mediterranean and refined contemporary architectural styles define the community, with generous spacing and privacy throughout. Club amenities include a full clubhouse with dining, resort-style pool and spa, tennis, fitness center, golf practice facilities, and a year-round member events calendar. Located in Jupiter with easy access to beaches, I-95, and Palm Beach International Airport.',
    quickFacts: [
      { label: 'Homes', value: 'Estate homes, courtyard homes, and golf residences' },
      { label: 'Amenities', value: 'Jack Nicklaus Signature golf, resort pool, spa, tennis, fitness, pro shop' },
    ],
    priceRanges: [
      { type: 'Courtyard & Golf Residences', range: '$800K – $2M' },
      { type: 'Estate Homes', range: '$2M – $6M+' },
    ],
    highlights: [
      'Jack Nicklaus Signature 18-hole championship golf course',
      'Diverse home types: estate homes, courtyard homes, and golf-front residences',
      'Resort-style pool, spa, tennis, fitness center, and pro shop',
      'Full member events calendar and clubhouse dining',
      'Minutes to Jupiter beaches, Abacoa dining, and Palm Beach International Airport',
    ],
  },
  {
    slug: 'bears-club',
    name: "The Bear's Club",
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'Jack Nicklaus\'s premier private golf community — guard-gated, intentionally discreet, and home to some of Jupiter\'s most significant custom estate residences.',
    overview:
      "The Bear's Club is an exclusive guard-gated residential golf community in Jupiter, designed by Jack Nicklaus and built around a championship-quality Signature course widely regarded as one of the premier private golf experiences in South Florida. The community is defined by its intentionally low-key, member-centric culture — generous lot sizes, thoughtful architectural diversity, mature landscaping, and a quiet atmosphere that has long attracted executives, entrepreneurs, and professional athletes who value privacy above all else. Custom estate residences offer expansive floor plans, high ceilings, private pools, and golf course, lake, or preserve views. Limited inventory and a long-term ownership culture make opportunities rare. Jupiter's beaches are 10 minutes away; Abacoa dining is 5 minutes; Palm Beach International Airport is about 25 minutes.",
    quickFacts: [
      { label: 'Homes', value: 'Custom estate residences on oversized lots with golf, lake, or preserve views' },
      { label: 'Amenities', value: 'Jack Nicklaus Signature golf, elegant clubhouse dining, practice facilities' },
    ],
    priceRanges: [
      { type: 'Custom Estates', range: '$4M – $30M+' },
    ],
    highlights: [
      'Jack Nicklaus Signature course — regarded as one of South Florida\'s premier private golf experiences',
      'Guard-gated with a culture of privacy and discretion; historically attracts executives and professional athletes',
      'Limited number of residences on oversized lots with generous spacing throughout',
      'Custom estates with expansive floor plans, private pools, and high-end finishes',
      'Among the most prestigious private addresses in all of Palm Beach County',
    ],
  },

  // ── JUNO BEACH / NORTH PALM ──────────────────────────────────
  {
    slug: 'panther-national',
    name: 'Panther National',
    type: 'Neighborhood',
    region: 'Palm Beach County',
    description: 'An emerging ultra-luxury golf community with championship design, custom estate homesites, and resort-caliber amenities.',
    overview:
      'Panther National is one of the most anticipated new luxury communities in Palm Beach County — a limited-release golf and residential development offering custom estate homesites surrounding a world-class championship golf experience. With bespoke architecture, curated amenities, and a private club lifestyle, it represents one of the most exclusive address opportunities currently available in South Florida.',
    quickFacts: [
      { label: 'Homes', value: 'Custom estate homesites and residences' },
      { label: 'Amenities', value: 'Championship golf, resort clubhouse, luxury lifestyle amenities' },
    ],
    priceRanges: [
      { type: 'Estate Homesites', range: '$1M – $5M+' },
      { type: 'Custom Estate Residences', range: '$3M – $12M+' },
    ],
    highlights: [
      'Limited-release homesites surrounding a championship-caliber golf experience',
      'Fully custom estate home designs with premium architectural standards',
      'Resort clubhouse, dining, spa, and wellness amenities',
      'Emerging address in one of Palm Beach County\'s most coveted growth corridors',
      'Contact DO Homes Group for pre-market access and VIP homesite selection',
    ],
    photos: [
      '/public/Panther National/ChatGPT Image Jan 22, 2026, 01_43_20 PM.png',
      '/public/Panther National/ChatGPT Image Jan 22, 2026, 01_45_38 PM.png',
      '/public/Panther National/ChatGPT Image Jan 22, 2026, 01_48_48 PM.png',
      '/public/Panther National/ChatGPT Image Jan 22, 2026, 01_51_22 PM.png',
      '/public/Panther National/ChatGPT Image Jan 22, 2026, 01_54_29 PM.png',
      '/public/Panther National/ChatGPT Image Jan 22, 2026, 01_57_50 PM.png',
    ],
  },
  {
    slug: 'prado',
    name: 'The Prado',
    type: 'Neighborhood',
    region: 'Palm Beach County',
    description: 'A beautifully appointed residential community featuring Mediterranean-inspired architecture, lush landscaping, and resort-style amenity living.',
    overview:
      'The Prado is a refined gated community offering elegantly designed single-family homes in a private, amenity-rich setting. Known for meticulous attention to architectural detail and lush tropical landscaping, The Prado delivers the feel of a private resort with the warmth of a true neighborhood — a rare combination in today\'s Palm Beach County market.',
    quickFacts: [
      { label: 'Homes', value: 'Single-family homes and estate residences' },
      { label: 'Amenities', value: 'Resort pool, clubhouse, fitness, walking paths' },
    ],
    priceRanges: [
      { type: 'Single-Family Homes', range: '$600K – $1.5M' },
      { type: 'Estate Residences', range: '$1.5M – $3M+' },
    ],
    highlights: [
      'Mediterranean-inspired architecture with premium exterior and interior finishes',
      'Resort-style amenity center with pool, fitness center, and social spaces',
      'Low-density neighborhood with generous lot sizes and manicured common areas',
      'Convenient access to local shopping, dining, and top-rated Palm Beach County schools',
      'Strong resale values in a sought-after Palm Beach County location',
    ],
    photos: [
      '/public/Prado/IMG_8020.jpeg',
      '/public/Prado/IMG_8021.jpeg',
      '/public/Prado/IMG_8022.jpeg',
      '/public/Prado/IMG_8023.jpeg',
      '/public/Prado/IMG_8024.jpeg',
      '/public/Prado/IMG_8025.jpeg',
    ],
  },
  {
    slug: 'sonoma-bay',
    name: 'Sonoma Bay',
    type: 'Neighborhood',
    region: 'Jupiter',
    description: 'A gated Jupiter community with lakefront homes, resort-style amenities, and the relaxed South Florida lifestyle.',
    overview:
      'Sonoma Bay is a premier gated community in Jupiter featuring single-family homes on scenic lakefront lots surrounded by lush Florida landscaping. With a spectacular resort-style amenity center, wide palm-lined streets, and a welcoming community spirit, Sonoma Bay is ideal for families and professionals seeking upscale living in one of Northern Palm Beach County\'s most sought-after towns.',
    quickFacts: [
      { label: 'Homes', value: 'Lakefront single-family homes' },
      { label: 'Amenities', value: 'Resort pool, clubhouse, lake views, fitness, dog park' },
    ],
    priceRanges: [
      { type: 'Single-Family Homes', range: '$700K – $1.5M' },
      { type: 'Lakefront Estates', range: '$1.2M – $2.5M+' },
    ],
    highlights: [
      'Gated community with lakefront lots and beautiful water views throughout',
      'Resort-style amenity center with pool, cabana, and outdoor entertainment spaces',
      'Located in Jupiter, served by A-rated Palm Beach County schools',
      'Close to Harbourside Place dining, Jupiter beach, and outdoor recreation',
      'Family-friendly community with an active social calendar and neighborhood events',
    ],
    photos: [
      '/public/Sonoma Bay/IMG_5896.jpeg',
      '/public/Sonoma Bay/IMG_5897.jpeg',
      '/public/Sonoma Bay/IMG_5898.jpeg',
      '/public/Sonoma Bay/IMG_5899.jpeg',
      '/public/Sonoma Bay/IMG_5900.jpeg',
      '/public/Sonoma Bay/pool.jpg',
    ],
  },

  // ── TEQUESTA ─────────────────────────────────────────────────
  {
    slug: 'powder-pointe',
    name: 'Powder Pointe',
    type: 'Neighborhood',
    region: 'Tequesta',
    description: 'A waterfront neighborhood with canal homes and close proximity to the Intracoastal.',
    overview:
      'Powder Pointe offers buyers water-oriented living with easy access to boating and the Intracoastal Waterway in the village of Tequesta.',
    quickFacts: [
      { label: 'Homes', value: 'Canal-front and waterfront homes' },
      { label: 'Amenities', value: 'Marina access, water lifestyle' },
    ],
  },
]

export const communities = [...cities, ...neighborhoods]

export function getCommunityBySlug(slug: string) {
  return communities.find((c) => c.slug === slug)
}

export function getCommunityPaths() {
  return communities.map((c) => ({ slug: c.slug }))
}

export function getLinkedNeighborhoods(city: CommunityItem): CommunityItem[] {
  if (!city.linkedNeighborhoods?.length) return []
  return city.linkedNeighborhoods
    .map((slug) => neighborhoods.find((n) => n.slug === slug))
    .filter(Boolean) as CommunityItem[]
}

export function getParentCity(neighborhoodSlug: string): CommunityItem | undefined {
  return cities.find((city) => city.linkedNeighborhoods?.includes(neighborhoodSlug))
}
