#!/usr/bin/env node

const bcrypt = require('bcryptjs')
const crypto = require('crypto')

/**
 * Generate Password Hash and JWT Secret for PBN Manager
 * Usage: node scripts/generate-password.js [password]
 */

function generateJWTSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex')
}

async function generatePasswordHash(password) {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

function generateRandomPassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

async function main() {
  const args = process.argv.slice(2)
  
  console.log('🔐 PBN Manager - Генератор паролей и секретов\n')

  // Generate JWT Secret
  const jwtSecret = generateJWTSecret()
  console.log('JWT_SECRET (добавьте в .env):')
  console.log(`JWT_SECRET=${jwtSecret}\n`)

  // Handle password
  let password
  if (args.length > 0) {
    password = args[0]
    console.log(`📝 Используется пароль: ${password}`)
  } else {
    password = generateRandomPassword()
    console.log(`🎲 Сгенерированный пароль: ${password}`)
  }

  // Generate password hash
  const passwordHash = await generatePasswordHash(password)
  console.log('\nADMIN_PASSWORD_HASH (добавьте в .env):')
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}\n`)

  // Admin email
  console.log('ADMIN_EMAIL (добавьте в .env):')
  console.log('ADMIN_EMAIL=admin@pbn-manager.local\n')

  console.log('📋 Полная конфигурация для .env:')
  console.log('=' * 50)
  console.log(`JWT_SECRET=${jwtSecret}`)
  console.log(`ADMIN_EMAIL=admin@pbn-manager.local`)
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`)
  console.log('=' * 50)

  console.log('\n✅ Готово! Скопируйте переменные в ваш .env файл')
  console.log(`🔑 Логин: admin@pbn-manager.local`)
  console.log(`🔑 Пароль: ${password}`)
}

// Handle CLI usage
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  generateJWTSecret,
  generatePasswordHash,
  generateRandomPassword
} 