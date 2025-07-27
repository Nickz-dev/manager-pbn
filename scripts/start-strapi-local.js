#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 Запуск Strapi локально...')

// Устанавливаем переменные окружения для локального запуска
const env = {
  ...process.env,
  NODE_ENV: 'development',
  DATABASE_CLIENT: 'sqlite',
  DATABASE_FILENAME: '.tmp/data.db',
  HOST: '0.0.0.0',
  PORT: '1337',
  STRAPI_TELEMETRY_DISABLED: 'true'
}

// Генерируем простые ключи для локальной разработки
const crypto = require('crypto')
env.APP_KEYS = [
  crypto.randomBytes(32).toString('base64'),
  crypto.randomBytes(32).toString('base64'),
  crypto.randomBytes(32).toString('base64'),
  crypto.randomBytes(32).toString('base64')
].join(',')

env.ADMIN_JWT_SECRET = crypto.randomBytes(32).toString('base64')
env.API_TOKEN_SALT = crypto.randomBytes(16).toString('base64')
env.TRANSFER_TOKEN_SALT = crypto.randomBytes(16).toString('base64')

console.log('📝 Переменные окружения установлены')
console.log('🔧 Запуск Strapi в режиме разработки...')

// Запускаем Strapi
const strapiProcess = spawn('npm', ['run', 'develop'], {
  cwd: path.join(__dirname, '..', 'strapi'),
  env,
  stdio: 'inherit'
})

strapiProcess.on('error', (error) => {
  console.error('❌ Ошибка запуска Strapi:', error)
  process.exit(1)
})

strapiProcess.on('close', (code) => {
  console.log(`🔄 Strapi завершен с кодом: ${code}`)
  process.exit(code)
})

// Обработка Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка Strapi...')
  strapiProcess.kill('SIGINT')
}) 