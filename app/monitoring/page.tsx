import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatsCard } from '@/components/ui/StatsCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Mock monitoring data
const mockWebhooks = [
  {
    id: '1',
    event: 'content.published',
    source: 'Strapi CMS',
    target: 'casino-blog.com',
    status: 'completed' as const,
    timestamp: '2024-01-20T16:45:00Z',
    responseTime: 120
  },
  {
    id: '2',
    event: 'site.rebuild',
    source: 'PBN Manager',
    target: 'best-casino.net',
    status: 'building' as const,
    timestamp: '2024-01-20T16:40:00Z',
    responseTime: null
  }
]

const mockIndexingTasks = [
  {
    id: '1',
    siteId: 'site1',
    siteName: 'casino-blog.com',
    type: 'sitemap',
    urlsCount: 156,
    indexed: 89,
    pending: 45,
    failed: 22,
    account: 'GSC Account #1',
    status: 'active' as const
  },
  {
    id: '2',
    siteId: 'site2',
    siteName: 'best-casino.net',
    type: 'url_list',
    urlsCount: 78,
    indexed: 78,
    pending: 0,
    failed: 0,
    account: 'Yandex Account #2',
    status: 'completed' as const
  }
]

export default function MonitoringPage() {
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
              <Link href="/infrastructure" className="nav-link">Инфраструктура</Link>
              <Link href="/content" className="nav-link">Контент</Link>
              <Link href="/monitoring" className="nav-link-active">Мониторинг</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Мониторинг и автоматизация"
          description="Вебхуки, индексация и системная аналитика в реальном времени"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Мониторинг' }
          ]}
          actions={
            <div className="flex space-x-3">
              <button className="btn-secondary">
                🔄 Обновить
              </button>
              <button className="btn-primary">
                ⚙️ Настройки
              </button>
            </div>
          }
        />

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Активные вебхуки"
                         value={mockWebhooks.length}
            change="+12 за час"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Индексация"
            value={`${mockIndexingTasks.reduce((acc, task) => acc + task.indexed, 0)}`}
            change="89%"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Среднее время ответа"
            value="120ms"
            change="-15ms"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="Пайплайны"
            value="3"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Webhooks */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Вебхуки в реальном времени</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Live</span>
              </div>
            </div>

            <div className="space-y-4">
              {mockWebhooks.map((webhook) => (
                <div key={webhook.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{webhook.event}</h4>
                      <p className="text-sm text-gray-500">{webhook.source} → {webhook.target}</p>
                    </div>
                    <StatusBadge status={webhook.status} />
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(webhook.timestamp).toLocaleTimeString('ru-RU')}</span>
                    {webhook.responseTime && (
                      <span>{webhook.responseTime}ms</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indexing Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Статус индексации</h3>
            
            <div className="space-y-4">
              {mockIndexingTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.siteName}</h4>
                      <p className="text-sm text-gray-500">{task.account}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{task.indexed}</div>
                      <div className="text-gray-500">Проиндексировано</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">{task.pending}</div>
                      <div className="text-gray-500">В очереди</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">{task.failed}</div>
                      <div className="text-gray-500">Ошибки</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Прогресс</span>
                      <span>{Math.round((task.indexed / task.urlsCount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(task.indexed / task.urlsCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Пайплайны автоматизации</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Статическая генерация</h4>
                  <p className="text-sm text-gray-500">Astro → VPS</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Последняя сборка:</span>
                  <span className="text-green-600">Успешно</span>
                </div>
                <div className="flex justify-between">
                  <span>Время:</span>
                  <span>15 мин назад</span>
                </div>
                <div className="flex justify-between">
                  <span>Сайтов в очереди:</span>
                  <span>2</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI контент</h4>
                  <p className="text-sm text-gray-500">GPT-4 → Strapi</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Статьи сегодня:</span>
                  <span className="text-blue-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Токенов использовано:</span>
                  <span>45,692</span>
                </div>
                <div className="flex justify-between">
                  <span>Стоимость:</span>
                  <span>$2.85</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Автоиндексация</h4>
                  <p className="text-sm text-gray-500">Sitemap → GSC/Yandex</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>URL отправлено:</span>
                  <span className="text-green-600">234</span>
                </div>
                <div className="flex justify-between">
                  <span>Успешность:</span>
                  <span>89%</span>
                </div>
                <div className="flex justify-between">
                  <span>Средняя задержка:</span>
                  <span>4.2 дня</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Производительность системы (24ч)</h3>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">График производительности</p>
              <p className="text-sm text-gray-400">Интеграция с Chart.js планируется</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 