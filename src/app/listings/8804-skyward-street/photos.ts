// The photo sequence for 8804 Skyward Street, in John's order. Delivered
// edits ONLY: on 2026-08-23 John pulled every frame whose sole source was a
// 7008×4672 raw camera file (the whole kitchen set, the primary bedroom,
// foyer, loft, landing, great-room wides, and two guest bedrooms had no
// delivered edit). The guest suites' en-suite baths stand in for the raw-only
// bedroom frames. When the photographer delivers edits for the missing rooms,
// regenerate the gallery and restore them here in the original order.
//
// Files with T/N suffixes (undisclosed AI twilight composites), S suffixes
// (watermarked virtual staging), and the burned-in-text aerials are
// deliberately excluded and must never be added.
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
    src: `${DIR}/03-aerial-lake.jpg`,
    alt: 'Overhead aerial of the homesite — hipped tile roof, the stacked-stone column at the entry, and the lake running behind the property',
    w: 2048, h: 1536,
  },
  {
    src: `${DIR}/04-rear-elevation-pool.jpg`,
    alt: 'Rear elevation from the far corner of the pool — the covered lanai and black-framed glass across the back of the house, with the heated saltwater pool wrapped in a marble deck',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/05-pool-lake-fence.jpg`,
    alt: 'The pool and marble deck at the lake fence line, palms overhead and homes across the water',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/06-pool-sun-shelf.jpg`,
    alt: "The pool's offset sun shelf finished in deep blue glass-mosaic tile, a bubbler running at its center, with the covered lanai behind",
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/07-lanai-sliders.jpg`,
    alt: 'The covered lanai with ceiling fans and a dining set, looking through the sliders into the great room and kitchen',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/08-lanai-lake-view.jpg`,
    alt: 'From under the lanai, the view past the dining set across the pool to the lake and the homes on the far bank',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/09-pool-loungers.jpg`,
    alt: 'Two loungers on the marble deck facing down the length of the pool toward the lake',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/10-cabana-bath.jpg`,
    alt: 'The full cabana bath — stone-topped vanity and a framed glass shower with a palm view through the shower window — opening directly onto the lanai',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/11-lake-axis.jpg`,
    alt: 'The view down the water axis from the backyard: lawn, low black aluminum fence, and the lake stretching into the distance',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/12-great-room-sliders.jpg`,
    alt: 'The great room arranged around the media wall, pocketing sliders opening the back of the house to the lanai',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/13-primary-bath-shower.jpg`,
    alt: 'The primary bath — frameless glass shower in large-format stone-look tile, with the Roman soaking tub and vanity run beyond',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/14-primary-bath-vanity.jpg`,
    alt: 'The primary bath dual vanity with a seated makeup station between the sinks and mirrors on two walls',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/15-media-room.jpg`,
    alt: 'The sound-insulated media room — a black-framed window over the lake and the homes across it, with a deep sectional in the corner',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/16-home-gym.jpg`,
    alt: 'The home gym — full mirrored wall, rubber flooring, cable machine, bench and bikes, with palm views through the windows',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/17-guest-bath-b.jpg`,
    alt: 'An en-suite guest bath with a stone-topped vanity and framed glass shower — every bedroom in the house has its own',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/18-guest-bath-c.jpg`,
    alt: 'A second en-suite guest bath, its glass shower lit by a clerestory window',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/19-laundry-room.jpg`,
    alt: 'The laundry room — utility sink, long folding counter, full-height cabinet storage and front-load washer and dryer',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/20-clubhouse-lobby.jpg`,
    alt: 'The Lotus clubhouse lobby — a double-height room under a canopy of globe pendants, with marble floors and black marble accents',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/21-luna-bistro-bar.jpg`,
    alt: "Luna Bistro's bar at the Lotus clubhouse — an illuminated cobalt-blue bar front under brass pendants, with gold mesh cabinet doors",
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/22-pool-bar.jpg`,
    alt: 'The full-service pool bar under a beamed ceiling, its glass walls opening to the resort pool deck',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/23-club-fitness.jpg`,
    alt: "The clubhouse fitness center's cardio line running along a window wall that faces the pool cabanas",
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/24-club-sports-court.jpg`,
    alt: 'The indoor sports court at the clubhouse, with the Lotus emblem at center court',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/25-club-cardroom.jpg`,
    alt: 'The clubhouse card room under a coffered wood ceiling with sculptural lattice panels, tables set for play',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/26-club-arcade.jpg`,
    alt: 'The clubhouse game room — a floor-to-ceiling arcade mural behind a row of game cabinets and racing rigs',
    w: 2048, h: 1365,
  },
  {
    src: `${DIR}/27-club-aerial.jpg`,
    alt: 'Aerial of the Lotus clubhouse campus — resort pool, lap pool, whirlpool spa and splash pad ringed by cabanas, with the tennis courts beyond',
    w: 2048, h: 1536,
  },
]

// Page chapters, expressed as [start, end) slices of the sequence above so the
// published order can never drift from John's.
export const ARRIVAL = [1, 3] as const // the two aerials
export const WATERFRONT = [3, 11] as const // rear elevation, pool, lanai, lake
export const LIVING = [11, 12] as const // great room (kitchen edits pending)
export const UPSTAIRS = [12, 19] as const // primary bath, media, gym, guest baths, laundry
export const CLUB = [19, 27] as const // Lotus clubhouse

export const slice = (range: readonly [number, number]) => PHOTOS.slice(range[0], range[1])
