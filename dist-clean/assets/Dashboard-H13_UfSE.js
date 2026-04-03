import { u as useAuth, r as reactExports, f as formatCurrency, j as jsxRuntimeExports, S as Spinner, a as formatRelative, b as StatusBadge, p as platformService } from "./index-CbdSSOK5.js";
import { A as AIAssistant } from "./AIAssistant-WI6b4Uo_.js";
import { T as TrendLineChart, C as CategoryBarChart } from "./Charts-jDEzrkyV.js";
import { E as EmptyState, P as PageHeader, S as StatCard } from "./StatCard--pOubCUx.js";
import { r as roleGroups } from "./rbac-DoPO7Lc7.js";
import { c as catalogService } from "./catalogService-DKXKGJBm.js";
import { f as financeService } from "./financeService-BiNhHwHK.js";
import { i as inventoryService } from "./inventoryService-Cgm8-T1N.js";
import { s as salesService } from "./salesService-CVFnTIbv.js";
const initialState = {
  catalogOverview: null,
  inventoryDashboard: null,
  orderMetrics: null,
  executiveDashboard: null,
  financeDashboard: null,
  notifications: [],
  alerts: [],
  anomalies: [],
  topCustomers: [],
  aiReadiness: null,
  cashForecasts: [],
  demandForecast: []
};
function readResult(result, fallback) {
  return result.status === "fulfilled" ? result.value : fallback;
}
function severityTone(value) {
  switch (value.toLowerCase()) {
    case "high":
    case "critical":
    case "danger":
      return "danger";
    case "medium":
    case "warning":
      return "warning";
    case "low":
    case "success":
      return "success";
    default:
      return "info";
  }
}
function buildAssistantResponse(question, dashboard, insights) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const normalizedQuestion = question.toLowerCase();
  if (normalizedQuestion.includes("revenue")) {
    const revenue = ((_a = dashboard.orderMetrics) == null ? void 0 : _a.revenueLast30Days) ?? ((_b = dashboard.executiveDashboard) == null ? void 0 : _b.revenueLast30Days) ?? 0;
    return `Sales for the last 30 days are ${formatCurrency(revenue)}. ${((_c = insights[0]) == null ? void 0 : _c.description) || "No additional sales insight is available for your access level."}`;
  }
  if (normalizedQuestion.includes("stock") || normalizedQuestion.includes("inventory")) {
    const lowStock = ((_d = dashboard.inventoryDashboard) == null ? void 0 : _d.lowStockProducts) ?? ((_e = dashboard.executiveDashboard) == null ? void 0 : _e.lowStockProducts) ?? 0;
    const inventoryValue = ((_f = dashboard.inventoryDashboard) == null ? void 0 : _f.inventoryValue) ?? ((_g = dashboard.catalogOverview) == null ? void 0 : _g.inventoryValue) ?? 0;
    return `${lowStock} products are currently low on stock, with inventory valued at ${formatCurrency(inventoryValue)}.`;
  }
  if (normalizedQuestion.includes("customer")) {
    const topCustomer = dashboard.topCustomers[0];
    return topCustomer ? `${topCustomer.name} is the leading customer right now, with lifetime value of ${formatCurrency(topCustomer.lifetimeValue)} and an open balance of ${formatCurrency(topCustomer.outstandingBalance)}.` : "Customer details are not available for your current access level.";
  }
  if (normalizedQuestion.includes("alert") || normalizedQuestion.includes("anomal")) {
    const alertCount = dashboard.alerts.length + dashboard.anomalies.length;
    return alertCount > 0 ? `There are ${alertCount} active warnings or unusual items in the areas available to you. Start with the highest-priority items in Recent activity and Priority items.` : "There are no active warnings in the areas currently available to you.";
  }
  return ((_h = insights[0]) == null ? void 0 : _h.description) || "The dashboard is ready. Ask about sales, stock, customers, or priority items.";
}
function Dashboard() {
  const { canAccess, user } = useAuth();
  const [dashboard, setDashboard] = reactExports.useState(initialState);
  const [loading, setLoading] = reactExports.useState(true);
  const canViewCatalog = canAccess(roleGroups.catalogAccess);
  const canViewInventory = canAccess(roleGroups.inventoryAccess);
  const canViewSales = canAccess(roleGroups.salesAccess);
  const canViewFinance = canAccess(void 0, ["CanViewFinance"]);
  const canManageUsers = canAccess(void 0, ["CanManageUsers"]);
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      setLoading(true);
      const [
        catalogOverviewResult,
        inventoryDashboardResult,
        orderMetricsResult,
        executiveDashboardResult,
        financeDashboardResult,
        notificationsResult,
        alertsResult,
        inventoryAnomaliesResult,
        paymentAnomaliesResult,
        customersResult,
        aiReadinessResult,
        demandForecastResult,
        cash7Result,
        cash14Result,
        cash30Result
      ] = await Promise.allSettled([
        canViewCatalog ? catalogService.getOverview() : Promise.resolve(null),
        canViewInventory ? inventoryService.getDashboard() : Promise.resolve(null),
        canViewSales ? salesService.getOrderMetrics() : Promise.resolve(null),
        canViewFinance ? financeService.getExecutiveDashboard() : Promise.resolve(null),
        canViewFinance ? financeService.getFinanceDashboard() : Promise.resolve(null),
        platformService.getNotifications(true),
        canViewFinance ? financeService.getBillingAlerts(6) : Promise.resolve([]),
        canViewInventory ? inventoryService.getAnomalies(6) : Promise.resolve([]),
        canViewFinance ? financeService.getPaymentAnomalies(6) : Promise.resolve([]),
        canViewSales ? salesService.getCustomers() : Promise.resolve([]),
        canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null),
        canViewInventory ? inventoryService.getDemandForecast(14) : Promise.resolve([]),
        canViewFinance ? financeService.getCashForecast(7) : Promise.resolve(null),
        canViewFinance ? financeService.getCashForecast(14) : Promise.resolve(null),
        canViewFinance ? financeService.getCashForecast(30) : Promise.resolve(null)
      ]);
      if (!isMounted) {
        return;
      }
      const topCustomers = [...readResult(customersResult, [])].sort((left, right) => right.lifetimeValue - left.lifetimeValue).slice(0, 5);
      const cashForecasts = [cash7Result, cash14Result, cash30Result].map((result) => readResult(result, null)).filter((item) => Boolean(item)).sort((left, right) => left.horizonDays - right.horizonDays);
      const anomalies = [...readResult(inventoryAnomaliesResult, []), ...readResult(paymentAnomaliesResult, [])].sort((left, right) => right.score - left.score).slice(0, 6);
      setDashboard({
        catalogOverview: readResult(catalogOverviewResult, null),
        inventoryDashboard: readResult(inventoryDashboardResult, null),
        orderMetrics: readResult(orderMetricsResult, null),
        executiveDashboard: readResult(executiveDashboardResult, null),
        financeDashboard: readResult(financeDashboardResult, null),
        notifications: readResult(notificationsResult, []).slice(0, 5),
        alerts: readResult(alertsResult, []).slice(0, 5),
        anomalies,
        topCustomers,
        aiReadiness: readResult(aiReadinessResult, null),
        demandForecast: readResult(demandForecastResult, []).slice(0, 6),
        cashForecasts
      });
      setLoading(false);
    }
    void loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [canManageUsers, canViewCatalog, canViewFinance, canViewInventory, canViewSales]);
  const statCards = reactExports.useMemo(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const cards = [];
    if (dashboard.orderMetrics || dashboard.executiveDashboard) {
      cards.push({
        label: "Sales last 30 days",
        value: ((_a = dashboard.orderMetrics) == null ? void 0 : _a.revenueLast30Days) ?? ((_b = dashboard.executiveDashboard) == null ? void 0 : _b.revenueLast30Days) ?? 0,
        format: "currency",
        subtitle: "Recent sales activity"
      });
      cards.push({
        label: "Open Orders",
        value: ((_c = dashboard.orderMetrics) == null ? void 0 : _c.openOrders) ?? ((_d = dashboard.executiveDashboard) == null ? void 0 : _d.openOrders) ?? 0,
        format: "number",
        subtitle: "Orders still in progress"
      });
    }
    if (dashboard.inventoryDashboard || dashboard.catalogOverview) {
      cards.push({
        label: "Inventory Value",
        value: ((_e = dashboard.inventoryDashboard) == null ? void 0 : _e.inventoryValue) ?? ((_f = dashboard.catalogOverview) == null ? void 0 : _f.inventoryValue) ?? 0,
        format: "currency",
        subtitle: "Current stock value"
      });
    }
    if (dashboard.financeDashboard || dashboard.executiveDashboard) {
      cards.push({
        label: "Past-due balance",
        value: ((_g = dashboard.financeDashboard) == null ? void 0 : _g.overdueReceivables) ?? ((_h = dashboard.executiveDashboard) == null ? void 0 : _h.outstandingBalance) ?? 0,
        format: "currency",
        subtitle: "Open balance needing follow-up"
      });
    }
    if (cards.length === 0) {
      cards.push(
        {
          label: "Unread updates",
          value: dashboard.notifications.filter((item) => !item.isRead).length,
          format: "number",
          subtitle: "New updates to review"
        },
        {
          label: "Access roles",
          value: (user == null ? void 0 : user.roles.length) ?? 0,
          format: "number",
          subtitle: "Roles on this account"
        }
      );
    }
    return cards.slice(0, 4);
  }, [dashboard, user]);
  const lineChart = reactExports.useMemo(() => {
    if (dashboard.cashForecasts.length > 0) {
      return {
        title: "Cash outlook",
        description: "Expected incoming cash and open balances over the next few planning periods.",
        valueLabel: "currency",
        primaryLabel: "Expected cash in",
        secondaryLabel: "Open balance",
        data: dashboard.cashForecasts.map((item) => ({
          label: `${item.horizonDays}d`,
          value: item.expectedCollections,
          secondaryValue: item.openReceivables
        }))
      };
    }
    if (dashboard.demandForecast.length > 0) {
      return {
        title: "Demand outlook",
        description: "Expected demand for the products most likely to need attention soon.",
        valueLabel: "number",
        primaryLabel: "Expected units",
        secondaryLabel: "Expected units",
        data: dashboard.demandForecast.map((item) => ({
          label: item.productName,
          value: item.forecastUnits
        }))
      };
    }
    return null;
  }, [dashboard.cashForecasts, dashboard.demandForecast]);
  const barData = reactExports.useMemo(() => {
    if (dashboard.demandForecast.length > 0) {
      return {
        title: "Expected demand",
        description: "Products most likely to drive replenishment needs soon.",
        valueLabel: "number",
        data: dashboard.demandForecast.map((item) => ({
          label: item.productName,
          value: item.forecastUnits
        }))
      };
    }
    if (dashboard.topCustomers.length > 0) {
      return {
        title: "Top customers",
        description: "Customers contributing the most long-term value.",
        valueLabel: "currency",
        data: dashboard.topCustomers.map((item) => ({
          label: item.name,
          value: item.lifetimeValue
        }))
      };
    }
    return null;
  }, [dashboard.demandForecast, dashboard.topCustomers]);
  const insights = reactExports.useMemo(() => {
    const items = [];
    if (dashboard.executiveDashboard && dashboard.executiveDashboard.lowStockProducts > 0) {
      items.push({
        id: "stock-pressure",
        title: "Low stock needs attention",
        description: `${dashboard.executiveDashboard.lowStockProducts} products are running low, with ${formatCurrency(dashboard.executiveDashboard.atRiskRevenue)} in sales potentially affected.`,
        tone: "warning"
      });
    }
    if (dashboard.financeDashboard && dashboard.financeDashboard.workingCapitalIndicator >= 1) {
      items.push({
        id: "working-capital",
        title: "Cash position is steady",
        description: `Working capital is ${dashboard.financeDashboard.workingCapitalIndicator.toFixed(2)} with payroll running at ${formatCurrency(dashboard.financeDashboard.monthlyPayrollRunRate)} per month.`,
        tone: "success"
      });
    }
    if (dashboard.topCustomers[0]) {
      items.push({
        id: "customer-focus",
        title: "One customer stands out",
        description: `${dashboard.topCustomers[0].name} currently leads customer value with ${formatCurrency(dashboard.topCustomers[0].lifetimeValue)} in lifetime value.`,
        tone: "info"
      });
    }
    if (dashboard.aiReadiness) {
      items.push({
        id: "ai-readiness",
        title: "AI setup is available",
        description: `${dashboard.aiReadiness.provider} is ${dashboard.aiReadiness.aiEnabled ? "enabled" : "disabled"} with ${dashboard.aiReadiness.useCases.filter((item) => item.enabled).length} active use cases.`,
        tone: dashboard.aiReadiness.aiEnabled ? "success" : "warning"
      });
    }
    if (items.length === 0) {
      items.push({
        id: "baseline",
        title: "Dashboard is ready",
        description: "Updates and account-level information are available even when some areas are hidden by role.",
        tone: "info"
      });
    }
    return items.slice(0, 4);
  }, [dashboard.aiReadiness, dashboard.executiveDashboard, dashboard.financeDashboard, dashboard.topCustomers]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading your dashboard" });
  }
  const hasPrimaryData = statCards.length > 0 || dashboard.notifications.length > 0 || dashboard.topCustomers.length > 0 || dashboard.anomalies.length > 0;
  if (!hasPrimaryData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Dashboard unavailable", description: "We could not load dashboard information for this session." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Command Center",
        title: "Business command center",
        description: "Review revenue, cash, supply, and current priorities from one role-aware dashboard."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "stat-grid", children: statCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: card.label, value: card.value, format: card.format, subtitle: card.subtitle }, card.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: (lineChart == null ? void 0 : lineChart.title) || "Forecast trend" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: (lineChart == null ? void 0 : lineChart.description) || "Trend information appears here when forecast data is available." })
        ] }) }),
        lineChart ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          TrendLineChart,
          {
            data: lineChart.data,
            valueLabel: lineChart.valueLabel,
            primaryLabel: lineChart.primaryLabel,
            secondaryLabel: lineChart.secondaryLabel
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Trend data unavailable", description: "Forecast information is not available for your current access level.", compact: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: (barData == null ? void 0 : barData.title) || "Operational mix" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: (barData == null ? void 0 : barData.description) || "Comparison details appear here when customer or demand data is available." })
        ] }) }),
        barData ? /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBarChart, { data: barData.data, valueLabel: barData.valueLabel }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Comparison unavailable", description: "There is no ranked comparison data available for your current access level.", compact: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Recent activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Recent updates, reminders, and workflow changes." })
        ] }) }),
        dashboard.notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No recent updates", description: "There are no new updates to review right now.", compact: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: dashboard.notifications.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: formatRelative(item.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.severity, tone: severityTone(item.severity) })
        ] }, item.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Insights panel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Short highlights to help you focus on what needs attention." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: insights.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.tone, tone: item.tone })
        ] }, item.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Top customers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Customers generating the most value and open balance." })
        ] }) }),
        dashboard.topCustomers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Customer details unavailable", description: "Customer rankings are not available for your current access level.", compact: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: dashboard.topCustomers.map((customer) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: customer.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: customer.segment })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-stack", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(customer.lifetimeValue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              formatCurrency(customer.outstandingBalance),
              " outstanding"
            ] })
          ] })
        ] }, customer.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Anomaly indicators" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Priority items that may need follow-up." })
        ] }) }),
        dashboard.anomalies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No priority items", description: "There are no unusual items needing attention right now.", compact: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: dashboard.anomalies.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.narrative })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: `${item.domain} / ${item.severity}`, tone: severityTone(item.severity) })
        ] }, `${item.domain}-${item.title}`)) })
      ] })
    ] }),
    dashboard.alerts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Finance alerts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Items needing follow-up from billing and collections." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: dashboard.alerts.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.area }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.severity, tone: severityTone(item.severity) })
      ] }, `${item.area}-${item.message}`)) })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AIAssistant,
      {
        initialMessage: "I can summarize the key numbers and highlights on this dashboard. Ask about sales, stock, customers, or priority items.",
        suggestions: ["Where is the biggest operational risk?", "Summarize revenue and receivables", "What should ops review first?"],
        generateResponse: (question) => buildAssistantResponse(question, dashboard, insights)
      }
    )
  ] });
}
export {
  Dashboard as default
};
