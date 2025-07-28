const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📥 Импорт данных Strapi...');

// Находим последний экспорт
const exportDir = path.join(__dirname, '../strapi-exports');
if (!fs.existsSync(exportDir)) {
  console.error('❌ Папка strapi-exports не найдена');
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
console.log(`📦 Импортируем: ${exports[0]}`);

try {
  // Импортируем данные
  execSync(`cd strapi && npm run strapi import -- --file ${latestExport}`, { 
    stdio: 'inherit' 
  });
  
  console.log('✅ Импорт завершен');
  
} catch (error) {
  console.error('❌ Ошибка импорта:', error.message);
  process.exit(1);
} 