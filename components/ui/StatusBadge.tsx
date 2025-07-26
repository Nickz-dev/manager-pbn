interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'deployed':
      case 'active':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
      case 'draft':
      case 'inactive':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
      case 'error':
      case 'failed':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
      case 'building':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'deployed': return 'Развернут'
      case 'draft': return 'Черновик'
      case 'active': return 'Активен'
      case 'inactive': return 'Неактивен'
      case 'error': return 'Ошибка'
      case 'failed': return 'Неудача'
      case 'building': return 'Сборка'
      case 'completed': return 'Завершено'
      default: return status
    }
  }

  return (
    <span className={`${getStatusClasses(status)} ${className}`}>
      {getStatusText(status)}
    </span>
  )
} 