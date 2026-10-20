import { createError, defineEventHandler, readBody } from 'h3'
import { createGuest, findPublicProject, updateAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const inviteCode = String(body?.inviteCode || '').trim()
  const weddingSlug = String(body?.weddingSlug || '').trim()
  const name = String(body?.name || '').trim()
  const status = body?.attending === 'yes' ? 'attending' : 'declined'
  const attendingCount = status === 'attending' ? Math.max(1, Math.min(20, Number(body?.guests) || 1)) : 0
  const note = String(body?.note || '').trim().slice(0, 1000)
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Name is required' })

  let savedId = ''
  await updateAdminState((state) => {
    const project = findPublicProject(state, weddingSlug)
    if (!project) throw createError({ statusCode: 404, statusMessage: 'Wedding invitation not found' })
    let guest = inviteCode ? project.guests.find(item => item.inviteCode === inviteCode) : undefined
    if (!guest) {
      guest = createGuest({ name, partySize: attendingCount || 1, inviteCode: inviteCode || undefined })
      project.guests.push(guest)
    }
    guest.name = name
    guest.status = status
    guest.attendingCount = attendingCount
    guest.notes = note
    guest.respondedAt = new Date().toISOString()
    if (!guest.openedAt) guest.openedAt = guest.respondedAt
    savedId = guest.id
    project.updatedAt = new Date().toISOString()
  })
  return { ok: true, id: savedId, status, attendingCount }
})
