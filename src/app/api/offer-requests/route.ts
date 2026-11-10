import { NextRequest, NextResponse } from 'next/server'
import { leadRejectionResponse } from '@/lib/leads/respond'
import { validateLead } from '@/lib/leads/validate'
import {
  buildOfferNote,
  buildOfferTags,
  isOfferKey,
  validateOfferDetails,
  type OfferRequestSubmission,
} from '@/lib/offerRequests'

// Short "personal reply" offers: neighborhood shortlist, condo building review,
// boat fit, Avenir move-in comparison. Each becomes one Follow Up Boss event
// whose note carries the offer, the originating page and the visitor's answers;
// the team writes the reply by hand. Same validation, honeypot and FUB handling
// as /api/leads and /api/seller-leads.

export async function POST(req: NextRequest) {
  let body: OfferRequestSubmission
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { offer, email, honeypot, details } = body

  // Honeypot hit → fake success, nothing sent to FUB; fake email → 400 + field.
  const check = await validateLead({ form: `offer-request:${String(offer)}`, email, honeypot })
  const rejection = leadRejectionResponse(check)
  if (rejection) return rejection
  if (!check.ok) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })

  if (!isOfferKey(offer)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const fieldErrors = validateOfferDetails(offer, details)
  const [firstBad] = Object.entries(fieldErrors)
  if (firstBad) {
    return NextResponse.json({ error: firstBad[1], field: firstBad[0], fields: fieldErrors }, { status: 400 })
  }

  const tags = buildOfferTags(offer)
  // Consent time is stamped here, not taken from the client.
  const note = buildOfferNote({ ...body, consentCapturedAt: new Date().toISOString() }, offer)

  const apiKey = process.env.FUB_API_KEY
  if (!apiKey) {
    // Local development without the key: log the lead so the flow is testable
    // end-to-end. Production must be configured — never drop a lead silently.
    if (process.env.NODE_ENV === 'production') {
      console.error('FUB_API_KEY is not set — offer request dropped')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Offer request:', {
      email: check.email,
      tags,
      note,
    })
    return NextResponse.json({ ok: true })
  }

  const res = await fetch('https://api.followupboss.com/v1/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      source: 'doyouneedahome.com',
      system: 'doyouneedahome.com',
      type: 'General Inquiry',
      person: {
        emails: [{ value: check.email }],
        tags,
      },
      message: note,
    }),
  })

  if (!res.ok) {
    console.error('FUB error:', await res.text())
    return NextResponse.json({ error: 'Lead submission failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
