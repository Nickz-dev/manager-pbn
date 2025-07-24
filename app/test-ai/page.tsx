'use client'

import { useState } from 'react'

export default function TestAIPage() {
  const [prompt, setPrompt] = useState('Напиши краткий обзор лучших онлайн казино для новичков')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testAI = async () => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.generatedText)
        console.log('Usage:', data.usage)
        console.log('Model:', data.model)
      } else {
        setError(data.error || 'Произошла ошибка')
      }
    } catch (err: any) {
      setError('Ошибка подключения: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🤖 Тест OpenAI API</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Промпт для AI:
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Введите ваш промпт..."
              />
            </div>

            <button
              onClick={testAI}
              disabled={loading || !prompt.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Генерация...
                </div>
              ) : (
                '✨ Тестировать AI генерацию'
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <strong>Ошибка:</strong> {error}
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Результат генерации:</h3>
                <div className="text-gray-700 whitespace-pre-wrap">{result}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Информация о настройке</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? '✅ Настроен' : '❌ Не настроен'}</p>
            <p><strong>Модель:</strong> GPT-4</p>
            <p><strong>Max tokens:</strong> 500</p>
            <p><strong>Temperature:</strong> 0.7</p>
          </div>
        </div>
      </div>
    </div>
  )
} 