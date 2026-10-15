import { NextRequest, NextResponse } from 'next/server'
import {
  buildContactNote,
  buildContactTags,
  isValidEmail,
  isValidMessage,
  isValidName,
  isValidPageName,
  isValidPlacement,
  isValidOptionalPhone,
  splitName,
  type ContactRequestSubmission,
} from '@/lib/contactRequestHelpers'

export async function POST(req: NextRequest) {
  let body: ContactRequestSubmission
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, phone, honeypot } = body

  // Honeypot — bots that fill this hidden field get a fake success so they
  // don't learn the submission was rejected. Nothing is sent to FUB.
  if (honeypot && honeypot.trim()) {
    console.warn('Contact request blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  if (!isValidName(name) || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidOptionalPhone(phone) || !isValidMessage(body.message)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidPlacement(body.ctaPlacement) || !isValidPageName(body.pageName)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const apiKey = process.env.FUB_API_KEY
  if (!apiKey) {
    // Local development without the key: log the lead so the flow is testable
    // end-to-end. Production must be configured — failing silently there would
    // drop real leads.
    if (process.env.NODE_ENV === 'production') {
      console.error('FUB_API_KEY is not set — contact request dropped')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Contact request:', {
      name,
      email,
      tags: buildContactTags(body),
      note: buildContactNote(body),
    })
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName } = splitName(name!)

  const fubBody = {
    source: 'doyouneedahome.com',
    system: 'doyouneedahome.com',
    type: 'General Inquiry',
    person: {
      firstName,
      lastName,
      emails: [{ value: email!.trim() }],
      phones: phone?.trim() ? [{ value: phone.trim(), type: 'mobile' }] : [],
      tags: buildContactTags(body),
    },
    // Consent time is stamped here, not taken from the client — a
    // self-reported timestamp is worthless as an audit record.
    message: buildContactNote({ ...body, consentCapturedAt: new Date().toISOString() }),
  }

  let res: Response
  try {
    res = await fetch('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
      body: JSON.stringify(fubBody),
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    console.error('FUB request failed:', err)
    return NextResponse.json({ error: 'Lead submission failed' }, { status: 500 })
  }

  if (!res.ok) {
    console.error('FUB error:', await res.text())
    return NextResponse.json({ error: 'Lead submission failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
