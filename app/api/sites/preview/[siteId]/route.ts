import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

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
    'poker-platform': 'astro-poker-platform',
    'pbn-blog': 'astro-pbn-blog'
  }
  
  return templateMap[template] || 'astro-casino-blog'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const { siteId } = params
    const url = new URL(request.url)
    const pathname = url.pathname
    
    if (!siteId) {
      return NextResponse.json(
        { error: 'Missing siteId parameter' },
        { status: 400 }
      )
    }

    console.log(`🔍 Preview request for site ${siteId}, path: ${pathname}`)

    // Пробуем найти собранные файлы в разных шаблонах
    const possibleTemplates = ['astro-casino-blog', 'astro-slots-review', 'astro-gaming-news', 'astro-sports-betting', 'astro-poker-platform']
    let templateDir = null
    let distPath = null

    for (const template of possibleTemplates) {
      const testPath = path.join(process.cwd(), 'templates', template, 'dist')
      try {
        await fs.access(testPath)
        const files = await fs.readdir(testPath)
        if (files.length > 0) {
          templateDir = template
          distPath = testPath
          break
        }
      } catch {
        continue
      }
    }

    if (!templateDir || !distPath) {
      return NextResponse.json(
        { error: 'No built templates found. Please build at least one template first.' },
        { status: 404 }
      )
    }

    console.log(`📁 Using template: ${templateDir}`)
    console.log(`📁 Dist path: ${distPath}`)

    // Извлекаем путь к файлу из URL
    let filePath = pathname.replace(`/api/sites/preview/${siteId}`, '')
    
    // Если путь пустой, возвращаем index.html
    if (!filePath || filePath === '/') {
      filePath = 'index.html'
    }
    
    // Убираем ведущий слеш если есть
    if (filePath.startsWith('/')) {
      filePath = filePath.substring(1)
    }
    
    const fullPath = path.join(distPath, filePath)
    
    console.log(`📄 Requested file: ${filePath}`)
    console.log(`📄 Full path: ${fullPath}`)

    try {
      // Проверяем, что файл существует и находится в пределах dist папки
      const relativePath = path.relative(distPath, fullPath)
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      const fileContent = await fs.readFile(fullPath)
      
      // Определяем Content-Type на основе расширения файла
      const ext = path.extname(filePath).toLowerCase()
      let contentType = 'text/html'
      
      switch (ext) {
        case '.css':
          contentType = 'text/css'
          break
        case '.js':
          contentType = 'application/javascript'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.svg':
          contentType = 'image/svg+xml'
          break
        case '.ico':
          contentType = 'image/x-icon'
          break
        case '.woff':
          contentType = 'font/woff'
          break
        case '.woff2':
          contentType = 'font/woff2'
          break
        case '.ttf':
          contentType = 'font/ttf'
          break
        case '.eot':
          contentType = 'application/vnd.ms-fontobject'
          break
      }
      
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        }
      })
    } catch (error) {
      console.error('Error reading file:', error)
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: 'Preview failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}