// Guards the blog against two failure modes that are invisible in review:
//
//   1. Internal links that point at a slug which does not exist, or at an
//      article that is `published: false` (a 301 hop, or a dead end if the
//      article is ever republished).
//
//   2. A published article whose own slug is still a redirect source in
//      next.config.ts. Next generates the page, the 301 then redirects every
//      visitor away from it, and the article is live but unreachable. This has
//      happened here before and cost two days. Flipping `published: true`
//      requires deleting the matching redirect in the SAME change.
//
// Run before republishing anything:  npm run audit:links
// Exits non-zero on any finding.
//
// Parsing notes — articles.ts is machine-hostile in two ways, and getting
// either wrong makes this script report clean when it is not:
//   * the file is CRLF, so line-anchored regexes need normalized newlines;
//   * quote style is mixed (most articles use "double" for internalLinks, a
//     minority use 'single'), so every string field must accept either.
// The coverage assertions below exist so a parsing miss fails loudly instead
// of masquerading as a passing audit.

import { readFileSync } from 'node:fs'

const ARTICLES = 'src/lib/articles.ts'
const CONFIG = 'next.config.ts'

const read = (f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const articlesSrc = read(ARTICLES)
const configSrc = read(CONFIG)

// ---------------------------------------------------------------- articles --

const blocks = articlesSrc.split(/\n  \{\n/).slice(1)

const articles = blocks.map((raw, i) => {
  // Trim at the closing `  },` so a block never bleeds into the next object or
  // into the helper functions that follow the array.
  const end = raw.search(/\n  \},?\n/)
  const block = end === -1 ? raw : raw.slice(0, end)

  const slug = block.match(/^    slug: ['"]([^'"]+)['"],$/m)?.[1]
  const published = block.match(/^    published: (true|false),$/m)?.[1]
  if (!slug || published === undefined) {
    throw new Error(`cannot parse article #${i} (slug=${slug} published=${published})`)
  }

  const marker = '    body: `'
  const start = block.indexOf(marker)
  const body =
    start === -1 ? '' : block.slice(start + marker.length, block.indexOf('`,\n', start))

  // internalLinks appears both inline and wrapped across lines.
  const rawLinks = block.match(/^    internalLinks: \[([\s\S]*?)\],$/m)?.[1] ?? ''
  const internalLinks = [...rawLinks.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1])

  return { slug, published: published === 'true', body, internalLinks }
})

// Coverage assertions: a silent parse gap must fail, not pass.
const slugCount = (articlesSrc.match(/^    slug: /gm) ?? []).length
if (articles.length !== slugCount) {
  throw new Error(`parsed ${articles.length} articles but file declares ${slugCount}`)
}
const parsedBodyLinks = articles.reduce(
  (n, a) => n + [...a.body.matchAll(/\]\(\/blog\//g)].length,
  0,
)
const fileBodyLinks = (articlesSrc.match(/\]\(\/blog\//g) ?? []).length
if (parsedBodyLinks !== fileBodyLinks) {
  throw new Error(`parsed ${parsedBodyLinks} body links but file has ${fileBodyLinks}`)
}

const bySlug = new Map(articles.map((a) => [a.slug, a]))
if (bySlug.size !== articles.length) throw new Error('duplicate slugs in articles.ts')

// --------------------------------------------------------------- redirects --

const redirects = [
  ...configSrc.matchAll(
    /source: '\/blog\/([^']+)',\s*destination: '\/blog\/([^']+)',\s*permanent: (true|false)/g,
  ),
].map((m) => ({ from: m[1], to: m[2], permanent: m[3] === 'true' }))

const redirectFrom = new Map(redirects.map((r) => [r.from, r]))

// ------------------------------------------------------------------ checks --

const failures = []
const fail = (check, detail) => failures.push({ check, detail })

// 1. Internal links resolve to an existing, published article.
for (const a of articles) {
  const refs = [
    ...[...a.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)].map((m) => ({
      target: m[1],
      where: 'body',
    })),
    ...a.internalLinks.map((target) => ({ target, where: 'internalLinks' })),
  ]

  for (const { target, where } of refs) {
    const dest = bySlug.get(target)
    const scope = a.published ? 'LIVE' : 'retired'
    if (!dest) {
      fail('dead-link', `[${scope}] ${a.slug} -> ${target} (no such article) via ${where}`)
    } else if (!dest.published) {
      fail(
        'link-to-unpublished',
        `[${scope}] ${a.slug} -> ${target} (published: false) via ${where}`,
      )
    }
  }
}

// 2. THE TRIPWIRE — a published article must not have a redirect on its slug.
for (const a of articles) {
  if (a.published && redirectFrom.has(a.slug)) {
    fail(
      'live-but-unreachable',
      `${a.slug} is published: true but next.config.ts still redirects ` +
        `/blog/${a.slug} -> /blog/${redirectFrom.get(a.slug).to}. ` +
        `Delete that redirect, or the article is live and unreachable.`,
    )
  }
}

// 3. Redirect destinations must exist, be published, and not chain.
for (const r of redirects) {
  const dest = bySlug.get(r.to)
  if (!dest) fail('redirect-dest-missing', `/blog/${r.from} -> /blog/${r.to} (no such article)`)
  else if (!dest.published) {
    fail('redirect-dest-unpublished', `/blog/${r.from} -> /blog/${r.to} (published: false)`)
  }
  if (redirectFrom.has(r.to)) {
    fail('redirect-chain', `/blog/${r.from} -> /blog/${r.to}, which itself redirects`)
  }
}

// ------------------------------------------------------------------ report --

const live = articles.filter((a) => a.published).length
const internalLinkCount = articles.reduce((n, a) => n + a.internalLinks.length, 0)

console.log(
  `checked ${articles.length} articles (${live} published), ` +
    `${parsedBodyLinks} body links, ${internalLinkCount} internalLinks entries, ` +
    `${redirects.length} blog redirects`,
)

if (!failures.length) {
  console.log('\nOK - no dead links, no 301 hops, no live-but-unreachable articles.')
  process.exit(0)
}

const grouped = new Map()
for (const f of failures) {
  if (!grouped.has(f.check)) grouped.set(f.check, [])
  grouped.get(f.check).push(f.detail)
}
console.error(`\n${failures.length} problem(s) found:\n`)
for (const [check, details] of grouped) {
  console.error(`  ${check} (${details.length})`)
  for (const d of details) console.error(`    - ${d}`)
  console.error('')
}
process.exit(1)
