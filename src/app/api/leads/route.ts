import { NextRequest, NextResponse } from 'next/server'
import {
  buildLeadNote,
  buildLeadTags,
  createDownloadToken,
  isValidArea,
  isValidEmail,
  isValidFirstName,
  isValidInterest,
  isValidMagnetKey,
  isValidTimeline,
  type LeadSubmission,
} from '@/lib/leadHelpers'
import { leadMagnets, magnetDownloadApiPath } from '@/lib/leadMagnets'

async function sendToFub(apiKey: string, body: unknown): Promise<boolean> {
  const res = await fetch('https://api.followupboss.com/v1/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    console.error('FUB error:', await res.text())
    return false
  }
  return true
}

export async function POST(req: NextRequest) {
  let body: LeadSubmission
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { firstName, email, phone, honeypot, magnetKey } = body

  // Honeypot — bots that fill this hidden field get a fake success (without a
  // download URL) so they don't learn the submission was rejected.
  if (honeypot && honeypot.trim()) {
    console.warn('Lead submission blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  if (!isValidMagnetKey(magnetKey)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const apiKey = process.env.FUB_API_KEY

  // ── Optional second step ────────────────────────────────────────────────
  // Area and timeline, asked only after the visitor already has their
  // download. Matched to the existing person in FUB by email; no new token is
  // issued and a failure here never affects the download they already got.
  if (body.followUp) {
    if (!isValidArea(body.areaOfInterest) && !isValidTimeline(body.timeline)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }
    if (!apiKey) {
      if (process.env.NODE_ENV === 'production') {
        console.error('FUB_API_KEY is not set — lead follow-up dropped')
        return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
      }
      console.warn('[dev] FUB_API_KEY not set — skipping CRM follow-up:', {
        email,
        magnetKey,
        tags: buildLeadTags(body),
        note: buildLeadNote(body),
      })
      return NextResponse.json({ ok: true })
    }
    const ok = await sendToFub(apiKey, {
      source: 'doyouneedahome.com',
      system: 'doyouneedahome.com',
      type: 'Registration',
      person: {
        firstName: firstName?.trim() || undefined,
        emails: [{ value: email!.trim() }],
        tags: buildLeadTags(body),
      },
      // No consent line here on purpose: this is the second-step enrichment for
      // someone who already consented on their initial submission. Stamping it
      // again would double-record the same consent under a later timestamp.
      message: buildLeadNote(body),
    })
    return ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: 'Lead submission failed' }, { status: 500 })
  }

  // ── Initial submission ──────────────────────────────────────────────────
  if (!isValidFirstName(firstName)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidInterest(body.interest)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  // An unpublished magnet has no verified content behind it — its landing page
  // 404s in production, so a submission naming it can only be forged.
  if (!leadMagnets[magnetKey].published && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const downloadUrl = `${magnetDownloadApiPath(magnetKey)}?t=${createDownloadToken(magnetKey)}`

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
      magnetKey,
      interest: body.interest,
      tags: buildLeadTags(body),
      note: buildLeadNote(body),
    })
    return NextResponse.json({ ok: true, downloadUrl })
  }

  const ok = await sendToFub(apiKey, {
    source: 'doyouneedahome.com',
    system: 'doyouneedahome.com',
    type: 'Registration',
    person: {
      firstName: firstName!.trim(),
      emails: [{ value: email!.trim() }],
      phones: phone?.trim() ? [{ value: phone.trim(), type: 'mobile' }] : [],
      tags: buildLeadTags(body),
    },
    // Consent time is stamped here, not taken from the client — a
      // self-reported timestamp is worthless as an audit record.
      message: buildLeadNote({ ...body, consentCapturedAt: new Date().toISOString() }),
  })

  if (!ok) {
    return NextResponse.json({ error: 'Lead submission failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, downloadUrl })
}
