# PBN Manager Template System

Комплексная система шаблонов для создания PBN сайтов и брендовых казино сайтов с поддержкой SSR и динамической загрузки компонентов.

## 🏗️ Архитектура

```
templates/
├── pbn/                    # PBN шаблоны (статические)
│   ├── blog/              # Блог шаблон
│   ├── news/              # Новостной шаблон
│   └── review/            # Обзорный шаблон
├── casino/                # Казино шаблоны (SSR)
│   ├── premium/           # Премиум казино
│   └── standard/          # Стандартное казино
├── brand/                 # Брендовые шаблоны
│   └── landing/           # Лендинг страницы
├── demo/                  # Демо компоненты
├── TemplateLoader.tsx     # Динамическая загрузка
└── README.md             # Документация
```

## 🎨 Доступные шаблоны

### PBN Шаблоны (Статические)

#### 1. Blog Template (`pbn-blog`)
- **Назначение**: Блог сайты для PBN сетей
- **Особенности**: 
  - Responsive дизайн
  - SEO оптимизация  
  - 4 цветовые темы (light, dark, blue, green)
  - Поддержка категорий и тегов
  - Встроенный newsletter signup

**Использование:**
```tsx
<TemplateLoader 
  siteData={{
    type: 'pbn-blog',
    domain: 'my-blog.com',
    siteName: 'My Awesome Blog',
    description: 'Best blog about technology',
    keywords: ['tech', 'programming'],
    theme: 'light'
  }}
  pageType="home"
/>
```

#### 2. News Template (`pbn-news`) 
- **Назначение**: Новостные сайты
- **Особенности**:
  - Breaking news бар
  - Категории новостей
  - Дата и время публикации
  - Social media интеграция
  - News Schema.org разметка

#### 3. Review Template (`pbn-review`)
- **Назначение**: Обзорные сайты
- **Особенности**:
  - Рейтинговая система
  - Сравнительные таблицы
  - Pros/Cons секции
  - Affiliate ссылки

### Casino Шаблоны (SSR)

#### 1. Premium Casino (`casino-premium`)
- **Назначение**: Премиум казино бренды
- **Особенности**:
  - Geo-location detection
  - Live chat widget
  - Бонусная система
  - VIP программа
  - Responsible gaming
  - SSL encryption badges

**Конфигурация:**
```tsx
const casinoData = {
  welcomeBonus: '200% up to $2000',
  freeSpins: 100,
  minDeposit: '$10',
  currency: 'USD',
  license: 'Malta Gaming Authority',
  rating: 4.9
}

const geoLocation = {
  country: 'United States',
  isRestricted: false,
  localCurrency: 'USD'
}
```

#### 2. Standard Casino (`casino-standard`)
- **Назначение**: Стандартные казино сайты
- **Особенности**:
  - Упрощенный дизайн
  - Основные игры
  - Базовые бонусы

## ⚙️ TemplateLoader

Центральный компонент для динамической загрузки шаблонов на основе данных из Strapi.

### Основные возможности:

1. **Lazy Loading** - Шаблоны загружаются по требованию
2. **Error Boundary** - Обработка ошибок загрузки
3. **SEO Injection** - Автоматическая вставка meta тегов
4. **Analytics** - Google Analytics интеграция
5. **Custom CSS** - Инъекция пользовательских стилей

### Типы данных:

```typescript
type TemplateType = 
  | 'pbn-blog'
  | 'pbn-news' 
  | 'pbn-review'
  | 'casino-premium'
  | 'casino-standard'
  | 'brand-landing'

type SiteData = {
  type: TemplateType
  domain: string
  siteName: string
  description: string
  keywords: string[]
  theme?: string
  content?: any
  settings?: {
    seo?: any
    analytics?: any
    customCss?: string
  }
}
```

## 🔧 Интеграция со Strapi

### API Endpoints:

```
GET /api/sites/:domain          # Получить данные сайта
GET /api/templates/:type        # Получить шаблон по типу
POST /api/sites                 # Создать новый сайт
PUT /api/sites/:id              # Обновить сайт
```

### Пример ответа Strapi:

```json
{
  "data": {
    "type": "pbn-blog",
    "domain": "tech-blog.com",
    "siteName": "Tech Blog",
    "description": "Latest tech news",
    "keywords": ["technology", "programming"],
    "theme": "dark",
    "content": {
      "featured": [...],
      "recent": [...],
      "categories": [...]
    },
    "settings": {
      "analytics": {
        "googleAnalytics": "GA_MEASUREMENT_ID"
      },
      "seo": {
        "customMeta": {...}
      }
    }
  }
}
```

## 🎯 SEO Оптимизация

### Встроенные SEO функции:

1. **Meta Tags**:
   - Title, description, keywords
   - Open Graph tags
   - Twitter Cards
   - Canonical URLs

2. **Schema.org Markup**:
   - WebSite schema для всех типов
   - NewsMediaOrganization для новостных сайтов
   - Organization schema для казино

3. **Performance**:
   - Lazy loading изображений
   - CSS минификация
   - Critical CSS inlining

### Пример Schema разметки:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://domain.com",
  "description": "Site description",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://domain.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## 🚀 Развертывание

### 1. Статические PBN сайты:
```bash
# Сборка статических файлов
npm run build:static

# Развертывание на CDN
npm run deploy:cdn
```

### 2. SSR Casino сайты:
```bash
# Сборка для SSR
npm run build:ssr

# Развертывание на сервер
npm run deploy:server
```

## 🔄 Кастомизация

### Создание нового шаблона:

1. **Создать папку шаблона:**
```
templates/custom/my-template/
├── layout.tsx
├── components/
├── pages/
└── styles/
```

2. **Добавить в TemplateLoader:**
```tsx
// В TemplateLoader.tsx
const MyCustomTemplate = lazy(() => import('./custom/my-template/layout'))

// В switch statement
case 'my-custom-template':
  return <MyCustomTemplate {...props} />
```

3. **Обновить типы:**
```typescript
type TemplateType = 
  | 'pbn-blog'
  | 'my-custom-template' // Добавить новый тип
```

### Кастомизация существующего шаблона:

```tsx
// Переопределение через props
<TemplateLoader 
  siteData={{
    ...defaultData,
    settings: {
      customCss: `
        .custom-header { background: #ff0000; }
        .custom-footer { color: #ffffff; }
      `
    }
  }}
/>
```

## 📱 Responsive Design

Все шаблоны используют mobile-first подход:

- **Breakpoints**:
  - `sm`: 640px+
  - `md`: 768px+  
  - `lg`: 1024px+
  - `xl`: 1280px+

- **Компоненты адаптируются**:
  - Навигация (hamburger menu на мобильных)
  - Сетки (grid → stack на мобильных)
  - Изображения (responsive images)
  - Типографика (fluid typography)

## 🔍 Тестирование

### Unit тесты:
```bash
npm run test:templates
```

### E2E тесты:
```bash
npm run test:e2e:templates
```

### Performance тесты:
```bash
npm run test:lighthouse
```

## 📊 Мониторинг

### Метрики производительности:
- Core Web Vitals
- Page Load Speed
- SEO Score
- Accessibility Score

### Analytics интеграция:
- Google Analytics 4
- Google Search Console
- Yandex Metrica

## 🛠️ Инструменты разработки

### Команды:
```bash
npm run dev:templates      # Разработка шаблонов
npm run preview:templates  # Предпросмотр шаблонов  
npm run build:templates    # Сборка шаблонов
npm run deploy:templates   # Развертывание шаблонов
```

### Полезные утилиты:
- `TemplatePreview` - Демо всех шаблонов
- `useSiteData` - Hook для получения данных
- `getTemplateComponent` - Утилита выбора шаблона

---

## 🤝 Вклад в развитие

1. Fork репозитория
2. Создайте feature branch
3. Добавьте тесты для новых шаблонов
4. Обновите документацию
5. Создайте Pull Request

---

**Версия**: 1.0.0  
**Последнее обновление**: 2024-01-22 