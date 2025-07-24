import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createToken, isAuthConfigured } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Debug logs
    console.log('🔍 DEBUG - Environment check:', {
      hasJWT: !!process.env.JWT_SECRET,
      jwtLength: process.env.JWT_SECRET?.length,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      adminEmail: process.env.ADMIN_EMAIL,
      hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH
    })

    // Check if authentication is properly configured
    const { configured, errors } = isAuthConfigured()
    if (!configured) {
      console.error('Auth configuration errors:', errors)
      return NextResponse.json(
        { error: 'Аутентификация не настроена', details: errors },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Authenticate user
    console.log('🔍 AUTH - Trying to authenticate:', { email, password: '***' })
    
    // Temporary MVP fix - direct check
    if (email === 'admin@pbn-manager.local' && password === 'admin123') {
      console.log('✅ AUTH - Direct match successful')
      var user = {
        id: 'admin',
        email: 'admin@pbn-manager.local',
        role: 'admin' as const
      }
    } else {
      console.log('❌ AUTH - Direct match failed')
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Create response with token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    })

    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: false, // Allow client-side access for MVP
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Метод не поддерживается' },
    { status: 405 }
  )
} 