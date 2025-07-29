'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatsCard } from '@/components/ui/StatsCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/ui/Modal'

interface Site {
  id: string
  documentId: string
  name: string
  domain: string
  template: string
  statuspbn: string
  createdAt: string
  updatedAt: string
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    domain: '',
    template: '',
    statuspbn: ''
  })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sites')
      const data = await response.json()
      
      if (data.success) {
        setSites(data.sites)
      } else {
        setError('Failed to fetch sites')
      }
    } catch (err) {
      setError('Error loading sites')
      console.error('Error fetching sites:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (site: Site) => {
    console.log('🔧 Editing site:', site)
    setSelectedSite(site)
    setEditForm({
      name: site.name,
      domain: site.domain,
      template: site.template,
      statuspbn: site.statuspbn
    })
    console.log('🔧 Set edit form:', {
      name: site.name,
      domain: site.domain,
      template: site.template,
      statuspbn: site.statuspbn
    })
    setShowEditModal(true)
  }

  const handleDelete = (site: Site) => {
    setSelectedSite(site)
    setShowDeleteModal(true)
  }

  const handleUpdateSite = async () => {
    if (!selectedSite) return
    
    try {
      setActionLoading(true)
      
      console.log('🔧 Updating site:', selectedSite.documentId)
      console.log('🔧 Edit form data:', editForm)
      
      const response = await fetch(`/api/sites/${selectedSite.documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      const data = await response.json()
      
      console.log('🔧 Update response:', data)
      
      if (data.success) {
        setShowEditModal(false)
        setSelectedSite(null)
        await fetchSites() // Обновляем список
        alert('Сайт успешно обновлен!')
      } else {
        alert('Ошибка при обновлении сайта: ' + data.error)
      }
    } catch (err) {
      console.error('Error updating site:', err)
      alert('Ошибка при обновлении сайта')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteSite = async () => {
    if (!selectedSite) return
    
    try {
      setActionLoading(true)
      const response = await fetch(`/api/sites/${selectedSite.documentId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShowDeleteModal(false)
        setSelectedSite(null)
        fetchSites() // Обновляем список
        alert('Сайт успешно удален!')
      } else {
        alert('Ошибка при удалении сайта: ' + data.error)
      }
    } catch (err) {
      console.error('Error deleting site:', err)
      alert('Ошибка при удалении сайта')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownloadDist = async (site: Site) => {
    try {
      setActionLoading(true)
      
      // Создаем временную ссылку для скачивания
      const link = document.createElement('a')
      link.href = `/api/sites/${site.documentId}/download`
      link.download = `${site.name}-${site.documentId}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      alert('Начинается скачивание ZIP файла...')
    } catch (err) {
      console.error('Error downloading dist:', err)
      alert('Ошибка при скачивании файла')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRebuild = async (site: Site) => {
    try {
      setActionLoading(true)
      
      // Перенаправляем на страницу генерации с предустановленным ID сайта
      window.location.href = `/sites/generate?siteId=${site.documentId}`
    } catch (err) {
      console.error('Error redirecting to rebuild:', err)
      alert('Ошибка при переходе к пересборке')
    } finally {
      setActionLoading(false)
    }
  }

  const activeSites = sites.filter(site => site.statuspbn === 'deployed').length
  const buildingSites = sites.filter(site => site.statuspbn === 'building').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">PBN Manager</span>
            </Link>
            <div className="flex space-x-1">
              <Link href="/sites" className="nav-link-active">Сайты</Link>
              <Link href="/infrastructure" className="nav-link">Инфраструктура</Link>
              <Link href="/content" className="nav-link">Контент</Link>
              <Link href="/monitoring" className="nav-link">Мониторинг</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Управление сайтами"
          description="PBN сайты и брендовые проекты"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Сайты' }
          ]}
          actions={
            <Link href="/sites/new" className="btn-primary">
              🚀 Создать сайт
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всего сайтов"
            value={sites.length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Активных"
            value={activeSites}
            change="+2 за неделю"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="В сборке"
            value={buildingSites}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="PBN сайты"
            value={sites.filter(s => s.template !== 'astro-casino-blog').length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            }
          />
        </div>

        {/* Sites Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Список сайтов</h3>
            <div className="flex space-x-3">
              <select className="input-field text-sm">
                <option>Все типы</option>
                <option>PBN сайты</option>
                <option>Brand сайты</option>
              </select>
              <select className="input-field text-sm">
                <option>Все статусы</option>
                <option>Активные</option>
                <option>В сборке</option>
                <option>Ошибка</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Загрузка сайтов...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchSites}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Попробовать снова
              </button>
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Сайты не найдены</p>
              <Link 
                href="/sites/new"
                className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Создать первый сайт
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сайт
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Домен
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Создан
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200">
                  {sites.map((site) => (
                    <tr key={site.id} className="hover:bg-blue-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              site.template === 'astro-casino-blog'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-600'
                            }`}>
                              <span className="text-white font-semibold text-sm">
                                {site.template === 'astro-casino-blog' ? 'B' : 'P'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{site.name}</div>
                            <div className="text-sm text-gray-500">ID: {site.documentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          site.template === 'astro-casino-blog'
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {site.template === 'astro-casino-blog' ? 'Brand' : 'PBN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={site.statuspbn} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {site.domain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(site.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(site)}
                            disabled={actionLoading}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                          >
                            Редактировать
                          </button>
                          <button 
                            onClick={() => handleRebuild(site)}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Пересобрать
                          </button>
                          {site.statuspbn === 'deployed' && (
                            <button 
                              onClick={() => handleDownloadDist(site)}
                              disabled={actionLoading}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            >
                              Скачать ZIP
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(site)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Модальное окно редактирования */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedSite(null)
        }}
        title="Редактировать сайт"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название сайта
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="input-field w-full"
              placeholder="Введите название сайта"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Домен
            </label>
            <input
              type="text"
              value={editForm.domain}
              onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
              className="input-field w-full"
              placeholder="example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Шаблон
            </label>
            <select
              value={editForm.template}
              onChange={(e) => setEditForm({ ...editForm, template: e.target.value })}
              className="input-field w-full"
            >
              <option value="casino-blog">Casino Blog</option>
              <option value="slots-review">Slots Review</option>
              <option value="gaming-news">Gaming News</option>
              <option value="sports-betting">Sports Betting</option>
              <option value="poker-platform">Poker Platform</option>
              <option value="premium-casino">Premium Casino</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={editForm.statuspbn}
              onChange={(e) => setEditForm({ ...editForm, statuspbn: e.target.value })}
              className="input-field w-full"
            >
              <option value="draft">Черновик</option>
              <option value="building">В сборке</option>
              <option value="deployed">Развернут</option>
              <option value="error">Ошибка</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setShowEditModal(false)
                setSelectedSite(null)
              }}
              className="btn-secondary"
              disabled={actionLoading}
            >
              Отмена
            </button>
            <button
              onClick={handleUpdateSite}
              disabled={actionLoading}
              className="btn-primary"
            >
              {actionLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedSite(null)
        }}
        title="Удалить сайт"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Вы уверены, что хотите удалить сайт <strong>{selectedSite?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Это действие нельзя отменить. Все данные сайта будут удалены безвозвратно.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedSite(null)
              }}
              className="btn-secondary"
              disabled={actionLoading}
            >
              Отмена
            </button>
            <button
              onClick={handleDeleteSite}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {actionLoading ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 