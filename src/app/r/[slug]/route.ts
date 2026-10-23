import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

// Email-only PDF delivery for people who are already leads in Follow Up Boss.
// The public lead form still gates cold traffic (see /api/reports/[reportType]);
// this route serves the same PDFs at an unguessable, unindexed link that is only
// ever placed in emails we send. To retire a link, delete its entry below.
//
// Each slug maps to a file in private/reports/ (never publicly served otherwise).
const EMAIL_REPORTS: Record<string, string> = {
  'pbc-sept-2026-1ae967b875e7': 'palm-beach-county-market-report-september-2026.pdf',
  'mar-sept-2026-4d2df6121414': 'martin-county-market-report-september-2026.pdf',
  'stl-sept-2026-1d5fa6bc7e87': 'st-lucie-county-market-report-september-2026.pdf',
}

export async function GET(_req: Request, ctx: RouteContext<'/r/[slug]'>) {
  const { slug } = await ctx.params
  const fileName = EMAIL_REPORTS[slug]

  if (!fileName) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let file: Buffer
  try {
    file = await readFile(path.join(process.cwd(), 'private', 'reports', fileName))
  } catch (err) {
    console.error(`Email report PDF missing: private/reports/${fileName}`, err)
    return NextResponse.json({ error: 'Report unavailable' }, { status: 500 })
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Content-Length': String(file.byteLength),
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
