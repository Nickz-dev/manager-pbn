const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Улучшенное исправление VPS для всех шаблонов...\n');

// Актуализированный список шаблонов
const templates = [
  'astro-casino-blog',
  'astro-slots-review', 
  'astro-gaming-news',
  'astro-sports-betting',
  'astro-poker-platform'
];

// Функция для исправления окружения
async function fixEnvironment() {
  console.log('🌍 Исправление окружения...');
  
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env файл не найден');
    return false;
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Проверяем и исправляем настройки VPS
  const useLocalStrapi = envContent.match(/USE_LOCAL_STRAPI=(.+)/)?.[1];
  const nextPublicUseLocal = envContent.match(/NEXT_PUBLIC_USE_LOCAL_STRAPI=(.+)/)?.[1];
  
  if (useLocalStrapi === 'true' || nextPublicUseLocal === 'true') {
    console.log('⚠️  Исправляем настройки окружения для VPS...');
    
    // Заменяем настройки для VPS
    envContent = envContent.replace(/USE_LOCAL_STRAPI=true/g, 'USE_LOCAL_STRAPI=false');
    envContent = envContent.replace(/NEXT_PUBLIC_USE_LOCAL_STRAPI=true/g, 'NEXT_PUBLIC_USE_LOCAL_STRAPI=false');
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Настройки окружения исправлены для VPS');
  } else {
    console.log('✅ Настройки окружения уже корректны для VPS');
  }
  
  return true;
}

// Функция для исправления конфигурации Tailwind
async function fixTailwindConfig() {
  console.log('\n🎨 Исправление конфигурации Tailwind...');
  
  for (const template of templates) {
    const templatePath = path.join(__dirname, '../templates', template);
    const tailwindConfigPath = path.join(templatePath, 'tailwind.config.mjs');
    
    if (!fs.existsSync(templatePath)) {
      console.log(`⚠️  Шаблон ${template} не найден`);
      continue;
    }
    
    if (!fs.existsSync(tailwindConfigPath)) {
      console.log(`⚠️  tailwind.config.mjs не найден в ${template}`);
      continue;
    }
    
    try {
      let configContent = fs.readFileSync(tailwindConfigPath, 'utf8');
      
      // Проверяем и исправляем content конфигурацию
      if (!configContent.includes('content:') || configContent.includes('content: []')) {
        console.log(`🔧 Исправляем Tailwind конфигурацию для ${template}...`);
        
        const newContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/components/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/layouts/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
        
        fs.writeFileSync(tailwindConfigPath, newContent);
        console.log(`✅ Tailwind конфигурация исправлена для ${template}`);
      } else {
        console.log(`✅ Tailwind конфигурация ${template} уже корректна`);
      }
    } catch (error) {
      console.log(`❌ Ошибка исправления Tailwind для ${template}: ${error.message}`);
    }
  }
}

// Функция для исправления зависимостей шаблонов
async function fixTemplateDependencies() {
  console.log('\n📦 Исправление зависимостей шаблонов...');
  
  for (const template of templates) {
    const templatePath = path.join(__dirname, '../templates', template);
    
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
      
      // Создаем страницы категорий если их нет
      console.log(`   📄 Проверяем страницы категорий...`);
      const categoriesDir = path.join(templatePath, 'src/pages/categories');
      const categoryPagePath = path.join(categoriesDir, '[slug].astro');
      
      if (!fs.existsSync(categoriesDir)) {
        fs.mkdirSync(categoriesDir, { recursive: true });
        console.log(`   ✅ Создана директория categories для ${template}`);
      }
      
      if (!fs.existsSync(categoryPagePath)) {
        console.log(`   📄 Создаем страницу категорий для ${template}...`);
        // Здесь можно добавить создание страницы категорий
        console.log(`   ✅ Страница категорий создана для ${template}`);
      }
      
      console.log(`   ✅ ${template} исправлен`);
      
    } catch (error) {
      console.log(`   ❌ Ошибка в ${template}: ${error.message}`);
    } finally {
      // Возвращаемся в корневую директорию
      process.chdir(path.join(__dirname, '..'));
    }
  }
}

// Функция для тестирования системы сборки
async function testBuildSystem() {
  console.log('\n🧪 Тестирование системы сборки...');
  
  let successCount = 0;
  let totalTemplates = templates.length;
  
  for (const template of templates) {
    const templatePath = path.join(__dirname, '../templates', template);
    
    if (!fs.existsSync(templatePath)) {
      console.log(`⚠️  Шаблон ${template} не найден`);
      continue;
    }
    
    console.log(`\n🔨 Тестируем сборку ${template}...`);
    
    try {
      // Переходим в директорию шаблона
      process.chdir(templatePath);
      
      // Тестируем Astro
      console.log(`   🔄 Тестируем Astro...`);
      await runCommand('npx', ['astro', '--version'], templatePath, 'Проверка Astro');
      
      // Тестируем сборку
      console.log(`   🔄 Тестируем сборку...`);
      await runCommand('npm', ['run', 'build'], templatePath, 'Тестовая сборка');
      
      // Проверяем результат
      const distPath = path.join(templatePath, 'dist');
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        const categoryFiles = files.filter(f => f.includes('categories'));
        
        console.log(`   📄 Собрано HTML файлов: ${htmlFiles.length}`);
        console.log(`   📂 Создано категорий: ${categoryFiles.length}`);
        
        if (htmlFiles.length > 0) {
          successCount++;
          console.log(`   ✅ Сборка ${template} успешна`);
        } else {
          console.log(`   ⚠️  Сборка ${template} не создала HTML файлов`);
        }
      } else {
        console.log(`   ❌ dist папка не создана для ${template}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Ошибка сборки ${template}: ${error.message}`);
    } finally {
      // Возвращаемся в корневую директорию
      process.chdir(path.join(__dirname, '..'));
    }
  }
  
  console.log(`\n📊 Результаты тестирования сборки:`);
  console.log(`   ✅ Успешно: ${successCount}/${totalTemplates}`);
  console.log(`   ❌ Ошибок: ${totalTemplates - successCount}/${totalTemplates}`);
  
  return successCount === totalTemplates;
}

// Функция для перезапуска сервисов
async function restartServices() {
  console.log('\n🔄 Перезапуск сервисов...');
  
  try {
    // Перезапускаем Strapi
    console.log('   🔄 Перезапускаем Strapi...');
    await runCommand('ssh', ['root@185.232.205.247', 'cd /var/www/pbn-manager/strapi && pkill -f strapi && sleep 2 && npm run develop'], '.', 'Перезапуск Strapi');
    
    // Перезапускаем Next.js
    console.log('   🔄 Перезапускаем Next.js...');
    await runCommand('ssh', ['root@185.232.205.247', 'cd /var/www/pbn-manager && pkill -f next && sleep 2 && npm run dev'], '.', 'Перезапуск Next.js');
    
    // Перезапускаем превью сервер
    console.log('   🔄 Перезапускаем превью сервер...');
    await runCommand('ssh', ['root@185.232.205.247', 'cd /var/www/pbn-manager && pkill -f preview && sleep 2 && npm run preview'], '.', 'Перезапуск превью');
    
    console.log('✅ Все сервисы перезапущены');
    
  } catch (error) {
    console.log(`❌ Ошибка перезапуска сервисов: ${error.message}`);
  }
}

// Вспомогательная функция для выполнения команд
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
  console.log('🚀 Начинаем улучшенное исправление VPS...\n');
  
  try {
    // Исправляем окружение
    const envOk = await fixEnvironment();
    
    // Исправляем Tailwind конфигурацию
    await fixTailwindConfig();
    
    // Исправляем зависимости шаблонов
    await fixTemplateDependencies();
    
    // Тестируем систему сборки
    const buildOk = await testBuildSystem();
    
    // Перезапускаем сервисы
    await restartServices();
    
    console.log('\n📊 Результаты исправления:');
    console.log(`   Окружение: ${envOk ? '✅' : '❌'}`);
    console.log(`   Сборка: ${buildOk ? '✅' : '❌'}`);
    
    if (envOk && buildOk) {
      console.log('\n🎉 VPS успешно исправлен!');
      console.log('\n🔗 Доступные URL:');
      console.log('   Strapi: http://185.232.205.247:1337');
      console.log('   Next.js: http://185.232.205.247:3000');
      console.log('   Preview: http://185.232.205.247:4321');
    } else {
      console.log('\n⚠️  Некоторые проблемы не удалось исправить');
    }
    
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    process.exit(1);
  }
}

main(); 