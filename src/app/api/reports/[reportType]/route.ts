import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { isValidReportType, verifyDownloadToken } from '@/lib/leadHelpers'
import { marketReports } from '@/lib/marketReports'

// Streams a market-report PDF from private/reports/ (outside public/, so the
// raw file has no crawlable URL). Requires a short-lived HMAC token issued by
// /api/leads — visitors without one are redirected to the report's landing
// page to complete the form.

export async function GET(req: NextRequest, ctx: RouteContext<'/api/reports/[reportType]'>) {
  const { reportType } = await ctx.params

  if (!isValidReportType(reportType)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const report = marketReports[reportType]
  const token = req.nextUrl.searchParams.get('t')

  if (!verifyDownloadToken(reportType, token)) {
    return NextResponse.redirect(new URL(report.landingPage, req.nextUrl.origin), 302)
  }

  let file: Buffer
  try {
    file = await readFile(path.join(process.cwd(), 'private', 'reports', report.fileName))
  } catch (err) {
    console.error(`Report PDF missing: private/reports/${report.fileName}`, err)
    return NextResponse.json({ error: 'Report unavailable' }, { status: 500 })
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${report.fileName}"`,
      'Content-Length': String(file.byteLength),
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
