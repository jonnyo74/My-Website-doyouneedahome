import { NextRequest, NextResponse } from 'next/server'
import { cleanPath, cleanReferrer, formatNotFoundLog } from '@/lib/notFound/logEntry'

/**
 * Receives the beacon the 404 page sends and writes one line to the server
 * log, which is where Vercel's runtime logs pick it up. Nothing is stored and
 * nothing is returned: this endpoint exists only to make dead inbound links
 * visible.
 */
export async function POST(req: NextRequest) {
  let body: { path?: unknown; referrer?: unknown }
  try {
    body = await req.json()
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  const path = cleanPath(body.path)
  if (path) {
    console.warn(formatNotFoundLog(path, cleanReferrer(body.referrer)))
  }
  return new NextResponse(null, { status: 204 })
}
