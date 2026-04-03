const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunk-DvofLdBD.js","assets/chunk-dJI1vi8Z.js","assets/chunk-75NoTDq9.js","assets/chunk-BksghESX.js","assets/chunk-CsYwSQuG.js","assets/chunk-CaIpWVc3.js","assets/chunk-CzznHu47.js","assets/chunk-DoPO7Lc7.js","assets/chunk-SLBPMIve.js","assets/chunk-sniMbSt7.js","assets/chunk-BzDiCWHV.js","assets/chunk-BTMvV6bG.js","assets/chunk-DYvrnLMg.js","assets/chunk-BFW3X9Eb.js","assets/chunk-S5Ty5VrR.js","assets/chunk-BhPLEvpZ.js","assets/chunk-Djb9vUoW.js","assets/chunk-Dkm-VSb9.js","assets/chunk-394Jg_Kr.js","assets/chunk-Nxb3cxB-.js","assets/chunk-DQM-MyuJ.js","assets/chunk-RAU2Rr4t.js","assets/chunk-D0OuDVif.js","assets/chunk-DBXzBuvT.js","assets/chunk-WpjEHaE1.js","assets/chunk-Cfm0Z7Nr.js","assets/chunk-CE1A9oo0.js","assets/chunk-DavzXD9O.js","assets/chunk-C8NCZdyo.js","assets/chunk-Mj8thzHu.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { j as jsxRuntimeExports, c as commonjsGlobal, g as getDefaultExportFromCjs, r as reactExports, e as createRoot, d as React } from "./chunk-dJI1vi8Z.js";
import { c as createSlice, a as configureStore, u as useDispatch, b as useSelector, P as Provider } from "./chunk-DYvrnLMg.js";
import { u as useLocation, a as useNavigate, N as NavLink, O as Outlet, R as Routes, b as Route, c as Navigate, B as BrowserRouter } from "./chunk-CzznHu47.js";
import { A as AxiosError, a as axios } from "./chunk-BFW3X9Eb.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
function Spinner({ label = "Loading", fullPage = false }) {
  if (fullPage) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spinner spinner--full", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spinner__panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spinner__ring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spinner__content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spinner__label", children: "Getting the latest information for your organization." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spinner__skeleton-grid", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "skeleton spinner__skeleton-card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "skeleton spinner__skeleton-card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "skeleton spinner__skeleton-card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "skeleton spinner__skeleton-card" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spinner", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spinner__ring" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spinner__label", children: label })
  ] });
}
function toTitleCase(value) {
  return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
function formatOrganizationName(value) {
  if (!value) {
    return "Your organization";
  }
  return toTitleCase(
    value.replace(/^tenant[-_]?/i, "").replace(/^org[-_]?/i, "").trim()
  );
}
function formatRoleName(value) {
  return toTitleCase(value.replace(/([a-z])([A-Z])/g, "$1 $2"));
}
function formatPermissionName(value) {
  return toTitleCase(value.replace(/^Can/, "").replace(/([a-z])([A-Z])/g, "$1 $2"));
}
function toRouteLabel(segment) {
  return toTitleCase(segment);
}
const sharedModules = [
  {
    key: "dashboard",
    group: "Operate",
    label: "Command Center",
    path: "/dashboard",
    description: "Role-aware priorities, cash, stock, and business signals",
    audience: "Executives, managers, and daily operators",
    icon: "dashboard",
    mobilePriority: "primary"
  },
  {
    key: "organization",
    group: "Operate",
    label: "Organization Hub",
    path: "/organization",
    legacyPaths: ["/companies"],
    description: "Company profile, operational readiness, and business updates",
    audience: "Organization admins and leadership",
    icon: "tenant",
    mobilePriority: "secondary",
    sections: [
      { key: "overview", label: "Overview", description: "Company profile and health indicators" },
      { key: "updates", label: "Updates", description: "Announcements, reminders, and follow-up items" },
      { key: "readiness", label: "Readiness", description: "AI and environment readiness for the organization" }
    ]
  },
  {
    key: "sales-operations",
    group: "Operate",
    label: "Sales & Delivery",
    path: "/sales-operations",
    legacyPaths: ["/orders"],
    description: "Customers, orders, projects, and customer service work",
    audience: "Sales, delivery, and service teams",
    icon: "orders",
    mobilePriority: "primary",
    roles: ["Admin", "SalesManager", "ProjectManager", "SupportLead", "AssetManager", "ManufacturingPlanner", "HRManager"],
    sections: [
      { key: "revenue", label: "Revenue", description: "Orders, pipeline, and customer accounts" },
      { key: "delivery", label: "Delivery", description: "Projects, cases, and service commitments" }
    ]
  },
  {
    key: "catalog-operations",
    group: "Operate",
    label: "Supply Chain",
    path: "/supply-chain",
    legacyPaths: ["/products"],
    description: "Catalog, stock, purchasing, assets, and manufacturing work",
    audience: "Catalog, inventory, procurement, and asset teams",
    icon: "products",
    mobilePriority: "primary",
    roles: ["Admin", "CatalogManager", "InventoryManager", "ProcurementManager", "SalesManager", "FinanceManager", "AssetManager", "ManufacturingPlanner"],
    sections: [
      { key: "catalog", label: "Catalog", description: "Products, categories, and suppliers" },
      { key: "inventory", label: "Inventory", description: "Stock control, replenishment, and purchasing" },
      { key: "operations", label: "Operations", description: "Assets, maintenance, and work orders" }
    ]
  },
  {
    key: "finance",
    group: "Operate",
    label: "Finance",
    path: "/finance",
    description: "Receivables, collections, payroll, and cash outlook",
    audience: "Finance, payroll, and leadership teams",
    icon: "finance",
    mobilePriority: "primary",
    permissions: ["CanViewFinance"],
    sections: [
      { key: "receivables", label: "Receivables", description: "Invoices, aging, and payment follow-up" },
      { key: "cash", label: "Cash", description: "Cash outlook and collection risk" },
      { key: "payroll", label: "Payroll", description: "Payroll run-rate and approvals" }
    ]
  },
  {
    key: "analytics",
    group: "Operate",
    label: "Analytics & Exports",
    path: "/analytics",
    legacyPaths: ["/reports"],
    description: "Reporting snapshots, exports, and document intelligence",
    audience: "Leaders, analysts, and finance teams",
    icon: "reports",
    mobilePriority: "secondary",
    permissions: ["CanViewFinance"]
  },
  {
    key: "access-control",
    group: "Govern",
    label: "Access & Audit",
    path: "/access-control",
    legacyPaths: ["/users"],
    description: "Roles, permissions, audit trail, and delivery history",
    audience: "Platform admins and access managers",
    icon: "access",
    mobilePriority: "admin",
    permissions: ["CanManageUsers"]
  },
  {
    key: "platform-ops",
    group: "Govern",
    label: "Platform Operations",
    path: "/platform-operations",
    description: "Service health, delivery backlog, and support diagnostics",
    audience: "Platform admins and support teams",
    icon: "platform",
    mobilePriority: "admin",
    permissions: ["CanManageUsers"]
  },
  {
    key: "configuration",
    group: "Govern",
    label: "Configuration",
    path: "/configuration",
    legacyPaths: ["/settings"],
    description: "Session controls, integrations, and environment setup",
    audience: "Organization admins",
    icon: "settings",
    mobilePriority: "admin"
  }
];
function findSharedModule(pathname) {
  return sharedModules.find(
    (module) => {
      var _a;
      return pathname === module.path || pathname.startsWith(`${module.path}/`) || ((_a = module.legacyPaths) == null ? void 0 : _a.some((legacyPath) => pathname === legacyPath || pathname.startsWith(`${legacyPath}/`)));
    }
  );
}
({
  primaryModules: sharedModules.filter((module) => module.mobilePriority === "primary"),
  secondaryModules: sharedModules.filter((module) => module.mobilePriority === "secondary"),
  adminModules: sharedModules.filter((module) => module.mobilePriority === "admin")
});
const navigationItems = sharedModules.map((module) => ({
  key: module.key,
  group: module.group,
  label: module.label,
  path: module.path,
  description: module.description,
  icon: module.icon,
  roles: module.roles,
  permissions: module.permissions
}));
function findNavigationItem(pathname) {
  const sharedModule = findSharedModule(pathname);
  return sharedModule ? navigationItems.find((item) => item.key === sharedModule.key) : void 0;
}
function buildBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return [{ label: "Home" }];
  }
  const breadcrumbs = [{ label: "Home", path: "/dashboard" }];
  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const navigationItem = findNavigationItem(currentPath);
    const isLast = index === segments.length - 1;
    breadcrumbs.push({
      label: (navigationItem == null ? void 0 : navigationItem.label) || toRouteLabel(segment),
      path: isLast ? void 0 : currentPath
    });
  });
  return breadcrumbs;
}
function trimTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
function isLocalHostname(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}
function getBrowserBaseUrl(port) {
  if (typeof window === "undefined") {
    return `http://localhost:${port}`;
  }
  if (!isLocalHostname(window.location.hostname)) {
    return window.location.origin;
  }
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  const hostname = window.location.hostname || "localhost";
  return `${protocol}//${hostname}:${port}`;
}
const environment = "production";
function resolveServiceUrl(envValue, fallbackUrl) {
  return trimTrailingSlash(fallbackUrl);
}
const apiConfig = {
  appName: "Edgeonix",
  environment,
  enableLogs: false,
  demoModeEnabled: true,
  useMocks: true,
  demoCacheTtlHours: Number("24"),
  requestTimeoutMs: Number(2e4),
  authDeviceId: "edgeonix-erp-ui",
  storageKeys: {
    token: "vj.erp.token",
    refreshToken: "vj.erp.refresh-token",
    expiresAtUtc: "vj.erp.expires-at",
    user: "vj.erp.user",
    demoCache: "vj.erp.demo-cache"
  },
  services: {
    auth: resolveServiceUrl(void 0, getBrowserBaseUrl(8080)),
    platform: resolveServiceUrl(void 0, getBrowserBaseUrl(8081)),
    catalog: resolveServiceUrl(void 0, getBrowserBaseUrl(8081)),
    inventory: resolveServiceUrl(void 0, getBrowserBaseUrl(8082)),
    sales: resolveServiceUrl(void 0, getBrowserBaseUrl(8083)),
    billing: resolveServiceUrl(void 0, getBrowserBaseUrl(8084)),
    payments: resolveServiceUrl(void 0, getBrowserBaseUrl(8085)),
    invoices: resolveServiceUrl(void 0, getBrowserBaseUrl(8086))
  }
};
function writeStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, value);
}
function readStorage(key, fallback = null) {
  if (typeof window === "undefined") {
    return fallback;
  }
  return window.localStorage.getItem(key) ?? fallback;
}
function writeJsonStorage(key, value) {
  writeStorage(key, JSON.stringify(value));
}
function removeStorage(key) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(key);
}
function readJsonStorage(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }
  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }
  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}
function clearPersistedSession() {
  removeStorage(apiConfig.storageKeys.token);
  removeStorage(apiConfig.storageKeys.refreshToken);
  removeStorage(apiConfig.storageKeys.expiresAtUtc);
  removeStorage(apiConfig.storageKeys.user);
}
const token = readStorage(apiConfig.storageKeys.token, null);
const refreshToken = readStorage(apiConfig.storageKeys.refreshToken, null);
const expiresAtUtc = readStorage(apiConfig.storageKeys.expiresAtUtc, null);
const user = readJsonStorage(apiConfig.storageKeys.user, null);
if (expiresAtUtc && new Date(expiresAtUtc).getTime() <= Date.now()) {
  clearPersistedSession();
}
const sessionToken = expiresAtUtc && new Date(expiresAtUtc).getTime() <= Date.now() ? null : token;
const sessionRefreshToken = expiresAtUtc && new Date(expiresAtUtc).getTime() <= Date.now() ? null : refreshToken;
const sessionExpiresAtUtc = expiresAtUtc && new Date(expiresAtUtc).getTime() <= Date.now() ? null : expiresAtUtc;
const sessionUser = expiresAtUtc && new Date(expiresAtUtc).getTime() <= Date.now() ? null : user;
const initialState$1 = {
  token: sessionToken,
  refreshToken: sessionRefreshToken,
  expiresAtUtc: sessionExpiresAtUtc,
  user: sessionUser,
  status: sessionToken && sessionUser ? "authenticated" : "idle"
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState$1,
  reducers: {
    loginStarted(state) {
      state.status = "loading";
    },
    loginFailed(state) {
      state.status = state.token && state.user ? "authenticated" : "idle";
    },
    setSession(state, action) {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAtUtc = action.payload.expiresAtUtc;
      state.user = action.payload.user;
      state.status = "authenticated";
      writeStorage(apiConfig.storageKeys.token, action.payload.accessToken);
      writeStorage(apiConfig.storageKeys.refreshToken, action.payload.refreshToken);
      writeStorage(apiConfig.storageKeys.expiresAtUtc, action.payload.expiresAtUtc);
      writeJsonStorage(apiConfig.storageKeys.user, action.payload.user);
    },
    setCurrentUser(state, action) {
      state.user = action.payload;
      if (action.payload) {
        writeJsonStorage(apiConfig.storageKeys.user, action.payload);
      }
    },
    clearSession(state) {
      state.token = null;
      state.refreshToken = null;
      state.expiresAtUtc = null;
      state.user = null;
      state.status = "idle";
      clearPersistedSession();
    }
  }
});
const { loginStarted, loginFailed, setSession, setCurrentUser, clearSession } = authSlice.actions;
const authReducer = authSlice.reducer;
const initialState = {
  toasts: []
};
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    pushToast(state, action) {
      state.toasts.push({
        id: action.payload.id || crypto.randomUUID(),
        title: action.payload.title,
        message: action.payload.message,
        tone: action.payload.tone
      });
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    }
  }
});
const { pushToast, dismissToast } = uiSlice.actions;
const uiReducer = uiSlice.reducer;
function hasAnyRole(user2, roles) {
  if (!roles || roles.length === 0) {
    return true;
  }
  if (!user2) {
    return false;
  }
  return roles.some((role) => user2.roles.includes(role));
}
function hasAnyPermission(user2, permissions) {
  if (!permissions || permissions.length === 0) {
    return true;
  }
  if (!user2) {
    return false;
  }
  return permissions.some((permission) => user2.permissions.includes(permission));
}
function hasAccess(user2, roles, permissions) {
  return hasAnyRole(user2, roles) && hasAnyPermission(user2, permissions);
}
const ttlMs$1 = apiConfig.demoCacheTtlHours * 60 * 60 * 1e3;
function delay$1() {
  return new Promise((resolve) => window.setTimeout(resolve, 120));
}
function buildSession(user2) {
  const issuedAt = Date.now();
  return {
    accessToken: `demo-token-${user2.userId}-${issuedAt}`,
    refreshToken: `demo-refresh-${user2.userId}-${issuedAt}`,
    tokenType: "Bearer",
    expiresAtUtc: new Date(issuedAt + ttlMs$1).toISOString(),
    user: user2
  };
}
const demoAccounts = [
  {
    label: "Admin",
    userNameOrEmail: "admin@demo.com",
    password: "Password123!",
    description: "Full access across the organization.",
    user: {
      userId: "demo-admin",
      userName: "Demo Admin",
      email: "admin@demo.com",
      tenantId: "tenant-demo",
      roles: ["Admin", "UserAdministrator"],
      permissions: ["CanManageUsers", "CanViewFinance", "CanApprovePurchase", "CanManageInventory", "CanRunPayroll"],
      isDemoUser: true,
      isActive: true
    }
  },
  {
    label: "Manager",
    userNameOrEmail: "manager@demo.com",
    password: "Password123!",
    description: "Best for daily operations and reporting.",
    user: {
      userId: "demo-manager",
      userName: "Demo Manager",
      email: "manager@demo.com",
      tenantId: "tenant-demo",
      roles: ["InventoryManager", "SalesManager", "FinanceManager"],
      permissions: ["CanViewFinance", "CanApprovePurchase", "CanManageInventory"],
      isDemoUser: true,
      isActive: true
    }
  },
  {
    label: "User",
    userNameOrEmail: "user@demo.com",
    password: "Password123!",
    description: "Basic access for product and service work.",
    user: {
      userId: "demo-user",
      userName: "Demo User",
      email: "user@demo.com",
      tenantId: "tenant-demo",
      roles: ["AssetManager", "SupportLead"],
      permissions: ["CanManageInventory"],
      isDemoUser: true,
      isActive: true
    }
  }
];
async function loginWithDemo(payload) {
  await delay$1();
  const account = demoAccounts.find((item) => item.userNameOrEmail.toLowerCase() === payload.userNameOrEmail.trim().toLowerCase() && item.password === payload.password);
  if (!account) {
    throw { message: "Your sign-in details are not correct.", status: 401 };
  }
  return buildSession(account.user);
}
async function getDemoProfile(accessToken) {
  await delay$1();
  const account = demoAccounts.find((item) => accessToken == null ? void 0 : accessToken.includes(item.user.userId));
  if (!account) {
    throw { message: "You are not signed in.", status: 401 };
  }
  return account.user;
}
async function refreshDemoSession(refreshToken2) {
  await delay$1();
  const account = demoAccounts.find((item) => refreshToken2.includes(item.user.userId));
  if (!account) {
    throw { message: "Your session has expired.", status: 401 };
  }
  return buildSession(account.user);
}
async function logoutDemoSession() {
  await delay$1();
}
const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer
  }
});
const ttlMs = apiConfig.demoCacheTtlHours * 60 * 60 * 1e3;
const cacheKey = apiConfig.storageKeys.demoCache;
function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, 120));
}
function nowIso() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function addDays(value) {
  return new Date(Date.now() + value * 24 * 60 * 60 * 1e3).toISOString();
}
function addHours(value) {
  return new Date(Date.now() + value * 60 * 60 * 1e3).toISOString();
}
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function readEnvelope() {
  if (typeof window === "undefined") {
    return null;
  }
  const clearExpiredDemoState = () => {
    window.localStorage.removeItem(cacheKey);
    window.localStorage.removeItem(apiConfig.storageKeys.token);
    window.localStorage.removeItem(apiConfig.storageKeys.refreshToken);
    window.localStorage.removeItem(apiConfig.storageKeys.expiresAtUtc);
    window.localStorage.removeItem(apiConfig.storageKeys.user);
  };
  const raw = window.localStorage.getItem(cacheKey);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (new Date(parsed.expiresAtUtc).getTime() <= Date.now()) {
      clearExpiredDemoState();
      return null;
    }
    return parsed;
  } catch {
    clearExpiredDemoState();
    return null;
  }
}
function writeEnvelope(envelope) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(cacheKey, JSON.stringify(envelope));
}
function buildState() {
  const companies = [
    { id: "company-vjsoft", companyCode: "VJH", name: "VJ Soft Holdings", baseCurrency: "USD", taxRegistrationNumber: "GSTIN-DEMO-001" }
  ];
  const branches = [
    { id: "branch-hq", branchCode: "HQ", companyCode: "VJH", name: "Head Office", city: "Bengaluru", timeZone: "Asia/Calcutta" },
    { id: "branch-wh1", branchCode: "WH1", companyCode: "VJH", name: "West Distribution", city: "Pune", timeZone: "Asia/Calcutta" }
  ];
  const categories = [
    { id: "cat-electronics", name: "Electronics", productCount: 3, activeProductsCount: 3, lowStockProducts: 1 },
    { id: "cat-warehouse", name: "Warehouse", productCount: 1, activeProductsCount: 1, lowStockProducts: 0 },
    { id: "cat-office", name: "Office Operations", productCount: 1, activeProductsCount: 1, lowStockProducts: 0 },
    { id: "cat-service", name: "Field Service", productCount: 1, activeProductsCount: 1, lowStockProducts: 0 }
  ];
  const suppliers = [
    { id: "sup-northwind", name: "Northwind Components", contactName: "Rita Patel", email: "rita.patel@northwind.local", leadTimeDays: 9, productCount: 2, openPurchaseOrders: 0, onTimeDeliveryScore: 96, fulfillmentRiskScore: 12 },
    { id: "sup-alpine", name: "Alpine Office Supply", contactName: "Samir Khan", email: "samir.khan@alpine.local", leadTimeDays: 12, productCount: 1, openPurchaseOrders: 0, onTimeDeliveryScore: 91, fulfillmentRiskScore: 18 },
    { id: "sup-skyline", name: "Skyline Industrial", contactName: "Vera Gomez", email: "vera.gomez@skyline.local", leadTimeDays: 16, productCount: 3, openPurchaseOrders: 1, onTimeDeliveryScore: 88, fulfillmentRiskScore: 22 }
  ];
  const products = [
    { id: "prod-pos-terminal", sku: "SKU-1001", name: "Surface POS Terminal", description: "Counter-top point of sale terminal.", category: "Electronics", supplier: "Northwind Components", price: 1499, cost: 980, stockQuantity: 18, reorderLevel: 10, marginPercent: 34.62, isLowStock: false, isActive: true },
    { id: "prod-scanner", sku: "SKU-1002", name: "Barcode Scanner Pro", description: "Warehouse and checkout scanner.", category: "Electronics", supplier: "Northwind Components", price: 289, cost: 168, stockQuantity: 14, reorderLevel: 10, marginPercent: 41.87, isLowStock: false, isActive: true },
    { id: "prod-printer", sku: "SKU-1003", name: "Thermal Label Printer", description: "Shipping label printer.", category: "Warehouse", supplier: "Skyline Industrial", price: 449, cost: 262, stockQuantity: 8, reorderLevel: 6, marginPercent: 41.65, isLowStock: false, isActive: true },
    { id: "prod-chair", sku: "SKU-1004", name: "Ergonomic Chair", description: "Back-office seating.", category: "Office Operations", supplier: "Alpine Office Supply", price: 329, cost: 205, stockQuantity: 26, reorderLevel: 8, marginPercent: 37.69, isLowStock: false, isActive: true },
    { id: "prod-tablet", sku: "SKU-1005", name: "Ledger Tablet", description: "Field-service and approval tablet.", category: "Field Service", supplier: "Skyline Industrial", price: 799, cost: 540, stockQuantity: 11, reorderLevel: 7, marginPercent: 32.42, isLowStock: false, isActive: true },
    { id: "prod-kiosk", sku: "SKU-1006", name: "Guest Check-In Kiosk", description: "Interactive self-service kiosk.", category: "Field Service", supplier: "Skyline Industrial", price: 2199, cost: 1450, stockQuantity: 5, reorderLevel: 5, marginPercent: 34.06, isLowStock: true, isActive: true }
  ];
  const inventoryItems = products.map((product) => ({
    productId: product.id,
    sku: product.sku,
    productName: product.name,
    supplier: product.supplier,
    stockQuantity: product.stockQuantity,
    reorderLevel: product.reorderLevel,
    availableCoverDays: Math.max(3, Math.round(product.stockQuantity / 2)),
    inventoryValue: Number((product.stockQuantity * product.cost).toFixed(2)),
    isLowStock: product.isLowStock
  }));
  const purchaseOrders = [
    { id: "po-1", purchaseOrderNumber: "PO-20260331-1", supplierId: "sup-northwind", supplierName: "Northwind Components", createdAt: addDays(-20), expectedDeliveryDate: addDays(-10), receivedAt: addDays(-12), status: "Received", lines: [{ productId: "prod-scanner", productName: "Barcode Scanner Pro", quantity: 16, unitCost: 168, lineTotal: 2688 }], totalCost: 2688, notes: "Historical replenishment" },
    { id: "po-2", purchaseOrderNumber: "PO-20260331-2", supplierId: "sup-skyline", supplierName: "Skyline Industrial", createdAt: addDays(-6), expectedDeliveryDate: addDays(8), receivedAt: null, status: "Open", lines: [{ productId: "prod-printer", productName: "Thermal Label Printer", quantity: 5, unitCost: 262, lineTotal: 1310 }, { productId: "prod-tablet", productName: "Ledger Tablet", quantity: 5, unitCost: 540, lineTotal: 2700 }], totalCost: 4010, notes: "Inbound warehouse replenishment" }
  ];
  const reorderRecommendations = [
    { productId: "prod-kiosk", productName: "Guest Check-In Kiosk", currentStock: 5, reorderLevel: 5, forecastedLeadTimeDemand: 8, recommendedOrderQuantity: 6, urgency: "High" },
    { productId: "prod-printer", productName: "Thermal Label Printer", currentStock: 8, reorderLevel: 6, forecastedLeadTimeDemand: 11, recommendedOrderQuantity: 4, urgency: "Medium" }
  ];
  const demandForecast = products.slice(0, 5).map((product, index) => ({
    productId: product.id,
    productName: product.name,
    horizonDays: 14,
    forecastUnits: 8 + index * 2,
    trendDirection: index % 2 === 0 ? "Up" : "Stable",
    confidencePercent: 78 + index * 2
  }));
  const assets = [
    { id: "asset-1", assetTag: "AST-4101", name: "Packaging Conveyor A", category: "Manufacturing", status: "Operational", lastServicedAt: addDays(-52), nextServiceDueAt: addDays(8), criticality: 9, conditionScore: 72, maintenanceRiskScore: 88 },
    { id: "asset-2", assetTag: "AST-4102", name: "Forklift Unit 7", category: "Logistics", status: "Operational", lastServicedAt: addDays(-31), nextServiceDueAt: addDays(22), criticality: 7, conditionScore: 81, maintenanceRiskScore: 63 }
  ];
  const maintenanceForecast = assets.map((asset) => ({ assetId: asset.id, assetTag: asset.assetTag, assetName: asset.name, nextServiceDueAt: asset.nextServiceDueAt, maintenanceRiskScore: asset.maintenanceRiskScore, recommendedAction: asset.maintenanceRiskScore >= 80 ? "Prioritize this week." : "Monitor in next cycle." }));
  const warehouses = [
    { id: "warehouse-main", warehouseCode: "MAIN", name: "Main Warehouse", branchCode: "HQ", type: "Distribution", isPrimary: true, stock: inventoryItems.map((item, index) => ({ productId: item.productId, productName: item.productName, quantityOnHand: Math.max(0, item.stockQuantity - 2), quantityReserved: 1, defaultBin: `A-${index + 1}`, batchNumber: `BATCH-${item.sku}`, serialNumber: item.stockQuantity > 10 ? `SER-${item.sku}` : null })) },
    { id: "warehouse-field", warehouseCode: "FIELD", name: "Field Service Hub", branchCode: "WH1", type: "Service", isPrimary: false, stock: inventoryItems.map((item, index) => ({ productId: item.productId, productName: item.productName, quantityOnHand: Math.min(3, item.stockQuantity), quantityReserved: 0, defaultBin: `FS-${index + 1}`, batchNumber: null, serialNumber: null })) }
  ];
  const transfers = [{ id: "transfer-1", transferNumber: "TRF-20260331-1", fromWarehouseCode: "MAIN", toWarehouseCode: "FIELD", productId: "prod-tablet", productName: "Ledger Tablet", quantity: 2, status: "Completed", requestedAt: addDays(-6), completedAt: addDays(-5), reason: "Field buffer stock" }];
  const shipments = [{ id: "shipment-1", shipmentNumber: "SHP-20260331-1", direction: "Outbound", status: "In Transit", carrier: "BlueDart", trackingNumber: "TRK-ERP-1001", originWarehouseCode: "MAIN", destinationName: "Acme Retail", salesOrderId: "order-1", purchaseOrderId: null, scheduledShipDate: nowIso(), deliveredAt: null }];
  const fixedAssets = [
    { id: "fa-1", assetNumber: "FA-1001", name: "Packaging Conveyor A", assetClass: "Manufacturing", status: "Capitalized", companyCode: "VJH", branchCode: "HQ", capitalizedOn: addDays(-540), acquisitionCost: 5e4, salvageValue: 2500, residualValue: 32e3, accumulatedDepreciation: 18e3, depreciationMethod: "SLM", usefulLifeMonths: 60, depreciationRate: 20, revaluationAmount: 0, ownerDepartment: "Operations", currentLocation: "Assembly Line 1", lastDepreciatedOn: addDays(-35), operationalAssetId: "asset-1" },
    { id: "fa-2", assetNumber: "FA-1002", name: "Forklift Unit 7", assetClass: "Logistics", status: "Capitalized", companyCode: "VJH", branchCode: "WH1", capitalizedOn: addDays(-420), acquisitionCost: 62e3, salvageValue: 3e3, residualValue: 4e4, accumulatedDepreciation: 22e3, depreciationMethod: "WDV", usefulLifeMonths: 72, depreciationRate: 18, revaluationAmount: 0, ownerDepartment: "Warehouse", currentLocation: "West Yard", lastDepreciatedOn: addDays(-35), operationalAssetId: "asset-2" }
  ];
  const fixedAssetCompliance = {
    totalAssets: fixedAssets.length,
    grossBookValue: fixedAssets.reduce((sum, item) => sum + item.acquisitionCost, 0),
    netBookValue: fixedAssets.reduce((sum, item) => sum + item.residualValue, 0),
    accumulatedDepreciation: fixedAssets.reduce((sum, item) => sum + item.accumulatedDepreciation, 0),
    assetsPendingDepreciation: 0,
    complianceWarnings: []
  };
  const workOrders = [{ id: "wo-1", workOrderNumber: "WO-20260331-1", productName: "Thermal Label Printer", workCenter: "Assembly-2", status: "Scheduled", scheduledStart: addDays(1), expectedCompletion: addDays(2), quantity: 16, producedQuantity: 0 }, { id: "wo-2", workOrderNumber: "WO-20260331-2", productName: "Barcode Scanner Pro", workCenter: "Calibration-1", status: "In Progress", scheduledStart: addDays(-1), expectedCompletion: nowIso(), quantity: 24, producedQuantity: 11 }];
  const anomalies = [{ domain: "Inventory", severity: "High", title: "Low stock risk for kiosks", narrative: "Guest Check-In Kiosk is at its reorder threshold.", score: 91, referenceType: "Product", referenceId: "prod-kiosk" }, { domain: "Payments", severity: "Medium", title: "Overdue balance emerging", narrative: "One receivable is partially paid and nearing escalation.", score: 76, referenceType: "Invoice", referenceId: "invoice-2" }, { domain: "Maintenance", severity: "Medium", title: "Preventive maintenance due", narrative: "Packaging Conveyor A should be serviced in the next week.", score: 71, referenceType: "Asset", referenceId: "asset-1" }];
  const customers = [{ id: "cust-acme", name: "Acme Retail", email: "buyers@acmeretail.local", contactNumber: "+1-555-0101", segment: "Enterprise", createdAt: addDays(-90), lifetimeValue: 3537.64, outstandingBalance: 0 }, { id: "cust-beta", name: "Beta Foods", email: "ops@betafoods.local", contactNumber: "+1-555-0102", segment: "Mid-Market", createdAt: addDays(-80), lifetimeValue: 1752.3, outstandingBalance: 1352.3 }, { id: "cust-cedar", name: "Cedar Logistics", email: "finance@cedarlogistics.local", contactNumber: "+1-555-0103", segment: "Enterprise", createdAt: addDays(-70), lifetimeValue: 2002.46, outstandingBalance: 2002.46 }];
  const orders = [{ id: "order-1", orderNumber: "SO-20260301-1", customerId: "cust-acme", customerName: "Acme Retail", orderDate: addDays(-25), status: "Completed", lines: [{ productId: "prod-pos-terminal", productName: "Surface POS Terminal", quantity: 2, unitPrice: 1499, lineTotal: 2998 }], subtotal: 2998, taxAmount: 539.64, totalAmount: 3537.64, invoiceId: "invoice-1" }, { id: "order-2", orderNumber: "SO-20260310-2", customerId: "cust-beta", customerName: "Beta Foods", orderDate: addDays(-16), status: "Processing", lines: [{ productId: "prod-scanner", productName: "Barcode Scanner Pro", quantity: 4, unitPrice: 289, lineTotal: 1156 }, { productId: "prod-chair", productName: "Ergonomic Chair", quantity: 1, unitPrice: 329, lineTotal: 329 }], subtotal: 1485, taxAmount: 267.3, totalAmount: 1752.3, invoiceId: "invoice-2" }, { id: "order-3", orderNumber: "SO-20260318-3", customerId: "cust-cedar", customerName: "Cedar Logistics", orderDate: addDays(-8), status: "Pending", lines: [{ productId: "prod-printer", productName: "Thermal Label Printer", quantity: 2, unitPrice: 449, lineTotal: 898 }, { productId: "prod-tablet", productName: "Ledger Tablet", quantity: 1, unitPrice: 799, lineTotal: 799 }], subtotal: 1697, taxAmount: 305.46, totalAmount: 2002.46, invoiceId: "invoice-3" }];
  const orderMetrics = { openOrders: 2, completedOrders: 1, revenueLast30Days: 7292.4, averageOrderValue: 2430.8, lowStockBlockers: 1 };
  const projects = [{ id: "project-1", projectCode: "PRJ-2026-1", name: "Retail Modernization Program", customerName: "Acme Retail", projectManager: "Noah Chen", status: "Active", budget: 185e3, recognizedRevenue: 112e3, percentComplete: 62, startDate: addDays(-75), dueDate: addDays(45) }, { id: "project-2", projectCode: "PRJ-2026-2", name: "Warehouse Mobility Rollout", customerName: "Cedar Logistics", projectManager: "Iris Walker", status: "Planning", budget: 98e3, recognizedRevenue: 24e3, percentComplete: 28, startDate: addDays(-21), dueDate: addDays(70) }];
  const tickets = [{ id: "ticket-1", ticketNumber: "TKT-20260331-1", customerName: "Acme Retail", subject: "POS sync intermittent failures", priority: "High", status: "In Progress", openedAt: addHours(-18), dueAt: addHours(6), assignedTeam: "Field Service" }, { id: "ticket-2", ticketNumber: "TKT-20260331-2", customerName: "Beta Foods", subject: "Printer calibration request", priority: "Medium", status: "New", openedAt: addHours(-4), dueAt: addHours(20), assignedTeam: "Support Desk" }];
  const fieldServiceJobs = [{ id: "job-1", jobNumber: "FS-20260331-1", serviceTicketId: "ticket-1", customerName: "Acme Retail", technicianName: "Lena Ortiz", status: "Scheduled", scheduledStart: addHours(4), scheduledEnd: addHours(8), offlineSyncEnabled: true, latitude: 12.9716, longitude: 77.5946, serviceReport: "" }];
  const productLifecycles = [{ id: "plm-1", productId: "prod-pos-terminal", productName: "Surface POS Terminal", version: "v2.1", lifecycleStage: "Released", releasedAt: addDays(-120), billOfMaterials: [{ componentProductId: "prod-scanner", componentName: "Barcode Scanner Pro", quantity: 1, unitOfMeasure: "EA" }, { componentProductId: "prod-printer", componentName: "Thermal Label Printer", quantity: 1, unitOfMeasure: "EA" }] }];
  const productChanges = [{ id: "change-1", changeNumber: "ECO-20260331-1", productLifecycleId: "plm-1", productName: "Surface POS Terminal", title: "Improve thermal resistance", status: "Approved", requestedBy: "Quality Engineering", requestedAt: addDays(-60), approvedAt: addDays(-56), impactSummary: "Updated enclosure material and validation checklist." }];
  const accessSummary = { tenantId: "tenant-demo", roles: demoAccounts[0].user.roles, permissions: demoAccounts[0].user.permissions, companies, branches };
  const billingDashboard = { totalInvoiced: 7292.4, collectedAmount: 3937.64, outstandingBalance: 3354.76, overdueBalance: 1352.3, overdueInvoices: 1, collectionEfficiencyPercent: 53.99 };
  const executiveDashboard = { inventoryValue: 42897, lowStockProducts: 1, openOrders: 2, revenueLast30Days: 7292.4, outstandingBalance: 3354.76, overdueInvoices: 1, highRiskCollections: 1, collectionEfficiencyPercent: 87, atRiskRevenue: 10995 };
  const financeDashboard = { cashCollectedLast30Days: 3937.64, outstandingReceivables: 3354.76, overdueReceivables: 1352.3, monthlyPayrollRunRate: 28e3, assetMaintenanceReserve: 14500, workingCapitalIndicator: 1.24, narrative: "Cash collections are healthy, but one partially paid invoice needs follow-up." };
  const payrollSummary = { activeEmployees: 12, monthlyGrossPayroll: 28e3, averageMonthlySalary: 2333.33, nextPayrollDate: addDays(3), pendingPayrollApprovals: 2, status: "Ready for review" };
  const requisitions = [{ id: "req-1", requisitionNumber: "PR-20260331-1", department: "Operations", requestedBy: "Marcus Reed", status: "Approved", requestedAt: addDays(-7), justification: "Restore safety stock for high-velocity scanners.", lines: [{ productId: "prod-scanner", productName: "Barcode Scanner Pro", quantity: 12, estimatedUnitCost: 168, estimatedLineTotal: 2016 }], estimatedTotal: 2016 }];
  const rfqs = [{ id: "rfq-1", rfqNumber: "RFQ-20260331-1", requisitionId: "req-1", title: "Scanner replenishment", status: "Awarded", issuedAt: addDays(-6), responseDueAt: addDays(-3), supplierQuotes: [{ supplierId: "sup-northwind", supplierName: "Northwind Components", quotedAmount: 1600, leadTimeDays: 9, score: 92, isAwarded: true }, { supplierId: "sup-skyline", supplierName: "Skyline Industrial", quotedAmount: 1740, leadTimeDays: 16, score: 84, isAwarded: false }] }];
  const vendorComparisons = { "rfq-1": { rfqId: "rfq-1", rfqNumber: "RFQ-20260331-1", recommendedSupplierName: "Northwind Components", recommendedQuote: 1600, recommendedLeadTimeDays: 9, options: rfqs[0].supplierQuotes } };
  const threeWayMatches = [{ purchaseOrderId: "po-1", purchaseOrderNumber: "PO-20260331-1", supplierName: "Northwind Components", purchaseOrderTotal: 2688, receivedValue: 2688, invoiceValue: 2688, matchStatus: "Matched", variance: 0 }];
  const integrationOverview = { activeConnections: 2, activeWebhooks: 1, failedSyncs: 0, supportedConnectors: ["Payment gateways", "Banking systems", "External CRMs", "E-commerce platforms"] };
  const integrations = [{ id: "int-1", name: "Primary Payment Gateway", type: "PaymentGateway", provider: "Stripe", status: "Healthy", endpointUrl: "https://payments.example.local/stripe", lastSyncAt: addHours(-2), lastSyncResult: "Success", retryCount: 0 }, { id: "int-2", name: "Core Banking Host", type: "Banking", provider: "HSBC Host Link", status: "Healthy", endpointUrl: "https://banking.example.local/host", lastSyncAt: addHours(-4), lastSyncResult: "Success", retryCount: 0 }];
  const webhooks = [{ id: "webhook-1", name: "CRM Order Sync", topic: "sales", targetUrl: "https://crm.example.local/webhooks/orders", secretReference: "kv://erp/crm-order-sync", isActive: true, createdAt: addDays(-10), lastDeliveredAt: addHours(-1), lastDeliveryStatus: "Delivered" }];
  const reportingSnapshot = { revenueLast30Days: 7292.4, collectionsLast30Days: 3937.64, inventoryValue: 42897, outstandingBalance: 3354.76, openProjects: 2, openTickets: 2, openWorkOrders: 2, monthlyPayrollRunRate: 28e3, predictedMaintenanceExposure: 14500 };
  const payments = [{ id: "payment-1", invoiceId: "invoice-1", invoiceNumber: "INV-20260301-1", customerId: "cust-acme", customerName: "Acme Retail", paymentDate: addDays(-20), amount: 3537.64, paymentMethod: "Card", reference: "CARD-1001", isRefund: false }, { id: "payment-2", invoiceId: "invoice-2", invoiceNumber: "INV-20260310-2", customerId: "cust-beta", customerName: "Beta Foods", paymentDate: addDays(-4), amount: 400, paymentMethod: "Bank Transfer", reference: "WIRE-2241", isRefund: false }];
  const collectionRisk = { items: [{ invoiceId: "invoice-2", invoiceNumber: "INV-20260310-2", customerName: "Beta Foods", balance: 1352.3, daysOverdue: 2, riskScore: 72, riskBand: "High" }, { invoiceId: "invoice-3", invoiceNumber: "INV-20260318-3", customerName: "Cedar Logistics", balance: 2002.46, daysOverdue: 0, riskScore: 58, riskBand: "Medium" }], totalExposure: 3354.76 };
  const invoices = [{ id: "invoice-1", invoiceNumber: "INV-20260301-1", salesOrderId: "order-1", orderNumber: "SO-20260301-1", customerId: "cust-acme", customerName: "Acme Retail", invoiceDate: addDays(-25), dueDate: addDays(-11), totalAmount: 3537.64, paidAmount: 3537.64, balance: 0, status: "Paid", paymentMethod: "Card", daysOverdue: 0 }, { id: "invoice-2", invoiceNumber: "INV-20260310-2", salesOrderId: "order-2", orderNumber: "SO-20260310-2", customerId: "cust-beta", customerName: "Beta Foods", invoiceDate: addDays(-16), dueDate: addDays(-2), totalAmount: 1752.3, paidAmount: 400, balance: 1352.3, status: "Partially Paid", paymentMethod: "Bank Transfer", daysOverdue: 2 }, { id: "invoice-3", invoiceNumber: "INV-20260318-3", salesOrderId: "order-3", orderNumber: "SO-20260318-3", customerId: "cust-cedar", customerName: "Cedar Logistics", invoiceDate: addDays(-8), dueDate: addDays(6), totalAmount: 2002.46, paidAmount: 0, balance: 2002.46, status: "Unpaid", paymentMethod: "Bank Transfer", daysOverdue: 0 }];
  const invoiceAging = { buckets: [{ label: "Current", amount: 2002.46 }, { label: "1-30 days", amount: 1352.3 }, { label: "31-60 days", amount: 0 }, { label: "60+ days", amount: 0 }], overdueInvoices: 1, totalOverdue: 1352.3 };
  const notifications = [{ id: "note-1", createdAt: addHours(-3), type: "Collections", title: "Overdue exposure rising", message: "Beta Foods has invoices nearing escalation thresholds.", severity: "High", isRead: false, referenceType: "Invoice", referenceId: "invoice-2" }, { id: "note-2", createdAt: addHours(-2), type: "Procurement", title: "Critical replenishment open", message: "Open scanner replenishment requires sourcing review.", severity: "Medium", isRead: false, referenceType: "PurchaseOrder", referenceId: "po-2" }, { id: "note-3", createdAt: addHours(-1), type: "Projects", title: "Warehouse rollout at risk", message: "The warehouse mobility rollout needs a milestone review.", severity: "Warning", isRead: false, referenceType: "Project", referenceId: "project-2" }];
  const auditTrail = [{ id: "audit-1", occurredAt: addHours(-5), tenantId: "tenant-demo", userId: "demo-admin", userName: "Demo Admin", action: "WorkspaceSeeded", entityType: "TenantWorkspace", entityId: null, outcome: "Succeeded", details: "Initialized demo workspace.", correlationId: "corr-demo-1" }];
  const outbox = [{ id: "outbox-1", occurredAt: addHours(-4), topic: "sales", eventType: "SalesOrderCreated", aggregateType: "SalesOrder", aggregateId: "order-3", status: "Dispatched", attemptCount: 1, payload: '{"orderNumber":"SO-20260318-3"}' }];
  const aiReadiness = { provider: "Edgeonix Demo AI", aiEnabled: true, useBackgroundPredictions: true, structuredBusinessEventsEnabled: true, useCases: [{ name: "Collections prioritization", enabled: true, dataSource: "Payments", integrationPattern: "Background predictions" }, { name: "Demand forecasting", enabled: true, dataSource: "Inventory", integrationPattern: "Scheduled forecast" }, { name: "Service anomaly review", enabled: false, dataSource: "Field service", integrationPattern: "Advisory only" }] };
  const industryProfiles = [{ industryCode: "manufacturing", name: "Manufacturing", description: "Controls production planning and BOM governance.", enabledModules: ["Inventory", "Supply Chain", "Procurement", "PLM", "Maintenance", "Finance"], workflowTemplates: ["manufacturing-eco", "manufacturing-wo"], reportingFocus: ["Yield variance", "Work center utilization"], isActive: true }, { industryCode: "automotive", name: "Automotive", description: "Coordinates serialized inventory and supplier readiness.", enabledModules: ["Inventory", "Supply Chain", "Procurement", "PLM", "Field Service", "Finance"], workflowTemplates: ["automotive-supplier-readiness"], reportingFocus: ["Supplier PPM", "Serialized traceability"], isActive: false }, { industryCode: "chemical", name: "Chemical", description: "Adds batch traceability and safety review workflows.", enabledModules: ["Inventory", "Supply Chain", "Procurement", "Maintenance", "Finance"], workflowTemplates: ["chemical-batch-release"], reportingFocus: ["Batch yield"], isActive: false }, { industryCode: "pharma-medical", name: "Pharma & Medical", description: "Supports controlled inventory and compliance reporting.", enabledModules: ["Inventory", "Supply Chain", "Procurement", "Field Service", "Maintenance", "Finance"], workflowTemplates: ["pharma-capa"], reportingFocus: ["Cold-chain compliance"], isActive: false }, { industryCode: "furniture", name: "Furniture", description: "Optimizes make-to-order planning.", enabledModules: ["Sales", "Inventory", "Supply Chain", "PLM", "Manufacturing", "Finance"], workflowTemplates: ["furniture-custom-order"], reportingFocus: ["Backlog"], isActive: false }, { industryCode: "packaging", name: "Packaging", description: "Supports high-throughput replenishment and maintenance tracking.", enabledModules: ["Inventory", "Supply Chain", "Manufacturing", "Maintenance", "Field Service", "Finance"], workflowTemplates: ["packaging-line-maintenance"], reportingFocus: ["Shipment OTIF"], isActive: false }];
  const workflowTemplates = [{ id: "wf-1", templateCode: "manufacturing-eco", name: "Manufacturing engineering change", industryCode: "manufacturing", department: "Engineering", slaHours: 48, isDefault: true, stages: ["Submitted", "Impact Review", "Cost Review", "Approved", "Implemented"], triggers: ["PLM change request"] }, { id: "wf-2", templateCode: "manufacturing-wo", name: "Production work order release", industryCode: "manufacturing", department: "Production", slaHours: 24, isDefault: true, stages: ["Planned", "Material Check", "Released", "In Progress", "Closed"], triggers: ["Demand plan"] }, { id: "wf-3", templateCode: "packaging-line-maintenance", name: "Packaging line maintenance escalation", industryCode: "packaging", department: "Maintenance", slaHours: 8, isDefault: true, stages: ["Alerted", "Diagnosed", "Resolved"], triggers: ["Predictive alert"] }];
  const organizationOverview = { tenantId: "tenant-demo", activeProducts: products.length, lowStockProducts: 1, openOrders: 2, overdueInvoices: 1, openProjects: 2, openTickets: 2, openWorkOrders: 2, inventoryValue: 42897, outstandingBalance: 3354.76, unreadNotifications: notifications.filter((item) => !item.isRead).length };
  const operationsSummary = { tenantId: "tenant-demo", correlationId: "corr-demo-ops", pendingOutboxMessages: 1, deadLetteredOutboxMessages: 0, unreadNotifications: notifications.filter((item) => !item.isRead).length, recentAuditEntries: auditTrail.length, usesDurableDatabase: false };
  const serviceHealth = ["auth", "platform", "catalog", "inventory", "sales", "billing", "payments", "invoices"].map((id) => ({ id, service: id[0].toUpperCase() + id.slice(1), area: "Demo service", status: "online", statusLabel: "Healthy", baseUrl: `demo://${id}`, checkedAt: nowIso(), detail: "Demo mode virtual service is ready.", tenants: 1 }));
  return { companies, branches, categories, suppliers, products, inventoryItems, purchaseOrders, reorderRecommendations, demandForecast, assets, maintenanceForecast, warehouses, transfers, shipments, fixedAssets, fixedAssetCompliance, workOrders, anomalies, customers, orders, orderMetrics, projects, tickets, fieldServiceJobs, productLifecycles, productChanges, accessSummary, billingDashboard, executiveDashboard, financeDashboard, payrollSummary, requisitions, rfqs, vendorComparisons, threeWayMatches, integrationOverview, integrations, webhooks, reportingSnapshot, payments, collectionRisk, invoices, invoiceAging, notifications, auditTrail, outbox, aiReadiness, industryProfiles, workflowTemplates, organizationOverview, operationsSummary, serviceHealth };
}
function getEnvelope() {
  const existing = readEnvelope();
  if (existing) return existing;
  const envelope = { expiresAtUtc: new Date(Date.now() + ttlMs).toISOString(), state: buildState() };
  writeEnvelope(envelope);
  return envelope;
}
function saveState(state) {
  const envelope = {
    expiresAtUtc: new Date(Date.now() + ttlMs).toISOString(),
    state
  };
  writeEnvelope(envelope);
  return envelope;
}
function updateState(mutator) {
  const envelope = getEnvelope();
  const state = clone(envelope.state);
  const result = mutator(state);
  saveState(state);
  return clone(result);
}
function normalizePath(path) {
  return path.replace(/\/+$/, "") || "/";
}
function readParam(config, key) {
  const params = config == null ? void 0 : config.params;
  return params == null ? void 0 : params[key];
}
function asString(value) {
  return typeof value === "string" ? value : null;
}
function asNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}
function nextId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
function createCatalogOverview(state) {
  const activeProducts = state.products.filter((item) => item.isActive);
  const inventoryValue = activeProducts.reduce((sum, item) => sum + item.stockQuantity * item.cost, 0);
  const averageGrossMarginPercent = activeProducts.length ? activeProducts.reduce((sum, item) => sum + item.marginPercent, 0) / activeProducts.length : 0;
  return {
    activeProducts: activeProducts.length,
    categories: state.categories.length,
    suppliers: state.suppliers.length,
    lowStockProducts: activeProducts.filter((item) => item.isLowStock).length,
    averageGrossMarginPercent: Number(averageGrossMarginPercent.toFixed(2)),
    inventoryValue: Number(inventoryValue.toFixed(2))
  };
}
function createCatalogReferenceData(state) {
  return {
    categories: state.categories.map((item) => ({ id: item.id, name: item.name })),
    suppliers: state.suppliers.map((item) => ({
      id: item.id,
      name: item.name,
      contactName: item.contactName,
      email: item.email,
      leadTimeDays: item.leadTimeDays
    }))
  };
}
function createInventoryDashboard(state) {
  return {
    totalProducts: state.products.length,
    totalUnitsOnHand: state.inventoryItems.reduce((sum, item) => sum + item.stockQuantity, 0),
    lowStockProducts: state.inventoryItems.filter((item) => item.isLowStock).length,
    inventoryValue: Number(state.inventoryItems.reduce((sum, item) => sum + item.inventoryValue, 0).toFixed(2)),
    atRiskRevenue: Number(
      state.products.filter((item) => item.isLowStock).reduce((sum, item) => sum + item.price * item.reorderLevel, 0).toFixed(2)
    )
  };
}
function createProcurementDashboard(state) {
  const openPurchaseOrders = state.purchaseOrders.filter((item) => item.status !== "Received");
  return {
    openPurchaseOrders: openPurchaseOrders.length,
    pendingReceipts: openPurchaseOrders.length,
    committedSpend: Number(openPurchaseOrders.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)),
    inboundStockValue: Number(openPurchaseOrders.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)),
    urgentReorders: state.reorderRecommendations.filter((item) => item.urgency === "High").length,
    averageSupplierLeadTimeDays: Number((state.suppliers.reduce((sum, item) => sum + item.leadTimeDays, 0) / state.suppliers.length).toFixed(1))
  };
}
function createBillingAlerts(state, maxAlerts) {
  return [
    {
      severity: "High",
      area: "Collections",
      message: "One partially paid invoice is overdue and needs follow-up.",
      referenceType: "Invoice",
      referenceId: "invoice-2"
    },
    {
      severity: "Medium",
      area: "Inventory",
      message: "Guest Check-In Kiosk inventory is at the reorder threshold.",
      referenceType: "Product",
      referenceId: "prod-kiosk"
    },
    {
      severity: "Info",
      area: "Integration",
      message: "All configured demo integrations completed their latest sync.",
      referenceType: "Integration",
      referenceId: "int-1"
    }
  ].slice(0, maxAlerts);
}
function createCashForecast(state, horizonDays) {
  return {
    horizonDays,
    openReceivables: Number(state.invoices.reduce((sum, item) => sum + item.balance, 0).toFixed(2)),
    expectedCollections: Number((state.invoices.reduce((sum, item) => sum + item.balance, 0) * 0.78).toFixed(2)),
    overdueExposure: Number(state.invoices.filter((item) => item.daysOverdue > 0).reduce((sum, item) => sum + item.balance, 0).toFixed(2)),
    highRiskInvoices: state.collectionRisk.items.filter((item) => item.riskScore >= 70).length,
    confidencePercent: 82,
    narrative: "Collections remain healthy in demo mode, with one overdue invoice needing timely follow-up."
  };
}
function createCustomerIntelligence(state, customerId) {
  var _a;
  const customer = state.customers.find((item) => item.id === customerId);
  const orders = state.orders.filter((item) => item.customerId === customerId);
  const totalValue = orders.reduce((sum, item) => sum + item.totalAmount, 0);
  return {
    customerId,
    customerName: (customer == null ? void 0 : customer.name) ?? "Unknown customer",
    lifetimeValue: (customer == null ? void 0 : customer.lifetimeValue) ?? totalValue,
    averageOrderValue: orders.length ? Number((totalValue / orders.length).toFixed(2)) : 0,
    lastOrderDate: ((_a = orders[0]) == null ? void 0 : _a.orderDate) ?? null,
    ordersCount: orders.length,
    churnRiskScore: (customer == null ? void 0 : customer.outstandingBalance) ? 46 : 18,
    expansionScore: (customer == null ? void 0 : customer.segment) === "Enterprise" ? 88 : 68,
    outstandingBalance: (customer == null ? void 0 : customer.outstandingBalance) ?? 0,
    nextBestAction: (customer == null ? void 0 : customer.outstandingBalance) ? "Review receivable exposure and schedule follow-up." : "Offer upsell bundle for active product lines."
  };
}
function createPlatformContext() {
  return {
    tenantId: "tenant-demo",
    userId: demoAccounts[0].user.userId,
    userName: demoAccounts[0].user.userName,
    roles: demoAccounts[0].user.roles,
    correlationId: `corr-${Date.now()}`
  };
}
function createDemoStatus() {
  return {
    isEnabled: true,
    isDemoTenant: true,
    isDemoUser: true,
    canReset: true,
    demoTenantId: "tenant-demo",
    currentTenantId: "tenant-demo"
  };
}
async function getDemoServiceHealth() {
  await delay();
  return clone(getEnvelope().state.serviceHealth);
}
async function resetDemoData() {
  await delay();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(cacheKey);
  }
}
function filterByStatus(items, status) {
  if (!status) {
    return items;
  }
  return items.filter((item) => item.status.toLowerCase() === status.toLowerCase());
}
function notFound(path) {
  throw {
    message: `Demo route not configured for ${path}.`,
    status: 404,
    code: "DEMO_ROUTE_NOT_FOUND"
  };
}
async function handleDemoRequest(service, method, path = "", payload, config) {
  var _a;
  await delay();
  const normalizedMethod = method.toUpperCase();
  const normalizedPath = normalizePath(path);
  if (service === "platform" && normalizedMethod === "GET" && normalizedPath === "/api/demo/status") {
    return clone(createDemoStatus());
  }
  if (service === "platform" && normalizedMethod === "POST" && normalizedPath === "/api/demo/reset") {
    await resetDemoData();
    return void 0;
  }
  const state = getEnvelope().state;
  if (service === "catalog") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/catalog/overview") return clone(createCatalogOverview(state));
    if (normalizedMethod === "GET" && normalizedPath === "/api/catalog/reference-data") return clone(createCatalogReferenceData(state));
    if (normalizedMethod === "GET" && normalizedPath === "/api/categories") return clone(state.categories);
    if (normalizedMethod === "GET" && normalizedPath === "/api/suppliers") return clone(state.suppliers);
    if (normalizedMethod === "GET" && normalizedPath === "/api/products") {
      const search = (_a = asString(readParam(config, "search"))) == null ? void 0 : _a.toLowerCase();
      const includeInactive = asBoolean(readParam(config, "includeInactive"));
      return clone(
        state.products.filter((item) => (includeInactive || item.isActive) && (!search || `${item.name} ${item.sku}`.toLowerCase().includes(search)))
      );
    }
    if (normalizedMethod === "GET" && normalizedPath.startsWith("/api/products/")) {
      const id = normalizedPath.split("/").pop();
      const product = state.products.find((item) => item.id === id);
      if (!product) notFound(normalizedPath);
      return clone(product);
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/categories") {
      return updateState((draft) => {
        const name = asString(payload == null ? void 0 : payload.name) ?? "New Category";
        const category = {
          id: nextId("cat"),
          name,
          productCount: 0,
          activeProductsCount: 0,
          lowStockProducts: 0
        };
        draft.categories.unshift(category);
        return category;
      });
    }
    if (normalizedMethod === "PUT" && normalizedPath.startsWith("/api/categories/")) {
      const categoryId = normalizedPath.split("/")[3];
      return updateState((draft) => {
        const category = draft.categories.find((item) => item.id === categoryId);
        if (!category) notFound(normalizedPath);
        category.name = asString(payload == null ? void 0 : payload.name) ?? category.name;
        return category;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/suppliers") {
      return updateState((draft) => {
        const data = payload;
        const supplier = {
          id: nextId("sup"),
          name: asString(data.name) ?? "New Supplier",
          contactName: asString(data.contactName) ?? "Demo Contact",
          email: asString(data.email) ?? "contact@demo.local",
          leadTimeDays: asNumber(data.leadTimeDays, 10),
          productCount: 0,
          openPurchaseOrders: 0,
          onTimeDeliveryScore: 90,
          fulfillmentRiskScore: 15
        };
        draft.suppliers.unshift(supplier);
        return supplier;
      });
    }
    if (normalizedMethod === "PUT" && normalizedPath.startsWith("/api/suppliers/")) {
      const supplierId = normalizedPath.split("/")[3];
      return updateState((draft) => {
        const supplier = draft.suppliers.find((item) => item.id === supplierId);
        if (!supplier) notFound(normalizedPath);
        const data = payload;
        supplier.name = asString(data.name) ?? supplier.name;
        supplier.contactName = asString(data.contactName) ?? supplier.contactName;
        supplier.email = asString(data.email) ?? supplier.email;
        supplier.leadTimeDays = asNumber(data.leadTimeDays, supplier.leadTimeDays);
        return supplier;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/products") {
      return updateState((draft) => {
        const data = payload;
        const product = {
          id: nextId("prod"),
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          name: asString(data.name) ?? "New Product",
          description: asString(data.description) ?? "",
          category: asString(data.categoryName) ?? "General",
          supplier: asString(data.supplierName) ?? "Demo Supplier",
          price: asNumber(data.price, 0),
          cost: asNumber(data.cost, 0),
          stockQuantity: asNumber(data.stockQuantity, 0),
          reorderLevel: asNumber(data.reorderLevel, 0),
          marginPercent: asNumber(data.price, 0) > 0 ? Number(((asNumber(data.price, 0) - asNumber(data.cost, 0)) / asNumber(data.price, 1) * 100).toFixed(2)) : 0,
          isLowStock: asNumber(data.stockQuantity, 0) <= asNumber(data.reorderLevel, 0),
          isActive: asBoolean(data.isActive, true)
        };
        draft.products.unshift(product);
        draft.inventoryItems.unshift({
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          supplier: product.supplier,
          stockQuantity: product.stockQuantity,
          reorderLevel: product.reorderLevel,
          availableCoverDays: Math.max(3, Math.round(product.stockQuantity / 2)),
          inventoryValue: Number((product.stockQuantity * product.cost).toFixed(2)),
          isLowStock: product.isLowStock
        });
        return product;
      });
    }
    if (normalizedMethod === "PUT" && normalizedPath.startsWith("/api/products/")) {
      const productId = normalizedPath.split("/")[3];
      return updateState((draft) => {
        const product = draft.products.find((item) => item.id === productId);
        if (!product) notFound(normalizedPath);
        const data = payload;
        product.name = asString(data.name) ?? product.name;
        product.description = asString(data.description) ?? product.description;
        product.category = asString(data.categoryName) ?? product.category;
        product.supplier = asString(data.supplierName) ?? product.supplier;
        product.price = asNumber(data.price, product.price);
        product.cost = asNumber(data.cost, product.cost);
        product.stockQuantity = asNumber(data.stockQuantity, product.stockQuantity);
        product.reorderLevel = asNumber(data.reorderLevel, product.reorderLevel);
        product.isActive = asBoolean(data.isActive, product.isActive);
        product.isLowStock = product.stockQuantity <= product.reorderLevel;
        product.marginPercent = product.price > 0 ? Number(((product.price - product.cost) / product.price * 100).toFixed(2)) : 0;
        const inventoryItem = draft.inventoryItems.find((item) => item.productId === productId);
        if (inventoryItem) {
          inventoryItem.productName = product.name;
          inventoryItem.supplier = product.supplier;
          inventoryItem.stockQuantity = product.stockQuantity;
          inventoryItem.reorderLevel = product.reorderLevel;
          inventoryItem.availableCoverDays = Math.max(3, Math.round(product.stockQuantity / 2));
          inventoryItem.inventoryValue = Number((product.stockQuantity * product.cost).toFixed(2));
          inventoryItem.isLowStock = product.isLowStock;
        }
        return product;
      });
    }
    if (normalizedMethod === "DELETE" && normalizedPath.startsWith("/api/products/")) {
      const productId = normalizedPath.split("/")[3];
      updateState((draft) => {
        draft.products = draft.products.filter((item) => item.id !== productId);
        draft.inventoryItems = draft.inventoryItems.filter((item) => item.productId !== productId);
      });
      return void 0;
    }
  }
  if (service === "inventory") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/dashboard") return clone(createInventoryDashboard(state));
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/items") return clone(state.inventoryItems);
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/procurement/dashboard") return clone(createProcurementDashboard(state));
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/purchase-orders") {
      return clone(filterByStatus(state.purchaseOrders, asString(readParam(config, "status"))));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/reorder-recommendations") return clone(state.reorderRecommendations);
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/demand-forecast") return clone(state.demandForecast);
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/assets") {
      const dueOnly = asBoolean(readParam(config, "dueForMaintenanceOnly"));
      return clone(dueOnly ? state.assets.filter((item) => item.maintenanceRiskScore >= 80) : state.assets);
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/maintenance-forecast") return clone(state.maintenanceForecast);
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/supply-chain/warehouses") return clone(state.warehouses);
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/supply-chain/transfers") {
      return clone(filterByStatus(state.transfers, asString(readParam(config, "status"))));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/supply-chain/shipments") {
      return clone(filterByStatus(state.shipments, asString(readParam(config, "status"))));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/fixed-assets") {
      return clone(filterByStatus(state.fixedAssets, asString(readParam(config, "status"))));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/fixed-assets/compliance-report") return clone(state.fixedAssetCompliance);
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/manufacturing/work-orders") {
      return clone(filterByStatus(state.workOrders, asString(readParam(config, "status"))));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/inventory/anomalies") {
      return clone(state.anomalies.slice(0, asNumber(readParam(config, "maxResults"), 10)));
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/inventory/purchase-orders") {
      return updateState((draft) => {
        const data = payload;
        const lines = Array.isArray(data.lines) ? data.lines : [];
        const supplier = draft.suppliers.find((item) => item.id === asString(data.supplierId));
        const purchaseOrder = {
          id: nextId("po"),
          purchaseOrderNumber: `PO-${Date.now()}`,
          supplierId: (supplier == null ? void 0 : supplier.id) ?? "sup-demo",
          supplierName: (supplier == null ? void 0 : supplier.name) ?? "Demo Supplier",
          createdAt: nowIso(),
          expectedDeliveryDate: addDays(7),
          receivedAt: null,
          status: "Open",
          lines: lines.map((line) => {
            const product = draft.products.find((item) => item.id === asString(line.productId));
            const quantity = asNumber(line.quantity, 1);
            const unitCost = (product == null ? void 0 : product.cost) ?? 0;
            return {
              productId: (product == null ? void 0 : product.id) ?? nextId("prod"),
              productName: (product == null ? void 0 : product.name) ?? "Demo Product",
              quantity,
              unitCost,
              lineTotal: Number((quantity * unitCost).toFixed(2))
            };
          }),
          totalCost: 0,
          notes: asString(data.notes) ?? ""
        };
        purchaseOrder.totalCost = Number(purchaseOrder.lines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2));
        draft.purchaseOrders.unshift(purchaseOrder);
        return purchaseOrder;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/inventory/purchase-orders/") && normalizedPath.endsWith("/receive")) {
      const orderId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const purchaseOrder = draft.purchaseOrders.find((item) => item.id === orderId);
        if (!purchaseOrder) notFound(normalizedPath);
        purchaseOrder.status = "Received";
        purchaseOrder.receivedAt = asString(payload == null ? void 0 : payload.receivedAt) ?? nowIso();
        purchaseOrder.lines.forEach((line) => {
          const inventoryItem = draft.inventoryItems.find((item) => item.productId === line.productId);
          if (inventoryItem) {
            inventoryItem.stockQuantity += line.quantity;
            inventoryItem.inventoryValue = Number((inventoryItem.stockQuantity * (inventoryItem.inventoryValue / Math.max(inventoryItem.stockQuantity - line.quantity, 1))).toFixed(2));
            inventoryItem.isLowStock = inventoryItem.stockQuantity <= inventoryItem.reorderLevel;
          }
        });
        return purchaseOrder;
      });
    }
    if (normalizedMethod === "POST" && /\/api\/inventory\/[^/]+\/adjust$/.test(normalizedPath)) {
      const productId = normalizedPath.split("/")[3];
      return updateState((draft) => {
        const inventoryItem = draft.inventoryItems.find((item) => item.productId === productId);
        const product = draft.products.find((item) => item.id === productId);
        if (!inventoryItem || !product) notFound(normalizedPath);
        const delta = asNumber(payload == null ? void 0 : payload.quantityDelta, 0);
        inventoryItem.stockQuantity = Math.max(0, inventoryItem.stockQuantity + delta);
        inventoryItem.availableCoverDays = Math.max(3, Math.round(inventoryItem.stockQuantity / 2));
        inventoryItem.inventoryValue = Number((inventoryItem.stockQuantity * product.cost).toFixed(2));
        inventoryItem.isLowStock = inventoryItem.stockQuantity <= inventoryItem.reorderLevel;
        product.stockQuantity = inventoryItem.stockQuantity;
        product.isLowStock = inventoryItem.isLowStock;
        return inventoryItem;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/inventory/assets/") && normalizedPath.endsWith("/maintenance")) {
      const assetId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const asset = draft.assets.find((item) => item.id === assetId);
        if (!asset) notFound(normalizedPath);
        asset.lastServicedAt = asString(payload == null ? void 0 : payload.servicedAt) ?? nowIso();
        asset.conditionScore = asNumber(payload == null ? void 0 : payload.conditionScore, asset.conditionScore);
        asset.maintenanceRiskScore = Math.max(10, 100 - asset.conditionScore);
        asset.nextServiceDueAt = addDays(30);
        return asset;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/inventory/supply-chain/transfers") {
      return updateState((draft) => {
        var _a2;
        const data = payload;
        const transfer = {
          id: nextId("transfer"),
          transferNumber: `TRF-${Date.now()}`,
          fromWarehouseCode: asString(data.fromWarehouseCode) ?? "MAIN",
          toWarehouseCode: asString(data.toWarehouseCode) ?? "FIELD",
          productId: asString(data.productId) ?? "prod-demo",
          productName: ((_a2 = draft.products.find((item) => item.id === asString(data.productId))) == null ? void 0 : _a2.name) ?? "Demo Product",
          quantity: asNumber(data.quantity, 1),
          status: "Requested",
          requestedAt: nowIso(),
          completedAt: null,
          reason: asString(data.reason) ?? ""
        };
        draft.transfers.unshift(transfer);
        return transfer;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/inventory/supply-chain/shipments/") && normalizedPath.endsWith("/status")) {
      const shipmentId = normalizedPath.split("/")[5];
      return updateState((draft) => {
        const shipment = draft.shipments.find((item) => item.id === shipmentId);
        if (!shipment) notFound(normalizedPath);
        shipment.status = asString(payload == null ? void 0 : payload.status) ?? shipment.status;
        shipment.deliveredAt = shipment.status.toLowerCase() === "delivered" ? nowIso() : shipment.deliveredAt;
        return shipment;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/inventory/supply-chain/shipments") {
      return updateState((draft) => {
        const data = payload;
        const shipment = {
          id: nextId("shipment"),
          shipmentNumber: `SHP-${Date.now()}`,
          direction: asString(data.direction) ?? "Outbound",
          status: "Scheduled",
          carrier: asString(data.carrier) ?? "Demo Carrier",
          trackingNumber: asString(data.trackingNumber) ?? `TRK-${Date.now()}`,
          originWarehouseCode: asString(data.originWarehouseCode) ?? "MAIN",
          destinationName: asString(data.destinationName) ?? "Demo destination",
          salesOrderId: asString(data.salesOrderId),
          purchaseOrderId: asString(data.purchaseOrderId),
          scheduledShipDate: asString(data.scheduledShipDate) ?? nowIso(),
          deliveredAt: null
        };
        draft.shipments.unshift(shipment);
        return shipment;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/inventory/fixed-assets/") && normalizedPath.endsWith("/transfer")) {
      const assetId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const asset = draft.fixedAssets.find((item) => item.id === assetId);
        if (!asset) notFound(normalizedPath);
        const data = payload;
        asset.branchCode = asString(data.branchCode) ?? asset.branchCode;
        asset.currentLocation = asString(data.currentLocation) ?? asset.currentLocation;
        asset.ownerDepartment = asString(data.ownerDepartment) ?? asset.ownerDepartment;
        return asset;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/inventory/fixed-assets/") && normalizedPath.endsWith("/revalue")) {
      const assetId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const asset = draft.fixedAssets.find((item) => item.id === assetId);
        if (!asset) notFound(normalizedPath);
        const amount = asNumber(payload == null ? void 0 : payload.revaluationAmount, 0);
        asset.revaluationAmount = amount;
        asset.residualValue = Number((asset.residualValue + amount).toFixed(2));
        return asset;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/inventory/fixed-assets/depreciation/run") {
      return updateState((draft) => {
        draft.fixedAssets.forEach((item) => {
          item.lastDepreciatedOn = asString(payload == null ? void 0 : payload.runDate) ?? nowIso();
        });
        draft.fixedAssetCompliance.assetsPendingDepreciation = 0;
        return draft.fixedAssetCompliance;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/inventory/fixed-assets") {
      return updateState((draft) => {
        const data = payload;
        const asset = {
          id: nextId("fa"),
          assetNumber: `FA-${Date.now().toString().slice(-6)}`,
          name: asString(data.name) ?? "New Fixed Asset",
          assetClass: asString(data.assetClass) ?? "General",
          status: "Capitalized",
          companyCode: asString(data.companyCode) ?? "VJH",
          branchCode: asString(data.branchCode) ?? "HQ",
          capitalizedOn: nowIso(),
          acquisitionCost: asNumber(data.acquisitionCost, 0),
          salvageValue: asNumber(data.salvageValue, 0),
          residualValue: asNumber(data.acquisitionCost, 0),
          accumulatedDepreciation: 0,
          depreciationMethod: asString(data.depreciationMethod) ?? "SLM",
          usefulLifeMonths: asNumber(data.usefulLifeMonths, 60),
          depreciationRate: asNumber(data.depreciationRate, 10),
          revaluationAmount: 0,
          ownerDepartment: asString(data.ownerDepartment) ?? "Operations",
          currentLocation: asString(data.currentLocation) ?? "Head Office",
          lastDepreciatedOn: nowIso(),
          operationalAssetId: asString(data.operationalAssetId)
        };
        draft.fixedAssets.unshift(asset);
        return asset;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/inventory/manufacturing/work-orders") {
      return updateState((draft) => {
        var _a2;
        const data = payload;
        const order = {
          id: nextId("wo"),
          workOrderNumber: `WO-${Date.now()}`,
          productName: asString(data.productName) ?? ((_a2 = draft.products.find((item) => item.id === asString(data.productId))) == null ? void 0 : _a2.name) ?? "Demo Work Order",
          workCenter: asString(data.workCenter) ?? "Assembly",
          status: "Scheduled",
          scheduledStart: nowIso(),
          expectedCompletion: addHours(asNumber(data.plannedDurationHours, 8)),
          quantity: asNumber(data.quantity, 1),
          producedQuantity: 0
        };
        draft.workOrders.unshift(order);
        return order;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/inventory/manufacturing/work-orders/") && normalizedPath.endsWith("/status")) {
      const workOrderId = normalizedPath.split("/")[5];
      return updateState((draft) => {
        const order = draft.workOrders.find((item) => item.id === workOrderId);
        if (!order) notFound(normalizedPath);
        order.status = asString(payload == null ? void 0 : payload.status) ?? order.status;
        order.producedQuantity = asNumber(payload == null ? void 0 : payload.producedQuantity, order.producedQuantity);
        return order;
      });
    }
  }
  if (service === "sales") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/customers") {
      const segment = asString(readParam(config, "segment"));
      return clone(segment ? state.customers.filter((item) => item.segment === segment) : state.customers);
    }
    if (normalizedMethod === "GET" && normalizedPath.startsWith("/api/customers/") && normalizedPath.endsWith("/intelligence")) {
      const customerId = normalizedPath.split("/")[3];
      return clone(createCustomerIntelligence(state, customerId));
    }
    if (normalizedMethod === "GET" && normalizedPath.startsWith("/api/customers/")) {
      const customerId = normalizedPath.split("/")[3];
      const customer = state.customers.find((item) => item.id === customerId);
      if (!customer) notFound(normalizedPath);
      return clone(customer);
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/orders/metrics") return clone(state.orderMetrics);
    if (normalizedMethod === "GET" && normalizedPath === "/api/orders") return clone(filterByStatus(state.orders, asString(readParam(config, "status"))));
    if (normalizedMethod === "GET" && normalizedPath.startsWith("/api/orders/")) {
      const orderId = normalizedPath.split("/")[3];
      const order = state.orders.find((item) => item.id === orderId);
      if (!order) notFound(normalizedPath);
      return clone(order);
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/projects") return clone(filterByStatus(state.projects, asString(readParam(config, "status"))));
    if (normalizedMethod === "GET" && normalizedPath === "/api/service-desk/tickets") return clone(filterByStatus(state.tickets, asString(readParam(config, "status"))));
    if (normalizedMethod === "GET" && normalizedPath === "/api/field-service/jobs") return clone(filterByStatus(state.fieldServiceJobs, asString(readParam(config, "status"))));
    if (normalizedMethod === "GET" && normalizedPath === "/api/plm/lifecycles") {
      const productId = asString(readParam(config, "productId"));
      return clone(productId ? state.productLifecycles.filter((item) => item.productId === productId) : state.productLifecycles);
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/plm/changes") return clone(filterByStatus(state.productChanges, asString(readParam(config, "status"))));
    if (normalizedMethod === "GET" && normalizedPath === "/api/access-control/summary") return clone(state.accessSummary);
    if (normalizedMethod === "GET" && normalizedPath === "/api/access-control/companies") return clone(state.companies);
    if (normalizedMethod === "GET" && normalizedPath === "/api/access-control/branches") return clone(state.branches);
    if (normalizedMethod === "POST" && normalizedPath === "/api/customers") {
      return updateState((draft) => {
        const data = payload;
        const customer = {
          id: nextId("cust"),
          name: asString(data.name) ?? "New Customer",
          email: asString(data.email) ?? "customer@demo.local",
          contactNumber: asString(data.contactNumber) ?? "",
          segment: asString(data.segment) ?? "Mid-Market",
          createdAt: nowIso(),
          lifetimeValue: 0,
          outstandingBalance: 0
        };
        draft.customers.unshift(customer);
        return customer;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/orders") {
      return updateState((draft) => {
        const data = payload;
        const customer = draft.customers.find((item) => item.id === asString(data.customerId));
        const lines = Array.isArray(data.lines) ? data.lines : [];
        const orderLines = lines.map((line) => {
          const product = draft.products.find((item) => item.id === asString(line.productId));
          const quantity = asNumber(line.quantity, 1);
          const unitPrice = (product == null ? void 0 : product.price) ?? 0;
          return {
            productId: (product == null ? void 0 : product.id) ?? nextId("prod"),
            productName: (product == null ? void 0 : product.name) ?? "Demo Product",
            quantity,
            unitPrice,
            lineTotal: Number((quantity * unitPrice).toFixed(2))
          };
        });
        const subtotal = Number(orderLines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2));
        const taxAmount = Number((subtotal * 0.18).toFixed(2));
        const order = {
          id: nextId("order"),
          orderNumber: `SO-${Date.now()}`,
          customerId: (customer == null ? void 0 : customer.id) ?? "cust-demo",
          customerName: (customer == null ? void 0 : customer.name) ?? "Demo Customer",
          orderDate: nowIso(),
          status: "Pending",
          lines: orderLines,
          subtotal,
          taxAmount,
          totalAmount: Number((subtotal + taxAmount).toFixed(2)),
          invoiceId: nextId("invoice")
        };
        draft.orders.unshift(order);
        draft.orderMetrics.openOrders += 1;
        return order;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/orders/") && normalizedPath.endsWith("/status")) {
      const orderId = normalizedPath.split("/")[3];
      return updateState((draft) => {
        const order = draft.orders.find((item) => item.id === orderId);
        if (!order) notFound(normalizedPath);
        order.status = asString(payload == null ? void 0 : payload.status) ?? order.status;
        return order;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/projects") {
      return updateState((draft) => {
        const data = payload;
        const project = {
          id: nextId("project"),
          projectCode: `PRJ-${Date.now()}`,
          name: asString(data.name) ?? "New Project",
          customerName: asString(data.customerName) ?? "Demo Customer",
          projectManager: asString(data.projectManager) ?? "Demo Manager",
          status: "Planning",
          budget: asNumber(data.budget, 0),
          recognizedRevenue: 0,
          percentComplete: 0,
          startDate: nowIso(),
          dueDate: asString(data.dueDate) ?? addDays(30)
        };
        draft.projects.unshift(project);
        return project;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/projects/") && normalizedPath.endsWith("/status")) {
      const projectId = normalizedPath.split("/")[3];
      return updateState((draft) => {
        const project = draft.projects.find((item) => item.id === projectId);
        if (!project) notFound(normalizedPath);
        project.status = asString(payload == null ? void 0 : payload.status) ?? project.status;
        project.percentComplete = asNumber(payload == null ? void 0 : payload.percentComplete, project.percentComplete);
        return project;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/service-desk/tickets") {
      return updateState((draft) => {
        const data = payload;
        const ticket = {
          id: nextId("ticket"),
          ticketNumber: `TKT-${Date.now()}`,
          customerName: asString(data.customerName) ?? "Demo Customer",
          subject: asString(data.subject) ?? "New support case",
          priority: asString(data.priority) ?? "Medium",
          status: "New",
          openedAt: nowIso(),
          dueAt: addHours(asNumber(data.dueInHours, 8)),
          assignedTeam: asString(data.assignedTeam) ?? "Support Desk"
        };
        draft.tickets.unshift(ticket);
        return ticket;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/service-desk/tickets/") && normalizedPath.endsWith("/status")) {
      const ticketId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const ticket = draft.tickets.find((item) => item.id === ticketId);
        if (!ticket) notFound(normalizedPath);
        ticket.status = asString(payload == null ? void 0 : payload.status) ?? ticket.status;
        return ticket;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/field-service/jobs") {
      return updateState((draft) => {
        const data = payload;
        const job = {
          id: nextId("job"),
          jobNumber: `FS-${Date.now()}`,
          serviceTicketId: asString(data.serviceTicketId),
          customerName: asString(data.customerName) ?? "Demo Customer",
          technicianName: asString(data.technicianName) ?? "Demo Technician",
          status: "Scheduled",
          scheduledStart: asString(data.scheduledStart) ?? addHours(2),
          scheduledEnd: asString(data.scheduledEnd) ?? addHours(4),
          offlineSyncEnabled: asBoolean(data.offlineSyncEnabled, true),
          latitude: asNumber(data.latitude, 12.9716),
          longitude: asNumber(data.longitude, 77.5946),
          serviceReport: ""
        };
        draft.fieldServiceJobs.unshift(job);
        return job;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/field-service/jobs/") && normalizedPath.endsWith("/status")) {
      const jobId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const job = draft.fieldServiceJobs.find((item) => item.id === jobId);
        if (!job) notFound(normalizedPath);
        job.status = asString(payload == null ? void 0 : payload.status) ?? job.status;
        job.serviceReport = asString(payload == null ? void 0 : payload.serviceReport) ?? job.serviceReport;
        return job;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/plm/lifecycles") {
      return updateState((draft) => {
        const data = payload;
        const product = draft.products.find((item) => item.id === asString(data.productId));
        const billOfMaterials = Array.isArray(data.billOfMaterials) ? data.billOfMaterials : [];
        const lifecycle = {
          id: nextId("plm"),
          productId: (product == null ? void 0 : product.id) ?? nextId("prod"),
          productName: (product == null ? void 0 : product.name) ?? "Demo Product",
          version: asString(data.version) ?? "v1.0",
          lifecycleStage: asString(data.lifecycleStage) ?? "Draft",
          releasedAt: nowIso(),
          billOfMaterials: billOfMaterials.map((line) => {
            const component = draft.products.find((item) => item.id === asString(line.componentProductId));
            return {
              componentProductId: (component == null ? void 0 : component.id) ?? nextId("comp"),
              componentName: (component == null ? void 0 : component.name) ?? "Demo Component",
              quantity: asNumber(line.quantity, 1),
              unitOfMeasure: asString(line.unitOfMeasure) ?? "EA"
            };
          })
        };
        draft.productLifecycles.unshift(lifecycle);
        return lifecycle;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/plm/changes") {
      return updateState((draft) => {
        const data = payload;
        const lifecycle = draft.productLifecycles.find((item) => item.id === asString(data.productLifecycleId));
        const change = {
          id: nextId("change"),
          changeNumber: `ECO-${Date.now()}`,
          productLifecycleId: (lifecycle == null ? void 0 : lifecycle.id) ?? nextId("plm"),
          productName: (lifecycle == null ? void 0 : lifecycle.productName) ?? "Demo Product",
          title: asString(data.title) ?? "New engineering change",
          status: "Submitted",
          requestedBy: asString(data.requestedBy) ?? "Engineering",
          requestedAt: nowIso(),
          approvedAt: null,
          impactSummary: asString(data.impactSummary) ?? ""
        };
        draft.productChanges.unshift(change);
        return change;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/plm/changes/") && normalizedPath.endsWith("/status")) {
      const changeId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const change = draft.productChanges.find((item) => item.id === changeId);
        if (!change) notFound(normalizedPath);
        change.status = asString(payload == null ? void 0 : payload.status) ?? change.status;
        change.approvedAt = change.status.toLowerCase() === "approved" ? nowIso() : change.approvedAt;
        return change;
      });
    }
  }
  if (service === "billing") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/billing/dashboard") return clone(state.billingDashboard);
    if (normalizedMethod === "GET" && normalizedPath === "/api/billing/executive-dashboard") return clone(state.executiveDashboard);
    if (normalizedMethod === "GET" && normalizedPath === "/api/billing/alerts") {
      return clone(createBillingAlerts(state, asNumber(readParam(config, "maxAlerts"), 10)));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/finance/dashboard") return clone(state.financeDashboard);
    if (normalizedMethod === "GET" && normalizedPath === "/api/finance/payroll") return clone(state.payrollSummary);
    if (normalizedMethod === "GET" && normalizedPath === "/api/procurement/requisitions") return clone(filterByStatus(state.requisitions, asString(readParam(config, "status"))));
    if (normalizedMethod === "GET" && normalizedPath === "/api/procurement/rfqs") return clone(filterByStatus(state.rfqs, asString(readParam(config, "status"))));
    if (normalizedMethod === "GET" && normalizedPath.startsWith("/api/procurement/rfqs/") && normalizedPath.endsWith("/comparison")) {
      const rfqId = normalizedPath.split("/")[4];
      const comparison = state.vendorComparisons[rfqId];
      if (!comparison) notFound(normalizedPath);
      return clone(comparison);
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/procurement/three-way-match") return clone(state.threeWayMatches);
    if (normalizedMethod === "GET" && normalizedPath === "/api/integration/overview") return clone(state.integrationOverview);
    if (normalizedMethod === "GET" && normalizedPath === "/api/integration/connections") return clone(state.integrations);
    if (normalizedMethod === "GET" && normalizedPath === "/api/integration/webhooks") return clone(state.webhooks);
    if (normalizedMethod === "GET" && normalizedPath === "/api/reporting/snapshot") return clone(state.reportingSnapshot);
    if (normalizedMethod === "GET" && normalizedPath === "/api/anomalies") {
      return clone(state.anomalies.slice(0, asNumber(readParam(config, "maxResults"), 10)));
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/procurement/requisitions") {
      return updateState((draft) => {
        const data = payload;
        const lines = Array.isArray(data.lines) ? data.lines : [];
        const requisition = {
          id: nextId("req"),
          requisitionNumber: `PR-${Date.now()}`,
          department: asString(data.department) ?? "Operations",
          requestedBy: asString(data.requestedBy) ?? "Demo Requester",
          status: "Submitted",
          requestedAt: nowIso(),
          justification: asString(data.justification) ?? "",
          lines: lines.map((line) => {
            const product = draft.products.find((item) => item.id === asString(line.productId));
            const quantity = asNumber(line.quantity, 1);
            const estimatedUnitCost = asNumber(line.estimatedUnitCost, (product == null ? void 0 : product.cost) ?? 0);
            return {
              productId: (product == null ? void 0 : product.id) ?? nextId("prod"),
              productName: (product == null ? void 0 : product.name) ?? "Demo Product",
              quantity,
              estimatedUnitCost,
              estimatedLineTotal: Number((quantity * estimatedUnitCost).toFixed(2))
            };
          }),
          estimatedTotal: 0
        };
        requisition.estimatedTotal = Number(requisition.lines.reduce((sum, line) => sum + line.estimatedLineTotal, 0).toFixed(2));
        draft.requisitions.unshift(requisition);
        return requisition;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/procurement/requisitions/") && normalizedPath.endsWith("/status")) {
      const requisitionId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const requisition = draft.requisitions.find((item) => item.id === requisitionId);
        if (!requisition) notFound(normalizedPath);
        requisition.status = asString(payload == null ? void 0 : payload.status) ?? requisition.status;
        return requisition;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/procurement/rfqs") {
      return updateState((draft) => {
        var _a2, _b, _c;
        const data = payload;
        const quotes = Array.isArray(data.supplierQuotes) ? data.supplierQuotes : [];
        const rfq = {
          id: nextId("rfq"),
          rfqNumber: `RFQ-${Date.now()}`,
          requisitionId: asString(data.requisitionId),
          title: asString(data.title) ?? "Demo RFQ",
          status: "Issued",
          issuedAt: nowIso(),
          responseDueAt: addDays(asNumber(data.responseWindowDays, 5)),
          supplierQuotes: quotes.map((quote) => {
            const supplier = draft.suppliers.find((item) => item.id === asString(quote.supplierId));
            return {
              supplierId: (supplier == null ? void 0 : supplier.id) ?? nextId("sup"),
              supplierName: (supplier == null ? void 0 : supplier.name) ?? "Demo Supplier",
              quotedAmount: asNumber(quote.quotedAmount, 0),
              leadTimeDays: asNumber(quote.leadTimeDays, 10),
              score: 85,
              isAwarded: false
            };
          })
        };
        draft.rfqs.unshift(rfq);
        draft.vendorComparisons[rfq.id] = {
          rfqId: rfq.id,
          rfqNumber: rfq.rfqNumber,
          recommendedSupplierName: ((_a2 = rfq.supplierQuotes[0]) == null ? void 0 : _a2.supplierName) ?? "Demo Supplier",
          recommendedQuote: ((_b = rfq.supplierQuotes[0]) == null ? void 0 : _b.quotedAmount) ?? 0,
          recommendedLeadTimeDays: ((_c = rfq.supplierQuotes[0]) == null ? void 0 : _c.leadTimeDays) ?? 0,
          options: rfq.supplierQuotes
        };
        return rfq;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/integration/connections") {
      return updateState((draft) => {
        const data = payload;
        const connection = {
          id: nextId("int"),
          name: asString(data.name) ?? "Demo Integration",
          type: asString(data.type) ?? "External",
          provider: asString(data.provider) ?? "Demo Provider",
          status: "Healthy",
          endpointUrl: asString(data.endpointUrl) ?? "https://demo.local/integration",
          lastSyncAt: nowIso(),
          lastSyncResult: "Success",
          retryCount: 0
        };
        draft.integrations.unshift(connection);
        return connection;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/integration/webhooks") {
      return updateState((draft) => {
        const data = payload;
        const webhook = {
          id: nextId("webhook"),
          name: asString(data.name) ?? "Demo Webhook",
          topic: asString(data.topic) ?? "general",
          targetUrl: asString(data.targetUrl) ?? "https://demo.local/webhook",
          secretReference: asString(data.secretReference) ?? "kv://demo/webhook",
          isActive: true,
          createdAt: nowIso(),
          lastDeliveredAt: null,
          lastDeliveryStatus: "Pending"
        };
        draft.webhooks.unshift(webhook);
        return webhook;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/integration/webhooks/") && normalizedPath.endsWith("/deliveries")) {
      const webhookId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const webhook = draft.webhooks.find((item) => item.id === webhookId);
        if (!webhook) notFound(normalizedPath);
        webhook.lastDeliveredAt = nowIso();
        webhook.lastDeliveryStatus = asString(payload == null ? void 0 : payload.deliveryStatus) ?? webhook.lastDeliveryStatus;
        return webhook;
      });
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/reporting/assistant") {
      const question = asString(payload == null ? void 0 : payload.question) ?? "What changed?";
      return clone({
        intent: "BusinessSummary",
        narrative: `Demo insight for "${question}": revenue is steady, collections need one follow-up, and inventory risk is concentrated in kiosks.`,
        metrics: {
          revenueLast30Days: "$7,292.40",
          overdueExposure: "$1,352.30",
          lowStockProducts: "1"
        },
        followUpQuestions: ["Show the overdue invoice details.", "Which products need replenishment next?", "What is the procurement exposure?"]
      });
    }
  }
  if (service === "payments") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/payments") return clone(state.payments);
    if (normalizedMethod === "GET" && normalizedPath === "/api/payments/collection-risk") return clone(state.collectionRisk);
    if (normalizedMethod === "GET" && normalizedPath === "/api/payments/cash-forecast") {
      return clone(createCashForecast(state, asNumber(readParam(config, "horizonDays"), 30)));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/payments/anomalies") {
      return clone(state.anomalies.filter((item) => item.domain === "Payments").slice(0, asNumber(readParam(config, "maxResults"), 10)));
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/payments") {
      return updateState((draft) => {
        const data = payload;
        const invoice = draft.invoices.find((item) => item.id === asString(data.invoiceId));
        if (!invoice) notFound(normalizedPath);
        const amount = asNumber(data.amount, 0);
        const payment = {
          id: nextId("payment"),
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customerId: invoice.customerId,
          customerName: invoice.customerName,
          paymentDate: nowIso(),
          amount,
          paymentMethod: asString(data.paymentMethod) ?? "Bank Transfer",
          reference: asString(data.reference) ?? `PAY-${Date.now()}`,
          isRefund: false
        };
        draft.payments.unshift(payment);
        invoice.paidAmount = Number((invoice.paidAmount + amount).toFixed(2));
        invoice.balance = Number(Math.max(0, invoice.totalAmount - invoice.paidAmount).toFixed(2));
        invoice.status = invoice.balance === 0 ? "Paid" : "Partially Paid";
        return payment;
      });
    }
  }
  if (service === "invoices") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/invoices") {
      const overdueOnly = asBoolean(readParam(config, "overdueOnly"));
      return clone(overdueOnly ? state.invoices.filter((item) => item.daysOverdue > 0) : state.invoices);
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/invoices/aging") return clone(state.invoiceAging);
    if (normalizedMethod === "GET" && normalizedPath.startsWith("/api/invoices/") && normalizedPath.endsWith("/payments")) {
      const invoiceId = normalizedPath.split("/")[3];
      return clone(state.payments.filter((item) => item.invoiceId === invoiceId));
    }
    if (normalizedMethod === "GET" && normalizedPath.startsWith("/api/invoices/")) {
      const invoiceId = normalizedPath.split("/")[3];
      const invoice = state.invoices.find((item) => item.id === invoiceId);
      if (!invoice) notFound(normalizedPath);
      return clone(invoice);
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/invoices/document-extraction") {
      const data = payload;
      return clone({
        documentType: asString(data.documentType) ?? "Invoice",
        confidencePercent: 97,
        fields: {
          supplier: "Demo Supplier",
          invoiceNumber: "INV-DEMO-1001",
          totalAmount: "2450.00"
        },
        warnings: []
      });
    }
  }
  if (service === "platform") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/context") return clone(createPlatformContext());
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/organization-overview") return clone(state.organizationOverview);
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/operations-summary") return clone(state.operationsSummary);
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/audit") return clone(state.auditTrail.slice(0, asNumber(readParam(config, "take"), 50)));
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/notifications") {
      const unreadOnly = asBoolean(readParam(config, "unreadOnly"));
      return clone(unreadOnly ? state.notifications.filter((item) => !item.isRead) : state.notifications);
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/outbox") {
      const status = asString(readParam(config, "status"));
      const take = asNumber(readParam(config, "take"), 50);
      return clone(filterByStatus(state.outbox, status).slice(0, take));
    }
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/ai/readiness") return clone(state.aiReadiness);
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/industry-profiles") return clone(state.industryProfiles);
    if (normalizedMethod === "GET" && normalizedPath === "/api/platform/workflow-templates") {
      const industryCode = asString(readParam(config, "industryCode"));
      return clone(industryCode ? state.workflowTemplates.filter((item) => item.industryCode === industryCode) : state.workflowTemplates);
    }
    if (normalizedMethod === "POST" && normalizedPath === "/api/platform/industry-profiles/activate") {
      return updateState((draft) => {
        const industryCode = asString(payload == null ? void 0 : payload.industryCode);
        if (!industryCode) notFound(normalizedPath);
        draft.industryProfiles.forEach((item) => {
          item.isActive = item.industryCode === industryCode;
        });
        return draft.industryProfiles.find((item) => item.industryCode === industryCode) ?? draft.industryProfiles[0];
      });
    }
    if (normalizedMethod === "POST" && normalizedPath.startsWith("/api/platform/notifications/") && normalizedPath.endsWith("/ack")) {
      const notificationId = normalizedPath.split("/")[4];
      return updateState((draft) => {
        const notification = draft.notifications.find((item) => item.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
        return void 0;
      });
    }
  }
  if (service === "auth") {
    if (normalizedMethod === "GET" && normalizedPath === "/api/auth/me") {
      return clone(demoAccounts[0].user);
    }
  }
  notFound(`${service}:${normalizedPath}`);
}
const clients = /* @__PURE__ */ new Map();
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function createClient(service) {
  const client = axios.create({
    baseURL: apiConfig.services[service],
    timeout: apiConfig.requestTimeoutMs,
    headers: {
      "Content-Type": "application/json"
    }
  });
  client.interceptors.request.use((request) => {
    var _a;
    const { auth } = store.getState();
    const headers = request.headers || {};
    if (auth.token) {
      headers.Authorization = `Bearer ${auth.token}`;
    }
    if ((_a = auth.user) == null ? void 0 : _a.tenantId) {
      headers["X-Tenant-Id"] = auth.user.tenantId;
    }
    request.headers = headers;
    return request;
  });
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalizedError = normalizeApiError(error);
      if (normalizedError.status === 401) {
        store.dispatch(clearSession());
      }
      return Promise.reject(normalizedError);
    }
  );
  return client;
}
function getClient(service) {
  const existingClient = clients.get(service);
  if (existingClient) {
    return existingClient;
  }
  const client = createClient(service);
  clients.set(service, client);
  return client;
}
function unwrapPayload(payload) {
  if (isRecord(payload) && "data" in payload) {
    return payload.data;
  }
  return payload;
}
function normalizeApiError(error) {
  var _a, _b;
  if (isRecord(error) && "message" in error && typeof error.message === "string" && "status" in error) {
    return error;
  }
  if (error instanceof AxiosError) {
    const status = (_a = error.response) == null ? void 0 : _a.status;
    const responseData = (_b = error.response) == null ? void 0 : _b.data;
    if (isRecord(responseData) && typeof responseData.message === "string") {
      return {
        message: responseData.message,
        status,
        code: typeof responseData.errorCode === "string" ? responseData.errorCode : typeof responseData.code === "string" ? responseData.code : void 0
      };
    }
    if (!status && (error.code === AxiosError.ERR_NETWORK || error.message === "Network Error")) {
      return {
        message: "We couldn't connect right now. Check your connection or try again in a moment."
      };
    }
    const message = status === 401 ? "Your sign-in details are not correct." : status === 403 ? "You do not have access to do this." : status === 404 ? "We couldn't find what you were looking for." : status && status >= 500 ? "This information is not available right now. Please try again shortly." : "We couldn't complete your request. Please try again.";
    return { message, status };
  }
  return {
    message: "We couldn't complete your request. Please try again."
  };
}
async function executeRequest(service, method, path, request, payload, config) {
  {
    try {
      return await handleDemoRequest(service, method, path, payload, config);
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      return Promise.reject(normalizedError);
    }
  }
  const client = getClient(service);
  const response = await request(client);
  return unwrapPayload(response.data);
}
function requestGet(service, path = "", config) {
  return executeRequest(service, "GET", path, (client) => client.get(path, config), void 0, config);
}
function requestPost(service, path = "", payload, config) {
  return executeRequest(service, "POST", path, (client) => client.post(path, payload, config), payload, config);
}
function requestPut(service, path = "", payload, config) {
  return executeRequest(service, "PUT", path, (client) => client.put(path, payload, config), payload, config);
}
function requestDelete(service, path = "", config) {
  return executeRequest(service, "DELETE", path, (client) => client.delete(path, config), void 0, config);
}
const authService = {
  login(payload) {
    {
      return loginWithDemo(payload);
    }
  },
  me() {
    {
      return getDemoProfile(store.getState().auth.token);
    }
  },
  refresh(refreshToken2, deviceId) {
    {
      return refreshDemoSession(refreshToken2);
    }
  },
  logout(refreshToken2) {
    {
      return logoutDemoSession();
    }
  }
};
function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  async function login(userNameOrEmail, password) {
    dispatch(loginStarted());
    try {
      const session = await authService.login({
        userNameOrEmail,
        password,
        deviceId: apiConfig.authDeviceId
      });
      dispatch(setSession(session));
      dispatch(
        pushToast({
          title: "Signed in",
          message: `You are signed in as ${session.user.userName}.`,
          tone: "success"
        })
      );
      return session;
    } catch (error) {
      dispatch(loginFailed());
      throw error;
    }
  }
  async function refreshSession() {
    if (!auth.refreshToken) {
      return null;
    }
    const session = await authService.refresh(auth.refreshToken, apiConfig.authDeviceId);
    dispatch(setSession(session));
    return session;
  }
  async function loadProfile() {
    if (!auth.token) {
      return null;
    }
    const currentUser = await authService.me();
    dispatch(setCurrentUser(currentUser));
    return currentUser;
  }
  async function logout() {
    try {
      if (auth.token) {
        await authService.logout(auth.refreshToken || void 0);
      }
    } catch {
    }
    dispatch(clearSession());
    dispatch(
      pushToast({
        title: "Signed out",
        message: "You have been signed out.",
        tone: "info"
      })
    );
  }
  function canAccess(roles, permissions) {
    return hasAccess(auth.user, roles, permissions);
  }
  return {
    ...auth,
    login,
    refreshSession,
    loadProfile,
    logout,
    canAccess,
    hasPermission: (permission) => hasAnyPermission(auth.user, [permission]),
    isAuthenticated: Boolean(auth.token && auth.user),
    hasRole: (role) => {
      var _a;
      return ((_a = auth.user) == null ? void 0 : _a.roles.includes(role)) || false;
    }
  };
}
function useToast() {
  const dispatch = useDispatch();
  return {
    showToast(title, message, tone = "info") {
      dispatch(pushToast({ title, message, tone }));
    },
    dismissToast(id) {
      dispatch(dismissToast(id));
    }
  };
}
const platformService = {
  getDemoStatus() {
    return requestGet("platform", "/api/demo/status");
  },
  resetDemo() {
    return requestPost("platform", "/api/demo/reset", {});
  },
  getContext() {
    return requestGet("platform", "/api/platform/context");
  },
  getOrganizationOverview() {
    return requestGet("platform", "/api/platform/organization-overview");
  },
  getOperationsSummary() {
    return requestGet("platform", "/api/platform/operations-summary");
  },
  getAudit(take = 50) {
    return requestGet("platform", "/api/platform/audit", {
      params: { take }
    });
  },
  getNotifications(unreadOnly = false) {
    return requestGet("platform", "/api/platform/notifications", {
      params: { unreadOnly: unreadOnly || void 0 }
    });
  },
  acknowledgeNotification(id) {
    return requestPost("platform", `/api/platform/notifications/${id}/ack`, {});
  },
  getOutbox(status, take = 50) {
    return requestGet("platform", "/api/platform/outbox", {
      params: {
        status: status || void 0,
        take
      }
    });
  },
  getAiReadiness() {
    return requestGet("platform", "/api/platform/ai/readiness");
  },
  getIndustryProfiles() {
    return requestGet("platform", "/api/platform/industry-profiles");
  },
  activateIndustryProfile(industryCode) {
    return requestPost("platform", "/api/platform/industry-profiles/activate", { industryCode });
  },
  getWorkflowTemplates(industryCode) {
    return requestGet("platform", "/api/platform/workflow-templates", {
      params: { industryCode: industryCode || void 0 }
    });
  }
};
var dayjs_min = { exports: {} };
(function(module, exports$1) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
      var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
      return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
    } }, m = function(t2, e2, n2) {
      var r2 = String(t2);
      return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
    }, v = { s: m, z: function(t2) {
      var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
      return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
    }, m: function t2(e2, n2) {
      if (e2.date() < n2.date()) return -t2(n2, e2);
      var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
      return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
    }, a: function(t2) {
      return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
    }, p: function(t2) {
      return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t2) {
      return void 0 === t2;
    } }, g = "en", D = {};
    D[g] = M;
    var p = "$isDayjsObject", S = function(t2) {
      return t2 instanceof _ || !(!t2 || !t2[p]);
    }, w = function t2(e2, n2, r2) {
      var i2;
      if (!e2) return g;
      if ("string" == typeof e2) {
        var s2 = e2.toLowerCase();
        D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
        var u2 = e2.split("-");
        if (!i2 && u2.length > 1) return t2(u2[0]);
      } else {
        var a2 = e2.name;
        D[a2] = e2, i2 = a2;
      }
      return !r2 && i2 && (g = i2), i2 || !r2 && g;
    }, O = function(t2, e2) {
      if (S(t2)) return t2.clone();
      var n2 = "object" == typeof e2 ? e2 : {};
      return n2.date = t2, n2.args = arguments, new _(n2);
    }, b = v;
    b.l = w, b.i = S, b.w = function(t2, e2) {
      return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
    };
    var _ = function() {
      function M2(t2) {
        this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
      }
      var m2 = M2.prototype;
      return m2.parse = function(t2) {
        this.$d = function(t3) {
          var e2 = t3.date, n2 = t3.utc;
          if (null === e2) return /* @__PURE__ */ new Date(NaN);
          if (b.u(e2)) return /* @__PURE__ */ new Date();
          if (e2 instanceof Date) return new Date(e2);
          if ("string" == typeof e2 && !/Z$/i.test(e2)) {
            var r2 = e2.match($);
            if (r2) {
              var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
              return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
            }
          }
          return new Date(e2);
        }(t2), this.init();
      }, m2.init = function() {
        var t2 = this.$d;
        this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
      }, m2.$utils = function() {
        return b;
      }, m2.isValid = function() {
        return !(this.$d.toString() === l);
      }, m2.isSame = function(t2, e2) {
        var n2 = O(t2);
        return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
      }, m2.isAfter = function(t2, e2) {
        return O(t2) < this.startOf(e2);
      }, m2.isBefore = function(t2, e2) {
        return this.endOf(e2) < O(t2);
      }, m2.$g = function(t2, e2, n2) {
        return b.u(t2) ? this[e2] : this.set(n2, t2);
      }, m2.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, m2.valueOf = function() {
        return this.$d.getTime();
      }, m2.startOf = function(t2, e2) {
        var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
          var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
          return r2 ? i2 : i2.endOf(a);
        }, $2 = function(t3, e3) {
          return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
        }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
        switch (f2) {
          case h:
            return r2 ? l2(1, 0) : l2(31, 11);
          case c:
            return r2 ? l2(1, M3) : l2(0, M3 + 1);
          case o:
            var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
            return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
          case a:
          case d:
            return $2(v2 + "Hours", 0);
          case u:
            return $2(v2 + "Minutes", 1);
          case s:
            return $2(v2 + "Seconds", 2);
          case i:
            return $2(v2 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, m2.endOf = function(t2) {
        return this.startOf(t2, false);
      }, m2.$set = function(t2, e2) {
        var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
        if (o2 === c || o2 === h) {
          var y2 = this.clone().set(d, 1);
          y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
        } else l2 && this.$d[l2]($2);
        return this.init(), this;
      }, m2.set = function(t2, e2) {
        return this.clone().$set(t2, e2);
      }, m2.get = function(t2) {
        return this[b.p(t2)]();
      }, m2.add = function(r2, f2) {
        var d2, l2 = this;
        r2 = Number(r2);
        var $2 = b.p(f2), y2 = function(t2) {
          var e2 = O(l2);
          return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
        };
        if ($2 === c) return this.set(c, this.$M + r2);
        if ($2 === h) return this.set(h, this.$y + r2);
        if ($2 === a) return y2(1);
        if ($2 === o) return y2(7);
        var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
        return b.w(m3, this);
      }, m2.subtract = function(t2, e2) {
        return this.add(-1 * t2, e2);
      }, m2.format = function(t2) {
        var e2 = this, n2 = this.$locale();
        if (!this.isValid()) return n2.invalidDate || l;
        var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
          return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
        }, d2 = function(t3) {
          return b.s(s2 % 12 || 12, t3, "0");
        }, $2 = f2 || function(t3, e3, n3) {
          var r3 = t3 < 12 ? "AM" : "PM";
          return n3 ? r3.toLowerCase() : r3;
        };
        return r2.replace(y, function(t3, r3) {
          return r3 || function(t4) {
            switch (t4) {
              case "YY":
                return String(e2.$y).slice(-2);
              case "YYYY":
                return b.s(e2.$y, 4, "0");
              case "M":
                return a2 + 1;
              case "MM":
                return b.s(a2 + 1, 2, "0");
              case "MMM":
                return h2(n2.monthsShort, a2, c2, 3);
              case "MMMM":
                return h2(c2, a2);
              case "D":
                return e2.$D;
              case "DD":
                return b.s(e2.$D, 2, "0");
              case "d":
                return String(e2.$W);
              case "dd":
                return h2(n2.weekdaysMin, e2.$W, o2, 2);
              case "ddd":
                return h2(n2.weekdaysShort, e2.$W, o2, 3);
              case "dddd":
                return o2[e2.$W];
              case "H":
                return String(s2);
              case "HH":
                return b.s(s2, 2, "0");
              case "h":
                return d2(1);
              case "hh":
                return d2(2);
              case "a":
                return $2(s2, u2, true);
              case "A":
                return $2(s2, u2, false);
              case "m":
                return String(u2);
              case "mm":
                return b.s(u2, 2, "0");
              case "s":
                return String(e2.$s);
              case "ss":
                return b.s(e2.$s, 2, "0");
              case "SSS":
                return b.s(e2.$ms, 3, "0");
              case "Z":
                return i2;
            }
            return null;
          }(t3) || i2.replace(":", "");
        });
      }, m2.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m2.diff = function(r2, d2, l2) {
        var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
          return b.m(y2, m3);
        };
        switch (M3) {
          case h:
            $2 = D2() / 12;
            break;
          case c:
            $2 = D2();
            break;
          case f:
            $2 = D2() / 3;
            break;
          case o:
            $2 = (g2 - v2) / 6048e5;
            break;
          case a:
            $2 = (g2 - v2) / 864e5;
            break;
          case u:
            $2 = g2 / n;
            break;
          case s:
            $2 = g2 / e;
            break;
          case i:
            $2 = g2 / t;
            break;
          default:
            $2 = g2;
        }
        return l2 ? $2 : b.a($2);
      }, m2.daysInMonth = function() {
        return this.endOf(c).$D;
      }, m2.$locale = function() {
        return D[this.$L];
      }, m2.locale = function(t2, e2) {
        if (!t2) return this.$L;
        var n2 = this.clone(), r2 = w(t2, e2, true);
        return r2 && (n2.$L = r2), n2;
      }, m2.clone = function() {
        return b.w(this.$d, this);
      }, m2.toDate = function() {
        return new Date(this.valueOf());
      }, m2.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, m2.toISOString = function() {
        return this.$d.toISOString();
      }, m2.toString = function() {
        return this.$d.toUTCString();
      }, M2;
    }(), k = _.prototype;
    return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
      k[t2[1]] = function(e2) {
        return this.$g(e2, t2[0], t2[1]);
      };
    }), O.extend = function(t2, e2) {
      return t2.$i || (t2(e2, _, O), t2.$i = true), O;
    }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
      return O(1e3 * t2);
    }, O.en = D[g], O.Ls = D, O.p = {}, O;
  });
})(dayjs_min);
var dayjs_minExports = dayjs_min.exports;
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
var relativeTime$1 = { exports: {} };
(function(module, exports$1) {
  !function(r, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    return function(r, e, t) {
      r = r || {};
      var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
      function i(r2, e2, t2, o2) {
        return n.fromToBase(r2, e2, t2, o2);
      }
      t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u) {
        for (var f, a, s, l = i2.$locale().relativeTime || o, h = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h.length, c = 0; c < m; c += 1) {
          var y = h[c];
          y.d && (f = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
          var p = (r.rounding || Math.round)(Math.abs(f));
          if (s = f > 0, p <= y.r || !y.r) {
            p <= 1 && c > 0 && (y = h[c - 1]);
            var v = l[y.l];
            u && (p = u("" + p)), a = "string" == typeof v ? v.replace("%d", p) : v(p, n2, y.l, s);
            break;
          }
        }
        if (n2) return a;
        var M = s ? l.future : l.past;
        return "function" == typeof M ? M(a) : M.replace("%s", a);
      }, n.to = function(r2, e2) {
        return i(r2, e2, this, true);
      }, n.from = function(r2, e2) {
        return i(r2, e2, this);
      };
      var d = function(r2) {
        return r2.$u ? t.utc() : t();
      };
      n.toNow = function(r2) {
        return this.to(d(this), r2);
      }, n.fromNow = function(r2) {
        return this.from(d(this), r2);
      };
    };
  });
})(relativeTime$1);
var relativeTimeExports = relativeTime$1.exports;
const relativeTime = /* @__PURE__ */ getDefaultExportFromCjs(relativeTimeExports);
dayjs.extend(relativeTime);
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}
function formatPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
function formatDateTime(value) {
  return dayjs(value).format("MMM D, YYYY h:mm A");
}
function formatDate(value) {
  return dayjs(value).format("MMM D, YYYY");
}
function formatRelative(value) {
  return dayjs(value).fromNow();
}
function StatusBadge({ label, tone = "neutral" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `status-badge status-badge--${tone}`, children: label });
}
function NavIcon({ icon }) {
  const icons = {
    dashboard: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7V11h-7v9Zm0-16v5h7V4h-7Z" }) }),
    access: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 1 3 5v6c0 5.25 3.84 10.18 9 11 5.16-.82 9-5.75 9-11V5l-9-4Zm0 11h7c-.53 3.98-3.1 7.39-7 8.69V12H5V6.3l7-3.11V12Z" }) }),
    tenant: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 21h16v-2H4v2Zm1-4h4V5H5v12Zm5 0h4V3h-4v14Zm5 0h4V9h-4v8Z" }) }),
    orders: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17 14h9.95c.75 0 1.41-.41 1.75-1.03L22 6.76 20.25 6l-3.13 6H8.1L4.27 4H1v2h2l3.6 7.59-1.35 2.44C4.52 17.37 5.48 19 7 19h12v-2H7l1.17-2Z" }) }),
    products: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m21 8-9-5-9 5 9 5 9-5Zm-9 7L3 10v6l9 5 9-5v-6l-9 5Z" }) }),
    reports: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 22h16v-2H4v2Zm2-4h3V9H6v9Zm5 0h3V2h-3v16Zm5 0h3v-6h-3v6Z" }) }),
    finance: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 17h3.5l3-7 4 9 3-6H21v-2h-3.2l-2.2 4.4L11.6 6l-3 7H3v4Z" }) }),
    settings: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m19.14 12.94.04-.94-.04-.94 2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94L14.5 2.7a.5.5 0 0 0-.49-.4h-4.02a.5.5 0 0 0-.49.4l-.36 2.62c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.6 8.84a.5.5 0 0 0 .12.64l2.03 1.58-.04.94.04.94L2.72 14.52a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.4 1.05.72 1.63.94l.36 2.62a.5.5 0 0 0 .49.4h4.02a.5.5 0 0 0 .49-.4l.36-2.62c.58-.23 1.12-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z" }) }),
    platform: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 5h18v4H3V5Zm2 6h6v8H5v-8Zm8 0h6v3h-6v-3Zm0 5h6v3h-6v-3Z" }) })
  };
  return icons[icon] || icons.dashboard;
}
function MenuIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 7h16v2H4V7Zm0 8h16v2H4v-2Zm0-4h16v2H4v-2Z" }) });
}
function BellIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5L3 18v1h18v-1l-2-2Z" }) });
}
function severityTone(value) {
  switch (value.toLowerCase()) {
    case "high":
    case "critical":
      return "danger";
    case "medium":
    case "warning":
      return "warning";
    case "low":
      return "success";
    default:
      return "info";
  }
}
function groupNavigation(items) {
  return [
    { label: "Operate", items: items.filter((item) => item.group === "Operate") },
    { label: "Manage", items: items.filter((item) => item.group === "Govern") }
  ].filter((group) => group.items.length > 0);
}
function MainLayout() {
  var _a;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user: user2, logout, canAccess } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const [notificationsOpen, setNotificationsOpen] = reactExports.useState(false);
  const [notifications, setNotifications] = reactExports.useState([]);
  const [demoStatus, setDemoStatus] = reactExports.useState(null);
  const [resettingDemo, setResettingDemo] = reactExports.useState(false);
  const [acknowledgingId, setAcknowledgingId] = reactExports.useState(null);
  const notificationPanelRef = reactExports.useRef(null);
  const visibleNavigation = reactExports.useMemo(
    () => navigationItems.filter((item) => canAccess(item.roles, item.permissions)),
    [canAccess]
  );
  const groupedNavigation = reactExports.useMemo(() => groupNavigation(visibleNavigation), [visibleNavigation]);
  const activeItem = findNavigationItem(pathname) || visibleNavigation[0];
  const breadcrumbs = buildBreadcrumbs(pathname);
  const unreadCount = notifications.length;
  const organizationName = formatOrganizationName(user2 == null ? void 0 : user2.tenantId);
  reactExports.useEffect(() => {
    setSidebarOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);
  reactExports.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  reactExports.useEffect(() => {
    function handlePointerDown(event) {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [notificationsOpen]);
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      try {
        const items = await platformService.getNotifications(true);
        if (isMounted) {
          setNotifications(items.slice(0, 5));
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
        }
      }
    }
    void loadNotifications();
    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 9e4);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadDemoStatus() {
      try {
        const status = await platformService.getDemoStatus();
        if (isMounted) {
          setDemoStatus(status);
        }
      } catch {
        if (isMounted) {
          setDemoStatus(null);
        }
      }
    }
    if (user2 == null ? void 0 : user2.isDemoUser) {
      void loadDemoStatus();
    } else {
      setDemoStatus(null);
    }
    return () => {
      isMounted = false;
    };
  }, [user2 == null ? void 0 : user2.isDemoUser, user2 == null ? void 0 : user2.tenantId]);
  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }
  async function handleResetDemo() {
    setResettingDemo(true);
    try {
      await platformService.resetDemo();
      showToast("Sample organization reset", "The demonstration organization has been refreshed with the default sample business data.", "success");
      window.location.reload();
    } catch {
      showToast("Reset did not complete", "The sample organization could not be refreshed right now. Please try again shortly.", "danger");
    } finally {
      setResettingDemo(false);
    }
  }
  async function acknowledgeNotification(notificationId) {
    setAcknowledgingId(notificationId);
    try {
      await platformService.acknowledgeNotification(notificationId);
      setNotifications((current) => current.filter((item) => item.id !== notificationId));
    } finally {
      setAcknowledgingId(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `app-shell ${sidebarOpen ? "app-shell--sidebar-open" : ""}`, children: [
    sidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "app-shell__backdrop", onClick: () => setSidebarOpen(false), "aria-label": "Close navigation" }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sidebar", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar__brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar__logo", children: "EX" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Edgeonix ERP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Enterprise operations platform" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar__tenant-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar__tenant-badge", children: "Current organization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: organizationName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: user2 ? `${user2.roles.length} access roles active for this company context` : "Sign in to view organization details" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar__section", children: groupedNavigation.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar__section-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar__section-label", children: group.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "sidebar__nav", "aria-label": `${group.label} navigation`, children: group.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavLink,
          {
            to: item.path,
            className: ({ isActive }) => isActive ? "sidebar__link sidebar__link--active" : "sidebar__link",
            onClick: () => setSidebarOpen(false),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar__icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NavIcon, { icon: item.icon }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: item.description })
              ] })
            ]
          },
          item.key
        )) })
      ] }, group.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar__footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-chip status-chip--success", children: "Signed in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: (user2 == null ? void 0 : user2.userName) || "Signed-in user" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-shell__main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "topbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar__left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "ghost-button ghost-button--icon",
              onClick: () => setSidebarOpen((current) => !current),
              "aria-label": "Toggle navigation",
              "aria-expanded": sidebarOpen,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuIcon, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar__title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "topbar__breadcrumbs", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { children: breadcrumbs.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item.label }, `${item.label}-${index}`)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "topbar__eyebrow", children: organizationName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: (activeItem == null ? void 0 : activeItem.label) || "Command Center" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar__right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar__meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Current role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: (user2 == null ? void 0 : user2.roles[0]) ? formatRoleName(user2.roles[0]) : "Signed-in session" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: notificationPanelRef, className: "topbar__notifications", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "ghost-button topbar__notification-button",
                onClick: () => setNotificationsOpen((current) => !current),
                "aria-expanded": notificationsOpen,
                "aria-label": `Updates${unreadCount > 0 ? `, ${unreadCount} new` : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BellIcon, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Updates" }),
                  unreadCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "notification-dot", children: unreadCount }) : null
                ]
              }
            ),
            notificationsOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "notification-popover", role: "dialog", "aria-label": "Updates", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "notification-popover__header", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Organization updates" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: unreadCount > 0 ? `${unreadCount} new items` : "You're all caught up" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "ghost-button",
                    onClick: () => {
                      navigate("/organization");
                      setNotificationsOpen(false);
                    },
                    children: "View all"
                  }
                )
              ] }),
              notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "notification-popover__empty", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "No new updates" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your organization is up to date." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "notification-popover__list", children: notifications.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "notification-item", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "notification-item__body", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "notification-item__header", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.severity, tone: severityTone(item.severity) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: formatRelative(item.createdAt) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "ghost-button",
                    disabled: acknowledgingId === item.id,
                    onClick: () => void acknowledgeNotification(item.id),
                    children: acknowledgingId === item.id ? "Saving..." : "Mark as read"
                  }
                )
              ] }, item.id)) })
            ] }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar__profile", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "topbar__avatar", children: ((_a = user2 == null ? void 0 : user2.userName) == null ? void 0 : _a.slice(0, 1).toUpperCase()) || "U" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar__profile-copy", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: (user2 == null ? void 0 : user2.userName) || "User account" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (user2 == null ? void 0 : user2.email) || organizationName })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void handleLogout(), children: "Sign out" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "content-shell", children: [
        (user2 == null ? void 0 : user2.isDemoUser) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "demo-banner", "aria-label": "Demo mode status", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "demo-banner__copy", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-header__eyebrow", children: "Sample organization" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "You are viewing demonstration business data." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Changes stay inside the sample organization and can be refreshed at any time." })
          ] }),
          (demoStatus == null ? void 0 : demoStatus.canReset) ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void handleResetDemo(), disabled: resettingDemo, children: resettingDemo ? "Refreshing sample data..." : "Refresh sample data" }) : null
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
      ] })
    ] })
  ] });
}
const DashboardPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-DvofLdBD.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]) : void 0));
const UsersPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-S5Ty5VrR.js"), true ? __vite__mapDeps([14,1,15,5,6,7,12,13]) : void 0));
const CompaniesPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-Djb9vUoW.js"), true ? __vite__mapDeps([16,1,15,5,6,17,12,13]) : void 0));
const OrdersPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-394Jg_Kr.js"), true ? __vite__mapDeps([18,1,15,5,6,19,20,11,7,8,12,13]) : void 0));
const ProductsPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-RAU2Rr4t.js"), true ? __vite__mapDeps([21,1,3,4,20,15,5,6,19,10,11,7,8,12,13]) : void 0));
const FinancePage = reactExports.lazy(() => __vitePreload(() => import("./chunk-D0OuDVif.js"), true ? __vite__mapDeps([22,1,3,4,15,5,6,19,20,9,8,12,13]) : void 0));
const ReportsPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-DBXzBuvT.js"), true ? __vite__mapDeps([23,1,2,3,4,15,5,6,19,9,24,12,13]) : void 0));
const SettingsPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-Cfm0Z7Nr.js"), true ? __vite__mapDeps([25,1,15,5,6,17,11,12,13]) : void 0));
const PlatformOpsPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-CE1A9oo0.js"), true ? __vite__mapDeps([26,1,15,5,6,17,12,13]) : void 0));
const LoginPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-DavzXD9O.js"), true ? __vite__mapDeps([27,1,19,6,12,13]) : void 0));
const UnauthorizedPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-C8NCZdyo.js"), true ? __vite__mapDeps([28,1,6]) : void 0));
const NotFoundPage = reactExports.lazy(() => __vitePreload(() => import("./chunk-Mj8thzHu.js"), true ? __vite__mapDeps([29,1,6]) : void 0));
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true, state: { from: location.pathname } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayout, {});
}
function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
function AccessGuard({
  roles,
  permissions,
  children
}) {
  const { canAccess } = useAuth();
  return canAccess(roles, permissions) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/unauthorized", replace: true });
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Preparing your organization hub" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/login",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(PublicOnly, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/unauthorized", element: /* @__PURE__ */ jsxRuntimeExports.jsx(UnauthorizedPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedLayout, {}), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "users", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/access-control", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "access-control",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(AccessGuard, { permissions: ["CanManageUsers"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersPage, {}) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "companies", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/organization", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "organization", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CompaniesPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "platform-operations",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(AccessGuard, { permissions: ["CanManageUsers"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformOpsPage, {}) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "orders", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/sales-operations", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "sales-operations",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AccessGuard,
            {
              roles: ["Admin", "SalesManager", "ProjectManager", "SupportLead", "AssetManager", "ManufacturingPlanner", "HRManager"],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersPage, {})
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "products", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/supply-chain", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "supply-chain",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AccessGuard,
            {
              roles: ["Admin", "CatalogManager", "InventoryManager", "ProcurementManager", "SalesManager", "FinanceManager", "AssetManager", "ManufacturingPlanner"],
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsPage, {})
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "finance",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(AccessGuard, { permissions: ["CanViewFinance"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(FinancePage, {}) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "reports", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/analytics", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "analytics",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(AccessGuard, { permissions: ["CanViewFinance"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReportsPage, {}) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/configuration", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "configuration", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundPage, {}) })
  ] }) });
}
class ErrorBoundary extends reactExports.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      hasError: false
    });
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(_error, _errorInfo) {
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-boundary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Something went wrong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This screen could not be displayed. Refresh the page or try again in a moment." })
      ] });
    }
    return this.props.children;
  }
}
const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;
function ToastItem({ id, title, message, tone }) {
  const dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dispatch(dismissToast(id));
    }, 3500);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `toast toast--${tone}`, role: "status", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toast__body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "toast__icon", "aria-hidden": "true", children: tone === "success" ? "✓" : tone === "danger" ? "!" : tone === "warning" ? "•" : "i" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: message })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button toast__dismiss", onClick: () => dispatch(dismissToast(id)), "aria-label": "Dismiss notification", children: "Dismiss" })
  ] });
}
function ToastViewport() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  if (toasts.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast-viewport", "aria-live": "polite", "aria-atomic": "true", children: toasts.map((toast) => /* @__PURE__ */ jsxRuntimeExports.jsx(ToastItem, { id: toast.id, title: toast.title, message: toast.message, tone: toast.tone }, toast.id)) });
}
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Provider, { store, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ErrorBoundary, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastViewport, {})
  ] }) }) }) })
);
export {
  Spinner as S,
  formatRelative as a,
  StatusBadge as b,
  formatRoleName as c,
  formatPermissionName as d,
  formatDateTime as e,
  formatCurrency as f,
  formatOrganizationName as g,
  useToast as h,
  formatDate as i,
  requestPost as j,
  requestDelete as k,
  requestPut as l,
  formatCompactNumber as m,
  apiConfig as n,
  getDemoServiceHealth as o,
  platformService as p,
  buildBreadcrumbs as q,
  requestGet as r,
  formatPercent as s,
  demoAccounts as t,
  useAuth as u,
  normalizeApiError as v
};
