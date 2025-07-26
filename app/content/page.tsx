'use client'

import { useState, useEffect } from 'react'
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

interface PbnSite {
  id: string
  documentId: string
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
  createdAt: string
  content_categories: Category[]
  content_author?: Author | null
  pbn_site?: PbnSite | null
}

export default function ContentPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [pbnSites, setPbnSites] = useState<PbnSite[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Модальные окна
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6', description: '' })
  const [showAuthorModal, setShowAuthorModal] = useState(false)
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '', specialization: 'general', experience_years: 0, bio: '', website: '' })
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editAuthor, setEditAuthor] = useState<Author | null>(null)
  const [showEditAuthorModal, setShowEditAuthorModal] = useState(false)

  // Состояния для фильтров
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all')
  const [selectedPbnSite, setSelectedPbnSite] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Состояния для редактирования статей
  const [editingArticles, setEditingArticles] = useState<{[key: string]: boolean}>({})
  const [articleUpdates, setArticleUpdates] = useState<{[key: string]: any}>({})
  const [savingArticles, setSavingArticles] = useState<{[key: string]: boolean}>({})

  // Состояния для массовых операций
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])
        
  async function fetchData() {
    setLoading(true)
    try {
      const [catRes, authRes, artRes, sitesRes] = await Promise.all([
          axios.get('/api/content/categories'),
          axios.get('/api/content/authors'),
        axios.get('/api/content/articles'),
        axios.get('/api/sites')
      ])
      
      setCategories(catRes.data.categories || [])
      setAuthors(authRes.data.authors || [])
      setArticles(artRes.data.articles || [])
      setPbnSites(sitesRes.data.sites || [])
    } catch (e) {
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/gi, '') // Убираем кириллицу
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // CRUD Категории
  async function handleCreateCategory() {
    if (!newCategory.name.trim()) return
    try {
      const payload = { ...newCategory, slug: slugify(newCategory.name) }
      await axios.post('/api/content/categories', { data: payload })
      setShowCategoryModal(false)
      setNewCategory({ name: '', color: '#3B82F6', description: '' })
      fetchData()
    } catch (e: any) {
      alert('Ошибка создания категории')
    }
  }
  async function handleDeleteCategory(id: string) {
    if (!confirm('Удалить категорию?')) return
    try {
      await axios.delete(`/api/content/categories/${id}`)
      fetchData()
    } catch (e) {
      alert('Ошибка удаления категории')
    }
  }

  async function handleUpdateCategory() {
    if (!editCategory || !editCategory.name.trim()) return
    try {
      const payload = { ...editCategory, slug: slugify(editCategory.name) }
      await axios.put(`/api/content/categories/${editCategory.id}`, { data: payload })
      setShowEditModal(false)
      setEditCategory(null)
      fetchData()
    } catch (e: any) {
      alert('Ошибка обновления категории')
    }
  }

  // CRUD Автор
  async function handleCreateAuthor() {
    if (!newAuthor.name.trim() || !newAuthor.email.trim()) return
    try {
      await axios.post('/api/content/authors', { data: newAuthor })
      setShowAuthorModal(false)
      setNewAuthor({ name: '', email: '', specialization: 'general', experience_years: 0, bio: '', website: '' })
      fetchData()
    } catch (e) {
      alert('Ошибка создания автора')
    }
  }
  
  async function handleUpdateAuthor() {
    if (!editAuthor || !editAuthor.name.trim() || !editAuthor.email.trim()) return
    try {
      await axios.put(`/api/content/authors/${editAuthor.id}`, { data: editAuthor })
      setShowEditAuthorModal(false)
      setEditAuthor(null)
      fetchData()
    } catch (e: any) {
      alert('Ошибка обновления автора')
    }
  }
  
  async function handleDeleteAuthor(id: string) {
    if (!confirm('Удалить автора?')) return
    try {
      await axios.delete(`/api/content/authors/${id}`)
      fetchData()
    } catch (e) {
      alert('Ошибка удаления автора')
    }
  }

  // CRUD Статьи
  async function handleDeleteArticle(id: string) {
    if (!confirm('Удалить статью?')) return
    try {
      await axios.delete(`/api/content/articles/${id}`)
      fetchData()
    } catch (e) {
      alert('Ошибка удаления статьи')
    }
  }

  // Функции для редактирования статей
  function startEditingArticle(articleId: string) {
    setEditingArticles(prev => ({ ...prev, [articleId]: true }))
    setArticleUpdates(prev => ({ ...prev, [articleId]: {} }))
  }

  function stopEditingArticle(articleId: string) {
    setEditingArticles(prev => ({ ...prev, [articleId]: false }))
    setArticleUpdates(prev => {
      const newUpdates = { ...prev }
      delete newUpdates[articleId]
      return newUpdates
    })
  }

  function updateArticleField(articleId: string, field: string, value: any) {
    setArticleUpdates(prev => ({
      ...prev,
      [articleId]: {
        ...prev[articleId],
        [field]: value
      }
    }))
  }

  async function saveArticleChanges(articleId: string) {
    const updates = articleUpdates[articleId]
    if (!updates || Object.keys(updates).length === 0) {
      stopEditingArticle(articleId)
      return
    }

    setSavingArticles(prev => ({ ...prev, [articleId]: true }))

    try {
      // Подготавливаем данные для Strapi
      const strapiData: any = {}
      
      if (updates.statusarticles) {
        strapiData.statusarticles = updates.statusarticles
      }
      
      if (updates.content_author !== undefined) {
        strapiData.content_author = updates.content_author ? { id: updates.content_author } : null
      }
      
      if (updates.pbn_site !== undefined) {
        strapiData.pbn_site = updates.pbn_site ? { id: updates.pbn_site } : null
      }

      await axios.put(`/api/content/articles/${articleId}`, { data: strapiData })
      stopEditingArticle(articleId)
      fetchData()
    } catch (e: any) {
      alert('Ошибка обновления статьи: ' + (e.response?.data?.error || e.message))
    } finally {
      setSavingArticles(prev => ({ ...prev, [articleId]: false }))
    }
  }

  // Функции для массовых операций
  function toggleArticleSelection(articleId: string) {
    const newSelected = new Set(selectedArticles)
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId)
        } else {
      newSelected.add(articleId)
    }
    setSelectedArticles(newSelected)
    setShowBulkActions(newSelected.size > 0)
  }

  function selectAllArticles() {
    const filteredArticles = getFilteredArticles()
    const allIds = filteredArticles.map(art => art.id)
    setSelectedArticles(new Set(allIds))
    setShowBulkActions(true)
  }

  function clearSelection() {
    setSelectedArticles(new Set())
    setShowBulkActions(false)
  }

  function getFilteredArticles() {
    let filtered = articles.filter(article => {
      // Поиск по заголовку
      const searchMatch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.slug.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Фильтр по категории
      const categoryMatch = selectedCategory === 'all' || 
        (Array.isArray(article.content_categories) && 
         article.content_categories.some(cat => cat.id.toString() === selectedCategory))
      
      // Фильтр по статусу
      const statusMatch = selectedStatus === 'all' || 
        article.statusarticles === selectedStatus
      
      // Фильтр по автору
      const authorMatch = selectedAuthor === 'all' || 
        (article.content_author && article.content_author.id.toString() === selectedAuthor) ||
        (selectedAuthor === 'none' && !article.content_author)
      
      // Фильтр по PBN сайту
      const pbnSiteMatch = selectedPbnSite === 'all' || 
        (article.pbn_site && article.pbn_site.id.toString() === selectedPbnSite) ||
        (selectedPbnSite === 'none' && !article.pbn_site)
      
      return searchMatch && categoryMatch && statusMatch && authorMatch && pbnSiteMatch
    })

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'status':
          aValue = a.statusarticles
          bValue = b.statusarticles
          break
        case 'author':
          aValue = a.content_author?.name || ''
          bValue = b.content_author?.name || ''
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  async function executeBulkAction() {
    if (selectedArticles.size === 0 || !bulkAction) return

    setBulkLoading(true)
    try {
      const selectedArticlesList = articles.filter(art => selectedArticles.has(art.id))
      
      switch (bulkAction) {
        case 'delete':
          // Удаляем статьи
          await Promise.all(
            selectedArticlesList.map(art => 
              axios.delete(`/api/content/articles/${art.documentId}`)
            )
          )
          break
          
        case 'status':
          // Изменяем статус
          const newStatus = prompt('Введите новый статус (draft/published/archived/ai/processing):')
          if (newStatus && ['draft', 'published', 'archived', 'ai', 'processing'].includes(newStatus)) {
            await Promise.all(
              selectedArticlesList.map(art => 
                axios.put(`/api/content/articles/${art.documentId}`, { 
                  data: { statusarticles: newStatus } 
                })
              )
            )
          } else {
            alert('Неверный статус!')
            return
          }
          break
          
        case 'category':
          // Изменяем категорию
          const categoryId = prompt('Введите ID категории:')
          if (categoryId) {
            await Promise.all(
              selectedArticlesList.map(art => 
                axios.put(`/api/content/articles/${art.documentId}`, { 
                  data: { content_categories: [{ id: categoryId }] } 
                })
              )
            )
          } else {
            alert('ID категории не указан!')
            return
          }
          break
          
        case 'author':
          // Изменяем автора
          const authorId = prompt('Введите ID автора:')
          if (authorId) {
            await Promise.all(
              selectedArticlesList.map(art => 
                axios.put(`/api/content/articles/${art.documentId}`, { 
                  data: { content_author: { id: authorId } } 
                })
              )
            )
          } else {
            alert('ID автора не указан!')
            return
          }
          break
      }
      
      // Обновляем данные
      await fetchData()
      clearSelection()
      setShowBulkModal(false)
      setBulkAction('')
      
    } catch (error: any) {
      alert('Ошибка выполнения массовой операции: ' + (error.response?.data?.error || error.message))
      } finally {
      setBulkLoading(false)
    }
  }

  function openPreview(article: Article) {
    setPreviewArticle(article)
    setShowPreviewModal(true)
  }

  // Фильтрация статей
  const filteredArticles = articles.filter(article => {
    // Фильтр по категории
    const categoryMatch = selectedCategory === 'all' || 
      (Array.isArray(article.content_categories) && 
       article.content_categories.some(cat => cat.id.toString() === selectedCategory))
    
    // Фильтр по статусу
    const statusMatch = selectedStatus === 'all' || 
      article.statusarticles === selectedStatus
    
    // Фильтр по автору
    const authorMatch = selectedAuthor === 'all' || 
      (article.content_author && article.content_author.id.toString() === selectedAuthor) ||
      (selectedAuthor === 'none' && !article.content_author)
    
    // Фильтр по PBN сайту
    const pbnSiteMatch = selectedPbnSite === 'all' || 
      (article.pbn_site && article.pbn_site.id.toString() === selectedPbnSite) ||
      (selectedPbnSite === 'none' && !article.pbn_site)
    
    return categoryMatch && statusMatch && authorMatch && pbnSiteMatch
  })

  // Примерные данные для статистики (заменить на реальные при необходимости)
  const totalContent = articles.length
  const aiGenerations = articles.filter(a => a.statusarticles === 'ai').length
  const inProgress = articles.filter(a => a.statusarticles === 'draft').length
  const published = articles.filter(a => a.statusarticles === 'published').length
  const processing = articles.filter(a => a.statusarticles === 'processing').length
  const archived = articles.filter(a => a.statusarticles === 'archived').length

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Загрузка контента...</p>
      </div>
    </div>
  )
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-xl mb-4">❌ Ошибка</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Повторить</button>
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
          title="Управление контентом"
          description="AI генерация, Strapi интеграция и пересборка сайтов"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Контент' }
          ]}
          actions={
            <div className="flex space-x-3">
              <Link href="/content/new" className="btn-primary">➕ Новая статья</Link>
              <Link href="/content/generate" className="btn-secondary">✨ Генерация AI</Link>
              <button className="btn-secondary">Strapi CLI</button>
            </div>
          }
        />

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card flex items-center justify-between p-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Всего контента</div>
              <div className="text-3xl font-bold text-gray-900">{totalContent}</div>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01-8 0" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v4m0 0a4 4 0 01-4 4H4m8-4a4 4 0 014 4h4" />
                </svg>
              </div>
          </div>
          <div className="card flex items-center justify-between p-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">AI генерации</div>
              <div className="text-3xl font-bold text-gray-900">{aiGenerations}</div>
              <div className="text-xs text-green-600 mt-1">+5 сегодня</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
          </div>
          <div className="card flex items-center justify-between p-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">В обработке</div>
              <div className="text-3xl font-bold text-gray-900">{inProgress}</div>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
          </div>
          <div className="card flex items-center justify-between p-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Опубликовано</div>
              <div className="text-3xl font-bold text-gray-900">{published}</div>
              <div className="text-xs text-green-600 mt-1">+3 за день</div>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
        </div>
            </div>
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Категории */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Категории</h2>
              <button className="btn-secondary" onClick={() => setShowCategoryModal(true)}>Добавить</button>
            </div>
            {categories.length === 0 ? (
              <div className="text-gray-400 text-sm py-6 text-center">Нет категорий</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {categories.map(cat => (
                  <li key={cat.id} className="flex justify-between items-center py-2">
                      <div>
                      <span className="font-medium" style={{ color: cat.color }}>{cat.name}</span>
                      <span className="ml-2 text-xs text-gray-500">{cat.description}</span>
                      </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:underline text-xs" onClick={() => { setEditCategory(cat); setShowEditModal(true); }}>Изменить</button>
                      <button className="text-red-500 hover:underline text-xs" onClick={() => handleDeleteCategory(cat.id)}>Удалить</button>
                    </div>
                  </li>
                ))}
              </ul>
                      )}
                    </div>
          {/* Авторы */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Авторы</h2>
              <button className="btn-secondary" onClick={() => setShowAuthorModal(true)}>Добавить</button>
                  </div>
            {authors.length === 0 ? (
              <div className="text-gray-400 text-sm py-6 text-center">Нет авторов</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {authors.map(author => (
                  <li key={author.id} className="flex justify-between items-center py-2">
                    <div>
                      <span className="font-medium">{author.name}</span>
                      <span className="ml-2 text-xs text-gray-500">{author.email}</span>
                      <span className="ml-2 text-xs text-gray-400">{author.specialization}</span>
                </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:underline text-xs" onClick={() => { setEditAuthor(author); setShowEditAuthorModal(true); }}>Изменить</button>
                      <button className="text-red-500 hover:underline text-xs" onClick={() => handleDeleteAuthor(author.id)}>Удалить</button>
                    </div>
                  </li>
              ))}
              </ul>
            )}
            </div>
          </div>

        {/* Поиск и фильтры */}
        <div className="card mb-8">
          {/* Поиск */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Поиск по заголовку или slug..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            </div>
            
          {/* Фильтры и сортировка */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все категории</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
                      </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value="draft">Черновик</option>
                <option value="published">Опубликовано</option>
                <option value="archived">Архив</option>
                <option value="ai">AI генерация</option>
                <option value="processing">В обработке</option>
              </select>
                    </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Автор</label>
              <select
                value={selectedAuthor}
                onChange={e => setSelectedAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все авторы</option>
                <option value="none">Без автора</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
                    </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PBN сайт</label>
              <select
                value={selectedPbnSite}
                onChange={e => setSelectedPbnSite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все сайты</option>
                <option value="none">Без привязки</option>
                {pbnSites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
                  </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Сортировка</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">По дате</option>
                <option value="title">По заголовку</option>
                <option value="status">По статусу</option>
                <option value="author">По автору</option>
              </select>
                </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Порядок</label>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Показано {filteredArticles.length} из {articles.length} статей
              </div>
            </div>
            <div className="flex items-end justify-end">
              <button onClick={fetchData} className="btn-secondary">🔄 Обновить</button>
            </div>
          </div>
        </div>

        {/* Модалка создания категории */}
        <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Создать категорию</h3>
            <input
              className="input-field mb-2"
              placeholder="Название"
              value={newCategory.name}
              onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Цвет категории</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 hover:scale-105 focus:scale-110 cursor-pointer"
                  value={newCategory.color}
                  onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                  style={{ background: 'none' }}
                />
                <span className="text-xs text-gray-500 select-none w-14">{newCategory.color}</span>
                <input
                  className="input-field w-24"
                  placeholder="#HEX"
                  value={newCategory.color}
                  onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                  maxLength={7}
                />
                <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ background: newCategory.color }} title="Предпросмотр цвета" />
              </div>
              </div>
            <input
              className="input-field mb-2"
              placeholder="Описание"
              value={newCategory.description}
              onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
            />
            <button className="btn-primary w-full" onClick={handleCreateCategory}>Создать</button>
            </div>
        </Modal>

        {/* Модалка создания автора */}
        <Modal isOpen={showAuthorModal} onClose={() => setShowAuthorModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Создать автора</h3>
            <input
              className="input-field mb-2"
              placeholder="Имя"
              value={newAuthor.name}
              onChange={e => setNewAuthor({ ...newAuthor, name: e.target.value })}
            />
            <input
              className="input-field mb-2"
              placeholder="Email"
              value={newAuthor.email}
              onChange={e => setNewAuthor({ ...newAuthor, email: e.target.value })}
            />
            <select
              className="input-field mb-2"
              value={newAuthor.specialization}
              onChange={e => setNewAuthor({ ...newAuthor, specialization: e.target.value })}
            >
              <option value="general">Общая</option>
              <option value="casino">Казино</option>
              <option value="sports">Спорт</option>
              <option value="crypto">Криптовалюта</option>
              <option value="finance">Финансы</option>
            </select>
            <input
              className="input-field mb-2"
              type="number"
              placeholder="Опыт (лет)"
              value={newAuthor.experience_years}
              onChange={e => setNewAuthor({ ...newAuthor, experience_years: Number(e.target.value) })}
            />
            <textarea
              className="input-field mb-2"
              placeholder="Биография"
              value={newAuthor.bio}
              onChange={e => setNewAuthor({ ...newAuthor, bio: e.target.value })}
              rows={3}
            />
            <input
              className="input-field mb-2"
              placeholder="Веб-сайт"
              value={newAuthor.website}
              onChange={e => setNewAuthor({ ...newAuthor, website: e.target.value })}
            />
            <button className="btn-primary w-full" onClick={handleCreateAuthor}>Создать</button>
              </div>
        </Modal>

        {/* Модалка редактирования категории */}
        <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditCategory(null); }}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Редактировать категорию</h3>
            {editCategory && (
              <>
                <input
                  className="input-field mb-2"
                  placeholder="Название"
                  value={editCategory.name}
                  onChange={e => setEditCategory({ ...editCategory, name: e.target.value })}
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Цвет категории</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 hover:scale-105 focus:scale-110 cursor-pointer"
                      value={editCategory.color}
                      onChange={e => setEditCategory({ ...editCategory, color: e.target.value })}
                      style={{ background: 'none' }}
                    />
                    <span className="text-xs text-gray-500 select-none w-14">{editCategory.color}</span>
                    <input
                      className="input-field w-24"
                      placeholder="#HEX"
                      value={editCategory.color}
                      onChange={e => setEditCategory({ ...editCategory, color: e.target.value })}
                      maxLength={7}
                    />
                    <div className="w-8 h-8 rounded-lg border border-gray-200" style={{ background: editCategory.color }} title="Предпросмотр цвета" />
              </div>
            </div>
                <input
                  className="input-field mb-2"
                  placeholder="Описание"
                  value={editCategory.description}
                  onChange={e => setEditCategory({ ...editCategory, description: e.target.value })}
                />
                <button className="btn-primary w-full" onClick={handleUpdateCategory}>Сохранить</button>
              </>
            )}
          </div>
        </Modal>

        {/* Модалка редактирования автора */}
        <Modal isOpen={showEditAuthorModal} onClose={() => { setShowEditAuthorModal(false); setEditAuthor(null); }}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Редактировать автора</h3>
            {editAuthor && (
              <>
                <input
                  className="input-field mb-2"
                  placeholder="Имя"
                  value={editAuthor.name}
                  onChange={e => setEditAuthor({ ...editAuthor, name: e.target.value })}
                />
                <input
                  className="input-field mb-2"
                  placeholder="Email"
                  value={editAuthor.email}
                  onChange={e => setEditAuthor({ ...editAuthor, email: e.target.value })}
                />
                <select
                  className="input-field mb-2"
                  value={editAuthor.specialization}
                  onChange={e => setEditAuthor({ ...editAuthor, specialization: e.target.value })}
                >
                  <option value="general">Общая</option>
                  <option value="casino">Казино</option>
                  <option value="sports">Спорт</option>
                  <option value="crypto">Криптовалюта</option>
                  <option value="finance">Финансы</option>
                </select>
                <input
                  className="input-field mb-2"
                  type="number"
                  placeholder="Опыт (лет)"
                  value={editAuthor.experience_years}
                  onChange={e => setEditAuthor({ ...editAuthor, experience_years: Number(e.target.value) })}
                />
                <textarea
                  className="input-field mb-2"
                  placeholder="Биография"
                  value={editAuthor.bio || ''}
                  onChange={e => setEditAuthor({ ...editAuthor, bio: e.target.value })}
                  rows={3}
                />
                <input
                  className="input-field mb-2"
                  placeholder="Веб-сайт"
                  value={editAuthor.website || ''}
                  onChange={e => setEditAuthor({ ...editAuthor, website: e.target.value })}
                />
                <button className="btn-primary w-full" onClick={handleUpdateAuthor}>Сохранить</button>
              </>
            )}
              </div>
        </Modal>

        {/* Список статей */}
        <div className="card mt-8">
          <div className="flex justify-between items-center mb-4">
              <div>
              <h2 className="text-lg font-semibold">Статьи</h2>
              <p className="text-sm text-gray-600 mt-1">
                💡 Кликните на статус, автора или PBN сайт для быстрого редактирования
              </p>
              </div>
            <div className="flex space-x-3">
              {showBulkActions && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Выбрано: {selectedArticles.size}
                  </span>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bulkAction}
                    onChange={e => setBulkAction(e.target.value)}
                  >
                    <option value="">Выберите действие</option>
                    <option value="delete">🗑️ Удалить</option>
                    <option value="status">📝 Изменить статус</option>
                    <option value="category">📂 Изменить категорию</option>
                    <option value="author">👤 Изменить автора</option>
                  </select>
                  <button
                    onClick={() => setShowBulkModal(true)}
                    disabled={!bulkAction}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    Применить
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Отменить
                  </button>
            </div>
              )}
              <Link href="/content/new" className="btn-secondary">➕ Новая статья</Link>
          </div>
        </div>
          {filteredArticles.length === 0 ? (
            <div className="text-gray-400 text-sm py-6 text-center">Нет статей</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                        onChange={selectAllArticles}
                      />
                    </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заголовок</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категории</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автор</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PBN сайт</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map(article => {
                    const isEditing = editingArticles[article.id]
                    const updates = articleUpdates[article.id] || {}
                    
                    return (
                      <tr key={article.id} className={isEditing ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedArticles.has(article.id)}
                            onChange={() => toggleArticleSelection(article.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          <Link href={`/content/articles/${article.slug}`} className="text-blue-600 hover:underline">{article.title}</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {Array.isArray(article.content_categories) && article.content_categories.map(cat => cat.name).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {isEditing ? (
                            <select
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={updates.content_author !== undefined ? updates.content_author : (article.content_author?.id || '')}
                              onChange={e => updateArticleField(article.id, 'content_author', e.target.value || null)}
                            >
                              <option value="">Без автора</option>
                              {authors.map(author => (
                                <option key={author.id} value={author.id}>{author.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => startEditingArticle(article.id)}>
                              {article.content_author ? article.content_author.name : '-'}
                      </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {isEditing ? (
                            <select
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={updates.pbn_site !== undefined ? updates.pbn_site : (article.pbn_site?.id || '')}
                              onChange={e => updateArticleField(article.id, 'pbn_site', e.target.value || null)}
                            >
                              <option value="">Без привязки</option>
                              {pbnSites.map(site => (
                                <option key={site.id} value={site.id}>{site.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => startEditingArticle(article.id)}>
                              {article.pbn_site ? article.pbn_site.name : '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={updates.statusarticles || article.statusarticles}
                              onChange={e => updateArticleField(article.id, 'statusarticles', e.target.value)}
                            >
                              <option value="draft">Черновик</option>
                              <option value="published">Опубликовано</option>
                              <option value="archived">Архив</option>
                              <option value="ai">AI генерация</option>
                              <option value="processing">В обработке</option>
                            </select>
                          ) : (
                            <span 
                              className="cursor-pointer inline-flex px-2 py-1 text-xs font-semibold rounded-full hover:bg-opacity-80"
                              onClick={() => startEditingArticle(article.id)}
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
                          )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isEditing ? (
                            <div className="flex space-x-2">
                              <button 
                                className={`text-xs ${savingArticles[article.id] ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-800'}`}
                                onClick={() => !savingArticles[article.id] && saveArticleChanges(article.id)}
                                disabled={savingArticles[article.id]}
                              >
                                {savingArticles[article.id] ? '⏳ Сохранение...' : '💾 Сохранить'}
                              </button>
                              <button 
                                className="text-gray-600 hover:text-gray-800 text-xs"
                                onClick={() => stopEditingArticle(article.id)}
                                disabled={savingArticles[article.id]}
                              >
                                ❌ Отмена
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                onClick={() => startEditingArticle(article.id)}
                              >
                                ✏️ Изменить
                              </button>
                              <button 
                                className="text-green-600 hover:text-green-800 text-xs"
                                onClick={() => openPreview(article)}
                              >
                                👁️ Просмотр
                              </button>
                              <button className="text-red-500 hover:underline text-xs" onClick={() => handleDeleteArticle(article.id)}>Удалить</button>
                              <Link href={`/content/articles/${article.slug}`} className="text-blue-600 hover:underline text-xs">Подробнее</Link>
                            </div>
                          )}
                    </td>
                  </tr>
                    )
                  })}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Модальное окно для массовых операций */}
        {showBulkModal && (
          <Modal
            isOpen={showBulkModal}
            onClose={() => setShowBulkModal(false)}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Подтверждение массовой операции</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Вы уверены, что хотите выполнить действие "{bulkAction}" для {selectedArticles.size} выбранных статей?
                </p>
              
              {bulkAction === 'delete' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">⚠️ Внимание!</p>
                  <p className="text-red-700 text-sm mt-1">
                    Это действие нельзя отменить. Все выбранные статьи будут удалены безвозвратно.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  onClick={executeBulkAction}
                  disabled={bulkLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {bulkLoading ? '⏳ Выполнение...' : 'Подтвердить'}
                </button>
              </div>
            </div>
          </div>
          </Modal>
        )}

        {/* Модальное окно предварительного просмотра */}
        {showPreviewModal && previewArticle && (
          <Modal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
          >
            <div className="p-6 max-w-4xl w-full">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Предварительный просмотр</h3>
                <div className="flex space-x-2">
                  <Link 
                    href={`/content/articles/${previewArticle.slug}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    ✏️ Редактировать
                  </Link>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Закрыть
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{previewArticle.title}</h1>
                
                {/* Мета-информация */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Статус:</span>
                      <div className="mt-1">
                        <span 
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: 
                              previewArticle.statusarticles === 'published' ? '#DEF7EC' :
                              previewArticle.statusarticles === 'draft' ? '#FEF3C7' :
                              previewArticle.statusarticles === 'archived' ? '#F3F4F6' :
                              previewArticle.statusarticles === 'ai' ? '#F3E8FF' :
                              previewArticle.statusarticles === 'processing' ? '#FED7AA' :
                              '#F3F4F6',
                            color:
                              previewArticle.statusarticles === 'published' ? '#03543F' :
                              previewArticle.statusarticles === 'draft' ? '#92400E' :
                              previewArticle.statusarticles === 'archived' ? '#374151' :
                              previewArticle.statusarticles === 'ai' ? '#581C87' :
                              previewArticle.statusarticles === 'processing' ? '#C2410C' :
                              '#374151'
                          }}
                        >
                          {previewArticle.statusarticles}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Автор:</span>
                      <div className="mt-1 text-gray-600">
                        {previewArticle.content_author ? previewArticle.content_author.name : 'Не указан'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">PBN сайт:</span>
                      <div className="mt-1 text-gray-600">
                        {previewArticle.pbn_site ? previewArticle.pbn_site.name : 'Не привязан'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Дата:</span>
                      <div className="mt-1 text-gray-600">
                        {new Date(previewArticle.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Категории */}
                {previewArticle.content_categories && previewArticle.content_categories.length > 0 && (
                  <div className="mb-6">
                    <span className="font-medium text-gray-700">Категории:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {previewArticle.content_categories.map(cat => (
                        <span 
                          key={cat.id} 
                          className="px-3 py-1 text-sm rounded-full"
                          style={{ backgroundColor: cat.color + '20', color: cat.color }}
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Краткое описание */}
                {previewArticle.excerpt && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-gray-700 italic">{previewArticle.excerpt}</p>
                  </div>
                )}

                {/* Изображение */}
                {previewArticle.featured_image && (
                  <div className="mb-6">
                    <img 
                      src={previewArticle.featured_image} 
                      alt={previewArticle.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Содержание */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Содержание статьи</h3>
                  <div 
                    className="text-gray-800 leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewArticle.content }}
                  />
                </div>

                {/* SEO информация */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO информация</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Meta Title:</span>
                      <div className="mt-1 text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                        {previewArticle.meta_title || 'Не указан'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Meta Description:</span>
                      <div className="mt-1 text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                        {previewArticle.meta_description || 'Не указан'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Slug:</span>
                      <div className="mt-1 text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                        {previewArticle.slug || 'Не указан'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  )
} 