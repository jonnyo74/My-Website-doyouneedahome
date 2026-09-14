/**
 * Matching a typed address to a county parcel record.
 *
 * Why this exists: no free geocoder points at buildings. Census interpolates
 * along a street's address range, and Nominatim mostly does the same in these
 * subdivisions — for 2414 24th Lane, Palm Beach Gardens the two agreed with
 * each other to within 7 m and were both 61 m from the actual parcel, which in
 * a condo community is somebody else's roof.
 *
 * The county roll does know where 2414 is. So rather than trusting the pin, we
 * ask the cadastral layer for every parcel in a box around it and find the one
 * whose PHY_ADDR1 matches what the user typed. That is the same method used to
 * derive the listing coordinates in listings.ts, where it agreed with the MLS
 * on all three.
 *
 * It is deliberately conservative: an ambiguous match returns null and the pin
 * stays where the geocoder put it, because moving it to the wrong house is
 * worse than leaving it in the road.
 */

/** Street-type words. Dropped before comparing, so "24TH LN" matches "24th Lane". */
const STREET_SUFFIXES = new Set([
  'ST', 'STREET', 'AVE', 'AVENUE', 'RD', 'ROAD', 'DR', 'DRIVE', 'LN', 'LANE',
  'CT', 'COURT', 'CIR', 'CIRCLE', 'TER', 'TERRACE', 'TRL', 'TRAIL', 'WAY',
  'BLVD', 'BOULEVARD', 'PL', 'PLACE', 'PKWY', 'PARKWAY', 'HWY', 'HIGHWAY',
  'LOOP', 'RUN', 'BND', 'BEND', 'PT', 'POINT', 'SQ', 'SQUARE',
])

/** Directional prefixes. Also dropped: the roll and the typist disagree about
 *  them constantly ("SE Audubon Ln" vs "Audubon Lane"). */
const DIRECTIONALS = new Set([
  'N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW',
  'NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST',
])

/** The leading house number of an address, or null if it does not start with one. */
export function extractStreetNumber(address: string): string | null {
  const match = /^\s*(\d+)\b/.exec(address.trim())
  return match ? match[1] : null
}

/**
 * The meaningful words of a street name: uppercased, punctuation stripped, with
 * the house number, directionals and street type removed. "2414 24th Lane"
 * and "2414 24TH LN" both reduce to ["24TH"].
 */
export function streetTokens(address: string): string[] {
  return address
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .filter((token, index) => !(index === 0 && /^\d+$/.test(token)))
    .filter((token) => !STREET_SUFFIXES.has(token) && !DIRECTIONALS.has(token))
}

/** 0–1 overlap between two token lists. 1 when every token of the shorter list
 *  appears in the longer one. */
function tokenOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0
  const setB = new Set(b)
  const shared = a.filter((t) => setB.has(t)).length
  return shared / Math.min(a.length, b.length)
}

export interface AddressCandidate {
  /** PHY_ADDR1 exactly as the roll holds it. */
  address: string
}

/**
 * The candidate whose address is the searched one, or null when it cannot be
 * told apart.
 *
 * The house number must match exactly — that alone is not enough, because a
 * single block can hold "982 SW Worcester Ln" and "982 SW General Patton Ter"
 * (it does, in Port St. Lucie), which is why the street name is scored too.
 */
export function pickAddressMatch<T extends AddressCandidate>(
  candidates: T[],
  query: string
): T | null {
  const number = extractStreetNumber(query)
  if (!number) return null

  const wanted = streetTokens(query)
  const sameNumber = candidates.filter(
    (c) => extractStreetNumber(c.address) === number
  )
  if (sameNumber.length === 0) return null
  if (sameNumber.length === 1) {
    // A lone match on the house number is accepted only if the street does not
    // actively disagree — an empty query street means we have nothing to check
    // against, which is still better than the interpolated pin.
    const score = tokenOverlap(wanted, streetTokens(sameNumber[0].address))
    return wanted.length === 0 || score > 0 ? sameNumber[0] : null
  }

  const scored = sameNumber
    .map((c) => ({ candidate: c, score: tokenOverlap(wanted, streetTokens(c.address)) }))
    .sort((a, b) => b.score - a.score)

  // Require a clear winner. Two parcels scoring the same means we cannot tell
  // which the user meant, and a coin-flip here puts the pin on a stranger's roof.
  if (scored[0].score < 0.5) return null
  if (scored.length > 1 && scored[1].score >= scored[0].score) return null
  return scored[0].candidate
}
