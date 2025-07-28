const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Перезапуск сервисов на VPS...\n');

// Проверяем .env файл
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env файл не найден');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const useLocalStrapi = envContent.match(/USE_LOCAL_STRAPI=(.+)/)?.[1];
const nextPublicUseLocal = envContent.match(/NEXT_PUBLIC_USE_LOCAL_STRAPI=(.+)/)?.[1];
const vpsAddress = envContent.match(/VPS_ADDRESS=(.+)/)?.[1];

console.log('📋 Текущие настройки:');
console.log(`   USE_LOCAL_STRAPI: ${useLocalStrapi || 'не найдено'}`);
console.log(`   NEXT_PUBLIC_USE_LOCAL_STRAPI: ${nextPublicUseLocal || 'не найдено'}`);
console.log(`   VPS_ADDRESS: ${vpsAddress || 'не найдено'}`);

if (useLocalStrapi === 'true' || nextPublicUseLocal === 'true') {
  console.log('\n⚠️  ВНИМАНИЕ: Окружение настроено на ЛОКАЛЬНОЕ!');
  console.log('💡 Запустите сначала: node scripts/fix-vps-env.js');
  process.exit(1);
}

console.log('\n✅ Окружение настроено на VPS');

// Функция для запуска команды
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Запуск: ${name}`);
    console.log(`   Команда: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      cwd: cwd || process.cwd(),
      stdio: 'pipe',
      shell: true
    });

    child.stdout.on('data', (data) => {
      console.log(`   ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
      console.log(`   ❌ ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`   ✅ ${name} завершен успешно`);
        resolve();
      } else {
        console.log(`   ❌ ${name} завершен с ошибкой (код: ${code})`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.log(`   ❌ Ошибка запуска ${name}: ${error.message}`);
      reject(error);
    });
  });
}

async function restartServices() {
  try {
    console.log('\n🔄 Перезапуск сервисов...\n');

    // 1. Останавливаем текущие процессы (если запущены)
    console.log('🛑 Остановка текущих процессов...');
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

    // 2. Запускаем Strapi
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

    // 3. Запускаем Next.js
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

    console.log('\n💡 Для остановки нажмите Ctrl+C');

    // Обработка сигналов для корректного завершения
    process.on('SIGINT', () => {
      console.log('\n🛑 Остановка сервисов...');
      strapiProcess.kill();
      nextProcess.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('\n❌ Ошибка при перезапуске:', error.message);
    process.exit(1);
  }
}

restartServices(); 