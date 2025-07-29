const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateAstroData } = require('./generate-astro-data');

// Пути к файлам - теперь динамические
function getAstroDir(template) {
  const templateMap = {
    'casino-blog': 'casino-blog',
    'slots-review': 'slots-review', 
    'gaming-news': 'gaming-news',
    'sports-betting': 'sports-betting',
    'poker-platform': 'poker-platform',
    'premium-casino': 'casino/premium'
  };
  
  const templateDir = templateMap[template] || 'astro-casino-blog';
  return path.join(__dirname, '../templates', templateDir);
}

function getDistDir(template) {
  return path.join(getAstroDir(template), 'dist');
}

// Функция для сборки Astro
async function buildAstroSite(siteConfig) {
  try {
    console.log('🚀 Starting Astro site build...');
    console.log(`📋 Template: ${siteConfig.template}`);
    
    // Получаем динамические пути для выбранного шаблона
    const astroDir = getAstroDir(siteConfig.template);
    const distDir = getDistDir(siteConfig.template);
    
    console.log(`📁 Astro directory: ${astroDir}`);
    console.log(`📁 Dist directory: ${distDir}`);
    
    // Проверяем существование директории шаблона
    if (!fs.existsSync(astroDir)) {
      throw new Error(`Template directory not found: ${astroDir}`);
    }
    
    // Шаг 1: Генерируем данные из Strapi
    console.log('📊 Step 1: Generating data from Strapi...');
    const { imageStats } = await generateAstroData(siteConfig);
    
    // Шаг 2: Переходим в директорию Astro
    console.log('📁 Step 2: Navigating to Astro directory...');
    process.chdir(astroDir);
    
    // Шаг 3: Устанавливаем зависимости если нужно
    console.log('📦 Step 3: Installing dependencies...');
    if (!fs.existsSync(path.join(astroDir, 'node_modules'))) {
      console.log('Installing npm dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }
    
    // Шаг 4: Собираем Astro
    console.log('🔨 Step 4: Building Astro site...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Шаг 5: Проверяем результат
    console.log('✅ Step 5: Checking build results...');
    const buildResults = checkBuildResults(distDir);
    
    console.log('🎉 Astro build completed successfully!');
    console.log(`📁 Build directory: ${distDir}`);
    console.log(`📊 Build results:`, buildResults);
    
    return {
      success: true,
      distPath: distDir,
      ...buildResults,
      imagesDownloaded: imageStats.downloaded,
      totalImages: imageStats.total
    };
    
  } catch (error) {
    console.error('❌ Astro build failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Проверка результатов сборки
function checkBuildResults(distDir) {
  const results = {
    hasIndex: false,
    hasArticles: false,
    hasCategories: false,
    articleCount: 0,
    categoryCount: 0,
    files: []
  };
  
  if (!fs.existsSync(distDir)) {
    return results;
  }
  
  // Получаем список файлов
  const files = getAllFiles(distDir);
  results.files = files;
  
  // Проверяем наличие index.html
  results.hasIndex = files.some(file => file.endsWith('index.html'));
  
  // Проверяем наличие страниц статей
  const articleFiles = files.filter(file => 
    file.includes('articles') && file.includes('index.html')
  );
  results.hasArticles = articleFiles.length > 0;
  results.articleCount = articleFiles.length;
  
  // Проверяем наличие страниц категорий
  const categoryFiles = files.filter(file => 
    file.includes('categories') && file.includes('index.html')
  );
  results.hasCategories = categoryFiles.length > 0;
  results.categoryCount = categoryFiles.length;
  
  return results;
}

// Рекурсивное получение всех файлов
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

// Экспорт для использования в других модулях
module.exports = { buildAstroSite };

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
  
  buildAstroSite(siteConfig)
    .then((result) => {
      if (result.success) {
        console.log('🎉 Build completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Build failed:', result.error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Build error:', error);
      process.exit(1);
    });
} 