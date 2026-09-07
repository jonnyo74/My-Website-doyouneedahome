import { NextResponse, type NextRequest } from 'next/server'
import { geocodeAddress } from '@/lib/sunshade/geocoders'

/**
 * Address → coordinates.
 *
 * Proxied through the server rather than called from the browser for three
 * reasons: Nominatim's policy wants an identifying User-Agent a browser will
 * not let us set, neither upstream sends CORS headers we can rely on, and a
 * server route is the only place we can cache results so repeat searches for
 * the same address never touch the upstream at all.
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()

  if (!query || query.length < 4) {
    return NextResponse.json({ error: 'Enter a full street address.' }, { status: 400 })
  }
  if (query.length > 200) {
    return NextResponse.json({ error: 'Address is too long.' }, { status: 400 })
  }

  let outcome
  try {
    outcome = await geocodeAddress(query, AbortSignal.timeout(12_000))
  } catch {
    return NextResponse.json({ error: 'Address lookup is unavailable right now.' }, { status: 502 })
  }

  if (outcome.results.length === 0) {
    // Every provider erroring is an outage, not a bad address — say so, so the
    // user retries instead of second-guessing a perfectly good street name.
    if (outcome.failures.length > 0) {
      console.error('Sun & Shade geocode failures:', outcome.failures)
      return NextResponse.json(
        { error: 'Address lookup is unavailable right now. Please try again shortly.' },
        { status: 502 }
      )
    }
    return NextResponse.json(
      { error: 'No match found. Try including the city and state.' },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { results: outcome.results },
    {
      headers: {
        // Addresses do not move. A long shared cache keeps repeat searches and
        // shared links off the upstream entirely.
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  )
}
