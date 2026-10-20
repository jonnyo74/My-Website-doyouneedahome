// Guards the Discover The Palm Beaches (DTPB) photo manifest.
// Run: node --test scripts/discover-photos.test.mjs   (also part of `npm test`)
//
// Rules enforced here (the credit rule is the one that must never regress):
//  - every photo and hero carries a non-empty credit in the approved wording
//  - alt text and captions exist and cannot break the markdown image syntax
//  - every referenced file exists, matches its recorded size, and stays web-sized
//  - every placement points at a real photo, a real article and a real "## " section
//  - the photos are only wired to blog posts, never to city or community data

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, statSync } from 'node:fs'
import sharp from 'sharp'

const data = JSON.parse(readFileSync('src/lib/discoverPhotos.json', 'utf8'))
const articlesSrc = readFileSync('src/lib/articles.ts', 'utf8').replace(/\r/g, '')

const CREDIT_OK = /^(Photo courtesy of Discover The Palm Beaches|Photo: [^/]+ \/ Discover The Palm Beaches)$/
const all = [
  ...Object.entries(data.photos).map(([id, p]) => ['photo', id, p]),
  ...Object.entries(data.heroes).map(([id, p]) => ['hero', id, p]),
]

test('manifest is not empty', () => {
  assert.ok(Object.keys(data.photos).length > 0)
  assert.ok(Object.keys(data.galleries).length > 0)
})

test('every photo and hero has an approved credit line', () => {
  for (const [kind, id, p] of all) {
    assert.ok(p.credit, `${kind} ${id} has no credit`)
    assert.match(p.credit, CREDIT_OK, `${kind} ${id} credit wording is not approved: "${p.credit}"`)
  }
})

test('credit never implies affiliation or endorsement', () => {
  for (const [kind, id, p] of all) {
    const text = `${p.credit} ${p.caption} ${p.alt}`
    assert.doesNotMatch(text, /official|partner|sponsor|endorse|approved by|in association/i, `${kind} ${id}`)
  }
})

test('alt text and captions are present and markdown-safe', () => {
  for (const [kind, id, p] of all) {
    assert.ok(p.alt && p.alt.length >= 20, `${kind} ${id} alt too short`)
    assert.ok(p.caption && p.caption.length >= 5, `${kind} ${id} has no caption`)
    for (const field of ['alt', 'caption']) {
      assert.doesNotMatch(p[field], /["\]\[|]/, `${kind} ${id} ${field} has a character that breaks image markdown`)
    }
    assert.ok(p.source, `${kind} ${id} has no recorded source file`)
  }
})

test('files exist, match recorded size and stay web-sized', async () => {
  for (const [kind, id, p] of all) {
    const file = `public${p.src}`
    assert.ok(existsSync(file), `${kind} ${id}: missing ${file}`)
    assert.match(p.src, /\.webp$/, `${kind} ${id} should be WebP`)
    assert.ok(statSync(file).size < 700 * 1024, `${kind} ${id} is over 700 KB`)
    const meta = await sharp(file).metadata()
    assert.equal(meta.width, p.width, `${kind} ${id} width`)
    assert.equal(meta.height, p.height, `${kind} ${id} height`)
    assert.ok(!meta.exif, `${kind} ${id} still carries EXIF (GPS etc.)`)
    if (p.mobile) {
      assert.ok(existsSync(`public${p.mobile.src}`), `${kind} ${id}: missing mobile crop`)
    }
  }
})

test('descriptive, lowercase filenames', () => {
  for (const [, id, p] of all) {
    assert.match(p.src, /^\/images\/discover\/[a-z-]+\/[a-z0-9-]+\.webp$/, id)
  }
})

function articleBlock(slug) {
  const at = articlesSrc.search(new RegExp(`slug:\\s*['"]${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`))
  if (at < 0) return null
  const next = articlesSrc.indexOf('\n    slug:', at + 10)
  return articlesSrc.slice(at, next < 0 ? undefined : next)
}

test('placements point at real photos, real articles and real sections', () => {
  for (const [slug, secs] of Object.entries(data.galleries)) {
    const block = articleBlock(slug)
    assert.ok(block, `gallery slug not found in articles.ts: ${slug}`)
    for (const s of secs) {
      assert.ok(s.photos.length > 0, `${slug}: empty gallery after "${s.afterSection}"`)
      assert.match(block, new RegExp(`\\n## ${s.afterSection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), `${slug}: no "## ${s.afterSection}" section`)
      for (const id of s.photos) assert.ok(data.photos[id], `${slug}: unknown photo ${id}`)
    }
  }
  for (const [slug, heroId] of Object.entries(data.heroPlacements)) {
    assert.ok(articleBlock(slug), `hero slug not found in articles.ts: ${slug}`)
    assert.ok(data.heroes[heroId], `unknown hero ${heroId}`)
  }
})

test('photos are only placed on lifestyle blog posts', () => {
  const lifestyle = /things-to-do|hidden-gems|eat-drink|places-to-eat|local-guide/
  const slugs = [...Object.keys(data.galleries), ...Object.keys(data.heroPlacements)]
  for (const slug of slugs) assert.match(slug, lifestyle, `${slug} is not a lifestyle post`)
})

test('no photo is used twice within one post', () => {
  for (const [slug, secs] of Object.entries(data.galleries)) {
    const ids = secs.flatMap((s) => s.photos)
    assert.equal(new Set(ids).size, ids.length, `${slug} repeats a photo`)
  }
})

test('the photos are not referenced from city, community or listing data', () => {
  for (const f of ['src/lib/communities.ts', 'src/lib/listings.ts']) {
    assert.ok(!readFileSync(f, 'utf8').includes('/images/discover/'), `${f} references DTPB photos`)
  }
  assert.ok(!articlesSrc.includes('/images/discover/'), 'articles.ts should not hard-wire DTPB photos; use the manifest')
})

test('sitewide offer exclusion list matches the manifest', () => {
  const paths = [...readFileSync('src/lib/discoverPaths.ts', 'utf8').matchAll(/'(\/blog\/[^']+)'/g)].map((m) => m[1]).sort()
  const expected = [...new Set([...Object.keys(data.galleries), ...Object.keys(data.heroPlacements)])].map((s) => `/blog/${s}`).sort()
  assert.deepEqual(paths, expected)
  const routing = readFileSync('src/lib/leadMagnetRouting.ts', 'utf8')
  assert.match(routing, /\.\.\.DISCOVER_POST_PATHS/, 'leadMagnetRouting no longer excludes the DTPB posts')
})

test('the blog page drops commercial blocks on DTPB posts', () => {
  const page = readFileSync('src/app/blog/[slug]/page.tsx', 'utf8')
  assert.match(page, /article\.noCommercialBlocks/, 'page does not read noCommercialBlocks')
  assert.match(page, /DeferredContactCta hide=\{article\.noCommercialBlocks\}/)
  const lib = readFileSync('src/lib/discoverPhotos.ts', 'utf8')
  for (const needle of ['inlineMagnet: false', 'marketTrends: false', 'listings: false', 'conversionBlock: false', "magnetPlacement: 'none'", 'delete next.closingStep']) {
    assert.ok(lib.includes(needle), `discoverPhotos.ts no longer sets ${needle}`)
  }
})
