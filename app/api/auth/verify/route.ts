import { NextResponse } from 'next/server'
import { verifyEditorToken } from '@/lib/blog-auth'

export async function POST(request: Request) {
  const { token } = (await request.json().catch(() => null)) ?? {}
  if (!verifyEditorToken(token)) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  return NextResponse.json({ success: true })
}
