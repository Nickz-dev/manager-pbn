# 🚀 Optimized PBN Blog Template

Профессиональный шаблон блога для PBN сетей с полной SEO оптимизацией, высокой производительностью и современным дизайном.

## ✨ Особенности

### 🎯 SEO Оптимизация
- **Полная мета-разметка** - Title, Description, Keywords, Open Graph, Twitter Cards
- **Структурированные данные** - Schema.org разметка для статей и сайта
- **Автоматический sitemap.xml** - Динамическая генерация карты сайта
- **RSS feed** - Поддержка RSS для подписчиков
- **robots.txt** - Оптимизированная индексация
- **Canonical URLs** - Предотвращение дублированного контента

### ⚡ Производительность
- **Оптимизированные изображения** - Автоматическое сжатие и WebP конвертация
- **Lazy loading** - Отложенная загрузка изображений
- **Critical CSS** - Инлайн критических стилей
- **Minification** - Сжатие CSS, JS и HTML
- **Preload ресурсов** - Оптимизация загрузки шрифтов
- **Core Web Vitals** - Оптимизация для Google PageSpeed

### 🎨 Современный дизайн
- **Responsive дизайн** - Адаптация под все устройства
- **Современная типографика** - Inter font family
- **Плавные анимации** - CSS transitions и hover эффекты
- **Темная/светлая тема** - Поддержка системных настроек
- **Accessibility** - WCAG 2.1 AA compliance

### 🔒 Безопасность
- **Security Headers** - XSS Protection, Content Type Options
- **HTTPS только** - Принудительное использование SSL
- **CSP Headers** - Content Security Policy
- **Safe defaults** - Безопасные настройки по умолчанию

### 📱 PWA Ready
- **Web Manifest** - Поддержка установки как приложение
- **Service Worker** - Кэширование и офлайн функциональность
- **App Icons** - Иконки для всех платформ

## 🛠️ Установка и запуск

### Требования
- Node.js 18+
- npm 8+

### Быстрый старт
```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

### Дополнительные команды
```bash
# Анализ сборки
npm run build:analyze

# Очистка и сборка
npm run build:clean

# Тест производительности
npm run test:performance
```

## 📁 Структура проекта

```
src/
├── pages/
│   ├── index.astro          # Главная страница
│   ├── articles/
│   │   └── [slug].astro     # Страница статьи
│   ├── sitemap.xml.ts       # Динамический sitemap
│   └── rss.xml.ts          # RSS feed
├── data/
│   └── site-data.json      # Данные сайта
└── assets/
    └── images/             # Статические изображения

public/
├── robots.txt             # SEO robots
├── site.webmanifest       # PWA manifest
├── favicon.ico           # Favicon
└── images/               # Публичные изображения
```

## ⚙️ Конфигурация

### Настройка сайта
Отредактируйте `src/data/site-data.json`:

```json
{
  "site": {
    "name": "Your Blog Name",
    "domain": "yourdomain.com",
    "description": "Your blog description",
    "keywords": ["keyword1", "keyword2"],
    "config": {
      "language": "en",
      "theme": "light"
    },
    "analytics": {
      "googleAnalytics": "GA_MEASUREMENT_ID"
    }
  }
}
```

### Настройка Astro
Основные настройки в `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
  output: 'static',
  experimental: {
    assets: true,
    viewTransitions: true,
  }
});
```

## 🎨 Кастомизация

### Цветовая схема
Измените CSS переменные в стилях:

```css
:root {
  --accent-color: #3b82f6;      /* Основной цвет */
  --accent-hover: #2563eb;      /* Цвет при наведении */
  --bg-primary: #f8fafc;        /* Фон страницы */
  --bg-secondary: #ffffff;      /* Фон карточек */
  --text-primary: #0f172a;      /* Основной текст */
  --text-secondary: #475569;    /* Вторичный текст */
}
```

### Шрифты
По умолчанию используется Inter. Для смены шрифта:

1. Измените Google Fonts URL в `<head>`
2. Обновите `font-family` в CSS

### Компоненты
Все компоненты находятся в `<style>` секциях страниц. Для переиспользования вынесите в отдельные файлы.

## 📊 SEO Checklist

- [x] Meta tags (title, description, keywords)
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Structured data (Schema.org)
- [x] Canonical URLs
- [x] Sitemap.xml
- [x] Robots.txt
- [x] RSS feed
- [x] Favicon и app icons
- [x] Web manifest
- [x] Semantic HTML
- [x] Alt text для изображений
- [x] Internal linking
- [x] Mobile-friendly
- [x] Fast loading

## 🚀 Развертывание

### Статический хостинг
```bash
npm run build
# Загрузите содержимое dist/ на ваш хостинг
```

### Netlify
```bash
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"
```

### Vercel
```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## 📈 Мониторинг

### Google Analytics
Добавьте GA ID в `site-data.json`:

```json
{
  "analytics": {
    "googleAnalytics": "G-XXXXXXXXXX"
  }
}
```

### Google Search Console
1. Добавьте сайт в GSC
2. Загрузите sitemap.xml
3. Настройте мониторинг

### Core Web Vitals
Используйте Lighthouse для мониторинга:
```bash
npm run test:performance
```

## 🔧 Troubleshooting

### Проблемы с изображениями
- Убедитесь, что изображения доступны по URL
- Проверьте CORS настройки
- Используйте относительные пути для локальных изображений

### SEO проблемы
- Проверьте meta tags в исходном коде
- Убедитесь, что sitemap.xml доступен
- Проверьте robots.txt

### Производительность
- Используйте `npm run build:analyze` для анализа
- Оптимизируйте изображения
- Минимизируйте CSS/JS

## 📝 Лицензия

MIT License - используйте свободно для коммерческих проектов.

## 🤝 Поддержка

Для вопросов и предложений создавайте Issues в репозитории.

---

**Версия**: 1.0.0  
**Последнее обновление**: 2024-01-22 