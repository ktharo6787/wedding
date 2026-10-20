import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { createError, deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import { getAdminState } from './admin-store'

const cookieName = 'wedding_admin_session'

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  return {
    salt,
    hash: scryptSync(password, salt, 64).toString('hex')
  }
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actual = Buffer.from(scryptSync(password, salt, 64).toString('hex'))
  const expected = Buffer.from(expectedHash)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function createSessionToken(userId: string, username: string, secret: string) {
  const payload = Buffer.from(JSON.stringify({
    userId,
    username,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
  })).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

export function setAdminSession(event: H3Event, token: string) {
  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, cookieName, { path: '/' })
}

export async function getAdminSession(event: H3Event) {
  const token = getCookie(event, cookieName)
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const state = await getAdminState()
  const expected = sign(payload, state.sessionSecret)
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!parsed.username || parsed.expiresAt < Date.now()) return null
    const user = parsed.userId
      ? state.users.find(item => item.id === parsed.userId)
      : state.users.find(item => item.username === parsed.username)
    if (!user) return null
    return { userId: user.id, username: user.username }
  } catch {
    return null
  }
}

export async function requireAdmin(event: H3Event) {
  const session = await getAdminSession(event)
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Admin authentication required' })
  return session
}
