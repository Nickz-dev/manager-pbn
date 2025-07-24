'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  siteId: string
  title: string
  excerpt: string
  slug: string
  status: 'draft' | 'published' | 'scheduled'
  category: string
  tags: string[]
  featuredImage?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  author: string
  readTime?: string
  aiGenerated: boolean
}

interface Site {
  id: string
  domain: string
  siteName: string
  type: string
}

const ContentManagePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSite, setSelectedSite] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch sites and articles in parallel
      const [sitesResponse, articlesResponse] = await Promise.all([
        fetch('/api/sites/generate'),
        fetch('/api/content/articles')
      ])

      const sitesResult = await sitesResponse.json()
      const articlesResult = await articlesResponse.json()

      if (sitesResponse.ok) {
        setSites(sitesResult.sites || [])
      }

      if (articlesResponse.ok) {
        setArticles(articlesResult.articles || [])
      } else {
        throw new Error(articlesResult.error || 'Failed to fetch articles')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (articleId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/content/articles/${articleId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        alert(`✅ Article "${title}" deleted successfully!`)
        fetchData() // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to delete article')
      }
    } catch (err) {
      alert(`❌ Error deleting article: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const updateArticleStatus = async (articleId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/content/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (response.ok) {
        fetchData() // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to update article status')
      }
    } catch (err) {
      alert(`❌ Error updating status: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const filteredArticles = articles.filter(article => {
    const siteMatch = selectedSite === 'all' || article.siteId === selectedSite
    const statusMatch = selectedStatus === 'all' || article.status === selectedStatus
    return siteMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSiteName = (siteId: string) => {
    const site = sites.find(s => s.id === siteId)
    return site ? site.siteName : 'Unknown Site'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">Manage articles across all your sites</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Refresh
            </button>
            <Link
              href="/content/new"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ New Article
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sites</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.siteName} ({site.domain})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing {filteredArticles.length} of {articles.length} articles
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Articles</h3>
            <p className="text-3xl font-bold text-blue-600">{articles.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-600">
              {articles.filter(a => a.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {articles.filter(a => a.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Generated</h3>
            <p className="text-3xl font-bold text-purple-600">
              {articles.filter(a => a.aiGenerated).length}
            </p>
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {articles.length === 0 ? 'No articles yet' : 'No articles match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {articles.length === 0 
                ? 'Create your first article to get started' 
                : 'Try adjusting your filters or create a new article'
              }
            </p>
            <Link
              href="/content/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Create New Article
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">{article.title}</div>
                          <div className="text-sm text-gray-500 truncate">{article.excerpt}</div>
                          <div className="flex items-center mt-1">
                            {article.aiGenerated && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                                🤖 AI
                              </span>
                            )}
                            {article.readTime && (
                              <span className="text-xs text-gray-500">{article.readTime}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getSiteName(article.siteId)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={article.status}
                          onChange={(e) => updateArticleStatus(article.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(article.status)}`}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="scheduled">Scheduled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{article.category}</span>
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{article.tags.length - 2} more</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/content/edit/${article.id}`}
                            className="text-blue-600 hover:text-blue-900 text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteArticle(article.id, article.title)}
                            className="text-red-600 hover:text-red-900 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentManagePage 