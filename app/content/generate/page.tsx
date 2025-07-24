'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ContentGeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [contentType, setContentType] = useState('article')
  const [language, setLanguage] = useState('ru')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [selectedSite, setSelectedSite] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Создай ${contentType} на тему: "${prompt}". Тон: ${tone}. Длина: ${length}. Язык: ${language}. Для сайта казино/азартных игр.`
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setGeneratedContent(data.generatedText)
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
                  Целевой сайт
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                >
                  <option value="">Выберите сайт</option>
                  <option value="casino-blog.com">casino-blog.com (PBN)</option>
                  <option value="best-slots.net">best-slots.net (PBN)</option>
                  <option value="casino-reviews.org">casino-reviews.org (Brand)</option>
                </select>
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
                  placeholder="Опишите тему для генерации контента (например: 'Лучшие онлайн слоты с высоким RTP в 2024 году')"
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
                    <option value="short">Короткая (~500 слов)</option>
                    <option value="medium">Средняя (~1000 слов)</option>
                    <option value="long">Длинная (~2000 слов)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
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

              {/* Additional Options */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Дополнительные опции</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-600">Включить SEO-оптимизацию</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-600">Добавить внутренние ссылки</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-600">Сгенерировать мета-описание</span>
                  </label>
                </div>
              </div>
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
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {generatedContent}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="btn-primary">
                    💾 Сохранить в Strapi
                  </button>
                  <button className="btn-secondary">
                    📝 Редактировать
                  </button>
                  <button className="btn-secondary">
                    🔄 Перегенерировать
                  </button>
                  <button className="btn-secondary">
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
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">Лучшие онлайн казино с быстрыми выплатами</h4>
                  <p className="text-sm text-gray-500 mt-1">casino-blog.com • Статья • 15 мин назад</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Просмотр</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Опубликовать</button>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">Обзор слотов NetEnt: топ игр 2024</h4>
                  <p className="text-sm text-gray-500 mt-1">best-slots.net • Обзор • 1 час назад</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Просмотр</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Опубликовать</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 