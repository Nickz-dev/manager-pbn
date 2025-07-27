# Настройка авторизации PBN Manager

## Шаг 1: Создание .env файла

Скопируйте содержимое файла `env.example` в новый файл `.env` в корне проекта:

```bash
cp env.example .env
```

## Шаг 2: Проверка переменных окружения

Убедитесь, что в файле `.env` есть следующие переменные:

```env
# JWT Configuration
JWT_SECRET=dfbc9cb4e19421aa1753e820847a23e0019aab1d621a3fbdef17a3f3911921f4746f60c8c6606fa77591356d79554dd214ebc686f7ef0a7d73c1ce2873c7aa22
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_EMAIL=admin@pbn-manager.local
ADMIN_PASSWORD_HASH=$2a$12$XqiGaeuHE.DRET0ZIEVdh.LCY3Yr4e4G/n5Jrhw3F1IdhCNRt0QOi

# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token-here

# Next.js Configuration
NODE_ENV=development
```

## Шаг 3: Данные для входа

После настройки `.env` файла используйте следующие данные для входа:

- **Email**: `admin@pbn-manager.local`
- **Пароль**: `admin123`

## Шаг 4: Генерация новых данных (опционально)

Если вы хотите изменить пароль или сгенерировать новые секреты, используйте скрипт:

```bash
node scripts/generate-password.js [новый_пароль]
```

## Шаг 5: Перезапуск серверов

После создания `.env` файла перезапустите серверы:

```bash
# Остановите текущие серверы (Ctrl+C)
# Затем запустите заново:

# Терминал 1 - Strapi
cd strapi && npm run develop

# Терминал 2 - Next.js
npm run dev
```

## Проверка работы

1. Откройте http://localhost:3000
2. Вы должны быть перенаправлены на страницу входа
3. Введите данные для входа
4. После успешного входа вы попадете на главную страницу

## Безопасность

- JWT_SECRET должен быть не менее 32 символов
- Пароль хешируется с использованием bcrypt (12 раундов соли)
- Токены хранятся в HTTP-only cookies
- Middleware защищает все маршруты кроме `/login` и `/api/auth/login` 