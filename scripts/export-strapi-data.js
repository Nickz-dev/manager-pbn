const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📤 Экспорт данных Strapi...');

const exportDir = path.join(__dirname, '../strapi-exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const exportPath = path.join(exportDir, `strapi-export-${timestamp}`);

try {
  // Экспортируем данные
  execSync(`cd strapi && npm run strapi export -- --no-encrypt --file ${exportPath}`, { 
    stdio: 'inherit' 
  });
  
  console.log(`✅ Экспорт завершен: ${exportPath}`);
  console.log('📦 Файл готов для переноса на VPS');
  
} catch (error) {
  console.error('❌ Ошибка экспорта:', error.message);
  process.exit(1);
} 