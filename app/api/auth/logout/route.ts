import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Выход выполнен успешно'
    })

    // Clear auth cookie
    response.cookies.delete('auth-token')
    
    return response
  } catch (error: any) {
    console.error('❌ LOGOUT - Ошибка:', error.message)
    return NextResponse.json(
      { error: 'Ошибка при выходе из системы' },
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