import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../_/admin-auth.mjs';
import { i as invitation, d as defaultTheme, c as createExpense, a as createGuest, u as updateAdminState, f as findOwnedProject, b as uniqueSlug } from '../../../_/admin-store.mjs';
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

function safeColor(value, fallback) {
  const color = String(value || "");
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}
function safeAsset(value, fallback) {
  const asset = String(value || "").trim().slice(0, 500);
  return /^(\/|https:\/\/)/.test(asset) ? asset : fallback;
}
function sanitizeAdminPayload(payload, current) {
  var _a, _b;
  const themeInput = (payload == null ? void 0 : payload.theme) || {};
  const invitationInput = (payload == null ? void 0 : payload.invitation) || {};
  const theme = {
    template: ["emerald", "ivory", "royal"].includes(themeInput.template) ? themeInput.template : "emerald",
    background: safeColor(themeInput.background, defaultTheme.background),
    panel: safeColor(themeInput.panel, defaultTheme.panel),
    gold: safeColor(themeInput.gold, defaultTheme.gold),
    text: safeColor(themeInput.text, defaultTheme.text),
    muted: safeColor(themeInput.muted, defaultTheme.muted),
    backgroundImage: safeAsset(themeInput.backgroundImage, defaultTheme.backgroundImage),
    openingCrestImage: safeAsset(themeInput.openingCrestImage, defaultTheme.openingCrestImage),
    heroEmblemImage: safeAsset(themeInput.heroEmblemImage, defaultTheme.heroEmblemImage),
    butterflyImage: safeAsset(themeInput.butterflyImage, defaultTheme.butterflyImage),
    frameImage: safeAsset(themeInput.frameImage, ""),
    fontStyle: ["classic", "romantic", "modern"].includes(themeInput.fontStyle) ? themeInput.fontStyle : "classic",
    animations: themeInput.animations !== false,
    butterflies: themeInput.butterflies !== false,
    content: {
      ...defaultTheme.content,
      ...themeInput.content || {}
    }
  };
  const invitation$1 = {
    ...invitation,
    ...current.invitation,
    ...invitationInput,
    couple: {
      ...invitation.couple,
      ...current.invitation.couple,
      ...invitationInput.couple || {}
    },
    parents: {
      groom: Array.isArray((_a = invitationInput.parents) == null ? void 0 : _a.groom) ? invitationInput.parents.groom.map(String).slice(0, 4) : current.invitation.parents.groom,
      bride: Array.isArray((_b = invitationInput.parents) == null ? void 0 : _b.bride) ? invitationInput.parents.bride.map(String).slice(0, 4) : current.invitation.parents.bride
    }
  };
  return {
    guests: Array.isArray(payload == null ? void 0 : payload.guests) ? payload.guests.slice(0, 5e3).map(createGuest) : current.guests,
    expenses: Array.isArray(payload == null ? void 0 : payload.expenses) ? payload.expenses.slice(0, 1e4).map(createExpense) : current.expenses,
    theme,
    invitation: invitation$1
  };
}

const data_put = defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const body = await readBody(event);
  const state = await updateAdminState((current) => {
    const project = findOwnedProject(current, session.userId, String((body == null ? void 0 : body.projectId) || ""));
    if (!project) throw createError({ statusCode: 404, statusMessage: "Wedding project not found" });
    const sanitized = sanitizeAdminPayload(body, project);
    project.guests = sanitized.guests;
    project.expenses = sanitized.expenses;
    project.theme = sanitized.theme;
    project.invitation = sanitized.invitation;
    if (body == null ? void 0 : body.project) {
      project.name = String(body.project.name || project.name).trim().slice(0, 100);
      project.slug = uniqueSlug(current, String(body.project.slug || project.name), project.id);
      project.published = body.project.published !== false;
    }
    project.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  });
  return { ok: true, updatedAt: state.updatedAt };
});

export { data_put as default };
//# sourceMappingURL=data.put.mjs.map
