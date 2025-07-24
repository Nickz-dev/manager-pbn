import React, { Suspense, lazy } from 'react'

// Lazy load templates
const BlogLayout = lazy(() => import('./pbn/blog/layout'))
const BlogHomePage = lazy(() => import('./pbn/blog/pages/home'))
const NewsLayout = lazy(() => import('./pbn/news/layout'))
const CasinoLayout = lazy(() => import('./casino/premium/layout'))

// Template types from Strapi
export type TemplateType = 
  | 'pbn-blog'
  | 'pbn-news' 
  | 'pbn-review'
  | 'casino-premium'
  | 'casino-standard'
  | 'brand-landing'

export type SiteData = {
  type: TemplateType
  domain: string
  siteName: string
  description: string
  keywords: string[]
  theme?: string
  content?: any
  settings?: {
    seo?: any
    analytics?: any
    customCss?: string
  }
}

interface TemplateLoaderProps {
  siteData: SiteData
  pageType?: 'home' | 'article' | 'category' | 'about' | 'contact'
  children?: React.ReactNode
}

// Loading component
const TemplateLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading site template...</p>
    </div>
  </div>
)

// Error boundary for template loading
class TemplateErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Template Error</h2>
            <p className="text-gray-600 mb-6">Failed to load site template.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function TemplateLoader({ 
  siteData, 
  pageType = 'home',
  children 
}: TemplateLoaderProps) {
  const { type, domain, siteName, description, keywords, theme, content, settings } = siteData

  // Convert keywords array to string
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords || ''

  const renderTemplate = () => {
    switch (type) {
      case 'pbn-blog':
        if (pageType === 'home') {
          return (
            <BlogHomePage
              siteName={siteName}
              domain={domain}
              siteDescription={description}
              featuredArticles={content?.featured || []}
              recentArticles={content?.recent || []}
              categories={content?.categories || []}
              theme={theme as any}
            />
          )
        }
        return (
          <BlogLayout
            title=""
            description={description}
            keywords={keywordsString}
            domain={domain}
            siteName={siteName}
            theme={theme as any}
          >
            {children}
          </BlogLayout>
        )

      case 'pbn-news':
        return (
          <NewsLayout
            title=""
            description={description}
            keywords={keywordsString}
            domain={domain}
            siteName={siteName}
            breaking={content?.hasBreaking || false}
          >
            {children}
          </NewsLayout>
        )

      case 'casino-premium':
        return (
          <CasinoLayout
            title=""
            description={description}
            keywords={keywordsString}
            domain={domain}
            siteName={siteName}
            casinoData={content?.casino || {}}
            geoLocation={content?.geo || undefined}
          >
            {children}
          </CasinoLayout>
        )

      case 'pbn-review':
        // Fallback to blog layout for now
        return (
          <BlogLayout
            title=""
            description={description}
            keywords={keywordsString}
            domain={domain}
            siteName={siteName}
            theme="blue"
          >
            {children}
          </BlogLayout>
        )

      default:
        // Default template
        return (
          <div className="min-h-screen bg-white">
            <header className="bg-gray-900 text-white py-4">
              <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold">{siteName}</h1>
              </div>
            </header>
            <main className="max-w-4xl mx-auto px-4 py-8">
              {children || (
                <div>
                  <h2 className="text-3xl font-bold mb-4">Welcome to {siteName}</h2>
                  <p className="text-gray-600">{description}</p>
                </div>
              )}
            </main>
          </div>
        )
    }
  }

  return (
    <TemplateErrorBoundary>
      <Suspense fallback={<TemplateLoading />}>
        {/* Custom CSS injection */}
        {settings?.customCss && (
          <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
        )}
        
        {/* Analytics scripts */}
        {settings?.analytics?.googleAnalytics && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.analytics.googleAnalytics}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.analytics.googleAnalytics}');
                `
              }}
            />
          </>
        )}
        
        {renderTemplate()}
      </Suspense>
    </TemplateErrorBoundary>
  )
}

// Hook for getting site data from Strapi
export const useSiteData = (domain: string): SiteData | null => {
  // This would fetch from your Strapi API
  // For now, return mock data
  return {
    type: 'pbn-blog',
    domain,
    siteName: 'Sample Blog',
    description: 'A sample blog site',
    keywords: ['blog', 'articles', 'news'],
    theme: 'light',
    content: {
      featured: [],
      recent: [],
      categories: ['Technology', 'Business', 'Lifestyle']
    }
  }
}

// Utility function to get template by type
export const getTemplateComponent = (type: TemplateType) => {
  const templates = {
    'pbn-blog': BlogLayout,
    'pbn-news': NewsLayout,
    'casino-premium': CasinoLayout,
    'pbn-review': BlogLayout, // Fallback
    'casino-standard': CasinoLayout, // Fallback
    'brand-landing': BlogLayout // Fallback
  }
  
  return templates[type] || BlogLayout
} 