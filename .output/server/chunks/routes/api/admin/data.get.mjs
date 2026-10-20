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

const data_get = defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const state = await getAdminState();
  const project = findOwnedProject(state, session.userId, String(getQuery(event).projectId || ""));
  if (!project) throw createError({ statusCode: 404, statusMessage: "Wedding project not found" });
  return {
    project: { id: project.id, name: project.name, slug: project.slug, published: project.published },
    guests: project.guests,
    expenses: project.expenses,
    theme: project.theme,
    invitation: project.invitation,
    updatedAt: project.updatedAt,
    storage: process.env.DATABASE_URL ? "postgresql" : "local"
  };
});

export { data_get as default };
//# sourceMappingURL=data.get.mjs.map
