import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware for public routes
  const publicPaths = ['/login', '/api/auth/login', '/_next', '/favicon.ico']
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

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that start with /api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 