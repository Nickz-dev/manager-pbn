import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface CasinoLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string
  domain: string
  siteName: string
  casinoData?: {
    welcomeBonus?: string
    freeSpins?: number
    minDeposit?: string
    currency?: string
    license?: string
    rating?: number
  }
  geoLocation?: {
    country: string
    isRestricted: boolean
    localCurrency: string
  }
}

export default function CasinoLayout({ 
  children, 
  title = '',
  description = '',
  keywords = '',
  domain,
  siteName,
  casinoData = {},
  geoLocation
}: CasinoLayoutProps) {
  const router = useRouter()
  const fullTitle = title ? `${title} - ${siteName}` : `${siteName} - Premium Online Casino`
  
  const {
    welcomeBonus = '100% up to $1000',
    freeSpins = 50,
    minDeposit = '$20',
    currency = 'USD',
    license = 'Curacao Gaming License',
    rating = 4.8
  } = casinoData

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://${domain}${router.asPath}`} />
        
        {/* Casino specific meta tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`https://${domain}/casino-preview.jpg`} />
        
        {/* Rich snippets for casino */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": siteName,
              "url": `https://${domain}`,
              "logo": `https://${domain}/logo.png`,
              "description": description,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": rating,
                "reviewCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              },
              "offers": {
                "@type": "Offer",
                "description": `Welcome bonus: ${welcomeBonus} + ${freeSpins} Free Spins`,
                "priceCurrency": currency
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Geo-restriction Notice */}
        {geoLocation?.isRestricted && (
          <div className="bg-yellow-600 text-white py-3 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="font-medium">
                ⚠️ This casino may not be available in {geoLocation.country}. Please check local regulations.
              </p>
            </div>
          </div>
        )}

        {/* Promotion Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <span className="font-bold text-sm md:text-base">
              🎰 {welcomeBonus} + {freeSpins} FREE SPINS! 🎰
            </span>
          </div>
        </div>

        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  🎲 {siteName}
                </h1>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-400'}>★</span>
                    ))}
                  </div>
                  <span className="text-white text-sm">({rating}/5)</span>
                </div>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-white hover:text-yellow-400 transition-colors">Home</a>
                <a href="/games" className="text-white hover:text-yellow-400 transition-colors">Games</a>
                <a href="/promotions" className="text-white hover:text-yellow-400 transition-colors">Promotions</a>
                <a href="/vip" className="text-white hover:text-yellow-400 transition-colors">VIP Club</a>
                <a href="/support" className="text-white hover:text-yellow-400 transition-colors">Support</a>
              </nav>

              <div className="flex items-center space-x-3">
                <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Login
                </button>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition-all">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Live Chat Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <footer className="bg-black/80 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">{siteName}</h3>
                <p className="text-gray-300 text-sm mb-4">{description}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-green-600 text-white px-2 py-1 rounded">✓</span>
                  <span>{license}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Games</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="/slots" className="hover:text-white">Slots</a></li>
                  <li><a href="/blackjack" className="hover:text-white">Blackjack</a></li>
                  <li><a href="/roulette" className="hover:text-white">Roulette</a></li>
                  <li><a href="/live-casino" className="hover:text-white">Live Casino</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="/help" className="hover:text-white">Help Center</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                  <li><a href="/responsible-gaming" className="hover:text-white">Responsible Gaming</a></li>
                  <li><a href="/banking" className="hover:text-white">Banking</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
                  <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="/bonus-terms" className="hover:text-white">Bonus Terms</a></li>
                </ul>
              </div>
            </div>
            
            {/* Responsible Gaming */}
            <div className="border-t border-gray-700 mt-8 pt-8">
              <div className="flex flex-wrap items-center justify-center space-x-6 text-xs text-gray-400">
                <span>18+ Only</span>
                <span>|</span>
                <span>Gamble Responsibly</span>
                <span>|</span>
                <span>BeGambleAware.org</span>
                <span>|</span>
                <span>© {new Date().getFullYear()} {siteName}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 