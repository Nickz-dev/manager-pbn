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
    console.log('🗑️ API: Deleting site with ID:', id)
    
    const result = await strapiAPI.deletePbnSite(id)
    
    console.log('✅ API: Site deleted successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Site deleted successfully',
      deletedSite: {
        id: result.deletedSite.id,
        documentId: result.deletedSite.documentId,
        name: result.deletedSite.name,
        domain: result.deletedSite.domain
      }
    })

  } catch (error: any) {
    console.error('❌ API: Error deleting site:', error)
    
    if (error.message && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete site', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    console.log('✏️ API: Updating site with ID:', id)
    console.log('✏️ API: Update data:', JSON.stringify(body, null, 2))
    
    // Валидация входных данных
    if (!body.name && !body.domain && !body.template && !body.statuspbn) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }
    
    // Подготавливаем данные для обновления
    const updateData: any = {}
    if (body.name) updateData.name = body.name
    if (body.domain) updateData.domain = body.domain
    if (body.template) updateData.template = body.template
    if (body.statuspbn) updateData.statuspbn = body.statuspbn
    if (body.description !== undefined) updateData.description = body.description
    if (body.selectedArticles !== undefined) updateData.selectedArticles = body.selectedArticles
    if (body.config !== undefined) updateData.config = body.config
    
    const updatedSite = await strapiAPI.updatePbnSite(id, updateData)
    
    console.log('✅ API: Site updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Site updated successfully',
      site: updatedSite
    })

  } catch (error: any) {
    console.error('❌ API: Error updating site:', error)
    
    if (error.message && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update site', details: error.message },
      { status: 500 }
    )
  }
} 