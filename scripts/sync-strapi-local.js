const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Синхронизация локального Strapi...');

// Создаем папку .tmp если её нет
const tmpDir = path.join(__dirname, '../strapi/.tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
  console.log('✅ Создана папка .tmp');
}

// Проверяем наличие .env файла
const envPath = path.join(__dirname, '../strapi/.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  Файл .env не найден в strapi/');
  console.log('📝 Создайте файл strapi/.env с настройками базы данных');
  process.exit(1);
}

console.log('✅ Локальный Strapi готов к работе');
console.log('🚀 Запустите: cd strapi && npm run develop'); 