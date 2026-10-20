import { d as defineEventHandler, f as getRouterParam, g as getQuery, c as createError } from '../../../../nitro/nitro.mjs';
import { u as updateAdminState, j as findPublicProject } from '../../../../_/admin-store.mjs';
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

const _code__get = defineEventHandler(async (event) => {
  const code = String(getRouterParam(event, "code") || "").trim();
  const weddingSlug = String(getQuery(event).wedding || "").trim();
  let publicGuest = null;
  await updateAdminState((state) => {
    const project = findPublicProject(state, weddingSlug);
    if (!project) throw createError({ statusCode: 404, statusMessage: "Wedding invitation not found" });
    const guest = project.guests.find((item) => item.inviteCode === code);
    if (!guest) throw createError({ statusCode: 404, statusMessage: "Invitation not found" });
    if (!guest.openedAt) guest.openedAt = (/* @__PURE__ */ new Date()).toISOString();
    project.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    publicGuest = {
      name: guest.name,
      partySize: guest.partySize,
      attendingCount: guest.attendingCount,
      status: guest.status
    };
  });
  return publicGuest;
});

export { _code__get as default };
//# sourceMappingURL=_code_.get.mjs.map
