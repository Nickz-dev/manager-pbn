const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление astro-pbn-blog...\n');

const templatePath = path.join(__dirname, '../templates/astro-pbn-blog');

if (!fs.existsSync(templatePath)) {
  console.log('❌ Шаблон astro-pbn-blog не найден');
  process.exit(1);
}

async function fixAstroPbnBlog() {
  try {
    console.log('📁 Рабочая директория:', templatePath);
    
    // 1. Удаляем node_modules и package-lock.json
    console.log('\n🗑️  Удаляем старые зависимости...');
    
    if (fs.existsSync(path.join(templatePath, 'node_modules'))) {
      await runCommand('rm', ['-rf', 'node_modules'], templatePath, 'Удаление node_modules');
    }
    
    if (fs.existsSync(path.join(templatePath, 'package-lock.json'))) {
      await runCommand('rm', ['-f', 'package-lock.json'], templatePath, 'Удаление package-lock.json');
    }

    // 2. Очищаем npm кэш
    console.log('\n🧹 Очищаем npm кэш...');
    await runCommand('npm', ['cache', 'clean', '--force'], templatePath, 'Очистка npm кэша');

    // 3. Устанавливаем зависимости с правильными флагами
    console.log('\n📦 Устанавливаем зависимости...');
    await runCommand('npm', ['install', '--platform=linux', '--arch=x64'], templatePath, 'Установка зависимостей');

    // 4. Принудительно устанавливаем rollup зависимости
    console.log('\n🔧 Устанавливаем rollup зависимости...');
    await runCommand('npm', ['install', '@rollup/rollup-linux-x64-gnu'], templatePath, 'Установка rollup');

    // 5. Пересобираем зависимости
    console.log('\n🔨 Пересобираем зависимости...');
    await runCommand('npm', ['rebuild'], templatePath, 'Пересборка зависимостей');

    console.log('\n✅ astro-pbn-blog исправлен!');
    console.log('\n🚀 Теперь можно запускать превью сервер');

  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
    process.exit(1);
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

fixAstroPbnBlog(); 