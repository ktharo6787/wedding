import { defineComponent, computed, withAsyncContext, reactive, watchEffect, ref, mergeProps, unref, toValue, watch, getCurrentInstance, onServerPrefetch, shallowRef, nextTick, toRef, useSSRContext, createElementBlock, provide, cloneVNode, h } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain } from 'vue/server-renderer';
import { h as useRoute, g as fetchDefaults, _ as _export_sfc, a as useNuxtApp, d as asyncDataDefaults, f as createError, s as sanitizeTag } from './server.mjs';
import { E as hash } from '../nitro/nitro.mjs';
import { isPlainObject } from '@vue/shared';
import { debounce } from 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "section-divider",
    "aria-hidden": "true"
  }, _attrs))}><svg viewBox="0 0 1006 86" focusable="false"><g fill="#d6b46e" stroke="#d6b46e" stroke-linecap="round" stroke-linejoin="round"><path d="M8 43C112 42 278 38 397 36L423 43 397 50C278 48 112 44 8 43Z"></path><path d="M998 43C894 42 728 38 609 36L583 43 609 50C728 48 894 44 998 43Z"></path><path d="m429 43 12-10 12 10-12 10Zm124 0 12-10 12 10-12 10Z"></path><path d="m503 17 11 17-11 9-11-9Zm0 52 11-17-11-9-11 9Z"></path><path d="m503 31 12 12-12 12-12-12Z" fill="#092d29" stroke-width="2"></path><circle cx="503" cy="43" r="4"></circle><path d="M461 43c12-2 14-13 24-13 7 0 8 7 4 10-5 3-10-1-8-5m44 8c-12-2-14-13-24-13-7 0-8 7-4 10 5 3 10-1 8-5M461 43c12 2 14 13 24 13 7 0 8-7 4-10-5-3-10 1-8 5m44-8c-12 2-14 13-24 13-7 0-8-7-4-10 5-3 10 1 8 5" fill="none" stroke-width="2"></path><path d="m470 22 7 7-7 7-7-7Zm66 0 7 7-7 7-7-7Zm-66 28 7 7-7 7-7-7Zm66 0 7 7-7 7-7-7Z"></path><circle cx="456" cy="43" r="3"></circle><circle cx="550" cy="43" r="3"></circle></g></svg></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SectionDivider.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
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
function useRequestEvent(nuxtApp) {
  var _a;
  nuxtApp || (nuxtApp = useNuxtApp());
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function useRequestFetch() {
  var _a;
  return ((_a = useRequestEvent()) == null ? void 0 : _a.$fetch) || globalThis.$fetch;
}
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a, _b, _c, _d, _e, _f, _g;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  (_a = options.server) != null ? _a : options.server = true;
  (_b = options.default) != null ? _b : options.default = getDefault;
  (_c = options.getCachedData) != null ? _c : options.getCachedData = getDefaultCachedData;
  (_d = options.lazy) != null ? _d : options.lazy = false;
  (_e = options.immediate) != null ? _e : options.immediate = true;
  (_f = options.deep) != null ? _f : options.deep = asyncDataDefaults.deep;
  (_g = options.dedupe) != null ? _g : options.dedupe = "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    var _a2;
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!((_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2._init)) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.data;
    }),
    pending: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.pending;
    }),
    status: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.status;
    }),
    error: writableComputedRef(() => {
      var _a2;
      return (_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2.error;
    }),
    refresh: (...args2) => {
      var _a2;
      if (!((_a2 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a2._init)) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry = nuxtApp._asyncData[key.value];
      if (entry == null ? void 0 : entry._abortController) {
        try {
          entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  Object.defineProperties(asyncDataPromise, {
    then: { enumerable: true, value: asyncDataPromise.then.bind(asyncDataPromise) },
    catch: { enumerable: true, value: asyncDataPromise.catch.bind(asyncDataPromise) },
    finally: { enumerable: true, value: asyncDataPromise.finally.bind(asyncDataPromise) }
  });
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      var _a;
      return (_a = getter()) == null ? void 0 : _a.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    {
      nuxtApp._asyncData[key].pending.value = false;
    }
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  var _a, _b;
  (_b = (_a = nuxtApp.payload._errors)[key]) != null ? _b : _a[key] = asyncDataDefaults.errorValue;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData != null;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: shallowRef(!hasCachedData),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      var _a2, _b2;
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer((_a2 = opts.dedupe) != null ? _a2 : options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: (_b2 = opts.cause) != null ? _b2 : "refresh:manual" });
        if (cachedData != null) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = asyncDataDefaults.errorValue;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      {
        asyncData.pending.value = true;
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve, reject) => {
          var _a3, _b3;
          try {
            const timeout = (_a3 = opts.timeout) != null ? _a3 : options.timeout;
            const mergedSignal = mergeAbortSignals([(_b3 = asyncData._abortController) == null ? void 0 : _b3.signal, opts == null ? void 0 : opts.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason != null ? reason : "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason != null ? reason : "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return;
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = asyncDataDefaults.errorValue;
        asyncData.status.value = "success";
      }).catch((error) => {
        var _a3;
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if ((_a3 = asyncData._abortController) == null ? void 0 : _a3.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        if (nuxtApp._asyncDataPromises[key] === promise) {
          {
            asyncData.pending.value = false;
          }
          delete nuxtApp._asyncDataPromises[key];
        }
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      var _a2, _b2;
      unsubRefreshAsyncData();
      if ((_a2 = nuxtApp._asyncData[key]) == null ? void 0 : _a2._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (nuxtApp._asyncDataPromises[key]) {
        (_b2 = asyncData._abortController) == null ? void 0 : _b2.abort(new DOMException("AsyncData request cancelled by unmount", "AbortError"));
        delete nuxtApp._asyncDataPromises[key];
        if (asyncData.status.value === "pending") {
          asyncData.status.value = "idle";
        }
        {
          asyncData.pending.value = false;
        }
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          var _a3;
          if (!((_a3 = nuxtApp._asyncData[key]) == null ? void 0 : _a3._init)) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
            asyncData.data.value = asyncDataDefaults.value;
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => asyncDataDefaults.value;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  var _a, _b, _c;
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = (_a = AbortSignal.timeout) == null ? void 0 : _a.call(AbortSignal, timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = (_b = sig.reason) != null ? _b : new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    var _a2;
    const abortedSignal = list.find((s) => s.aborted);
    const reason = (_a2 = abortedSignal == null ? void 0 : abortedSignal.reason) != null ? _a2 : new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    (_c = sig.addEventListener) == null ? void 0 : _c.call(sig, "abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => toValue(request));
  const key = computed(() => toValue(opts.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]));
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watchSources,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
  };
  if (!immediate) {
    let setImmediate = function() {
      _asyncDataOptions.immediate = true;
    };
    watch(key, setImmediate, { flush: "sync", once: true });
    watch([...watchSources || [], _fetchOptions], setImmediate, { flush: "sync", once: true });
  }
  const asyncData = useAsyncData(watchSources === false ? key.value : key, (_, { signal }) => {
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    const resolvedOptions = { signal, ..._fetchOptions };
    for (const key2 of MAYBE_REF_OR_GETTER_OPTION_KEYS) {
      if (typeof resolvedOptions[key2] === "function") {
        resolvedOptions[key2] = toValue(resolvedOptions[key2]);
      }
    }
    return _$fetch(_request.value, resolvedOptions);
  }, _asyncDataOptions);
  return asyncData;
}
const MAYBE_REF_OR_GETTER_OPTION_KEYS = ["method", "baseURL", "query", "params", "body", "headers"];
function generateOptionSegments(opts) {
  var _a;
  const segments = [
    ((_a = toValue(opts.method)) == null ? void 0 : _a.toUpperCase()) || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.query || opts.params]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const entries = [];
      for (const entry of value.entries()) {
        const [key, val] = entry;
        entries.push([key, val instanceof File ? `${val.name}:${val.size}:${val.lastModified}` : val]);
      }
      segments.push(hash(entries));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const weddingSlug = computed(() => String(route.query.wedding || "").trim());
    const { data: managedConfig } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/public/config",
      { query: { wedding: weddingSlug } },
      "$dwJYdXhp9S"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const invitation$1 = reactive(structuredClone(invitation));
    const theme = reactive({
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
    });
    watchEffect(() => {
      var _a;
      if (!managedConfig.value) return;
      const updatedInvitation = managedConfig.value.invitation || {};
      Object.assign(invitation$1, updatedInvitation);
      Object.assign(invitation$1.couple, updatedInvitation.couple || {});
      if (updatedInvitation.parents) {
        invitation$1.parents.groom = updatedInvitation.parents.groom || invitation$1.parents.groom;
        invitation$1.parents.bride = updatedInvitation.parents.bride || invitation$1.parents.bride;
      }
      Object.assign(theme, managedConfig.value.theme || {});
      Object.assign(theme.content, ((_a = managedConfig.value.theme) == null ? void 0 : _a.content) || {});
    });
    const opened = ref(false);
    const playing = ref(false);
    ref(null);
    const pageRoot = ref(null);
    const now = ref(null);
    const guestName = ref("");
    const activeProgramme = ref("ceremony");
    const giftOpened = ref(false);
    const submitted = ref(false);
    const copied = ref(false);
    const rsvpSaving = ref(false);
    const rsvpError = ref("");
    computed(() => String(route.query.invite || "").trim());
    const rsvp = reactive({ name: "", attending: "yes", guests: "1", note: "" });
    const programmes = {
      ceremony: [
        { time: "6:00 AM", symbol: "\u2727", title: "\u1796\u17B7\u1792\u17B8\u179F\u17C2\u1793\u1796\u17D2\u179A\u17C1\u1793", detail: "\u1780\u17B6\u179A\u179A\u17C0\u1794\u1785\u17C6\u1796\u17B7\u1792\u17B8\u178F\u17B6\u1798\u1794\u17D2\u179A\u1796\u17C3\u178E\u17B8\u1781\u17D2\u1798\u17C2\u179A" },
        { time: "7:00 AM", symbol: "\u2667", title: "\u1796\u17B7\u1792\u17B8\u17A0\u17C2\u1787\u17C6\u1793\u17BC\u1793", detail: "\u179F\u17D2\u179C\u17B6\u1782\u1798\u1793\u17CD\u1780\u17D2\u179A\u17BB\u1798\u1782\u17D2\u179A\u17BD\u179F\u17B6\u179A \u1793\u17B7\u1784\u1797\u17D2\u1789\u17C0\u179C\u1780\u17B7\u178F\u17D2\u178F\u17B7\u1799\u179F" },
        { time: "8:00 AM", symbol: "\u2740", title: "\u1796\u17B7\u1792\u17B8\u179F\u17BC\u178F\u17D2\u179A\u1798\u1793\u17D2\u178F", detail: "\u1791\u1791\u17BD\u179B\u1796\u179A\u1787\u17D0\u1799\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1782\u17BC\u179F\u17D2\u179C\u17B6\u1798\u17B8\u1797\u179A\u17B7\u1799\u17B6" },
        { time: "8:45 AM", symbol: "\u25C8", title: "\u1796\u17B7\u1792\u17B8\u1794\u17D2\u179A\u1796\u17C3\u178E\u17B8", detail: "\u1794\u17D2\u179A\u17B6\u179A\u1796\u17D2\u1792\u1796\u17B7\u1792\u17B8\u178A\u17CF\u1798\u17B6\u1793\u17A2\u178F\u17D2\u1790\u1793\u17D0\u1799\u1787\u17B6\u1798\u17BD\u1799\u1780\u17D2\u179A\u17BB\u1798\u1782\u17D2\u179A\u17BD\u179F\u17B6\u179A" },
        { time: "9:00 AM", symbol: "\u2702\uFE0E", title: "\u1796\u17B7\u1792\u17B8\u1780\u17B6\u178F\u17CB\u179F\u1780\u17CB", detail: "\u1796\u17B7\u1792\u17B8\u178F\u17B6\u1798\u1791\u17C6\u1793\u17C0\u1798\u1791\u1798\u17D2\u179B\u17B6\u1794\u17CB\u1781\u17D2\u1798\u17C2\u179A" },
        { time: "10:30 AM", symbol: "\u221E", title: "\u1796\u17B7\u1792\u17B8\u1785\u1784\u178A\u17C3", detail: "\u1796\u17B7\u1792\u17B8\u1785\u1784\u178A\u17C3 \u1793\u17B7\u1784\u1791\u1791\u17BD\u179B\u1796\u179A\u1787\u17D0\u1799\u1796\u17B8\u1780\u17D2\u179A\u17BB\u1798\u1782\u17D2\u179A\u17BD\u179F\u17B6\u179A \u1793\u17B7\u1784\u1797\u17D2\u1789\u17C0\u179C\u1780\u17B7\u178F\u17D2\u178F\u17B7\u1799\u179F" },
        { time: "11:30 AM", symbol: "\u2661", title: "\u1790\u178F\u179A\u17BC\u1794\u17A2\u1793\u17BB\u179F\u17D2\u179F\u17B6\u179C\u179A\u17B8\u1799\u17CD", detail: "\u1785\u1784\u1785\u17B6\u17C6\u1796\u17C1\u179B\u179C\u17C1\u179B\u17B6\u178A\u17CF\u179F\u17D2\u179A\u179F\u17CB\u179F\u17D2\u17A2\u17B6\u178F\u1787\u17B6\u1798\u17BD\u1799\u1782\u17D2\u1793\u17B6" },
        { time: "5:00 PM", symbol: "\u266B", title: "\u1791\u1791\u17BD\u179B\u1797\u17D2\u1789\u17C0\u179C\u1796\u17C1\u179B\u179B\u17D2\u1784\u17B6\u1785", detail: "\u17A2\u1789\u17D2\u1787\u17BE\u1789\u1785\u17BC\u179B\u179A\u17BD\u1798\u17A2\u1794\u17A2\u179A\u179F\u17B6\u1791\u179A \u1793\u17B7\u1784\u1796\u17B7\u179F\u17B6\u17A2\u17B6\u17A0\u17B6\u179A\u1796\u17C1\u179B\u179B\u17D2\u1784\u17B6\u1785" }
      ],
      reception: [
        { time: "5:00 PM", symbol: "\u2727", title: "\u179F\u17D2\u179C\u17B6\u1782\u1798\u1793\u17CD\u1797\u17D2\u1789\u17C0\u179C", detail: "\u1791\u1791\u17BD\u179B\u1797\u17D2\u1789\u17C0\u179C \u1793\u17B7\u1784\u1790\u178F\u179A\u17BC\u1794\u17A2\u1793\u17BB\u179F\u17D2\u179F\u17B6\u179C\u179A\u17B8\u1799\u17CD" },
        { time: "6:00 PM", symbol: "\u2740", title: "\u1796\u17B7\u179F\u17B6\u17A2\u17B6\u17A0\u17B6\u179A\u1796\u17C1\u179B\u179B\u17D2\u1784\u17B6\u1785", detail: "\u1785\u17C2\u1780\u179A\u17C6\u179B\u17C2\u1780\u17A2\u17B6\u17A0\u17B6\u179A \u1793\u17B7\u1784\u179F\u17C1\u1785\u1780\u17D2\u178F\u17B8\u179A\u17B8\u1780\u179A\u17B6\u1799" },
        { time: "7:00 PM", symbol: "\u266B", title: "\u17A2\u1794\u17A2\u179A\u179F\u17B6\u1791\u179A\u1782\u17BC\u179F\u17D2\u179C\u17B6\u1798\u17B8\u1797\u179A\u17B7\u1799\u17B6", detail: "\u178F\u1793\u17D2\u178F\u17D2\u179A\u17B8 \u1780\u17B6\u179A\u1787\u17BC\u1793\u1796\u179A \u1793\u17B7\u1784\u1780\u17B6\u179A\u179A\u17B6\u17C6\u1780\u1798\u17D2\u179F\u17B6\u1793\u17D2\u178F" }
      ]
    };
    const dateParts = computed(() => {
      const [year, monthNumber, day] = invitation$1.date.slice(0, 10).split("-");
      const date = /* @__PURE__ */ new Date(`${year}-${monthNumber}-${day}T00:00:00Z`);
      return {
        year,
        monthNumber,
        day,
        month: new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(date).toUpperCase(),
        weekday: new Intl.DateTimeFormat("en", { weekday: "long", timeZone: "UTC" }).format(date).toUpperCase()
      };
    });
    const dateDisplay = computed(() => `${dateParts.value.day} \xB7 ${dateParts.value.month} \xB7 ${dateParts.value.year}`);
    const rsvpSubtitle = computed(() => String(theme.content.rsvpSubtitle || "").replace("{deadline}", invitation$1.rsvpDeadline));
    const safeBackgroundImage = computed(() => String(theme.backgroundImage || "/images/interior-background.jpg").replace(/[\"'()]/g, ""));
    const safeButterflyImage = computed(() => String(theme.butterflyImage || "/images/animated-butterfly.png").replace(/[\"'()]/g, ""));
    const themeStyles = computed(() => ({
      "--theme-background": theme.background,
      "--theme-panel": theme.panel,
      "--theme-gold": theme.gold,
      "--theme-text": theme.text,
      "--theme-muted": theme.muted,
      "--theme-background-image": `url("${safeBackgroundImage.value}")`,
      "--theme-butterfly-image": `url("${safeButterflyImage.value}")`
    }));
    computed(() => {
      if (now.value === null) return null;
      const remaining = Math.max(0, new Date(invitation$1.date).getTime() - now.value);
      return {
        days: Math.floor(remaining / 864e5),
        hours: Math.floor(remaining % 864e5 / 36e5),
        minutes: Math.floor(remaining % 36e5 / 6e4),
        seconds: Math.floor(remaining % 6e4 / 1e3)
      };
    });
    const mapUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation$1.venueAddress)}`);
    const calendarUrl = computed(() => {
      const start = new Date(invitation$1.date);
      const end = new Date(invitation$1.calendarEnd);
      const format = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: `Wedding of ${invitation$1.couple.first} & ${invitation$1.couple.second}`,
        dates: `${format(start)}/${format(end)}`,
        stz: "Asia/Phnom_Penh",
        etz: "Asia/Phnom_Penh",
        details: invitation$1.venueAddress ? "We look forward to celebrating with you." : "We look forward to celebrating with you. Venue details to follow."
      });
      if (invitation$1.venueAddress) params.set("location", invitation$1.venueAddress);
      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    });
    const rsvpText = computed(() => [
      `RSVP for ${invitation$1.couple.first} & ${invitation$1.couple.second}`,
      `Name: ${rsvp.name}`,
      `Attending: ${rsvp.attending === "yes" ? "Yes" : "No"}`,
      `Guests: ${rsvp.attending === "yes" ? rsvp.guests : "0"}`,
      `Message: ${rsvp.note || "None"}`
    ].join("\n"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionDivider = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({
        ref_key: "pageRoot",
        ref: pageRoot,
        class: ["wedding-app", { "invitation-open": unref(opened), "theme-no-motion": !unref(theme).animations, "theme-no-butterflies": !unref(theme).butterflies, [`theme-font-${unref(theme).fontStyle}`]: true }],
        style: unref(themeStyles)
      }, _attrs))}><div class="${ssrRenderClass([{ "is-open": unref(opened) }, "opening-screen"])}"><div class="opening-door opening-door-left"></div><div class="opening-door opening-door-right"></div><div class="opening-content"><div class="opening-heading"><p class="opening-eyebrow">${ssrInterpolate(unref(theme).content.openingEyebrow)}</p><h1 lang="km">${ssrInterpolate(unref(invitation$1).couple.first)} <i>&amp;</i> ${ssrInterpolate(unref(invitation$1).couple.second)}</h1><p class="opening-script">With love, we invite you to celebrate</p></div><button class="opening-crest" type="button" aria-label="Open the wedding invitation"><img${ssrRenderAttr("src", unref(theme).openingCrestImage)} alt=""></button><div class="opening-lower"><label class="guest-label" for="guest-name">INVITED GUEST</label><div class="guest-name-wrap"><span class="guest-name-measure" aria-hidden="true">${ssrInterpolate(unref(guestName) || "Invited guest")}</span><input id="guest-name"${ssrRenderAttr("value", unref(guestName))} class="guest-input" maxlength="60" placeholder="Invited guest" autocomplete="name" readonly aria-readonly="true"></div><p class="opening-date">${ssrInterpolate(unref(dateDisplay))}</p><p class="opening-date-khmer" lang="km">\u1790\u17D2\u1784\u17C3\u17A2\u17B6\u1791\u17B7\u178F\u17D2\u1799 \u1791\u17B8\u17E0\u17E6 \u1781\u17C2\u1792\u17D2\u1793\u17BC \u1786\u17D2\u1793\u17B6\u17C6\u17E2\u17E0\u17E2\u17E6 \u179C\u17C1\u179B\u17B6\u1798\u17C9\u17C4\u1784 \u17E5:\u17E0\u17E0 \u179B\u17D2\u1784\u17B6\u1785<br>\u179F\u17D2\u1790\u17B7\u178F\u1793\u17C5 \u1798\u1787\u17D2\u1788\u1798\u178E\u17D2\u178C\u179B\u179F\u1793\u17D2\u1793\u17B7\u1794\u17B6\u178F \u1793\u17B7\u1784\u1796\u17B7\u1796\u17D0\u179A\u178E\u17CD \u17A2\u1793\u17D2\u178F\u179A\u1787\u17B6\u178F\u17B7<br>(\u1787\u17D2\u179A\u17C4\u1799\u1785\u1784\u17D2\u179C\u17B6\u179A) OCIC (\u17A2\u1782\u17B6\u179A A)</p></div></div></div><audio${ssrRenderAttr("src", unref(invitation$1).musicFile)} loop preload="none"></audio>`);
      if (unref(opened)) {
        _push(`<button class="music-control" type="button"${ssrRenderAttr("aria-label", unref(playing) ? "Pause music" : "Play music")}${ssrRenderAttr("aria-pressed", unref(playing))}>${ssrInterpolate(unref(playing) ? "\u266B" : "\u266A")}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(opened) && unref(theme).butterflies) {
        _push(`<div class="butterfly-layer" aria-hidden="true"><span class="butterfly butterfly-one"></span><span class="butterfly butterfly-two"></span><span class="butterfly butterfly-three"></span><span class="butterfly butterfly-four"></span><span class="butterfly butterfly-five"></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section id="home" class="hero emerald-section" data-reveal><div class="hero-inner invitation-sheet ornament-frame"><img class="khmer-title-emblem"${ssrRenderAttr("src", unref(theme).heroEmblemImage)} alt="Wedding monogram">`);
      if (unref(theme).frameImage) {
        _push(`<img class="custom-frame-overlay"${ssrRenderAttr("src", unref(theme).frameImage)} alt="" aria-hidden="true">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="hero-copy text-only-invitation">`);
      if (unref(guestName)) {
        _push(`<p class="guest-greeting">DEAR ${ssrInterpolate(unref(guestName).toUpperCase())},</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="khmer invitation-heading" lang="km">\u179F\u17B7\u179A\u17B8\u179F\u17BD\u179F\u17D2\u178F\u17B8\u17A2\u17B6\u1796\u17B6\u17A0\u17CD\u1796\u17B7\u1796\u17B6\u17A0\u17CD</p><div class="parent-columns" aria-label="Parents of the groom and bride"><div class="parent-family"><span class="khmer parent-family-label" lang="km">\u1798\u17B6\u178F\u17B6\u1794\u17B7\u178F\u17B6\u1780\u17BC\u1793\u1794\u17D2\u179A\u17BB\u179F</span><!--[-->`);
      ssrRenderList(unref(invitation$1).parents.groom, (parent) => {
        _push(`<p class="khmer parent-name" lang="km">${ssrInterpolate(parent)}</p>`);
      });
      _push(`<!--]--></div><div class="parent-family"><span class="khmer parent-family-label" lang="km">\u1798\u17B6\u178F\u17B6\u1794\u17B7\u178F\u17B6\u1780\u17BC\u1793\u179F\u17D2\u179A\u17B8</span><!--[-->`);
      ssrRenderList(unref(invitation$1).parents.bride, (parent) => {
        _push(`<p class="khmer parent-name" lang="km">${ssrInterpolate(parent)}</p>`);
      });
      _push(`<!--]--></div></div><p class="khmer invitation-heading" lang="km">\u1798\u17B6\u1793\u1780\u17B7\u178F\u17D2\u178F\u17B7\u1799\u179F \u179F\u17BC\u1798\u1782\u17C4\u179A\u1796\u17A2\u1789\u17D2\u1787\u17BE\u1789</p><p class="khmer hero-message" lang="km">\u17AF\u1780\u17A7\u178F\u17D2\u178F\u1798 \u179B\u17C4\u1780\u1787\u17C6\u1791\u17B6\u179C \u179B\u17C4\u1780\u17A7\u1780\u1789\u17C9\u17B6 \u179B\u17C4\u1780 \u179B\u17C4\u1780\u179F\u17D2\u179A\u17B8 \u17A2\u17D2\u1793\u1780\u1793\u17B6\u1784 \u1780\u1789\u17D2\u1789\u17B6 \u1794\u17D2\u179A\u17B7\u1799\u1798\u17B7\u178F\u17D2\u178F\u17A2\u1789\u17D2\u1787\u17BE\u1789\u1785\u17BC\u179B\u179A\u17BD\u1798\u1787\u17B6\u17A2\u1792\u17B7\u1794\u178F\u17B8 \u1793\u17B7\u1784\u1787\u17B6\u1797\u17D2\u1789\u17C0\u179C\u1780\u17B7\u178F\u17D2\u178F\u17B7\u1799\u179F \u178A\u17BE\u1798\u17D2\u1794\u17B8\u1794\u17D2\u179A\u179F\u17B7\u1791\u17D2\u1792\u1796\u179A\u1787\u17D0\u1799 \u179F\u17B7\u179A\u17B8\u1798\u1784\u17D2\u1782\u179B \u1780\u17D2\u1793\u17BB\u1784\u1796\u17B7\u1792\u17B8\u179A\u17C0\u1794\u17A2\u17B6\u1796\u17B6\u17A0\u17CD\u1796\u17B7\u1796\u17B6\u17A0\u17CD \u1780\u17BC\u1793\u1794\u17D2\u179A\u17BB\u179F \u1780\u17BC\u1793\u179F\u17D2\u179A\u17B8 \u179A\u1794\u179F\u17CB\u1799\u17BE\u1784\u1781\u17D2\u1789\u17BB\u17C6\u17D4</p><div class="khmer couple-roles" lang="km"><span>\u1780\u17BC\u1793\u1794\u17D2\u179A\u17BB\u179F\u1793\u17B6\u1798</span><span>\u1780\u17BC\u1793\u179F\u17D2\u179A\u17B8\u1793\u17B6\u1798</span></div><h2 class="couple-names english-couple-names"><span>${ssrInterpolate(unref(invitation$1).couple.groomEnglish)}</span><em>\u1787\u17B6\u1782\u17BC\u1793\u17B9\u1784</em><span>${ssrInterpolate(unref(invitation$1).couple.brideEnglish)}</span></h2><p class="wedding-title">${ssrInterpolate(unref(theme).content.announcement)}</p><div class="gold-divider"><span>\u2726</span></div><p class="english-message">${ssrInterpolate(unref(theme).content.invitationMessage)}</p><div class="date-plaque"><strong>${ssrInterpolate(unref(dateParts).day)}</strong><span>${ssrInterpolate(unref(dateParts).month)}<br>${ssrInterpolate(unref(dateParts).year)}</span><small>${ssrInterpolate(unref(dateParts).weekday)}</small></div><div class="khmer event-details-khmer" lang="km"><!--[-->`);
      ssrRenderList(unref(invitation$1).khmerEventDetails, (line) => {
        _push(`<p>${ssrInterpolate(line)}</p>`);
      });
      _push(`<!--]--></div><a class="text-link" href="#programme">EXPLORE THE INVITATION <span aria-hidden="true">\u2193</span></a></div></div></section><section id="programme" class="content-section programme-section emerald-section" data-reveal>`);
      _push(ssrRenderComponent(_component_SectionDivider, null, null, _parent));
      _push(`<div class="section-heading"><span class="micro-label">THE WEDDING PROGRAMME</span><p class="khmer" lang="km">${ssrInterpolate(unref(activeProgramme) === "ceremony" ? "\u1796\u17B7\u1792\u17B8\u1798\u1784\u17D2\u1782\u179B\u1780\u17B6\u179A" : "\u1791\u1791\u17BD\u179B\u1797\u17D2\u1789\u17C0\u179C")}</p><h2>${ssrInterpolate(unref(activeProgramme) === "ceremony" ? "Ceremony" : "Reception")}</h2><p class="section-subtitle">${ssrInterpolate(unref(theme).content.programmeSubtitle)}</p></div><div class="programme-card ornament-frame"><div class="segment-control" aria-label="Programme"><button type="button" class="${ssrRenderClass({ active: unref(activeProgramme) === "ceremony" })}"${ssrRenderAttr("aria-pressed", unref(activeProgramme) === "ceremony")}>CEREMONY</button><button type="button" class="${ssrRenderClass({ active: unref(activeProgramme) === "reception" })}"${ssrRenderAttr("aria-pressed", unref(activeProgramme) === "reception")}>RECEPTION</button></div><ol class="programme-list"><!--[-->`);
      ssrRenderList(programmes[unref(activeProgramme)], (item) => {
        _push(`<li><span class="programme-icon" aria-hidden="true">${ssrInterpolate(item.symbol)}</span><span class="programme-point" aria-hidden="true">\u2726</span><div><time>${ssrInterpolate(item.time)}</time><h3 class="khmer" lang="km">${ssrInterpolate(item.title)}</h3><p class="khmer" lang="km">${ssrInterpolate(item.detail)}</p></div></li>`);
      });
      _push(`<!--]--></ol><p class="programme-footnote">The programme is a guide; please confirm ritual wording and times before sharing.</p></div></section><section id="details" class="content-section details-section emerald-section" data-reveal>`);
      _push(ssrRenderComponent(_component_SectionDivider, null, null, _parent));
      _push(`<div class="section-heading"><span class="micro-label">THE ESSENTIALS</span><p class="khmer" lang="km">\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179F\u17C6\u1781\u17B6\u1793\u17CB\u17D7</p><h2>Wedding Details</h2><p class="section-subtitle">${ssrInterpolate(unref(theme).content.detailsSubtitle)}</p></div><div class="details-grid"><article class="detail-card ornament-frame"><span class="detail-icon" aria-hidden="true">\u25C7</span><span class="micro-label">THE DATE</span><h3>${ssrInterpolate(unref(invitation$1).dateLabel)}</h3><p>Ceremony at ${ssrInterpolate(unref(invitation$1).ceremonyTime)}<br>Reception at ${ssrInterpolate(unref(invitation$1).receptionTime)}</p><a class="outline-button"${ssrRenderAttr("href", unref(calendarUrl))} target="_blank" rel="noopener noreferrer" aria-label="Open wedding event in Google Calendar">ADD TO GOOGLE CALENDAR \u2197</a></article><article class="detail-card ornament-frame"><span class="detail-icon" aria-hidden="true">\u2316</span><span class="micro-label">THE VENUE</span><h3>${ssrInterpolate(unref(invitation$1).venue)}</h3><p>${ssrInterpolate(unref(invitation$1).venueLocation)}`);
      if (unref(invitation$1).venueAddress) {
        _push(`<!--[--><br>${ssrInterpolate(unref(invitation$1).venueAddress)}<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p>`);
      if (unref(invitation$1).venueAddress) {
        _push(`<a class="outline-button"${ssrRenderAttr("href", unref(mapUrl))} target="_blank" rel="noopener noreferrer">OPEN MAP \u2197</a>`);
      } else {
        _push(`<span class="detail-note">Location details coming soon</span>`);
      }
      _push(`</article><article class="detail-card dress-detail ornament-frame"><span class="detail-icon" aria-hidden="true">\u2727</span><span class="micro-label">DRESS CODE</span><h3>${ssrInterpolate(unref(invitation$1).dressCode)}</h3><p>Dress for a joyful celebration.</p><div class="palette" aria-label="Suggested elegant color palette"><span></span><span></span><span></span><span></span></div></article></div></section><section id="gifts" class="content-section gifts-section emerald-section" data-reveal>`);
      _push(ssrRenderComponent(_component_SectionDivider, null, null, _parent));
      _push(`<div class="section-heading"><span class="micro-label">WITH ALL OUR HEARTS</span><p class="khmer" lang="km">\u1785\u17C6\u178E\u1784\u178A\u17C3</p><h2>A Note on Gifts</h2><p class="section-subtitle">${ssrInterpolate(unref(theme).content.giftsSubtitle)}</p></div><div class="gift-envelope-wrap"><button class="${ssrRenderClass([{ "is-open": unref(giftOpened) }, "gift-envelope"])}" type="button"${ssrRenderAttr("aria-expanded", unref(giftOpened))} aria-controls="gift-message"><span class="gift-envelope-paper" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="gift-envelope-body" aria-hidden="true"></span><span class="gift-envelope-flap" aria-hidden="true"></span><span class="gift-envelope-seal">${ssrInterpolate(unref(invitation$1).couple.initials)}</span></button><p class="gift-hint">${ssrInterpolate(unref(giftOpened) ? "A MESSAGE FROM US" : "TAP THE ENVELOPE")}</p>`);
      if (unref(giftOpened)) {
        _push(`<div id="gift-message" class="gift-message"><span class="gift-message-kicker">A NOTE FOR YOU</span><p>Your presence is the most precious gift. If you wish to give more, a wishing well will be available at our celebration.</p><span class="gift-message-signoff">WITH LOVE, ${ssrInterpolate(unref(invitation$1).couple.first.toUpperCase())} &amp; ${ssrInterpolate(unref(invitation$1).couple.second.toUpperCase())}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section id="rsvp" class="content-section rsvp-section emerald-section" data-reveal>`);
      _push(ssrRenderComponent(_component_SectionDivider, null, null, _parent));
      _push(`<div class="section-heading"><span class="micro-label">WE HOPE YOU CAN JOIN US</span><p class="khmer" lang="km">\u179F\u17BC\u1798\u1786\u17D2\u179B\u17BE\u1799\u178F\u1794</p><h2>Kindly Reply</h2><p class="section-subtitle">${ssrInterpolate(unref(rsvpSubtitle))}</p></div><div class="rsvp-card ornament-frame">`);
      if (!unref(submitted)) {
        _push(`<form class="rsvp-form"><label>YOUR NAME<input${ssrRenderAttr("value", unref(rsvp).name)} type="text" name="name" autocomplete="name" required placeholder="Full name"></label><fieldset><legend>WILL YOU ATTEND?</legend><label><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(rsvp).attending, "yes")) ? " checked" : ""} type="radio" value="yes"> Joyfully accepts</label><label><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(rsvp).attending, "no")) ? " checked" : ""} type="radio" value="no"> Regretfully declines</label></fieldset>`);
        if (unref(rsvp).attending === "yes") {
          _push(`<label>NUMBER OF GUESTS<select><option value="1"${ssrIncludeBooleanAttr(Array.isArray(unref(rsvp).guests) ? ssrLooseContain(unref(rsvp).guests, "1") : ssrLooseEqual(unref(rsvp).guests, "1")) ? " selected" : ""}>1 guest</option><option value="2"${ssrIncludeBooleanAttr(Array.isArray(unref(rsvp).guests) ? ssrLooseContain(unref(rsvp).guests, "2") : ssrLooseEqual(unref(rsvp).guests, "2")) ? " selected" : ""}>2 guests</option><option value="3"${ssrIncludeBooleanAttr(Array.isArray(unref(rsvp).guests) ? ssrLooseContain(unref(rsvp).guests, "3") : ssrLooseEqual(unref(rsvp).guests, "3")) ? " selected" : ""}>3 guests</option><option value="4"${ssrIncludeBooleanAttr(Array.isArray(unref(rsvp).guests) ? ssrLooseContain(unref(rsvp).guests, "4") : ssrLooseEqual(unref(rsvp).guests, "4")) ? " selected" : ""}>4 guests</option><option value="5"${ssrIncludeBooleanAttr(Array.isArray(unref(rsvp).guests) ? ssrLooseContain(unref(rsvp).guests, "5") : ssrLooseEqual(unref(rsvp).guests, "5")) ? " selected" : ""}>5 guests</option><option value="6"${ssrIncludeBooleanAttr(Array.isArray(unref(rsvp).guests) ? ssrLooseContain(unref(rsvp).guests, "6") : ssrLooseEqual(unref(rsvp).guests, "6")) ? " selected" : ""}>\u1785\u17D2\u179A\u17BE\u1793\u1787\u17B6\u1784 6 guests</option></select></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label>A MESSAGE FOR US<textarea rows="3" placeholder="Your wishes or a note...">${ssrInterpolate(unref(rsvp).note)}</textarea></label>`);
        if (unref(rsvpError)) {
          _push(`<p class="rsvp-error">${ssrInterpolate(unref(rsvpError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="gold-button" type="submit"${ssrIncludeBooleanAttr(unref(rsvpSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(rsvpSaving) ? "SAVING\u2026" : "SEND RSVP")} <span aria-hidden="true">\u2197</span></button></form>`);
      } else {
        _push(`<div class="rsvp-result" role="status"><h3>Thank you</h3><p>Your RSVP has been saved for the couple.</p><pre>${ssrInterpolate(unref(rsvpText))}</pre><button class="gold-button" type="button">${ssrInterpolate(unref(copied) ? "COPIED" : "COPY RESPONSE")}</button><button class="text-link" type="button">EDIT RESPONSE</button></div>`);
      }
      _push(`</div></section><section class="content-section letter-section emerald-section" data-reveal aria-label="\u179F\u17C1\u1785\u1780\u17D2\u178F\u17B8\u1790\u17D2\u179B\u17C2\u1784\u17A2\u17C6\u178E\u179A\u1782\u17BB\u178E">`);
      _push(ssrRenderComponent(_component_SectionDivider, null, null, _parent));
      _push(`<div class="letter-card ornament-frame"><div class="letter-block"><h2 class="khmer" lang="km">\u179B\u17B7\u1781\u17B7\u178F\u1790\u17D2\u179B\u17C2\u1784\u17A2\u17C6\u178E\u179A\u1782\u17BB\u178E!</h2><p class="khmer" lang="km">\u1781\u17D2\u1789\u17BB\u17C6\u1794\u17B6\u1791 \u1793\u17B6\u1784\u1781\u17D2\u1789\u17BB\u17C6\u1787\u17B6\u1798\u17D2\u1785\u17B6\u179F\u17CB\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8 \u179F\u17BC\u1798\u1790\u17D2\u179B\u17C2\u1784\u17A2\u17C6\u178E\u179A\u1782\u17BB\u178E\u1799\u17C9\u17B6\u1784\u1787\u17D2\u179A\u17B6\u179B\u1787\u17D2\u179A\u17C5\u1785\u17C6\u1796\u17C4\u17C7 \u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u178A\u17CF\u17A7\u178F\u17D2\u178F\u17BB\u1784\u17D2\u1782\u17A7\u178F\u17D2\u178F\u1798\u179A\u1794\u179F\u17CB\u17AF\u1780\u17A7\u178F\u17D2\u178F\u1798 \u179B\u17C4\u1780\u1787\u17C6\u1791\u17B6\u179C \u179B\u17C4\u1780\u17A2\u17D2\u1793\u1780\u17A7\u1780\u1789\u17C9\u17B6 \u17A2\u17D2\u1793\u1780\u17A7\u1780\u1789\u17C9\u17B6 \u17A7\u1780\u1789\u17C9\u17B6 \u179B\u17C4\u1780 \u179B\u17C4\u1780\u179F\u17D2\u179A\u17B8 \u17A2\u17D2\u1793\u1780\u1793\u17B6\u1784 \u1780\u1789\u17D2\u1789\u17B6 \u178A\u17C2\u179B\u17A2\u1789\u17D2\u1787\u17BE\u1789\u1785\u17BC\u179B\u179A\u17BD\u1798 \u1787\u17B6\u1797\u17D2\u1789\u17C0\u179C\u1780\u17B7\u178F\u17D2\u178F\u17B7\u1799\u179F\u1780\u17D2\u1793\u17BB\u1784\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u179A\u1794\u179F\u17CB\u1799\u17BE\u1784\u1781\u17D2\u1789\u17BB\u17C6\u17D4 \u179F\u17BC\u1798\u1798\u17C1\u178F\u17D2\u178F\u17B6\u1791\u1791\u17BD\u179B\u1793\u17BC\u179C\u1780\u17B6\u179A\u1782\u17C4\u179A\u1796\u178A\u17CF\u1781\u17D2\u1796\u1784\u17CB\u1781\u17D2\u1796\u179F\u17CB \u179A\u1794\u179F\u17CB\u1782\u17D2\u179A\u17BD\u179F\u17B6\u179A\u1799\u17BE\u1784\u1781\u17D2\u1789\u17BB\u17C6\u17D4</p></div><div class="letter-block"><h2 class="khmer" lang="km">\u179B\u17B7\u1781\u17B7\u178F\u179F\u17BC\u1798\u17A2\u1797\u17D0\u1799\u1791\u17C4\u179F</h2><p class="khmer" lang="km">\u1781\u17D2\u1789\u17BB\u17C6\u1794\u17B6\u1791 \u1793\u17B6\u1784\u1781\u17D2\u1789\u17BB\u17C6\u1787\u17B6\u1798\u17D2\u1785\u17B6\u179F\u17CB\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8 \u179F\u17BC\u1798\u1798\u17C1\u178F\u17D2\u178F\u17B6\u1781\u1793\u17D2\u178F\u17B8\u17A2\u1797\u17D0\u1799\u1791\u17C4\u179F\u1796\u17B8\u179F\u17C6\u178E\u17B6\u1780\u17CB\u17AF\u1780\u17A7\u178F\u17D2\u178F\u1798 \u179B\u17C4\u1780\u1787\u17C6\u1791\u17B6\u179C \u179B\u17C4\u1780\u17A2\u17D2\u1793\u1780\u17A7\u1780\u1789\u17C9\u17B6 \u17A2\u17D2\u1793\u1780\u17A7\u1780\u1789\u17C9\u17B6 \u17A7\u1780\u1789\u17C9\u17B6 \u179B\u17C4\u1780 \u179B\u17C4\u1780\u179F\u17D2\u179A\u17B8 \u17A2\u17D2\u1793\u1780\u1793\u17B6\u1784 \u1780\u1789\u17D2\u1789\u17B6 \u1793\u17B7\u1784\u1797\u17D2\u1789\u17C0\u179C\u1780\u17B7\u178F\u17D2\u178F\u17B7\u1799\u179F \u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB\u178A\u17C4\u1799\u1799\u17BE\u1784\u1781\u17D2\u1789\u17BB\u17C6\u1796\u17BB\u17C6\u1794\u17B6\u1793\u1787\u17BC\u1793\u179B\u17B7\u1781\u17B7\u178F\u17A2\u1789\u17D2\u1787\u17BE\u1789 \u178A\u17C4\u1799\u1795\u17D2\u1791\u17B6\u179B\u17CB\u178A\u17C3 \u17AC\u1785\u17C6\u1796\u17C4\u17C7\u1780\u17C6\u17A0\u17BB\u179F\u17A2\u1780\u17D2\u1781\u179A\u17B6\u179C\u17B7\u179A\u17BB\u1791\u17D2\u1792\u1780\u17D2\u1793\u17BB\u1784 \u1780\u17B6\u179A\u179F\u179A\u179F\u17C1\u179A\u1788\u17D2\u1798\u17C4\u17C7\u17D4 \u179F\u17BC\u1798\u1798\u17C1\u178F\u17D2\u178F\u17B6\u1799\u17C4\u1782\u1799\u179B\u17CB \u1793\u17B7\u1784\u179F\u17BC\u1798\u1782\u17C4\u179A\u1796\u17A2\u179A\u1782\u17BB\u178E\u1791\u17BB\u1780\u1787\u17B6\u1798\u17BB\u1793\u17D4</p></div></div></section><footer class="emerald-section" data-reveal><p class="khmer" lang="km">\u179F\u17BC\u1798\u17A2\u179A\u1782\u17BB\u178E</p><strong class="khmer" lang="km">${ssrInterpolate(unref(invitation$1).couple.first)} <i>&amp;</i> ${ssrInterpolate(unref(invitation$1).couple.second)}</strong><span>${ssrInterpolate(unref(dateDisplay))}</span><p>${ssrInterpolate(unref(theme).content.footerMessage)}</p></footer>`);
      if (unref(opened)) {
        _push(`<nav class="bottom-nav" aria-label="Invitation sections"><a href="#home"><span aria-hidden="true">\u2302</span><small>HOME</small></a><a href="#programme"><span aria-hidden="true">\u25A6</span><small>PROGRAM</small></a><a href="#details"><span aria-hidden="true">\u2316</span><small>DETAILS</small></a><a href="#gifts"><span aria-hidden="true">\u25C7</span><small>GIFTS</small></a><a href="#rsvp"><span aria-hidden="true">\u2661</span><small>RSVP</small></a></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DRQcXSbB.mjs.map
