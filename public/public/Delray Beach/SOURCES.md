# Delray Beach imagery — provenance

This folder had no `SOURCES.md` until 2026-08-31. Nine other city folders have one; this was
the gap. **Provenance for the pre-existing `delray-beach-*.JPEG` files is not established** —
they predate this note and nobody recorded where they came from. Establish it before treating
any of them as safe for a new slot.

⚠️ **This folder is off-convention.** Every other city lives at `public/images/<slug>/`. This
one is `public/public/Delray Beach/` — a nested `public`, and a space in the directory name, so
it serves from `/public/Delray%20Beach/`. There are 17+ references pointing at the current path,
so moving it is a real change, not a rename. Two consequences that bite immediately:

- Markdown image syntax **cannot** take the raw space. Inline images must write
  `/public/Delray%20Beach/...`; `heroImage` strings in `articles.ts` take the literal space
  because they are plain TS strings, not markdown.
- Sorting and globbing over `public/images/` misses this folder entirely.

## Our own photography

| File | Depicts |
|---|---|
| `delray-beach-beachside-cottage.jpg` | Turquoise beachside cottage, Moke on the paver drive, Adirondack chairs — hero on `best-neighborhoods-in-delray-beach-florida` |
| `delray-beach-cottage-porch.jpg` | Pink cottage, striped awning, wicker seating — inline in that article's beachside-blocks section |

## The 2026-08-31 drop — four cottages, and why only two shipped

`IMG_6438`–`IMG_6441`, all **4032×3024**, EXIF stripped. No people in any frame. John's own,
shot on foot: his words were "just houses I saw on a walk." **They are other people's homes**,
photographed from a public street, and that is the whole reason the rest of this section exists.

Nothing here claims a street, a district or a neighbourhood. The article names Nassau Street,
Del-Ida Park and the Marina District; **these captions deliberately do not**, because nothing in
the frames establishes which block they are on. Subject-only captions, same rule as the
unlocated frames in the Hobe Sound folder.

### The address problem

Every one of the four carries a legible address at full resolution:

| Frame | What is readable |
|---|---|
| `IMG_6438` | Door plaque: **house number and street name**, both |
| `IMG_6441` | Same plaque, same house, from further right |
| `IMG_6439` | Number on the porch column, plus a doorbell camera |
| `IMG_6440` | Number twice — column and wall — plus a security-company yard sign |

Consecutive numbers, so the four are one identifiable block.

A photo of a specific house on a page that sells real estate reads as a house that is *for
sale*. That is a different bar from an unlocated landscape, and it is why the test applied here
was **legibility at delivery size**, not at source size. Each frame was downscaled to the size
it would actually ship at, then the address region was examined at 1:1.

**Result — this is the whole decision:**

- `IMG_6438` and `IMG_6441` **pass**. At 2048px banner width the plaque collapses to an
  illegible dark smudge, and at 1440px it is gone entirely. The Moke's Florida plate goes with
  it — unreadable even at a 3× enlargement of the finished banner.
- `IMG_6439` **fails as shot** — the number survives to 1400px — but the number sits at
  `x: 0.32` and the composition survives losing everything left of `x: 0.36`. Cropped, it ships.
- `IMG_6440` **fails and cannot be fixed.** The number appears twice, both instances near the
  centre of the frame, and no crop keeps the house while losing both. Retouching it out was
  rejected — this folder follows the same rule as Hobe Sound, where the Jupiter Island sign was
  *cropped* out of the city hero rather than painted out. **Unused. Do not re-chase a crop; one
  was looked for and does not exist.**

`IMG_6441` is unused for a duller reason: it is the same house as `IMG_6438` from a few steps
right, with a palm frond across the upper right. Two frames of one cottage in one article reads
as padding. It is the backup if `6438` ever needs replacing.

### `delray-beach-beachside-cottage.jpg` — the hero

Cut from **IMG_6438**, `extract({ left: 0, top: 760, width: 4032, height: 1185 })` resized to
**2048×602** (3.40:1), quality 84, 326KB. No upscale.

`top: 760` puts the roofline under the top edge and keeps the Moke, the chairs and the hedge.
The left third — where the title overlay lands — is the neighbouring condo block and tree cover,
busy but dark enough to carry text.

Replaced `delray-beach-modern-home.JPEG`, which was doing double duty as this hero **and** as
`photos[3]` in the Delray community gallery. It now does one job.

### `delray-beach-cottage-porch.jpg` — inline

Cut from **IMG_6439**, `extract({ left: 1451, top: 302, width: 2581, height: 1935 })` resized to
**1400×1050**, quality 84, 312KB.

`left: 1451` is `x: 0.36`, chosen to put the porch-column house number outside the frame. What
it costs: the left porch, its white railing and the brick path. What survives: the gable, the
striped awning, the shuttered window, the wicker set and the palm — enough that it still reads
as a renovated cottage.

This is the **first inline image in any Delray article**. The other nine run hero-only.

⚠️ `IMG_6438`–`IMG_6441` were dropped straight into this folder at 8.9MB total and are served
publicly at `/public/Delray%20Beach/IMG_6438.jpg` and so on. They are off naming convention and
they carry the readable addresses this whole note is about. **They should move to the master
library**, keeping only the two derived crops here.

## Provenance settled — 2026-09-21

John confirmed that **every photo in this folder is his own**, including the pre-existing
`delray-beach-*.JPEG` files the note above calls unestablished. Do not treat anything here as
stock. Caption checks still apply: what the frame shows versus what the caption claims.

## The 2026-09-23 drop — Delray Marketplace

`Delray-marketplace-1`–`13.jpg` (no `-11`), John's own, shot at **Delray Marketplace,
14851 Lyons Road** (West Atlantic Avenue and Lyons Road). That's west Delray in unincorporated
Palm Beach County, not the City of Delray Beach and not downtown. Frames 1–10 are 5712×4284;
12 and 13 are 4032×3024. EXIF stripped. A perceptual hash against every existing file in this
folder found no duplicates (closest distance 22).

⚠️ **`delray-beach-dining-delray-marketplace.JPEG` does not show Delray Marketplace.** It is the
**Delray Beach Market** food hall downtown. It is `photos[5]` on the Delray city entry; the
filename is wrong but the page shows a generic alt, so nothing user-facing is mislabeled.
`Delray-beach-dining-delray-market.JPEG` is a second copy of the same frame, unreferenced.

Processed for `delray-marketplace-west-delray-beach` (article order 11), resized to
**2048×1536**, q82, progressive, 500–745KB:

| File | From | Depicts | Use |
|---|---|---|---|
| `delray-marketplace-fountain-sign.jpg` | `-2` | Stone tower, "DELRAY MARKETPLACE" sign, fountain roundabout, Batch building right | Article hero |
| `delray-marketplace-fountain-sign-2.jpg` | `-9` | Same sign from the side, closer, lower | Inline |
| `delray-marketplace-storefront-drive.jpg` | `-3` | Curving brick drive, storefronts, royal palms | Inline |
| `delray-marketplace-itsugar.jpg` | `-6` | IT'SUGAR curved corner building, bench | Inline |
| `delray-marketplace-burt-and-maxs.jpg` | `-7` | Burt & Max's tower building, red umbrellas | Inline |
| `delray-marketplace-patio-umbrellas.jpg` | `-8` | Yellow patio umbrellas, parked cars | Inline |
| `delray-marketplace-hooky.jpg` | `-12` | Hooky building straight on across its plaza | Inline |
| `delray-marketplace-hooky-marquee.jpg` | `-10` | Hooky marquee close-up, IMAX sign | Processed, unused |
| `delray-marketplace-batch.jpg` | `-13` | Batch Local Kitchen and covered patio | Inline |
| `delray-marketplace-promenade-parking.jpg` | `-1` | Colonnade sidewalk and parking field | Processed, unused |

Not processed: `-4` (near-identical to `-2`) and `-5` (a second Burt & Max's angle, weaker than
`-7`).

**Plates:** `-8` shows three rear plates. At the delivery size of 2048px they are unreadable
blur even at 4× enlargement, so the frame ships as is. `-1` shows front ends only; Florida
issues no front plate. **People:** none identifiable in any processed frame.

Branding is in nearly every frame. That's the subject for an article about the center, but it
makes these a poor fit for the Delray community gallery or its OG image.

The raw `Delray-marketplace-*.jpg` originals (≈33MB) are **not committed**. Move them to the
master library with the `IMG_64xx` files.

## Still needed

Atlantic Avenue as a street rather than a restaurant frontage, the Intracoastal and the bridge,
and the beach itself. The pre-existing `delray-beach-dining-*` files cover the eating strip.

## In-article photos and galleries — 2026-09-24

All John's own. The `-inline` files are 1400×1050 web-weight copies (q80 mozjpeg, 120–400KB) so
article bodies don't load the 1–1.7MB originals. The originals are untouched.

**New from the master library `Delray Beach/` folder** (IMG_5639–5659, 2048×1536, not previously
in the repo; perceptual hash against this folder found no duplicates, closest distance 22):

| File | From | Depicts | Used on |
|---|---|---|---|
| `delray-beach-downtown-welcome-banner.jpg` | `IMG_5647` | "Welcome to Downtown Delray Beach, The Village by the Sea" DDA pole banner | #1 living-in, downtown section |
| `delray-beach-pineapple-mural.jpg` | `IMG_5654` | Pineapple mural on a two-story downtown building | #1 living-in, culture section |
| `delray-beach-east-atlantic-ave-sign.jpg` | `IMG_5639` | E Atlantic Ave mast-arm sign under palms | #2 local guide, layout |
| `delray-beach-downtown-meter-sign.jpg` | `IMG_5648` | Meter sign with posted fee hours beside a DDA banner | #2 local guide, parking. The caption does not quote hours or rates |
| `delray-beach-downtown-wayfinding.jpg` | `IMG_5653` | Wayfinding: Old School Square, City Hall, Tennis Center | #2 local guide, city services |
| `delray-beach-old-school-square-sign.jpg` | `IMG_5658` | Old School Square campus sign listing the Cornell Art Museum | #4 things to do. Caption says programming has changed and does not claim the museum is open |

Unused from that folder: `IMG_5640` (tighter crop of the Atlantic sign), `IMG_5649` (Silverball
arcade, a second angle on the #8 hero), `IMG_5659` (near-duplicate of 5658).

**Web-weight copies of existing frames:**

| File | From | Used on |
|---|---|---|
| `delray-beach-downtown-condos-inline.jpg` | `delray-beach-condo.JPEG` | #3 neighborhoods gallery, under the at-a-glance table |
| `delray-beach-townhome-row-inline.jpg` | `delray-beach-condo-4.JPEG` | same gallery |
| `delray-beach-downtown-corner-inline.jpg` | `delray-beach-condo-5.JPEG` | same gallery |
| `delray-beach-pineapple-grove-arch-inline.jpg` | `delray-beach-pineapple-grove1.JPEG` | #3, Downtown and Pineapple Grove |
| `delray-beach-condo-balconies-inline.jpg` | `delray-beach-condo-2.JPEG` | #7 cost of living, association obligations |
| `delray-beach-sidewalk-dining-inline.jpg` | `delray-beach-dining-atlantic-ave-2.JPEG` | #10 eat/drink gallery, Atlantic Avenue |
| `delray-beach-atlantic-patio-inline.jpg` | `delray-beach-dining-roccos-tacos.JPEG` | same gallery |
| `delray-beach-side-street-dining-inline.jpg` | `delray-beach-dining-park tavern.JPEG` | #10 gallery, side streets |
| `delray-beach-market-food-hall-inline.jpg` | `Delray-beach-dining-delray-market.JPEG` | same gallery |
| `delray-marketplace-promenade-parking-inline.jpg` | `delray-marketplace-promenade-parking.jpg` | #11 marketplace, practical notes |

The condo gallery is captioned by building type only. Nothing in the frames establishes which
neighborhood they are in, so the gallery sits under the at-a-glance table rather than inside a
named-district section. The #10 dining captions name no venue, matching the article, which names
none. Venue signage is incidental in our own documentary frames.

**Screened out:** `delray-beach-modern-home-3`/`-4` (a private driveway, with cars and a mailbox
filling the foreground); `Delray-beach--condo.JPEG` (legible unit number "101" and a tenant's
business name at the door); `delray-beach-condo-3.JPEG` (a single private house with a mailbox).
`delray-beach-atlantic-ave-sign.png` is an illustration, not a photograph.

### Second pass — 2026-09-24

| File | From | Used on |
|---|---|---|
| `delray-beach-lavender-condo-inline.jpg` | `Delray-beach.JPEG` | #5 who should move, property and community questions |
| `delray-beach-new-homes-street-inline.jpg` | `delray-beach-modern-home.JPEG` (a street view, not a driveway) | #6 pros and cons, after the property-options paragraph |
| `delray-marketplace-hooky-marquee-inline.jpg` | `delray-marketplace-hooky-marquee.jpg` | #9 vs nearby, western Delray section. Captioned as unincorporated county |

`delray-beach-pineapple-mural.jpg` moved from #1 to the Art Trail section of #8, where it fits better, so no two Delray articles share it.
