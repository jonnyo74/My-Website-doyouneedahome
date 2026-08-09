# Port St. Lucie imagery — provenance

> ⚠️ **These four are the only stock images on the site still missing a photo credit.**
> Site policy is that any image that is not our own photography carries a credit. The table
> below records CDN URLs (`images.unsplash.com/photo-…`) rather than Unsplash photo pages,
> and a CDN URL cannot be reverse-mapped to a photographer without the Unsplash API. To
> fix: find each image on Unsplash by subject, confirm it is the same shot, then append
> ` || Photo by <Name> / Unsplash` to the caption in `articles.ts`. Record the photo page
> URL here as well as the CDN URL so this does not recur.

Files prefixed `stock-` are **licensed stock, not photographs of Port St. Lucie.**
They are used as subject-matter illustration only, and their captions in
`src/lib/articles.ts` deliberately describe the *activity or subject* rather than
asserting a location. Replace them with local photography when we have it.

| File | Source | License | Depicts |
|---|---|---|---|
| `stock-kayak-mangrove-waterway.jpg` | Unsplash — `images.unsplash.com/photo-1591057153717-8ef861f42032` | [Unsplash License](https://unsplash.com/license) — free commercial use, attribution not required | Kayak bow on a calm mangrove-lined waterway |
| `stock-baseball-diamond.jpg` | Unsplash — `images.unsplash.com/photo-1434854775064-aa2c72a4aa32` | Unsplash License | Overhead of a baseball diamond mid-pitch; no readable team branding, no identifiable faces |
| `stock-new-construction-framing.jpg` | Unsplash — `images.unsplash.com/photo-1504149269576-9900c81eb84d` | Unsplash License | Floor-joist framing on a house under construction; no people, no branding |
| `stock-farmers-market.jpg` | Unsplash — `images.unsplash.com/photo-1552825896-8059df63a1fb` | Unsplash License | Produce stall at an outdoor market; no identifiable faces |
| `stock-suburban-streetscape.jpg` | Unsplash — **FilterGrade**, [photo page](https://unsplash.com/photos/white-and-brown-painted-house-4T4AcGJvARQ), CDN `photo-1555636222-cae831e670b3` | Unsplash License | Florida master-planned streetscape: barrel-tile roofs, palms, paver drives, empty street. No people, no branding |
| `stock-aerial-rooftops.jpg` | Unsplash — **Ameer Basheer**, [photo page](https://unsplash.com/photos/aerial-photography-of-brown-houses-euyV2Ae_KX0), CDN `photo-1549861833-372c82ca6c92` | Unsplash License | Straight-down aerial of tile-roofed houses either side of a residential street |

### The two added 2026-08-09 — chosen by John, and credited properly

John picked both from Unsplash directly. **These two carry full credit lines**, unlike the
original four flagged above: `heroImageCredit` on the hero, and a `|| Photo by …` suffix on
the inline caption. Both photo pages are recorded here so the credit can never be lost again.

- `stock-suburban-streetscape.jpg` — **hero on `what-its-really-like-living-in-port-st-lucie-florida`.**
  3.4:1 band from the 3000×1986 original at `top: 800`, resized to 2400×706, q82 mozjpeg.
  Cut to keep sky, roofline and street, so the title overlay lands on road rather than roof.
- `stock-aerial-rooftops.jpg` — inline in that article's *The City Is Large and Spread Out*
  section. `extract({left:508, top:200, width:1984, height:1488})` then 1400×1050.
  **The top strip is cropped deliberately**: the full frame has a lone figure beside a
  screened pool along the top edge, and the screening rule here is no identifiable people.

The two were given different jobs on purpose. The streetscape reads aspirational and works as
the establishing image; the aerial reads uniform and slightly relentless, which is only
editorially honest where the article is making exactly that point — the grid, the absence of
a centre, and "newer areas can feel repetitive." It would be the wrong lead image.

## Why there are only four

Searching Unsplash for "port st lucie", "treasure coast florida", and
"st lucie river" returns keyword-matched noise, not this city — the top results
included a woman holding a branded coffee cup from an unrelated business and a
featureless expanse of open water. Nothing in those result sets actually depicts
Port St. Lucie.

The two files above were selected by **subject** instead, then visually verified
before use. A third candidate (a foggy lake with autumn foliage) was rejected as
obviously not Florida.

## Screening rules applied

Anything used here must be:

- **Free of identifiable people** — no likeness/release risk.
- **Free of third-party branding** — no other business's marks on our pages.
- **Plausible for the subject** — no autumn foliage, no hills, no non-Florida ecology.
- **Captioned by subject, never by place** — a stock image must never imply it
  was taken at a specific named location.

## Still needed (local photography)

Tradition Square, the North Fork riverfront and Riverwalk boardwalk, Clover Park,
PGA Village, Savannas Preserve, and the in-flight development sites. These are the
shots that would let us drop the stock entirely.
