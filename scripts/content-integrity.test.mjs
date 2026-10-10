// Run:  npm test
// Content-integrity check for article bodies in src/lib/articles.ts.
// Catches the corruption found in several first-pass articles: a Markdown heading typed in the
// middle of a paragraph, a section heading immediately followed by another heading (its text
// displaced elsewhere), and a paragraph that starts as a sentence fragment. The renderer does
// not transform body text, so these defects are always in the data and are caught here.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

export function extractBodies(source) {
  const out = []
  const re = /slug:\s*['"]([^'"]+)['"],\s*citySlug:\s*['"]([^'"]+)['"]/g
  const marks = []
  let m
  while ((m = re.exec(source))) marks.push({ at: m.index, slug: m[1], city: m[2] })
  for (let i = 0; i < marks.length; i++) {
    const seg = source.slice(marks[i].at, i + 1 < marks.length ? marks[i + 1].at : source.length)
    const start = seg.indexOf('body: `')
    if (start < 0) continue
    const end = seg.indexOf('`,\n', start + 8)
    if (end < 0) continue
    out.push({ slug: marks[i].slug, city: marks[i].city, body: seg.slice(start + 7, end) })
  }
  return out
}

export function integrityProblems({ slug, body }) {
  const problems = []
  const lines = body.split('\n')
  let inFence = false
  let prevHeading = null
  lines.forEach((line, i) => {
    if (/^\s*(```|:::)/.test(line)) inFence = !inFence
    if (inFence) return
    const isTable = line.trimStart().startsWith('|')
    const isHeading = /^#{2,3} \S/.test(line)
    if (!isTable && !isHeading && /\S #{2,3} [A-Z]/.test(line)) {
      problems.push(`${slug}:${i + 1} heading inside a paragraph: "${line.slice(0, 90)}"`)
    }
    // An empty section is a heading followed directly by a heading of the same or higher rank.
    // A "##" followed by its first "###" is normal structure and is not flagged.
    if (isHeading && prevHeading !== null && prevHeading === i - 2 && lines[i - 1].trim() === '') {
      const rank = (l) => l.match(/^#+/)[0].length
      if (rank(line) <= rank(lines[prevHeading])) {
        problems.push(`${slug}:${i + 1} heading directly follows heading at line ${prevHeading + 1} (empty section)`)
      }
    }
    if (isHeading) prevHeading = i
    else if (line.trim() !== '') prevHeading = null
    if (/^(which|that|and|but|so|or|because|covers|where) [a-z]/.test(line)) {
      problems.push(`${slug}:${i + 1} paragraph starts as a sentence fragment: "${line.slice(0, 90)}"`)
    }
    const open = (line.match(/\[[^\]]*\]\(/g) || []).length
    const closed = (line.match(/\[[^\]]*\]\([^)\s]*(?:\s[^)]*)?\)/g) || []).length
    if (open !== closed) problems.push(`${slug}:${i + 1} unterminated Markdown link: "${line.slice(0, 90)}"`)
  })
  return problems
}

const bodies = extractBodies(readFileSync('src/lib/articles.ts', 'utf8'))

test('the extractor finds article bodies', () => {
  assert.ok(bodies.length > 150, `expected many articles, found ${bodies.length}`)
})

test('no article body has headings inside paragraphs, empty sections, fragments or broken links', () => {
  const all = bodies.flatMap(integrityProblems)
  assert.deepEqual(all, [])
})

test('the checker detects the corruption pattern it exists for', () => {
  const bad = { slug: 'x', body: 'Start early, see our [guide](/blog/a) ## The next section\n\ncovers who handles what.\n\n## A\n\n## B\n' }
  const found = integrityProblems(bad)
  assert.ok(found.some((p) => p.includes('heading inside a paragraph')))
  assert.ok(found.some((p) => p.includes('sentence fragment')))
  assert.ok(found.some((p) => p.includes('empty section')))
})
