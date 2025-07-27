#!/usr/bin/env node

const bcrypt = require('bcryptjs')

/**
 * Generate Password Hash and JWT Secret for PBN Manager
 * Usage: node scripts/generate-password.js [password]
 */

async function generateHash(password) {
  const saltRounds = 12
  const hash = await bcrypt.hash(password, saltRounds)
  return hash
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash)
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Использование:')
    console.log('  node generate-password.js <пароль>')
    console.log('  node generate-password.js <пароль> <хеш> - для проверки')
    console.log('')
    console.log('Примеры:')
    console.log('  node generate-password.js mypassword')
    console.log('  node generate-password.js mypassword $2a$12$...')
    process.exit(1)
  }

  const password = args[0]
  const hash = args[1]

  if (hash) {
    // Verify password
    const isValid = await verifyPassword(password, hash)
    console.log(`Проверка пароля: ${isValid ? '✅ ВЕРНО' : '❌ НЕВЕРНО'}`)
    return
  }

  // Generate hash
  const generatedHash = await generateHash(password)
  console.log('🔐 Сгенерированный хеш:')
  console.log(generatedHash)
  console.log('')
  console.log('📋 Для .env файла:')
  console.log(`ADMIN_PASSWORD_HASH=${generatedHash}`)
  console.log('')
  console.log('🔍 Для проверки:')
  console.log(`node generate-password.js "${password}" "${generatedHash}"`)
}

main().catch(console.error) 