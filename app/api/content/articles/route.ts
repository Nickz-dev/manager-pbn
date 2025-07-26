import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

// GET /api/content/articles
export async function GET() {
  try {
    const articles = await strapiAPI.getArticles()
    return NextResponse.json({ success: true, articles })
  } catch (error) {
    console.error('Error in /api/content/articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

// POST /api/content/articles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const articleData = body.data

    // Подготавливаем данные для Strapi
    const strapiData = {
      ...articleData,
      content_categories: articleData.content_categories && articleData.content_categories.length > 0 ? 
        articleData.content_categories.map((id: string) => ({ id })) : 
        null,
      content_author: articleData.content_author ? 
        { id: articleData.content_author } : 
        null,
      pbn_site: articleData.pbn_site ? 
        { id: articleData.pbn_site } : 
        null
    }

    const article = await strapiAPI.createArticle(strapiData)
    return NextResponse.json({ success: true, article })
  } catch (error: any) {
    console.error('Error in POST /api/content/articles:', error)
    return NextResponse.json(
      { error: 'Failed to create article', details: error.message },
      { status: 500 }
    )
  }
} 