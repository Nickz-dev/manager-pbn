import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { getPreviewUrl } from '@/lib/url-utils'

// Хранилище активных preview процессов
const activePreviews = new Map<string, { process: any, timer: NodeJS.Timeout, port: number }>()

// Helper function to map template names to directory names
function getTemplateDirectory(template: string): string {
  const templateMap: { [key: string]: string } = {
    'casino-blog': 'astro-pbn-blog',
    'casino-standard': 'astro-pbn-blog',
    'casino-premium': 'casino/premium',
    'slots-review': 'astro-slots-review',
    'gaming-news': 'astro-gaming-news',
    'premium-casino': 'casino/premium',
    'sports-betting': 'astro-sports-betting',
    'poker-platform': 'astro-poker-platform'
  }
  
  return templateMap[template] || 'astro-pbn-blog' // fallback to default
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { template } = body

    if (!template) {
      return NextResponse.json({ 
        success: false, 
        error: 'Template is required' 
      }, { status: 400 })
    }

    // Проверяем, не запущен ли уже preview для этого сайта
    if (activePreviews.has(id)) {
      const existing = activePreviews.get(id)!
      const elapsed = Date.now() - (existing.timer as any)._idleStart
      const timeLeft = Math.max(0, Math.ceil((60000 - elapsed) / 1000))
      return NextResponse.json({
        success: true,
        message: 'Preview already running',
        url: getPreviewUrl(existing.port),
        timeLeft: timeLeft
      })
    }

    // Определяем путь к шаблону с учетом маппинга
    const templateDir = getTemplateDirectory(template)
    const templatePath = path.join(process.cwd(), 'templates', templateDir)
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ 
        success: false, 
        error: `Template directory not found: ${templateDir} (for template: ${template})` 
      }, { status: 404 })
    }

    // Проверяем, что dist папка существует
    const distPath = path.join(templatePath, 'dist')
    if (!fs.existsSync(distPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Site not built yet. Please build the site first.' 
      }, { status: 400 })
    }

    // Используем фиксированный порт 4322 для превью
    const port = 4322

    // Проверяем, что порт свободен
    const net = await import('net')
    const isPortAvailable = await new Promise<boolean>((resolve) => {
      const server = net.createServer()
      server.listen(port, () => {
        server.close(() => resolve(true))
      })
      server.on('error', () => {
        resolve(false)
      })
    })

    if (!isPortAvailable) {
      // Принудительно освобождаем порт 4322
      try {
        const { execSync } = require('child_process')
        execSync('pkill -f "astro.*4322"', { stdio: 'ignore' })
        execSync('pkill -f "npm.*preview.*4322"', { stdio: 'ignore' })
        console.log('Принудительно освобожден порт 4322')
        
        // Ждем немного для освобождения порта
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.log('Не удалось освободить порт 4322:', error.message)
      }
    }

    // Запускаем preview сервер с фиксированным портом и принудительным указанием порта
    const previewProcess = spawn('npx', ['astro', 'preview', '--port', '4322', '--host', '0.0.0.0'], {
      cwd: templatePath,
      stdio: 'pipe',
      shell: true
    })

    // Ждем немного, чтобы сервер запустился
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Проверяем, что процесс все еще работает
    if (previewProcess.killed) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to start preview server' 
      }, { status: 500 })
    }

    // Устанавливаем таймер на автоматическое закрытие через 1 минуту
    const timer = setTimeout(() => {
      if (activePreviews.has(id)) {
        const preview = activePreviews.get(id)!
        preview.process.kill('SIGTERM')
        activePreviews.delete(id)
        console.log(`Preview server for site ${id} automatically stopped`)
      }
    }, 60000) // 1 минута

    // Сохраняем информацию о процессе
    activePreviews.set(id, { process: previewProcess, timer, port })

    // Обрабатываем выход процесса
    previewProcess.on('exit', (code) => {
      if (activePreviews.has(id)) {
        const preview = activePreviews.get(id)!
        clearTimeout(preview.timer)
        activePreviews.delete(id)
        console.log(`Preview server for site ${id} stopped with code ${code}`)
      }
    })

    // Логируем вывод и ошибки
    previewProcess.stdout?.on('data', (data) => {
      console.log(`Preview output for site ${id}:`, data.toString())
    })
    
    previewProcess.stderr?.on('data', (data) => {
      console.error(`Preview error for site ${id}:`, data.toString())
    })

    return NextResponse.json({
      success: true,
      message: 'Preview server started successfully',
      url: getPreviewUrl(port),
      port: port,
      timeLeft: 60 // секунд
    })

  } catch (error) {
    console.error('Error starting preview:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!activePreviews.has(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active preview found for this site' 
      }, { status: 404 })
    }

    const preview = activePreviews.get(id)!
    
    // Останавливаем процесс
    preview.process.kill('SIGTERM')
    
    // Очищаем таймер
    clearTimeout(preview.timer)
    
    // Удаляем из активных
    activePreviews.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Preview server stopped successfully'
    })

  } catch (error) {
    console.error('Error stopping preview:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!activePreviews.has(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active preview found for this site' 
      }, { status: 404 })
    }

    const preview = activePreviews.get(id)!
    const elapsed = Date.now() - (preview.timer as any)._idleStart
    const timeLeft = Math.max(0, Math.ceil((60000 - elapsed) / 1000))

    return NextResponse.json({
      success: true,
      isRunning: true,
      url: getPreviewUrl(preview.port),
      port: preview.port,
      timeLeft: Math.max(0, timeLeft)
    })

  } catch (error) {
    console.error('Error getting preview status:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 