import { createExpense, createGuest, defaultTheme, type WeddingProject, type WeddingTheme } from './admin-store'
import { invitation as invitationDefaults } from '../../data/invitation'

function safeColor(value: unknown, fallback: string) {
  const color = String(value || '')
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback
}

function safeAsset(value: unknown, fallback: string) {
  const asset = String(value || '').trim().slice(0, 500)
  return /^(\/|https:\/\/)/.test(asset) ? asset : fallback
}

export function sanitizeAdminPayload(payload: any, current: WeddingProject) {
  const themeInput = payload?.theme || {}
  const invitationInput = payload?.invitation || {}
  const theme: WeddingTheme = {
    template: ['emerald', 'ivory', 'royal'].includes(themeInput.template) ? themeInput.template : 'emerald',
    background: safeColor(themeInput.background, defaultTheme.background),
    panel: safeColor(themeInput.panel, defaultTheme.panel),
    gold: safeColor(themeInput.gold, defaultTheme.gold),
    text: safeColor(themeInput.text, defaultTheme.text),
    muted: safeColor(themeInput.muted, defaultTheme.muted),
    backgroundImage: safeAsset(themeInput.backgroundImage, defaultTheme.backgroundImage),
    openingCrestImage: safeAsset(themeInput.openingCrestImage, defaultTheme.openingCrestImage),
    heroEmblemImage: safeAsset(themeInput.heroEmblemImage, defaultTheme.heroEmblemImage),
    butterflyImage: safeAsset(themeInput.butterflyImage, defaultTheme.butterflyImage),
    frameImage: safeAsset(themeInput.frameImage, ''),
    fontStyle: ['classic', 'romantic', 'modern'].includes(themeInput.fontStyle) ? themeInput.fontStyle : 'classic',
    animations: themeInput.animations !== false,
    butterflies: themeInput.butterflies !== false,
    content: {
      ...defaultTheme.content,
      ...(themeInput.content || {})
    }
  }

  const invitation = {
    ...invitationDefaults,
    ...current.invitation,
    ...invitationInput,
    couple: {
      ...invitationDefaults.couple,
      ...current.invitation.couple,
      ...(invitationInput.couple || {})
    },
    parents: {
      groom: Array.isArray(invitationInput.parents?.groom) ? invitationInput.parents.groom.map(String).slice(0, 4) : current.invitation.parents.groom,
      bride: Array.isArray(invitationInput.parents?.bride) ? invitationInput.parents.bride.map(String).slice(0, 4) : current.invitation.parents.bride
    },
    ceremonyEvents: sanitizeSchedule(invitationInput.ceremonyEvents, current.invitation.ceremonyEvents),
    receptionEvents: sanitizeSchedule(invitationInput.receptionEvents, current.invitation.receptionEvents),
    dressColors: sanitizeDressColors(invitationInput.dressColors, current.invitation.dressColors),
    ceremonyMapUrl: safeMapUrl(invitationInput.ceremonyMapUrl, current.invitation.ceremonyMapUrl),
    receptionMapUrl: safeMapUrl(invitationInput.receptionMapUrl, current.invitation.receptionMapUrl)
  }

  return {
    guests: Array.isArray(payload?.guests) ? payload.guests.slice(0, 5000).map(createGuest) : current.guests,
    expenses: Array.isArray(payload?.expenses) ? payload.expenses.slice(0, 10000).map(createExpense) : current.expenses,
    theme,
    invitation
  }
}

function sanitizeSchedule(value: unknown, fallback: any[]) {
  if (!Array.isArray(value)) return fallback
  return value.slice(0, 50).map((item: any) => ({
    time: String(item?.time || '').slice(0, 40),
    symbol: String(item?.symbol || '✦').slice(0, 8),
    title: String(item?.title || '').slice(0, 160),
    detail: String(item?.detail || '').slice(0, 500)
  }))
}

function sanitizeDressColors(value: unknown, fallback: any[]) {
  if (!Array.isArray(value)) return fallback
  return value.slice(0, 16).map((item: any) => ({
    name: String(item?.name || '').slice(0, 60),
    hex: safeColor(item?.hex, '#174b3b'),
    detail: String(item?.detail || '').slice(0, 500)
  }))
}

function safeMapUrl(value: unknown, fallback: string) {
  const url = String(value || '').trim().slice(0, 1000)
  return /^https:\/\//i.test(url) ? url : fallback
}
