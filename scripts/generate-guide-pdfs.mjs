// Builds the evergreen guide PDFs into private/reports/ from the same JSON the
// website renders, so the download and the landing page can never disagree.
//
//   node scripts/generate-guide-pdfs.mjs
//
// Then regenerate the cover images:
//
//   node scripts/generate-report-covers.mjs
//
// The two Palm Beach County market-report PDFs are NOT produced here — those
// are prepared monthly from MLS data and dropped into private/reports/ by hand.
//
// The Treasure Coast report IS generated here, but only once every statistic in
// src/content/treasure-coast-market.json is filled from a real MLS snapshot —
// the guard below refuses to write a PDF containing nulls, so it doubles as the
// completeness check when a new month's figures are entered.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PdfDoc, COLORS } from './lib/pdf.mjs'
import { installFonts } from './lib/fonts.mjs'

const OUT_DIR = 'private/reports'
const AUTHOR = 'Christine Dekant & John Oliver | DO Homes Group'
const BRAND_FOOTNOTE =
  'DO Homes Group at Premier Brokers International, 9123 North Military Trail, Suite 104, ' +
  'Palm Beach Gardens, FL 33410. (561) 783-7733 | doyouneedahome.com'

const relocation = JSON.parse(
  await import('node:fs/promises').then((fs) =>
    fs.readFile('src/content/relocation-guide.json', 'utf8'),
  ),
)
const condo = JSON.parse(
  await import('node:fs/promises').then((fs) =>
    fs.readFile('src/content/condo-due-diligence.json', 'utf8'),
  ),
)
const treasureCoast = JSON.parse(
  await import('node:fs/promises').then((fs) =>
    fs.readFile('src/content/treasure-coast-market.json', 'utf8'),
  ),
)

await installFonts()
await mkdir(OUT_DIR, { recursive: true })

// ── 1. Relocation Decision Guide ─────────────────────────────────────────────

function buildRelocationGuide() {
  const areas = relocation.areas
  const doc = new PdfDoc({
    title: 'Palm Beach County vs. the Treasure Coast: 2026 Relocation Decision Guide',
    author: AUTHOR,
    subject:
      'A side-by-side comparison of Palm Beach County, Martin County and St. Lucie County areas',
    runningHeader: 'Palm Beach County vs. the Treasure Coast | 2026 Relocation Decision Guide',
  })

  doc.cover({
    eyebrow: '2026 Relocation Decision Guide',
    title: 'Palm Beach County vs. the Treasure Coast',
    subtitle:
      'Jupiter or Stuart. Palm Beach Gardens or Palm City. Delray Beach or Port St. Lucie. ' +
      'Every area we work in, compared on the questions that actually decide where you live.',
    statLines: [
      `${areas.length} areas compared`,
      `${relocation.categories.length} decision categories`,
      '3 counties: Palm Beach, Martin, St. Lucie',
    ],
    byline: 'Christine Dekant & John Oliver, REALTORS(R)',
    footnote: BRAND_FOOTNOTE,
  })

  // How to use it
  doc.newPage()
  doc.eyebrow('Start here')
  doc.heading('How to Use This Guide')
  doc.paragraph(
    'Almost everyone who calls us about relocating is choosing between two versions of the same ' +
      'life: the coastal, more expensive, better-connected version in northern Palm Beach County, ' +
      'and the quieter, roomier, further-out version on the Treasure Coast. The trade is ' +
      'consistent. Moving north buys you more house, more land and more waterfront per dollar, ' +
      'plus the Martin County school district and Cleveland Clinic hospitals. It costs you ' +
      'proximity - PBI Airport goes from fifteen or thirty minutes away to an hour.',
  )
  doc.paragraph(
    'This guide is built to be skimmed, not read front to back. If you already know your one ' +
      'non-negotiable, start with the shortlists on the next page and jump straight to two or ' +
      'three areas. If you are starting from nothing, read the area profiles in order - each one ' +
      'answers the same questions, so they are directly comparable.',
  )
  doc.panel(
    [
      'Price ranges in this guide are the asking-price ranges published on our community pages, ' +
        'provided for orientation only. They are not appraisals, not MLS medians, and not a ' +
        'prediction of what any specific home will sell for.',
      'School district boundaries, HOA rules, club membership requirements and insurance costs ' +
        'vary by property and change over time. Verify anything that will affect your decision ' +
        'for the specific address you are considering.',
    ],
    { title: 'About the numbers in this guide' },
  )

  // Shortlists
  for (const list of relocation.shortlists) {
    doc.newPage()
    doc.eyebrow('Shortcuts')
    doc.heading(list.heading)
    if (list.intro) doc.paragraph(list.intro)
    doc.spacer(4)
    for (const item of list.items) {
      doc.bullet(item.title, item.body)
    }
  }

  // Area profiles, grouped by county
  const counties = ['Palm Beach County', 'Martin County', 'St. Lucie County']
  const ROWS = [
    ['Coastal vs. inland', 'setting'],
    ['Boating & waterfront access', 'boating'],
    ['Golf & private-club living', 'golf'],
    ['55+ options', 'fiftyFivePlus'],
    ['New construction', 'newConstruction'],
    ['HOA vs. non-HOA', 'hoa'],
    ['Healthcare access', 'healthcare'],
    ['Airport & transportation', 'transportation'],
    ['Pace & character', 'pace'],
    ['Fits this buyer', 'bestFor'],
    // Optional - only areas that carry the field get the row, so Wellington can
    // have an equestrian section without an empty row on the other thirteen.
    ['Equestrian estates & farms', 'equestrianEstates'],
    ['The trade-off', 'tradeOff'],
  ]

  for (const county of counties) {
    const inCounty = areas.filter((a) => a.county === county)
    if (!inCounty.length) continue

    doc.newPage()
    doc.eyebrow('Area profiles')
    doc.heading(county, { size: 26 })
    doc.paragraph(
      `${inCounty.length} area${inCounty.length === 1 ? '' : 's'} in this section: ` +
        `${inCounty.map((a) => a.name).join(', ')}.`,
    )
    doc.rule()

    for (const area of inCounty) {
      doc.ensure(200)
      doc.spacer(6)
      doc.heading(area.name, { size: 20, gap: 6 })
      doc.subheading('Home price ranges')
      for (const pr of area.priceRanges) {
        doc.bullet(null, `${pr.range}  -  ${pr.type}`)
      }
      doc.spacer(4)
      for (const [label, key] of ROWS) {
        if (!area[key]) continue
        doc.labelledRow(label, area[key])
      }
      doc.spacer(6)
      doc.rule()
    }
  }

  // Closing
  doc.newPage()
  doc.eyebrow('Next step')
  doc.heading('When You Have It Down to Two or Three')
  doc.paragraph(
    'A guide can tell you what an area is. It cannot tell you what a specific street feels like ' +
      'on a Tuesday in February, which builder cut corners in which phase, or which association ' +
      'is about to fund a project. That is the part we do.',
  )
  doc.paragraph(
    'Send us the two or three areas you narrowed it down to and what you are trying to spend. ' +
      'We will tell you honestly whether it works, and if it does not, which of the two you should ' +
      'bend on.',
  )
  doc.panel(
    [
      'Christine Dekant & John Oliver, REALTORS(R)',
      'DO Homes Group at Premier Brokers International',
      '(561) 783-7733 | info@doyouneedahome.com | doyouneedahome.com',
    ],
    { title: 'Talk to us', fill: COLORS.paper },
  )
  doc.paragraph(
    'Equal Housing Opportunity. This guide is informational and is not legal, tax, insurance or ' +
      'investment advice.',
    { size: 8, color: COLORS.slateLight },
  )

  return doc
}

// ── 2. Florida Condo Buyer's Due-Diligence and Red-Flag Checklist ────────────

function buildCondoChecklist() {
  const doc = new PdfDoc({
    title: "Florida Condo Buyer's Due-Diligence and Red-Flag Checklist",
    author: AUTHOR,
    subject: 'Documents to request and questions to ask before buying a Florida condominium',
    runningHeader: "Florida Condo Buyer's Due-Diligence and Red-Flag Checklist | 2026 Edition",
  })

  const documentsSection = condo.sections.find((s) => s.heading.startsWith('Documents to Review'))
  const questionsSection = condo.sections.find((s) => s.heading.startsWith('Questions to Ask'))

  doc.cover({
    eyebrow: '2026 Edition',
    title: "Florida Condo Buyer's Due-Diligence and Red-Flag Checklist",
    subtitle:
      'In Florida, the association is half the purchase. This is the checklist we walk our own ' +
      'condo buyers through - what to request, what to look for in it, and what should make you ' +
      'slow down.',
    statLines: [
      `${condo.sections.length} checklist sections`,
      `${documentsSection?.items.length ?? 0} documents to request`,
      `${questionsSection?.items.length ?? 0} questions before you offer`,
      `${condo.redFlags.length} red flags`,
    ],
    byline: 'Christine Dekant & John Oliver, REALTORS(R)',
    footnote: BRAND_FOOTNOTE,
  })

  doc.newPage()
  doc.eyebrow('Read this first')
  doc.heading('Why the Building Matters More Than the Unit')
  doc.paragraph(
    'Two identical units on the same street can be very different purchases. One sits in a ' +
      'building with funded reserves, a completed structural inspection and stable dues. The ' +
      'other sits in a building carrying a loan, an inspection it has not scheduled, and a board ' +
      'discussing an assessment in minutes nobody sent you. The unit tour tells you nothing about ' +
      'which is which. The association paperwork does.',
  )
  doc.paragraph(
    'Work through the sections in order. Ask for everything in writing, note the date each ' +
      'document arrived, and give your attorney time to actually read it. A document that cannot ' +
      'be produced is itself an answer.',
  )
  doc.panel([condo.disclaimer], { title: 'Important - please read', accent: COLORS.goldDark })

  condo.sections.forEach((section, index) => {
    doc.newPage()
    doc.eyebrow(`Section ${String(index + 1).padStart(2, '0')} of ${condo.sections.length}`)
    doc.heading(section.heading)
    if (section.intro) doc.paragraph(section.intro)
    doc.spacer(2)
    for (const item of section.items) {
      doc.bullet(item.title, item.body)
    }
  })

  doc.newPage()
  doc.eyebrow('Slow down if you see these')
  doc.heading(`${condo.redFlags.length} Red Flags`)
  doc.paragraph(
    'None of these means walk away on its own. All of them mean ask another question, and get the ' +
      'answer in writing, before your inspection period runs out.',
  )
  doc.spacer(2)
  for (const flag of condo.redFlags) {
    doc.bullet(null, flag)
  }

  doc.newPage()
  doc.eyebrow('Next step')
  doc.heading('Send Us the Building')
  doc.paragraph(
    'Tell us the building you are considering and we will tell you what we know about it, and ' +
      'what we would ask the association first. There is no charge and no obligation for that ' +
      'conversation.',
  )
  doc.panel(
    [
      'Christine Dekant & John Oliver, REALTORS(R)',
      'DO Homes Group at Premier Brokers International',
      '(561) 783-7733 | info@doyouneedahome.com | doyouneedahome.com',
    ],
    { title: 'Talk to us' },
  )
  doc.paragraph(
    'Equal Housing Opportunity. This checklist is general information for buyers and is not ' +
      'legal, financial, tax, insurance, engineering or inspection advice.',
    { size: 8, color: COLORS.slateLight },
  )

  return doc
}

// ── 3. Treasure Coast Market Report (blocked until data exists) ──────────────

function buildTreasureCoastReport() {
  const missing = []
  for (const county of treasureCoast.counties) {
    for (const type of county.propertyTypes) {
      for (const metric of type.metrics) {
        if (metric.value === null) missing.push(`${county.name} / ${type.label} / ${metric.label}`)
      }
    }
  }
  if (treasureCoast.dataStatus === 'awaiting-data' || missing.length) {
    console.log(
      `\nSKIPPED  Treasure Coast Real Estate Market Report\n` +
        `         ${missing.length} statistic${missing.length === 1 ? '' : 's'} still unfilled in ` +
        `src/content/treasure-coast-market.json.\n` +
        `         Nothing is generated until every value is a verified figure - see the\n` +
        `         "requiredData" checklist in that file.`,
    )
    return null
  }

  const edition = treasureCoast.edition
  const dataMonth = treasureCoast.dataMonth
  const attribution = `${dataMonth} Martin County and St. Lucie County market data (${treasureCoast.source}).`

  const doc = new PdfDoc({
    title: `Treasure Coast Real Estate Market Report - ${edition}`,
    author: AUTHOR,
    subject: 'Martin County and St. Lucie County residential market report',
    runningHeader: `Treasure Coast Real Estate Market Report | ${edition} | Martin & St. Lucie Counties`,
  })

  const headline = (countyKey, typeKey, metricKey) =>
    treasureCoast.counties
      .find((c) => c.key === countyKey)
      .propertyTypes.find((t) => t.key === typeKey)
      .metrics.find((m) => m.key === metricKey)

  doc.cover({
    eyebrow: `${edition} Edition | Martin & St. Lucie Counties`,
    title: 'Treasure Coast Real Estate Market Report',
    subtitle:
      'Stuart, Palm City, Hobe Sound, Port Salerno and Port St. Lucie sit in a different county ' +
      'and a different market from Palm Beach County. This report covers them on their own terms.',
    statLines: [
      `Martin County single family median ${headline('martin', 'single-family', 'medianSalePrice').value}`,
      `St. Lucie County single family median ${headline('st-lucie', 'single-family', 'medianSalePrice').value}`,
      `${dataMonth} data, both counties, single family and condo`,
    ],
    byline: 'Christine Dekant & John Oliver, REALTORS(R)',
    footnote: BRAND_FOOTNOTE,
  })

  doc.newPage()
  doc.eyebrow('How to read this report')
  doc.heading('Two Counties, Reported Separately')
  doc.paragraph(
    'Every figure in this report is ' +
      attribution +
      ' Each county gets its own section, and within it single family homes and ' +
      'townhouses/condos are reported separately, because they are not moving together this ' +
      'month. Year-over-year percentages compare against the same month in 2025.',
  )
  doc.paragraph(
    'A balanced market is roughly 5.5 months of supply. Below that, conditions favour sellers; ' +
      'above it, buyers. That single number is the fastest read on any of the four segments here.',
  )
  doc.panel(
    [
      'Condo and townhouse medians in both counties rest on small samples this month - 77 ' +
        'closings in Martin County and 82 in St. Lucie. Which buildings and price tiers happen ' +
        'to trade can move a median on its own at that volume, so read those medians alongside ' +
        'inventory, months of supply and percent of original list price received rather than as ' +
        'a standalone signal of value.',
    ],
    { title: 'A note on the condo numbers' },
  )

  for (const county of treasureCoast.counties) {
    doc.newPage()
    doc.eyebrow(`${dataMonth} data`)
    doc.heading(county.name, { size: 26 })
    doc.paragraph(`Includes ${county.cities.join(', ')}.`)
    doc.rule()
    for (const type of county.propertyTypes) {
      doc.ensure(150)
      doc.subheading(type.label)
      for (const metric of type.metrics) {
        doc.labelledRow(
          metric.label,
          metric.yearOverYear
            ? `${metric.value}   (${metric.yearOverYear} year over year)`
            : `${metric.value}`,
        )
      }
      doc.spacer(10)
    }
  }

  for (const slot of treasureCoast.narrativeSlots) {
    if (!slot.value) continue
    doc.ensure(190)
    doc.spacer(4)
    doc.heading(slot.label, { size: 17, gap: 8 })
    doc.paragraph(slot.value)
  }

  doc.newPage()
  doc.eyebrow('Next step')
  doc.heading('The Numbers Are the Starting Point')
  doc.paragraph(
    'A county median tells you where the market is. It does not tell you what your street, your ' +
      'building or your price band is doing, and on the Treasure Coast those diverge more than ' +
      'the county figures suggest. Send us the town and the property type you are focused on and ' +
      'we will send back the comparable sales that actually apply to you.',
  )
  doc.panel(
    [
      'Christine Dekant & John Oliver, REALTORS(R)',
      'DO Homes Group at Premier Brokers International',
      '(561) 783-7733 | info@doyouneedahome.com | doyouneedahome.com',
    ],
    { title: 'Talk to us' },
  )
  doc.paragraph(
    'Statistics in this report are ' +
      attribution +
      ' Market data describes past closings and is not a prediction or an appraisal of any ' +
      'specific property. Equal Housing Opportunity.',
    { size: 8, color: COLORS.slateLight },
  )

  return doc
}

// ── Write everything ─────────────────────────────────────────────────────────

const builds = [
  {
    fileName: 'palm-beach-county-treasure-coast-relocation-decision-guide-2026.pdf',
    build: buildRelocationGuide,
  },
  {
    fileName: 'florida-condo-buyers-due-diligence-checklist-2026.pdf',
    build: buildCondoChecklist,
  },
  {
    fileName: 'treasure-coast-real-estate-market-report.pdf',
    build: buildTreasureCoastReport,
  },
]

for (const { fileName, build } of builds) {
  const doc = build()
  if (!doc) continue
  const buffer = doc.toBuffer()
  const out = path.join(OUT_DIR, fileName)
  await writeFile(out, buffer)
  console.log(`Wrote ${out} (${doc.pages.length} pages, ${(buffer.length / 1024).toFixed(0)} KB)`)
}
