import { NextResponse } from 'next/server'
import { isBlogEditor } from '@/lib/blog-auth'
import { blogConfigured, deleteBlog, getBlog, parseBlogFields, updateBlog, validBlogSlug } from '@/lib/blog-db'

type Context = { params: { slug: string } }

const unavailable = () => NextResponse.json({ error: 'Blog service is unavailable' }, { status: 503 })
const notFound = () => NextResponse.json({ error: 'Blog not found' }, { status: 404 })
const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: Context) {
  if (!validBlogSlug(params.slug)) return notFound()
  if (!blogConfigured()) return unavailable()

  try {
    const blog = await getBlog(params.slug)
    if (!blog) return notFound()
    const { title, date, readTime, tags, content } = blog
    return NextResponse.json({ data: { title, date, readTime, tags }, content })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: Context) {
  if (!isBlogEditor(request)) return unauthorized()
  if (!blogConfigured()) return unavailable()
  if (!validBlogSlug(params.slug)) return notFound()
  const fields = parseBlogFields(await request.json().catch(() => null))
  if (!fields) return NextResponse.json({ error: 'Valid title, content, and blog metadata are required' }, { status: 400 })

  try {
    if (!(await updateBlog(params.slug, fields))) return notFound()
    return NextResponse.json({ message: 'Blog updated successfully', slug: params.slug })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!isBlogEditor(request)) return unauthorized()
  if (!blogConfigured()) return unavailable()
  if (!validBlogSlug(params.slug)) return notFound()

  try {
    if (!(await deleteBlog(params.slug))) return notFound()
    return NextResponse.json({ message: 'Blog deleted successfully', slug: params.slug })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
