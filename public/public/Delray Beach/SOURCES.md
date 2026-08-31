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

## Still needed

Atlantic Avenue as a street rather than a restaurant frontage, the Intracoastal and the bridge,
and the beach itself. The pre-existing `delray-beach-dining-*` files cover the eating strip.
