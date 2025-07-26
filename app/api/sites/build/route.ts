import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'
import { promises as fs } from 'fs'
import path from 'path'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { siteId } = body

    if (!siteId) {
      return NextResponse.json(
        { error: 'Missing siteId parameter' },
        { status: 400 }
      )
    }

    console.log(`🚀 Starting build pipeline for site ${siteId}`)

    // 1. Получаем данные сайта из Strapi
    const site = await strapiAPI.getPbnSiteById(siteId)
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // 2. Получаем статьи для сайта
    const articles = await strapiAPI.getArticlesBySite(siteId)
    
    // 3. Формируем data.json для Astro
    const astroData = await generateAstroData(site, articles)
    
    // 4. Скачиваем изображения и упаковываем в assets
    await downloadAndProcessImages(articles, siteId)
    
    // 5. Записываем data.json в шаблон
    await writeAstroData(astroData, siteId)
    
    // 6. Запускаем билд Astro
    await buildAstroTemplate(siteId)

    // 7. Обновляем статус сайта
    await strapiAPI.updatePbnSite(siteId, { statuspbn: 'deployed' })

    return NextResponse.json({
      success: true,
      message: 'Build completed successfully',
      siteId,
      buildUrl: `http://localhost:4321/sites/${siteId}` // URL для предпросмотра
    })

  } catch (error) {
    console.error('Build pipeline error:', error)
    return NextResponse.json(
      { error: 'Build pipeline failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function generateAstroData(site: any, articles: any[]) {
  const processedArticles = articles.map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: article.content,
    featured_image: article.featured_image,
    meta_title: article.meta_title || article.title,
    meta_description: article.meta_description || article.excerpt,
    publishedAt: article.publishedAt,
    author: article.content_author ? {
      name: article.content_author.name,
      bio: article.content_author.bio,
      avatar: article.content_author.avatar
    } : null,
    categories: article.content_categories ? article.content_categories.map((cat: any) => ({
      name: cat.name,
      slug: cat.slug,
      color: cat.color
    })) : []
  }))

  return {
    site: {
      name: site.name,
      description: site.description,
      domain: site.domain,
      template: site.template,
      config: site.config || {},
      analytics: {
        googleAnalytics: site.config?.analytics?.googleAnalytics || ''
      }
    },
    articles: processedArticles,
    categories: await strapiAPI.getCategories(),
    authors: await strapiAPI.getAuthors(),
    buildInfo: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  }
}

async function downloadAndProcessImages(articles: any[], siteId: string) {
  const templateDir = path.join(process.cwd(), 'templates', 'astro-pbn-blog')
  const assetsDir = path.join(templateDir, 'src', 'assets', 'images', 'articles')
  
  // Создаем директорию если не существует
  await fs.mkdir(assetsDir, { recursive: true })

  for (const article of articles) {
    if (article.featured_image) {
      try {
        const imageUrl = article.featured_image
        const imageName = `${article.id}-${Date.now()}.jpg`
        const imagePath = path.join(assetsDir, imageName)
        
        // Скачиваем изображение
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        await fs.writeFile(imagePath, response.data)
        
        // Обновляем путь к изображению в статье
        article.featured_image = `/src/assets/images/articles/${imageName}`
        
        console.log(`✅ Downloaded image for article ${article.id}: ${imageName}`)
      } catch (error) {
        console.warn(`⚠️ Failed to download image for article ${article.id}:`, error)
        // Устанавливаем дефолтное изображение
        article.featured_image = '/src/assets/images/default-article.svg'
      }
    }
  }
}

async function writeAstroData(data: any, siteId: string) {
  const templateDir = path.join(process.cwd(), 'templates', 'astro-pbn-blog')
  const dataPath = path.join(templateDir, 'src', 'data', 'site-data.json')
  
  // Создаем директорию если не существует
  await fs.mkdir(path.dirname(dataPath), { recursive: true })
  
  // Записываем данные
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
  
  console.log(`✅ Generated data.json for site ${siteId}`)
}

async function buildAstroTemplate(siteId: string) {
  const templateDir = path.join(process.cwd(), 'templates', 'astro-pbn-blog')
  
  // Переходим в директорию шаблона
  process.chdir(templateDir)
  
  try {
    // Устанавливаем зависимости если нужно
    const { execSync } = require('child_process')
    
    // Проверяем есть ли node_modules
    try {
      await fs.access(path.join(templateDir, 'node_modules'))
    } catch {
      console.log('📦 Installing dependencies...')
      execSync('npm install', { stdio: 'inherit' })
    }
    
    // Запускаем билд
    console.log('🔨 Building Astro template...')
    execSync('npm run build', { stdio: 'inherit' })
    
    console.log(`✅ Astro build completed for site ${siteId}`)
  } catch (error) {
    console.error('Build error:', error)
    throw new Error(`Astro build failed: ${error}`)
  } finally {
    // Возвращаемся в корневую директорию
    process.chdir(process.cwd())
  }
} 