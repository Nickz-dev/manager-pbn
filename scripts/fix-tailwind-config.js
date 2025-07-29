const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление конфигурации Tailwind CSS во всех шаблонах...\n');

// Список шаблонов
const templates = [
  'casino-blog',
  'gaming-news', 
  'poker-platform',
  'slots-review',
  'sports-betting'
];

// Базовая конфигурация Tailwind
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/**/*.astro',
    './src/pages/**/*.astro',
    './src/components/**/*.astro',
    './src/layouts/**/*.astro'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}`;

// Обновленная конфигурация Astro с Tailwind
const astroConfigTemplate = `import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://example.com', // Будет переопределяться динамически
  base: '/',
  
  // Оптимизации сборки
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  
  // Настройки для статической генерации
  output: 'static',
  
  // Оптимизации для SEO
  trailingSlash: 'never',
  
  // Настройки для безопасности
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    }
  },
  
  // Настройки для разработки
  dev: {
    port: 4321,
    host: true,
  },
  
  // Оптимизации для CSS
  vite: {
    css: {
      devSourcemap: true,
    },
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro']
          }
        }
      }
    }
  }
});`;

function fixTemplate(templateName) {
  const templatePath = path.join(__dirname, '../templates', templateName);
  
  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Шаблон ${templateName} не найден`);
    return false;
  }
  
  console.log(`🔧 Исправляем ${templateName}...`);
  
  try {
    // 1. Создаем/обновляем tailwind.config.mjs
    const tailwindConfigPath = path.join(templatePath, 'tailwind.config.mjs');
    fs.writeFileSync(tailwindConfigPath, tailwindConfig);
    console.log(`   ✅ Создан tailwind.config.mjs`);
    
    // 2. Обновляем astro.config.mjs
    const astroConfigPath = path.join(templatePath, 'astro.config.mjs');
    if (fs.existsSync(astroConfigPath)) {
      fs.writeFileSync(astroConfigPath, astroConfigTemplate);
      console.log(`   ✅ Обновлен astro.config.mjs`);
    } else {
      console.log(`   ⚠️  astro.config.mjs не найден в ${templateName}`);
    }
    
    // 3. Проверяем package.json
    const packageJsonPath = path.join(templatePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Добавляем @astrojs/tailwind если его нет
      if (!packageJson.devDependencies['@astrojs/tailwind']) {
        packageJson.devDependencies['@astrojs/tailwind'] = '^5.0.0';
        console.log(`   ✅ Добавлен @astrojs/tailwind в devDependencies`);
      }
      
      // Добавляем tailwindcss если его нет
      if (!packageJson.devDependencies['tailwindcss']) {
        packageJson.devDependencies['tailwindcss'] = '^3.3.5';
        console.log(`   ✅ Добавлен tailwindcss в devDependencies`);
      }
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`   ✅ Обновлен package.json`);
    }
    
    console.log(`   ✅ ${templateName} исправлен`);
    return true;
    
  } catch (error) {
    console.log(`   ❌ Ошибка в ${templateName}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Начинаем исправление конфигурации Tailwind CSS...\n');
  
  let successCount = 0;
  
  for (const template of templates) {
    const success = fixTemplate(template);
    if (success) successCount++;
  }
  
  console.log('\n📊 Результаты исправления:');
  console.log(`   ✅ Успешно: ${successCount}/${templates.length}`);
  console.log(`   ❌ Ошибок: ${templates.length - successCount}/${templates.length}`);
  
  if (successCount === templates.length) {
    console.log('\n🎉 Все шаблоны исправлены!');
    console.log('\n💡 Следующие шаги:');
    console.log('1. Переустановите зависимости: node scripts/fix-preview-deps.js');
    console.log('2. Протестируйте сборку: node scripts/diagnose-vps-issues.js');
    console.log('3. Запустите полное исправление: node scripts/fix-vps-all-enhanced.js');
  } else {
    console.log('\n⚠️  Некоторые шаблоны не удалось исправить');
  }
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 