import { createError, defineEventHandler, readBody } from 'h3'
import { createSessionToken, setAdminSession, verifyPassword } from '../../utils/admin-auth'
import { getAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')
  const state = await getAdminState()
  const user = state.users.find(item => item.username.toLowerCase() === username.toLowerCase())
  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Incorrect username or password' })
  }
  setAdminSession(event, createSessionToken(user.id, user.username, state.sessionSecret))
  return { ok: true, username: user.username }
})
