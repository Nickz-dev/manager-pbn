'use client'

import { useState, useEffect } from 'react'

interface AuthStatusProps {
  className?: string
}

export default function AuthStatus({ className = '' }: AuthStatusProps) {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/auth/status')
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error('Ошибка проверки статуса:', error)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (loading) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Проверка статуса...
      </div>
    )
  }

  if (!status) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        Ошибка загрузки статуса
      </div>
    )
  }

  return (
    <div className={`text-xs space-y-1 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="font-medium">Конфигурация:</span>
        <span className={status.configured ? 'text-green-600' : 'text-red-600'}>
          {status.configured ? '✅ Настроена' : '❌ Ошибки'}
        </span>
      </div>
      
      {!status.configured && status.errors && (
        <div className="text-red-600">
          {status.errors.map((error: string, index: number) => (
            <div key={index}>• {error}</div>
          ))}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <span className="font-medium">Токен:</span>
        <span className={status.tokenValid ? 'text-green-600' : 'text-gray-500'}>
          {status.hasToken 
            ? (status.tokenValid ? '✅ Действителен' : '❌ Недействителен')
            : '❌ Отсутствует'
          }
        </span>
      </div>
      
      {status.user && (
        <div className="text-gray-600">
          Пользователь: {status.user.email}
        </div>
      )}
    </div>
  )
} 