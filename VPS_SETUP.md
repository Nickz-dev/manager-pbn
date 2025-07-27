# Настройка VPS для PBN Manager

## Обзор

PBN Manager теперь поддерживает работу как на localhost, так и на VPS сервере. Система автоматически определяет окружение и использует соответствующие URL.

**Режим разработки**: Конфигурация настроена для режима разработки (development), что позволяет продолжать разработку как локально, так и на VPS до завершения MVP.

## Переменные окружения для VPS

### Обязательные переменные

```env
# VPS Configuration
VPS_ADDRESS=your-vps-ip-address-here

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_EMAIL=admin@pbn-manager.local
ADMIN_PASSWORD_HASH=your-password-hash-here

# Strapi Configuration
STRAPI_URL=http://your-vps-ip:1337
STRAPI_API_TOKEN=your-strapi-api-token-here

# Next.js Configuration
NODE_ENV=development
PORT=3000
```

### Дополнительные переменные (опционально)

```env
# Strapi Port (по умолчанию 1337)
STRAPI_PORT=1337

# Next.js Port (по умолчанию 3000)
PORT=3000
```

## Установка на VPS

### 1. Подготовка сервера

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Устанавливаем Git
sudo apt install git -y

# Устанавливаем PM2 для управления процессами
sudo npm install -g pm2
```

### 2. Клонирование проекта

```bash
# Клонируем проект
git clone https://github.com/your-username/pbn-manager.git
cd pbn-manager

# Устанавливаем зависимости
npm install
cd strapi && npm install && cd ..
```

### 3. Настройка переменных окружения

```bash
# Копируем пример файла окружения
cp env.example .env

# Редактируем .env файл
nano .env
```

Установите правильные значения:
- `VPS_ADDRESS` - IP адрес вашего VPS
- `JWT_SECRET` - сгенерируйте новый секрет
- `ADMIN_PASSWORD_HASH` - сгенерируйте хеш пароля
- `STRAPI_URL` - URL Strapi на VPS

### 4. Генерация новых секретов

```bash
# Генерируем новые секреты
node scripts/generate-password.js your-new-password
```

### 5. Настройка PM2

Создайте файл `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'pbn-manager',
      script: 'npm',
      args: 'run dev',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    },
    {
      name: 'strapi',
      script: 'npm',
      args: 'run develop',
      cwd: './strapi',
      env: {
        NODE_ENV: 'development',
        PORT: 1337
      }
    }
  ]
}
```

### 6. Запуск сервисов

```bash
# Запускаем сервисы через PM2
pm2 start ecosystem.config.js

# Сохраняем конфигурацию PM2
pm2 save

# Настраиваем автозапуск
pm2 startup
```

## Настройка Nginx (опционально)

### 1. Установка Nginx

```bash
sudo apt install nginx -y
```

### 2. Конфигурация для PBN Manager

Создайте файл `/etc/nginx/sites-available/pbn-manager`:

```nginx
server {
    listen 80;
    server_name your-vps-ip-or-domain.com;

    # Next.js приложение
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Strapi API
    location /api/ {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Активация конфигурации

```bash
# Создаем символическую ссылку
sudo ln -s /etc/nginx/sites-available/pbn-manager /etc/nginx/sites-enabled/

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

## Настройка файрвола

```bash
# Открываем необходимые порты
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS (если используете SSL)
sudo ufw allow 3000  # Next.js (если не используете Nginx)
sudo ufw allow 1337  # Strapi (если не используете Nginx)

# Включаем файрвол
sudo ufw enable
```

## Проверка работы

### 1. Проверка сервисов

```bash
# Проверяем статус PM2
pm2 status

# Проверяем логи
pm2 logs pbn-manager
pm2 logs strapi
```

### 2. Проверка доступности

```bash
# Проверяем Next.js
curl http://your-vps-ip:3000

# Проверяем Strapi
curl http://your-vps-ip:1337
```

### 3. Вход в систему

Откройте браузер и перейдите на `http://your-vps-ip:3000`

Используйте данные для входа:
- Email: `admin@pbn-manager.local`
- Пароль: `your-new-password`

## Управление сервисами

```bash
# Остановка всех сервисов
pm2 stop all

# Перезапуск всех сервисов
pm2 restart all

# Просмотр логов
pm2 logs

# Мониторинг ресурсов
pm2 monit
```

## Обновление приложения

```bash
# Останавливаем сервисы
pm2 stop all

# Обновляем код
git pull origin main

# Устанавливаем зависимости
npm install
cd strapi && npm install && cd ..

# Запускаем сервисы
pm2 start all
```

## Устранение неполадок

### 1. Проверка портов

```bash
# Проверяем, какие порты заняты
sudo netstat -tlnp

# Проверяем процессы на портах
sudo lsof -i :3000
sudo lsof -i :1337
```

### 2. Проверка логов

```bash
# Логи PM2
pm2 logs

# Логи Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Системные логи
sudo journalctl -u nginx
```

### 3. Проверка переменных окружения

```bash
# Проверяем переменные в PM2
pm2 env pbn-manager
pm2 env strapi
```

## Безопасность

1. **Измените пароли по умолчанию**
2. **Используйте HTTPS** (Let's Encrypt)
3. **Настройте файрвол**
4. **Регулярно обновляйте систему**
5. **Используйте сильные JWT секреты**
6. **Ограничьте доступ к портам**

## Переключение в Production режим

Когда MVP будет готов, переключитесь в production режим:

### 1. Обновите переменные окружения
```env
NODE_ENV=production
```

### 2. Обновите ecosystem.config.js
```javascript
// Для Next.js
args: 'start',  // вместо 'run dev'
NODE_ENV: 'production'

// Для Strapi  
args: 'start',  // вместо 'run develop'
NODE_ENV: 'production'
```

### 3. Перезапустите сервисы
```bash
pm2 restart all
```

## Мониторинг

```bash
# Установка мониторинга
pm2 install pm2-server-monit

# Просмотр статистики
pm2 monit
``` 