const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Тестирование исправления сборки...\n');

async function testBuild() {
  const templatePath = path.join(__dirname, '../templates/astro-pbn-blog');
  
  if (!fs.existsSync(templatePath)) {
    console.log('❌ Шаблон astro-pbn-blog не найден');
    return false;
  }
  
  try {
    // Переходим в директорию шаблона
    process.chdir(templatePath);
    
    console.log('🔧 Проверяем конфигурацию...');
    
    // Проверяем наличие конфигурационных файлов
    const hasTailwindConfig = fs.existsSync('tailwind.config.mjs');
    const hasAstroConfig = fs.existsSync('astro.config.mjs');
    const hasPackageJson = fs.existsSync('package.json');
    
    console.log(`   tailwind.config.mjs: ${hasTailwindConfig ? '✅' : '❌'}`);
    console.log(`   astro.config.mjs: ${hasAstroConfig ? '✅' : '❌'}`);
    console.log(`   package.json: ${hasPackageJson ? '✅' : '❌'}`);
    
    if (!hasTailwindConfig || !hasAstroConfig || !hasPackageJson) {
      console.log('❌ Отсутствуют необходимые конфигурационные файлы');
      return false;
    }
    
    // Проверяем содержимое astro.config.mjs
    const astroConfig = fs.readFileSync('astro.config.mjs', 'utf8');
    if (!astroConfig.includes('@astrojs/tailwind')) {
      console.log('❌ Astro конфигурация не содержит Tailwind интеграцию');
      return false;
    }
    
    console.log('✅ Конфигурация корректна');
    
    // Проверяем зависимости
    console.log('\n📦 Проверяем зависимости...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasTailwind = packageJson.devDependencies && packageJson.devDependencies['@astrojs/tailwind'];
    const hasTailwindCSS = packageJson.devDependencies && packageJson.devDependencies['tailwindcss'];
    
    console.log(`   @astrojs/tailwind: ${hasTailwind ? '✅' : '❌'}`);
    console.log(`   tailwindcss: ${hasTailwindCSS ? '✅' : '❌'}`);
    
    if (!hasTailwind || !hasTailwindCSS) {
      console.log('❌ Отсутствуют необходимые зависимости');
      return false;
    }
    
    // Проверяем node_modules
    const hasNodeModules = fs.existsSync('node_modules');
    const hasAstroInNodeModules = fs.existsSync('node_modules/astro');
    const hasTailwindInNodeModules = fs.existsSync('node_modules/tailwindcss');
    
    console.log(`   node_modules: ${hasNodeModules ? '✅' : '❌'}`);
    console.log(`   astro в node_modules: ${hasAstroInNodeModules ? '✅' : '❌'}`);
    console.log(`   tailwindcss в node_modules: ${hasTailwindInNodeModules ? '✅' : '❌'}`);
    
    if (!hasNodeModules || !hasAstroInNodeModules || !hasTailwindInNodeModules) {
      console.log('❌ Отсутствуют необходимые модули');
      return false;
    }
    
    console.log('✅ Зависимости установлены');
    
    // Тестируем сборку
    console.log('\n🔨 Тестируем сборку...');
    
    // Создаем тестовые данные
    const testData = {
      site: {
        name: 'Test Site',
        description: 'Test Description',
        domain: 'test.com',
        template: 'astro-pbn-blog'
      },
      articles: [
        {
          id: 1,
          title: 'Test Article',
          slug: 'test-article',
          excerpt: 'Test excerpt',
          content: 'Test content',
          featured_image: '/src/assets/images/default-article.svg',
          publishedAt: new Date().toISOString()
        }
      ],
      categories: [],
      authors: []
    };
    
    // Записываем тестовые данные
    const dataDir = path.join(templatePath, 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(dataDir, 'site-data.json'),
      JSON.stringify(testData, null, 2)
    );
    
    console.log('   📄 Созданы тестовые данные');
    
    // Запускаем сборку
    try {
      execSync('npm run build', { 
        stdio: 'pipe',
        cwd: templatePath,
        timeout: 300000 // 5 минут
      });
      console.log('   ✅ Сборка прошла успешно');
      
      // Проверяем результат
      const distPath = path.join(templatePath, 'dist');
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        const cssFiles = files.filter(f => f.endsWith('.css'));
        
        console.log(`   📄 HTML файлов: ${htmlFiles.length}`);
        console.log(`   🎨 CSS файлов: ${cssFiles.length}`);
        
        if (htmlFiles.length > 0 && cssFiles.length > 0) {
          console.log('   ✅ Сборка создала HTML и CSS файлы');
          return true;
        } else {
          console.log('   ⚠️  Сборка прошла, но файлы не созданы');
          return false;
        }
      } else {
        console.log('   ❌ Папка dist не создана');
        return false;
      }
      
    } catch (buildError) {
      console.log(`   ❌ Ошибка сборки: ${buildError.message}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Ошибка тестирования: ${error.message}`);
    return false;
  } finally {
    // Возвращаемся в корневую директорию
    process.chdir(path.join(__dirname, '..'));
  }
}

async function main() {
  console.log('🚀 Начинаем тестирование исправления сборки...\n');
  
  const success = await testBuild();
  
  console.log('\n📊 Результат тестирования:');
  if (success) {
    console.log('✅ Сборка работает корректно!');
    console.log('\n💡 Теперь можно тестировать на VPS');
  } else {
    console.log('❌ Проблемы со сборкой');
    console.log('\n🔧 Запустите исправление:');
    console.log('   node scripts/fix-tailwind-config.js');
    console.log('   node scripts/fix-preview-deps.js');
  }
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 