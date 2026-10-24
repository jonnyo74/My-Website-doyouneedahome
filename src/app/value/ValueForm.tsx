'use client'

import { useEffect, useRef, useState } from 'react'
import FormConsent from '@/components/FormConsent'
import { trackEvent } from '@/lib/analytics'
import { getUtmAndReferrer } from '@/lib/utm'

interface FormValues {
  address: string
  name: string
  email: string
  phone: string
  payoff: string
  honeypot: string
}

type Field = 'address' | 'name' | 'email' | 'phone'

const EMPTY: FormValues = { address: '', name: '', email: '', phone: '', payoff: '', honeypot: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PHONE_DISPLAY = '(561) 783-7733'
const PHONE_HREF = 'tel:+15617837733'

function validate(values: FormValues): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (values.address.trim().length < 5) errors.address = 'Please enter the property address.'
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  const phoneDigits = values.phone.replace(/\D/g, '')
  if (values.phone.trim() && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
    errors.phone = 'Please enter a valid phone number, or leave it blank.'
  }
  return errors
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const analyticsParams = { cta_location: 'value-page', page_category: 'seller-card' }

export default function ValueForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [phoneConsent, setPhoneConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const startedRef = useRef(false)
  const submittingRef = useRef(false)
  const successRef = useRef<HTMLHeadingElement>(null)

  // The form is replaced by the success card, which would drop keyboard focus
  // onto <body>. Move it to the confirmation heading instead.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const update = (field: keyof FormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const handleFocus = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('value_form_start', analyticsParams)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    const firstInvalid = (['address', 'name', 'email', 'phone'] as Field[]).find((f) => nextErrors[f])
    if (firstInvalid) {
      document.getElementById(`value-${firstInvalid}`)?.focus()
      return
    }
    if (submittingRef.current) return
    submittingRef.current = true
    setStatus('sending')
    trackEvent('value_form_submit', analyticsParams)

    try {
      const { utmSource, utmMedium, utmCampaign, utmContent } = getUtmAndReferrer()
      const res = await fetch('/api/value-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: values.address.trim(),
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          payoff: values.payoff.trim(),
          honeypot: values.honeypot,
          // Only meaningful with a number; the server records "no" otherwise.
          phoneConsent: values.phone.trim() ? phoneConsent : false,
          sourcePageUrl: window.location.href,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) throw new Error(`Value lead submission failed (${res.status})`)
      setStatus('success')
      // No PII in params.
      trackEvent('value_form_success', analyticsParams)
    } catch (err) {
      console.error('Value request error:', err)
      setStatus('error')
      trackEvent('value_form_error', analyticsParams)
    } finally {
      submittingRef.current = false
    }
  }

  const labelCls = 'block text-xs font-medium mb-1.5 text-slate-600'
  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-500 transition focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500'
  const errorCls = 'mt-1 text-xs text-red-600'

  if (status === 'success') {
    return (
      <div
        className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500 bg-gold-500/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#1A79B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2
          ref={successRef}
          tabIndex={-1}
          className="font-serif text-xl font-semibold text-slate-900 focus:outline-none"
        >
          Got it. Thank you.
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {values.name.trim().split(/\s+/)[0]}, John or Christine will reach out today. Your home value review for{' '}
          {values.address.trim()} will be emailed to {values.email.trim()} within 48 hours.
        </p>
        <a
          href={PHONE_HREF}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
        >
          Need it sooner? Call {PHONE_DISPLAY}
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-white p-7 shadow-2xl sm:p-8">
      <h2 className="mb-5 font-serif text-xl font-semibold text-slate-900">Get my home value review</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot — hidden from sighted users and assistive tech, left open for bots */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
        >
          <label htmlFor="value-company">Company</label>
          <input
            id="value-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.honeypot}
            onChange={(e) => update('honeypot', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="value-address" className={labelCls}>
            Property Address *
          </label>
          <input
            id="value-address"
            name="address"
            type="text"
            required
            autoComplete="street-address"
            value={values.address}
            onFocus={handleFocus}
            onChange={(e) => update('address', e.target.value)}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'value-address-error' : undefined}
            className={inputCls}
            placeholder="123 Ocean Drive, Juno Beach"
          />
          {errors.address && (
            <p id="value-address-error" role="alert" className={errorCls}>
              {errors.address}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="value-name" className={labelCls}>
            Your Name *
          </label>
          <input
            id="value-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'value-name-error' : undefined}
            className={inputCls}
            placeholder="Full name"
          />
          {errors.name && (
            <p id="value-name-error" role="alert" className={errorCls}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="value-email" className={labelCls}>
            Email Address *
          </label>
          <input
            id="value-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'value-email-error' : undefined}
            className={inputCls}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="value-email-error" role="alert" className={errorCls}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="value-phone" className={labelCls}>
            Phone Number <span className="text-slate-500">(Optional)</span>
          </label>
          <input
            id="value-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'value-phone-error' : undefined}
            className={inputCls}
            placeholder="(561) 555-0100"
          />
          {errors.phone && (
            <p id="value-phone-error" role="alert" className={errorCls}>
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="value-payoff" className={labelCls}>
            Approximate mortgage balance <span className="text-slate-500">(Optional)</span>
          </label>
          <input
            id="value-payoff"
            name="payoff"
            type="text"
            inputMode="text"
            autoComplete="off"
            maxLength={60}
            value={values.payoff}
            onChange={(e) => update('payoff', e.target.value)}
            aria-describedby="value-payoff-hint"
            className={inputCls}
            placeholder="$250,000, or “none”"
          />
          <p id="value-payoff-hint" className="mt-1 text-xs text-slate-500">
            A rough number is fine. We use it to work out your net proceeds.
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-600 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Get My Home Value Review'}
        </button>

        {status === 'error' && (
          <p role="alert" aria-live="assertive" className="text-center text-sm text-red-600">
            Something went wrong sending your request. Please try again, or call us at{' '}
            <a href={PHONE_HREF} className="font-semibold underline underline-offset-2">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        )}

        {/* Same consent block as /sell. The call/text checkbox appears once a
            number is typed, is unchecked by default, and never gates the submit. */}
        <FormConsent
          phoneEntered={!!values.phone.trim()}
          phoneConsent={phoneConsent}
          onPhoneConsentChange={setPhoneConsent}
        />
      </form>
    </div>
  )
}
