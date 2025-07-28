import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET() {
  try {
    const domains = await strapiAPI.getDomains()
    
    return NextResponse.json({
      success: true,
      domains: domains,
      total: domains.length
    })
  } catch (error) {
    console.error('Error fetching domains:', error)
    
    // Fallback data для тестирования
    const fallbackDomains = [
      {
        id: 1,
        externalId: 'domain-1',
        name: 'casino-blog.ru',
        registrar: 'Reg.ru',
        expiresAt: '2024-12-31',
        status: 'active',
        vpsId: 'vps-1',
        cloudflareAccountId: 'cf-1',
        dnsRecords: [],
        sslEnabled: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        publishedAt: '2024-01-01'
      },
      {
        id: 2,
        externalId: 'domain-2',
        name: 'slots-review.com',
        registrar: 'Namecheap',
        expiresAt: '2024-11-30',
        status: 'active',
        vpsId: 'vps-2',
        cloudflareAccountId: 'cf-2',
        dnsRecords: [],
        sslEnabled: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        publishedAt: '2024-01-01'
      }
    ]
    
    return NextResponse.json({
      success: true,
      domains: fallbackDomains,
      total: fallbackDomains.length
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация входных данных
    if (!body.name || !body.registrar || !body.expiresAt || !body.vpsId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, registrar, expiresAt, vpsId' },
        { status: 400 }
      )
    }

    // Создаем домен в Strapi
    const domainData = {
      name: body.name,
      registrar: body.registrar,
      expiresAt: body.expiresAt,
      status: body.status || 'pending',
      vpsId: body.vpsId,
      cloudflareAccountId: body.cloudflareAccountId,
      dnsRecords: body.dnsRecords || [],
      sslEnabled: body.sslEnabled || false,
      externalId: `domain-${Date.now()}`
    }

    const createdDomain = await strapiAPI.createDomain(domainData)

    return NextResponse.json({
      success: true,
      message: 'Domain created successfully',
      domain: createdDomain
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating domain:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create domain', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 