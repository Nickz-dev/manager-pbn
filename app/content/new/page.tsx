'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import axios from 'axios'

interface Category {
  id: string
  name: string
  color: string
  description: string
}

interface Author {
  id: string
  name: string
  email: string
  specialization: string
  avatar?: string
}

interface PbnSite {
  id: string
  name: string
  url: string
  status: string
}

export default function NewArticlePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [pbnSites, setPbnSites] = useState<PbnSite[]>([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    statusarticles: 'draft',
    content_categories: [] as string[],
    content_author: '',
    pbn_site: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [catRes, authRes, sitesRes] = await Promise.all([
        axios.get('/api/content/categories'),
        axios.get('/api/content/authors'),
        axios.get('/api/sites')
      ])
      
      setCategories(catRes.data.categories || [])
      setAuthors(authRes.data.authors || [])
      setPbnSites(sitesRes.data.sites || [])
    } catch (e) {
      console.error('Error fetching data:', e)
    }
  }

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: slugify(title),
      meta_title: title.length > 0 ? title : ''
    }))
  }

  function handleExcerptChange(excerpt: string) {
    setFormData(prev => ({
      ...prev,
      excerpt,
      meta_description: excerpt.length > 0 ? excerpt : ''
    }))
  }

  function nextStep() {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) return

    setLoading(true)
    try {
      const payload = {
        ...formData,
        content_categories: formData.content_categories.length > 0 ? 
          formData.content_categories : 
          null,
        content_author: formData.content_author || null,
        pbn_site: formData.pbn_site || null
      }
      
      await axios.post('/api/content/articles', { data: payload })
      router.push('/content')
    } catch (e: any) {
      alert('Ошибка создания статьи: ' + (e.response?.data?.error || e.message))
    } finally {
      setLoading(false)
    }
  }

  const selectedAuthor = authors.find(a => a.id === formData.content_author)
  const selectedSite = pbnSites.find(s => s.id === formData.pbn_site)
  const selectedCategories = categories.filter(c => formData.content_categories.includes(c.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">PBN Контент</h1>
            </div>
            <nav className="flex space-x-1">
              <Link href="/sites" className="nav-link">Сайты</Link>
              <Link href="/infrastructure" className="nav-link">Инфраструктура</Link>
              <Link href="/content" className="nav-link-active">Контент</Link>
              <Link href="/monitoring" className="nav-link">Мониторинг</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Новая статья"
          description="Создание новой статьи с пошаговым процессом"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Контент', href: '/content' },
            { label: 'Новая статья' }
          ]}
          actions={
            <Link href="/content" className="btn-secondary">← Назад к контенту</Link>
          }
        />

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Основная информация' : step === 2 ? 'Содержание' : 'Настройки'}
                </span>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Основная информация</h2>
                <p className="text-gray-600">Заполните основные данные статьи</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок статьи *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    value={formData.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="Введите привлекательный заголовок статьи..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL slug
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">Автоматически генерируется из заголовка</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Краткое описание
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={formData.excerpt}
                    onChange={e => handleExcerptChange(e.target.value)}
                    placeholder="Краткое описание статьи для превью..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изображение статьи
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.featured_image}
                    onChange={e => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.featured_image && (
                    <div className="mt-2">
                      <img 
                        src={formData.featured_image} 
                        alt="Preview" 
                        className="w-32 h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.title.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Далее →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Содержание статьи</h2>
                <p className="text-gray-600">Напишите основное содержание статьи</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Содержание статьи *
                  </label>
                  <textarea
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={15}
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Напишите основное содержание статьи. Поддерживается HTML разметка..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Поддерживается HTML разметка. Например: &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.meta_title}
                      onChange={e => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="SEO заголовок для поисковых систем"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={formData.meta_description}
                      onChange={e => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="SEO описание для поисковых систем"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  ← Назад
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.content.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Далее →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Настройки публикации</h2>
                <p className="text-gray-600">Настройте статус, категории и связи</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Статус публикации
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.statusarticles}
                      onChange={e => setFormData(prev => ({ ...prev, statusarticles: e.target.value }))}
                    >
                      <option value="draft">📝 Черновик</option>
                      <option value="published">✅ Опубликовано</option>
                      <option value="archived">📦 Архив</option>
                      <option value="ai">🤖 AI генерация</option>
                      <option value="processing">⚙️ В обработке</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Автор статьи
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.content_author}
                      onChange={e => setFormData(prev => ({ ...prev, content_author: e.target.value }))}
                    >
                      <option value="">👤 Без автора</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>
                          {author.name} ({author.specialization})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PBN сайт
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.pbn_site}
                      onChange={e => setFormData(prev => ({ ...prev, pbn_site: e.target.value }))}
                    >
                      <option value="">🌐 Без привязки</option>
                      {pbnSites.map(site => (
                        <option key={site.id} value={site.id}>
                          {site.name} ({site.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категории
                    </label>
                    <select
                      multiple
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.content_categories}
                      onChange={e => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value)
                        setFormData(prev => ({ ...prev, content_categories: selected }))
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Удерживайте Ctrl (Cmd на Mac) для выбора нескольких категорий
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Предварительный просмотр</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Заголовок:</span>
                      <div className="mt-1 font-semibold">{formData.title || 'Не указан'}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Описание:</span>
                      <div className="mt-1 text-sm">{formData.excerpt || 'Не указано'}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Статус:</span>
                        <div className="mt-1 font-medium">{formData.statusarticles}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Автор:</span>
                        <div className="mt-1 font-medium">{selectedAuthor?.name || 'Не указан'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">PBN сайт:</span>
                        <div className="mt-1 font-medium">{selectedSite?.name || 'Не привязан'}</div>
                      </div>
                    </div>
                    {selectedCategories.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Категории:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {selectedCategories.map(cat => (
                            <span 
                              key={cat.id} 
                              className="px-2 py-1 text-xs rounded-full"
                              style={{ backgroundColor: cat.color + '20', color: cat.color }}
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  ← Назад
                </button>
                <div className="flex space-x-3">
                  <Link href="/content" className="btn-secondary">
                    Отмена
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Создание...' : '🚀 Создать статью'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  )
} 