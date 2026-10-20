import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { randomUUID } from 'node:crypto';
import { h as hashPassword, s as setAdminSession, c as createSessionToken } from '../../../_/admin-auth.mjs';
import { u as updateAdminState, e as createProject } from '../../../_/admin-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'node:fs/promises';
import 'pg';

const setup_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const username = String((body == null ? void 0 : body.username) || "").trim();
  const password = String((body == null ? void 0 : body.password) || "");
  if (username.length < 3) throw createError({ statusCode: 400, statusMessage: "Username must contain at least 3 characters" });
  if (password.length < 8) throw createError({ statusCode: 400, statusMessage: "Password must contain at least 8 characters" });
  const credentials = hashPassword(password);
  const state = await updateAdminState((current) => {
    if (current.users.length) throw createError({ statusCode: 409, statusMessage: "Platform is already configured" });
    const user2 = {
      id: randomUUID(),
      username,
      passwordHash: credentials.hash,
      passwordSalt: credentials.salt,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    current.users.push(user2);
    current.projects.push(createProject(user2.id, { name: "Our Wedding" }));
  });
  const user = state.users[0];
  setAdminSession(event, createSessionToken(user.id, user.username, state.sessionSecret));
  return { ok: true, username };
});

export { setup_post as default };
//# sourceMappingURL=setup.post.mjs.map
