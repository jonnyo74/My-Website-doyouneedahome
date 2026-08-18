'use client'

import { useRef, useState } from 'react'
import type { Agent } from '@/lib/agents'
import { TIMELINE_OPTIONS } from '@/lib/sellerLeadHelpers'
import { trackEvent } from '@/lib/analytics'
import { getUtmAndReferrer } from '@/lib/utm'
import FormConsent from '@/components/FormConsent'

interface FormValues {
  address: string
  name: string
  email: string
  phone: string
  timeline: string
  notes: string
  honeypot: string
}

const EMPTY: FormValues = {
  address: '',
  name: '',
  email: '',
  phone: '',
  timeline: '',
  notes: '',
  honeypot: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateStep2(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!values.timeline) errors.timeline = 'Please choose a timeline.'
  return errors
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function SellerValuationForm({ agent }: { agent: Agent }) {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  // Step 1 asks for the address and nothing else — one low-friction commitment
  // before we ask who they are. Same pattern as the condowpb seller form.
  const [step, setStep] = useState<1 | 2>(1)
  const startedRef = useRef(false)
  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const analyticsParams = {
    agent: agent.slug,
    cta_location: 'valuation-hero',
    page_category: 'agent-valuation',
  }

  const update = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleFocus = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('valuation_form_start', analyticsParams)
  }

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (values.address.trim().length < 5) {
      setErrors({ address: 'Please enter the property address.' })
      focusField('address')
      return
    }
    setErrors({})
    setStep(2)
    trackEvent('valuation_form_step2', analyticsParams)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep2(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusField(Object.keys(nextErrors)[0])
      return
    }
    if (submittingRef.current) return
    submittingRef.current = true
    setStatus('sending')
    trackEvent('valuation_form_submit', analyticsParams)

    try {
      const { utmSource, utmMedium, utmCampaign, utmContent, referrer } = getUtmAndReferrer()
      const res = await fetch('/api/seller-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          timeline: values.timeline,
          notes: values.notes.trim(),
          honeypot: values.honeypot,
          agentSlug: agent.slug,
          sourcePageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          referrer,
        }),
      })
      if (!res.ok) throw new Error(`Seller lead submission failed (${res.status})`)
      const data = (await res.json()) as { ok?: boolean }
      if (!data.ok) throw new Error('Seller lead rejected')
      setStatus('success')
    } catch (err) {
      console.error('Valuation request error:', err)
      setStatus('error')
      setServerError(
        `Something went wrong. Please try again, or email ${agent.firstName} directly at ${agent.email}.`,
      )
      trackEvent('valuation_form_error', analyticsParams)
    } finally {
      submittingRef.current = false
    }
  }

  const fieldId = (name: string) => `valuation-${name}`

  /**
   * Put focus on the first field that failed validation (WCAG 3.3.1 / 3.3.3),
   * so a failed submit isn't silent for keyboard and screen-reader users. The
   * timeline radio group has no id of its own, so it's matched by name.
   */
  const focusField = (field: string) => {
    const el =
      document.getElementById(fieldId(field)) ??
      formRef.current?.querySelector<HTMLElement>(`input[name="${fieldId(field)}"]`)
    el?.focus()
  }

  const labelCls = 'block text-xs font-medium mb-1.5 text-slate-600'
  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-500 transition focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500'
  const errorCls = 'mt-1 text-xs text-red-600'

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card" role="status" aria-live="polite">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500 bg-gold-500/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#B08F47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-semibold text-slate-900">Request received.</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Thanks, {values.name.trim().split(' ')[0]}. {agent.firstName} will reach out today, then
          email your CMA for {values.address.trim()} to {values.email.trim()} within 48 hours.
        </p>
        <a
          href={agent.phoneHref}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
        >
          Need it sooner? Call {agent.phone}
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-8">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-semibold text-slate-900">
          {step === 1 ? 'What Is Your Home Worth?' : 'Where Should I Send It?'}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {step === 1
            ? `Start with the address. ${agent.firstName} replies the same day and sends your hand-built CMA within 48 hours — no obligation.`
            : `Your CMA for ${values.address.trim()}, prepared by ${agent.firstName} personally and sent within 48 hours.`}
        </p>
      </div>

      {step === 1 ? (
        <form ref={formRef} onSubmit={handleStep1} noValidate className="space-y-4">
          <div>
            <label htmlFor={fieldId('address')} className={labelCls}>
              Property Address *
            </label>
            <input
              id={fieldId('address')}
              name="address"
              type="text"
              required
              autoComplete="street-address"
              value={values.address}
              onFocus={handleFocus}
              onChange={(e) => update('address', e.target.value)}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? fieldId('address-error') : undefined}
              className={inputCls}
              placeholder="123 Ocean Drive, Juno Beach"
            />
            {errors.address && (
              <p id={fieldId('address-error')} role="alert" className={errorCls}>
                {errors.address}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-600"
          >
            Get My Free CMA
          </button>
          <FormConsent />
        </form>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot — hidden from sighted users, left open for bots */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
          >
            <label htmlFor={fieldId('company')}>Company</label>
            <input
              id={fieldId('company')}
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.honeypot}
              onChange={(e) => update('honeypot', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor={fieldId('name')} className={labelCls}>
              Your Name *
            </label>
            <input
              id={fieldId('name')}
              name="name"
              type="text"
              required
              autoComplete="name"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? fieldId('name-error') : undefined}
              className={inputCls}
              placeholder="Full name"
            />
            {errors.name && (
              <p id={fieldId('name-error')} role="alert" className={errorCls}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={fieldId('email')} className={labelCls}>
              Email Address *
            </label>
            <input
              id={fieldId('email')}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? fieldId('email-error') : undefined}
              className={inputCls}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id={fieldId('email-error')} role="alert" className={errorCls}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={fieldId('phone')} className={labelCls}>
              Phone Number <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              id={fieldId('phone')}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={inputCls}
              placeholder="(561) 555-0100"
            />
          </div>

          <fieldset aria-describedby={errors.timeline ? fieldId('timeline-error') : undefined}>
            <legend className={labelCls}>When are you thinking of selling? *</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {TIMELINE_OPTIONS.map((opt) => {
                const selected = values.timeline === opt
                return (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                      selected
                        ? 'border-gold-500 bg-gold-500/10 text-gold-700'
                        : 'border-slate-300 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name={fieldId('timeline')}
                      value={opt}
                      checked={selected}
                      onChange={() => update('timeline', opt)}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                )
              })}
            </div>
            {errors.timeline && (
              <p id={fieldId('timeline-error')} role="alert" className={errorCls}>
                {errors.timeline}
              </p>
            )}
          </fieldset>

          <div>
            <label htmlFor={fieldId('notes')} className={labelCls}>
              Anything {agent.firstName} should know? <span className="text-slate-500">(Optional)</span>
            </label>
            <textarea
              id={fieldId('notes')}
              name="notes"
              rows={3}
              value={values.notes}
              onChange={(e) => update('notes', e.target.value)}
              className={`${inputCls} resize-none`}
              placeholder="Recent renovations, why you're moving, questions you have…"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-slate-300 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex-1 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-600 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : `Send to ${agent.firstName}`}
            </button>
          </div>

          {status === 'error' && serverError && (
            <p role="alert" aria-live="assertive" className="text-center text-xs text-red-600">
              {serverError}
            </p>
          )}

          <FormConsent />
        </form>
      )}
    </div>
  )
}
