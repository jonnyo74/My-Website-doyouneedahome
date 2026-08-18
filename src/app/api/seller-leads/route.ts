import { NextRequest, NextResponse } from 'next/server'
import { getValuationRoute, TEAM_ROUTE_SLUG } from '@/lib/agents'
import {
  buildSellerLeadNote,
  buildSellerLeadTags,
  isValidAddress,
  isValidEmail,
  isValidName,
  isValidTimeline,
  splitName,
  type SellerLeadSubmission,
} from '@/lib/sellerLeadHelpers'

export async function POST(req: NextRequest) {
  let body: SellerLeadSubmission
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, phone, address, timeline, honeypot, agentSlug } = body

  // Honeypot — bots that fill this hidden field get a fake success so they
  // don't learn the submission was rejected. Nothing is sent to FUB.
  if (honeypot && honeypot.trim()) {
    console.warn('Seller lead blocked by honeypot')
    return NextResponse.json({ ok: true })
  }

  const agent = getValuationRoute(agentSlug)
  if (!agent) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidName(name)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidAddress(address)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  if (!isValidTimeline(timeline)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const apiKey = process.env.FUB_API_KEY
  if (!apiKey) {
    // Local development without the key: log the lead so the flow is testable
    // end-to-end. Production must be configured — a seller lead is the most
    // valuable thing this site captures and must never be dropped silently.
    if (process.env.NODE_ENV === 'production') {
      console.error('FUB_API_KEY is not set — seller lead dropped')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    console.warn('[dev] FUB_API_KEY not set — skipping CRM submission. Seller lead:', {
      name,
      email,
      address,
      agent: agent.name,
      tags: buildSellerLeadTags(body, agent),
      note: buildSellerLeadNote(body, agent),
    })
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName } = splitName(name!)

  const assignedTo =
    agent.slug === TEAM_ROUTE_SLUG
      ? process.env.FUB_TEAM_ASSIGNED_TO?.trim() || undefined
      : agent.fubAssignedTo

  const fubBody = {
    source: 'doyouneedahome.com',
    system: 'doyouneedahome.com',
    type: 'Seller Inquiry',
    person: {
      firstName,
      lastName,
      emails: [{ value: email!.trim() }],
      phones: phone?.trim() ? [{ value: phone.trim(), type: 'mobile' }] : [],
      tags: buildSellerLeadTags(body, agent),
      addresses: [{ street: address!.trim(), type: 'home' }],
      // A named agent's page routes straight to that agent. The neutral /sell
      // review is assigned internally instead of making the visitor choose:
      // FUB_TEAM_ASSIGNED_TO if it's configured, otherwise FUB's own lead
      // distribution. The tag is applied either way — it's what reporting and
      // any FUB automation filter on.
      ...(assignedTo ? { assignedTo } : {}),
    },
    // Consent time is stamped here, not taken from the client — a
    // self-reported timestamp is worthless as an audit record.
    message: buildSellerLeadNote({ ...body, consentCapturedAt: new Date().toISOString() }, agent),
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
