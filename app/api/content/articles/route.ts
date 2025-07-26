import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

// GET /api/content/articles
export async function GET() {
  try {
    const articles = await strapiAPI.getArticles()
    return NextResponse.json({ success: true, articles })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

// POST /api/content/articles
export async function POST(request: NextRequest) {
  let body: any
  let strapiData: any
  
  try {
    body = await request.json()
    const articleData = body

    // Функция для генерации slug из заголовка
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[а-яё]/g, (char) => {
          const map: { [key: string]: string } = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
            'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
          }
          return map[char] || char
        })
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '')
    }

    // Подготавливаем данные для Strapi
    strapiData = {
      title: articleData.title,
      slug: generateSlug(articleData.title),
      content: articleData.content,
      excerpt: articleData.excerpt,
      meta_title: articleData.meta_title,
      meta_description: articleData.meta_description,
      statusarticles: articleData.statusarticles,
      content_categories: articleData.content_categories && articleData.content_categories.length > 0 ? 
        articleData.content_categories : 
        undefined,
      content_author: articleData.content_author ? 
        articleData.content_author : 
        undefined,
      pbn_site: articleData.pbn_site ? 
        articleData.pbn_site : 
        undefined
    }

    const article = await strapiAPI.createArticle(strapiData)
    return NextResponse.json({ success: true, article })
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Failed to create article', 
        details: errorMessage
      },
      { status: 500 }
    )
  }
} 