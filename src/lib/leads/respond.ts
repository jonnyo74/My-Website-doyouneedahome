import { NextResponse } from 'next/server'
import type { LeadCheck } from './validate.ts'

/**
 * Response for a failed validateLead(). A honeypot hit gets a fake 200 so bots
 * can't tell they were caught; a bad email/phone gets a 400 naming the field so
 * the form can show the message under it. Returns null when the lead passed.
 */
export function leadRejectionResponse(check: LeadCheck): NextResponse | null {
  if (check.ok) return null
  if (check.kind === 'honeypot') return NextResponse.json({ ok: true })
  return NextResponse.json({ error: check.message, field: check.field }, { status: 400 })
}
