const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Быстрое исправление превью сервера...\n');

const templatePath = path.join(__dirname, '../templates/astro-pbn-blog');

if (!fs.existsSync(templatePath)) {
  console.log('❌ Шаблон astro-pbn-blog не найден');
  process.exit(1);
}

async function quickFix() {
  try {
    console.log('📁 Рабочая директория:', templatePath);
    
    // 1. Переходим в директорию шаблона
    process.chdir(templatePath);
    
    // 2. Удаляем node_modules и package-lock.json
    console.log('\n🗑️  Удаляем старые зависимости...');
    await runCommand('rm', ['-rf', 'node_modules', 'package-lock.json'], templatePath);

    // 3. Очищаем npm кэш
    console.log('\n🧹 Очищаем npm кэш...');
    await runCommand('npm', ['cache', 'clean', '--force'], templatePath);

    // 4. Устанавливаем зависимости с правильными флагами для Linux
    console.log('\n📦 Устанавливаем зависимости для Linux...');
    await runCommand('npm', ['install', '--platform=linux', '--arch=x64'], templatePath);

    // 5. Принудительно устанавливаем rollup зависимости
    console.log('\n🔧 Устанавливаем rollup зависимости...');
    await runCommand('npm', ['install', '@rollup/rollup-linux-x64-gnu'], templatePath);

    // 6. Пересобираем зависимости
    console.log('\n🔨 Пересобираем зависимости...');
    await runCommand('npm', ['rebuild'], templatePath);

    // 7. Проверяем, что astro работает
    console.log('\n✅ Проверяем Astro...');
    await runCommand('npx', ['astro', '--version'], templatePath);

    console.log('\n✅ Превью сервер исправлен!');
    console.log('\n🚀 Теперь можно запускать превью сервер');
    console.log('\n🔗 Проверьте: http://185.232.205.247:4321');

  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
    process.exit(1);
  }
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`   🔄 ${command} ${args.join(' ')}...`);
    
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
        console.log(`      ✅ Завершено`);
        resolve();
      } else {
        console.log(`      ❌ Завершено с ошибкой (код: ${code})`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.log(`      ❌ Ошибка запуска: ${error.message}`);
      reject(error);
    });
  });
}

quickFix(); 