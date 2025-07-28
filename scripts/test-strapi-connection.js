const axios = require('axios');
require('dotenv').config();

console.log('🔍 Быстрая проверка подключения к Strapi...');

// Определяем URL Strapi
const getStrapiUrl = () => {
  const useLocal = process.env.USE_LOCAL_STRAPI === 'true';
  return useLocal ? 'http://localhost:1337' : 'http://185.232.205.247:1337';
};

const strapiUrl = getStrapiUrl();
console.log(`🔗 Strapi URL: ${strapiUrl}`);

// Получаем токен из переменной окружения
function getStrapiToken() {
  const token = process.env.STRAPI_TOKEN;
  if (!token) {
    console.error('❌ STRAPI_TOKEN не найден в .env файле');
    console.log('💡 Добавьте в .env: STRAPI_TOKEN=ваш_токен_здесь');
    return null;
  }
  return token;
}

async function testConnection() {
  try {
    console.log('🔍 Тестируем подключение...');
    
    // Тест 1: Проверяем доступность сервера
    const healthResponse = await axios.get(`${strapiUrl}/_health`, {
      timeout: 5000
    });
    console.log('✅ Сервер доступен');
    
    // Тест 2: Проверяем API с токеном
    const token = getStrapiToken();
    if (!token) {
      return { success: false, error: 'No token' };
    }
    
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      const apiResponse = await axios.get(`${strapiUrl}/api/domains`, {
        headers,
        timeout: 5000
      });
      console.log('✅ API доступен с токеном');
      return { success: true, authRequired: false };
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Ошибка 401: Неверный токен');
        return { success: false, error: 'Invalid token' };
      }
      if (error.response?.status === 403) {
        console.log('❌ Ошибка 403: Доступ запрещен');
        return { success: false, error: 'Access denied' };
      }
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message);
    return { success: false, error: error.message };
  }
}

async function testDataAccess() {
  try {
    console.log('📊 Тестируем доступ к данным...');
    
    const token = getStrapiToken();
    if (!token) {
      return { success: false, error: 'No token' };
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Тестируем доступ к доменам
    const domainsResponse = await axios.get(`${strapiUrl}/api/domains`, {
      headers,
      timeout: 5000
    });
    console.log(`✅ Домены доступны (${domainsResponse.data.data.length} записей)`);
    
    // Тестируем доступ к VPS серверам
    const vpsResponse = await axios.get(`${strapiUrl}/api/vps-servers`, {
      headers,
      timeout: 5000
    });
    console.log(`✅ VPS серверы доступны (${vpsResponse.data.data.length} записей)`);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Ошибка доступа к данным:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function main() {
  console.log('\n🚀 Начинаем тестирование...\n');
  
  // Проверяем токен
  const token = getStrapiToken();
  if (!token) {
    console.log('\n❌ STRAPI_TOKEN не найден');
    console.log('💡 Добавьте в .env: STRAPI_TOKEN=ваш_токен_здесь');
    process.exit(1);
  }
  
  console.log('✅ STRAPI_TOKEN найден');
  
  // Тест подключения
  const connectionResult = await testConnection();
  
  if (!connectionResult.success) {
    console.log('\n❌ Не удается подключиться к Strapi');
    console.log('💡 Проверьте:');
    console.log('   1. Strapi запущен');
    console.log('   2. URL правильный');
    console.log('   3. STRAPI_TOKEN правильный');
    console.log('   4. Нет ошибок в консоли Strapi');
    process.exit(1);
  }
  
  // Тест доступа к данным
  const dataResult = await testDataAccess();
  
  if (!dataResult.success) {
    console.log('\n❌ Не удается получить доступ к данным');
    console.log('💡 Проверьте права доступа токена');
    process.exit(1);
  }
  
  console.log('\n✅ Все тесты пройдены успешно!');
  console.log('🎯 Strapi готов к работе с токеном');
  
  console.log('\n📋 Следующие шаги:');
  console.log('   node scripts/seed-test-domains.js - добавить тестовые данные');
  console.log('   node scripts/check-strapi-data.js - проверить данные');
}

// Запускаем скрипт
main().catch(error => {
  console.error('❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 