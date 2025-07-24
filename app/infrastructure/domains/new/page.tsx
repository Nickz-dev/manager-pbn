'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NewDomainPage() {
  const [formData, setFormData] = useState({
    name: '',
    registrar: '',
    siteType: 'PBN',
    vps: '',
    expiryDate: '',
    monthlyPrice: '',
    dnsProvider: 'Cloudflare',
    cloudflareAccount: '',
    ssl: true,
    autoRenew: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adding domain:', formData)
    // TODO: Implement API call
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
          title="Добавить домен"
          description="Регистрация нового домена с автоматической настройкой DNS и SSL"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Инфраструктура', href: '/infrastructure' },
            { label: 'Домены', href: '/infrastructure/domains' },
            { label: 'Добавить домен' }
          ]}
          actions={
            <Link href="/infrastructure/domains" className="btn-secondary">
              ← Назад к доменам
            </Link>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Доменное имя
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="casino-blog.com"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Регистратор
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.registrar}
                  onChange={(e) => updateFormData('registrar', e.target.value)}
                  required
                >
                  <option value="">Выберите регистратора</option>
                  <option value="Namecheap">Namecheap</option>
                  <option value="GoDaddy">GoDaddy</option>
                  <option value="Porkbun">Porkbun</option>
                  <option value="Cloudflare">Cloudflare Registrar</option>
                  <option value="Other">Другой</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип сайта
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.siteType}
                  onChange={(e) => updateFormData('siteType', e.target.value)}
                  required
                >
                  <option value="PBN">PBN Сайт</option>
                  <option value="Brand">Brand Сайт</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VPS Сервер
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.vps}
                  onChange={(e) => updateFormData('vps', e.target.value)}
                >
                  <option value="">Выберите VPS (опционально)</option>
                  <option value="main-server-01">main-server-01 (Germany)</option>
                  <option value="backup-server">backup-server (Netherlands)</option>
                  <option value="test-server">test-server (USA)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата истечения
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.expiryDate}
                  onChange={(e) => updateFormData('expiryDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ежемесячная стоимость
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="$12.99"
                  value={formData.monthlyPrice}
                  onChange={(e) => updateFormData('monthlyPrice', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* DNS Configuration */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">DNS конфигурация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNS провайдер
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.dnsProvider}
                  onChange={(e) => updateFormData('dnsProvider', e.target.value)}
                  required
                >
                  <option value="Cloudflare">Cloudflare</option>
                  <option value="Domain Provider">DNS Регистратора</option>
                  <option value="Other">Другой DNS</option>
                </select>
              </div>

              {formData.dnsProvider === 'Cloudflare' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cloudflare аккаунт
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={formData.cloudflareAccount}
                    onChange={(e) => updateFormData('cloudflareAccount', e.target.value)}
                    required
                  >
                    <option value="">Выберите аккаунт</option>
                    <option value="cf-1">Main Cloudflare Account</option>
                    <option value="cf-2">Backup Cloudflare</option>
                  </select>
                </div>
              )}
            </div>

            {formData.dnsProvider === 'Cloudflare' && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-800">
                      Настройка Cloudflare DNS
                    </h3>
                    <div className="mt-2 text-sm text-orange-700">
                      <p>После добавления домена вам нужно будет:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Изменить NS записи у регистратора на Cloudflare</li>
                        <li>Подождать распространения DNS (до 24 часов)</li>
                        <li>Настроить A/CNAME записи для поддоменов</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SSL & Security */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SSL и безопасность</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Автоматический SSL</h4>
                  <p className="text-sm text-gray-500">Автоматическое получение и обновление SSL сертификата</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.ssl}
                    onChange={(e) => updateFormData('ssl', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Автопродление</h4>
                  <p className="text-sm text-gray-500">Автоматически продлевать домен перед истечением</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.autoRenew}
                    onChange={(e) => updateFormData('autoRenew', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Domain Verification */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Проверка домена</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Проверить доступность</h4>
                  <p className="text-sm text-gray-500">Убедиться, что домен доступен для регистрации</p>
                </div>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => console.log('Checking domain availability...')}
                >
                  🔍 Проверить домен
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
              🌐 Добавить домен
            </button>
            <Link href="/infrastructure/domains" className="btn-secondary">
              Отмена
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
} 