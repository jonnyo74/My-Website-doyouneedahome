# Boca Raton imagery (`public/public/Boca Raton/`) — provenance

This folder had no `SOURCES.md` until 2026-09-13. It was written while auditing
`what-its-really-like-living-in-boca-raton-florida`, which uses two of these files.

⚠️ **This folder is off-convention.** Every other city lives at `public/images/<slug>/`. This
one is `public/public/Boca Raton/` — a nested `public`, and a space in the directory name, so
it serves from `/public/Boca%20Raton/`. Same shape as `public/public/Delray Beach/`; see that
folder's `SOURCES.md` for the fuller write-up. Two consequences that bite immediately:

- Markdown image syntax **cannot** take the raw space. Inline images in `articles.ts` must
  write `/public/Boca%20Raton/...`; `heroImage` strings take the **literal** space, because
  `next/image` encodes its own optimizer URL from that value.
- Anything that builds an **absolute** URL from `heroImage` — the `BlogPosting` JSON-LD
  `image`, the Open Graph `images` — must percent-encode it. Before 2026-09-13 both emitted a
  raw space. Fixed with the `absoluteImage()` helper in `src/app/blog/[slug]/page.tsx`.

## Provenance: source and licence type recorded, per-photo URLs still missing

**Corrected 2026-09-13** (this section first read "provenance is NOT established", which
overstated the gap — the adding commit was not checked at the time).

All four arrived together in commit `30d4d70`, "Add Boca Raton photos, wire up images, Ylopo
sort, and photo credits", whose message states plainly: *"Add 4 Unsplash photos for Boca Raton
(Mizner Park, oceanfront, plaza, pool)"* and *"photo credits"*. So the **source (Unsplash) and
the per-file credit were recorded contemporaneously by the session that downloaded them**, and
the [Unsplash License](https://unsplash.com/license) permits free commercial use with
attribution not required — attribution is given anyway. The licence position is sound.

What is still missing is the **audit trail**: no Unsplash photo-page URL, no CDN URL, and no
download date for any individual file, so a given file cannot be mapped back to its photographer
independently. The files themselves carry no identifying metadata either — checked on
2026-09-13: no XMP, no Artist tag, no Unsplash photo id. The only `Copyright` string in them is
the stock sRGB ICC profile boilerplate, which means nothing.

| File | Credit string in the repo | Status |
|---|---|---|
| `boca-mizner-park.jpg` | Photo by Alexander Donev / Unsplash | Unsplash per `30d4d70`; no photo-page URL |
| `boca-oceanfront.jpg` | Photo by Nigel Sarrag / Unsplash | Unsplash per `30d4d70`; no photo-page URL |
| `boca-mizner-plaza.jpg` | Photo by Valeriia Neganova / Unsplash | Unsplash per `30d4d70`; no photo-page URL |
| `boca-luxury-pool.jpg` | Photo by Brian Zajac / Unsplash | Unsplash per `30d4d70`; no photo-page URL |

**To close it out:** find each on Unsplash by subject, confirm it is the same shot, and record
the photo page URL here alongside the credit. Until then these are fine where they already run,
including as an article hero and its OG image — the licence and the credit are on record. Apply
the usual care before putting one somewhere the stakes are higher, such as a listing page.

## What the two images used by the "living in" article actually show

Subject descriptions below are from looking at the files, not from any caption:

- **`boca-mizner-park.jpg`** — portrait, 1365x2048. A pastel-pink Mediterranean-style building
  several storeys high with balconies and teal awnings, palm trees along a paved street, cars
  parked at the kerb. Used as the article hero, with alt text
  `Palm trees beside pastel Mediterranean-style buildings in Boca Raton`.
  **Note it is a portrait file in a full-bleed landscape hero**, so `object-cover` crops it
  hard top and bottom. A landscape frame would serve this slot better.
  The building is **not** identified as any specific named property, and nothing on record
  confirms the shot was taken in Boca Raton — the alt text describes the visual, and the
  article does not present it as documentary evidence of a place or a period.
- **`boca-oceanfront.jpg`** — landscape, 2048x1152. Aerial along a coastline: open water, surf
  line, beach, and a low-rise condominium line behind planting. Runs inline in the article,
  captioned by subject and credited to Nigel Sarrag per `communities.ts`.

**Captions must stay subject-based.** Do not caption either as a named neighbourhood, a
specific building, a historic Mizner structure, or as evidence of prices — the article's
earlier caption asserted "the highest prices in the city" off this aerial, which was removed on
2026-09-13 as an unsupported market claim.

## Dining and social-life images (added 2026-09-17)

Four Unsplash downloads for `best-places-to-eat-drink-hang-out-in-boca-raton-florida`, all free to use under the
[Unsplash License](https://unsplash.com/license) (checked on each photo page, not Unsplash+). Screened for no
identifiable faces, no third-party branding and no recognisable real venue — a rejected fifth candidate was dropped
because a bakery's signage was legible in frame. **None was shot in Boca Raton.** Alt text describes the scene and
never names or implies a specific restaurant, and the supporting captions say "illustrative, not a specific venue".

- **boca-dining-terrace.jpg** (3000x2000) — "An outdoor dining area with tables and chairs" by Kate Trysh (@katetrysh).
  https://unsplash.com/photos/an-outdoor-dining-area-with-tables-and-chairs-KRXX14JyFaY
  Credit: Photo by Kate Trysh / Unsplash. Hero.
- **boca-string-lights-patio.jpg** (3000x2000) — "Outdoor cafe with string lights at dusk" by Nikita Kulikov (@kulikovniki).
  https://unsplash.com/photos/outdoor-cafe-with-string-lights-at-dusk-nFRRqDEkzMs
  Credit: Photo by Nikita Kulikov / Unsplash. "Drinks and late evenings".
- **boca-latte-counter.jpg** (3000x2001) — "A person holding a cup of coffee on top of a wooden table" by Nathan Dumlao (@nate_dumlao).
  https://unsplash.com/photos/a-person-holding-a-cup-of-coffee-on-top-of-a-wooden-table-cb_ppfNXLSU
  Credit: Photo by Nathan Dumlao / Unsplash. "Coffee and daytime".
- **boca-cafe-table.jpg** (3000x1999) — "Outdoor cafe table with coffee and chairs" by Philip Flores (@pflores).
  https://unsplash.com/photos/outdoor-cafe-table-with-coffee-and-chairs-v2bG2TG6EL0
  Credit: Photo by Philip Flores / Unsplash. "Casual and family-friendly".

Derived crops live in `public/images/boca-raton/` and are recorded in that folder's SOURCES.md.

## Parking deck image (added 2026-09-17)

- **boca-parking-deck.jpg** (3000x2001) — "Empty white concrete pillared parking lot" by Claudio Schwarz (@purzlbaum),
  free to use under the [Unsplash License](https://unsplash.com/license) (checked on the photo page; not Unsplash+).
  https://unsplash.com/photos/empty-white-concrete-pillared-parking-lot-fAmj2spOqxc
  Credit: Photo by Claudio Schwarz / Unsplash. Used on: `boca-raton-downtown-parking-condo-buyers-guide`

Chosen because it carries **no text of any kind** — no signage, plates, faces or branding — on a page about one
city's parking rules. Two candidates were rejected first: the article's previous hero
(`boca-raton-parking-garage.jpg`, still on disk) shows non-US road signs and architecture, and a second candidate
had German "Lift" and "Ausfahrt" signage that survived every workable crop. It is **not** a Boca Raton facility:
the alt text says "representative image" and a visible caption under the hero says so too.
