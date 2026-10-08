// Run:  npm test
// Formula and input-validation tests for the carrying-cost worksheet, including the Wellington
// variant that adds assessments, transportation and other recurring costs.

import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateWorksheet, monthlyPrincipalAndInterest, parseAmount, validateField } from '../src/lib/carryingCost.ts'

const base = {
  purchasePrice: '',
  downPaymentPct: '20',
  interestRatePct: '',
  loanTermYears: '30',
  annualPropertyTax: '',
  annualInsurance: '',
  monthlyFlood: '',
  monthlyHoa: '',
  monthlyClub: '',
  monthlyUpkeep: '',
}
const ext = { ...base, annualAssessments: '', monthlyTransport: '', monthlyOther: '' }
const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} is not within ${tol} of ${b}`)
const line = (r, key) => r.lines.find((l) => l.key === key)

test('standard amortization matches a known payment', () => {
  // $400,000 at 6% for 30 years is the textbook $2,398.20 a month.
  near(monthlyPrincipalAndInterest(400000, 6, 30), 2398.2, 0.01)
  // $100,000 at 5% for 15 years is $790.79.
  near(monthlyPrincipalAndInterest(100000, 5, 15), 790.79, 0.01)
})

test('a zero interest rate divides the loan evenly and does not divide by zero', () => {
  near(monthlyPrincipalAndInterest(360000, 0, 30), 1000, 0.0001)
  const r = calculateWorksheet({ ...base, purchasePrice: '450000', downPaymentPct: '20', interestRatePct: '0' })
  near(line(r, 'principalInterest').monthly, 1000, 0.0001)
})

test('zero down payment finances the whole price', () => {
  const r = calculateWorksheet({ ...base, purchasePrice: '500000', downPaymentPct: '0', interestRatePct: '6', loanTermYears: '30' })
  assert.equal(r.loanAmount, 500000)
  near(line(r, 'principalInterest').monthly, monthlyPrincipalAndInterest(500000, 6, 30))
})

test('100 percent down means no loan and no principal and interest', () => {
  const r = calculateWorksheet({ ...base, purchasePrice: '500000', downPaymentPct: '100', interestRatePct: '6' })
  assert.equal(r.loanAmount, 0)
  assert.equal(line(r, 'principalInterest').monthly, 0)
})

test('different loan terms change the payment in the expected direction', () => {
  const p30 = monthlyPrincipalAndInterest(400000, 6, 30)
  const p15 = monthlyPrincipalAndInterest(400000, 6, 15)
  assert.ok(p15 > p30)
  near(p15, 3375.43, 0.01)
})

test('blank optional inputs are left out of the total, never treated as zero lines', () => {
  const r = calculateWorksheet({ ...base, annualPropertyTax: '6000' })
  assert.equal(r.counted, 1)
  near(r.total, 500)
  assert.equal(line(r, 'insurance').monthly, null)
})

test('zero HOA is counted as a real zero', () => {
  const r = calculateWorksheet({ ...base, monthlyHoa: '0', annualPropertyTax: '1200' })
  assert.equal(line(r, 'hoa').monthly, 0)
  assert.equal(r.counted, 2)
})

test('decimal and formatted values are parsed', () => {
  assert.equal(parseAmount('$1,250,000'), 1250000)
  assert.equal(parseAmount('6.75%'), 6.75)
  assert.equal(parseAmount(' 20 '), 20)
  assert.equal(parseAmount(''), null)
  assert.ok(Number.isNaN(parseAmount('1.2.3')))
  assert.ok(Number.isNaN(parseAmount('12abc')))
  const r = calculateWorksheet({ ...base, purchasePrice: '425000.50', downPaymentPct: '12.5', interestRatePct: '6.875' })
  near(r.loanAmount, 425000.5 * 0.875, 0.0001)
})

test('negative, non-numeric and absurd inputs are rejected, not calculated', () => {
  assert.match(validateField('annualPropertyTax', '-5'), /negative/)
  assert.match(validateField('purchasePrice', '0'), /more than zero/)
  assert.match(validateField('interestRatePct', 'abc'), /number/)
  assert.match(validateField('interestRatePct', '99'), /too large/)
  assert.match(validateField('downPaymentPct', '150'), /too large/)
  const r = calculateWorksheet({ ...base, monthlyHoa: '-100' })
  assert.ok(r.errors.monthlyHoa)
  assert.equal(line(r, 'hoa').monthly, null)
})

test('the original worksheet has no extended lines and its total is unchanged', () => {
  const r = calculateWorksheet({ ...base, purchasePrice: '400000', downPaymentPct: '20', interestRatePct: '6', annualPropertyTax: '6000', annualInsurance: '3600', monthlyHoa: '300' })
  assert.deepEqual(r.lines.map((l) => l.key), ['principalInterest', 'propertyTax', 'insurance', 'flood', 'hoa', 'club', 'upkeep'])
  near(r.total, monthlyPrincipalAndInterest(320000, 6, 30) + 500 + 300 + 300)
  assert.equal(r.housingTotal, r.total)
})

test('the Wellington worksheet adds assessments, transportation and other costs', () => {
  const r = calculateWorksheet({
    ...ext,
    purchasePrice: '400000',
    downPaymentPct: '20',
    interestRatePct: '6',
    annualPropertyTax: '6000',
    annualInsurance: '3600',
    monthlyHoa: '300',
    annualAssessments: '1200',
    monthlyTransport: '250',
    monthlyOther: '100',
  })
  assert.ok(line(r, 'assessments') && line(r, 'transport') && line(r, 'other'))
  near(line(r, 'assessments').monthly, 100)
  const housing = monthlyPrincipalAndInterest(320000, 6, 30) + 500 + 300 + 300 + 100
  near(r.housingTotal, housing)
  near(r.total, housing + 250 + 100)
  near(r.total * 12, (housing + 350) * 12)
})

test('a large annual assessment is divided by twelve and validated', () => {
  const r = calculateWorksheet({ ...ext, annualAssessments: '24000' })
  near(line(r, 'assessments').monthly, 2000)
  assert.ok(calculateWorksheet({ ...ext, annualAssessments: '9999999' }).errors.annualAssessments)
})

test('missing optional extended inputs leave the extended lines out of the total', () => {
  const r = calculateWorksheet({ ...ext, annualPropertyTax: '6000' })
  assert.equal(r.counted, 1)
  near(r.total, 500)
})
