# Шаблоны PBN Manager

## 📋 Актуализированная структура шаблонов

### 🎯 Соответствие с `app/sites/new/page.tsx`

| Шаблон в UI | Директория | Тип | Описание |
|-------------|------------|-----|----------|
| `casino-blog` | `astro-casino-blog/` | Astro | Классический блог для казино |
| `slots-review` | `astro-slots-review/` | Astro | Обзоры игровых автоматов |
| `gaming-news` | `astro-gaming-news/` | Astro | Новости азартных игр |
| `sports-betting` | `astro-sports-betting/` | Astro | Ставки на спорт |
| `poker-platform` | `astro-poker-platform/` | Astro | Платформа для покера |
| `premium-casino` | `casino/premium/` | Next.js | Премиум тема для казино |

### 🗂️ Структура директорий

```
templates/
├── astro-casino-blog/          # casino-blog
├── astro-slots-review/          # slots-review
├── astro-gaming-news/           # gaming-news
├── astro-sports-betting/        # sports-betting
├── astro-poker-platform/        # poker-platform
└── casino/
    └── premium/                 # premium-casino (Next.js)
```

## 🚀 Возможности шаблонов

### Astro Шаблоны
- ✅ Быстрая загрузка
- ✅ Автоматическая сборка
- ✅ **Страницы категорий** - `/categories/[slug]`
- ✅ **Структурированные данные** - Schema.org разметка
- ✅ **Open Graph** - мета-теги для соцсетей

#### Next.js Шаблоны  
- ✅ Серверный рендеринг
- ✅ Оптимизация производительности
- ✅ API роуты
- ✅ Динамические страницы

## 🔧 Скрипты для работы с шаблонами

### 📦 Основные скрипты

```bash
# Тест всех шаблонов
node scripts/test-build-fix.js

# Создание страниц категорий
node scripts/create-category-pages.js

# Исправление зависимостей превью
node scripts/fix-preview-deps-enhanced.js

# Диагностика VPS
node scripts/diagnose-vps-issues.js

# Исправление всех проблем VPS
node scripts/fix-vps-all-enhanced.js

# Синхронизация с VPS
node scripts/sync-templates-to-vps.js
```

### 🎯 Специализированные скрипты

```bash
# Проверка окружения
node scripts/check-environment.js

# Проверка файлов
node scripts/check-files.js

# Проверка фронтенда VPS
node scripts/check-vps-frontend.js

# Экспорт данных Strapi
node scripts/export-strapi-data.js

# Деплой на VPS
node scripts/deploy-to-vps.js
```

## ✅ Исправленные проблемы

#### 1. Битые ссылки на категории
**Проблема:** В футере и Popular Categories были ссылки `/categories/[slug]`, но страницы не создавались.

**Решение:** 
- ✅ Созданы страницы категорий `src/pages/categories/[slug].astro` во всех Astro шаблонах
- ✅ Добавлена динамическая генерация путей через `getStaticPaths()`
- ✅ Реализована фильтрация статей по категориям
- ✅ Добавлена навигация между категориями

#### 2. Структура страниц категорий
- **URL:** `/categories/[slug]`
- **SEO:** Полная SEO оптимизация с мета-тегами
- **Структурированные данные:** Schema.org разметка для поисковиков
- **Open Graph:** Мета-теги для соцсетей
- **Адаптивность:** Полностью адаптивный дизайн
- **Навигация:** Ссылки на другие категории

#### 3. Автоматизация
- ✅ Скрипт `scripts/create-category-pages.js` для массового создания страниц
- ✅ Единый шаблон для всех Astro шаблонов
- ✅ Автоматическая генерация путей на основе данных из Strapi

#### 4. Актуализация шаблонов
- ✅ Удален лишний шаблон `casino-standard`
- ✅ Переименован `astro-pbn-blog` в `astro-casino-blog`
- ✅ Обновлен маппинг в `scripts/build-astro.js`
- ✅ Синхронизация с VPS через `scripts/sync-templates-to-vps.js`

## 🔄 Рабочий процесс

### 1. Локальная разработка
```bash
# Тестирование сборки
node scripts/test-build-fix.js

# Создание страниц категорий
node scripts/create-category-pages.js

# Исправление зависимостей
node scripts/fix-preview-deps-enhanced.js
```

### 2. Деплой на VPS
```bash
# Синхронизация шаблонов
node scripts/sync-templates-to-vps.js

# Диагностика проблем
node scripts/diagnose-vps-issues.js

# Исправление всех проблем
node scripts/fix-vps-all-enhanced.js
```

### 3. Мониторинг
```bash
# Проверка окружения
node scripts/check-environment.js

# Проверка фронтенда VPS
node scripts/check-vps-frontend.js
```

## 📊 Статистика

- **Всего шаблонов:** 6 (5 Astro + 1 Next.js)
- **Страниц категорий:** Автоматически создаются для всех Astro шаблонов
- **SEO оптимизация:** Полная для всех страниц
- **Адаптивность:** 100% для всех шаблонов

## 🎯 Следующие шаги

1. **Протестировать все шаблоны** - убедиться, что сборка работает везде
2. **Унифицировать дизайн** - привести стили к единому стандарту
3. **Добавить функциональность** - поиск, пагинация, сортировка
4. **Оптимизировать производительность** - кэширование, lazy loading
5. **Расширить SEO** - дополнительные мета-теги, sitemap