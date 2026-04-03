import { r as reactExports, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
import { u as useAuth, g as formatOrganizationName, S as Spinner, n as apiConfig, b as StatusBadge, e as formatDateTime, c as formatRoleName, p as platformService } from "./app-C4Pvg4H3.js";
import { D as DataTable } from "./chunk-BhPLEvpZ.js";
import { P as PageHeader, S as StatCard, E as EmptyState } from "./chunk-CaIpWVc3.js";
import { o as operationsService } from "./chunk-Dkm-VSb9.js";
import { s as salesService } from "./chunk-BTMvV6bG.js";
import "./chunk-DYvrnLMg.js";
import "./chunk-CzznHu47.js";
import "./chunk-BFW3X9Eb.js";
function Settings() {
  const { user, expiresAtUtc, canAccess } = useAuth();
  const [loading, setLoading] = reactExports.useState(true);
  const [context, setContext] = reactExports.useState(null);
  const [aiReadiness, setAiReadiness] = reactExports.useState(null);
  const [serviceHealth, setServiceHealth] = reactExports.useState([]);
  const [industryProfiles, setIndustryProfiles] = reactExports.useState([]);
  const [workflowTemplates, setWorkflowTemplates] = reactExports.useState([]);
  const [accessSummary, setAccessSummary] = reactExports.useState(null);
  const [activatingIndustry, setActivatingIndustry] = reactExports.useState(null);
  const canManageUsers = canAccess(void 0, ["CanManageUsers"]);
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadConfiguration() {
      setLoading(true);
      const [contextResult, aiReadinessResult, healthResult, profilesResult, workflowsResult, accessSummaryResult] = await Promise.allSettled([
        platformService.getContext(),
        canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null),
        canManageUsers ? operationsService.getServiceHealth() : Promise.resolve([]),
        platformService.getIndustryProfiles(),
        platformService.getWorkflowTemplates(),
        salesService.getAccessControlSummary()
      ]);
      if (!isMounted) {
        return;
      }
      setContext(contextResult.status === "fulfilled" ? contextResult.value : null);
      setAiReadiness(aiReadinessResult.status === "fulfilled" ? aiReadinessResult.value : null);
      setServiceHealth(healthResult.status === "fulfilled" ? healthResult.value : []);
      setIndustryProfiles(profilesResult.status === "fulfilled" ? profilesResult.value : []);
      setWorkflowTemplates(workflowsResult.status === "fulfilled" ? workflowsResult.value : []);
      setAccessSummary(accessSummaryResult.status === "fulfilled" ? accessSummaryResult.value : null);
      setLoading(false);
    }
    void loadConfiguration();
    return () => {
      isMounted = false;
    };
  }, [canManageUsers]);
  const activeIntegrations = reactExports.useMemo(
    () => serviceHealth.filter((service) => service.status === "online").length,
    [serviceHealth]
  );
  const enabledAiUseCases = (aiReadiness == null ? void 0 : aiReadiness.useCases.filter((item) => item.enabled).length) ?? 0;
  const organizationName = formatOrganizationName((context == null ? void 0 : context.tenantId) || (user == null ? void 0 : user.tenantId));
  const activeIndustry = reactExports.useMemo(
    () => industryProfiles.find((profile) => profile.isActive) || null,
    [industryProfiles]
  );
  async function activateIndustryProfile(industryCode) {
    setActivatingIndustry(industryCode);
    try {
      const [profiles, workflows] = await Promise.all([
        platformService.activateIndustryProfile(industryCode).then(() => platformService.getIndustryProfiles()),
        platformService.getWorkflowTemplates(industryCode)
      ]);
      setIndustryProfiles(profiles);
      setWorkflowTemplates(workflows);
    } finally {
      setActivatingIndustry(null);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading configuration" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Configuration",
        title: "Configuration and integrations",
        description: "Review session context, connection readiness, and AI setup for this organization."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Connected services", value: serviceHealth.length || Object.keys(apiConfig.services).length, format: "number", subtitle: "Configured ERP modules" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Healthy integrations", value: activeIntegrations, format: "number", subtitle: "Services responding to health checks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Access roles", value: (user == null ? void 0 : user.roles.length) ?? 0, format: "number", subtitle: "Roles assigned to this account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "AI use cases", value: enabledAiUseCases, format: "number", subtitle: "Enabled AI capabilities" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card enterprise-summary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Industry configuration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Activate the operating profile that best matches your current business model and workflow defaults." })
        ] }) }),
        activeIndustry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: activeIndustry.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: activeIndustry.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Active profile", tone: "success" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tag-cloud", children: activeIndustry.enabledModules.map((module) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag-chip", children: module }, module)) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No industry profile active", description: "Activate an industry profile to align workflows and reporting focus.", compact: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Access coverage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Current tenant roles, permissions, and organization structure." })
        ] }) }),
        accessSummary ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Roles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: accessSummary.roles.join(", ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-inline", children: accessSummary.roles.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Permissions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: accessSummary.permissions.join(", ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-inline", children: accessSummary.permissions.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Companies / branches" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                accessSummary.companies.length,
                " companies and ",
                accessSummary.branches.length,
                " branches are currently configured."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Tenant aware", tone: "info" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Access summary unavailable", description: "Access coverage details are not available right now.", compact: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Session context" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Current sign-in and support details for this organization." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Signed-in user" }),
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: organizationName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Session expires" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: expiresAtUtc ? formatDateTime(expiresAtUtc) : "-" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Support details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Support reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (context == null ? void 0 : context.correlationId) || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Environment" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: apiConfig.environment })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Primary role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: (user == null ? void 0 : user.roles[0]) ? formatRoleName(user.roles[0]) : "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Request timeout" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { children: [
                  apiConfig.requestTimeoutMs,
                  " ms"
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Configuration guidance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Operational reminders for keeping the organization healthy and supportable." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Connections are centrally configured" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Each business area uses the shared service registry so connection changes stay consistent across the product." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Centralized", tone: "success" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Organization context is enforced" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Requests carry organization context so each service returns the correct business data." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Protected", tone: "warning" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Support references matter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Use the support reference above whenever you need to trace activity with the product or platform team." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Support ready", tone: "info" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Connected modules",
        description: "Connection readiness across the ERP service landscape.",
        columns: [
          {
            key: "service",
            title: "Module",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.service }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.area })
            ] })
          },
          {
            key: "statusLabel",
            title: "Readiness",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.statusLabel, tone: row.status === "online" ? "success" : row.status === "degraded" ? "warning" : "danger" })
          },
          {
            key: "detail",
            title: "Operational note",
            render: (row) => row.detail
          },
          {
            key: "baseUrl",
            title: "Address",
            render: (row) => row.baseUrl
          }
        ],
        data: serviceHealth,
        rowKey: "id",
        searchKeys: ["service", "area", "detail", "baseUrl"],
        searchPlaceholder: "Search connected modules",
        emptyTitle: "No connection details",
        emptyDescription: "Connection details are not available right now."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Industry profiles",
        description: "Supported industry operating models and their activation state.",
        columns: [
          {
            key: "name",
            title: "Industry",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.description })
            ] })
          },
          {
            key: "enabledModules",
            title: "Modules",
            render: (row) => row.enabledModules.join(", ")
          },
          {
            key: "workflowTemplates",
            title: "Workflow packs",
            render: (row) => row.workflowTemplates.join(", ")
          },
          {
            key: "isActive",
            title: "State",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.isActive ? "Active" : "Available", tone: row.isActive ? "success" : "info" })
          },
          {
            key: "actions",
            title: "Actions",
            render: (row) => row.isActive ? "In use" : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void activateIndustryProfile(row.industryCode), disabled: activatingIndustry === row.industryCode, children: activatingIndustry === row.industryCode ? "Activating..." : "Activate" })
          }
        ],
        data: industryProfiles,
        rowKey: "industryCode",
        searchKeys: ["industryCode", "name", "description"],
        searchPlaceholder: "Search industry profiles",
        emptyTitle: "No industry profiles",
        emptyDescription: "Industry operating profiles are not available right now."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Workflow templates",
        description: "Default workflow stages and SLAs published by the active industry model.",
        columns: [
          {
            key: "name",
            title: "Workflow",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.department })
            ] })
          },
          {
            key: "industryCode",
            title: "Industry",
            sortable: true
          },
          {
            key: "stages",
            title: "Stages",
            render: (row) => row.stages.join(" -> ")
          },
          {
            key: "slaHours",
            title: "SLA",
            sortable: true,
            render: (row) => `${row.slaHours}h`
          },
          {
            key: "isDefault",
            title: "Default",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.isDefault ? "Default" : "Optional", tone: row.isDefault ? "success" : "neutral" })
          }
        ],
        data: workflowTemplates,
        rowKey: "id",
        searchKeys: ["templateCode", "name", "industryCode", "department"],
        searchPlaceholder: "Search workflow templates",
        emptyTitle: "No workflow templates",
        emptyDescription: "Workflow definitions are not available right now."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "AI readiness" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Available AI provider and enabled use cases for this organization." })
      ] }) }),
      aiReadiness ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: aiReadiness.provider }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Configured AI provider" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: aiReadiness.aiEnabled ? "Enabled" : "Configured only", tone: aiReadiness.aiEnabled ? "success" : "warning" })
        ] }),
        aiReadiness.useCases.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              item.dataSource,
              " / ",
              item.integrationPattern
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.enabled ? "Active" : "Inactive", tone: item.enabled ? "success" : "neutral" })
        ] }, item.name))
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "AI readiness is limited", description: "AI setup details are available to administrators who manage access and platform setup.", compact: true })
    ] })
  ] });
}
export {
  Settings as default
};
