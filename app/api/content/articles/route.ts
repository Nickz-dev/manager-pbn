import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
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

interface CreateArticleRequest {
  siteId: string
  title: string
  content: string
  excerpt?: string
  category: string
  tags?: string[]
  status?: 'draft' | 'published' | 'scheduled'
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  scheduledFor?: string
  aiGenerated?: boolean
}

class ArticlesDatabase {
  private ensureDataDir() {
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }
  }

  private readArticles(): Article[] {
    try {
      this.ensureDataDir()
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

  private writeArticles(articles: Article[]) {
    try {
      this.ensureDataDir()
      writeFileSync(ARTICLES_DB_PATH, JSON.stringify(articles, null, 2))
    } catch (error) {
      console.error('Error writing articles database:', error)
      throw new Error('Failed to save article data')
    }
  }

  addArticle(article: Article): void {
    const articles = this.readArticles()
    articles.push(article)
    this.writeArticles(articles)
  }

  getArticle(id: string): Article | null {
    const articles = this.readArticles()
    return articles.find(article => article.id === id) || null
  }

  getAllArticles(siteId?: string): Article[] {
    const articles = this.readArticles()
    if (siteId) {
      return articles.filter(article => article.siteId === siteId)
    }
    return articles
  }

  updateArticle(id: string, updates: Partial<Article>): void {
    const articles = this.readArticles()
    const index = articles.findIndex(article => article.id === id)
    if (index !== -1) {
      articles[index] = { ...articles[index], ...updates, updatedAt: new Date().toISOString() }
      this.writeArticles(articles)
    }
  }

  deleteArticle(id: string): boolean {
    const articles = this.readArticles()
    const index = articles.findIndex(article => article.id === id)
    if (index !== -1) {
      articles.splice(index, 1)
      this.writeArticles(articles)
      return true
    }
    return false
  }
}

const articlesDB = new ArticlesDatabase()

// Utility function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Utility function to calculate reading time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateArticleRequest = await request.json()
    
    // Validation
    if (!body.siteId || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, title, content' },
        { status: 400 }
      )
    }

    // Generate article data
    const articleId = `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const slug = generateSlug(body.title)
    const readTime = calculateReadTime(body.content)
    const excerpt = body.excerpt || body.content.substring(0, 150) + '...'

    const article: Article = {
      id: articleId,
      siteId: body.siteId,
      title: body.title,
      content: body.content,
      excerpt,
      slug,
      status: body.status || 'draft',
      category: body.category,
      tags: body.tags || [],
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || excerpt,
      featuredImage: body.featuredImage,
      publishedAt: body.status === 'published' ? new Date().toISOString() : undefined,
      scheduledFor: body.scheduledFor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'AI Assistant', // TODO: Get from auth
      readTime,
      aiGenerated: body.aiGenerated || false
    }

    // Save to database
    articlesDB.addArticle(article)

    console.log(`✅ Article created: ${body.title}`)

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        createdAt: article.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let articles = articlesDB.getAllArticles(siteId || undefined)

    // Filter by status if provided
    if (status) {
      articles = articles.filter(article => article.status === status)
    }

    // Sort by creation date (newest first)
    articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const total = articles.length
    const paginatedArticles = articles.slice(offset, offset + limit)

    // Return summary data (without full content)
    const articlesInfo = paginatedArticles.map(article => ({
      id: article.id,
      siteId: article.siteId,
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      status: article.status,
      category: article.category,
      tags: article.tags,
      featuredImage: article.featuredImage,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: article.author,
      readTime: article.readTime,
      aiGenerated: article.aiGenerated
    }))

    return NextResponse.json({
      success: true,
      articles: articlesInfo,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 