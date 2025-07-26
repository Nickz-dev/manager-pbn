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

interface Article {
  id: string
  title: string
  slug: string
  statusarticles: string
  createdAt: string
  content_categories: Category[]
  author?: Author | null
}

export default function ContentPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
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

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [catRes, authRes, artRes] = await Promise.all([
        axios.get('/api/content/categories'),
        axios.get('/api/content/authors'),
        axios.get('/api/content/articles')
      ])
      
      setCategories(catRes.data.categories || [])
      setAuthors(authRes.data.authors || [])
      setArticles(artRes.data.articles || [])
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

  // Фильтрация статей
  const filteredArticles = articles.filter(article => {
    // Фильтр по категории
    const categoryMatch = selectedCategory === 'all' || 
      (Array.isArray(article.content_categories) && 
       article.content_categories.some(cat => cat.id.toString() === selectedCategory))
    
    // Фильтр по статусу (используем правильное поле)
    const statusMatch = selectedStatus === 'all' || 
      article.statusarticles === selectedStatus
    
    return categoryMatch && statusMatch
  })

  // Примерные данные для статистики (заменить на реальные при необходимости)
  const totalContent = articles.length
  const aiGenerations = articles.filter(a => a.statusarticles === 'ai').length // или другое условие
  const inProgress = articles.filter(a => a.statusarticles === 'processing').length // или другое условие
  const published = articles.filter(a => a.statusarticles === 'published').length

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

        {/* Фильтры */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <h2 className="text-lg font-semibold">Статьи</h2>
            <Link href="/content/new" className="btn-secondary">➕ Новая статья</Link>
          </div>
          {filteredArticles.length === 0 ? (
            <div className="text-gray-400 text-sm py-6 text-center">Нет статей</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заголовок</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категории</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map(article => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        <Link href={`/content/articles/${article.slug}`} className="text-blue-600 hover:underline">{article.title}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(article.content_categories) && article.content_categories.map(cat => cat.name).join(', ')}
                      </td>
                                             <td className="px-6 py-4 whitespace-nowrap">
                         <span className={
                           article.statusarticles === 'published' ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' :
                           article.statusarticles === 'draft' ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800' :
                           'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
                         }>
                           {article.statusarticles}
                         </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-red-500 hover:underline text-xs mr-2" onClick={() => handleDeleteArticle(article.id)}>Удалить</button>
                        <Link href={`/content/articles/${article.slug}`} className="text-blue-600 hover:underline text-xs">Подробнее</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 