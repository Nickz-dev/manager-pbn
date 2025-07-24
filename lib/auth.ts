import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Admin Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pbn-manager.local'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!

// Interfaces
export interface User {
  id: string
  email: string
  role: 'admin'
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Extract token from request
export function extractTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try cookie
  const cookieToken = request.cookies.get('auth-token')?.value
  if (cookieToken) {
    return cookieToken
  }

  return null
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // For MVP, we only support admin user
  if (email !== ADMIN_EMAIL) {
    return null
  }

  const isValidPassword = await verifyPassword(password, ADMIN_PASSWORD_HASH)
  if (!isValidPassword) {
    return null
  }

  return {
    id: 'admin',
    email: ADMIN_EMAIL,
    role: 'admin'
  }
}

// Get user from token
export function getUserFromToken(token: string): User | null {
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role as 'admin'
  }
}

// Check if user has required role
export function hasRole(user: User | null, requiredRole: string): boolean {
  if (!user) return false
  
  // For MVP, only admin role exists
  if (requiredRole === 'admin' && user.role === 'admin') {
    return true
  }
  
  return false
}

// Middleware helper for route protection
export function requireAuth(requiredRole: string = 'admin') {
  return async (request: NextRequest) => {
    const token = extractTokenFromRequest(request)
    
    if (!token) {
      return { authorized: false, user: null }
    }

    const user = getUserFromToken(token)
    
    if (!user || !hasRole(user, requiredRole)) {
      return { authorized: false, user: null }
    }

    return { authorized: true, user }
  }
}

// Check if authentication is properly configured
export function isAuthConfigured(): { configured: boolean, errors: string[] } {
  const errors: string[] = []

  if (!JWT_SECRET) {
    errors.push('JWT_SECRET не установлен')
  }

  if (!ADMIN_PASSWORD_HASH) {
    errors.push('ADMIN_PASSWORD_HASH не установлен')
  }

  if (JWT_SECRET && JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET должен быть не менее 32 символов')
  }

  return {
    configured: errors.length === 0,
    errors
  }
} 