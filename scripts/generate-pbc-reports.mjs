// Builds the two monthly Palm Beach County market-report PDFs into
// private/reports/ from src/content/pbc-market.json.
//
//   node scripts/generate-pbc-reports.mjs
//   node scripts/generate-report-covers.mjs
//
// These were previously prepared by hand outside the repo. The layout here
// reproduces that four-page design: navy cover with both headshots, a market
// overview page with stat tiles and a year-over-year table, a buyer/seller page,
// and an outlook page with the agent cards and a closing call to action.
//
// Headshots are re-encoded through sharp before embedding — one of the two
// source files is a PNG carrying a .jpg extension, and the PDF writer only
// accepts baseline JPEG.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { PdfDoc, COLORS, PAGE_SIZE } from './lib/pdf.mjs'
import { installFonts } from './lib/fonts.mjs'

const OUT_DIR = 'private/reports'
const AUTHOR = 'Christine Dekant & John Oliver | DO Homes Group'
const FOOTER_BAR =
  'doyouneedahome.com  |  DO Homes Group at Premier Brokers International  |  (561) 783-7733'

const AGENTS = [
  {
    name: 'Christine Dekant',
    file: 'public/images/christine.jpg',
    credentials: 'REALTOR(R) - RENE - GRI - CLA - CPRES',
    email: 'christine@doyouneedahome.com',
    phone: '(561) 783-7733',
  },
  {
    name: 'John Oliver',
    file: 'public/images/john.jpg',
    credentials: 'REALTOR(R) - ABR - RENE - RSPS - SRS',
    email: 'john@doyouneedahome.com',
    phone: '(561) 783-7733',
  },
]

const market = JSON.parse(await readFile('src/content/pbc-market.json', 'utf8'))

await installFonts()
await mkdir(OUT_DIR, { recursive: true })

// ── Headshot preparation ─────────────────────────────────────────────────────

/** Square JPEG, cropped from the top like the site's `object-top` treatment. */
async function squarePortrait(file, size) {
  return sharp(file)
    .resize({ width: size, height: size, fit: 'cover', position: 'top' })
    .jpeg({ quality: 82 })
    .toBuffer()
}

// The cover portraits are circular, but the crop happens in the PDF via a
// clipping path rather than here: a pre-masked JPEG flattened onto the page
// colour leaves a faintly visible square once JPEG compression has shifted the
// flat background.
const portraits = {}
for (const agent of AGENTS) {
  const key = agent.name.split(' ')[0].toLowerCase()
  portraits[key] = {
    circle: await squarePortrait(agent.file, 420),
    square: await squarePortrait(agent.file, 360),
  }
}

// ── Report layout ────────────────────────────────────────────────────────────

function buildReport(report) {
  const { edition, dataMonth, priorMonth, source } = market
  // `title` is stated per report rather than derived from `label`, so it matches
  // the registry entry in src/lib/leadMagnets.ts word for word.
  const title = report.title

  const doc = new PdfDoc({
    title: `${title} - ${edition}`,
    author: AUTHOR,
    subject: `${dataMonth} Palm Beach County ${report.label.toLowerCase()} market statistics`,
    footerBar: FOOTER_BAR,
  })

  for (const [key, images] of Object.entries(portraits)) {
    doc.addImage(`Circ${key}`, images.circle, 420, 420)
    doc.addImage(`Sq${key}`, images.square, 360, 360)
  }

  const { width: PW, marginX: MX } = PAGE_SIZE
  const contentWidth = PW - MX * 2

  // ── Page 1: cover ──────────────────────────────────────────────────────────
  doc.newPage({ background: COLORS.navy, chrome: false })

  doc.textAt('MARKET INTELLIGENCE', PW / 2, 602, {
    font: 'bold',
    size: 8.5,
    color: COLORS.gold,
    charSpace: 2.8,
    align: 'center',
  })

  let y = doc.centeredBlock(title, 552, {
    font: 'bold',
    size: 26,
    color: COLORS.white,
    leading: 33,
    maxWidth: contentWidth - 96,
  })

  y -= 14
  doc.rect(MX, y, contentWidth, 1, COLORS.gold)

  y -= 26
  doc.textAt(`${edition} Edition`, PW / 2, y, {
    font: 'bold',
    size: 12,
    color: COLORS.white,
    align: 'center',
  })
  y -= 20
  doc.textAt(`${dataMonth} Market Data  -  Source: BeachesMLS`, PW / 2, y, {
    font: 'body',
    size: 8.6,
    color: COLORS.slateLight,
    align: 'center',
  })

  // Portraits, side by side, with gold rings.
  const r = 44
  const cy = y - 22 - r
  const keys = Object.keys(portraits)
  keys.forEach((key, i) => {
    const cx = PW / 2 + (i === 0 ? -(r + 10) : r + 10)
    doc.drawImageInCircle(`Circ${key}`, cx, cy, r)
    doc.strokeCircle(cx, cy, r, COLORS.gold, 2)
  })

  y = cy - r - 44
  doc.textAt('Prepared by', PW / 2, y, {
    font: 'body',
    size: 9,
    color: COLORS.slateLight,
    align: 'center',
  })
  y -= 18
  doc.textAt('Christine Dekant & John Oliver', PW / 2, y, {
    font: 'bold',
    size: 11.5,
    color: COLORS.gold,
    align: 'center',
  })
  y -= 17
  doc.textAt('DO Homes Group  -  Premier Brokers International', PW / 2, y, {
    font: 'body',
    size: 9,
    color: COLORS.white,
    align: 'center',
  })
  y -= 15
  doc.textAt('doyouneedahome.com  |  (561) 783-7733', PW / 2, y, {
    font: 'body',
    size: 8.4,
    color: COLORS.slateLight,
    align: 'center',
  })

  doc.rect(0, 0, PW, 12, COLORS.gold)

  // ── Page 2: market overview ────────────────────────────────────────────────
  doc.newPage()
  doc.sectionMark('Market Overview')
  doc.heading(`${dataMonth} at a Glance`, { font: 'bold', size: 21 })
  doc.paragraph(report.overview)
  doc.statTiles(report.tiles)
  doc.subheading(`${report.label} - ${dataMonth} vs. ${priorMonth}`)
  doc.comparisonTable(['Metric', dataMonth, priorMonth, '% Change'], report.rows)
  doc.paragraph(`Source: ${source}.`, { size: 7.4, color: COLORS.slateLight, gap: 14 })
  doc.paragraph(report.afterTable)

  // ── Page 3: what the numbers mean ──────────────────────────────────────────
  doc.newPage()
  doc.sectionMark('What the Numbers Mean')
  doc.heading('If You Are Selling', { font: 'bold', size: 21 })
  doc.paragraph(report.sellingIntro)
  for (const point of report.sellingPoints) doc.bullet(null, point)
  doc.spacer(14)
  doc.heading('If You Are Buying', { font: 'bold', size: 21 })
  doc.paragraph(report.buyingIntro)
  for (const point of report.buyingPoints) doc.bullet(null, point)

  // ── Page 4: outlook + team ─────────────────────────────────────────────────
  doc.newPage()
  doc.sectionMark('Outlook & Your Team')
  doc.heading(report.outlookHeading, { font: 'bold', size: 21 })
  doc.paragraph(report.outlook)
  doc.subheading('Meet Christine & John')

  const cardTop = doc.y
  const photo = 62
  AGENTS.forEach((agent, i) => {
    const key = agent.name.split(' ')[0].toLowerCase()
    const x = MX + i * (contentWidth / 2)
    doc.drawImage(`Sq${key}`, x, cardTop - photo, photo, photo)
    doc.strokeRect(x, cardTop - photo, photo, photo, COLORS.gold, 1.2)
    const tx = x + photo + 12
    doc.textAt(agent.name, tx, cardTop - 12, { font: 'bold', size: 10.5, color: COLORS.navy })
    doc.textAt(agent.credentials, tx, cardTop - 25, {
      font: 'body',
      size: 6.6,
      color: COLORS.goldDark,
      charSpace: 0.3,
    })
    doc.textAt(agent.phone, tx, cardTop - 42, { font: 'body', size: 8.4, color: COLORS.slate })
    doc.textAt(agent.email, tx, cardTop - 54, { font: 'body', size: 8.4, color: COLORS.slate })
  })
  doc.y = cardTop - photo - 22

  doc.paragraph(
    'Christine and John are licensed REALTORS(R) with Premier Brokers International, based in ' +
      'Palm Beach Gardens and serving buyers and sellers across Palm Beach County and the ' +
      'Treasure Coast. They live in the communities they serve - and they answer their own phones.',
  )

  doc.callout({
    heading: 'What Is Your Home Worth in This Market?',
    body:
      'County-level numbers set the stage, but your street and your floor plan set the price. ' +
      'For a no-obligation valuation based on current comparable sales in your neighborhood, ' +
      'reach out - we respond the same day.',
    link: 'doyouneedahome.com  -  (561) 783-7733',
  })

  doc.paragraph(
    `This report is prepared by Christine Dekant & John Oliver, DO Homes Group at Premier ` +
      `Brokers International, for informational purposes. Market statistics are from the ` +
      `${source} and reflect data reported as of publication. Market data describes past ` +
      `closings and is not a prediction or an appraisal of any specific property. Not intended ` +
      `as legal or financial advice. Equal Housing Opportunity.`,
    { size: 7, color: COLORS.slateLight },
  )

  return doc
}

// ── Write ────────────────────────────────────────────────────────────────────

const monthSlug = market.edition.toLowerCase().replace(/\s+/g, '-')

for (const report of market.reports) {
  const fileName =
    report.key === 'single-family'
      ? `pbc-single-family-home-market-report-${monthSlug}.pdf`
      : `pbc-condo-townhome-market-report-${monthSlug}.pdf`
  const doc = buildReport(report)
  const buffer = doc.toBuffer()
  const out = path.join(OUT_DIR, fileName)
  await writeFile(out, buffer)
  console.log(`Wrote ${out} (${doc.pages.length} pages, ${(buffer.length / 1024).toFixed(0)} KB)`)
}
