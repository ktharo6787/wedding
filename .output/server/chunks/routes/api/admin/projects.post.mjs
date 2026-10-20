import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../_/admin-auth.mjs';
import { u as updateAdminState, e as createProject, b as uniqueSlug } from '../../../_/admin-store.mjs';
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

const projects_post = defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const body = await readBody(event);
  const name = String((body == null ? void 0 : body.name) || "").trim();
  if (name.length < 2) throw createError({ statusCode: 400, statusMessage: "Wedding name is required" });
  let created = null;
  await updateAdminState((state) => {
    if (state.projects.filter((project) => project.ownerId === session.userId).length >= 20) throw createError({ statusCode: 400, statusMessage: "Maximum of 20 wedding projects reached" });
    created = createProject(session.userId, { name, slug: uniqueSlug(state, String((body == null ? void 0 : body.slug) || name)) });
    state.projects.push(created);
  });
  return created;
});

export { projects_post as default };
//# sourceMappingURL=projects.post.mjs.map
