const crypto = require('crypto')

function generateJWTSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex')
}

function main() {
  const jwtSecret = generateJWTSecret()
  
  console.log('🔐 Сгенерированный JWT_SECRET:')
  console.log(jwtSecret)
  console.log('')
  console.log('📋 Для .env файла:')
  console.log(`JWT_SECRET=${jwtSecret}`)
  console.log('')
  console.log('✅ Готово! Скопируйте в ваш .env файл')
}

main() 