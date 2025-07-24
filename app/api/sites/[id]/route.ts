import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const SITES_DB_PATH = join(process.cwd(), 'data', 'sites.json')

interface GeneratedSite {
  id: string
  domain: string
  siteName: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
  data: any
  files?: {
    html: string
    css: string
    js?: string
  }
  deploymentInfo?: any
}

function readSites(): GeneratedSite[] {
  try {
    if (!existsSync(SITES_DB_PATH)) {
      return []
    }
    const data = require(SITES_DB_PATH)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error reading sites database:', error)
    return []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const sites = readSites()
    const site = sites.find(s => s.id === id)

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Check if requesting file download
    const { searchParams } = new URL(request.url)
    const downloadFile = searchParams.get('download')

    if (downloadFile && site.files) {
      let content = ''
      let filename = ''
      let contentType = 'text/plain'

      switch (downloadFile) {
        case 'html':
          content = site.files.html
          filename = `${site.domain}.html`
          contentType = 'text/html'
          break
        case 'css':
          content = site.files.css
          filename = `${site.domain}.css`
          contentType = 'text/css'
          break
        case 'js':
          content = site.files.js || ''
          filename = `${site.domain}.js`
          contentType = 'application/javascript'
          break
        case 'zip':
          // Create a simple text-based bundle for now
          content = `# ${site.siteName} - Generated Site Files

## index.html
${site.files.html}

## styles.css
${site.files.css}

${site.files.js ? `## script.js
${site.files.js}` : ''}`
          filename = `${site.domain}-site.txt`
          contentType = 'text/plain'
          break
        default:
          return NextResponse.json(
            { error: 'Invalid file type' },
            { status: 400 }
          )
      }

      return new NextResponse(content, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      site: site
    })

  } catch (error) {
    console.error('Error fetching site:', error)
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
    const sites = readSites()
    const siteIndex = sites.findIndex(s => s.id === id)

    if (siteIndex === -1) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // Remove site from array
    const deletedSite = sites.splice(siteIndex, 1)[0]

    // Save updated sites list
    const fs = require('fs')
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(SITES_DB_PATH, JSON.stringify(sites, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Site deleted successfully',
      deletedSite: {
        id: deletedSite.id,
        domain: deletedSite.domain,
        siteName: deletedSite.siteName
      }
    })

  } catch (error) {
    console.error('Error deleting site:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 