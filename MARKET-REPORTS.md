# Lead-Magnet System

Every downloadable offer on the site — the two monthly Palm Beach County market
reports and the evergreen guides — runs through one system. A visitor clicks any
CTA, fills a short form (first name, email, optional phone, buying/selling
interest), the lead goes to Follow Up Boss, and the PDF downloads immediately in
the same browser session. Area and timeline are asked afterwards, as an optional
second step, so the initial form stays short.

## The magnets

| Key | Title | Route | Kind | Published |
| --- | --- | --- | --- | --- |
| `single-family` | Palm Beach County Single Family Home Market Report | `/palm-beach-county-single-family-home-market-report` | monthly report | yes |
| `condo-townhome` | Palm Beach County Condo & Townhome Market Report | `/palm-beach-county-condo-townhome-market-report` | monthly report | yes |
| `relocation-decision-guide` | Palm Beach County vs. the Treasure Coast: 2026 Relocation Decision Guide | `/palm-beach-county-treasure-coast-relocation-guide` | evergreen guide | yes |
| `condo-due-diligence` | Florida Condo Buyer's Due-Diligence and Red-Flag Checklist | `/florida-condo-buyers-due-diligence-checklist` | evergreen guide | yes |
| `treasure-coast-market-report` | Treasure Coast Real Estate Market Report | `/treasure-coast-real-estate-market-report` | monthly report | yes |

`published: false` takes a magnet completely out of circulation: never routed
onto a page, absent from the sitemap, landing page 404s in production (it still
renders in `next dev` so the flow can be tested), download route 404s, and
`/api/leads` rejects submissions naming it.

## How it fits together

| Piece | File(s) |
| --- | --- |
| **Central registry** (titles, editions, stats, CRM tags, landing copy, next-step CTAs) | `src/lib/leadMagnets.ts` |
| **Contextual routing** (which magnet a page gets) | `src/lib/leadMagnetRouting.ts` |
| Per-magnet download suppression (localStorage) | `src/lib/leadMagnetState.ts` |
| Guide content, shared by the website and the PDF generator | `src/content/*.json` |
| PDFs (never publicly served) | `private/reports/*.pdf` |
| Guide PDF generator | `scripts/generate-guide-pdfs.mjs` + `scripts/lib/pdf.mjs` |
| Cover images (page 1 of each PDF) | `public/images/reports/*.webp` via `scripts/generate-report-covers.mjs` |
| Lead API → Follow Up Boss | `src/app/api/leads/route.ts` + `src/lib/leadHelpers.ts` |
| Token-gated PDF download | `src/app/api/reports/[reportType]/route.ts` |
| Modal, form, CTAs, sticky bar, exit intent, next-step CTA | `src/components/leadMagnet/*` |
| Shared landing-page template | `src/components/leadMagnet/LeadMagnetLanding.tsx` |

## Contextual routing

One page gets **one** primary offer. `src/lib/leadMagnetRouting.ts` is the only
place that decides which, in this priority order:

1. **Treasure Coast geography** (Stuart, Palm City, Hobe Sound, Port Salerno,
   Port St. Lucie) → Treasure Coast Market Report. If that report is ever
   unpublished again it falls back to the **Relocation Decision Guide**. A Palm
   Beach County report is never offered on these pages — different county,
   different MLS.
2. **Relocation intent** (cost of living, city-vs-city, pros and cons, who
   should move here, "living in", moving/relocating) → Relocation Decision Guide.
3. **Condo due-diligence intent** — condo/townhome content that is also about
   the *building* (high-rise, oceanfront condo, HOA, association, assessments,
   reserves, milestone inspection, buyer's guide) → Condo Due-Diligence Checklist.
4. **General Palm Beach County single-family** → Single Family Market Report.
5. **General Palm Beach County condo** → Condo & Townhome Market Report.
6. Genuinely ambiguous Palm Beach County pages → `pbc-both`, the two-report
   picker. This is the only multi-magnet value in the system.

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
Suppression is **per magnet and per edition** — taking the single-family report
no longer silences the relocation guide, and next month's edition of a report is
a fresh offer. The pre-registry `dhg-report-downloaded` flag is migrated on read.

Once a visitor holds the magnet a placement would offer, the placement renders
that magnet's `nextStep` from the registry instead (request a shortlist, ask a
condo-building question, schedule a relocation consultation), and the
exit-intent modal stands down.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `FUB_API_KEY` | **Yes (production)** | Follow Up Boss API key. Without it, production submissions return 500; local dev logs the lead and still serves the download. |
| `LEAD_MAGNET_DOWNLOAD_SECRET` | Optional | HMAC secret for download tokens. Falls back to `FUB_API_KEY`. |
| `FUB_TEAM_ASSIGNED_TO` | Optional | Exact FUB display name to assign `/sell` pricing-review leads to. Unset = Follow Up Boss's own lead distribution decides. |

Set these in Vercel → Project → Settings → Environment Variables (and in
`.env.local` for local testing).

## CRM tags applied

- `Lead Magnet - PBC Single Family Market Report`
- `Lead Magnet - PBC Condo Market Report`
- `Lead Magnet - Relocation Decision Guide`
- `Lead Magnet - Florida Condo Due Diligence`
- `Lead Magnet - Treasure Coast Market Report`
- Plus `Interest: Buying` / `Selling` / `Buying and selling` / `Just researching`
- Plus, from the optional second step, `Area: …` and `Timeline: …`

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
built on the original two-report schema keep working. Device type comes from
GA4's built-in dimensions. First-touch UTM attribution is captured in
`sessionStorage` by `src/lib/utm.ts` and survives navigation before conversion.

Never pass name, email, or phone as an event param.

## Monthly update — Palm Beach County reports

Both PDFs are generated from the repo (they used to be prepared by hand
outside it), so a monthly update is a data edit plus two commands.

1. **Edit `src/content/pbc-market.json`** — set `edition`, `dataMonth`,
   `priorMonth` and `source`, then update each report's `tiles`, `rows` and
   narrative fields from the BeachesMLS Market Snapshot.
   - **Recompute the year-over-year percentages from the raw values rather than
     copying them off the graphic.** The snapshots sometimes print a decrease
     without its minus sign, and occasionally drop the percent sign entirely.
   - Cash share is derived (paid in cash / closed sales); the snapshot only
     gives the counts.
2. **Edit `src/lib/leadMagnets.ts`** — bump `REPORT_EDITION` /
   `REPORT_DATA_MONTH`, each report's `id` and `fileName`, and refresh
   `keyStats`, `summary`, `takeaways` and the month references in
   `coverAlt`, `metaDescription` and the FAQ answers.
3. Run:
   ```bash
   node scripts/generate-pbc-reports.mjs
   node scripts/generate-report-covers.mjs
   ```
   The cover script derives its filenames from `pbc-market.json`, so there is no
   filename to keep in sync by hand.
4. Delete last month's PDFs from `private/reports/` (optional), commit, deploy.

Bumping `edition` automatically re-offers the report to visitors who downloaded
the previous one.

### PDF generation

All five PDFs are built by `scripts/lib/pdf.mjs`, a small dependency-free
writer. It embeds Liberation Sans (SIL Open Font License, shipped inside
`pdfjs-dist`) so the files render identically in every reader — without an
embedded face, a reader that substitutes draws narrow glyphs on Helvetica's
advances and the tracking looks visibly wrong, including in the build-time
rasteriser that produces the cover images.

## Updating a guide

Guide copy lives in `src/content/*.json` and is read by both the website and the
PDF generator, so they cannot drift. After editing:

```bash
node scripts/generate-guide-pdfs.mjs
node scripts/generate-report-covers.mjs
```

Counts printed on the guide landing pages ("14 areas compared", "15 checklist
sections") are derived from those files at build time, so they update themselves.

## Monthly update — Treasure Coast report

Unlike the Palm Beach County reports, this PDF is generated from the repo, so
there is no external file to prepare. First edition: August 2026, from the
BeachesMLS July 2026 Market Snapshots for Martin and St. Lucie counties.

1. **Edit `src/content/treasure-coast-market.json`** — update `dataStatus`,
   `edition`, `dataMonth`, `source`, every metric `value` / `yearOverYear`, and
   the six `narrativeSlots`.
   - **Recompute the year-over-year percentages from the raw 2026/2025 values
     rather than copying them off the graphic.** The BeachesMLS snapshots print
     some decreases without a minus sign (July 2026: Martin condo median days to
     contract read `24.7%` for a *drop* from 93 to 70) and occasionally drop the
     percent sign entirely (St. Lucie single-family inventory read `-8.2`).
   - Cash share is derived (paid-in-cash ÷ closed sales); the snapshot only
     gives the counts.
2. **Edit `src/lib/leadMagnets.ts`** — bump `TREASURE_COAST_EDITION`,
   `TREASURE_COAST_DATA_MONTH` and the entry's `id`, and refresh `keyStats`,
   `summary` and `takeaways`.
3. ```bash
   node scripts/generate-guide-pdfs.mjs
   node scripts/generate-report-covers.mjs
   ```
   The generator refuses to write a PDF while any metric is `null`, so it also
   serves as the check that step 1 is complete.

`published` is derived from `dataStatus`: setting it back to `awaiting-data`
withdraws the report completely — the landing page returns to 404-in-production,
it leaves the sitemap, and all five Treasure Coast towns fall back to the
Relocation Decision Guide rather than being offered Palm Beach County numbers.

## Adding a new magnet

1. Add a JSON content file under `src/content/` if it needs body content.
2. Add a record to `leadMagnets` in `src/lib/leadMagnets.ts`.
3. Add a route file that renders `<LeadMagnetLanding magnet={...} />`.
4. Add a build function to `scripts/generate-guide-pdfs.mjs` and an entry to
   `scripts/generate-report-covers.mjs`.
5. Give it a routing rule in `src/lib/leadMagnetRouting.ts` if it should be
   selected automatically.

The sitemap, footer link list, "also free" rails, download API and CRM payload
all read from the registry — none of them need editing.
