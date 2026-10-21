import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { randomBytes, randomUUID } from 'node:crypto'
import { Pool } from 'pg'
import { invitation as invitationDefaults } from '../../data/invitation'

export type GuestStatus = 'pending' | 'attending' | 'declined'
export type ExpenseStatus = 'planned' | 'deposit' | 'paid' | 'overdue'

export interface Guest {
  id: string
  name: string
  phone: string
  email: string
  group: string
  giftAmount: number
  giftCurrency: 'USD' | 'KHR'
  partySize: number
  attendingCount: number
  status: GuestStatus
  inviteCode: string
  table: string
  notes: string
  openedAt: string
  respondedAt: string
  createdAt: string
}

export interface Expense {
  id: string
  category: string
  item: string
  vendor: string
  budgeted: number
  actual: number
  paid: number
  dueDate: string
  status: ExpenseStatus
  notes: string
  createdAt: string
}

export interface WeddingTheme {
  template: 'emerald' | 'ivory' | 'royal'
  background: string
  panel: string
  gold: string
  text: string
  muted: string
  backgroundImage: string
  openingCrestImage: string
  heroEmblemImage: string
  butterflyImage: string
  frameImage: string
  fontStyle: 'classic' | 'romantic' | 'modern'
  animations: boolean
  butterflies: boolean
  content: {
    openingEyebrow: string
    announcement: string
    invitationMessage: string
    programmeSubtitle: string
    detailsSubtitle: string
    giftsSubtitle: string
    rsvpSubtitle: string
    footerMessage: string
  }
}

export interface User {
  id: string
  username: string
  passwordHash: string
  passwordSalt: string
  createdAt: string
}

export interface WeddingProject {
  id: string
  ownerId: string
  name: string
  slug: string
  published: boolean
  guests: Guest[]
  expenses: Expense[]
  theme: WeddingTheme
  invitation: typeof invitationDefaults
  createdAt: string
  updatedAt: string
}

export interface AdminState {
  version: number
  users: User[]
  projects: WeddingProject[]
  sessionSecret: string
  updatedAt: string
}

export const defaultTheme: WeddingTheme = {
  template: 'emerald',
  background: '#0c422f',
  panel: '#082923',
  gold: '#dfbd75',
  text: '#f2e6c9',
  muted: '#d6c9ac',
  backgroundImage: '/images/interior-background.jpg',
  openingCrestImage: '/images/gold-khmer-emblem-cutout.png',
  heroEmblemImage: '/images/gold-wedding-monogram.png',
  butterflyImage: '/images/animated-butterfly.png',
  frameImage: '',
  fontStyle: 'classic',
  animations: true,
  butterflies: true,
  content: {
    openingEyebrow: 'A WEDDING INVITATION',
    announcement: "WE'RE GETTING MARRIED",
    invitationMessage: 'Request the Honor of Your Presence on the Auspicious Occasion of the Wedding Reception of Our Children',
    programmeSubtitle: 'We look forward to sharing each beautiful moment with you.',
    detailsSubtitle: 'Everything you need for our special day.',
    giftsSubtitle: 'Your presence is our most precious gift.',
    rsvpSubtitle: 'Please respond by {deadline}.',
    footerMessage: 'We cannot wait to celebrate with you.'
  }
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'wedding'
}

function hydrateTheme(raw?: Partial<WeddingTheme> | null): WeddingTheme {
  return { ...structuredClone(defaultTheme), ...(raw || {}), content: { ...defaultTheme.content, ...(raw?.content || {}) } }
}

function hydrateInvitation(raw?: Partial<typeof invitationDefaults> | null) {
  const oldSampleSchedules = [
    ['6:00 AM|7:00 AM|8:00 AM|10:30 AM', 'ពិធីសែនព្រេន|ពិធីហែជំនូន|ពិធីសូត្រមន្ត|ពិធីចងដៃ'],
    ['5:00 AM|7:00 AM|8:00 AM|8:45 AM|9:00 AM|10:30 AM|11:30 AM|5:00 PM', 'ពិធីសែនព្រេន|ពិធីហែជំនូន|ពិធីទទួលជំនូន|ពិធីសូត្រមន្ត|ពិធីកាត់សក់|ពិធីចងដៃ|ពិធីជូនពរ និងថតរូប|ទទួលភ្ញៀវពេលល្ងាច']
  ]
  const savedSchedule = Array.isArray(raw?.ceremonyEvents) ? raw.ceremonyEvents : []
  const savedTimes = savedSchedule.map((event: any) => String(event?.time || '')).join('|')
  const savedTitles = savedSchedule.map((event: any) => String(event?.title || '')).join('|')
  const shouldRefreshOldSample = oldSampleSchedules.some(([times, titles]) => savedTimes === times && savedTitles === titles)
  return {
    ...structuredClone(invitationDefaults),
    ...(raw || {}),
    ceremonyTime: raw?.ceremonyTime === '5:00 AM' || shouldRefreshOldSample ? invitationDefaults.ceremonyTime : raw?.ceremonyTime || invitationDefaults.ceremonyTime,
    ceremonyEvents: shouldRefreshOldSample ? structuredClone(invitationDefaults.ceremonyEvents) : raw?.ceremonyEvents || invitationDefaults.ceremonyEvents,
    couple: { ...invitationDefaults.couple, ...(raw?.couple || {}) },
    parents: {
      groom: raw?.parents?.groom || invitationDefaults.parents.groom,
      bride: raw?.parents?.bride || invitationDefaults.parents.bride
    }
  }
}

export function createProject(ownerId: string, partial: Partial<WeddingProject> = {}): WeddingProject {
  const now = new Date().toISOString()
  return {
    id: String(partial.id || randomUUID()),
    ownerId,
    name: String(partial.name || 'Our Wedding').trim().slice(0, 100),
    slug: slugify(String(partial.slug || partial.name || `wedding-${randomBytes(3).toString('hex')}`)),
    published: partial.published !== false,
    guests: Array.isArray(partial.guests) ? partial.guests.map(createGuest) : [],
    expenses: Array.isArray(partial.expenses) ? partial.expenses.map(createExpense) : [],
    theme: hydrateTheme(partial.theme),
    invitation: hydrateInvitation(partial.invitation),
    createdAt: String(partial.createdAt || now),
    updatedAt: String(partial.updatedAt || now)
  }
}

function freshState(): AdminState {
  return { version: 2, users: [], projects: [], sessionSecret: randomBytes(32).toString('hex'), updatedAt: new Date().toISOString() }
}

function hydrateState(raw?: any): AdminState {
  const base = freshState()
  if (!raw) return base
  if (Array.isArray(raw.users) && Array.isArray(raw.projects)) {
    return {
      ...base,
      users: raw.users,
      projects: raw.projects.map((project: WeddingProject) => createProject(project.ownerId, project)),
      sessionSecret: raw.sessionSecret || base.sessionSecret,
      updatedAt: raw.updatedAt || base.updatedAt
    }
  }
  if (raw.owner) {
    const user: User = {
      id: 'legacy-owner',
      username: raw.owner.username,
      passwordHash: raw.owner.passwordHash,
      passwordSalt: raw.owner.passwordSalt,
      createdAt: raw.owner.createdAt || new Date().toISOString()
    }
    return {
      version: 2,
      users: [user],
      projects: [createProject(user.id, {
        id: 'legacy-wedding',
        name: 'Tharo & Theany Wedding',
        slug: 'tharo-theany',
        guests: raw.guests,
        expenses: raw.expenses,
        theme: raw.theme,
        invitation: raw.invitation,
        createdAt: user.createdAt,
        updatedAt: raw.updatedAt
      })],
      sessionSecret: raw.sessionSecret || base.sessionSecret,
      updatedAt: raw.updatedAt || base.updatedAt
    }
  }
  return base
}

const projectRoot = basename(process.cwd()) === '.output' ? dirname(process.cwd()) : process.cwd()
export const dataDirectory = process.env.WEDDING_DATA_DIR || join(projectRoot, '.data')
const dataFile = join(dataDirectory, 'wedding-admin.json')
let pool: Pool | null = null
let operationQueue = Promise.resolve()

async function postgresPool() {
  if (!process.env.DATABASE_URL) return null
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false } })
    await pool.query(`CREATE TABLE IF NOT EXISTS wedding_admin_state (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`)
  }
  return pool
}

async function readStateDirect(): Promise<AdminState> {
  const postgres = await postgresPool()
  if (postgres) {
    const result = await postgres.query('SELECT data FROM wedding_admin_state WHERE id = $1', ['primary'])
    const state = hydrateState(result.rows[0]?.data)
    if (result.rows[0]?.data?.version !== 2) await writeStateDirect(state)
    return state
  }
  try {
    const raw = JSON.parse(await readFile(dataFile, 'utf8'))
    const state = hydrateState(raw)
    if (raw.version !== 2) await writeStateDirect(state)
    return state
  } catch (error: any) {
    if (error?.code !== 'ENOENT') throw error
    const state = freshState()
    await writeStateDirect(state)
    return state
  }
}

async function writeStateDirect(state: AdminState) {
  state.updatedAt = new Date().toISOString()
  const postgres = await postgresPool()
  if (postgres) {
    await postgres.query(`INSERT INTO wedding_admin_state (id, data, updated_at) VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`, ['primary', JSON.stringify(state)])
    return
  }
  await mkdir(dataDirectory, { recursive: true })
  const temporaryFile = `${dataFile}.${randomUUID()}.tmp`
  await writeFile(temporaryFile, JSON.stringify(state, null, 2), 'utf8')
  await rename(temporaryFile, dataFile)
}

export async function getAdminState() {
  return readStateDirect()
}

export async function updateAdminState(mutator: (state: AdminState) => void | Promise<void>) {
  let updated!: AdminState
  const operation = operationQueue.then(async () => {
    const state = await readStateDirect()
    await mutator(state)
    await writeStateDirect(state)
    updated = state
  })
  operationQueue = operation.catch(() => undefined)
  await operation
  return updated
}

export function findOwnedProject(state: AdminState, userId: string, projectId?: string) {
  return (projectId ? state.projects.find(item => item.id === projectId && item.ownerId === userId) : state.projects.find(item => item.ownerId === userId)) || null
}

export function findPublicProject(state: AdminState, slug?: string) {
  return (slug ? state.projects.find(project => project.slug === slug && project.published) : state.projects.find(project => project.published)) || null
}

export function uniqueSlug(state: AdminState, desired: string, excludeProjectId = '') {
  const base = slugify(desired)
  let slug = base
  let suffix = 2
  while (state.projects.some(project => project.id !== excludeProjectId && project.slug === slug)) slug = `${base}-${suffix++}`
  return slug
}

export function createGuest(partial: Partial<Guest>): Guest {
  const now = new Date().toISOString()
  return {
    id: String(partial.id || randomUUID()), name: String(partial.name || '').trim(), phone: String(partial.phone || '').trim(), email: '', group: String(partial.group || '').trim(),
    giftAmount: Math.max(0, Number(partial.giftAmount) || 0), giftCurrency: partial.giftCurrency === 'KHR' ? 'KHR' : 'USD',
    partySize: Math.max(1, Number(partial.partySize) || 1), attendingCount: Math.max(0, Number(partial.attendingCount) || 0),
    status: ['pending', 'attending', 'declined'].includes(String(partial.status)) ? partial.status as GuestStatus : 'pending',
    inviteCode: String(partial.inviteCode || randomBytes(5).toString('hex')).trim(), table: String(partial.table || '').trim(), notes: String(partial.notes || '').trim(), openedAt: String(partial.openedAt || ''), respondedAt: String(partial.respondedAt || ''), createdAt: String(partial.createdAt || now)
  }
}

export function createExpense(partial: Partial<Expense>): Expense {
  return {
    id: String(partial.id || randomUUID()), category: String(partial.category || 'General').trim(), item: String(partial.item || '').trim(), vendor: String(partial.vendor || '').trim(),
    budgeted: Math.max(0, Number(partial.budgeted) || 0), actual: Math.max(0, Number(partial.actual) || 0), paid: Math.max(0, Number(partial.paid) || 0), dueDate: String(partial.dueDate || ''),
    status: ['planned', 'deposit', 'paid', 'overdue'].includes(String(partial.status)) ? partial.status as ExpenseStatus : 'planned', notes: String(partial.notes || '').trim(), createdAt: String(partial.createdAt || new Date().toISOString())
  }
}
