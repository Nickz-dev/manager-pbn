import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'
import { promises as fs } from 'fs'
import fsSync from 'fs'
import path from 'path'
import axios from 'axios'

// Helper function to map template names to directory names
function getTemplateDirectory(template: string): string {
  const templateMap: { [key: string]: string } = {
    'casino-blog': 'astro-casino-blog',
    'casino-standard': 'astro-casino-blog',
    'casino-premium': 'casino/premium',
    'slots-review': 'astro-slots-review',
    'gaming-news': 'astro-gaming-news',
    'premium-casino': 'casino/premium',
    'sports-betting': 'astro-sports-betting',
    'poker-platform': 'astro-poker-platform'
  }
  
  return templateMap[template] || 'astro-casino-blog' // fallback to default
}

// Функция для генерации слага из заголовка
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

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
    let articles = []
    if (site.selectedArticles && site.selectedArticles.length > 0) {
      // Получаем статьи по их ID из selectedArticles
      articles = await strapiAPI.getArticlesByIds(site.selectedArticles)
    } else {
      // Fallback: получаем статьи по связи с сайтом
      articles = await strapiAPI.getArticlesBySite(siteId)
    }
    console.log(`📄 Found ${articles.length} articles for site ${siteId}`)
    
    // 3. Формируем слаги для статей
    const articlesWithSlugs = articles.map(article => ({
      ...article,
      slug: article.slug || generateSlug(article.title)
    }))
    console.log(`🔗 Generated slugs for ${articlesWithSlugs.length} articles`)
    
    // 4. Формируем data.json для Astro
    const astroData = await generateAstroData(site, articlesWithSlugs)
    
    // 5. Скачиваем изображения и упаковываем в assets
    const imageStats = await downloadAndProcessImages(articlesWithSlugs, siteId, site.template)
    
    // 6. Записываем data.json в шаблон
    await writeAstroData(astroData, siteId, site.template)
    
    // 7. Запускаем билд Astro
    const buildResult = await buildAstroTemplate(siteId, site.template)

    // 8. Обновляем статус сайта
    await strapiAPI.updatePbnSite(siteId, { statuspbn: 'deployed' })

    // Подсчитываем количество сгенерированных страниц
    const generatedPages = buildResult.articleCount + (buildResult.hasIndex ? 1 : 0)

    return NextResponse.json({
      success: true,
      message: 'Build completed successfully',
      siteId,
      buildUrl: `/sites/preview/${siteId}`, // URL для предпросмотра
      previewUrl: `/sites/preview/${siteId}`, // Дублируем для совместимости
      imagesDownloaded: imageStats.downloaded,
      totalImages: imageStats.total,
      articleCount: articlesWithSlugs.length,
      generatedPages: generatedPages,
      hasIndex: buildResult.hasIndex,
      hasArticles: buildResult.hasArticles,
      buildResult
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

  // Получаем уникальные категории из выбранных статей
  const selectedCategories = new Set<string>()
  articles.forEach(article => {
    if (article.content_categories && Array.isArray(article.content_categories)) {
      article.content_categories.forEach((cat: any) => {
        selectedCategories.add(cat.name)
      })
    }
  })

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
    categories: Array.from(selectedCategories).map(name => ({ name, slug: generateSlug(name) })),
    authors: await strapiAPI.getAuthors(),
    buildInfo: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      articleCount: articles.length,
      categoryCount: selectedCategories.size
    }
  }
}

async function downloadAndProcessImages(articles: any[], siteId: string, template: string) {
  const templateDir = path.join(process.cwd(), 'templates', getTemplateDirectory(template))
  const assetsDir = path.join(templateDir, 'src', 'assets', 'images', 'articles')
  
  console.log(`📁 Template directory: ${templateDir}`)
  console.log(`📁 Assets directory: ${assetsDir}`)
  
  // Создаем директорию если не существует
  await fs.mkdir(assetsDir, { recursive: true })

  let downloaded = 0
  let total = 0

  console.log(`📄 Processing ${articles.length} articles for images...`)

  for (const article of articles) {
    console.log(`📄 Article ${article.id}: ${article.title}`)
    console.log(`🖼️ Featured image: ${article.featured_image}`)
    
    if (article.featured_image) {
      total++
      try {
        const imageUrl = article.featured_image
        const imageName = `${article.id}-${Date.now()}.jpg`
        const imagePath = path.join(assetsDir, imageName)
        
        console.log(`⬇️ Downloading: ${imageUrl} -> ${imagePath}`)
        
        // Скачиваем изображение
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        await fs.writeFile(imagePath, response.data)
        
        // Обновляем путь к изображению в статье
        article.featured_image = `/src/assets/images/articles/${imageName}`
        
        downloaded++
        console.log(`✅ Downloaded image for article ${article.id}: ${imageName}`)
      } catch (error) {
        console.warn(`⚠️ Failed to download image for article ${article.id}:`, error)
        // Устанавливаем дефолтное изображение
        article.featured_image = '/src/assets/images/default-article.svg'
      }
    } else {
      console.log(`❌ No featured image for article ${article.id}`)
    }
  }
  
  console.log(`📊 Image download stats: ${downloaded}/${total} images downloaded`)
  return { downloaded, total }
}

async function writeAstroData(data: any, siteId: string, template: string) {
  const templateDir = path.join(process.cwd(), 'templates', getTemplateDirectory(template))
  const dataPath = path.join(templateDir, 'src', 'data', 'site-data.json')
  
  // Создаем директорию если не существует
  await fs.mkdir(path.dirname(dataPath), { recursive: true })
  
  // Записываем данные
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
  
  console.log(`✅ Generated data.json for site ${siteId}`)
}

async function buildAstroTemplate(siteId: string, template: string) {
  const templateDir = path.join(process.cwd(), 'templates', getTemplateDirectory(template))
  
  // Сохраняем текущую директорию
  const originalCwd = process.cwd()
  
  try {
    // Переходим в директорию шаблона
    process.chdir(templateDir)
    
    console.log(`🔨 Building template: ${template} in ${templateDir}`)
    
    const { execSync } = require('child_process')
    
    // Проверяем есть ли node_modules и package.json
    const hasNodeModules = fsSync.existsSync(path.join(templateDir, 'node_modules'))
    const hasPackageJson = fsSync.existsSync(path.join(templateDir, 'package.json'))
    
    if (!hasPackageJson) {
      throw new Error(`package.json not found in ${templateDir}`)
    }
    
    if (!hasNodeModules) {
      console.log('📦 Installing dependencies...')
      try {
        // Устанавливаем зависимости без неподдерживаемых флагов
        execSync('npm install', { 
          stdio: 'inherit',
          cwd: templateDir,
          timeout: 300000 // 5 минут
        })
        
        // Принудительно устанавливаем rollup зависимости для Linux
        console.log('🔧 Installing rollup dependencies for Linux...')
        execSync('npm install @rollup/rollup-linux-x64-gnu', { 
          stdio: 'inherit',
          cwd: templateDir,
          timeout: 60000 // 1 минута
        })
        
        // Пересобираем зависимости
        console.log('🔨 Rebuilding dependencies...')
        execSync('npm rebuild', { 
          stdio: 'inherit',
          cwd: templateDir,
          timeout: 120000 // 2 минуты
        })
        
      } catch (installError) {
        console.error('❌ Failed to install dependencies:', installError)
        throw new Error(`Dependency installation failed: ${installError.message}`)
      }
    }
    
    // Проверяем, что astro доступен
    try {
      execSync('npx astro --version', { 
        stdio: 'pipe',
        cwd: templateDir,
        timeout: 10000
      })
    } catch (astroError) {
      console.error('❌ Astro not available:', astroError)
      throw new Error('Astro is not properly installed')
    }
    
    // Запускаем билд
    console.log('🔨 Building Astro template...')
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: templateDir,
        timeout: 300000 // 5 минут
      })
    } catch (buildError) {
      console.error('❌ Build failed:', buildError)
      throw new Error(`Build failed: ${buildError.message}`)
    }
    
    // Проверяем результат сборки
    const distDir = path.join(templateDir, 'dist')
    const buildResult = await checkBuildResults(distDir)
    
    console.log(`✅ Astro build completed for site ${siteId}`)
    return buildResult
    
  } catch (error) {
    console.error('Build error:', error)
    throw new Error(`Astro build failed: ${error.message}`)
  } finally {
    // Возвращаемся в исходную директорию
    process.chdir(originalCwd)
  }
}

async function checkBuildResults(distDir: string) {
  const results = {
    hasIndex: false,
    hasArticles: false,
    articleCount: 0,
    files: [] as string[]
  }
  
  try {
    await fs.access(distDir)
  } catch {
    console.log(`❌ Директория dist не найдена: ${distDir}`)
    return results
  }
  
  // Получаем список файлов
  const files = await getAllFiles(distDir)
  results.files = files
  
  console.log(`📁 Найдено файлов в dist: ${files.length}`)
  console.log(`📄 Файлы:`, files.slice(0, 10).map(f => path.basename(f)).join(', '))
  
  // Проверяем наличие index.html
  const indexFiles = files.filter(file => file.endsWith('index.html'))
  results.hasIndex = indexFiles.some(file => 
    path.basename(path.dirname(file)) === 'dist' || 
    path.basename(file) === 'index.html'
  )
  
  // Проверяем наличие страниц статей
  const articleFiles = files.filter(file => 
    file.includes('articles') && file.endsWith('index.html')
  )
  results.hasArticles = articleFiles.length > 0
  results.articleCount = articleFiles.length
  
  console.log(`📊 Результаты проверки:`)
  console.log(`  - Есть index.html: ${results.hasIndex}`)
  console.log(`  - Есть статьи: ${results.hasArticles}`)
  console.log(`  - Количество статей: ${results.articleCount}`)
  console.log(`  - Всего HTML файлов: ${indexFiles.length}`)
  
  return results
}

async function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): Promise<string[]> {
  const files = await fs.readdir(dirPath)
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const stat = await fs.stat(fullPath)
    
    if (stat.isDirectory()) {
      arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles)
    } else {
      arrayOfFiles.push(fullPath)
    }
  }
  
  return arrayOfFiles
} 