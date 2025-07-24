'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NewAccountPage() {
  const [accountType, setAccountType] = useState<'cloudflare' | 'gsc' | 'yandex'>('cloudflare')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apiKey: '',
    clientId: '', // For GSC
    clientSecret: '', // For GSC  
    refreshToken: '', // For GSC
    userId: '' // For Yandex
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adding account:', { type: accountType, ...formData })
    // TODO: Implement API call
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'cloudflare': return 'Cloudflare DNS'
      case 'gsc': return 'Google Search Console'
      case 'yandex': return 'Yandex Webmaster'
      default: return type
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
              <Link href="/infrastructure" className="nav-link-active">Инфраструктура</Link>
              <Link href="/content" className="nav-link">Контент</Link>
              <Link href="/monitoring" className="nav-link">Мониторинг</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Добавить API аккаунт"
          description="Подключение новых аккаунтов Cloudflare, Google Search Console или Yandex Webmaster"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Инфраструктура', href: '/infrastructure' },
            { label: 'API Аккаунты', href: '/infrastructure/accounts' },
            { label: 'Добавить аккаунт' }
          ]}
          actions={
            <Link href="/infrastructure/accounts" className="btn-secondary">
              ← Назад к аккаунтам
            </Link>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Type Selection */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Тип аккаунта</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  accountType === 'cloudflare' 
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setAccountType('cloudflare')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="cloudflare" 
                    checked={accountType === 'cloudflare'}
                    onChange={() => setAccountType('cloudflare')}
                    className="text-orange-600"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Cloudflare DNS</h4>
                <p className="text-sm text-gray-600">
                  Управление DNS записями и настройками домена через Cloudflare API
                </p>
              </div>

              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  accountType === 'gsc' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setAccountType('gsc')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="gsc" 
                    checked={accountType === 'gsc'}
                    onChange={() => setAccountType('gsc')}
                    className="text-blue-600"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Google Search Console</h4>
                <p className="text-sm text-gray-600">
                  Мониторинг индексации и производительности сайтов в Google
                </p>
              </div>

              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  accountType === 'yandex' 
                    ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setAccountType('yandex')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="yandex" 
                    checked={accountType === 'yandex'}
                    onChange={() => setAccountType('yandex')}
                    className="text-red-600"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Yandex Webmaster</h4>
                <p className="text-sm text-gray-600">
                  Управление индексацией и статистикой в поисковой системе Yandex
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название аккаунта
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder={`Main ${getAccountTypeLabel(accountType)} Account`}
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email аккаунта
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="admin@casino-domains.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">API конфигурация</h3>
            
            {accountType === 'cloudflare' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Global API Key
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="cf_*********************xyz"
                    value={formData.apiKey}
                    onChange={(e) => updateFormData('apiKey', e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Найти в: Cloudflare Dashboard → My Profile → API Tokens → Global API Key
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-800 mb-2">Как получить API ключ:</h4>
                  <ol className="text-sm text-orange-700 list-decimal list-inside space-y-1">
                    <li>Войдите в Cloudflare Dashboard</li>
                    <li>Перейдите в My Profile → API Tokens</li>
                    <li>Скопируйте Global API Key</li>
                    <li>Или создайте Custom Token с правами Zone:Read, DNS:Edit</li>
                  </ol>
                </div>
              </div>
            )}

            {accountType === 'gsc' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="gsc_*********************001"
                    value={formData.clientId}
                    onChange={(e) => updateFormData('clientId', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="GOCSPX-*********************"
                    value={formData.clientSecret}
                    onChange={(e) => updateFormData('clientSecret', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refresh Token
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1//*********************"
                    value={formData.refreshToken}
                    onChange={(e) => updateFormData('refreshToken', e.target.value)}
                    required
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Настройка Google Search Console API:</h4>
                  <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                    <li>Создайте проект в Google Cloud Console</li>
                    <li>Включите Search Console API</li>
                    <li>Создайте OAuth 2.0 Client ID</li>
                    <li>Получите Refresh Token через OAuth Flow</li>
                  </ol>
                </div>
              </div>
            )}

            {accountType === 'yandex' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="yx_*********************789"
                    value={formData.apiKey}
                    onChange={(e) => updateFormData('apiKey', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="12345678"
                    value={formData.userId}
                    onChange={(e) => updateFormData('userId', e.target.value)}
                    required
                  />
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Получение Yandex API данных:</h4>
                  <ol className="text-sm text-red-700 list-decimal list-inside space-y-1">
                    <li>Войдите в Yandex Webmaster</li>
                    <li>Перейдите в настройки API</li>
                    <li>Сгенерируйте API ключ</li>
                    <li>Скопируйте User ID из URL профиля</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Connection Test */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Тест подключения</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Проверить API подключение</h4>
                  <p className="text-sm text-gray-500">Убедиться, что API ключи корректны перед сохранением</p>
                </div>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => console.log('Testing API connection...')}
                >
                  🔌 Тест API
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Статус: <span className="text-orange-600">Не проверено</span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              🔑 Добавить аккаунт
            </button>
            <Link href="/infrastructure/accounts" className="btn-secondary">
              Отмена
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
} 