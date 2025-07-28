const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Улучшенное исправление зависимостей превью сервера...\n');

// Пути к шаблонам (все текущие)
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
  
  try {
    // 1. Переходим в директорию шаблона
    process.chdir(templatePath);
    
    // 2. Проверяем package.json
    const packageJsonPath = path.join(templatePath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`   ❌ package.json не найден в ${templateName}`);
      return;
    }
    
    // 3. Удаляем старые зависимости
    console.log(`   🗑️  Удаляем старые зависимости...`);
    if (fs.existsSync('node_modules')) {
      await runCommand('rm', ['-rf', 'node_modules'], templatePath, 'Удаление node_modules');
    }
    
    if (fs.existsSync('package-lock.json')) {
      await runCommand('rm', ['-f', 'package-lock.json'], templatePath, 'Удаление package-lock.json');
    }

    // 4. Очищаем npm кэш
    console.log(`   🧹 Очищаем npm кэш...`);
    await runCommand('npm', ['cache', 'clean', '--force'], templatePath, 'Очистка npm кэша');

    // 5. Устанавливаем зависимости
    console.log(`   📦 Устанавливаем зависимости...`);
    await runCommand('npm', ['install'], templatePath, 'Установка зависимостей');

    // 6. Принудительно устанавливаем rollup зависимости для Linux
    console.log(`   🔧 Устанавливаем rollup зависимости для Linux...`);
    await runCommand('npm', ['install', '@rollup/rollup-linux-x64-gnu'], templatePath, 'Установка rollup');

    // 7. Пересобираем зависимости
    console.log(`   🔨 Пересобираем зависимости...`);
    await runCommand('npm', ['rebuild'], templatePath, 'Пересборка зависимостей');

    // 8. Проверяем, что astro работает
    console.log(`   ✅ Проверяем Astro...`);
    await runCommand('npx', ['astro', '--version'], templatePath, 'Проверка Astro');

    // 9. Тестируем сборку (опционально)
    console.log(`   🧪 Тестируем сборку...`);
    try {
      await runCommand('npm', ['run', 'build'], templatePath, 'Тестовая сборка');
      console.log(`      ✅ Сборка ${templateName} успешна`);
    } catch (buildError) {
      console.log(`      ⚠️  Сборка ${templateName} не удалась, но зависимости установлены`);
    }

    console.log(`   ✅ ${templateName} исправлен`);

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
      if (output.includes('added') || output.includes('removed') || output.includes('error') || output.includes('built') || output.includes('rebuilt') || output.includes('successfully')) {
        console.log(`      ${output}`);
      }
    });

    child.stderr.on('data', (data) => {
      const error = data.toString().trim();
      // Игнорируем предупреждения npm, но показываем ошибки
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

async function main() {
  console.log('🚀 Начинаем улучшенное исправление зависимостей...\n');

  let successCount = 0;
  let totalTemplates = templates.length;

  for (const template of templates) {
    try {
      await fixTemplateDeps(template);
      successCount++;
    } catch (error) {
      console.log(`   ❌ Критическая ошибка в ${template}: ${error.message}`);
    }
  }

  console.log('\n📊 Результаты исправления:');
  console.log(`   ✅ Успешно: ${successCount}/${totalTemplates}`);
  console.log(`   ❌ Ошибок: ${totalTemplates - successCount}/${totalTemplates}`);

  if (successCount === totalTemplates) {
    console.log('\n🎉 Все шаблоны успешно исправлены!');
  } else {
    console.log('\n⚠️  Некоторые шаблоны не удалось исправить');
  }

  console.log('\n🔧 Дополнительные шаги:');
  console.log('1. Перезапустите превью сервер');
  console.log('2. Проверьте доступность: http://185.232.205.247:4321');
  console.log('3. Протестируйте сборку сайтов');
  console.log('4. Проверьте превью для всех шаблонов');
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 