const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Улучшенное исправление всех проблем VPS (включая Tailwind CSS)...\n');

// Шаг 1: Исправление окружения
async function fixEnvironment() {
  console.log('📋 Шаг 1: Исправление окружения...');
  
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env файл не найден');
    return false;
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Проверяем текущие настройки
  const useLocalStrapi = envContent.match(/USE_LOCAL_STRAPI=(.+)/)?.[1];
  const nextPublicUseLocal = envContent.match(/NEXT_PUBLIC_USE_LOCAL_STRAPI=(.+)/)?.[1];
  const vpsAddress = envContent.match(/VPS_ADDRESS=(.+)/)?.[1];
  
  console.log('📋 Текущие настройки:');
  console.log(`   USE_LOCAL_STRAPI: ${useLocalStrapi || 'не найдено'}`);
  console.log(`   NEXT_PUBLIC_USE_LOCAL_STRAPI: ${nextPublicUseLocal || 'не найдено'}`);
  console.log(`   VPS_ADDRESS: ${vpsAddress || 'не найдено'}`);
  
  // Исправляем настройки для VPS
  const vpsSettings = {
    'USE_LOCAL_STRAPI': 'false',
    'NEXT_PUBLIC_USE_LOCAL_STRAPI': 'false',
    'VPS_ADDRESS': '185.232.205.247'
  };
  
  let updated = false;
  
  Object.entries(vpsSettings).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
      console.log(`✅ Обновлено: ${key}=${value}`);
      updated = true;
    } else {
      envContent += `\n# VPS Settings\n${key}=${value}\n`;
      console.log(`✅ Добавлено: ${key}=${value}`);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env файл обновлен для VPS');
  } else {
    console.log('✅ Настройки уже правильные для VPS');
  }
  
  return true;
}

// Шаг 2: Исправление конфигурации Tailwind CSS
async function fixTailwindConfig() {
  console.log('\n🎨 Шаг 2: Исправление конфигурации Tailwind CSS...');
  
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/fix-tailwind-config.js', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Конфигурация Tailwind CSS исправлена');
    return true;
  } catch (error) {
    console.log(`❌ Ошибка исправления Tailwind: ${error.message}`);
    return false;
  }
}

// Шаг 3: Исправление зависимостей шаблонов
async function fixTemplateDependencies() {
  console.log('\n📦 Шаг 2: Исправление зависимостей шаблонов...');
  
  const templatesDir = path.join(__dirname, '../templates');
  const templates = [
    'astro-pbn-blog',
    'astro-gaming-news', 
    'astro-poker-platform',
    'astro-slots-review',
    'astro-sports-betting',
    'casino-standard'
  ];
  
  let successCount = 0;
  
  for (const template of templates) {
    const templatePath = path.join(templatesDir, template);
    
    if (!fs.existsSync(templatePath)) {
      console.log(`⚠️  Шаблон ${template} не найден`);
      continue;
    }
    
    console.log(`\n🔧 Исправляем ${template}...`);
    
    try {
      // Переходим в директорию шаблона
      process.chdir(templatePath);
      
      // Удаляем старые зависимости
      console.log(`   🗑️  Удаляем старые зависимости...`);
      if (fs.existsSync('node_modules')) {
        await runCommand('rm', ['-rf', 'node_modules'], templatePath, 'Удаление node_modules');
      }
      
      if (fs.existsSync('package-lock.json')) {
        await runCommand('rm', ['-f', 'package-lock.json'], templatePath, 'Удаление package-lock.json');
      }
      
      // Очищаем npm кэш
      console.log(`   🧹 Очищаем npm кэш...`);
      await runCommand('npm', ['cache', 'clean', '--force'], templatePath, 'Очистка npm кэша');
      
      // Устанавливаем зависимости
      console.log(`   📦 Устанавливаем зависимости...`);
      await runCommand('npm', ['install'], templatePath, 'Установка зависимостей');
      
      // Принудительно устанавливаем rollup зависимости для Linux
      console.log(`   🔧 Устанавливаем rollup зависимости для Linux...`);
      await runCommand('npm', ['install', '@rollup/rollup-linux-x64-gnu'], templatePath, 'Установка rollup');
      
      // Пересобираем зависимости
      console.log(`   🔨 Пересобираем зависимости...`);
      await runCommand('npm', ['rebuild'], templatePath, 'Пересборка зависимостей');
      
      // Проверяем, что astro работает
      console.log(`   ✅ Проверяем Astro...`);
      await runCommand('npx', ['astro', '--version'], templatePath, 'Проверка Astro');
      
      console.log(`   ✅ ${template} исправлен`);
      successCount++;
      
    } catch (error) {
      console.log(`   ❌ Ошибка в ${template}: ${error.message}`);
    } finally {
      // Возвращаемся в корневую директорию
      process.chdir(path.join(__dirname, '..'));
    }
  }
  
  console.log(`\n📊 Исправлено шаблонов: ${successCount}/${templates.length}`);
  return successCount === templates.length;
}

// Шаг 3: Тестирование сборки
async function testBuildSystem() {
  console.log('\n🔨 Шаг 3: Тестирование системы сборки...');
  
  const templatePath = path.join(__dirname, '../templates/astro-pbn-blog');
  
  if (!fs.existsSync(templatePath)) {
    console.log('❌ Шаблон astro-pbn-blog не найден');
    return false;
  }
  
  try {
    // Переходим в директорию шаблона
    process.chdir(templatePath);
    
    console.log('   🔄 Тестируем сборку...');
    
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
    
    // Запускаем сборку
    await runCommand('npm', ['run', 'build'], templatePath, 'Тестовая сборка');
    
    // Проверяем результат
    const distPath = path.join(templatePath, 'dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      const htmlFiles = files.filter(f => f.endsWith('.html'));
      console.log(`   📄 Собрано HTML файлов: ${htmlFiles.length}`);
      
      if (htmlFiles.length > 0) {
        console.log('   ✅ Сборка работает корректно');
        return true;
      } else {
        console.log('   ⚠️  Сборка прошла, но HTML файлов нет');
        return false;
      }
    } else {
      console.log('   ❌ Папка dist не создана');
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Ошибка тестирования сборки: ${error.message}`);
    return false;
  } finally {
    // Возвращаемся в корневую директорию
    process.chdir(path.join(__dirname, '..'));
  }
}

// Шаг 4: Перезапуск сервисов
async function restartServices() {
  console.log('\n🚀 Шаг 4: Перезапуск сервисов...');
  
  try {
    // Останавливаем текущие процессы
    console.log('🛑 Останавливаем текущие процессы...');
    try {
      await runCommand('pkill', ['-f', 'next'], process.cwd(), 'Остановка Next.js');
    } catch (e) {
      console.log('   ℹ️  Next.js не был запущен');
    }
    
    try {
      await runCommand('pkill', ['-f', 'strapi'], process.cwd(), 'Остановка Strapi');
    } catch (e) {
      console.log('   ℹ️  Strapi не был запущен');
    }
    
    // Запускаем Strapi
    console.log('\n🚀 Запуск Strapi...');
    const strapiProcess = spawn('npm', ['run', 'develop'], {
      cwd: path.join(process.cwd(), 'strapi'),
      stdio: 'pipe',
      shell: true
    });
    
    strapiProcess.stdout.on('data', (data) => {
      console.log(`   Strapi: ${data.toString().trim()}`);
    });
    
    strapiProcess.stderr.on('data', (data) => {
      console.log(`   Strapi ❌: ${data.toString().trim()}`);
    });
    
    // Ждем немного для запуска Strapi
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Запускаем Next.js
    console.log('\n🚀 Запуск Next.js...');
    const nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true
    });
    
    nextProcess.stdout.on('data', (data) => {
      console.log(`   Next.js: ${data.toString().trim()}`);
    });
    
    nextProcess.stderr.on('data', (data) => {
      console.log(`   Next.js ❌: ${data.toString().trim()}`);
    });
    
    console.log('\n✅ Сервисы запущены!');
    console.log('\n🔗 Доступные URL:');
    console.log('   - Strapi: http://185.232.205.247:1337');
    console.log('   - Next.js: http://185.232.205.247:3000');
    console.log('   - Strapi Admin: http://185.232.205.247:1337/admin');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Ошибка при перезапуске:', error.message);
    return false;
  }
}

// Вспомогательная функция для запуска команд
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    console.log(`   🔄 ${name}...`);
    
    const child = spawn(command, args, {
      cwd: cwd,
      stdio: 'pipe',
      shell: true
    });
    
    child.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output.includes('added') || output.includes('removed') || output.includes('error') || output.includes('built') || output.includes('rebuilt') || output.includes('successfully')) {
        console.log(`      ${output}`);
      }
    });
    
    child.stderr.on('data', (data) => {
      const error = data.toString().trim();
      if (error && !error.includes('npm WARN') && !error.includes('Unknown cli config')) {
        console.log(`      ❌ ${error}`);
      }
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`      ✅ ${name} завершен`);
        resolve();
      } else {
        console.log(`      ❌ ${name} завершен с ошибкой (код: ${code})`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.log(`      ❌ Ошибка запуска ${name}: ${error.message}`);
      reject(error);
    });
  });
}

// Основная функция
async function main() {
  console.log('🚀 Начинаем улучшенное исправление всех проблем VPS...\n');
  
  try {
    // Шаг 1: Исправление окружения
    const envOk = await fixEnvironment();
    if (!envOk) {
      console.log('❌ Не удалось исправить окружение');
      return;
    }
    
    // Шаг 2: Исправление конфигурации Tailwind
    const tailwindOk = await fixTailwindConfig();
    if (!tailwindOk) {
      console.log('⚠️  Проблемы с конфигурацией Tailwind');
    }
    
    // Шаг 3: Исправление зависимостей
    const depsOk = await fixTemplateDependencies();
    if (!depsOk) {
      console.log('⚠️  Не все зависимости исправлены');
    }
    
    // Шаг 4: Тестирование сборки
    const buildOk = await testBuildSystem();
    if (!buildOk) {
      console.log('⚠️  Проблемы с системой сборки');
    }
    
    // Шаг 5: Перезапуск сервисов
    const servicesOk = await restartServices();
    if (!servicesOk) {
      console.log('⚠️  Проблемы с перезапуском сервисов');
    }
    
    console.log('\n📊 Результаты исправления:');
    console.log(`   Окружение: ${envOk ? '✅' : '❌'}`);
    console.log(`   Tailwind: ${tailwindOk ? '✅' : '❌'}`);
    console.log(`   Зависимости: ${depsOk ? '✅' : '❌'}`);
    console.log(`   Сборка: ${buildOk ? '✅' : '❌'}`);
    console.log(`   Сервисы: ${servicesOk ? '✅' : '❌'}`);
    
    if (envOk && tailwindOk && depsOk && buildOk && servicesOk) {
      console.log('\n🎉 Все проблемы исправлены!');
      console.log('\n🔗 Проверьте доступность:');
      console.log('   - Strapi: http://185.232.205.247:1337');
      console.log('   - Next.js: http://185.232.205.247:3000');
      console.log('   - Превью: http://185.232.205.247:4321');
    } else {
      console.log('\n⚠️  Некоторые проблемы остались');
      console.log('\n💡 Запустите диагностику: node scripts/diagnose-vps-issues.js');
    }
    
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    process.exit(1);
  }
}

main(); 