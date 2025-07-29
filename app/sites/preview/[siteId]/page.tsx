'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PreviewPageProps {
  params: {
    siteId: string
  }
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkPreview = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/sites/preview/${params.siteId}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load preview')
        }
      } catch (err) {
        setError('Failed to load preview')
        console.error('Preview error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkPreview()
  }, [params.siteId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Preview Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link 
              href="/sites" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Sites
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/sites" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Sites
            </Link>
            <span className="text-gray-500">|</span>
            <span className="text-sm text-gray-600">Preview Mode</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Live Preview
            </span>
          </div>
        </div>
      </div>

      {/* Preview Content - Using iframe for proper static file handling */}
      <div className="w-full h-[calc(100vh-80px)]">
        <iframe
          src={`/api/sites/preview/${params.siteId}`}
          className="w-full h-full border-0"
          title="Site Preview"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  )
}