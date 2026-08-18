// Renders page 1 of each lead-magnet PDF in private/reports/ into optimized
// cover images at public/images/reports/. Run after dropping in a new month's
// market-report PDFs, or after regenerating the guides with
// scripts/generate-guide-pdfs.mjs:
//
//   node scripts/generate-report-covers.mjs
//
// Outputs, per magnet: <coverSlug>.webp (480w card) and <coverSlug>-lg.webp
// (960w landing hero). Filenames and cover slugs mirror src/lib/leadMagnets.ts.

import { pdf } from 'pdf-to-img'
import sharp from 'sharp'
import { access, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

// The Palm Beach County filenames follow the edition in pbc-market.json, so a
// monthly update never means editing a filename in two places.
const pbcMarket = JSON.parse(await readFile('src/content/pbc-market.json', 'utf8'))
const pbcSlug = pbcMarket.edition.toLowerCase().replace(/\s+/g, '-')

const REPORTS = [
  {
    file: `private/reports/pbc-single-family-home-market-report-${pbcSlug}.pdf`,
    coverSlug: 'single-family-cover',
  },
  {
    file: `private/reports/pbc-condo-townhome-market-report-${pbcSlug}.pdf`,
    coverSlug: 'condo-townhome-cover',
  },
  {
    file: 'private/reports/palm-beach-county-treasure-coast-relocation-decision-guide-2026.pdf',
    coverSlug: 'relocation-guide-cover',
  },
  {
    file: 'private/reports/florida-condo-buyers-due-diligence-checklist-2026.pdf',
    coverSlug: 'condo-due-diligence-cover',
  },
  {
    // Regenerated from src/content/treasure-coast-market.json; the placeholder
    // below is only used if that report is ever withdrawn again and its PDF
    // removed, so the dev-only landing page never renders a broken image.
    file: 'private/reports/treasure-coast-real-estate-market-report.pdf',
    coverSlug: 'treasure-coast-cover',
    placeholder: {
      title: 'Treasure Coast',
      subtitle: 'Real Estate Market Report',
      note: 'Cover pending - awaiting verified Martin &amp; St. Lucie County data',
    },
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

function placeholderSvg({ title, subtitle, note }) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1242">
    <rect width="960" height="1242" fill="#0B1929"/>
    <rect y="230" width="960" height="8" fill="#C9A961"/>
    <text x="80" y="420" font-family="Georgia, serif" font-size="72" fill="#FFFFFF">${title}</text>
    <text x="80" y="500" font-family="Georgia, serif" font-size="46" fill="#C9A961">${subtitle}</text>
    <text x="80" y="620" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#94A3B8">${note}</text>
    <text x="80" y="1150" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#FFFFFF">DO Homes Group</text>
  </svg>`)
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
    if (report.placeholder) {
      console.log(`${report.file} not generated yet - writing placeholder cover.`)
      await writeSizes(placeholderSvg(report.placeholder), report.coverSlug)
      continue
    }
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
