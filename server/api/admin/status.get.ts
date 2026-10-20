import { defineEventHandler } from 'h3'
import { getAdminSession } from '../../utils/admin-auth'
import { getAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const [state, session] = await Promise.all([getAdminState(), getAdminSession(event)])
  return {
    configured: state.users.length > 0,
    authenticated: Boolean(session),
    username: session?.username || '',
    projects: session ? state.projects.filter(project => project.ownerId === session.userId).map(project => ({ id: project.id, name: project.name, slug: project.slug, published: project.published })) : []
  }
})
