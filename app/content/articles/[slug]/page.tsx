'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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
      
      // Получаем статью
      const articleRes = await axios.get(`/api/content/articles/${slug}`)
      const articleData = articleRes.data.article
      setArticle(articleData)

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

      // Получаем справочные данные
      const [categoriesRes, authorsRes, sitesRes] = await Promise.all([
        axios.get('/api/content/categories'),
        axios.get('/api/content/authors'),
        axios.get('/api/sites')
      ])

      setCategories(categoriesRes.data.categories)
      setAuthors(authorsRes.data.authors)
      setPbnSites(sitesRes.data.sites)

    } catch (error: any) {
      console.error('Error fetching article:', error)
      if (error.response?.status === 404) {
        router.push('/content')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!article) return

    try {
      setSaving(true)

      // Подготавливаем данные для Strapi
      const strapiData = {
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

      await axios.put(`/api/content/articles/${article.documentId}`, { data: strapiData })
      
      // Обновляем данные
      await fetchData()
      setIsEditing(false)
      
    } catch (error: any) {
      alert('Ошибка сохранения: ' + (error.response?.data?.error || error.message))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!article || !confirm('Удалить статью?')) return

    try {
      await axios.delete(`/api/content/articles/${article.documentId}`)
      router.push('/content')
    } catch (error: any) {
      alert('Ошибка удаления: ' + (error.response?.data?.error || error.message))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
          <Link href="/content" className="btn-primary">← Вернуться к списку</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/content" className="text-blue-600 hover:underline mb-2 inline-block">
              ← Назад к списку статей
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Редактирование статьи' : article.title}
            </h1>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary"
                >
                  ✏️ Редактировать
                </button>
                <button 
                  onClick={handleDelete}
                  className="btn-danger"
                >
                  🗑️ Удалить
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className={`btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? '⏳ Сохранение...' : '💾 Сохранить'}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false)
                    fetchData() // Восстанавливаем исходные данные
                  }}
                  className="btn-secondary"
                >
                  ❌ Отмена
                </button>
              </>
            )}
          </div>
        </div>

        {/* Основной контент */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {isEditing ? (
            /* Форма редактирования */
            <div className="space-y-6">
              {/* Основные поля */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите заголовок статьи"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Краткое описание
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Краткое описание статьи"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Содержание
                </label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Содержание статьи"
                />
              </div>

              {/* Мета-поля */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={e => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Meta title для SEO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={e => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={e => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meta description для SEO"
                />
              </div>

              {/* Настройки */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус
                  </label>
                  <select
                    value={formData.statusarticles}
                    onChange={e => setFormData(prev => ({ ...prev, statusarticles: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликовано</option>
                    <option value="archived">Архив</option>
                    <option value="ai">AI генерация</option>
                    <option value="processing">В обработке</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категории
                  </label>
                  <select
                    multiple
                    value={formData.content_categories}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value)
                      setFormData(prev => ({ ...prev, content_categories: selected }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Автор
                  </label>
                  <select
                    value={formData.content_author}
                    onChange={e => setFormData(prev => ({ ...prev, content_author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Без автора</option>
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PBN сайт
                  </label>
                  <select
                    value={formData.pbn_site}
                    onChange={e => setFormData(prev => ({ ...prev, pbn_site: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Без привязки</option>
                    {pbnSites.map(site => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Просмотр статьи */
            <div className="space-y-6">
              {/* Заголовок и статус */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h2>
                  <p className="text-gray-600">{article.excerpt}</p>
                </div>
                <span 
                  className="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                  style={{
                    backgroundColor: 
                      article.statusarticles === 'published' ? '#DEF7EC' :
                      article.statusarticles === 'draft' ? '#FEF3C7' :
                      article.statusarticles === 'archived' ? '#F3F4F6' :
                      article.statusarticles === 'ai' ? '#F3E8FF' :
                      article.statusarticles === 'processing' ? '#FED7AA' :
                      '#F3F4F6',
                    color:
                      article.statusarticles === 'published' ? '#03543F' :
                      article.statusarticles === 'draft' ? '#92400E' :
                      article.statusarticles === 'archived' ? '#374151' :
                      article.statusarticles === 'ai' ? '#581C87' :
                      article.statusarticles === 'processing' ? '#C2410C' :
                      '#374151'
                  }}
                >
                  {article.statusarticles}
                </span>
              </div>

              {/* Мета-информация */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-500">Категории:</span>
                  <div className="mt-1">
                    {article.content_categories?.length > 0 ? (
                      article.content_categories.map(cat => (
                        <span key={cat.id} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mr-1 mb-1">
                          {cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Не указаны</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Автор:</span>
                  <div className="mt-1 text-sm">
                    {article.content_author ? article.content_author.name : 'Не указан'}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">PBN сайт:</span>
                  <div className="mt-1 text-sm">
                    {article.pbn_site ? article.pbn_site.name : 'Не привязан'}
                  </div>
                </div>
              </div>

              {/* Изображение */}
              {article.featured_image && (
                <div>
                  <img 
                    src={article.featured_image} 
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Содержание */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Содержание</h3>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* SEO информация */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">SEO информация</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Meta Title:</span>
                    <div className="mt-1 text-sm">{article.meta_title || 'Не указан'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Meta Description:</span>
                    <div className="mt-1 text-sm">{article.meta_description || 'Не указан'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Slug:</span>
                    <div className="mt-1 text-sm font-mono">{article.slug || 'Не указан'}</div>
                  </div>
                </div>
              </div>

              {/* Даты */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Создано:</span>
                    <div className="mt-1">{new Date(article.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Обновлено:</span>
                    <div className="mt-1">{new Date(article.updatedAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Опубликовано:</span>
                    <div className="mt-1">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Не опубликовано'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 