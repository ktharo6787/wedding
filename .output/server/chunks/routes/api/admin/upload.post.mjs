import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { d as defineEventHandler, a as readMultipartFormData, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../_/admin-auth.mjs';
import { h as dataDirectory } from '../../../_/admin-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'pg';

const imageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};
const upload_post = defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const fields = await readMultipartFormData(event);
  const file = fields == null ? void 0 : fields.find((field) => field.name === "file" && field.data);
  if (!file) throw createError({ statusCode: 400, statusMessage: "Choose an image to upload" });
  const extension = imageTypes[file.type || ""];
  if (!extension) throw createError({ statusCode: 400, statusMessage: "Only JPG, PNG, WEBP and GIF images are supported" });
  if (file.data.byteLength > 8 * 1024 * 1024) throw createError({ statusCode: 400, statusMessage: "Image must be smaller than 8 MB" });
  const uploadsDirectory = join(dataDirectory, "uploads");
  await mkdir(uploadsDirectory, { recursive: true });
  const filename = `${session.userId}-${Date.now()}-${randomBytes(4).toString("hex")}.${extension}`;
  await writeFile(join(uploadsDirectory, filename), file.data);
  return { ok: true, url: `/api/public/media/${filename}`, filename };
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
