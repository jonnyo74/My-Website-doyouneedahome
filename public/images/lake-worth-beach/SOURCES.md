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

## Held back, not in the gallery

Still in the folder at full quality, just not wired up:

- `local-oceanwalk-bennys-plaza.jpg` — the Oceanwalk plaza and Benny's at the pier
  entrance. Good frame, but three people sit mid-ground and are recognisable if you know
  them. It was in the gallery before the festival shots arrived; dropping it resolves that
  question rather than leaving it open.
- `local-casino-arcade.jpg` — the Casino arcade straight on, café tables under the arches.
  A second angle on a building already covered by index 2.
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
