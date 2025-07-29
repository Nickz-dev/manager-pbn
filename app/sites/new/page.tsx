'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NewSitePage() {
  const [siteType, setSiteType] = useState<'pbn' | 'brand'>('pbn')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('casino-blog')
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    vps: '',
    template: 'casino-blog',
    language: 'ru',
    title: '',
    description: '',
    keywords: '',
    aiGeneration: false,
    contentCount: 10,
    publicationSchedule: 'daily'
  })

  const [isLoading, setIsLoading] = useState(false)

  // Восстановленные состояния для статей и категорий
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<any[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState<string>('')
  const [authors, setAuthors] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<string>('')
  const [pbnSites, setPbnSites] = useState<any[]>([])
  
  // Состояния для доменов и VPS серверов (временно отключены)
  // TODO: Включить обратно после исправления сборки и превью
  const [domains, setDomains] = useState<any[]>([])
  const [vpsServers, setVpsServers] = useState<any[]>([])

  // Загрузка данных
  useEffect(() => {
    // Временно отключаем загрузку доменов и VPS для ручного заполнения
    // TODO: Включить обратно после исправления сборки и превью
    /*
    fetch('/api/infrastructure/domains')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.domains)) {
          setDomains(data.domains)
        }
      })
      .catch(() => setDomains([]))
    
    fetch('/api/infrastructure/vps')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.vpsServers)) {
          setVpsServers(data.vpsServers)
        }
      })
      .catch(() => setVpsServers([]))
    */
    
    if (siteType === 'pbn') {
      // Всегда загружаем статьи, фильтрация происходит в компоненте
      fetch('/api/content/articles')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.articles)) {
            setArticles(data.articles)
          }
        })
        .catch(() => setArticles([]))
      
      fetch('/api/content/categories')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.categories)) {
            setCategories(data.categories)
          }
        })
        .catch(() => setCategories([]))
      fetch('/api/content/authors')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.authors)) {
            setAuthors(data.authors)
          }
        })
        .catch(() => setAuthors([]))
      fetch('/api/sites')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.sites)) {
            setPbnSites(data.sites)
          }
        })
        .catch(() => setPbnSites([]))
    } else {
      setArticles([])
      setCategories([])
      setAuthors([])
      setPbnSites([])
    }
  }, [siteType])

  // Синхронизация шаблона при изменении типа сайта
  useEffect(() => {
    console.log('🔄 Site type changed to:', siteType)
    if (siteType === 'pbn') {
      const defaultTemplate = 'casino-blog'
      console.log('🔄 Setting PBN template to:', defaultTemplate)
      setSelectedTemplate(defaultTemplate)
      updateFormData('template', defaultTemplate)
    } else {
      const defaultTemplate = 'premium-casino'
      console.log('🔄 Setting BRAND template to:', defaultTemplate)
      setSelectedTemplate(defaultTemplate)
      updateFormData('template', defaultTemplate)
    }
  }, [siteType])

  // Определяем тип сайта на основе выбранного шаблона
  const getSiteTypeFromTemplate = (template: string) => {
    // Принудительно задаем BRAND только для astro-casino-blog, остальные - PBN
    if (template === 'astro-casino-blog') {
      return 'brand'
    } else {
      return 'pbn' // Все остальные шаблоны - PBN
    }
  }

  // Обновляем тип сайта при изменении шаблона
  useEffect(() => {
    if (formData.template) {
      const newSiteType = getSiteTypeFromTemplate(formData.template)
      console.log('🔄 Template changed to:', formData.template, 'Site type determined:', newSiteType)
      if (newSiteType !== siteType) {
        console.log('🔄 Updating site type from', siteType, 'to', newSiteType)
        setSiteType(newSiteType)
      }
    }
  }, [formData.template])

  // Обновляем selectedTemplate при изменении formData.template
  useEffect(() => {
    console.log('🔄 FormData template changed to:', formData.template)
    setSelectedTemplate(formData.template)
  }, [formData.template])

  // Добавляем эффект для логирования изменений
  useEffect(() => {
    console.log('🔄 Current state:', {
      siteType,
      selectedTemplate,
      formDataTemplate: formData.template
    })
  }, [siteType, selectedTemplate, formData.template])

  // Фильтрация статей по категории, автору и сайту
  const filteredArticles = articles.filter(article => {
    // Фильтр по категории
    if (selectedCategory && selectedCategory !== '') {
      const hasCategory = Array.isArray(article.content_categories) &&
        article.content_categories.some((cat: any) => String(cat.documentId) === String(selectedCategory));
      if (!hasCategory) return false;
    }
    
    // Фильтр по автору
    if (selectedAuthor && selectedAuthor !== '') {
      const articleAuthorId = article.content_author?.documentId || article.content_author?.id;
      if (String(articleAuthorId) !== String(selectedAuthor)) return false;
    }
    
    // Фильтр по сайту
    if (selectedSite && selectedSite !== '') {
      // Если выбран сайт, показываем статьи, привязанные к этому сайту
      const articleSiteId = article.pbn_site?.documentId || article.pbn_site?.id;
      if (String(articleSiteId) !== String(selectedSite)) return false;
    }
    // Если сайт не выбран, показываем все статьи (и с привязкой, и без)
    
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Определяем тип сайта на основе выбранного шаблона
      const determinedSiteType = getSiteTypeFromTemplate(formData.template)
      
      // Map form data to API format
      const siteData = {
        type: determinedSiteType, // Используем только базовый тип (pbn/brand)
        template: formData.template,
        domain: formData.domain,
        siteName: formData.name || formData.title,
        description: formData.description,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        theme: 'light',
        // Добавляем выбранные статьи
        selectedArticles: selectedArticles,
        content: {
          featured: [],
          recent: [],
          categories: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
          ...(formData.template.includes('casino') ? {
            casino: {
              welcomeBonus: '100% up to $1000',
              freeSpins: 50,
              minDeposit: '$20',
              currency: 'USD',
              license: 'Gaming License',
              rating: 4.8
            }
          } : {}),
          ...(formData.template === 'news' ? {
            hasBreaking: true
          } : {})
        },
        settings: {
          analytics: {
            googleAnalytics: 'GA_MEASUREMENT_ID'
          }
        }
      }

      console.log('🚀 Creating site with data:', {
        originalSiteType: siteType,
        determinedSiteType,
        template: formData.template,
        selectedTemplate,
        type: siteData.type,
        fullSiteData: siteData
      })

      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteData)
      })

      const result = await response.json()

      if (response.ok) {
        const siteId = result.site.id
        
        console.log('✅ Site created successfully:', {
          siteId,
          determinedSiteType,
          template: formData.template,
          type: siteData.type
        })
        
        // Перенаправляем на промежуточную страницу для предварительного просмотра и сборки
        window.location.href = `/sites/generate?siteId=${siteId}`
      } else {
        throw new Error(result.error || 'Ошибка создания сайта')
      }
    } catch (error) {
      console.error('Error creating site:', error)
      alert(`❌ Ошибка: ${error instanceof Error ? error.message : 'Не удалось создать сайт'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
          title="Создание нового сайта"
          description="Настройка PBN или Brand сайта с автоматической генерацией контента"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Сайты', href: '/sites' },
            { label: 'Создать сайт' }
          ]}
          actions={
            <Link href="/sites" className="btn-secondary">
              ← Назад к сайтам
            </Link>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Site Type Selection */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Тип сайта</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  siteType === 'pbn' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSiteType('pbn')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <input 
                    type="radio" 
                    name="siteType" 
                    value="pbn" 
                    checked={siteType === 'pbn'}
                    onChange={() => setSiteType('pbn')}
                    className="text-blue-600"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">PBN Сайт</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Автоматический сайт для Private Blog Network с AI-генерацией контента и кросс-линкингом
                </p>
                <div className="text-xs text-gray-500">
                  • Astro статический генератор<br/>
                  • Автоматическая публикация<br/>
                  • SEO оптимизация<br/>
                  • Управляемый линкинг
                </div>
              </div>

              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  siteType === 'brand' 
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSiteType('brand')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input 
                    type="radio" 
                    name="siteType" 
                    value="brand" 
                    checked={siteType === 'brand'}
                    onChange={() => setSiteType('brand')}
                    className="text-emerald-600"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Brand Сайт</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Полноценный бренд-сайт с интерактивными функциями, платежами и ручным контентом
                </p>
                <div className="text-xs text-gray-500">
                  • Next.js SSR приложение<br/>
                  • Интерактивные компоненты<br/>
                  • Платежные системы<br/>
                  • Ручная модерация контента
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название сайта
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например: Casino Blog"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Домен
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например: example.com"
                  value={formData.domain}
                  onChange={(e) => updateFormData('domain', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Введите домен вручную (пока CRUD не готов)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VPS Сервер
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например: VPS-01 или IP адрес"
                  value={formData.vps}
                  onChange={(e) => updateFormData('vps', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Введите VPS сервер вручную (пока CRUD не готов)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Язык
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.language}
                  onChange={(e) => updateFormData('language', e.target.value)}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Template & Theme */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {siteType === 'pbn' ? 'Шаблон Astro' : 'Тема Next.js'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Casino Blog Template */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === 'casino-blog' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-500'
                }`}
                onClick={() => {
                  setSelectedTemplate('casino-blog')
                  updateFormData('template', 'casino-blog')
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-lg">🎰 Casino Blog</span>
                </div>
                <h4 className="font-medium text-gray-900">Casino Blog Template</h4>
                <p className="text-sm text-gray-500">Классический блог для казино</p>
                {selectedTemplate === 'casino-blog' && (
                  <div className="mt-2 text-xs text-blue-600 font-medium">✓ Выбран</div>
                )}
              </div>

              {/* Slots Review Template */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === 'slots-review' 
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' 
                    : 'border-gray-200 hover:border-emerald-500'
                }`}
                onClick={() => {
                  setSelectedTemplate('slots-review')
                  updateFormData('template', 'slots-review')
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-emerald-600 font-medium text-lg">🎰 Slots Review</span>
                </div>
                <h4 className="font-medium text-gray-900">Slots Review Template</h4>
                <p className="text-sm text-gray-500">Обзоры игровых автоматов</p>
                {selectedTemplate === 'slots-review' && (
                  <div className="mt-2 text-xs text-emerald-600 font-medium">✓ Выбран</div>
                )}
              </div>

              {/* Gaming News Template */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === 'gaming-news' 
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-purple-500'
                }`}
                onClick={() => {
                  setSelectedTemplate('gaming-news')
                  updateFormData('template', 'gaming-news')
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-purple-600 font-medium text-lg">🎮 Gaming News</span>
                </div>
                <h4 className="font-medium text-gray-900">Gaming News Template</h4>
                <p className="text-sm text-gray-500">Новости азартных игр</p>
                {selectedTemplate === 'gaming-news' && (
                  <div className="mt-2 text-xs text-purple-600 font-medium">✓ Выбран</div>
                )}
              </div>

              {/* Sports Betting Template */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === 'sports-betting' 
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                    : 'border-gray-200 hover:border-orange-500'
                }`}
                onClick={() => {
                  setSelectedTemplate('sports-betting')
                  updateFormData('template', 'sports-betting')
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-orange-50 to-red-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-orange-600 font-medium text-lg">⚽ Sports Betting</span>
                </div>
                <h4 className="font-medium text-gray-900">Sports Betting Template</h4>
                <p className="text-sm text-gray-500">Ставки на спорт</p>
                {selectedTemplate === 'sports-betting' && (
                  <div className="mt-2 text-xs text-orange-600 font-medium">✓ Выбран</div>
                )}
              </div>

              {/* Poker Platform Template */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === 'poker-platform' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-500'
                }`}
                onClick={() => {
                  setSelectedTemplate('poker-platform')
                  updateFormData('template', 'poker-platform')
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-lg">♠️ Poker Platform</span>
                </div>
                <h4 className="font-medium text-gray-900">Poker Platform Template</h4>
                <p className="text-sm text-gray-500">Платформа для покера</p>
                {selectedTemplate === 'poker-platform' && (
                  <div className="mt-2 text-xs text-blue-600 font-medium">✓ Выбран</div>
                )}
              </div>

              {/* Premium Casino Template */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === 'premium-casino' 
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' 
                    : 'border-gray-200 hover:border-emerald-500'
                }`}
                onClick={() => {
                  setSelectedTemplate('premium-casino')
                  updateFormData('template', 'premium-casino')
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-50 to-teal-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-emerald-600 font-medium text-lg">💎 Premium Casino</span>
                </div>
                <h4 className="font-medium text-gray-900">Premium Casino Template</h4>
                <p className="text-sm text-gray-500">Премиум тема для казино</p>
                {selectedTemplate === 'premium-casino' && (
                  <div className="mt-2 text-xs text-emerald-600 font-medium">✓ Выбран</div>
                )}
              </div>
            </div>
          </div>

          {/* Блок выбора статей и фильтров (только для PBN) */}
          {siteType === 'pbn' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Выбор статей для сайта</h3>
              
              {/* Фильтры */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Фильтр по категории</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Все категории</option>
                    {categories.map((cat: any) => (
                      <option key={cat.documentId || cat.id} value={cat.documentId || cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Фильтр по автору</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedAuthor}
                    onChange={e => setSelectedAuthor(e.target.value)}
                  >
                    <option value="">Все авторы</option>
                    {authors.map((author: any) => (
                      <option key={author.documentId || author.id} value={author.documentId || author.id}>{author.name}</option>
                    ))}
                  </select>
                </div>
                
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Фильтр по сайту</label>
                   <select
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     value={selectedSite}
                     onChange={e => setSelectedSite(e.target.value)}
                   >
                     <option value="">Все сайты</option>
                     {pbnSites.map((site: any) => (
                       <option key={site.documentId || site.id} value={site.documentId || site.id}>
                         {site.name}
                       </option>
                     ))}
                   </select>
                 </div>
              </div>
              
              {/* Счетчик выбранных статей */}
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Найдено статей: {filteredArticles.length}
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  Выбрано: {selectedArticles.length}
                </span>
              </div>
              
                             {/* Список статей */}
               <div className="max-h-64 overflow-y-auto border rounded-lg p-2 bg-white">
                 {filteredArticles.length === 0 ? (
                   <div className="text-gray-500 text-sm text-center py-4">Нет доступных статей для выбора</div>
                 ) : (
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                     {filteredArticles.map(article => (
                       <li key={article.id} className="flex items-start py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-2">
                         <input
                           type="checkbox"
                           className="mt-1 mr-3"
                           checked={selectedArticles.includes(article.id)}
                           onChange={e => {
                             if (e.target.checked) {
                               setSelectedArticles(prev => [...prev, article.id])
                             } else {
                               setSelectedArticles(prev => prev.filter(id => id !== article.id))
                             }
                           }}
                         />
                         <div className="flex-1">
                           <div className="font-medium text-gray-900 text-sm">{article.title}</div>
                           <div className="text-xs text-gray-500 mt-1">
                             {Array.isArray(article.content_categories) && article.content_categories.length > 0 && (
                               <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                 {article.content_categories.map((cat: any) => cat.name).join(', ')}
                               </span>
                             )}
                             {article.content_author && (
                               <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                                 {article.content_author.name}
                               </span>
                             )}
                                                           {article.statusarticles && (
                                <span className={`inline-block px-2 py-1 rounded ${
                                  article.statusarticles === 'published' ? 'bg-green-100 text-green-800' :
                                  article.statusarticles === 'ai' ? 'bg-purple-100 text-purple-800' :
                                  article.statusarticles === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {article.statusarticles === 'published' ? 'Опубликовано' :
                                   article.statusarticles === 'ai' ? 'AI Генерация' :
                                   article.statusarticles === 'draft' ? 'Черновик' :
                                   article.statusarticles}
                                </span>
                              )}
                              {article.pbn_site && (
                                <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2">
                                  {article.pbn_site.name}
                                </span>
                              )}
                           </div>
                         </div>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
              
              {/* Кнопки управления выбором */}
              {filteredArticles.length > 0 && (
                <div className="mt-4 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = filteredArticles.map(article => article.id)
                      setSelectedArticles(allIds)
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Выбрать все
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedArticles([])}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Снять выбор
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SEO Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO настройки</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок сайта (Title)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Лучшие онлайн казино России - Обзоры и рейтинги"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание сайта (Description)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Честные обзоры лучших онлайн казино с быстрыми выплатами и щедрыми бонусами"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ключевые слова
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="онлайн казино, игровые автоматы, бонусы, рейтинг казино"
                  value={formData.keywords}
                  onChange={(e) => updateFormData('keywords', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* AI Generation Settings (only for PBN) */}
          {siteType === 'pbn' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">AI генерация контента</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Включить автоматическую генерацию</h4>
                    <p className="text-sm text-gray-500">AI будет регулярно создавать новый контент для сайта</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.aiGeneration}
                      onChange={(e) => updateFormData('aiGeneration', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {formData.aiGeneration && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Количество статей для старта
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.contentCount}
                        onChange={(e) => updateFormData('contentCount', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        График публикации
                      </label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.publicationSchedule}
                        onChange={(e) => updateFormData('publicationSchedule', e.target.value)}
                      >
                        <option value="daily">Ежедневно</option>
                        <option value="3days">Каждые 3 дня</option>
                        <option value="weekly">Еженедельно</option>
                        <option value="biweekly">Раз в 2 недели</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

           {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary flex-1 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Создание сайта...
                </>
              ) : (
                <>🚀 Создать {siteType === 'pbn' ? 'PBN' : 'Brand'} сайт</>
              )}
            </button>
            <Link 
              href="/sites" 
              className={`btn-secondary ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
            >
              Отмена
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

/*
TODO: После исправления сборки и превью на VPS:
1. Раскомментировать загрузку доменов и VPS серверов в useEffect
2. Заменить текстовые поля обратно на select с данными из API
3. Убрать комментарии о ручном вводе
4. Протестировать создание сайтов с реальными данными
*/ 