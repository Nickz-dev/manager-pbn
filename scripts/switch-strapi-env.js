const fs = require('fs');
const path = require('path');

console.log('🔄 Переключение окружения Strapi...');

const envPath = path.join(__dirname, '../.env');
const currentEnv = process.env.USE_LOCAL_STRAPI || 'false';

if (!fs.existsSync(envPath)) {
  console.error('❌ Файл .env не найден');
  process.exit(1);
}

// Читаем текущий .env файл
let envContent = fs.readFileSync(envPath, 'utf8');

// Определяем новое значение
const newValue = currentEnv === 'true' ? 'false' : 'true';
const newEnvName = newValue === 'true' ? 'ЛОКАЛЬНАЯ' : 'VPS';

// Обновляем или добавляем переменную
if (envContent.includes('USE_LOCAL_STRAPI=')) {
  envContent = envContent.replace(
    /USE_LOCAL_STRAPI=.*/,
    `USE_LOCAL_STRAPI=${newValue}`
  );
} else {
  envContent += `\n# Strapi Environment\nUSE_LOCAL_STRAPI=${newValue}\n`;
}

// Записываем обновленный файл
fs.writeFileSync(envPath, envContent);

console.log(`✅ Переключено на ${newEnvName} базу данных`);
console.log(`🔗 Strapi URL: ${newValue === 'true' ? 'http://localhost:1337' : 'http://185.232.205.247:1337'}`);

if (newValue === 'true') {
  console.log('\n📋 Для запуска локального Strapi:');
  console.log('   cd strapi');
  console.log('   npm run develop');
} else {
  console.log('\n📋 Убедитесь, что VPS Strapi запущен');
}

console.log('\n🔄 Перезапустите Next.js сервер для применения изменений'); 