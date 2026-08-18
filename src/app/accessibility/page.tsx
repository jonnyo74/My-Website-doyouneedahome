import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Statement | DO Homes Group',
  description:
    'How DO Homes Group works to keep doyouneedahome.com usable for everyone, and how to reach us if you hit an accessibility barrier.',
  alternates: { canonical: '/accessibility' },
  robots: { index: true, follow: true },
}

const linkCls = 'text-gold-700 underline underline-offset-2 transition hover:text-gold-800'

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Legal</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Accessibility Statement
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Last updated August 2026</p>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-10 leading-relaxed text-slate-600">
          <p>
            doyouneedahome.com is operated by DO Homes Group, a real estate team affiliated with
            Premier Brokers International. Buying or selling a home is a decision that should be
            open to everyone, and we want this website to work for every visitor — including
            people who use screen readers, keyboard-only navigation, screen magnification, voice
            control, or other assistive technology.
          </p>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Our Commitment
            </h2>
            <p>
              We are committed to providing an accessible digital experience and to continuing to
              improve it over time. Accessibility is treated as part of building and maintaining
              this site, not as a one-time project.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Standard We Are Working Toward
            </h2>
            <p>
              We use the{' '}
              <a
                href="https://www.w3.org/TR/WCAG22/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                Web Content Accessibility Guidelines (WCAG) 2.2, Level AA
              </a>{' '}
              as our target. These guidelines cover things like colour contrast, keyboard
              operability, clear page structure, form labelling, and text that can be enlarged
              without breaking the layout.
            </p>
            <p className="mt-3">
              We have made a deliberate choice not to install an accessibility overlay or
              accessibility toolbar. Those products sit on top of a website without fixing the
              underlying problems, and they frequently interfere with the assistive technology
              people already use and prefer. Instead, we make the corrections in the site&rsquo;s
              own code.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              An Ongoing Effort
            </h2>
            <p>
              Accessibility work is never finished. We add new community pages, market reports, and
              articles regularly, and some parts of this site rely on software supplied by other
              companies — most notably the MLS property search at search.doyouneedahome.com, which
              is hosted and controlled by our search provider rather than by us. We are not able to
              change that software directly, and we do not claim it meets the same standard.
            </p>
            <p className="mt-3">
              For that reason we do not claim that this website is fully or perfectly compliant, and
              we do not guarantee that every page meets every criterion at all times. What we can
              tell you is that we test, we fix what we find, and we take reports seriously.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Reporting an Accessibility Barrier
            </h2>
            <p>
              If any part of this website is difficult or impossible for you to use, please tell us.
              Your report is genuinely useful — it tells us about problems our own testing may have
              missed, and it goes to the top of the list.
            </p>
            <p className="mt-3">To help us fix it quickly, please include if you can:</p>
            <ul className="mt-3 list-inside list-disc space-y-2 pl-2">
              <li>The page or web address (URL) where you ran into the problem</li>
              <li>What you were trying to do, and what happened instead</li>
              <li>
                The browser, device, and any assistive technology you were using — for example
                &ldquo;Chrome on Windows with NVDA&rdquo; or &ldquo;Safari on iPhone with
                VoiceOver&rdquo;
              </li>
            </ul>
            <p className="mt-3">
              If it is easier to simply describe the problem in your own words, that is fine too.
              You do not need any of the technical details to contact us.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Getting the Information Another Way
            </h2>
            <p>
              If something on this site is not working for you, we will do our best to give you the
              same information or complete the same task another way — by phone, by email, or in
              person. That includes property details, listing information, market reports, valuation
              requests, and anything else this site offers. Please just ask.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">Contact Us</h2>
            <p>We aim to respond to accessibility reports the same business day.</p>
            <address className="mt-4 space-y-1 not-italic">
              <p className="font-semibold text-slate-900">
                DO Homes Group at Premier Brokers International
              </p>
              <p>Christine Dekant &amp; John Oliver</p>
              <p>
                Phone:{' '}
                <a href="tel:+15617837733" className={linkCls}>
                  (561) 783-7733
                </a>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:info@doyouneedahome.com" className={linkCls}>
                  info@doyouneedahome.com
                </a>
              </p>
              <p className="pt-2">
                9123 North Military Trail, Suite 104
                <br />
                Palm Beach Gardens, FL 33410
              </p>
            </address>
          </div>
        </div>
      </section>
    </div>
  )
}
