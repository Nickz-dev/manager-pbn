import React from 'react'
import BlogLayout from '../layout'
import ArticleCard from '../components/ArticleCard'

interface Article {
  id: string
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  readTime?: string
  category?: string
  image?: string
}

interface HomePageProps {
  siteName: string
  domain: string
  siteDescription: string
  featuredArticles: Article[]
  recentArticles: Article[]
  categories: string[]
  theme?: 'light' | 'dark' | 'blue' | 'green'
}

export default function HomePage({
  siteName,
  domain,
  siteDescription,
  featuredArticles = [],
  recentArticles = [],
  categories = [],
  theme = 'light'
}: HomePageProps) {
  return (
    <BlogLayout
      title="Home"
      description={siteDescription}
      keywords={categories.join(', ')}
      domain={domain}
      siteName={siteName}
      theme={theme}
    >
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 -mx-4 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to {siteName}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {siteDescription}
          </p>
          <a 
            href="/articles"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Explore Articles
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                domain={domain}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <a
                key={category}
                href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="block p-4 bg-white rounded-lg border border-gray-200 text-center hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="font-medium text-gray-900">{category}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Articles</h2>
            <a 
              href="/articles"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all articles →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.slice(0, 6).map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                domain={domain}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="bg-gray-50 -mx-4 p-8 rounded-lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Get the latest articles and insights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </BlogLayout>
  )
} 