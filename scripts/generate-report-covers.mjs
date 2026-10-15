// Renders page 1 of each lead-magnet PDF in private/reports/ into optimized
// cover images at public/images/reports/. Run after dropping in a new month's
// county-report PDFs, or after regenerating the guides with
// scripts/generate-guide-pdfs.mjs:
//
//   node scripts/generate-report-covers.mjs
//
// Outputs, per magnet: <coverSlug>.webp (480w card) and <coverSlug>-lg.webp
// (960w landing hero). Filenames and cover slugs mirror src/lib/leadMagnets.ts.

import { pdf } from 'pdf-to-img'
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import path from 'node:path'

const REPORTS = [
  // The three county reports are built by scripts/pbc-county-report/build.py.
  {
    file: 'private/reports/palm-beach-county-market-report-august-2026.pdf',
    coverSlug: 'palm-beach-county-cover',
  },
  {
    file: 'private/reports/martin-county-market-report-august-2026.pdf',
    coverSlug: 'martin-county-cover',
  },
  {
    file: 'private/reports/st-lucie-county-market-report-august-2026.pdf',
    coverSlug: 'st-lucie-county-cover',
  },
  // The guides are built by scripts/generate-guide-pdfs.mjs.
  {
    file: 'private/reports/palm-beach-county-treasure-coast-relocation-decision-guide-2026.pdf',
    coverSlug: 'relocation-guide-cover',
  },
  {
    file: 'private/reports/florida-condo-buyers-due-diligence-checklist-2026.pdf',
    coverSlug: 'condo-due-diligence-cover',
  },
]

const OUT_DIR = 'public/images/reports'

await mkdir(OUT_DIR, { recursive: true })

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function writeSizes(source, coverSlug) {
  for (const [suffix, width] of [
    ['', 480],
    ['-lg', 960],
  ]) {
    const out = path.join(OUT_DIR, `${coverSlug}${suffix}.webp`)
    await sharp(source).resize({ width }).webp({ quality: 82 }).toFile(out)
    console.log(`Wrote ${out}`)
  }
}

for (const report of REPORTS) {
  if (!(await exists(report.file))) {
    console.error(`Missing PDF: ${report.file}`)
    process.exitCode = 1
    continue
  }

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

  await writeSizes(firstPage, report.coverSlug)
}
