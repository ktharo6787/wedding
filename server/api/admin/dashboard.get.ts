import { createError, defineEventHandler, getQuery } from 'h3'
import { requireAdmin } from '../../utils/admin-auth'
import { findOwnedProject, getAdminState } from '../../utils/admin-store'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const state = await getAdminState()
  const project = findOwnedProject(state, session.userId, String(getQuery(event).projectId || ''))
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Wedding project not found' })
  const invitedPeople = project.guests.reduce((total, guest) => total + guest.partySize, 0)
  const attendingPeople = project.guests.reduce((total, guest) => total + (guest.status === 'attending' ? guest.attendingCount : 0), 0)
  const budgeted = project.expenses.reduce((total, expense) => total + expense.budgeted, 0)
  const actual = project.expenses.reduce((total, expense) => total + expense.actual, 0)
  const paid = project.expenses.reduce((total, expense) => total + expense.paid, 0)
  return {
    guests: {
      invitations: project.guests.length,
      invitedPeople,
      attendingPeople,
      attending: project.guests.filter(guest => guest.status === 'attending').length,
      declined: project.guests.filter(guest => guest.status === 'declined').length,
      pending: project.guests.filter(guest => guest.status === 'pending').length,
      opened: project.guests.filter(guest => guest.openedAt).length
    },
    budget: {
      budgeted,
      actual,
      paid,
      remaining: Math.max(0, budgeted - actual),
      outstanding: Math.max(0, actual - paid),
      overdue: project.expenses.filter(expense => expense.status === 'overdue').length
    },
    updatedAt: project.updatedAt
  }
})
