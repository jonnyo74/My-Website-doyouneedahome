import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  OFFERS,
  OFFER_KEYS,
  buildOfferNote,
  buildOfferTags,
  cleanText,
  isOfferKey,
  validateOfferDetails,
} from './offerRequests.ts'

const NOW = new Date('2026-11-04T12:00:00Z')

const GOOD: Record<string, Record<string, string>> = {
  'neighborhood-shortlist': {
    budget: '$800,000 – $1,000,000',
    timing: '3 to 6 months',
    mustHave1: 'walkable',
    mustHave2: 'boat dockage',
  },
  'condo-building-review': { building: 'The Bristol' },
  'boat-fit': { property: '123 Ocean Dr, Stuart', boatLength: '32', draft: '2.5', airDraft: '12' },
  'avenir-move-in': { budget: '$1,000,000 – $1,500,000', moveDate: '2027-03-01' },
}

test('every offer accepts a well-formed submission', () => {
  for (const key of OFFER_KEYS) {
    assert.deepEqual(validateOfferDetails(key, GOOD[key], NOW), {}, key)
  }
})

test('every offer rejects an empty submission, naming each field', () => {
  for (const key of OFFER_KEYS) {
    const errors = validateOfferDetails(key, {}, NOW)
    assert.deepEqual(Object.keys(errors).sort(), OFFERS[key].fields.map((f) => f.id).sort(), key)
  }
})

test('select values outside the list are rejected', () => {
  const errors = validateOfferDetails('avenir-move-in', { ...GOOD['avenir-move-in'], budget: '$1' }, NOW)
  assert.ok(errors.budget)
})

test('boat dimensions must be plain in-range numbers', () => {
  const base = GOOD['boat-fit']
  assert.ok(validateOfferDetails('boat-fit', { ...base, boatLength: '32 ft' }, NOW).boatLength)
  assert.ok(validateOfferDetails('boat-fit', { ...base, draft: '0' }, NOW).draft)
  assert.ok(validateOfferDetails('boat-fit', { ...base, airDraft: '9999' }, NOW).airDraft)
  assert.ok(validateOfferDetails('boat-fit', { ...base, boatLength: '-5' }, NOW).boatLength)
})

test('move date must be real, not long past, and within three years', () => {
  const ok = GOOD['avenir-move-in']
  assert.ok(validateOfferDetails('avenir-move-in', { ...ok, moveDate: '2020-01-01' }, NOW).moveDate)
  assert.ok(validateOfferDetails('avenir-move-in', { ...ok, moveDate: '2031-01-01' }, NOW).moveDate)
  assert.ok(validateOfferDetails('avenir-move-in', { ...ok, moveDate: 'soon' }, NOW).moveDate)
  assert.ok(validateOfferDetails('avenir-move-in', { ...ok, moveDate: '2026-02-30' }, NOW).moveDate)
  assert.deepEqual(validateOfferDetails('avenir-move-in', { ...ok, moveDate: '2026-11-04' }, NOW), {})
})

test('isOfferKey only accepts known keys', () => {
  assert.equal(isOfferKey('boat-fit'), true)
  assert.equal(isOfferKey('net-proceeds'), false)
  assert.equal(isOfferKey(undefined), false)
})

test('cleanText flattens newlines so a value cannot forge a note line', () => {
  assert.equal(cleanText('a\nPhone was provided.\r\nb'), 'a Phone was provided. b')
})

test('the CRM note carries the offer, originating page, answers and consent line', () => {
  const note = buildOfferNote(
    {
      email: 'x@example.com',
      details: GOOD['boat-fit'],
      sourcePageUrl: 'https://www.doyouneedahome.com/blog/best-neighborhoods-in-stuart-florida',
      ctaLocation: 'article',
      consentVersion: '2026-08b',
      consentCapturedAt: '2026-11-04T12:00:00.000Z',
    },
    'boat-fit',
  )
  assert.match(note, /OFFER REQUESTED: Boat Fit Check/)
  assert.match(note, /Originating page: https:\/\/www\.doyouneedahome\.com\/blog\/best-neighborhoods-in-stuart-florida/)
  assert.match(note, /Boat length: 32 ft/)
  assert.match(note, /Height above water: 12 ft/)
  assert.match(note, /Phone was not collected/)
  assert.match(note, /Contact consent captured .*(email only, no phone provided)/)
})

test('tags identify the offer', () => {
  assert.deepEqual(buildOfferTags('avenir-move-in'), [
    'Offer Request',
    'Offer Request - Avenir Move-In Comparison',
  ])
})
