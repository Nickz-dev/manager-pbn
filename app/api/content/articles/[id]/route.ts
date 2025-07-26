import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const articles = await strapiAPI.getArticles()
    
    // Пробуем найти по documentId, slug, или id
    const article = articles.find((a: any) => a.documentId === id) || 
                   articles.find((a: any) => a.slug === id) || 
                   articles.find((a: any) => a.id.toString() === id)

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
    
    // Проверяем, что есть хотя бы одно поле для обновления
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Находим статью по documentId, slug, или id
    const articles = await strapiAPI.getArticles()
    const article = articles.find((a: any) => a.documentId === id) || 
                   articles.find((a: any) => a.slug === id) || 
                   articles.find((a: any) => a.id.toString() === id)
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const updatedArticle = await strapiAPI.updateArticle(article.documentId, data)
    
    // Получаем обновленную статью с полными данными
    const freshArticles = await strapiAPI.getArticles()
    const freshArticle = freshArticles.find((a: any) => a.documentId === article.documentId)
    
    return NextResponse.json({ success: true, article: freshArticle || updatedArticle })

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
    // Находим статью по documentId, slug, или id
    const articles = await strapiAPI.getArticles()
    const article = articles.find((a: any) => a.documentId === params.id) || 
                   articles.find((a: any) => a.slug === params.id) || 
                   articles.find((a: any) => a.id.toString() === params.id)
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    
    await strapiAPI.deleteArticle(article.documentId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete article' },
      { status: 500 }
    )
  }
} 