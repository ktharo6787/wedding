import { createError, defineEventHandler, readBody } from 'h3'
import { requireAdmin } from '../../utils/admin-auth'
import { sanitizeAdminPayload } from '../../utils/admin-sanitize'
import { findOwnedProject, uniqueSlug, updateAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const body = await readBody(event)
  const state = await updateAdminState((current) => {
    const project = findOwnedProject(current, session.userId, String(body?.projectId || ''))
    if (!project) throw createError({ statusCode: 404, statusMessage: 'Wedding project not found' })
    const sanitized = sanitizeAdminPayload(body, project)
    project.guests = sanitized.guests
    project.expenses = sanitized.expenses
    project.theme = sanitized.theme
    project.invitation = sanitized.invitation
    if (body?.project) {
      project.name = String(body.project.name || project.name).trim().slice(0, 100)
      project.slug = uniqueSlug(current, String(body.project.slug || project.name), project.id)
      project.published = body.project.published !== false
    }
    project.updatedAt = new Date().toISOString()
  })
  return { ok: true, updatedAt: state.updatedAt }
})
