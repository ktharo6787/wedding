import { createError, defineEventHandler, readBody } from 'h3'
import { randomUUID } from 'node:crypto'
import { createSessionToken, hashPassword, setAdminSession } from '../../utils/admin-auth'
import { createProject, updateAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')
  if (username.length < 3) throw createError({ statusCode: 400, statusMessage: 'Username must contain at least 3 characters' })
  if (password.length < 8) throw createError({ statusCode: 400, statusMessage: 'Password must contain at least 8 characters' })

  const credentials = hashPassword(password)
  const state = await updateAdminState((current) => {
    if (current.users.length) throw createError({ statusCode: 409, statusMessage: 'Platform is already configured' })
    const user = {
      id: randomUUID(),
      username,
      passwordHash: credentials.hash,
      passwordSalt: credentials.salt,
      createdAt: new Date().toISOString()
    }
    current.users.push(user)
    current.projects.push(createProject(user.id, { name: 'Our Wedding' }))
  })
  const user = state.users[0]
  setAdminSession(event, createSessionToken(user.id, user.username, state.sessionSecret))
  return { ok: true, username }
})
