'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'

interface GenerateSiteForm {
  type: 'pbn-blog' | 'pbn-news' | 'casino-premium'
  domain: string
  siteName: string
  description: string
  keywords: string[]
  theme: string
  generateArticles: boolean
  articlesCount: number
  articleTopics: string[]
  targetCategories: string[]
  targetAuthor: string
  targetPbnSite: string
}

export default function GenerateSitePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState<GenerateSiteForm>({
    type: 'pbn-blog',
    domain: '',
    siteName: '',
    description: '',
    keywords: [],
    theme: 'light',
    generateArticles: true,
    articlesCount: 5,
    articleTopics: [],
    targetCategories: [],
    targetAuthor: '',
    targetPbnSite: ''
  })

  const [keywordsInput, setKeywordsInput] = useState('')
  const [topicsInput, setTopicsInput] = useState('')
  const [categoriesInput, setCategoriesInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setProgress(0)

    try {
      // Подготавливаем данные для отправки
      const payload = {
        ...formData,
        keywords: formData.keywords,
        articleTopics: formData.articleTopics,
        targetCategories: formData.targetCategories
      }

      setProgress(20)

      const response = await fetch('/api/sites/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      setProgress(60)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate site')
      }

      const result = await response.json()
      setProgress(100)

      // Перенаправляем на страницу сайтов
      setTimeout(() => {
        router.push('/sites')
      }, 1000)

    } catch (error) {
      console.error('Error generating site:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value)
    const keywords = value.split(',').map(k => k.trim()).filter(k => k)
    setFormData(prev => ({ ...prev, keywords }))
  }

  const handleTopicsChange = (value: string) => {
    setTopicsInput(value)
    const topics = value.split(',').map(t => t.trim()).filter(t => t)
    setFormData(prev => ({ ...prev, articleTopics: topics }))
  }

  const handleCategoriesChange = (value: string) => {
    setCategoriesInput(value)
    const categories = value.split(',').map(c => c.trim()).filter(c => c)
    setFormData(prev => ({ ...prev, targetCategories: categories }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Generate New Site" 
        subtitle="Create a new site with AI-generated content"
        breadcrumbs={[
          { name: 'Sites', href: '/sites' },
          { name: 'Generate', href: '/sites/generate' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Configuration</h2>

            {isGenerating && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-800 font-medium">Generating site...</span>
                  <span className="text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Site Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  >
                    <option value="pbn-blog">PBN Blog</option>
                    <option value="pbn-news">PBN News</option>
                    <option value="casino-premium">Casino Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                  placeholder="My Awesome Site"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your site..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                />
              </div>

              {/* AI Article Generation */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Article Generation</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="generateArticles"
                      checked={formData.generateArticles}
                      onChange={(e) => setFormData(prev => ({ ...prev, generateArticles: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isGenerating}
                    />
                    <label htmlFor="generateArticles" className="ml-2 text-sm text-gray-700">
                      Generate articles automatically
                    </label>
                  </div>

                  {formData.generateArticles && (
                    <div className="space-y-4 pl-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Articles
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.articlesCount}
                          onChange={(e) => setFormData(prev => ({ ...prev, articlesCount: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isGenerating}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Article Topics (comma-separated, optional)
                        </label>
                        <input
                          type="text"
                          value={topicsInput}
                          onChange={(e) => handleTopicsChange(e.target.value)}
                          placeholder="cryptocurrency, blockchain, trading"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isGenerating}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to use default topics
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Categories (comma-separated IDs, optional)
                        </label>
                        <input
                          type="text"
                          value={categoriesInput}
                          onChange={(e) => handleCategoriesChange(e.target.value)}
                          placeholder="1, 2, 3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isGenerating}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Category IDs to assign articles to
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Author ID (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.targetAuthor}
                          onChange={(e) => setFormData(prev => ({ ...prev, targetAuthor: e.target.value }))}
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isGenerating}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target PBN Site ID (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.targetPbnSite}
                          onChange={(e) => setFormData(prev => ({ ...prev, targetPbnSite: e.target.value }))}
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => router.push('/sites')}
                  className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 