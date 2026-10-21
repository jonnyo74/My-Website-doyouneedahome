# Handoff: build the three September 2026 county report PDFs

**This is a rendering job, not a writing job.** The data and all the copy are finished,
reviewed and committed. Nothing in the JSON files needs editing. Run the build, check the
previews, commit the PDFs.

## Why this is being handed off

`build.py` renders through WeasyPrint, which needs the GTK native libraries. The Windows
machine the rest of this repo is worked on does not have them (`cannot load library
'libgobject-2.0-0'`), GTK is not in winget, and there is no WSL. On Linux it is a pip install.

## Branch

```bash
git checkout rescue/worktree-2026-09-14      # the build kit lives here, not on main
cd scripts/pbc-county-report
```

The kit (`build.py`, `verify.py`, `template/`, `assets/`) is on this branch only — it was
committed in `8f73263` and never merged to main. The September data was added in `476de8d`.

## Setup

```bash
pip install -r requirements.txt
apt-get install -y poppler-utils          # pdftoppm / pdffonts, for previews and the font check
```

## Build — all three, explicitly

`build.py`'s defaults still point at the **August** files, so a bare `python3 build.py` would
rebuild last month. Always pass both flags:

```bash
python3 build.py --data data/pbc-market-2026-09.json      --narrative data/narrative-2026-09.json
python3 build.py --data data/martin-market-2026-09.json   --narrative data/martin-narrative-2026-09.json
python3 build.py --data data/st-lucie-market-2026-09.json --narrative data/st-lucie-narrative-2026-09.json
```

Each run must end in **`VERIFY: PASS`**. If a data check fails, stop and report it rather than
editing the JSON — the numbers were transcribed from the source graphics and every percentage
was re-derived from the raw values, so a failure means something else is wrong.

Output lands in `private/reports/`:

- `palm-beach-county-market-report-september-2026.pdf`
- `martin-county-market-report-september-2026.pdf`
- `st-lucie-county-market-report-september-2026.pdf`

## Check the previews before publishing

Look at **every** PNG in `previews/`, all six pages per report. `verify.py` covers page count
and size, text outside the page, overlapping words, text running into the footer, the
`/contact` and `tel:` links, the QR code decoding to the right URL, and fallback fonts. It does
not catch an ugly line break or a chart that reads wrong.

Two things worth a specific look this month:

1. **Martin County condos, months-of-supply chart.** Supply fell 7.9 → 5.1, the largest move in
   any segment. Confirm the bar scale still reads sensibly next to single-family's 3.6.
2. **St. Lucie County condos.** Median days to contract is **117**, the largest number in any
   table this month. Check it does not overflow its cell.

## Commit

```bash
git add private/reports/*september-2026.pdf
git commit -m "Add the September 2026 county report PDFs"
git push origin rescue/worktree-2026-09-14
```

Leave the August PDFs in place — the live site still points at them until the registry is
updated, which happens next and is not part of this job.

## What happens after

Back on the main machine: registry constants (`COUNTY_REPORT_EDITION`,
`COUNTY_REPORT_DATA_MONTH`, `COUNTY_REPORT_SOURCE`, each entry's `id`/`fileName`/`keyStats`/
`summary`/`takeaways`/FAQs), the three landing-page data imports, `generate-report-covers.mjs`,
then `MARKET-REPORTS.md`. See the "Monthly update — county reports" section there.

## Context for anything that looks odd

- **Source line.** September is attributed to BeachesMLS; August said MIAMI REALTORS® + RWorld.
  The two organizations have combined — a branding change, not a change of data vendor.
- **`build.py` was changed in `476de8d`.** `validate()` used Python's `round()`, which is
  half-to-even, while the source graphics round half away from zero. Two correctly-transcribed
  September figures are exactly `.25` (Martin condo days 89 vs 80 = 11.25%; St. Lucie
  single-family median 395,000 vs 400,000 = −1.25%) and were being rejected. `round1()` uses
  `Decimal`/`ROUND_HALF_UP`. The 0.05 tolerance is unchanged and a dropped sign is still caught.
- **St. Lucie condo median reads +24.1%.** That is on 91 closings in a county without much condo
  stock. The copy deliberately frames it as mix, never as a change in values. Leave it alone.
