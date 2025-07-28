const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Универсальное исправление всех проблем на VPS...\n');

// Шаги исправления
const steps = [
  {
    name: 'Проверка окружения',
    script: 'check-vps-frontend.js'
  },
  {
    name: 'Исправление настроек VPS',
    script: 'fix-vps-env.js'
  },
  {
    name: 'Исправление зависимостей превью',
    script: 'fix-preview-deps.js'
  }
];

async function runStep(step) {
  console.log(`\n🔧 Шаг: ${step.name}`);
  console.log(`📜 Скрипт: ${step.script}`);
  
  const scriptPath = path.join(__dirname, step.script);
  
  if (!fs.existsSync(scriptPath)) {
    console.log(`⚠️  Скрипт ${step.script} не найден, пропускаем`);
    return true;
  }
  
  return new Promise((resolve) => {
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${step.name} завершен успешно`);
        resolve(true);
      } else {
        console.log(`❌ ${step.name} завершен с ошибкой (код: ${code})`);
        resolve(false);
      }
    });
    
    child.on('error', (error) => {
      console.log(`❌ Ошибка запуска ${step.name}: ${error.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('📋 План исправления:');
  steps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step.name}`);
  });
  
  console.log('\n🚀 Начинаем исправление...\n');
  
  let successCount = 0;
  let totalSteps = steps.length;
  
  for (const step of steps) {
    const success = await runStep(step);
    if (success) successCount++;
    
    // Небольшая пауза между шагами
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 Результаты исправления:');
  console.log(`   ✅ Успешно: ${successCount}/${totalSteps}`);
  console.log(`   ❌ Ошибок: ${totalSteps - successCount}/${totalSteps}`);
  
  if (successCount === totalSteps) {
    console.log('\n🎉 Все проблемы исправлены!');
    console.log('\n🚀 Следующие шаги:');
    console.log('1. Перезапустите сервисы:');
    console.log('   node scripts/restart-vps.js');
    console.log('');
    console.log('2. Проверьте доступность:');
    console.log('   - Strapi: http://185.232.205.247:1337');
    console.log('   - Next.js: http://185.232.205.247:3000');
    console.log('   - Превью: http://185.232.205.247:4321');
    console.log('');
    console.log('3. Протестируйте функционал:');
    console.log('   - Создание сайта');
    console.log('   - Сборка сайта');
    console.log('   - Превью сайта');
    console.log('');
    console.log('4. Готово к продолжению разработки! 🚀');
  } else {
    console.log('\n⚠️  Некоторые проблемы не исправлены');
    console.log('💡 Проверьте логи выше и запустите проблемные скрипты отдельно');
  }
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 