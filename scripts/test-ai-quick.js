#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('⚡ Quick AI Generation Test...');

const quickTest = {
  prompt: 'Создай краткий обзор топ-5 онлайн казино для новичков',
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 0.9,
  store_logs: true
};

async function runQuickTest() {
  console.log('📝 Тестовый промпт:', quickTest.prompt);
  console.log('⚙️  Параметры:', quickTest);
  
  try {
    const response = await fetch('http://localhost:3000/api/test-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quickTest),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Тест успешен!');
      console.log(`📊 Статистика:`);
      console.log(`   - Длина ответа: ${data.generatedText?.length || 0} символов`);
      console.log(`   - Использовано токенов: ${data.usage?.total_tokens || 0}`);
      console.log(`   - Модель: ${data.model}`);
      
      // Проверяем JSON парсинг
      try {
        let cleanText = data.generatedText.trim()
          .replace(/^```json\s*/, '')
          .replace(/```\s*$/, '');
        
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanText = jsonMatch[0];
        }
        
        const parsed = JSON.parse(cleanText);
        
        console.log('\n📋 Результат парсинга:');
        console.log(`   - Заголовок: ${parsed.title ? '✅' : '❌'}`);
        console.log(`   - Контент: ${parsed.content ? '✅' : '❌'}`);
        console.log(`   - Краткое описание: ${parsed.excerpt ? '✅' : '❌'}`);
        
        if (parsed.title) {
          console.log(`📝 Заголовок: "${parsed.title}"`);
        }
        
        if (parsed.content) {
          console.log(`📄 Контент: ${parsed.content.length} символов`);
          console.log(`   Превью: "${parsed.content.substring(0, 100)}..."`);
        }
        
        console.log('\n🎉 Все работает отлично!');
        
      } catch (parseError) {
        console.log('\n⚠️ JSON парсинг не удался');
        console.log(`   Ошибка: ${parseError.message}`);
        console.log(`   Превью ответа: ${data.generatedText?.substring(0, 200)}...`);
      }
      
    } else {
      console.log('\n❌ Тест не удался');
      console.log(`   Ошибка: ${data.error}`);
    }
  } catch (error) {
    console.log('\n❌ Ошибка сети');
    console.log(`   Ошибка: ${error.message}`);
  }
}

// Проверяем, запущен ли сервер
try {
  execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
  console.log('✅ Сервер запущен на localhost:3000');
  runQuickTest();
} catch (error) {
  console.log('❌ Сервер не запущен');
  console.log('Запустите сервер командой: npm run dev');
  process.exit(1);
}