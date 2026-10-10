// Run:  npm test
// Verifies the arithmetic published in the North Palm Beach cost-of-living article against an
// independent calculation, and that the article text carries the same figures. Every input here is
// a hypothetical illustration, not a local statistic.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { calculateWorksheet, monthlyPrincipalAndInterest, NPB_WORKSHEET_HEADING, NPB_WORKSHEET_HEADING_ID } from '../src/lib/carryingCost.ts'
import { headingId } from '../src/lib/headingId.ts'

const RATE = 7.4, TERM = 30, DOWN = 0.2, MILLS_TOTAL = 18.0, MILLS_VILLAGE = 7.4
const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} is not within ${tol} of ${b}`)

// Independent amortization: iterate the balance instead of using the closed form.
function paymentByBisection(loan, ratePct, years) {
  const r = ratePct / 100 / 12
  const n = years * 12
  let lo = 0, hi = loan * 2
  for (let i = 0; i < 200; i++) {
    const pay = (lo + hi) / 2
    let bal = loan
    for (let m = 0; m < n; m++) bal = bal * (1 + r) - pay
    if (bal > 0) lo = pay
    else hi = pay
  }
  return (lo + hi) / 2
}

const scenarios = {
  A: { price: 750000, ins: 6000, flood: 0, hoa: 0, util: 450, maint: 625, other: 0, total: 6854.28 },
  B: { price: 1500000, ins: 12000, flood: 4000, hoa: 0, util: 650, maint: 1875, other: 500, total: 14916.89 },
  C: { price: 500000, ins: 1800, flood: 0, hoa: 900, util: 250, maint: 200, other: 250, total: 5269.52 },
}

function worksheet(s) {
  return calculateWorksheet({
    purchasePrice: String(s.price), downPaymentPct: '20', interestRatePct: String(RATE), loanTermYears: String(TERM),
    annualPropertyTax: String((s.price * MILLS_TOTAL) / 1000), annualInsurance: String(s.ins), monthlyFlood: String(s.flood / 12),
    monthlyHoa: String(s.hoa), monthlyClub: '0', monthlyUpkeep: String(s.util + s.maint),
    annualAssessments: '', monthlyTransport: '', monthlyOther: String(s.other),
  })
}

for (const [name, s] of Object.entries(scenarios)) {
  test(`scenario ${name}: worksheet total equals the independent sum`, () => {
    const loan = s.price * (1 - DOWN)
    const pi = paymentByBisection(loan, RATE, TERM)
    near(monthlyPrincipalAndInterest(loan, RATE, TERM), pi, 0.01)
    const expected = pi + (s.price * MILLS_TOTAL) / 1000 / 12 + s.ins / 12 + s.flood / 12 + s.hoa + s.util + s.maint + s.other
    near(worksheet(s).total, expected, 0.01)
    near(worksheet(s).total, s.total, 0.01)
    near(worksheet(s).total * 12, s.total * 12, 0.12)
  })
}

test('the 0% interest edge case divides the loan evenly', () => {
  near(monthlyPrincipalAndInterest(600000, 0, 30), 600000 / 360)
})

test('the worked tax example: Village portion and total, longtime owner versus new buyer', () => {
  const tax = (taxable, mills) => (taxable * mills) / 1000
  near(tax(375000, MILLS_VILLAGE), 2775)
  near(tax(750000, MILLS_VILLAGE), 5550)
  near(tax(375000, MILLS_TOTAL), 6750)
  near(tax(750000, MILLS_TOTAL), 13500)
  assert.ok(tax(750000, MILLS_VILLAGE) < tax(750000, MILLS_TOTAL), 'the Village share is part of, not the whole of, the bill')
})

test('the worksheet heading id matches the id the table of contents links to', () => {
  assert.equal(headingId(NPB_WORKSHEET_HEADING), NPB_WORKSHEET_HEADING_ID)
})

test('the published article carries the same figures as the model', () => {
  const src = readFileSync('src/lib/articles.ts', 'utf8')
  const start = src.indexOf("slug: 'cost-of-living-in-north-palm-beach-florida'")
  const body = src.slice(start, src.indexOf("slug: '", start + 60))
  for (const figure of ['$6,854', '$14,917', '$5,270', '$82,251', '$179,003', '$63,234', '$5,550', '$13,500', '$2,775', '$6,750', '7.4000 mills']) {
    assert.ok(body.includes(figure), `article is missing ${figure}`)
  }
  assert.ok(!/20 to 30 percent less/.test(body.replace(/removed the claim[^.]*\./i, '')) || body.includes('We removed the claim'), 'the unsupported discount claim must only appear as a removal note')
})
