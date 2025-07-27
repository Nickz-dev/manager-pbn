import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ 
        hasToken: false, 
        valid: false,
        message: 'Токен отсутствует' 
      })
    }
    
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ 
        hasToken: true, 
        valid: false, 
        message: 'Токен недействителен' 
      })
    }
    
    const user = getUserFromToken(token)
    
    return NextResponse.json({ 
      hasToken: true, 
      valid: true, 
      user,
      payload,
      message: 'Токен действителен' 
    })
  } catch (error: any) {
    console.error('❌ CHECK_TOKEN - Ошибка:', error.message)
    return NextResponse.json({ 
      hasToken: false, 
      valid: false,
      message: 'Ошибка проверки токена' 
    })
  }
} 