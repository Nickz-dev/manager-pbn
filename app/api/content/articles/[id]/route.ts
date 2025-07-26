import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const articles = await strapiAPI.getArticles()
    // Пробуем найти по documentId, если не найдем - по id
    const article = articles.find(a => a.documentId === id) || articles.find(a => a.id.toString() === id)

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      article: article
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const data = body.data || body
    
    if (!data.title) {
      return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 })
    }

    // Находим статью по documentId или id
    const articles = await strapiAPI.getArticles()
    const article = articles.find((a: any) => a.documentId === id) || articles.find((a: any) => a.id.toString() === id)
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const updatedArticle = await strapiAPI.updateArticle(article.documentId, data)
    return NextResponse.json({ success: true, article: updatedArticle })

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🗑️ Attempting to delete article with ID: ${params.id}`)
    
    // Находим статью по documentId или id
    const articles = await strapiAPI.getArticles()
    const article = articles.find((a: any) => a.documentId === params.id) || articles.find((a: any) => a.id.toString() === params.id)
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    
    console.log(`📄 Found article with documentId: ${article.documentId}`)
    const result = await strapiAPI.deleteArticle(article.documentId)
    console.log(`✅ Delete result:`, result.status, result.statusText)
    
    // Проверяем, действительно ли статья удалена
    try {
      const articlesAfterDelete = await strapiAPI.getArticles()
      const articleStillExists = articlesAfterDelete.find((a: any) => a.documentId === article.documentId)
      console.log(`🔍 Article still exists after delete:`, !!articleStillExists)
      
      if (articleStillExists) {
        console.log(`⚠️ Article was not actually deleted from Strapi`)
        return NextResponse.json({ 
          success: false, 
          message: 'Article was not deleted from database',
          articleStillExists: true 
        }, { status: 500 })
      }
    } catch (checkError) {
      console.log(`🔍 Could not verify deletion:`, checkError)
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`❌ Delete error:`, error?.response?.status, error?.response?.data)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete article' },
      { status: 500 }
    )
  }
} 