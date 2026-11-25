import { NextResponse } from 'next/server'
import { blogConfigured, listBlogs } from '@/lib/blog-db'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!blogConfigured()) return NextResponse.json([])
  try {
    return NextResponse.json(await listBlogs())
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}
