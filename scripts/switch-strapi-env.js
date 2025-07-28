const fs = require('fs');
const path = require('path');

console.log('🔄 Универсальное переключение окружения...');

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

// Обновляем или добавляем переменные
const envVars = [
  `USE_LOCAL_STRAPI=${newValue}`,
  `NEXT_PUBLIC_USE_LOCAL_STRAPI=${newValue}`
];

envVars.forEach(envVar => {
  const [key] = envVar.split('=');
  const regex = new RegExp(`^${key}=.*`, 'm');
  
  if (envContent.match(regex)) {
    envContent = envContent.replace(regex, envVar);
  } else {
    envContent += `\n# Environment Switch\n${envVar}\n`;
  }
});

// Записываем обновленный файл
fs.writeFileSync(envPath, envContent);

console.log(`✅ Переключено на ${newEnvName} окружение`);
console.log(`🔗 Strapi URL: ${newValue === 'true' ? 'http://localhost:1337' : 'http://185.232.205.247:1337'}`);
console.log(`🔗 Preview URL: ${newValue === 'true' ? 'http://localhost:4321' : 'http://185.232.205.247:4321'}`);

if (newValue === 'true') {
  console.log('\n📋 Для локальной разработки:');
  console.log('   cd strapi');
  console.log('   npm run develop');
  console.log('   # В другом терминале:');
  console.log('   npm run dev');
} else {
  console.log('\n📋 Для VPS окружения:');
  console.log('   Убедитесь, что VPS Strapi запущен');
  console.log('   npm run dev');
}

console.log('\n🔄 Перезапустите Next.js сервер для применения изменений');
console.log('🎯 Теперь все компоненты (Strapi, Preview, Build) будут использовать выбранное окружение'); 