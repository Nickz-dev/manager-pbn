'use client'

import { useState, useEffect } from 'react'

export default function StrapiStatus() {
  const [strapiUrl, setStrapiUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Определяем URL Strapi
    const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_STRAPI === 'true'
    const url = useLocal ? 'http://localhost:1337' : 'http://185.232.205.247:1337'
    setStrapiUrl(url)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
        Загрузка...
      </div>
    )
  }

  const isLocal = strapiUrl.includes('localhost')

  return (
    <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
      isLocal 
        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
        : 'bg-green-100 text-green-800 border border-green-200'
    }`}>
      {isLocal ? '🖥️ Локальная БД' : '☁️ VPS БД'}
    </div>
  )
} 