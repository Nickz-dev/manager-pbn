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

async function testRelationFields() {
  console.log('🔍 ДИАГНОСТИКА ПОЛЕЙ ОТНОШЕНИЙ\n');
  
  // Создаем простую статью без отношений
  console.log('1. Создаем простую статью...');
  try {
    const response = await client.post('/content-articles', {
      data: {
        title: 'Test Relations ' + Date.now(),
        slug: 'test-relations-' + Date.now(),
        content: 'Test content',
        statusarticles: 'draft'
      }
    });
    
    console.log('✅ Статья создана (ID:', response.data.data.id, ')');
    
    // Получаем статью и смотрим все доступные поля
    const article = response.data.data.attributes;
    console.log('\n📋 ДОСТУПНЫЕ ПОЛЯ в content-articles:');
    Object.keys(article).forEach(field => {
      console.log(`   - ${field}: ${typeof article[field]} = ${article[field]}`);
    });
    
  } catch (error) {
    console.log('❌ Ошибка создания статьи:', error.response?.data);
    return;
  }
  
  // Тестируем разные варианты имен полей отношений
  console.log('\n2. Тестируем populate с разными именами полей...');
  
  const relationFields = [
    'category',
    'categories',
    'content_category', 
    'contentCategory',
    'content-category',
    'author',
    'authors',
    'content_author',
    'contentAuthor', 
    'content-author',
    'site',
    'sites',
    'pbn_site',
    'pbnSite',
    'pbn-site'
  ];
  
  for (const field of relationFields) {
    try {
      await client.get(`/content-articles?populate[${field}]=*`);
      console.log(`✅ ${field}: РАБОТАЕТ`);
    } catch (error) {
      console.log(`❌ ${field}: ${error.response?.data?.error?.message}`);
    }
  }
  
  // Пробуем populate=*
  console.log('\n3. Тестируем populate=*...');
  try {
    const response = await client.get('/content-articles?populate=*');
    console.log('✅ populate=* работает');
    
    if (response.data.data.length > 0) {
      const article = response.data.data[0].attributes;
      console.log('\n📋 ПОЛЯ с populate=*:');
      Object.keys(article).forEach(field => {
        console.log(`   - ${field}: ${typeof article[field]}`);
        if (article[field] && typeof article[field] === 'object' && article[field].data) {
          console.log(`     → ОТНОШЕНИЕ! data:`, !!article[field].data);
        }
      });
    }
  } catch (error) {
    console.log('❌ populate=* ошибка:', error.response?.data);
  }
}

testRelationFields().catch(console.error); 