const { generateAstroData } = require('./generate-astro-data');
const { buildAstroSite } = require('./build-astro');

async function testBuildSystem() {
  try {
    console.log('🧪 Testing build system...');
    
    // Тестовая конфигурация сайта
    const testSiteConfig = {
      name: "Test PBN Blog",
      description: "Test Private Blog Network",
      domain: "test-pbn-blog.com",
      template: "pbn-blog",
      keywords: ["test", "blog", "articles"],
      theme: "light",
      analytics: {
        googleAnalytics: ""
      }
    };
    
    console.log('📊 Step 1: Testing data generation...');
    const { siteData, imageStats } = await generateAstroData(testSiteConfig);
    
    console.log('✅ Data generation completed');
    console.log(`📊 Generated ${siteData.articles.length} articles`);
    console.log(`📂 Generated ${siteData.categories.length} categories`);
    console.log(`🖼️ Downloaded ${imageStats.downloaded}/${imageStats.total} images`);
    
    // Проверяем слаги
    const articlesWithSlugs = siteData.articles.filter(article => article.slug);
    console.log(`🔗 Generated slugs for ${articlesWithSlugs.length} articles`);
    
    // Проверяем изображения
    const articlesWithImages = siteData.articles.filter(article => article.featured_image);
    console.log(`🖼️ Articles with images: ${articlesWithImages.length}`);
    
    // Проверяем категории
    const uniqueCategories = new Set();
    siteData.articles.forEach(article => {
      if (article.categories) {
        article.categories.forEach(cat => uniqueCategories.add(cat.name));
      }
    });
    console.log(`📂 Unique categories from articles: ${uniqueCategories.size}`);
    
    console.log('\n📋 Sample article data:');
    if (siteData.articles.length > 0) {
      const sample = siteData.articles[0];
      console.log({
        title: sample.title,
        slug: sample.slug,
        hasImage: !!sample.featured_image,
        categories: sample.categories?.length || 0,
        excerpt: sample.excerpt?.substring(0, 100) + '...'
      });
    }
    
    console.log('\n🎉 Build system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Build system test failed:', error);
    process.exit(1);
  }
}

// Запуск теста
if (require.main === module) {
  testBuildSystem();
}

module.exports = { testBuildSystem }; 