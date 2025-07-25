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
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Missing required fields: name, email' }, { status: 400 })
    }
    const author = await strapiAPI.createAuthor(body)
    return NextResponse.json({ success: true, author })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 })
  }
} 