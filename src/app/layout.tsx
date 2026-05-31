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
        <Script id="ylopo-config" strategy="beforeInteractive">
          {`var YLOPO_WIDGETS = { domain: 'search.doyouneedahome.com' };`}
        </Script>
        <Script src="//search.doyouneedahome.com/build/js/widgets-1.0.0.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
