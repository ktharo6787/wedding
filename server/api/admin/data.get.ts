import { createError, defineEventHandler, getQuery } from 'h3'
import { requireAdmin } from '../../utils/admin-auth'
import { findOwnedProject, getAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const state = await getAdminState()
  const project = findOwnedProject(state, session.userId, String(getQuery(event).projectId || ''))
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Wedding project not found' })
  return {
    project: { id: project.id, name: project.name, slug: project.slug, published: project.published },
    guests: project.guests,
    expenses: project.expenses,
    theme: project.theme,
    invitation: project.invitation,
    updatedAt: project.updatedAt,
    storage: process.env.DATABASE_URL ? 'postgresql' : 'local'
  }
})
