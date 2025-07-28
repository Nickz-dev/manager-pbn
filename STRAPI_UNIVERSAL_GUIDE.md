# Strapi Universal Environment Guide

## 🎯 Цель
Универсальное решение для управления окружениями Strapi, Next.js, Builder и Preview на локальной машине и VPS.

## 📋 Текущие настройки

### Переменные окружения (.env)
```bash
# Переключение окружения
USE_LOCAL_STRAPI=false                    # true = локальный, false = VPS
NEXT_PUBLIC_USE_LOCAL_STRAPI=false       # для клиентской части
VPS_ADDRESS=185.232.205.247              # адрес VPS (без протокола)

# Порты
PORT=3000                                 # порт Next.js
STRAPI_PORT=1337                         # порт Strapi

# Авторизация
JWT_SECRET=ваш_jwt_секрет
STRAPI_TOKEN=ваш_полный_jwt_токен_здесь
```

## 🚀 Быстрое исправление всех проблем

### Универсальный скрипт (рекомендуется):
```bash
node scripts/fix-vps-all.js
```

### Пошаговое исправление:

**1. Проверка окружения:**
```bash
node scripts/check-vps-frontend.js
```

**2. Исправление настроек VPS:**
```bash
node scripts/fix-vps-env.js
```

**3. Исправление зависимостей превью:**
```bash
node scripts/fix-preview-deps.js
```

**4. Перезапуск сервисов:**
```bash
node scripts/restart-vps.js
```

## 🔧 Доступные скрипты

### Основные скрипты:
- `fix-vps-all.js` - универсальное исправление всех проблем
- `check-vps-frontend.js` - проверка настроек фронтенда
- `fix-vps-env.js` - исправление настроек окружения
- `fix-preview-deps.js` - исправление зависимостей превью
- `restart-vps.js` - перезапуск сервисов

### Утилиты:
- `check-environment.js` - проверка текущего окружения
- `switch-strapi-env.js` - переключение между локальным и VPS
- `generate-strapi-keys.js` - генерация ключей для Strapi
- `test-strapi-connection.js` - тест подключения к Strapi

### Сборка и данные:
- `build-astro.js` - сборка Astro сайтов
- `generate-astro-data.js` - генерация данных для Astro
- `export-strapi-data.js` - экспорт данных Strapi
- `import-strapi-data.js` - импорт данных Strapi
- `deploy-to-vps.js` - деплой на VPS

## 🌐 URL компонентов

### Локальное окружение:
- **Strapi:** http://localhost:1337
- **Next.js:** http://localhost:3000
- **Preview:** http://localhost:4321
- **Strapi Admin:** http://localhost:1337/admin

### VPS окружение:
- **Strapi:** http://185.232.205.247:1337
- **Next.js:** http://185.232.205.247:3000
- **Preview:** http://185.232.205.247:4321
- **Strapi Admin:** http://185.232.205.247:1337/admin

## 🔄 Рабочий процесс

### Для локальной разработки:
1. Установите `USE_LOCAL_STRAPI=true`
2. Запустите локальный Strapi: `cd strapi && npm run develop`
3. Запустите Next.js: `npm run dev`

### Для VPS:
1. Запустите `node scripts/fix-vps-all.js`
2. Перезапустите сервисы: `node scripts/restart-vps.js`
3. Проверьте доступность всех компонентов

### Переключение окружения:
```bash
node scripts/switch-strapi-env.js
```

## 📊 Шаблоны

Поддерживаемые шаблоны:
- `astro-pbn-blog` - PBN блог
- `astro-gaming-news` - игровые новости
- `astro-poker-platform` - покер платформа
- `astro-slots-review` - обзоры слотов
- `astro-sports-betting` - спортивные ставки
- `casino-standard` - стандартное казино

## ✅ Проверка работоспособности

### После исправления проверьте:
1. **Strapi Status** - компонент на странице показывает правильное окружение
2. **Создание сайта** - работает без ошибок
3. **Сборка сайта** - пайплайн работает корректно
4. **Превью сайта** - доступен на порту 4321
5. **API запросы** - все эндпоинты отвечают

### Команды для проверки:
```bash
# Проверка окружения
node scripts/check-environment.js

# Тест подключения к Strapi
node scripts/test-strapi-connection.js

# Проверка фронтенда
node scripts/check-vps-frontend.js
```

## 🚨 Устранение проблем

### Проблема: "Invalid URL"
- Проверьте `VPS_ADDRESS` в `.env`
- Убедитесь, что протокол добавляется автоматически

### Проблема: "Cannot find module @rollup/rollup-x64-gnu"
- Запустите `node scripts/fix-preview-deps.js`
- Перезапустите превью сервер

### Проблема: "Build error"
- Запустите `node scripts/fix-vps-all.js`
- Проверьте зависимости всех шаблонов

### Проблема: "401 Unauthorized"
- Проверьте `STRAPI_TOKEN` в `.env`
- Убедитесь, что токен полный и не обрезан

## 🎉 Готово к разработке!

После выполнения всех шагов система готова к продолжению разработки с полной поддержкой локального и VPS окружений. 