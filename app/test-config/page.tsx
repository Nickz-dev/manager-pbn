'use client'

import { useState, useEffect } from 'react'

export default function TestConfigPage() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/auth/test-config')
        const data = await response.json()
        setConfig(data)
      } catch (error) {
        console.error('Ошибка проверки конфигурации:', error)
      } finally {
        setLoading(false)
      }
    }

    checkConfig()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка конфигурации...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Ошибка загрузки конфигурации</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Тест конфигурации авторизации
          </h1>
          <p className="text-gray-600">
            Проверка настроек системы авторизации
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Статус конфигурации */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Статус конфигурации</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Общий статус:</span>
                <span className={config.configured ? 'text-green-600' : 'text-red-600'}>
                  {config.configured ? '✅ Настроена' : '❌ Ошибки'}
                </span>
              </div>
              
              {config.errors && config.errors.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-red-600 mb-2">Ошибки:</h3>
                  <ul className="space-y-1">
                    {config.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-600">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Переменные окружения */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Переменные окружения</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">JWT_SECRET:</span>
                <span className={config.environment.hasJwtSecret ? 'text-green-600' : 'text-red-600'}>
                  {config.environment.hasJwtSecret ? '✅ Установлен' : '❌ Отсутствует'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Длина JWT_SECRET:</span>
                <span className={config.environment.jwtSecretLength >= 32 ? 'text-green-600' : 'text-red-600'}>
                  {config.environment.jwtSecretLength} символов
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">ADMIN_EMAIL:</span>
                <span className={config.environment.hasAdminEmail ? 'text-green-600' : 'text-red-600'}>
                  {config.environment.hasAdminEmail ? '✅ Установлен' : '❌ Отсутствует'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">ADMIN_PASSWORD_HASH:</span>
                <span className={config.environment.hasAdminPasswordHash ? 'text-green-600' : 'text-red-600'}>
                  {config.environment.hasAdminPasswordHash ? '✅ Установлен' : '❌ Отсутствует'}
                </span>
              </div>
            </div>
          </div>

          {/* Тест хеширования */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Тест хеширования</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Статус:</span>
                <span className={config.hashTest?.success ? 'text-green-600' : 'text-red-600'}>
                  {config.hashTest?.success ? '✅ Успешно' : '❌ Ошибка'}
                </span>
              </div>
              
              {config.hashTest?.success && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Тестовый хеш:</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block mt-1 break-all">
                    {config.hashTest.hash}
                  </code>
                </div>
              )}
              
              {config.hashTest?.error && (
                <div className="mt-2">
                  <p className="text-sm text-red-600">Ошибка: {config.hashTest.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Рекомендации */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Рекомендации</h2>
            <div className="space-y-2">
              {config.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Дополнительная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium">NODE_ENV:</span>
              <span className="ml-2 text-gray-600">{config.environment.nodeEnv || 'не установлен'}</span>
            </div>
            <div>
              <span className="font-medium">VPS_ADDRESS:</span>
              <span className="ml-2 text-gray-600">{config.environment.vpsAddress || 'не установлен'}</span>
            </div>
            <div>
              <span className="font-medium">PORT:</span>
              <span className="ml-2 text-gray-600">{config.environment.port || 'не установлен'}</span>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Перейти к логину
            </a>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              На главную
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 