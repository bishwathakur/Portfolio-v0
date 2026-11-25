// app/api/blogs/route.ts
import { NextResponse } from 'next/server'
import { getSupabase } from '@/app/supabase/supabase'

export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json([])

    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('slug')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    const slugs = blogs?.map(blog => blog.slug) || []
    return NextResponse.json(slugs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}
