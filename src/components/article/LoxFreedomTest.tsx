'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import {
  FREEDOM_CHOICES,
  FREEDOM_QUESTIONS,
  freedomOutcome,
  type FreedomChoice,
} from '@/lib/loxFreedomTest'

// A short reader self-check for the Loxahatchee guide. Nothing is stored or
// sent anywhere, and no contact details are asked for.

export const FREEDOM_HEADING = 'Would You Use the Freedom, or Just Maintain It?'
export const FREEDOM_HEADING_ID = 'would-you-use-the-freedom-or-just-maintain-it'

export default function LoxFreedomTest() {
  const [answers, setAnswers] = useState<Partial<Record<string, FreedomChoice>>>({})
  const uid = useId()
  const outcome = freedomOutcome(answers)
  const answered = Object.keys(answers).length

  return (
    <section aria-labelledby={FREEDOM_HEADING_ID} className="mt-12 rounded-3xl border border-lime-900/20 bg-[#f4efdf] p-6 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-900">The Loxahatchee freedom test</p>
      <h2 id={FREEDOM_HEADING_ID} className="mt-2 scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
        {FREEDOM_HEADING}
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Five honest questions. Answer for the life you actually lead, not the one you would like to. Nothing you choose is
        saved or sent anywhere.
      </p>

      <ol className="mt-6 space-y-6">
        {FREEDOM_QUESTIONS.map((q, i) => (
          <li key={q.id}>
            <fieldset>
              <legend className="font-semibold leading-6 text-slate-900">
                <span className="mr-2 text-lime-900">{i + 1}.</span>
                {q.prompt}
              </legend>
              <p id={`${uid}-${q.id}-hint`} className="mt-1 text-sm text-slate-600">
                {q.hint}
              </p>
              <div className="mt-3 flex flex-wrap gap-2" aria-describedby={`${uid}-${q.id}-hint`}>
                {FREEDOM_CHOICES.map((c) => {
                  const on = answers[q.id] === c.key
                  return (
                    <label
                      key={c.key}
                      className={`flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500 ${
                        on ? 'border-lime-900 bg-lime-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${uid}-${q.id}`}
                        className="sr-only"
                        checked={on}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: c.key }))}
                      />
                      {c.label}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="mt-8">
        {outcome ? (
          <div className="rounded-2xl border border-lime-900/25 bg-white p-6">
            <h3 className="font-serif text-xl font-semibold text-slate-900">{outcome.heading}</h3>
            <p className="mt-2 leading-7 text-slate-700">{outcome.body}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {outcome.next.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="font-semibold text-gold-700 underline decoration-gold-300 underline-offset-4 hover:text-gold-800">
                    {n.label} →
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="mt-4 rounded text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
            >
              Start over
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            {answered === 0 ? 'Answer all five to see where your answers point.' : `${answered} of ${FREEDOM_QUESTIONS.length} answered.`}
          </p>
        )}
      </div>
    </section>
  )
}
