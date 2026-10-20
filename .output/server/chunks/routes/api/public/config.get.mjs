import { d as defineEventHandler, g as getQuery, c as createError } from '../../../nitro/nitro.mjs';
import { g as getAdminState, j as findPublicProject } from '../../../_/admin-store.mjs';
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

const config_get = defineEventHandler(async (event) => {
  const state = await getAdminState();
  const project = findPublicProject(state, String(getQuery(event).wedding || ""));
  if (!project) throw createError({ statusCode: 404, statusMessage: "Wedding invitation not found" });
  return {
    project: { name: project.name, slug: project.slug },
    theme: project.theme,
    invitation: project.invitation
  };
});

export { config_get as default };
//# sourceMappingURL=config.get.mjs.map
