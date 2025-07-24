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

    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt обязателен' },
        { status: 400 }
      )
    }

    // Test OpenAI API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Ты опытный SEO-копирайтер, специализирующийся на создании контента для сайтов про онлайн казино и азартные игры. Пиши на русском языке.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const generatedText = completion.choices[0]?.message?.content

    console.log('✅ OpenAI API test successful')

    return NextResponse.json({
      success: true,
      generatedText,
      usage: completion.usage,
      model: completion.model
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