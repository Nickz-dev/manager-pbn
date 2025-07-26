'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import axios from 'axios'

interface Category {
  id: string
  name: string
  color: string
  description: string
  is_active: boolean
}

interface Author {
  id: string
  documentId: string
  name: string
  email: string
  specialization: string
  experience_years: number
  is_active: boolean
  bio?: string
  avatar?: string
  website?: string
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
  publishedAt: string
  content_categories: Category[]
  author?: Author | null
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchArticle()
      fetchCategories()
      fetchAuthors()
    }
  }, [params.slug])

  async function fetchArticle() {
    try {
      const response = await axios.get(`/api/content/articles/${params.slug}`)
      setArticle(response.data.article)
    } catch (e) {
      setError('Статья не найдена')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const response = await axios.get('/api/content/categories')
      setCategories(response.data.categories || [])
    } catch (e) {
      console.error('Ошибка загрузки категорий')
    }
  }

  async function fetchAuthors() {
    try {
      const response = await axios.get('/api/content/authors')
      setAuthors(response.data.authors || [])
    } catch (e) {
      console.error('Ошибка загрузки авторов')
    }
  }

  async function handleUpdateArticle() {
    if (!article) return
    try {
      const response = await axios.put(`/api/content/articles/${article.documentId}`, { data: article })
      setIsEditing(false)
      
      // Если slug изменился, перенаправляем на новый URL
      const updatedArticle = response.data.article
      if (updatedArticle.slug !== params.slug) {
        router.push(`/content/articles/${updatedArticle.slug}`)
      } else {
        // Если slug не изменился, просто обновляем данные
        setArticle(updatedArticle)
      }
    } catch (e: any) {
      alert('Ошибка обновления статьи')
    }
  }

  async function handleDeleteArticle() {
    if (!article) return
    try {
      await axios.delete(`/api/content/articles/${article.documentId}`)
      router.push('/content')
    } catch (e) {
      alert('Ошибка удаления статьи')
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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Загрузка статьи...</p>
      </div>
    </div>
  )

  if (error || !article) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-xl mb-4">❌ {error || 'Статья не найдена'}</div>
        <Link href="/content" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Вернуться к списку</Link>
      </div>
    </div>
  )

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
          title={isEditing ? "Редактирование статьи" : article.title}
          description={isEditing ? "Измените содержимое статьи" : article.excerpt || "Просмотр статьи"}
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Контент', href: '/content' },
            { label: isEditing ? 'Редактирование' : article.title }
          ]}
          actions={
            <div className="flex space-x-3">
              {!isEditing ? (
                <>
                  <button className="btn-primary" onClick={() => setIsEditing(true)}>✏️ Редактировать</button>
                  <button className="btn-secondary" onClick={() => setShowDeleteModal(true)}>🗑️ Удалить</button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={handleUpdateArticle}>💾 Сохранить</button>
                  <button className="btn-secondary" onClick={() => setIsEditing(false)}>❌ Отмена</button>
                </>
              )}
              <Link href="/content" className="btn-secondary">← Назад</Link>
            </div>
          }
        />

        {/* Статья */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-2">
            <div className="card">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                    <input
                      className="input-field w-full"
                      value={article.title}
                      onChange={e => setArticle({ ...article, title: e.target.value, slug: slugify(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Краткое описание</label>
                    <textarea
                      className="input-field w-full"
                      rows={3}
                      value={article.excerpt || ''}
                      onChange={e => setArticle({ ...article, excerpt: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Содержание</label>
                    <textarea
                      className="input-field w-full"
                      rows={15}
                      value={article.content || ''}
                      onChange={e => setArticle({ ...article, content: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Изображение</label>
                    <input
                      className="input-field w-full"
                      placeholder="URL изображения"
                      value={article.featured_image || ''}
                      onChange={e => setArticle({ ...article, featured_image: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {article.featured_image && (
                    <img 
                      src={article.featured_image} 
                      alt={article.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                    {article.excerpt && (
                      <p className="text-lg text-gray-600 mb-6">{article.excerpt}</p>
                    )}
                    <div className="prose max-w-none">
                      {article.content ? (
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                      ) : (
                        <p className="text-gray-500 italic">Содержание статьи отсутствует</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Мета-информация */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Мета-информация</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input
                      className="input-field w-full"
                      value={article.meta_title || ''}
                      onChange={e => setArticle({ ...article, meta_title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      className="input-field w-full"
                      rows={3}
                      value={article.meta_description || ''}
                      onChange={e => setArticle({ ...article, meta_description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                    <select
                      className="input-field w-full"
                      value={article.statusarticles}
                      onChange={e => setArticle({ ...article, statusarticles: e.target.value })}
                    >
                      <option value="draft">Черновик</option>
                      <option value="published">Опубликовано</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Статус:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      article.statusarticles === 'published' ? 'bg-green-100 text-green-800' :
                      article.statusarticles === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {article.statusarticles}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Создано:</span>
                    <span className="ml-2 text-sm">{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Обновлено:</span>
                    <span className="ml-2 text-sm">{new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>
                  {article.meta_title && (
                    <div>
                      <span className="text-sm text-gray-500">Meta Title:</span>
                      <p className="text-sm mt-1">{article.meta_title}</p>
                    </div>
                  )}
                  {article.meta_description && (
                    <div>
                      <span className="text-sm text-gray-500">Meta Description:</span>
                      <p className="text-sm mt-1">{article.meta_description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Категории */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Категории</h3>
              {isEditing ? (
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={article.content_categories.some(c => c.id === cat.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setArticle({
                              ...article,
                              content_categories: [...article.content_categories, cat]
                            })
                          } else {
                            setArticle({
                              ...article,
                              content_categories: article.content_categories.filter(c => c.id !== cat.id)
                            })
                          }
                        }}
                      />
                      <span className="ml-2 text-sm" style={{ color: cat.color }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {article.content_categories.length > 0 ? (
                    article.content_categories.map(cat => (
                      <span key={cat.id} className="inline-block px-2 py-1 text-xs rounded-full mr-2 mb-2" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                        {cat.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Категории не назначены</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Модалка удаления */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Удалить статью</h3>
          <p className="text-gray-600 mb-6">Вы уверены, что хотите удалить статью "{article.title}"? Это действие нельзя отменить.</p>
          <div className="flex space-x-3">
            <button className="btn-primary" onClick={handleDeleteArticle}>Удалить</button>
            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Отмена</button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 