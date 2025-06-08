import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    const jwtSecret = process.env.JWT_SECRET!
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify JWT token
    jwt.verify(token, jwtSecret)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}