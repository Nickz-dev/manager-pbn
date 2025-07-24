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

async function testPbnSites() {
  console.log('🌐 Тестируем pbn-sites...\n');
  
  const tests = [
    { name: 'Только name', data: { name: 'Test Site 1' } },
    { name: 'name + slug', data: { name: 'Test Site 2', slug: 'test-site-2' } },
    { name: 'С domain', data: { name: 'Test Site 3', slug: 'test-site-3', domain: 'test3.com' } },
    { name: 'С template', data: { name: 'Test Site 4', slug: 'test-site-4', template: 'blog' } },
    { name: 'С statuspbn', data: { name: 'Test Site 5', slug: 'test-site-5', statuspbn: 'draft' } }
  ];
  
  for (const test of tests) {
    try {
      const response = await client.post('/pbn-sites', { data: test.data });
      console.log(`✅ ${test.name}: успешно создано (ID: ${response.data.data.id})`);
      
      // Показываем поля созданного сайта
      if (test.name === 'name + slug') {
        const site = response.data.data;
        console.log('📋 Доступные поля:', Object.keys(site.attributes));
      }
      
      break; // Если удалось создать - останавливаемся
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.data?.error?.message || error.response?.status}`);
      if (error.response?.data?.error?.details) {
        console.log(`   Детали:`, error.response.data.error.details);
      }
    }
  }
  
  // Проверяем существующие сайты
  console.log('\n📊 Существующие сайты:');
  try {
    const response = await client.get('/pbn-sites');
    console.log(`Найдено: ${response.data.data.length} сайтов`);
    
    response.data.data.forEach((site, index) => {
      const attrs = site.attributes;
      console.log(`${index + 1}. ${attrs.name} (ID: ${site.id})`);
      if (attrs.domain) console.log(`   Domain: ${attrs.domain}`);
      if (attrs.template) console.log(`   Template: ${attrs.template}`);
      if (attrs.statuspbn) console.log(`   Status: ${attrs.statuspbn}`);
    });
  } catch (error) {
    console.log('❌ Ошибка получения сайтов:', error.response?.data);
  }
}

testPbnSites().catch(console.error); 