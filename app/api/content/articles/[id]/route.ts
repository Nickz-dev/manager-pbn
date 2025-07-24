import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ARTICLES_DB_PATH = join(process.cwd(), 'data', 'articles.json')

interface Article {
  id: string
  siteId: string
  title: string
  content: string
  excerpt: string
  slug: string
  status: 'draft' | 'published' | 'scheduled'
  category: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  publishedAt?: string
  scheduledFor?: string
  createdAt: string
  updatedAt: string
  author: string
  readTime?: string
  aiGenerated: boolean
}

function readArticles(): Article[] {
  try {
    if (!existsSync(ARTICLES_DB_PATH)) {
      return []
    }
    const data = require(ARTICLES_DB_PATH)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error reading articles database:', error)
    return []
  }
}

function writeArticles(articles: Article[]) {
  try {
    const fs = require('fs')
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    writeFileSync(ARTICLES_DB_PATH, JSON.stringify(articles, null, 2))
  } catch (error) {
    console.error('Error writing articles database:', error)
    throw new Error('Failed to save article data')
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const articles = readArticles()
    const article = articles.find(a => a.id === id)

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

  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
    
    const articles = readArticles()
    const articleIndex = articles.findIndex(a => a.id === id)

    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const currentArticle = articles[articleIndex]
    
    // Update article data
    const updatedArticle: Article = {
      ...currentArticle,
      ...body,
      id: currentArticle.id, // Prevent ID changes
      slug: body.title ? generateSlug(body.title) : currentArticle.slug,
      readTime: body.content ? calculateReadTime(body.content) : currentArticle.readTime,
      publishedAt: (body.status === 'published' && currentArticle.status !== 'published') 
        ? new Date().toISOString() 
        : currentArticle.publishedAt,
      updatedAt: new Date().toISOString()
    }

    articles[articleIndex] = updatedArticle
    writeArticles(articles)

    console.log(`✅ Article updated: ${updatedArticle.title}`)

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        slug: updatedArticle.slug,
        status: updatedArticle.status,
        updatedAt: updatedArticle.updatedAt
      }
    })

  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const articles = readArticles()
    const articleIndex = articles.findIndex(a => a.id === id)

    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const deletedArticle = articles.splice(articleIndex, 1)[0]
    writeArticles(articles)

    console.log(`✅ Article deleted: ${deletedArticle.title}`)

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
      deletedArticle: {
        id: deletedArticle.id,
        title: deletedArticle.title,
        slug: deletedArticle.slug
      }
    })

  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 