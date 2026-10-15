# Handoff: wire the Martin County and St. Lucie County market reports into doyouneedahome.com

You are working in the doyouneedahome.com repo (Next.js 16, App Router, Tailwind v4, deployed on Vercel).
**Read `AGENTS.md` first.** This Next.js version has breaking changes compared with your training data;
check `node_modules/next/dist/docs/` before writing route or metadata code. Also read `MARKET-REPORTS.md`,
which documents the lead-magnet system end to end.

## Goal
Publish two new standalone lead magnets, and send each Treasure Coast page to the report for **its own county**:

| New key | Title | PDF (already in repo) | Pages that should offer it |
| --- | --- | --- | --- |
| `martin-county-market-report` | Martin County Market Report | `private/reports/martin-county-market-report-august-2026.pdf` | Martin County geography: `stuart`, `palm-city`, `hobe-sound`, `port-salerno` (+ any other Martin County slug you find) |
| `st-lucie-county-market-report` | St. Lucie County Market Report | `private/reports/st-lucie-county-market-report-august-2026.pdf` | St. Lucie County geography: `port-st-lucie` (+ any other St. Lucie County slug you find) |

Jonny's decision (the owner): **Martin gets Martin, St. Lucie gets St. Lucie.** A Martin page must never offer the
St. Lucie report, and neither county page should offer a Palm Beach County report.

## Source of truth for the numbers
Both PDFs contain **August 2026** data. Every figure, % change, cash share and interpretation for the
landing pages must come from these files. **Do not reuse the July 2026 numbers** in `src/content/treasure-coast-market.json`
or anywhere else on the site.

- `scripts/pbc-county-report/data/martin-market-2026-08.json` + `martin-narrative-2026-08.json`
- `scripts/pbc-county-report/data/st-lucie-market-2026-08.json` + `st-lucie-narrative-2026-08.json`

Edition = `August 2026`, data month = `August 2026` (unlike the existing PBC reports, whose edition is August but
data month is July). Add new constants for this; do not repurpose `REPORT_DATA_MONTH` or `TREASURE_COAST_DATA_MONTH`.
Source line: `MIAMI REALTORS® + RWorld, based on Florida Realtors® data, August 2026.`
Wording rules carried over from the PDFs: past activity only, no predictions, no appraisal or valuation claims, no
investment advice. Martin condo median (+20.7%) is based on only 61 closings and St. Lucie condo median (+7.2%) on
only 80. Never present either as a blanket value increase. Do not add city-level statistics.

## What to change

1. **Registry: `src/lib/leadMagnets.ts`.** Add both keys to `LeadMagnetKey` and add a full `LeadMagnet` record for each,
   following the existing `treasure-coast-market-report` entry as the pattern: `kind: 'market-report'`, `fileName`,
   `landingPage`, `crmTag` (`Lead Magnet - Martin County Market Report` / `Lead Magnet - St. Lucie County Market Report`),
   CTA copy, meta title and description, `coverImage` / `coverImageLarge` / `coverAlt`, `keyStats`, `summary`,
   `takeaways`, FAQs, `nextStep`, and `published: true`.
   Check `isValidMagnetKey` in `src/lib/leadHelpers.ts` and `/api/leads` so both keys pass validation.
2. **Landing pages.** Add `src/app/martin-county-market-report/page.tsx` and `src/app/st-lucie-county-market-report/page.tsx`,
   each rendering `<LeadMagnetLanding magnet={...} />` (see `src/app/treasure-coast-real-estate-market-report/page.tsx`).
   If you want data tables on the page, build them from the JSON files above, not from `treasure-coast-market.json`.
3. **Routing: `src/lib/leadMagnetRouting.ts`.** Replace the single Treasure Coast rule with county-aware rules:
   - Split `TREASURE_COAST_CITY_SLUGS` into `MARTIN_COUNTY_CITY_SLUGS` and `ST_LUCIE_COUNTY_CITY_SLUGS`.
   - Update `selectMagnetForCommunity`, `selectMagnetForArticle` and `selectMagnetForPath` so each returns the
     matching county report.
   - `selectMagnetForCommunity` currently also matches on `community.region === 'Treasure Coast'`. Audit
     `src/lib/communities.ts` and `src/lib/articles.ts` (`REGION_GROUP` / `CITY_REGIONS`) for every Treasure Coast entry
     and map each one to a county. If a community's county cannot be determined from its city slug, **list it in your
     report to Jonny** instead of guessing.
   - Watch for path collisions: `isTreasureCoastPath` uses `pathname.includes(slug)`, and a slug like `palm-city` or
     `port-st-lucie` could appear inside unrelated URLs. Check the county detection doesn't misfire.
   - Keep the "never offer a Palm Beach County report on these pages" guarantee.
   - Update the header comment and the rule list in `MARKET-REPORTS.md` to match.
4. **Covers.** Add both PDFs to `REPORTS` in `scripts/generate-report-covers.mjs` (`martin-county-cover`,
   `st-lucie-county-cover`) and run `node scripts/generate-report-covers.mjs`. Confirm the four `.webp` files are
   written to `public/images/reports/` and look right.
5. **Vercel file tracing.** Open `next.config.ts` and confirm `outputFileTracingIncludes` for
   `/api/reports/[reportType]` includes the new PDFs (for example a `private/reports/**` glob). If it lists files
   explicitly, add both, or the download will return 500 in production.
6. **Existing Treasure Coast report.** After routing changes, no page will offer `treasure-coast-market-report` (it has
   July data). **Do not delete it, unpublish it or add redirects.** Leave it working and report back so Jonny can choose
   between keeping it, 301-redirecting its URL, or withdrawing it.
7. **Out of scope. Do not touch:** the Palm Beach County reports and PBC routing (`single-family`, `condo-townhome`,
   `pbc-both`), the new `palm-beach-county-market-report-august-2026.pdf`, the PDF build kit in
   `scripts/pbc-county-report/`, and any page unrelated to lead magnets.

## Verify before handing back
- `npm run lint` and `npm run build` pass with no new warnings you introduced.
- `npm run dev`, then check:
  - `/communities/stuart` offers the **Martin** report in the page CTAs, sticky bar and exit-intent (they must agree).
  - `/communities/port-st-lucie` offers the **St. Lucie** report.
  - A Palm Beach County community page and blog post still get their old offers.
  - Each new landing page submits the form and downloads the correct PDF. Without `FUB_API_KEY`, dev logs the lead and
    still serves the file.
  - `/api/reports/martin-county-market-report` without a token redirects to its landing page.
- Both landing pages appear in `/sitemap.xml`, and both are excluded from the sitewide sticky bar and exit-intent on
  their own pages.
- GA4 events carry the new `magnet_key` values.

## Do not
- Deploy, push or commit unless Jonny explicitly says to. Leave the changes staged for his review.
- Invent URLs, statistics or city-level data.
- Change `src/lib/site.ts`, `/contact`, `/sell`, or the Follow Up Boss integration beyond adding the two CRM tags.

## Report back with
1. Files changed and a one-line summary of each.
2. The final city/community → county mapping, plus anything you couldn't place.
3. Build and lint output (pass/fail) and what you tested in dev.
4. The Treasure Coast report decision Jonny needs to make, with your recommendation.
