import { createError, defineEventHandler, getQuery } from 'h3'
import { findPublicProject, getAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const state = await getAdminState()
  const project = findPublicProject(state, String(getQuery(event).wedding || ''))
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Wedding invitation not found' })
  return {
    project: { name: project.name, slug: project.slug },
    theme: project.theme,
    invitation: project.invitation
  }
})
