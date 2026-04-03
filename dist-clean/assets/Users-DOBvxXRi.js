import { u as useAuth, r as reactExports, j as jsxRuntimeExports, S as Spinner, c as formatRoleName, d as formatPermissionName, b as StatusBadge, e as formatDateTime, p as platformService } from "./index-CbdSSOK5.js";
import { D as DataTable } from "./DataTable-BVqaoBLJ.js";
import { P as PageHeader, S as StatCard, E as EmptyState } from "./StatCard--pOubCUx.js";
import { e as erpRoles, a as rolePermissionMap, r as roleGroups } from "./rbac-DoPO7Lc7.js";
function toneFromStatus(value) {
  switch (value.toLowerCase()) {
    case "success":
    case "processed":
    case "published":
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
function modulesForRole(role) {
  const modules = [];
  if (roleGroups.catalogAccess.includes(role)) {
    modules.push("Catalog setup");
  }
  if (roleGroups.inventoryAccess.includes(role)) {
    modules.push("Supply chain");
  }
  if (roleGroups.salesAccess.includes(role)) {
    modules.push("Sales delivery");
  }
  if (roleGroups.financeAccess.includes(role)) {
    modules.push("Finance");
  }
  if (roleGroups.operationsAccess.includes(role)) {
    modules.push("Service operations");
  }
  return modules;
}
function Users() {
  const { user } = useAuth();
  const [loading, setLoading] = reactExports.useState(true);
  const [context, setContext] = reactExports.useState(null);
  const [auditTrail, setAuditTrail] = reactExports.useState([]);
  const [outboxMessages, setOutboxMessages] = reactExports.useState([]);
  const roleMatrix = reactExports.useMemo(
    () => erpRoles.map((role) => ({
      id: role,
      role,
      permissions: rolePermissionMap[role],
      modules: modulesForRole(role)
    })),
    []
  );
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadAccessControl() {
      setLoading(true);
      const [contextResult, auditResult, outboxResult] = await Promise.allSettled([
        platformService.getContext(),
        platformService.getAudit(25),
        platformService.getOutbox(void 0, 25)
      ]);
      if (!isMounted) {
        return;
      }
      setContext(contextResult.status === "fulfilled" ? contextResult.value : null);
      setAuditTrail(auditResult.status === "fulfilled" ? auditResult.value : []);
      setOutboxMessages(outboxResult.status === "fulfilled" ? outboxResult.value : []);
      setLoading(false);
    }
    void loadAccessControl();
    return () => {
      isMounted = false;
    };
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading access information" });
  }
  const pendingOutbox = outboxMessages.filter(
    (item) => ["pending", "retry", "inflight"].includes(item.status.toLowerCase())
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Access & Audit",
        title: "Access and audit",
        description: "Review role coverage, recent administrative activity, and delivery history in one place."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Assigned roles", value: (user == null ? void 0 : user.roles.length) ?? 0, format: "number", subtitle: "Roles on this account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Effective permissions", value: (user == null ? void 0 : user.permissions.length) ?? 0, format: "number", subtitle: "Available actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Recent activity", value: auditTrail.length, format: "number", subtitle: "Latest access and admin changes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Pending messages", value: pendingOutbox, format: "number", subtitle: "Updates waiting to be delivered" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Signed-in user" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Signed-in user details and current organization information." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Identity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (user == null ? void 0 : user.userName) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (user == null ? void 0 : user.email) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Organization" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (user == null ? void 0 : user.tenantId) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (user == null ? void 0 : user.isActive) ? "Yes" : "No" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Session details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "User ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.userId) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Support reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.correlationId) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Roles" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (user == null ? void 0 : user.roles.map((role) => formatRoleName(role)).join(", ")) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Permissions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (user == null ? void 0 : user.permissions.map((permission) => formatPermissionName(permission)).join(", ")) || "No direct permissions" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "What this page covers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This area focuses on user access, activity history, and message delivery." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Access is role-based" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Pages and actions follow the same role and permission rules enforced by the backend." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Access rules", tone: "info" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Activity and delivery history stay visible" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Administrators can review recent changes and outbound delivery records from one control point." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Admin tools", tone: "success" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Visibility stays aligned with policy" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Menu items and buttons only appear when the signed-in role can use them." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Policy aligned", tone: "warning" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Roles and access",
        description: "Roles and the areas available to each one.",
        columns: [
          {
            key: "role",
            title: "Role",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatRoleName(row.role) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.modules.join(", ") || "General access" })
            ] })
          },
          {
            key: "modules",
            title: "Areas",
            render: (row) => row.modules.join(", ") || "Signed-in access only"
          },
          {
            key: "permissions",
            title: "Permissions",
            render: (row) => row.permissions.length > 0 ? row.permissions.map((permission) => formatPermissionName(permission)).join(", ") : "Handled through the role"
          }
        ],
        data: roleMatrix,
        rowKey: "id",
        searchKeys: ["role", "modules", "permissions"],
        searchPlaceholder: "Search roles, areas, or permissions"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Recent audit activity",
        description: "Recent access and administration changes.",
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
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.outcome, tone: toneFromStatus(row.outcome) })
          },
          {
            key: "details",
            title: "Details",
            render: (row) => row.details
          }
        ],
        data: auditTrail,
        rowKey: "id",
        searchKeys: ["userName", "action", "entityType", "details"],
        searchPlaceholder: "Search recent activity",
        emptyTitle: "No recent activity",
        emptyDescription: "There are no recent access or admin updates to review."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Delivery history",
        description: "Outbound messages and delivery progress.",
        columns: [
          {
            key: "occurredAt",
            title: "Occurred",
            sortable: true,
            render: (row) => formatDateTime(row.occurredAt)
          },
          {
            key: "topic",
            title: "Topic",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.topic }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.eventType })
            ] })
          },
          {
            key: "aggregateType",
            title: "Reference",
            sortable: true,
            render: (row) => `${row.aggregateType}${row.aggregateId ? ` / ${row.aggregateId}` : ""}`
          },
          {
            key: "status",
            title: "Status",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: toneFromStatus(row.status) })
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
        searchPlaceholder: "Search messages",
        emptyTitle: "No messages",
        emptyDescription: "There are no outbound messages to review right now."
      }
    ),
    auditTrail.length === 0 && outboxMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Nothing new to review", description: "Recent activity and message delivery are both clear right now.", compact: true }) : null
  ] });
}
export {
  Users as default
};
