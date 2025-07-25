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
  name: string
  email: string
  specialization: string
  experience_years: number
  is_active: boolean
}

interface Article {
  id: string
  title: string
  slug: string
  status: string
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
  const [newAuthor, setNewAuthor] = useState({ name: '', email: '', specialization: 'general', experience_years: 0 })

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

  // CRUD Категории
  async function handleCreateCategory() {
    if (!newCategory.name.trim()) return
    try {
      await axios.post('/api/content/categories', newCategory)
      setShowCategoryModal(false)
      setNewCategory({ name: '', color: '#3B82F6', description: '' })
      fetchData()
    } catch (e) {
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

  // CRUD Автор
  async function handleCreateAuthor() {
    if (!newAuthor.name.trim() || !newAuthor.email.trim()) return
    try {
      await axios.post('/api/content/authors', newAuthor)
      setShowAuthorModal(false)
      setNewAuthor({ name: '', email: '', specialization: 'general', experience_years: 0 })
      fetchData()
    } catch (e) {
      alert('Ошибка создания автора')
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PageHeader
        title="Контент"
        description="Категории, авторы и статьи — управление контентом PBN"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Контент' }
        ]}
        actions={<Link href="/content/new" className="btn-primary">➕ Новая статья</Link>}
      />

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
                  <button className="text-red-500 hover:underline text-xs" onClick={() => handleDeleteCategory(cat.id)}>Удалить</button>
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
                  <button className="text-red-500 hover:underline text-xs" onClick={() => handleDeleteAuthor(author.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          )}
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
          <input
            className="input-field mb-2"
            placeholder="Цвет (hex)"
            value={newCategory.color}
            onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
          />
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
          <input
            className="input-field mb-2"
            placeholder="Специализация"
            value={newAuthor.specialization}
            onChange={e => setNewAuthor({ ...newAuthor, specialization: e.target.value })}
          />
          <input
            className="input-field mb-2"
            type="number"
            placeholder="Опыт (лет)"
            value={newAuthor.experience_years}
            onChange={e => setNewAuthor({ ...newAuthor, experience_years: Number(e.target.value) })}
          />
          <button className="btn-primary w-full" onClick={handleCreateAuthor}>Создать</button>
        </div>
      </Modal>

      {/* Список статей */}
      <div className="card mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Статьи</h2>
          <Link href="/content/new" className="btn-secondary">➕ Новая статья</Link>
        </div>
        {articles.length === 0 ? (
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
                {articles.map(article => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      <Link href={`/content/articles/${article.slug}`} className="text-blue-600 hover:underline">{article.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Array.isArray(article.content_categories) && article.content_categories.map(cat => cat.name).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={
                        article.status === 'published' ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800' :
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
                      }>
                        {article.status}
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
    </div>
  )
} 