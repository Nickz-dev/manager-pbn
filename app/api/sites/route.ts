import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET(request: NextRequest) {
  try {
    const sites = await strapiAPI.getPbnSites()
    return NextResponse.json({ sites })
  } catch (error: any) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
} 