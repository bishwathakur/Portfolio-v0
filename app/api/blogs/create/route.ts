// import { NextResponse } from 'next/server'
// import fs from 'fs'
// import path from 'path'
// import jwt from 'jsonwebtoken'

// export async function POST(request: Request) {
//   try {
//     // Check authentication
//     const authHeader = request.headers.get('authorization')
//     const token = authHeader?.replace('Bearer ', '')
//     const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-this'
    
//     if (!token) {
//       return NextResponse.json(
//         { error: 'No authentication token provided' },
//         { status: 401 }
//       )
//     }

//     // Verify JWT token
//     try {
//       jwt.verify(token, jwtSecret)
//     } catch (jwtError) {
//       return NextResponse.json(
//         { error: 'Invalid or expired token' },
//         { status: 401 }
//       )
//     }

//     const { slug, data } = await request.json()
    
//     // Validate input
//     if (!slug || !data) {
//       return NextResponse.json(
//         { error: 'Missing slug or data' },
//         { status: 400 }
//       )
//     }

//     // Sanitize slug
//     const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    
//     // Ensure content directory exists
//     const contentDir = path.join(process.cwd(), 'content')
//     if (!fs.existsSync(contentDir)) {
//       fs.mkdirSync(contentDir, { recursive: true })
//     }
    
//     // Write the blog file
//     const filePath = path.join(contentDir, `${sanitizedSlug}.json`)
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
//     return NextResponse.json({ success: true, slug: sanitizedSlug })
//   } catch (error) {
//     console.error('Error saving blog:', error)
//     return NextResponse.json(
//       { error: 'Failed to save blog' },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from 'next/server'
import { supabase } from '@/app/supabase/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, date, readTime, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create blog in Supabase
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        slug,
        title,
        content,
        date: date || new Date().toISOString().split('T')[0],
        read_time: readTime || '5 min read',
        tags: tags || []
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Blog with this title already exists' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ 
      message: 'Blog created successfully', 
      slug: data.slug 
    })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}