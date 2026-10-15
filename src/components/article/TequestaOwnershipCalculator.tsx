'use client'

import { useId, useMemo, useState } from 'react'
import {
  BLANK_INPUTS,
  calculateOwnership,
  EXAMPLE_INPUTS,
  formatUsd,
  LOAN_TERMS,
  OWNERSHIP_HEADING,
  OWNERSHIP_HEADING_ID,
  type LineKey,
  type Occupancy,
  type OwnershipFieldKey,
  type OwnershipInputs,
} from '@/lib/tequestaOwnership'

// Educational and client-side only. Inputs live in component state and are gone
// on reload; nothing is submitted, stored or sent to analytics. Market figures
// (price, rate, millage, premiums, fees) start blank on purpose: a pre-filled
// number would read as a claim about Tequesta. The example button fills clearly
// labelled hypothetical figures so the arithmetic can be seen working.

type Unit = '$' | '%' | 'mills'
interface FieldDef {
  key: OwnershipFieldKey
  label: string
  unit: Unit
  hint?: string
}

const GROUPS: Array<{ legend: string; fields: FieldDef[] }> = [
  {
    legend: 'Financing',
    fields: [
      { key: 'purchasePrice', label: 'Home purchase price', unit: '$' },
      { key: 'downPaymentPct', label: 'Down payment', unit: '%', hint: '100 for an all-cash purchase' },
      { key: 'interestRatePct', label: 'Mortgage interest rate', unit: '%', hint: 'From a lender quote' },
      { key: 'pmiRatePct', label: 'PMI rate, if down payment is under 20%', unit: '%', hint: 'Annual, as a percent of the loan. From your lender' },
    ],
  },
  {
    legend: 'Property taxes',
    fields: [
      { key: 'millage', label: 'Total millage rate', unit: 'mills', hint: 'All taxing authorities combined, for the exact parcel' },
      { key: 'homesteadExemption', label: 'Estimated homestead exemption', unit: '$', hint: 'Primary residence only. Check current law for your amount' },
      { key: 'portability', label: 'Portability amount (optional)', unit: '$', hint: 'Save Our Homes benefit you expect to transfer' },
    ],
  },
  {
    legend: 'Insurance',
    fields: [
      { key: 'annualInsurance', label: 'Annual homeowners and windstorm insurance', unit: '$', hint: 'An actual quote for this address' },
      { key: 'annualFlood', label: 'Annual flood insurance', unit: '$', hint: 'A quote, or 0 if not required' },
    ],
  },
  {
    legend: 'Community and running costs',
    fields: [
      { key: 'monthlyHoa', label: 'Monthly HOA or association fees', unit: '$', hint: '0 if none' },
      { key: 'monthlyClub', label: 'Monthly club dues', unit: '$', hint: '0 if none, or if you choose not to join' },
      { key: 'monthlyUtilities', label: 'Monthly utilities', unit: '$', hint: 'Electric, water, internet and similar' },
      { key: 'annualMaintenance', label: 'Annual maintenance reserve', unit: '$', hint: 'What you plan to set aside each year' },
    ],
  },
  {
    legend: 'One-time costs',
    fields: [
      { key: 'closingCostPct', label: 'Estimated closing costs', unit: '%', hint: 'Percent of price, from your lender and title estimates' },
      { key: 'renovationBudget', label: 'One-time renovation budget', unit: '$', hint: 'Counted as upfront cash, not as a monthly cost' },
    ],
  },
]

// One colour per monthly line, chosen to stay distinguishable and to keep
// contrast against white. The chart is decorative; the table carries the data.
const SEGMENT: Record<LineKey, string> = {
  principalInterest: '#1e3a5f',
  pmi: '#6b7280',
  propertyTax: '#2b88a1',
  homeInsurance: '#b45309',
  floodInsurance: '#d4a24c',
  hoa: '#7a5a2e',
  club: '#9b4f3a',
  utilities: '#2f6a4a',
  maintenance: '#6b4fa0',
}

const inputBase =
  'block w-full rounded-lg border bg-white py-2.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-gold-500'

export default function TequestaOwnershipCalculator() {
  const [inputs, setInputs] = useState<OwnershipInputs>(BLANK_INPUTS)
  const [touched, setTouched] = useState<Partial<Record<OwnershipFieldKey, boolean>>>({})
  const uid = useId()
  const result = useMemo(() => calculateOwnership(inputs), [inputs])

  const set = (key: OwnershipFieldKey, value: string) => setInputs((prev) => ({ ...prev, [key]: value }))
  const id = (key: string) => `${uid}-${key}`
  const second = inputs.occupancy === 'second'
  const segments = result.lines.filter((l) => l.monthly !== null && l.monthly > 0)

  return (
    <section aria-labelledby={OWNERSHIP_HEADING_ID} className="mt-12 border-y border-slate-200 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-600">Planning calculator</p>
      <h2 id={OWNERSHIP_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {OWNERSHIP_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-600">
        Enter the figures you have for one specific property. Anything you leave blank is simply left out of the total.
        The fields start empty on purpose, because no single number describes every Tequesta home. Nothing you type is
        saved or sent anywhere.
      </p>
      <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        Want to see how it works first?{' '}
        <button
          type="button"
          onClick={() => {
            setInputs(EXAMPLE_INPUTS)
            setTouched({})
          }}
          className="rounded font-semibold text-gold-600 underline decoration-gold-300 underline-offset-4 transition hover:text-gold-700"
        >
          Load hypothetical example figures
        </button>
        . They are illustrative assumptions, not Tequesta prices, rates, premiums or fees.
      </p>

      <form noValidate onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">How you will use the home</legend>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {(['primary', 'second'] as Occupancy[]).map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={id('occupancy')}
                  value={o}
                  checked={inputs.occupancy === o}
                  onChange={() => setInputs((p) => ({ ...p, occupancy: o }))}
                  className="h-4 w-4 border-slate-300 text-gold-600"
                />
                {o === 'primary' ? 'Primary residence' : 'Second or seasonal home'}
              </label>
            ))}
          </div>
          {second && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              A second home does not qualify for the homestead exemption, so it is ignored in the tax line.
            </p>
          )}
        </fieldset>

        {GROUPS.map((group) => (
          <fieldset key={group.legend}>
            <legend className="text-sm font-semibold text-slate-900">{group.legend}</legend>
            <div className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {group.fields.map((f) => {
                const error = touched[f.key] ? result.errors[f.key] : undefined
                const disabled = second && (f.key === 'homesteadExemption' || f.key === 'portability')
                const describedBy = [f.hint && id(`${f.key}-hint`), error && id(`${f.key}-error`)].filter(Boolean).join(' ') || undefined
                return (
                  <div key={f.key}>
                    <label htmlFor={id(f.key)} className="block text-sm font-medium text-slate-700">
                      {f.label}
                    </label>
                    <div className="relative mt-1.5">
                      {f.unit === '$' && (
                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                          $
                        </span>
                      )}
                      <input
                        id={id(f.key)}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        disabled={disabled}
                        value={inputs[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        className={`${inputBase} ${f.unit === '$' ? 'pl-7 pr-3' : f.unit === 'mills' ? 'pl-3 pr-14' : 'pl-3 pr-8'} ${
                          error ? 'border-red-600' : 'border-slate-300'
                        } ${disabled ? 'bg-slate-100 text-slate-400' : ''}`}
                      />
                      {f.unit !== '$' && (
                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                          {f.unit === 'mills' ? 'mills' : '%'}
                        </span>
                      )}
                    </div>
                    {f.hint && (
                      <p id={id(`${f.key}-hint`)} className="mt-1 text-xs leading-5 text-slate-500">
                        {f.hint}
                      </p>
                    )}
                    {error && (
                      <p id={id(`${f.key}-error`)} className="mt-1 text-xs font-medium leading-5 text-red-700">
                        {error}
                      </p>
                    )}
                  </div>
                )
              })}

              {group.legend === 'Financing' && (
                <div>
                  <label htmlFor={id('loanTermYears')} className="block text-sm font-medium text-slate-700">
                    Loan term
                  </label>
                  <select
                    id={id('loanTermYears')}
                    value={inputs.loanTermYears}
                    onChange={(e) => set('loanTermYears', e.target.value)}
                    className={`${inputBase} mt-1.5 border-slate-300 px-3`}
                  >
                    {LOAN_TERMS.map((t) => (
                      <option key={t} value={String(t)}>
                        {t} years
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </fieldset>
        ))}
      </form>

      <div className="mt-10 rounded-xl bg-slate-50 p-5 sm:p-6">
        <p className="sr-only" aria-live="polite">
          {result.counted === 0
            ? 'No figures entered yet.'
            : `Estimated monthly carrying cost ${formatUsd(result.monthlyTotal)}, ${result.counted} of ${result.lines.length} lines included.`}
        </p>
        <h3 className="font-serif text-xl font-semibold text-slate-900">Your monthly estimate</h3>

        {segments.length > 0 && (
          <div className="mt-4" aria-hidden="true">
            <div className="flex h-5 w-full overflow-hidden rounded-full bg-slate-200">
              {segments.map((l) => (
                <div key={l.key} style={{ width: `${((l.monthly ?? 0) / result.monthlyTotal) * 100}%`, backgroundColor: SEGMENT[l.key] }} />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
              {segments.map((l) => (
                <li key={l.key} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: SEGMENT[l.key] }} />
                  {l.label} {Math.round(((l.monthly ?? 0) / result.monthlyTotal) * 100)}%
                </li>
              ))}
            </ul>
          </div>
        )}

        <table className="mt-5 w-full border-collapse text-left text-sm">
          <caption className="sr-only">Estimated monthly carrying cost by line item</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Cost</th>
              <th scope="col">Monthly</th>
            </tr>
          </thead>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.key} className="border-b border-slate-200 align-top">
                <th scope="row" className="py-2.5 pr-4 font-normal">
                  <span className="block text-slate-800">{line.label}</span>
                  <span className="block text-xs text-slate-500">{line.detail}</span>
                </th>
                <td className={`py-2.5 text-right tabular-nums ${line.monthly === null ? 'text-slate-400' : 'font-medium text-slate-900'}`}>
                  {line.monthly === null ? '—' : formatUsd(line.monthly)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-4 pr-4 text-base font-semibold text-slate-900">
                Estimated total monthly carrying cost
                <span className="block text-xs font-normal text-slate-500">
                  {result.counted === 0 ? 'Enter figures above to build a total' : `${result.counted} of ${result.lines.length} lines included`}
                </span>
              </th>
              <td className="pt-4 text-right align-top font-serif text-2xl font-semibold tabular-nums text-slate-900">{formatUsd(result.monthlyTotal)}</td>
            </tr>
            <tr>
              <th scope="row" className="pt-3 pr-4 text-sm font-normal text-slate-700">
                Estimated annual carrying cost
              </th>
              <td className="pt-3 text-right align-top text-sm font-medium tabular-nums text-slate-900">{formatUsd(result.annualTotal)}</td>
            </tr>
          </tfoot>
        </table>

        <h3 className="mt-8 font-serif text-xl font-semibold text-slate-900">Estimated upfront cash</h3>
        <table className="mt-3 w-full border-collapse text-left text-sm">
          <caption className="sr-only">Estimated upfront cash requirement</caption>
          <tbody>
            {[
              ['Down payment', result.upfront.downPayment],
              ['Closing costs', result.upfront.closingCosts],
              ['Renovation budget', result.upfront.renovation],
            ].map(([label, value]) => (
              <tr key={label as string} className="border-b border-slate-200">
                <th scope="row" className="py-2.5 pr-4 font-normal text-slate-800">
                  {label as string}
                </th>
                <td className={`py-2.5 text-right tabular-nums ${value === null ? 'text-slate-400' : 'font-medium text-slate-900'}`}>
                  {value === null ? '—' : formatUsd(value as number)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-3 pr-4 text-base font-semibold text-slate-900">
                Total upfront cash
              </th>
              <td className="pt-3 text-right font-serif text-xl font-semibold tabular-nums text-slate-900">{formatUsd(result.upfront.total)}</td>
            </tr>
          </tfoot>
        </table>

        {result.notes.length > 0 && (
          <ul className="mt-5 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
            {result.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-600">
          <strong className="font-semibold text-slate-700">Planning figures only.</strong> This adds up the numbers you
          entered. It is not a lender quote, an insurance quote, an official tax estimate or financial advice. Property
          tax here is simplified as taxable value times your total millage, which does not model the separate school
          and non-school exemption layers, non-ad valorem assessments or cap rules. Use the Property Appraiser&apos;s own
          estimator, a lender and a licensed insurance agent for the specific property.
        </p>
        <button
          type="button"
          onClick={() => {
            setInputs(BLANK_INPUTS)
            setTouched({})
          }}
          className="mt-4 rounded text-sm font-semibold text-gold-600 underline decoration-gold-300 underline-offset-4 transition hover:text-gold-700"
        >
          Clear the calculator
        </button>
      </div>
    </section>
  )
}
