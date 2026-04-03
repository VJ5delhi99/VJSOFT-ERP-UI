import { j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
import { u as useLocation, L as Link } from "./chunk-CzznHu47.js";
import { q as buildBreadcrumbs, s as formatPercent, f as formatCurrency, m as formatCompactNumber } from "./app-C4Pvg4H3.js";
function EmptyState({ title, description, compact = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: compact ? "empty-state empty-state--compact" : "empty-state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state__icon", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v9A2.5 2.5 0 0 1 17.5 18H11l-3.5 2.5V18h-1A2.5 2.5 0 0 1 4 15.5v-9Zm2.5-.5a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5H9.5v.61L11.64 16h5.86a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-11Z" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: description })
  ] });
}
function PageHeader({ eyebrow, title, description, actions }) {
  const { pathname } = useLocation();
  const breadcrumbs = buildBreadcrumbs(pathname);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-header", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-header__content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "page-header__breadcrumbs", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { children: breadcrumbs.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item.path ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.path, children: item.label }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-current": "page", children: item.label }) }, `${item.label}-${index}`)) }) }),
      eyebrow ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-header__eyebrow", children: eyebrow }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: description })
    ] }),
    actions ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-header__actions", children: actions }) : null
  ] });
}
function StatCard({ label, value, change, format, subtitle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "stat-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card__header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      typeof change === "number" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: change >= 0 ? "status-chip status-chip--success" : "status-chip status-chip--warning", children: formatPercent(change) }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: format === "currency" ? formatCurrency(value) : formatCompactNumber(value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: subtitle })
  ] });
}
export {
  EmptyState as E,
  PageHeader as P,
  StatCard as S
};
