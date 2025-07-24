'use client'

import React, { useState, useEffect } from 'react'

interface GeneratedSite {
  id: string
  domain: string
  siteName: string
  type: string
  status: 'generating' | 'ready' | 'deployed' | 'error'
  createdAt: string
  updatedAt: string
}

const SitesManagePage: React.FC = () => {
  const [sites, setSites] = useState<GeneratedSite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites/generate')
      const result = await response.json()

      if (response.ok) {
        setSites(result.sites || [])
      } else {
        throw new Error(result.error || 'Failed to fetch sites')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sites')
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = async (siteId: string, fileType: string, siteName: string) => {
    try {
      const response = await fetch(`/api/sites/${siteId}?download=${fileType}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${siteName}-${fileType}.${fileType === 'zip' ? 'txt' : fileType}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        const result = await response.json()
        throw new Error(result.error || 'Failed to download file')
      }
    } catch (err) {
      alert(`Error downloading ${fileType}: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const deleteSite = async (siteId: string, siteName: string) => {
    if (!confirm(`Are you sure you want to delete "${siteName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        alert(`✅ Site "${siteName}" deleted successfully!`)
        fetchSites() // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to delete site')
      }
    } catch (err) {
      alert(`❌ Error deleting site: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100'
      case 'deployed': return 'text-blue-600 bg-blue-100'
      case 'generating': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    if (type.includes('casino')) return 'text-purple-600 bg-purple-100'
    if (type.includes('news')) return 'text-red-600 bg-red-100'
    if (type.includes('blog')) return 'text-blue-600 bg-blue-100'
    return 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchSites}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sites Management</h1>
            <p className="text-gray-600 mt-2">Manage your generated PBN and brand sites</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchSites}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Refresh
            </button>
            <a
              href="/sites/new"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ New Site
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sites</h3>
            <p className="text-3xl font-bold text-blue-600">{sites.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready</h3>
            <p className="text-3xl font-bold text-green-600">
              {sites.filter(s => s.status === 'ready').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deployed</h3>
            <p className="text-3xl font-bold text-blue-600">
              {sites.filter(s => s.status === 'deployed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {sites.filter(s => s.status === 'generating').length}
            </p>
          </div>
        </div>

        {/* Sites List */}
        {sites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sites yet</h3>
            <p className="text-gray-600 mb-6">Create your first PBN or brand site to get started</p>
            <a
              href="/sites/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Create New Site
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sites.map((site) => (
                    <tr key={site.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{site.siteName}</div>
                          <div className="text-sm text-gray-500">{site.domain}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(site.type)}`}>
                          {site.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(site.status)}`}>
                          {site.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(site.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {site.status === 'ready' && (
                            <>
                              <button
                                onClick={() => downloadFile(site.id, 'html', site.siteName)}
                                className="text-blue-600 hover:text-blue-900 text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
                                title="Download HTML"
                              >
                                HTML
                              </button>
                              <button
                                onClick={() => downloadFile(site.id, 'css', site.siteName)}
                                className="text-green-600 hover:text-green-900 text-xs bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
                                title="Download CSS"
                              >
                                CSS
                              </button>
                              <button
                                onClick={() => downloadFile(site.id, 'js', site.siteName)}
                                className="text-yellow-600 hover:text-yellow-900 text-xs bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded"
                                title="Download JS"
                              >
                                JS
                              </button>
                              <button
                                onClick={() => downloadFile(site.id, 'zip', site.siteName)}
                                className="text-purple-600 hover:text-purple-900 text-xs bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded"
                                title="Download All Files"
                              >
                                ALL
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteSite(site.id, site.siteName)}
                            className="text-red-600 hover:text-red-900 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                            title="Delete Site"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SitesManagePage 