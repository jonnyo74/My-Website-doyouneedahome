// Run:  npm test
// Tests for the Wellington image-provenance manifest, using the same guard as Palm Beach Gardens.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { extractArticles, checkArticle, checkAll, checkManifest, rejection, provisionalImages } from './lib/pbg-image-guard.mjs'

const manifest = JSON.parse(readFileSync('src/lib/wellingtonImageProvenance.json', 'utf8'))
const pbgManifest = JSON.parse(readFileSync('src/lib/pbgImageProvenance.json', 'utf8'))
const articles = extractArticles(readFileSync('src/lib/articles.ts', 'utf8'), 'wellington')
const folder = 'public/images/wellington'
const POLO = '/images/wellington/wellington-003.jpeg'

test('the parser finds all ten Wellington articles, each with a hero', () => {
  assert.equal(articles.length, 10)
  assert.ok(articles.every((a) => a.hero))
})

test('every Wellington article passes the guard', () => {
  assert.deepEqual(checkAll(articles, manifest, []).failures, [])
})

test('the manifest covers every file in the folder and is well formed', () => {
  const files = readdirSync(folder).filter((f) => !f.endsWith('.md')).map((f) => `/images/wellington/${f}`)
  assert.deepEqual(checkManifest(manifest, files), [])
})

test('every manifest image is flagged provisional until the venue is confirmed', () => {
  assert.ok(manifest.images.filter((e) => !e.stock).every((e) => e.provisional === true))
  assert.match(manifest.images[0].verification, /Provisional/)
})

test('the audit reports provisional images instead of passing silently', () => {
  assert.ok(provisionalImages(articles, manifest).length >= 10)
})

test('heroes are distinct per article and never reused in that article body', () => {
  const heroes = articles.map((a) => a.hero)
  assert.equal(new Set(heroes).size, 10)
  for (const a of articles) assert.ok(!a.bodyImages.includes(a.hero))
})

test('a Palm Beach Gardens image is rejected on a Wellington page, and the reverse', () => {
  const pbg = pbgManifest.images.find((e) => e.locality === 'Palm Beach Gardens')
  const v = checkArticle({ slug: 'x', hero: pbg.path, heroW: null, heroH: null, bodyImages: [], allImages: [pbg.path] }, manifest)
  assert.ok(v.some((x) => /no entry/.test(x.message)))
  const w = checkArticle({ slug: 'x', hero: POLO, heroW: null, heroH: null, bodyImages: [], allImages: [POLO] }, pbgManifest)
  assert.ok(w.length > 0)
})

test('an image with the wrong locality is rejected for Wellington', () => {
  const bad = { path: '/images/wellington/x.jpg', locality: 'Royal Palm Beach', source: 's', verification: 'v', width: 1, height: 1 }
  assert.match(rejection(bad, manifest.allowedLocality), /not Wellington/)
})

test('declared hero dimensions must match the manifest', () => {
  const a = articles[0]
  const v = checkArticle({ ...a, heroW: 2048, heroH: 1152 }, manifest)
  assert.ok(v.some((x) => x.kind === 'hero-dimensions'))
})

test('no Wellington article names a polo venue in a caption or alt text', () => {
  const src = readFileSync('src/lib/articles.ts', 'utf8')
  const start = src.indexOf('// ===================== WELLINGTON')
  const end = src.indexOf('// ===================== ROYAL PALM BEACH')
  const block = src.slice(start, end)
  const captions = [...block.matchAll(/!\[[^\]]*\]\([^)]*\)/g)].map((m) => m[0]).join('\n')
  assert.doesNotMatch(captions, /National Polo Center|International Polo Club|Grand Champions|Palm Beach Polo/i)
})

test('illustrative stock is allowed only with a credit and licence, and wrong places still fail', () => {
  const ok = { path: '/images/wellington/s.webp', stock: true, locality: 'Illustrative stock (not a Wellington place)', credit: 'Photo by A / Unsplash', license: 'Unsplash License', source: 's', verification: 'v', width: 1, height: 1 }
  assert.equal(rejection(ok, manifest.allowedLocality), null)
  assert.match(rejection({ ...ok, credit: '' }, manifest.allowedLocality), /no photographer credit/)
  assert.match(rejection({ ...ok, license: '' }, manifest.allowedLocality), /no licence/)
  assert.match(rejection({ ...ok, stock: false }, manifest.allowedLocality), /not Wellington/)
})

test('stock images in the Wellington manifest are credited Unsplash photos and are not provisional venue claims', () => {
  const stock = manifest.images.filter((e) => e.stock)
  assert.ok(stock.length >= 2)
  assert.ok(stock.every((e) => /Unsplash/.test(e.credit) && /Unsplash License/.test(e.license)))
})
