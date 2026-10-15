// Run:  npm test
// Formula and validation tests for the Tequesta ownership-cost calculator.
import test from 'node:test'
import assert from 'node:assert/strict'
import { BLANK_INPUTS, EXAMPLE_INPUTS, calculateOwnership, monthlyPrincipalAndInterest, parseAmount, validateField } from '../src/lib/tequestaOwnership.ts'

const line = (r, key) => r.lines.find((l) => l.key === key)

test('amortization matches the standard fixed-rate formula', () => {
  // $800,000 at 6.5% over 30 years: payment factor 6.3207 per $1,000.
  assert.ok(Math.abs(monthlyPrincipalAndInterest(800000, 6.5, 30) - 5056.59) < 0.6)
  assert.equal(monthlyPrincipalAndInterest(120000, 0, 10), 1000)
  assert.equal(monthlyPrincipalAndInterest(0, 6, 30), 0)
})

test('blank inputs produce no counted lines and a zero total', () => {
  const r = calculateOwnership(BLANK_INPUTS)
  assert.equal(r.counted, 0)
  assert.equal(r.monthlyTotal, 0)
  assert.equal(line(r, 'principalInterest').monthly, null)
})

test('property tax uses taxable value × millage, with homestead and portability', () => {
  const r = calculateOwnership({ ...BLANK_INPUTS, purchasePrice: '1000000', millage: '15', homesteadExemption: '50000' })
  assert.equal(r.taxableValue, 950000)
  assert.ok(Math.abs(line(r, 'propertyTax').monthly - 1187.5) < 0.01)
  const p = calculateOwnership({ ...BLANK_INPUTS, purchasePrice: '1000000', millage: '15', homesteadExemption: '50000', portability: '200000' })
  assert.equal(p.taxableValue, 750000)
})

test('a second home gets no homestead exemption', () => {
  const r = calculateOwnership({ ...BLANK_INPUTS, purchasePrice: '1000000', millage: '15', homesteadExemption: '50000', occupancy: 'second' })
  assert.equal(r.taxableValue, 1000000)
  assert.ok(Math.abs(line(r, 'propertyTax').monthly - 1250) < 0.01)
  assert.ok(r.notes.some((n) => /second home/.test(n)))
})

test('PMI is flagged as excluded under 20% down unless a rate is entered', () => {
  const base = { ...EXAMPLE_INPUTS, downPaymentPct: '10' }
  const none = calculateOwnership(base)
  assert.equal(line(none, 'pmi').monthly, null)
  assert.ok(none.notes.some((n) => /PMI/.test(n)))
  const withPmi = calculateOwnership({ ...base, pmiRatePct: '0.6' })
  // $900,000 loan × 0.6% ÷ 12 = $450
  assert.ok(Math.abs(line(withPmi, 'pmi').monthly - 450) < 0.01)
  assert.equal(line(calculateOwnership(EXAMPLE_INPUTS), 'pmi'), undefined)
})

test('example inputs total correctly and keep upfront cash separate', () => {
  const r = calculateOwnership(EXAMPLE_INPUTS)
  const sum = r.lines.reduce((s, l) => s + (l.monthly ?? 0), 0)
  assert.ok(Math.abs(r.monthlyTotal - sum) < 0.001)
  assert.ok(Math.abs(r.annualTotal - sum * 12) < 0.01)
  assert.equal(r.upfront.downPayment, 200000)
  assert.equal(r.upfront.closingCosts, 30000)
  assert.equal(r.upfront.renovation, 0)
  assert.equal(r.upfront.total, 230000)
})

test('renovation budget is upfront only, never in the monthly total', () => {
  const a = calculateOwnership(EXAMPLE_INPUTS)
  const b = calculateOwnership({ ...EXAMPLE_INPUTS, renovationBudget: '150000' })
  assert.equal(a.monthlyTotal, b.monthlyTotal)
  assert.equal(b.upfront.total, a.upfront.total + 150000)
})

test('parsing and validation', () => {
  assert.equal(parseAmount('$1,250,000'), 1250000)
  assert.equal(parseAmount(' 6.75% '), 6.75)
  assert.equal(parseAmount(''), null)
  assert.ok(Number.isNaN(parseAmount('12abc')))
  assert.match(validateField('purchasePrice', 'abc'), /must be a number/)
  assert.match(validateField('purchasePrice', '0'), /more than zero/)
  assert.match(validateField('downPaymentPct', '150'), /too large/)
  assert.match(validateField('monthlyHoa', '-5'), /negative/)
  assert.equal(validateField('monthlyHoa', ''), null)
})
