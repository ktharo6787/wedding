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
    }
  }

  return {
    guests: Array.isArray(payload?.guests) ? payload.guests.slice(0, 5000).map(createGuest) : current.guests,
    expenses: Array.isArray(payload?.expenses) ? payload.expenses.slice(0, 10000).map(createExpense) : current.expenses,
    theme,
    invitation
  }
}
