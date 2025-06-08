// app/api/blogs/[slug]/route.ts
//! MDX one
// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import matter from 'gray-matter';

// export async function GET(request: Request, { params }: { params: { slug: string } }) {
//   const filePath = path.join(process.cwd(), 'content', `${params.slug}.mdx`);
//   if (!fs.existsSync(filePath)) {
//     return new NextResponse('Not found', { status: 404 });
//   }
//   const fileContent = fs.readFileSync(filePath, 'utf8');
//   const { data, content } = matter(fileContent);
//   return NextResponse.json({ data, content });
// }


//! JSON one
// import { NextResponse } from 'next/server'
// import fs from 'fs'
// import path from 'path'

// export async function GET(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const { slug } = params
    
//     // Read the blog file from the content directory
//     const filePath = path.join(process.cwd(), 'content', `${slug}.json`)
//     const fileContent = fs.readFileSync(filePath, 'utf8')
//     const blogData = JSON.parse(fileContent)
    
//     return NextResponse.json(blogData)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Blog post not found' },
//       { status: 404 }
//     )
//   }
// }

import { NextResponse } from 'next/server'
import { supabase } from '@/app/supabase/supabase'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({
      data: {
        title: blog.title,
        date: blog.date,
        readTime: blog.read_time,
        tags: blog.tags
      },
      content: blog.content
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}