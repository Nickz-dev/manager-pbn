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

async function testSimpleArticle() {
  console.log('🧪 Тестируем создание простой статьи...\n');
  
  try {
    // Попробуем создать базовую статью
    const response = await client.post('/content-articles', {
      data: {
        title: 'Test Article',
        slug: 'test-article-' + Date.now(),
        content: 'Test content',
        statusArticles: 'draft'
      }
    });
    
    console.log('✅ Статья создана!');
    console.log('📄 ID:', response.data.data.id);
    console.log('📋 Поля:', Object.keys(response.data.data.attributes));
    
    // Теперь попробуем получить с populate
    console.log('\n🔍 Пробуем populate...');
    try {
      const populateResponse = await client.get('/content-articles?populate=*');
      console.log('✅ Populate работает!');
      
      if (populateResponse.data.data.length > 0) {
        const article = populateResponse.data.data[0];
        console.log('📋 Доступные поля:', Object.keys(article.attributes));
        
        // Проверяем наличие полей отношений
        const relationFields = ['category', 'author', 'site'];
        relationFields.forEach(field => {
          if (article.attributes.hasOwnProperty(field)) {
            console.log(`✅ Поле ${field}: найдено`);
          } else {
            console.log(`❌ Поле ${field}: НЕ найдено`);
          }
        });
      }
    } catch (populateError) {
      console.log('❌ Populate ошибка:', populateError.response?.data);
    }
    
  } catch (error) {
    console.log('❌ Ошибка создания статьи:');
    console.log('Статус:', error.response?.status);
    console.log('Данные:', error.response?.data);
  }
}

async function testRelationFields() {
  console.log('\n🔗 Тестируем отдельные поля отношений...');
  
  const fields = ['category', 'author', 'site'];
  
  for (const field of fields) {
    try {
      const response = await client.get(`/content-articles?populate[${field}]=*`);
      console.log(`✅ Поле ${field}: OK`);
    } catch (error) {
      console.log(`❌ Поле ${field}: ${error.response?.data?.error?.message}`);
    }
  }
}

async function main() {
  await testSimpleArticle();
  await testRelationFields();
}

main().catch(console.error); 