import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Testing OpenAI API connection...')
    
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key')) {
      return NextResponse.json(
        { error: 'OpenAI API ключ не настроен' },
        { status: 400 }
      )
    }

    const { 
      prompt, 
      temperature = 0.7, 
      max_tokens = 4000, 
      top_p = 0.9, 
      store_logs = true 
    } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt обязателен' },
        { status: 400 }
      )
    }

    // Log generation parameters if store_logs is enabled
    if (store_logs) {
      console.log('📊 AI Generation Parameters:', {
        temperature,
        max_tokens,
        top_p,
        prompt_length: prompt.length
      })
    }

    // Test OpenAI API call with configurable parameters
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Ты опытный SEO-копирайтер, специализирующийся на создании контента для сайтов про онлайн казино и азартные игры. Пиши на русском языке. Всегда возвращай ответ в формате JSON без дополнительного текста или комментариев.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: Math.min(max_tokens, 8000), // Ограничиваем максимум
      temperature: Math.max(0, Math.min(temperature, 2)), // Ограничиваем от 0 до 2
      top_p: Math.max(0.1, Math.min(top_p, 1)), // Ограничиваем от 0.1 до 1
      presence_penalty: 0.1, // Небольшой штраф за повторения
      frequency_penalty: 0.1 // Небольшой штраф за частые слова
    })

    const generatedText = completion.choices[0]?.message?.content

    // Log usage statistics if store_logs is enabled
    if (store_logs) {
      console.log('📈 AI Generation Stats:', {
        prompt_tokens: completion.usage?.prompt_tokens,
        completion_tokens: completion.usage?.completion_tokens,
        total_tokens: completion.usage?.total_tokens,
        model: completion.model
      })
    }

    console.log('✅ OpenAI API test successful')

    return NextResponse.json({
      success: true,
      generatedText,
      usage: completion.usage,
      model: completion.model,
      parameters: {
        temperature,
        max_tokens,
        top_p,
        store_logs
      }
    })

  } catch (error: any) {
    console.error('❌ OpenAI API test failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Ошибка при тестировании OpenAI API',
        details: error.message
      },
      { status: 500 }
    )
  }
} 