import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const data = body.data || body
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
    }
    const category = await strapiAPI.updateCategory(params.id, data)
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await strapiAPI.deleteCategory(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete category', details: error, strapi: error?.response?.data }, { status: 500 })
  }
} 