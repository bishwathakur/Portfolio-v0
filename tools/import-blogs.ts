import { readFile } from 'node:fs/promises'
import { blogInsert, initBlogDatabase, openBlogDatabase, parseBlogFields, validBlogSlug } from '../lib/blog-db'

function timestamp(value: unknown, fallback: string) {
  if (value === undefined || value === null) return fallback
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error('Invalid timestamp')
  return new Date(value).toISOString()
}

async function main() {
  const source = process.argv[2]
  if (!source) throw new Error('Usage: npm run blog:import -- path/to/blogs.json')
  const exportData: unknown = JSON.parse(await readFile(source, 'utf8'))
  if (!Array.isArray(exportData)) throw new Error('Expected a JSON array of Supabase blogs rows')
  const statements = exportData.map((row, i) => {
    if (!row || !validBlogSlug(row.slug) || typeof row.date !== 'string') throw new Error('Invalid slug or date in row ' + (i + 1))
    const fields = parseBlogFields({ title: row.title, content: row.content, date: row.date, readTime: row.read_time ?? undefined, tags: row.tags ?? undefined })
    if (!fields) throw new Error('Invalid metadata/content in row ' + (i + 1))
    const createdAt = timestamp(row.created_at, fields.date + 'T00:00:00.000Z')
    return blogInsert({ ...fields, title: row.title, slug: row.slug, createdAt, updatedAt: timestamp(row.updated_at, createdAt) })
  })
  const client = openBlogDatabase()
  try {
    await initBlogDatabase(client)
    const results = statements.length ? await client.batch(statements, 'write') : []
    const inserted = results.reduce((total, result) => total + result.rowsAffected, 0)
    console.log('Imported ' + inserted + ' blog(s); skipped ' + (statements.length - inserted) + ' existing slug(s).')
  } finally {
    client.close()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Blog import failed')
  process.exitCode = 1
})
