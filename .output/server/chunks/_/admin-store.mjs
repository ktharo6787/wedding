import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { randomUUID, randomBytes } from 'node:crypto';
import { Pool } from 'pg';

const invitation = {
  couple: {
    first: "\u1790\u17B6\u179A\u17C9\u17BC",
    second: "\u1792\u17B6\u1793\u17B8",
    firstFull: "\u1790\u17B6\u179A\u17C9\u17BC",
    secondFull: "\u1792\u17B6\u1793\u17B8",
    groomEnglish: "\u1790\u17B6\u179A\u17C9\u17BC",
    brideEnglish: "\u1792\u17B6\u1793\u17B8",
    initials: "\u179A \xB7 \u1793"
  },
  parents: {
    groom: ["\u179B\u17C4\u1780  \u1783\u17BD\u1793 \u1780\u17B6\u1793", "\u179B\u17C4\u1780\u179F\u17D2\u179A\u17B8  \u17A2\u17CA\u17BB\u17C6 \u179F\u17B6\u179C\u179A\u17B8"],
    bride: ["\u17AF\u1780\u17A7\u178F\u17D2\u178F\u1798 \u17A0\u17CA\u1799 \u1797\u17B6\u179A\u1780\u17D2\u179F", "\u179B\u17C4\u1780\u1787\u17C6\u1791\u17B6\u179C \u1792\u17BC \u1792\u17B6\u179A\u1798\u17D2\u1799"]
  },
  date: "2026-12-06T17:00:00+07:00",
  calendarEnd: "2026-12-06T22:00:00+07:00",
  dateLabel: "Sunday, 6 December 2026",
  heroImage: "/images/tharo-theany-photo.jpg",
  rsvpDeadline: "6 November 2026",
  venue: "OCIC Chroy Changvar",
  venueLocation: "International Convention and Exhibition Centre, Building A",
  venueAddress: "OCIC Chroy Changvar, Building A, Phnom Penh, Cambodia",
  ceremonyLocation: "Ceremony space",
  receptionLocation: "Reception space",
  ceremonyTime: "6:00 AM",
  receptionTime: "5:00 PM",
  khmerEventDetails: [
    "\u1790\u17D2\u1784\u17C3\u17A2\u17B6\u1791\u17B7\u178F\u17D2\u1799 \u1791\u17B8\u17E0\u17E6 \u1781\u17C2\u1792\u17D2\u1793\u17BC \u1786\u17D2\u1793\u17B6\u17C6\u17E2\u17E0\u17E2\u17E6 \u179C\u17C1\u179B\u17B6\u1798\u17C9\u17C4\u1784 \u17E5:\u17E0\u17E0 \u179B\u17D2\u1784\u17B6\u1785",
    "\u179F\u17D2\u1790\u17B7\u178F\u1793\u17C5 \u1798\u1787\u17D2\u1788\u1798\u178E\u17D2\u178C\u179B\u179F\u1793\u17D2\u1793\u17B7\u1794\u17B6\u178F \u1793\u17B7\u1784\u1796\u17B7\u1796\u17D0\u179A\u178E\u17CD \u17A2\u1793\u17D2\u178F\u179A\u1787\u17B6\u178F\u17B7",
    "(\u1787\u17D2\u179A\u17C4\u1799\u1785\u1784\u17D2\u179C\u17B6\u179A) OCIC (\u17A2\u1782\u17B6\u179A A)"
  ],
  recoveryVenue: "Venue to be announced",
  recoveryAddress: "",
  recoveryDate: "Monday, 7 December 2026",
  recoveryTime: "From 12 PM",
  dressCode: "Formal Attire",
  rsvpEmail: "",
  musicFile: "/audio/invitation-music.m4a"
};

const defaultTheme = {
  template: "emerald",
  background: "#0c422f",
  panel: "#082923",
  gold: "#dfbd75",
  text: "#f2e6c9",
  muted: "#d6c9ac",
  backgroundImage: "/images/interior-background.jpg",
  openingCrestImage: "/images/gold-khmer-emblem-cutout.png",
  heroEmblemImage: "/images/gold-wedding-monogram.png",
  butterflyImage: "/images/animated-butterfly.png",
  frameImage: "",
  fontStyle: "classic",
  animations: true,
  butterflies: true,
  content: {
    openingEyebrow: "A WEDDING INVITATION",
    announcement: "WE'RE GETTING MARRIED",
    invitationMessage: "Request the Honor of Your Presence on the Auspicious Occasion of the Wedding Reception of Our Children",
    programmeSubtitle: "We look forward to sharing each beautiful moment with you.",
    detailsSubtitle: "Everything you need for our special day.",
    giftsSubtitle: "Your presence is our most precious gift.",
    rsvpSubtitle: "Please respond by {deadline}.",
    footerMessage: "We cannot wait to celebrate with you."
  }
};
function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "wedding";
}
function hydrateTheme(raw) {
  return { ...structuredClone(defaultTheme), ...raw || {}, content: { ...defaultTheme.content, ...(raw == null ? void 0 : raw.content) || {} } };
}
function hydrateInvitation(raw) {
  var _a, _b;
  return {
    ...structuredClone(invitation),
    ...raw || {},
    couple: { ...invitation.couple, ...(raw == null ? void 0 : raw.couple) || {} },
    parents: {
      groom: ((_a = raw == null ? void 0 : raw.parents) == null ? void 0 : _a.groom) || invitation.parents.groom,
      bride: ((_b = raw == null ? void 0 : raw.parents) == null ? void 0 : _b.bride) || invitation.parents.bride
    }
  };
}
function createProject(ownerId, partial = {}) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: String(partial.id || randomUUID()),
    ownerId,
    name: String(partial.name || "Our Wedding").trim().slice(0, 100),
    slug: slugify(String(partial.slug || partial.name || `wedding-${randomBytes(3).toString("hex")}`)),
    published: partial.published !== false,
    guests: Array.isArray(partial.guests) ? partial.guests.map(createGuest) : [],
    expenses: Array.isArray(partial.expenses) ? partial.expenses.map(createExpense) : [],
    theme: hydrateTheme(partial.theme),
    invitation: hydrateInvitation(partial.invitation),
    createdAt: String(partial.createdAt || now),
    updatedAt: String(partial.updatedAt || now)
  };
}
function freshState() {
  return { version: 2, users: [], projects: [], sessionSecret: randomBytes(32).toString("hex"), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
}
function hydrateState(raw) {
  const base = freshState();
  if (!raw) return base;
  if (Array.isArray(raw.users) && Array.isArray(raw.projects)) {
    return {
      ...base,
      users: raw.users,
      projects: raw.projects.map((project) => createProject(project.ownerId, project)),
      sessionSecret: raw.sessionSecret || base.sessionSecret,
      updatedAt: raw.updatedAt || base.updatedAt
    };
  }
  if (raw.owner) {
    const user = {
      id: "legacy-owner",
      username: raw.owner.username,
      passwordHash: raw.owner.passwordHash,
      passwordSalt: raw.owner.passwordSalt,
      createdAt: raw.owner.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
    return {
      version: 2,
      users: [user],
      projects: [createProject(user.id, {
        id: "legacy-wedding",
        name: "Tharo & Theany Wedding",
        slug: "tharo-theany",
        guests: raw.guests,
        expenses: raw.expenses,
        theme: raw.theme,
        invitation: raw.invitation,
        createdAt: user.createdAt,
        updatedAt: raw.updatedAt
      })],
      sessionSecret: raw.sessionSecret || base.sessionSecret,
      updatedAt: raw.updatedAt || base.updatedAt
    };
  }
  return base;
}
const projectRoot = basename(process.cwd()) === ".output" ? dirname(process.cwd()) : process.cwd();
const dataDirectory = process.env.WEDDING_DATA_DIR || join(projectRoot, ".data");
const dataFile = join(dataDirectory, "wedding-admin.json");
let pool = null;
let operationQueue = Promise.resolve();
async function postgresPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false } });
    await pool.query(`CREATE TABLE IF NOT EXISTS wedding_admin_state (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  }
  return pool;
}
async function readStateDirect() {
  var _a, _b, _c;
  const postgres = await postgresPool();
  if (postgres) {
    const result = await postgres.query("SELECT data FROM wedding_admin_state WHERE id = $1", ["primary"]);
    const state = hydrateState((_a = result.rows[0]) == null ? void 0 : _a.data);
    if (((_c = (_b = result.rows[0]) == null ? void 0 : _b.data) == null ? void 0 : _c.version) !== 2) await writeStateDirect(state);
    return state;
  }
  try {
    const raw = JSON.parse(await readFile(dataFile, "utf8"));
    const state = hydrateState(raw);
    if (raw.version !== 2) await writeStateDirect(state);
    return state;
  } catch (error) {
    if ((error == null ? void 0 : error.code) !== "ENOENT") throw error;
    const state = freshState();
    await writeStateDirect(state);
    return state;
  }
}
async function writeStateDirect(state) {
  state.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  const postgres = await postgresPool();
  if (postgres) {
    await postgres.query(`INSERT INTO wedding_admin_state (id, data, updated_at) VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`, ["primary", JSON.stringify(state)]);
    return;
  }
  await mkdir(dataDirectory, { recursive: true });
  const temporaryFile = `${dataFile}.${randomUUID()}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(state, null, 2), "utf8");
  await rename(temporaryFile, dataFile);
}
async function getAdminState() {
  return readStateDirect();
}
async function updateAdminState(mutator) {
  let updated;
  const operation = operationQueue.then(async () => {
    const state = await readStateDirect();
    await mutator(state);
    await writeStateDirect(state);
    updated = state;
  });
  operationQueue = operation.catch(() => void 0);
  await operation;
  return updated;
}
function findOwnedProject(state, userId, projectId) {
  return (projectId ? state.projects.find((item) => item.id === projectId && item.ownerId === userId) : state.projects.find((item) => item.ownerId === userId)) || null;
}
function findPublicProject(state, slug) {
  return (slug ? state.projects.find((project) => project.slug === slug && project.published) : state.projects.find((project) => project.published)) || null;
}
function uniqueSlug(state, desired, excludeProjectId = "") {
  const base = slugify(desired);
  let slug = base;
  let suffix = 2;
  while (state.projects.some((project) => project.id !== excludeProjectId && project.slug === slug)) slug = `${base}-${suffix++}`;
  return slug;
}
function createGuest(partial) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: String(partial.id || randomUUID()),
    name: String(partial.name || "").trim(),
    phone: String(partial.phone || "").trim(),
    email: "",
    group: String(partial.group || "").trim(),
    giftAmount: Math.max(0, Number(partial.giftAmount) || 0),
    giftCurrency: partial.giftCurrency === "KHR" ? "KHR" : "USD",
    partySize: Math.max(1, Number(partial.partySize) || 1),
    attendingCount: Math.max(0, Number(partial.attendingCount) || 0),
    status: ["pending", "attending", "declined"].includes(String(partial.status)) ? partial.status : "pending",
    inviteCode: String(partial.inviteCode || randomBytes(5).toString("hex")).trim(),
    table: String(partial.table || "").trim(),
    notes: String(partial.notes || "").trim(),
    openedAt: String(partial.openedAt || ""),
    respondedAt: String(partial.respondedAt || ""),
    createdAt: String(partial.createdAt || now)
  };
}
function createExpense(partial) {
  return {
    id: String(partial.id || randomUUID()),
    category: String(partial.category || "General").trim(),
    item: String(partial.item || "").trim(),
    vendor: String(partial.vendor || "").trim(),
    budgeted: Math.max(0, Number(partial.budgeted) || 0),
    actual: Math.max(0, Number(partial.actual) || 0),
    paid: Math.max(0, Number(partial.paid) || 0),
    dueDate: String(partial.dueDate || ""),
    status: ["planned", "deposit", "paid", "overdue"].includes(String(partial.status)) ? partial.status : "planned",
    notes: String(partial.notes || "").trim(),
    createdAt: String(partial.createdAt || (/* @__PURE__ */ new Date()).toISOString())
  };
}

export { createGuest as a, uniqueSlug as b, createExpense as c, defaultTheme as d, createProject as e, findOwnedProject as f, getAdminState as g, dataDirectory as h, invitation as i, findPublicProject as j, updateAdminState as u };
//# sourceMappingURL=admin-store.mjs.map
