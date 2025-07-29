const fs = require('fs');
const path = require('path');

console.log('🔗 Исправление ссылок на категории во всех шаблонах...\n');

// Актуализированный список шаблонов
const templates = [
  'astro-casino-blog',
  'astro-slots-review', 
  'astro-gaming-news',
  'astro-sports-betting',
  'astro-poker-platform'
];

function fixCategoryLinks(templateName) {
  console.log(`\n🔧 Исправляем ${templateName}...`);
  
  const templatePath = path.join(__dirname, '../templates', templateName);
  const indexPath = path.join(templatePath, 'src/pages/index.astro');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`   ❌ index.astro не найден в ${templateName}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Ищем блок категорий и исправляем его
    const categoryBlockRegex = /<div class="categories-grid">\s*{popularCategories\.map\(category => \(\s*<div class="category-card">\s*<h3>\{category\.name\}<\/h3>\s*<p>.*?<\/p>\s*<\/div>\s*\)\)\s*<\/div>/s;
    
    if (categoryBlockRegex.test(content)) {
      // Заменяем на версию с ссылками
      const replacement = `<div class="categories-grid">
            {popularCategories.map(category => (
              <a href={\`/categories/\${category.slug}\`} style="text-decoration: none; color: inherit;">
                <div class="category-card">
                  <h3>{category.name}</h3>
                  <p>Latest news in {category.name.toLowerCase()}</p>
                </div>
              </a>
            ))}
          </div>`;
      
      content = content.replace(categoryBlockRegex, replacement);
      
      fs.writeFileSync(indexPath, content, 'utf8');
      console.log(`   ✅ Ссылки на категории исправлены в ${templateName}`);
      return true;
    } else {
      console.log(`   ⚠️  Блок категорий не найден в ${templateName}`);
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Ошибка при исправлении ${templateName}: ${error.message}`);
    return false;
  }
}

function createMissingIndexFiles() {
  console.log('\n📄 Создание отсутствующих index.astro файлов...');
  
  const templatesToCreate = [
    'astro-slots-review',
    'astro-sports-betting', 
    'astro-poker-platform'
  ];
  
  for (const template of templatesToCreate) {
    const templatePath = path.join(__dirname, '../templates', template);
    const indexPath = path.join(templatePath, 'src/pages/index.astro');
    
    if (!fs.existsSync(indexPath)) {
      console.log(`   📝 Создаем index.astro для ${template}...`);
      
      // Создаем базовую структуру
      const basicIndexContent = `---
import siteData from '../data/site-data.json';

const { site, articles, categories, authors } = siteData;

// Получаем последние статьи
const latestArticles = articles
  .filter(article => article.publishedAt)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 9);

// Получаем популярные категории
const popularCategories = categories.slice(0, 5);
---

<!DOCTYPE html>
<html lang={site.config?.language || 'en'}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{site.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; }
    .articles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .article-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
    .category-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
    a { text-decoration: none; color: inherit; }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>{site.name}</h1>
      <p>{site.description}</p>
    </header>

    <main>
      {latestArticles.length > 0 ? (
        <>
          <h2>Latest Articles</h2>
          <div class="articles-grid">
            {latestArticles.map(article => (
              <div class="article-card">
                <a href={\`/articles/\${article.slug}\`}>
                  <h3>{article.title}</h3>
                  {article.excerpt && <p>{article.excerpt}</p>}
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No articles available</p>
      )}

      {popularCategories.length > 0 && (
        <>
          <h2>Popular Categories</h2>
          <div class="categories-grid">
            {popularCategories.map(category => (
              <a href={\`/categories/\${category.slug}\`}>
                <div class="category-card">
                  <h3>{category.name}</h3>
                  <p>Latest news in {category.name.toLowerCase()}</p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </main>
  </div>
</body>
</html>`;
      
      // Создаем директорию если её нет
      const pagesDir = path.dirname(indexPath);
      if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
      }
      
      fs.writeFileSync(indexPath, basicIndexContent, 'utf8');
      console.log(`   ✅ index.astro создан для ${template}`);
    }
  }
}

function createMissingDataFiles() {
  console.log('\n📊 Создание отсутствующих site-data.json файлов...');
  
  const dataTemplates = {
    'astro-slots-review': {
      name: 'Slots Review',
      description: 'Best slot machine reviews and guides',
      articles: [
        {
          id: 1,
          title: 'Top Slot Machines 2024',
          slug: 'top-slot-machines-2024',
          excerpt: 'Discover the most popular slot machines',
          publishedAt: '2024-01-15T10:00:00.000Z',
          author: { name: 'Slot Expert' }
        }
      ],
      categories: [
        { name: 'Slot Reviews', slug: 'slot-reviews', description: 'Slot machine reviews' },
        { name: 'Gaming Tips', slug: 'gaming-tips', description: 'Gaming strategies' }
      ]
    },
    'astro-sports-betting': {
      name: 'Sports Betting',
      description: 'Sports betting news and analysis',
      articles: [
        {
          id: 1,
          title: 'Sports Betting Guide 2024',
          slug: 'sports-betting-guide-2024',
          excerpt: 'Complete guide to sports betting',
          publishedAt: '2024-01-15T10:00:00.000Z',
          author: { name: 'Sports Analyst' }
        }
      ],
      categories: [
        { name: 'Football', slug: 'football', description: 'Football betting' },
        { name: 'Basketball', slug: 'basketball', description: 'Basketball betting' }
      ]
    },
    'astro-poker-platform': {
      name: 'Poker Platform',
      description: 'Poker news and strategy guides',
      articles: [
        {
          id: 1,
          title: 'Poker Strategy Guide',
          slug: 'poker-strategy-guide',
          excerpt: 'Master poker strategies',
          publishedAt: '2024-01-15T10:00:00.000Z',
          author: { name: 'Poker Pro' }
        }
      ],
      categories: [
        { name: 'Texas Holdem', slug: 'texas-holdem', description: 'Texas Holdem strategy' },
        { name: 'Tournaments', slug: 'tournaments', description: 'Poker tournaments' }
      ]
    }
  };
  
  for (const [template, data] of Object.entries(dataTemplates)) {
    const templatePath = path.join(__dirname, '../templates', template);
    const dataPath = path.join(templatePath, 'src/data/site-data.json');
    
    if (!fs.existsSync(dataPath)) {
      console.log(`   📝 Создаем site-data.json для ${template}...`);
      
      const siteData = {
        site: {
          name: data.name,
          description: data.description,
          domain: `${template.replace('astro-', '')}.com`,
          keywords: [template.replace('astro-', ''), 'gambling', 'reviews'],
          config: { language: 'en' },
          og_image: '/images/default-og.jpg',
          analytics: { googleAnalytics: '' }
        },
        articles: data.articles,
        categories: data.categories,
        authors: [
          { name: 'Expert', bio: 'Professional reviewer' }
        ]
      };
      
      // Создаем директорию если её нет
      const dataDir = path.dirname(dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(dataPath, JSON.stringify(siteData, null, 2), 'utf8');
      console.log(`   ✅ site-data.json создан для ${template}`);
    }
  }
}

async function main() {
  console.log('🚀 Начинаем исправление ссылок на категории...\n');
  
  // Создаем отсутствующие файлы
  createMissingDataFiles();
  createMissingIndexFiles();
  
  let successCount = 0;
  let totalTemplates = templates.length;
  
  // Исправляем ссылки на категории
  for (const template of templates) {
    if (fixCategoryLinks(template)) {
      successCount++;
    }
  }
  
  console.log('\n📊 Результаты исправления:');
  console.log(`   ✅ Успешно: ${successCount}/${totalTemplates}`);
  console.log(`   ❌ Ошибок: ${totalTemplates - successCount}/${totalTemplates}`);
  
  if (successCount === totalTemplates) {
    console.log('\n🎉 Все ссылки на категории исправлены!');
    console.log('\n💡 Теперь все шаблоны имеют:');
    console.log('   ✅ Правильные ссылки на категории');
    console.log('   ✅ Актуализированные данные');
    console.log('   ✅ Единообразную структуру');
  } else {
    console.log('\n⚠️  Некоторые шаблоны не удалось исправить');
    console.log('\n💡 Проверьте файлы вручную');
  }
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
});