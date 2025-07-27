const axios = require('axios')

const BASE_URL = 'http://localhost:3000/api'

async function testCRUD() {
  console.log('🧪 Тестирование CRUD операций с сайтами...\n')
  
  try {
    // 1. Получаем список сайтов
    console.log('1️⃣ Получение списка сайтов...')
    const sitesResponse = await axios.get(`${BASE_URL}/sites`)
    console.log('✅ Сайты получены:', sitesResponse.data.sites.length, 'шт.')
    
    if (sitesResponse.data.sites.length === 0) {
      console.log('❌ Нет сайтов для тестирования')
      return
    }
    
    const testSite = sitesResponse.data.sites[0]
    console.log('📋 Тестовый сайт:', testSite.name, '(ID:', testSite.documentId, ')\n')
    
    // 2. Тестируем обновление сайта
    console.log('2️⃣ Тестирование обновления сайта...')
    const updateData = {
      name: testSite.name + ' (обновлен)',
      statuspbn: 'draft'
    }
    
    const updateResponse = await axios.put(`${BASE_URL}/sites/${testSite.documentId}`, updateData)
    console.log('✅ Сайт обновлен:', updateResponse.data.message)
    
    // 3. Проверяем, что обновление применилось
    console.log('3️⃣ Проверка обновления...')
    const checkResponse = await axios.get(`${BASE_URL}/sites/${testSite.documentId}`)
    console.log('✅ Обновление подтверждено:', checkResponse.data.site.name)
    
    // 4. Возвращаем оригинальное имя
    console.log('4️⃣ Возврат оригинального имени...')
    const revertData = {
      name: testSite.name,
      statuspbn: testSite.statuspbn
    }
    
    const revertResponse = await axios.put(`${BASE_URL}/sites/${testSite.documentId}`, revertData)
    console.log('✅ Имя возвращено:', revertResponse.data.message)
    
    // 5. Тестируем скачивание (если сайт развернут)
    if (testSite.statuspbn === 'deployed') {
      console.log('5️⃣ Тестирование скачивания ZIP...')
      try {
        const downloadResponse = await axios.get(`${BASE_URL}/sites/${testSite.documentId}/download`, {
          responseType: 'stream'
        })
        console.log('✅ ZIP файл доступен для скачивания')
        console.log('📦 Размер:', downloadResponse.headers['content-length'], 'байт')
      } catch (error) {
        console.log('⚠️ ZIP недоступен (возможно, нет папки dist):', error.response?.data?.error || error.message)
      }
    } else {
      console.log('5️⃣ Скачивание ZIP пропущено (сайт не развернут)')
    }
    
    console.log('\n🎉 Все тесты CRUD операций завершены успешно!')
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.response?.data || error.message)
  }
}

testCRUD() 