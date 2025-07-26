import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

// GET /api/content/categories
export async function GET() {
  try {
    const categories = await strapiAPI.getCategories()
    return NextResponse.json({ success: true, categories })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST /api/content/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = body.data || body
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
    }
    const category = await strapiAPI.createCategory(data)
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('POST /api/content/categories error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create category', details: error, strapi: error?.response?.data }, { status: 500 })
  }
} 