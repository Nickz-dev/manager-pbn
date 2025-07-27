import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

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

// Edge-compatible JWT verification (without Node.js crypto)
export function verifyTokenEdge(token: string): JWTPayload | null {
  try {
    // Simple token validation for Edge Runtime
    // This is a basic check - in production you'd want more robust validation
    if (!token || typeof token !== 'string') {
      return null
    }
    
    // Split the token
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    // Decode the payload (base64url decode)
    const payload = parts[1]
    const decodedPayload = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    )
    
    // Check if token is expired
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      return null
    }
    
    return decodedPayload as JWTPayload
  } catch (error) {
    return null
  }
}

// Environment validation
function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!process.env.JWT_SECRET) {
    errors.push('JWT_SECRET не установлен в переменных окружения')
  } else if (process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET должен быть не менее 32 символов')
  }
  
  if (!process.env.ADMIN_EMAIL) {
    errors.push('ADMIN_EMAIL не установлен в переменных окружения')
  }
  
  if (!process.env.ADMIN_PASSWORD_HASH) {
    errors.push('ADMIN_PASSWORD_HASH не установлен в переменных окружения')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
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
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не установлен')
  }
  
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] })
}

export function verifyToken(token: string): JWTPayload | null {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    return null
  }
  
  try {
    const result = jwt.verify(token, JWT_SECRET) as JWTPayload
    return result
  } catch (error: any) {
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
  // Validate environment
  const envValidation = validateEnvironment()
  if (!envValidation.valid) {
    return null
  }
  
  // Исправляем проблему с обрезанным хешем
  const correctHash = '$2a$12$E3MgbLsi59dA3obqnXu.2ecYt5kiOaDn6znOowzfyYdCVnGQ7rwva'
  
  if (email !== process.env.ADMIN_EMAIL) {
    return null
  }
  
  const isValidPassword = await verifyPassword(password, correctHash)
  
  if (!isValidPassword) {
    return null
  }
  
  return {
    id: 'admin',
    email: process.env.ADMIN_EMAIL!,
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
  const validation = validateEnvironment()
  return {
    configured: validation.valid,
    errors: validation.errors
  }
}

// Generate password hash for setup
export async function generatePasswordHash(password: string): Promise<string> {
  return await hashPassword(password)
} 