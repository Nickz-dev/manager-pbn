const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление настроек окружения для VPS...\n');

const envPath = path.join(__dirname, '../.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env файл не найден');
  console.log('💡 Создайте .env файл с настройками для VPS');
  process.exit(1);
}

// Читаем текущий .env файл
let envContent = fs.readFileSync(envPath, 'utf8');

console.log('📋 Текущие настройки:');
const useLocalStrapi = envContent.match(/USE_LOCAL_STRAPI=(.+)/)?.[1];
const nextPublicUseLocal = envContent.match(/NEXT_PUBLIC_USE_LOCAL_STRAPI=(.+)/)?.[1];
const vpsAddress = envContent.match(/VPS_ADDRESS=(.+)/)?.[1];

console.log(`   USE_LOCAL_STRAPI: ${useLocalStrapi || 'не найдено'}`);
console.log(`   NEXT_PUBLIC_USE_LOCAL_STRAPI: ${nextPublicUseLocal || 'не найдено'}`);
console.log(`   VPS_ADDRESS: ${vpsAddress || 'не найдено'}`);

// Исправляем настройки для VPS
const vpsSettings = {
  'USE_LOCAL_STRAPI': 'false',
  'NEXT_PUBLIC_USE_LOCAL_STRAPI': 'false',
  'VPS_ADDRESS': '185.232.205.247'
};

let updated = false;

Object.entries(vpsSettings).forEach(([key, value]) => {
  const regex = new RegExp(`^${key}=.*`, 'm');
  
  if (envContent.match(regex)) {
    // Заменяем существующую переменную
    envContent = envContent.replace(regex, `${key}=${value}`);
    console.log(`✅ Обновлено: ${key}=${value}`);
    updated = true;
  } else {
    // Добавляем новую переменную
    envContent += `\n# VPS Settings\n${key}=${value}\n`;
    console.log(`✅ Добавлено: ${key}=${value}`);
    updated = true;
  }
});

if (updated) {
  // Записываем обновленный файл
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env файл обновлен для VPS');
} else {
  console.log('\n✅ Настройки уже правильные для VPS');
}

console.log('\n📋 Новые настройки:');
console.log('   USE_LOCAL_STRAPI=false');
console.log('   NEXT_PUBLIC_USE_LOCAL_STRAPI=false');
console.log('   VPS_ADDRESS=185.232.205.247');

console.log('\n🚀 Следующие шаги:');
console.log('1. Перезапустите Strapi:');
console.log('   cd strapi && npm run develop');
console.log('');
console.log('2. Перезапустите Next.js:');
console.log('   npm run dev');
console.log('   # Или для продакшена:');
console.log('   npm run build && npm start');
console.log('');
console.log('3. Проверьте компонент StrapiStatus на странице');

console.log('\n🔗 Проверьте доступность:');
console.log('   - Strapi: http://185.232.205.247:1337');
console.log('   - Next.js: http://185.232.205.247:3000');
console.log('   - Strapi Admin: http://185.232.205.247:1337/admin'); 