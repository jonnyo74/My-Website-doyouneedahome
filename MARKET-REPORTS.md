# Lead-Magnet System

Every downloadable offer on the site — the three county market reports and the
two evergreen guides — runs through one system. A visitor clicks any CTA, fills
a short form (first name, email, optional phone, buying/selling interest), the
lead goes to Follow Up Boss, and the PDF downloads immediately in the same
browser session. Area and timeline are asked afterwards, as an optional second
step, so the initial form stays short.

## The magnets

| Key | Title | Route | Kind | Published |
| --- | --- | --- | --- | --- |
| `palm-beach-county-market-report` | Palm Beach County Market Report | `/palm-beach-county-market-report` | county report | yes |
| `martin-county-market-report` | Martin County Market Report | `/martin-county-market-report` | county report | yes |
| `st-lucie-county-market-report` | St. Lucie County Market Report | `/st-lucie-county-market-report` | county report | yes |
| `relocation-decision-guide` | Palm Beach County vs. the Treasure Coast: 2026 Relocation Decision Guide | `/palm-beach-county-treasure-coast-relocation-guide` | evergreen guide | yes |
| `condo-due-diligence` | Florida Condo Buyer's Due-Diligence and Red-Flag Checklist | `/florida-condo-buyers-due-diligence-checklist` | evergreen guide | yes |

`published: false` takes a magnet completely out of circulation: never routed
onto a page, absent from the sitemap, landing page 404s in production (it still
renders in `next dev` so the flow can be tested), download route 404s, and
`/api/leads` rejects submissions naming it.

### Retired (September 2026)

The three July-data reports were removed outright — registry entries, landing
pages, PDFs, covers, content files and generators — when the August county
reports replaced them. Their URLs 301-redirect in `next.config.ts`:

| Old route | Redirects to |
| --- | --- |
| `/palm-beach-county-single-family-home-market-report` | `/palm-beach-county-market-report` |
| `/palm-beach-county-condo-townhome-market-report` | `/palm-beach-county-market-report` |
| `/treasure-coast-real-estate-market-report` | `/martin-county-market-report` |

Their keys (`single-family`, `condo-townhome`, `treasure-coast-market-report`)
no longer validate, so the download API 404s and `/api/leads` returns 400 for them.

## How it fits together

| Piece | File(s) |
| --- | --- |
| **Central registry** (titles, editions, stats, CRM tags, landing copy, next-step CTAs) | `src/lib/leadMagnets.ts` |
| **Contextual routing** (which magnet a page gets) | `src/lib/leadMagnetRouting.ts` |
| Per-magnet download suppression (localStorage) | `src/lib/leadMagnetState.ts` |
| Guide content, shared by the website and the PDF generator | `src/content/*.json` |
| County report data, shared by the PDF kit and the landing-page tables | `scripts/pbc-county-report/data/*-market-*.json` |
| PDFs (never publicly served) | `private/reports/*.pdf` |
| County report PDF kit | `scripts/pbc-county-report/` (`build.py`, see its README) |
| Guide PDF generator | `scripts/generate-guide-pdfs.mjs` + `scripts/lib/pdf.mjs` |
| Cover images (page 1 of each PDF) | `public/images/reports/*.webp` via `scripts/generate-report-covers.mjs` |
| Lead API → Follow Up Boss | `src/app/api/leads/route.ts` + `src/lib/leadHelpers.ts` |
| Token-gated PDF download | `src/app/api/reports/[reportType]/route.ts` |
| Modal, form, CTAs, sticky bar, exit intent, next-step CTA, county tables | `src/components/leadMagnet/*` |
| Shared landing-page template | `src/components/leadMagnet/LeadMagnetLanding.tsx` |

## Contextual routing

One page gets **one** primary offer. `src/lib/leadMagnetRouting.ts` is the only
place that decides which, in this priority order:

0. **Jupiter Island** (the one named exception) → the Martin County and Palm
   Beach County reports side by side, as a picker (`martin-and-palm-beach-county`,
   the only multi-magnet selection). The town is in Martin County, but
   `communities.ts` files it as a Jupiter neighborhood.
1. **Treasure Coast geography** → that county's own report.
   - **Martin County** (Stuart, Palm City, Hobe Sound, Port Salerno) → Martin
     County Market Report.
   - **St. Lucie County** (Port St. Lucie) → St. Lucie County Market Report.

   A Martin page never gets the St. Lucie report or the reverse, and neither
   ever gets the Palm Beach County report. If a county report is unpublished,
   its pages fall back to the **Relocation Decision Guide**, as does any
   `region: 'Treasure Coast'` community whose slug is in neither county list.
   The city lists live in `MARTIN_COUNTY_CITY_SLUGS` /
   `ST_LUCIE_COUNTY_CITY_SLUGS` and mirror `CITY_REGIONS` in `articles.ts`.
   The pathname fallback matches a slug only as a whole hyphen- or
   slash-delimited run, so it can't fire on a longer slug that happens to
   contain it.
2. **Relocation intent** (cost of living, city-vs-city, pros and cons, who
   should move here, "living in", moving/relocating) → Relocation Decision Guide.
3. **Condo due-diligence intent** — condo/townhome content that is also about
   the *building* (high-rise, oceanfront condo, HOA, association, assessments,
   reserves, milestone inspection, buyer's guide) → Condo Due-Diligence Checklist.
4. **Everything else** → Palm Beach County Market Report, which covers both
   property types. The homepage, `/sell` and `/communities` offer it directly.

Community and blog routes publish their decision as
`<meta name="lead-magnet-selection">`, and the sitewide sticky bar and
exit-intent offer read it — so the interruption can never promote a different
magnet from the CTAs in the page body. Routes that don't publish one fall back
to the pathname.

The sitewide layer is suppressed entirely on `/contact`, on `/sell` and
`/sell/[agent]` (the valuation funnel has its own form), and on every magnet's
own landing page.

## Suppression and the next step

`localStorage: dhg-lead-magnet-downloads` holds a `{ magnetKey: edition }` map.
Suppression is **per magnet and per edition** — taking one county report does
not silence the relocation guide, and next month's edition of a report is a
fresh offer.

Once a visitor holds the magnet a placement would offer, the placement renders
that magnet's `nextStep` from the registry instead (request neighborhood numbers,
start a strategy conversation, schedule a relocation consultation), and the
exit-intent modal stands down.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `FUB_API_KEY` | **Yes (production)** | Follow Up Boss API key. Without it, production submissions return 500; local dev logs the lead and still serves the download. |
| `LEAD_MAGNET_DOWNLOAD_SECRET` | Optional | HMAC secret for download tokens. Falls back to `FUB_API_KEY`. |
| `FUB_TEAM_ASSIGNED_TO` | Optional | Exact FUB display name to assign `/sell` pricing-review leads to. Unset = Follow Up Boss's own lead distribution decides. |

Set these in Vercel → Project → Settings → Environment Variables (and in
`.env.local` for local testing). `.env.local` carries the live FUB key: to test
the form locally without creating real leads, start `next dev` with
`FUB_API_KEY=` already set to an empty string in the process environment — Next
never overrides a variable that is already defined.

## CRM tags applied

- `Lead Magnet - Palm Beach County Market Report`
- `Lead Magnet - Martin County Market Report`
- `Lead Magnet - St. Lucie County Market Report`
- `Lead Magnet - Relocation Decision Guide`
- `Lead Magnet - Florida Condo Due Diligence`
- Plus `Interest: Buying` / `Selling` / `Buying and selling` / `Just researching`
- Plus, from the optional second step, `Area: …` and `Timeline: …`

No longer applied (retired September 2026): `Lead Magnet - PBC Single Family
Market Report`, `Lead Magnet - PBC Condo Market Report`,
`Lead Magnet - Treasure Coast Market Report`.

Seller valuation leads carry `Seller Lead`, `Home Valuation Request`, and either
`Agent: John Oliver` / `Agent: Christine Dekant` (from `/sell/[agent]`) or
`Seller Lead - Team Pricing Review` (from the neutral `/sell` review).

The FUB note records magnet title + edition + id, conversion page URL, page
category, CTA placement, timestamp, UTM source/medium/campaign/content, and
referrer.

## Analytics (GA4)

Events: `lead_magnet_view`, `lead_magnet_click`, `lead_magnet_modal_open`,
`lead_magnet_form_start`, `lead_magnet_submit`, `lead_magnet_error`,
`lead_magnet_download`, `lead_magnet_followup_submit`,
`lead_magnet_next_step_click`.

Params: `magnet_key`, `magnet_id`, `magnet_kind`, `magnet_edition`,
`cta_location`, `page_category`, `page_url`. `report_type` and `report_edition`
are still emitted as aliases of `magnet_key` / `magnet_edition` so GA4 reports
built on the original schema keep working. Device type comes from GA4's built-in
dimensions. First-touch UTM attribution is captured in `sessionStorage` by
`src/lib/utm.ts` and survives navigation before conversion.

Never pass name, email, or phone as an event param.

## Monthly update — county reports

All three county PDFs are built by the kit in `scripts/pbc-county-report/`
(`build.py`, see its README). The edition month and the data month are the same
month.

1. Build the new PDFs with the kit and drop them into `private/reports/`.
   - **Recompute the year-over-year percentages and cash shares from the raw
     values** rather than copying them off the source graphic.
2. **Edit `src/lib/leadMagnets.ts`** — bump `COUNTY_REPORT_EDITION`,
   `COUNTY_REPORT_DATA_MONTH` and `COUNTY_REPORT_SOURCE`, each entry's `id` and
   `fileName`, and refresh `keyStats`, `summary`, `takeaways`, `metaDescription`
   and the FAQ answers from the new data files. Re-read every sentence: past
   activity only, and small condo samples must never read as a blanket change in
   values.
3. Point the data imports in `src/app/palm-beach-county-market-report/page.tsx`,
   `src/app/martin-county-market-report/page.tsx` and
   `src/app/st-lucie-county-market-report/page.tsx` at the new month's files
   (the tables render from them). Commit those data files — the build needs them.
4. Update the three file paths in `scripts/generate-report-covers.mjs`, then run
   `node scripts/generate-report-covers.mjs`.
5. Delete last month's PDFs from `private/reports/`, commit, deploy.

Bumping the edition automatically re-offers the report to visitors who
downloaded the previous one.

## Updating a guide

Guide copy lives in `src/content/*.json` and is read by both the website and the
PDF generator, so they cannot drift. After editing:

```bash
node scripts/generate-guide-pdfs.mjs
node scripts/generate-report-covers.mjs
```

Counts printed on the guide landing pages ("14 areas compared", "15 checklist
sections") are derived from those files at build time, so they update themselves.

Both guide PDFs are built by `scripts/lib/pdf.mjs`, a small dependency-free
writer. It embeds Liberation Sans (SIL Open Font License, shipped inside
`pdfjs-dist`) so the files render identically in every reader — without an
embedded face, a reader that substitutes draws narrow glyphs on Helvetica's
advances and the tracking looks visibly wrong, including in the build-time
rasteriser that produces the cover images.

## Adding a new magnet

1. Add a JSON content file under `src/content/` if it needs body content.
2. Add a record to `leadMagnets` in `src/lib/leadMagnets.ts`.
3. Add a route file that renders `<LeadMagnetLanding magnet={...} />`.
4. Add a build function to `scripts/generate-guide-pdfs.mjs` (or build it with
   the county kit) and an entry to `scripts/generate-report-covers.mjs`.
5. Give it a routing rule in `src/lib/leadMagnetRouting.ts` if it should be
   selected automatically.

The sitemap, "also free" rails, download API and CRM payload all read from the
registry. The footer link list in `src/components/Footer.tsx` is hand-maintained.
