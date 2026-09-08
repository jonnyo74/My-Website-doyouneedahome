# Florida Sun & Shade Analyzer

**Route:** `/sun-shade` — *See how sunlight moves across a property before you buy.*

A buyer types a Florida address and gets an aerial map of the property with the
estimated building shadows for any time of day, on any date of the year. Drag
the slider and the shadows sweep across the lot; switch to the winter solstice
and watch them double in length.

It exists because sun exposure is one of the few things a Florida buyer cares
about intensely — pool timing, patio timing, which balcony bakes at 4 PM — and
one of the few they cannot check from a listing photo.

---

## Contents

- [How to use it](#how-to-use-it)
- [Architecture](#architecture)
- [The shadow model](#the-shadow-model)
- [Building heights: the hard part](#building-heights-the-hard-part)
- [Exposure ratings](#exposure-ratings)
- [Address autocomplete](#address-autocomplete)
- [Data sources](#data-sources)
- [Environment variables](#environment-variables)
- [Running it](#running-it)
- [Deploying to Vercel](#deploying-to-vercel)
- [Public API](#public-api)
- [Limitations](#limitations)
- [Costs](#costs)
- [Where to extend it](#where-to-extend-it)

---

## How to use it

1. Enter a street address. The pin lands on the property.
2. If the pin sits on the street rather than the house — which the default
   geocoder does by design, see below — **drag it onto the roof**. Everything
   recomputes.
3. Drag the time slider, which spans that date's actual sunrise-to-sunset
   window, or tap a preset (8 AM / 10 AM / Noon / 2 PM / 4 PM / Sunset).
4. Switch dates. "Summer Solstice" and "Winter Solstice" are the pair worth
   comparing: in Palm Beach County the June noon sun sits near 86° and shadows
   almost vanish, while the December noon sun tops out near 39° and the same
   house throws a shadow longer than it is tall.
5. The URL updates as you go, so any view can be copied and shared.

---

## Architecture

Built into the existing Next.js 16 / React 19 / Tailwind 4 site rather than as a
separate app, so it inherits the site's header, fonts, colour tokens and
accessibility baseline.

```
src/app/sun-shade/page.tsx              Server shell: metadata, shared-link parsing
src/app/api/sunshade/
  geocode/route.ts                      Address -> coordinates (provider-swappable)
  features/route.ts                     OSM building footprints + pools for a bbox
  parcel/route.ts                       Florida statewide cadastral point lookup
  sun/route.ts                          Public solar-position endpoint

src/lib/sunshade/
  config.ts                             Every tunable assumption, in one file
  types.ts                              Shared shapes
  time.ts                               Wall-clock <-> UTC for a named timezone
  solar.ts                              SunCalc wrapper (see the units warning)
  shadows.ts                            The shadow projection engine
  heights.ts                            Height estimation ladder
  exposure.ts                           Morning / afternoon / yard sun sampling
  geo.ts                                Haversine, centroids, point-in-ring
  serverCache.ts                        In-process cache + request coalescing
  geocoders/{index,census,nominatim}.ts Provider registry

src/components/sunshade/
  SunShadeApp.tsx                       Client orchestrator: state and data flow
  SunShadeMap.tsx                       Leaflet map (client-only)
  AddressSearch.tsx  TimeSlider.tsx  DateSelector.tsx
  SunCompass.tsx     SummaryPanel.tsx  ReportCta.tsx
```

### Why Leaflet and not MapLibre GL

Leaflet was already a dependency of this site, needs no API key and no tile
provider account, and adds roughly 40 KB against MapLibre's ~800 KB. Shadows are
flat 2D polygons on the ground; nothing here needs a GL context. MapLibre
becomes the right answer only if extruded 3D buildings are added later, and the
shadow engine is independent of the renderer, so that swap stays cheap.

### What is computed where

Anything touching the network is a server route, so upstream keys, User-Agent
requirements and caching live in one place. Everything else — solar position,
shadow geometry, exposure sampling — is pure client-side maths with no network
cost, which is what lets the slider redraw at interactive speed.

---

## The shadow model

For each building footprint:

```
shadowLength = buildingHeight / tan(sunElevation)
```

The footprint is copied, the copy is translated `shadowLength` metres along the
bearing **opposite** the sun (`sunAzimuth + 180°`), and the convex hull of the
original plus the copy is the shadow. That is exactly correct for a convex
footprint and slightly generous for a concave one — an L-shaped house gets its
inner corner filled in. The trade is deliberate: one hull operation per building
instead of a per-edge sweep, and the error is far smaller than the error in the
height estimate feeding it.

### Guarding against absurd shadows

`tan` approaches zero at sunrise and sunset, so shadow length approaches
infinity. A 6 m house at 0.5° elevation computes a 688 m shadow; at 0° the
division is undefined. Two guards, both in `config.ts`:

- **`MIN_SHADOW_ELEVATION_DEG = 3`** — below this, no shadows are drawn at all.
- **`MAX_SHADOW_LENGTH_M = 250`** — a hard clamp above it.

Shadows near the horizon are also the least meaningful ones, since anything at
all in the intervening distance breaks them up.

### One MultiPolygon, not many polygons

All shadows are emitted as a single GeoJSON MultiPolygon and rendered as one
Leaflet layer. This is not tidiness: Leaflet renders it as a single SVG `<path>`
under the default `nonzero` fill rule, so overlapping shadows from neighbouring
houses paint at one flat opacity. As separate polygons each would apply its own
alpha and the overlaps would stack into dark blotches that read as "deeper
shade" and mean nothing of the kind.

---

## Building heights: the hard part

**This is the model's weakest input, and the UI says so on every property.**

Measured against OpenStreetMap in Jupiter, FL before any of this was built: of
**686 building footprints in a single residential bounding box, ZERO carried a
`height` tag** and five carried `building:levels`. Height is not a fallback
here — it is a guess almost every time.

`heights.ts` implements a ladder and reports which rung it landed on:

| Rung | Source | Confidence | Frequency in FL residential |
|---|---|---|---|
| 1 | OSM `height` tag | High | Effectively never |
| 2 | OSM `building:levels` × 3.2 m | Medium | Rare (~1%) |
| 3 | **County living area ÷ footprint ⇒ implied storeys** | Medium/Low | When the parcel lookup succeeds |
| 4 | Default 20 ft (`DEFAULT_BUILDING_HEIGHT_FT`) | Low | Most of the time |

Rung 3 is the interesting one, and only exists because the Florida statewide
cadastral layer publishes `TOT_LVG_AR` for free.

The obvious implementation compares living area to footprint and calls anything
above ~1.5 a two-storey house. **That is wrong**, and it was wrong in the first
version of this file, because the two numbers do not describe the same thing:

- `TOT_LVG_AR` counts air-conditioned space only — no garage, no lanai, no
  covered entry.
- An OSM footprint is traced from aerial imagery, so it is the whole
  **under-roof** outline, garage and lanai included.

In Florida that gap is large: a three-car garage and a 36-foot lanai can be a
third of the roof. So the model states the relationship explicitly instead —
roughly 65% of the under-roof area (`LIVING_SHARE_OF_FOOTPRINT`) is ground-floor
living space, and storeys are the living area divided by that.

Calibrated against the three listings in `listings.ts`, where the MLS storey
count is known ground truth:

| Property | Living | Footprint | Implied | True |
|---|---|---|---|---|
| 8804 Skyward St | 4,932 sq ft | 4,422 sq ft | 1.72 → **2** | 2 |
| 6145 SE Audubon Ln | 1,416 sq ft | 2,612 sq ft | 0.83 → **1** | 1 |
| 982 SW Worcester Ln | 1,710 sq ft | 2,566 sq ft | 1.03 → **1** | 1 |

The threshold this replaced called Skyward a single-storey house and so drew
half the shadow it should have. Three houses is a thin calibration set and the
UI says so — every rung-3 result is labelled "implied by county records", never
presented as fact. The signal alone never infers more than three storeys: past
that, the ratio is telling us the footprint is wrong (a traced row of
townhouses, say), not that the house is a tower.

Rung 3 applies to the searched building only — it is the one address we have
county records for. Neighbours fall through to the default.

---

## Exposure ratings

Sample points are scattered across the open ground of the lot (clipped to the
real parcel boundary when the cadastral lookup returns one, otherwise a square
around the pin), excluding anything standing on a building. The day is stepped
in 20-minute intervals from sunrise to sunset, and at each step every sample
point is tested against the shadows of buildings within 90 m.

- **Morning sun** — sunrise to solar noon
- **Afternoon sun** — solar noon to sunset
- **Pool / backyard sun** — full day, sampled at the mapped pool when
  OpenStreetMap has one, otherwise across the same open ground

The share of samples in direct sun becomes **Low** (< 40%), **Moderate**, or
**High** (≥ 72%).

The ratings are three words rather than a percentage on purpose. They account
for the house and its neighbours **and nothing else** — in particular, trees are
invisible to this model, and in Florida a single mature live oak or a row of
royal palms can matter more to a patio than the house next door. A decimal would
imply a precision the inputs cannot support.

---

## Address autocomplete

The search box predicts as you type. What it can predict depends on whether a
key is configured, and the reason is worth recording, because "add address
autocomplete" sounds like a solved problem and is not — **no free, keyless
source can do US street-address typeahead.** Four were tested against real
Florida addresses:

| Candidate | Result |
|---|---|
| Photon (komoot/OSM) | Returned *Sewanee TN* and *Sewickley PA* for `"6145 SE Audubon"`. No useful US house numbers. |
| FL cadastral `PHY_ADDR1 LIKE` | 55 s, zero rows. Full scan of 10.8M parcels. |
| US Census geocoder | Needs street **and** city. Zero matches for `"6145 SE Audubon"` or `"100 Australian Ave"`. It resolves a finished address; it cannot predict one. |
| Nominatim | Its usage policy explicitly rules out per-keystroke querying of the public instance. |

So the feature is built in two layers:

**Always on, no key.** `lib/sunshade/suggest.ts` builds an index at server start
from data this site already owns — the listings in `listings.ts` and every
community in `communities.ts`. Typing `8804`, `lotus`, `abac` or `jupit` all
predict correctly. Our own listings carry parcel-matched coordinates, so
picking one **skips geocoding entirely** and lands on the roof rather than in
the road where a street geocoder would have put it.

**Optional, keyed.** Set `GEOAPIFY_API_KEY` and real street addresses are merged
in ahead of the local matches. Geoapify is the reference implementation because
its free tier (3,000 requests/day) needs no card on file. Swapping it for Mapbox
or Google means writing one function with the same signature as
`addressSuggestions` — the route and the UI do not care.

The index is built server-side and queried through `/api/sunshade/suggest`,
because `communities.ts` is several thousand lines and must never be shipped to
the browser to be filtered on a keystroke.

The control follows the **ARIA 1.2 combobox pattern**: focus stays in the input,
`aria-activedescendant` moves the virtual cursor, options are a real
`role="listbox"`/`role="option"` structure, a live region announces the result
count, and arrow keys / Enter / Escape behave as expected. Requests are
debounced at 220 ms and every in-flight request is aborted on the next
keystroke, so a slow response can never overwrite a newer one.

---

## Data sources

Every one of these was tested against live endpoints before being chosen. The
rejections are as informative as the selections.

### Geocoding — US Census Bureau (default), Nominatim (fallback)

| | Census | Nominatim |
|---|---|---|
| Key required | No | No |
| Cost | Free | Free |
| Rate limit | None published | 1 req/sec, policy-bound |
| Coverage | US only | Global |
| Precision | Interpolated along TIGER street ranges | Often building-level |
| Licence | US public domain | ODbL |

Census is the default because it has no policy constraints to honour and no
quota to exhaust. Its cost is precision: it interpolates along a street's
address range, so the pin lands in front of the house rather than on it. The app
labels this ("matched along the street rather than to the building itself") and
lets the user drag the pin, which is both the honest presentation and a better
result than any geocoder would give.

**Swapping providers** is a one-line change: write a module exporting a
`GeocoderProvider` (see `geocoders/census.ts`), register it in
`geocoders/index.ts`, and optionally name it in `SUNSHADE_GEOCODER`. Nothing
outside that folder knows which service answered.

### Building footprints and pools — OpenStreetMap via Overpass

Coverage in Florida suburbs is good: 686 footprints in one Jupiter residential
bbox, 449 in the default 400 m fetch radius around a test property. Pools are
present but sparse (`leisure=swimming_pool`) — treated as a bonus layer, and the
pool sun rating says whether a mapped pool was actually used.

**A required detail that is easy to miss:** Overpass rejects Node's default
fetch identity. `overpass-api.de` answers **406 Not Acceptable** and
`overpass.kumi.systems` answers **429** with the body *"Please include a
meaningful User-Agent string with your requests to avoid rate-limiting."* The
route sends a real User-Agent built from `SUNSHADE_CONTACT_EMAIL`. Without it,
the map draws zero buildings and no shadows.

Overpass is a volunteer service with a two-slot concurrency limit per client.
The route mitigates accordingly: capped bbox (0.02° max), two mirrors tried in
order, a one-hour in-process cache with **request coalescing**, and a day of
edge cache. Multipolygon relations are deliberately not requested — they are
rare for detached housing and much heavier to assemble.

### Parcels — Florida Statewide Cadastral (FDOR / Florida GIO)

All 67 county appraisers submit to the Department of Revenue annually; the
result is a public ArcGIS FeatureServer with no key and no quota. It supplies
the parcel boundary and `TOT_LVG_AR`, `ACT_YR_BLT`, `NO_BULDNG`.

Two hard-won details, both discovered the slow way:

1. **`returnGeometry=true` fails outright** with *"Invalid query parameters"*
   unless `maxAllowableOffset` is also supplied. With it, the same query
   succeeds in seconds. Without it: ~55 s and an error.
2. The layer's native SR is **EPSG:3086** (Florida GDL Albers), so `outSR=4326`
   and `f=geojson` are both required to get usable lng/lat — and
   `maxAllowableOffset` is then expressed in **degrees**, not metres.

**Latency is genuinely erratic, and the service does go down.** The same point
query, measured back to back: 0.35 s, 15.1 s, 20.6 s, 47.8 s, 55.5 s. It is a
cold-start effect, not a cost of the geometry — dropping `returnGeometry` was
measured and made no difference. During one stretch of testing the service
degraded further and began answering the *identical* query — one that had
returned a full record minutes earlier — with HTTP 200 and an error body after
55 s. Treat parcel enrichment as best-effort, never as a dependency.
The app therefore never waits on it: parcel data is fetched separately from the
footprints and applied whenever it arrives. If it never arrives, the panel says
*"County records did not respond in time"* — distinct from *"no living-area
record for this parcel"*, because the latter is a claim about the property and
would be a false one.

### Aerial imagery — USGS NAIP (public domain)

The basemap is the USGS National Agriculture Imagery Program, served through
`imagery.nationalmap.gov`. It is US federal public-domain imagery: no key, no
quota, no attribution obligation beyond courtesy, and **no licensing question**
to resolve before a commercial launch.

One detail matters, because it is the reason this source looked unusable at
first. USGS publishes NAIP through two different endpoints:

| Endpoint | Behaviour |
|---|---|
| `basemap.nationalmap.gov/.../USGSImageryOnly/MapServer/tile/{z}/{y}/{x}` | Pre-cut tiles. **404s above z16** over Palm Beach County — about 2.4 m/px, too coarse to see a pool. |
| `imagery.nationalmap.gov/.../USGSNAIPImagery/ImageServer/exportImage` | Renders an arbitrary bounding box on demand. Verified at **0.39 m/px**. |

So `SunShadeMap.tsx` uses a custom `L.TileLayer` subclass that converts Leaflet
tile coordinates into a Web Mercator bbox and calls `exportImage`. That is the
whole reason for the coordinate arithmetic in `getTileUrl` — it is not
incidental complexity, it is what buys public-domain imagery at usable
resolution.

Esri World Imagery was the original choice and also serves z20, but its terms
expect an ArcGIS Location Platform account for commercial use. Since NAIP
matches it on resolution here with no such condition, Esri was dropped.

An OpenStreetMap street layer is available via the layer switcher.

### Rejected sources

| Source | Why not |
|---|---|
| **USGS `basemap.nationalmap.gov` tiles** | The *tiled* NAIP endpoint caps at z16 (~2.4 m/px). Superseded by the `imagery.nationalmap.gov` ImageServer, which serves the same public-domain imagery at 0.39 m/px — see above. |
| **Palm Beach County parcels** (`maps.co.palm-beach.fl.us`) | A cached **tile** service. Its query endpoint returns a placeholder row (`{Cached: "YES"}`), not parcel attributes. |
| **`gisws.pbcgov.org`** | Does not resolve. |
| **Photon (komoot/OSM) autocomplete** | Returned Sewanee TN and Sewickley PA for `"6145 SE Audubon"`. Its OSM index has almost no US house numbers. |
| **Cadastral `PHY_ADDR1 LIKE` prefix search** | 55 seconds and zero rows — a prefix match over 10.8M parcels with no spatial filter is a full scan. |
| **Microsoft / Google building footprints** | Better geometry than OSM in places, but carry **no height data either**, so they would not fix the model's actual weak point. |
| **OpenTopoData elevation** (`ned10m`) | Works, free, verified. Not used yet — terrain slope is a future refinement, not an MVP need. |

---

## Environment variables

**None are required.** The MVP runs with an empty environment.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `SUNSHADE_CONTACT_EMAIL` | **Strongly recommended** | `unknown-contact` | Goes into the User-Agent sent to Overpass and Nominatim. Both services ask for a real contact, and an anonymous client is the one they rate-limit first. |
| `SUNSHADE_GEOCODER` | No | `census` | Forces a provider: `census` or `nominatim`. |
| `GEOAPIFY_API_KEY` | No | — | Turns on **street-address** typeahead in the search box. Without it the box still predicts, over our own listings and communities only. See "Address autocomplete". |

Add to `.env.local` for development and to Vercel project settings for
production. See `.env.example`.

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000/sun-shade

Checks:

```bash
npx tsc --noEmit
npx eslint src/lib/sunshade src/components/sunshade src/app/sun-shade src/app/api/sunshade
npm run build
```

---

## Deploying to Vercel

Nothing special is required — it is a route in an existing Next.js app that
already deploys to Vercel. Two notes:

1. **Set `SUNSHADE_CONTACT_EMAIL`** in the project's environment variables.
   Serverless functions share outbound IPs with other tenants, which makes a
   polite, identifiable User-Agent more important in production than locally.
2. **`/api/sunshade/parcel` declares `maxDuration = 60`.** Vercel's platform
   default (10 s on Hobby) is far below what a cold cadastral query needs, and a
   truncated function is indistinguishable from a missing parcel on the client.

The in-process caches are per-instance and evaporate on redeploy, which is the
right trade — the durable cache is the `Cache-Control: s-maxage` header on each
route, served by Vercel's edge.

---

## Public API

`GET /api/sunshade/sun` is pure computation with no upstream dependency, so it
can back a property page, an embed, or a report generator without the map.

```
GET /api/sunshade/sun?lat=26.9240&lng=-80.1140&date=2026-12-21&time=13:00
```

```json
{
  "sun": { "azimuthDeg": 192.17, "elevationDeg": 38.68, "compass": "SSW", "isDaylight": true },
  "day": { "sunrise": "7:05 AM", "solarNoon": "12:19 PM", "sunset": "5:32 PM", "daylightMinutes": 627 }
}
```

`date` defaults to today and `time` to solar noon. `tz` overrides the timezone
(default `America/New_York`).

---

## Limitations

State these to anyone who uses the tool. The in-app disclaimer covers them, and
it is displayed on every result:

> Sun and shade projections are estimates based on available mapping, building,
> and solar-position data. Actual conditions may vary due to trees, structures,
> terrain, weather, and unavailable building-height information.

Specifically:

- **Trees are not modelled at all.** In Florida this is the single largest
  source of error for a patio or pool.
- **Heights are usually assumed**, not measured — see the table above.
- **Roofs are modelled as flat.** A hip or gable roof casts a slightly different
  shadow than the flat-topped extrusion used here.
- **Terrain is assumed level.** Reasonable in coastal South Florida, less so
  elsewhere.
- **Only mapped buildings cast shadows.** A structure missing from
  OpenStreetMap — a new build, a large shed, a neighbour's addition — is
  invisible to the model.
- **Screen enclosures, pergolas, awnings and fences** are not modelled.
- **Concave footprints are slightly over-shadowed** by the convex-hull method.
- **The default geocoder is street-interpolated**, so the pin needs dragging for
  best results.
- **Solstice and equinox presets use fixed dates** (20 Mar, 21 Jun, 22 Sep,
  21 Dec). The true dates drift by a day between years, which is well inside the
  model's own error.

What *is* solid is the solar geometry itself. Verified against known astronomy
for Jupiter, FL: winter solstice solar noon 38.68° elevation (theoretical
39.66°), summer solstice 83.86° at 1:00 PM against an 86.5° maximum at solar
noon, sunrise/sunset within a minute of published tables, and DST correctly
handled (12:19 PM EST in December vs 1:19 PM EDT in June).

---

## Costs

**$0/month.** Every data source is free and keyless: Census geocoding, Overpass,
the Florida cadastral layer, and Esri World Imagery under its no-key basemap
access. The only running cost is Vercel function invocations, which the caching
strategy keeps low.

The one line item that could appear later is an ArcGIS Location Platform account
for commercial imagery use — free up to 2M basemap tiles/month.

---

## Where to extend it

The seams are already in place:

| Feature | Where it goes |
|---|---|
| **Lead capture / full report** | `ReportCta.tsx` — swap the link for a form posting to a new `/api/sunshade/report-request`, modelled on `/api/leads` (honeypot, validation, Follow Up Boss event). The address already travels in the URL. |
| **Pool / backyard / balcony scores 0–10** | `exposure.ts` already computes `sunFraction`; expose it instead of bucketing to three labels. |
| **Seasonal comparison view** | Run `estimateExposure` for four dates and render side by side. Nothing else changes. |
| **Better heights (LiDAR, county building layers)** | Add a rung to the ladder in `heights.ts`. Nothing else knows where the number came from. |
| **Tree shading** | The largest accuracy win available. Needs a canopy source; the shadow engine already takes arbitrary footprints and heights. |
| **Terrain** | `api.opentopodata.org/v1/ned10m` is verified working and free (1000 calls/day). |
| **Parcel boundaries on other layers** | `parcel/route.ts` is a single upstream call behind a stable response shape. |
| **Roof orientation / solar suitability** | Footprint geometry is already loaded; derive the principal axis from the ring. |
| **Screenshot / PDF report** | The map is deterministic from the URL, so a headless render of a shared link is the cheapest path. |
| **Embeds (WordPress, property pages)** | `/api/sunshade/sun` is the data seam; an iframe of `/sun-shade?lat=…&lng=…` is the visual one. |
| **CRM / Ylopo integration** | Same pattern as the existing `/api/leads` and `/api/showing-requests` routes. |
