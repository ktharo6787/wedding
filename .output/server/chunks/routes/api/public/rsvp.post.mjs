import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { u as updateAdminState, j as findPublicProject, a as createGuest } from '../../../_/admin-store.mjs';
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

const rsvp_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const inviteCode = String((body == null ? void 0 : body.inviteCode) || "").trim();
  const weddingSlug = String((body == null ? void 0 : body.weddingSlug) || "").trim();
  const name = String((body == null ? void 0 : body.name) || "").trim();
  const status = (body == null ? void 0 : body.attending) === "yes" ? "attending" : "declined";
  const attendingCount = status === "attending" ? Math.max(1, Math.min(20, Number(body == null ? void 0 : body.guests) || 1)) : 0;
  const note = String((body == null ? void 0 : body.note) || "").trim().slice(0, 1e3);
  if (!name) throw createError({ statusCode: 400, statusMessage: "Name is required" });
  let savedId = "";
  await updateAdminState((state) => {
    const project = findPublicProject(state, weddingSlug);
    if (!project) throw createError({ statusCode: 404, statusMessage: "Wedding invitation not found" });
    let guest = inviteCode ? project.guests.find((item) => item.inviteCode === inviteCode) : void 0;
    if (!guest) {
      guest = createGuest({ name, partySize: attendingCount || 1, inviteCode: inviteCode || void 0 });
      project.guests.push(guest);
    }
    guest.name = name;
    guest.status = status;
    guest.attendingCount = attendingCount;
    guest.notes = note;
    guest.respondedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!guest.openedAt) guest.openedAt = guest.respondedAt;
    savedId = guest.id;
    project.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  });
  return { ok: true, id: savedId, status, attendingCount };
});

export { rsvp_post as default };
//# sourceMappingURL=rsvp.post.mjs.map
