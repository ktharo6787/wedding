import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { v as verifyPassword, s as setAdminSession, c as createSessionToken } from '../../../_/admin-auth.mjs';
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

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const username = String((body == null ? void 0 : body.username) || "").trim();
  const password = String((body == null ? void 0 : body.password) || "");
  const state = await getAdminState();
  const user = state.users.find((item) => item.username.toLowerCase() === username.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: "Incorrect username or password" });
  }
  setAdminSession(event, createSessionToken(user.id, user.username, state.sessionSecret));
  return { ok: true, username: user.username };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
