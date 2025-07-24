import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatsCard } from '@/components/ui/StatsCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Mock domains data
const mockDomains = [
  {
    id: 'domain-1',
    name: 'casino-blog.com',
    registrar: 'Namecheap',
    status: 'active' as const,
    dnsProvider: 'Cloudflare',
    ssl: true,
    siteType: 'PBN',
    vps: 'main-server-01',
    expiryDate: '2025-03-15',
    monthlyPrice: '$12.99',
    createdAt: '2024-01-10T10:00:00Z',
    traffic: '15.2K',
    indexed: true
  },
  {
    id: 'domain-2', 
    name: 'best-slots.net',
    registrar: 'GoDaddy',
    status: 'active' as const,
    dnsProvider: 'Cloudflare',
    ssl: true,
    siteType: 'PBN',
    vps: 'main-server-01',
    expiryDate: '2025-06-20',
    monthlyPrice: '$15.99',
    createdAt: '2024-01-12T14:30:00Z',
    traffic: '8.7K',
    indexed: true
  },
  {
    id: 'domain-3',
    name: 'casino-reviews.org',
    registrar: 'Porkbun',
    status: 'active' as const,
    dnsProvider: 'Cloudflare',
    ssl: true,
    siteType: 'Brand',
    vps: 'backup-server',
    expiryDate: '2024-12-30',
    monthlyPrice: '$8.99',
    createdAt: '2024-01-15T09:15:00Z',
    traffic: '45.8K',
    indexed: true
  },
  {
    id: 'domain-4',
    name: 'slots-paradise.info',
    registrar: 'Namecheap',
    status: 'pending' as const,
    dnsProvider: 'Pending',
    ssl: false,
    siteType: 'PBN',
    vps: null,
    expiryDate: '2025-08-10',
    monthlyPrice: '$10.99',
    createdAt: '2024-01-22T11:45:00Z',
    traffic: '0',
    indexed: false
  }
]

export default function DomainsPage() {
  const activeDomains = mockDomains.filter(domain => domain.status === 'active')
  const expiringDomains = mockDomains.filter(domain => {
    const expiryDate = new Date(domain.expiryDate)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow
  })
  const totalTraffic = mockDomains.reduce((acc, domain) => {
    const traffic = parseFloat(domain.traffic.replace('K', '')) || 0
    return acc + traffic
  }, 0)

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
          title="Управление доменами"
          description="DNS настройки, SSL сертификаты и мониторинг доменов"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Инфраструктура', href: '/infrastructure' },
            { label: 'Домены' }
          ]}
          actions={
            <div className="flex space-x-3">
              <button className="btn-secondary">
                🔄 Обновить DNS
              </button>
              <Link href="/infrastructure/domains/new" className="btn-primary">
                ➕ Добавить домен
              </Link>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всего доменов"
            value={mockDomains.length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Активных"
            value={activeDomains.length}
            change={`${mockDomains.filter(d => d.ssl).length} с SSL`}
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.586-3H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Трафик"
            value={`${totalTraffic.toFixed(1)}K`}
            change="+15% за месяц"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Истекающих"
            value={expiringDomains.length}
            change="В ближайшие 3 мес"
            changeType={expiringDomains.length > 0 ? "negative" : "positive"}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            }
          />
        </div>

        {/* Domains List */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Список доменов</h3>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Все статусы</option>
                <option>Активные</option>
                <option>В ожидании</option>
                <option>Истекающие</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Все типы</option>
                <option>PBN</option>
                <option>Brand</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Домен</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNS & SSL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Трафик</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Истечение</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockDomains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{domain.name}</div>
                            <div className="text-sm text-gray-500">{domain.siteType}</div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {domain.registrar} • {domain.vps || 'Не назначен'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={domain.status} />
                      {domain.indexed && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Проиндексирован
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{domain.dnsProvider}</div>
                      <div className="flex items-center mt-1">
                        {domain.ssl ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            SSL
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Нет SSL
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {domain.traffic}
                      <div className="text-xs text-gray-500">
                        мес. визиты
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(domain.expiryDate).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {domain.monthlyPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          DNS
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-green-600 hover:text-green-800 text-sm">
                          SSL
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
            <Link href="/infrastructure/domains/new" className="btn-primary text-center">
              ➕ Добавить домен
            </Link>
            <button className="btn-secondary">
              🔄 Обновить все DNS
            </button>
            <button className="btn-secondary">
              🔒 Установить SSL
            </button>
            <button className="btn-secondary">
              📊 Массовая проверка
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 