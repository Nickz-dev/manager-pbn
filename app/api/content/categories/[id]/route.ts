import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const data = body.data || body
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
    }
    
    // Находим категорию по documentId или id
    const categories = await strapiAPI.getCategories()
    const category = categories.find((c: any) => c.documentId === params.id) || categories.find((c: any) => c.id.toString() === params.id)
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    const updatedCategory = await strapiAPI.updateCategory(category.documentId, data)
    return NextResponse.json({ success: true, category: updatedCategory })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Находим категорию по documentId или id
    const categories = await strapiAPI.getCategories()
    const category = categories.find((c: any) => c.documentId === params.id) || categories.find((c: any) => c.id.toString() === params.id)
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    await strapiAPI.deleteCategory(category.documentId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete category' }, { status: 500 })
  }
} 