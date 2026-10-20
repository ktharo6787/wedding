import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { createError, defineEventHandler, getRouterParam, sendStream, setHeader } from 'h3'
import { dataDirectory } from '../../../utils/admin-store'

const contentTypes: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' }

export default defineEventHandler(async (event) => {
  const name = basename(String(getRouterParam(event, 'name') || ''))
  const path = join(dataDirectory, 'uploads', name)
  try {
    await stat(path)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }
  setHeader(event, 'content-type', contentTypes[extname(name).toLowerCase()] || 'application/octet-stream')
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return sendStream(event, createReadStream(path))
})
