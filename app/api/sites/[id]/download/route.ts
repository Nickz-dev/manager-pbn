import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('📦 API: Downloading dist folder for site ID:', id)
    
    // Получаем информацию о сайте
    const site = await strapiAPI.getPbnSiteById(id)
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }
    
    // Определяем путь к папке dist
    const getTemplateDirectory = (template: string) => {
      const templateMap: { [key: string]: string } = {
        'blog': 'astro-pbn-blog',
        'casino-standard': 'astro-pbn-blog',
        'casino-premium': 'casino/premium',
        'gaming-news': 'astro-gaming-news',
        'poker-platform': 'astro-poker-platform',
        'slots-review': 'astro-slots-review',
        'sports-betting': 'astro-sports-betting'
      }
      
      const templateDir = templateMap[template] || 'astro-pbn-blog'
      return path.join(process.cwd(), 'templates', templateDir)
    }
    
    const templateDir = getTemplateDirectory(site.template)
    const distPath = path.join(templateDir, 'dist')
    
    console.log('📦 API: Template directory:', templateDir)
    console.log('📦 API: Dist path:', distPath)
    
    // Проверяем существование папки dist
    if (!fs.existsSync(distPath)) {
      return NextResponse.json(
        { error: 'Dist folder not found. Please build the site first.' },
        { status: 404 }
      )
    }
    
    // Создаем ZIP архив
    const archive = archiver('zip', {
      zlib: { level: 9 } // Максимальное сжатие
    })
    
    // Создаем поток для записи
    const chunks: Buffer[] = []
    archive.on('data', (chunk) => chunks.push(chunk))
    
    // Добавляем содержимое папки dist в архив
    archive.directory(distPath, false)
    
    // Завершаем архив
    await archive.finalize()
    
    // Объединяем все чанки в один буфер
    const zipBuffer = Buffer.concat(chunks)
    
    console.log('✅ API: ZIP archive created successfully, size:', zipBuffer.length, 'bytes')
    
    // Возвращаем ZIP файл
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${site.name}-${site.documentId}.zip"`,
        'Content-Length': zipBuffer.length.toString()
      }
    })

  } catch (error: any) {
    console.error('❌ API: Error downloading dist folder:', error)
    
    return NextResponse.json(
      { error: 'Failed to download dist folder', details: error.message },
      { status: 500 }
    )
  }
} 