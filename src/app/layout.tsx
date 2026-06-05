import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
  metadataBase: new URL('https://www.doyouneedahome.com'),
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
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
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
    </html>
  )
}
