# Port St. Lucie imagery — provenance

> ⚠️ **These four are the only stock images on the site still missing a photo credit.**
> (As of 2026-08-19 one of the four, `stock-baseball-diamond.jpg`, is no longer referenced
> anywhere — see the local-photography section at the bottom. Three remain live.)
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

| `stock-community-road-aerial.jpg` | Unsplash — **Ameer Basheer**, [photo page](https://unsplash.com/photos/aerial-photo-of-houses-yyjdnaGs8rY), CDN `photo-1549998288-28f24e55577a` | Unsplash License | Oblique aerial: road running through a Florida planned community, tile roofs, screened lanais, lakes with a fountain. **Shot in Fort Myers, FL** |
| `stock-lakefront-community-aerial.jpg` | Unsplash — **Robert Bye**, [photo page](https://unsplash.com/photos/aerial-photography-of-body-of-water-surrounded-with-buildings-BkbGXp1w2Sk), CDN `photo-1538513378193-915936c7c018` | Unsplash License | Top-down aerial of a Florida lakefront community: tile roofs, screened pools, private docks, mature oaks, curving streets. **Shot in Windermere, FL** |

### The two heroes added for blogs 2 and 3 — 2026-08-09

Both picked by John, both real Florida photographs under the plain Unsplash License, both
carrying `heroImageCredit`. Cut to the standard 2400×706 article banner.

- `stock-community-road-aerial.jpg` — **hero on `local-guide-to-port-st-lucie-florida`.**
  `extract({left:0, top:300, width:3000, height:882})` from the 3000×1688 original.
  ⚠️ **The `top: 300` is not aesthetic — it removes a burned-in text banner.** The source
  frame carries the photographer's own overlay reading "DOWNTOWN || COLORADO RIVER || AUSTIN
  TEXAS" across the top, which is both third-party text on our page and factually wrong for
  a Fort Myers photograph. Do not re-cut this one higher.
  Chosen because the article is about districts and the roads connecting them, and the frame
  is literally a road running through a planned community.
- `stock-lakefront-community-aerial.jpg` — **hero on `best-neighborhoods-in-port-st-lucie-florida`.**
  `extract({left:0, top:700, width:3000, height:882})` from the 3000×2248 original.
  Chosen because the neighbourhoods guide is organised around objective characteristics —
  lot size, water frontage, density, dock access — and a top-down frame shows all of them at
  once in a way a streetscape cannot.

Neither was shot in Port St. Lucie, so both are captioned and credited by subject, never by
place, in line with the rule at the top of this file.

### Rejected on 2026-08-09, and why — read before repeating the search

- **Davey Gravy, `R-RPNzFhG5k`** — Unsplash+ licence. See the warning above.
- **Thomas Boxma, `An8rBraaLPk`** (boardwalk) — Unsplash+. The CDN host is the giveaway:
  Unsplash+ assets serve from `plus.unsplash.com`, free ones from `images.unsplash.com`.
- **Guille Pozzi, `g3esK1uXCjM`** (palm-lined road) — free licence, but the original is
  1500×2250 **portrait**. Nothing portrait can yield a 3.4:1 banner.
- **CHUTTERSNAP, `r7dBK7gHZJ4`** ("aerial view photography of houses") — free licence and
  correct subject on paper, but opening it showed a dense Asian city: shophouses, rooftop
  terraces, a red double-decker bus. Nothing like Florida suburbia. **This is exactly why the
  rule is to open the file before recommending it.**
- **Brian Zajac, `SHb20XQreeg`** ("a row of white houses next to a lush green park") — free
  licence and genuinely Jacksonville, FL, but it is a **3D architectural rendering**, not a
  photograph. A render has no place illustrating real neighbourhoods on a brokerage site.

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

## Hero for `build-on-your-own-lot-port-st-lucie-florida` — REJECTED CANDIDATES, still needed

This article has no hero as of 2026-08-09. Three stock candidates were screened and all three
failed the same test, so do not retry this search without reading the reason.

**Florida residential is concrete block on slab-on-grade.** Stock "house under construction"
photography is overwhelmingly wood-frame, and the wrong construction method is an immediate tell
to the exact audience this article is written for — buyers about to walk into builder sales
offices, and the builders themselves. This is a stricter bar than the other PSL heroes needed,
because streetscapes and aerials are regionally ambiguous and framing is not.

Rejected:

| Candidate | Why rejected |
| --- | --- |
| Aerial of slabs poured on individual lots (Perth, AU) | Perfect subject — lots at different stages, bare pads, one finished house. But Perth's orange iron-rich soil and a corrugated metal roof. Florida sand is pale grey. |
| `photo-1504149269576-9900c81eb84d` framing shot at 3000×2000 | Elevated wood floor-joist framing over a crawlspace, chain-link and utility poles — Pacific Northwest. Note this file is ALREADY inline in three PSL articles at 1400×1050; that is pre-existing and worth revisiting. |
| Unsplash CMU/concrete-block searches | Return wall textures and industrial blockwork, not residential construction. No usable frame found. |

**What to shoot instead (John, on his PSL trip):** block walls going up on a scattered lot, a bare
platted lot with the road frontage visible, or a slab poured and waiting. Any of the three beats
every stock option, and the article's whole argument is first-hand local knowledge — a stock hero
actively undercuts it.

---

## John's own photography — added 2026-08-19

**First local photography for Port St. Lucie.** Seventeen frames shot by John on a Port
St. Lucie trip: seven at Clover Park, ten at PGA Golf Club and PGA Village. Ours outright,
so no credit line, no licence question, and the captions can finally assert the location
instead of dancing around it the way the `stock-` files have to.

Originals (`IMG_6443`–`IMG_6459`, 4032×3024 and 5712×4284) are left untracked in this
folder, matching how `port-salerno` keeps its `IMG_*` source frames. Only the derived
`local-` files below are committed.

| File | From | Size | Depicts | Wired to |
|---|---|---|---|---|
| `local-pga-golf-club-allee.jpg` | `IMG_6455` | 2400×1350 | PGA Golf Club palm allée: twin rows of cabbage palms down a striped centre green to the clubhouse clock tower, cumulus behind. No faces; a few distant parked vehicles at the right edge | `communities.ts` → `port-st-lucie` **hero + OG image** (since 2026-09-05) |
| `local-clover-park-entrance.jpg` | `IMG_6443` | 2400×1350 | Clover Park's main entrance head-on, "cloverpark" and Mets signage, cumulus behind | city gallery (was hero + OG until 2026-09-05) |
| `local-clover-park-banner.jpg` | `IMG_6443` | 2400×706 | Same frame, cut to the standard article banner | hero on `best-things-to-do-in-port-st-lucie-florida` |
| `local-clover-park-facade.jpg` | `IMG_6446` | 1600×1200 | Three-quarter view of the front, Mets script, flags | St. Lucie West section of `local-guide-to-port-st-lucie-florida`; city gallery |
| `local-clover-park-plaza.jpg` | `IMG_6449` | 1600×1200 | Entrance plaza, Mets window graphics, oversized Adirondack chair | city gallery |
| `local-clover-park-mets-chair.jpg` | `IMG_6447` | 1600×1200 | The Adirondack chair close in, Mets window wall behind | spring-training section of `best-things-to-do-in-port-st-lucie-florida` |
| `local-pga-village-clock-tower.jpg` | `IMG_6459` | 1600×1200 | PGA Village clock tower on its planted roundabout | golf section of `best-things-to-do-…`; city gallery (bento tall slot) |
| `local-pga-golf-club-drive.jpg` | `IMG_6454` | 1600×1200 | Palm allée up to the clubhouse cupola | golf section of `best-neighborhoods-in-port-st-lucie-florida`. Pulled from the city gallery 2026-09-05 — near-duplicate of the `IMG_6455` allée now used as hero |
| `local-pga-golf-club-welcome.jpg` | `IMG_6453` | 1600×1200 | "Welcome to PGA Golf Club" entrance sign, palms, roundabout | PGA Village section of `local-guide-to-port-st-lucie-florida` |
| `local-pga-practice-range.jpg` | `IMG_6451` | 1600×1200 | Practice range wide, carts, two distant unidentifiable figures | city gallery |
| `local-pga-golf-club-sign.jpg` | `IMG_6450` | 1600×1200 | `PGA GOLF CLUB · 1916 PERFECT DRIVE` monument sign | not yet wired — held for the golf article |

### Hero swap — 2026-09-05

The city hero was Clover Park's entrance, which made the card for a city of ~250,000 read as a
Mets spring-training page — and put third-party team branding in the OG image every time the page
was shared. Replaced with `local-pga-golf-club-allee.jpg`, cut from `IMG_6455` (5712×4284):
`extract({left:0, top:0, width:5712, height:3213})` then resized to 2400×1350, which trims 1071px
of foreground grass and keeps the full palm canopy. Still our own photograph, still Port St. Lucie.

⚠️ Caveat carried over from the section below: this is PGA **Village / Golf Club, Port St. Lucie**,
not PGA National in Palm Beach Gardens. Do not let a caption drift into the wrong one.

### ⚠️ These are PGA **Village / Golf Club, Port St. Lucie** — not PGA National

The two are 50 miles apart and the name collides badly. PGA National is in **Palm Beach
Gardens** and has its own folder at `../pga-national/`, which is short on photography and
therefore exactly where someone will be tempted to reach for these. Don't. The tells in
these frames are unambiguous: the monument sign reads **1916 Perfect Drive**, and the
clock tower reads **PGA Village**. Neither exists in Palm Beach Gardens.

### On the branding in these frames

Both sets carry a venue's own marks — Mets and Clover Park logos on the ballpark, the PGA
of America roundel on the club's signage. That is deliberately treated as different from
the problem recorded in `../pga-national/SOURCES.md`, where Honda Classic spectator photos
were pulled: there the subjects were **identifiable professional athletes** and the marks
were **sponsors'** rather than the venue's. Here the subject is a building, the marks are
the building's own identity, and there is no identifiable person in any committed frame.

Screened out on the same reasoning:

- **`IMG_6448`** — three Mets heritage banners (1969, 1986) with player photography filling
  the frame. The player likenesses *are* the subject here rather than incidental
  architecture, which puts it in the same bucket as the Honda Classic set. Left untracked.
- `IMG_6447` and `IMG_6449` keep small player murals on the orange panels at the edge of
  frame. Judged incidental — architectural cladding on a building shot as a building. Flag
  raised, not a legal opinion; same caveat as the PGA National file.

### Knock-on: `stock-baseball-diamond.jpg` is now unused

It was the illustration for spring training and has been replaced by
`local-clover-park-mets-chair.jpg`. The file is still committed but nothing references it.
That takes the uncredited-stock list at the top of this file from four files to three.
