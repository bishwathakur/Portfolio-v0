import { NextResponse } from 'next/server'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    const correctPassword = process.env.BLOG_EDITOR_PASSWORD
    const jwtSecret = process.env.JWT_SECRET!
    
    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (password === correctPassword) {
      // Create JWT token that expires in 24 hours
      const token = jwt.sign(
        { authorized: true, timestamp: Date.now() },
        jwtSecret,
        { expiresIn: '24h' }
      )
      
      return NextResponse.json({ 
        success: true, 
        token,
        message: 'Authentication successful' 
      })
    } else {
      // Add delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000))
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}