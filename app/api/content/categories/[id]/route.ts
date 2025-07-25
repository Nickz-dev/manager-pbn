import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await strapiAPI.deleteCategory(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
} 