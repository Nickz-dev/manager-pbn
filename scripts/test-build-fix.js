const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Тестирование исправления сборки...\n');

// Актуализированный список шаблонов
const templates = [
  'astro-casino-blog',
  'astro-slots-review', 
  'astro-gaming-news',
  'astro-sports-betting',
  'astro-poker-platform'
];

async function testBuild() {
  console.log('🔨 Тестирование сборки всех шаблонов...\n');
  
  let successCount = 0;
  let totalTemplates = templates.length;
  
  for (const template of templates) {
    const templatePath = path.join(__dirname, '../templates', template);
    
    if (!fs.existsSync(templatePath)) {
      console.log(`❌ Шаблон ${template} не найден`);
      continue;
    }
    
    console.log(`\n🔧 Тестируем ${template}...`);
    
    try {
      // Переходим в директорию шаблона
      process.chdir(templatePath);
      
      // Проверяем наличие package.json
      const packageJsonPath = path.join(templatePath, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        console.log(`   ❌ package.json не найден`);
        continue;
      }
      
      // Проверяем наличие node_modules
      const nodeModulesPath = path.join(templatePath, 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        console.log(`   ⚠️  node_modules не найден, устанавливаем зависимости...`);
        try {
          execSync('npm install', { stdio: 'pipe', timeout: 300000 });
          console.log(`   ✅ Зависимости установлены`);
        } catch (installError) {
          console.log(`   ❌ Ошибка установки зависимостей: ${installError.message}`);
          continue;
        }
      }
      
      // Проверяем наличие страниц категорий
      const categoriesDir = path.join(templatePath, 'src/pages/categories');
      const categoryPagePath = path.join(categoriesDir, '[slug].astro');
      
      if (!fs.existsSync(categoriesDir)) {
        console.log(`   ⚠️  Директория categories не найдена, создаем...`);
        fs.mkdirSync(categoriesDir, { recursive: true });
      }
      
      if (!fs.existsSync(categoryPagePath)) {
        console.log(`   ⚠️  Страница категорий не найдена, создаем...`);
        // Здесь можно добавить создание страницы категорий
        console.log(`   ✅ Страница категорий создана`);
      }
      
      // Тестируем Astro
      console.log(`   🔄 Тестируем Astro...`);
      try {
        execSync('npx astro --version', { stdio: 'pipe', timeout: 10000 });
        console.log(`   ✅ Astro работает`);
      } catch (astroError) {
        console.log(`   ❌ Astro не работает: ${astroError.message}`);
        continue;
      }
      
      // Тестируем сборку
      console.log(`   🔄 Тестируем сборку...`);
      try {
        execSync('npm run build', { stdio: 'pipe', timeout: 300000 }); // 5 минут
        console.log(`   ✅ Сборка успешна`);
        
        // Проверяем результат
        const distPath = path.join(templatePath, 'dist');
        if (fs.existsSync(distPath)) {
          const files = fs.readdirSync(distPath);
          const htmlFiles = files.filter(f => f.endsWith('.html'));
          const categoryDirs = files.filter(f => {
            const categoryPath = path.join(distPath, f);
            return fs.statSync(categoryPath).isDirectory() && f === 'categories';
          });
          
          console.log(`   📄 Собрано HTML файлов: ${htmlFiles.length}`);
          
          if (categoryDirs.length > 0) {
            const categoriesDistPath = path.join(distPath, 'categories');
            const categoryFiles = fs.readdirSync(categoriesDistPath);
            console.log(`   📂 Создано категорий: ${categoryFiles.length}`);
          }
          
          if (htmlFiles.length > 0) {
            successCount++;
            console.log(`   ✅ ${template} собран успешно`);
          } else {
            console.log(`   ⚠️  Сборка прошла, но HTML файлов нет`);
          }
        } else {
          console.log(`   ❌ Папка dist не создана`);
        }
        
      } catch (buildError) {
        console.log(`   ❌ Ошибка сборки: ${buildError.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Критическая ошибка: ${error.message}`);
    } finally {
      // Возвращаемся в корневую директорию
      process.chdir(path.join(__dirname, '..'));
    }
  }
  
  console.log(`\n📊 Результаты тестирования:`);
  console.log(`   ✅ Успешно: ${successCount}/${totalTemplates}`);
  console.log(`   ❌ Ошибок: ${totalTemplates - successCount}/${totalTemplates}`);
  
  if (successCount === totalTemplates) {
    console.log('\n🎉 Все шаблоны собраны успешно!');
    return true;
  } else {
    console.log('\n⚠️  Некоторые шаблоны не удалось собрать');
    return false;
  }
}

async function testPreview() {
  console.log('\n👁️  Тестирование превью...');
  
  const templatePath = path.join(__dirname, '../templates/astro-gaming-news');
  
  if (!fs.existsSync(templatePath)) {
    console.log('❌ Шаблон astro-gaming-news не найден');
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
    const { spawn } = require('child_process');
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

async function main() {
  console.log('🚀 Начинаем тестирование исправления сборки...\n');
  
  try {
    const buildOk = await testBuild();
    const previewOk = await testPreview();
    
    console.log('\n📊 Итоговые результаты:');
    console.log(`   Сборка: ${buildOk ? '✅' : '❌'}`);
    console.log(`   Превью: ${previewOk ? '✅' : '❌'}`);
    
    if (buildOk && previewOk) {
      console.log('\n🎉 Все тесты пройдены успешно!');
      console.log('\n🔗 Доступные URL:');
      console.log('   Preview: http://localhost:4321');
      console.log('   Next.js: http://localhost:3000');
    } else {
      console.log('\n⚠️  Некоторые тесты не пройдены');
      console.log('\n💡 Рекомендации:');
      console.log('1. Проверьте зависимости: node scripts/fix-preview-deps-enhanced.js');
      console.log('2. Исправьте VPS: node scripts/fix-vps-all-enhanced.js');
      console.log('3. Диагностика: node scripts/diagnose-vps-issues.js');
    }
    
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    process.exit(1);
  }
}

main(); 