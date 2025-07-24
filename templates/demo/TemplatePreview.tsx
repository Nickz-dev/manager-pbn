import React, { useState } from 'react'
import TemplateLoader, { SiteData, TemplateType } from '../TemplateLoader'

const SAMPLE_TEMPLATES: Record<TemplateType, SiteData> = {
  'pbn-blog': {
    type: 'pbn-blog',
    domain: 'sample-blog.com',
    siteName: 'Tech Insights Blog',
    description: 'Latest insights and articles about technology, programming, and digital trends.',
    keywords: ['technology', 'programming', 'web development', 'AI', 'blockchain'],
    theme: 'light',
    content: {
      featured: [
        {
          id: '1',
          title: 'The Future of Web Development in 2024',
          excerpt: 'Explore the latest trends and technologies shaping the future of web development.',
          slug: 'future-web-development-2024',
          publishedAt: '2024-01-15',
          readTime: '8 min read',
          category: 'Technology',
          image: 'https://via.placeholder.com/600x300?text=Web+Development'
        },
        {
          id: '2',
          title: 'AI and Machine Learning Trends',
          excerpt: 'How artificial intelligence is transforming various industries.',
          slug: 'ai-machine-learning-trends',
          publishedAt: '2024-01-12',
          readTime: '6 min read',
          category: 'AI',
          image: 'https://via.placeholder.com/600x300?text=AI+Trends'
        }
      ],
      recent: [
        {
          id: '3',
          title: 'Getting Started with Next.js 14',
          excerpt: 'A comprehensive guide to building modern web applications.',
          slug: 'nextjs-14-guide',
          publishedAt: '2024-01-10',
          readTime: '12 min read',
          category: 'Framework'
        }
      ],
      categories: ['Technology', 'Programming', 'AI', 'Blockchain', 'Web Development']
    }
  },
  'pbn-news': {
    type: 'pbn-news',
    domain: 'daily-tech-news.com',
    siteName: 'Daily Tech News',
    description: 'Breaking news and updates from the world of technology.',
    keywords: ['tech news', 'breaking news', 'technology updates'],
    content: {
      hasBreaking: true
    }
  },
  'pbn-review': {
    type: 'pbn-review',
    domain: 'product-reviews.com',
    siteName: 'Product Reviews Hub',
    description: 'Honest reviews and comparisons of the latest products.',
    keywords: ['product reviews', 'comparisons', 'buying guide'],
    theme: 'blue'
  },
  'casino-premium': {
    type: 'casino-premium',
    domain: 'royal-casino.com',
    siteName: 'Royal Casino',
    description: 'Premium online casino with the best games and bonuses.',
    keywords: ['casino', 'slots', 'poker', 'blackjack', 'roulette'],
    content: {
      casino: {
        welcomeBonus: '200% up to $2000',
        freeSpins: 100,
        minDeposit: '$10',
        currency: 'USD',
        license: 'Malta Gaming Authority',
        rating: 4.9
      },
      geo: {
        country: 'United States',
        isRestricted: false,
        localCurrency: 'USD'
      }
    }
  },
  'casino-standard': {
    type: 'casino-standard',
    domain: 'lucky-slots.com',
    siteName: 'Lucky Slots Casino',
    description: 'Play the best slot games with amazing bonuses.',
    keywords: ['slots', 'casino games', 'bonuses'],
    content: {
      casino: {
        welcomeBonus: '100% up to $500',
        freeSpins: 50,
        minDeposit: '$20',
        currency: 'USD',
        license: 'Curacao Gaming License',
        rating: 4.5
      }
    }
  },
  'brand-landing': {
    type: 'brand-landing',
    domain: 'crypto-casino-brand.com',
    siteName: 'CryptoCasino Pro',
    description: 'The ultimate cryptocurrency casino experience.',
    keywords: ['crypto casino', 'bitcoin', 'blockchain gambling'],
    theme: 'dark'
  }
}

const TemplatePreview: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('pbn-blog')
  const [isFramed, setIsFramed] = useState(true)

  const templateData = SAMPLE_TEMPLATES[selectedTemplate]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Template Preview</h1>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isFramed}
                  onChange={(e) => setIsFramed(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Frame View</span>
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pbn-blog">PBN Blog</option>
                <option value="pbn-news">PBN News</option>
                <option value="pbn-review">PBN Review</option>
                <option value="casino-premium">Casino Premium</option>
                <option value="casino-standard">Casino Standard</option>
                <option value="brand-landing">Brand Landing</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Template Details */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Template Info</h3>
              <p className="text-sm text-gray-600 mb-1"><strong>Type:</strong> {templateData.type}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Domain:</strong> {templateData.domain}</p>
              <p className="text-sm text-gray-600"><strong>Theme:</strong> {templateData.theme || 'default'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Site Details</h3>
              <p className="text-sm text-gray-600 mb-1"><strong>Name:</strong> {templateData.siteName}</p>
              <p className="text-sm text-gray-600">{templateData.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-1">
                {templateData.keywords.slice(0, 5).map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isFramed ? (
            <div className="border-8 border-gray-300 rounded-lg">
              <div className="bg-gray-200 px-4 py-2 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                  https://{templateData.domain}
                </div>
              </div>
              <div className="h-[800px] overflow-auto">
                <TemplateLoader siteData={templateData} pageType="home" />
              </div>
            </div>
          ) : (
            <div className="w-full">
              <TemplateLoader siteData={templateData} pageType="home" />
            </div>
          )}
        </div>
      </div>

      {/* Template Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(SAMPLE_TEMPLATES).map(([type, data]) => (
            <div
              key={type}
              className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all ${
                selectedTemplate === type ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedTemplate(type as TemplateType)}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Preview</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{data.siteName}</h3>
                <p className="text-sm text-gray-600 mb-2">{data.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {type}
                  </span>
                  <span className="text-xs text-gray-500">{data.domain}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TemplatePreview 