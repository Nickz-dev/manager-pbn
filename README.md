# PBN Manager

Система управления сетью сайтов (Private Blog Network) с автоматической генерацией контента и развертыванием.

## 🚀 Возможности

- **Управление сайтами**: Создание, редактирование и удаление PBN сайтов
- **Генерация контента**: Автоматическая сборка статических сайтов на Astro
- **Управление контентом**: Статьи, категории, авторы через Strapi CMS
- **Preview режим**: Предварительный просмотр сайтов перед публикацией
- **Инфраструктура**: Управление доменами и VPS серверами
- **Авторизация**: Безопасная система входа с JWT токенами
- **VPS поддержка**: Работа как на localhost, так и на VPS серверах

## 🛠 Технологии

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Strapi CMS, Node.js
- **Static Sites**: Astro
- **Database**: SQLite (Strapi)
- **Authentication**: JWT, bcrypt
- **Deployment**: PM2, Nginx

## 📦 Установка

### Локальная разработка

#### Вариант 1: Полная локальная разработка

1. **Клонирование репозитория**
```bash
git clone https://github.com/your-username/pbn-manager.git
cd pbn-manager
```

2. **Установка зависимостей**
```bash
npm install
cd strapi && npm install && cd ..
```

3. **Настройка переменных окружения**
```bash
cp env.example .env
# Отредактируйте .env файл
```

4. **Запуск серверов**
```bash
# Терминал 1 - Strapi
cd strapi && npm run develop

# Терминал 2 - Next.js
npm run dev
```

#### Вариант 2: Только клиент (рекомендуется)

Для разработки с актуальными данными из VPS:

1. **Настройка локального окружения**
```bash
cp env.local.example .env
# Укажите IP вашего VPS в .env
```

2. **Запуск только клиента**
```bash
npm run dev
```

Подробная инструкция: [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

### Развертывание на VPS

Подробная инструкция по развертыванию на VPS: [VPS_SETUP.md](./VPS_SETUP.md)

## 🔐 Авторизация

Настройка авторизации: [AUTH_SETUP.md](./AUTH_SETUP.md)

**Данные для входа по умолчанию:**
- Email: `admin@pbn-manager.local`


## 📁 Структура проекта

```
pbn-manager/
├── app/                    # Next.js приложение
│   ├── api/               # API маршруты
│   ├── sites/             # Управление сайтами
│   ├── infrastructure/    # Домены и VPS
│   └── login/             # Страница входа
├── components/            # React компоненты
├── lib/                   # Утилиты и клиенты
├── scripts/               # Скрипты для генерации
├── templates/             # Astro шаблоны
├── strapi/                # Strapi CMS
└── types/                 # TypeScript типы
```

## 🔧 Конфигурация

### Переменные окружения

```env
# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_EMAIL=admin@pbn-manager.local
ADMIN_PASSWORD_HASH=your-password-hash

# VPS Configuration (для VPS)
VPS_ADDRESS=your-vps-ip-address

# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-token

# Next.js Configuration
NODE_ENV=development
PORT=3000
```

### Генерация секретов

```bash
node scripts/generate-password.js [новый_пароль]
```

## 📋 Использование

### 1. Создание сайта

1. Перейдите в раздел "Сайты" → "Новый сайт"
2. Заполните информацию о сайте
3. Выберите шаблон и статьи
4. Нажмите "Создать"

### 2. Генерация сайта

1. Перейдите в раздел "Генерация"
2. Выберите сайт для сборки
3. Нажмите "Начать сборку"
4. Дождитесь завершения процесса

### 3. Preview сайта

1. После сборки нажмите "Запустить Preview"
2. Сайт откроется в новой вкладке
3. Preview автоматически остановится через 1 минуту

### 4. Скачивание сайта

1. В списке сайтов нажмите "Скачать ZIP"
2. Получите архив с готовым сайтом

## 🎨 Шаблоны

Система поддерживает различные Astro шаблоны:

- **casino-blog**: Блог казино
- **slots-review**: Обзоры слотов
- **gaming-news**: Игровые новости
- **sports-betting**: Спортивные ставки
- **poker-platform**: Покер платформа
- **casino-premium**: Премиум казино

## 🔄 API Endpoints

### Сайты
- `GET /api/sites` - Список сайтов
- `POST /api/sites` - Создание сайта
- `PUT /api/sites/[id]` - Обновление сайта
- `DELETE /api/sites/[id]` - Удаление сайта

### Сборка
- `POST /api/sites/build` - Сборка сайта
- `GET /api/sites/[id]/download` - Скачивание сайта
- `POST /api/sites/[id]/preview` - Запуск preview
- `DELETE /api/sites/[id]/preview` - Остановка preview

### Контент
- `GET /api/content/articles` - Статьи
- `GET /api/content/categories` - Категории
- `GET /api/content/authors` - Авторы

## 🚀 Развертывание

### Локальное развертывание

```bash
# Сборка Next.js
npm run build

# Сборка Strapi
cd strapi && npm run build && cd ..

# Запуск в production
npm start
```

### VPS развертывание

```bash
# Использование PM2
pm2 start ecosystem.config.js

# Или с Nginx
sudo systemctl start nginx
```

## 🐛 Устранение неполадок

### Проблемы с авторизацией
1. Проверьте переменные окружения в `.env`
2. Убедитесь, что JWT_SECRET установлен
3. Проверьте хеш пароля

### Проблемы со сборкой
1. Проверьте, что Strapi запущен
2. Убедитесь, что статьи привязаны к сайту
3. Проверьте логи в консоли

### Проблемы с VPS
1. Проверьте файрвол
2. Убедитесь, что порты открыты
3. Проверьте логи PM2

## 📚 Документация

- [Настройка авторизации](./AUTH_SETUP.md)
- [Развертывание на VPS](./VPS_SETUP.md)
- [Система сборки](./BUILD_SYSTEM_README.md)
- [Схема отношений Strapi](./STRAPI_RELATIONS_SCHEMA.md)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте Issue в репозитории. 