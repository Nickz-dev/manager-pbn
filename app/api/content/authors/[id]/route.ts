import { NextRequest, NextResponse } from 'next/server'
import { strapiAPI } from '@/lib/strapi-client'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const data = body.data || body
    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields: name, email' }, { status: 400 })
    }
    
    // Находим автора по documentId или id
    const authors = await strapiAPI.getAuthors()
    const author = authors.find((a: any) => a.documentId === params.id) || authors.find((a: any) => a.id.toString() === params.id)
    
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }
    
    const updatedAuthor = await strapiAPI.updateAuthor(author.documentId, data)
    return NextResponse.json({ success: true, author: updatedAuthor })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update author' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Находим автора по documentId или id
    const authors = await strapiAPI.getAuthors()
    const author = authors.find((a: any) => a.documentId === params.id) || authors.find((a: any) => a.id.toString() === params.id)
    
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }
    
    await strapiAPI.deleteAuthor(author.documentId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete author' }, { status: 500 })
  }
} 