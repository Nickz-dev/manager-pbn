const fs = require('fs');
const path = require('path');

console.log('🔧 Starting category pages creation script...');

// Список всех Astro шаблонов
const astroTemplates = [
  'casino-blog',
  'slots-review', 
  'gaming-news',
  'sports-betting',
  'poker-platform'
];

console.log('📋 Templates to process:', astroTemplates);

// Шаблон страницы категории
const categoryPageTemplate = `---
import siteData from '../../data/site-data.json';

export async function getStaticPaths() {
  const { categories } = siteData;
  
  return categories.map(category => ({
    params: { slug: category.slug },
    props: { category }
  }));
}

const { category } = Astro.props;
const { site, articles, categories } = siteData;

// Получаем статьи для данной категории
const categoryArticles = articles.filter(article => 
  article.categories?.some(cat => cat.slug === category.slug)
);

// Получаем другие категории для навигации
const otherCategories = categories.filter(cat => cat.slug !== category.slug).slice(0, 5);

// Генерируем структурированные данные
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": \`\${category.name} - \${site.name}\`,
  "description": \`Latest \${category.name.toLowerCase()} news and articles\`,
  "url": \`https://\${site.domain}/categories/\${category.slug}\`,
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": categoryArticles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "headline": article.title,
        "url": \`https://\${site.domain}/articles/\${article.slug}\`,
        "author": {
          "@type": "Person",
          "name": article.author?.name || "Anonymous"
        },
        "datePublished": article.publishedAt,
        "dateModified": article.updatedAt || article.publishedAt
      }
    }))
  }
};

// Генерируем Open Graph данные
const ogData = {
  title: \`\${category.name} - \${site.name}\`,
  description: \`Latest \${category.name.toLowerCase()} news and articles\`,
  url: \`https://\${site.domain}/categories/\${category.slug}\`,
  type: 'website',
  site_name: site.name,
  image: site.og_image || \`/images/default-og.jpg\`
};
---

<!DOCTYPE html>
<html lang={site.config?.language || 'en'}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#10b981">
  
  <!-- Primary Meta Tags -->
  <title>{ogData.title}</title>
  <meta name="title" content={ogData.title}>
  <meta name="description" content={ogData.description}>
  <meta name="keywords" content={\`\${category.name}, gaming news, \${site.keywords?.join(', ') || ''}\`}>
  <meta name="author" content={site.name}>
  <meta name="robots" content="index, follow">
  <meta name="language" content={site.config?.language || 'en'}>
  
  <!-- Canonical URL -->
  <link rel="canonical" href={ogData.url}>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={ogData.type}>
  <meta property="og:url" content={ogData.url}>
  <meta property="og:title" content={ogData.title}>
  <meta property="og:description" content={ogData.description}>
  <meta property="og:image" content={ogData.image}>
  <meta property="og:site_name" content={ogData.site_name}>
  <meta property="og:locale" content={site.config?.language || 'en_US'}>
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content={ogData.url}>
  <meta property="twitter:title" content={ogData.title}>
  <meta property="twitter:description" content={ogData.description}>
  <meta property="twitter:image" content={ogData.image}>
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  
  <!-- Preload critical resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"></noscript>
  
  <!-- Google Analytics -->
  {site.analytics?.googleAnalytics && (
    <script async src={\`https://www.googletagmanager.com/gtag/js?id=\${site.analytics.googleAnalytics}\`}></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{site.analytics.googleAnalytics}', {
        page_title: '{ogData.title}',
        page_location: '{ogData.url}'
      });
    </script>
  )}
  
  <!-- Structured Data -->
  <script type="application/ld+json" set:html={JSON.stringify(structuredData)}></script>
  
  <style>
    :root {
      --primary-color: #10b981;
      --primary-hover: #059669;
      --accent-color: #3b82f6;
      --accent-hover: #2563eb;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --bg-accent: #f1f5f9;
      --text-primary: #1e293b;
      --text-secondary: #475569;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      padding: 1.5rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-lg);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .header h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    .header a:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.4);
    }
    
    .main {
      padding: 3rem 0;
      flex: 1;
    }
    
    .category-header {
      margin-bottom: 4rem;
      text-align: center;
      position: relative;
    }
    
    .category-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin: 0 0 2rem;
      color: var(--text-primary);
      line-height: 1.1;
      position: relative;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .category-title::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translate(-50%);
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      border-radius: 2px;
    }
    
    .category-description {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }
    
    .article-card {
      background: var(--bg-secondary);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
      border: 1px solid var(--border-color);
      position: relative;
    }
    
    .article-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    }
    
    .article-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-xl);
    }
    
    .article-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .article-card:hover .article-image {
      transform: scale(1.05);
    }
    
    .article-content {
      padding: 1.5rem;
    }
    
    .article-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: var(--text-primary);
      line-height: 1.4;
    }
    
    .article-excerpt {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .article-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    
    .article-author {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .author-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .no-articles {
      text-align: center;
      padding: 4rem 0;
      color: var(--text-secondary);
    }
    
    .no-articles h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    
    .other-categories {
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid var(--border-color);
    }
    
    .other-categories h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;
      color: var(--text-primary);
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .category-card {
      background: var(--bg-secondary);
      padding: 2rem 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: all 0.3s ease;
      border: 1px solid var(--border-color);
      position: relative;
      overflow: hidden;
    }
    
    .category-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    }
    
    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .category-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    
    .category-card p {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: 2rem 0;
      margin-top: auto;
      box-shadow: var(--shadow-sm);
    }
    
    .footer-content {
      text-align: center;
      color: var(--text-muted);
    }
    
    .footer a {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.3s ease;
      font-weight: 500;
    }
    
    .footer a:hover {
      color: var(--primary-hover);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      
      .category-title {
        font-size: 2.5rem;
      }
      
      .category-description {
        font-size: 1rem;
      }
      
      .articles-grid {
        grid-template-columns: 1fr;
      }
      
      .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .category-title {
        font-size: 2rem;
      }
      
      .article-content {
        padding: 1rem;
      }
      
      .category-card {
        padding: 1.5rem 1rem;
      }
    }
    
    /* Focus styles for accessibility */
    a:focus,
    button:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    
    /* Animations */
    @keyframes slideInUp {
      0% {
        opacity: 0;
        transform: translateY(40px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .category-header,
    .articles-grid,
    .other-categories {
      animation: slideInUp 0.8s ease-out;
    }
    
    .article-card {
      animation: slideInUp 0.8s ease-out;
      animation-delay: calc(var(--card-index, 0) * 0.1s);
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <h1><a href="/">🎮 {site.name}</a></h1>
        <a href="/">← Back to Home</a>
      </div>
    </div>
  </header>

  <main class="main">
    <div class="container">
      <div class="category-header">
        <h1 class="category-title">📰 {category.name}</h1>
        <p class="category-description">
          Latest {category.name.toLowerCase()} news and articles from the gaming world
        </p>
      </div>

      {categoryArticles.length > 0 ? (
        <div class="articles-grid">
          {categoryArticles.map((article, index) => (
            <article class="article-card" style={\`--card-index: \${index}\`}>
              <a href={\`/articles/\${article.slug}\`} style="text-decoration: none; color: inherit;">
                {article.featured_image ? (
                  <img 
                    src={article.featured_image} 
                    alt={article.title}
                    class="article-image"
                    loading="lazy"
                    onerror="this.style.display='none';"
                  />
                ) : (
                  <div class="article-image" style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">
                    🎮
                  </div>
                )}
                <div class="article-content">
                  <h2 class="article-title">{article.title}</h2>
                  {article.excerpt && (
                    <p class="article-excerpt">{article.excerpt}</p>
                  )}
                  <div class="article-meta">
                    <div class="article-author">
                      <div class="author-avatar">
                        {(article.author?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <span>{article.author?.name || 'Anonymous'}</span>
                    </div>
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div class="no-articles">
          <h2>No articles in this category yet</h2>
          <p>Check back soon for new {category.name.toLowerCase()} content!</p>
        </div>
      )}

      {otherCategories.length > 0 && (
        <div class="other-categories">
          <h2>Other Categories</h2>
          <div class="categories-grid">
            {otherCategories.map(cat => (
              <div class="category-card">
                <a href={\`/categories/\${cat.slug}\`} style="text-decoration: none; color: inherit;">
                  <h3>{cat.name}</h3>
                  <p>Explore {cat.name.toLowerCase()} content</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p>
          <a href="/">Home</a> • 
          <a href="/categories">All Categories</a> • 
          <a href="/about">About</a>
        </p>
      </div>
    </div>
  </footer>
</body>
</html>`;

function createCategoryPages() {
  console.log('🚀 Creating category pages for all Astro templates...');
  
  astroTemplates.forEach(template => {
    const templatePath = path.join(__dirname, '../templates', template);
    const categoriesDir = path.join(templatePath, 'src/pages/categories');
    const categoryPagePath = path.join(categoriesDir, '[slug].astro');
    
    // Создаем директорию categories если её нет
    if (!fs.existsSync(categoriesDir)) {
      fs.mkdirSync(categoriesDir, { recursive: true });
      console.log(`✅ Created categories directory for ${template}`);
    }
    
    // Создаем страницу категории
    if (!fs.existsSync(categoryPagePath)) {
      fs.writeFileSync(categoryPagePath, categoryPageTemplate);
      console.log(`✅ Created category page for ${template}`);
    } else {
      console.log(`⚠️  Category page already exists for ${template}`);
    }
  });
  
  console.log('🎉 Category pages creation completed!');
}

// Запускаем скрипт
createCategoryPages();