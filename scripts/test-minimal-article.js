require('dotenv').config();
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const client = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testMinimalFields() {
  console.log('🔍 Проверяем минимальные поля...\n');
  
  // Пробуем только обязательные поля
  const tests = [
    { name: 'Только title', data: { title: 'Test 1' } },
    { name: 'title + slug', data: { title: 'Test 2', slug: 'test-2-' + Date.now() } },
    { name: 'title + content', data: { title: 'Test 3', content: 'Test content' } },
    { name: 'title + slug + content', data: { title: 'Test 4', slug: 'test-4-' + Date.now(), content: 'Test content' } },
    { name: 'С status', data: { title: 'Test 5', slug: 'test-5-' + Date.now(), content: 'Test content', status: 'draft' } },
    { name: 'С statuspbn', data: { title: 'Test 6', slug: 'test-6-' + Date.now(), content: 'Test content', statuspbn: 'draft' } }
  ];
  
  for (const test of tests) {
    try {
      const response = await client.post('/content-articles', { data: test.data });
      console.log(`✅ ${test.name}: успешно создано (ID: ${response.data.data.id})`);
      
      // Получаем созданную запись для анализа полей
      if (test.name === 'title + slug + content') {
        const article = response.data.data;
        console.log('📋 Доступные поля:', Object.keys(article.attributes));
      }
      
      break; // Если удалось создать - останавливаемся
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.data?.error?.message}`);
    }
  }
}

async function checkExistingData() {
  console.log('\n📊 Проверяем существующие данные...');
  
  try {
    // Получаем категории с их ID
    const categories = await client.get('/content-categories');
    console.log('📋 Категории:');
    categories.data.data.forEach(cat => {
      console.log(`  - ${cat.attributes.name} (ID: ${cat.id})`);
    });
    
    // Получаем авторов  
    const authors = await client.get('/content-authors');
    console.log('\n👤 Авторы:');
    authors.data.data.forEach(author => {
      console.log(`  - ${author.attributes.name} (ID: ${author.id})`);
    });
    
    // Получаем сайты
    const sites = await client.get('/pbn-sites');
    console.log('\n🌐 Сайты:');
    if (sites.data.data.length === 0) {
      console.log('  - Нет сайтов');
    } else {
      sites.data.data.forEach(site => {
        console.log(`  - ${site.attributes.name} (ID: ${site.id})`);
      });
    }
    
  } catch (error) {
    console.log('❌ Ошибка получения данных:', error.response?.data);
  }
}

async function main() {
  await testMinimalFields();
  await checkExistingData();
}

main().catch(console.error); 