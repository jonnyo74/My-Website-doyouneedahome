// Fails the build if a Palm Beach Gardens blog article points at an image that is not
// verified as Palm Beach Gardens in src/lib/pbgImageProvenance.json.
//
// Run:  npm run audit:pbg-images      (also runs automatically before `npm run build`)
// Exits non-zero on any failure. See scripts/lib/pbg-image-guard.mjs for the rules.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { extractPbgArticles, checkAll, checkManifest, KNOWN_UNVERIFIED_ARTICLES } from './lib/pbg-image-guard.mjs'

const manifest = JSON.parse(readFileSync('src/lib/pbgImageProvenance.json', 'utf8'))
const articles = extractPbgArticles(readFileSync('src/lib/articles.ts', 'utf8'))

// Coverage assertion: a parsing miss must fail loudly rather than pass an empty audit.
if (articles.length < 10) {
  console.error(`FAIL - parsed only ${articles.length} Palm Beach Gardens articles; expected at least 10. The parser needs attention.`)
  process.exit(1)
}

const folder = 'public/images/palm-beach-gardens'
const files = readdirSync(folder)
  .filter((f) => !f.endsWith('.md'))
  .map((f) => `/images/palm-beach-gardens/${f}`)

const problems = checkManifest(manifest, files)

// Disk checks: every manifest entry must exist, and verified entries must match their
// recorded pixels, so a swapped file under a verified name cannot slip through.
let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('note: sharp is not installed, skipping the pixel-dimension check')
}
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

const { failures, debt, stale } = checkAll(articles, manifest)

let failed = false
if (problems.length) {
  failed = true
  console.error('Manifest problems:')
  for (const p of problems) console.error('  - ' + p)
}
if (failures.length) {
  failed = true
  console.error('Unverified Palm Beach Gardens images:')
  for (const f of failures) console.error(`  - ${f.slug}: ${f.message}`)
}
if (stale.length) {
  failed = true
  console.error('These articles are clean (or gone). Remove them from KNOWN_UNVERIFIED_ARTICLES in scripts/lib/pbg-image-guard.mjs:')
  for (const s of stale) console.error('  - ' + s)
}
if (debt.length) {
  console.warn(`Known debt, not yet rebuilt (${KNOWN_UNVERIFIED_ARTICLES.length} articles, ${debt.length} unverified references):`)
  for (const d of debt) console.warn(`  ~ ${d.slug}: ${d.message}`)
}

if (failed) process.exit(1)
console.log(
  `OK - ${articles.length} Palm Beach Gardens articles checked against ${manifest.images.length} manifest entries; ` +
    `${articles.length - KNOWN_UNVERIFIED_ARTICLES.length} fully verified, ${KNOWN_UNVERIFIED_ARTICLES.length} on the debt list.`,
)
