import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const siteId = params.id
    console.log('🔍 API: Searching for site with ID:', siteId)
    
    // Получаем информацию о сайте
    const site = await strapiAPI.getPbnSiteById(siteId)
    console.log('🔍 API: Site result:', site ? 'Found' : 'Not found')
    
    if (!site) {
      console.log('❌ API: Site not found for ID:', siteId)
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    console.log('✅ API: Site found, getting articles...')
    // Получаем статьи, связанные с сайтом
    const articles = await strapiAPI.getArticlesBySite(siteId)
    console.log('✅ API: Articles count:', articles.length)

    return NextResponse.json({
      success: true,
      site: {
        ...site,
        articles
      }
    })

  } catch (error) {
    console.error('❌ API: Error fetching site:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site', details: error },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const sites = readSites()
    const siteIndex = sites.findIndex(s => s.id === id)

    if (siteIndex === -1) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Remove site from array
    const deletedSite = sites.splice(siteIndex, 1)[0]

    // Save updated sites list
    const fs = require('fs')
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(SITES_DB_PATH, JSON.stringify(sites, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Site deleted successfully',
      deletedSite: {
        id: deletedSite.id,
        domain: deletedSite.domain,
        siteName: deletedSite.siteName
      }
    })

  } catch (error) {
    console.error('Error deleting site:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 