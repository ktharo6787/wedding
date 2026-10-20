import { _ as __nuxt_component_0 } from './nuxt-link-ww0iTTUE.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { u as useHead } from './v3-CCQO7dRJ.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const guestsPerLoad = 40;
const expensesPerLoad = 40;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Wedding Control Centre" });
    const loading = ref(true);
    const saving = ref(false);
    const autosaveReady = ref(false);
    const notice = ref("");
    const toast = ref({ message: "", type: "success" });
    const errorMessage = ref("");
    const activeTab = ref("overview");
    const configured = ref(false);
    const authenticated = ref(false);
    const registerMode = ref(false);
    const storage = ref("local");
    const credentials = reactive({ username: "", password: "", confirm: "" });
    const projects = ref([]);
    const selectedProjectId = ref("");
    const showProjectCreator = ref(false);
    const newProject = reactive({ name: "", slug: "" });
    const uploadingAsset = ref("");
    const guestSearch = ref("");
    const guestGroupFilter = ref("all");
    const guestGroupSearch = computed({
      get: () => guestGroupFilter.value === "all" ? "" : guestGroupFilter.value,
      set: (value) => {
        guestGroupFilter.value = value.trim() || "all";
      }
    });
    const guestGroupPickerOpen = ref(false);
    const guestGroupPickerQuery = ref("");
    const filteredGuestGroups = computed(() => guestGroups.value.filter((group) => group.toLocaleLowerCase().includes(guestGroupPickerQuery.value.toLocaleLowerCase())));
    ref(null);
    const editingGuestNameId = ref("");
    const newGuestId = ref("");
    const tableFullscreen = ref(false);
    const expenseFullscreen = ref(false);
    const guestFilter = ref("all");
    const guestDisplayLimit = ref(40);
    const expenseSearch = ref("");
    const expenseDisplayLimit = ref(40);
    const dashboard = ref(null);
    let autosaveTimer;
    let noticeTimer;
    let toastTimer;
    let pendingSaveToast = "";
    let lastSavedSnapshot = "";
    const adminData = reactive({
      guests: [],
      expenses: [],
      theme: {
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
        content: {}
      },
      invitation: {
        couple: {},
        parents: { groom: ["", ""], bride: ["", ""] }
      }
    });
    const filteredGuests = computed(() => {
      const query = guestSearch.value.toLowerCase().trim();
      return adminData.guests.filter((guest) => {
        const matchesQuery = !query || [guest.name, guest.group, guest.status].some((value) => String(value || "").toLowerCase().includes(query));
        const matchesFilter = guestFilter.value === "all" || (guestFilter.value === "gift" ? Number(guest.giftAmount || 0) <= 0 : guest.status === guestFilter.value);
        const matchesGroup = guestGroupFilter.value === "all" || String(guest.group || "").trim().toLocaleLowerCase() === guestGroupFilter.value.trim().toLocaleLowerCase();
        return matchesQuery && matchesFilter && matchesGroup;
      });
    });
    const guestGroups = computed(() => [...new Set(adminData.guests.map((guest) => String(guest.group || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)));
    const visibleGuests = computed(() => filteredGuests.value.slice(0, guestDisplayLimit.value));
    const giftSummary = computed(() => ({
      received: adminData.guests.filter((guest) => Number(guest.giftAmount || 0) > 0).length,
      usd: adminData.guests.reduce((total, guest) => total + (guest.giftCurrency === "USD" ? Number(guest.giftAmount || 0) : 0), 0),
      khr: adminData.guests.reduce((total, guest) => total + (guest.giftCurrency === "KHR" ? Number(guest.giftAmount || 0) : 0), 0)
    }));
    watch([guestSearch, guestFilter, guestGroupFilter], () => {
      guestDisplayLimit.value = guestsPerLoad;
    });
    const filteredExpenses = computed(() => {
      const query = expenseSearch.value.toLowerCase().trim();
      if (!query) return adminData.expenses;
      return adminData.expenses.filter((expense) => [expense.category, expense.item, expense.vendor, expense.status].some((value) => String(value || "").toLowerCase().includes(query)));
    });
    const visibleExpenses = computed(() => filteredExpenses.value.slice(0, expenseDisplayLimit.value));
    const expenseSummary = computed(() => ({
      budgeted: adminData.expenses.reduce((total, expense) => total + Number(expense.budgeted || 0), 0),
      actual: adminData.expenses.reduce((total, expense) => total + Number(expense.actual || 0), 0),
      paid: adminData.expenses.reduce((total, expense) => total + Number(expense.paid || 0), 0),
      outstanding: adminData.expenses.reduce((total, expense) => total + Math.max(0, Number(expense.actual || 0) - Number(expense.paid || 0)), 0)
    }));
    watch(expenseSearch, () => {
      expenseDisplayLimit.value = expensesPerLoad;
    });
    const invitationBaseUrl = ref("");
    const currentProject = computed(() => projects.value.find((project) => project.id === selectedProjectId.value) || null);
    const publicInvitationUrl = computed(() => currentProject.value ? `${invitationBaseUrl.value}/?wedding=${encodeURIComponent(currentProject.value.slug)}` : invitationBaseUrl.value);
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    const attendanceRate = computed(() => {
      var _a, _b;
      const invited = ((_b = (_a = dashboard.value) == null ? void 0 : _a.guests) == null ? void 0 : _b.invitedPeople) || 0;
      return invited ? Math.round(dashboard.value.guests.attendingPeople / invited * 100) : 0;
    });
    const budgetRate = computed(() => {
      var _a, _b;
      const budgeted = ((_b = (_a = dashboard.value) == null ? void 0 : _a.budget) == null ? void 0 : _b.budgeted) || 0;
      return budgeted ? Math.min(100, Math.round(dashboard.value.budget.actual / budgeted * 100)) : 0;
    });
    function messageFrom(error) {
      var _a;
      return ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.statusMessage) || (error == null ? void 0 : error.statusMessage) || (error == null ? void 0 : error.message) || "Something went wrong";
    }
    function showToast(message, type = "success") {
      toast.value = { message, type };
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.value.message = "";
      }, 2600);
    }
    function savePayload() {
      return {
        projectId: selectedProjectId.value,
        project: adminData.project,
        guests: adminData.guests,
        expenses: adminData.expenses,
        theme: adminData.theme,
        invitation: adminData.invitation
      };
    }
    function scheduleAutosave() {
      if (!autosaveReady.value || !authenticated.value) return;
      if (autosaveTimer) clearTimeout(autosaveTimer);
      notice.value = "Unsaved changes";
      autosaveTimer = setTimeout(() => saveAll(), 800);
    }
    async function saveAll(toastMessage = "") {
      if (!autosaveReady.value) return;
      if (toastMessage) pendingSaveToast = toastMessage;
      if (saving.value) {
        scheduleAutosave();
        return;
      }
      const body = savePayload();
      const snapshot = JSON.stringify(body);
      if (snapshot === lastSavedSnapshot) {
        if (pendingSaveToast) {
          showToast(pendingSaveToast);
          pendingSaveToast = "";
        }
        return;
      }
      saving.value = true;
      notice.value = "Saving changes\u2026";
      errorMessage.value = "";
      try {
        await $fetch("/api/admin/data", {
          method: "PUT",
          body
        });
        lastSavedSnapshot = snapshot;
        if (currentProject.value && adminData.project) Object.assign(currentProject.value, adminData.project);
        dashboard.value = await $fetch("/api/admin/dashboard", { query: { projectId: selectedProjectId.value } });
        notice.value = "All changes saved";
        if (pendingSaveToast) {
          showToast(pendingSaveToast);
          pendingSaveToast = "";
        }
        if (noticeTimer) clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => {
          if (!saving.value) notice.value = "Autosave on";
        }, 1800);
      } catch (error) {
        errorMessage.value = messageFrom(error);
        notice.value = "Autosave failed";
        showToast("Unable to save changes", "error");
        pendingSaveToast = "";
      } finally {
        saving.value = false;
        if (JSON.stringify(savePayload()) !== lastSavedSnapshot) scheduleAutosave();
      }
    }
    watch(adminData, scheduleAutosave, { deep: true, flush: "post" });
    watch(activeTab, (tab) => {
      return;
    });
    function guestMatchesSearch(guest) {
      const query = guestSearch.value.toLowerCase().trim();
      return Boolean(query) && [guest.name, guest.group, guest.status].some((value) => String(value || "").toLowerCase().includes(query));
    }
    function guestNameParts(name) {
      const value = String(name || "");
      const query = guestSearch.value.trim();
      if (!query) return [{ text: value, match: false }];
      const index = value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
      if (index < 0) return [{ text: value, match: false }];
      return [
        { text: value.slice(0, index), match: false },
        { text: value.slice(index, index + query.length), match: true },
        { text: value.slice(index + query.length), match: false }
      ].filter((part) => part.text);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="admin-auth-shell"><div class="admin-auth-card"><span class="admin-spinner"></span><p>Preparing your control centre\u2026</p></div></div>`);
      } else if (!unref(configured)) {
        _push(`<div class="admin-auth-shell"><form class="admin-auth-card"><span class="admin-kicker">FIRST-TIME SETUP</span><h1>Create your owner account</h1><p>This account controls guests, expenses, invitation content and visual themes.</p><label>Username<input${ssrRenderAttr("value", unref(credentials).username)} required minlength="3" autocomplete="username"></label><label>Password<input${ssrRenderAttr("value", unref(credentials).password)} required minlength="8" type="password" autocomplete="new-password"></label><label>Confirm password<input${ssrRenderAttr("value", unref(credentials).confirm)} required minlength="8" type="password" autocomplete="new-password"></label>`);
        if (unref(errorMessage)) {
          _push(`<p class="admin-error">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="admin-primary" type="submit">CREATE CONTROL CENTRE</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u2190 Return to invitation`);
            } else {
              return [
                createTextVNode("\u2190 Return to invitation")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</form></div>`);
      } else if (!unref(authenticated)) {
        _push(`<div class="admin-auth-shell"><form class="admin-auth-card"><span class="admin-kicker">${ssrInterpolate(unref(registerMode) ? "CREATE YOUR WORKSPACE" : "PRIVATE ADMIN")}</span><h1>${ssrInterpolate(unref(registerMode) ? "Start your wedding" : "Welcome back")}</h1><p>${ssrInterpolate(unref(registerMode) ? "Create an account and customize your own invitation." : "Sign in to manage your wedding celebration.")}</p><label>Username<input${ssrRenderAttr("value", unref(credentials).username)} required autocomplete="username"></label><label>Password<input${ssrRenderAttr("value", unref(credentials).password)} required minlength="8" type="password"${ssrRenderAttr("autocomplete", unref(registerMode) ? "new-password" : "current-password")}></label>`);
        if (unref(registerMode)) {
          _push(`<label>Confirm password<input${ssrRenderAttr("value", unref(credentials).confirm)} required minlength="8" type="password" autocomplete="new-password"></label>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorMessage)) {
          _push(`<p class="admin-error">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="admin-primary" type="submit">${ssrInterpolate(unref(registerMode) ? "CREATE ACCOUNT" : "SIGN IN")}</button><button class="auth-switch" type="button">${ssrInterpolate(unref(registerMode) ? "Already have an account? Sign in" : "New here? Create your own wedding")}</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u2190 Return to invitation`);
            } else {
              return [
                createTextVNode("\u2190 Return to invitation")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</form></div>`);
      } else {
        _push(`<!--[--><aside class="admin-sidebar"><div class="admin-brand"><div class="admin-brand-mark">TT</div><div><span>WEDDING</span><strong>Control Centre</strong></div></div><div class="project-switcher"><label>ACTIVE WEDDING</label><select><!--[-->`);
        ssrRenderList(unref(projects), (project) => {
          _push(`<option${ssrRenderAttr("value", project.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedProjectId)) ? ssrLooseContain(unref(selectedProjectId), project.id) : ssrLooseEqual(unref(selectedProjectId), project.id)) ? " selected" : ""}>${ssrInterpolate(project.name)}</option>`);
        });
        _push(`<!--]--></select><button type="button">\uFF0B New wedding</button></div><nav><small class="sidebar-label">MANAGEMENT</small><button class="${ssrRenderClass({ active: unref(activeTab) === "overview" })}"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z"></path></svg></span><span class="nav-copy"><b>Overview</b><small>Wedding summary</small></span></button><button class="${ssrRenderClass({ active: unref(activeTab) === "guests" })}"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 1c-2.67 0-8 1.34-8 4v3h12v-3c0-2.66-1.33-4-4-4ZM8 14c-3.12 0-6 1.58-6 4v2h4v-3c0-1.12.56-2.1 1.52-2.92C7.68 14.03 7.84 14 8 14Z"></path></svg></span><span class="nav-copy"><b>Guests</b><small>Invites and RSVP</small></span></button><button class="${ssrRenderClass({ active: unref(activeTab) === "expenses" })}"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3V5Zm2 2v10h14V7H5Zm7 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-6 1h2v2H6V9Zm10 4h2v2h-2v-2Z"></path></svg></span><span class="nav-copy"><b>Expenses</b><small>Budget and payments</small></span></button><button class="${ssrRenderClass({ active: unref(activeTab) === "theme" })}"><span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20h1.5a2.5 2.5 0 0 0 0-5H12a1.5 1.5 0 0 1 0-3h2a8 8 0 0 0 8-8c0-2.21-4.48-4-10-4ZM7 9.5A1.5 1.5 0 1 1 7 6a1.5 1.5 0 0 1 0 3.5Zm4-3A1.5 1.5 0 1 1 11 3a1.5 1.5 0 0 1 0 3.5Zm5 3A1.5 1.5 0 1 1 16 6a1.5 1.5 0 0 1 0 3.5Z"></path></svg></span><span class="nav-copy"><b>Theme &amp; Content</b><small>Invitation design</small></span></button></nav><div class="admin-sidebar-foot"><a${ssrRenderAttr("href", unref(publicInvitationUrl))} target="_blank">View invitation \u2197</a><button>Sign out</button></div></aside><section class="admin-workspace">`);
        if (unref(showProjectCreator)) {
          _push(`<form class="new-project-card"><div><span class="admin-kicker">NEW PROJECT</span><h2>Create another wedding</h2></div><label>Wedding name<input${ssrRenderAttr("value", unref(newProject).name)} required placeholder="Sokha &amp; Dara Wedding"></label><label>Public URL name<input${ssrRenderAttr("value", unref(newProject).slug)} placeholder="sokha-dara"></label><button class="admin-primary" type="submit">CREATE WEDDING</button><button class="text-button" type="button">Cancel</button></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<header class="admin-topbar"><div><span class="admin-kicker">${ssrInterpolate(unref(activeTab))}</span><h1>${ssrInterpolate(unref(activeTab) === "overview" ? "Celebration overview" : unref(activeTab) === "guests" ? "Guest management" : unref(activeTab) === "expenses" ? "Budget & expenses" : "Theme & content studio")}</h1></div><div class="admin-actions"><span class="storage-badge">${ssrInterpolate(unref(storage))}</span><span class="${ssrRenderClass([{ saving: unref(saving) }, "autosave-status"])}"><i></i>${ssrInterpolate(unref(notice) || "Autosave on")}</span></div></header>`);
        if (unref(errorMessage)) {
          _push(`<p class="admin-error admin-page-error">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "overview" && unref(dashboard)) {
          _push(`<div class="admin-panel-stack"><div class="metric-grid"><article><span>INVITATIONS</span><strong>${ssrInterpolate(unref(dashboard).guests.invitations)}</strong><small>${ssrInterpolate(unref(dashboard).guests.opened)} opened</small></article><article><span>ATTENDING</span><strong>${ssrInterpolate(unref(dashboard).guests.attendingPeople)}</strong><small>${ssrInterpolate(unref(attendanceRate))}% of invited guests</small></article><article><span>TOTAL BUDGET</span><strong>${ssrInterpolate(unref(currency).format(unref(dashboard).budget.budgeted))}</strong><small>${ssrInterpolate(unref(currency).format(unref(dashboard).budget.remaining))} remaining</small></article><article><span>OUTSTANDING</span><strong>${ssrInterpolate(unref(currency).format(unref(dashboard).budget.outstanding))}</strong><small>${ssrInterpolate(unref(dashboard).budget.overdue)} overdue items</small></article></div><div class="overview-grid"><article class="admin-card"><div class="card-heading"><div><span class="admin-kicker">RSVP PROGRESS</span><h2>Guest responses</h2></div><strong>${ssrInterpolate(unref(attendanceRate))}%</strong></div><div class="progress-track"><i style="${ssrRenderStyle({ width: `${unref(attendanceRate)}%` })}"></i></div><div class="response-breakdown"><span><i class="yes"></i>${ssrInterpolate(unref(dashboard).guests.attending)} attending</span><span><i class="pending"></i>${ssrInterpolate(unref(dashboard).guests.pending)} pending</span><span><i class="no"></i>${ssrInterpolate(unref(dashboard).guests.declined)} declined</span></div></article><article class="admin-card"><div class="card-heading"><div><span class="admin-kicker">BUDGET HEALTH</span><h2>Actual spending</h2></div><strong>${ssrInterpolate(unref(budgetRate))}%</strong></div><div class="progress-track budget"><i style="${ssrRenderStyle({ width: `${unref(budgetRate)}%` })}"></i></div><div class="budget-summary"><span>Actual <b>${ssrInterpolate(unref(currency).format(unref(dashboard).budget.actual))}</b></span><span>Paid <b>${ssrInterpolate(unref(currency).format(unref(dashboard).budget.paid))}</b></span></div></article></div><article class="admin-card quick-actions"><span class="admin-kicker">QUICK START</span><h2>Prepare your celebration</h2><div><button>\uFF0B Add your first guest</button><button>\uFF0B Record an expense</button><button>\u2726 Customize invitation</button></div></article></div>`);
        } else if (unref(activeTab) === "guests") {
          _push(`<div class="admin-panel-stack"><div class="guest-section-head admin-card"><div><span class="admin-kicker">GUEST DIRECTORY</span><h2>Guest list</h2><p>Manage invitations, RSVP status and monetary gifts.</p></div><button class="admin-primary">\uFF0B ADD GUEST</button></div><div class="guest-summary guest-summary-expanded"><span><b>${ssrInterpolate(unref(adminData).guests.length)}</b> invitations</span><span><b>${ssrInterpolate(unref(adminData).guests.filter((g) => g.status === "attending").length)}</b> attending</span><span><b>${ssrInterpolate(unref(adminData).guests.filter((g) => g.status === "pending").length)}</b> awaiting reply</span><span><b>${ssrInterpolate(unref(giftSummary).received)}</b> gifts recorded</span><span class="guest-summary-gift"><small>GIFT TOTAL</small><b>$${ssrInterpolate(unref(giftSummary).usd.toLocaleString())} USD</b><b>${ssrInterpolate(unref(giftSummary).khr.toLocaleString())} KHR</b></span></div><div class="guest-command-bar"><label class="admin-search guest-name-search">\u2315 <input${ssrRenderAttr("value", unref(guestSearch))} placeholder="Search guest name or status"></label><div class="${ssrRenderClass([{ open: unref(guestGroupPickerOpen) }, "guest-group-picker"])}"><span class="guest-group-icon" aria-hidden="true">\u2315</span><input${ssrRenderAttr("value", unref(guestGroupPickerQuery) || unref(guestGroupSearch))} type="text"${ssrRenderAttr("placeholder", unref(guestGroupPickerOpen) ? "Search families / groups\u2026" : "All families / groups")} aria-label="Search families and groups" aria-haspopup="listbox"${ssrRenderAttr("aria-expanded", unref(guestGroupPickerOpen))}>`);
          if (unref(guestGroupFilter) !== "all" || unref(guestGroupPickerQuery)) {
            _push(`<button class="guest-group-clear" type="button" aria-label="Clear family filter">\xD7</button>`);
          } else {
            _push(`<span class="guest-group-caret" aria-hidden="true">\u2304</span>`);
          }
          if (unref(guestGroupPickerOpen)) {
            _push(`<div class="guest-group-options" role="listbox"><button type="button" role="option"${ssrRenderAttr("aria-selected", unref(guestGroupFilter) === "all")}>All families / groups</button><!--[-->`);
            ssrRenderList(unref(filteredGuestGroups), (group) => {
              _push(`<button type="button" role="option"${ssrRenderAttr("aria-selected", unref(guestGroupFilter) === group)}>${ssrInterpolate(group)}`);
              if (unref(guestGroupFilter) === group) {
                _push(`<span class="guest-group-selected-mark">\u2713</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</button>`);
            });
            _push(`<!--]-->`);
            if (!unref(filteredGuestGroups).length) {
              _push(`<p class="guest-group-no-results">No matching groups</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="guest-command-footer"><div class="guest-filters" aria-label="Filter guests"><!--[-->`);
          ssrRenderList([{ key: "all", label: "All" }, { key: "pending", label: "Pending" }, { key: "attending", label: "Attending" }, { key: "declined", label: "Declined" }, { key: "gift", label: "Gift pending" }], (filter) => {
            _push(`<button class="${ssrRenderClass({ active: unref(guestFilter) === filter.key })}">${ssrInterpolate(filter.label)}</button>`);
          });
          _push(`<!--]--></div><div class="guest-toolbar-actions"><div class="guest-data-actions"><button type="button">SAMPLE</button><button type="button">IMPORT</button><button type="button">EXPORT</button></div><input class="guest-import-input" type="file" accept=".xlsx,.xls,.xlsm,.csv"><button class="fullscreen-button">\u26F6 FULL SCREEN</button></div></div></div>`);
          if (unref(visibleGuests).length || unref(tableFullscreen)) {
            _push(`<div class="${ssrRenderClass([{ fullscreen: unref(tableFullscreen) }, "guest-sheet-wrap"])}">`);
            if (unref(tableFullscreen)) {
              _push(`<div class="fullscreen-toolbar"><strong>GUEST MANAGEMENT</strong><div class="fullscreen-search">\u2315 <input${ssrRenderAttr("value", unref(guestSearch))} autofocus placeholder="Search guest name or status"></div><input${ssrRenderAttr("value", unref(guestGroupSearch))} class="guest-group-select fullscreen-group-select" type="search" list="guest-group-options" placeholder="Search group" aria-label="Search family or group"><div class="fullscreen-actions"><button>\uFF0B ADD</button><button>SAMPLE</button><button>IMPORT</button><button>EXPORT</button><button>\xD7 EXIT</button></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<table class="guest-sheet-table"><thead><tr><th>No.</th><th>Guest name</th><th>Family / group</th><th>Invited</th><th>RSVP</th><th>Monetary gift</th><th>Invitation</th><th></th></tr></thead><tbody><!--[-->`);
            ssrRenderList(unref(visibleGuests), (guest, index) => {
              _push(`<tr${ssrRenderAttr("data-guest-id", guest.id)} class="${ssrRenderClass([`status-${guest.status}`, { "search-match": guestMatchesSearch(guest), "new-guest-row": guest.id === unref(newGuestId) }])}"><td class="sheet-row-number">${ssrInterpolate(index + 1)}</td><td class="sheet-name"><div class="guest-name-field">`);
              if (unref(guestSearch) && unref(editingGuestNameId) !== guest.id) {
                _push(`<div class="guest-name-highlight" aria-hidden="true"><!--[-->`);
                ssrRenderList(guestNameParts(guest.name), (part, partIndex) => {
                  _push(`<!--[-->`);
                  if (part.match) {
                    _push(`<mark>${ssrInterpolate(part.text)}</mark>`);
                  } else {
                    _push(`<span>${ssrInterpolate(part.text)}</span>`);
                  }
                  _push(`<!--]-->`);
                });
                _push(`<!--]--></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<input${ssrRenderAttr("value", guest.name)} class="${ssrRenderClass({ "has-highlight-overlay": unref(guestSearch) && unref(editingGuestNameId) !== guest.id })}" placeholder="Guest name"></div><small>${ssrInterpolate(guest.respondedAt ? `RSVP \xB7 ${new Date(guest.respondedAt).toLocaleString()}` : guest.openedAt ? "Opened invitation" : "Not opened")}</small></td><td><input${ssrRenderAttr("value", guest.group)} placeholder="Family or group"></td><td class="sheet-number"><input${ssrRenderAttr("value", guest.partySize)} type="number" min="1"></td><td><select><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(guest.status) ? ssrLooseContain(guest.status, "pending") : ssrLooseEqual(guest.status, "pending")) ? " selected" : ""}>Pending</option><option value="attending"${ssrIncludeBooleanAttr(Array.isArray(guest.status) ? ssrLooseContain(guest.status, "attending") : ssrLooseEqual(guest.status, "attending")) ? " selected" : ""}>Attending</option><option value="declined"${ssrIncludeBooleanAttr(Array.isArray(guest.status) ? ssrLooseContain(guest.status, "declined") : ssrLooseEqual(guest.status, "declined")) ? " selected" : ""}>Declined</option></select></td><td class="sheet-gift"><div><input${ssrRenderAttr("value", guest.giftAmount)} type="number" min="0" step="1" placeholder="Amount"><select><option value="USD"${ssrIncludeBooleanAttr(Array.isArray(guest.giftCurrency) ? ssrLooseContain(guest.giftCurrency, "USD") : ssrLooseEqual(guest.giftCurrency, "USD")) ? " selected" : ""}>USD</option><option value="KHR"${ssrIncludeBooleanAttr(Array.isArray(guest.giftCurrency) ? ssrLooseContain(guest.giftCurrency, "KHR") : ssrLooseEqual(guest.giftCurrency, "KHR")) ? " selected" : ""}>KHR</option></select></div></td><td class="sheet-invite"><code>${ssrInterpolate(guest.inviteCode)}</code><button>COPY LINK</button></td><td><button class="danger-action" title="Remove guest">\xD7</button></td></tr>`);
            });
            _push(`<!--]--></tbody></table>`);
            if (!unref(visibleGuests).length) {
              _push(`<div class="sheet-empty-state"><strong>No guests found</strong><span>Try another search or filter.</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="scroll-load-status">Showing ${ssrInterpolate(unref(visibleGuests).length)} of ${ssrInterpolate(unref(filteredGuests).length)} guests`);
            if (unref(visibleGuests).length < unref(filteredGuests).length) {
              _push(`<span> \xB7 Scroll down to load more</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<div class="guest-empty"><strong>No guests found</strong><p>Try another search or filter.</p></div>`);
          }
          _push(`</div>`);
        } else if (unref(activeTab) === "expenses") {
          _push(`<div class="admin-panel-stack"><div class="guest-section-head admin-card"><div><span class="admin-kicker">EXPENSE DIRECTORY</span><h2>Event expenses</h2><p>Plan the budget, track payments and manage every event cost.</p></div><button class="admin-primary">\uFF0B ADD EXPENSE</button></div><div class="guest-summary expense-summary"><span><b>${ssrInterpolate(unref(adminData).expenses.length)}</b> expenses</span><span><b>${ssrInterpolate(unref(currency).format(unref(expenseSummary).budgeted))}</b> budgeted</span><span><b>${ssrInterpolate(unref(currency).format(unref(expenseSummary).actual))}</b> actual</span><span><b>${ssrInterpolate(unref(currency).format(unref(expenseSummary).paid))}</b> paid</span><span><b>${ssrInterpolate(unref(currency).format(unref(expenseSummary).outstanding))}</b> outstanding</span></div><div class="guest-command-bar"><div class="admin-search">\u2315 <input${ssrRenderAttr("value", unref(expenseSearch))} placeholder="Search category, expense, vendor or status"></div><div class="guest-filters"><button class="fullscreen-button">\u26F6 FULL SCREEN</button></div></div>`);
          if (unref(visibleExpenses).length || unref(expenseFullscreen)) {
            _push(`<div class="${ssrRenderClass([{ fullscreen: unref(expenseFullscreen) }, "expense-sheet-wrap"])}">`);
            if (unref(expenseFullscreen)) {
              _push(`<div class="fullscreen-toolbar"><strong>EXPENSE MANAGEMENT</strong><div class="fullscreen-search">\u2315 <input${ssrRenderAttr("value", unref(expenseSearch))} autofocus placeholder="Search category, expense, vendor or status"></div><button>\xD7 EXIT</button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<table class="expense-sheet-table"><thead><tr><th>No.</th><th>Category</th><th>Expense item</th><th>Vendor</th><th>Budgeted</th><th>Actual</th><th>Paid</th><th>Due</th><th>Status</th><th>Notes</th><th></th></tr></thead><tbody><!--[-->`);
            ssrRenderList(unref(visibleExpenses), (expense, index) => {
              _push(`<tr><td class="sheet-row-number">${ssrInterpolate(index + 1)}</td><td><input${ssrRenderAttr("value", expense.category)} placeholder="Category"></td><td><input${ssrRenderAttr("value", expense.item)} class="expense-item-input" placeholder="Expense item"></td><td><input${ssrRenderAttr("value", expense.vendor)} placeholder="Vendor"></td><td><input${ssrRenderAttr("value", expense.budgeted)} type="number" min="0" step="0.01"></td><td><input${ssrRenderAttr("value", expense.actual)} type="number" min="0" step="0.01"></td><td><input${ssrRenderAttr("value", expense.paid)} type="number" min="0" step="0.01"></td><td><input${ssrRenderAttr("value", expense.dueDate)} type="date"></td><td><select><option value="planned"${ssrIncludeBooleanAttr(Array.isArray(expense.status) ? ssrLooseContain(expense.status, "planned") : ssrLooseEqual(expense.status, "planned")) ? " selected" : ""}>Planned</option><option value="deposit"${ssrIncludeBooleanAttr(Array.isArray(expense.status) ? ssrLooseContain(expense.status, "deposit") : ssrLooseEqual(expense.status, "deposit")) ? " selected" : ""}>Deposit paid</option><option value="paid"${ssrIncludeBooleanAttr(Array.isArray(expense.status) ? ssrLooseContain(expense.status, "paid") : ssrLooseEqual(expense.status, "paid")) ? " selected" : ""}>Paid</option><option value="overdue"${ssrIncludeBooleanAttr(Array.isArray(expense.status) ? ssrLooseContain(expense.status, "overdue") : ssrLooseEqual(expense.status, "overdue")) ? " selected" : ""}>Overdue</option></select></td><td><input${ssrRenderAttr("value", expense.notes)} placeholder="Notes"></td><td><button class="danger-action" title="Remove expense">\xD7</button></td></tr>`);
            });
            _push(`<!--]--></tbody></table>`);
            if (!unref(visibleExpenses).length) {
              _push(`<div class="sheet-empty-state"><strong>No expenses found</strong><span>Try another search.</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="scroll-load-status">Showing ${ssrInterpolate(unref(visibleExpenses).length)} of ${ssrInterpolate(unref(filteredExpenses).length)} expenses`);
            if (unref(visibleExpenses).length < unref(filteredExpenses).length) {
              _push(`<span> \xB7 Scroll down to load more</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<div class="guest-empty"><strong>No expenses yet</strong><p>Add an expense to begin tracking your event budget.</p></div>`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="theme-layout"><div class="theme-editor admin-panel-stack"><article class="admin-card form-card"><span class="admin-kicker">PROJECT &amp; PUBLISHING</span><h2>Wedding website</h2><div class="form-grid two"><label>Project name<input${ssrRenderAttr("value", unref(adminData).project.name)}></label><label>Public URL name<input${ssrRenderAttr("value", unref(adminData).project.slug)}></label></div><div class="switch-row"><label><input${ssrIncludeBooleanAttr(Array.isArray(unref(adminData).project.published) ? ssrLooseContain(unref(adminData).project.published, null) : unref(adminData).project.published) ? " checked" : ""} type="checkbox"> Public invitation enabled</label></div><a class="public-url"${ssrRenderAttr("href", unref(publicInvitationUrl))} target="_blank">${ssrInterpolate(unref(publicInvitationUrl))} \u2197</a></article><article class="admin-card form-card"><span class="admin-kicker">TEMPLATE GALLERY</span><h2>Choose a starting style</h2><div class="template-grid"><button type="button" class="${ssrRenderClass([{ selected: unref(adminData).theme.template === "emerald" }, "template-option emerald"])}"><i></i><strong>Emerald Khmer</strong><small>Deep green and antique gold</small></button><button type="button" class="${ssrRenderClass([{ selected: unref(adminData).theme.template === "ivory" }, "template-option ivory"])}"><i></i><strong>Ivory Romance</strong><small>Soft cream and warm bronze</small></button><button type="button" class="${ssrRenderClass([{ selected: unref(adminData).theme.template === "royal" }, "template-option royal"])}"><i></i><strong>Royal Khmer</strong><small>Burgundy and ceremonial gold</small></button></div></article><article class="admin-card form-card"><div class="card-heading"><div><span class="admin-kicker">VISUAL IDENTITY</span><h2>Colors and atmosphere</h2></div><button class="text-button">Reset colors</button></div><div class="color-grid"><label>Background<input${ssrRenderAttr("value", unref(adminData).theme.background)} type="color"><input${ssrRenderAttr("value", unref(adminData).theme.background)}></label><label>Panels<input${ssrRenderAttr("value", unref(adminData).theme.panel)} type="color"><input${ssrRenderAttr("value", unref(adminData).theme.panel)}></label><label>Gold accent<input${ssrRenderAttr("value", unref(adminData).theme.gold)} type="color"><input${ssrRenderAttr("value", unref(adminData).theme.gold)}></label><label>Main text<input${ssrRenderAttr("value", unref(adminData).theme.text)} type="color"><input${ssrRenderAttr("value", unref(adminData).theme.text)}></label><label>Muted text<input${ssrRenderAttr("value", unref(adminData).theme.muted)} type="color"><input${ssrRenderAttr("value", unref(adminData).theme.muted)}></label></div><label>Background image URL<input${ssrRenderAttr("value", unref(adminData).theme.backgroundImage)} placeholder="/images/interior-background.jpg"></label><label>Typography<select><option value="classic"${ssrIncludeBooleanAttr(Array.isArray(unref(adminData).theme.fontStyle) ? ssrLooseContain(unref(adminData).theme.fontStyle, "classic") : ssrLooseEqual(unref(adminData).theme.fontStyle, "classic")) ? " selected" : ""}>Classic Khmer elegance</option><option value="romantic"${ssrIncludeBooleanAttr(Array.isArray(unref(adminData).theme.fontStyle) ? ssrLooseContain(unref(adminData).theme.fontStyle, "romantic") : ssrLooseEqual(unref(adminData).theme.fontStyle, "romantic")) ? " selected" : ""}>Romantic serif</option><option value="modern"${ssrIncludeBooleanAttr(Array.isArray(unref(adminData).theme.fontStyle) ? ssrLooseContain(unref(adminData).theme.fontStyle, "modern") : ssrLooseEqual(unref(adminData).theme.fontStyle, "modern")) ? " selected" : ""}>Modern clean</option></select></label><div class="switch-row"><label><input${ssrIncludeBooleanAttr(Array.isArray(unref(adminData).theme.animations) ? ssrLooseContain(unref(adminData).theme.animations, null) : unref(adminData).theme.animations) ? " checked" : ""} type="checkbox"> Section animations</label><label><input${ssrIncludeBooleanAttr(Array.isArray(unref(adminData).theme.butterflies) ? ssrLooseContain(unref(adminData).theme.butterflies, null) : unref(adminData).theme.butterflies) ? " checked" : ""} type="checkbox"> Flying butterflies</label></div></article><article class="admin-card form-card"><span class="admin-kicker">IMAGE STUDIO</span><h2>Upload your own artwork</h2><p class="form-help">Use transparent PNG or WEBP images for crests, butterflies and frames. Maximum file size is 8 MB.</p><div class="asset-grid"><!--[-->`);
          ssrRenderList([{ key: "backgroundImage", label: "Section background" }, { key: "openingCrestImage", label: "Opening crest / logo" }, { key: "heroEmblemImage", label: "Invitation emblem" }, { key: "butterflyImage", label: "Animated butterfly" }, { key: "frameImage", label: "Invitation frame overlay" }], (asset) => {
            _push(`<label class="asset-control"><span>${ssrInterpolate(asset.label)}</span><div class="asset-preview" style="${ssrRenderStyle({ backgroundImage: `url('${unref(adminData).theme[asset.key]}')` })}"></div><input${ssrRenderAttr("value", unref(adminData).theme[asset.key])} placeholder="Image URL"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif">`);
            if (unref(uploadingAsset) === asset.key) {
              _push(`<small>Uploading\u2026</small>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</label>`);
          });
          _push(`<!--]--></div></article><article class="admin-card form-card"><span class="admin-kicker">COUPLE &amp; FAMILIES</span><h2>Invitation identity</h2><div class="form-grid two"><label>Groom name<input${ssrRenderAttr("value", unref(adminData).invitation.couple.first)}></label><label>Bride name<input${ssrRenderAttr("value", unref(adminData).invitation.couple.second)}></label><label>Groom display name<input${ssrRenderAttr("value", unref(adminData).invitation.couple.groomEnglish)}></label><label>Bride display name<input${ssrRenderAttr("value", unref(adminData).invitation.couple.brideEnglish)}></label></div><div class="form-grid two"><label>Groom parent 1<input${ssrRenderAttr("value", unref(adminData).invitation.parents.groom[0])}></label><label>Groom parent 2<input${ssrRenderAttr("value", unref(adminData).invitation.parents.groom[1])}></label><label>Bride parent 1<input${ssrRenderAttr("value", unref(adminData).invitation.parents.bride[0])}></label><label>Bride parent 2<input${ssrRenderAttr("value", unref(adminData).invitation.parents.bride[1])}></label></div></article><article class="admin-card form-card"><span class="admin-kicker">EVENT DETAILS</span><h2>Date, time and venue</h2><div class="form-grid two"><label>Event starts<input${ssrRenderAttr("value", unref(adminData).invitation.date)}></label><label>Calendar event ends<input${ssrRenderAttr("value", unref(adminData).invitation.calendarEnd)}></label><label>Date label<input${ssrRenderAttr("value", unref(adminData).invitation.dateLabel)}></label><label>RSVP deadline<input${ssrRenderAttr("value", unref(adminData).invitation.rsvpDeadline)}></label><label>Ceremony time<input${ssrRenderAttr("value", unref(adminData).invitation.ceremonyTime)}></label><label>Reception time<input${ssrRenderAttr("value", unref(adminData).invitation.receptionTime)}></label></div><label>Venue name<input${ssrRenderAttr("value", unref(adminData).invitation.venue)}></label><label>Venue location<input${ssrRenderAttr("value", unref(adminData).invitation.venueLocation)}></label><label>Map address<input${ssrRenderAttr("value", unref(adminData).invitation.venueAddress)}></label><!--[-->`);
          ssrRenderList(unref(adminData).invitation.khmerEventDetails, (_, index) => {
            _push(`<label>Khmer event line ${ssrInterpolate(index + 1)}<input${ssrRenderAttr("value", unref(adminData).invitation.khmerEventDetails[index])}></label>`);
          });
          _push(`<!--]--></article><article class="admin-card form-card"><span class="admin-kicker">WORDS &amp; MESSAGES</span><h2>Invitation copy</h2><label>Opening label<input${ssrRenderAttr("value", unref(adminData).theme.content.openingEyebrow)}></label><label>Announcement<input${ssrRenderAttr("value", unref(adminData).theme.content.announcement)}></label><label>English invitation message<textarea rows="3">${ssrInterpolate(unref(adminData).theme.content.invitationMessage)}</textarea></label><label>Programme subtitle<input${ssrRenderAttr("value", unref(adminData).theme.content.programmeSubtitle)}></label><label>Details subtitle<input${ssrRenderAttr("value", unref(adminData).theme.content.detailsSubtitle)}></label><label>Gifts subtitle<input${ssrRenderAttr("value", unref(adminData).theme.content.giftsSubtitle)}></label><label>RSVP subtitle <small>Use {deadline} to show the configured deadline.</small><input${ssrRenderAttr("value", unref(adminData).theme.content.rsvpSubtitle)}></label><label>Footer message<input${ssrRenderAttr("value", unref(adminData).theme.content.footerMessage)}></label></article></div><aside class="theme-preview" style="${ssrRenderStyle({ "--preview-bg": unref(adminData).theme.background, "--preview-panel": unref(adminData).theme.panel, "--preview-gold": unref(adminData).theme.gold, "--preview-text": unref(adminData).theme.text, "--preview-muted": unref(adminData).theme.muted, backgroundImage: `linear-gradient(#06251fb0,#06251fb0),url('${unref(adminData).theme.backgroundImage}')` })}"><span>LIVE STYLE PREVIEW</span><div><img class="preview-emblem"${ssrRenderAttr("src", unref(adminData).theme.heroEmblemImage)} alt=""><small>${ssrInterpolate(unref(adminData).theme.content.openingEyebrow)}</small><h2>${ssrInterpolate(unref(adminData).invitation.couple.first)} <i>&amp;</i> ${ssrInterpolate(unref(adminData).invitation.couple.second)}</h2><p>${ssrInterpolate(unref(adminData).theme.content.announcement)}</p><article><b>${ssrInterpolate(unref(adminData).invitation.dateLabel)}</b><em>${ssrInterpolate(unref(adminData).invitation.venue)}</em></article></div><a${ssrRenderAttr("href", unref(publicInvitationUrl))} target="_blank">OPEN FULL INVITATION \u2197</a></aside></div>`);
        }
        _push(`</section>`);
        if (unref(toast).message) {
          _push(`<div class="${ssrRenderClass([`is-${unref(toast).type}`, "admin-toast"])}" role="status"><span>${ssrInterpolate(unref(toast).type === "error" ? "!" : unref(toast).type === "info" ? "\u25CF" : "\u2713")}</span>${ssrInterpolate(unref(toast).message)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-xN425PLa.mjs.map
