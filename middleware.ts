import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Skip middleware for public routes
  const publicPaths = [
    '/login', 
    '/api/auth/login', 
    '/api/auth/check-token', 
    '/api/content', 
    '/_next', 
    '/favicon.ico'
  ]
  
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('auth-token')?.value

  // If no token found, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify JWT token using Edge-compatible function
  const payload = verifyTokenEdge(token)
  
  if (!payload) {
    // Invalid token, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 