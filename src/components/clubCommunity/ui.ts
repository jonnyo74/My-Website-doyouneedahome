// Shared class strings for the club-community components, so every page built
// from them looks like one system. Matches the Jupiter Inlet Colony page.

export const eyebrow = 'text-xs font-semibold uppercase tracking-[0.28em] text-report-gold-text'
export const h2 = 'mt-2 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl'
export const h3 = 'font-serif text-2xl font-semibold text-slate-900'
export const lead = 'mt-4 max-w-3xl leading-8 text-slate-600'
export const section = 'px-6 py-14 sm:px-8 sm:py-16'
export const wrap = 'mx-auto max-w-7xl'
export const card = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-card'
export const btnPrimary =
  'inline-flex items-center justify-center rounded-full bg-report-gold px-7 py-3.5 text-center text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-report-gold-light'
export const btnOutline =
  'inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-center text-sm font-semibold text-slate-900 transition hover:border-slate-900'
export const btnGhostDark =
  'inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/10'
export const textLink = 'font-semibold text-gold-600 underline-offset-4 hover:text-gold-700 hover:underline'
export const tableWrap = 'overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card'
export const th = 'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600'
export const td = 'px-5 py-3.5 align-top text-sm leading-6 text-slate-700'

/** The id of the one inquiry form on a club page. Every CTA scrolls to it. */
export const INQUIRY_ID = 'club-inquiry'

/** The clickable line of a collapsed <details> panel, with an open/close mark. */
export const summaryCls =
  'inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 [&::-webkit-details-marker]:hidden after:content-["+"] after:text-report-gold-text group-open:after:content-["−"]'
