const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Деплой на VPS...');

// Проверяем наличие экспорта
const exportDir = path.join(__dirname, '../strapi-exports');
if (!fs.existsSync(exportDir)) {
  console.error('❌ Папка strapi-exports не найдена');
  console.log('💡 Сначала выполните: node scripts/export-strapi-data.js');
  process.exit(1);
}

const exports = fs.readdirSync(exportDir)
  .filter(file => file.startsWith('strapi-export-'))
  .sort()
  .reverse();

if (exports.length === 0) {
  console.error('❌ Нет файлов экспорта');
  process.exit(1);
}

const latestExport = path.join(exportDir, exports[0]);
const exportFileName = exports[0];

console.log(`📦 Отправляем на VPS: ${exportFileName}`);

try {
  // Отправляем файл на VPS
  execSync(`scp "${latestExport}" root@185.232.205.247:/tmp/${exportFileName}`, { 
    stdio: 'inherit' 
  });
  
  console.log('✅ Файл отправлен на VPS');
  console.log('📋 Выполните на VPS:');
  console.log(`   cd /var/www/pbn-manager/strapi`);
  console.log(`   npm run strapi import -- --file /tmp/${exportFileName}`);
  
} catch (error) {
  console.error('❌ Ошибка отправки на VPS:', error.message);
  console.log('💡 Проверьте SSH соединение с VPS');
  process.exit(1);
} 