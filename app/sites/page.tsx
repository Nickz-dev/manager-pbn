import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatsCard } from '@/components/ui/StatsCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Mock data - later will come from database
const mockSites = [
  {
    id: '1',
    name: 'casino-blog.com',
    domain: 'casino-blog.com',
    siteType: 'pbn' as const,
    status: 'active' as const,
    vpsId: 'vps1',
    createdAt: '2024-01-15T10:00:00Z',
    lastBuild: '2024-01-20T15:30:00Z'
  },
  {
    id: '2', 
    name: 'best-casino.net',
    domain: 'best-casino.net',
    siteType: 'brand' as const,
    status: 'building' as const,
    vpsId: 'vps2',
    createdAt: '2024-01-18T14:00:00Z',
    lastBuild: null
  }
]

export default function SitesPage() {
  const activeSites = mockSites.filter(site => site.status === 'active').length
  const buildingSites = mockSites.filter(site => site.status === 'building').length

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
              <Link href="/sites" className="nav-link-active">Сайты</Link>
              <Link href="/infrastructure" className="nav-link">Инфраструктура</Link>
              <Link href="/content" className="nav-link">Контент</Link>
              <Link href="/monitoring" className="nav-link">Мониторинг</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Управление сайтами"
          description="PBN сайты и брендовые проекты"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Сайты' }
          ]}
          actions={
            <Link href="/sites/new" className="btn-primary">
              🚀 Создать сайт
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всего сайтов"
            value={mockSites.length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Активных"
            value={activeSites}
            change="+2 за неделю"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="В сборке"
            value={buildingSites}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="PBN сайты"
            value={mockSites.filter(s => s.siteType === 'pbn').length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            }
          />
        </div>

        {/* Sites Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Список сайтов</h3>
            <div className="flex space-x-3">
              <select className="input-field text-sm">
                <option>Все типы</option>
                <option>PBN сайты</option>
                <option>Brand сайты</option>
              </select>
              <select className="input-field text-sm">
                <option>Все статусы</option>
                <option>Активные</option>
                <option>В сборке</option>
                <option>Ошибка</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сайт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VPS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создан
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {mockSites.map((site) => (
                  <tr key={site.id} className="hover:bg-blue-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            site.siteType === 'pbn' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          }`}>
                            <span className="text-white font-semibold text-sm">
                              {site.siteType === 'pbn' ? 'P' : 'B'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{site.name}</div>
                          <div className="text-sm text-gray-500">{site.domain}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        site.siteType === 'pbn' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {site.siteType === 'pbn' ? 'PBN' : 'Brand'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={site.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.vpsId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(site.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Редактировать
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Пересобрать
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
      </main>
    </div>
  )
} 