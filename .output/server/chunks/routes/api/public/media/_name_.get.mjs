import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { basename, join, extname } from 'node:path';
import { d as defineEventHandler, f as getRouterParam, c as createError, h as setHeader, i as sendStream } from '../../../../nitro/nitro.mjs';
import { h as dataDirectory } from '../../../../_/admin-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:crypto';
import 'node:url';
import 'pg';

const contentTypes = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml" };
const _name__get = defineEventHandler(async (event) => {
  const name = basename(String(getRouterParam(event, "name") || ""));
  const path = join(dataDirectory, "uploads", name);
  try {
    await stat(path);
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Image not found" });
  }
  setHeader(event, "content-type", contentTypes[extname(name).toLowerCase()] || "application/octet-stream");
  setHeader(event, "cache-control", "public, max-age=31536000, immutable");
  return sendStream(event, createReadStream(path));
});

export { _name__get as default };
//# sourceMappingURL=_name_.get.mjs.map
