const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

async function linkArticles() {
  try {
    console.log('🔗 Связывание статей с категориями и авторами...');

    // Получаем все статьи
    const articlesRes = await axios.get(`${STRAPI_URL}/api/content-articles`);
    const articles = articlesRes.data.data;

    // Получаем все категории
    const categoriesRes = await axios.get(`${STRAPI_URL}/api/content-categories`);
    const categories = categoriesRes.data.data;

    // Получаем всех авторов
    const authorsRes = await axios.get(`${STRAPI_URL}/api/content-authors`);
    const authors = authorsRes.data.data;

    console.log(`📄 Найдено статей: ${articles.length}`);
    console.log(`📂 Найдено категорий: ${categories.length}`);
    console.log(`👤 Найдено авторов: ${authors.length}`);

    // Связываем статьи с категориями и авторами
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      // Выбираем категорию на основе заголовка
      let selectedCategory = null;
      if (article.title.toLowerCase().includes('казино') || article.title.toLowerCase().includes('casino')) {
        selectedCategory = categories.find(cat => cat.name === 'Casino');
      } else if (article.title.toLowerCase().includes('спорт') || article.title.toLowerCase().includes('sport')) {
        selectedCategory = categories.find(cat => cat.name === 'Sports');
      } else {
        selectedCategory = categories.find(cat => cat.name === 'News');
      }

      // Выбираем автора на основе специализации
      let selectedAuthor = null;
      if (selectedCategory && selectedCategory.name === 'Casino') {
        selectedAuthor = authors.find(auth => auth.specialization === 'casino');
      } else if (selectedCategory && selectedCategory.name === 'Sports') {
        selectedAuthor = authors.find(auth => auth.specialization === 'sports');
      } else {
        selectedAuthor = authors.find(auth => auth.specialization === 'general');
      }

      // Обновляем статью
      const updateData = {
        content_categories: selectedCategory ? [selectedCategory.id] : [],
        content_author: selectedAuthor ? selectedAuthor.id : null
      };

      console.log(`📝 Обновляем статью "${article.title}":`);
      console.log(`   Категория: ${selectedCategory ? selectedCategory.name : 'нет'}`);
      console.log(`   Автор: ${selectedAuthor ? selectedAuthor.name : 'нет'}`);

      await axios.put(`${STRAPI_URL}/api/content-articles/${article.documentId}`, {
        data: updateData
      });

      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Все статьи успешно связаны!');

  } catch (error) {
    console.error('❌ Ошибка при связывании статей:', error.response?.data || error.message);
  }
}

// Запускаем скрипт
linkArticles(); 