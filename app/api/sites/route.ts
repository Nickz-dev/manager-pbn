import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET() {
  try {
    const sites = await strapiAPI.getPbnSites()
    
    return NextResponse.json({
      success: true,
      sites: sites,
      total: sites.length
    })
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация входных данных
    if (!body.domain || !body.siteName || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: domain, siteName, type' },
        { status: 400 }
      )
    }

    // Создаем сайт в Strapi
    const siteData = {
      name: body.siteName,
      slug: body.domain.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
      domain: body.domain,
      template: body.template || (body.type.includes('casino') ? 'casino-standard' : 'blog'), // Используем явно переданный template
      statuspbn: 'draft',
      description: body.description || '',
      selectedArticles: Array.isArray(body.selectedArticles) ? body.selectedArticles : [],
      config: {
        keywords: Array.isArray(body.keywords) ? body.keywords : [],
        theme: body.theme || 'light',
        content: body.content || {},
        settings: body.settings || {}
      }
    }

    console.log('Creating site with data:', JSON.stringify(siteData, null, 2))
    console.log('Template from request:', body.template)
    console.log('Type from request:', body.type)

    const createdSite = await strapiAPI.createPbnSite(siteData)

    return NextResponse.json({
      success: true,
      message: 'Site created successfully',
      site: createdSite
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating site:', error)
    
    // Добавляем подробное логирование ошибки Strapi
    if (error.response) {
      console.error('Strapi response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create site', 
        details: error instanceof Error ? error.message : 'Unknown error',
        strapiError: error.response?.data || null
      },
      { status: 500 }
    )
  }
} 