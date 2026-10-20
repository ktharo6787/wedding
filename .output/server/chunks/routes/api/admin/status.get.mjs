import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { g as getAdminSession } from '../../../_/admin-auth.mjs';
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

const status_get = defineEventHandler(async (event) => {
  const [state, session] = await Promise.all([getAdminState(), getAdminSession(event)]);
  return {
    configured: state.users.length > 0,
    authenticated: Boolean(session),
    username: (session == null ? void 0 : session.username) || "",
    projects: session ? state.projects.filter((project) => project.ownerId === session.userId).map((project) => ({ id: project.id, name: project.name, slug: project.slug, published: project.published })) : []
  };
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
