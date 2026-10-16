// Run:  npm test
// Integrity checks for the Loxahatchee freedom test: every question is complete,
// every outcome is reachable, and no outcome promises what a parcel allows.
import test from 'node:test'
import assert from 'node:assert/strict'
import { FREEDOM_QUESTIONS, FREEDOM_OUTCOMES, freedomOutcome } from '../src/lib/loxFreedomTest.ts'

const all = (choice) => Object.fromEntries(FREEDOM_QUESTIONS.map((q) => [q.id, choice]))

test('questions are complete and uniquely identified', () => {
  const ids = new Set()
  for (const q of FREEDOM_QUESTIONS) {
    assert.ok(!ids.has(q.id))
    ids.add(q.id)
    assert.ok(q.prompt.trim().endsWith('?'))
    assert.ok(q.hint.trim().length > 10)
  }
  assert.equal(FREEDOM_QUESTIONS.length, 5)
})

test('no outcome until every question is answered', () => {
  assert.equal(freedomOutcome({}), null)
  assert.equal(freedomOutcome({ [FREEDOM_QUESTIONS[0].id]: 'yes' }), null)
})

test('all three outcomes are reachable', () => {
  assert.equal(freedomOutcome(all('yes')).key, 'use-it')
  assert.equal(freedomOutcome(all('maybe')).key, 'test-it')
  assert.equal(freedomOutcome(all('no')).key, 'look-elsewhere')
})

test('outcome copy makes no universal promises and asks for no documents', () => {
  for (const o of Object.values(FREEDOM_OUTCOMES)) {
    const blob = `${o.heading} ${o.body}`
    assert.ok(!/\$\s?\d/.test(blob), 'no prices')
    assert.ok(!/\b(hoa|association|condo|estoppel|budget|reserves?|minutes)\b/i.test(blob), 'no document asks')
    assert.ok(!/\b(you can (always )?(keep|build|park|run))\b/i.test(blob), 'no universal permission')
    for (const n of o.next) assert.match(n.href, /^\/blog\//)
  }
})
