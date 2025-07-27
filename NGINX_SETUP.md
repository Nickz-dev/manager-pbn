# Настройка Nginx для PBN Manager

## Установка Node.js и npm

### 1. Установка Node.js (актуальная LTS версия)

```bash
# Ubuntu/Debian - установка актуальной LTS версии
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL - установка актуальной LTS версии
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs

# Альтернативный способ через NodeSource (для Ubuntu/Debian)
# curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# sudo apt-get install -y nodejs

# Проверка версий
node --version
npm --version

# Обновление npm до последней версии
sudo npm install -g npm@latest
```

### 2. Установка PM2

```bash
# Глобальная установка PM2
sudo npm install -g pm2

# Проверка установки
pm2 --version
```

### 3. Установка дополнительных инструментов

```bash
# Установка Git (если не установлен)
sudo apt update && sudo apt install git -y

# Установка build-essential для компиляции
sudo apt install build-essential -y
```

## Установка Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
# или
sudo dnf install nginx
```

## Настройка конфигурации

### 1. Копирование конфига

```bash
# Скопируйте конфиг в папку sites-available
sudo cp nginx-pbn-manager.conf /etc/nginx/sites-available/pbn-manager

# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/pbn-manager /etc/nginx/sites-enabled/

# Удалите дефолтный конфиг (опционально)
sudo rm /etc/nginx/sites-enabled/default
```

### 2. Редактирование конфига

```bash
sudo nano /etc/nginx/sites-available/pbn-manager
```

**Замените IP адреса на ваш:**

```nginx
server_name 185.232.205.247;  # Ваш IP
server_name strapi.185.232.205.247;  # Strapi IP
```

**Или используйте упрощенную версию:**

```bash
# Скопируйте упрощенный конфиг
sudo cp nginx-pbn-manager-simple.conf /etc/nginx/sites-available/pbn-manager
```

### 3. Проверка конфигурации

```bash
sudo nginx -t
```

### 4. Перезапуск Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Развертывание PBN Manager

### 1. Клонирование репозитория

```bash
# Создайте папку для проекта
mkdir -p /var/www/pbn-manager
cd /var/www/pbn-manager

# Клонируйте репозиторий
git clone https://github.com/your-username/pbn-manager.git .

# Установите зависимости
npm install
cd strapi && npm install && cd ..
```

### 2. Настройка переменных окружения

```bash
# Создайте .env файл
cp env.example .env

# Отредактируйте .env файл
nano .env
```

**Обязательные переменные для VPS:**
```env
VPS_ADDRESS=185.232.205.247
NODE_ENV=development
JWT_SECRET=your-jwt-secret
ADMIN_PASSWORD_HASH=your-password-hash
```

### 3. Запуск с PM2

```bash
# Запустите приложения через PM2
pm2 start ecosystem.config.js

# Сохраните конфигурацию PM2
pm2 save

# Настройте автозапуск
pm2 startup
```

### 4. Проверка статуса

```bash
# Проверьте статус приложений



# Проверьте логи
pm2 logs pbn-manager
pm2 logs strapi
```

## Настройка файрвола

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

## Проверка работы

### 1. Проверка портов

```bash
# Проверьте, что порты открыты
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :1337
```

### 2. Проверка сервисов

```bash
# Проверьте статус PM2
pm2 status

# Проверьте логи
pm2 logs pbn-manager
pm2 logs strapi
```

### 3. Тестирование доступа

```bash
# PBN Manager
curl http://185.232.205.247

# Strapi CMS
curl http://185.232.205.247:1337
```

## Структура доступа

### Вариант 1: Отдельные домены (рекомендуется)

- **PBN Manager**: `http://185.232.205.247`
- **Strapi CMS**: `http://185.232.205.247:1337`

### Вариант 2: Один домен с путями

- **PBN Manager**: `http://185.232.205.247`
- **Strapi CMS**: `http://185.232.205.247/strapi`

## Логи и мониторинг

### Просмотр логов

```bash
# Nginx логи
sudo tail -f /var/log/nginx/pbn-manager.access.log
sudo tail -f /var/log/nginx/pbn-manager.error.log
sudo tail -f /var/log/nginx/strapi.access.log
sudo tail -f /var/log/nginx/strapi.error.log

# PM2 логи
pm2 logs pbn-manager --lines 100
pm2 logs strapi --lines 100
```

### Мониторинг ресурсов

```bash
# Статус PM2
pm2 monit

# Системные ресурсы
htop
```

## Устранение неполадок

### 1. Nginx не запускается

```bash
# Проверьте синтаксис
sudo nginx -t

# Проверьте логи
sudo journalctl -u nginx -f
```

### 2. Приложение недоступно

```bash
# Проверьте PM2 статус
pm2 status

# Перезапустите приложения
pm2 restart all

# Проверьте порты
sudo lsof -i :3000
sudo lsof -i :1337
```

### 3. Проблемы с правами доступа

```bash
# Проверьте права на логи
sudo chown -R www-data:www-data /var/log/nginx
sudo chmod 755 /var/log/nginx
```

## SSL/HTTPS (опционально)

Для продакшена рекомендуется настроить SSL:

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com
```

## Полная последовательность установки

### Быстрая установка (все команды подряд)

```bash
# 1. Обновление системы
sudo apt update && sudo apt upgrade -y

# 2. Установка Node.js (актуальная LTS версия)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g npm@latest

# 3. Установка PM2
sudo npm install -g pm2

# 4. Установка дополнительных пакетов
sudo apt install git build-essential nginx -y

# 5. Клонирование проекта
mkdir -p /var/www/pbn-manager
cd /var/www/pbn-manager
git clone https://github.com/your-username/pbn-manager.git .

# 6. Установка зависимостей
npm install
cd strapi && npm install && cd ..

# 7. Настройка .env
cp env.example .env
# Отредактируйте .env файл с вашими настройками

# 8. Настройка Nginx
sudo cp nginx-pbn-manager.conf /etc/nginx/sites-available/pbn-manager
sudo ln -s /etc/nginx/sites-available/pbn-manager /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 9. Настройка файрвола
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# 10. Запуск приложений
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 11. Проверка
pm2 status
curl http://185.232.205.247
```

## Автоматический перезапуск

Добавьте в crontab для автоматического перезапуска PM2:

```bash
# Откройте crontab
crontab -e

# Добавьте строку для перезапуска PM2 при перезагрузке
@reboot pm2 resurrect
``` 