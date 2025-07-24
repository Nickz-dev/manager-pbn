interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error' | 'pending' | 'building' | 'completed' | 'failed'
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-badge status-active'
      case 'inactive':
        return 'status-badge status-inactive'
      case 'error':
      case 'failed':
        return 'status-badge status-error'
      case 'pending':
      case 'building':
        return 'status-badge status-pending'
      case 'completed':
        return 'status-badge status-active'
      default:
        return 'status-badge status-inactive'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен'
      case 'inactive': return 'Неактивен'
      case 'error': return 'Ошибка'
      case 'failed': return 'Неудача'
      case 'pending': return 'Ожидание'
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