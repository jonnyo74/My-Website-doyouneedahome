// Run:  npm test
// Tests for the North Palm Beach image-provenance manifest, using the shared city image guard.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { extractArticles, checkAll, checkManifest, rejection, provisionalImages } from './lib/pbg-image-guard.mjs'

const manifest = JSON.parse(readFileSync('src/lib/northPalmBeachImageProvenance.json', 'utf8'))
const articles = extractArticles(readFileSync('src/lib/articles.ts', 'utf8'), 'north-palm-beach')
const folder = 'public/images/north-palm-beach'

test('the parser finds all ten North Palm Beach articles, each with a hero', () => {
  assert.equal(articles.length, 10)
  assert.ok(articles.every((a) => a.hero))
})

test('every North Palm Beach article passes the guard', () => {
  const { failures } = checkAll(articles, manifest, [])
  assert.deepEqual(failures, [])
})

test('the manifest covers every file in the folder and is well formed', () => {
  const files = readdirSync(folder).filter((f) => !f.endsWith('.md')).map((f) => `/images/north-palm-beach/${f}`)
  assert.deepEqual(checkManifest(manifest, files), [])
})

test('every manifest image is provisional until the location is confirmed, and the audit reports it', () => {
  assert.ok(manifest.images.every((e) => e.provisional === true))
  assert.ok(provisionalImages(articles, manifest).length >= 10)
})

test('each article hero is a distinct 16:9 crop that is not reused in its own body', () => {
  const heroes = articles.map((a) => a.hero)
  assert.equal(new Set(heroes).size, 10)
  for (const a of articles) {
    assert.equal(a.heroW, 1600)
    assert.equal(a.heroH, 900)
    assert.ok(!a.bodyImages.includes(a.hero))
  }
})

test('every hero has a panel and a mobile crop on disk with the sizes the layout expects', async () => {
  const sharp = (await import('sharp')).default
  for (const a of articles) {
    const key = a.hero.match(/npb-([a-z]+)-hero\.webp$/)?.[1]
    assert.ok(key, `${a.slug} hero is not an npb crop`)
    for (const [variant, w, h] of [['hero', 1600, 900], ['panel', 960, 1200], ['mobile', 1200, 800]]) {
      const f = `${folder}/npb-${key}-${variant}.webp`
      assert.ok(existsSync(f), `${f} missing`)
      const m = await sharp(f).metadata()
      assert.deepEqual([m.width, m.height], [w, h], f)
    }
  }
})

test('a photograph recorded for another city is rejected on a North Palm Beach page', () => {
  const bad = { path: '/images/north-palm-beach/x.jpg', locality: 'Jupiter', source: 's', verification: 'v', width: 1, height: 1 }
  assert.match(rejection(bad, manifest.allowedLocality), /not North Palm Beach/)
})
