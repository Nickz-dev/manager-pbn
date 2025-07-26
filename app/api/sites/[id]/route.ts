import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const siteId = params.id
    
    // Получаем информацию о сайте
    const site = await strapiAPI.getPbnSiteById(siteId)
    
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Получаем статьи, связанные с сайтом
    const articles = await strapiAPI.getArticlesBySite(siteId)

    return NextResponse.json({
      success: true,
      site: {
        ...site,
        articles
      }
    })

  } catch (error) {
    console.error('Error fetching site:', error)
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