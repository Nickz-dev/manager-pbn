#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const modes = {
  local: {
    name: 'Локальная разработка (полная)',
    file: 'env.example',
    description: 'Strapi + Next.js локально'
  },
  vps: {
    name: 'Разработка с VPS Strapi',
    file: 'env.local.example', 
    description: 'Только Next.js локально, Strapi на VPS'
  }
}

function showHelp() {
  console.log('🔄 PBN Manager - Переключение режимов разработки\n')
  console.log('Доступные режимы:')
  
  Object.entries(modes).forEach(([key, mode]) => {
    console.log(`  ${key}: ${mode.name}`)
    console.log(`     ${mode.description}`)
  })
  
  console.log('\nИспользование:')
  console.log('  node scripts/switch-mode.js <режим>')
  console.log('  node scripts/switch-mode.js local')
  console.log('  node scripts/switch-mode.js vps')
}

function switchMode(modeKey) {
  if (!modes[modeKey]) {
    console.error(`❌ Неизвестный режим: ${modeKey}`)
    showHelp()
    process.exit(1)
  }

  const mode = modes[modeKey]
  const sourceFile = path.join(process.cwd(), mode.file)
  const targetFile = path.join(process.cwd(), '.env')

  try {
    // Проверяем существование исходного файла
    if (!fs.existsSync(sourceFile)) {
      console.error(`❌ Файл ${mode.file} не найден`)
      process.exit(1)
    }

    // Копируем файл
    fs.copyFileSync(sourceFile, targetFile)
    
    console.log(`✅ Переключен в режим: ${mode.name}`)
    console.log(`📝 Файл .env обновлен из ${mode.file}`)
    console.log(`💡 ${mode.description}`)
    
    if (modeKey === 'vps') {
      console.log('\n🔧 Не забудьте:')
      console.log('1. Указать IP вашего VPS в .env')
      console.log('2. Получить API токен из Strapi админки')
      console.log('3. Запустить: npm run dev')
    } else {
      console.log('\n🔧 Не забудьте:')
      console.log('1. Запустить Strapi: cd strapi && npm run develop')
      console.log('2. Запустить Next.js: npm run dev')
    }
    
  } catch (error) {
    console.error(`❌ Ошибка при переключении режима:`, error.message)
    process.exit(1)
  }
}

// Обработка аргументов командной строки
const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp()
} else {
  const mode = args[0]
  switchMode(mode)
} 