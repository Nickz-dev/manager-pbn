const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Конфигурация Strapi
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

// Пути к файлам
const ASTRO_DATA_PATH = path.join(__dirname, '../templates/astro-pbn-blog/src/data/site-data.json');
const ASTRO_PUBLIC_PATH = path.join(__dirname, '../templates/astro-pbn-blog/public');

// Функция для генерации слага из заголовка
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Утилита для скачивания изображений
async function downloadImage(imageUrl, fileName) {
  try {
    console.log(`📥 Downloading image: ${imageUrl}`);
    
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      timeout: 10000
    });

    const filePath = path.join(ASTRO_PUBLIC_PATH, fileName);
    const writer = fs.createWriteStream(filePath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Image saved: ${fileName}`);
        resolve(`/${fileName}`);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Failed to download image ${imageUrl}:`, error.message);
    return null;
  }
}

// Утилита для сохранения base64 изображений
async function saveBase64Image(base64Data, fileName) {
  try {
    console.log(`📥 Saving base64 image: ${fileName}`);
    
    // Убираем префикс data:image/jpeg;base64,
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    const filePath = path.join(ASTRO_PUBLIC_PATH, fileName);
    fs.writeFileSync(filePath, imageBuffer);
    
    console.log(`✅ Base64 image saved: ${fileName}`);
    return `/images/${fileName.split('/').pop()}`;
  } catch (error) {
    console.error(`❌ Error saving base64 image: ${error.message}`);
    return null;
  }
}

// Обработка изображений в контенте
async function processImages(content, imageStats = { downloaded: 0, total: 0 }) {
  if (!content) return { content, imageStats };
  
  let processedContent = content;
  const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const matches = [...content.matchAll(imageRegex)];
  
  imageStats.total += matches.length;
  
  for (const match of matches) {
    const originalUrl = match[1];
    
    // Пропускаем уже локальные изображения
    if (originalUrl.startsWith('/') || originalUrl.startsWith('./')) {
      continue;
    }
    
    // Генерируем имя файла
    const urlParts = originalUrl.split('/');
    const fileName = `images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${urlParts[urlParts.length - 1]}`;
    
    // Скачиваем изображение
    const localPath = await downloadImage(originalUrl, fileName);
    
    if (localPath) {
      // Заменяем URL в контенте
      processedContent = processedContent.replace(originalUrl, localPath);
      imageStats.downloaded += 1;
    }
  }
  
  return { content: processedContent, imageStats };
}

// Получение данных из Strapi
async function fetchStrapiData() {
  try {
    console.log('🔍 Fetching data from Strapi...');
    
    const headers = {};
    if (STRAPI_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
    }
    
    // Получаем статьи
    const articlesResponse = await axios.get(`${STRAPI_URL}/api/content-articles?populate=*`, { headers });
    const articles = articlesResponse.data.data || [];
    
    // Получаем категории
    const categoriesResponse = await axios.get(`${STRAPI_URL}/api/content-categories?populate=*`, { headers });
    const categories = categoriesResponse.data.data || [];
    
    // Получаем авторов
    const authorsResponse = await axios.get(`${STRAPI_URL}/api/content-authors?populate=*`, { headers });
    const authors = authorsResponse.data.data || [];
    
    console.log(`📊 Found ${articles.length} articles, ${categories.length} categories, ${authors.length} authors`);
    
    // Отладочная информация
    if (articles.length > 0) {
      console.log(`📝 Sample article:`, {
        id: articles[0].id,
        title: articles[0].attributes?.title,
        slug: articles[0].attributes?.slug,
        rawData: JSON.stringify(articles[0], null, 2).substring(0, 500) + '...'
      });
    }
    
    return { articles, categories, authors };
  } catch (error) {
    console.error('❌ Error fetching data from Strapi:', error.message);
    throw error;
  }
}

// Обработка статей
async function processArticles(articles) {
  console.log('🔄 Processing articles...');
  console.log(`📝 Raw articles data:`, articles.length > 0 ? {
    id: articles[0].id,
    hasAttributes: !!articles[0].attributes,
    attributesKeys: articles[0].attributes ? Object.keys(articles[0].attributes) : []
  } : 'No articles');
  
  const processedArticles = [];
  const imageStats = { downloaded: 0, total: 0 };
  
  for (const article of articles) {
    // Данные приходят напрямую, а не в attributes
    const attrs = article.attributes || article;
    
    // Формируем слаг если его нет
    const slug = attrs.slug || generateSlug(attrs.title || '');
    
    // Обрабатываем изображения в контенте
    let processedContent = attrs.content || '';
    if (attrs.content) {
      const result = await processImages(attrs.content, imageStats);
      processedContent = result.content;
    }
    
    // Обрабатываем главное изображение
    let featuredImage = null;
    if (attrs.featured_image) {
      imageStats.total += 1;
      // Если изображение в base64, сохраняем его
      if (attrs.featured_image.startsWith('data:image/')) {
        const fileName = `images/featured_${article.id}_${Date.now()}.jpg`;
        featuredImage = await saveBase64Image(attrs.featured_image, fileName);
        if (featuredImage) imageStats.downloaded += 1;
      } else if (attrs.featuredImage?.data?.attributes?.url) {
        const imageUrl = `${STRAPI_URL}${attrs.featuredImage.data.attributes.url}`;
        const fileName = `images/featured_${article.id}_${Date.now()}.jpg`;
        featuredImage = await downloadImage(imageUrl, fileName);
        if (featuredImage) imageStats.downloaded += 1;
      } else if (typeof attrs.featured_image === 'string' && attrs.featured_image.startsWith('http')) {
        // Прямая ссылка на изображение
        const fileName = `images/featured_${article.id}_${Date.now()}.jpg`;
        featuredImage = await downloadImage(attrs.featured_image, fileName);
        if (featuredImage) imageStats.downloaded += 1;
      }
    }
    
    const processedArticle = {
      id: article.id,
      documentId: attrs.documentId || '',
      title: attrs.title || '',
      slug: slug,
      excerpt: attrs.excerpt || '',
      content: processedContent,
      featured_image: featuredImage,
      meta_title: attrs.meta_title || attrs.title || '',
      meta_description: attrs.meta_description || attrs.excerpt || '',
      publishedAt: attrs.publishedAt || '',
      createdAt: attrs.createdAt || '',
      updatedAt: attrs.updatedAt || '',
      readTime: attrs.readTime || '',
      category: attrs.content_categories?.[0]?.name || null,
      author: attrs.content_author?.name || null,
      categories: attrs.content_categories ? attrs.content_categories.map((cat) => ({
        name: cat.name,
        slug: cat.slug || generateSlug(cat.name)
      })) : []
    };
    
    processedArticles.push(processedArticle);
  }
  
  return { articles: processedArticles, imageStats };
}

// Обработка категорий
function processCategories(categories) {
  return categories.map(category => {
    const attrs = category.attributes || category;
    return {
      id: category.id,
      documentId: attrs.documentId || '',
      name: attrs.name || '',
      slug: attrs.slug || generateSlug(attrs.name || ''),
      color: attrs.color || '',
      description: attrs.description || '',
      icon: attrs.icon || '',
      sort_order: attrs.sort_order || 0,
      is_active: attrs.is_active || true,
      createdAt: attrs.createdAt || '',
      updatedAt: attrs.updatedAt || '',
      publishedAt: attrs.publishedAt || ''
    };
  });
}

// Обработка авторов
function processAuthors(authors) {
  return authors.map(author => {
    const attrs = author.attributes || author;
    return {
      id: author.id,
      documentId: attrs.documentId || '',
      name: attrs.name || '',
      bio: attrs.bio || '',
      avatar: attrs.avatar?.data?.attributes?.url 
        ? `${STRAPI_URL}${attrs.avatar.data.attributes.url}` 
        : null,
      email: attrs.email || '',
      website: attrs.website || '',
      createdAt: attrs.createdAt || '',
      updatedAt: attrs.updatedAt || '',
      publishedAt: attrs.publishedAt || ''
    };
  });
}

// Создание структуры данных сайта
function createSiteData(siteConfig, articles, categories, authors) {
  // Получаем уникальные категории из статей
  const selectedCategories = new Set();
  articles.forEach(article => {
    if (article.categories && Array.isArray(article.categories)) {
      article.categories.forEach(cat => {
        selectedCategories.add(cat.name);
      });
    }
  });

  return {
    site: {
      name: siteConfig.name || "PBN Blog",
      description: siteConfig.description || "Private Blog Network",
      domain: siteConfig.domain || "pbn-blog.com",
      template: siteConfig.template || "pbn-blog",
      config: {
        keywords: siteConfig.keywords || ["blog", "articles"],
        theme: siteConfig.theme || "light",
        content: {
          featured: articles.slice(0, 3),
          recent: articles.slice(0, 6),
          categories: Array.from(selectedCategories),
          ...siteConfig.content
        },
        settings: {
          analytics: {
            googleAnalytics: siteConfig.analytics?.googleAnalytics || ""
          }
        }
      },
      analytics: {
        googleAnalytics: siteConfig.analytics?.googleAnalytics || ""
      }
    },
    articles,
    categories: Array.from(selectedCategories).map(name => ({ 
      name, 
      slug: generateSlug(name) 
    })),
    authors,
    buildInfo: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      articleCount: articles.length,
      categoryCount: selectedCategories.size
    }
  };
}

// Основная функция
async function generateAstroData(siteConfig = {}) {
  try {
    console.log('🚀 Starting Astro data generation...');
    
    // Создаем папку для изображений если её нет
    const imagesDir = path.join(ASTRO_PUBLIC_PATH, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Получаем данные из Strapi
    const { articles, categories, authors } = await fetchStrapiData();
    
    // Обрабатываем данные
    const { articles: processedArticles, imageStats } = await processArticles(articles);
    const processedCategories = processCategories(categories);
    const processedAuthors = processAuthors(authors);
    
    // Создаем структуру данных
    const siteData = createSiteData(siteConfig, processedArticles, processedCategories, processedAuthors);
    
    // Сохраняем в файл
    fs.writeFileSync(ASTRO_DATA_PATH, JSON.stringify(siteData, null, 2));
    
    console.log(`✅ Astro data generated successfully!`);
    console.log(`📁 Data saved to: ${ASTRO_DATA_PATH}`);
    console.log(`📊 Articles: ${processedArticles.length}`);
    console.log(`📂 Categories: ${siteData.categories.length}`);
    console.log(`👥 Authors: ${processedAuthors.length}`);
    console.log(`🖼️ Images: ${imageStats.downloaded}/${imageStats.total} downloaded`);
    console.log(`🔗 Slugs generated for ${processedArticles.length} articles`);
    
    return { siteData, imageStats };
    
  } catch (error) {
    console.error('❌ Error generating Astro data:', error);
    throw error;
  }
}

// Экспорт для использования в других модулях
module.exports = { generateAstroData, processImages, downloadImage, generateSlug };

// Запуск если скрипт вызван напрямую
if (require.main === module) {
  const siteConfig = {
    name: "PBN Blog",
    description: "Private Blog Network",
    domain: "pbn-blog.com",
    template: "pbn-blog",
    keywords: ["blog", "articles", "content"],
    theme: "light",
    analytics: {
      googleAnalytics: ""
    }
  };
  
  generateAstroData(siteConfig)
    .then(() => {
      console.log('🎉 Astro data generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Astro data generation failed:', error);
      process.exit(1);
    });
} 