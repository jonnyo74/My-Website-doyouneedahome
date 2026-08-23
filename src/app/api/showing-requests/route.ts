import { NextRequest, NextResponse } from 'next/server'
import {
  buildShowingNote,
  buildShowingTags,
  isValidAffiliation,
  isValidEmail,
  isValidListingKey,
  isValidName,
  isValidPhone,
  isValidWindow,
  SHOWING_LISTINGS,
  splitName,
  type ShowingRequestSubmission,
} from '@/lib/showingRequestHelpers'

export async function POST(req: NextRequest) {
  let body: ShowingRequestSubmission
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, phone, honeypot } = body

  // Honeypot — bots that fill this hidden field get a fake success so they
  // don't learn the submission was rejected. Nothing is sent to FUB.
  if (honeypot && honeypot.trim()) {
    console.warn('Showing request blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  if (!isValidListingKey(body.listingKey)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidName(name)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  // Unlike the download forms, a phone number is required here — the showing
  // can't be confirmed or the gate cleared without a callback number.
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidWindow(body.window)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidAffiliation(body.affiliation)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const listing = SHOWING_LISTINGS[body.listingKey]

  const apiKey = process.env.FUB_API_KEY
  if (!apiKey) {
    // Local development without the key: log the lead so the flow is testable
    // end-to-end. Production must be configured — a showing request on a
    // $2.8M listing must never be dropped silently.
    if (process.env.NODE_ENV === 'production') {
      console.error('FUB_API_KEY is not set — showing request dropped')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Showing request:', {
      name,
      email,
      phone,
      listing: listing.address,
      tags: buildShowingTags(body, listing),
      note: buildShowingNote(body, listing),
    })
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName } = splitName(name!)

  const fubBody = {
    source: 'doyouneedahome.com',
    system: 'doyouneedahome.com',
    type: 'Property Inquiry',
    person: {
      firstName,
      lastName,
      emails: [{ value: email!.trim() }],
      phones: [{ value: phone!.trim(), type: 'mobile' }],
      tags: buildShowingTags(body, listing),
      // Showing requests for this listing route straight to the listing agent.
      assignedTo: 'John Oliver',
    },
    property: {
      street: listing.address,
      city: listing.city,
      state: listing.state,
      code: listing.zip,
      price: listing.price,
      type: 'Single-Family Residence',
    },
    // Consent time is stamped here, not taken from the client — a
    // self-reported timestamp is worthless as an audit record.
    message: buildShowingNote({ ...body, consentCapturedAt: new Date().toISOString() }, listing),
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
