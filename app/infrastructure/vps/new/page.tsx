'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NewVPSPage() {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    location: '',
    provider: '',
    cpu: '',
    ram: '',
    disk: '',
    bandwidth: '',
    monthlyPrice: '',
    sshUser: 'root',
    sshPort: '22',
    sshKey: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adding VPS:', formData)
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
          title="Добавить VPS сервер"
          description="Настройка нового виртуального сервера для размещения сайтов"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Инфраструктура', href: '/infrastructure' },
            { label: 'VPS Серверы', href: '/infrastructure/vps' },
            { label: 'Добавить VPS' }
          ]}
          actions={
            <Link href="/infrastructure/vps" className="btn-secondary">
              ← Назад к VPS
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
                  Название сервера
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="main-server-01"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP адрес
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="185.120.34.156"
                  value={formData.ip}
                  onChange={(e) => updateFormData('ip', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Местоположение
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Germany, Frankfurt"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Провайдер
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.provider}
                  onChange={(e) => updateFormData('provider', e.target.value)}
                  required
                >
                  <option value="">Выберите провайдера</option>
                  <option value="Hetzner">Hetzner</option>
                  <option value="DigitalOcean">DigitalOcean</option>
                  <option value="Vultr">Vultr</option>
                  <option value="Linode">Linode</option>
                  <option value="AWS">Amazon AWS</option>
                  <option value="Other">Другой</option>
                </select>
              </div>
            </div>
          </div>

          {/* Server Specifications */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Характеристики сервера</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPU
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4 vCPU"
                  value={formData.cpu}
                  onChange={(e) => updateFormData('cpu', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RAM
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="8 GB"
                  value={formData.ram}
                  onChange={(e) => updateFormData('ram', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Диск
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="160 GB SSD"
                  value={formData.disk}
                  onChange={(e) => updateFormData('disk', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пропускная способность
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="20 TB"
                  value={formData.bandwidth}
                  onChange={(e) => updateFormData('bandwidth', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ежемесячная стоимость
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="$15.99"
                  value={formData.monthlyPrice}
                  onChange={(e) => updateFormData('monthlyPrice', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* SSH Configuration */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">SSH конфигурация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSH пользователь
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.sshUser}
                  onChange={(e) => updateFormData('sshUser', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSH порт
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.sshPort}
                  onChange={(e) => updateFormData('sshPort', e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSH приватный ключ
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="-----BEGIN OPENSSH PRIVATE KEY-----
..."
                  value={formData.sshKey}
                  onChange={(e) => updateFormData('sshKey', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Вставьте приватный SSH ключ для доступа к серверу
                </p>
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Тест подключения</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Проверить SSH подключение</h4>
                  <p className="text-sm text-gray-500">Убедиться, что сервер доступен перед добавлением</p>
                </div>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => console.log('Testing SSH connection...')}
                >
                  🔌 Тест подключения
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
              🖥️ Добавить VPS сервер
            </button>
            <Link href="/infrastructure/vps" className="btn-secondary">
              Отмена
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
} 