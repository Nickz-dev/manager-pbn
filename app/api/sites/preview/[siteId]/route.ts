import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { strapiAPI } from '@/lib/strapi-client'

// Helper function to map template names to directory names
function getTemplateDirectory(template: string): string {
  const templateMap: { [key: string]: string } = {
    'casino-blog': 'casino-blog',
    'slots-review': 'slots-review',
    'gaming-news': 'gaming-news',
    'sports-betting': 'sports-betting',
    'poker-platform': 'poker-platform',
    'premium-casino': 'casino/premium'
  }
  
  return templateMap[template] || 'casino-blog'
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

    // Получаем данные сайта из Strapi для определения правильного template
    let site = null
    let templateDir = null
    let distPath = null

    try {
      site = await strapiAPI.getPbnSiteById(siteId)
      console.log(`📋 Site data: ${site?.name}, template: ${site?.template}`)
      
      if (site?.template) {
        const mappedTemplate = getTemplateDirectory(site.template)
        const testPath = path.join(process.cwd(), 'templates', mappedTemplate, 'dist')
        console.log(`🔍 Checking mapped template: ${mappedTemplate} at ${testPath}`)
        
        try {
          await fs.access(testPath)
          const files = await fs.readdir(testPath)
          if (files.length > 0) {
            templateDir = mappedTemplate
            distPath = testPath
            console.log(`✅ Using site template: ${site.template} -> ${mappedTemplate}`)
          }
        } catch (error) {
          console.warn(`⚠️ Template ${mappedTemplate} not found, trying fallback`)
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not get site data for ${siteId}:`, error)
    }

    // Если не нашли по данным сайта, пробуем найти любой доступный template
    if (!templateDir || !distPath) {
      console.log(`🔍 Searching for available templates...`)
      const possibleTemplates = ['casino-blog', 'slots-review', 'gaming-news', 'sports-betting', 'poker-platform', 'premium-casino']
      
      for (const template of possibleTemplates) {
        const testPath = path.join(process.cwd(), 'templates', template, 'dist')
        try {
          await fs.access(testPath)
          const files = await fs.readdir(testPath)
          if (files.length > 0) {
            templateDir = template
            distPath = testPath
            console.log(`✅ Found available template: ${template}`)
            break
          }
        } catch {
          continue
        }
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
      
      console.log(`✅ Serving file: ${filePath} with content-type: ${contentType}`)
      
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