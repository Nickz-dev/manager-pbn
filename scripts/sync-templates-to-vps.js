const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Синхронизация шаблонов с VPS...\n');

// Актуализированный список шаблонов
const templates = [
  'casino-blog',
  'slots-review', 
  'gaming-news',
  'sports-betting',
  'poker-platform'
];

// VPS настройки
const VPS_HOST = '185.232.205.247';
const VPS_USER = 'root';
const VPS_PATH = '/var/www/pbn-manager';

function runSSHCommand(command) {
  const sshCommand = `ssh ${VPS_USER}@${VPS_HOST} "${command}"`;
  console.log(`   🔄 Выполняем: ${command}`);
  
  try {
    execSync(sshCommand, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.log(`   ❌ Ошибка SSH: ${error.message}`);
    return false;
  }
}

function syncTemplate(templateName) {
  console.log(`\n📦 Синхронизируем ${templateName}...`);
  
  const localTemplatePath = path.join(__dirname, '../templates', templateName);
  const remoteTemplatePath = `${VPS_PATH}/templates/${templateName}`;
  
  if (!fs.existsSync(localTemplatePath)) {
    console.log(`   ❌ Локальный шаблон ${templateName} не найден`);
    return false;
  }
  
  // 1. Создаем директорию на VPS если её нет
  console.log(`   📁 Создаем директорию на VPS...`);
  if (!runSSHCommand(`mkdir -p ${VPS_PATH}/templates`)) {
    return false;
  }
  
  // 2. Удаляем старую версию на VPS
  console.log(`   🗑️  Удаляем старую версию на VPS...`);
  runSSHCommand(`rm -rf ${remoteTemplatePath}`);
  
  // 3. Копируем новый шаблон на VPS
  console.log(`   📤 Копируем шаблон на VPS...`);
  const scpCommand = `scp -r "${localTemplatePath}" ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/templates/`;
  
  try {
    execSync(scpCommand, { stdio: 'inherit' });
    console.log(`   ✅ ${templateName} скопирован на VPS`);
  } catch (error) {
    console.log(`   ❌ Ошибка копирования ${templateName}: ${error.message}`);
    return false;
  }
  
  // 4. Устанавливаем зависимости на VPS
  console.log(`   📦 Устанавливаем зависимости на VPS...`);
  if (!runSSHCommand(`cd ${remoteTemplatePath} && npm install`)) {
    console.log(`   ⚠️  Ошибка установки зависимостей для ${templateName}`);
  }
  
  // 5. Собираем шаблон на VPS
  console.log(`   🔨 Собираем шаблон на VPS...`);
  if (!runSSHCommand(`cd ${remoteTemplatePath} && npm run build`)) {
    console.log(`   ⚠️  Ошибка сборки ${templateName} на VPS`);
  }
  
  return true;
}

function updateBuildScript() {
  console.log('\n🔧 Обновляем скрипт сборки на VPS...');
  
  const buildScriptContent = `const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateAstroData } = require('./generate-astro-data');

// Пути к файлам - теперь динамические
function getAstroDir(template) {
  const templateMap = {
    'casino-blog': 'astro-casino-blog',
    'slots-review': 'astro-slots-review', 
    'gaming-news': 'astro-gaming-news',
    'sports-betting': 'astro-sports-betting',
    'poker-platform': 'astro-poker-platform',
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
    console.log(\`📋 Template: \${siteConfig.template}\`);
    
    // Получаем динамические пути для выбранного шаблона
    const astroDir = getAstroDir(siteConfig.template);
    const distDir = getDistDir(siteConfig.template);
    
    console.log(\`📁 Astro directory: \${astroDir}\`);
    console.log(\`📁 Dist directory: \${distDir}\`);
    
    // Проверяем существование директории шаблона
    if (!fs.existsSync(astroDir)) {
      throw new Error(\`Template directory not found: \${astroDir}\`);
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
    console.log(\`📁 Build directory: \${distDir}\`);
    console.log(\`📊 Build results:\`, buildResults);
    
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
}`;
  
  // Записываем обновленный скрипт локально
  const localBuildScriptPath = path.join(__dirname, 'build-astro.js');
  fs.writeFileSync(localBuildScriptPath, buildScriptContent);
  
  // Копируем на VPS
  const scpCommand = `scp "${localBuildScriptPath}" ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/scripts/`;
  
  try {
    execSync(scpCommand, { stdio: 'inherit' });
    console.log('   ✅ Скрипт сборки обновлен на VPS');
  } catch (error) {
    console.log(`   ❌ Ошибка обновления скрипта сборки: ${error.message}`);
  }
}

function restartVPSServices() {
  console.log('\n🔄 Перезапускаем сервисы на VPS...');
  
  // Перезапускаем Strapi
  console.log('   🔄 Перезапускаем Strapi...');
  runSSHCommand(`cd ${VPS_PATH}/strapi && pkill -f strapi && sleep 2 && npm run develop`);
  
  // Перезапускаем Next.js
  console.log('   🔄 Перезапускаем Next.js...');
  runSSHCommand(`cd ${VPS_PATH} && pkill -f next && sleep 2 && npm run dev`);
  
  // Перезапускаем превью сервер
  console.log('   🔄 Перезапускаем превью сервер...');
  runSSHCommand(`cd ${VPS_PATH} && pkill -f preview && sleep 2 && npm run preview`);
  
  console.log('✅ Сервисы перезапущены');
}

async function main() {
  console.log('🚀 Начинаем синхронизацию шаблонов с VPS...\n');
  
  let successCount = 0;
  let totalTemplates = templates.length;
  
  // Синхронизируем каждый шаблон
  for (const template of templates) {
    if (syncTemplate(template)) {
      successCount++;
    }
  }
  
  // Обновляем скрипт сборки
  updateBuildScript();
  
  // Перезапускаем сервисы
  restartVPSServices();
  
  console.log('\n📊 Результаты синхронизации:');
  console.log(`   ✅ Успешно: ${successCount}/${totalTemplates}`);
  console.log(`   ❌ Ошибок: ${totalTemplates - successCount}/${totalTemplates}`);
  
  if (successCount === totalTemplates) {
    console.log('\n🎉 Все шаблоны успешно синхронизированы с VPS!');
    console.log('\n🔗 Доступные URL:');
    console.log(`   Strapi: http://${VPS_HOST}:1337`);
    console.log(`   Next.js: http://${VPS_HOST}:3000`);
    console.log(`   Preview: http://${VPS_HOST}:4321`);
  } else {
    console.log('\n⚠️  Некоторые шаблоны не удалось синхронизировать');
    console.log('\n💡 Проверьте подключение к VPS и повторите попытку');
  }
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
});