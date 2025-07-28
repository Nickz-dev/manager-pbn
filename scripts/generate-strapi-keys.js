const crypto = require('crypto');

console.log('🔐 Генерация секретных ключей для Strapi...\n');

// Генерируем все необходимые ключи
const appKeys = [
  crypto.randomBytes(32).toString('base64'),
  crypto.randomBytes(32).toString('base64'),
  crypto.randomBytes(32).toString('base64'),
  crypto.randomBytes(32).toString('base64')
];

const apiTokenSalt = crypto.randomBytes(16).toString('base64');
const adminJwtSecret = crypto.randomBytes(32).toString('base64');
const jwtSecret = crypto.randomBytes(32).toString('base64');
const transferTokenSalt = crypto.randomBytes(32).toString('base64');

console.log('📋 Скопируйте эти переменные в strapi/.env:\n');

console.log('# Security Keys');
console.log(`APP_KEYS=${appKeys.join(',')}`);
console.log(`API_TOKEN_SALT=${apiTokenSalt}`);
console.log(`ADMIN_JWT_SECRET=${adminJwtSecret}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`TRANSFER_TOKEN_SALT=${transferTokenSalt}`);

console.log('\n📋 Для локальной разработки:');
console.log('HOST=0.0.0.0');
console.log('PORT=1337');
console.log('PUBLIC_URL=http://localhost:1337');
console.log('DATABASE_CLIENT=sqlite');
console.log('DATABASE_FILENAME=.tmp/data.db');
console.log('NODE_ENV=development');
console.log('CORS_ORIGIN=http://localhost:3000,http://localhost:4321');

console.log('\n📋 Для VPS:');
console.log('HOST=0.0.0.0');
console.log('PORT=1337');
console.log('PUBLIC_URL=http://185.232.205.247:1337');
console.log('DATABASE_CLIENT=postgres');
console.log('DATABASE_HOST=localhost');
console.log('DATABASE_PORT=5432');
console.log('DATABASE_NAME=strapi');
console.log('DATABASE_USERNAME=strapi_user');
console.log('DATABASE_PASSWORD=your_secure_password');
console.log('NODE_ENV=production');
console.log('CORS_ORIGIN=http://185.232.205.247:3000,http://185.232.205.247:4321');

console.log('\n✅ Ключи сгенерированы!');
console.log('💡 Скопируйте нужные переменные в strapi/.env'); 