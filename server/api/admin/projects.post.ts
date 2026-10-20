import { createError, defineEventHandler, readBody } from 'h3'
import { requireAdmin } from '../../utils/admin-auth'
import { createProject, uniqueSlug, updateAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  if (name.length < 2) throw createError({ statusCode: 400, statusMessage: 'Wedding name is required' })
  let created: ReturnType<typeof createProject> | null = null
  await updateAdminState((state) => {
    if (state.projects.filter(project => project.ownerId === session.userId).length >= 20) throw createError({ statusCode: 400, statusMessage: 'Maximum of 20 wedding projects reached' })
    created = createProject(session.userId, { name, slug: uniqueSlug(state, String(body?.slug || name)) })
    state.projects.push(created)
  })
  return created
})
