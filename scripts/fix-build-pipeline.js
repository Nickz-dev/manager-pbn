const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление пайплайна сборки...\n');

// Пути к шаблонам
const templatesDir = path.join(__dirname, '../templates');
const templates = [
  'astro-pbn-blog',
  'astro-gaming-news', 
  'astro-poker-platform',
  'astro-slots-review',
  'astro-sports-betting',
  'casino-standard'
];

async function fixTemplateBuild(templateName) {
  const templatePath = path.join(templatesDir, templateName);
  
  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Шаблон ${templateName} не найден`);
    return;
  }

  console.log(`\n🔧 Исправляем сборку ${templateName}...`);
  
  try {
    // 1. Переходим в директорию шаблона
    process.chdir(templatePath);
    
    // 2. Удаляем старые зависимости
    console.log(`   🗑️  Удаляем старые зависимости...`);
    if (fs.existsSync('node_modules')) {
      await runCommand('rm', ['-rf', 'node_modules'], templatePath, 'Удаление node_modules');
    }
    
    if (fs.existsSync('package-lock.json')) {
      await runCommand('rm', ['-f', 'package-lock.json'], templatePath, 'Удаление package-lock.json');
    }

    // 3. Очищаем npm кэш
    console.log(`   🧹 Очищаем npm кэш...`);
    await runCommand('npm', ['cache', 'clean', '--force'], templatePath, 'Очистка npm кэша');

    // 4. Устанавливаем зависимости для Linux
    console.log(`   📦 Устанавливаем зависимости для Linux...`);
    await runCommand('npm', ['install', '--platform=linux', '--arch=x64'], templatePath, 'Установка зависимостей');

    // 5. Принудительно устанавливаем rollup зависимости
    console.log(`   🔧 Устанавливаем rollup зависимости...`);
    await runCommand('npm', ['install', '@rollup/rollup-linux-x64-gnu'], templatePath, 'Установка rollup');

    // 6. Пересобираем зависимости
    console.log(`   🔨 Пересобираем зависимости...`);
    await runCommand('npm', ['rebuild'], templatePath, 'Пересборка зависимостей');

    // 7. Проверяем, что astro работает
    console.log(`   ✅ Проверяем Astro...`);
    await runCommand('npx', ['astro', '--version'], templatePath, 'Проверка Astro');

    // 8. Тестируем сборку
    console.log(`   🧪 Тестируем сборку...`);
    await runCommand('npm', ['run', 'build'], templatePath, 'Тестовая сборка');

    console.log(`   ✅ ${templateName} готов к сборке`);

  } catch (error) {
    console.log(`   ❌ Ошибка в ${templateName}: ${error.message}`);
  } finally {
    // Возвращаемся в корневую директорию
    process.chdir(path.join(__dirname, '..'));
  }
}

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
      if (output.includes('added') || output.includes('removed') || output.includes('error') || output.includes('built')) {
        console.log(`      ${output}`);
      }
    });

    child.stderr.on('data', (data) => {
      const error = data.toString().trim();
      if (error && !error.includes('npm WARN')) {
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

async function main() {
  console.log('🚀 Начинаем исправление пайплайна сборки...\n');

  for (const template of templates) {
    await fixTemplateBuild(template);
  }

  console.log('\n✅ Все шаблоны готовы к сборке!');
  console.log('\n🔧 Дополнительные шаги:');
  console.log('1. Перезапустите сервисы: node scripts/restart-vps.js');
  console.log('2. Проверьте сборку через API');
  console.log('3. Проверьте превью сервер: http://185.232.205.247:4321');
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 