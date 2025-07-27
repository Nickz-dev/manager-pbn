import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/lib/database'

export async function GET() {
  try {
    const vpsServers = await Database.getVPSServers()
    
    return NextResponse.json({
      success: true,
      vpsServers: vpsServers,
      total: vpsServers.length
    })
  } catch (error) {
    console.error('Error fetching VPS servers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch VPS servers' },
      { status: 500 }
    )
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

    // Создаем VPS сервер в базе данных
    const vpsData = {
      name: body.name,
      ip: body.ip,
      hostname: body.hostname,
      provider: body.provider,
      sshUser: body.sshUser,
      sshPort: body.sshPort || 22,
      sshKeyPath: body.sshKeyPath,
      status: body.status || 'active',
      specs: body.specs || {
        cpu: '1 vCPU',
        ram: '1 GB',
        storage: '20 GB',
        bandwidth: '1 TB'
      },
      sites: body.sites || []
    }

    const createdVPS = await Database.createVPS(vpsData)

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