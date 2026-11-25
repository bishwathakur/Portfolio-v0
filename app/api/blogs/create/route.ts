import { NextResponse } from 'next/server'
import { isBlogEditor } from '@/lib/blog-auth'
import { blogConfigured, blogSlug, createBlog, parseBlogFields, validBlogSlug } from '@/lib/blog-db'

export async function POST(request: Request) {
  if (!isBlogEditor(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!blogConfigured()) return NextResponse.json({ error: 'Blog service is unavailable' }, { status: 503 })
  const input = await request.json().catch(() => null)
  const fields = parseBlogFields(input)
  if (!fields) return NextResponse.json({ error: 'Valid title, content, and blog metadata are required' }, { status: 400 })
  const slug = input.slug === undefined || input.slug === '' ? blogSlug(fields.title) : input.slug
  if (!validBlogSlug(slug)) return NextResponse.json({ error: 'Use a lowercase URL slug with letters, numbers and hyphens' }, { status: 400 })

  try {
    if (!(await createBlog(slug, fields))) {
      return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ message: 'Blog created successfully', slug })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
