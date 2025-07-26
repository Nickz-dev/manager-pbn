const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

async function createAdditionalCategories() {
  try {
    console.log('📂 Создание дополнительных категорий...');

    const categories = [
      {
        name: 'Криптовалюта',
        slug: 'crypto',
        color: '#F7931A',
        description: 'Статьи о криптовалютах и блокчейне',
        icon: 'crypto',
        sort_order: 4
      },
      {
        name: 'Финансы',
        slug: 'finance',
        color: '#2ECC71',
        description: 'Финансовые статьи и инвестиции',
        icon: 'finance',
        sort_order: 5
      }
    ];

    for (const category of categories) {
      console.log(`📝 Создаем категорию: ${category.name}`);
      
      await axios.post(`${STRAPI_URL}/api/content-categories`, {
        data: category
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Дополнительные категории созданы!');

  } catch (error) {
    console.error('❌ Ошибка при создании категорий:', error.response?.data || error.message);
  }
}

// Запускаем скрипт
createAdditionalCategories(); 