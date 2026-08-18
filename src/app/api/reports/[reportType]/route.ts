import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { isValidMagnetKey, verifyDownloadToken } from '@/lib/leadHelpers'
import { leadMagnets } from '@/lib/leadMagnets'

// Streams a lead-magnet PDF from private/reports/ (outside public/, so the raw
// file has no crawlable URL). Requires a short-lived HMAC token issued by
// /api/leads — visitors without one are redirected to the magnet's landing
// page to complete the form.
//
// The route param is still named [reportType] because next.config.ts pins
// outputFileTracingIncludes to that exact route path; the value it carries is a
// lead-magnet registry key.

export async function GET(req: NextRequest, ctx: RouteContext<'/api/reports/[reportType]'>) {
  const { reportType } = await ctx.params

  if (!isValidMagnetKey(reportType)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const magnet = leadMagnets[reportType]

  // An unpublished magnet has no finished PDF in production.
  if (!magnet.published && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const token = req.nextUrl.searchParams.get('t')

  if (!verifyDownloadToken(reportType, token)) {
    return NextResponse.redirect(new URL(magnet.landingPage, req.nextUrl.origin), 302)
  }

  let file: Buffer
  try {
    file = await readFile(path.join(process.cwd(), 'private', 'reports', magnet.fileName))
  } catch (err) {
    console.error(`Lead-magnet PDF missing: private/reports/${magnet.fileName}`, err)
    return NextResponse.json({ error: 'Report unavailable' }, { status: 500 })
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${magnet.fileName}"`,
      'Content-Length': String(file.byteLength),
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
