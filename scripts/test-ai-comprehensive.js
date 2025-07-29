#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🧪 Comprehensive AI Generation Testing...');

// Тестовые сценарии с разными параметрами
const testScenarios = [
  {
    name: 'Консервативная генерация (низкая креативность)',
    params: {
      prompt: 'Создай краткий обзор лучших онлайн казино для новичков',
      temperature: 0.3,
      max_tokens: 2000,
      top_p: 0.8,
      store_logs: true
    },
    expected: 'JSON с title, excerpt, content'
  },
  {
    name: 'Креативная генерация (высокая креативность)',
    params: {
      prompt: 'Напиши захватывающий обзор новых слот-игр с необычными механиками',
      temperature: 1.2,
      max_tokens: 3000,
      top_p: 0.95,
      store_logs: true
    },
    expected: 'JSON с title, excerpt, content'
  },
  {
    name: 'Длинная статья (большое количество токенов)',
    params: {
      prompt: 'Создай подробное руководство по спортивным ставкам для начинающих игроков',
      temperature: 0.7,
      max_tokens: 6000,
      top_p: 0.9,
      store_logs: true
    },
    expected: 'JSON с title, excerpt, content'
  },
  {
    name: 'Фокусная генерация (низкий top_p)',
    params: {
      prompt: 'Напиши технический обзор RTP в онлайн слотах',
      temperature: 0.5,
      max_tokens: 2500,
      top_p: 0.3,
      store_logs: true
    },
    expected: 'JSON с title, excerpt, content'
  },
  {
    name: 'Сбалансированная генерация (средние параметры)',
    params: {
      prompt: 'Создай обзор топ-10 казино с лицензией в 2024 году',
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 0.9,
      store_logs: true
    },
    expected: 'JSON с title, excerpt, content'
  }
];

// Функция для проверки JSON парсинга
function validateJSONResponse(text) {
  try {
    // Очищаем текст от возможных префиксов
    let cleanText = text.trim()
      .replace(/^```json\s*/, '')
      .replace(/```\s*$/, '')
      .replace(/^```\s*/, '')
      .replace(/```\s*$/, '');
    
    // Ищем JSON объект
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }
    
    // Пытаемся распарсить JSON
    const parsed = JSON.parse(cleanText);
    
    // Проверяем обязательные поля
    const hasTitle = parsed.title && typeof parsed.title === 'string';
    const hasContent = parsed.content && typeof parsed.content === 'string';
    const hasExcerpt = parsed.excerpt && typeof parsed.excerpt === 'string';
    
    return {
      isValid: hasTitle && hasContent,
      hasTitle,
      hasContent,
      hasExcerpt,
      hasMetaTitle: parsed.meta_title && typeof parsed.meta_title === 'string',
      hasMetaDescription: parsed.meta_description && typeof parsed.meta_description === 'string',
      titleLength: parsed.title?.length || 0,
      contentLength: parsed.content?.length || 0,
      excerptLength: parsed.excerpt?.length || 0
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
}

// Функция для тестирования одного сценария
async function testScenario(scenario, index) {
  console.log(`\n📝 Тест ${index + 1}/${testScenarios.length}: ${scenario.name}`);
  console.log(`Параметры:`, scenario.params);
  
  try {
    const response = await fetch('http://localhost:3000/api/test-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenario.params),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Запрос успешен');
      console.log(`📊 Статистика:`);
      console.log(`   - Длина ответа: ${data.generatedText?.length || 0} символов`);
      console.log(`   - Использовано токенов: ${data.usage?.total_tokens || 0}`);
      console.log(`   - Модель: ${data.model}`);
      
      // Валидируем JSON ответ
      const validation = validateJSONResponse(data.generatedText);
      
      if (validation.isValid) {
        console.log('✅ JSON парсинг успешен');
        console.log(`📋 Структура ответа:`);
        console.log(`   - Заголовок: ${validation.titleLength} символов`);
        console.log(`   - Контент: ${validation.contentLength} символов`);
        console.log(`   - Краткое описание: ${validation.excerptLength} символов`);
        console.log(`   - Meta title: ${validation.hasMetaTitle ? '✅' : '❌'}`);
        console.log(`   - Meta description: ${validation.hasMetaDescription ? '✅' : '❌'}`);
        
        // Показываем превью заголовка
        try {
          const parsed = JSON.parse(data.generatedText.replace(/^```json\s*/, '').replace(/```\s*$/, ''));
          console.log(`📝 Превью заголовка: "${parsed.title?.substring(0, 60)}..."`);
        } catch (e) {
          console.log('⚠️ Не удалось показать превью заголовка');
        }
      } else {
        console.log('❌ JSON парсинг не удался');
        console.log(`   Ошибка: ${validation.error}`);
        console.log(`   Превью ответа: ${data.generatedText?.substring(0, 200)}...`);
      }
      
      return {
        success: true,
        validation,
        usage: data.usage,
        model: data.model
      };
    } else {
      console.log('❌ Запрос не удался');
      console.log(`   Ошибка: ${data.error}`);
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    console.log('❌ Ошибка сети');
    console.log(`   Ошибка: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Основная функция тестирования
async function runComprehensiveTest() {
  console.log('🚀 Запуск комплексного тестирования AI генерации...');
  
  const results = [];
  let successCount = 0;
  let jsonSuccessCount = 0;
  
  for (let i = 0; i < testScenarios.length; i++) {
    const result = await testScenario(testScenarios[i], i);
    results.push(result);
    
    if (result.success) {
      successCount++;
      if (result.validation?.isValid) {
        jsonSuccessCount++;
      }
    }
    
    // Пауза между тестами
    if (i < testScenarios.length - 1) {
      console.log('\n⏳ Ожидание 3 секунды перед следующим тестом...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Итоговая статистика
  console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:');
  console.log('='.repeat(50));
  console.log(`✅ Успешных запросов: ${successCount}/${testScenarios.length}`);
  console.log(`✅ Успешных JSON парсингов: ${jsonSuccessCount}/${testScenarios.length}`);
  console.log(`📈 Процент успеха: ${((successCount / testScenarios.length) * 100).toFixed(1)}%`);
  console.log(`📈 Процент успешного парсинга: ${((jsonSuccessCount / testScenarios.length) * 100).toFixed(1)}%`);
  
  // Детальная статистика по токенам
  const totalTokens = results
    .filter(r => r.success && r.usage)
    .reduce((sum, r) => sum + (r.usage.total_tokens || 0), 0);
  
  const avgTokens = totalTokens / successCount;
  console.log(`💰 Общее количество токенов: ${totalTokens}`);
  console.log(`💰 Среднее количество токенов на тест: ${avgTokens.toFixed(0)}`);
  
  // Рекомендации
  console.log('\n💡 РЕКОМЕНДАЦИИ:');
  if (jsonSuccessCount < testScenarios.length) {
    console.log('⚠️  Некоторые тесты не прошли JSON парсинг');
    console.log('   - Проверьте системные промпты');
    console.log('   - Убедитесь, что AI возвращает валидный JSON');
  } else {
    console.log('🎉 Все тесты прошли успешно!');
  }
  
  if (successCount === testScenarios.length) {
    console.log('🎉 Все запросы к API прошли успешно!');
  } else {
    console.log('⚠️  Некоторые запросы к API не удались');
    console.log('   - Проверьте настройки OpenAI API');
    console.log('   - Убедитесь, что API ключ корректный');
  }
}

// Проверяем, запущен ли сервер
try {
  execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
  console.log('✅ Сервер запущен на localhost:3000');
  runComprehensiveTest();
} catch (error) {
  console.log('❌ Сервер не запущен');
  console.log('Запустите сервер командой: npm run dev');
  process.exit(1);
}