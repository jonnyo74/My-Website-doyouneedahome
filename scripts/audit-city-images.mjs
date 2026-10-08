// Fails the build if a guarded city's blog article points at an image that is not verified
// for that city in its provenance manifest.
//
// Run:  npm run audit:images      (also runs automatically before `npm run build`)
// Exits non-zero on any failure. See scripts/lib/pbg-image-guard.mjs for the rules.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import {
  extractArticles,
  checkAll,
  checkManifest,
  provisionalImages,
  KNOWN_UNVERIFIED_ARTICLES,
} from './lib/pbg-image-guard.mjs'

export const CITIES = [
  {
    label: 'Palm Beach Gardens',
    citySlug: 'palm-beach-gardens',
    manifest: 'src/lib/pbgImageProvenance.json',
    folder: 'public/images/palm-beach-gardens',
    publicFolder: '/images/palm-beach-gardens',
    debt: KNOWN_UNVERIFIED_ARTICLES,
  },
  {
    label: 'Wellington',
    citySlug: 'wellington',
    manifest: 'src/lib/wellingtonImageProvenance.json',
    folder: 'public/images/wellington',
    publicFolder: '/images/wellington',
    debt: [],
  },
]

let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('note: sharp is not installed, skipping the pixel-dimension check')
}

const src = readFileSync('src/lib/articles.ts', 'utf8')
let failed = false

for (const city of CITIES) {
  const manifest = JSON.parse(readFileSync(city.manifest, 'utf8'))
  const articles = extractArticles(src, city.citySlug)

  // Coverage assertion: a parsing miss must fail loudly rather than pass an empty audit.
  if (articles.length < 10) {
    console.error(`FAIL - parsed only ${articles.length} ${city.label} articles; expected at least 10. The parser needs attention.`)
    process.exit(1)
  }

  const files = readdirSync(city.folder)
    .filter((f) => !f.endsWith('.md'))
    .map((f) => `${city.publicFolder}/${f}`)
  const problems = checkManifest(manifest, files)

  // Disk checks: every manifest entry must exist, and verified entries must match their
  // recorded pixels, so a swapped file under a verified name cannot slip through.
  for (const e of manifest.images) {
    const abs = `public${e.path}`
    if (!existsSync(abs)) {
      problems.push(`${e.path} is in the manifest but the file does not exist`)
      continue
    }
    if (sharp && e.locality === manifest.allowedLocality) {
      const m = await sharp(abs).metadata()
      if (m.width !== e.width || m.height !== e.height) {
        problems.push(`${e.path} is ${m.width}x${m.height} on disk but ${e.width}x${e.height} in the manifest`)
      }
    }
  }

  const { failures, debt, stale } = checkAll(articles, manifest, city.debt)

  if (problems.length) {
    failed = true
    console.error(`${city.label} manifest problems:`)
    for (const p of problems) console.error('  - ' + p)
  }
  if (failures.length) {
    failed = true
    console.error(`Unverified ${city.label} images:`)
    for (const f of failures) console.error(`  - ${f.slug}: ${f.message}`)
  }
  if (stale.length) {
    failed = true
    console.error(`These ${city.label} articles are clean (or gone). Remove them from the debt list:`)
    for (const s of stale) console.error('  - ' + s)
  }
  if (debt.length) {
    console.warn(`${city.label} known debt, not yet rebuilt (${city.debt.length} articles, ${debt.length} unverified references):`)
    for (const d of debt) console.warn(`  ~ ${d.slug}: ${d.message}`)
  }

  const prov = provisionalImages(articles, manifest)
  if (prov.length) {
    const used = new Set(prov.map((p) => p.image))
    console.warn(
      `PROVISIONAL - ${city.label}: ${used.size} image file(s) in ${new Set(prov.map((p) => p.slug)).size} article(s) are recorded for ${manifest.allowedLocality} ` +
        `but the exact venue is not yet confirmed by the photographer. Confirm before treating these pages as final.`,
    )
  }

  if (!failed) {
    console.log(
      `OK - ${articles.length} ${city.label} articles checked against ${manifest.images.length} manifest entries; ` +
        `${articles.length - city.debt.length} pass the guard, ${city.debt.length} on the debt list.`,
    )
  }
}

if (failed) process.exit(1)
