/**
 * URL utilities for PBN Manager
 * Handles both localhost and VPS environments
 */

// Get base URL for the current environment
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current location
    return window.location.origin
  }
  
  // Server-side: use environment variables
  const vpsAddress = process.env.VPS_ADDRESS
  const port = process.env.PORT || '3000'
  
  if (vpsAddress && vpsAddress !== 'your-vps-ip-address-here') {
    return `http://${vpsAddress}:${port}`
  }
  
  return `http://localhost:${port}`
}

// Get Strapi URL for the current environment
export function getStrapiUrl(): string {
  const vpsAddress = process.env.VPS_ADDRESS
  const strapiPort = process.env.STRAPI_PORT || '1337'
  
  if (vpsAddress && vpsAddress !== 'your-vps-ip-address-here') {
    return `http://${vpsAddress}:${strapiPort}`
  }
  
  return process.env.STRAPI_URL || `http://localhost:${strapiPort}`
}

// Get preview URL for a specific port
export function getPreviewUrl(port: number): string {
  const vpsAddress = process.env.VPS_ADDRESS
  
  if (vpsAddress && vpsAddress !== 'your-vps-ip-address-here') {
    return `http://${vpsAddress}:${port}`
  }
  
  return `http://localhost:${port}`
}

// Check if running on VPS
export function isVpsEnvironment(): boolean {
  const vpsAddress = process.env.VPS_ADDRESS
  return !!(vpsAddress && vpsAddress !== 'your-vps-ip-address-here')
}

// Get environment info for debugging
export function getEnvironmentInfo() {
  return {
    baseUrl: getBaseUrl(),
    strapiUrl: getStrapiUrl(),
    isVps: isVpsEnvironment(),
    vpsAddress: process.env.VPS_ADDRESS,
    port: process.env.PORT || '3000',
    strapiPort: process.env.STRAPI_PORT || '1337'
  }
} 