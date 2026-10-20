import { randomUUID } from 'node:crypto'
import { createError, defineEventHandler, readBody } from 'h3'
import { createSessionToken, hashPassword, setAdminSession } from '../../utils/admin-auth'
import { createProject, uniqueSlug, updateAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')
  if (username.length < 3) throw createError({ statusCode: 400, statusMessage: 'Username must contain at least 3 characters' })
  if (password.length < 8) throw createError({ statusCode: 400, statusMessage: 'Password must contain at least 8 characters' })
  const credentials = hashPassword(password)
  const userId = randomUUID()
  const state = await updateAdminState((current) => {
    if (current.users.some(user => user.username.toLowerCase() === username.toLowerCase())) throw createError({ statusCode: 409, statusMessage: 'Username is already in use' })
    current.users.push({ id: userId, username, passwordHash: credentials.hash, passwordSalt: credentials.salt, createdAt: new Date().toISOString() })
    current.projects.push(createProject(userId, { name: 'Our Wedding', slug: uniqueSlug(current, `${username}-wedding`) }))
  })
  setAdminSession(event, createSessionToken(userId, username, state.sessionSecret))
  return { ok: true, username }
})
