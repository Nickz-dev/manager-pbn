const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка текущего окружения...\n');

// Проверяем .env файл
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Файл .env не найден');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

// Извлекаем переменные окружения
const useLocalStrapi = envContent.match(/USE_LOCAL_STRAPI=(.+)/)?.[1] || 'false';
const nextPublicUseLocal = envContent.match(/NEXT_PUBLIC_USE_LOCAL_STRAPI=(.+)/)?.[1] || 'false';
const vpsAddress = envContent.match(/VPS_ADDRESS=(.+)/)?.[1] || 'not-set';

console.log('📋 Текущие настройки:');
console.log(`   USE_LOCAL_STRAPI: ${useLocalStrapi}`);
console.log(`   NEXT_PUBLIC_USE_LOCAL_STRAPI: ${nextPublicUseLocal}`);
console.log(`   VPS_ADDRESS: ${vpsAddress}`);
console.log('');

// Определяем окружение
const isLocal = useLocalStrapi === 'true';
const environment = isLocal ? 'ЛОКАЛЬНАЯ' : 'VPS';

console.log(`🎯 Текущее окружение: ${environment}`);
console.log('');

// Показываем URL для разных компонентов
if (isLocal) {
  console.log('🔗 URL для локального окружения:');
  console.log(`   Strapi: http://localhost:1337`);
  console.log(`   Next.js: http://localhost:3000`);
  console.log(`   Preview: http://localhost:4321`);
  console.log(`   Build: http://localhost:3000`);
} else {
  console.log('🔗 URL для VPS окружения:');
  console.log(`   Strapi: http://${vpsAddress}:1337`);
  console.log(`   Next.js: http://${vpsAddress}:3000`);
  console.log(`   Preview: http://${vpsAddress}:4321`);
  console.log(`   Build: http://${vpsAddress}:3000`);
}

console.log('');

// Проверяем доступность компонентов
console.log('🔍 Проверка компонентов:');

// Проверяем наличие папки strapi
const strapiPath = path.join(__dirname, '../strapi');
if (fs.existsSync(strapiPath)) {
  console.log('   ✅ Папка strapi/ найдена');
} else {
  console.log('   ❌ Папка strapi/ не найдена');
}

// Проверяем наличие папки templates
const templatesPath = path.join(__dirname, '../templates');
if (fs.existsSync(templatesPath)) {
  console.log('   ✅ Папка templates/ найдена');
} else {
  console.log('   ❌ Папка templates/ не найдена');
}

// Проверяем наличие скриптов
const scripts = [
  'switch-strapi-env.js',
  'export-strapi-data.js',
  'import-strapi-data.js',
  'deploy-to-vps.js'
];

scripts.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    console.log(`   ✅ Скрипт ${script} найден`);
  } else {
    console.log(`   ❌ Скрипт ${script} не найден`);
  }
});

console.log('');

// Рекомендации
if (isLocal) {
  console.log('💡 Рекомендации для локальной разработки:');
  console.log('   1. Запустите локальный Strapi: cd strapi && npm run develop');
  console.log('   2. Запустите Next.js: npm run dev');
  console.log('   3. Для переключения на VPS: node scripts/switch-strapi-env.js');
} else {
  console.log('💡 Рекомендации для VPS окружения:');
  console.log('   1. Убедитесь, что VPS Strapi запущен');
  console.log('   2. Запустите Next.js: npm run dev');
  console.log('   3. Для переключения на локальную: node scripts/switch-strapi-env.js');
}

console.log('');
console.log('🔄 Для переключения окружения: node scripts/switch-strapi-env.js'); 