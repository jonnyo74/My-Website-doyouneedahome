import { NextRequest, NextResponse } from 'next/server'
import {
  buildLeadNote,
  buildLeadTags,
  createDownloadToken,
  isValidEmail,
  isValidFirstName,
  isValidInterest,
  isValidReportType,
  type LeadSubmission,
} from '@/lib/leadHelpers'
import { reportDownloadApiPath } from '@/lib/marketReports'

export async function POST(req: NextRequest) {
  let body: LeadSubmission
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { firstName, email, phone, honeypot, reportType } = body

  // Honeypot — bots that fill this hidden field get a fake success (without a
  // download URL) so they don't learn the submission was rejected.
  if (honeypot && honeypot.trim()) {
    console.warn('Lead submission blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  if (!isValidReportType(reportType)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidFirstName(firstName)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidInterest(body.interest)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const apiKey = process.env.FUB_API_KEY
  if (!apiKey) {
    // Local development without the key: log the lead and still hand back the
    // download so the flow is testable end-to-end. Production must be
    // configured — failing silently there would drop real leads.
    if (process.env.NODE_ENV === 'production') {
      console.error('FUB_API_KEY is not set — lead dropped')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Lead:', {
      firstName,
      email,
      reportType,
      interest: body.interest,
      tags: buildLeadTags(body),
      note: buildLeadNote(body),
    })
    return NextResponse.json({
      ok: true,
      downloadUrl: `${reportDownloadApiPath(reportType)}?t=${createDownloadToken(reportType)}`,
    })
  }

  const fubBody = {
    source: 'doyouneedahome.com',
    system: 'doyouneedahome.com',
    type: 'Registration',
    person: {
      firstName: firstName!.trim(),
      emails: [{ value: email!.trim() }],
      phones: phone?.trim() ? [{ value: phone.trim(), type: 'mobile' }] : [],
      tags: buildLeadTags(body),
    },
    message: buildLeadNote(body),
  }

  const res = await fetch('https://api.followupboss.com/v1/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    },
    body: JSON.stringify(fubBody),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('FUB error:', err)
    return NextResponse.json({ error: 'Lead submission failed' }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    downloadUrl: `${reportDownloadApiPath(reportType)}?t=${createDownloadToken(reportType)}`,
  })
}
