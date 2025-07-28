import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET() {
  try {
    const vpsServers = await strapiAPI.getVPSServers()
    
    return NextResponse.json({
      success: true,
      vpsServers: vpsServers,
      total: vpsServers.length
    })
  } catch (error) {
    console.error('Error fetching VPS servers:', error)
    
    // Fallback data для тестирования
    const fallbackVpsServers = [
      {
        id: 1,
        externalId: 'vps-1',
        name: 'VPS-01',
        ip: '185.232.205.247',
        hostname: 'vps01.casino-blog.ru',
        provider: 'Contabo',
        sshUser: 'root',
        sshPort: 22,
        sshKeyPath: '/root/.ssh/id_rsa',
        status: 'active',
        specs: {
          cpu: '4 cores',
          ram: '8 GB',
          storage: '200 GB SSD'
        },
        sites: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        publishedAt: '2024-01-01'
      },
      {
        id: 2,
        externalId: 'vps-2',
        name: 'VPS-02',
        ip: '185.232.205.248',
        hostname: 'vps02.slots-review.com',
        provider: 'Hetzner',
        sshUser: 'root',
        sshPort: 22,
        sshKeyPath: '/root/.ssh/id_rsa',
        status: 'active',
        specs: {
          cpu: '2 cores',
          ram: '4 GB',
          storage: '100 GB SSD'
        },
        sites: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        publishedAt: '2024-01-01'
      }
    ]
    
    return NextResponse.json({
      success: true,
      vpsServers: fallbackVpsServers,
      total: fallbackVpsServers.length
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация входных данных
    if (!body.name || !body.ip || !body.hostname || !body.provider || !body.sshUser) {
      return NextResponse.json(
        { error: 'Missing required fields: name, ip, hostname, provider, sshUser' },
        { status: 400 }
      )
    }

    // Создаем VPS сервер в Strapi
    const vpsData = {
      name: body.name,
      ip: body.ip,
      hostname: body.hostname,
      provider: body.provider,
      sshUser: body.sshUser,
      sshPort: body.sshPort || 22,
      sshKeyPath: body.sshKeyPath,
      status: body.status || 'active',
      specs: body.specs || {},
      sites: body.sites || [],
      externalId: `vps-${Date.now()}`
    }

    const createdVPS = await strapiAPI.createVPSServer(vpsData)

    return NextResponse.json({
      success: true,
      message: 'VPS server created successfully',
      vpsServer: createdVPS
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating VPS server:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create VPS server', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 