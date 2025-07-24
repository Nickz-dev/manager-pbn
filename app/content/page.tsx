import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatsCard } from '@/components/ui/StatsCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Mock data
const mockContent = [
  {
    id: '1',
    title: 'Лучшие онлайн казино 2024 года',
    type: 'article',
    siteId: 'site1',
    siteName: 'casino-blog.com',
    aiGenerated: true,
    status: 'active' as const,
    createdAt: '2024-01-20T10:00:00Z',
    wordCount: 2500
  },
  {
    id: '2',
    title: 'Обзор слотов NetEnt',
    type: 'article', 
    siteId: 'site1',
    siteName: 'casino-blog.com',
    aiGenerated: true,
    status: 'pending' as const,
    createdAt: '2024-01-20T14:30:00Z',
    wordCount: 1800
  }
]

const mockTasks = [
  {
    id: '1',
    type: 'content_generation',
    status: 'building' as const,
    siteId: 'site2',
    siteName: 'best-casino.net',
    progress: 65,
    startedAt: '2024-01-20T16:00:00Z'
  },
  {
    id: '2',
    type: 'site_rebuild',
    status: 'pending' as const,
    siteId: 'site1', 
    siteName: 'casino-blog.com',
    progress: 0,
    startedAt: null
  }
]

export default function ContentPage() {
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
              <Link href="/content" className="nav-link-active">Контент</Link>
              <Link href="/monitoring" className="nav-link">Мониторинг</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Управление контентом"
          description="AI генерация, Strapi интеграция и пересборка сайтов"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Контент' }
          ]}
          actions={
            <div className="flex space-x-3">
              <Link href="/content/generate" className="btn-primary">
                ✨ Генерация AI
              </Link>
              <button className="btn-secondary">
                🔄 Strapi CLI
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всего контента"
            value={mockContent.length}
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            }
          />
          <StatsCard
            title="AI генерации"
            value={mockContent.filter(c => c.aiGenerated).length}
            change="+5 сегодня"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            }
          />
                      <StatsCard
              title="В обработке"
              value={mockTasks.filter(t => t.status === 'building').length}
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
            title="Опубликовано"
            value={mockContent.filter(c => c.status === 'active').length}
            change="+3 за день"
            changeType="positive"
            icon={
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content List */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Последний контент</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">Показать все</button>
            </div>

            <div className="space-y-4">
              {mockContent.map((content) => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-2">{content.title}</h4>
                    {content.aiGenerated && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        AI
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{content.siteName}</span>
                    <div className="flex items-center space-x-2">
                      <span>{content.wordCount} слов</span>
                      <StatusBadge status={content.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tasks */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Активные задачи</h3>
            
            <div className="space-y-4">
              {mockTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {task.type === 'content_generation' ? 'Генерация контента' : 'Пересборка сайта'}
                      </h4>
                      <p className="text-sm text-gray-500">{task.siteName}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  
                  {task.status === 'building' && (
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Прогресс</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-3">
                    {task.status === 'building' ? (
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Остановить
                      </button>
                    ) : (
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Запустить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strapi Integration */}
        <div className="mt-8 card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Strapi CLI интеграция</h3>
            <div className="flex space-x-3">
              <button className="btn-secondary text-sm">
                📥 Синхронизация
              </button>
              <button className="btn-secondary text-sm">
                🔄 Обновить схему
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">Статус подключения</h4>
              <p className="text-sm text-green-600">Подключено</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">Контент-типы</h4>
              <p className="text-sm text-blue-600">4 настроено</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M9 8h6" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900">Последняя синхронизация</h4>
              <p className="text-sm text-purple-600">5 мин назад</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 