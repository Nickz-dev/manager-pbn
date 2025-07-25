import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

// GET /api/content/articles
export async function GET() {
  try {
    const articles = await strapiAPI.getArticles()
    console.log('ARTICLES:', articles)
    return NextResponse.json({ success: true, articles })
  } catch (error) {
    console.error('Error in /api/content/articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
} 