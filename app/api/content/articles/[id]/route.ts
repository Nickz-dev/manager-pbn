import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const article = await strapiAPI.getArticleById(id)
    
    if (!article) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      article
    })

  } catch (error: any) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { data } = body

    const updatedArticle = await strapiAPI.updateArticle(id, data)
    
    if (!updatedArticle) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update article' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      article: updatedArticle
    })

  } catch (error: any) {
    console.error('Error updating article:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const success = await strapiAPI.deleteArticle(id)
    
    if (!success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete article' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 