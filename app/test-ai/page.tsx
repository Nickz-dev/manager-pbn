'use client'

import { useState } from 'react'

export default function TestAIPage() {
  const [prompt, setPrompt] = useState('Напиши краткий обзор лучших онлайн казино для новичков')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // AI Model Parameters
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4000)
  const [topP, setTopP] = useState(0.9)
  const [storeLogs, setStoreLogs] = useState(true)

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
        body: JSON.stringify({ 
          prompt,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          store_logs: storeLogs
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.generatedText)
        console.log('Usage:', data.usage)
        console.log('Model:', data.model)
        console.log('Parameters:', data.parameters)
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

            {/* AI Model Parameters */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Параметры AI модели</h4>
              
              <div className="space-y-4">
                {/* Temperature */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Temperature (креативность)
                    </label>
                    <span className="text-sm text-gray-500">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Консервативный</span>
                    <span>Сбалансированный</span>
                    <span>Креативный</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Max Tokens (максимум символов)
                    </label>
                    <span className="text-sm text-gray-500">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="8000"
                    step="500"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Короткий</span>
                    <span>Средний</span>
                    <span>Длинный</span>
                  </div>
                </div>

                {/* Top P */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Top P (разнообразие)
                    </label>
                    <span className="text-sm text-gray-500">{topP}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Фокус</span>
                    <span>Сбалансированный</span>
                    <span>Разнообразие</span>
                  </div>
                </div>

                {/* Store Logs */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="storeLogs"
                    checked={storeLogs}
                    onChange={(e) => setStoreLogs(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="storeLogs" className="ml-2 text-sm text-gray-700">
                    Сохранять логи генерации
                  </label>
                </div>
              </div>
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
            <p><strong>Max tokens:</strong> {maxTokens}</p>
            <p><strong>Temperature:</strong> {temperature}</p>
            <p><strong>Top P:</strong> {topP}</p>
            <p><strong>Store Logs:</strong> {storeLogs ? '✅ Включено' : '❌ Выключено'}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 