'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import type { ArticleChecklistData } from '@/lib/articles'

// A take-it-with-you checklist: the action tool of a due-diligence article.
// The boxes are a reading aid, not a form — nothing is focusable, nothing is
// stored, and nothing is submitted. What matters is that a buyer can copy the
// list into an email to their agent or attorney, or print the page, so both
// affordances are offered explicitly rather than left to the browser menu.

function asPlainText(data: ArticleChecklistData): string {
  const lines = [data.heading, '']
  data.items.forEach((item) => {
    lines.push(`[ ] ${item.label}`)
    if (item.detail) lines.push(`    ${item.detail}`)
  })
  if (data.note) lines.push('', data.note)
  return lines.join('\n')
}

export default function ArticleChecklist({ data }: { data: ArticleChecklistData }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = async () => {
    const text = asPlainText(data)
    const flash = () => {
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2500)
    }
    try {
      await navigator.clipboard.writeText(text)
      flash()
      return
    } catch {
      // The async clipboard needs a secure context and permission, and is
      // refused often enough (older Safari, embedded webviews) to need a
      // fallback rather than a dead button.
    }
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      if (ok) flash()
    } catch {
      // Both paths refused: the list is still on the page and still printable,
      // so this fails quietly rather than alarming anyone.
      setCopied(false)
    }
  }

  return (
    <section
      aria-labelledby="article-checklist"
      className="border-b border-slate-200 bg-white print:border-0"
    >
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <h2
          id="article-checklist"
          className="scroll-mt-28 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl"
        >
          {data.heading}
        </h2>
        {data.intro && <p className="mt-3 leading-7 text-slate-600">{data.intro}</p>}

        <ul className="mt-7 space-y-4">
          {data.items.map((item) => (
            <li key={item.label} className="flex gap-3 break-inside-avoid">
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block h-4 w-4 shrink-0 rounded-[3px] border-2 border-gold-500"
              />
              <span className="leading-7">
                <span className="font-semibold text-slate-900">{item.label}</span>
                {item.detail && <span className="block text-slate-600">{item.detail}</span>}
              </span>
            </li>
          ))}
        </ul>

        {data.note && <p className="mt-6 text-sm leading-6 text-slate-600">{data.note}</p>}

        <div className="mt-7 flex flex-wrap items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-700"
          >
            {copied ? 'Copied' : 'Copy the list'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-700"
          >
            Print
          </button>
          {data.cta && (
            <Link
              href={data.cta.href}
              className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-gold-700 underline decoration-gold-300 underline-offset-4 transition hover:text-gold-800"
            >
              {data.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}
          {/* Announced politely so a screen reader hears the result of the copy. */}
          <span aria-live="polite" className="sr-only">
            {copied ? 'Checklist copied to the clipboard' : ''}
          </span>
        </div>
      </div>
    </section>
  )
}
