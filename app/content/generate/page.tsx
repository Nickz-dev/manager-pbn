'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

interface Author {
  id: number
  documentId: string
  name: string
  email: string
  bio: string
}

interface Category {
  id: number
  documentId: string
  name: string
  slug: string
  description: string
}

interface PbnSite {
  id: number
  documentId: string
  name: string
  url: string
  status: string
}

export default function ContentGeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [contentType, setContentType] = useState('article')
  const [language, setLanguage] = useState('ru')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [selectedSite, setSelectedSite] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [generatedExcerpt, setGeneratedExcerpt] = useState('')
  const [generatedMetaTitle, setGeneratedMetaTitle] = useState('')
  const [generatedMetaDescription, setGeneratedMetaDescription] = useState('')
  
  // Data from Strapi
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pbnSites, setPbnSites] = useState<PbnSite[]>([])
  const [recentGenerations, setRecentGenerations] = useState<any[]>([])

  // Load data from Strapi
  useEffect(() => {
    const loadData = async () => {
      try {
        const [authorsRes, categoriesRes, pbnSitesRes] = await Promise.all([
          fetch('/api/content/authors'),
          fetch('/api/content/categories'),
          fetch('/api/sites')
        ])

        if (authorsRes.ok) {
          const authorsData = await authorsRes.json()
          setAuthors(authorsData.authors || [])
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.categories || [])
        }

        if (pbnSitesRes.ok) {
          const sitesData = await pbnSitesRes.json()
          setPbnSites(sitesData.sites || [])
        }

        // Проверяем параметр rewrite для рерайта статьи
        const urlParams = new URLSearchParams(window.location.search)
        const rewriteId = urlParams.get('rewrite')
        
        if (rewriteId) {
          try {
            const articleRes = await fetch(`/api/content/articles/${rewriteId}`)
            if (articleRes.ok) {
              const articleData = await articleRes.json()
              const article = articleData.article
              
              // Заполняем форму данными для рерайта
              setPrompt(`Рерайт статьи: ${article.title}`)
              setGeneratedTitle(article.title)
              setGeneratedExcerpt(article.excerpt)
              setGeneratedContent(article.content)
              setGeneratedMetaTitle(article.meta_title)
              setGeneratedMetaDescription(article.meta_description)
              
              // Устанавливаем связанные данные
              if (article.content_author) {
                setSelectedAuthor(article.content_author.id)
              }
              if (article.pbn_site) {
                setSelectedSite(article.pbn_site.id)
              }
              if (article.content_categories) {
                setSelectedCategories(article.content_categories.map((cat: any) => cat.id))
              }
            }
          } catch (error) {
            console.error('Error loading article for rewrite:', error)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
             // Улучшенный промпт с более четкими инструкциями
       const lengthWords = {
         short: '800',
         medium: '2000', 
         long: '8000'
       }
      
      let enhancedPrompt = ''
      
             if (sourceUrl && sourceUrl.trim()) {
         // Рерайт по URL
         enhancedPrompt = `Проанализируй статью по ссылке: ${sourceUrl}

Создай качественный рерайт этой статьи с требованиями:
- Тон: ${tone}
- Длина: ${lengthWords[length as keyof typeof lengthWords]} слов
- Язык: ${language}
- Тематика: казино/азартные игры/спортивные ставки
- Полностью переписывай текст, сохраняя основную идею
- Структура: введение, основная часть, заключение
- Стиль: информативный, но увлекательный

ВАЖНО: Верни ответ ТОЛЬКО в формате JSON без дополнительного текста, комментариев или markdown разметки:

{
  "title": "Новый заголовок статьи",
  "excerpt": "Краткое описание 2-3 предложения",
  "content": "Полный переписанный текст с HTML-разметкой для параграфов <p> и заголовков <h2>",
  "meta_title": "SEO заголовок до 60 символов",
  "meta_description": "SEO описание до 160 символов"
}`
             } else if (generatedContent && generatedContent.trim()) {
         // Рерайт существующей статьи
         enhancedPrompt = `Создай качественный рерайт этой статьи:

Оригинальный заголовок: ${generatedTitle}
Оригинальное содержание: ${generatedContent}

Требования для рерайта:
- Тон: ${tone}
- Длина: ${lengthWords[length as keyof typeof lengthWords]} слов
- Язык: ${language}
- Тематика: казино/азартные игры/спортивные ставки
- Полностью переписывай текст, сохраняя основную идею и факты
- Структура: введение, основная часть, заключение
- Стиль: информативный, но увлекательный
- Избегай дублирования оригинальных фраз

ВАЖНО: Верни ответ ТОЛЬКО в формате JSON без дополнительного текста, комментариев или markdown разметки:

{
  "title": "Новый заголовок статьи",
  "excerpt": "Краткое описание 2-3 предложения",
  "content": "Полный переписанный текст с HTML-разметкой для параграфов <p> и заголовков <h2>",
  "meta_title": "SEO заголовок до 60 символов",
  "meta_description": "SEO описание до 160 символов"
}`
             } else {
         // Обычная генерация по теме
         enhancedPrompt = `Создай качественную ${contentType} на тему: "${prompt}". 

Требования:
- Тон: ${tone}
- Длина: ${lengthWords[length as keyof typeof lengthWords]} слов
- Язык: ${language}
- Тематика: казино/азартные игры/спортивные ставки
- Структура: введение, основная часть, заключение
- Стиль: информативный, но увлекательный

ВАЖНО: Верни ответ ТОЛЬКО в формате JSON без дополнительного текста, комментариев или markdown разметки:

{
  "title": "Заголовок статьи",
  "excerpt": "Краткое описание 2-3 предложения",
  "content": "Полный текст статьи с HTML-разметкой для параграфов <p> и заголовков <h2>",
  "meta_title": "SEO заголовок до 60 символов",
  "meta_description": "SEO описание до 160 символов"
}`
      }

      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: enhancedPrompt
        }),
      })

             const data = await response.json()
       if (response.ok) {
         try {
           // Очищаем ответ от возможных лишних символов
           let cleanText = data.generatedText.trim()
           
           // Убираем возможные префиксы типа "```json" и "```"
           cleanText = cleanText.replace(/^```json\s*/, '').replace(/```\s*$/, '')
           
           // Ищем JSON объект в тексте (может быть обернут в markdown)
           const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
           if (jsonMatch) {
             cleanText = jsonMatch[0]
           }
           
           // Пытаемся распарсить JSON ответ
           const parsedContent = JSON.parse(cleanText)
           
           // Проверяем и устанавливаем значения
           setGeneratedTitle(parsedContent.title || '')
           setGeneratedExcerpt(parsedContent.excerpt || '')
           setGeneratedContent(parsedContent.content || '')
           setGeneratedMetaTitle(parsedContent.meta_title || parsedContent.title || '')
           setGeneratedMetaDescription(parsedContent.meta_description || parsedContent.excerpt || '')
           
         } catch (parseError) {
           console.error('JSON parse error:', parseError)
           console.error('Raw AI response:', data.generatedText)
           // Если не удалось распарсить JSON, показываем ошибку с более подробной информацией
           setGeneratedContent(`Ошибка парсинга ответа AI. Полученный текст:\n\n${data.generatedText}\n\nПопробуйте перегенерировать контент.`)
           setGeneratedTitle('')
           setGeneratedExcerpt('')
           setGeneratedMetaTitle('')
           setGeneratedMetaDescription('')
         }
      } else {
        console.error('Generation failed:', data.error)
        setGeneratedContent('Ошибка генерации: ' + data.error)
      }
    } catch (error: any) {
      console.error('Network error:', error)
      setGeneratedContent('Ошибка сети: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveToStrapi = async () => {
    if (!generatedContent) return
    
    setIsSaving(true)
    try {
      const articleData = {
        title: generatedTitle || 'Без заголовка',
        content: generatedContent,
        excerpt: generatedExcerpt || '',
        meta_title: generatedMetaTitle || generatedTitle || 'Без заголовка',
        meta_description: generatedMetaDescription || generatedExcerpt || '',
        statusarticles: 'ai',
        content_categories: selectedCategories.map(id => {
          const category = categories.find(c => c.documentId === id)
          return category ? category.id : id
        }),
        content_author: selectedAuthor ? 
          authors.find(a => a.documentId === selectedAuthor)?.id || selectedAuthor : 
          undefined,
        pbn_site: selectedSite ? 
          pbnSites.find(s => s.documentId === selectedSite)?.id || selectedSite : 
          undefined
      }

      const response = await fetch('/api/content/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      })

      if (response.ok) {
        const savedArticle = await response.json()
        alert('Статья успешно сохранена в Strapi!')
        
        // Добавляем в список последних генераций
        setRecentGenerations(prev => [{
          id: savedArticle.article.id,
          title: generatedTitle || 'Без заголовка',
          site: pbnSites.find(s => s.documentId === selectedSite)?.name || selectedSite,
          type: contentType,
          createdAt: new Date().toISOString()
        }, ...prev.slice(0, 4)])
        
        // Очищаем форму
        setGeneratedContent('')
        setGeneratedTitle('')
        setGeneratedExcerpt('')
        setGeneratedMetaTitle('')
        setGeneratedMetaDescription('')
      } else {
        const errorData = await response.json()
        alert('Ошибка сохранения: ' + errorData.error)
      }
    } catch (error: any) {
      console.error('Save error:', error)
      alert('Ошибка сохранения: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate()
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
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
              <Link href="/sites" className="nav-link">Сайты</Link>
              <Link href="/infrastructure" className="nav-link">Инфраструктура</Link>
              <Link href="/content" className="nav-link-active">Контент</Link>
              <Link href="/monitoring" className="nav-link">Мониторинг</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="AI Генерация контента"
          description="Создание статей и контента с помощью искусственного интеллекта"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Контент', href: '/content' },
            { label: 'Генерация' }
          ]}
          actions={
            <Link href="/content" className="btn-secondary">
              ← Назад к контенту
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              Настройки генерации
            </h3>

            <div className="space-y-6">
              {/* Site Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Целевой PBN сайт
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                >
                  <option value="">Выберите сайт</option>
                  {pbnSites.map(site => (
                    <option key={site.documentId} value={site.documentId}>
                      {site.name} ({site.url})
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Автор
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                >
                  <option value="">Выберите автора</option>
                  {authors.map(author => (
                    <option key={author.documentId} value={author.documentId}>
                      {author.name} ({author.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Categories Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категории
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {categories.map(category => (
                    <label key={category.documentId} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={selectedCategories.includes(category.documentId)}
                        onChange={() => handleCategoryChange(category.documentId)}
                      />
                      <span className="ml-2 text-sm text-gray-600">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип контента
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="article">Статья</option>
                  <option value="review">Обзор</option>
                  <option value="guide">Руководство</option>
                  <option value="news">Новость</option>
                  <option value="landing">Лендинг</option>
                </select>
              </div>

                             {/* Title */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Заголовок статьи
                 </label>
                 <input
                   type="text"
                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                   value={generatedTitle}
                   onChange={(e) => setGeneratedTitle(e.target.value)}
                   placeholder="Введите заголовок статьи"
                 />
               </div>

               {/* Source URL for rewriting */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   URL статьи для рерайта (опционально)
                 </label>
                 <input
                   type="url"
                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                   value={sourceUrl}
                   onChange={(e) => setSourceUrl(e.target.value)}
                   placeholder="https://example.com/article (для рерайта существующей статьи)"
                 />
               </div>

               {/* Main Topic/Prompt */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Тема контента
                 </label>
                 <textarea
                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                   rows={4}
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="Опишите тему для генерации контента (например: 'Лучшие онлайн слоты с высоким RTP в 2024 году') или оставьте пустым для рерайта по URL"
                 />
               </div>

              {/* Settings Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Язык
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тон
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="professional">Профессиональный</option>
                    <option value="casual">Повседневный</option>
                    <option value="expert">Экспертный</option>
                    <option value="friendly">Дружелюбный</option>
                  </select>
                </div>

                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Длина
                   </label>
                   <select 
                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                     value={length}
                     onChange={(e) => setLength(e.target.value)}
                   >
                     <option value="short">Короткая (~800 слов)</option>
                     <option value="medium">Средняя (~2000 слов)</option>
                     <option value="long">Длинная (~8000 слов)</option>
                   </select>
                 </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt.trim() && !sourceUrl.trim() && !generatedContent.trim())}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Генерирую контент...
                  </div>
                ) : (
                  '✨ Сгенерировать контент'
                )}
              </button>

              {/* Clear Form Button */}
              <button
                onClick={() => {
                  setPrompt('')
                  setSourceUrl('')
                  setGeneratedContent('')
                  setGeneratedTitle('')
                  setGeneratedExcerpt('')
                  setGeneratedMetaTitle('')
                  setGeneratedMetaDescription('')
                  setSelectedAuthor('')
                  setSelectedSite('')
                  setSelectedCategories([])
                }}
                className="w-full btn-secondary"
              >
                🗑️ Очистить форму
              </button>
            </div>
          </div>

          {/* Generated Content Preview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Предварительный просмотр
            </h3>

            {!generatedContent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Сгенерированный контент появится здесь</p>
              </div>
            ) : (
              <div>
                {/* Title */}
                {generatedTitle && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                    <input
                      type="text"
                      value={generatedTitle}
                      onChange={(e) => setGeneratedTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Excerpt */}
                {generatedExcerpt && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Краткое описание</label>
                    <textarea
                      value={generatedExcerpt}
                      onChange={(e) => setGeneratedExcerpt(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Meta Title */}
                {generatedMetaTitle && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={generatedMetaTitle}
                      onChange={(e) => setGeneratedMetaTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Meta Description */}
                {generatedMetaDescription && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      value={generatedMetaDescription}
                      onChange={(e) => setGeneratedMetaDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Содержание</label>
                  <div className="prose max-w-none">
                    <textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={handleSaveToStrapi}
                    disabled={isSaving || !generatedContent}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? '💾 Сохранение...' : '💾 Сохранить в Strapi'}
                  </button>
                  <button 
                    onClick={handleRegenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Перегенерирую...
                      </div>
                    ) : (
                      '🔄 Перегенерировать'
                    )}
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(generatedContent)}
                    className="btn-secondary"
                  >
                    📋 Копировать
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Generations */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Последние генерации</h3>
          <div className="space-y-4">
            {recentGenerations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Нет последних генераций</p>
              </div>
            ) : (
              recentGenerations.map((generation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{generation.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {generation.site} • {generation.type} • {new Date(generation.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/content/articles/${generation.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                        Просмотр
                      </Link>
                      <button className="text-green-600 hover:text-green-800 text-sm">Опубликовать</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 