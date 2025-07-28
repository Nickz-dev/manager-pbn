const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка фронтенда на VPS...\n');

// Проверяем .env файл
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env файл найден');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Проверяем ключевые переменные
  const useLocalStrapi = envContent.match(/USE_LOCAL_STRAPI=(.+)/)?.[1];
  const nextPublicUseLocal = envContent.match(/NEXT_PUBLIC_USE_LOCAL_STRAPI=(.+)/)?.[1];
  const vpsAddress = envContent.match(/VPS_ADDRESS=(.+)/)?.[1];
  
  console.log('📋 Текущие настройки:');
  console.log(`   USE_LOCAL_STRAPI: ${useLocalStrapi || 'не найдено'}`);
  console.log(`   NEXT_PUBLIC_USE_LOCAL_STRAPI: ${nextPublicUseLocal || 'не найдено'}`);
  console.log(`   VPS_ADDRESS: ${vpsAddress || 'не найдено'}`);
  
  if (useLocalStrapi === 'true' || nextPublicUseLocal === 'true') {
    console.log('\n⚠️  ПРОБЛЕМА: Окружение настроено на ЛОКАЛЬНОЕ!');
    console.log('💡 Для VPS должно быть:');
    console.log('   USE_LOCAL_STRAPI=false');
    console.log('   NEXT_PUBLIC_USE_LOCAL_STRAPI=false');
  } else {
    console.log('\n✅ Окружение настроено на VPS');
  }
  
} else {
  console.log('❌ .env файл не найден');
}

// Проверяем package.json
const packagePath = path.join(__dirname, '../package.json');
if (fs.existsSync(packagePath)) {
  console.log('\n📦 Проверяем package.json...');
  
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log(`   Версия: ${packageContent.version || 'не указана'}`);
  console.log(`   Node.js: ${packageContent.engines?.node || 'не указана'}`);
  
  // Проверяем скрипты
  if (packageContent.scripts) {
    console.log('   Доступные скрипты:');
    Object.keys(packageContent.scripts).forEach(script => {
      console.log(`     - ${script}: ${packageContent.scripts[script]}`);
    });
  }
}

// Проверяем next.config.js
const nextConfigPath = path.join(__dirname, '../next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('\n⚙️  Проверяем next.config.js...');
  
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  if (nextConfigContent.includes('output: "export"')) {
    console.log('⚠️  ВНИМАНИЕ: Настроен статический экспорт');
    console.log('💡 Для VPS может потребоваться серверный рендеринг');
  }
  
  if (nextConfigContent.includes('trailingSlash: true')) {
    console.log('✅ Настроен trailingSlash');
  }
}

console.log('\n🔧 Рекомендации для VPS:');
console.log('1. Убедитесь, что USE_LOCAL_STRAPI=false');
console.log('2. Убедитесь, что NEXT_PUBLIC_USE_LOCAL_STRAPI=false');
console.log('3. Проверьте, что VPS_ADDRESS указан правильно');
console.log('4. Перезапустите сервер после изменений:');
console.log('   npm run build');
console.log('   npm start');

console.log('\n🚀 Для запуска на VPS:');
console.log('   npm run build');
console.log('   npm start');
console.log('   # Или для разработки:');
console.log('   npm run dev'); 