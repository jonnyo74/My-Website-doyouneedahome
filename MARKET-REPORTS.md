# Market-Report Lead Magnet System

Two monthly Palm Beach County market reports (Single Family Home / Condo &
Townhome) are used as lead magnets sitewide. A visitor clicks any report CTA,
fills a short form (first name, email, optional phone, buying/selling interest),
the lead goes to Follow Up Boss, and the PDF downloads immediately in the same
browser session.

## How it fits together

| Piece | File(s) |
| --- | --- |
| **Central config** (titles, edition, stats, CRM tags, landing copy) | `src/lib/marketReports.ts` |
| Report PDFs (never publicly served) | `private/reports/*.pdf` |
| Cover images (generated from PDF page 1) | `public/images/reports/*.webp` via `scripts/generate-report-covers.mjs` |
| Lead API → Follow Up Boss | `src/app/api/leads/route.ts` + `src/lib/leadHelpers.ts` |
| Token-gated PDF download | `src/app/api/reports/[reportType]/route.ts` |
| Modal, form, CTAs, sticky bar, exit intent | `src/components/leadMagnet/*` |
| Landing pages | `/palm-beach-county-single-family-home-market-report`, `/palm-beach-county-condo-townhome-market-report` |

Report selection is automatic: condo keywords (condo, townhome, high-rise, 55+,
…) pick the condo report; single-family keywords (house, estate, gated/golf
community, neighborhood, …) pick the SFH report; ambiguous pages show both and
the modal lets the visitor choose. Logic lives in `selectReportFromText` /
`selectReportForCommunity` / `selectReportForArticle` in `marketReports.ts`.

Placements: community pages (inline + desktop sidebar), blog posts (inline at
~30% of long articles + end-of-article), home //buy//sell//communities (two-card
section or inline), footer links, plus a sitewide dismissible mobile sticky bar
(after 25% scroll, 7-day snooze) and a desktop exit-intent modal (max once per
30 days). Both stand down permanently once a visitor downloads a report
(`localStorage: dhg-report-downloaded`).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `FUB_API_KEY` | **Yes (production)** | Follow Up Boss API key — same one used by condowpb.com. Without it, production submissions return 500; local dev logs the lead and still serves the download. |
| `LEAD_MAGNET_DOWNLOAD_SECRET` | Optional | HMAC secret for download tokens. Falls back to `FUB_API_KEY`. |

Set these in Vercel → Project → Settings → Environment Variables (and in
`.env.local` for local testing).

## CRM tags applied

- Single family report → `Lead Magnet - PBC Single Family Market Report`
- Condo report → `Lead Magnet - PBC Condo Market Report`
- Plus `Interest: Buying` / `Selling` / `Buying and selling` / `Just researching`

The FUB note records report name + edition, conversion page URL, page category,
CTA placement, timestamp, UTM source/medium/campaign, and referrer.

## Analytics (GA4)

Events: `lead_magnet_view`, `lead_magnet_click`, `lead_magnet_modal_open`,
`lead_magnet_form_start`, `lead_magnet_submit`, `lead_magnet_error`,
`lead_magnet_download` — each with `report_type`, `report_edition`,
`cta_location`, `page_category`, `page_url` params. (Device type comes from
GA4's built-in dimensions.)

## Monthly update — the only routine you need

1. **Drop the new PDFs** into `private/reports/` (any filename, e.g.
   `pbc-single-family-home-market-report-august-2026.pdf`).
2. **Edit `src/lib/marketReports.ts`** — for each report update:
   - `fileName` (new PDF filename)
   - `id` (bump the month, e.g. `pbc-single-family-report-2026-08`)
   - `REPORT_EDITION` / `REPORT_DATA_MONTH` at the top ('August 2026' / 'July 2026')
   - `keyStats`, `marketSummary`, `takeaways` (numbers from the new report)
   - Skim `ctaHeadline` / FAQ answers for month references.
3. **Regenerate the covers**: update the two filenames at the top of
   `scripts/generate-report-covers.mjs`, then run:
   ```bash
   node scripts/generate-report-covers.mjs
   ```
4. Delete last month's PDFs from `private/reports/` (optional), commit, deploy.

Every CTA, modal, landing page, sitemap entry, and the download API read from
that one config file — nothing else needs editing.
