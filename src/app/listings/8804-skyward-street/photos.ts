// The 46-photo sequence for 8804 Skyward Street, matching the "MLS Upload 46"
// set John finalized on 2026-08-23 (he confirmed restoring the full set,
// full-resolution sources included, so the site mirrors the MLS). Frame 20's
// MLS file is a truncated JPEG, so that slot is processed from the intact
// original in Home Photos.
//
// Open question (2026-08-23): the MLS set names frame 37 "Main Level Guest
// Suite", but the builder-plan dimensions put Bedrooms 2–5 upstairs. Page copy
// and this frame's alt are floor-neutral about the guest suites until John
// confirms which is right.
//
// Files with T/N suffixes (undisclosed AI twilight composites), S suffixes
// (watermarked virtual staging), and the burned-in-text aerials are
// deliberately excluded and must never be added here.
//
// Index in this array is the lightbox order. The hero is photo 0.

export interface SkywardPhoto {
  src: string
  alt: string
  w: number
  h: number
}

const DIR = '/images/listings/8804-skyward-street/gallery'

export const PHOTOS: SkywardPhoto[] = [
  {
    src: `${DIR}/01-front-elevation.jpg`,
    alt: 'Front elevation of 8804 Skyward Street — a two-story contemporary home in white stucco with low hipped tile rooflines, black-framed windows, a stacked-stone entry column and a paver drive, framed by palms',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/02-aerial-front.jpg`,
    alt: 'Aerial view of the front of the home showing the paver driveway, tropical landscaping and flat-profile gray tile roof, with neighboring homes and the lake beyond',
    w: 2048, h: 1536,
  },
  {
    src: `${DIR}/03-entrance-foyer.jpg`,
    alt: 'The two-story entry foyer — a curved staircase with iron spindles under a linear LED chandelier, polished tile floors, and a sightline through the great room to the water',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/04-aerial-lake.jpg`,
    alt: 'Overhead aerial of the homesite — hipped tile roof, the stacked-stone column at the entry, and the lake running behind the property',
    w: 2048, h: 1536,
  },
  {
    src: `${DIR}/05-rear-elevation-pool.jpg`,
    alt: 'Rear elevation from the far corner of the pool — the covered lanai and black-framed glass across the back of the house, with the heated saltwater pool wrapped in a marble deck',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/06-pool-lake-fence.jpg`,
    alt: 'The pool and marble deck at the lake fence line, palms overhead and homes across the water',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/07-pool-sun-shelf.jpg`,
    alt: "The pool's offset sun shelf finished in deep blue glass-mosaic tile, a bubbler running at its center, with the covered lanai behind",
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/08-lanai-sliders.jpg`,
    alt: 'The covered lanai with ceiling fans and a dining set, looking through the sliders into the great room and kitchen',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/09-lanai-lake-view.jpg`,
    alt: 'From under the lanai, the view past the dining set across the pool to the lake and the homes on the far bank',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/10-pool-loungers.jpg`,
    alt: 'Two loungers on the marble deck facing down the length of the pool toward the lake',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/11-cabana-bath.jpg`,
    alt: 'The full cabana bath — stone-topped vanity and a framed glass shower with a palm view through the shower window — opening directly onto the lanai',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/12-lake-frontage.jpg`,
    alt: 'The lake frontage from the backyard: lawn, a low black aluminum fence, and open water beyond',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/13-kitchen-island.jpg`,
    alt: 'The gourmet kitchen — greige shaker cabinetry run to the ceiling, a white quartz island with a deep stainless sink, hexagonal tile backsplash and vented hood, open to the water view beyond',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/14-kitchen-seating.jpg`,
    alt: 'The oversized quartz island wrapped in seating, with built-in stainless refrigeration and full-height greige cabinetry behind',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/15-kitchen-cooktop.jpg`,
    alt: 'The gas cooktop under a vented stainless hood, hexagonal tile running to the ceiling, with under-cabinet lighting along the quartz counters',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/16-kitchen-refrigeration.jpg`,
    alt: 'Built-in stainless refrigeration and double wall ovens set into full-height cabinetry, with the pull-down faucet at the island sink in the foreground',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/17-kitchen-dining.jpg`,
    alt: 'The open plan from the casual dining table — island seating for a crowd, the kitchen running along the back wall, and the great room beyond',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/18-dining-area.jpg`,
    alt: 'The breakfast area wrapped in floor-to-ceiling sheers, with a slider opening straight out to the lanai and pool',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/19-great-room-kitchen.jpg`,
    alt: 'The kitchen and casual dining seen from the great room seating, with the two-story foyer and staircase beyond',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/20-great-room.jpg`,
    alt: 'The great room under 10-foot ceilings, its sliders framing the pool and the lake behind it',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/21-great-room-sliders.jpg`,
    alt: 'The great room arranged around the media wall, pocketing sliders opening the back of the house to the lanai',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/22-formal-living.jpg`,
    alt: 'The formal living room off the foyer — the two-story volume overhead, with the open sightline running back through the house to the water',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/23-formal-living-volume.jpg`,
    alt: 'The formal living room under the 22-foot entry volume, a clerestory window above and the loft rail overhead',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/24-foyer-staircase.jpg`,
    alt: 'The foyer from the gallery hall — curved staircase, double front doors, and the formal living room opening to the right',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/25-primary-bedroom.jpg`,
    alt: 'The ground-floor primary bedroom with its stepped coffered ceiling and a wide window looking onto the water',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/26-primary-windows.jpg`,
    alt: "The primary suite's corner windows in black frames — the pool through one, the lake and far bank through the other",
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/27-primary-bath-shower.jpg`,
    alt: 'The primary bath — frameless glass shower in large-format stone-look tile, with the Roman soaking tub and vanity run beyond',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/28-primary-bath-vanity.jpg`,
    alt: 'The primary bath dual vanity with a seated makeup station between the sinks and mirrors on two walls',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/29-upstairs-landing.jpg`,
    alt: 'The upstairs landing — wood floors and the curved loft rail open to the foyer below, with the loft beyond',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/30-media-room.jpg`,
    alt: 'The sound-insulated media room, carpeted, with a deep sectional and a wide window over the front of the house',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/31-media-room-screen.jpg`,
    alt: 'The media room from behind the sectional — screen and speaker cabinets along the far wall, black-framed windows on two sides',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/32-home-gym.jpg`,
    alt: 'The home gym — full mirrored wall, rubber flooring, cable machine, bench and bikes, with palm views through the windows',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/33-loft.jpg`,
    alt: 'The loft arranged as a lounge and game space, with a daybed and table seating by the window',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/34-guest-suite-b.jpg`,
    alt: 'An upstairs en-suite bedroom with wood floors, a desk station, and windows overlooking the lake',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/35-guest-suite-c.jpg`,
    alt: 'A second upstairs en-suite bedroom, its black-framed windows on the tree line',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/36-guest-suite-d.jpg`,
    alt: 'A third upstairs en-suite bedroom with wood floors, a wide window and a leaning mirror',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/37-guest-suite-a.jpg`,
    alt: 'A fourth en-suite bedroom, its windows fitted with obscured glass for privacy',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/38-laundry-room.jpg`,
    alt: 'The laundry room — utility sink, long folding counter, full-height cabinet storage and front-load washer and dryer',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/39-clubhouse-lobby.jpg`,
    alt: 'The Lotus clubhouse lobby — a double-height room under a canopy of globe pendants, with marble floors and black marble accents',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/40-luna-bistro-bar.jpg`,
    alt: "Luna Bistro's bar at the Lotus clubhouse — an illuminated cobalt-blue bar front under brass pendants, with gold mesh cabinet doors",
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/41-pool-bar.jpg`,
    alt: 'The full-service pool bar under a beamed ceiling, its glass walls opening to the resort pool deck',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/42-club-fitness.jpg`,
    alt: "The clubhouse fitness center's cardio line running along a window wall that faces the pool cabanas",
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/43-club-sports-court.jpg`,
    alt: 'The indoor sports court at the clubhouse, with the Lotus emblem at center court',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/44-club-cardroom.jpg`,
    alt: 'The clubhouse card room under a coffered wood ceiling with sculptural lattice panels, tables set for play',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/45-club-arcade.jpg`,
    alt: 'The clubhouse game room — a floor-to-ceiling arcade mural behind a row of game cabinets and racing rigs',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/46-club-aerial.jpg`,
    alt: 'Aerial of the Lotus clubhouse campus — resort pool, lap pool, whirlpool spa and splash pad ringed by cabanas, with the tennis courts beyond',
    w: 2048, h: 1536,
  },
]

// Page chapters, expressed as [start, end) slices of the sequence above so the
// published order can never drift from the MLS set's.
export const ARRIVAL = [1, 4] as const // aerials + entry foyer
export const WATERFRONT = [4, 12] as const // rear elevation, pool, lanai, lake
export const LIVING = [12, 24] as const // kitchen, great room, dining, foyer
export const UPSTAIRS = [24, 38] as const // primary suite + second floor + laundry
export const CLUB = [38, 46] as const // Lotus clubhouse

export const slice = (range: readonly [number, number]) => PHOTOS.slice(range[0], range[1])
