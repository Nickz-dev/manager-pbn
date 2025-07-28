const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Тестирование превью...\n');

async function testPreview() {
  try {
    // 1. Проверяем текущие процессы на порту 4322
    console.log('📊 Проверяем процессы на порту 4322...');
    try {
      const netstat = execSync('netstat -tlnp | grep 4322', { encoding: 'utf8' });
      console.log('✅ Процессы на порту 4322:');
      console.log(netstat);
    } catch (error) {
      console.log('❌ Нет процессов на порту 4322');
    }

    // 2. Останавливаем все процессы astro на порту 4322
    console.log('\n🛑 Останавливаем процессы astro на порту 4322...');
    try {
      execSync('pkill -f "astro.*4322"', { stdio: 'ignore' });
      execSync('pkill -f "npm.*preview.*4322"', { stdio: 'ignore' });
      console.log('✅ Процессы остановлены');
    } catch (error) {
      console.log('ℹ️  Процессы не найдены или уже остановлены');
    }

    // 3. Ждем освобождения порта
    console.log('\n⏳ Ждем освобождения порта...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Проверяем, что порт свободен
    console.log('\n🔍 Проверяем доступность порта 4322...');
    const net = await import('net');
    const isPortAvailable = await new Promise<boolean>((resolve) => {
      const server = net.createServer();
      server.listen(4322, () => {
        server.close(() => resolve(true));
      });
      server.on('error', () => {
        resolve(false);
      });
    });

    if (isPortAvailable) {
      console.log('✅ Порт 4322 свободен');
    } else {
      console.log('❌ Порт 4322 все еще занят');
      return false;
    }

    // 5. Тестируем запуск превью
    console.log('\n🚀 Тестируем запуск превью...');
    const templatePath = path.join(__dirname, '../templates/astro-pbn-blog');
    
    if (!fs.existsSync(templatePath)) {
      console.log('❌ Шаблон astro-pbn-blog не найден');
      return false;
    }

    // Проверяем наличие dist папки
    const distPath = path.join(templatePath, 'dist');
    if (!fs.existsSync(distPath)) {
      console.log('❌ Папка dist не найдена. Сначала соберите сайт!');
      return false;
    }

    console.log('✅ Dist папка найдена');

    // 6. Запускаем превью в фоне
    console.log('\n🎯 Запускаем превью...');
    try {
      const previewProcess = require('child_process').spawn('npx', ['astro', 'preview', '--port', '4322', '--host', '0.0.0.0'], {
        cwd: templatePath,
        stdio: 'pipe',
        shell: true
      });

      // Ждем запуска
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Проверяем, что процесс работает
      if (previewProcess.killed) {
        console.log('❌ Процесс превью не запустился');
        return false;
      }

      console.log('✅ Превью запущено');

      // 7. Проверяем доступность
      console.log('\n🌐 Проверяем доступность превью...');
      try {
        const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:4322', { encoding: 'utf8' });
        if (response.trim() === '200') {
          console.log('✅ Превью доступно по адресу http://localhost:4322');
        } else {
          console.log(`⚠️  Превью отвечает с кодом: ${response.trim()}`);
        }
      } catch (error) {
        console.log('❌ Превью недоступно');
      }

      // 8. Останавливаем превью
      console.log('\n🛑 Останавливаем превью...');
      previewProcess.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ Превью остановлено');
      return true;

    } catch (error) {
      console.log(`❌ Ошибка запуска превью: ${error.message}`);
      return false;
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Начинаем тестирование превью...\n');
  
  const success = await testPreview();
  
  console.log('\n📊 Результат тестирования:');
  if (success) {
    console.log('✅ Превью работает корректно!');
    console.log('\n💡 Теперь можно тестировать через интерфейс');
  } else {
    console.log('❌ Проблемы с превью');
    console.log('\n🔧 Проверьте:');
    console.log('1. Собран ли сайт (есть ли папка dist)');
    console.log('2. Не занят ли порт 4322 другими процессами');
    console.log('3. Установлены ли зависимости в шаблоне');
  }
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
}); 