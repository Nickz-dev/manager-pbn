#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🧪 Testing AI Generation with new parameters...');

const testCases = [
  {
    name: 'Консервативная генерация (low temperature)',
    params: {
      temperature: 0.3,
      max_tokens: 2000,
      top_p: 0.8,
      prompt: 'Создай статью о лучших онлайн казино в 2024 году'
    }
  },
  {
    name: 'Креативная генерация (high temperature)',
    params: {
      temperature: 1.2,
      max_tokens: 3000,
      top_p: 0.95,
      prompt: 'Напиши обзор новых слот-игр с необычными механиками'
    }
  },
  {
    name: 'Длинная статья (high max_tokens)',
    params: {
      temperature: 0.7,
      max_tokens: 6000,
      top_p: 0.9,
      prompt: 'Создай подробное руководство по спортивным ставкам для начинающих'
    }
  },
  {
    name: 'Фокусная генерация (low top_p)',
    params: {
      temperature: 0.5,
      max_tokens: 2500,
      top_p: 0.3,
      prompt: 'Напиши технический обзор RTP в онлайн слотах'
    }
  }
];

async function testAIGeneration() {
  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.name}`);
    console.log(`Parameters:`, testCase.params);
    
    try {
      const response = await fetch('http://localhost:3000/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.params),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Success!');
        console.log(`Generated text length: ${data.generatedText?.length || 0} characters`);
        console.log(`Usage: ${data.usage?.total_tokens || 0} tokens`);
        console.log(`Model: ${data.model}`);
        
        // Try to parse JSON response
        try {
          const parsed = JSON.parse(data.generatedText);
          console.log('✅ JSON parsing successful');
          console.log(`Title: ${parsed.title?.substring(0, 50)}...`);
          console.log(`Content length: ${parsed.content?.length || 0} characters`);
        } catch (parseError) {
          console.log('⚠️ JSON parsing failed, but generation succeeded');
          console.log(`Raw response preview: ${data.generatedText?.substring(0, 200)}...`);
        }
      } else {
        console.log('❌ Failed:', data.error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Check if server is running
try {
  execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
  console.log('✅ Server is running on localhost:3000');
  testAIGeneration();
} catch (error) {
  console.log('❌ Server is not running. Please start the development server first:');
  console.log('npm run dev');
}