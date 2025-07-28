const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Диагностика проблем VPS...\n');

// Проверяем .env файл
function checkEnvironment() {
  console.log('📋 Проверка окружения...');
  
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env файл не найден');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const useLocalStrapi = envContent.match(/USE_LOCAL_STRAPI=(.+)/)?.[1];
  const nextPublicUseLocal = envContent.match(/NEXT_PUBLIC_USE_LOCAL_STRAPI=(.+)/)?.[1];
  const vpsAddress = envContent.match(/VPS_ADDRESS=(.+)/)?.[1];
  
  console.log(`   USE_LOCAL_STRAPI: ${useLocalStrapi || 'не найдено'}`);
  console.log(`   NEXT_PUBLIC_USE_LOCAL_STRAPI: ${nextPublicUseLocal || 'не найдено'}`);
  console.log(`   VPS_ADDRESS: ${vpsAddress || 'не найдено'}`);
  
  if (useLocalStrapi === 'true' || nextPublicUseLocal === 'true') {
    console.log('⚠️  ПРОБЛЕМА: Окружение настроено на ЛОКАЛЬНОЕ!');
    return false;
  }
  
  console.log('✅ Окружение настроено на VPS');
  return true;
}

// Проверяем шаблоны
function checkTemplates() {
  console.log('\n📦 Проверка шаблонов...');
  
  const templatesDir = path.join(__dirname, '../templates');
  const templates = [
    'astro-pbn-blog',
    'astro-gaming-news', 
    'astro-poker-platform',
    'astro-slots-review',
    'astro-sports-betting',
    'casino-standard'
  ];
  
  let allGood = true;
  
  for (const template of templates) {
    const templatePath = path.join(templatesDir, template);
    
    if (!fs.existsSync(templatePath)) {
      console.log(`❌ Шаблон ${template} не найден`);
      allGood = false;
      continue;
    }
    
    const packageJsonPath = path.join(templatePath, 'package.json');
    const nodeModulesPath = path.join(templatePath, 'node_modules');
    const distPath = path.join(templatePath, 'dist');
    
    console.log(`\n🔍 ${template}:`);
    
    // Проверяем package.json
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`   ❌ package.json не найден`);
      allGood = false;
    } else {
      console.log(`   ✅ package.json найден`);
      
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log(`   📋 Версия: ${packageJson.version || 'не указана'}`);
        console.log(`   📦 Зависимости: ${Object.keys(packageJson.dependencies || {}).length}`);
        console.log(`   🔧 Dev зависимости: ${Object.keys(packageJson.devDependencies || {}).length}`);
      } catch (e) {
        console.log(`   ❌ Ошибка чтения package.json: ${e.message}`);
        allGood = false;
      }
    }
    
    // Проверяем node_modules
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`   ❌ node_modules не найден`);
      allGood = false;
    } else {
      console.log(`   ✅ node_modules найден`);
      
      // Проверяем astro
      const astroPath = path.join(nodeModulesPath, 'astro');
      if (!fs.existsSync(astroPath)) {
        console.log(`   ❌ Astro не установлен`);
        allGood = false;
      } else {
        console.log(`   ✅ Astro установлен`);
      }
      
      // Проверяем rollup
      const rollupPath = path.join(nodeModulesPath, '@rollup');
      if (!fs.existsSync(rollupPath)) {
        console.log(`   ❌ Rollup не установлен`);
        allGood = false;
      } else {
        console.log(`   ✅ Rollup установлен`);
      }
    }
    
    // Проверяем dist
    if (!fs.existsSync(distPath)) {
      console.log(`   ❌ dist папка не найдена (сайт не собран)`);
    } else {
      console.log(`   ✅ dist папка найдена`);
      
      // Проверяем содержимое dist
      try {
        const distFiles = fs.readdirSync(distPath);
        const htmlFiles = distFiles.filter(f => f.endsWith('.html'));
        console.log(`   📄 HTML файлов: ${htmlFiles.length}`);
        
        if (htmlFiles.length === 0) {
          console.log(`   ⚠️  Нет HTML файлов в dist`);
        }
      } catch (e) {
        console.log(`   ❌ Ошибка чтения dist: ${e.message}`);
      }
    }
  }
  
  return allGood;
}

// Тестируем сборку
async function testBuild() {
  console.log('\n🔨 Тестирование сборки...');
  
  const templatePath = path.join(__dirname, '../templates/astro-pbn-blog');
  
  if (!fs.existsSync(templatePath)) {
    console.log('❌ Шаблон astro-pbn-blog не найден');
    return false;
  }
  
  try {
    // Переходим в директорию шаблона
    process.chdir(templatePath);
    
    console.log('   🔄 Тестируем Astro...');
    try {
      execSync('npx astro --version', { 
        stdio: 'pipe',
        timeout: 10000
      });
      console.log('   ✅ Astro работает');
    } catch (e) {
      console.log(`   ❌ Astro не работает: ${e.message}`);
      return false;
    }
    
    console.log('   🔄 Тестируем сборку...');
    try {
      execSync('npm run build', { 
        stdio: 'pipe',
        timeout: 300000 // 5 минут
      });
      console.log('   ✅ Сборка успешна');
      
      // Проверяем результат
      const distPath = path.join(templatePath, 'dist');
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        console.log(`   📄 Собрано HTML файлов: ${htmlFiles.length}`);
      }
      
      return true;
    } catch (e) {
      console.log(`   ❌ Сборка не удалась: ${e.message}`);
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Ошибка тестирования: ${error.message}`);
    return false;
  } finally {
    // Возвращаемся в корневую директорию
    process.chdir(path.join(__dirname, '..'));
  }
}

// Тестируем превью
async function testPreview() {
  console.log('\n👁️  Тестирование превью...');
  
  const templatePath = path.join(__dirname, '../templates/astro-pbn-blog');
  
  if (!fs.existsSync(templatePath)) {
    console.log('❌ Шаблон astro-pbn-blog не найден');
    return false;
  }
  
  // Проверяем, что dist существует
  const distPath = path.join(templatePath, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('❌ dist папка не найдена, сначала нужно собрать сайт');
    return false;
  }
  
  try {
    // Переходим в директорию шаблона
    process.chdir(templatePath);
    
    console.log('   🔄 Тестируем превью...');
    
    // Запускаем превью в фоне
    const previewProcess = spawn('npm', ['run', 'preview', '--', '--port', '4321'], {
      stdio: 'pipe',
      shell: true
    });
    
    // Ждем запуска
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Проверяем, что процесс работает
    if (previewProcess.killed) {
      console.log('   ❌ Превью не запустился');
      return false;
    }
    
    console.log('   ✅ Превью запустился');
    
    // Останавливаем процесс
    previewProcess.kill('SIGTERM');
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Ошибка превью: ${error.message}`);
    return false;
  } finally {
    // Возвращаемся в корневую директорию
    process.chdir(path.join(__dirname, '..'));
  }
}

// Проверяем API
async function testAPI() {
  console.log('\n🌐 Тестирование API...');
  
  try {
    const axios = require('axios');
    
    // Тестируем Strapi
    console.log('   🔄 Тестируем Strapi...');
    try {
      const strapiResponse = await axios.get('http://185.232.205.247:1337/api/content-articles', {
        timeout: 5000
      });
      console.log(`   ✅ Strapi доступен (статус: ${strapiResponse.status})`);
    } catch (e) {
      console.log(`   ❌ Strapi недоступен: ${e.message}`);
    }
    
    // Тестируем Next.js
    console.log('   🔄 Тестируем Next.js...');
    try {
      const nextResponse = await axios.get('http://185.232.205.247:3000', {
        timeout: 5000
      });
      console.log(`   ✅ Next.js доступен (статус: ${nextResponse.status})`);
    } catch (e) {
      console.log(`   ❌ Next.js недоступен: ${e.message}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Ошибка тестирования API: ${error.message}`);
  }
}

// Основная функция
async function main() {
  console.log('🚀 Начинаем диагностику VPS...\n');
  
  const envOk = checkEnvironment();
  const templatesOk = checkTemplates();
  
  if (!envOk) {
    console.log('\n🔧 Рекомендация: Запустите node scripts/fix-vps-env.js');
  }
  
  if (!templatesOk) {
    console.log('\n🔧 Рекомендация: Запустите node scripts/fix-preview-deps.js');
  }
  
  const buildOk = await testBuild();
  const previewOk = await testPreview();
  
  await testAPI();
  
  console.log('\n📊 Результаты диагностики:');
  console.log(`   Окружение: ${envOk ? '✅' : '❌'}`);
  console.log(`   Шаблоны: ${templatesOk ? '✅' : '❌'}`);
  console.log(`   Сборка: ${buildOk ? '✅' : '❌'}`);
  console.log(`   Превью: ${previewOk ? '✅' : '❌'}`);
  
  if (envOk && templatesOk && buildOk && previewOk) {
    console.log('\n🎉 Все системы работают корректно!');
  } else {
    console.log('\n🔧 Требуется исправление проблем');
    console.log('\n💡 Команды для исправления:');
    console.log('1. node scripts/fix-vps-env.js');
    console.log('2. node scripts/fix-preview-deps.js');
    console.log('3. node scripts/restart-vps.js');
  }
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 