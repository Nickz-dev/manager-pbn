import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

// GET /api/content/authors
export async function GET() {
  try {
    const authors = await strapiAPI.getAuthors()
    return NextResponse.json({ success: true, authors })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 })
  }
}

// POST /api/content/authors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = body.data || body
    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields: name, email' }, { status: 400 })
    }
    
    // Генерируем slug из имени
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const authorData = { ...data, slug }
    const author = await strapiAPI.createAuthor(authorData)
    return NextResponse.json({ success: true, author })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 })
  }
} 