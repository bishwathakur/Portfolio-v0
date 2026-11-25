import { createClient, type Client, type Row } from '@libsql/client'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

export type BlogFields = {
  title: string
  content: string
  date: string
  readTime: string
  tags: string[]
}

export type BlogRecord = BlogFields & {
  slug: string
  createdAt: string
  updatedAt: string
}

export const BLOG_SCHEMA = [
  "CREATE TABLE IF NOT EXISTS blogs (slug TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, date TEXT NOT NULL, read_time TEXT NOT NULL, tags TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS blogs_recent ON blogs (created_at DESC, slug ASC)"
]

let storage: Promise<Client> | undefined

export function blogConfigured() {
  return !!process.env.BLOG_DATABASE_URL?.trim()
}

export function openBlogDatabase(): Client {
  const url = process.env.BLOG_DATABASE_URL?.trim()
  if (!url) throw new Error('BLOG_DATABASE_URL is not configured')
  const authToken = process.env.BLOG_DATABASE_AUTH_TOKEN?.trim()
  if (url.startsWith('file:')) {
    if (process.env.VERCEL === '1') throw new Error('Use a hosted blog database on Vercel')
    const file = url.slice(5)
    if (!file || file === ':memory:' || file.includes('?') || file.includes('#')) {
      throw new Error('Use file: followed by a persistent local database path')
    }
    mkdirSync(dirname(resolve(file)), { recursive: true })
  } else {
    const endpoint = new URL(url)
    if (!['libsql:', 'https:', 'wss:'].includes(endpoint.protocol) || !authToken) {
      throw new Error('A secure hosted blog URL and an auth token are required')
    }
  }
  return createClient({ url, authToken })
}

export async function initBlogDatabase(client: Client) {
  await client.batch(BLOG_SCHEMA, 'write')
  return client
}

function db() {
  return (storage ??= Promise.resolve().then(async () => {
    const client = openBlogDatabase()
    try {
      return await initBlogDatabase(client)
    } catch (error) {
      client.close()
      throw error
    }
  }).catch(error => {
    storage = undefined
    throw error
  }))
}

export function validBlogSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length <= 160 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export function blogSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function parseBlogFields(input: unknown): BlogFields | null {
  if (typeof input !== 'object' || !input) return null
  const { title, content, date, readTime, tags } = input as Partial<BlogFields>
  if (typeof title !== 'string' || !title.trim() || title.length > 180 ||
      typeof content !== 'string' || !content.trim() || content.length > 1_000_000 ||
      (date !== undefined && (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) ||
      (readTime !== undefined && (typeof readTime !== 'string' || readTime.length > 80)) ||
      (tags !== undefined && (!Array.isArray(tags) || tags.length > 30 ||
        tags.some(tag => typeof tag !== 'string' || tag.length > 80)))) return null
  return {
    title: title.trim(), content, date: date ?? new Date().toISOString().slice(0, 10),
    readTime: readTime || '5 min read', tags: tags ?? []
  }
}

function unpack(row: Row): BlogRecord {
  return {
    slug: String(row.slug), title: String(row.title), content: String(row.content),
    date: String(row.date), readTime: String(row.read_time),
    tags: JSON.parse(String(row.tags)) as string[],
    createdAt: String(row.created_at), updatedAt: String(row.updated_at)
  }
}

export async function listBlogs() {
  const result = await (await db()).execute('SELECT slug FROM blogs ORDER BY created_at DESC, slug ASC')
  return result.rows.map(row => String(row.slug))
}

export async function getBlog(slug: string) {
  const result = await (await db()).execute({
    sql: 'SELECT slug, title, content, date, read_time, tags, created_at, updated_at FROM blogs WHERE slug = ?',
    args: [slug]
  })
  return result.rows[0] ? unpack(result.rows[0]) : null
}

export function blogInsert(blog: BlogRecord) {
  return {
    sql: 'INSERT INTO blogs (slug, title, content, date, read_time, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO NOTHING',
    args: [blog.slug, blog.title, blog.content, blog.date, blog.readTime, JSON.stringify(blog.tags), blog.createdAt, blog.updatedAt]
  }
}

export async function createBlog(slug: string, fields: BlogFields) {
  const now = new Date().toISOString()
  const result = await (await db()).execute(blogInsert({ slug, ...fields, createdAt: now, updatedAt: now }))
  return result.rowsAffected === 1
}

export async function updateBlog(slug: string, fields: BlogFields) {
  const result = await (await db()).execute({
    sql: 'UPDATE blogs SET title = ?, content = ?, date = ?, read_time = ?, tags = ?, updated_at = ? WHERE slug = ?',
    args: [fields.title, fields.content, fields.date, fields.readTime, JSON.stringify(fields.tags), new Date().toISOString(), slug]
  })
  return result.rowsAffected === 1
}

export async function deleteBlog(slug: string) {
  const result = await (await db()).execute({ sql: 'DELETE FROM blogs WHERE slug = ?', args: [slug] })
  return result.rowsAffected === 1
}
