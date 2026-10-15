// Planning math for the Tequesta ownership-cost calculator. Pure functions, no
// framework imports, so it can be unit-tested with `node --test`.
//
// Nothing here is a market figure. Every number comes from the reader, or from
// the clearly labelled hypothetical EXAMPLE_INPUTS below.

export const OWNERSHIP_HEADING = 'Interactive Monthly Homeownership Cost Calculator'
export const OWNERSHIP_HEADING_ID = 'interactive-monthly-homeownership-cost-calculator'

export const LOAN_TERMS = [30, 20, 15, 10] as const

export type Occupancy = 'primary' | 'second'

export type OwnershipFieldKey =
  | 'purchasePrice'
  | 'downPaymentPct'
  | 'interestRatePct'
  | 'loanTermYears'
  | 'pmiRatePct'
  | 'millage'
  | 'homesteadExemption'
  | 'portability'
  | 'annualInsurance'
  | 'annualFlood'
  | 'monthlyHoa'
  | 'monthlyClub'
  | 'monthlyUtilities'
  | 'annualMaintenance'
  | 'closingCostPct'
  | 'renovationBudget'

export type OwnershipInputs = Record<OwnershipFieldKey, string> & { occupancy: Occupancy }

export const BLANK_INPUTS: OwnershipInputs = {
  purchasePrice: '',
  downPaymentPct: '20',
  interestRatePct: '',
  loanTermYears: '30',
  pmiRatePct: '',
  millage: '',
  homesteadExemption: '',
  portability: '',
  annualInsurance: '',
  annualFlood: '',
  monthlyHoa: '',
  monthlyClub: '',
  monthlyUtilities: '',
  annualMaintenance: '',
  closingCostPct: '',
  renovationBudget: '',
  occupancy: 'primary',
}

// Hypothetical numbers that show how the math works. They are NOT Tequesta
// prices, rates, premiums or fees, and the component labels them that way.
export const EXAMPLE_INPUTS: OwnershipInputs = {
  purchasePrice: '1000000',
  downPaymentPct: '20',
  interestRatePct: '6.5',
  loanTermYears: '30',
  pmiRatePct: '',
  millage: '15',
  homesteadExemption: '50000',
  portability: '0',
  annualInsurance: '8000',
  annualFlood: '1500',
  monthlyHoa: '0',
  monthlyClub: '0',
  monthlyUtilities: '450',
  annualMaintenance: '10000',
  closingCostPct: '3',
  renovationBudget: '0',
  occupancy: 'primary',
}

const LIMITS: Record<OwnershipFieldKey, { min: number; max: number; label: string; positive?: boolean }> = {
  purchasePrice: { min: 0, max: 100_000_000, label: 'Purchase price', positive: true },
  downPaymentPct: { min: 0, max: 100, label: 'Down payment' },
  interestRatePct: { min: 0, max: 30, label: 'Interest rate' },
  loanTermYears: { min: 1, max: 50, label: 'Loan term' },
  pmiRatePct: { min: 0, max: 5, label: 'PMI rate' },
  millage: { min: 0, max: 60, label: 'Total millage rate' },
  homesteadExemption: { min: 0, max: 5_000_000, label: 'Homestead exemption' },
  portability: { min: 0, max: 5_000_000, label: 'Portability amount' },
  annualInsurance: { min: 0, max: 5_000_000, label: 'Homeowners insurance' },
  annualFlood: { min: 0, max: 5_000_000, label: 'Flood insurance' },
  monthlyHoa: { min: 0, max: 100_000, label: 'HOA fees' },
  monthlyClub: { min: 0, max: 100_000, label: 'Club dues' },
  monthlyUtilities: { min: 0, max: 100_000, label: 'Utilities' },
  annualMaintenance: { min: 0, max: 5_000_000, label: 'Maintenance reserve' },
  closingCostPct: { min: 0, max: 15, label: 'Closing costs' },
  renovationBudget: { min: 0, max: 50_000_000, label: 'Renovation budget' },
}

/** "$1,250,000", "6.75%", " 20 " → number. Blank → null. Anything else → NaN. */
export function parseAmount(raw: string | undefined): number | null {
  const cleaned = (raw ?? '').replace(/[\s$,%]/g, '')
  if (cleaned === '') return null
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number.NaN
  return Number(cleaned)
}

export function validateField(key: OwnershipFieldKey, raw: string | undefined): string | null {
  const value = parseAmount(raw)
  if (value === null) return null
  const { min, max, label, positive } = LIMITS[key]
  if (Number.isNaN(value)) return `${label} must be a number.`
  if (value < min || (positive && value === 0)) return min === 0 && !positive ? `${label} can't be negative.` : `${label} must be more than zero.`
  if (value > max) return `${label} looks too large. Check for an extra digit.`
  return null
}

/** Fixed-rate amortization: M = L·r / (1 − (1 + r)^−n). A 0% rate divides evenly. */
export function monthlyPrincipalAndInterest(loan: number, annualRatePct: number, years: number): number {
  const n = years * 12
  if (loan <= 0 || n <= 0) return 0
  const r = annualRatePct / 100 / 12
  if (r === 0) return loan / n
  return (loan * r) / (1 - Math.pow(1 + r, -n))
}

export type LineKey =
  | 'principalInterest'
  | 'pmi'
  | 'propertyTax'
  | 'homeInsurance'
  | 'floodInsurance'
  | 'hoa'
  | 'club'
  | 'utilities'
  | 'maintenance'

export interface OwnershipLine {
  key: LineKey
  label: string
  /** null when the reader hasn't supplied what the line needs. */
  monthly: number | null
  detail: string
}

export interface UpfrontCash {
  downPayment: number | null
  closingCosts: number | null
  renovation: number | null
  total: number
}

export interface OwnershipResult {
  lines: OwnershipLine[]
  monthlyTotal: number
  annualTotal: number
  counted: number
  loanAmount: number | null
  taxableValue: number | null
  upfront: UpfrontCash
  notes: string[]
  errors: Partial<Record<OwnershipFieldKey, string>>
}

export function calculateOwnership(inputs: OwnershipInputs): OwnershipResult {
  const errors: Partial<Record<OwnershipFieldKey, string>> = {}
  const num = (key: OwnershipFieldKey): number | null => {
    const error = validateField(key, inputs[key])
    if (error) {
      errors[key] = error
      return null
    }
    return parseAmount(inputs[key])
  }
  const notes: string[] = []
  const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  const price = num('purchasePrice')
  const downPct = num('downPaymentPct')
  const rate = num('interestRatePct')
  const term = num('loanTermYears')
  const pmiRate = num('pmiRatePct')
  const millage = num('millage')
  const exemption = num('homesteadExemption')
  const portability = num('portability')
  const insurance = num('annualInsurance')
  const flood = num('annualFlood')
  const hoa = num('monthlyHoa')
  const club = num('monthlyClub')
  const utilities = num('monthlyUtilities')
  const maintenance = num('annualMaintenance')
  const closingPct = num('closingCostPct')
  const renovation = num('renovationBudget')

  const lines: OwnershipLine[] = []

  // Principal and interest (+ optional PMI)
  let loanAmount: number | null = null
  if (price !== null && downPct !== null && rate !== null && term !== null) {
    loanAmount = price * (1 - downPct / 100)
    lines.push({
      key: 'principalInterest',
      label: 'Mortgage principal and interest',
      monthly: monthlyPrincipalAndInterest(loanAmount, rate, term),
      detail: `${usd(loanAmount)} loan at ${rate}% over ${term} years`,
    })
  } else {
    lines.push({ key: 'principalInterest', label: 'Mortgage principal and interest', monthly: null, detail: 'Needs price, down payment, rate and term' })
  }

  if (loanAmount !== null && downPct !== null && downPct < 20 && downPct < 100) {
    if (pmiRate !== null) {
      lines.push({ key: 'pmi', label: 'Private mortgage insurance (PMI)', monthly: (loanAmount * pmiRate) / 100 / 12, detail: `${pmiRate}% of the loan per year, your assumption` })
    } else {
      lines.push({ key: 'pmi', label: 'Private mortgage insurance (PMI)', monthly: null, detail: 'Down payment is under 20%. PMI likely applies and is not included unless you enter a rate' })
      notes.push('Your down payment is under 20%, so PMI (or a similar cost) may apply. It is excluded from the total until you enter a PMI rate from your lender.')
    }
  }

  // Property tax, using the reader's total millage
  let taxableValue: number | null = null
  const primary = inputs.occupancy === 'primary'
  if (price !== null && millage !== null) {
    const assessed = Math.max(0, price - (portability ?? 0))
    const exemptionApplied = primary ? exemption ?? 0 : 0
    taxableValue = Math.max(0, assessed - exemptionApplied)
    const annual = (taxableValue * millage) / 1000
    const bits = [`${usd(taxableValue)} taxable value × ${millage} mills`]
    if (!primary) bits.push('no homestead exemption on a second home')
    lines.push({ key: 'propertyTax', label: 'Property taxes', monthly: annual / 12, detail: bits.join(', ') })
  } else {
    lines.push({ key: 'propertyTax', label: 'Property taxes', monthly: null, detail: 'Needs price and a total millage rate' })
  }
  if (!primary && (exemption ?? 0) > 0) notes.push('The homestead exemption is ignored for a second home, which does not qualify.')
  if (!primary && (portability ?? 0) > 0) notes.push('Portability applies only when the new home is a Florida homestead. It is still subtracted here because you entered it; clear it for a second home.')

  lines.push({ key: 'homeInsurance', label: 'Homeowners and windstorm insurance', monthly: insurance === null ? null : insurance / 12, detail: insurance === null ? 'Enter an annual quote' : 'Annual premium ÷ 12' })
  lines.push({ key: 'floodInsurance', label: 'Flood insurance', monthly: flood === null ? null : flood / 12, detail: flood === null ? 'Enter an annual quote, or 0 if not required' : 'Annual premium ÷ 12' })
  lines.push({ key: 'hoa', label: 'HOA or association fees', monthly: hoa, detail: hoa === null ? 'Enter a monthly figure, or 0 if none' : 'Monthly, as entered' })
  lines.push({ key: 'club', label: 'Club dues', monthly: club, detail: club === null ? 'Enter a monthly figure, or 0 if none' : 'Monthly, as entered' })
  lines.push({ key: 'utilities', label: 'Utilities', monthly: utilities, detail: utilities === null ? 'Electric, water, internet and similar' : 'Monthly, as entered' })
  lines.push({ key: 'maintenance', label: 'Maintenance reserve', monthly: maintenance === null ? null : maintenance / 12, detail: maintenance === null ? 'Your annual set-aside' : 'Annual set-aside ÷ 12' })

  let monthlyTotal = 0
  let counted = 0
  for (const l of lines) {
    if (l.monthly !== null) {
      monthlyTotal += l.monthly
      counted += 1
    }
  }

  const downPayment = price !== null && downPct !== null ? price * (downPct / 100) : null
  const closingCosts = price !== null && closingPct !== null ? price * (closingPct / 100) : null
  const upfront: UpfrontCash = {
    downPayment,
    closingCosts,
    renovation,
    total: (downPayment ?? 0) + (closingCosts ?? 0) + (renovation ?? 0),
  }

  return { lines, monthlyTotal, annualTotal: monthlyTotal * 12, counted, loanAmount, taxableValue, upfront, notes, errors }
}

export const formatUsd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
