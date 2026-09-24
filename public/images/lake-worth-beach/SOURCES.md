# Lake Worth Beach imagery — provenance

Everything in this folder is **John's own photography.** There is no stock here, so
captions may name the place directly rather than hedging by subject.

## In the community gallery

Wired into `photos` on the `lake-worth-beach` entry in `src/lib/communities.ts`.
Index 0 is the hero and the OG image; 1–5 fill the bento grid.

| # | File | Depicts |
|---|---|---|
| 0 | `local-pier-morning-hero.jpg` | William O. Lockhart Municipal Pier from the sand, morning sun laying a track across the water, Benny's sign legible at the pier head |
| 1 | `local-street-painting-lake-avenue.jpg` | Street Painting Festival — Lake Avenue closed off, chalk squares running down the block, downtown storefronts and the crowd behind |
| 2 | `local-casino-building-palms.jpg` | Lake Worth Casino from A1A — yellow façade, green-and-white awnings, bell tower, cabbage palms |
| 3 | `local-lifeguard-tides-board.jpg` | Tower 3 and the hand-lettered tides/temps board: high 9:52, low 4:03, air 93, water 87, "SAND GETS VERY HOT — HAVE FOOTWEAR" |
| 4 | `local-street-painting-carpenter-bee.jpg` | The 3D "Carpenter Bee" chalk panel on the asphalt |
| 5 | `local-beach-looking-north.jpg` | The beach looking north — dune line, the condo wall beyond it, a rescue board on the sand |

**Ordering is load-bearing.** Index 1 renders in the bento grid's tall left cell
(one column, two rows), so it wants a portrait frame — the Lake Avenue shot fills it
properly. Indices 2–5 land in short landscape cells; the carpenter bee survives that crop
because the bee fills the middle of the frame and the spectators along the top are cropped
away. Mobile shows indices 1–4, which keeps the split at two festival, two beach.

The mix is deliberate: without the festival frames the gallery was entirely beach and
barrier island, and nothing showed the downtown that every article about this city spends
its time on.

## Blog article heroes

Heroes are 16:9 crops at 2048×1152 WebP, cut from the full-quality originals in this
folder, so the gallery files stay untouched. `heroImagePosition` on the article sets the
phone crop. Credit on the page reads "Photo by John Oliver".

| Article | Hero file | Cut from | Crop and position |
|---|---|---|---|
| #1 `what-its-really-like-living-in-lake-worth-beach-florida` | `casino-arcade-hero.webp` | `local-casino-arcade.jpg` (John's own) | Full width, rows 150–1500 of 1800; q80. `heroImagePosition: '28% 40%'` keeps the "Lake Worth Casino" parapet sign in frame on phones. No recognisable people in the frame. Added 2026-09-23. |
| #2 `local-guide-to-lake-worth-beach-florida` | `lifeguard-tides-board-hero.webp` | `local-lifeguard-tides-board.jpg` (John's own) | rows 450–1800 of 1800; q80. `heroImagePosition: '20% 50%'`. Added 2026-09-23. |
| #3 `best-neighborhoods-in-lake-worth-beach-florida` | `street-painting-lake-avenue-hero.webp` | `local-street-painting-lake-avenue.jpg` (John's own) | rows 250–1114 of 2048 (portrait source, upscaled); q80. `heroImagePosition: '50% 50%'`. Captioned as a festival frame. Added 2026-09-23. |
| #4 `best-things-to-do-in-lake-worth-beach-florida` | `street-painting-sea-turtle-hero.webp` | `local-street-painting-sea-turtle-panel.jpg` (John's own) | rows 658–1522 of 2048 (portrait source, upscaled); q80. `heroImagePosition: '62% 50%'`. Captioned as a festival frame. Added 2026-09-23. |
| #5 `who-should-move-to-lake-worth-beach-florida` | `street-painting-big-bear-hero.webp` | `local-street-painting-big-bear-panel.jpg` (John's own) | rows 600–1464 of 2048 (portrait source, upscaled); q80. `heroImagePosition: '45% 50%'`. Captioned as a festival frame. Added 2026-09-23. |
| #6 `pros-and-cons-of-living-in-lake-worth-beach-florida` | `casino-building-palms-hero.webp` | `local-casino-building-palms.jpg` (John's own) | rows 0–1350 of 1800; q80. `heroImagePosition: '50% 50%'`. Added 2026-09-23. |
| #7 `cost-of-living-in-lake-worth-beach-florida` | `pier-morning-hero.webp` | `local-pier-morning-hero.jpg` (John's own) | rows 350–1700 of 1800; q80. `heroImagePosition: '70% 50%'`. Added 2026-09-23. |
| #8 `hidden-gems-in-lake-worth-beach-florida` | `street-painting-carpenter-bee-hero.webp` | `local-street-painting-carpenter-bee.jpg` (John's own) | rows 592–1456 of 2048 (portrait source, upscaled); q80. `heroImagePosition: '40% 50%'`. Captioned as a festival frame. Added 2026-09-23. |
| #9 `lake-worth-beach-vs-nearby-cities` | `beach-looking-north-hero.webp` | `local-beach-looking-north.jpg` (John's own) | rows 300–1650 of 1800; q80. `heroImagePosition: '45% 50%'`. Added 2026-09-23. |
| #10 `best-places-to-eat-drink-hang-out-in-lake-worth-beach-florida` | `bennys-acai-bowl-hero.webp` | `local-bennys-acai-bowl.jpg` (John's own) | rows 120–1132 of 2400 (portrait source); q80. `heroImagePosition: '35% 50%'`. Added 2026-09-23. |
| #10 split-hero panel | `bennys-acai-bowl-panel.webp` (1200×1500, 4:5) | `local-bennys-acai-bowl.jpg` (John's own) | rows 0–2250 of 2400, full width — the whole Benny's card, the full bowl and the board, so the subject reads without a tight crop. Desktop image of the opt-in `heroLayout: 'split'` + `heroTone: 'warm'` hero. The 16:9 file above stays the OG/JSON-LD image. Added 2026-09-23. |
| #10 split-hero mobile | `bennys-acai-bowl-mobile.webp` (1200×800, 3:2) | `local-bennys-acai-bowl.jpg` (John's own) | rows 250–1450 of 2400 — "Benny's on the Beach" card plus the fruit and granola; the phone crop of the same hero. Added 2026-09-23. |

## Held back, not in the gallery

Still in the folder at full quality, just not wired up:

- `local-oceanwalk-bennys-plaza.jpg` — the Oceanwalk plaza and Benny's at the pier
  entrance. Good frame, but three people sit mid-ground and are recognisable if you know
  them. It was in the gallery before the festival shots arrived; dropping it resolves that
  question rather than leaving it open.
- `local-casino-arcade.jpg` — the Casino arcade straight on, café tables under the arches.
  A second angle on a building already covered by index 2.
  Not in the gallery, but cropped for the #1 article hero (see above).
- `local-bennys-acai-bowl.jpg` — açaí bowl at Benny's with the table card behind it.
  Portrait, and it crops badly in a landscape cell. Belongs inline in the dining article.
- `local-street-painting-rose-panel.jpg` — an artist's pink-and-cyan rose panel against a
  lavender downtown building.
- `local-street-painting-big-bear-panel.jpg` — the "BIG BEAR" heart-tree panel mid-paint,
  artist crouched with a roller.
- `local-street-painting-sea-turtle-panel.jpg` — a sea turtle panel on its easel with the
  sunflower-woman mural on the wall behind it. The one frame that shows both the festival
  and the permanent mural work in the same shot; a strong candidate for an article hero.
- `street-painting-2023-001.jpeg` — left under its original name because it isn't festival
  material at all: it's a selfie of John at Disco Lounge. Fine for an about page, wrong
  folder for what it is.

## Processing

Beach set: originals came off the phone at 5712×4284 / ~2.5 MB, resized to a 2400px long
edge and re-encoded at q82 mozjpeg (450–590 KB).

Festival set: already 1536×2048, so re-encode only. q82 for most; the two in the gallery
went to q74 because chalk-on-asphalt texture is expensive to encode and they were running
650–850 KB. The carpenter bee still sits at ~700 KB — the chalk detail *is* the subject, so
squeezing it further costs the thing the photo is for.

EXIF was dropped throughout, which also strips the GPS tags.

## The thumbnails — unusable

Thirteen files arrived at thumbnail resolution, between 240×320 and 640×800. None are
renamed or wired up: at that size they cannot be used anywhere on the site, the hero alone
needing ~2000px. They look like they came out of a message thread or an email rather than
off the camera roll.

**Right city, wrong size.** `IMG_6355`–`IMG_6359` and `IMG_6364` — more pier, beach and
Casino angles. Every subject in them is already covered by the full-resolution set, so
there is nothing here worth chasing originals for.

**Wrong city.** `IMG_6365`–`IMG_6371` — the thatched-roof restaurant and its dock, the
moored sailboats, the pelican on the piling, the "NO SHOES NO SHIRT NO SERVICE" sign.
John confirmed (2026-08-16) these are **Lantana**, shot across the water. Lantana is not a
featured city — it has no entry in `src/lib/communities.ts` and appears only as a passing
mention in a few articles — so these have no home in this repo under any folder. Do not
file them here, and do not caption them as Lake Worth Beach.

## Still needed

The festival shots cover downtown *during* the festival, which is one weekend a year and
not what the street looks like the rest of the time. John plans to shoot it properly.

Outstanding: an ordinary-day streetscape down Lake Avenue, the Cottage District's Mission
and frame-vernacular housing stock, and the lagoon and Intracoastal **from the Lake Worth
Beach side** — the existing lagoon frames are all shot from Lantana looking back.

## In-article photos and galleries — 2026-09-24

Web-weight copies of John's own frames, cut from the full-quality files above. The originals are
untouched and the gallery wiring in `communities.ts` is unchanged.

| File | From | Size | Used on |
|---|---|---|---|
| `inline-beach-looking-north.jpg` | `local-beach-looking-north.jpg` | 1400×1050 | #1 living-in, getting to the beach |
| `inline-pier-morning.jpg` | `local-pier-morning-hero.jpg` | 1400×1050 | #4 things to do, oceanfront gallery |
| `inline-lifeguard-tides-board.jpg` | `local-lifeguard-tides-board.jpg` | 1400×1050 | same gallery |
| `inline-casino-building.jpg` | `local-casino-building-palms.jpg` | 1400×1050 | #8 hidden gems, the Casino Building's longer story |
| `inline-casino-arcade.jpg` | `local-casino-arcade.jpg` | 1400×1050 | #10 eat/drink, category image for "Beachside, at the Casino Building" |
| `gallery-street-painting-lake-avenue.jpg` | `local-street-painting-lake-avenue.jpg` | 900×1200 | #4 things to do, festival gallery (portrait) |
| `gallery-street-painting-carpenter-bee.jpg` | `local-street-painting-carpenter-bee.jpg` | 900×1200 | same |
| `gallery-street-painting-big-bear.jpg` | `local-street-painting-big-bear-panel.jpg` | 900×1200 | same |
| `gallery-street-painting-rose.jpg` | `local-street-painting-rose-panel.jpg` | 900×1200 | same |

The festival frames show crowds and artists at a public event. They are editorial, in an article
about that event, and no one is the subject of any frame. `local-oceanwalk-bennys-plaza.jpg` stays
out, for the reason recorded above.
