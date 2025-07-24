import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatsCard } from '@/components/ui/StatsCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Mock VPS data
const mockVPS = [
  {
    id: 'vps-1',
    name: 'main-server-01',
    ip: '185.120.34.156',
    location: 'Germany, Frankfurt',
    provider: 'Hetzner',
    status: 'active' as const,
    cpu: '4 vCPU',
    ram: '8 GB',
    disk: '160 GB SSD',
    bandwidth: '20 TB',
    uptime: '99.9%',
    sites: ['casino-blog.com', 'best-slots.net'],
    monthlyPrice: '$15.99',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'vps-2', 
    name: 'backup-server',
    ip: '188.68.50.123',
    location: 'Netherlands, Amsterdam',
    provider: 'DigitalOcean',
    status: 'active' as const,
    cpu: '2 vCPU',
    ram: '4 GB', 
    disk: '80 GB SSD',
    bandwidth: '5 TB',
    uptime: '98.8%',
    sites: ['casino-reviews.org'],
    monthlyPrice: '$24.00',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'vps-3',
    name: 'test-server',
    ip: '45.142.183.99',
    location: 'USA, New York',
    provider: 'Vultr',
    status: 'inactive' as const,
    cpu: '1 vCPU',
    ram: '2 GB',
    disk: '50 GB SSD', 
    bandwidth: '2 TB',
    uptime: '95.2%',
    sites: [],
    monthlyPrice: '$12.00',
    createdAt: '2024-01-20T09:15:00Z'
  }
]

export default function VPSPage() {
  const activeVPS = mockVPS.filter(vps => vps.status === 'active')
  const totalSites = mockVPS.reduce((acc, vps) => acc + vps.sites.length, 0)
  const totalCost = mockVPS.reduce((acc, vps) => acc + parseFloat(vps.monthlyPrice.replace('$', '')), 0)

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
          title="VPS Серверы"
          description="Управление виртуальными серверами и их мониторинг"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Инфраструктура', href: '/infrastructure' },
            { label: 'VPS Серверы' }
          ]}
          actions={
            <div className="flex space-x-3">
              <button className="btn-secondary">
                🔄 Обновить
              </button>
              <Link href="/infrastructure/vps/new" className="btn-primary">
                ➕ Добавить VPS
              </Link>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всего VPS"
            value={mockVPS.length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Активных"
            value={activeVPS.length}
            change={`${Math.round((activeVPS.length / mockVPS.length) * 100)}% uptime`}
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
            title="Сайтов размещено"
            value={totalSites}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Ежемесячная стоимость"
            value={`$${totalCost.toFixed(2)}`}
            change="3 провайдера"
            changeType="neutral"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            }
          />
        </div>

        {/* VPS List */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Список VPS серверов</h3>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Все статусы</option>
                <option>Активные</option>
                <option>Неактивные</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Все провайдеры</option>
                <option>Hetzner</option>
                <option>DigitalOcean</option>
                <option>Vultr</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сервер</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Конфигурация</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сайты</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Стоимость</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockVPS.map((vps) => (
                  <tr key={vps.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{vps.name}</div>
                            <div className="text-sm text-gray-500">{vps.ip}</div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {vps.location} • {vps.provider}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={vps.status} />
                      <div className="text-xs text-gray-500 mt-1">
                        Uptime: {vps.uptime}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{vps.cpu}</div>
                      <div>{vps.ram}</div>
                      <div>{vps.disk}</div>
                      <div className="text-xs text-gray-400">{vps.bandwidth}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vps.sites.length} сайтов
                      </div>
                      {vps.sites.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {vps.sites.slice(0, 2).join(', ')}
                          {vps.sites.length > 2 && ` +${vps.sites.length - 2}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {vps.monthlyPrice}/мес
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Управление
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          SSH
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
            <Link href="/infrastructure/vps/new" className="btn-primary text-center">
              ➕ Добавить VPS
            </Link>
            <button className="btn-secondary">
              📊 Массовый мониторинг
            </button>
            <button className="btn-secondary">
              🔧 SSH все серверы
            </button>
            <button className="btn-secondary">
              💾 Создать backup
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 