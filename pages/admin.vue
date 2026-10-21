<script setup lang="ts">
import * as XLSX from 'xlsx'

useHead({ title: 'Wedding Control Centre' })

type AdminTab = 'overview' | 'guests' | 'expenses' | 'theme'

const loading = ref(true)
const saving = ref(false)
const autosaveReady = ref(false)
const notice = ref('')
const toast = ref({ message: '', type: 'success' as 'success' | 'error' | 'info' })
const errorMessage = ref('')
const activeTab = ref<AdminTab>('overview')
const configured = ref(false)
const authenticated = ref(false)
const registerMode = ref(false)
const storage = ref('local')
const credentials = reactive({ username: '', password: '', confirm: '' })
const projects = ref<any[]>([])
const selectedProjectId = ref('')
const showProjectCreator = ref(false)
const newProject = reactive({ name: '', slug: '' })
const uploadingAsset = ref('')
const guestSearch = ref('')
const guestGroupFilter = ref('all')
const guestGroupSearch = computed({
  get: () => guestGroupFilter.value === 'all' ? '' : guestGroupFilter.value,
  set: (value: string) => { guestGroupFilter.value = value.trim() || 'all' }
})
const guestGroupPickerOpen = ref(false)
const guestGroupPickerQuery = ref('')
const filteredGuestGroups = computed(() => guestGroups.value.filter((group: string) => group.toLocaleLowerCase().includes(guestGroupPickerQuery.value.toLocaleLowerCase())))
const guestImportInput = ref<HTMLInputElement | null>(null)
const editingGuestNameId = ref('')
const newGuestId = ref('')
const tableFullscreen = ref(false)
const expenseFullscreen = ref(false)
const guestFilter = ref<'all' | 'pending' | 'attending' | 'declined' | 'gift'>('all')
const guestDisplayLimit = ref(40)
const guestsPerLoad = 40
const expenseSearch = ref('')
const expenseDisplayLimit = ref(40)
const expensesPerLoad = 40
const dashboard = ref<any>(null)
let autosaveTimer: ReturnType<typeof setTimeout> | undefined
let noticeTimer: ReturnType<typeof setTimeout> | undefined
let toastTimer: ReturnType<typeof setTimeout> | undefined
let rsvpPollTimer: ReturnType<typeof setInterval> | undefined
let pendingSaveToast = ''
let lastSavedSnapshot = ''
const adminData = reactive<any>({
  guests: [],
  expenses: [],
  theme: {
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
    content: {}
  },
  invitation: {
    couple: {},
    parents: { groom: ['', ''], bride: ['', ''] }
  }
})

const filteredGuests = computed(() => {
  const query = guestSearch.value.toLowerCase().trim()
  return adminData.guests.filter((guest: any) => {
    const matchesQuery = !query || [guest.name, guest.group, guest.status].some(value => String(value || '').toLowerCase().includes(query))
    const matchesFilter = guestFilter.value === 'all' || (guestFilter.value === 'gift' ? Number(guest.giftAmount || 0) <= 0 : guest.status === guestFilter.value)
    const matchesGroup = guestGroupFilter.value === 'all' || String(guest.group || '').trim().toLocaleLowerCase() === guestGroupFilter.value.trim().toLocaleLowerCase()
    return matchesQuery && matchesFilter && matchesGroup
  })
})
const guestGroups = computed(() => [...new Set(adminData.guests.map((guest: any) => String(guest.group || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)))
const visibleGuests = computed(() => filteredGuests.value.slice(0, guestDisplayLimit.value))
const giftSummary = computed(() => ({
  received: adminData.guests.filter((guest: any) => Number(guest.giftAmount || 0) > 0).length,
  usd: adminData.guests.reduce((total: number, guest: any) => total + (guest.giftCurrency === 'USD' ? Number(guest.giftAmount || 0) : 0), 0),
  khr: adminData.guests.reduce((total: number, guest: any) => total + (guest.giftCurrency === 'KHR' ? Number(guest.giftAmount || 0) : 0), 0)
}))

watch([guestSearch, guestFilter, guestGroupFilter], () => { guestDisplayLimit.value = guestsPerLoad })

const filteredExpenses = computed(() => {
  const query = expenseSearch.value.toLowerCase().trim()
  if (!query) return adminData.expenses
  return adminData.expenses.filter((expense: any) => [expense.category, expense.item, expense.vendor, expense.status].some(value => String(value || '').toLowerCase().includes(query)))
})
const visibleExpenses = computed(() => filteredExpenses.value.slice(0, expenseDisplayLimit.value))
const expenseSummary = computed(() => ({
  budgeted: adminData.expenses.reduce((total: number, expense: any) => total + Number(expense.budgeted || 0), 0),
  actual: adminData.expenses.reduce((total: number, expense: any) => total + Number(expense.actual || 0), 0),
  paid: adminData.expenses.reduce((total: number, expense: any) => total + Number(expense.paid || 0), 0),
  outstanding: adminData.expenses.reduce((total: number, expense: any) => total + Math.max(0, Number(expense.actual || 0) - Number(expense.paid || 0)), 0)
}))

watch(expenseSearch, () => { expenseDisplayLimit.value = expensesPerLoad })

const invitationBaseUrl = ref('')
const currentProject = computed(() => projects.value.find(project => project.id === selectedProjectId.value) || null)
const publicInvitationUrl = computed(() => currentProject.value ? `${invitationBaseUrl.value}/?wedding=${encodeURIComponent(currentProject.value.slug)}` : invitationBaseUrl.value)
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const attendanceRate = computed(() => {
  const invited = dashboard.value?.guests?.invitedPeople || 0
  return invited ? Math.round((dashboard.value.guests.attendingPeople / invited) * 100) : 0
})
const budgetRate = computed(() => {
  const budgeted = dashboard.value?.budget?.budgeted || 0
  return budgeted ? Math.min(100, Math.round((dashboard.value.budget.actual / budgeted) * 100)) : 0
})

function messageFrom(error: any) {
  return error?.data?.statusMessage || error?.statusMessage || error?.message || 'Something went wrong'
}

function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  toast.value = { message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.message = '' }, 2600)
}

async function prepareWorkspace() {
  const status = await $fetch<any>('/api/admin/status')
  projects.value = status.projects || []
  const savedProjectId = localStorage.getItem('wedding-project-id') || ''
  selectedProjectId.value = projects.value.some(project => project.id === savedProjectId)
    ? savedProjectId
    : projects.value[0]?.id || ''
  if (selectedProjectId.value) localStorage.setItem('wedding-project-id', selectedProjectId.value)
  if (!selectedProjectId.value) throw new Error('Your account has no wedding project yet. Please contact support.')
  await loadData()
}

async function initialize() {
  loading.value = true
  errorMessage.value = ''
  try {
    const status = await $fetch<any>('/api/admin/status')
    configured.value = status.configured
    authenticated.value = status.authenticated
    credentials.username = status.username || ''
    projects.value = status.projects || []
    if (authenticated.value) {
      selectedProjectId.value = localStorage.getItem('wedding-project-id') || projects.value[0]?.id || ''
      if (!projects.value.some(project => project.id === selectedProjectId.value)) selectedProjectId.value = projects.value[0]?.id || ''
      await loadData()
    }
  } catch (error) {
    errorMessage.value = messageFrom(error)
  } finally {
    loading.value = false
  }
}

async function setupOwner() {
  errorMessage.value = ''
  if (credentials.password !== credentials.confirm) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  try {
    await $fetch('/api/admin/setup', { method: 'POST', body: credentials })
    configured.value = true
    authenticated.value = true
    credentials.password = ''
    credentials.confirm = ''
    await prepareWorkspace()
  } catch (error) {
    errorMessage.value = messageFrom(error)
  }
}

async function login() {
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: credentials })
    authenticated.value = true
    credentials.password = ''
    await prepareWorkspace()
  } catch (error) {
    errorMessage.value = messageFrom(error)
  }
}

async function register() {
  errorMessage.value = ''
  if (credentials.password !== credentials.confirm) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  try {
    await $fetch('/api/admin/register', { method: 'POST', body: credentials })
    authenticated.value = true
    configured.value = true
    registerMode.value = false
    credentials.password = ''
    credentials.confirm = ''
    const status = await $fetch<any>('/api/admin/status')
    projects.value = status.projects || []
    selectedProjectId.value = projects.value[0]?.id || ''
    await loadData()
  } catch (error) {
    errorMessage.value = messageFrom(error)
  }
}

async function logout() {
  autosaveReady.value = false
  if (autosaveTimer) clearTimeout(autosaveTimer)
  await $fetch('/api/admin/logout', { method: 'POST' })
  authenticated.value = false
  dashboard.value = null
}

async function loadData() {
  if (!selectedProjectId.value) return
  autosaveReady.value = false
  const [data, metrics] = await Promise.all([
    $fetch<any>('/api/admin/data', { query: { projectId: selectedProjectId.value } }),
    $fetch<any>('/api/admin/dashboard', { query: { projectId: selectedProjectId.value } })
  ])
  Object.assign(adminData, data)
  const projectIndex = projects.value.findIndex(project => project.id === data.project.id)
  if (projectIndex >= 0) projects.value[projectIndex] = { ...projects.value[projectIndex], ...data.project }
  dashboard.value = metrics
  storage.value = data.storage
  await nextTick()
  lastSavedSnapshot = JSON.stringify(savePayload())
  autosaveReady.value = true
}

function savePayload() {
  return {
    projectId: selectedProjectId.value,
    project: adminData.project,
    guests: adminData.guests,
    expenses: adminData.expenses,
    theme: adminData.theme,
    invitation: adminData.invitation
  }
}

function scheduleAutosave() {
  if (!autosaveReady.value || !authenticated.value) return
  if (autosaveTimer) clearTimeout(autosaveTimer)
  notice.value = 'Unsaved changes'
  autosaveTimer = setTimeout(() => saveAll(), 800)
}

async function saveAll(toastMessage = '') {
  if (!autosaveReady.value) return
  if (toastMessage) pendingSaveToast = toastMessage
  if (saving.value) {
    scheduleAutosave()
    return
  }
  const body = savePayload()
  const snapshot = JSON.stringify(body)
  if (snapshot === lastSavedSnapshot) {
    if (pendingSaveToast) {
      showToast(pendingSaveToast)
      pendingSaveToast = ''
    }
    return
  }
  saving.value = true
  notice.value = 'Saving changes…'
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/data', {
      method: 'PUT',
      body
    })
    lastSavedSnapshot = snapshot
    if (currentProject.value && adminData.project) Object.assign(currentProject.value, adminData.project)
    dashboard.value = await $fetch<any>('/api/admin/dashboard', { query: { projectId: selectedProjectId.value } })
    notice.value = 'All changes saved'
    if (pendingSaveToast) {
      showToast(pendingSaveToast)
      pendingSaveToast = ''
    }
    if (noticeTimer) clearTimeout(noticeTimer)
    noticeTimer = setTimeout(() => { if (!saving.value) notice.value = 'Autosave on' }, 1800)
  } catch (error) {
    errorMessage.value = messageFrom(error)
    notice.value = 'Autosave failed'
    showToast('Unable to save changes', 'error')
    pendingSaveToast = ''
  } finally {
    saving.value = false
    if (JSON.stringify(savePayload()) !== lastSavedSnapshot) scheduleAutosave()
  }
}

watch(adminData, scheduleAutosave, { deep: true, flush: 'post' })

watch(activeTab, (tab) => {
  if (!import.meta.client) return
  localStorage.setItem('wedding-admin-tab', tab)
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${tab}`)
})

function randomHex(length: number) {
  const bytes = new Uint8Array(Math.ceil(length / 2))
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256)
  }
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length)
}

function createClientId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID()
  return `${Date.now().toString(36)}-${randomHex(24)}`
}

function addGuest() {
  guestSearch.value = ''
  guestFilter.value = 'all'
  guestGroupFilter.value = 'all'
  guestDisplayLimit.value = guestsPerLoad
  const id = createClientId()
  newGuestId.value = id
  adminData.guests.unshift({
    id,
    name: '',
    phone: '',
    email: '',
    group: '',
    giftAmount: 0,
    giftCurrency: 'USD',
    partySize: 1,
    attendingCount: 0,
    status: 'pending',
    inviteCode: randomHex(10),
    table: '',
    notes: '',
    openedAt: '',
    respondedAt: '',
    createdAt: new Date().toISOString()
  })
  nextTick(() => {
    document.querySelector('.guest-sheet-wrap')?.scrollTo({ top: 0, behavior: 'smooth' })
    document.querySelector<HTMLInputElement>(`[data-guest-id="${id}"] .sheet-name input`)?.focus()
  })
}

function downloadWorkbook(filename: string, sheets: { name: string, rows: any[][] }[]) {
  const workbook = XLSX.utils.book_new()
  for (const sheet of sheets) {
    const worksheet = XLSX.utils.aoa_to_sheet(sheet.rows)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
  }
  XLSX.writeFile(workbook, filename)
}

function workbookGuestRow(guest: any) {
  return [guest.name, guest.group, Number(guest.partySize || 1), guest.status, Number(guest.giftAmount || 0), guest.giftCurrency || 'USD', guest.notes || '']
}

function exportGuests() {
  const rows = [['Guest name', 'Family / group', 'Invited', 'RSVP', 'Monetary gift', 'Currency', 'Note'], ...filteredGuests.value.map(workbookGuestRow)]
  downloadWorkbook('wedding-guests.xlsx', [{ name: 'Guests', rows }])
  showToast(`Exported ${filteredGuests.value.length} guests`)
}

function downloadGuestTemplate() {
  downloadWorkbook('guest-import-template.xlsx', [
    { name: 'Guests', rows: [
      ['Guest name', 'Family / group', 'Invited', 'RSVP', 'Monetary gift', 'Currency', 'Note'],
      ['Example: Sokha Chan and spouse', 'ប៉ាកូនកំលោះ', 2, 'pending', 0, 'USD', 'Optional note']
    ] },
    { name: 'Instructions', rows: [
      ['Guest import template'],
      ['Fill in the Guests sheet and remove the example row before importing.'],
      ['Guest name is required. Family / group can be any group name.'],
      ['Invited is the party size. RSVP accepts pending, attending, or declined.'],
      ['Monetary gift is a number. Currency accepts USD or KHR. Note is optional.'],
      ['Import adds guests to the current wedding; it does not replace existing guests.']
    ] }
  ])
  showToast('Guest import template downloaded')
}

function normalizedHeader(value: unknown) {
  return String(value || '').normalize('NFKC').toLowerCase().replace(/[\s_./-]+/g, '').trim()
}

function importCell(row: Record<string, any>, aliases: string[]) {
  const found = Object.keys(row).find(key => aliases.includes(normalizedHeader(key)))
  return found ? row[found] : undefined
}

async function importGuests(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true })
    const sheet = workbook.Sheets.Guests || workbook.Sheets[workbook.SheetNames[0]]
    if (!sheet) throw new Error('The workbook has no guest worksheet')
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' })
    const imported = rows.map(row => {
      const name = String(importCell(row, ['guestname', 'name', 'fullname']) ?? '').trim()
      if (!name || /^example\s*:/i.test(name)) return null
      const group = String(importCell(row, ['familygroup', 'group', 'family']) ?? '').trim()
      const partySize = Math.max(1, Math.floor(Number(importCell(row, ['invited', 'partysize', 'guests']) || 1)))
      const statusText = String(importCell(row, ['rsvp', 'status', 'attendance']) || 'pending').toLowerCase().trim()
      const status = ['attending', 'yes', 'confirmed'].includes(statusText) ? 'attending' : ['declined', 'no'].includes(statusText) ? 'declined' : 'pending'
      const giftAmount = Math.max(0, Number(importCell(row, ['monetarygift', 'giftamount', 'gift']) || 0))
      const currencyText = String(importCell(row, ['currency', 'giftcurrency']) || 'USD').toUpperCase().trim()
      const now = new Date().toISOString()
      return {
        id: createClientId(), name, phone: '', email: '', group,
        giftAmount: Number.isFinite(giftAmount) ? giftAmount : 0,
        giftCurrency: currencyText === 'KHR' ? 'KHR' : 'USD', partySize, attendingCount: status === 'attending' ? partySize : 0,
        status, inviteCode: randomHex(10), table: '',
        notes: String(importCell(row, ['note', 'notes']) || '').trim(), openedAt: '', respondedAt: '', createdAt: now
      }
    }).filter(Boolean) as any[]
    if (!imported.length) throw new Error('No guest names found. Use the Guest name column in the sample template.')
    if (adminData.guests.length + imported.length > 5000) throw new Error('A wedding can contain at most 5,000 guests.')
    adminData.guests.unshift(...imported)
    guestSearch.value = ''
    guestFilter.value = 'all'
    guestGroupFilter.value = 'all'
    guestDisplayLimit.value = Math.max(guestsPerLoad, imported.length)
    showToast(`Imported ${imported.length} guests`)
    nextTick(() => document.querySelector('.guest-sheet-wrap')?.scrollTo({ top: 0, behavior: 'smooth' }))
  } catch (error: any) {
    showToast(error?.message || 'Unable to import this Excel file', 'error')
  } finally {
    input.value = ''
  }
}

function addExpense() {
  expenseSearch.value = ''
  expenseDisplayLimit.value = expensesPerLoad
  adminData.expenses.unshift({
    id: createClientId(),
    category: 'General',
    item: '',
    vendor: '',
    budgeted: 0,
    actual: 0,
    paid: 0,
    dueDate: '',
    status: 'planned',
    notes: '',
    createdAt: new Date().toISOString()
  })
  nextTick(() => {
    document.querySelector('.expense-sheet-wrap')?.scrollTo({ top: 0, behavior: 'smooth' })
    document.querySelector<HTMLInputElement>('.expense-sheet-table tbody tr:first-child .expense-item-input')?.focus()
  })
}

function removeGuest(id: string) {
  const guest = adminData.guests.find((item: any) => item.id === id)
  if (!window.confirm(`Delete ${guest?.name || 'this guest'}? This action will be applied when you save changes.`)) return
  adminData.guests = adminData.guests.filter((guest: any) => guest.id !== id)
}

function guestMatchesSearch(guest: any) {
  const query = guestSearch.value.toLowerCase().trim()
  return Boolean(query) && [guest.name, guest.group, guest.status].some(value => String(value || '').toLowerCase().includes(query))
}

function guestNameParts(name: string) {
  const value = String(name || '')
  const query = guestSearch.value.trim()
  if (!query) return [{ text: value, match: false }]
  const index = value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
  if (index < 0) return [{ text: value, match: false }]
  return [
    { text: value.slice(0, index), match: false },
    { text: value.slice(index, index + query.length), match: true },
    { text: value.slice(index + query.length), match: false }
  ].filter(part => part.text)
}

function handleGuestTableScroll(event: Event) {
  const element = event.currentTarget as HTMLElement
  if (element.scrollTop + element.clientHeight < element.scrollHeight - 180) return
  if (guestDisplayLimit.value < filteredGuests.value.length) guestDisplayLimit.value += guestsPerLoad
}

function openGuestFullscreen() {
  tableFullscreen.value = true
  nextTick(() => document.querySelector<HTMLElement>('.guest-sheet-wrap.fullscreen')?.scrollTo({ top: 0, left: 0 }))
}

function handleCommitEnter(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229) return
  const target = event.target as HTMLElement
  if (!['INPUT', 'SELECT'].includes(target.tagName)) return
  if (target.closest('.admin-search, .fullscreen-search')) return
  event.preventDefault()
  target.blur()
  if (autosaveTimer) clearTimeout(autosaveTimer)
  nextTick(() => saveAll('Changes saved'))
}

function handleAdminKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    tableFullscreen.value = false
    expenseFullscreen.value = false
  }
}

function removeExpense(id: string) {
  const expense = adminData.expenses.find((item: any) => item.id === id)
  if (!window.confirm(`Delete ${expense?.item || 'this expense'}? This cannot be undone.`)) return
  adminData.expenses = adminData.expenses.filter((expense: any) => expense.id !== id)
}

function handleExpenseTableScroll(event: Event) {
  const element = event.currentTarget as HTMLElement
  if (element.scrollTop + element.clientHeight < element.scrollHeight - 180) return
  if (expenseDisplayLimit.value < filteredExpenses.value.length) expenseDisplayLimit.value += expensesPerLoad
}

function openExpenseFullscreen() {
  expenseFullscreen.value = true
  nextTick(() => document.querySelector<HTMLElement>('.expense-sheet-wrap.fullscreen')?.scrollTo({ top: 0, left: 0 }))
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

async function copyInvite(code: string) {
  try {
    const copied = await copyText(`${publicInvitationUrl.value}&invite=${encodeURIComponent(code)}`)
    notice.value = copied ? 'Invitation link copied' : 'Unable to copy invitation link'
    showToast(copied ? 'Invitation link copied' : 'Unable to copy invitation link', copied ? 'success' : 'error')
  } catch {
    notice.value = 'Unable to copy invitation link'
    showToast('Unable to copy invitation link', 'error')
  }
  window.setTimeout(() => { notice.value = '' }, 1800)
}

async function syncRsvpResponses() {
  if (!authenticated.value || !selectedProjectId.value || saving.value) return
  if (JSON.stringify(savePayload()) !== lastSavedSnapshot) return
  try {
    const data = await $fetch<any>('/api/admin/data', { query: { projectId: selectedProjectId.value } })
    const localGuests = new Map(adminData.guests.map((guest: any) => [guest.id, guest]))
    const responses: string[] = []
    for (const incoming of data.guests || []) {
      const local = localGuests.get(incoming.id) as any
      if (!local) {
        adminData.guests.unshift(incoming)
        if (incoming.respondedAt) responses.push(`${incoming.name} responded ${incoming.status}`)
        continue
      }
      if (incoming.respondedAt && incoming.respondedAt !== local.respondedAt) {
        responses.push(`${incoming.name} responded ${incoming.status}`)
        Object.assign(local, {
          status: incoming.status,
          attendingCount: incoming.attendingCount,
          partySize: incoming.partySize,
          notes: incoming.notes,
          openedAt: incoming.openedAt,
          respondedAt: incoming.respondedAt
        })
      }
    }
    if (responses.length) {
      lastSavedSnapshot = JSON.stringify(savePayload())
      showToast(responses.length === 1 ? responses[0] : `${responses.length} new RSVP responses`, 'info')
      dashboard.value = await $fetch<any>('/api/admin/dashboard', { query: { projectId: selectedProjectId.value } })
    }
  } catch {}
}

async function selectProject() {
  localStorage.setItem('wedding-project-id', selectedProjectId.value)
  await loadData()
}

async function createWedding() {
  errorMessage.value = ''
  try {
    const project = await $fetch<any>('/api/admin/projects', { method: 'POST', body: newProject })
    projects.value.push(project)
    selectedProjectId.value = project.id
    localStorage.setItem('wedding-project-id', project.id)
    newProject.name = ''
    newProject.slug = ''
    showProjectCreator.value = false
    await loadData()
    notice.value = 'Wedding project created'
  } catch (error) {
    errorMessage.value = messageFrom(error)
  }
}

async function uploadAsset(event: Event, field: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingAsset.value = field
  errorMessage.value = ''
  try {
    const body = new FormData()
    body.append('file', file)
    const result = await $fetch<any>('/api/admin/upload', { method: 'POST', body })
    adminData.theme[field] = result.url
    notice.value = 'Image uploaded. Save changes to publish it.'
  } catch (error) {
    errorMessage.value = messageFrom(error)
  } finally {
    uploadingAsset.value = ''
    input.value = ''
  }
}

const templatePresets: Record<string, any> = {
  emerald: { background: '#0c422f', panel: '#082923', gold: '#dfbd75', text: '#f2e6c9', muted: '#d6c9ac', backgroundImage: '/images/interior-background.jpg', fontStyle: 'classic' },
  ivory: { background: '#eee4cf', panel: '#fffaf0', gold: '#9f7734', text: '#3e3224', muted: '#786b57', backgroundImage: '/images/ivory-damask.svg', fontStyle: 'romantic' },
  royal: { background: '#35151d', panel: '#4b1d27', gold: '#e0b75e', text: '#fff1d5', muted: '#ddcbb0', backgroundImage: '/images/khmer-pattern.svg', fontStyle: 'classic' }
}

function applyTemplate(name: string) {
  Object.assign(adminData.theme, templatePresets[name], { template: name })
  notice.value = 'Template applied. Save changes when ready.'
}

function resetTheme() {
  Object.assign(adminData.theme, {
    background: '#0c422f',
    panel: '#082923',
    gold: '#dfbd75',
    text: '#f2e6c9',
    muted: '#d6c9ac',
    backgroundImage: '/images/interior-background.jpg',
    fontStyle: 'classic',
    animations: true,
    butterflies: true
  })
}

function addScheduleItem(kind: 'ceremonyEvents' | 'receptionEvents') {
  adminData.invitation[kind].push({ time: '', symbol: '✦', title: '', detail: '' })
}

function removeScheduleItem(kind: 'ceremonyEvents' | 'receptionEvents', index: number) {
  adminData.invitation[kind].splice(index, 1)
}

function addDressColor() {
  adminData.invitation.dressColors.push({ name: '', hex: '#174b3b', detail: '' })
}

function removeDressColor(index: number) {
  adminData.invitation.dressColors.splice(index, 1)
}

onMounted(() => {
  invitationBaseUrl.value = window.location.origin
  const savedTab = window.location.hash.slice(1) || localStorage.getItem('wedding-admin-tab') || ''
  if (['overview', 'guests', 'expenses', 'theme'].includes(savedTab)) activeTab.value = savedTab as AdminTab
  window.addEventListener('keydown', handleAdminKeydown)
  initialize()
  rsvpPollTimer = setInterval(syncRsvpResponses, 10000)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleAdminKeydown)
  if (autosaveTimer) clearTimeout(autosaveTimer)
  if (noticeTimer) clearTimeout(noticeTimer)
  if (toastTimer) clearTimeout(toastTimer)
  if (rsvpPollTimer) clearInterval(rsvpPollTimer)
})
</script>

<template>
  <main class="admin-page">
    <div v-if="loading" class="admin-auth-shell"><div class="admin-auth-card"><span class="admin-spinner"></span><p>Preparing your control centre…</p></div></div>

    <div v-else-if="!configured" class="admin-auth-shell">
      <form class="admin-auth-card" @submit.prevent="setupOwner">
        <span class="admin-kicker">FIRST-TIME SETUP</span>
        <h1>Create your owner account</h1>
        <p>This account controls guests, expenses, invitation content and visual themes.</p>
        <label>Username<input v-model.trim="credentials.username" required minlength="3" autocomplete="username"></label>
        <label>Password<input v-model="credentials.password" required minlength="8" type="password" autocomplete="new-password"></label>
        <label>Confirm password<input v-model="credentials.confirm" required minlength="8" type="password" autocomplete="new-password"></label>
        <p v-if="errorMessage" class="admin-error">{{ errorMessage }}</p>
        <button class="admin-primary" type="submit">CREATE CONTROL CENTRE</button>
        <NuxtLink to="/">← Return to invitation</NuxtLink>
      </form>
    </div>

    <div v-else-if="!authenticated" class="admin-auth-shell">
      <form class="admin-auth-card" @submit.prevent="registerMode ? register() : login()">
        <span class="admin-kicker">{{ registerMode ? 'CREATE YOUR WORKSPACE' : 'PRIVATE ADMIN' }}</span>
        <h1>{{ registerMode ? 'Start your wedding' : 'Welcome back' }}</h1>
        <p>{{ registerMode ? 'Create an account and customize your own invitation.' : 'Sign in to manage your wedding celebration.' }}</p>
        <label>Username<input v-model.trim="credentials.username" required autocomplete="username"></label>
        <label>Password<input v-model="credentials.password" required minlength="8" type="password" :autocomplete="registerMode ? 'new-password' : 'current-password'"></label>
        <label v-if="registerMode">Confirm password<input v-model="credentials.confirm" required minlength="8" type="password" autocomplete="new-password"></label>
        <p v-if="errorMessage" class="admin-error">{{ errorMessage }}</p>
        <button class="admin-primary" type="submit">{{ registerMode ? 'CREATE ACCOUNT' : 'SIGN IN' }}</button>
        <button class="auth-switch" type="button" @click="registerMode = !registerMode; errorMessage = ''">{{ registerMode ? 'Already have an account? Sign in' : 'New here? Create your own wedding' }}</button>
        <NuxtLink to="/">← Return to invitation</NuxtLink>
      </form>
    </div>

    <template v-else>
      <aside class="admin-sidebar">
        <div class="admin-brand"><div class="admin-brand-mark">TT</div><div><span>WEDDING</span><strong>Control Centre</strong></div></div>
        <div class="project-switcher">
          <label>ACTIVE WEDDING</label>
          <select v-model="selectedProjectId" @change="selectProject"><option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option></select>
          <button type="button" @click="showProjectCreator = !showProjectCreator">＋ New wedding</button>
        </div>
        <nav>
          <small class="sidebar-label">MANAGEMENT</small>
          <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z"/></svg></span><span class="nav-copy"><b>Overview</b><small>Wedding summary</small></span></button>
          <button :class="{ active: activeTab === 'guests' }" @click="activeTab = 'guests'"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 1c-2.67 0-8 1.34-8 4v3h12v-3c0-2.66-1.33-4-4-4ZM8 14c-3.12 0-6 1.58-6 4v2h4v-3c0-1.12.56-2.1 1.52-2.92C7.68 14.03 7.84 14 8 14Z"/></svg></span><span class="nav-copy"><b>Guests</b><small>Invites and RSVP</small></span></button>
          <button :class="{ active: activeTab === 'expenses' }" @click="activeTab = 'expenses'"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3V5Zm2 2v10h14V7H5Zm7 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-6 1h2v2H6V9Zm10 4h2v2h-2v-2Z"/></svg></span><span class="nav-copy"><b>Expenses</b><small>Budget and payments</small></span></button>
          <button :class="{ active: activeTab === 'theme' }" @click="activeTab = 'theme'"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20h1.5a2.5 2.5 0 0 0 0-5H12a1.5 1.5 0 0 1 0-3h2a8 8 0 0 0 8-8c0-2.21-4.48-4-10-4ZM7 9.5A1.5 1.5 0 1 1 7 6a1.5 1.5 0 0 1 0 3.5Zm4-3A1.5 1.5 0 1 1 11 3a1.5 1.5 0 0 1 0 3.5Zm5 3A1.5 1.5 0 1 1 16 6a1.5 1.5 0 0 1 0 3.5Z"/></svg></span><span class="nav-copy"><b>Theme & Content</b><small>Invitation design</small></span></button>
        </nav>
        <div class="admin-sidebar-foot"><a :href="publicInvitationUrl" target="_blank">View invitation ↗</a><button @click="logout">Sign out</button></div>
      </aside>

      <section class="admin-workspace" @keydown="handleCommitEnter">
        <form v-if="showProjectCreator" class="new-project-card" @submit.prevent="createWedding">
          <div><span class="admin-kicker">NEW PROJECT</span><h2>Create another wedding</h2></div>
          <label>Wedding name<input v-model.trim="newProject.name" required placeholder="Sokha & Dara Wedding"></label>
          <label>Public URL name<input v-model.trim="newProject.slug" placeholder="sokha-dara"></label>
          <button class="admin-primary" type="submit">CREATE WEDDING</button><button class="text-button" type="button" @click="showProjectCreator = false">Cancel</button>
        </form>
        <header class="admin-topbar">
          <div><span class="admin-kicker">{{ activeTab }}</span><h1>{{ activeTab === 'overview' ? 'Celebration overview' : activeTab === 'guests' ? 'Guest management' : activeTab === 'expenses' ? 'Budget & expenses' : 'Theme & content studio' }}</h1></div>
          <div class="admin-actions"><span class="storage-badge">{{ storage }}</span><span class="autosave-status" :class="{ saving }"><i></i>{{ notice || 'Autosave on' }}</span></div>
        </header>
        <p v-if="errorMessage" class="admin-error admin-page-error">{{ errorMessage }}</p>

        <div v-if="activeTab === 'overview' && dashboard" class="admin-panel-stack">
          <div class="metric-grid">
            <article><span>INVITATIONS</span><strong>{{ dashboard.guests.invitations }}</strong><small>{{ dashboard.guests.opened }} opened</small></article>
            <article><span>ATTENDING</span><strong>{{ dashboard.guests.attendingPeople }}</strong><small>{{ attendanceRate }}% of invited guests</small></article>
            <article><span>TOTAL BUDGET</span><strong>{{ currency.format(dashboard.budget.budgeted) }}</strong><small>{{ currency.format(dashboard.budget.remaining) }} remaining</small></article>
            <article><span>OUTSTANDING</span><strong>{{ currency.format(dashboard.budget.outstanding) }}</strong><small>{{ dashboard.budget.overdue }} overdue items</small></article>
          </div>
          <div class="overview-grid">
            <article class="admin-card">
              <div class="card-heading"><div><span class="admin-kicker">RSVP PROGRESS</span><h2>Guest responses</h2></div><strong>{{ attendanceRate }}%</strong></div>
              <div class="progress-track"><i :style="{ width: `${attendanceRate}%` }"></i></div>
              <div class="response-breakdown"><span><i class="yes"></i>{{ dashboard.guests.attending }} attending</span><span><i class="pending"></i>{{ dashboard.guests.pending }} pending</span><span><i class="no"></i>{{ dashboard.guests.declined }} declined</span></div>
            </article>
            <article class="admin-card">
              <div class="card-heading"><div><span class="admin-kicker">BUDGET HEALTH</span><h2>Actual spending</h2></div><strong>{{ budgetRate }}%</strong></div>
              <div class="progress-track budget"><i :style="{ width: `${budgetRate}%` }"></i></div>
              <div class="budget-summary"><span>Actual <b>{{ currency.format(dashboard.budget.actual) }}</b></span><span>Paid <b>{{ currency.format(dashboard.budget.paid) }}</b></span></div>
            </article>
          </div>
          <article class="admin-card quick-actions"><span class="admin-kicker">QUICK START</span><h2>Prepare your celebration</h2><div><button @click="activeTab = 'guests'; addGuest()">＋ Add your first guest</button><button @click="activeTab = 'expenses'; addExpense()">＋ Record an expense</button><button @click="activeTab = 'theme'">✦ Customize invitation</button></div></article>
        </div>

        <div v-else-if="activeTab === 'guests'" class="admin-panel-stack">
          <div class="guest-section-head admin-card">
            <div><span class="admin-kicker">GUEST DIRECTORY</span><h2>Guest list</h2><p>Manage invitations, RSVP status and monetary gifts.</p></div>
            <button class="admin-primary" @click="addGuest">＋ ADD GUEST</button>
          </div>
          <div class="guest-summary guest-summary-expanded"><span><b>{{ adminData.guests.length }}</b> invitations</span><span><b>{{ adminData.guests.filter((g: any) => g.status === 'attending').length }}</b> attending</span><span><b>{{ adminData.guests.filter((g: any) => g.status === 'pending').length }}</b> awaiting reply</span><span><b>{{ giftSummary.received }}</b> gifts recorded</span><span class="guest-summary-gift"><small>GIFT TOTAL</small><b>${{ giftSummary.usd.toLocaleString() }} USD</b><b>{{ giftSummary.khr.toLocaleString() }} KHR</b></span></div>
          <div class="guest-command-bar">
            <label class="admin-search guest-name-search">⌕ <input v-model="guestSearch" placeholder="Search guest name or status"></label>
            <div class="guest-group-picker" :class="{ open: guestGroupPickerOpen }">
              <span class="guest-group-icon" aria-hidden="true">⌕</span>
              <input :value="guestGroupPickerQuery || guestGroupSearch" type="text" :placeholder="guestGroupPickerOpen ? 'Search families / groups…' : 'All families / groups'" aria-label="Search families and groups" aria-haspopup="listbox" :aria-expanded="guestGroupPickerOpen" @focus="guestGroupPickerOpen = true" @click="guestGroupPickerOpen = true" @input="guestGroupPickerQuery = ($event.target as HTMLInputElement).value; guestGroupPickerOpen = true" @keydown.esc="guestGroupPickerOpen = false" @keydown.enter.prevent="if (filteredGuestGroups.length) { guestGroupFilter = filteredGuestGroups[0]; guestGroupPickerQuery = ''; guestGroupPickerOpen = false }">
              <button v-if="guestGroupFilter !== 'all' || guestGroupPickerQuery" class="guest-group-clear" type="button" aria-label="Clear family filter" @click="guestGroupFilter = 'all'; guestGroupPickerQuery = ''; guestGroupPickerOpen = false">×</button>
              <span v-else class="guest-group-caret" aria-hidden="true">⌄</span>
              <div v-if="guestGroupPickerOpen" class="guest-group-options" role="listbox">
                <button type="button" role="option" :aria-selected="guestGroupFilter === 'all'" @mousedown.prevent="guestGroupFilter = 'all'; guestGroupPickerQuery = ''; guestGroupPickerOpen = false">All families / groups</button>
                <button v-for="group in filteredGuestGroups" :key="group" type="button" role="option" :aria-selected="guestGroupFilter === group" @mousedown.prevent="guestGroupFilter = group; guestGroupPickerQuery = ''; guestGroupPickerOpen = false">{{ group }}<span v-if="guestGroupFilter === group" class="guest-group-selected-mark">✓</span></button>
                <p v-if="!filteredGuestGroups.length" class="guest-group-no-results">No matching groups</p>
              </div>
            </div>
            <div class="guest-command-footer">
              <div class="guest-filters" aria-label="Filter guests">
                <button v-for="filter in [{ key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }, { key: 'attending', label: 'Attending' }, { key: 'declined', label: 'Declined' }, { key: 'gift', label: 'Gift pending' }]" :key="filter.key" :class="{ active: guestFilter === filter.key }" @click="guestFilter = filter.key as any">{{ filter.label }}</button>
              </div>
              <div class="guest-toolbar-actions">
                <div class="guest-data-actions"><button type="button" @click="downloadGuestTemplate">SAMPLE</button><button type="button" @click="guestImportInput?.click()">IMPORT</button><button type="button" @click="exportGuests">EXPORT</button></div>
                <input ref="guestImportInput" class="guest-import-input" type="file" accept=".xlsx,.xls,.xlsm,.csv" @change="importGuests">
                <button class="fullscreen-button" @click="openGuestFullscreen">⛶ FULL SCREEN</button>
              </div>
            </div>
          </div>
          <div v-if="visibleGuests.length || tableFullscreen" class="guest-sheet-wrap" :class="{ fullscreen: tableFullscreen }" @scroll="handleGuestTableScroll">
            <div v-if="tableFullscreen" class="fullscreen-toolbar"><strong>GUEST MANAGEMENT</strong><div class="fullscreen-search">⌕ <input v-model="guestSearch" autofocus placeholder="Search guest name or status"></div><input v-model="guestGroupSearch" class="guest-group-select fullscreen-group-select" type="search" list="guest-group-options" placeholder="Search group" aria-label="Search family or group"><div class="fullscreen-actions"><button @click="addGuest">＋ ADD</button><button @click="downloadGuestTemplate">SAMPLE</button><button @click="guestImportInput?.click()">IMPORT</button><button @click="exportGuests">EXPORT</button><button @click="tableFullscreen = false">× EXIT</button></div></div>
            <table class="guest-sheet-table">
              <thead><tr><th>No.</th><th>Guest name</th><th>Family / group</th><th>Invited</th><th>RSVP</th><th>Monetary gift</th><th>Invitation</th><th></th></tr></thead>
              <tbody>
                <tr v-for="(guest, index) in visibleGuests" :key="guest.id" :data-guest-id="guest.id" :class="[`status-${guest.status}`, { 'search-match': guestMatchesSearch(guest), 'new-guest-row': guest.id === newGuestId }]">
                  <td class="sheet-row-number">{{ index + 1 }}</td>
                  <td class="sheet-name"><div class="guest-name-field"><div v-if="guestSearch && editingGuestNameId !== guest.id" class="guest-name-highlight" aria-hidden="true"><template v-for="(part, partIndex) in guestNameParts(guest.name)" :key="partIndex"><mark v-if="part.match">{{ part.text }}</mark><span v-else>{{ part.text }}</span></template></div><input v-model="guest.name" :class="{ 'has-highlight-overlay': guestSearch && editingGuestNameId !== guest.id }" placeholder="Guest name" @focus="editingGuestNameId = guest.id" @blur="editingGuestNameId = ''"></div><small>{{ guest.respondedAt ? `RSVP · ${new Date(guest.respondedAt).toLocaleString()}` : guest.openedAt ? 'Opened invitation' : 'Not opened' }}</small></td>
                  <td><input v-model="guest.group" placeholder="Family or group"></td>
                  <td class="sheet-number"><input v-model.number="guest.partySize" type="number" min="1"></td>
                  <td><select v-model="guest.status"><option value="pending">Pending</option><option value="attending">Attending</option><option value="declined">Declined</option></select></td>
                  <td class="sheet-gift"><div><input v-model.number="guest.giftAmount" type="number" min="0" step="1" placeholder="Amount"><select v-model="guest.giftCurrency"><option value="USD">USD</option><option value="KHR">KHR</option></select></div></td>
                  <td class="sheet-invite"><code>{{ guest.inviteCode }}</code><button @click="copyInvite(guest.inviteCode)">COPY LINK</button></td>
                  <td><button class="danger-action" title="Remove guest" @click="removeGuest(guest.id)">×</button></td>
                </tr>
              </tbody>
            </table>
            <div v-if="!visibleGuests.length" class="sheet-empty-state"><strong>No guests found</strong><span>Try another search or filter.</span></div>
            <div class="scroll-load-status">Showing {{ visibleGuests.length }} of {{ filteredGuests.length }} guests<span v-if="visibleGuests.length < filteredGuests.length"> · Scroll down to load more</span></div>
          </div>
          <div v-else class="guest-empty"><strong>No guests found</strong><p>Try another search or filter.</p></div>
        </div>

        <div v-else-if="activeTab === 'expenses'" class="admin-panel-stack">
          <div class="guest-section-head admin-card">
            <div><span class="admin-kicker">EXPENSE DIRECTORY</span><h2>Event expenses</h2><p>Plan the budget, track payments and manage every event cost.</p></div>
            <button class="admin-primary" @click="addExpense">＋ ADD EXPENSE</button>
          </div>
          <div class="guest-summary expense-summary"><span><b>{{ adminData.expenses.length }}</b> expenses</span><span><b>{{ currency.format(expenseSummary.budgeted) }}</b> budgeted</span><span><b>{{ currency.format(expenseSummary.actual) }}</b> actual</span><span><b>{{ currency.format(expenseSummary.paid) }}</b> paid</span><span><b>{{ currency.format(expenseSummary.outstanding) }}</b> outstanding</span></div>
          <div class="guest-command-bar">
            <div class="admin-search">⌕ <input v-model="expenseSearch" placeholder="Search category, expense, vendor or status"></div>
            <div class="guest-filters"><button class="fullscreen-button" @click="openExpenseFullscreen">⛶ FULL SCREEN</button></div>
          </div>
          <div v-if="visibleExpenses.length || expenseFullscreen" class="expense-sheet-wrap" :class="{ fullscreen: expenseFullscreen }" @scroll="handleExpenseTableScroll">
            <div v-if="expenseFullscreen" class="fullscreen-toolbar"><strong>EXPENSE MANAGEMENT</strong><div class="fullscreen-search">⌕ <input v-model="expenseSearch" autofocus placeholder="Search category, expense, vendor or status"></div><button @click="expenseFullscreen = false">× EXIT</button></div>
            <table class="expense-sheet-table">
              <thead><tr><th>No.</th><th>Category</th><th>Expense item</th><th>Vendor</th><th>Budgeted</th><th>Actual</th><th>Paid</th><th>Due</th><th>Status</th><th>Notes</th><th></th></tr></thead>
              <tbody>
                <tr v-for="(expense, index) in visibleExpenses" :key="expense.id">
                  <td class="sheet-row-number">{{ index + 1 }}</td>
                  <td><input v-model="expense.category" placeholder="Category"></td>
                  <td><input v-model="expense.item" class="expense-item-input" placeholder="Expense item"></td>
                  <td><input v-model="expense.vendor" placeholder="Vendor"></td>
                  <td><input v-model.number="expense.budgeted" type="number" min="0" step="0.01"></td>
                  <td><input v-model.number="expense.actual" type="number" min="0" step="0.01"></td>
                  <td><input v-model.number="expense.paid" type="number" min="0" step="0.01"></td>
                  <td><input v-model="expense.dueDate" type="date"></td>
                  <td><select v-model="expense.status"><option value="planned">Planned</option><option value="deposit">Deposit paid</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></td>
                  <td><input v-model="expense.notes" placeholder="Notes"></td>
                  <td><button class="danger-action" title="Remove expense" @click="removeExpense(expense.id)">×</button></td>
                </tr>
              </tbody>
            </table>
            <div v-if="!visibleExpenses.length" class="sheet-empty-state"><strong>No expenses found</strong><span>Try another search.</span></div>
            <div class="scroll-load-status">Showing {{ visibleExpenses.length }} of {{ filteredExpenses.length }} expenses<span v-if="visibleExpenses.length < filteredExpenses.length"> · Scroll down to load more</span></div>
          </div>
          <div v-else class="guest-empty"><strong>No expenses yet</strong><p>Add an expense to begin tracking your event budget.</p></div>
        </div>

        <div v-else class="theme-layout">
          <div class="theme-editor admin-panel-stack">
            <article class="admin-card form-card">
              <span class="admin-kicker">PROJECT & PUBLISHING</span><h2>Wedding website</h2>
              <div class="form-grid two"><label>Project name<input v-model="adminData.project.name"></label><label>Public URL name<input v-model="adminData.project.slug"></label></div>
              <div class="switch-row"><label><input v-model="adminData.project.published" type="checkbox"> Public invitation enabled</label></div>
              <a class="public-url" :href="publicInvitationUrl" target="_blank">{{ publicInvitationUrl }} ↗</a>
            </article>

            <article class="admin-card form-card">
              <span class="admin-kicker">TEMPLATE GALLERY</span><h2>Choose a starting style</h2>
              <div class="template-grid">
                <button type="button" class="template-option emerald" :class="{ selected: adminData.theme.template === 'emerald' }" @click="applyTemplate('emerald')"><i></i><strong>Emerald Khmer</strong><small>Deep green and antique gold</small></button>
                <button type="button" class="template-option ivory" :class="{ selected: adminData.theme.template === 'ivory' }" @click="applyTemplate('ivory')"><i></i><strong>Ivory Romance</strong><small>Soft cream and warm bronze</small></button>
                <button type="button" class="template-option royal" :class="{ selected: adminData.theme.template === 'royal' }" @click="applyTemplate('royal')"><i></i><strong>Royal Khmer</strong><small>Burgundy and ceremonial gold</small></button>
              </div>
            </article>

            <article class="admin-card form-card">
              <div class="card-heading"><div><span class="admin-kicker">VISUAL IDENTITY</span><h2>Colors and atmosphere</h2></div><button class="text-button" @click="resetTheme">Reset colors</button></div>
              <div class="color-grid">
                <label>Background<input v-model="adminData.theme.background" type="color"><input v-model="adminData.theme.background"></label>
                <label>Panels<input v-model="adminData.theme.panel" type="color"><input v-model="adminData.theme.panel"></label>
                <label>Gold accent<input v-model="adminData.theme.gold" type="color"><input v-model="adminData.theme.gold"></label>
                <label>Main text<input v-model="adminData.theme.text" type="color"><input v-model="adminData.theme.text"></label>
                <label>Muted text<input v-model="adminData.theme.muted" type="color"><input v-model="adminData.theme.muted"></label>
              </div>
              <label>Background image URL<input v-model="adminData.theme.backgroundImage" placeholder="/images/interior-background.jpg"></label>
              <label>Typography<select v-model="adminData.theme.fontStyle"><option value="classic">Classic Khmer elegance</option><option value="romantic">Romantic serif</option><option value="modern">Modern clean</option></select></label>
              <div class="switch-row"><label><input v-model="adminData.theme.animations" type="checkbox"> Section animations</label><label><input v-model="adminData.theme.butterflies" type="checkbox"> Flying butterflies</label></div>
            </article>

            <article class="admin-card form-card">
              <span class="admin-kicker">IMAGE STUDIO</span><h2>Upload your own artwork</h2>
              <p class="form-help">Use transparent PNG or WEBP images for crests, butterflies and frames. Maximum file size is 8 MB.</p>
              <div class="asset-grid">
                <label v-for="asset in [{ key: 'backgroundImage', label: 'Section background' }, { key: 'openingCrestImage', label: 'Opening crest / logo' }, { key: 'heroEmblemImage', label: 'Invitation emblem' }, { key: 'butterflyImage', label: 'Animated butterfly' }, { key: 'frameImage', label: 'Invitation frame overlay' }]" :key="asset.key" class="asset-control">
                  <span>{{ asset.label }}</span>
                  <div class="asset-preview" :style="{ backgroundImage: `url('${adminData.theme[asset.key]}')` }"></div>
                  <input v-model="adminData.theme[asset.key]" placeholder="Image URL">
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" @change="uploadAsset($event, asset.key)">
                  <small v-if="uploadingAsset === asset.key">Uploading…</small>
                </label>
              </div>
            </article>

            <article class="admin-card form-card">
              <span class="admin-kicker">COUPLE & FAMILIES</span><h2>Invitation identity</h2>
              <div class="form-grid two"><label>Groom name<input v-model="adminData.invitation.couple.first"></label><label>Bride name<input v-model="adminData.invitation.couple.second"></label><label>Groom display name<input v-model="adminData.invitation.couple.groomEnglish"></label><label>Bride display name<input v-model="adminData.invitation.couple.brideEnglish"></label></div>
              <div class="form-grid two"><label>Groom parent 1<input v-model="adminData.invitation.parents.groom[0]"></label><label>Groom parent 2<input v-model="adminData.invitation.parents.groom[1]"></label><label>Bride parent 1<input v-model="adminData.invitation.parents.bride[0]"></label><label>Bride parent 2<input v-model="adminData.invitation.parents.bride[1]"></label></div>
            </article>

            <article class="admin-card form-card">
              <span class="admin-kicker">EVENT DETAILS</span><h2>Date, time and venue</h2>
              <div class="form-grid two"><label>Event starts<input v-model="adminData.invitation.date"></label><label>Calendar event ends<input v-model="adminData.invitation.calendarEnd"></label><label>Date label<input v-model="adminData.invitation.dateLabel"></label><label>RSVP deadline<input v-model="adminData.invitation.rsvpDeadline"></label><label>Ceremony time<input v-model="adminData.invitation.ceremonyTime"></label><label>Reception time<input v-model="adminData.invitation.receptionTime"></label></div>
              <label>Venue name<input v-model="adminData.invitation.venue"></label><label>Venue location<input v-model="adminData.invitation.venueLocation"></label><label>Map address<input v-model="adminData.invitation.venueAddress"></label>
              <div class="admin-subsection"><h3>Ceremony location & map</h3><div class="form-grid two"><label>Venue name<input v-model="adminData.invitation.ceremonyVenue"></label><label>Map address<input v-model="adminData.invitation.ceremonyAddress"></label><label>Map link (optional)<input v-model="adminData.invitation.ceremonyMapUrl" placeholder="Google Maps URL"></label></div></div>
              <div class="admin-subsection"><h3>Reception location & map</h3><div class="form-grid two"><label>Venue name<input v-model="adminData.invitation.receptionVenue"></label><label>Map address<input v-model="adminData.invitation.receptionAddress"></label><label>Map link (optional)<input v-model="adminData.invitation.receptionMapUrl" placeholder="Google Maps URL"></label></div></div>
              <div v-for="kind in [{ key: 'ceremonyEvents', title: 'Ceremony schedule' }, { key: 'receptionEvents', title: 'Reception schedule' }]" :key="kind.key" class="admin-subsection">
                <div class="card-heading"><h3>{{ kind.title }}</h3><button type="button" class="text-button" @click="addScheduleItem(kind.key)">+ Add event</button></div>
                <div v-for="(item, index) in adminData.invitation[kind.key]" :key="index" class="schedule-editor-row">
                  <div class="form-grid two"><label>Time<input v-model="item.time" placeholder="e.g. 6:00 PM"></label><label>Icon<input v-model="item.symbol" maxlength="8"></label><label>Event title<input v-model="item.title"></label><label>Description<input v-model="item.detail"></label></div>
                  <button type="button" class="text-button danger" @click="removeScheduleItem(kind.key, index)">Remove event</button>
                </div>
              </div>
              <div class="admin-subsection"><div class="card-heading"><h3>Dress code & color guide</h3><button type="button" class="text-button" @click="addDressColor">+ Add color</button></div>
                <label>Dress code<input v-model="adminData.invitation.dressCode"></label>
                <div v-for="(color, index) in adminData.invitation.dressColors" :key="index" class="dress-color-editor"><label>Color name<input v-model="color.name" placeholder="Color name"></label><label>Swatch<input v-model="color.hex" type="color"></label><label>Guest-facing details<input v-model="color.detail" placeholder="Describe the color or outfit suggestion"></label><button type="button" class="text-button danger" @click="removeDressColor(index)">Remove</button></div>
              </div>
              <label v-for="(_, index) in adminData.invitation.khmerEventDetails" :key="index">Khmer event line {{ index + 1 }}<input v-model="adminData.invitation.khmerEventDetails[index]"></label>
            </article>

            <article class="admin-card form-card">
              <span class="admin-kicker">WORDS & MESSAGES</span><h2>Invitation copy</h2>
              <label>Opening label<input v-model="adminData.theme.content.openingEyebrow"></label>
              <label>Announcement<input v-model="adminData.theme.content.announcement"></label>
              <label>English invitation message<textarea v-model="adminData.theme.content.invitationMessage" rows="3"></textarea></label>
              <label>Programme subtitle<input v-model="adminData.theme.content.programmeSubtitle"></label>
              <label>Details subtitle<input v-model="adminData.theme.content.detailsSubtitle"></label>
              <label>Gifts subtitle<input v-model="adminData.theme.content.giftsSubtitle"></label>
              <label>RSVP subtitle <small>Use {deadline} to show the configured deadline.</small><input v-model="adminData.theme.content.rsvpSubtitle"></label>
              <label>Footer message<input v-model="adminData.theme.content.footerMessage"></label>
            </article>
          </div>

          <aside class="theme-preview" :style="{ '--preview-bg': adminData.theme.background, '--preview-panel': adminData.theme.panel, '--preview-gold': adminData.theme.gold, '--preview-text': adminData.theme.text, '--preview-muted': adminData.theme.muted, backgroundImage: `linear-gradient(#06251fb0,#06251fb0),url('${adminData.theme.backgroundImage}')` }">
            <span>LIVE STYLE PREVIEW</span><div><img class="preview-emblem" :src="adminData.theme.heroEmblemImage" alt=""><small>{{ adminData.theme.content.openingEyebrow }}</small><h2>{{ adminData.invitation.couple.first }} <i>&</i> {{ adminData.invitation.couple.second }}</h2><p>{{ adminData.theme.content.announcement }}</p><article><b>{{ adminData.invitation.dateLabel }}</b><em>{{ adminData.invitation.venue }}</em></article></div><a :href="publicInvitationUrl" target="_blank">OPEN FULL INVITATION ↗</a>
          </aside>
        </div>
      </section>
      <Transition name="admin-toast"><div v-if="toast.message" class="admin-toast" :class="`is-${toast.type}`" role="status"><span>{{ toast.type === 'error' ? '!' : toast.type === 'info' ? '●' : '✓' }}</span>{{ toast.message }}</div></Transition>
    </template>
  </main>
</template>
