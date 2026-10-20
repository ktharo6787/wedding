import { defineEventHandler } from 'h3'
import { requireAdmin } from '../../utils/admin-auth'
import { getAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const state = await getAdminState()
  return state.projects.filter(project => project.ownerId === session.userId).map(project => ({
    id: project.id,
    name: project.name,
    slug: project.slug,
    published: project.published,
    updatedAt: project.updatedAt
  }))
})
