import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../_/admin-auth.mjs';
import { g as getAdminState } from '../../../_/admin-store.mjs';
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

const projects_get = defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const state = await getAdminState();
  return state.projects.filter((project) => project.ownerId === session.userId).map((project) => ({
    id: project.id,
    name: project.name,
    slug: project.slug,
    published: project.published,
    updatedAt: project.updatedAt
  }));
});

export { projects_get as default };
//# sourceMappingURL=projects.get.mjs.map
