import streetRows from '@/data/floridaStreets.json'
import type { Suggestion } from './suggest'

/**
 * Keyless street-address typeahead.
 *
 * The problem: no free service does US street-address autocomplete. Six were
 * tested — Photon returns Tennessee and Pennsylvania for a Florida query, the
 * Census geocoder needs a complete address, Nominatim's policy forbids
 * per-keystroke use, and a prefix query against the state cadastral layer is
 * rejected after ~55s whether or not it is bounded to a county.
 *
 * The trick is that we do not need a service that knows house numbers, because
 * the USER types the house number. We only need to know the streets. There are
 * about 17,000 of those across the counties this site covers — small enough to
 * commit — against ~870,000 addresses, which would not be.
 *
 * So "2414 24th L" becomes "2414 24th Lane, Palm Beach Gardens" by joining
 * what was typed to what was matched. Picking it geocodes that string and then
 * snaps to the county parcel record, which is what actually puts the pin on the
 * roof — see `parcelMatch.ts`.
 *
 * Set GEOAPIFY_API_KEY and a real provider's results merge in ahead of these.
 * This is the floor, not the ceiling.
 */

/** [street name, nearest named place, lat, lng] — see scripts/build-street-index.mjs. */
type StreetRow = [string, string, number, number]

const STREETS = streetRows as StreetRow[]

/**
 * Compass directions, and the abbreviations people actually type.
 *
 * Two separate problems, both of which made most of this index unreachable.
 *
 * Every address on this coast is WRITTEN abbreviated - "982 SW Worcester Lane"
 * - while OpenStreetMap spells the direction out. And the two halves of the
 * region disagree about where it goes: Palm Beach County holds "Southwest
 * Martin Downs Boulevard", while Port St. Lucie - 5,712 streets, the largest
 * single place in the index - holds "10th Avenue Southwest" for a street
 * every resident writes as "SW 10th Avenue". A prefix scan matched neither.
 *
 * So the direction is removed from both sides before comparison and used only
 * to rank. "SW 10th Avenue" and "10th Avenue Southwest" both reduce to "10th
 * avenue" and match; the row whose direction the typist actually named is then
 * lifted above its three siblings.
 *
 * Street-type suffixes are deliberately NOT normalised. "St" is Street in "SE
 * 20th St" and Saint in "SE St Lucie Boulevard", and nothing in the token says
 * which; guessing would trade one class of missed match for a worse one.
 */
const DIRECTIONS: Record<string, string> = {
  n: 'north',
  s: 'south',
  e: 'east',
  w: 'west',
  ne: 'northeast',
  nw: 'northwest',
  se: 'southeast',
  sw: 'southwest',
}

const DIRECTION_WORDS = new Set(Object.values(DIRECTIONS))

/**
 * Reduces a street name to the part worth matching on.
 *
 * `lastTokenPartial` is the whole reason this takes a flag. In a typeahead
 * the final token is usually half-typed, and a half-typed token must be left
 * exactly as it is: expanding the "w" of "Ocean W" to "west" turns a live
 * search for Ocean Way into no results at all. Index names are complete, so
 * they are canonicalised with the flag off.
 */
function canonicalise(value: string, lastTokenPartial: boolean): string {
  const tokens = value.toLowerCase().replace(/\./g, '').split(/\s+/).filter(Boolean)
  const kept: string[] = []

  tokens.forEach((token, i) => {
    if (lastTokenPartial && i === tokens.length - 1) {
      kept.push(token)
      return
    }
    const expanded = DIRECTIONS[token] ?? token
    if (DIRECTION_WORDS.has(expanded)) return
    kept.push(expanded)
  })

  return kept.join(' ').trim()
}

/**
 * The query with a half-typed trailing direction removed, or empty when the
 * last token could not be the start of one.
 */
function partialDirectionDropped(value: string): string {
  const tokens = value.toLowerCase().replace(/\./g, '').split(/\s+/).filter(Boolean)
  if (tokens.length < 2) return ''
  const last = tokens[tokens.length - 1]
  let couldBeDirection = false
  for (const word of DIRECTION_WORDS) {
    if (word.startsWith(last)) {
      couldBeDirection = true
      break
    }
  }
  if (!couldBeDirection) return ''
  return canonicalise(tokens.slice(0, -1).join(' '), false)
}

/** The compass directions named in a string, for ranking. */
function directionsIn(value: string): Set<string> {
  const found = new Set<string>()
  for (const token of value.toLowerCase().replace(/\./g, '').split(/\s+/)) {
    const expanded = DIRECTIONS[token] ?? token
    if (DIRECTION_WORDS.has(expanded)) found.add(expanded)
  }
  return found
}
/** Lower-cased street names, computed once, so a keystroke is a scan and not
 *  17,000 `toLowerCase()` calls. */
const NORMALISED: string[] = STREETS.map((row) => canonicalise(row[0], false))

/**
 * The names exactly as indexed, still matched against alongside the canonical
 * form. Everything the old prefix scan found, it still finds - canonicalising
 * only ever adds. Without this a lone half-typed direction ("1200 Northeas")
 * would match nothing at all, because the canonical index has no directions
 * left in it to match against.
 */
const RAW: string[] = STREETS.map((row) => row[0].toLowerCase())

interface ParsedQuery {
  number: string
  street: string
  /** Anything after a comma — a city the user has already typed, used to rank. */
  placeHint: string
}

/**
 * Splits "2414 24th Lane, Palm Beach Gardens" into its parts.
 *
 * Returns null without a leading house number. That is the whole contract of
 * this module: it completes the street half of an address whose number the user
 * has already supplied, so with no number there is nothing to complete.
 */
export function parseAddressQuery(query: string): ParsedQuery | null {
  const match = /^\s*(\d+)\s+(.*)$/.exec(query)
  if (!match) return null

  const [, number, remainder] = match
  const [streetPart, ...rest] = remainder.split(',')
  const street = streetPart.trim().toLowerCase()
  if (street.length < 2) return null

  return { number, street, placeHint: rest.join(' ').trim().toLowerCase() }
}

/**
 * Street suggestions for a partly-typed address.
 *
 * Ranking, in order: streets whose name STARTS with what was typed beat those
 * that merely contain it; a place the user has already named wins; and shorter
 * names win ties, because "24th Lane" is a likelier target than
 * "24th Lane Service Road" when someone has typed "24th L".
 */
export function streetSuggestions(query: string, limit = 5): Suggestion[] {
  const parsed = parseAddressQuery(query)
  if (!parsed) return []

  const { number, placeHint } = parsed
  // The final token is ambiguous: in "Ocean W" the w is the start of Way, in
  // "10th Avenue W" it is the direction. Rather than guess, both readings are
  // matched - kept as typed, and stripped as a direction - and a row counts if
  // either lands. The longer form wins on score, so the more specific reading
  // is preferred when both match.
  const streetKept = canonicalise(parsed.street, true)
  const streetStripped = canonicalise(parsed.street, false)
  // And a third reading, for a direction only half typed: "130th Trail Nort" is
  // on its way to North, which the index has already had stripped out, so the
  // fragment has to be droppable too.
  const streetTruncated = partialDirectionDropped(parsed.street)
  const candidates = [streetKept, streetStripped, streetTruncated].filter(Boolean)
  if (!candidates.length) return []
  const wanted = directionsIn(parsed.street)
  // Each canonical reading is tested against the canonical index, and the raw
  // query against the raw index, so no previously working match can be lost.
  const rawStreet = parsed.street
  const probes = (i: number): [string, string][] => [
    ...candidates.map((c) => [c, NORMALISED[i]] as [string, string]),
    [rawStreet, RAW[i]],
  ]

  const scored: { row: StreetRow; score: number }[] = []

  for (let i = 0; i < STREETS.length; i += 1) {
    let score = -1
    let matchedLength = 0
    let matchedName = NORMALISED[i]
    for (const [candidate, target] of probes(i)) {
      if (!candidate) continue
      const candidateScore = target.startsWith(candidate) ? 100 : target.includes(candidate) ? 50 : -1
      if (candidateScore > score || (candidateScore === score && candidate.length > matchedLength)) {
        score = candidateScore
        matchedLength = candidate.length
        matchedName = target
      }
    }
    if (score < 0) continue

    const row = STREETS[i]
    if (placeHint && row[1].toLowerCase().startsWith(placeHint)) score += 40
    // Direction is stripped before matching, so "SW 10th Avenue" finds all four
    // 10th Avenues. Lift the one the typist actually asked for.
    if (wanted.size) {
      const rowDirections = directionsIn(row[0])
      for (const d of wanted) {
        if (rowDirections.has(d)) {
          score += 30
          break
        }
      }
    }
    // Prefer the closest-length match, so an exact street name outranks a
    // longer one that happens to contain it.
    score -= Math.min(20, Math.abs(matchedName.length - matchedLength))

    scored.push({ row, score })
  }

  scored.sort((a, b) => b.score - a.score)

  const seen = new Set<string>()
  const suggestions: Suggestion[] = []

  for (const { row } of scored) {
    const [name, place] = row
    const label = `${number} ${name}, ${place}`
    const key = label.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)

    suggestions.push({
      id: `street-${key}`,
      label,
      detail: 'Street match — the house number is yours',
      kind: 'address',
      // Deliberately no coordinates. A long street's midpoint is not the
      // house, so selecting this geocodes the full string and then snaps to the
      // county parcel, which is the path that lands on the right roof.
      query: `${number} ${name}, ${place}, FL`,
    })
    if (suggestions.length >= limit) break
  }

  return suggestions
}
