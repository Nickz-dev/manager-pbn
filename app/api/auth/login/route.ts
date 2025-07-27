import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createToken, isAuthConfigured } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check if authentication is properly configured
    const { configured, errors } = isAuthConfigured()
    if (!configured) {
      return NextResponse.json(
        { error: 'Система авторизации не настроена', details: errors },
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
    const user = await authenticateUser(email, password)
    
    if (!user) {
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

  } catch (error: any) {
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