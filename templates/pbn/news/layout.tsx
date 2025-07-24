import React from 'react'
import Head from 'next/head'

interface NewsLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string
  domain: string
  siteName: string
  breaking?: boolean
}

export default function NewsLayout({ 
  children, 
  title = '',
  description = '',
  keywords = '',
  domain,
  siteName,
  breaking = false
}: NewsLayoutProps) {
  const fullTitle = title ? `${title} - ${siteName}` : siteName
  
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://${domain}`} />
        
        {/* News specific meta tags */}
        <meta property="article:publisher" content={siteName} />
        <meta property="og:type" content="article" />
        <meta name="news_keywords" content={keywords} />
        
        {/* Schema.org for News */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": siteName,
              "url": `https://${domain}`,
              "logo": `https://${domain}/logo.png`,
              "description": description
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Breaking News Bar */}
        {breaking && (
          <div className="bg-red-600 text-white py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center">
              <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold mr-3">
                BREAKING
              </span>
                             <div className="flex-1 overflow-hidden">
                 <div className="animate-pulse">
                   Latest breaking news updates - Stay informed with {siteName}
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center py-2 text-sm border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/subscribe" className="text-blue-600 hover:text-blue-700">Subscribe</a>
                <a href="/newsletter" className="text-blue-600 hover:text-blue-700">Newsletter</a>
              </div>
            </div>

            {/* Main Header */}
            <div className="py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  {siteName}
                </h1>
                <nav>
                  <ul className="flex space-x-8">
                    <li><a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a></li>
                    <li><a href="/politics" className="text-gray-700 hover:text-blue-600 font-medium">Politics</a></li>
                    <li><a href="/business" className="text-gray-700 hover:text-blue-600 font-medium">Business</a></li>
                    <li><a href="/technology" className="text-gray-700 hover:text-blue-600 font-medium">Technology</a></li>
                    <li><a href="/sports" className="text-gray-700 hover:text-blue-600 font-medium">Sports</a></li>
                    <li><a href="/world" className="text-gray-700 hover:text-blue-600 font-medium">World</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">{siteName}</h3>
                <p className="text-gray-300 mb-4">{description}</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                  <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                  <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/politics" className="hover:text-white">Politics</a></li>
                  <li><a href="/business" className="hover:text-white">Business</a></li>
                  <li><a href="/technology" className="hover:text-white">Technology</a></li>
                  <li><a href="/sports" className="hover:text-white">Sports</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 