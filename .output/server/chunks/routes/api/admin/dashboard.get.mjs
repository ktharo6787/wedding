import { d as defineEventHandler, g as getQuery, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../_/admin-auth.mjs';
import { g as getAdminState, f as findOwnedProject } from '../../../_/admin-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'node:fs/promises';
import 'pg';

const dashboard_get = defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const state = await getAdminState();
  const project = findOwnedProject(state, session.userId, String(getQuery(event).projectId || ""));
  if (!project) throw createError({ statusCode: 404, statusMessage: "Wedding project not found" });
  const invitedPeople = project.guests.reduce((total, guest) => total + guest.partySize, 0);
  const attendingPeople = project.guests.reduce((total, guest) => total + (guest.status === "attending" ? guest.attendingCount : 0), 0);
  const budgeted = project.expenses.reduce((total, expense) => total + expense.budgeted, 0);
  const actual = project.expenses.reduce((total, expense) => total + expense.actual, 0);
  const paid = project.expenses.reduce((total, expense) => total + expense.paid, 0);
  return {
    guests: {
      invitations: project.guests.length,
      invitedPeople,
      attendingPeople,
      attending: project.guests.filter((guest) => guest.status === "attending").length,
      declined: project.guests.filter((guest) => guest.status === "declined").length,
      pending: project.guests.filter((guest) => guest.status === "pending").length,
      opened: project.guests.filter((guest) => guest.openedAt).length
    },
    budget: {
      budgeted,
      actual,
      paid,
      remaining: Math.max(0, budgeted - actual),
      outstanding: Math.max(0, actual - paid),
      overdue: project.expenses.filter((expense) => expense.status === "overdue").length
    },
    updatedAt: project.updatedAt
  };
});

export { dashboard_get as default };
//# sourceMappingURL=dashboard.get.mjs.map
