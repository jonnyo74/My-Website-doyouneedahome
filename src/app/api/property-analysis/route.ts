import { NextRequest, NextResponse } from 'next/server'
import {
  buildAnalysisNote,
  buildAnalysisTags,
  isValidAddress,
  isValidEmail,
  isValidName,
  isValidPhone,
  isValidUpgrades,
  LOTUS,
  splitName,
  type LotusAnalysisSubmission,
} from '@/lib/lotusAnalysisHelpers'

/**
 * Lotus homeowners who scan the Just Listed postcard for 8804 Skyward Street
 * and ask what their own home could sell for.
 *
 * Same Follow Up Boss endpoint and same shape as /api/seller-leads and
 * /api/showing-requests — no second CRM, no database. It is a separate route
 * only because the valuation funnel requires a selling timeline and this flow
 * deliberately never asks for one.
 */
export async function POST(req: NextRequest) {
  let body: LotusAnalysisSubmission
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, phone, address, honeypot } = body

  // Honeypot — bots that fill this hidden field get a fake success so they
  // don't learn the submission was rejected. Nothing is sent to FUB.
  if (honeypot && honeypot.trim()) {
    console.warn('Lotus analysis request blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  if (!isValidName(name)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidAddress(address)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidUpgrades(body.upgrades)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  // Device is read from the request's own User-Agent rather than asked of the
  // client, so it can't be spoofed by the form payload. Only used to describe
  // how the visitor arrived in the CRM note.
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(req.headers.get('user-agent') ?? '')

  const apiKey = process.env.FUB_API_KEY
  if (!apiKey) {
    // Local development without the key: log the lead so the flow is testable
    // end-to-end. Production must be configured — a Lotus owner asking what
    // their house is worth is the most valuable thing this page captures and
    // must never be dropped silently.
    if (process.env.NODE_ENV === 'production') {
      console.error('FUB_API_KEY is not set — Lotus analysis request dropped')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Lotus analysis request:', {
      name,
      email,
      phone,
      address,
      tags: buildAnalysisTags(body),
      note: buildAnalysisNote(body, isMobile),
    })
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName } = splitName(name!)

  const fubBody = {
    source: 'doyouneedahome.com',
    system: 'doyouneedahome.com',
    type: 'Seller Inquiry',
    person: {
      firstName,
      lastName,
      emails: [{ value: email!.trim() }],
      phones: [{ value: phone!.trim(), type: 'mobile' }],
      tags: buildAnalysisTags(body),
      // The address is the owner's OWN home, not the listing — it belongs on
      // the person record so FUB shows it next to their name.
      addresses: [
        {
          street: address!.trim(),
          city: LOTUS.city,
          state: LOTUS.state,
          code: LOTUS.zip,
          type: 'home',
        },
      ],
      // This CTA exists on John's own listing page, from his own mailing.
      assignedTo: 'John Oliver',
    },
    // Consent time is stamped here, not taken from the client — a
    // self-reported timestamp is worthless as an audit record.
    message: buildAnalysisNote(
      { ...body, consentCapturedAt: new Date().toISOString() },
      isMobile
    ),
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

  return NextResponse.json({ ok: true })
}
