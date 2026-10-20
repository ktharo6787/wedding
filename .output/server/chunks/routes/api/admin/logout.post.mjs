import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { a as clearAdminSession } from '../../../_/admin-auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../../_/admin-store.mjs';
import 'node:fs/promises';
import 'pg';

const logout_post = defineEventHandler((event) => {
  clearAdminSession(event);
  return { ok: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
