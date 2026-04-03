import { r as reactExports, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
import { u as useAuth, g as formatOrganizationName, S as Spinner, c as formatRoleName, b as StatusBadge, f as formatCurrency, e as formatDateTime, p as platformService } from "./app-C4Pvg4H3.js";
import { D as DataTable } from "./chunk-BhPLEvpZ.js";
import { P as PageHeader, S as StatCard, E as EmptyState } from "./chunk-CaIpWVc3.js";
import { o as operationsService } from "./chunk-Dkm-VSb9.js";
import "./chunk-DYvrnLMg.js";
import "./chunk-CzznHu47.js";
import "./chunk-BFW3X9Eb.js";
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
function Companies() {
  const { user, canAccess } = useAuth();
  const [loading, setLoading] = reactExports.useState(true);
  const [unreadOnly, setUnreadOnly] = reactExports.useState(false);
  const [acknowledgingId, setAcknowledgingId] = reactExports.useState(null);
  const [context, setContext] = reactExports.useState(null);
  const [notifications, setNotifications] = reactExports.useState([]);
  const [aiReadiness, setAiReadiness] = reactExports.useState(null);
  const [serviceHealth, setServiceHealth] = reactExports.useState([]);
  const [organizationOverview, setOrganizationOverview] = reactExports.useState(null);
  const canManageUsers = canAccess(void 0, ["CanManageUsers"]);
  async function loadOrganizationHub(currentUnreadOnly) {
    setLoading(true);
    const [contextResult, notificationsResult, aiReadinessResult, serviceHealthResult, overviewResult] = await Promise.allSettled([
      platformService.getContext(),
      platformService.getNotifications(currentUnreadOnly),
      canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null),
      canManageUsers ? operationsService.getServiceHealth() : Promise.resolve([]),
      platformService.getOrganizationOverview()
    ]);
    setContext(contextResult.status === "fulfilled" ? contextResult.value : null);
    setNotifications(notificationsResult.status === "fulfilled" ? notificationsResult.value : []);
    setAiReadiness(aiReadinessResult.status === "fulfilled" ? aiReadinessResult.value : null);
    setServiceHealth(serviceHealthResult.status === "fulfilled" ? serviceHealthResult.value : []);
    setOrganizationOverview(overviewResult.status === "fulfilled" ? overviewResult.value : null);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void loadOrganizationHub(unreadOnly);
  }, [canManageUsers, unreadOnly]);
  async function acknowledgeNotification(notificationId) {
    setAcknowledgingId(notificationId);
    try {
      await platformService.acknowledgeNotification(notificationId);
      await loadOrganizationHub(unreadOnly);
    } finally {
      setAcknowledgingId(null);
    }
  }
  const unreadCount = reactExports.useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);
  const enabledAiUseCases = (aiReadiness == null ? void 0 : aiReadiness.useCases.filter((item) => item.enabled).length) ?? 0;
  const onlineServices = serviceHealth.filter((item) => item.status === "online").length;
  const organizationName = formatOrganizationName((context == null ? void 0 : context.tenantId) || (user == null ? void 0 : user.tenantId));
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading organization hub" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Organization Hub",
        title: organizationName,
        description: "Review business health, organization updates, and readiness indicators from one place.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setUnreadOnly((current) => !current), children: unreadOnly ? "Show all updates" : "Show unread only" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open orders", value: (organizationOverview == null ? void 0 : organizationOverview.openOrders) ?? 0, format: "number", subtitle: "Customer commitments still in progress" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Low-stock items",
          value: (organizationOverview == null ? void 0 : organizationOverview.lowStockProducts) ?? 0,
          format: "number",
          subtitle: "Items that need replenishment attention"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Outstanding balance",
          value: (organizationOverview == null ? void 0 : organizationOverview.outstandingBalance) ?? 0,
          format: "currency",
          subtitle: "Open receivables still awaiting collection"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Unread updates", value: unreadCount, format: "number", subtitle: "New organization notices and alerts" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Organization profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Business context, access posture, and support details for this company." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Company context" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Organization" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: organizationName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Organization ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.tenantId) || (user == null ? void 0 : user.tenantId) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Support reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.correlationId) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Signed-in user" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.userName) || (user == null ? void 0 : user.userName) || "-" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Access posture" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Active access roles" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: (user == null ? void 0 : user.roles.map((role) => formatRoleName(role)).join(", ")) || "No active roles" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: `${(user == null ? void 0 : user.roles.length) ?? 0} roles`, tone: "info" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Operational coverage" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: onlineServices > 0 ? `${onlineServices} services are responding to health checks.` : "Service health data is limited for this account." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: onlineServices > 0 ? "Connected" : "Limited", tone: onlineServices > 0 ? "success" : "warning" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Readiness overview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Signals that help determine whether the organization is ready for scaled daily use." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Catalog and stock visibility" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: organizationOverview ? `${organizationOverview.activeProducts} active products with ${organizationOverview.lowStockProducts} items needing replenishment follow-up.` : "Catalog visibility is not available for this account." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: organizationOverview ? "Available" : "Restricted", tone: organizationOverview ? "success" : "warning" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Finance follow-up posture" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: organizationOverview ? `${organizationOverview.overdueInvoices} past-due invoices with ${formatCurrency(organizationOverview.outstandingBalance)} still awaiting collection.` : "Finance visibility is not available for this account." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: organizationOverview ? "Tracked" : "Restricted", tone: organizationOverview ? "info" : "warning" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Open operational workload" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: organizationOverview ? `${organizationOverview.openProjects} projects, ${organizationOverview.openTickets} service cases, and ${organizationOverview.openWorkOrders} work orders are still open.` : "Operational workload is not available right now." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: organizationOverview ? "Visible" : "Restricted", tone: organizationOverview ? "success" : "warning" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "AI and automation readiness" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: aiReadiness ? `${enabledAiUseCases} active AI use cases with ${aiReadiness.provider} as the configured provider.` : "AI readiness details are limited to administrators." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: (aiReadiness == null ? void 0 : aiReadiness.aiEnabled) ? "Enabled" : aiReadiness ? "Configured" : "Restricted", tone: (aiReadiness == null ? void 0 : aiReadiness.aiEnabled) ? "success" : "warning" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Organization updates",
        description: "Review organization notices and mark them as read from this hub.",
        columns: [
          {
            key: "createdAt",
            title: "Created",
            sortable: true,
            render: (row) => formatDateTime(row.createdAt)
          },
          {
            key: "title",
            title: "Update",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.type })
            ] })
          },
          {
            key: "message",
            title: "Details",
            render: (row) => row.message
          },
          {
            key: "severity",
            title: "Priority",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.severity, tone: severityTone(row.severity) })
          },
          {
            key: "isRead",
            title: "Status",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.isRead ? "Read" : "Unread", tone: row.isRead ? "success" : "warning" })
          },
          {
            key: "actions",
            title: "Action",
            render: (row) => row.isRead ? "Read" : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "ghost-button",
                disabled: acknowledgingId === row.id,
                onClick: () => void acknowledgeNotification(row.id),
                children: acknowledgingId === row.id ? "Saving..." : "Mark as read"
              }
            )
          }
        ],
        data: notifications,
        rowKey: "id",
        searchKeys: ["title", "type", "message", "severity"],
        searchPlaceholder: "Search organization updates",
        emptyTitle: "No organization updates",
        emptyDescription: "This organization is up to date."
      }
    ),
    canManageUsers ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Service readiness",
        description: "Service health checks available to administrators.",
        columns: [
          {
            key: "service",
            title: "Service",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.service }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.area })
            ] })
          },
          {
            key: "statusLabel",
            title: "Status",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.statusLabel, tone: row.status === "online" ? "success" : row.status === "degraded" ? "warning" : "danger" })
          },
          {
            key: "detail",
            title: "Operational note",
            render: (row) => row.detail
          }
        ],
        data: serviceHealth,
        rowKey: "id",
        searchKeys: ["service", "area", "detail", "statusLabel"],
        searchPlaceholder: "Search service readiness",
        emptyTitle: "No readiness data",
        emptyDescription: "Service readiness data is not available right now."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Admin readiness data is limited", description: "Service readiness and AI setup details are available to administrators only.", compact: true })
  ] });
}
export {
  Companies as default
};
