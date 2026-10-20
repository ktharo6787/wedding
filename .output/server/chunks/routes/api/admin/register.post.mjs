import { randomUUID } from 'node:crypto';
import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { h as hashPassword, s as setAdminSession, c as createSessionToken } from '../../../_/admin-auth.mjs';
import { u as updateAdminState, e as createProject, b as uniqueSlug } from '../../../_/admin-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'node:fs/promises';
import 'pg';

const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const username = String((body == null ? void 0 : body.username) || "").trim();
  const password = String((body == null ? void 0 : body.password) || "");
  if (username.length < 3) throw createError({ statusCode: 400, statusMessage: "Username must contain at least 3 characters" });
  if (password.length < 8) throw createError({ statusCode: 400, statusMessage: "Password must contain at least 8 characters" });
  const credentials = hashPassword(password);
  const userId = randomUUID();
  const state = await updateAdminState((current) => {
    if (current.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) throw createError({ statusCode: 409, statusMessage: "Username is already in use" });
    current.users.push({ id: userId, username, passwordHash: credentials.hash, passwordSalt: credentials.salt, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
    current.projects.push(createProject(userId, { name: "Our Wedding", slug: uniqueSlug(current, `${username}-wedding`) }));
  });
  setAdminSession(event, createSessionToken(userId, username, state.sessionSecret));
  return { ok: true, username };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
