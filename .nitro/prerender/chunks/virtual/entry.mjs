import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { fromWebHandler } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/h3@1.15.5/node_modules/h3/dist/index.mjs';
import { isServer, ssr, getRequestEvent, renderToString, renderToStream, createComponent, ssrHydrationKey, NoHydration, escape, Hydration, ssrAttribute, HydrationScript, useAssets as useAssets$1, ssrElement, mergeProps, delegateEvents, spread } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/dist/server.js';
import { createContext, createSignal, sharedConfig, onCleanup, catchError, ErrorBoundary as ErrorBoundary$1, onMount, Suspense, createMemo, createUniqueId, useContext, lazy as lazy$1, createRenderEffect, children, getOwner, on as on$1, runWithOwner, untrack, Show, createRoot, startTransition, resetErrorBoundaries, batch, createComponent as createComponent$1 } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/dist/server.js';
import { provideRequestEvent } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/storage/dist/storage.js';

var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _a2, _headers, _init, _b;
const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const normalize = function(path) {
  if (path.length === 0) {
    return ".";
  }
  path = normalizeWindowsPath(path);
  const isUNCPath = path.match(_UNC_REGEX);
  const isPathAbsolute = isAbsolute(path);
  const trailingSeparator = path[path.length - 1] === "/";
  path = normalizeString(path, !isPathAbsolute);
  if (path.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path += "/";
  }
  if (_DRIVE_LETTER_RE.test(path)) {
    path += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path}`;
    }
    return `//${path}`;
  }
  return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};
const join = function(...segments) {
  let path = "";
  for (const seg of segments) {
    if (!seg) {
      continue;
    }
    if (path.length > 0) {
      const pathTrailing = path[path.length - 1] === "/";
      const segLeading = seg[0] === "/";
      const both = pathTrailing && segLeading;
      if (both) {
        path += seg.slice(1);
      } else {
        path += pathTrailing || segLeading ? seg : `/${seg}`;
      }
    } else {
      path += seg;
    }
  }
  return normalize(path);
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ;
      else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p2) {
  return _IS_ABSOLUTE_RE.test(p2);
};
const clientViteManifest = { "_SvgIcons-Bc8DTsO2.js": { "file": "_build/assets/SvgIcons-Bc8DTsO2.js", "name": "SvgIcons", "imports": ["_web-D2UMIhVL.js"] }, "_components-Bc2jZgE0.js": { "file": "_build/assets/components-Bc2jZgE0.js", "name": "components", "imports": ["_web-D2UMIhVL.js", "_routing-B50e_oTn.js"] }, "_index-pgRk-UqO.js": { "file": "_build/assets/index-pgRk-UqO.js", "name": "index", "imports": ["_web-D2UMIhVL.js"] }, "_routing-B50e_oTn.js": { "file": "_build/assets/routing-B50e_oTn.js", "name": "routing", "imports": ["_web-D2UMIhVL.js"] }, "_theme-Dy0Xe1sx.js": { "file": "_build/assets/theme-Dy0Xe1sx.js", "name": "theme", "imports": ["_web-D2UMIhVL.js"] }, "_web-D2UMIhVL.js": { "file": "_build/assets/web-D2UMIhVL.js", "name": "web" }, "node_modules/.pnpm/vanilla-picker@2.12.3/node_modules/vanilla-picker/dist/vanilla-picker.mjs": { "file": "_build/assets/vanilla-picker-B3LgXoKV.js", "name": "vanilla-picker", "src": "node_modules/.pnpm/vanilla-picker@2.12.3/node_modules/vanilla-picker/dist/vanilla-picker.mjs", "isDynamicEntry": true }, "node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs": { "file": "_build/assets/xlsx-CNerDvZX.js", "name": "xlsx", "src": "node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs", "isDynamicEntry": true }, "src/entry-client.tsx": { "file": "_build/assets/entry-client-Bnr7JZ-f.js", "name": "entry-client", "src": "src/entry-client.tsx", "isEntry": true, "imports": ["_web-D2UMIhVL.js", "_theme-Dy0Xe1sx.js", "_index-pgRk-UqO.js", "_routing-B50e_oTn.js"], "dynamicImports": ["src/routes/[...404].tsx?pick=default&pick=$css", "src/routes/[...404].tsx?pick=default&pick=$css", "src/routes/about.tsx?pick=default&pick=$css", "src/routes/about.tsx?pick=default&pick=$css", "src/routes/index.tsx?pick=default&pick=$css", "src/routes/index.tsx?pick=default&pick=$css", "src/routes/privacy-policy.tsx?pick=default&pick=$css", "src/routes/privacy-policy.tsx?pick=default&pick=$css", "src/routes/terms.tsx?pick=default&pick=$css", "src/routes/terms.tsx?pick=default&pick=$css", "src/routes/t/[toolId].tsx?pick=default&pick=$css", "src/routes/t/[toolId].tsx?pick=default&pick=$css"], "css": ["_build/assets/entry-client-trgQPfR2.css"] }, "src/routes/[...404].tsx?pick=default&pick=$css": { "file": "_build/assets/_...404_-Bgy7F5VO.js", "name": "_...404_", "src": "src/routes/[...404].tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_web-D2UMIhVL.js", "_components-Bc2jZgE0.js", "_routing-B50e_oTn.js"] }, "src/routes/about.tsx?pick=default&pick=$css": { "file": "_build/assets/about-DypnfzrK.js", "name": "about", "src": "src/routes/about.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_web-D2UMIhVL.js", "_components-Bc2jZgE0.js", "_routing-B50e_oTn.js"] }, "src/routes/index.tsx?pick=default&pick=$css": { "file": "_build/assets/index-CV5fpy_d.js", "name": "index", "src": "src/routes/index.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_web-D2UMIhVL.js", "_SvgIcons-Bc8DTsO2.js"] }, "src/routes/privacy-policy.tsx?pick=default&pick=$css": { "file": "_build/assets/privacy-policy-Wp3zmLPI.js", "name": "privacy-policy", "src": "src/routes/privacy-policy.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_web-D2UMIhVL.js", "_index-pgRk-UqO.js"] }, "src/routes/t/[toolId].tsx?pick=default&pick=$css": { "file": "_build/assets/_toolId_-etGPVKHV.js", "name": "_toolId_", "src": "src/routes/t/[toolId].tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_web-D2UMIhVL.js", "_SvgIcons-Bc8DTsO2.js", "_theme-Dy0Xe1sx.js", "_index-pgRk-UqO.js", "_routing-B50e_oTn.js"], "dynamicImports": ["node_modules/.pnpm/vanilla-picker@2.12.3/node_modules/vanilla-picker/dist/vanilla-picker.mjs", "node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs"], "css": ["_build/assets/_toolId_-C9TzHYAF.css"] }, "src/routes/terms.tsx?pick=default&pick=$css": { "file": "_build/assets/terms-B8yzq7PZ.js", "name": "terms", "src": "src/routes/terms.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_web-D2UMIhVL.js", "_index-pgRk-UqO.js"] } };
function getSsrProdManifest() {
  const viteManifest = clientViteManifest;
  return {
    path(id) {
      if (id.startsWith("./")) id = id.slice(2);
      const viteManifestEntry = clientViteManifest[
        id
        /*globalThis._importMeta_.env.START_CLIENT_ENTRY*/
      ];
      if (!viteManifestEntry) throw new Error(`No entry found in vite manifest for '${id}'`);
      return join("/", viteManifestEntry.file);
    },
    async getAssets(id) {
      if (id.startsWith("./")) id = id.slice(2);
      return createHtmlTagsForAssets(findAssetsInViteManifest(clientViteManifest, id));
    },
    async json() {
      const json = {};
      const entryKeys = Object.keys(viteManifest).filter((id) => {
        var _a3, _b2;
        return ((_a3 = viteManifest[id]) == null ? void 0 : _a3.isEntry) || ((_b2 = viteManifest[id]) == null ? void 0 : _b2.isDynamicEntry);
      }).map((id) => id);
      for (const entryKey of entryKeys) {
        json[entryKey] = {
          output: join("/", viteManifest[entryKey].file),
          assets: await this.getAssets(entryKey)
        };
      }
      return json;
    }
  };
}
function createHtmlTagsForAssets(assets) {
  return assets.filter((asset) => asset.endsWith(".css") || asset.endsWith(".js") || asset.endsWith(".ts") || asset.endsWith(".mjs")).map((asset) => ({
    tag: "link",
    attrs: {
      href: "/" + asset,
      key: asset,
      ...asset.endsWith(".css") ? {
        rel: "stylesheet"
      } : {
        rel: "modulepreload"
      }
    }
  }));
}
const entryId = "./src/entry-client.tsx".slice(2);
let entryImports = void 0;
function findAssetsInViteManifest(manifest2, id, assetMap2 = /* @__PURE__ */ new Map(), stack = []) {
  var _a3, _b2, _c;
  if (stack.includes(id)) {
    return [];
  }
  const cached = assetMap2.get(id);
  if (cached) {
    return cached;
  }
  const chunk = manifest2[id];
  if (!chunk) {
    return [];
  }
  if (!entryImports) {
    entryImports = [entryId, ...(_b2 = (_a3 = manifest2[entryId]) == null ? void 0 : _a3.imports) != null ? _b2 : []];
  }
  const excludeEntryImports = id !== entryId;
  const assets = ((_c = chunk.css) == null ? void 0 : _c.filter(Boolean)) || [];
  if (chunk.imports) {
    stack.push(id);
    for (let i = 0, l2 = chunk.imports.length; i < l2; i++) {
      const importId = chunk.imports[i];
      if (!importId || excludeEntryImports && entryImports.includes(importId)) continue;
      assets.push(...findAssetsInViteManifest(manifest2, importId, assetMap2, stack));
    }
    stack.pop();
  }
  assets.push(chunk.file);
  const all = Array.from(new Set(assets));
  assetMap2.set(id, all);
  return all;
}
function getSsrManifest(target) {
  return getSsrProdManifest();
}
var _tmpl$$5 = " ";
const assetMap = {
  style: (props) => ssrElement("style", props.attrs, () => props.children, true),
  link: (props) => ssrElement("link", props.attrs, void 0, true),
  script: (props) => {
    return props.attrs.src ? ssrElement("script", mergeProps(() => props.attrs, {
      get id() {
        return props.key;
      }
    }), () => ssr(_tmpl$$5), true) : null;
  },
  noscript: (props) => ssrElement("noscript", props.attrs, () => escape(props.children), true)
};
function renderAsset(asset, nonce) {
  let {
    tag,
    attrs: {
      key,
      ...attrs
    } = {
      key: void 0
    },
    children: children2
  } = asset;
  return assetMap[tag]({
    attrs: {
      ...attrs,
      nonce
    },
    key,
    children: children2
  });
}
const REGISTRY = /* @__PURE__ */ Symbol("assetRegistry");
const NOOP = () => "";
const keyAttrs = ["href", "rel", "data-vite-dev-id"];
const getEntity = (registry, asset) => {
  var _a3;
  let key = asset.tag;
  for (const k2 of keyAttrs) {
    if (!(k2 in asset.attrs)) continue;
    key += `[${k2}='${asset.attrs[k2]}']`;
  }
  const entity = (_a3 = registry[key]) != null ? _a3 : registry[key] = {
    key,
    consumers: 0
  };
  return entity;
};
const useAssets = (assets, nonce) => {
  var _a3, _b2, _c;
  if (!assets.length) return;
  const registry = (_b2 = (_a3 = getRequestEvent().locals)[REGISTRY]) != null ? _b2 : _a3[REGISTRY] = {};
  const ssrRequestAssets = (_c = sharedConfig.context) == null ? void 0 : _c.assets;
  const cssKeys = [];
  for (const asset of assets) {
    const entity = getEntity(registry, asset);
    const isCSSLink = asset.tag === "link" && asset.attrs.rel === "stylesheet";
    const isCSS = isCSSLink || asset.tag === "style";
    if (isCSS) {
      cssKeys.push(entity.key);
    }
    entity.consumers++;
    if (entity.consumers > 1) continue;
    useAssets$1(() => renderAsset(asset, nonce));
    entity.ssrIdx = ssrRequestAssets.length - 1;
  }
  onCleanup(() => {
    for (const key of cssKeys) {
      const entity = registry[key];
      entity.consumers--;
      if (entity.consumers != 0) {
        continue;
      }
      ssrRequestAssets.splice(entity.ssrIdx, 1, NOOP);
      delete registry[key];
    }
  });
};
const assetsById = {};
const getAssets = async (id) => {
  if (assetsById[id]) return assetsById[id];
  const manifest2 = getSsrManifest();
  const assets = await manifest2.getAssets(id);
  assetsById[id] = assets;
  return assets;
};
const withAssets = function(fn2) {
  const wrapper = async () => {
    const mod = await fn2();
    const id = mod.id$$;
    if (!id) return mod;
    if (!mod.default) {
      console.error(`Module ${id} does not export default`);
      return {
        default: () => []
      };
    }
    const assets = await getAssets(id);
    if (!assets.length) return mod;
    return {
      default: (props) => {
        const {
          nonce
        } = getRequestEvent();
        useAssets(assets, nonce);
        return mod.default(props);
      }
    };
  };
  return wrapper;
};
const lazy = !isServer ? lazy$1 : (fn2) => lazy$1(withAssets(fn2));
function createBeforeLeave() {
  let listeners = /* @__PURE__ */ new Set();
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  let ignore = false;
  function confirm(to2, options) {
    if (ignore) return !(ignore = false);
    const e = {
      to: to2,
      options,
      defaultPrevented: false,
      preventDefault: () => e.defaultPrevented = true
    };
    for (const l2 of listeners) l2.listener({
      ...e,
      from: l2.location,
      retry: (force) => {
        force && (ignore = true);
        l2.navigate(to2, {
          ...options,
          resolve: false
        });
      }
    });
    return !e.defaultPrevented;
  }
  return {
    subscribe,
    confirm
  };
}
let depth;
function saveCurrentDepth() {
  if (!window.history.state || window.history.state._depth == null) {
    window.history.replaceState({
      ...window.history.state,
      _depth: window.history.length - 1
    }, "");
  }
  depth = window.history.state._depth;
}
if (!isServer) {
  saveCurrentDepth();
}
function keepDepth(state) {
  return {
    ...state,
    _depth: window.history.state && window.history.state._depth
  };
}
function notifyIfNotBlocked(notify, block) {
  let ignore = false;
  return () => {
    const prevDepth = depth;
    saveCurrentDepth();
    const delta = prevDepth == null ? null : depth - prevDepth;
    if (ignore) {
      ignore = false;
      return;
    }
    if (delta && block(delta)) {
      ignore = true;
      window.history.go(-delta);
    } else {
      notify();
    }
  };
}
const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|(\/)\/+$/g;
const mockBase = "http://sr";
function normalizePath(path, omitSlash = false) {
  const s = path.replace(trimPathRegex, "$1");
  return s ? omitSlash || /^[?#]/.test(s) ? s : "/" + s : "";
}
function resolvePath(base, path, from) {
  if (hasSchemeRegex.test(path)) {
    return void 0;
  }
  const basePath = normalizePath(base);
  const fromPath = from && normalizePath(from);
  let result = "";
  if (!fromPath || path.startsWith("/")) {
    result = basePath;
  } else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
    result = basePath + fromPath;
  } else {
    result = fromPath;
  }
  return (result || "/") + normalizePath(path, !result);
}
function invariant(value, message) {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
function joinPaths(from, to2) {
  return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to2);
}
function extractSearchParams(url) {
  const params = {};
  url.searchParams.forEach((value, key) => {
    if (key in params) {
      if (Array.isArray(params[key])) params[key].push(value);
      else params[key] = [params[key], value];
    } else params[key] = value;
  });
  return params;
}
function createMatcher$1(path, partial, matchFilters) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;
  return (location) => {
    const locSegments = location.split("/").filter(Boolean);
    const lenDiff = locSegments.length - len;
    if (lenDiff < 0 || lenDiff > 0 && splat === void 0 && !partial) {
      return null;
    }
    const match = {
      path: len ? "" : "/",
      params: {}
    };
    const matchFilter = (s) => matchFilters === void 0 ? void 0 : matchFilters[s];
    for (let i = 0; i < len; i++) {
      const segment = segments[i];
      const dynamic = segment[0] === ":";
      const locSegment = dynamic ? locSegments[i] : locSegments[i].toLowerCase();
      const key = dynamic ? segment.slice(1) : segment.toLowerCase();
      if (dynamic && matchSegment(locSegment, matchFilter(key))) {
        match.params[key] = locSegment;
      } else if (dynamic || !matchSegment(locSegment, key)) {
        return null;
      }
      match.path += `/${locSegment}`;
    }
    if (splat) {
      const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
      if (matchSegment(remainder, matchFilter(splat))) {
        match.params[splat] = remainder;
      } else {
        return null;
      }
    }
    return match;
  };
}
function matchSegment(input, filter) {
  const isEqual = (s) => s === input;
  if (filter === void 0) {
    return true;
  } else if (typeof filter === "string") {
    return isEqual(filter);
  } else if (typeof filter === "function") {
    return filter(input);
  } else if (Array.isArray(filter)) {
    return filter.some(isEqual);
  } else if (filter instanceof RegExp) {
    return filter.test(input);
  }
  return false;
}
function scoreRoute(route) {
  const [pattern, splat] = route.pattern.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === void 0 ? 0 : 1));
}
function createMemoObject(fn2) {
  const map = /* @__PURE__ */ new Map();
  const owner = getOwner();
  return new Proxy({}, {
    get(_2, property) {
      if (!map.has(property)) {
        runWithOwner(owner, () => map.set(property, createMemo(() => fn2()[property])));
      }
      return map.get(property)();
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    },
    ownKeys() {
      return Reflect.ownKeys(fn2());
    },
    has(_2, property) {
      return property in fn2();
    }
  });
}
function expandOptionals(pattern) {
  let match = /(\/?\:[^\/]+)\?/.exec(pattern);
  if (!match) return [pattern];
  let prefix = pattern.slice(0, match.index);
  let suffix = pattern.slice(match.index + match[0].length);
  const prefixes = [prefix, prefix += match[1]];
  while (match = /^(\/\:[^\/]+)\?/.exec(suffix)) {
    prefixes.push(prefix += match[1]);
    suffix = suffix.slice(match[0].length);
  }
  return expandOptionals(suffix).reduce((results, expansion) => [...results, ...prefixes.map((p2) => p2 + expansion)], []);
}
const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "<A> and 'use' router primitives can be only used inside a Route.");
const useRoute = () => useContext(RouteContextObj) || useRouter().base;
const useResolvedPath = (path) => {
  const route = useRoute();
  return createMemo(() => route.resolvePath(path()));
};
const useHref = (to2) => {
  const router2 = useRouter();
  return createMemo(() => {
    const to_ = to2();
    return to_ !== void 0 ? router2.renderPath(to_) : to_;
  });
};
const useLocation = () => useRouter().location;
const useParams = () => useRouter().params;
function createRoutes$1(routeDef, base = "") {
  const {
    component,
    preload,
    load,
    children: children2,
    info
  } = routeDef;
  const isLeaf = !children2 || Array.isArray(children2) && !children2.length;
  const shared = {
    key: routeDef,
    component,
    preload: preload || load,
    info
  };
  return asArray(routeDef.path).reduce((acc, originalPath) => {
    for (const expandedPath of expandOptionals(originalPath)) {
      const path = joinPaths(base, expandedPath);
      let pattern = isLeaf ? path : path.split("/*", 1)[0];
      pattern = pattern.split("/").map((s) => {
        return s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s);
      }).join("/");
      acc.push({
        ...shared,
        originalPath,
        pattern,
        matcher: createMatcher$1(pattern, !isLeaf, routeDef.matchFilters)
      });
    }
    return acc;
  }, []);
}
function createBranch(routes2, index = 0) {
  return {
    routes: routes2,
    score: scoreRoute(routes2[routes2.length - 1]) * 1e4 - index,
    matcher(location) {
      const matches = [];
      for (let i = routes2.length - 1; i >= 0; i--) {
        const route = routes2[i];
        const match = route.matcher(location);
        if (!match) {
          return null;
        }
        matches.unshift({
          ...match,
          route
        });
      }
      return matches;
    }
  };
}
function asArray(value) {
  return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", stack = [], branches = []) {
  const routeDefs = asArray(routeDef);
  for (let i = 0, len = routeDefs.length; i < len; i++) {
    const def = routeDefs[i];
    if (def && typeof def === "object") {
      if (!def.hasOwnProperty("path")) def.path = "";
      const routes2 = createRoutes$1(def, base);
      for (const route of routes2) {
        stack.push(route);
        const isEmptyArray = Array.isArray(def.children) && def.children.length === 0;
        if (def.children && !isEmptyArray) {
          createBranches(def.children, route.pattern, stack, branches);
        } else {
          const branch = createBranch([...stack], branches.length);
          branches.push(branch);
        }
        stack.pop();
      }
    }
  }
  return stack.length ? branches : branches.sort((a, b2) => b2.score - a.score);
}
function getRouteMatches(branches, location) {
  for (let i = 0, len = branches.length; i < len; i++) {
    const match = branches[i].matcher(location);
    if (match) {
      return match;
    }
  }
  return [];
}
function createLocation(path, state, queryWrapper) {
  const origin = new URL(mockBase);
  const url = createMemo((prev) => {
    const path_ = path();
    try {
      return new URL(path_, origin);
    } catch (err) {
      console.error(`Invalid path ${path_}`);
      return prev;
    }
  }, origin, {
    equals: (a, b2) => a.href === b2.href
  });
  const pathname = createMemo(() => url().pathname);
  const search = createMemo(() => url().search, true);
  const hash = createMemo(() => url().hash);
  const key = () => "";
  const queryFn = on$1(search, () => extractSearchParams(url()));
  return {
    get pathname() {
      return pathname();
    },
    get search() {
      return search();
    },
    get hash() {
      return hash();
    },
    get state() {
      return state();
    },
    get key() {
      return key();
    },
    query: queryWrapper ? queryWrapper(queryFn) : createMemoObject(queryFn)
  };
}
let intent;
function getIntent() {
  return intent;
}
function createRouterContext(integration, branches, getContext, options = {}) {
  const {
    signal: [source, setSource],
    utils = {}
  } = integration;
  const parsePath = utils.parsePath || ((p2) => p2);
  const renderPath = utils.renderPath || ((p2) => p2);
  const beforeLeave = utils.beforeLeave || createBeforeLeave();
  const basePath = resolvePath("", options.base || "");
  if (basePath === void 0) {
    throw new Error(`${basePath} is not a valid base path`);
  } else if (basePath && !source().value) {
    setSource({
      value: basePath,
      replace: true,
      scroll: false
    });
  }
  const [isRouting, setIsRouting] = createSignal(false);
  let lastTransitionTarget;
  const transition = (newIntent, newTarget) => {
    if (newTarget.value === reference() && newTarget.state === state()) return;
    if (lastTransitionTarget === void 0) setIsRouting(true);
    intent = newIntent;
    lastTransitionTarget = newTarget;
    startTransition(() => {
      if (lastTransitionTarget !== newTarget) return;
      setReference(lastTransitionTarget.value);
      setState(lastTransitionTarget.state);
      resetErrorBoundaries();
      if (!isServer) submissions[1]((subs) => subs.filter((s) => s.pending));
    }).finally(() => {
      if (lastTransitionTarget !== newTarget) return;
      batch(() => {
        intent = void 0;
        if (newIntent === "navigate") navigateEnd(lastTransitionTarget);
        setIsRouting(false);
        lastTransitionTarget = void 0;
      });
    });
  };
  const [reference, setReference] = createSignal(source().value);
  const [state, setState] = createSignal(source().state);
  const location = createLocation(reference, state, utils.queryWrapper);
  const referrers = [];
  const submissions = createSignal(isServer ? initFromFlash2() : []);
  const matches = createMemo(() => {
    if (typeof options.transformUrl === "function") {
      return getRouteMatches(branches(), options.transformUrl(location.pathname));
    }
    return getRouteMatches(branches(), location.pathname);
  });
  const buildParams = () => {
    const m2 = matches();
    const params2 = {};
    for (let i = 0; i < m2.length; i++) {
      Object.assign(params2, m2[i].params);
    }
    return params2;
  };
  const params = utils.paramsWrapper ? utils.paramsWrapper(buildParams, branches) : createMemoObject(buildParams);
  const baseRoute = {
    pattern: basePath,
    path: () => basePath,
    outlet: () => null,
    resolvePath(to2) {
      return resolvePath(basePath, to2);
    }
  };
  createRenderEffect(on$1(source, (source2) => transition("native", source2), {
    defer: true
  }));
  return {
    base: baseRoute,
    location,
    params,
    isRouting,
    renderPath,
    parsePath,
    navigatorFactory,
    matches,
    beforeLeave,
    preloadRoute,
    singleFlight: options.singleFlight === void 0 ? true : options.singleFlight,
    submissions
  };
  function navigateFromRoute(route, to2, options2) {
    untrack(() => {
      if (typeof to2 === "number") {
        if (!to2) ;
        else if (utils.go) {
          utils.go(to2);
        } else {
          console.warn("Router integration does not support relative routing");
        }
        return;
      }
      const queryOnly = !to2 || to2[0] === "?";
      const {
        replace,
        resolve,
        scroll,
        state: nextState
      } = {
        replace: false,
        resolve: !queryOnly,
        scroll: true,
        ...options2
      };
      const resolvedTo = resolve ? route.resolvePath(to2) : resolvePath(queryOnly && location.pathname || "", to2);
      if (resolvedTo === void 0) {
        throw new Error(`Path '${to2}' is not a routable path`);
      } else if (referrers.length >= MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }
      const current = reference();
      if (resolvedTo !== current || nextState !== state()) {
        if (isServer) {
          const e = getRequestEvent();
          e && (e.response = {
            status: 302,
            headers: new Headers({
              Location: resolvedTo
            })
          });
          setSource({
            value: resolvedTo,
            replace,
            scroll,
            state: nextState
          });
        } else if (beforeLeave.confirm(resolvedTo, options2)) {
          referrers.push({
            value: current,
            replace,
            scroll,
            state: state()
          });
          transition("navigate", {
            value: resolvedTo,
            state: nextState
          });
        }
      }
    });
  }
  function navigatorFactory(route) {
    route = route || useContext(RouteContextObj) || baseRoute;
    return (to2, options2) => navigateFromRoute(route, to2, options2);
  }
  function navigateEnd(next) {
    const first = referrers[0];
    if (first) {
      setSource({
        ...next,
        replace: first.replace,
        scroll: first.scroll
      });
      referrers.length = 0;
    }
  }
  function preloadRoute(url, preloadData) {
    const matches2 = getRouteMatches(branches(), url.pathname);
    const prevIntent = intent;
    intent = "preload";
    for (let match in matches2) {
      const {
        route,
        params: params2
      } = matches2[match];
      route.component && route.component.preload && route.component.preload();
      const {
        preload
      } = route;
      preloadData && preload && runWithOwner(getContext(), () => preload({
        params: params2,
        location: {
          pathname: url.pathname,
          search: url.search,
          hash: url.hash,
          query: extractSearchParams(url),
          state: null,
          key: ""
        },
        intent: "preload"
      }));
    }
    intent = prevIntent;
  }
  function initFromFlash2() {
    const e = getRequestEvent();
    return e && e.router && e.router.submission ? [e.router.submission] : [];
  }
}
function createRouteContext(router2, parent, outlet, match) {
  const {
    base,
    location,
    params
  } = router2;
  const {
    pattern,
    component,
    preload
  } = match().route;
  const path = createMemo(() => match().path);
  component && component.preload && component.preload();
  const data = preload ? preload({
    params,
    location,
    intent: intent || "initial"
  }) : void 0;
  const route = {
    parent,
    pattern,
    path,
    outlet: () => component ? createComponent$1(component, {
      params,
      location,
      data,
      get children() {
        return outlet();
      }
    }) : outlet(),
    resolvePath(to2) {
      return resolvePath(base.path(), to2, path());
    }
  };
  return route;
}
const createRouterComponent = (router2) => (props) => {
  const {
    base
  } = props;
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), props.base || ""));
  let context;
  const routerState = createRouterContext(router2, branches, () => context, {
    base,
    singleFlight: props.singleFlight,
    transformUrl: props.transformUrl
  });
  router2.create && router2.create(routerState);
  return createComponent(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return createComponent(Root, {
        routerState,
        get root() {
          return props.root;
        },
        get preload() {
          return props.rootPreload || props.rootLoad;
        },
        get children() {
          return [(context = getOwner()) && null, createComponent(Routes, {
            routerState,
            get branches() {
              return branches();
            }
          })];
        }
      });
    }
  });
};
function Root(props) {
  const location = props.routerState.location;
  const params = props.routerState.params;
  const data = createMemo(() => props.preload && untrack(() => {
    props.preload({
      params,
      location,
      intent: getIntent() || "initial"
    });
  }));
  return createComponent(Show, {
    get when() {
      return props.root;
    },
    keyed: true,
    get fallback() {
      return props.children;
    },
    children: (Root2) => createComponent(Root2, {
      params,
      location,
      get data() {
        return data();
      },
      get children() {
        return props.children;
      }
    })
  });
}
function Routes(props) {
  if (isServer) {
    const e = getRequestEvent();
    if (e && e.router && e.router.dataOnly) {
      dataOnly(e, props.routerState, props.branches);
      return;
    }
    e && ((e.router || (e.router = {})).matches || (e.router.matches = props.routerState.matches().map(({
      route,
      path,
      params
    }) => ({
      path: route.originalPath,
      pattern: route.pattern,
      match: path,
      params,
      info: route.info
    }))));
  }
  const disposers = [];
  let root;
  const routeStates = createMemo(on$1(props.routerState.matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];
    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];
      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i] = prev[i];
      } else {
        equal = false;
        if (disposers[i]) {
          disposers[i]();
        }
        createRoot((dispose) => {
          disposers[i] = dispose;
          next[i] = createRouteContext(props.routerState, next[i - 1] || props.routerState.base, createOutlet(() => routeStates()[i + 1]), () => {
            var _a3;
            const routeMatches = props.routerState.matches();
            return (_a3 = routeMatches[i]) != null ? _a3 : routeMatches[0];
          });
        });
      }
    }
    disposers.splice(nextMatches.length).forEach((dispose) => dispose());
    if (prev && equal) {
      return prev;
    }
    root = next[0];
    return next;
  }));
  return createOutlet(() => routeStates() && root)();
}
const createOutlet = (child) => {
  return () => createComponent(Show, {
    get when() {
      return child();
    },
    keyed: true,
    children: (child2) => createComponent(RouteContextObj.Provider, {
      value: child2,
      get children() {
        return child2.outlet();
      }
    })
  });
};
function dataOnly(event, routerState, branches) {
  const url = new URL(event.request.url);
  const prevMatches = getRouteMatches(branches, new URL(event.router.previousUrl || event.request.url).pathname);
  const matches = getRouteMatches(branches, url.pathname);
  for (let match = 0; match < matches.length; match++) {
    if (!prevMatches[match] || matches[match].route !== prevMatches[match].route) event.router.dataOnly = true;
    const {
      route,
      params
    } = matches[match];
    route.preload && route.preload({
      params,
      location: routerState.location,
      intent: "preload"
    });
  }
}
function intercept([value, setValue], get, set) {
  return [value, set ? (v2) => setValue(set(v2)) : setValue];
}
function createRouter$2(config) {
  let ignore = false;
  const wrap = (value) => typeof value === "string" ? {
    value
  } : value;
  const signal = intercept(createSignal(wrap(config.get()), {
    equals: (a, b2) => a.value === b2.value && a.state === b2.state
  }), void 0, (next) => {
    !ignore && config.set(next);
    if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = true;
    return next;
  });
  config.init && onCleanup(config.init((value = config.get()) => {
    ignore = true;
    signal[1](wrap(value));
    ignore = false;
  }));
  return createRouterComponent({
    signal,
    create: config.create,
    utils: config.utils
  });
}
function bindEvent(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}
function scrollToHash(hash, fallbackTop) {
  const el = hash && document.getElementById(hash);
  if (el) {
    el.scrollIntoView();
  } else if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}
function getPath(url) {
  const u = new URL(url);
  return u.pathname + u.search;
}
function StaticRouter(props) {
  let e;
  const obj = {
    value: props.url || (e = getRequestEvent()) && getPath(e.request.url) || ""
  };
  return createRouterComponent({
    signal: [() => obj, (next) => Object.assign(obj, next)]
  })(props);
}
const actions = /* @__PURE__ */ new Map();
function setupNativeEvents(preload = true, explicitLinks = false, actionBase = "/_server", transformUrl) {
  return (router2) => {
    const basePath = router2.base.path();
    const navigateFromRoute = router2.navigatorFactory(router2.base);
    let preloadTimeout;
    let lastElement;
    function isSvg(el) {
      return el.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function handleAnchor(evt) {
      if (evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey) return;
      const a = evt.composedPath().find((el) => el instanceof Node && el.nodeName.toUpperCase() === "A");
      if (!a || explicitLinks && !a.hasAttribute("link")) return;
      const svg = isSvg(a);
      const href = svg ? a.href.baseVal : a.href;
      const target = svg ? a.target.baseVal : a.target;
      if (target || !href && !a.hasAttribute("state")) return;
      const rel = (a.getAttribute("rel") || "").split(/\s+/);
      if (a.hasAttribute("download") || rel && rel.includes("external")) return;
      const url = svg ? new URL(href, document.baseURI) : new URL(href);
      if (url.origin !== window.location.origin || basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())) return;
      return [a, url];
    }
    function handleAnchorClick(evt) {
      const res = handleAnchor(evt);
      if (!res) return;
      const [a, url] = res;
      const to2 = router2.parsePath(url.pathname + url.search + url.hash);
      const state = a.getAttribute("state");
      evt.preventDefault();
      navigateFromRoute(to2, {
        resolve: false,
        replace: a.hasAttribute("replace"),
        scroll: !a.hasAttribute("noscroll"),
        state: state ? JSON.parse(state) : void 0
      });
    }
    function handleAnchorPreload(evt) {
      const res = handleAnchor(evt);
      if (!res) return;
      const [a, url] = res;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      router2.preloadRoute(url, a.getAttribute("preload") !== "false");
    }
    function handleAnchorMove(evt) {
      clearTimeout(preloadTimeout);
      const res = handleAnchor(evt);
      if (!res) return lastElement = null;
      const [a, url] = res;
      if (lastElement === a) return;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      preloadTimeout = setTimeout(() => {
        router2.preloadRoute(url, a.getAttribute("preload") !== "false");
        lastElement = a;
      }, 20);
    }
    function handleFormSubmit(evt) {
      if (evt.defaultPrevented) return;
      let actionRef = evt.submitter && evt.submitter.hasAttribute("formaction") ? evt.submitter.getAttribute("formaction") : evt.target.getAttribute("action");
      if (!actionRef) return;
      if (!actionRef.startsWith("https://action/")) {
        const url = new URL(actionRef, mockBase);
        actionRef = router2.parsePath(url.pathname + url.search);
        if (!actionRef.startsWith(actionBase)) return;
      }
      if (evt.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const handler = actions.get(actionRef);
      if (handler) {
        evt.preventDefault();
        const data = new FormData(evt.target, evt.submitter);
        handler.call({
          r: router2,
          f: evt.target
        }, evt.target.enctype === "multipart/form-data" ? data : new URLSearchParams(data));
      }
    }
    delegateEvents(["click", "submit"]);
    document.addEventListener("click", handleAnchorClick);
    if (preload) {
      document.addEventListener("mousemove", handleAnchorMove, {
        passive: true
      });
      document.addEventListener("focusin", handleAnchorPreload, {
        passive: true
      });
      document.addEventListener("touchstart", handleAnchorPreload, {
        passive: true
      });
    }
    document.addEventListener("submit", handleFormSubmit);
    onCleanup(() => {
      document.removeEventListener("click", handleAnchorClick);
      if (preload) {
        document.removeEventListener("mousemove", handleAnchorMove);
        document.removeEventListener("focusin", handleAnchorPreload);
        document.removeEventListener("touchstart", handleAnchorPreload);
      }
      document.removeEventListener("submit", handleFormSubmit);
    });
  };
}
function Router(props) {
  if (isServer) return StaticRouter(props);
  const getSource = () => {
    const url = window.location.pathname.replace(/^\/+/, "/") + window.location.search;
    const state = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return {
      value: url + window.location.hash,
      state
    };
  };
  const beforeLeave = createBeforeLeave();
  return createRouter$2({
    get: getSource,
    set({
      value,
      replace,
      scroll,
      state
    }) {
      if (replace) {
        window.history.replaceState(keepDepth(state), "", value);
      } else {
        window.history.pushState(state, "", value);
      }
      scrollToHash(decodeURIComponent(window.location.hash.slice(1)), scroll);
      saveCurrentDepth();
    },
    init: (notify) => bindEvent(window, "popstate", notifyIfNotBlocked(notify, (delta) => {
      if (delta) {
        return !beforeLeave.confirm(delta);
      } else {
        const s = getSource();
        return !beforeLeave.confirm(s.value, {
          state: s.state
        });
      }
    })),
    create: setupNativeEvents(props.preload, props.explicitLinks, props.actionBase, props.transformUrl),
    utils: {
      go: (delta) => window.history.go(delta),
      beforeLeave
    }
  })(props);
}
const fileRoutes = [{ "page": true, "$component": { "src": "src/routes/[...404].tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  '../_/_...404_-BnIfTAul.mjs'
), "import": () => import(
  /* @vite-ignore */
  '../_/_...404_-BnIfTAul.mjs'
) }, "path": "/*404" }, { "page": true, "$component": { "src": "src/routes/about.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  '../_/about-CMbkLRXH.mjs'
), "import": () => import(
  /* @vite-ignore */
  '../_/about-CMbkLRXH.mjs'
) }, "path": "/about" }, { "page": true, "$component": { "src": "src/routes/index.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  '../_/index-BhD5D07J.mjs'
), "import": () => import(
  /* @vite-ignore */
  '../_/index-BhD5D07J.mjs'
) }, "path": "/" }, { "page": true, "$component": { "src": "src/routes/privacy-policy.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  '../_/privacy-policy-0pG-A3kW.mjs'
), "import": () => import(
  /* @vite-ignore */
  '../_/privacy-policy-0pG-A3kW.mjs'
) }, "path": "/privacy-policy" }, { "page": true, "$component": { "src": "src/routes/terms.tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  '../_/terms-CuQ9jBUM.mjs'
), "import": () => import(
  /* @vite-ignore */
  '../_/terms-CuQ9jBUM.mjs'
) }, "path": "/terms" }, { "page": true, "$component": { "src": "src/routes/t/[toolId].tsx?pick=default&pick=$css", "build": () => import(
  /* @vite-ignore */
  '../_/_toolId_-BZYqsYZi.mjs'
), "import": () => import(
  /* @vite-ignore */
  '../_/_toolId_-BZYqsYZi.mjs'
) }, "path": "/t/:toolId" }];
const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};
function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p2) => options.strictTrailingSlash ? p2 : p2.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c2) => c2.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth2, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth2, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}
const pageRoutes = defineRoutes(fileRoutes.filter((o2) => o2.page));
function defineRoutes(fileRoutes2) {
  function processRoute(routes2, route, id, full) {
    const parentRoute = Object.values(routes2).find((o2) => {
      return id.startsWith(o2.id + "/");
    });
    if (!parentRoute) {
      routes2.push({
        ...route,
        id,
        path: id.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/")
      });
      return routes2;
    }
    processRoute(parentRoute.children || (parentRoute.children = []), route, id.slice(parentRoute.id.length));
    return routes2;
  }
  return fileRoutes2.sort((a, b2) => a.path.length - b2.path.length).reduce((prevRoutes, route) => {
    return processRoute(prevRoutes, route, route.path, route.path);
  }, []);
}
const router = createRouter$1({
  routes: fileRoutes.reduce((memo, route) => {
    if (!containsHTTP(route)) return memo;
    const path = route.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (_2, m2) => `**:${m2}`).split("/").map((s) => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
    if (/:[^/]*\?/g.test(path)) {
      throw new Error(`Optional parameters are not supported in API routes: ${path}`);
    }
    if (memo[path]) {
      throw new Error(`Duplicate API routes for "${path}" found at "${memo[path].route.path}" and "${route.path}"`);
    }
    memo[path] = {
      route
    };
    return memo;
  }, {})
});
function containsHTTP(route) {
  return route["$HEAD"] || route["$GET"] || route["$POST"] || route["$PUT"] || route["$PATCH"] || route["$DELETE"];
}
function matchAPIRoute(path, method) {
  const match = router.lookup(path);
  if (match && match.route) {
    const route = match.route;
    const handler = method === "HEAD" ? route.$HEAD || route.$GET : route[`$${method}`];
    if (handler === void 0) return;
    const isPage = route.page === true && route.$component !== void 0;
    return {
      handler,
      params: match.params,
      isPage
    };
  }
  return void 0;
}
const components = {};
function createRoutes() {
  function createRoute(route) {
    var _a3, _b2;
    const component = route.$component && ((_b2 = components[_a3 = route.$component.src]) != null ? _b2 : components[_a3] = lazy(route.$component.import));
    return {
      ...route,
      ...route.$$route ? route.$$route.require().route : void 0,
      info: {
        ...route.$$route ? route.$$route.require().route.info : {},
        filesystem: true
      },
      component,
      children: route.children ? route.children.map(createRoute) : void 0
    };
  }
  const routes2 = pageRoutes.map(createRoute);
  return routes2;
}
let routes;
const FileRoutes = isServer ? () => getRequestEvent().routes : () => routes || (routes = createRoutes());
const MetaContext = createContext();
const cascadingTags = ["title", "meta"];
const titleTagProperties = [];
const metaTagProperties = (
  // https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
  ["name", "http-equiv", "content", "charset", "media"].concat(["property"])
);
const getTagKey = (tag, properties) => {
  const tagProps = Object.fromEntries(Object.entries(tag.props).filter(([k2]) => properties.includes(k2)).sort());
  if (Object.hasOwn(tagProps, "name") || Object.hasOwn(tagProps, "property")) {
    tagProps.name = tagProps.name || tagProps.property;
    delete tagProps.property;
  }
  return tag.tag + JSON.stringify(tagProps);
};
function initClientProvider() {
  if (!sharedConfig.context) {
    const ssrTags = document.head.querySelectorAll(`[data-sm]`);
    Array.prototype.forEach.call(ssrTags, (ssrTag) => ssrTag.parentNode.removeChild(ssrTag));
  }
  const cascadedTagInstances = /* @__PURE__ */ new Map();
  function getElement(tag) {
    if (tag.ref) {
      return tag.ref;
    }
    let el = document.querySelector(`[data-sm="${tag.id}"]`);
    if (el) {
      if (el.tagName.toLowerCase() !== tag.tag) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        el = document.createElement(tag.tag);
      }
      el.removeAttribute("data-sm");
    } else {
      el = document.createElement(tag.tag);
    }
    return el;
  }
  return {
    addTag(tag) {
      if (cascadingTags.indexOf(tag.tag) !== -1) {
        const properties = tag.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagKey = getTagKey(tag, properties);
        if (!cascadedTagInstances.has(tagKey)) {
          cascadedTagInstances.set(tagKey, []);
        }
        let instances = cascadedTagInstances.get(tagKey);
        let index = instances.length;
        instances = [...instances, tag];
        cascadedTagInstances.set(tagKey, instances);
        let element2 = getElement(tag);
        tag.ref = element2;
        spread(element2, tag.props);
        let lastVisited = null;
        for (var i = index - 1; i >= 0; i--) {
          if (instances[i] != null) {
            lastVisited = instances[i];
            break;
          }
        }
        if (element2.parentNode != document.head) {
          document.head.appendChild(element2);
        }
        if (lastVisited && lastVisited.ref && lastVisited.ref.parentNode) {
          document.head.removeChild(lastVisited.ref);
        }
        return index;
      }
      let element = getElement(tag);
      tag.ref = element;
      spread(element, tag.props);
      if (element.parentNode != document.head) {
        document.head.appendChild(element);
      }
      return -1;
    },
    removeTag(tag, index) {
      const properties = tag.tag === "title" ? titleTagProperties : metaTagProperties;
      const tagKey = getTagKey(tag, properties);
      if (tag.ref) {
        const t = cascadedTagInstances.get(tagKey);
        if (t) {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
            for (let i = index - 1; i >= 0; i--) {
              if (t[i] != null) {
                document.head.appendChild(t[i].ref);
              }
            }
          }
          t[index] = null;
          cascadedTagInstances.set(tagKey, t);
        } else {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
          }
        }
      }
    }
  };
}
function initServerProvider() {
  const tags = [];
  useAssets$1(() => ssr(renderTags(tags)));
  return {
    addTag(tagDesc) {
      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const properties = tagDesc.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagDescKey = getTagKey(tagDesc, properties);
        const index = tags.findIndex((prev) => prev.tag === tagDesc.tag && getTagKey(prev, properties) === tagDescKey);
        if (index !== -1) {
          tags.splice(index, 1);
        }
      }
      tags.push(tagDesc);
      return tags.length;
    },
    removeTag(tag, index) {
    }
  };
}
const MetaProvider = (props) => {
  const actions2 = !isServer ? initClientProvider() : initServerProvider();
  return createComponent(MetaContext.Provider, {
    value: actions2,
    get children() {
      return props.children;
    }
  });
};
const MetaTag = (tag, props, setting) => {
  useHead({
    tag,
    props,
    setting,
    id: createUniqueId(),
    get name() {
      return props.name || props.property;
    }
  });
  return null;
};
function useHead(tagDesc) {
  const c2 = useContext(MetaContext);
  if (!c2) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const index = c2.addTag(tagDesc);
    onCleanup(() => c2.removeTag(tagDesc, index));
  });
}
function renderTags(tags) {
  return tags.map((tag) => {
    var _a3, _b2;
    const keys = Object.keys(tag.props);
    const props = keys.map((k2) => k2 === "children" ? "" : ` ${k2}="${// @ts-expect-error
    escape(tag.props[k2], true)}"`).join("");
    let children2 = tag.props.children;
    if (Array.isArray(children2)) {
      children2 = children2.join("");
    }
    if ((_a3 = tag.setting) == null ? void 0 : _a3.close) {
      return `<${tag.tag} data-sm="${tag.id}"${props}>${// @ts-expect-error
      ((_b2 = tag.setting) == null ? void 0 : _b2.escape) ? escape(children2) : children2 || ""}</${tag.tag}>`;
    }
    return `<${tag.tag} data-sm="${tag.id}"${props}/>`;
  }).join("");
}
const Title = (props) => MetaTag("title", props, {
  escape: true,
  close: true
});
const Meta = (props) => MetaTag("meta", props);
const Link = (props) => MetaTag("link", props);
const [isDarkMode, setIsDarkMode] = createSignal(false);
var _tmpl$$4 = ["<div", ' class="my-4 flex justify-center w-full max-w-full overflow-hidden"><div class="horizontal" data-ea-publisher="your-publisher-id" data-ea-type="image" id="ethicalads-container"></div></div>'];
function EthicalAds() {
  onMount(() => {
    if (!document.querySelector('script[src*="ethicalads.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
  });
  return ssr(_tmpl$$4, ssrHydrationKey());
}
var _tmpl$$3 = ["<div", ' class="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200"><nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex-shrink-0"><div class="max-w-7xl mx-auto flex justify-between items-center"><a href="/" class="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><span>ZeroJSON</span></a><div class="flex items-center gap-4"><div class="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span>0 network requests</span></div><button class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle theme"', ">", '</button></div></div></nav><main class="flex-grow flex flex-col min-h-0">', "</main><!--$-->", '<!--/--><footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 w-full flex-shrink-0"><div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-xs"><p>&copy; <!--$-->', '<!--/--> ZeroJSON Tools. Privacy First. Performance Always.</p><div class="flex gap-4"><a href="/privacy-policy" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a><a href="/terms" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></div></div></footer></div>'], _tmpl$2$2 = ["<svg", ' width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'], _tmpl$3 = ["<svg", ' width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'];
function App$1() {
  onMount(() => {
    const stored = localStorage.getItem("zerojson-theme");
    if (stored === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  });
  return createComponent(Router, {
    root: (props) => createComponent(MetaProvider, {
      get children() {
        return [createComponent(Title, {
          children: "ZeroJSON Tools - 100% Secure, 0 Network Requests"
        }), createComponent(Meta, {
          name: "description",
          content: "Convert JSON to TypeScript, Zod, Go, Rust, SQL, and CSV directly in your browser. 0 network requests, 100% private and offline-capable."
        }), createComponent(Meta, {
          property: "og:title",
          content: "ZeroJSON Tools - 100% Secure JSON Converter"
        }), createComponent(Meta, {
          property: "og:description",
          content: "Convert massive JSON files in your browser. 0 network requests. Ultra-fast performance."
        }), createComponent(Meta, {
          property: "og:url",
          content: "https://zero-json.duckdns.org/"
        }), createComponent(Meta, {
          property: "og:type",
          content: "website"
        }), createComponent(Meta, {
          name: "twitter:card",
          content: "summary_large_image"
        }), createComponent(Link, {
          rel: "canonical",
          href: "https://zero-json.duckdns.org/"
        }), ssr(_tmpl$$3, ssrHydrationKey(), ssrAttribute("title", isDarkMode() ? "Switch to light mode" : "Switch to dark mode", false), isDarkMode() ? _tmpl$2$2[0] + ssrHydrationKey() + _tmpl$2$2[1] : _tmpl$3[0] + ssrHydrationKey() + _tmpl$3[1], escape(createComponent(Suspense, {
          get children() {
            return props.children;
          }
        })), escape(createComponent(EthicalAds, {})), escape((/* @__PURE__ */ new Date()).getFullYear()))];
      }
    }),
    get children() {
      return createComponent(FileRoutes, {});
    }
  });
}
const app = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1
}, Symbol.toStringTag, { value: "Module" }));
const HttpStatusCode = isServer ? (props) => {
  const event = getRequestEvent();
  event.response.status = props.code;
  event.response.statusText = props.text;
  onCleanup(() => (
    // !event.nativeEvent.handled &&
    !event.complete && (event.response.status = 200)
  ));
  return null;
} : (_props) => null;
var _tmpl$$2 = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], _tmpl$2$1 = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const ErrorBoundary = (props) => {
  const message = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent(ErrorBoundary$1, {
    fallback: (error) => {
      console.error(error);
      return [ssr(_tmpl$$2, ssrHydrationKey(), escape(message)), createComponent(HttpStatusCode, {
        code: 500
      })];
    },
    get children() {
      return props.children;
    }
  });
};
const TopErrorBoundary = (props) => {
  let isError = false;
  const res = catchError(() => props.children, (err) => {
    console.error(err);
    isError = !!err;
  });
  return isError ? [ssr(_tmpl$2$1, ssrHydrationKey()), createComponent(HttpStatusCode, {
    code: 500
  })] : res;
};
const PatchVirtualDevStyles = (props) => {
};
var _tmpl$$1 = ["<script", ' type="module"', " async", "><\/script>"];
const docType = ssr("<!DOCTYPE html>");
function StartServer(props) {
  const context = getRequestEvent();
  const nonce = context.nonce;
  useAssets(context.assets, nonce);
  return createComponent(NoHydration, {
    get children() {
      return [docType, createComponent(TopErrorBoundary, {
        get children() {
          return createComponent(props.document, {
            get assets() {
              return createComponent(HydrationScript, {});
            },
            get scripts() {
              return [createComponent(PatchVirtualDevStyles, {
                nonce
              }), ssr(_tmpl$$1, ssrHydrationKey(), ssrAttribute("nonce", escape(nonce, true), false), ssrAttribute("src", escape(getSsrManifest().path("./src/entry-client.tsx"), true), false))];
            },
            get children() {
              return createComponent(Hydration, {
                get children() {
                  return createComponent(ErrorBoundary, {
                    get children() {
                      return createComponent(App$1, {});
                    }
                  });
                }
              });
            }
          });
        }
      })];
    }
  });
}
const middleware = {};
const NullProtoObj = /* @__PURE__ */ (() => {
  const e = function() {
  };
  return e.prototype = /* @__PURE__ */ Object.create(null), Object.freeze(e.prototype), e;
})();
function createRouter() {
  return {
    root: { key: "" },
    static: new NullProtoObj()
  };
}
function splitPath(path) {
  const [_2, ...s] = path.split("/");
  return s[s.length - 1] === "" ? s.slice(0, -1) : s;
}
function getMatchParams(segments, paramsMap) {
  const params = new NullProtoObj();
  for (const [index, name] of paramsMap) {
    const segment = index < 0 ? segments.slice(-(index + 1)).join("/") : segments[index];
    if (typeof name === "string") params[name] = segment;
    else {
      const match = segment.match(name);
      if (match) for (const key in match.groups) params[key] = match.groups[key];
    }
  }
  return params;
}
function addRoute(ctx, method = "", path, data) {
  var _a3, _b2, _c;
  method = method.toUpperCase();
  if (path.charCodeAt(0) !== 47) path = `/${path}`;
  path = path.replace(/\\:/g, "%3A");
  const segments = splitPath(path);
  let node = ctx.root;
  let _unnamedParamIndex = 0;
  const paramsMap = [];
  const paramsRegexp = [];
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    if (segment.startsWith("**")) {
      if (!node.wildcard) node.wildcard = { key: "**" };
      node = node.wildcard;
      paramsMap.push([
        -(i + 1),
        segment.split(":")[1] || "_",
        segment.length === 2
      ]);
      break;
    }
    if (segment === "*" || segment.includes(":")) {
      if (!node.param) node.param = { key: "*" };
      node = node.param;
      if (segment === "*") paramsMap.push([
        i,
        `_${_unnamedParamIndex++}`,
        true
      ]);
      else if (segment.includes(":", 1)) {
        const regexp = getParamRegexp(segment);
        paramsRegexp[i] = regexp;
        node.hasRegexParam = true;
        paramsMap.push([
          i,
          regexp,
          false
        ]);
      } else paramsMap.push([
        i,
        segment.slice(1),
        false
      ]);
      continue;
    }
    if (segment === "\\*") segment = segments[i] = "*";
    else if (segment === "\\*\\*") segment = segments[i] = "**";
    const child = (_a3 = node.static) == null ? void 0 : _a3[segment];
    if (child) node = child;
    else {
      const staticNode = { key: segment };
      if (!node.static) node.static = new NullProtoObj();
      node.static[segment] = staticNode;
      node = staticNode;
    }
  }
  const hasParams = paramsMap.length > 0;
  if (!node.methods) node.methods = new NullProtoObj();
  (_c = (_b2 = node.methods)[method]) != null ? _c : _b2[method] = [];
  node.methods[method].push({
    data: data || null,
    paramsRegexp,
    paramsMap: hasParams ? paramsMap : void 0
  });
  if (!hasParams) ctx.static["/" + segments.join("/")] = node;
}
function getParamRegexp(segment) {
  const regex = segment.replace(/:(\w+)/g, (_2, id) => `(?<${id}>[^/]+)`).replace(/\./g, "\\.");
  return /* @__PURE__ */ new RegExp(`^${regex}$`);
}
function findRoute(ctx, method = "", path, opts) {
  var _a3;
  if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
  const staticNode = ctx.static[path];
  if (staticNode && staticNode.methods) {
    const staticMatch = staticNode.methods[method] || staticNode.methods[""];
    if (staticMatch !== void 0) return staticMatch[0];
  }
  const segments = splitPath(path);
  const match = (_a3 = _lookupTree(ctx, ctx.root, method, segments, 0)) == null ? void 0 : _a3[0];
  if (match === void 0) return;
  return {
    data: match.data,
    params: match.paramsMap ? getMatchParams(segments, match.paramsMap) : void 0
  };
}
function _lookupTree(ctx, node, method, segments, index) {
  var _a3, _b2;
  if (index === segments.length) {
    if (node.methods) {
      const match = node.methods[method] || node.methods[""];
      if (match) return match;
    }
    if (node.param && node.param.methods) {
      const match = node.param.methods[method] || node.param.methods[""];
      if (match) {
        const pMap = match[0].paramsMap;
        if ((_a3 = pMap == null ? void 0 : pMap[(pMap == null ? void 0 : pMap.length) - 1]) == null ? void 0 : _a3[2]) return match;
      }
    }
    if (node.wildcard && node.wildcard.methods) {
      const match = node.wildcard.methods[method] || node.wildcard.methods[""];
      if (match) {
        const pMap = match[0].paramsMap;
        if ((_b2 = pMap == null ? void 0 : pMap[(pMap == null ? void 0 : pMap.length) - 1]) == null ? void 0 : _b2[2]) return match;
      }
    }
    return;
  }
  const segment = segments[index];
  if (node.static) {
    const staticChild = node.static[segment];
    if (staticChild) {
      const match = _lookupTree(ctx, staticChild, method, segments, index + 1);
      if (match) return match;
    }
  }
  if (node.param) {
    const match = _lookupTree(ctx, node.param, method, segments, index + 1);
    if (match) {
      if (node.param.hasRegexParam) {
        const exactMatch = match.find((m2) => {
          var _a4;
          return (_a4 = m2.paramsRegexp[index]) == null ? void 0 : _a4.test(segment);
        }) || match.find((m2) => !m2.paramsRegexp[index]);
        return exactMatch ? [exactMatch] : void 0;
      }
      return match;
    }
  }
  if (node.wildcard && node.wildcard.methods) return node.wildcard.methods[method] || node.wildcard.methods[""];
}
function routeToRegExp(route = "/") {
  const reSegments = [];
  let idCtr = 0;
  for (const segment of route.split("/")) {
    if (!segment) continue;
    if (segment === "*") reSegments.push(`(?<_${idCtr++}>[^/]*)`);
    else if (segment.startsWith("**")) reSegments.push(segment === "**" ? "?(?<_>.*)" : `?(?<${segment.slice(3)}>.+)`);
    else if (segment.includes(":")) reSegments.push(segment.replace(/:(\w+)/g, (_2, id) => `(?<${id}>[^/]+)`).replace(/\./g, "\\."));
    else reSegments.push(segment);
  }
  return /* @__PURE__ */ new RegExp(`^/${reSegments.join("/")}/?$`);
}
function lazyInherit(target, source, sourceKey) {
  for (const key of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
    if (key === "constructor") continue;
    const targetDesc = Object.getOwnPropertyDescriptor(target, key);
    const desc = Object.getOwnPropertyDescriptor(source, key);
    let modified = false;
    if (desc.get) {
      modified = true;
      desc.get = (targetDesc == null ? void 0 : targetDesc.get) || function() {
        return this[sourceKey][key];
      };
    }
    if (desc.set) {
      modified = true;
      desc.set = (targetDesc == null ? void 0 : targetDesc.set) || function(value) {
        this[sourceKey][key] = value;
      };
    }
    if (!(targetDesc == null ? void 0 : targetDesc.value) && typeof desc.value === "function") {
      modified = true;
      desc.value = function(...args) {
        return this[sourceKey][key](...args);
      };
    }
    if (modified) Object.defineProperty(target, key, desc);
  }
}
const FastURL = /* @__PURE__ */ (() => {
  var _url, _href, _protocol, _host, _pathname, _search, _searchParams, _pos, _URL_instances, getPos_fn, _a3;
  const NativeURL = globalThis.URL;
  const FastURL$1 = (_a3 = class {
    constructor(url) {
      __privateAdd(this, _URL_instances);
      __privateAdd(this, _url);
      __privateAdd(this, _href);
      __privateAdd(this, _protocol);
      __privateAdd(this, _host);
      __privateAdd(this, _pathname);
      __privateAdd(this, _search);
      __privateAdd(this, _searchParams);
      __privateAdd(this, _pos);
      if (typeof url === "string") __privateSet(this, _href, url);
      else {
        __privateSet(this, _protocol, url.protocol);
        __privateSet(this, _host, url.host);
        __privateSet(this, _pathname, url.pathname);
        __privateSet(this, _search, url.search);
      }
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeURL;
    }
    get _url() {
      if (__privateGet(this, _url)) return __privateGet(this, _url);
      __privateSet(this, _url, new NativeURL(this.href));
      __privateSet(this, _href, void 0);
      __privateSet(this, _protocol, void 0);
      __privateSet(this, _host, void 0);
      __privateSet(this, _pathname, void 0);
      __privateSet(this, _search, void 0);
      __privateSet(this, _searchParams, void 0);
      __privateSet(this, _pos, void 0);
      return __privateGet(this, _url);
    }
    get href() {
      if (__privateGet(this, _url)) return __privateGet(this, _url).href;
      if (!__privateGet(this, _href)) __privateSet(this, _href, `${__privateGet(this, _protocol) || "http:"}//${__privateGet(this, _host) || "localhost"}${__privateGet(this, _pathname) || "/"}${__privateGet(this, _search) || ""}`);
      return __privateGet(this, _href);
    }
    get pathname() {
      if (__privateGet(this, _url)) return __privateGet(this, _url).pathname;
      if (__privateGet(this, _pathname) === void 0) {
        const [, pathnameIndex, queryIndex] = __privateMethod(this, _URL_instances, getPos_fn).call(this);
        if (pathnameIndex === -1) return this._url.pathname;
        __privateSet(this, _pathname, this.href.slice(pathnameIndex, queryIndex === -1 ? void 0 : queryIndex));
      }
      return __privateGet(this, _pathname);
    }
    get search() {
      if (__privateGet(this, _url)) return __privateGet(this, _url).search;
      if (__privateGet(this, _search) === void 0) {
        const [, pathnameIndex, queryIndex] = __privateMethod(this, _URL_instances, getPos_fn).call(this);
        if (pathnameIndex === -1) return this._url.search;
        const url = this.href;
        __privateSet(this, _search, queryIndex === -1 || queryIndex === url.length - 1 ? "" : url.slice(queryIndex));
      }
      return __privateGet(this, _search);
    }
    get searchParams() {
      if (__privateGet(this, _url)) return __privateGet(this, _url).searchParams;
      if (!__privateGet(this, _searchParams)) __privateSet(this, _searchParams, new URLSearchParams(this.search));
      return __privateGet(this, _searchParams);
    }
    get protocol() {
      if (__privateGet(this, _url)) return __privateGet(this, _url).protocol;
      if (__privateGet(this, _protocol) === void 0) {
        const [protocolIndex] = __privateMethod(this, _URL_instances, getPos_fn).call(this);
        if (protocolIndex === -1) return this._url.protocol;
        __privateSet(this, _protocol, this.href.slice(0, protocolIndex + 1));
      }
      return __privateGet(this, _protocol);
    }
    toString() {
      return this.href;
    }
    toJSON() {
      return this.href;
    }
  }, _url = new WeakMap(), _href = new WeakMap(), _protocol = new WeakMap(), _host = new WeakMap(), _pathname = new WeakMap(), _search = new WeakMap(), _searchParams = new WeakMap(), _pos = new WeakMap(), _URL_instances = new WeakSet(), getPos_fn = function() {
    if (!__privateGet(this, _pos)) {
      const url = this.href;
      const protoIndex = url.indexOf("://");
      const pathnameIndex = protoIndex === -1 ? -1 : url.indexOf("/", protoIndex + 4);
      __privateSet(this, _pos, [
        protoIndex,
        pathnameIndex,
        pathnameIndex === -1 ? -1 : url.indexOf("?", pathnameIndex)
      ]);
    }
    return __privateGet(this, _pos);
  }, _a3);
  lazyInherit(FastURL$1.prototype, NativeURL.prototype, "_url");
  Object.setPrototypeOf(FastURL$1.prototype, NativeURL.prototype);
  Object.setPrototypeOf(FastURL$1, NativeURL);
  return FastURL$1;
})();
const NodeResponse = /* @__PURE__ */ (() => {
  var _a3, _b2, _c, _body, _init2, _headers2, _response;
  const NativeResponse = globalThis.Response;
  const STATUS_CODES = ((_c = (_b2 = (_a3 = globalThis.process) == null ? void 0 : _a3.getBuiltinModule) == null ? void 0 : _b2.call(_a3, "node:http")) == null ? void 0 : _c.STATUS_CODES) || {};
  class NodeResponse$1 {
    constructor(body, init) {
      __privateAdd(this, _body);
      __privateAdd(this, _init2);
      __privateAdd(this, _headers2);
      __privateAdd(this, _response);
      __privateSet(this, _body, body);
      __privateSet(this, _init2, init);
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeResponse;
    }
    get status() {
      var _a4, _b3;
      return ((_a4 = __privateGet(this, _response)) == null ? void 0 : _a4.status) || ((_b3 = __privateGet(this, _init2)) == null ? void 0 : _b3.status) || 200;
    }
    get statusText() {
      var _a4, _b3;
      return ((_a4 = __privateGet(this, _response)) == null ? void 0 : _a4.statusText) || ((_b3 = __privateGet(this, _init2)) == null ? void 0 : _b3.statusText) || STATUS_CODES[this.status] || "";
    }
    get headers() {
      var _a4;
      if (__privateGet(this, _response)) return __privateGet(this, _response).headers;
      if (__privateGet(this, _headers2)) return __privateGet(this, _headers2);
      const initHeaders = (_a4 = __privateGet(this, _init2)) == null ? void 0 : _a4.headers;
      return __privateSet(this, _headers2, initHeaders instanceof Headers ? initHeaders : new Headers(initHeaders));
    }
    get ok() {
      if (__privateGet(this, _response)) return __privateGet(this, _response).ok;
      const status = this.status;
      return status >= 200 && status < 300;
    }
    get _response() {
      if (__privateGet(this, _response)) return __privateGet(this, _response);
      __privateSet(this, _response, new NativeResponse(__privateGet(this, _body), __privateGet(this, _headers2) ? {
        ...__privateGet(this, _init2),
        headers: __privateGet(this, _headers2)
      } : __privateGet(this, _init2)));
      __privateSet(this, _init2, void 0);
      __privateSet(this, _headers2, void 0);
      __privateSet(this, _body, void 0);
      return __privateGet(this, _response);
    }
    _toNodeResponse() {
      var _a4, _b3;
      const status = this.status;
      const statusText = this.statusText;
      let body;
      let contentType;
      let contentLength;
      if (__privateGet(this, _response)) body = __privateGet(this, _response).body;
      else if (__privateGet(this, _body)) if (__privateGet(this, _body) instanceof ReadableStream) body = __privateGet(this, _body);
      else if (typeof __privateGet(this, _body) === "string") {
        body = __privateGet(this, _body);
        contentType = "text/plain; charset=UTF-8";
        contentLength = Buffer.byteLength(__privateGet(this, _body));
      } else if (__privateGet(this, _body) instanceof ArrayBuffer) {
        body = Buffer.from(__privateGet(this, _body));
        contentLength = __privateGet(this, _body).byteLength;
      } else if (__privateGet(this, _body) instanceof Uint8Array) {
        body = __privateGet(this, _body);
        contentLength = __privateGet(this, _body).byteLength;
      } else if (__privateGet(this, _body) instanceof DataView) {
        body = Buffer.from(__privateGet(this, _body).buffer);
        contentLength = __privateGet(this, _body).byteLength;
      } else if (__privateGet(this, _body) instanceof Blob) {
        body = __privateGet(this, _body).stream();
        contentType = __privateGet(this, _body).type;
        contentLength = __privateGet(this, _body).size;
      } else if (typeof __privateGet(this, _body).pipe === "function") body = __privateGet(this, _body);
      else body = this._response.body;
      const headers = [];
      const initHeaders = (_a4 = __privateGet(this, _init2)) == null ? void 0 : _a4.headers;
      const headerEntries = ((_b3 = __privateGet(this, _response)) == null ? void 0 : _b3.headers) || __privateGet(this, _headers2) || (initHeaders ? Array.isArray(initHeaders) ? initHeaders : (initHeaders == null ? void 0 : initHeaders.entries) ? initHeaders.entries() : Object.entries(initHeaders).map(([k2, v2]) => [k2.toLowerCase(), v2]) : void 0);
      let hasContentTypeHeader;
      let hasContentLength;
      if (headerEntries) for (const [key, value] of headerEntries) {
        if (Array.isArray(value)) for (const v2 of value) headers.push([key, v2]);
        else headers.push([key, value]);
        if (key === "content-type") hasContentTypeHeader = true;
        else if (key === "content-length") hasContentLength = true;
      }
      if (contentType && !hasContentTypeHeader) headers.push(["content-type", contentType]);
      if (contentLength && !hasContentLength) headers.push(["content-length", String(contentLength)]);
      __privateSet(this, _init2, void 0);
      __privateSet(this, _headers2, void 0);
      __privateSet(this, _response, void 0);
      __privateSet(this, _body, void 0);
      return {
        status,
        statusText,
        headers,
        body
      };
    }
  }
  _body = new WeakMap();
  _init2 = new WeakMap();
  _headers2 = new WeakMap();
  _response = new WeakMap();
  lazyInherit(NodeResponse$1.prototype, NativeResponse.prototype, "_response");
  Object.setPrototypeOf(NodeResponse$1, NativeResponse);
  Object.setPrototypeOf(NodeResponse$1.prototype, NativeResponse.prototype);
  return NodeResponse$1;
})();
const kEventNS = "h3.internal.event.";
const kEventRes = /* @__PURE__ */ Symbol.for(`${kEventNS}res`);
const kEventResHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.headers`);
var H3Event = (_a2 = class {
  constructor(req, context, app2) {
    /**
    * Access to the H3 application instance.
    */
    __publicField(this, "app");
    /**
    * Incoming HTTP request info.
    *
    * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Request)
    */
    __publicField(this, "req");
    /**
    * Access to the parsed request URL.
    *
    * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/URL)
    */
    __publicField(this, "url");
    /**
    * Event context.
    */
    __publicField(this, "context");
    this.context = context || req.context || new NullProtoObj();
    this.req = req;
    this.app = app2;
    const _url = req._url;
    this.url = _url && _url instanceof URL ? _url : new FastURL(req.url);
  }
  /**
  * Prepared HTTP response.
  */
  get res() {
    return this[kEventRes] || (this[kEventRes] = new H3EventResponse());
  }
  /**
  * Access to runtime specific additional context.
  *
  */
  get runtime() {
    return this.req.runtime;
  }
  /**
  * Tell the runtime about an ongoing operation that shouldn't close until the promise resolves.
  */
  waitUntil(promise) {
    var _a3, _b2;
    (_b2 = (_a3 = this.req).waitUntil) == null ? void 0 : _b2.call(_a3, promise);
  }
  toString() {
    return `[${this.req.method}] ${this.req.url}`;
  }
  toJSON() {
    return this.toString();
  }
  /**
  * Access to the raw Node.js req/res objects.
  *
  * @deprecated Use `event.runtime.{node|deno|bun|...}.` instead.
  */
  get node() {
    var _a3;
    return (_a3 = this.req.runtime) == null ? void 0 : _a3.node;
  }
  /**
  * Access to the incoming request headers.
  *
  * @deprecated Use `event.req.headers` instead.
  *
  */
  get headers() {
    return this.req.headers;
  }
  /**
  * Access to the incoming request url (pathname+search).
  *
  * @deprecated Use `event.url.pathname + event.url.search` instead.
  *
  * Example: `/api/hello?name=world`
  * */
  get path() {
    return this.url.pathname + this.url.search;
  }
  /**
  * Access to the incoming request method.
  *
  * @deprecated Use `event.req.method` instead.
  */
  get method() {
    return this.req.method;
  }
}, /**
* @internal
*/
__publicField(_a2, "__is_event__", true), _a2);
var H3EventResponse = class {
  constructor() {
    __publicField(this, "status");
    __publicField(this, "statusText");
  }
  get headers() {
    return this[kEventResHeaders] || (this[kEventResHeaders] = new Headers());
  }
};
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) return defaultStatusCode;
  if (typeof statusCode === "string") statusCode = +statusCode;
  if (statusCode < 100 || statusCode > 599) return defaultStatusCode;
  return statusCode;
}
var HTTPError = class HTTPError2 extends Error {
  constructor(arg1, arg2) {
    var _a3, _b2, _c, _d, _e2, _f, _g, _h;
    let messageInput;
    let details;
    if (typeof arg1 === "string") {
      messageInput = arg1;
      details = arg2;
    } else details = arg1;
    const status = sanitizeStatusCode((details == null ? void 0 : details.status) || ((_a3 = details == null ? void 0 : details.cause) == null ? void 0 : _a3.status) || (details == null ? void 0 : details.status) || (details == null ? void 0 : details.statusCode), 500);
    const statusText = sanitizeStatusMessage((details == null ? void 0 : details.statusText) || ((_b2 = details == null ? void 0 : details.cause) == null ? void 0 : _b2.statusText) || (details == null ? void 0 : details.statusText) || (details == null ? void 0 : details.statusMessage));
    const message = messageInput || (details == null ? void 0 : details.message) || ((_c = details == null ? void 0 : details.cause) == null ? void 0 : _c.message) || (details == null ? void 0 : details.statusText) || (details == null ? void 0 : details.statusMessage) || [
      "HTTPError",
      status,
      statusText
    ].filter(Boolean).join(" ");
    super(message, { cause: details });
    /**
    * HTTP status code in range [200...599]
    */
    __publicField(this, "status");
    /**
    * HTTP status text
    *
    * **NOTE:** This should be short (max 512 to 1024 characters).
    * Allowed characters are tabs, spaces, visible ASCII characters, and extended characters (byte value 128–255).
    *
    * **TIP:** Use `message` for longer error descriptions in JSON body.
    */
    __publicField(this, "statusText");
    /**
    * Additional HTTP headers to be sent in error response.
    */
    __publicField(this, "headers");
    /**
    * Original error object that caused this error.
    */
    __publicField(this, "cause");
    /**
    * Additional data attached in the error JSON body under `data` key.
    */
    __publicField(this, "data");
    /**
    * Additional top level JSON body properties to attach in the error JSON body.
    */
    __publicField(this, "body");
    /**
    * Flag to indicate that the error was not handled by the application.
    *
    * Unhandled error stack trace, data and message are hidden in non debug mode for security reasons.
    */
    __publicField(this, "unhandled");
    this.cause = details;
    (_d = Error.captureStackTrace) == null ? void 0 : _d.call(Error, this, this.constructor);
    this.status = status;
    this.statusText = statusText || void 0;
    const rawHeaders = (details == null ? void 0 : details.headers) || ((_e2 = details == null ? void 0 : details.cause) == null ? void 0 : _e2.headers);
    this.headers = rawHeaders ? new Headers(rawHeaders) : void 0;
    this.unhandled = (_h = (_g = details == null ? void 0 : details.unhandled) != null ? _g : (_f = details == null ? void 0 : details.cause) == null ? void 0 : _f.unhandled) != null ? _h : void 0;
    this.data = details == null ? void 0 : details.data;
    this.body = details == null ? void 0 : details.body;
  }
  get name() {
    return "HTTPError";
  }
  /**
  * Check if the input is an instance of HTTPError using its constructor name.
  *
  * It is safer than using `instanceof` because it works across different contexts (e.g., if the error was thrown in a different module).
  */
  static isError(input) {
    return input instanceof Error && (input == null ? void 0 : input.name) === "HTTPError";
  }
  /**
  * Create a new HTTPError with the given status code and optional status text and details.
  *
  * @example
  *
  * HTTPError.status(404)
  * HTTPError.status(418, "I'm a teapot")
  * HTTPError.status(403, "Forbidden", { message: "Not authenticated" })
  */
  static status(status, statusText, details) {
    return new HTTPError2({
      ...details,
      statusText,
      status
    });
  }
  /**
  * @deprecated Use `status`
  */
  get statusCode() {
    return this.status;
  }
  /**
  * @deprecated Use `statusText`
  */
  get statusMessage() {
    return this.statusText;
  }
  toJSON() {
    const unhandled = this.unhandled;
    return {
      status: this.status,
      statusText: this.statusText,
      unhandled,
      message: unhandled ? "HTTPError" : this.message,
      data: unhandled ? void 0 : this.data,
      ...unhandled ? void 0 : this.body
    };
  }
};
function isJSONSerializable(value, _type) {
  if (value === null || value === void 0) return true;
  if (_type !== "object") return _type === "boolean" || _type === "number" || _type === "string";
  if (typeof value.toJSON === "function") return true;
  if (Array.isArray(value)) return true;
  if (typeof value.pipe === "function" || typeof value.pipeTo === "function") return false;
  if (value instanceof NullProtoObj) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
const kNotFound = /* @__PURE__ */ Symbol.for("h3.notFound");
const kHandled = /* @__PURE__ */ Symbol.for("h3.handled");
function toResponse(val, event, config = {}) {
  var _a3;
  if (typeof (val == null ? void 0 : val.then) === "function") return (((_a3 = val.catch) == null ? void 0 : _a3.call(val, (error) => error)) || Promise.resolve(val)).then((resolvedVal) => toResponse(resolvedVal, event, config));
  const response = prepareResponse(val, event, config);
  if (typeof (response == null ? void 0 : response.then) === "function") return toResponse(response, event, config);
  const { onResponse: onResponse$1 } = config;
  return onResponse$1 ? Promise.resolve(onResponse$1(response, event)).then(() => response) : response;
}
var HTTPResponse = (_b = class {
  constructor(body, init) {
    __privateAdd(this, _headers);
    __privateAdd(this, _init);
    __publicField(this, "body");
    this.body = body;
    __privateSet(this, _init, init);
  }
  get status() {
    var _a3;
    return ((_a3 = __privateGet(this, _init)) == null ? void 0 : _a3.status) || 200;
  }
  get statusText() {
    var _a3;
    return ((_a3 = __privateGet(this, _init)) == null ? void 0 : _a3.statusText) || "OK";
  }
  get headers() {
    var _a3;
    return __privateGet(this, _headers) || __privateSet(this, _headers, new Headers((_a3 = __privateGet(this, _init)) == null ? void 0 : _a3.headers));
  }
}, _headers = new WeakMap(), _init = new WeakMap(), _b);
function prepareResponse(val, event, config, nested) {
  if (val === kHandled) return new NodeResponse(null);
  if (val === kNotFound) val = new HTTPError({
    status: 404,
    message: `Cannot find any route matching [${event.req.method}] ${event.url}`
  });
  if (val && val instanceof Error) {
    const isHTTPError = HTTPError.isError(val);
    const error = isHTTPError ? val : new HTTPError(val);
    if (!isHTTPError) {
      error.unhandled = true;
      if (val == null ? void 0 : val.stack) error.stack = val.stack;
    }
    if (error.unhandled && !config.silent) console.error(error);
    const { onError: onError$1 } = config;
    return onError$1 && !nested ? Promise.resolve(onError$1(error, event)).catch((error$1) => error$1).then((newVal) => prepareResponse(newVal != null ? newVal : val, event, config, true)) : errorResponse(error, config.debug);
  }
  const preparedRes = event[kEventRes];
  const preparedHeaders = preparedRes == null ? void 0 : preparedRes[kEventResHeaders];
  if (!(val instanceof Response)) {
    const res = prepareResponseBody(val, event, config);
    const status = res.status || (preparedRes == null ? void 0 : preparedRes.status);
    return new NodeResponse(nullBody(event.req.method, status) ? null : res.body, {
      status,
      statusText: res.statusText || (preparedRes == null ? void 0 : preparedRes.statusText),
      headers: res.headers && preparedHeaders ? mergeHeaders$1(res.headers, preparedHeaders) : res.headers || preparedHeaders
    });
  }
  if (!preparedHeaders || nested || !val.ok) return val;
  try {
    mergeHeaders$1(val.headers, preparedHeaders, val.headers);
    return val;
  } catch {
    return new NodeResponse(nullBody(event.req.method, val.status) ? null : val.body, {
      status: val.status,
      statusText: val.statusText,
      headers: mergeHeaders$1(val.headers, preparedHeaders)
    });
  }
}
function mergeHeaders$1(base, overrides, target = new Headers(base)) {
  for (const [name, value] of overrides) if (name === "set-cookie") target.append(name, value);
  else target.set(name, value);
  return target;
}
const frozenHeaders = () => {
  throw new Error("Headers are frozen");
};
var FrozenHeaders = class extends Headers {
  constructor(init) {
    super(init);
    this.set = this.append = this.delete = frozenHeaders;
  }
};
const emptyHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-length": "0" });
const jsonHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-type": "application/json;charset=UTF-8" });
function prepareResponseBody(val, event, config) {
  var _a3;
  if (val === null || val === void 0) return {
    body: "",
    headers: emptyHeaders
  };
  const valType = typeof val;
  if (valType === "string") return { body: val };
  if (val instanceof Uint8Array) {
    event.res.headers.set("content-length", val.byteLength.toString());
    return { body: val };
  }
  if (val instanceof HTTPResponse || ((_a3 = val == null ? void 0 : val.constructor) == null ? void 0 : _a3.name) === "HTTPResponse") return val;
  if (isJSONSerializable(val, valType)) return {
    body: JSON.stringify(val, void 0, config.debug ? 2 : void 0),
    headers: jsonHeaders
  };
  if (valType === "bigint") return {
    body: val.toString(),
    headers: jsonHeaders
  };
  if (val instanceof Blob) {
    const headers = new Headers({
      "content-type": val.type,
      "content-length": val.size.toString()
    });
    let filename = val.name;
    if (filename) {
      filename = encodeURIComponent(filename);
      headers.set("content-disposition", `filename="${filename}"; filename*=UTF-8''${filename}`);
    }
    return {
      body: val.stream(),
      headers
    };
  }
  if (valType === "symbol") return { body: val.toString() };
  if (valType === "function") return { body: `${val.name}()` };
  return { body: val };
}
function nullBody(method, status) {
  return method === "HEAD" || status === 100 || status === 101 || status === 102 || status === 204 || status === 205 || status === 304;
}
function errorResponse(error, debug) {
  return new NodeResponse(JSON.stringify({
    ...error.toJSON(),
    stack: debug && error.stack ? error.stack.split("\n").map((l2) => l2.trim()) : void 0
  }, void 0, debug ? 2 : void 0), {
    status: error.status,
    statusText: error.statusText,
    headers: error.headers ? mergeHeaders$1(jsonHeaders, error.headers) : new Headers(jsonHeaders)
  });
}
function normalizeMiddleware(input, opts = {}) {
  var _a3;
  const matcher = createMatcher(opts);
  if (!matcher && (input.length > 1 || ((_a3 = input.constructor) == null ? void 0 : _a3.name) === "AsyncFunction")) return input;
  return (event, next) => {
    if (matcher && !matcher(event)) return next();
    const res = input(event, next);
    return res === void 0 || res === kNotFound ? next() : res;
  };
}
function createMatcher(opts) {
  var _a3;
  if (!opts.route && !opts.method && !opts.match) return void 0;
  const routeMatcher = opts.route ? routeToRegExp(opts.route) : void 0;
  const method = (_a3 = opts.method) == null ? void 0 : _a3.toUpperCase();
  return function _middlewareMatcher(event) {
    if (method && event.req.method !== method) return false;
    if (opts.match && !opts.match(event)) return false;
    if (!routeMatcher) return true;
    const match = event.url.pathname.match(routeMatcher);
    if (!match) return false;
    if (match.groups) event.context.middlewareParams = {
      ...event.context.middlewareParams,
      ...match.groups
    };
    return true;
  };
}
function callMiddleware(event, middleware2, handler, index = 0) {
  if (index === middleware2.length) return handler(event);
  const fn2 = middleware2[index];
  let nextCalled;
  let nextResult;
  const next = () => {
    if (nextCalled) return nextResult;
    nextCalled = true;
    nextResult = callMiddleware(event, middleware2, handler, index + 1);
    return nextResult;
  };
  const ret = fn2(event, next);
  return is404(ret) ? next() : typeof (ret == null ? void 0 : ret.then) === "function" ? ret.then((resolved) => is404(resolved) ? next() : resolved) : ret;
}
function is404(val) {
  return val === void 0 || val === kNotFound || (val == null ? void 0 : val.status) === 404 && val instanceof Response;
}
function toRequest(input, options) {
  if (typeof input === "string") {
    let url = input;
    if (url[0] === "/") {
      const headers = (options == null ? void 0 : options.headers) ? new Headers(options.headers) : void 0;
      const host = (headers == null ? void 0 : headers.get("host")) || "localhost";
      const proto = (headers == null ? void 0 : headers.get("x-forwarded-proto")) === "https" ? "https" : "http";
      url = `${proto}://${host}${url}`;
    }
    return new Request(url, options);
  } else if (options || input instanceof URL) return new Request(input, options);
  return input;
}
function getRequestIP(event, opts = {}) {
  var _a3;
  if (opts.xForwardedFor) {
    const _header = event.req.headers.get("x-forwarded-for");
    if (_header) {
      const xForwardedFor = _header.split(",")[0].trim();
      if (xForwardedFor) return xForwardedFor;
    }
  }
  return ((_a3 = event.req.context) == null ? void 0 : _a3.clientAddress) || event.req.ip || void 0;
}
function defineHandler(input) {
  var _a3;
  if (typeof input === "function") return handlerWithFetch(input);
  const handler = input.handler || (input.fetch ? function _fetchHandler(event) {
    return input.fetch(event.req);
  } : NoHandler);
  return Object.assign(handlerWithFetch(((_a3 = input.middleware) == null ? void 0 : _a3.length) ? function _handlerMiddleware(event) {
    return callMiddleware(event, input.middleware, handler);
  } : handler), input);
}
function handlerWithFetch(handler) {
  if ("fetch" in handler) return handler;
  return Object.assign(handler, { fetch: (req) => {
    if (typeof req === "string") req = new URL(req, "http://_");
    if (req instanceof URL) req = new Request(req);
    const event = new H3Event(req);
    try {
      return Promise.resolve(toResponse(handler(event), event));
    } catch (error) {
      return Promise.resolve(toResponse(error, event));
    }
  } });
}
function toEventHandler(handler) {
  if (typeof handler === "function") return handler;
  if (typeof (handler == null ? void 0 : handler.handler) === "function") return handler.handler;
  if (typeof (handler == null ? void 0 : handler.fetch) === "function") return function _fetchHandler(event) {
    return handler.fetch(event.req);
  };
}
const NoHandler = () => kNotFound;
const H3Core = /* @__PURE__ */ (() => {
  const HTTPMethods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS",
    "CONNECT",
    "TRACE"
  ];
  class H3Core$1 {
    constructor(config = {}) {
      __publicField(this, "_middleware");
      __publicField(this, "_routes", []);
      __publicField(this, "config");
      var _a3;
      this._middleware = [];
      this.config = config;
      this.fetch = this.fetch.bind(this);
      this.request = this.request.bind(this);
      this.handler = this.handler.bind(this);
      (_a3 = config.plugins) == null ? void 0 : _a3.forEach((plugin) => plugin(this));
    }
    fetch(request) {
      return this._request(request);
    }
    request(_req, _init2, context) {
      return this._request(toRequest(_req, _init2), context);
    }
    _request(request, context) {
      const event = new H3Event(request, context, this);
      let handlerRes;
      try {
        if (this.config.onRequest) {
          const hookRes = this.config.onRequest(event);
          handlerRes = typeof (hookRes == null ? void 0 : hookRes.then) === "function" ? hookRes.then(() => this.handler(event)) : this.handler(event);
        } else handlerRes = this.handler(event);
      } catch (error) {
        handlerRes = Promise.reject(error);
      }
      return toResponse(handlerRes, event, this.config);
    }
    /**
    * Immediately register an H3 plugin.
    */
    register(plugin) {
      plugin(this);
      return this;
    }
    _findRoute(_event) {
    }
    _addRoute(_route) {
      this._routes.push(_route);
    }
    _getMiddleware(_event, route) {
      return (route == null ? void 0 : route.data.middleware) ? [...this._middleware, ...route.data.middleware] : this._middleware;
    }
    handler(event) {
      const route = this._findRoute(event);
      if (route) {
        event.context.params = route.params;
        event.context.matchedRoute = route.data;
      }
      const routeHandler = (route == null ? void 0 : route.data.handler) || NoHandler;
      const middleware2 = this._getMiddleware(event, route);
      return middleware2.length > 0 ? callMiddleware(event, middleware2, routeHandler) : routeHandler(event);
    }
    mount(base, input) {
      if ("handler" in input) {
        if (input._middleware.length > 0) this._middleware.push((event, next) => {
          return event.url.pathname.startsWith(base) ? callMiddleware(event, input._middleware, next) : next();
        });
        for (const r of input._routes) this._addRoute({
          ...r,
          route: base + r.route
        });
      } else {
        const fetchHandler = "fetch" in input ? input.fetch : input;
        this.all(`${base}/**`, function _mountedMiddleware(event) {
          const url = new URL(event.url);
          url.pathname = url.pathname.slice(base.length) || "/";
          return fetchHandler(new Request(url, event.req));
        });
      }
      return this;
    }
    all(route, handler, opts) {
      return this.on("", route, handler, opts);
    }
    on(method, route, handler, opts) {
      const _method = (method || "").toUpperCase();
      route = new URL(route, "http://_").pathname;
      this._addRoute({
        method: _method,
        route,
        handler: toEventHandler(handler),
        middleware: opts == null ? void 0 : opts.middleware,
        meta: {
          ...handler.meta,
          ...opts == null ? void 0 : opts.meta
        }
      });
      return this;
    }
    _normalizeMiddleware(fn2, _opts) {
      return fn2;
    }
    use(arg1, arg2, arg3) {
      let route;
      let fn2;
      let opts;
      if (typeof arg1 === "string") {
        route = arg1;
        fn2 = arg2;
        opts = arg3;
      } else {
        fn2 = arg1;
        opts = arg2;
      }
      this._middleware.push(this._normalizeMiddleware(fn2, {
        ...opts,
        route
      }));
      return this;
    }
  }
  for (const method of HTTPMethods) H3Core$1.prototype[method.toLowerCase()] = function(route, handler, opts) {
    return this.on(method, route, handler, opts);
  };
  return H3Core$1;
})();
var H3 = class extends H3Core {
  constructor(config = {}) {
    super(config);
    /** @internal */
    __publicField(this, "_rou3");
    this._rou3 = createRouter();
  }
  _findRoute(_event) {
    return findRoute(this._rou3, _event.req.method, _event.url.pathname);
  }
  _addRoute(_route) {
    addRoute(this._rou3, _route.method, _route.route, _route);
    super._addRoute(_route);
  }
  _normalizeMiddleware(fn2, opts) {
    return normalizeMiddleware(fn2, opts);
  }
};
function redirect(location, status = 302, statusText) {
  const encodedLoc = location.replace(/"/g, "%22");
  const body = `<html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}" /></head></html>`;
  return new HTTPResponse(body, {
    status,
    statusText: status === 301 ? "Moved Permanently" : "Found",
    headers: {
      "content-type": "text/html; charset=utf-8",
      location
    }
  });
}
function parse(str, options) {
  if (typeof str !== "string") throw new TypeError("argument str must be a string");
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) break;
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) endIdx = str.length;
    else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if ((opt == null ? void 0 : opt.filter) && !(opt == null ? void 0 : opt.filter(key))) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) val = val.slice(1, -1);
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}
const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") throw new TypeError("option encode is invalid");
  if (!fieldContentRegExp.test(name)) throw new TypeError("argument name is invalid");
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) throw new TypeError("argument val is invalid");
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) throw new TypeError("option maxAge is invalid");
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) throw new TypeError("option domain is invalid");
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) throw new TypeError("option path is invalid");
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) throw new TypeError("option expires is invalid");
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) str += "; HttpOnly";
  if (opt.secure) str += "; Secure";
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  if (opt.partitioned) str += "; Partitioned";
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}
function parseSetCookie$1(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair$1(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = (options == null ? void 0 : options.decode) === false ? value : ((options == null ? void 0 : options.decode) || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default:
        cookie[partKey] = partValue;
    }
  }
  return cookie;
}
function _parseNameValuePair$1(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else value = nameValuePairStr;
  return {
    name,
    value
  };
}
function parseCookies(event) {
  return parse(event.req.headers.get("cookie") || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, options) {
  var _a3;
  const newCookie = serialize(name, value, {
    path: "/",
    ...options
  });
  const currentCookies = event.res.headers.getSetCookie();
  if (currentCookies.length === 0) {
    event.res.headers.set("set-cookie", newCookie);
    return;
  }
  const newCookieKey = _getDistinctCookieKey(name, options || {});
  event.res.headers.delete("set-cookie");
  for (const cookie of currentCookies) {
    const _key = _getDistinctCookieKey((_a3 = cookie.split("=")) == null ? void 0 : _a3[0], parseSetCookie$1(cookie));
    if (_key === newCookieKey) continue;
    event.res.headers.append("set-cookie", cookie);
  }
  event.res.headers.append("set-cookie", newCookie);
}
function _getDistinctCookieKey(name, options) {
  return [
    name,
    options.domain || "",
    options.path || "/"
  ].join(";");
}
const FETCH_EVENT_CONTEXT = "solidFetchEvent";
function createFetchEvent(event) {
  return {
    request: event.req,
    response: event.res,
    clientAddress: getRequestIP(event),
    locals: {},
    nativeEvent: event
  };
}
function getFetchEvent(h3Event) {
  if (!h3Event.context[FETCH_EVENT_CONTEXT]) {
    const fetchEvent = createFetchEvent(h3Event);
    h3Event.context[FETCH_EVENT_CONTEXT] = fetchEvent;
  }
  return h3Event.context[FETCH_EVENT_CONTEXT];
}
function mergeResponseHeaders(h3Event, headers) {
  for (const [key, value] of headers.entries()) {
    h3Event.res.headers.append(key, value);
  }
}
const decorateHandler = (fn2) => (event) => provideRequestEvent(getFetchEvent(event), () => fn2(event));
const decorateMiddleware = (fn2) => (event, next) => provideRequestEvent(getFetchEvent(event), () => fn2(event, next));
const manifest = {};
async function getServerFnById(id) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(
      `Server function module export not resolved for serverFn ID: ${id}`
    );
  }
  return action;
}
function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = (options == null ? void 0 : options.decode) === false ? value : ((options == null ? void 0 : options.decode) || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}
var L$1 = ((i) => (i[i.AggregateError = 1] = "AggregateError", i[i.ArrowFunction = 2] = "ArrowFunction", i[i.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i[i.ObjectAssign = 8] = "ObjectAssign", i[i.BigIntTypedArray = 16] = "BigIntTypedArray", i[i.RegExp = 32] = "RegExp", i))(L$1 || {});
var v$1 = Symbol.asyncIterator, mr = Symbol.hasInstance, R = Symbol.isConcatSpreadable, C = Symbol.iterator, pr = Symbol.match, dr = Symbol.matchAll, gr = Symbol.replace, yr = Symbol.search, Nr = Symbol.species, br = Symbol.split, vr = Symbol.toPrimitive, P$1 = Symbol.toStringTag, Cr = Symbol.unscopables;
var rt = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, ve = { [v$1]: 0, [mr]: 1, [R]: 2, [C]: 3, [pr]: 4, [dr]: 5, [gr]: 6, [yr]: 7, [Nr]: 8, [br]: 9, [vr]: 10, [P$1]: 11, [Cr]: 12 }, tt = { 0: v$1, 1: mr, 2: R, 3: C, 4: pr, 5: dr, 6: gr, 7: yr, 8: Nr, 9: br, 10: vr, 11: P$1, 12: Cr }, nt = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, o$1 = void 0, ot = { 2: true, 3: false, 1: o$1, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN };
var Ce = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, at = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError };
function c(e, r, t, n2, a, s, i, u, l2, g2, S, d2) {
  return { t: e, i: r, s: t, c: n2, m: a, p: s, e: i, a: u, f: l2, b: g2, o: S, l: d2 };
}
function F(e) {
  return c(2, o$1, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
var J$1 = F(2), Z = F(3), Ae = F(1), Ee = F(0), st = F(4), it = F(5), ut = F(6), lt = F(7);
function fn(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return o$1;
  }
}
function y$1(e) {
  let r = "", t = 0, n2;
  for (let a = 0, s = e.length; a < s; a++) n2 = fn(e[a]), n2 && (r += e.slice(t, a) + n2, t = a + 1);
  return t === 0 ? r = e : r += e.slice(t), r;
}
function Sn(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function B(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, Sn);
}
var U$1 = "__SEROVAL_REFS__", ce = "$R", Ie = `self.${ce}`;
function mn(e) {
  return e == null ? `${Ie}=${Ie}||[]` : `(${Ie}=${Ie}||{})["${y$1(e)}"]=[]`;
}
var Ar = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
function Er(e) {
  return Ar.has(e);
}
function dn(e) {
  return j.has(e);
}
function ct(e) {
  if (Er(e)) return Ar.get(e);
  throw new Re(e);
}
function ft(e) {
  if (dn(e)) return j.get(e);
  throw new Pe(e);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U$1, { value: j, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, U$1, { value: j, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, U$1, { value: j, configurable: true, writable: false, enumerable: false });
function xe(e) {
  return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function gn(e) {
  let r = Ce[xe(e)];
  return e.name !== r ? { name: e.name } : e.constructor.name !== r ? { name: e.constructor.name } : {};
}
function $(e, r) {
  let t = gn(e), n2 = Object.getOwnPropertyNames(e);
  for (let a = 0, s = n2.length, i; a < s; a++) i = n2[a], i !== "name" && i !== "message" && (i === "stack" ? r & 4 && (t = t || {}, t[i] = e[i]) : (t = t || {}, t[i] = e[i]));
  return t;
}
function Oe(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function Te(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return it;
    case Number.NEGATIVE_INFINITY:
      return ut;
  }
  return e !== e ? lt : Object.is(e, -0) ? st : c(0, o$1, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function X(e) {
  return c(1, o$1, y$1(e), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function we(e) {
  return c(3, o$1, "" + e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function mt(e) {
  return c(4, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function he(e, r) {
  let t = r.valueOf();
  return c(5, e, t !== t ? "" : r.toISOString(), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function ze(e, r) {
  return c(6, e, o$1, y$1(r.source), r.flags, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function pt(e, r) {
  return c(17, e, ve[r], o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function dt(e, r) {
  return c(18, e, y$1(ct(r)), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function fe$1(e, r, t) {
  return c(25, e, t, y$1(r), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function _e(e, r, t) {
  return c(9, e, o$1, o$1, o$1, o$1, o$1, t, o$1, o$1, Oe(r), o$1);
}
function ke(e, r) {
  return c(21, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function De(e, r, t) {
  return c(15, e, o$1, r.constructor.name, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.length);
}
function Fe(e, r, t) {
  return c(16, e, o$1, r.constructor.name, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.byteLength);
}
function Be(e, r, t) {
  return c(20, e, o$1, o$1, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.byteLength);
}
function Ve(e, r, t) {
  return c(13, e, xe(r), o$1, y$1(r.message), t, o$1, o$1, o$1, o$1, o$1, o$1);
}
function Me(e, r, t) {
  return c(14, e, xe(r), o$1, y$1(r.message), t, o$1, o$1, o$1, o$1, o$1, o$1);
}
function Le(e, r) {
  return c(7, e, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1, o$1);
}
function Ue(e, r) {
  return c(28, o$1, o$1, o$1, o$1, o$1, o$1, [e, r], o$1, o$1, o$1, o$1);
}
function je(e, r) {
  return c(30, o$1, o$1, o$1, o$1, o$1, o$1, [e, r], o$1, o$1, o$1, o$1);
}
function Ye(e, r, t) {
  return c(31, e, o$1, o$1, o$1, o$1, o$1, t, r, o$1, o$1, o$1);
}
function qe(e, r) {
  return c(32, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function We(e, r) {
  return c(33, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function Ge(e, r) {
  return c(34, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function Ke(e, r, t, n2) {
  return c(35, e, t, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1, n2);
}
var yn = { parsing: 1, serialization: 2, deserialization: 3 };
function Nn(e) {
  return `Seroval Error (step: ${yn[e]})`;
}
var bn = (e, r) => Nn(e), Se = class extends Error {
  constructor(t, n2) {
    super(bn(t));
    this.cause = n2;
  }
}, z = class extends Se {
  constructor(r) {
    super("parsing", r);
  }
}, He = class extends Se {
  constructor(r) {
    super("deserialization", r);
  }
};
function _$1(e) {
  return `Seroval Error (specific: ${e})`;
}
var x$1 = class x extends Error {
  constructor(t) {
    super(_$1(1));
    this.value = t;
  }
}, w$1 = class w extends Error {
  constructor(r) {
    super(_$1(2));
  }
}, Q = class extends Error {
  constructor(r) {
    super(_$1(3));
  }
}, V$1 = class V extends Error {
  constructor(r) {
    super(_$1(4));
  }
}, Re = class extends Error {
  constructor(t) {
    super(_$1(5));
    this.value = t;
  }
}, Pe = class extends Error {
  constructor(r) {
    super(_$1(6));
  }
}, Je = class extends Error {
  constructor(r) {
    super(_$1(7));
  }
}, h$1 = class h extends Error {
  constructor(r) {
    super(_$1(8));
  }
}, ee$1 = class ee extends Error {
  constructor(r) {
    super(_$1(9));
  }
};
var Y$1 = class Y {
  constructor(r, t) {
    this.value = r;
    this.replacement = t;
  }
};
var re = () => {
  let e = { p: 0, s: 0, f: 0 };
  return e.p = new Promise((r, t) => {
    e.s = r, e.f = t;
  }), e;
}, vn = (e, r) => {
  e.s(r), e.p.s = 1, e.p.v = r;
}, Cn = (e, r) => {
  e.f(r), e.p.s = 2, e.p.v = r;
}, yt = re.toString(), Nt = vn.toString(), bt = Cn.toString(), Rr = () => {
  let e = [], r = [], t = true, n2 = false, a = 0, s = (l2, g2, S) => {
    for (S = 0; S < a; S++) r[S] && r[S][g2](l2);
  }, i = (l2, g2, S, d2) => {
    for (g2 = 0, S = e.length; g2 < S; g2++) d2 = e[g2], !t && g2 === S - 1 ? l2[n2 ? "return" : "throw"](d2) : l2.next(d2);
  }, u = (l2, g2) => (t && (g2 = a++, r[g2] = l2), i(l2), () => {
    t && (r[g2] = r[a], r[a--] = void 0);
  });
  return { __SEROVAL_STREAM__: true, on: (l2) => u(l2), next: (l2) => {
    t && (e.push(l2), s(l2, "next"));
  }, throw: (l2) => {
    t && (e.push(l2), s(l2, "throw"), t = false, n2 = false, r.length = 0);
  }, return: (l2) => {
    t && (e.push(l2), s(l2, "return"), t = false, n2 = true, r.length = 0);
  } };
}, vt = Rr.toString(), Pr = (e) => (r) => () => {
  let t = 0, n2 = { [e]: () => n2, next: () => {
    if (t > r.d) return { done: true, value: void 0 };
    let a = t++, s = r.v[a];
    if (a === r.t) throw s;
    return { done: a === r.d, value: s };
  } };
  return n2;
}, Ct = Pr.toString(), xr = (e, r) => (t) => () => {
  let n2 = 0, a = -1, s = false, i = [], u = [], l2 = (S = 0, d2 = u.length) => {
    for (; S < d2; S++) u[S].s({ done: true, value: void 0 });
  };
  t.on({ next: (S) => {
    let d2 = u.shift();
    d2 && d2.s({ done: false, value: S }), i.push(S);
  }, throw: (S) => {
    let d2 = u.shift();
    d2 && d2.f(S), l2(), a = i.length, s = true, i.push(S);
  }, return: (S) => {
    let d2 = u.shift();
    d2 && d2.s({ done: true, value: S }), l2(), a = i.length, i.push(S);
  } });
  let g2 = { [e]: () => g2, next: () => {
    if (a === -1) {
      let K2 = n2++;
      if (K2 >= i.length) {
        let et = r();
        return u.push(et), et.p;
      }
      return { done: false, value: i[K2] };
    }
    if (n2 > a) return { done: true, value: void 0 };
    let S = n2++, d2 = i[S];
    if (S !== a) return { done: false, value: d2 };
    if (s) throw d2;
    return { done: true, value: d2 };
  } };
  return g2;
}, At = xr.toString(), Or = (e) => {
  let r = atob(e), t = r.length, n2 = new Uint8Array(t);
  for (let a = 0; a < t; a++) n2[a] = r.charCodeAt(a);
  return n2.buffer;
}, Et = Or.toString();
function Ze(e) {
  return "__SEROVAL_SEQUENCE__" in e;
}
function Tr(e, r, t) {
  return { __SEROVAL_SEQUENCE__: true, v: e, t: r, d: t };
}
function $e(e) {
  let r = [], t = -1, n2 = -1, a = e[C]();
  for (; ; ) try {
    let s = a.next();
    if (r.push(s.value), s.done) {
      n2 = r.length - 1;
      break;
    }
  } catch (s) {
    t = r.length, r.push(s);
  }
  return Tr(r, t, n2);
}
var An = Pr(C);
function It(e) {
  return An(e);
}
var Rt = {}, Pt = {};
var xt = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, Ot = { 0: "[]", 1: yt, 2: Nt, 3: bt, 4: vt, 5: Et };
function M(e) {
  return "__SEROVAL_STREAM__" in e;
}
function te$1() {
  return Rr();
}
function Xe(e) {
  let r = te$1(), t = e[v$1]();
  async function n2() {
    try {
      let a = await t.next();
      a.done ? r.return(a.value) : (r.next(a.value), await n2());
    } catch (a) {
      r.throw(a);
    }
  }
  return n2().catch(() => {
  }), r;
}
var En = xr(v$1, re);
function Tt(e) {
  return En(e);
}
function pe$1(e, r) {
  return { plugins: r.plugins, mode: e, marked: /* @__PURE__ */ new Set(), features: 63 ^ (r.disabledFeatures || 0), refs: r.refs || /* @__PURE__ */ new Map(), depthLimit: r.depthLimit || 1e3 };
}
function de$1(e, r) {
  e.marked.add(r);
}
function hr(e, r) {
  let t = e.refs.size;
  return e.refs.set(r, t), t;
}
function Qe(e, r) {
  let t = e.refs.get(r);
  return t != null ? (de$1(e, t), { type: 1, value: mt(t) }) : { type: 0, value: hr(e, r) };
}
function q$1(e, r) {
  let t = Qe(e, r);
  return t.type === 1 ? t : Er(r) ? { type: 2, value: dt(t.value, r) } : t;
}
function I(e, r) {
  let t = q$1(e, r);
  if (t.type !== 0) return t.value;
  if (r in ve) return pt(t.value, r);
  throw new x$1(r);
}
function k$1(e, r) {
  let t = Qe(e, xt[r]);
  return t.type === 1 ? t.value : c(26, t.value, r, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function er(e) {
  let r = Qe(e, Rt);
  return r.type === 1 ? r.value : c(27, r.value, o$1, o$1, o$1, o$1, o$1, o$1, I(e, C), o$1, o$1, o$1);
}
function rr(e) {
  let r = Qe(e, Pt);
  return r.type === 1 ? r.value : c(29, r.value, o$1, o$1, o$1, o$1, o$1, [k$1(e, 1), I(e, v$1)], o$1, o$1, o$1, o$1);
}
function tr(e, r, t, n2) {
  return c(t ? 11 : 10, e, o$1, o$1, o$1, n2, o$1, o$1, o$1, o$1, Oe(r), o$1);
}
function nr(e, r, t, n2) {
  return c(8, r, o$1, o$1, o$1, o$1, { k: t, v: n2 }, o$1, k$1(e, 0), o$1, o$1, o$1);
}
function ht(e, r, t) {
  return c(22, r, t, o$1, o$1, o$1, o$1, o$1, k$1(e, 1), o$1, o$1, o$1);
}
function or(e, r, t) {
  let n2 = new Uint8Array(t), a = "";
  for (let s = 0, i = n2.length; s < i; s++) a += String.fromCharCode(n2[s]);
  return c(19, r, y$1(btoa(a)), o$1, o$1, o$1, o$1, o$1, k$1(e, 5), o$1, o$1, o$1);
}
var ae$1 = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(ae$1 || {});
function ni(e) {
  return e;
}
function kt(e, r) {
  for (let t = 0, n2 = r.length; t < n2; t++) {
    let a = r[t];
    e.has(a) || (e.add(a), a.extends && kt(e, a.extends));
  }
}
function A(e) {
  if (e) {
    let r = /* @__PURE__ */ new Set();
    return kt(r, e), [...r];
  }
}
function Dt(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new Je(e);
  }
}
var Ln = 1e6, Un = 1e4, jn = 2e4;
function Bt(e, r) {
  switch (r) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var Yn = 1e3;
function Vt(e, r) {
  var t;
  return { mode: e, plugins: r.plugins, refs: r.refs || /* @__PURE__ */ new Map(), features: (t = r.features) != null ? t : 63 ^ (r.disabledFeatures || 0), depthLimit: r.depthLimit || Yn };
}
function Mt(e) {
  return { mode: 1, base: Vt(1, e), child: o$1, state: { marked: new Set(e.markedRefs) } };
}
var Dr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  deserialize(r) {
    return p$1(this._p, this.depth, r);
  }
};
function Ut(e, r) {
  if (r < 0 || !Number.isFinite(r) || !Number.isInteger(r)) throw new h$1({ t: 4, i: r });
  if (e.refs.has(r)) throw new Error("Conflicted ref id: " + r);
}
function qn(e, r, t) {
  return Ut(e.base, r), e.state.marked.has(r) && e.base.refs.set(r, t), t;
}
function Wn(e, r, t) {
  return Ut(e.base, r), e.base.refs.set(r, t), t;
}
function b(e, r, t) {
  return e.mode === 1 ? qn(e, r, t) : Wn(e, r, t);
}
function Fr(e, r, t) {
  if (Object.hasOwn(r, t)) return r[t];
  throw new h$1(e);
}
function Gn(e, r) {
  return b(e, r.i, ft(B(r.s)));
}
function Kn(e, r, t) {
  let n2 = t.a, a = n2.length, s = b(e, t.i, new Array(a));
  for (let i = 0, u; i < a; i++) u = n2[i], u && (s[i] = p$1(e, r, u));
  return Bt(s, t.o), s;
}
function Hn(e) {
  switch (e) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function Jn(e) {
  switch (e) {
    case v$1:
    case R:
    case P$1:
    case C:
      return true;
    default:
      return false;
  }
}
function Ft(e, r, t) {
  Hn(r) ? e[r] = t : Object.defineProperty(e, r, { value: t, configurable: true, enumerable: true, writable: true });
}
function Zn(e, r, t, n2, a) {
  if (typeof n2 == "string") Ft(t, n2, p$1(e, r, a));
  else {
    let s = p$1(e, r, n2);
    switch (typeof s) {
      case "string":
        Ft(t, s, p$1(e, r, a));
        break;
      case "symbol":
        Jn(s) && (t[s] = p$1(e, r, a));
        break;
      default:
        throw new h$1(n2);
    }
  }
}
function jt(e, r, t, n2) {
  let a = t.k;
  if (a.length > 0) for (let i = 0, u = t.v, l2 = a.length; i < l2; i++) Zn(e, r, n2, a[i], u[i]);
  return n2;
}
function $n(e, r, t) {
  let n2 = b(e, t.i, t.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
  return jt(e, r, t.p, n2), Bt(n2, t.o), n2;
}
function Xn(e, r) {
  return b(e, r.i, new Date(r.s));
}
function Qn(e, r) {
  if (e.base.features & 32) {
    let t = B(r.c);
    if (t.length > jn) throw new h$1(r);
    return b(e, r.i, new RegExp(t, r.m));
  }
  throw new w$1(r);
}
function eo(e, r, t) {
  let n2 = b(e, t.i, /* @__PURE__ */ new Set());
  for (let a = 0, s = t.a, i = s.length; a < i; a++) n2.add(p$1(e, r, s[a]));
  return n2;
}
function ro(e, r, t) {
  let n2 = b(e, t.i, /* @__PURE__ */ new Map());
  for (let a = 0, s = t.e.k, i = t.e.v, u = s.length; a < u; a++) n2.set(p$1(e, r, s[a]), p$1(e, r, i[a]));
  return n2;
}
function to(e, r) {
  if (r.s.length > Ln) throw new h$1(r);
  return b(e, r.i, Or(B(r.s)));
}
function no(e, r, t) {
  var u;
  let n2 = Dt(t.c), a = p$1(e, r, t.f), s = (u = t.b) != null ? u : 0;
  if (s < 0 || s > a.byteLength) throw new h$1(t);
  return b(e, t.i, new n2(a, s, t.l));
}
function oo(e, r, t) {
  var i;
  let n2 = p$1(e, r, t.f), a = (i = t.b) != null ? i : 0;
  if (a < 0 || a > n2.byteLength) throw new h$1(t);
  return b(e, t.i, new DataView(n2, a, t.l));
}
function Yt(e, r, t, n2) {
  if (t.p) {
    let a = jt(e, r, t.p, {});
    Object.defineProperties(n2, Object.getOwnPropertyDescriptors(a));
  }
  return n2;
}
function ao(e, r, t) {
  let n2 = b(e, t.i, new AggregateError([], B(t.m)));
  return Yt(e, r, t, n2);
}
function so(e, r, t) {
  let n2 = Fr(t, at, t.s), a = b(e, t.i, new n2(B(t.m)));
  return Yt(e, r, t, a);
}
function io(e, r, t) {
  let n2 = re(), a = b(e, t.i, n2.p), s = p$1(e, r, t.f);
  return t.s ? n2.s(s) : n2.f(s), a;
}
function uo(e, r, t) {
  return b(e, t.i, Object(p$1(e, r, t.f)));
}
function lo(e, r, t) {
  let n2 = e.base.plugins;
  if (n2) {
    let a = B(t.c);
    for (let s = 0, i = n2.length; s < i; s++) {
      let u = n2[s];
      if (u.tag === a) return b(e, t.i, u.deserialize(t.s, new Dr(e, r), { id: t.i }));
    }
  }
  throw new Q(t.c);
}
function co(e, r) {
  return b(e, r.i, b(e, r.s, re()).p);
}
function fo(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2) return n2.s(p$1(e, r, t.a[1])), o$1;
  throw new V$1("Promise");
}
function So(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2) return n2.f(p$1(e, r, t.a[1])), o$1;
  throw new V$1("Promise");
}
function mo(e, r, t) {
  p$1(e, r, t.a[0]);
  let n2 = p$1(e, r, t.a[1]);
  return It(n2);
}
function po(e, r, t) {
  p$1(e, r, t.a[0]);
  let n2 = p$1(e, r, t.a[1]);
  return Tt(n2);
}
function go(e, r, t) {
  let n2 = b(e, t.i, te$1()), a = t.a, s = a.length;
  if (s) for (let i = 0; i < s; i++) p$1(e, r, a[i]);
  return n2;
}
function yo(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2 && M(n2)) return n2.next(p$1(e, r, t.f)), o$1;
  throw new V$1("Stream");
}
function No(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2 && M(n2)) return n2.throw(p$1(e, r, t.f)), o$1;
  throw new V$1("Stream");
}
function bo(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2 && M(n2)) return n2.return(p$1(e, r, t.f)), o$1;
  throw new V$1("Stream");
}
function vo(e, r, t) {
  return p$1(e, r, t.f), o$1;
}
function Co(e, r, t) {
  return p$1(e, r, t.a[1]), o$1;
}
function Ao(e, r, t) {
  let n2 = b(e, t.i, Tr([], t.s, t.l));
  for (let a = 0, s = t.a.length; a < s; a++) n2.v[a] = p$1(e, r, t.a[a]);
  return n2;
}
function p$1(e, r, t) {
  if (r > e.base.depthLimit) throw new ee$1(e.base.depthLimit);
  switch (r += 1, t.t) {
    case 2:
      return Fr(t, ot, t.s);
    case 0:
      return Number(t.s);
    case 1:
      return B(String(t.s));
    case 3:
      if (String(t.s).length > Un) throw new h$1(t);
      return BigInt(t.s);
    case 4:
      return e.base.refs.get(t.i);
    case 18:
      return Gn(e, t);
    case 9:
      return Kn(e, r, t);
    case 10:
    case 11:
      return $n(e, r, t);
    case 5:
      return Xn(e, t);
    case 6:
      return Qn(e, t);
    case 7:
      return eo(e, r, t);
    case 8:
      return ro(e, r, t);
    case 19:
      return to(e, t);
    case 16:
    case 15:
      return no(e, r, t);
    case 20:
      return oo(e, r, t);
    case 14:
      return ao(e, r, t);
    case 13:
      return so(e, r, t);
    case 12:
      return io(e, r, t);
    case 17:
      return Fr(t, tt, t.s);
    case 21:
      return uo(e, r, t);
    case 25:
      return lo(e, r, t);
    case 22:
      return co(e, t);
    case 23:
      return fo(e, r, t);
    case 24:
      return So(e, r, t);
    case 28:
      return mo(e, r, t);
    case 30:
      return po(e, r, t);
    case 31:
      return go(e, r, t);
    case 32:
      return yo(e, r, t);
    case 33:
      return No(e, r, t);
    case 34:
      return bo(e, r, t);
    case 27:
      return vo(e, r, t);
    case 29:
      return Co(e, r, t);
    case 35:
      return Ao(e, r, t);
    default:
      throw new w$1(t);
  }
}
function ar(e, r) {
  try {
    return p$1(e, 0, r);
  } catch (t) {
    throw new He(t);
  }
}
var Eo = () => T, Io = Eo.toString(), qt = /=>/.test(Io);
function sr(e, r) {
  return qt ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function Wt(e, r) {
  return qt ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var Ht = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_", Gt = Ht.length, Jt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_", Kt = Jt.length;
function Br(e) {
  let r = e % Gt, t = Ht[r];
  for (e = (e - r) / Gt; e > 0; ) r = e % Kt, t += Jt[r], e = (e - r) / Kt;
  return t;
}
var Ro = /^[$A-Z_][0-9A-Z_$]*$/i;
function Vr(e) {
  let r = e[0];
  return (r === "$" || r === "_" || r >= "A" && r <= "Z" || r >= "a" && r <= "z") && Ro.test(e);
}
function ye(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
  }
}
function Po(e) {
  let r = [], t = e[0];
  for (let n2 = 1, a = e.length, s, i = t; n2 < a; n2++) s = e[n2], s.t === 0 && s.v === i.v ? t = { t: 0, s: s.s, k: o$1, v: ye(t) } : s.t === 2 && s.s === i.s ? t = { t: 2, s: ye(t), k: s.k, v: s.v } : s.t === 1 && s.s === i.s ? t = { t: 1, s: ye(t), k: o$1, v: s.v } : s.t === 3 && s.s === i.s ? t = { t: 3, s: ye(t), k: s.k, v: o$1 } : (r.push(t), t = s), i = s;
  return r.push(t), r;
}
function tn(e) {
  if (e.length) {
    let r = "", t = Po(e);
    for (let n2 = 0, a = t.length; n2 < a; n2++) r += ye(t[n2]) + ",";
    return r;
  }
  return o$1;
}
var xo = "Object.create(null)", Oo = "new Set", To = "new Map", wo = "Promise.resolve", ho = "Promise.reject", zo = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: o$1 };
function nn(e, r) {
  return { mode: e, plugins: r.plugins, features: r.features, marked: new Set(r.markedRefs), stack: [], flags: [], assignments: [] };
}
function ur(e) {
  return { mode: 2, base: nn(2, e), state: e, child: o$1 };
}
var Mr = class {
  constructor(r) {
    this._p = r;
  }
  serialize(r) {
    return f$1(this._p, r);
  }
};
function ko(e, r) {
  let t = e.valid.get(r);
  t == null && (t = e.valid.size, e.valid.set(r, t));
  let n2 = e.vars[t];
  return n2 == null && (n2 = Br(t), e.vars[t] = n2), n2;
}
function Do(e) {
  return ce + "[" + e + "]";
}
function m$1(e, r) {
  return e.mode === 1 ? ko(e.state, r) : Do(r);
}
function O(e, r) {
  e.marked.add(r);
}
function Lr(e, r) {
  return e.marked.has(r);
}
function jr(e, r, t) {
  r !== 0 && (O(e.base, t), e.base.flags.push({ type: r, value: m$1(e, t) }));
}
function Fo(e) {
  let r = "";
  for (let t = 0, n2 = e.flags, a = n2.length; t < a; t++) {
    let s = n2[t];
    r += zo[s.type] + "(" + s.value + "),";
  }
  return r;
}
function on(e) {
  let r = tn(e.assignments), t = Fo(e);
  return r ? t ? r + t : r : t;
}
function Yr(e, r, t) {
  e.assignments.push({ t: 0, s: r, k: o$1, v: t });
}
function Bo(e, r, t) {
  e.base.assignments.push({ t: 1, s: m$1(e, r), k: o$1, v: t });
}
function ge(e, r, t, n2) {
  e.base.assignments.push({ t: 2, s: m$1(e, r), k: t, v: n2 });
}
function Zt(e, r, t) {
  e.base.assignments.push({ t: 3, s: m$1(e, r), k: t, v: o$1 });
}
function Ne(e, r, t, n2) {
  Yr(e.base, m$1(e, r) + "[" + t + "]", n2);
}
function Ur(e, r, t, n2) {
  Yr(e.base, m$1(e, r) + "." + t, n2);
}
function Vo(e, r, t, n2) {
  Yr(e.base, m$1(e, r) + ".v[" + t + "]", n2);
}
function D(e, r) {
  return r.t === 4 && e.stack.includes(r.i);
}
function se(e, r, t) {
  return e.mode === 1 && !Lr(e.base, r) ? t : m$1(e, r) + "=" + t;
}
function Mo(e) {
  return U$1 + '.get("' + e.s + '")';
}
function $t(e, r, t, n2) {
  return t ? D(e.base, t) ? (O(e.base, r), Ne(e, r, n2, m$1(e, t.i)), "") : f$1(e, t) : "";
}
function Lo(e, r) {
  let t = r.i, n2 = r.a, a = n2.length;
  if (a > 0) {
    e.base.stack.push(t);
    let s = $t(e, t, n2[0], 0), i = s === "";
    for (let u = 1, l2; u < a; u++) l2 = $t(e, t, n2[u], u), s += "," + l2, i = l2 === "";
    return e.base.stack.pop(), jr(e, r.o, r.i), "[" + s + (i ? ",]" : "]");
  }
  return "[]";
}
function Xt(e, r, t, n2) {
  if (typeof t == "string") {
    let a = Number(t), s = a >= 0 && a.toString() === t || Vr(t);
    if (D(e.base, n2)) {
      let i = m$1(e, n2.i);
      return O(e.base, r.i), s && a !== a ? Ur(e, r.i, t, i) : Ne(e, r.i, s ? t : '"' + t + '"', i), "";
    }
    return (s ? t : '"' + t + '"') + ":" + f$1(e, n2);
  }
  return "[" + f$1(e, t) + "]:" + f$1(e, n2);
}
function an(e, r, t) {
  let n2 = t.k, a = n2.length;
  if (a > 0) {
    let s = t.v;
    e.base.stack.push(r.i);
    let i = Xt(e, r, n2[0], s[0]);
    for (let u = 1, l2 = i; u < a; u++) l2 = Xt(e, r, n2[u], s[u]), i += (l2 && i && ",") + l2;
    return e.base.stack.pop(), "{" + i + "}";
  }
  return "{}";
}
function Uo(e, r) {
  return jr(e, r.o, r.i), an(e, r, r.p);
}
function jo(e, r, t, n2) {
  let a = an(e, r, t);
  return a !== "{}" ? "Object.assign(" + n2 + "," + a + ")" : n2;
}
function Yo(e, r, t, n2, a) {
  let s = e.base, i = f$1(e, a), u = Number(n2), l2 = u >= 0 && u.toString() === n2 || Vr(n2);
  if (D(s, a)) l2 && u !== u ? Ur(e, r.i, n2, i) : Ne(e, r.i, l2 ? n2 : '"' + n2 + '"', i);
  else {
    let g2 = s.assignments;
    s.assignments = t, l2 && u !== u ? Ur(e, r.i, n2, i) : Ne(e, r.i, l2 ? n2 : '"' + n2 + '"', i), s.assignments = g2;
  }
}
function qo(e, r, t, n2, a) {
  if (typeof n2 == "string") Yo(e, r, t, n2, a);
  else {
    let s = e.base, i = s.stack;
    s.stack = [];
    let u = f$1(e, a);
    s.stack = i;
    let l2 = s.assignments;
    s.assignments = t, Ne(e, r.i, f$1(e, n2), u), s.assignments = l2;
  }
}
function Wo(e, r, t) {
  let n2 = t.k, a = n2.length;
  if (a > 0) {
    let s = [], i = t.v;
    e.base.stack.push(r.i);
    for (let u = 0; u < a; u++) qo(e, r, s, n2[u], i[u]);
    return e.base.stack.pop(), tn(s);
  }
  return o$1;
}
function qr(e, r, t) {
  if (r.p) {
    let n2 = e.base;
    if (n2.features & 8) t = jo(e, r, r.p, t);
    else {
      O(n2, r.i);
      let a = Wo(e, r, r.p);
      if (a) return "(" + se(e, r.i, t) + "," + a + m$1(e, r.i) + ")";
    }
  }
  return t;
}
function Go(e, r) {
  return jr(e, r.o, r.i), qr(e, r, xo);
}
function Ko(e) {
  return 'new Date("' + e.s + '")';
}
function Ho(e, r) {
  if (e.base.features & 32) return "/" + r.c + "/" + r.m;
  throw new w$1(r);
}
function Qt(e, r, t) {
  let n2 = e.base;
  return D(n2, t) ? (O(n2, r), Bo(e, r, m$1(e, t.i)), "") : f$1(e, t);
}
function Jo(e, r) {
  let t = Oo, n2 = r.a, a = n2.length, s = r.i;
  if (a > 0) {
    e.base.stack.push(s);
    let i = Qt(e, s, n2[0]);
    for (let u = 1, l2 = i; u < a; u++) l2 = Qt(e, s, n2[u]), i += (l2 && i && ",") + l2;
    e.base.stack.pop(), i && (t += "([" + i + "])");
  }
  return t;
}
function en(e, r, t, n2, a) {
  let s = e.base;
  if (D(s, t)) {
    let i = m$1(e, t.i);
    if (O(s, r), D(s, n2)) {
      let l2 = m$1(e, n2.i);
      return ge(e, r, i, l2), "";
    }
    if (n2.t !== 4 && n2.i != null && Lr(s, n2.i)) {
      let l2 = "(" + f$1(e, n2) + ",[" + a + "," + a + "])";
      return ge(e, r, i, m$1(e, n2.i)), Zt(e, r, a), l2;
    }
    let u = s.stack;
    return s.stack = [], ge(e, r, i, f$1(e, n2)), s.stack = u, "";
  }
  if (D(s, n2)) {
    let i = m$1(e, n2.i);
    if (O(s, r), t.t !== 4 && t.i != null && Lr(s, t.i)) {
      let l2 = "(" + f$1(e, t) + ",[" + a + "," + a + "])";
      return ge(e, r, m$1(e, t.i), i), Zt(e, r, a), l2;
    }
    let u = s.stack;
    return s.stack = [], ge(e, r, f$1(e, t), i), s.stack = u, "";
  }
  return "[" + f$1(e, t) + "," + f$1(e, n2) + "]";
}
function Zo(e, r) {
  let t = To, n2 = r.e.k, a = n2.length, s = r.i, i = r.f, u = m$1(e, i.i), l2 = e.base;
  if (a > 0) {
    let g2 = r.e.v;
    l2.stack.push(s);
    let S = en(e, s, n2[0], g2[0], u);
    for (let d2 = 1, K2 = S; d2 < a; d2++) K2 = en(e, s, n2[d2], g2[d2], u), S += (K2 && S && ",") + K2;
    l2.stack.pop(), S && (t += "([" + S + "])");
  }
  return i.t === 26 && (O(l2, i.i), t = "(" + f$1(e, i) + "," + t + ")"), t;
}
function $o(e, r) {
  return W$1(e, r.f) + '("' + r.s + '")';
}
function Xo(e, r) {
  return "new " + r.c + "(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function Qo(e, r) {
  return "new DataView(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function ea(e, r) {
  let t = r.i;
  e.base.stack.push(t);
  let n2 = qr(e, r, 'new AggregateError([],"' + r.m + '")');
  return e.base.stack.pop(), n2;
}
function ra(e, r) {
  return qr(e, r, "new " + Ce[r.s] + '("' + r.m + '")');
}
function ta(e, r) {
  let t, n2 = r.f, a = r.i, s = r.s ? wo : ho, i = e.base;
  if (D(i, n2)) {
    let u = m$1(e, n2.i);
    t = s + (r.s ? "().then(" + sr([], u) + ")" : "().catch(" + Wt([], "throw " + u) + ")");
  } else {
    i.stack.push(a);
    let u = f$1(e, n2);
    i.stack.pop(), t = s + "(" + u + ")";
  }
  return t;
}
function na(e, r) {
  return "Object(" + f$1(e, r.f) + ")";
}
function W$1(e, r) {
  let t = f$1(e, r);
  return r.t === 4 ? t : "(" + t + ")";
}
function oa(e, r) {
  if (e.mode === 1) throw new w$1(r);
  return "(" + se(e, r.s, W$1(e, r.f) + "()") + ").p";
}
function aa(e, r) {
  if (e.mode === 1) throw new w$1(r);
  return W$1(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function sa(e, r) {
  if (e.mode === 1) throw new w$1(r);
  return W$1(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function ia(e, r) {
  let t = e.base.plugins;
  if (t) for (let n2 = 0, a = t.length; n2 < a; n2++) {
    let s = t[n2];
    if (s.tag === r.c) return e.child == null && (e.child = new Mr(e)), s.serialize(r.s, e.child, { id: r.i });
  }
  throw new Q(r.c);
}
function ua(e, r) {
  let t = "", n2 = false;
  return r.f.t !== 4 && (O(e.base, r.f.i), t = "(" + f$1(e, r.f) + ",", n2 = true), t += se(e, r.i, "(" + Ct + ")(" + m$1(e, r.f.i) + ")"), n2 && (t += ")"), t;
}
function la(e, r) {
  return W$1(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function ca(e, r) {
  let t = r.a[0], n2 = r.a[1], a = e.base, s = "";
  t.t !== 4 && (O(a, t.i), s += "(" + f$1(e, t)), n2.t !== 4 && (O(a, n2.i), s += (s ? "," : "(") + f$1(e, n2)), s && (s += ",");
  let i = se(e, r.i, "(" + At + ")(" + m$1(e, n2.i) + "," + m$1(e, t.i) + ")");
  return s ? s + i + ")" : i;
}
function fa(e, r) {
  return W$1(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function Sa(e, r) {
  let t = se(e, r.i, W$1(e, r.f) + "()"), n2 = r.a.length;
  if (n2) {
    let a = f$1(e, r.a[0]);
    for (let s = 1; s < n2; s++) a += "," + f$1(e, r.a[s]);
    return "(" + t + "," + a + "," + m$1(e, r.i) + ")";
  }
  return t;
}
function ma(e, r) {
  return m$1(e, r.i) + ".next(" + f$1(e, r.f) + ")";
}
function pa(e, r) {
  return m$1(e, r.i) + ".throw(" + f$1(e, r.f) + ")";
}
function da(e, r) {
  return m$1(e, r.i) + ".return(" + f$1(e, r.f) + ")";
}
function rn(e, r, t, n2) {
  let a = e.base;
  return D(a, n2) ? (O(a, r), Vo(e, r, t, m$1(e, n2.i)), "") : f$1(e, n2);
}
function ga(e, r) {
  let t = r.a, n2 = t.length, a = r.i;
  if (n2 > 0) {
    e.base.stack.push(a);
    let s = rn(e, a, 0, t[0]);
    for (let i = 1, u = s; i < n2; i++) u = rn(e, a, i, t[i]), s += (u && s && ",") + u;
    if (e.base.stack.pop(), s) return "{__SEROVAL_SEQUENCE__:!0,v:[" + s + "],t:" + r.s + ",d:" + r.l + "}";
  }
  return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function ya(e, r) {
  switch (r.t) {
    case 17:
      return rt[r.s];
    case 18:
      return Mo(r);
    case 9:
      return Lo(e, r);
    case 10:
      return Uo(e, r);
    case 11:
      return Go(e, r);
    case 5:
      return Ko(r);
    case 6:
      return Ho(e, r);
    case 7:
      return Jo(e, r);
    case 8:
      return Zo(e, r);
    case 19:
      return $o(e, r);
    case 16:
    case 15:
      return Xo(e, r);
    case 20:
      return Qo(e, r);
    case 14:
      return ea(e, r);
    case 13:
      return ra(e, r);
    case 12:
      return ta(e, r);
    case 21:
      return na(e, r);
    case 22:
      return oa(e, r);
    case 25:
      return ia(e, r);
    case 26:
      return Ot[r.s];
    case 35:
      return ga(e, r);
    default:
      throw new w$1(r);
  }
}
function f$1(e, r) {
  switch (r.t) {
    case 2:
      return nt[r.s];
    case 0:
      return "" + r.s;
    case 1:
      return '"' + r.s + '"';
    case 3:
      return r.s + "n";
    case 4:
      return m$1(e, r.i);
    case 23:
      return aa(e, r);
    case 24:
      return sa(e, r);
    case 27:
      return ua(e, r);
    case 28:
      return la(e, r);
    case 29:
      return ca(e, r);
    case 30:
      return fa(e, r);
    case 31:
      return Sa(e, r);
    case 32:
      return ma(e, r);
    case 33:
      return pa(e, r);
    case 34:
      return da(e, r);
    default:
      return se(e, r.i, ya(e, r));
  }
}
function cr(e, r) {
  let t = f$1(e, r), n2 = r.i;
  if (n2 == null) return t;
  let a = on(e.base), s = m$1(e, n2), i = e.state.scopeId, u = i == null ? "" : ce, l2 = a ? "(" + t + "," + a + s + ")" : t;
  if (u === "") return r.t === 10 && !a ? "(" + l2 + ")" : l2;
  let g2 = i == null ? "()" : "(" + ce + '["' + y$1(i) + '"])';
  return "(" + sr([u], l2) + ")" + g2;
}
var Gr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return E(this._p, this.depth, r);
  }
}, Kr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return E(this._p, this.depth, r);
  }
  parseWithError(r) {
    return G$1(this._p, this.depth, r);
  }
  isAlive() {
    return this._p.state.alive;
  }
  pushPendingState() {
    Xr(this._p);
  }
  popPendingState() {
    be(this._p);
  }
  onParse(r) {
    ie(this._p, r);
  }
  onError(r) {
    Zr(this._p, r);
  }
};
function Na(e) {
  return { alive: true, pending: 0, initial: true, buffer: [], onParse: e.onParse, onError: e.onError, onDone: e.onDone };
}
function Hr(e) {
  return { type: 2, base: pe$1(2, e), state: Na(e) };
}
function ba(e, r, t) {
  let n2 = [];
  for (let a = 0, s = t.length; a < s; a++) a in t ? n2[a] = E(e, r, t[a]) : n2[a] = 0;
  return n2;
}
function va(e, r, t, n2) {
  return _e(t, n2, ba(e, r, n2));
}
function Jr(e, r, t) {
  let n2 = Object.entries(t), a = [], s = [];
  for (let i = 0, u = n2.length; i < u; i++) a.push(y$1(n2[i][0])), s.push(E(e, r, n2[i][1]));
  return C in t && (a.push(I(e.base, C)), s.push(Ue(er(e.base), E(e, r, $e(t))))), v$1 in t && (a.push(I(e.base, v$1)), s.push(je(rr(e.base), E(e, r, e.type === 1 ? te$1() : Xe(t))))), P$1 in t && (a.push(I(e.base, P$1)), s.push(X(t[P$1]))), R in t && (a.push(I(e.base, R)), s.push(t[R] ? J$1 : Z)), { k: a, v: s };
}
function Wr(e, r, t, n2, a) {
  return tr(t, n2, a, Jr(e, r, n2));
}
function Ca(e, r, t, n2) {
  return ke(t, E(e, r, n2.valueOf()));
}
function Aa(e, r, t, n2) {
  return De(t, n2, E(e, r, n2.buffer));
}
function Ea(e, r, t, n2) {
  return Fe(t, n2, E(e, r, n2.buffer));
}
function Ia(e, r, t, n2) {
  return Be(t, n2, E(e, r, n2.buffer));
}
function sn(e, r, t, n2) {
  let a = $(n2, e.base.features);
  return Ve(t, n2, a ? Jr(e, r, a) : o$1);
}
function Ra(e, r, t, n2) {
  let a = $(n2, e.base.features);
  return Me(t, n2, a ? Jr(e, r, a) : o$1);
}
function Pa(e, r, t, n2) {
  let a = [], s = [];
  for (let [i, u] of n2.entries()) a.push(E(e, r, i)), s.push(E(e, r, u));
  return nr(e.base, t, a, s);
}
function xa(e, r, t, n2) {
  let a = [];
  for (let s of n2.keys()) a.push(E(e, r, s));
  return Le(t, a);
}
function Oa(e, r, t, n2) {
  let a = Ye(t, k$1(e.base, 4), []);
  return e.type === 1 || (Xr(e), n2.on({ next: (s) => {
    if (e.state.alive) {
      let i = G$1(e, r, s);
      i && ie(e, qe(t, i));
    }
  }, throw: (s) => {
    if (e.state.alive) {
      let i = G$1(e, r, s);
      i && ie(e, We(t, i));
    }
    be(e);
  }, return: (s) => {
    if (e.state.alive) {
      let i = G$1(e, r, s);
      i && ie(e, Ge(t, i));
    }
    be(e);
  } })), a;
}
function Ta(e, r, t) {
  if (this.state.alive) {
    let n2 = G$1(this, r, t);
    n2 && ie(this, c(23, e, o$1, o$1, o$1, o$1, o$1, [k$1(this.base, 2), n2], o$1, o$1, o$1, o$1)), be(this);
  }
}
function wa(e, r, t) {
  if (this.state.alive) {
    let n2 = G$1(this, r, t);
    n2 && ie(this, c(24, e, o$1, o$1, o$1, o$1, o$1, [k$1(this.base, 3), n2], o$1, o$1, o$1, o$1));
  }
  be(this);
}
function ha(e, r, t, n2) {
  let a = hr(e.base, {});
  return e.type === 2 && (Xr(e), n2.then(Ta.bind(e, a, r), wa.bind(e, a, r))), ht(e.base, t, a);
}
function za(e, r, t, n2, a) {
  for (let s = 0, i = a.length; s < i; s++) {
    let u = a[s];
    if (u.parse.sync && u.test(n2)) return fe$1(t, u.tag, u.parse.sync(n2, new Gr(e, r), { id: t }));
  }
  return o$1;
}
function _a(e, r, t, n2, a) {
  for (let s = 0, i = a.length; s < i; s++) {
    let u = a[s];
    if (u.parse.stream && u.test(n2)) return fe$1(t, u.tag, u.parse.stream(n2, new Kr(e, r), { id: t }));
  }
  return o$1;
}
function un(e, r, t, n2) {
  let a = e.base.plugins;
  return a ? e.type === 1 ? za(e, r, t, n2, a) : _a(e, r, t, n2, a) : o$1;
}
function ka(e, r, t, n2) {
  let a = [];
  for (let s = 0, i = n2.v.length; s < i; s++) a[s] = E(e, r, n2.v[s]);
  return Ke(t, a, n2.t, n2.d);
}
function Da(e, r, t, n2, a) {
  switch (a) {
    case Object:
      return Wr(e, r, t, n2, false);
    case o$1:
      return Wr(e, r, t, n2, true);
    case Date:
      return he(t, n2);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return sn(e, r, t, n2);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return Ca(e, r, t, n2);
    case ArrayBuffer:
      return or(e.base, t, n2);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return Aa(e, r, t, n2);
    case DataView:
      return Ia(e, r, t, n2);
    case Map:
      return Pa(e, r, t, n2);
    case Set:
      return xa(e, r, t, n2);
  }
  if (a === Promise || n2 instanceof Promise) return ha(e, r, t, n2);
  let s = e.base.features;
  if (s & 32 && a === RegExp) return ze(t, n2);
  if (s & 16) switch (a) {
    case BigInt64Array:
    case BigUint64Array:
      return Ea(e, r, t, n2);
  }
  if (s & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n2 instanceof AggregateError)) return Ra(e, r, t, n2);
  if (n2 instanceof Error) return sn(e, r, t, n2);
  if (C in n2 || v$1 in n2) return Wr(e, r, t, n2, !!a);
  throw new x$1(n2);
}
function Fa(e, r, t, n2) {
  if (Array.isArray(n2)) return va(e, r, t, n2);
  if (M(n2)) return Oa(e, r, t, n2);
  if (Ze(n2)) return ka(e, r, t, n2);
  let a = n2.constructor;
  if (a === Y$1) return E(e, r, n2.replacement);
  let s = un(e, r, t, n2);
  return s || Da(e, r, t, n2, a);
}
function Ba(e, r, t) {
  let n2 = q$1(e.base, t);
  if (n2.type !== 0) return n2.value;
  let a = un(e, r, n2.value, t);
  if (a) return a;
  throw new x$1(t);
}
function E(e, r, t) {
  if (r >= e.base.depthLimit) throw new ee$1(e.base.depthLimit);
  switch (typeof t) {
    case "boolean":
      return t ? J$1 : Z;
    case "undefined":
      return Ae;
    case "string":
      return X(t);
    case "number":
      return Te(t);
    case "bigint":
      return we(t);
    case "object": {
      if (t) {
        let n2 = q$1(e.base, t);
        return n2.type === 0 ? Fa(e, r + 1, n2.value, t) : n2.value;
      }
      return Ee;
    }
    case "symbol":
      return I(e.base, t);
    case "function":
      return Ba(e, r, t);
    default:
      throw new x$1(t);
  }
}
function ie(e, r) {
  e.state.initial ? e.state.buffer.push(r) : $r(e, r, false);
}
function Zr(e, r) {
  if (e.state.onError) e.state.onError(r);
  else throw r instanceof z ? r : new z(r);
}
function ln(e) {
  e.state.onDone && e.state.onDone();
}
function $r(e, r, t) {
  try {
    e.state.onParse(r, t);
  } catch (n2) {
    Zr(e, n2);
  }
}
function Xr(e) {
  e.state.pending++;
}
function be(e) {
  --e.state.pending <= 0 && ln(e);
}
function G$1(e, r, t) {
  try {
    return E(e, r, t);
  } catch (n2) {
    return Zr(e, n2), o$1;
  }
}
function Qr(e, r) {
  let t = G$1(e, 0, r);
  t && ($r(e, t, true), e.state.initial = false, Va(e, e.state), e.state.pending <= 0 && fr(e));
}
function Va(e, r) {
  for (let t = 0, n2 = r.buffer.length; t < n2; t++) $r(e, r.buffer[t], false);
}
function fr(e) {
  e.state.alive && (ln(e), e.state.alive = false);
}
function cn(e, r) {
  let t = A(r.plugins), n2 = Hr({ plugins: t, refs: r.refs, disabledFeatures: r.disabledFeatures, onParse(a, s) {
    let i = ur({ plugins: t, features: n2.base.features, scopeId: r.scopeId, markedRefs: n2.base.marked }), u;
    try {
      u = cr(i, a);
    } catch (l2) {
      r.onError && r.onError(l2);
      return;
    }
    r.onSerialize(u, s);
  }, onError: r.onError, onDone: r.onDone });
  return Qr(n2, e), fr.bind(null, n2);
}
function Iu(e, r = {}) {
  var i;
  let t = A(r.plugins), n2 = r.disabledFeatures || 0, a = (i = e.f) != null ? i : 63, s = Mt({ plugins: t, markedRefs: e.m, features: a & ~n2, disabledFeatures: n2 });
  return ar(s, e.t);
}
function d(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var U = ni({ tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent == "undefined" ? false : e instanceof CustomEvent;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(d(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(d(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(d(e)) };
} }, serialize(e, r) {
  return "new CustomEvent(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new CustomEvent(r.deserialize(e.type), r.deserialize(e.options));
} }), L = U;
var _ = ni({ tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException == "undefined" ? false : e instanceof DOMException;
}, parse: { sync(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
}, async async(e, r) {
  return { name: await r.parse(e.name), message: await r.parse(e.message) };
}, stream(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
} }, serialize(e, r) {
  return "new DOMException(" + r.serialize(e.message) + "," + r.serialize(e.name) + ")";
}, deserialize(e, r) {
  return new DOMException(r.deserialize(e.message), r.deserialize(e.name));
} }), q = _;
function f(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var k = ni({ tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event == "undefined" ? false : e instanceof Event;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(f(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
} }, serialize(e, r) {
  return "new Event(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Event(r.deserialize(e.type), r.deserialize(e.options));
} }), Y2 = k;
var V2 = ni({ tag: "seroval-plugins/web/File", test(e) {
  return typeof File == "undefined" ? false : e instanceof File;
}, parse: { async async(e, r) {
  return { name: await r.parse(e.name), options: await r.parse({ type: e.type, lastModified: e.lastModified }), buffer: await r.parse(await e.arrayBuffer()) };
} }, serialize(e, r) {
  return "new File([" + r.serialize(e.buffer) + "]," + r.serialize(e.name) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new File([r.deserialize(e.buffer)], r.deserialize(e.name), r.deserialize(e.options));
} }), m = V2;
function y(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var o = {}, v = (e, r = new FormData(), a = 0, t = e.length, s) => {
  for (; a < t; a++) s = e[a], r.append(s[0], s[1]);
  return r;
}, G = ni({ tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === o;
}, parse: { sync() {
  return o;
}, async async() {
  return await Promise.resolve(o);
}, stream() {
  return o;
} }, serialize() {
  return v.toString();
}, deserialize() {
  return o;
} }), J = ni({ tag: "seroval-plugins/web/FormData", extends: [m, G], test(e) {
  return typeof FormData == "undefined" ? false : e instanceof FormData;
}, parse: { sync(e, r) {
  return { factory: r.parse(o), entries: r.parse(y(e)) };
}, async async(e, r) {
  return { factory: await r.parse(o), entries: await r.parse(y(e)) };
}, stream(e, r) {
  return { factory: r.parse(o), entries: r.parse(y(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.entries) + ")";
}, deserialize(e, r) {
  return v(r.deserialize(e.entries));
} }), K = J;
function g(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var W = ni({ tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers == "undefined" ? false : e instanceof Headers;
}, parse: { sync(e, r) {
  return { value: r.parse(g(e)) };
}, async async(e, r) {
  return { value: await r.parse(g(e)) };
}, stream(e, r) {
  return { value: r.parse(g(e)) };
} }, serialize(e, r) {
  return "new Headers(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new Headers(r.deserialize(e.value));
} }), l = W;
var n = {}, P = (e) => new ReadableStream({ start: (r) => {
  e.on({ next: (a) => {
    try {
      r.enqueue(a);
    } catch (t) {
    }
  }, throw: (a) => {
    r.error(a);
  }, return: () => {
    try {
      r.close();
    } catch (a) {
    }
  } });
} }), x2 = ni({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === n;
}, parse: { sync() {
  return n;
}, async async() {
  return await Promise.resolve(n);
}, stream() {
  return n;
} }, serialize() {
  return P.toString();
}, deserialize() {
  return n;
} });
function w2(e) {
  let r = te$1(), a = e.getReader();
  async function t() {
    try {
      let s = await a.read();
      s.done ? r.return(s.value) : (r.next(s.value), await t());
    } catch (s) {
      r.throw(s);
    }
  }
  return t().catch(() => {
  }), r;
}
var ee2 = ni({ tag: "seroval/plugins/web/ReadableStream", extends: [x2], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(n), stream: r.parse(te$1()) };
}, async async(e, r) {
  return { factory: await r.parse(n), stream: await r.parse(w2(e)) };
}, stream(e, r) {
  return { factory: r.parse(n), stream: r.parse(w2(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a = r.deserialize(e.stream);
  return P(a);
} }), p = ee2;
function N(e, r) {
  return { body: r, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var ae = ni({ tag: "seroval-plugins/web/Request", extends: [p, l], test(e) {
  return typeof Request == "undefined" ? false : e instanceof Request;
}, parse: { async async(e, r) {
  return { url: await r.parse(e.url), options: await r.parse(N(e, e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null)) };
}, stream(e, r) {
  return { url: r.parse(e.url), options: r.parse(N(e, e.body && !e.bodyUsed ? e.clone().body : null)) };
} }, serialize(e, r) {
  return "new Request(" + r.serialize(e.url) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Request(r.deserialize(e.url), r.deserialize(e.options));
} }), te = ae;
function h2(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var oe = ni({ tag: "seroval-plugins/web/Response", extends: [p, l], test(e) {
  return typeof Response == "undefined" ? false : e instanceof Response;
}, parse: { async async(e, r) {
  return { body: await r.parse(e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null), options: await r.parse(h2(e)) };
}, stream(e, r) {
  return { body: r.parse(e.body && !e.bodyUsed ? e.clone().body : null), options: r.parse(h2(e)) };
} }, serialize(e, r) {
  return "new Response(" + r.serialize(e.body) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Response(r.deserialize(e.body), r.deserialize(e.options));
} }), ne = oe;
var le = ni({ tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL == "undefined" ? false : e instanceof URL;
}, parse: { sync(e, r) {
  return { value: r.parse(e.href) };
}, async async(e, r) {
  return { value: await r.parse(e.href) };
}, stream(e, r) {
  return { value: r.parse(e.href) };
} }, serialize(e, r) {
  return "new URL(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new URL(r.deserialize(e.value));
} }), pe = le;
var de = ni({ tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams == "undefined" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, r) {
  return { value: r.parse(e.toString()) };
}, async async(e, r) {
  return { value: await r.parse(e.toString()) };
}, stream(e, r) {
  return { value: r.parse(e.toString()) };
} }, serialize(e, r) {
  return "new URLSearchParams(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new URLSearchParams(r.deserialize(e.value));
} }), fe = de;
const validRedirectStatuses = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function getExpectedRedirectStatus(response) {
  if (response.status && validRedirectStatuses.has(response.status)) {
    return response.status;
  }
  return 302;
}
function createChunk(data) {
  const encodeData = new TextEncoder().encode(data);
  const bytes = encodeData.length;
  const baseHex = bytes.toString(16);
  const totalHex = "00000000".substring(0, 8 - baseHex.length) + baseHex;
  const head = new TextEncoder().encode(`;0x${totalHex};`);
  const chunk = new Uint8Array(12 + bytes);
  chunk.set(head);
  chunk.set(encodeData, 12);
  return chunk;
}
function serializeToStream(id, value) {
  return new ReadableStream({
    start(controller) {
      cn(value, {
        scopeId: id,
        plugins: [L, q, Y2, K, l, p, te, ne, fe, pe],
        onSerialize(data, initial) {
          controller.enqueue(createChunk(initial ? `(${mn(id)},${data})` : data));
        },
        onDone() {
          controller.close();
        },
        onError(error) {
          controller.error(error);
        }
      });
    }
  });
}
async function handleServerFunction(h3Event) {
  const event = getFetchEvent(h3Event);
  const request = event.request;
  const serverReference = request.headers.get("X-Server-Id");
  const instance = request.headers.get("X-Server-Instance");
  const singleFlight = request.headers.has("X-Single-Flight");
  const url = new URL(request.url);
  let functionId;
  if (serverReference) {
    [functionId] = serverReference.split("#");
  } else {
    functionId = url.searchParams.get("id");
    if (!functionId) {
      return new Response(null, {
        status: 404
      });
    }
  }
  const serverFunction = await getServerFnById(functionId);
  let parsed = [];
  if (!instance || h3Event.method === "GET") {
    const args = url.searchParams.get("args");
    if (args) {
      const json = JSON.parse(args);
      (json.t ? Iu(json, {
        plugins: [L, q, Y2, K, l, p, te, ne, fe, pe]
      }) : json).forEach((arg) => {
        parsed.push(arg);
      });
    }
  }
  if (h3Event.method === "POST") {
    const contentType = request.headers.get("content-type");
    if ((contentType == null ? void 0 : contentType.startsWith("multipart/form-data")) || (contentType == null ? void 0 : contentType.startsWith("application/x-www-form-urlencoded"))) {
      parsed.push(await event.request.formData());
    } else if (contentType == null ? void 0 : contentType.startsWith("application/json")) {
      parsed = Iu(await event.request.json(), {
        plugins: [L, q, Y2, K, l, p, te, ne, fe, pe]
      });
    }
  }
  try {
    let result = await provideRequestEvent(event, async () => {
      sharedConfig.context = {
        event
      };
      event.locals.serverFunctionMeta = {
        id: functionId
      };
      return serverFunction(...parsed);
    });
    if (singleFlight && instance) {
      result = await handleSingleFlight(event, result);
    }
    if (result instanceof Response) {
      if (result.headers && result.headers.has("X-Content-Raw")) return result;
      if (instance) {
        if (result.headers) mergeResponseHeaders(h3Event, result.headers);
        if (result.status && (result.status < 300 || result.status >= 400)) h3Event.res.status = result.status;
        if (result.customBody) {
          result = await result.customBody();
        } else if (result.body == void 0) result = null;
      }
    }
    if (!instance) return handleNoJS(result, request, parsed);
    h3Event.res.headers.set("content-type", "text/javascript");
    return serializeToStream(instance, result);
  } catch (x3) {
    if (x3 instanceof Response) {
      if (singleFlight && instance) {
        x3 = await handleSingleFlight(event, x3);
      }
      if (x3.headers) mergeResponseHeaders(h3Event, x3.headers);
      if (x3.status && (!instance || x3.status < 300 || x3.status >= 400)) h3Event.res.status = x3.status;
      if (x3.customBody) {
        x3 = x3.customBody();
      } else if (x3.body === void 0) x3 = null;
      h3Event.res.headers.set("X-Error", "true");
    } else if (instance) {
      const error = x3 instanceof Error ? x3.message : typeof x3 === "string" ? x3 : "true";
      h3Event.res.headers.set("X-Error", error.replace(/[\r\n]+/g, ""));
    } else {
      x3 = handleNoJS(x3, request, parsed, true);
    }
    if (instance) {
      h3Event.res.headers.set("content-type", "text/javascript");
      return serializeToStream(instance, x3);
    }
    return x3;
  }
}
function handleNoJS(result, request, parsed, thrown) {
  const url = new URL(request.url);
  const isError = result instanceof Error;
  let statusCode = 302;
  let headers;
  if (result instanceof Response) {
    headers = new Headers(result.headers);
    if (result.headers.has("Location")) {
      headers.set(`Location`, new URL(result.headers.get("Location"), url.origin + "/").toString());
      statusCode = getExpectedRedirectStatus(result);
    }
  } else headers = new Headers({
    Location: new URL(request.headers.get("referer")).toString()
  });
  if (result) {
    headers.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({
      url: url.pathname + url.search,
      result: isError ? result.message : result,
      thrown,
      error: isError,
      input: [...parsed.slice(0, -1), [...parsed[parsed.length - 1].entries()]]
    }))}; Secure; HttpOnly;`);
  }
  return new Response(null, {
    status: statusCode,
    headers
  });
}
let App;
function createSingleFlightHeaders(sourceEvent) {
  const headers = sourceEvent.request.headers;
  const cookies = parseCookies(sourceEvent.nativeEvent);
  const SetCookies = sourceEvent.response.headers.getSetCookie();
  headers.delete("cookie");
  SetCookies.forEach((cookie) => {
    if (!cookie) return;
    const {
      maxAge,
      expires,
      name,
      value
    } = parseSetCookie(cookie);
    if (maxAge != null && maxAge <= 0) {
      delete cookies[name];
      return;
    }
    if (expires != null && expires.getTime() <= Date.now()) {
      delete cookies[name];
      return;
    }
    cookies[name] = value;
  });
  Object.entries(cookies).forEach(([key, value]) => {
    headers.append("cookie", `${key}=${value}`);
  });
  return headers;
}
async function handleSingleFlight(sourceEvent, result) {
  let revalidate;
  let url = new URL(sourceEvent.request.headers.get("referer")).toString();
  if (result instanceof Response) {
    if (result.headers.has("X-Revalidate")) revalidate = result.headers.get("X-Revalidate").split(",");
    if (result.headers.has("Location")) url = new URL(result.headers.get("Location"), new URL(sourceEvent.request.url).origin + "/").toString();
  }
  const event = {
    ...sourceEvent
  };
  event.request = new Request(url, {
    headers: createSingleFlightHeaders(sourceEvent)
  });
  return await provideRequestEvent(event, async () => {
    await createPageEvent(event);
    App || (App = (await Promise.resolve().then(() => app)).default);
    event.router.dataOnly = revalidate || true;
    event.router.previousUrl = sourceEvent.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = event;
        App();
      });
    } catch (e) {
      console.log(e);
    }
    const body = event.router.data;
    if (!body) return result;
    let containsKey = false;
    for (const key in body) {
      if (body[key] === void 0) delete body[key];
      else containsKey = true;
    }
    if (!containsKey) return result;
    if (!(result instanceof Response)) {
      body["_$value"] = result;
      result = new Response(null, {
        status: 200
      });
    } else if (result.customBody) {
      body["_$value"] = result.customBody();
    }
    result.customBody = () => body;
    result.headers.set("X-Single-Flight", "true");
    return result;
  });
}
const SERVER_FN_BASE = "/_server";
function createBaseHandler(createPageEvent2, fn2, options = {}) {
  const handler = defineHandler({
    middleware: middleware.length ? middleware.map(decorateMiddleware) : void 0,
    handler: decorateHandler(async (e) => {
      const event = getRequestEvent();
      const url = new URL(event.request.url);
      const pathname = stripBaseUrl(url.pathname);
      if (pathname.startsWith(SERVER_FN_BASE)) {
        const serverFnResponse = await handleServerFunction(e);
        if (serverFnResponse instanceof Response) return produceResponseWithEventHeaders(serverFnResponse);
        return new Response(serverFnResponse, {
          headers: e.res.headers
        });
      }
      const match = matchAPIRoute(pathname, event.request.method);
      if (match) {
        const mod = await match.handler.import();
        const fn22 = event.request.method === "HEAD" ? mod["HEAD"] || mod["GET"] : mod[event.request.method];
        event.params = match.params || {};
        sharedConfig.context = {
          event
        };
        const res = await fn22(event);
        if (res !== void 0) {
          if (res instanceof Response) return produceResponseWithEventHeaders(res);
          return res;
        }
        if (event.request.method !== "GET") {
          throw new Error(`API handler for ${event.request.method} "${event.request.url}" did not return a response.`);
        }
        if (!match.isPage) return;
      }
      const context = await createPageEvent2(event);
      const resolvedOptions = typeof options === "function" ? await options(context) : {
        ...options
      };
      const mode = resolvedOptions.mode || "stream";
      if (resolvedOptions.nonce) context.nonce = resolvedOptions.nonce;
      if (mode === "sync" || false) {
        const html = renderToString(() => {
          sharedConfig.context.event = context;
          return fn2(context);
        }, resolvedOptions);
        context.complete = true;
        if (context.response && context.response.headers.get("Location")) {
          const status = getExpectedRedirectStatus(context.response);
          return redirect(context.response.headers.get("Location"), status);
        }
        event.response.headers.set("content-type", "text/html");
        return html;
      }
      if (resolvedOptions.onCompleteAll) {
        const og = resolvedOptions.onCompleteAll;
        resolvedOptions.onCompleteAll = (options2) => {
          handleStreamCompleteRedirect(context)(options2);
          og(options2);
        };
      } else resolvedOptions.onCompleteAll = handleStreamCompleteRedirect(context);
      if (resolvedOptions.onCompleteShell) {
        const og = resolvedOptions.onCompleteShell;
        resolvedOptions.onCompleteShell = (options2) => {
          handleShellCompleteRedirect(context, e)();
          og(options2);
        };
      } else resolvedOptions.onCompleteShell = handleShellCompleteRedirect(context, e);
      const _stream = renderToStream(() => {
        sharedConfig.context.event = context;
        return fn2(context);
      }, resolvedOptions);
      const stream = _stream;
      if (context.response && context.response.headers.get("Location")) {
        const status = getExpectedRedirectStatus(context.response);
        return redirect(context.response.headers.get("Location"), status);
      }
      if (mode === "async") return await stream;
      delete stream.then;
      if (globalThis.USING_SOLID_START_DEV_SERVER) return stream;
      const {
        writable,
        readable
      } = new TransformStream();
      stream.pipeTo(writable);
      return readable;
    })
  });
  const app2 = new H3();
  app2.use(handler);
  return app2;
}
function createHandler(fn2, options = {}) {
  return createBaseHandler(createPageEvent, fn2, options);
}
async function createPageEvent(ctx) {
  ctx.response.headers.set("Content-Type", "text/html");
  const manifest2 = getSsrManifest();
  const mergedCSS = await manifest2.getAssets("style.css");
  const assets = [
    ...mergedCSS,
    ...await manifest2.getAssets("./src/entry-client.tsx"),
    ...await manifest2.getAssets("/home/ismael/Documents/GitHub/editorjs/src/app.tsx")
    // ...(globalThis._importMeta_.env.START_ISLANDS
    //   ? (await serverManifest.inputs[serverManifest.handler]!.assets()).filter(
    //       s => (s as any).attrs.rel !== "modulepreload"
    //     )
    //   : [])
  ];
  const pageEvent = Object.assign(ctx, {
    assets,
    router: {
      submission: initFromFlash(ctx)
    },
    routes: createRoutes(),
    // prevUrl: prevPath || "",
    // mutation: mutation,
    // $type: FETCH_EVENT,
    complete: false,
    $islands: /* @__PURE__ */ new Set()
  });
  return pageEvent;
}
function initFromFlash(ctx) {
  const flash = getCookie(ctx.nativeEvent, "flash");
  if (!flash) return;
  try {
    const param = JSON.parse(flash);
    if (!param || !param.result) return;
    const input = [...param.input.slice(0, -1), new Map(param.input[param.input.length - 1])];
    const result = param.error ? new Error(param.result) : param.result;
    return {
      input,
      url: param.url,
      pending: false,
      result: param.thrown ? void 0 : result,
      error: param.thrown ? result : void 0
    };
  } catch (e) {
    console.error(e);
  } finally {
    setCookie(ctx.nativeEvent, "flash", "", {
      maxAge: 0
    });
  }
}
function handleShellCompleteRedirect(context, e) {
  return () => {
    if (context.response && context.response.headers.get("Location")) {
      const status = getExpectedRedirectStatus(context.response);
      e.res.status = status;
      e.res.headers.set("Location", context.response.headers.get("Location"));
    }
  };
}
function handleStreamCompleteRedirect(context) {
  return ({
    write
  }) => {
    context.complete = true;
    const to2 = context.response && context.response.headers.get("Location");
    to2 && write(`<script>window.location="${to2}"<\/script>`);
  };
}
function produceResponseWithEventHeaders(res) {
  var _a3, _b2, _c, _d, _e2, _f;
  const event = getRequestEvent();
  let ret = res;
  if (300 <= res.status && res.status < 400) {
    const cookies = (_c = (_b2 = (_a3 = res.headers).getSetCookie) == null ? void 0 : _b2.call(_a3)) != null ? _c : [];
    const headers = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "set-cookie") {
        headers.set(key, value);
      }
    });
    for (const cookie of cookies) {
      headers.append("Set-Cookie", cookie);
    }
    ret = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers
    });
  }
  const eventCookies = (_f = (_e2 = (_d = event.response.headers).getSetCookie) == null ? void 0 : _e2.call(_d)) != null ? _f : [];
  for (const cookie of eventCookies) {
    ret.headers.append("Set-Cookie", cookie);
  }
  for (const [name, value] of event.response.headers) {
    if (name.toLowerCase() !== "set-cookie") {
      ret.headers.set(name, value);
    }
  }
  return ret;
}
function stripBaseUrl(path) {
  return path;
}
var _tmpl$ = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="/favicon.ico">', "</head>"], _tmpl$2 = ["<html", ' lang="en">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const entryServer = createHandler(() => createComponent(StartServer, {
  document: ({
    assets,
    children: children2,
    scripts
  }) => ssr(_tmpl$2, ssrHydrationKey(), createComponent(NoHydration, {
    get children() {
      return ssr(_tmpl$, escape(assets));
    }
  }), escape(children2), escape(scripts))
}));

const entry = fromWebHandler(entryServer.fetch);

const entry$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: entry
});

export { Title as T, useHref as a, useLocation as b, useParams as c, entry$1 as e, isDarkMode as i, normalizePath as n, useResolvedPath as u };
//# sourceMappingURL=entry.mjs.map
