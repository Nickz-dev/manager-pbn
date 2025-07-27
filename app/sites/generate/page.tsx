'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

interface SitePreview {
  id: string
  name: string
  domain: string
  template: string
  statuspbn: string
  description: string
  config: any
  articles: any[]
  selectedArticles: string[]
  buildUrl?: string
  buildStatus: 'pending' | 'building' | 'success' | 'error'
  buildProgress: number
  buildLogs: string[]
  deploymentInfo?: {
    buildPath?: string
    hasIndex?: boolean
    hasArticles?: boolean
    articleCount?: number
    imagesDownloaded?: number
    totalImages?: number
    error?: string
  }
}

interface BuildStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  progress: number
  message: string
}

export default function GenerateSitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const siteId = searchParams.get('siteId')
  
  const [sitePreview, setSitePreview] = useState<SitePreview | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([
    { id: '1', name: 'Подготовка данных', status: 'pending', progress: 0, message: 'Ожидание...' },
    { id: '2', name: 'Скачивание изображений', status: 'pending', progress: 0, message: 'Ожидание...' },
    { id: '3', name: 'Генерация контента', status: 'pending', progress: 0, message: 'Ожидание...' },
    { id: '4', name: 'Сборка Astro', status: 'pending', progress: 0, message: 'Ожидание...' },
    { id: '5', name: 'Обновление статуса', status: 'pending', progress: 0, message: 'Ожидание...' }
  ])
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildLogs, setBuildLogs] = useState<string[]>([])
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  useEffect(() => {
    if (siteId) {
      loadSitePreview()
    }
  }, [siteId])

  const loadSitePreview = async () => {
    try {
      console.log('Loading site preview for ID:', siteId)
      const response = await fetch(`/api/sites/${siteId}`)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Site data received:', data)
        setSitePreview(data.site)
        setLoadError(null)
      } else {
        setLoadError(`Ошибка загрузки: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setLoadError('Ошибка загрузки: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const startBuild = async () => {
    if (!siteId) return
    
    setIsBuilding(true)
    setBuildLogs([])
    
    // Сбрасываем статусы шагов
    setBuildSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending' as const,
      progress: 0,
      message: 'Ожидание...'
    })))

    try {
      // Запускаем пайплайн сборки
      const response = await fetch('/api/sites/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteId })
      })

      const result = await response.json()

      if (response.ok) {
        // Обновляем статус сайта с информацией о изображениях
        setSitePreview(prev => prev ? {
          ...prev,
          buildUrl: result.buildUrl,
          buildStatus: 'success',
          statuspbn: 'deployed',
          deploymentInfo: {
            ...prev.deploymentInfo,
            imagesDownloaded: result.imagesDownloaded || 0,
            totalImages: result.totalImages || 0
          }
        } : null)

        // Отмечаем все шаги как завершенные
        setBuildSteps(prev => prev.map(step => ({
          ...step,
          status: 'completed' as const,
          progress: 100,
          message: step.name === 'Скачивание изображений' && result.imagesDownloaded 
            ? `Скачано ${result.imagesDownloaded} из ${result.totalImages} изображений`
            : 'Завершено'
        })))

        setBuildLogs(prev => [...prev, '✅ Сборка завершена успешно!'])
      } else {
        throw new Error(result.error || 'Ошибка сборки')
      }
    } catch (error) {
      console.error('Build error:', error)
      setBuildLogs(prev => [...prev, `❌ Ошибка: ${error}`])
      
      // Отмечаем текущий шаг как ошибку
      setBuildSteps(prev => prev.map((step, index) => 
        step.status === 'running' ? {
          ...step,
          status: 'error' as const,
          message: `Ошибка: ${error}`
        } : step
      ))
    } finally {
      setIsBuilding(false)
    }
  }

  const retryBuild = () => {
    startBuild()
  }

  const goToSites = () => {
    router.push('/sites')
  }

  const openPreview = () => {
    if (sitePreview?.buildUrl) {
      window.open(sitePreview.buildUrl, '_blank')
    }
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 text-lg font-semibold">{loadError}</div>
      </div>
    )
  }

  if (!sitePreview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка предварительного просмотра...</p>
        </div>
      </div>
    )
  }

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Предварительный просмотр сайта" 
          description="Проверьте настройки и запустите сборку"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Сайты', href: '/sites' },
            { label: 'Создание', href: '/sites/new' },
            { label: 'Просмотр' }
          ]}
          actions={
            <Link href="/sites" className="btn-secondary">
              ← Назад к сайтам
            </Link>
          }
        />

        <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка - Предварительный просмотр */}
          <div className="space-y-6">
            {/* Информация о сайте */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о сайте</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Название:</span>
                  <span className="font-medium">{sitePreview.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Домен:</span>
                  <span className="font-medium">{sitePreview.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Шаблон:</span>
                  <span className="font-medium">{sitePreview.template}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sitePreview.statuspbn === 'deployed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sitePreview.statuspbn === 'deployed' ? 'Развернут' : 'Черновик'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Выбрано статей:</span>
                  <span className="font-medium">{sitePreview.selectedArticles?.length || 0}</span>
                </div>
                {sitePreview.deploymentInfo?.articleCount !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Собрано страниц:</span>
                    <span className="font-medium">{sitePreview.deploymentInfo.articleCount}</span>
                  </div>
                )}
                {sitePreview.deploymentInfo?.imagesDownloaded !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Скачано изображений:</span>
                    <span className="font-medium">
                      {sitePreview.deploymentInfo.imagesDownloaded} / {sitePreview.deploymentInfo.totalImages || 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Предварительный просмотр */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Предварительный просмотр</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 rounded text-sm ${
                      previewMode === 'desktop' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    🖥️
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`px-3 py-1 rounded text-sm ${
                      previewMode === 'tablet' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    📱
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 rounded text-sm ${
                      previewMode === 'mobile' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    📱
                  </button>
                </div>
              </div>
              
              <div className={`border-2 border-gray-200 rounded-lg overflow-hidden ${
                previewMode === 'desktop' ? 'w-full' :
                previewMode === 'tablet' ? 'w-3/4 mx-auto' :
                'w-1/2 mx-auto'
              }`}>
                <div className="bg-gray-100 p-2 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-600 ml-2">{sitePreview.domain}</div>
                </div>
                <div className="bg-white p-4 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {sitePreview.template === 'casino-blog' && '🎰'}
                      {sitePreview.template === 'slots-review' && '🎰'}
                      {sitePreview.template === 'gaming-news' && '🎮'}
                      {sitePreview.template === 'sports-betting' && '⚽'}
                      {sitePreview.template === 'poker-platform' && '♠️'}
                      {sitePreview.template === 'premium-casino' && '💰'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{sitePreview.name}</h2>
                    <p className="text-gray-600">{sitePreview.description}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      {sitePreview.articles?.length || 0} статей
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Выбранные статьи */}
            {sitePreview.selectedArticles && sitePreview.selectedArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Выбранные статьи ({sitePreview.selectedArticles.length})</h3>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {sitePreview.articles?.filter(article => 
                    sitePreview.selectedArticles.includes(article.id)
                  ).map(article => (
                    <div key={article.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{article.title}</div>
                        <div className="text-xs text-gray-500">
                          {article.content_author?.name && `Автор: ${article.content_author.name}`}
                          {article.content_categories?.length > 0 && (
                            <span className="ml-2">
                              Категории: {article.content_categories.map((cat: any) => cat.name).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Действия */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Действия</h3>
              <div className="space-y-3">
                {sitePreview.buildUrl && (
                  <button
                    onClick={openPreview}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    🌐 Открыть сайт
                  </button>
                )}
                <button
                  onClick={startBuild}
                  disabled={isBuilding}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBuilding ? '🔄 Сборка...' : '🚀 Запустить сборку'}
                </button>
                <button
                  onClick={goToSites}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  📋 К списку сайтов
                </button>
              </div>
            </div>
          </div>

          {/* Правая колонка - Пайплайн сборки */}
          <div className="space-y-6">
            {/* Шаги сборки */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Пайплайн сборки</h3>
              <div className="space-y-4">
                {buildSteps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === 'completed' ? 'bg-green-100 text-green-700' :
                      step.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      step.status === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {step.status === 'completed' ? '✓' :
                       step.status === 'running' ? '⟳' :
                       step.status === 'error' ? '✗' : step.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{step.name}</span>
                        <span className="text-xs text-gray-500">{step.progress}%</span>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              step.status === 'completed' ? 'bg-green-500' :
                              step.status === 'running' ? 'bg-blue-500' :
                              step.status === 'error' ? 'bg-red-500' :
                              'bg-gray-300'
                            }`}
                            style={{ width: `${step.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{step.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Логи сборки */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Логи сборки</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                {buildLogs.length === 0 ? (
                  <div className="text-gray-500">Логи появятся здесь во время сборки...</div>
                ) : (
                  buildLogs.map((log, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Статистика */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{sitePreview.selectedArticles?.length || 0}</div>
                  <div className="text-sm text-gray-600">Выбрано статей</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {buildSteps.filter(s => s.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Шагов выполнено</div>
                </div>
                {sitePreview.deploymentInfo?.articleCount !== undefined && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{sitePreview.deploymentInfo.articleCount}</div>
                    <div className="text-sm text-gray-600">Собрано страниц</div>
                  </div>
                )}
                {sitePreview.deploymentInfo?.imagesDownloaded !== undefined && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{sitePreview.deploymentInfo.imagesDownloaded}</div>
                      <div className="text-sm text-gray-600">Скачано изображений</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{sitePreview.deploymentInfo.totalImages || 0}</div>
                      <div className="text-sm text-gray-600">Всего изображений</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}