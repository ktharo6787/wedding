import { scryptSync, timingSafeEqual, randomBytes, createHmac } from 'node:crypto';
import { c as createError, s as setCookie, b as deleteCookie, e as getCookie } from '../nitro/nitro.mjs';
import { g as getAdminState } from './admin-store.mjs';

const cookieName = "wedding_admin_session";
function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  return {
    salt,
    hash: scryptSync(password, salt, 64).toString("hex")
  };
}
function verifyPassword(password, salt, expectedHash) {
  const actual = Buffer.from(scryptSync(password, salt, 64).toString("hex"));
  const expected = Buffer.from(expectedHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}
function createSessionToken(userId, username, secret) {
  const payload = Buffer.from(JSON.stringify({
    userId,
    username,
    expiresAt: Date.now() + 1e3 * 60 * 60 * 24 * 7
  })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}
function setAdminSession(event, token) {
  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}
function clearAdminSession(event) {
  deleteCookie(event, cookieName, { path: "/" });
}
async function getAdminSession(event) {
  const token = getCookie(event, cookieName);
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const state = await getAdminState();
  const expected = sign(payload, state.sessionSecret);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!parsed.username || parsed.expiresAt < Date.now()) return null;
    const user = parsed.userId ? state.users.find((item) => item.id === parsed.userId) : state.users.find((item) => item.username === parsed.username);
    if (!user) return null;
    return { userId: user.id, username: user.username };
  } catch {
    return null;
  }
}
async function requireAdmin(event) {
  const session = await getAdminSession(event);
  if (!session) throw createError({ statusCode: 401, statusMessage: "Admin authentication required" });
  return session;
}

export { clearAdminSession as a, createSessionToken as c, getAdminSession as g, hashPassword as h, requireAdmin as r, setAdminSession as s, verifyPassword as v };
//# sourceMappingURL=admin-auth.mjs.map
