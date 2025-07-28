const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление зависимостей превью сервера...\n');

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

async function fixTemplateDeps(templateName) {
  const templatePath = path.join(templatesDir, templateName);
  
  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Шаблон ${templateName} не найден`);
    return;
  }

  console.log(`\n🔧 Исправляем ${templateName}...`);
  
  const packageJsonPath = path.join(templatePath, 'package.json');
  const packageLockPath = path.join(templatePath, 'package-lock.json');
  const nodeModulesPath = path.join(templatePath, 'node_modules');

  try {
    // 1. Удаляем node_modules и package-lock.json
    if (fs.existsSync(nodeModulesPath)) {
      console.log(`   🗑️  Удаляем node_modules...`);
      await runCommand('rm', ['-rf', 'node_modules'], templatePath, 'Удаление node_modules');
    }

    if (fs.existsSync(packageLockPath)) {
      console.log(`   🗑️  Удаляем package-lock.json...`);
      await runCommand('rm', ['-f', 'package-lock.json'], templatePath, 'Удаление package-lock.json');
    }

    // 2. Очищаем npm кэш
    console.log(`   🧹 Очищаем npm кэш...`);
    await runCommand('npm', ['cache', 'clean', '--force'], templatePath, 'Очистка npm кэша');

    // 3. Переустанавливаем зависимости
    console.log(`   📦 Устанавливаем зависимости...`);
    await runCommand('npm', ['install'], templatePath, 'Установка зависимостей');

    // 4. Принудительно устанавливаем rollup зависимости
    console.log(`   🔧 Устанавливаем rollup зависимости...`);
    await runCommand('npm', ['install', '@rollup/rollup-linux-x64-gnu'], templatePath, 'Установка rollup');

    console.log(`   ✅ ${templateName} исправлен`);

  } catch (error) {
    console.log(`   ❌ Ошибка в ${templateName}: ${error.message}`);
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
      // Показываем только важные сообщения
      const output = data.toString().trim();
      if (output.includes('added') || output.includes('removed') || output.includes('error')) {
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
  console.log('🚀 Начинаем исправление зависимостей...\n');

  for (const template of templates) {
    await fixTemplateDeps(template);
  }

  console.log('\n✅ Все шаблоны обработаны!');
  console.log('\n🔧 Дополнительные шаги:');
  console.log('1. Перезапустите превью сервер');
  console.log('2. Проверьте доступность: http://185.232.205.247:4321');
  console.log('3. Если проблема остается, попробуйте:');
  console.log('   - npm install --platform=linux --arch=x64');
  console.log('   - npm rebuild');
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 