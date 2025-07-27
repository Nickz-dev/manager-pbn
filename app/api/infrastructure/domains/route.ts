import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/lib/database'

export async function GET() {
  try {
    const domains = await Database.getDomains()
    
    return NextResponse.json({
      success: true,
      domains: domains,
      total: domains.length
    })
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    )
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

    // Создаем домен в базе данных
    const domainData = {
      name: body.name,
      registrar: body.registrar,
      expiresAt: body.expiresAt,
      status: body.status || 'pending',
      vpsId: body.vpsId,
      cloudflareAccountId: body.cloudflareAccountId,
      dnsRecords: body.dnsRecords || [],
      sslEnabled: body.sslEnabled || false
    }

    const createdDomain = await Database.createDomain(domainData)

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