import jwt from 'jsonwebtoken'

export function verifyEditorToken(token: unknown) {
  const secret = process.env.JWT_SECRET
  if (!secret || !process.env.BLOG_EDITOR_PASSWORD || typeof token !== 'string' || !token) return false

  try {
    const claims = jwt.verify(token, secret, { algorithms: ['HS256'] })
    return typeof claims === 'object' && claims.authorized === true
  } catch {
    return false
  }
}

export function isBlogEditor(request: Request) {
  const match = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)
  return verifyEditorToken(match?.[1])
}
