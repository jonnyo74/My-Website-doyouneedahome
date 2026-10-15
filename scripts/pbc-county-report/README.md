# County Market Report — PDF builder

Builds standalone county-level lead magnets (**“<County> Market Report | <Month Year>”**) for
DO Homes Group: 6-page US Letter PDFs covering single-family homes and condos/townhomes.
(The folder name predates Martin and St. Lucie support; one kit serves every county. The months-of-supply
chart scale widens past 10 automatically so no bar is clipped.)

| Report | Data | Narrative | Pages |
| --- | --- | --- | --- |
| Palm Beach County, Aug 2026 | `data/pbc-market-2026-08.json` | `data/narrative-2026-08.json` | cover, glance, numbers, buyers, sellers, cta |
| Martin County, Aug 2026 | `data/martin-market-2026-08.json` | `data/martin-narrative-2026-08.json` | cover, glance, numbers, insights, buyers_sellers, cta |
| St. Lucie County, Aug 2026 | `data/st-lucie-market-2026-08.json` | `data/st-lucie-narrative-2026-08.json` | cover, glance, numbers, insights, buyers_sellers, cta |

Page layout per report is set by `pages` in the data file. Blocks: `cover`; `glance` (scorecard +
months-of-supply chart, plus an optional `standsOut` list or `verdicts` pair); `numbers`; `insights`
("What the Numbers Say" cards + one optional `localLine`); `buyers` and `sellers` (a page each,
optional checklist); `buyers_sellers` (both sections on one page); `cta` (text from the data file's
`cta` block).

This folder is standalone. It does **not** touch any live page, route, registry entry
(`src/lib/leadMagnets.ts`) or the existing monthly single-family / condo reports.

## Output
- Inside the repo: `private/reports/<slug>.pdf` (e.g. `martin-county-market-report-august-2026.pdf`)
  (the repo's never-publicly-served download directory — see `MARKET-REPORTS.md`).
- Standalone: `outputs/<slug>.pdf`. Override with `--out`.
- `previews/page-N.png` — render of every page. **Look at all of them before publishing.**

## Run
```bash
pip install -r requirements.txt        # plus poppler-utils for pdftoppm/pdffonts
python3 build.py                        # Palm Beach County, August 2026
python3 build.py --data data/martin-market-2026-08.json --narrative data/martin-narrative-2026-08.json
```

## New county
Copy an existing data + narrative pair; change `slug`, `title`, `docTitle`, `county`, the `utm`
campaign, `pages`, `cta` and every metric, and rewrite the narrative from scratch. Never carry over
another county's or month's copy.

## Monthly update
1. **Data** — copy `data/pbc-market-YYYY-MM.json`; enter raw current/prior values *and* the reported
   % change. The build recomputes every % change and both cash shares from the raw values and
   **refuses to build** if anything disagrees by more than 0.05 pts. Keep `source` exact.
2. **Narrative** — copy `data/narrative-YYYY-MM.json`. Numbers inside `{{ }}` come from the data file
   automatically; the judgments (“seller-leaning”, “more negotiating room”, headings) do not. Re-read
   every sentence. Keep it past-tense and descriptive: no predictions, valuations or investment advice.
3. Run the build. It must end in `VERIFY: PASS`, then inspect the PNGs.

## Automated checks (`verify.py`)
- 5–6 pages, all US Letter
- no text outside the page, no overlapping words, nothing running into the footer
- website (`/contact` with UTM) and `tel:` hyperlinks present
- QR code rendered at 200 dpi and decoded back to the exact expected URL
- no fallback fonts embedded (a missing glyph would pull in DejaVu)

## Links / QR
Destination is `SITE_URL` from `src/lib/site.ts` (`https://www.doyouneedahome.com`) + `/contact`,
a route listed in `src/app/sitemap.ts`. UTM params are picked up by `src/lib/utm.ts`.
Use `--no-qr` to omit the code.

## Assets
- `assets/img/do-homes-group-logo.svg` — vector, extracted from `public/public/Brand/DO homes group.pdf`
  with the grey vignette background removed.
- `assets/img/premier-brokers-international-logo*.{png,svg}` — brokerage logo (colour PNG, white vector SVG).
- `assets/img/christine-dekant.jpg`, `john-oliver.jpg` — headshots, square-cropped.
- `assets/fonts/` — Inter and Playfair Display (SIL Open Font License), matching the site's
  `--font-sans` / `--font-serif`.
- Colours mirror `src/app/globals.css` (navy-950/900/800, report gold) plus a deep teal accent.
- No MLS or REALTOR® association logos are used.
