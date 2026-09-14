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

/** Lower-cased street names, computed once, so a keystroke is a scan and not
 *  17,000 `toLowerCase()` calls. */
const NORMALISED: string[] = STREETS.map((row) => row[0].toLowerCase())

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

  const { number, street, placeHint } = parsed
  const scored: { row: StreetRow; score: number }[] = []

  for (let i = 0; i < STREETS.length; i += 1) {
    const name = NORMALISED[i]
    let score: number
    if (name.startsWith(street)) score = 100
    else if (name.includes(street)) score = 50
    else continue

    const row = STREETS[i]
    if (placeHint && row[1].toLowerCase().startsWith(placeHint)) score += 40
    // Prefer the closest-length match, so an exact street name outranks a
    // longer one that happens to contain it.
    score -= Math.min(20, name.length - street.length)

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
