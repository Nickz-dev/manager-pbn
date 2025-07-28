'use client'

import { useState, useEffect } from 'react'

export default function StrapiStatus() {
  const [environment, setEnvironment] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Определяем окружение
    const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_STRAPI === 'true'
    const env = useLocal ? 'ЛОКАЛЬНАЯ' : 'VPS'
    setEnvironment(env)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
        Загрузка...
      </div>
    )
  }

  const isLocal = environment === 'ЛОКАЛЬНАЯ'

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2">
      {/* Основной индикатор */}
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isLocal 
          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
          : 'bg-green-100 text-green-800 border border-green-200'
      }`}>
        {isLocal ? '🖥️ Локальная' : '☁️ VPS'} - {environment}
      </div>
      
      {/* Дополнительная информация */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 text-xs text-gray-600 shadow-sm">
        <div className="font-medium mb-1">Компоненты:</div>
        <div className="space-y-1">
          <div>Strapi: {isLocal ? 'localhost:1337' : 'VPS:1337'}</div>
          <div>Preview: {isLocal ? 'localhost:4321' : 'VPS:4321'}</div>
          <div>Build: {isLocal ? 'localhost:3000' : 'VPS:3000'}</div>
        </div>
      </div>
    </div>
  )
} 