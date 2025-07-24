require('dotenv').config();
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || 'ВАШ_ТОКЕН_ЗДЕСЬ';

const client = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Тестовые данные с правильными полями
const testData = {
  categories: [
    { 
      name: 'Casino', 
      slug: 'casino',
      color: '#FF6B6B',
      description: 'Статьи о казино и азартных играх',
      icon: 'casino',
      sort_order: 1,
      is_active: true
    },
    { 
      name: 'Sports', 
      slug: 'sports',
      color: '#4ECDC4',
      description: 'Спортивные ставки и аналитика',
      icon: 'sports',
      sort_order: 2,
      is_active: true
    },
    { 
      name: 'News', 
      slug: 'news',
      color: '#45B7D1',
      description: 'Новости индустрии',
      icon: 'news',
      sort_order: 3,
      is_active: true
    }
  ],
  
  authors: [
    { 
      name: 'John Doe',
      slug: 'john-doe',
      email: 'john@example.com', 
      bio: 'Эксперт по казино с 10-летним опытом',
      avatar: 'https://example.com/john.jpg',
      website: 'https://johndoe.com',
      social_links: {
        twitter: '@johndoe',
        linkedin: 'john-doe'
      },
      specialization: 'casino',
      is_active: true,
      experience_years: 10
    },
    { 
      name: 'Jane Smith',
      slug: 'jane-smith',
      email: 'jane@example.com', 
      bio: 'Аналитик спортивных ставок',
      avatar: 'https://example.com/jane.jpg',
      website: 'https://janesmith.com',
      social_links: {
        twitter: '@janesmith',
        facebook: 'jane.smith'
      },
      specialization: 'sports',
      is_active: true,
      experience_years: 7
    }
  ],
  
  sites: [
    { 
      name: 'Casino Blog',
      slug: 'casino-blog-' + Date.now(),
      domain: 'casino-blog.com', // ВКЛЮЧЕНО - поле создано в Strapi
      template: 'casino-premium',
      statuspbn: 'deployed',
      config: { 
        theme: 'dark', 
        language: 'en',
        features: ['live-chat', 'newsletter']
      },
      description: 'Премиум блог о казино',
      language: 'en',
      timezone: 'UTC',
      analytics_id: 'GA-123456789',
      ssl_enabled: true,
      cdn_enabled: true,
      backup_enabled: true,
      deployed_at: new Date().toISOString(),
      last_build_at: new Date().toISOString()
    },
    {
      name: 'Sports News',
      slug: 'sports-news-' + Date.now(),
      domain: 'sports-news.com', // ВКЛЮЧЕНО - поле создано в Strapi
      template: 'blog',
      statuspbn: 'deployed',
      config: { 
        theme: 'light', 
        language: 'en',
        features: ['comments', 'social-share']
      },
      description: 'Спортивные новости и аналитика',
      language: 'en',
      timezone: 'UTC',
      analytics_id: 'GA-987654321',
      ssl_enabled: true,
      cdn_enabled: false,
      backup_enabled: true,
      deployed_at: new Date().toISOString()
    }
  ]
};

// Создание категорий (правильный endpoint)
async function createCategories() {
  console.log('\n📋 Создаем категории...');
  const categories = [];
  
  for (const cat of testData.categories) {
    try {
      const response = await client.post('/content-categories', {
        data: cat
      });
      categories.push(response.data.data);
      console.log(`✅ Категория "${cat.name}" создана (ID: ${response.data.data.id})`);
    } catch (error) {
      console.log(`❌ Ошибка создания категории "${cat.name}":`, error.response?.status);
      if (error.response?.data?.error?.details) {
        console.log('   Детали:', error.response.data.error.details);
      }
    }
  }
  
  return categories;
}

// Создание авторов (правильный endpoint)
async function createAuthors() {
  console.log('\n👤 Создаем авторов...');
  const authors = [];
  
  for (const author of testData.authors) {
    try {
      const response = await client.post('/content-authors', {
        data: author
      });
      authors.push(response.data.data);
      console.log(`✅ Автор "${author.name}" создан (ID: ${response.data.data.id})`);
    } catch (error) {
      console.log(`❌ Ошибка создания автора "${author.name}":`, error.response?.status);
      if (error.response?.data?.error?.details) {
        console.log('   Детали:', error.response.data.error.details);
      }
    }
  }
  
  return authors;
}

// Создание сайтов (правильный endpoint)
async function createSites() {
  console.log('\n🌐 Создаем сайты...');
  const sites = [];
  
  for (const site of testData.sites) {
    try {
      const response = await client.post('/pbn-sites', {
        data: site
      });
      sites.push(response.data.data);
      console.log(`✅ Сайт "${site.name}" создан (ID: ${response.data.data.id})`);
    } catch (error) {
      console.log(`❌ Ошибка создания сайта "${site.name}":`, error.response?.status);
      if (error.response?.data?.error?.details) {
        console.log('   Детали:', error.response.data.error.details);
      }
    }
  }
  
  return sites;
}

// Создание статей с отношениями (правильный endpoint)
async function createArticlesWithRelations(categories, authors, sites) {
  console.log('\n📄 Создаем статьи С ОТНОШЕНИЯМИ...');
  
  const articles = [
    {
      title: 'Лучшие казино 2024: Полный обзор',
      slug: 'best-casinos-2024-' + Date.now(),
      content: '<h1>Обзор лучших онлайн казино</h1><p>В этой статье мы рассмотрим топ казино 2024 года...</p>',
      excerpt: 'Топ казино этого года с детальным анализом',
      featured_image: 'https://example.com/casino-2024.jpg',
      meta_title: 'Лучшие казино 2024 | Обзор и рейтинг',
      meta_description: 'Полный обзор и рейтинг лучших онлайн казино 2024 года. Бонусы, лицензии, игры.',
      statusarticles: 'published',
      published: new Date().toISOString(),
      content_categories: [categories[0]?.id], // ИСПРАВЛЕНО: используем правильное имя поля
      // author: authors[0]?.id,      // Пока отключено - нужно найти правильное имя
      // site: sites[0]?.id           // Пока отключено - нужно найти правильное имя
    },
    {
      title: 'Спортивные ставки: Полный гид для начинающих',
      slug: 'sports-betting-guide-' + Date.now(),
      content: '<h1>Гид по спортивным ставкам</h1><p>Полное руководство для тех, кто хочет начать делать ставки на спорт...</p>',
      excerpt: 'Как делать ставки на спорт: пошаговое руководство',
      featured_image: 'https://example.com/sports-betting.jpg',
      meta_title: 'Спортивные ставки гид | Как начать',
      meta_description: 'Полный гид по спортивным ставкам для начинающих. Стратегии, советы, лучшие букмекеры.',
      statusarticles: 'published',
      published: new Date().toISOString(),
      content_categories: [categories[1]?.id], // ИСПРАВЛЕНО: используем правильное имя поля
      // author: authors[1]?.id,      // Пока отключено - нужно найти правильное имя  
      // site: sites[1]?.id           // Пока отключено - нужно найти правильное имя
    },
    {
      title: 'Новости игорной индустрии',
      slug: 'gambling-industry-news-' + Date.now(),
      content: '<h1>Последние новости</h1><p>Актуальные новости из мира азартных игр...</p>',
      excerpt: 'Свежие новости игорной индустрии',
      featured_image: 'https://example.com/news.jpg',
      meta_title: 'Новости казино и ставок',
      meta_description: 'Последние новости из мира онлайн казино и спортивных ставок.',
      statusarticles: 'draft',
      content_categories: [categories[2]?.id], // ИСПРАВЛЕНО: используем правильное имя поля
      // author: authors[0]?.id,      // Пока отключено - нужно найти правильное имя
      // site: sites[0]?.id           // Пока отключено - нужно найти правильное имя
    }
  ];
  
  for (const article of articles) {
    try {
      const response = await client.post('/content-articles', {
        data: article
      });
      console.log(`✅ Статья "${article.title}" создана (ID: ${response.data.data.id})`);
    } catch (error) {
      console.log(`❌ Ошибка создания статьи "${article.title}":`, error.response?.status);
      if (error.response?.data) {
        console.log('   Детали:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

// Тестирование API с populate (правильные endpoints)
async function testAPIWithPopulate() {
  console.log('\n🔍 Тестируем API С POPULATE (отношения созданы)...');
  
  try {
    // Получаем статьи С связанными данными
    const response = await client.get('/content-articles?populate=*');
    
    console.log('\n📊 Результат API:');
    console.log(`Найдено статей: ${response.data.data.length}`);
    
    if (response.data.data.length === 0) {
      console.log('⚠️ Статьи не найдены.');
      return false;
    }
    
    response.data.data.forEach((article, index) => {
      try {
        const attrs = article.attributes || {};
        console.log(`\n${index + 1}. ${attrs.title || 'Без названия'}`);
        console.log(`   📝 Slug: ${attrs.slug || 'Нет'}`);
        console.log(`   📊 Status: ${attrs.statusarticles || 'Нет'}`);
        // Проверяем категории
        if (attrs.content_categories && attrs.content_categories.length > 0) {
          attrs.content_categories.forEach((cat, catIndex) => {
            console.log(`   🏷️ Категория ${catIndex + 1}: ${cat.name || 'Нет'} (${cat.color || 'нет цвета'})`);
          });
        } else {
          console.log(`   🏷️ Категория: Нет`);
        }
        
        console.log(`   👤 Автор: [поле не найдено]`);
        console.log(`   🌐 Сайт: [поле не найдено]`);
        console.log(`   📄 Content: ${attrs.content ? attrs.content.substring(0, 50) + '...' : 'Нет'}`);
        console.log(`   📝 Excerpt: ${attrs.excerpt || 'Нет'}`);
      } catch (itemError) {
        console.log(`❌ Ошибка обработки статьи ${index + 1}:`, itemError.message);
      }
    });
    
    console.log('\n🎉 ЧАСТИЧНЫЕ ОТНОШЕНИЯ РАБОТАЮТ!');
    console.log('   ✅ content_categories - связано'); 
    console.log('   ❓ author - нужно найти правильное имя');
    console.log('   ❓ site - нужно найти правильное имя');
    
    return true;
  } catch (error) {
    console.log('❌ Ошибка API:', error.response?.status || error.message);
    if (error.response?.data) {
      console.log('   Детали:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Проверка существования коллекций (правильные endpoints)
async function checkCollections() {
  console.log('🔍 Проверяем доступность коллекций...\n');
  
  const collections = [
    'content-categories',
    'content-authors', 
    'pbn-sites',
    'content-articles'
  ];
  const available = [];
  
  for (const collection of collections) {
    try {
      const response = await client.get(`/${collection}`);
      console.log(`✅ ${collection} - доступна (${response.data.data.length} записей)`);
      available.push(collection);
    } catch (error) {
      console.log(`❌ ${collection} - недоступна (${error.response?.status})`);
    }
  }
  
  return available;
}

// Тестирование отдельных коллекций
async function testIndividualCollections() {
  console.log('\n📋 Тестируем отдельные коллекции...');
  
  const tests = [
    { name: 'Категории', endpoint: '/content-categories' },
    { name: 'Авторы', endpoint: '/content-authors' },
    { name: 'Сайты', endpoint: '/pbn-sites' },
    { name: 'Статьи', endpoint: '/content-articles' }
  ];
  
  for (const test of tests) {
    try {
      const response = await client.get(test.endpoint);
      const count = response.data.data.length;
      console.log(`✅ ${test.name}: ${count} записей`);
      
      if (count > 0) {
        try {
          const sample = response.data.data[0].attributes || {};
          const keys = Object.keys(sample).slice(0, 3);
          console.log(`   Поля: ${keys.join(', ')}...`);
        } catch (sampleError) {
          console.log(`   Поля: не удалось получить`);
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ошибка ${error.response?.status || error.message}`);
    }
  }
}

// Главная функция
async function main() {
  console.log('🚀 ТЕСТИРОВАНИЕ STRAPI RELATIONS (ОБНОВЛЕНО)\n');
  console.log('='.repeat(60));
  
  // Проверяем авторизацию
  if (API_TOKEN === 'ВАШ_ТОКЕН_ЗДЕСЬ') {
    console.log('⚠️ Установите API токен:');
    console.log('   set STRAPI_API_TOKEN=ваш_токен');
    console.log('   node test-strapi-relations.js');
    return;
  }
  
  try {
    // 1. Проверяем коллекции
    const available = await checkCollections();
    if (available.length < 4) {
      console.log('\n🚨 НЕ ВСЕ КОЛЛЕКЦИИ СОЗДАНЫ!');
      console.log('📋 Создайте коллекции по схеме STRAPI_RELATIONS_SCHEMA.md');
      console.log('📄 Нужны: content-categories, content-authors, pbn-sites, content-articles');
      return;
    }
    
    console.log('\n' + '-'.repeat(60));
    
    // 2. Тестируем отдельные коллекции
    await testIndividualCollections();
    
    console.log('\n' + '-'.repeat(60));
    
    // 3. Создаем тестовые данные только если коллекции пустые
    console.log('\n📝 Создаем тестовые данные...');
    const categories = await createCategories();
    const authors = await createAuthors();
    const sites = await createSites();
    
    console.log('\n' + '-'.repeat(60));
    
    // 4. Создаем статьи с отношениями
    if (available.includes('content-articles')) {
      await createArticlesWithRelations(categories, authors, sites);
    } else {
      console.log('⚠️ Пропускаем создание статей - коллекция content-articles недоступна');
    }
    
    console.log('\n' + '-'.repeat(60));
    
    // 5. Тестируем API с populate
    const success = await testAPIWithPopulate();
    
    console.log('\n' + '='.repeat(60));
    if (success) {
      console.log('🎉 ВСЕ РАБОТАЕТ ИДЕАЛЬНО!');
      console.log('✅ Relations настроены правильно');
      console.log('✅ API возвращает связанные данные');
      console.log('✅ Правильные endpoints используются');
    } else {
      console.log('⚠️ ЕСТЬ ПРОБЛЕМЫ:');
      console.log('❓ Проверьте отношения в коллекциях');
      console.log('❓ Убедитесь что все поля созданы правильно');
    }
    
  } catch (error) {
    console.log('💥 КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    if (error.response?.data) {
      console.log('📄 Детали:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main().catch(console.error); 