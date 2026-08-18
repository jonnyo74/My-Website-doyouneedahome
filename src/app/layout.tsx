import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SiteLeadMagnets from '@/components/leadMagnet/SiteLeadMagnets'
import ThirdPartyFrameTitles from '@/components/ThirdPartyFrameTitles'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'DO Homes Group | Palm Beach County Real Estate',
  description: 'Buy or sell homes across Palm Beach County with DO Homes Group at Premier Brokers International. Luxury communities, waterfront estates, golf enclaves, and more.',
  openGraph: {
    siteName: 'DO Homes Group',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DO Homes Group — Palm Beach County Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex min-w-0 flex-col bg-white">
        {/* Bypass block (WCAG 2.4.1). Off-screen until focused, then the
            first thing a keyboard user lands on. tabIndex on <main> is what
            actually moves focus — without it the browser only scrolls. */}
        <a
          href="#main-content"
          className="sr-only rounded-full focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        {/* The site's single <main> landmark. Pages render their own
            sections inside it rather than each declaring a <main>, so the
            landmark is guaranteed present and unique on every route. */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <SiteLeadMagnets />
        <ThirdPartyFrameTitles />
        <Analytics />
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-24154P036M"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-24154P036M');
      `}</Script>
      <Script id="fub-pixel" strategy="afterInteractive">{`
        (function(w,i,d,g,e,t){w["WidgetTrackerObject"]=g;(w[g]=w[g]||function()
        {(w[g].q=w[g].q||[]).push(arguments);}),(w[g].ds=1*new Date());(e="script"),
        (t=d.createElement(e)),(e=d.getElementsByTagName(e)[0]);t.async=1;t.src=i;
        e.parentNode.insertBefore(t,e);})
        (window,"https://widgetbe.com/agent",document,"widgetTracker");
        window.widgetTracker("create", "WT-NMKNQSAJ");
        window.widgetTracker("send", "pageview");
      `}</Script>
    </html>
  )
}
