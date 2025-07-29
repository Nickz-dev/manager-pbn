const fs = require('fs');
const path = require('path');

// Список шаблонов для улучшения
const templates = [
  'poker-platform',
  'sports-betting', 
  'gaming-news',
  'slots-review'
];

// Функция для копирования файла
function copyFile(source, destination) {
  try {
    const content = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(destination, content);
    console.log(`✅ Скопирован: ${destination}`);
  } catch (error) {
    console.log(`❌ Ошибка копирования ${source}:`, error.message);
  }
}

// Функция для создания директории если не существует
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Функция для исправления футера в шаблоне
function fixFooter(templateName) {
  console.log(`\n🔧 Исправление футера в шаблоне: ${templateName}`);
  
  const indexPath = path.join(__dirname, '..', 'templates', templateName, 'src', 'pages', 'index.astro');
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Заменяем slice(0, 4) на slice(0, 5) для Latest Articles
    content = content.replace(
      /latestArticles\.slice\(0, 4\)/g,
      'latestArticles.slice(0, 5)'
    );
    
    // Также заменяем для categories если есть
    content = content.replace(
      /popularCategories\.slice\(0, 4\)/g,
      'popularCategories.slice(0, 5)'
    );
    
    fs.writeFileSync(indexPath, content);
    console.log(`✅ Исправлен футер: ${indexPath}`);
  } else {
    console.log(`❌ Файл не найден: ${indexPath}`);
  }
}

// Функция для улучшения шаблона
function improveTemplate(templateName) {
  console.log(`\n🚀 Улучшение шаблона: ${templateName}`);
  
  const templateDir = path.join(__dirname, '..', 'templates', templateName);
  const sourceDir = path.join(__dirname, '..', 'templates', 'casino-blog');
  
  if (!fs.existsSync(templateDir)) {
    console.log(`❌ Шаблон ${templateName} не найден`);
    return;
  }
  
  // 1. Обновляем package.json
  console.log('\n📦 Обновление package.json...');
  copyFile(
    path.join(sourceDir, 'package.json'),
    path.join(templateDir, 'package.json')
  );
  
  // 2. Обновляем astro.config.mjs
  console.log('\n⚙️ Обновление astro.config.mjs...');
  copyFile(
    path.join(sourceDir, 'astro.config.mjs'),
    path.join(templateDir, 'astro.config.mjs')
  );
  
  // 3. Создаем динамические файлы
  console.log('\n📄 Создание динамических файлов...');
  
  // robots.txt.ts
  ensureDir(path.join(templateDir, 'src', 'pages'));
  copyFile(
    path.join(sourceDir, 'src', 'pages', 'robots.txt.ts'),
    path.join(templateDir, 'src', 'pages', 'robots.txt.ts')
  );
  
  // sitemap.xml.ts
  copyFile(
    path.join(sourceDir, 'src', 'pages', 'sitemap.xml.ts'),
    path.join(templateDir, 'src', 'pages', 'sitemap.xml.ts')
  );
  
  // rss.xml.ts
  copyFile(
    path.join(sourceDir, 'src', 'pages', 'rss.xml.ts'),
    path.join(templateDir, 'src', 'pages', 'rss.xml.ts')
  );
  
  // site.webmanifest.ts
  copyFile(
    path.join(sourceDir, 'src', 'pages', 'site.webmanifest.ts'),
    path.join(templateDir, 'src', 'pages', 'site.webmanifest.ts')
  );
  
  // 4. Удаляем статические файлы если они есть
  console.log('\n🗑️ Удаление статических файлов...');
  const staticFiles = [
    path.join(templateDir, 'public', 'robots.txt'),
    path.join(templateDir, 'public', 'site.webmanifest')
  ];
  
  staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Удален: ${file}`);
    }
  });
  
  // 5. Обновляем главную страницу (базовые улучшения)
  console.log('\n🏠 Обновление главной страницы...');
  const indexPath = path.join(templateDir, 'src', 'pages', 'index.astro');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Добавляем базовые SEO теги если их нет
    if (!content.includes('meta name="viewport"')) {
      content = content.replace(
        '<meta charset="utf-8">',
        `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#3b82f6">`
      );
    }
    
    // Добавляем Google Fonts если их нет
    if (!content.includes('fonts.googleapis.com')) {
      content = content.replace(
        '</head>',
        `  <!-- Preload critical resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>
  
</head>`
      );
    }
    
    // Исправляем футер - показываем только 5 последних статей
    content = content.replace(
      /latestArticles\.slice\(0, 4\)/g,
      'latestArticles.slice(0, 5)'
    );
    
    content = content.replace(
      /popularCategories\.slice\(0, 4\)/g,
      'popularCategories.slice(0, 5)'
    );
    
    fs.writeFileSync(indexPath, content);
    console.log(`✅ Обновлена главная страница: ${indexPath}`);
  }
  
  // 6. Обновляем страницу статьи (базовые улучшения)
  console.log('\n📝 Обновление страницы статьи...');
  const articlePath = path.join(templateDir, 'src', 'pages', 'articles', '[slug].astro');
  if (fs.existsSync(articlePath)) {
    let content = fs.readFileSync(articlePath, 'utf8');
    
    // Добавляем базовые SEO теги если их нет
    if (!content.includes('meta name="viewport"')) {
      content = content.replace(
        '<meta charset="utf-8">',
        `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#3b82f6">`
      );
    }
    
    // Добавляем Google Fonts если их нет
    if (!content.includes('fonts.googleapis.com')) {
      content = content.replace(
        '</head>',
        `  <!-- Preload critical resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>
  
</head>`
      );
    }
    
    fs.writeFileSync(articlePath, content);
    console.log(`✅ Обновлена страница статьи: ${articlePath}`);
  }
  
  console.log(`\n✅ Шаблон ${templateName} улучшен!`);
}

function fixHtmlLang() {
  console.log('🔧 Проверяю и обновляю html lang атрибуты...');
  
  const templates = [
    'astro-pbn-blog',
    'astro-slots-review', 
    'astro-gaming-news',
    'astro-sports-betting',
    'astro-poker-platform'
  ];
  
  templates.forEach(template => {
    const articlePath = path.join(__dirname, '..', 'templates', template, 'src', 'pages', 'articles', '[slug].astro');
    
    if (fs.existsSync(articlePath)) {
      let content = fs.readFileSync(articlePath, 'utf8');
      
      // Проверяем, есть ли уже динамический lang атрибут
      if (content.includes('<html lang={site.config?.language || \'en\'}>')) {
        console.log(`✅ ${template}: html lang уже настроен правильно`);
      } else if (content.includes('<html lang=')) {
        // Заменяем статический lang на динамический
        content = content.replace(
          /<html lang="[^"]*">/g,
          '<html lang={site.config?.language || \'en\'}>'
        );
        fs.writeFileSync(articlePath, content, 'utf8');
        console.log(`✅ ${template}: обновлен html lang атрибут`);
      } else {
        console.log(`⚠️  ${template}: не найден html lang атрибут`);
      }
    } else {
      console.log(`❌ ${template}: файл [slug].astro не найден`);
    }
  });
}

// Главная функция
function main() {
  console.log('🚀 Начинаем улучшение всех шаблонов...\n');
  
  templates.forEach(template => {
    improveTemplate(template);
  });

  fixHtmlLang();
  
  console.log('\n🎉 Все шаблоны улучшены!');
  console.log('\n📋 Следующие шаги:');
  console.log('1. Перейти в каждый шаблон и выполнить: npm install');
  console.log('2. Протестировать сборку: npm run build');
  console.log('3. Проверить результат: npm run preview');
}

// Запуск скрипта
if (require.main === module) {
  main();
}

module.exports = { improveTemplate, fixFooter }; 