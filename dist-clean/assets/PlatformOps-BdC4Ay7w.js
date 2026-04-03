import { r as reactExports, j as jsxRuntimeExports, S as Spinner, g as formatOrganizationName, a as formatRelative, b as StatusBadge, e as formatDateTime, p as platformService } from "./index-CbdSSOK5.js";
import { D as DataTable } from "./DataTable-BVqaoBLJ.js";
import { P as PageHeader, S as StatCard, E as EmptyState } from "./StatCard--pOubCUx.js";
import { o as operationsService } from "./operationsService-CoMoY2aI.js";
function healthTone(status) {
  switch (status) {
    case "online":
      return "success";
    case "degraded":
      return "warning";
    default:
      return "danger";
  }
}
function messageTone(status) {
  switch (status.toLowerCase()) {
    case "processed":
    case "published":
    case "success":
      return "success";
    case "failed":
    case "error":
      return "danger";
    case "retry":
    case "pending":
    case "inflight":
      return "warning";
    default:
      return "info";
  }
}
function severityTone(value) {
  switch (value.toLowerCase()) {
    case "critical":
    case "high":
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
function PlatformOps() {
  const [loading, setLoading] = reactExports.useState(true);
  const [context, setContext] = reactExports.useState(null);
  const [operationsSummary, setOperationsSummary] = reactExports.useState(null);
  const [serviceHealth, setServiceHealth] = reactExports.useState([]);
  const [auditTrail, setAuditTrail] = reactExports.useState([]);
  const [outboxMessages, setOutboxMessages] = reactExports.useState([]);
  const [notifications, setNotifications] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadPlatformOps() {
      setLoading(true);
      const [contextResult, summaryResult, serviceHealthResult, auditResult, outboxResult, notificationResult] = await Promise.allSettled([
        platformService.getContext(),
        platformService.getOperationsSummary(),
        operationsService.getServiceHealth(),
        platformService.getAudit(40),
        platformService.getOutbox(void 0, 40),
        platformService.getNotifications(false)
      ]);
      if (!isMounted) {
        return;
      }
      setContext(contextResult.status === "fulfilled" ? contextResult.value : null);
      setOperationsSummary(summaryResult.status === "fulfilled" ? summaryResult.value : null);
      setServiceHealth(serviceHealthResult.status === "fulfilled" ? serviceHealthResult.value : []);
      setAuditTrail(auditResult.status === "fulfilled" ? auditResult.value : []);
      setOutboxMessages(outboxResult.status === "fulfilled" ? outboxResult.value : []);
      setNotifications(notificationResult.status === "fulfilled" ? notificationResult.value.slice(0, 8) : []);
      setLoading(false);
    }
    void loadPlatformOps();
    return () => {
      isMounted = false;
    };
  }, []);
  const healthyServices = reactExports.useMemo(() => serviceHealth.filter((item) => item.status === "online").length, [serviceHealth]);
  const servicesNeedingReview = reactExports.useMemo(() => serviceHealth.filter((item) => item.status !== "online").length, [serviceHealth]);
  const deliveryBacklog = (operationsSummary == null ? void 0 : operationsSummary.pendingOutboxMessages) ?? outboxMessages.filter((item) => ["pending", "retry", "inflight", "failed", "error"].includes(item.status.toLowerCase())).length;
  const unreadUpdates = reactExports.useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);
  const issueFeed = reactExports.useMemo(
    () => notifications.filter((item) => ["critical", "high", "warning", "medium"].includes(item.severity.toLowerCase())).slice(0, 5),
    [notifications]
  );
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading platform operations" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Platform Operations",
        title: "Platform operations",
        description: "Track service health, delivery backlog, audit activity, and support diagnostics from one admin control center."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Healthy services", value: healthyServices, format: "number", subtitle: "Responding to health checks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Needs review", value: servicesNeedingReview, format: "number", subtitle: "Services with degraded or offline status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Unread updates", value: (operationsSummary == null ? void 0 : operationsSummary.unreadNotifications) ?? unreadUpdates, format: "number", subtitle: "Platform and organization updates" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Delivery backlog", value: deliveryBacklog, format: "number", subtitle: "Messages waiting for delivery or retry" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Support context" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Reference details to use when reviewing activity or troubleshooting issues." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Organization" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Organization" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatOrganizationName((context == null ? void 0 : context.tenantId) || null) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Organization ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.tenantId) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Support reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (operationsSummary == null ? void 0 : operationsSummary.correlationId) || (context == null ? void 0 : context.correlationId) || "-" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Platform posture" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Durable database" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (operationsSummary == null ? void 0 : operationsSummary.usesDurableDatabase) ? "Enabled" : "Local file persistence" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Dead-letter backlog" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (operationsSummary == null ? void 0 : operationsSummary.deadLetteredOutboxMessages) ?? 0 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Recent audit records" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (operationsSummary == null ? void 0 : operationsSummary.recentAuditEntries) ?? auditTrail.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Current operator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.userName) || "-" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Priority issues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The latest warnings and updates that may need platform follow-up." })
        ] }) }),
        issueFeed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No urgent platform issues", description: "There are no high-priority updates to review right now.", compact: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: issueFeed.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: formatRelative(item.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.severity, tone: severityTone(item.severity) })
        ] }, item.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Service health",
        description: "Live health checks across the ERP service estate.",
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
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.statusLabel, tone: healthTone(row.status) })
          },
          {
            key: "detail",
            title: "Operational note",
            render: (row) => row.detail
          },
          {
            key: "checkedAt",
            title: "Checked",
            sortable: true,
            render: (row) => formatDateTime(row.checkedAt)
          }
        ],
        data: serviceHealth,
        rowKey: "id",
        searchKeys: ["service", "area", "statusLabel", "detail"],
        searchPlaceholder: "Search services",
        emptyTitle: "No service health data",
        emptyDescription: "Health checks are not available right now."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Message delivery",
          description: "Delivery status for platform messages and integrations.",
          columns: [
            {
              key: "occurredAt",
              title: "Occurred",
              sortable: true,
              render: (row) => formatDateTime(row.occurredAt)
            },
            {
              key: "topic",
              title: "Message",
              sortable: true,
              render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.topic }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.eventType })
              ] })
            },
            {
              key: "status",
              title: "Status",
              sortable: true,
              render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: messageTone(row.status) })
            },
            {
              key: "attemptCount",
              title: "Attempts",
              align: "right",
              sortable: true
            }
          ],
          data: outboxMessages,
          rowKey: "id",
          searchKeys: ["topic", "eventType", "aggregateType", "status"],
          searchPlaceholder: "Search delivery backlog",
          emptyTitle: "No delivery records",
          emptyDescription: "There are no platform delivery records to review."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Audit trail",
          description: "Recent administrative and business events.",
          columns: [
            {
              key: "occurredAt",
              title: "Occurred",
              sortable: true,
              render: (row) => formatDateTime(row.occurredAt)
            },
            {
              key: "userName",
              title: "Actor",
              sortable: true
            },
            {
              key: "action",
              title: "Action",
              sortable: true,
              render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.action }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.entityType })
              ] })
            },
            {
              key: "outcome",
              title: "Outcome",
              sortable: true,
              render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.outcome, tone: messageTone(row.outcome) })
            }
          ],
          data: auditTrail,
          rowKey: "id",
          searchKeys: ["userName", "action", "entityType", "details", "correlationId"],
          searchPlaceholder: "Search audit trail",
          emptyTitle: "No audit activity",
          emptyDescription: "There are no recent audit records to review."
        }
      )
    ] })
  ] });
}
export {
  PlatformOps as default
};
