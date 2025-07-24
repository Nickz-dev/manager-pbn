import React from 'react'
import Head from 'next/head'

interface BlogLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string
  domain: string
  siteName: string
  theme?: 'light' | 'dark' | 'blue' | 'green'
}

export default function BlogLayout({ 
  children, 
  title = '',
  description = '',
  keywords = '',
  domain,
  siteName,
  theme = 'light'
}: BlogLayoutProps) {
  const fullTitle = title ? `${title} - ${siteName}` : siteName
  
  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    blue: 'bg-blue-50 text-blue-900',
    green: 'bg-green-50 text-green-900'
  }

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://${domain}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${domain}`} />
        
        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": siteName,
              "url": `https://${domain}`,
              "description": description
            })
          }}
        />
      </Head>

      <div className={`min-h-screen ${themeClasses[theme]}`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {siteName}
              </h1>
              <nav>
                <ul className="flex space-x-6">
                  <li><a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a></li>
                  <li><a href="/articles" className="text-gray-600 hover:text-gray-900 transition-colors">Articles</a></li>
                  <li><a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
                  <li><a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">{siteName}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
                  <li><a href="/sitemap" className="text-gray-600 hover:text-gray-900">Sitemap</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                <p className="text-gray-600 text-sm">
                  For inquiries: info@{domain}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 