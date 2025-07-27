import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { TemplateType, SiteData } from '@/templates/TemplateLoader'
// Динамический импорт для избежания проблем с путями
// const { buildSite } = require('../../../scripts/build-astro.js')

// Временное хранилище сайтов (позже заменим на Strapi)
const SITES_DB_PATH = join(process.cwd(), 'data', 'sites.json')

interface GenerateSiteRequest {
  type: TemplateType
  domain: string
  siteName: string
  description: string
  keywords: string[]
  theme?: string
  content?: any
  settings?: {
    analytics?: {
      googleAnalytics?: string
    }
    seo?: any
    customCss?: string
  }
}

interface GeneratedSite {
  id: string
  domain: string
  siteName: string
  type: TemplateType
  status: 'generating' | 'ready' | 'deployed' | 'error'
  createdAt: string
  updatedAt: string
  data: SiteData
  files?: {
    html: string
    css: string
    js?: string
  }
  deploymentInfo?: {
    vpsId?: string
    sslEnabled?: boolean
    nginxConfig?: string
    buildPath?: string
    hasIndex?: boolean
    hasArticles?: boolean
    articleCount?: number
    imagesDownloaded?: number
    totalImages?: number
    error?: string
  }
}

// Утилита для чтения/записи базы сайтов
class SitesDatabase {
  private ensureDataDir() {
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }
  }

  private readSites(): GeneratedSite[] {
    try {
      this.ensureDataDir()
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

  private writeSites(sites: GeneratedSite[]) {
    try {
      this.ensureDataDir()
      writeFileSync(SITES_DB_PATH, JSON.stringify(sites, null, 2))
    } catch (error) {
      console.error('Error writing sites database:', error)
      throw new Error('Failed to save site data')
    }
  }

  addSite(site: GeneratedSite): void {
    const sites = this.readSites()
    sites.push(site)
    this.writeSites(sites)
  }

  getSite(id: string): GeneratedSite | null {
    const sites = this.readSites()
    return sites.find(site => site.id === id) || null
  }

  getAllSites(): GeneratedSite[] {
    return this.readSites()
  }

  updateSite(id: string, updates: Partial<GeneratedSite>): void {
    const sites = this.readSites()
    const index = sites.findIndex(site => site.id === id)
    if (index !== -1) {
      sites[index] = { ...sites[index], ...updates, updatedAt: new Date().toISOString() }
      this.writeSites(sites)
    }
  }
}

// Генератор HTML файлов на основе шаблонов
class SiteGenerator {
  generateSiteFiles(siteData: SiteData): { html: string; css: string; js?: string } {
    const { type, domain, siteName, description, keywords, theme = 'light', content = {} } = siteData

    // Базовый HTML шаблон
    const html = this.generateHTML(siteData)
    
    // Базовый CSS
    const css = this.generateCSS(type, theme)
    
    // Базовый JS (если нужен)
    const js = this.generateJS(type)

    return { html, css, js }
  }

  private generateHTML(siteData: SiteData): string {
    const { type, domain, siteName, description, keywords, content = {} } = siteData
    const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords

    // Базовая структура HTML для разных типов сайтов
    switch (type) {
      case 'pbn-blog':
        return this.generateBlogHTML(siteData)
      case 'pbn-news':
        return this.generateNewsHTML(siteData)
      case 'casino-premium':
        return this.generateCasinoHTML(siteData)
      default:
        return this.generateDefaultHTML(siteData)
    }
  }

  private generateBlogHTML(siteData: SiteData): string {
    const { domain, siteName, description, keywords, content = {} } = siteData
    const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords
    const { featured = [], recent = [], categories = [] } = content

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywordsString}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://${domain}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${siteName}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://${domain}">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "${siteName}",
        "url": "https://${domain}",
        "description": "${description}"
    }
    </script>
    
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1 class="site-title">${siteName}</h1>
            <nav class="main-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/articles">Articles</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <section class="hero">
                <h1>Welcome to ${siteName}</h1>
                <p>${description}</p>
            </section>

            ${featured.length > 0 ? `
            <section class="featured-articles">
                <h2>Featured Articles</h2>
                <div class="articles-grid">
                                ${featured.slice(0, 3).map((article: any) => `
            <article class="article-card">
                ${article.image ? `<img src="${article.image}" alt="${article.title}">` : ''}
                <div class="article-content">
                    <h3><a href="/articles/${article.slug}">${article.title}</a></h3>
                    <p>${article.excerpt}</p>
                    <div class="article-meta">
                        <time>${new Date(article.publishedAt).toLocaleDateString()}</time>
                        ${article.readTime ? `<span>${article.readTime}</span>` : ''}
                    </div>
                </div>
            </article>
            `).join('')}
                </div>
            </section>
            ` : ''}

            ${categories.length > 0 ? `
            <section class="categories">
                <h2>Categories</h2>
                <div class="categories-grid">
                    ${categories.map((category: any) => `
                    <a href="/category/${category.toLowerCase().replace(/\s+/g, '-')}" class="category-card">
                        <span>${category}</span>
                    </a>
                    `).join('')}
                </div>
            </section>
            ` : ''}
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${siteName}</h3>
                    <p>${description}</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                        <li><a href="/sitemap">Sitemap</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Contact</h3>
                    <p>For inquiries: info@${domain}</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`
  }

  private generateNewsHTML(siteData: SiteData): string {
    const { domain, siteName, description, content = {} } = siteData
    const { hasBreaking = false } = content

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://${domain}">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    ${hasBreaking ? `
    <div class="breaking-news">
        <div class="container">
            <span class="breaking-label">BREAKING</span>
            <span class="breaking-text">Latest breaking news updates - Stay informed with ${siteName}</span>
        </div>
    </div>
    ` : ''}

    <header class="site-header news-header">
        <div class="container">
            <div class="header-top">
                <span class="date">${new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <div class="header-links">
                    <a href="/subscribe">Subscribe</a>
                    <a href="/newsletter">Newsletter</a>
                </div>
            </div>
            <div class="header-main">
                <h1 class="site-title">${siteName}</h1>
                <nav class="main-nav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/politics">Politics</a></li>
                        <li><a href="/business">Business</a></li>
                        <li><a href="/technology">Technology</a></li>
                        <li><a href="/sports">Sports</a></li>
                        <li><a href="/world">World</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <h1>Latest News</h1>
            <p>Stay informed with the latest updates from ${siteName}</p>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
  }

  private generateCasinoHTML(siteData: SiteData): string {
    const { domain, siteName, description, content = {} } = siteData
    const { casino = {}, geo = {} } = content
    const {
      welcomeBonus = '100% up to $1000',
      freeSpins = 50,
      license = 'Gaming License',
      rating = 4.8
    } = casino

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName} - Premium Online Casino</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://${domain}">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="promo-banner">
        <div class="container">
            <span class="promo-text">🎰 ${welcomeBonus} + ${freeSpins} FREE SPINS! 🎰</span>
        </div>
    </div>

    <header class="site-header casino-header">
        <div class="container">
            <div class="header-content">
                <h1 class="site-title">🎲 ${siteName}</h1>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}</span>
                    <span class="rating-text">(${rating}/5)</span>
                </div>
                <nav class="main-nav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/games">Games</a></li>
                        <li><a href="/promotions">Promotions</a></li>
                        <li><a href="/vip">VIP Club</a></li>
                        <li><a href="/support">Support</a></li>
                    </ul>
                </nav>
                <div class="auth-buttons">
                    <button class="btn btn-secondary">Login</button>
                    <button class="btn btn-primary">Sign Up</button>
                </div>
            </div>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <section class="hero">
                <h1>Welcome to ${siteName}</h1>
                <p>${description}</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary btn-large">Play Now</button>
                    <button class="btn btn-secondary btn-large">Learn More</button>
                </div>
            </section>

            <section class="features">
                <div class="features-grid">
                    <div class="feature-card">
                        <h3>Welcome Bonus</h3>
                        <p>${welcomeBonus}</p>
                    </div>
                    <div class="feature-card">
                        <h3>Free Spins</h3>
                        <p>${freeSpins} Free Spins</p>
                    </div>
                    <div class="feature-card">
                        <h3>Licensed & Secure</h3>
                        <p>${license}</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer class="site-footer casino-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${siteName}</h3>
                    <p>${description}</p>
                    <div class="license-info">
                        <span class="license-badge">✓</span>
                        <span>${license}</span>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="responsible-gaming">
                    <span>18+ Only</span>
                    <span>|</span>
                    <span>Gamble Responsibly</span>
                    <span>|</span>
                    <span>&copy; ${new Date().getFullYear()} ${siteName}</span>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`
  }

  private generateDefaultHTML(siteData: SiteData): string {
    const { domain, siteName, description } = siteData

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <meta name="description" content="${description}">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1 class="site-title">${siteName}</h1>
        </div>
    </header>
    <main class="main-content">
        <div class="container">
            <h1>Welcome to ${siteName}</h1>
            <p>${description}</p>
        </div>
    </main>
    <footer class="site-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
  }

  private generateCSS(type: TemplateType, theme: string): string {
    const baseCSS = `
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
.site-header {
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.site-title {
    font-size: 2rem;
    font-weight: bold;
    color: #1a1a1a;
}

.main-nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
}

.main-nav a {
    text-decoration: none;
    color: #666;
    font-weight: 500;
    transition: color 0.3s;
}

.main-nav a:hover {
    color: #2563eb;
}

/* Main Content */
.main-content {
    min-height: 60vh;
    padding: 2rem 0;
}

/* Footer */
.site-footer {
    background: #f8f9fa;
    padding: 2rem 0;
    margin-top: 4rem;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 768px) {
    .main-nav ul {
        flex-direction: column;
        gap: 1rem;
    }
    
    .container {
        padding: 0 1rem;
    }
}
`

    // Добавляем специфичные стили для разных типов
    switch (type) {
      case 'pbn-blog':
        return baseCSS + this.getBlogCSS(theme)
      case 'pbn-news':
        return baseCSS + this.getNewsCSS()
      case 'casino-premium':
        return baseCSS + this.getCasinoCSS()
      default:
        return baseCSS
    }
  }

  private getBlogCSS(theme: string): string {
    const themes = {
      light: { bg: '#ffffff', text: '#1a1a1a', accent: '#2563eb' },
      dark: { bg: '#1a1a1a', text: '#ffffff', accent: '#60a5fa' },
      blue: { bg: '#eff6ff', text: '#1e3a8a', accent: '#2563eb' },
      green: { bg: '#f0fdf4', text: '#14532d', accent: '#16a34a' }
    }

    const currentTheme = themes[theme as keyof typeof themes] || themes.light

    return `
/* Blog Specific Styles */
.hero {
    text-align: center;
    padding: 4rem 0;
    background: linear-gradient(135deg, ${currentTheme.bg} 0%, #f8fafc 100%);
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.article-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.article-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.article-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.article-content {
    padding: 1.5rem;
}

.article-card h3 {
    margin-bottom: 0.5rem;
}

.article-card h3 a {
    color: ${currentTheme.text};
    text-decoration: none;
}

.article-card h3 a:hover {
    color: ${currentTheme.accent};
}

.article-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
}

.category-card {
    display: block;
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    text-align: center;
    text-decoration: none;
    color: ${currentTheme.text};
    transition: all 0.3s;
}

.category-card:hover {
    border-color: ${currentTheme.accent};
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
`
  }

  private getNewsCSS(): string {
    return `
/* News Specific Styles */
.breaking-news {
    background: #dc2626;
    color: white;
    padding: 0.5rem 0;
    font-weight: bold;
}

.breaking-label {
    background: white;
    color: #dc2626;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    margin-right: 1rem;
}

.news-header {
    background: white;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;
}

.header-links {
    display: flex;
    gap: 1rem;
}

.header-links a {
    color: #2563eb;
    text-decoration: none;
}

.header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}
`
  }

  private getCasinoCSS(): string {
    return `
/* Casino Specific Styles */
body {
    background: linear-gradient(135deg, #581c87 0%, #1e40af 50%, #4338ca 100%);
    min-height: 100vh;
}

.promo-banner {
    background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
    color: #000;
    padding: 0.5rem 0;
    text-align: center;
    font-weight: bold;
}

.casino-header {
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
}

.casino-header .site-title {
    color: white;
    font-size: 2.5rem;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    flex-wrap: wrap;
    gap: 1rem;
}

.rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
}

.stars {
    color: #fbbf24;
    font-size: 1.2rem;
}

.casino-header .main-nav a {
    color: white;
}

.casino-header .main-nav a:hover {
    color: #fbbf24;
}

.auth-buttons {
    display: flex;
    gap: 0.75rem;
}

.hero {
    text-align: center;
    padding: 4rem 0;
    color: white;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

.features {
    padding: 4rem 0;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
}

.casino-footer {
    background: rgba(0,0,0,0.8);
    color: white;
}

.license-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
}

.license-badge {
    background: #16a34a;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: bold;
}

.responsible-gaming {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 0.75rem;
    color: #9ca3af;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .header-content {
        flex-direction: column;
        text-align: center;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
}
`
  }

  private generateJS(type: TemplateType): string {
    const baseJS = `
// Basic site functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site loaded successfully');
    
    // Mobile menu toggle (if needed)
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
`

    if (type === 'casino-premium') {
      return baseJS + `
// Casino specific functionality
function openLiveChat() {
    console.log('Opening live chat...');
    // Live chat integration would go here
}

// Bonus claim tracking
function claimBonus(bonusType) {
    console.log('Claiming bonus:', bonusType);
    // Bonus claiming logic would go here
}
`
    }

    return baseJS
  }
}

const sitesDB = new SitesDatabase()
const siteGenerator = new SiteGenerator()

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSiteRequest = await request.json()
    
    // Валидация входных данных
    if (!body.domain || !body.siteName || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: domain, siteName, type' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли уже сайт с таким доменом
    const existingSites = sitesDB.getAllSites()
    const existingSite = existingSites.find(site => site.domain === body.domain)
    
    if (existingSite) {
      return NextResponse.json(
        { error: 'Site with this domain already exists' },
        { status: 409 }
      )
    }

    // Создаем объект данных сайта
    const siteData: SiteData = {
      type: body.type,
      domain: body.domain,
      siteName: body.siteName,
      description: body.description,
      keywords: body.keywords,
      theme: body.theme,
      content: body.content,
      settings: body.settings
    }

    // Генерируем уникальный ID
    const siteId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Создаем объект сгенерированного сайта с статусом "generating"
    const generatedSite: GeneratedSite = {
      id: siteId,
      domain: body.domain,
      siteName: body.siteName,
      type: body.type,
      status: 'generating',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: siteData
    }

    // Сохраняем в базу данных
    sitesDB.addSite(generatedSite)

    // Запускаем сборку Astro в фоне
    const { buildAstroSite } = require('../../../scripts/build-astro.js');
    
    buildAstroSite({
      name: body.siteName,
      description: body.description,
      domain: body.domain,
      template: body.type,
      keywords: body.keywords || [],
      theme: body.theme || 'light',
      analytics: {
        googleAnalytics: body.settings?.analytics?.googleAnalytics || ""
      }
    }).then((result: any) => {
      console.log(`✅ Astro build completed for ${body.domain}:`, result)
      
      // Обновляем статус сайта
      sitesDB.updateSite(siteId, {
        status: result.success ? 'ready' : 'error',
        deploymentInfo: {
          buildPath: result.distPath,
          hasIndex: result.hasIndex,
          hasArticles: result.hasArticles,
          articleCount: result.articleCount,
          imagesDownloaded: result.imagesDownloaded,
          totalImages: result.totalImages,
          error: result.error
        }
      })
    }).catch((error: any) => {
      console.error(`❌ Astro build failed for ${body.domain}:`, error)
      
      // Обновляем статус сайта на ошибку
      sitesDB.updateSite(siteId, {
        status: 'error',
        deploymentInfo: {
          error: error.message
        }
      })
    })

    console.log(`🚀 Site generation started: ${body.domain}`)

    return NextResponse.json({
      success: true,
      message: 'Site generation started',
      site: {
        id: generatedSite.id,
        domain: generatedSite.domain,
        siteName: generatedSite.siteName,
        type: generatedSite.type,
        status: generatedSite.status,
        createdAt: generatedSite.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error generating site:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const sites = sitesDB.getAllSites()
    
    // Возвращаем только основную информацию о сайтах
    const sitesInfo = sites.map(site => ({
      id: site.id,
      domain: site.domain,
      siteName: site.siteName,
      type: site.type,
      status: site.status,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt
    }))

    return NextResponse.json({
      success: true,
      sites: sitesInfo,
      total: sitesInfo.length
    })

  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 