import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatsCard } from '@/components/ui/StatsCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Mock accounts data
const mockAccounts = [
  // Cloudflare Accounts
  {
    id: 'cf-1',
    type: 'cloudflare',
    name: 'Main Cloudflare Account',
    email: 'admin@casino-domains.com',
    status: 'active' as const,
    domainsCount: 8,
    apiKey: 'cf_*********************xyz',
    createdAt: '2024-01-10T10:00:00Z',
    lastUsed: '2024-01-22T15:30:00Z'
  },
  {
    id: 'cf-2',
    type: 'cloudflare',
    name: 'Backup Cloudflare',
    email: 'backup@casino-domains.com',
    status: 'active' as const,
    domainsCount: 3,
    apiKey: 'cf_*********************abc',
    createdAt: '2024-01-15T14:30:00Z',
    lastUsed: '2024-01-21T09:15:00Z'
  },
  // Google Search Console
  {
    id: 'gsc-1',
    type: 'gsc',
    name: 'Primary GSC Account',
    email: 'seo@casino-sites.org',
    status: 'active' as const,
    domainsCount: 6,
    clientId: 'gsc_*********************001',
    createdAt: '2024-01-08T11:20:00Z',
    lastUsed: '2024-01-22T18:45:00Z'
  },
  {
    id: 'gsc-2',
    type: 'gsc',
    name: 'Secondary GSC',
    email: 'analytics@best-slots.net',
    status: 'active' as const,
    domainsCount: 4,
    clientId: 'gsc_*********************002',
    createdAt: '2024-01-12T16:10:00Z',
    lastUsed: '2024-01-20T12:30:00Z'
  },
  // Yandex Webmaster
  {
    id: 'yx-1',
    type: 'yandex',
    name: 'Yandex Webmaster Main',
    email: 'yandex@casino-reviews.org',
    status: 'active' as const,
    domainsCount: 5,
    apiKey: 'yx_*********************789',
    createdAt: '2024-01-14T13:25:00Z',
    lastUsed: '2024-01-22T14:20:00Z'
  },
  {
    id: 'yx-2',
    type: 'yandex',
    name: 'Yandex Secondary',
    email: 'webmaster@slots-info.ru',
    status: 'error' as const,
    domainsCount: 2,
    apiKey: 'yx_*********************456',
    createdAt: '2024-01-18T10:15:00Z',
    lastUsed: '2024-01-19T16:40:00Z'
  }
]

export default function AccountsPage() {
  const accountsByType = {
    cloudflare: mockAccounts.filter(acc => acc.type === 'cloudflare'),
    gsc: mockAccounts.filter(acc => acc.type === 'gsc'),
    yandex: mockAccounts.filter(acc => acc.type === 'yandex')
  }

  const activeAccounts = mockAccounts.filter(acc => acc.status === 'active')
  const totalDomains = mockAccounts.reduce((sum, acc) => sum + acc.domainsCount, 0)

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'cloudflare':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        )
      case 'gsc':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )
      case 'yandex':
        return (
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        )
      default:
        return null
    }
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="API Аккаунты"
          description="Управление аккаунтами Cloudflare, Google Search Console и Yandex Webmaster"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Инфраструктура', href: '/infrastructure' },
            { label: 'API Аккаунты' }
          ]}
          actions={
            <div className="flex space-x-3">
              <button className="btn-secondary">
                🔄 Проверить все
              </button>
              <Link href="/infrastructure/accounts/new" className="btn-primary">
                ➕ Добавить аккаунт
              </Link>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всего аккаунтов"
            value={mockAccounts.length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Активных"
            value={activeAccounts.length}
            change={`${Math.round((activeAccounts.length / mockAccounts.length) * 100)}% работают`}
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Доменов подключено"
            value={totalDomains}
            change="3 провайдера"
            changeType="neutral"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Последняя синхронизация"
            value="5 мин"
            change="Все в актуальном состоянии"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />
        </div>

        {/* Accounts by Type */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cloudflare */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                Cloudflare DNS
              </h3>
              <span className="text-sm text-gray-500">{accountsByType.cloudflare.length} аккаунтов</span>
            </div>
            <div className="space-y-3">
              {accountsByType.cloudflare.map((account) => (
                <div key={account.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.email}</div>
                    </div>
                    <StatusBadge status={account.status} />
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {account.domainsCount} доменов • Использован {new Date(account.lastUsed).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Search Console */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                Google Search Console
              </h3>
              <span className="text-sm text-gray-500">{accountsByType.gsc.length} аккаунтов</span>
            </div>
            <div className="space-y-3">
              {accountsByType.gsc.map((account) => (
                <div key={account.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.email}</div>
                    </div>
                    <StatusBadge status={account.status} />
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {account.domainsCount} доменов • Использован {new Date(account.lastUsed).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yandex Webmaster */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Yandex Webmaster
              </h3>
              <span className="text-sm text-gray-500">{accountsByType.yandex.length} аккаунтов</span>
            </div>
            <div className="space-y-3">
              {accountsByType.yandex.map((account) => (
                <div key={account.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.email}</div>
                    </div>
                    <StatusBadge status={account.status} />
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {account.domainsCount} доменов • Использован {new Date(account.lastUsed).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Accounts Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Все аккаунты</h3>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Все типы</option>
                <option>Cloudflare</option>
                <option>Google Search Console</option>
                <option>Yandex Webmaster</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Все статусы</option>
                <option>Активные</option>
                <option>Ошибка</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Аккаунт</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Домены</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Последнее использование</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getAccountIcon(account.type)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{account.name}</div>
                          <div className="text-sm text-gray-500">{account.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getAccountTypeLabel(account.type)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={account.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {account.domainsCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(account.lastUsed).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Тест
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-green-600 hover:text-green-800 text-sm">
                          Настройки
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Быстрые действия</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/infrastructure/accounts/new" className="btn-primary text-center">
              ➕ Добавить аккаунт
            </Link>
            <button className="btn-secondary">
              🔄 Тест всех аккаунтов
            </button>
            <button className="btn-secondary">
              📊 Массовая синхронизация
            </button>
            <button className="btn-secondary">
              ⚙️ Групповые настройки
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 