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

async function testManualRelation() {
  console.log('🔗 ТЕСТ РУЧНОГО СВЯЗЫВАНИЯ\n');
  
  const articleDocumentId = "otrp727gpw6pkwa7ai3iql8h"; // documentId статьи "Лучшие казино 2024"
  
  // Попробуем разные синтаксисы для связывания статьи с категорией ID 2
  const tests = [
    { name: 'Массив ID', data: { content_categories: [2] } },
    { name: 'Единичный ID', data: { content_categories: 2 } },
    { name: 'Объект с ID', data: { content_categories: { id: 2 } } },
    { name: 'Массив объектов', data: { content_categories: [{ id: 2 }] } }
  ];
  
  for (const test of tests) {
    console.log(`\n📝 Тестируем: ${test.name}`);
    try {
      // Попробуем обычный ID
      let response;
      try {
        response = await client.put(`/content-articles/6`, { data: test.data });
        console.log('✅ Обновлено через ID');
      } catch (idError) {
        // Если ID не работает, пробуем documentId
        response = await client.put(`/content-articles/${articleDocumentId}`, { data: test.data });
        console.log('✅ Обновлено через documentId');
      }
      
      // Проверяем результат (используем documentId для проверки)
      const checkResponse = await client.get(`/content-articles/${articleDocumentId}?populate=content_categories`);
      const categories = checkResponse.data.data.attributes.content_categories;
      if (categories && categories.length > 0) {
        console.log(`🎉 СВЯЗАНО! Категория: ${categories[0].attributes.name}`);
        return; // Если удалось - выходим
      } else {
        console.log('❌ Не связалось - categories пустой');
      }
      
    } catch (error) {
      console.log(`❌ Ошибка: ${error.response?.data?.error?.message || error.response?.status}`);
      if (error.response?.data) {
        console.log(`   Детали:`, JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

testManualRelation().catch(console.error); 