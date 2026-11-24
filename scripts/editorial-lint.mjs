// Editorial lint: counts the phrases EDITORIAL_STYLE_GUIDE.md discourages.
//
//   node scripts/editorial-lint.mjs [file ...]        report, exit 0
//   node scripts/editorial-lint.mjs --strict [file ...]  exit 1 if a BANNED phrase is found
//
// It reads source files, so it sees JSX text and string literals together with
// code. It is a tripwire, not a judge: a hit means "look at this sentence".
// Phrases the guide allows in context (a quoted source, the apostrophe
// explanation) go in ALLOW below with the reason.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const DEFAULT_FILES = [
  'src/lib/admiralsCove.ts',
  'src/components/AdmiralsCoveLanding.tsx',
  'src/components/clubCommunity/ClubMembershipCta.tsx',
  'src/components/clubCommunity/SourceRegister.tsx',
  'src/components/clubCommunity/ReviewedBy.tsx',
  'src/components/clubCommunity/RecordedSales.tsx',
  'src/components/clubCommunity/ClubQuickFacts.tsx',
]

/** Research-report voice. Banned in consumer-facing copy. */
export const REPORT_VOICE = [
  'according to (?:the )?(?:public |historical )?(?:records|information|documentation|various sources)',
  'based on (?:our research|available (?:information|documentation))',
  'publicly available',
  'historical records',
  'research suggests',
  'available information',
  'worth noting',
  'important to note',
  'should be noted',
  'as documented by',
  'sources indicate',
  'prospective (?:purchasers|buyers) should be aware',
  'is characterized by',
  'the development comprises',
  'records reflect',
  'our research has identified',
  'as of this writing',
  'interestingly',
  'furthermore',
  'moreover',
  'in conclusion',
]

/** Real estate clichés. Banned. */
export const CLICHES = [
  'nestled',
  'hidden gem',
  'unparalleled',
  'epitome of',
  'boasts?',
  'world-class',
  'prestigious enclave',
  'something for everyone',
  'where luxury meets',
  'second to none',
  'resort-style paradise',
  'breathtaking',
  'exquisite',
  'meticulously',
  'vibrant tapestry',
  'seamlessly blends?',
  'unmatched sophistication',
  'a testament to',
  'oasis of tranquility',
]

/** Discouraged: allowed a few times, each one should earn its place. */
export const WATCH = [
  'we (?:could not|couldn[’\']t|were unable to|have not been able to) (?:confirm|verify|reconcile)',
  'could not be confirmed',
  'by our (?:own )?measurement',
  'county records',
  'per the (?:master|club)',
  'luxury',
  'exclusive',
  'championship',
]

const ALLOW = []

const flags = process.argv.slice(2).filter((a) => a.startsWith('--'))
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'))

export function scan(text) {
  const out = { banned: [], watch: [], emDashes: 0 }
  for (const [list, bucket] of [[[...REPORT_VOICE, ...CLICHES], 'banned'], [WATCH, 'watch']]) {
    for (const p of list) {
      const hits = text.match(new RegExp(`\\b${p}`, 'gi')) ?? []
      for (const h of hits) if (!ALLOW.includes(h.toLowerCase())) out[bucket].push(h.toLowerCase())
    }
  }
  // Em dashes in prose: strip comments and import lines first.
  const prose = text
    .split('\n')
    .filter((l) => !/^\s*(\/\/|\*|\/\*|import )/.test(l))
    .join('\n')
  out.emDashes = (prose.match(/—/g) ?? []).length
  return out
}

function run(paths) {
  let bannedTotal = 0
  const watchTotals = new Map()
  let dashes = 0
  for (const f of paths) {
    const r = scan(readFileSync(f, 'utf8'))
    bannedTotal += r.banned.length
    dashes += r.emDashes
    for (const w of r.watch) watchTotals.set(w, (watchTotals.get(w) ?? 0) + 1)
    if (r.banned.length) console.log(`BANNED  ${f}: ${[...new Set(r.banned)].join(', ')} (${r.banned.length})`)
  }
  console.log(`\nBanned phrases: ${bannedTotal}`)
  console.log(`Em dashes in copy: ${dashes}`)
  console.log('Watch list:')
  for (const [k, v] of [...watchTotals].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`)
  return bannedTotal
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const banned = run(files.length ? files : DEFAULT_FILES)
  if (flags.includes('--strict') && banned > 0) process.exit(1)
}
