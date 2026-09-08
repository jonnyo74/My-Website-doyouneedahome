import { NextResponse, type NextRequest } from 'next/server'
import { addressSuggestions, localSuggestions, type Suggestion } from '@/lib/sunshade/suggest'

/**
 * Typeahead for the analyzer's address box.
 *
 * Server-side because the local index is built from `communities.ts` and
 * `listings.ts`, which together run to thousands of lines — shipping them to
 * the browser to filter on a keystroke would cost more than the feature is
 * worth. The route returns a handful of small objects instead.
 *
 * Address results are merged AHEAD of local ones because when someone has typed
 * enough for a street match, that is what they meant. Local results always
 * appear, so the box is useful with or without an API key.
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (query.length < 2 || query.length > 120) {
    return NextResponse.json({ suggestions: [] as Suggestion[] })
  }

  const local = localSuggestions(query)

  let addresses: Suggestion[] = []
  try {
    // Short timeout on purpose: a typeahead that arrives after the user has
    // finished typing is worse than one that quietly does not arrive at all.
    addresses = await addressSuggestions(query, AbortSignal.timeout(2_500))
  } catch (error) {
    // Never fails the request — the local suggestions are still good.
    console.error('Sun & Shade address autocomplete failed:', error)
  }

  const seen = new Set<string>()
  const suggestions = [...addresses, ...local].filter((s) => {
    const key = s.label.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return NextResponse.json(
    { suggestions: suggestions.slice(0, 8), addressProvider: addresses.length > 0 },
    {
      // Private, because the query is something a person is mid-way through
      // typing. Short, because the local index only changes on deploy.
      headers: { 'Cache-Control': 'private, max-age=300' },
    }
  )
}
