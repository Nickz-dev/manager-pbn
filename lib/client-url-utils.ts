/**
 * Client-side URL utilities for PBN Manager
 * Handles both localhost and VPS environments
 */

// Get base URL for the current environment (client-side)
export function getClientBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

// Get preview URL for a specific port (client-side)
export function getClientPreviewUrl(port: number): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    return `http://${hostname}:${port}`
  }
  return `http://localhost:${port}`
}

// Get API URL for the current environment (client-side)
export function getClientApiUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

// Check if running on localhost (client-side)
export function isClientLocalhost(): boolean {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1'
  }
  return true
}

// Get environment info for debugging (client-side)
export function getClientEnvironmentInfo() {
  if (typeof window !== 'undefined') {
    return {
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      origin: window.location.origin,
      isLocalhost: isClientLocalhost()
    }
  }
  return {
    hostname: 'localhost',
    port: '3000',
    protocol: 'http:',
    origin: 'http://localhost:3000',
    isLocalhost: true
  }
} 