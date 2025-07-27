# Настройка Nginx для PBN Manager

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

**Замените `YOUR_VPS_IP` на ваш IP адрес:**

```nginx
server_name 185.232.205.247;  # Ваш IP
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

## Автоматический перезапуск

Добавьте в crontab для автоматического перезапуска PM2:

```bash
# Откройте crontab
crontab -e

# Добавьте строку для перезапуска PM2 при перезагрузке
@reboot pm2 resurrect
``` 