import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | DO Homes Group',
  description:
    'How doyouneedahome.com and DO Homes Group collect, use, and protect your information.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
}

const linkCls = 'text-gold-700 underline underline-offset-2 transition hover:text-gold-800'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-white px-6 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-600">Legal</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Last updated August 2026</p>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-10 leading-relaxed text-slate-600">
          <p>
            doyouneedahome.com is operated by DO Homes Group, a real estate team affiliated with
            Premier Brokers International. This policy explains what information we collect through
            this website, how we use it, and the choices you have regarding your information.
          </p>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Information We Collect
            </h2>
            <p>
              When you submit a form on this site — a home valuation request or a market report
              download — we collect the information you provide directly: your name, email address,
              phone number, and any details you include, such as a property address, your selling
              timeline, or whether you are buying, selling, or researching. We do not collect
              financial account numbers, Social Security numbers, or other sensitive personal
              information through this site.
            </p>
            <p className="mt-3">
              We also collect standard technical information automatically — pages visited, browser
              type, referring site, and general location — through the analytics and tracking
              services described below.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              How We Use Your Information
            </h2>
            <ul className="list-inside list-disc space-y-2 pl-2">
              <li>
                To respond to your inquiry and provide the valuation, market report, or listing
                information you requested
              </li>
              <li>
                To follow up about buying or selling a home in Palm Beach County and the
                surrounding areas, by phone, text, or email
              </li>
              <li>
                To understand which communities and content visitors are most interested in, so we
                can improve this website
              </li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to third parties. We do not share it with
              unaffiliated companies for their own marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Your Consent to Be Contacted
            </h2>
            <p>
              When you submit a form on this site, you agree that DO Homes Group and Premier Brokers
              International may contact you at the phone number and email address you provided —
              including by phone, text message, and automated or prerecorded means — about your
              inquiry and Palm Beach County real estate. Consent is not a condition of any purchase.
              Message and data rates may apply.
            </p>
            <p className="mt-3">
              You can withdraw that consent at any time: reply STOP to any text message, use the
              unsubscribe link in any email, or contact us using the details under &ldquo;Your
              Choices&rdquo; below. Withdrawing consent does not affect our ability to respond to a
              request you have already sent us.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Third-Party Services We Use
            </h2>
            <ul className="list-inside list-disc space-y-2 pl-2">
              <li>
                <strong className="text-slate-900">Follow Up Boss</strong> — our customer
                relationship management (CRM) system. Form submissions are sent there and stored so
                Christine and John can follow up with you.
              </li>
              <li>
                <strong className="text-slate-900">Follow Up Boss visitor tracking</strong> — this
                site runs a Follow Up Boss tracking script that records the pages you view. If you
                submit a form, that browsing activity is associated with your contact record in our
                CRM, which is how we know which communities and listings you have been looking at.
              </li>
              <li>
                <strong className="text-slate-900">Google Analytics</strong> — site-usage analytics
                to understand how visitors find and move through this site. Subject to the{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Google Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-slate-900">Vercel Analytics</strong> — aggregate traffic and
                performance measurement provided by our website host.
              </li>
              <li>
                <strong className="text-slate-900">Ylopo</strong>{' '}
                — powers our MLS property search at search.doyouneedahome.com. Searches you run, saved searches, and any account you
                create there are subject to Ylopo&apos;s own privacy practices.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">Cookies and Tracking</h2>
            <p>
              This site uses cookies and similar tracking technologies for basic functionality,
              analytics, and the visitor tracking described above. You can disable cookies through
              your browser settings, though some features of this site may not function as intended
              without them. This site does not currently respond to browser Do Not Track signals.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">Your Choices</h2>
            <p>
              You can ask us to stop contacting you, or to delete the information you have
              submitted, at any time by emailing{' '}
              <a href="mailto:info@doyouneedahome.com" className={linkCls}>
                info@doyouneedahome.com
              </a>{' '}
              or calling (561) 783-7733.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Children&apos;s Privacy
            </h2>
            <p>
              This site is intended for adults searching for real estate. We do not knowingly
              collect information from children under 13. If you believe a child has submitted
              information to us, contact us and we will delete it.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">
              Changes to This Policy
            </h2>
            <p>
              We may update this policy as our website and the services we use change. The date at
              the top of this page reflects the most recent revision.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-slate-900">Contact</h2>
            <p>
              Questions about this policy or how your information is handled can be directed to DO
              Homes Group, 9123 North Military Trail, Suite 104, Palm Beach Gardens, FL 33410, or
              via the contact information above. DO Homes Group operates under Premier Brokers
              International.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
