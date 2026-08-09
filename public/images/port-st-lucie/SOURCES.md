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

## ⚠️ Unsplash+ is not the Unsplash License — check every time

Searching Unsplash for a neighbourhood aerial on 2026-08-09 surfaced a strong candidate
(Davey Gravy, "an aerial view of a neighborhood with lots of houses", `R-RPNzFhG5k`) that
turned out to carry the **Unsplash+ License** — a paid-subscription licence, not the free
commercial one every other file in this folder uses. It was dropped for that reason alone.

Unsplash+ results sit inline with free results and look identical in search. **Confirm the
licence on the photo page before downloading**, not after. Every file in this folder is
plain Unsplash License; keep it that way unless someone buys a subscription and records it.

## Still needed (local photography) — John is shooting these

John said on 2026-08-09 he would go and take these himself, which is the right answer: three
separate attempts at PSL stock have now produced only four usable images, none big enough
for a hero. Priority order for a single trip, highest value first:

1. **The Port District / Pioneer Park** — riverfront, the boardwalk, the overwater stage.
   Feeds the local guide, hidden gems and things-to-do, and it is the city's biggest recent
   change. Nothing we hold shows it at all.
2. **Tradition Square** — the walkable centre. Feeds the local guide, neighbourhoods and
   the eat-and-drink guide.
3. **Two residential streets** — one established in St. Lucie West, one new-construction in
   Tradition. The neighbourhoods guide is built on exactly that contrast and currently
   illustrates it with nothing.
4. **Clover Park** exterior, and **PGA Village** — things-to-do and neighbourhoods.
5. **Savannas Preserve** and the North Fork — hidden gems.

### Shooting notes, learned the hard way today

- **Shoot horizontal, and leave room top and bottom.** Article heroes are cut to 3.4:1
  bands. A tight composition cannot be cropped to that without losing its subject.
- **A 4:3 full frame is the most useful thing you can bring back**, because it yields both a
  3.4:1 article banner *and* a community-page hero. The community hero is `72vh`, which is
  roughly 0.64:1 on a phone — a 3.4:1 banner shows only 19% of its width there. That is why
  Port Salerno needed the original frame re-shot in from the archive rather than the banner.
- **No identifiable people**, and no third-party business signage in frame.
- Shoot the same subject a few paces apart. Two Bridge Road frames metres apart gave Hobe
  Sound two different-looking heroes; one frame would have given us one.
