// Renders page 1 of each market-report PDF in private/reports/ into optimized
// cover images at public/images/reports/. Run after dropping in a new month's
// PDFs (filenames come from src/lib/marketReports.ts):
//
//   node scripts/generate-report-covers.mjs
//
// Outputs, per report: <coverSlug>.webp (480w card) and <coverSlug>-lg.webp
// (960w landing hero).

import { pdf } from 'pdf-to-img'
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const REPORTS = [
  {
    file: 'private/reports/pbc-single-family-home-market-report-july-2026.pdf',
    coverSlug: 'single-family-cover',
  },
  {
    file: 'private/reports/pbc-condo-townhome-market-report-july-2026.pdf',
    coverSlug: 'condo-townhome-cover',
  },
]

const OUT_DIR = 'public/images/reports'

await mkdir(OUT_DIR, { recursive: true })

for (const report of REPORTS) {
  const doc = await pdf(report.file, { scale: 3 })
  let firstPage
  for await (const page of doc) {
    firstPage = page
    break
  }
  if (!firstPage) {
    console.error(`No pages rendered for ${report.file}`)
    process.exitCode = 1
    continue
  }

  for (const [suffix, width] of [['', 480], ['-lg', 960]]) {
    const out = path.join(OUT_DIR, `${report.coverSlug}${suffix}.webp`)
    await sharp(firstPage).resize({ width }).webp({ quality: 82 }).toFile(out)
    console.log(`Wrote ${out}`)
  }
}
