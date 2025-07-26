'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import axios from 'axios'

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Author {
  id: string
  name: string
  email: string
  specialization: string
}

interface PbnSite {
  id: string
  name: string
  url: string
  status: string
}

interface Article {
  id: string
  documentId: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  meta_title: string
  meta_description: string
  statusarticles: string
  published: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  content_categories: Category[]
  content_author: Author | null
  pbn_site: PbnSite | null
}

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [pbnSites, setPbnSites] = useState<PbnSite[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Форма редактирования
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
  }, [slug])

  async function fetchData() {
    try {
      setLoading(true)
      
      // Получаем все данные параллельно
      const [articleRes, categoriesRes, authorsRes, sitesRes] = await Promise.all([
        axios.get(`/api/content/articles/${slug}`),
        axios.get('/api/content/categories'),
        axios.get('/api/content/authors'),
        axios.get('/api/sites')
      ])

      const articleData = articleRes.data.article
      if (!articleData) {
        router.push('/content')
        return
      }

      setArticle(articleData)
      setCategories(categoriesRes.data.categories || [])
      setAuthors(authorsRes.data.authors || [])
      setPbnSites(sitesRes.data.sites || [])

      // Заполняем форму данными статьи
      setFormData({
        title: articleData.title || '',
        slug: articleData.slug || '',
        content: articleData.content || '',
        excerpt: articleData.excerpt || '',
        featured_image: articleData.featured_image || '',
        meta_title: articleData.meta_title || '',
        meta_description: articleData.meta_description || '',
        statusarticles: articleData.statusarticles || 'draft',
        content_categories: articleData.content_categories?.map((cat: Category) => cat.id) || [],
        content_author: articleData.content_author?.id || '',
        pbn_site: articleData.pbn_site?.id || ''
      })
    } catch (error: any) {
      console.error('Error fetching data:', error)
      if (error.response?.status === 404) {
        router.push('/content')
      }
    } finally {
      setLoading(false)
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

  async function handleSave() {
    if (!article) return

    setSaving(true)
    try {
      const payload = {
        ...formData,
        content_categories: formData.content_categories.length > 0 ? 
          formData.content_categories.map(id => ({ id })) : 
          null,
        content_author: formData.content_author ? 
          { id: formData.content_author } : 
          null,
        pbn_site: formData.pbn_site ? 
          { id: formData.pbn_site } : 
          null
      }

      await axios.put(`/api/content/articles/${article.documentId}`, { data: payload })
      
      // Обновляем данные статьи
      await fetchData()
      setIsEditing(false)
    } catch (error: any) {
      alert('Ошибка сохранения: ' + (error.response?.data?.error || error.message))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!article) return

    setSaving(true)
    try {
      await axios.delete(`/api/content/articles/${article.documentId}`)
      router.push('/content')
    } catch (error: any) {
      alert('Ошибка удаления: ' + (error.response?.data?.error || error.message))
      setSaving(false)
    }
  }

  function getStatusBadge(status: string) {
    const statusConfig = {
      draft: { label: '📝 Черновик', color: 'bg-gray-100 text-gray-800' },
      published: { label: '✅ Опубликовано', color: 'bg-green-100 text-green-800' },
      archived: { label: '📦 Архив', color: 'bg-yellow-100 text-yellow-800' },
      ai: { label: '🤖 AI генерация', color: 'bg-purple-100 text-purple-800' },
      processing: { label: '⚙️ В обработке', color: 'bg-blue-100 text-blue-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка статьи...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h2>
          <Link href="/content" className="btn-primary">← Вернуться к контенту</Link>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Контент</h1>
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
          title={isEditing ? 'Редактирование статьи' : article.title}
          description={isEditing ? 'Внесите изменения в статью' : 'Просмотр и редактирование статьи'}
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Контент', href: '/content' },
            { label: isEditing ? 'Редактирование' : article.title }
          ]}
          actions={
            <div className="flex space-x-3">
              <Link href="/content" className="btn-secondary">← Назад к контенту</Link>
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    ✏️ Редактировать
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-danger"
                  >
                    🗑️ Удалить
                  </button>
                </>
              )}
            </div>
          }
        />

        {/* Article Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="card">
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
                    />
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
                    />
                  </div>

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
                    />
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
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.title.trim() || !formData.content.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? '⏳ Сохранение...' : '💾 Сохранить изменения'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                  
                  {article.excerpt && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-gray-700 italic">{article.excerpt}</p>
                    </div>
                  )}

                  {article.featured_image && (
                    <div className="mb-6">
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div 
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о статье</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Статус:</span>
                  <div className="mt-1">{getStatusBadge(article.statusarticles)}</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Автор:</span>
                  <div className="mt-1 font-medium">
                    {article.content_author ? (
                      <div className="flex items-center space-x-2">
                        <span>{article.content_author.name}</span>
                        <span className="text-xs text-gray-500">({article.content_author.specialization})</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Не указан</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">PBN сайт:</span>
                  <div className="mt-1 font-medium">
                    {article.pbn_site ? (
                      <div>
                        <div>{article.pbn_site.name}</div>
                        <div className="text-xs text-gray-500">{article.pbn_site.url}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Не привязан</span>
                    )}
                  </div>
                </div>

                {article.content_categories && article.content_categories.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Категории:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {article.content_categories.map(cat => (
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

                <div>
                  <span className="text-sm font-medium text-gray-500">Создано:</span>
                  <div className="mt-1 text-sm text-gray-600">
                    {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Обновлено:</span>
                  <div className="mt-1 text-sm text-gray-600">
                    {new Date(article.updatedAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings (when editing) */}
            {isEditing && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки публикации</h3>
                
                <div className="space-y-4">
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Подтверждение удаления</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить статью "{article.title}"? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="btn-danger disabled:opacity-50"
              >
                {saving ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 