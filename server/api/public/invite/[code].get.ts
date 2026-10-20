import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import { findPublicProject, updateAdminState } from '../../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const code = String(getRouterParam(event, 'code') || '').trim()
  const weddingSlug = String(getQuery(event).wedding || '').trim()
  let publicGuest: Record<string, unknown> | null = null
  await updateAdminState((state) => {
    const project = findPublicProject(state, weddingSlug)
    if (!project) throw createError({ statusCode: 404, statusMessage: 'Wedding invitation not found' })
    const guest = project.guests.find(item => item.inviteCode === code)
    if (!guest) throw createError({ statusCode: 404, statusMessage: 'Invitation not found' })
    if (!guest.openedAt) guest.openedAt = new Date().toISOString()
    project.updatedAt = new Date().toISOString()
    publicGuest = {
      name: guest.name,
      partySize: guest.partySize,
      attendingCount: guest.attendingCount,
      status: guest.status
    }
  })
  return publicGuest
})
