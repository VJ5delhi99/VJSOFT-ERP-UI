import { h as useToast, r as reactExports, j as jsxRuntimeExports, S as Spinner, f as formatCurrency, b as StatusBadge, i as formatDate, e as formatDateTime, u as useAuth } from "./index-CbdSSOK5.js";
import { u as useForm, I as InputField, S as SelectField, T as TextAreaField } from "./FormField-COL4ilW-.js";
import { T as TrendLineChart, C as CategoryBarChart } from "./Charts-jDEzrkyV.js";
import { D as DataTable } from "./DataTable-BVqaoBLJ.js";
import { S as StatCard, E as EmptyState, P as PageHeader } from "./StatCard--pOubCUx.js";
import { M as Modal, S as SegmentedControl } from "./SegmentedControl-Bk_4e3lR.js";
import { f as financeService } from "./financeService-BiNhHwHK.js";
import { c as catalogService } from "./catalogService-DKXKGJBm.js";
function tone(status) {
  switch (status.toLowerCase()) {
    case "healthy":
    case "approved":
    case "matched":
    case "delivered":
    case "awarded":
      return "success";
    case "submitted":
    case "issued":
    case "configured":
      return "info";
    case "variance":
    case "pending":
      return "warning";
    default:
      return "danger";
  }
}
function FinanceEnterprisePanel({ products, suppliers }) {
  const { showToast } = useToast();
  const [loading, setLoading] = reactExports.useState(true);
  const [requisitions, setRequisitions] = reactExports.useState([]);
  const [rfqs, setRfqs] = reactExports.useState([]);
  const [matches, setMatches] = reactExports.useState([]);
  const [integrationOverview, setIntegrationOverview] = reactExports.useState(null);
  const [connections, setConnections] = reactExports.useState([]);
  const [webhooks, setWebhooks] = reactExports.useState([]);
  const [requisitionOpen, setRequisitionOpen] = reactExports.useState(false);
  const [rfqOpen, setRfqOpen] = reactExports.useState(false);
  const [integrationOpen, setIntegrationOpen] = reactExports.useState(false);
  const [webhookOpen, setWebhookOpen] = reactExports.useState(false);
  const [requisitionStatusOpen, setRequisitionStatusOpen] = reactExports.useState(false);
  const [vendorComparisonOpen, setVendorComparisonOpen] = reactExports.useState(false);
  const [webhookDeliveryOpen, setWebhookDeliveryOpen] = reactExports.useState(false);
  const [selectedRequisition, setSelectedRequisition] = reactExports.useState(null);
  const [selectedComparison, setSelectedComparison] = reactExports.useState(null);
  const [selectedWebhook, setSelectedWebhook] = reactExports.useState(null);
  const requisitionForm = useForm({ defaultValues: { department: "", requestedBy: "", justification: "", productId: "", quantity: 1, estimatedUnitCost: 0 } });
  const rfqForm = useForm({ defaultValues: { requisitionId: "", title: "", responseWindowDays: 7, supplierId: "", quotedAmount: 0, leadTimeDays: 7 } });
  const integrationForm = useForm({ defaultValues: { name: "", type: "CRM", provider: "", endpointUrl: "" } });
  const webhookForm = useForm({ defaultValues: { name: "", topic: "sales", targetUrl: "", secretReference: "" } });
  const requisitionStatusForm = useForm({ defaultValues: { status: "Approved" } });
  const webhookDeliveryForm = useForm({ defaultValues: { deliveryStatus: "Delivered" } });
  async function loadFinanceEnterprise() {
    setLoading(true);
    const [requisitionsResult, rfqsResult, matchesResult, overviewResult, connectionsResult, webhooksResult] = await Promise.allSettled([
      financeService.getPurchaseRequisitions(),
      financeService.getRequestForQuotes(),
      financeService.getThreeWayMatches(),
      financeService.getIntegrationOverview(),
      financeService.getIntegrationConnections(),
      financeService.getWebhookSubscriptions()
    ]);
    setRequisitions(requisitionsResult.status === "fulfilled" ? requisitionsResult.value : []);
    setRfqs(rfqsResult.status === "fulfilled" ? rfqsResult.value : []);
    setMatches(matchesResult.status === "fulfilled" ? matchesResult.value : []);
    setIntegrationOverview(overviewResult.status === "fulfilled" ? overviewResult.value : null);
    setConnections(connectionsResult.status === "fulfilled" ? connectionsResult.value : []);
    setWebhooks(webhooksResult.status === "fulfilled" ? webhooksResult.value : []);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void loadFinanceEnterprise();
  }, []);
  async function submitRequisition(values) {
    await financeService.createPurchaseRequisition({
      department: values.department,
      requestedBy: values.requestedBy,
      justification: values.justification,
      lines: [{ productId: values.productId, quantity: Number(values.quantity), estimatedUnitCost: Number(values.estimatedUnitCost) }]
    });
    showToast("Requisition created", "The procurement intake request was saved.", "success");
    setRequisitionOpen(false);
    await loadFinanceEnterprise();
  }
  async function submitRfq(values) {
    await financeService.createRequestForQuote({
      requisitionId: values.requisitionId || void 0,
      title: values.title,
      responseWindowDays: Number(values.responseWindowDays),
      supplierQuotes: [{ supplierId: values.supplierId, quotedAmount: Number(values.quotedAmount), leadTimeDays: Number(values.leadTimeDays) }]
    });
    showToast("RFQ created", "The sourcing request is now visible in procurement.", "success");
    setRfqOpen(false);
    await loadFinanceEnterprise();
  }
  async function submitIntegration(values) {
    await financeService.createIntegrationConnection(values);
    showToast("Integration saved", "The external connector is now registered.", "success");
    setIntegrationOpen(false);
    await loadFinanceEnterprise();
  }
  async function submitWebhook(values) {
    await financeService.createWebhookSubscription(values);
    showToast("Webhook saved", "The integration delivery subscription is now active.", "success");
    setWebhookOpen(false);
    await loadFinanceEnterprise();
  }
  function openRequisitionStatusModal(requisition) {
    setSelectedRequisition(requisition);
    requisitionStatusForm.reset({ status: requisition.status === "Approved" ? "Approved" : "Rejected" });
    setRequisitionStatusOpen(true);
  }
  async function openVendorComparison(rfq) {
    const comparison = await financeService.getVendorComparison(rfq.id);
    setSelectedComparison(comparison);
    setVendorComparisonOpen(true);
  }
  function openWebhookDeliveryModal(webhook) {
    setSelectedWebhook(webhook);
    webhookDeliveryForm.reset({ deliveryStatus: webhook.lastDeliveryStatus || "Delivered" });
    setWebhookDeliveryOpen(true);
  }
  async function submitRequisitionStatus(values) {
    if (!selectedRequisition) {
      return;
    }
    await financeService.updatePurchaseRequisitionStatus(selectedRequisition.id, values);
    showToast("Requisition updated", `${selectedRequisition.requisitionNumber} is now ${values.status}.`, "success");
    setRequisitionStatusOpen(false);
    await loadFinanceEnterprise();
  }
  async function submitWebhookDelivery(values) {
    if (!selectedWebhook) {
      return;
    }
    await financeService.recordWebhookDelivery(selectedWebhook.id, values);
    showToast("Webhook delivery recorded", `${selectedWebhook.name} delivery was marked ${values.deliveryStatus}.`, "success");
    setWebhookDeliveryOpen(false);
    await loadFinanceEnterprise();
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { label: "Loading procurement and integration controls" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "enterprise-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-hero__copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-header__eyebrow", children: "Enterprise Finance Controls" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Procure-to-pay and integration command center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Manage sourcing intake, supplier RFQs, three-way match posture, and open architecture integrations from one finance workspace." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-hero__actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setRequisitionOpen(true), children: "New requisition" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setRfqOpen(true), children: "New RFQ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setIntegrationOpen(true), children: "Add integration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => setWebhookOpen(true), children: "Add webhook" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Requisitions", value: requisitions.length, format: "number", subtitle: "Procurement demand intake" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "RFQs awarded", value: rfqs.filter((rfq) => rfq.status === "Awarded").length, format: "number", subtitle: "Competitive sourcing closed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Active integrations", value: (integrationOverview == null ? void 0 : integrationOverview.activeConnections) ?? connections.length, format: "number", subtitle: "Open architecture connectors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Webhook subscriptions", value: (integrationOverview == null ? void 0 : integrationOverview.activeWebhooks) ?? webhooks.length, format: "number", subtitle: "Event delivery endpoints" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Purchase requisitions",
          description: "Department demand requests waiting for sourcing or already approved.",
          columns: [
            { key: "requisitionNumber", title: "Requisition", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.requisitionNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.department })
            ] }) },
            { key: "requestedBy", title: "Requested by", sortable: true },
            { key: "estimatedTotal", title: "Estimated total", sortable: true, align: "right", render: (row) => formatCurrency(row.estimatedTotal) },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: tone(row.status) }) },
            { key: "requestedAt", title: "Requested", sortable: true, render: (row) => formatDate(row.requestedAt) },
            { key: "actions", title: "Actions", render: (row) => row.status === "Submitted" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openRequisitionStatusModal(row), children: "Review" }) : "Reviewed" }
          ],
          data: requisitions,
          rowKey: "id",
          searchKeys: ["requisitionNumber", "department", "requestedBy", "status"],
          searchPlaceholder: "Search requisitions",
          emptyTitle: "No requisitions yet",
          emptyDescription: "Procurement intake requests will appear here after submission."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "RFQs",
          description: "Supplier quote rounds and awarded sourcing decisions.",
          columns: [
            { key: "rfqNumber", title: "RFQ", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.rfqNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.title })
            ] }) },
            { key: "supplierQuotes", title: "Quotes", align: "right", render: (row) => row.supplierQuotes.length },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: tone(row.status) }) },
            { key: "responseDueAt", title: "Due", sortable: true, render: (row) => formatDate(row.responseDueAt) },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void openVendorComparison(row), children: "Compare" }) }
          ],
          data: rfqs,
          rowKey: "id",
          searchKeys: ["rfqNumber", "title", "status"],
          searchPlaceholder: "Search RFQs",
          emptyTitle: "No RFQs yet",
          emptyDescription: "RFQ activity will appear here after sourcing rounds are created."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Three-way match",
          description: "PO, receipt, and invoice agreement checks for payables control.",
          columns: [
            { key: "purchaseOrderNumber", title: "Purchase order", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.purchaseOrderNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.supplierName })
            ] }) },
            { key: "purchaseOrderTotal", title: "PO total", sortable: true, align: "right", render: (row) => formatCurrency(row.purchaseOrderTotal) },
            { key: "receivedValue", title: "Received", sortable: true, align: "right", render: (row) => formatCurrency(row.receivedValue) },
            { key: "variance", title: "Variance", sortable: true, align: "right", render: (row) => formatCurrency(row.variance) },
            { key: "matchStatus", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.matchStatus, tone: tone(row.matchStatus) }) }
          ],
          data: matches,
          rowKey: "purchaseOrderId",
          searchKeys: ["purchaseOrderNumber", "supplierName", "matchStatus"],
          searchPlaceholder: "Search matching results",
          emptyTitle: "No three-way match data",
          emptyDescription: "Purchase matching information will appear here when procurement activity exists."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card enterprise-summary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Integration overview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Connector health, webhook posture, and retry visibility for the open integration layer." })
        ] }) }),
        integrationOverview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Healthy connections" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: integrationOverview.activeConnections })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active webhooks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: integrationOverview.activeWebhooks })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Failed syncs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: integrationOverview.failedSyncs })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connector types" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: integrationOverview.supportedConnectors.length })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Integration overview unavailable", description: "Connection health data is not available right now.", compact: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tag-cloud", children: integrationOverview == null ? void 0 : integrationOverview.supportedConnectors.map((connector) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag-chip", children: connector }, connector)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Integration connections",
          description: "Registered external systems, providers, and their latest sync result.",
          columns: [
            { key: "name", title: "Connection", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.provider })
            ] }) },
            { key: "type", title: "Type", sortable: true },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: tone(row.status) }) },
            { key: "lastSyncAt", title: "Last sync", sortable: true, render: (row) => formatDateTime(row.lastSyncAt) }
          ],
          data: connections,
          rowKey: "id",
          searchKeys: ["name", "type", "provider", "status"],
          searchPlaceholder: "Search integrations",
          emptyTitle: "No integrations configured",
          emptyDescription: "External connector registrations will appear here after setup."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Webhook subscriptions",
          description: "Event subscribers for downstream CRM, commerce, banking, and workflow systems.",
          columns: [
            { key: "name", title: "Webhook", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.topic })
            ] }) },
            { key: "targetUrl", title: "Target", sortable: true },
            { key: "lastDeliveryStatus", title: "Delivery", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.lastDeliveryStatus, tone: tone(row.lastDeliveryStatus) }) },
            { key: "lastDeliveredAt", title: "Last delivered", sortable: true, render: (row) => row.lastDeliveredAt ? formatDateTime(row.lastDeliveredAt) : "Not yet" },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openWebhookDeliveryModal(row), children: "Record delivery" }) }
          ],
          data: webhooks,
          rowKey: "id",
          searchKeys: ["name", "topic", "targetUrl", "lastDeliveryStatus"],
          searchPlaceholder: "Search webhooks",
          emptyTitle: "No webhooks configured",
          emptyDescription: "Webhook subscriptions will appear here after configuration."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: requisitionOpen, onClose: () => setRequisitionOpen(false), title: "Create requisition", description: "Raise a new procurement request directly from finance controls.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setRequisitionOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "requisition-form", className: "primary-button", disabled: requisitionForm.formState.isSubmitting, children: requisitionForm.formState.isSubmitting ? "Saving..." : "Save requisition" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "requisition-form", className: "form-grid form-grid--two", onSubmit: requisitionForm.handleSubmit(submitRequisition), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Department", registration: requisitionForm.register("department", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Requested by", registration: requisitionForm.register("requestedBy", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Product", registration: requisitionForm.register("productId", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select product" }),
        products.filter((product) => product.isActive).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: product.id, children: product.name }, product.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Quantity", type: "number", registration: requisitionForm.register("quantity", { required: true, valueAsNumber: true, min: 1 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Estimated unit cost", type: "number", step: "0.01", registration: requisitionForm.register("estimatedUnitCost", { required: true, valueAsNumber: true, min: 0 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextAreaField, { label: "Justification", registration: requisitionForm.register("justification", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: rfqOpen, onClose: () => setRfqOpen(false), title: "Create RFQ", description: "Run a sourcing round against a requisition and nominated supplier.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setRfqOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "rfq-form", className: "primary-button", disabled: rfqForm.formState.isSubmitting, children: rfqForm.formState.isSubmitting ? "Saving..." : "Save RFQ" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "rfq-form", className: "form-grid form-grid--two", onSubmit: rfqForm.handleSubmit(submitRfq), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Requisition", registration: rfqForm.register("requisitionId"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Standalone RFQ" }),
        requisitions.map((requisition) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: requisition.id, children: requisition.requisitionNumber }, requisition.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Title", registration: rfqForm.register("title", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Supplier", registration: rfqForm.register("supplierId", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select supplier" }),
        suppliers.map((supplier) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: supplier.id, children: supplier.name }, supplier.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Quoted amount", type: "number", step: "0.01", registration: rfqForm.register("quotedAmount", { required: true, valueAsNumber: true, min: 0 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Lead time days", type: "number", registration: rfqForm.register("leadTimeDays", { required: true, valueAsNumber: true, min: 1 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Response window days", type: "number", registration: rfqForm.register("responseWindowDays", { required: true, valueAsNumber: true, min: 1 }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: integrationOpen, onClose: () => setIntegrationOpen(false), title: "Register integration", description: "Add a new external connector for finance, CRM, commerce, or banking workflows.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setIntegrationOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "integration-form", className: "primary-button", disabled: integrationForm.formState.isSubmitting, children: integrationForm.formState.isSubmitting ? "Saving..." : "Save integration" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "integration-form", className: "form-grid form-grid--two", onSubmit: integrationForm.handleSubmit(submitIntegration), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Connection name", registration: integrationForm.register("name", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Type", registration: integrationForm.register("type", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CRM", children: "CRM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PaymentGateway", children: "Payment gateway" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Banking", children: "Banking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ECommerce", children: "E-commerce" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Provider", registration: integrationForm.register("provider", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Endpoint URL", registration: integrationForm.register("endpointUrl", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: webhookOpen, onClose: () => setWebhookOpen(false), title: "Create webhook subscription", description: "Register a downstream event subscriber with a topic and secret reference.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setWebhookOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "webhook-form", className: "primary-button", disabled: webhookForm.formState.isSubmitting, children: webhookForm.formState.isSubmitting ? "Saving..." : "Save webhook" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "webhook-form", className: "form-grid form-grid--two", onSubmit: webhookForm.handleSubmit(submitWebhook), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Webhook name", registration: webhookForm.register("name", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Topic", registration: webhookForm.register("topic", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sales", children: "Sales" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "procurement", children: "Procurement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "finance", children: "Finance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "integration", children: "Integration" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Target URL", registration: webhookForm.register("targetUrl", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Secret reference", registration: webhookForm.register("secretReference", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: requisitionStatusOpen, onClose: () => setRequisitionStatusOpen(false), title: (selectedRequisition == null ? void 0 : selectedRequisition.requisitionNumber) || "Review requisition", description: "Approve or reject the procurement request.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setRequisitionStatusOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "requisition-status-form", className: "primary-button", disabled: requisitionStatusForm.formState.isSubmitting, children: requisitionStatusForm.formState.isSubmitting ? "Saving..." : "Save decision" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { id: "requisition-status-form", className: "form-grid", onSubmit: requisitionStatusForm.handleSubmit(submitRequisitionStatus), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Decision", registration: requisitionStatusForm.register("status", { required: true }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approve" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Rejected", children: "Reject" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: vendorComparisonOpen, onClose: () => setVendorComparisonOpen(false), title: (selectedComparison == null ? void 0 : selectedComparison.rfqNumber) || "Vendor comparison", description: "Ranked supplier comparison for the selected RFQ.", size: "lg", children: selectedComparison ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "surface-card enterprise-summary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Recommended supplier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedComparison.recommendedSupplierName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Recommended quote" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(selectedComparison.recommendedQuote) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lead time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            selectedComparison.recommendedLeadTimeDays,
            "d"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Supplier options",
          description: "Scored supplier quotes returned by the RFQ comparison engine.",
          columns: [
            { key: "supplierName", title: "Supplier", sortable: true },
            { key: "quotedAmount", title: "Quote", sortable: true, align: "right", render: (row) => formatCurrency(row.quotedAmount) },
            { key: "leadTimeDays", title: "Lead time", sortable: true, render: (row) => `${row.leadTimeDays}d` },
            { key: "score", title: "Score", sortable: true, align: "right" },
            { key: "isAwarded", title: "Award", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.isAwarded ? "Recommended" : "Option", tone: row.isAwarded ? "success" : "info" }) }
          ],
          data: selectedComparison.options,
          rowKey: "supplierId",
          searchKeys: ["supplierName"],
          searchPlaceholder: "Search supplier options",
          emptyTitle: "No supplier options",
          emptyDescription: "No supplier quote options are available for this RFQ."
        }
      )
    ] }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: webhookDeliveryOpen, onClose: () => setWebhookDeliveryOpen(false), title: (selectedWebhook == null ? void 0 : selectedWebhook.name) || "Record webhook delivery", description: "Record the latest delivery outcome for this subscription.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setWebhookDeliveryOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "webhook-delivery-form", className: "primary-button", disabled: webhookDeliveryForm.formState.isSubmitting, children: webhookDeliveryForm.formState.isSubmitting ? "Saving..." : "Save delivery" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { id: "webhook-delivery-form", className: "form-grid", onSubmit: webhookDeliveryForm.handleSubmit(submitWebhookDelivery), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Delivery status", registration: webhookDeliveryForm.register("deliveryStatus", { required: true }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Delivered", children: "Delivered" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Retrying", children: "Retrying" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Failed", children: "Failed" })
    ] }) }) })
  ] });
}
const initialState = {
  invoices: [],
  payments: [],
  cashForecasts: [],
  aging: null,
  alerts: [],
  anomalies: [],
  payroll: null,
  products: [],
  suppliers: []
};
function invoiceTone(status) {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "overdue":
      return "danger";
    case "partially paid":
      return "warning";
    default:
      return "info";
  }
}
function severityTone(value) {
  switch (value.toLowerCase()) {
    case "high":
    case "critical":
      return "danger";
    case "medium":
    case "warning":
      return "warning";
    default:
      return "info";
  }
}
function Finance() {
  var _a, _b, _c, _d;
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = reactExports.useState(true);
  const [activeView, setActiveView] = reactExports.useState("receivables");
  const [overdueOnly, setOverdueOnly] = reactExports.useState(false);
  const [billingDashboard, setBillingDashboard] = reactExports.useState(null);
  const [executiveDashboard, setExecutiveDashboard] = reactExports.useState(null);
  const [financeDashboard, setFinanceDashboard] = reactExports.useState(null);
  const [collectionRisk, setCollectionRisk] = reactExports.useState(null);
  const [state, setState] = reactExports.useState(initialState);
  const [paymentModalOpen, setPaymentModalOpen] = reactExports.useState(false);
  const [detailOpen, setDetailOpen] = reactExports.useState(false);
  const [selectedInvoice, setSelectedInvoice] = reactExports.useState(null);
  const [selectedInvoicePayments, setSelectedInvoicePayments] = reactExports.useState([]);
  const canRunPayroll = hasPermission("CanRunPayroll");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      invoiceId: "",
      amount: 0,
      paymentMethod: "Bank Transfer",
      reference: ""
    }
  });
  async function loadFinanceWorkspace(currentOverdueOnly) {
    setLoading(true);
    const [
      billingDashboardResult,
      executiveDashboardResult,
      financeDashboardResult,
      invoicesResult,
      paymentsResult,
      collectionRiskResult,
      agingResult,
      cash7Result,
      cash14Result,
      cash30Result,
      alertsResult,
      financeAnomaliesResult,
      paymentAnomaliesResult,
      payrollResult,
      productsResult,
      suppliersResult
    ] = await Promise.allSettled([
      financeService.getBillingDashboard(),
      financeService.getExecutiveDashboard(),
      financeService.getFinanceDashboard(),
      financeService.getInvoices(currentOverdueOnly),
      financeService.getPayments(),
      financeService.getCollectionRisk(),
      financeService.getInvoiceAging(),
      financeService.getCashForecast(7),
      financeService.getCashForecast(14),
      financeService.getCashForecast(30),
      financeService.getBillingAlerts(6),
      financeService.getFinanceAnomalies(6),
      financeService.getPaymentAnomalies(6),
      canRunPayroll ? financeService.getPayrollSummary() : Promise.resolve(null),
      catalogService.getProducts(void 0, false),
      catalogService.getSuppliers()
    ]);
    setBillingDashboard(billingDashboardResult.status === "fulfilled" ? billingDashboardResult.value : null);
    setExecutiveDashboard(executiveDashboardResult.status === "fulfilled" ? executiveDashboardResult.value : null);
    setFinanceDashboard(financeDashboardResult.status === "fulfilled" ? financeDashboardResult.value : null);
    setCollectionRisk(collectionRiskResult.status === "fulfilled" ? collectionRiskResult.value : null);
    setState({
      invoices: invoicesResult.status === "fulfilled" ? invoicesResult.value : [],
      payments: paymentsResult.status === "fulfilled" ? paymentsResult.value : [],
      aging: agingResult.status === "fulfilled" ? agingResult.value : null,
      cashForecasts: [cash7Result, cash14Result, cash30Result].filter((item) => item.status === "fulfilled").map((item) => item.value).sort((left, right) => left.horizonDays - right.horizonDays),
      alerts: alertsResult.status === "fulfilled" ? alertsResult.value : [],
      anomalies: [
        ...financeAnomaliesResult.status === "fulfilled" ? financeAnomaliesResult.value : [],
        ...paymentAnomaliesResult.status === "fulfilled" ? paymentAnomaliesResult.value : []
      ].slice(0, 8),
      payroll: payrollResult.status === "fulfilled" ? payrollResult.value : null,
      products: productsResult.status === "fulfilled" ? productsResult.value : [],
      suppliers: suppliersResult.status === "fulfilled" ? suppliersResult.value : []
    });
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void loadFinanceWorkspace(overdueOnly);
  }, [canRunPayroll, overdueOnly]);
  async function openInvoice(invoiceId) {
    const [invoice, payments] = await Promise.all([
      financeService.getInvoice(invoiceId),
      financeService.getInvoicePayments(invoiceId)
    ]);
    setSelectedInvoice(invoice);
    setSelectedInvoicePayments(payments);
    setDetailOpen(true);
  }
  function openPaymentModal() {
    var _a2, _b2;
    reset({
      invoiceId: ((_a2 = state.invoices[0]) == null ? void 0 : _a2.id) || "",
      amount: ((_b2 = state.invoices[0]) == null ? void 0 : _b2.balance) || 0,
      paymentMethod: "Bank Transfer",
      reference: ""
    });
    setPaymentModalOpen(true);
  }
  async function submitPayment(values) {
    await financeService.createPayment({
      invoiceId: values.invoiceId,
      amount: Number(values.amount),
      paymentMethod: values.paymentMethod,
      reference: values.reference
    });
    showToast("Payment saved", "The payment has been added to the invoice.", "success");
    setPaymentModalOpen(false);
    await loadFinanceWorkspace(overdueOnly);
  }
  const cashForecastData = reactExports.useMemo(
    () => state.cashForecasts.map((item) => ({
      label: `${item.horizonDays}d`,
      value: item.expectedCollections,
      secondaryValue: item.overdueExposure
    })),
    [state.cashForecasts]
  );
  const agingBars = reactExports.useMemo(
    () => {
      var _a2;
      return ((_a2 = state.aging) == null ? void 0 : _a2.buckets.map((item) => ({
        label: item.label,
        value: item.amount
      }))) || [];
    },
    [state.aging]
  );
  const collectionRiskRows = (collectionRisk == null ? void 0 : collectionRisk.items.slice(0, 8)) || [];
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading finance information" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Finance",
        title: "Finance and collections",
        description: "Track invoices, payments, cash outlook, and follow-up priorities in one place.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setOverdueOnly((current) => !current), children: overdueOnly ? "Show all invoices" : "Show past-due only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: openPaymentModal, disabled: state.invoices.length === 0, children: "Add payment" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total invoiced", value: (billingDashboard == null ? void 0 : billingDashboard.totalInvoiced) ?? 0, format: "currency", subtitle: "Invoices issued" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Collected", value: (billingDashboard == null ? void 0 : billingDashboard.collectedAmount) ?? 0, format: "currency", subtitle: "Payments received" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Outstanding", value: (billingDashboard == null ? void 0 : billingDashboard.outstandingBalance) ?? 0, format: "currency", subtitle: "Open receivables" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Past-due balance", value: (billingDashboard == null ? void 0 : billingDashboard.overdueBalance) ?? 0, format: "currency", subtitle: "Needs follow-up" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SegmentedControl,
      {
        label: "Finance work areas",
        value: activeView,
        onChange: (value) => setActiveView(value),
        options: [
          { value: "receivables", label: "Receivables", description: "Invoices, payments, and collections" },
          { value: "cash", label: "Cash outlook", description: "Forecasts, aging, and finance alerts" },
          { value: "payroll", label: "Payroll", description: "Workforce payroll visibility" },
          { value: "controls", label: "Enterprise controls", description: "Procurement and integration operations" }
        ]
      }
    ),
    activeView === "cash" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Cash forecast" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Expected cash in and past-due exposure over the next few planning periods." })
          ] }) }),
          cashForecastData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            TrendLineChart,
            {
              data: cashForecastData,
              valueLabel: "currency",
              primaryLabel: "Expected collections",
              secondaryLabel: "Overdue exposure"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Cash outlook unavailable", description: "Cash forecast information is not available right now.", compact: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Invoice aging" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Open balance grouped by how long invoices have been outstanding." })
          ] }) }),
          agingBars.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBarChart, { data: agingBars, valueLabel: "currency" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Aging data unavailable", description: "Invoice aging details are not available right now.", compact: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Cash position" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Quick guidance on working capital and collections." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Working capital indicator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: financeDashboard ? financeDashboard.workingCapitalIndicator.toFixed(2) : "Not available" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatusBadge,
                {
                  label: financeDashboard && financeDashboard.workingCapitalIndicator >= 1 ? "Healthy" : "Watch",
                  tone: financeDashboard && financeDashboard.workingCapitalIndicator >= 1 ? "success" : "warning"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Collections summary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: (financeDashboard == null ? void 0 : financeDashboard.narrative) || "A summary is not available right now." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Summary", tone: "info" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Follow-up priority" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: executiveDashboard ? `${executiveDashboard.highRiskCollections} high-risk collections and ${executiveDashboard.overdueInvoices} past-due invoices are currently open.` : "Finance summary information is not available right now." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Attention", tone: "warning" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Finance updates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Warnings and unusual items that may need follow-up." })
          ] }) }),
          state.alerts.length === 0 && state.anomalies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No finance updates", description: "There are no active warnings to review right now.", compact: true }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
            state.alerts.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.area }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.message })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.severity, tone: severityTone(item.severity) })
            ] }, `${item.area}-${item.message}`)),
            state.anomalies.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.narrative })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.severity, tone: severityTone(item.severity) })
            ] }, `${item.domain}-${item.title}`))
          ] })
        ] })
      ] })
    ] }) : null,
    activeView === "payroll" ? state.payroll ? /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Payroll summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Payroll details available for users with payroll access." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Workforce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Active employees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: state.payroll.activeEmployees })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Monthly gross payroll" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(state.payroll.monthlyGrossPayroll) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Average salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(state.payroll.averageMonthlySalary) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Payroll cycle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Next payroll date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatDate(state.payroll.nextPayrollDate) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Pending approvals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: state.payroll.pendingPayrollApprovals })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: state.payroll.status })
            ] })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Payroll visibility unavailable", description: "Payroll details are available to accounts with payroll access.", compact: true }) : null,
    activeView === "controls" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FinanceEnterprisePanel, { products: state.products, suppliers: state.suppliers }) : null,
    activeView === "receivables" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Invoices",
          description: "Review invoices and open each one for payment details.",
          columns: [
            {
              key: "invoiceNumber",
              title: "Invoice",
              sortable: true,
              render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.invoiceNumber }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.customerName })
              ] })
            },
            {
              key: "dueDate",
              title: "Due",
              sortable: true,
              render: (row) => formatDate(row.dueDate)
            },
            {
              key: "totalAmount",
              title: "Total",
              sortable: true,
              align: "right",
              render: (row) => formatCurrency(row.totalAmount)
            },
            {
              key: "balance",
              title: "Balance",
              sortable: true,
              align: "right",
              render: (row) => formatCurrency(row.balance)
            },
            {
              key: "status",
              title: "Status",
              sortable: true,
              render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: invoiceTone(row.status) })
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void openInvoice(row.id), children: "View details" })
            }
          ],
          data: state.invoices,
          rowKey: "id",
          searchKeys: ["invoiceNumber", "customerName", "status"],
          searchPlaceholder: "Search invoices",
          emptyTitle: "No invoices found",
          emptyDescription: "Try a different filter or come back when more invoices are available."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DataTable,
          {
            title: "Payments",
            description: "Recent customer payments.",
            columns: [
              {
                key: "paymentDate",
                title: "Date",
                sortable: true,
                render: (row) => formatDate(row.paymentDate)
              },
              {
                key: "invoiceNumber",
                title: "Payment",
                sortable: true,
                render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.invoiceNumber }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.customerName })
                ] })
              },
              {
                key: "amount",
                title: "Amount",
                sortable: true,
                align: "right",
                render: (row) => formatCurrency(row.amount)
              },
              {
                key: "paymentMethod",
                title: "Method",
                sortable: true
              }
            ],
            data: state.payments,
            rowKey: "id",
            searchKeys: ["invoiceNumber", "customerName", "paymentMethod", "reference"],
            searchPlaceholder: "Search payments",
            emptyTitle: "No payments found",
            emptyDescription: "Payments will appear here after they are recorded."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DataTable,
          {
            title: "Collection risk",
            description: "Accounts with the highest follow-up risk.",
            columns: [
              {
                key: "invoiceNumber",
                title: "Invoice",
                sortable: true,
                render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.invoiceNumber }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.customerName })
                ] })
              },
              {
                key: "balance",
                title: "Balance",
                sortable: true,
                align: "right",
                render: (row) => formatCurrency(row.balance)
              },
              {
                key: "daysOverdue",
                title: "Days overdue",
                sortable: true,
                align: "right"
              },
              {
                key: "riskBand",
                title: "Risk",
                sortable: true,
                render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: `${row.riskBand} / ${row.riskScore}`, tone: severityTone(row.riskBand) })
              }
            ],
            data: collectionRiskRows,
            rowKey: "invoiceId",
            searchKeys: ["invoiceNumber", "customerName", "riskBand"],
            searchPlaceholder: "Search collection risk",
            emptyTitle: "No follow-up risk found",
            emptyDescription: "There are no high-risk balances to review right now."
          }
        )
      ] })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: paymentModalOpen,
        onClose: () => setPaymentModalOpen(false),
        title: "Add payment",
        description: "Add a payment to an invoice.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setPaymentModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "payment-form", className: "primary-button", disabled: isSubmitting, children: isSubmitting ? "Saving..." : "Save payment" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "payment-form", className: "form-grid form-grid--two", onSubmit: handleSubmit(submitPayment), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SelectField,
            {
              label: "Invoice",
              error: (_a = errors.invoiceId) == null ? void 0 : _a.message,
              registration: register("invoiceId", { required: "Please choose an invoice." }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select invoice" }),
                state.invoices.filter((invoice) => invoice.balance > 0).map((invoice) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: invoice.id, children: [
                  invoice.invoiceNumber,
                  " / ",
                  invoice.customerName,
                  " / ",
                  formatCurrency(invoice.balance)
                ] }, invoice.id))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            InputField,
            {
              label: "Amount",
              type: "number",
              step: "0.01",
              error: (_b = errors.amount) == null ? void 0 : _b.message,
              registration: register("amount", { required: "Please enter an amount.", valueAsNumber: true, min: 1 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SelectField,
            {
              label: "Payment method",
              error: (_c = errors.paymentMethod) == null ? void 0 : _c.message,
              registration: register("paymentMethod", { required: "Please choose a payment method." }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Bank Transfer", children: "Bank Transfer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Card", children: "Card" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cash", children: "Cash" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Wire", children: "Wire" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            InputField,
            {
              label: "Reference",
              placeholder: "Payment reference",
              error: (_d = errors.reference) == null ? void 0 : _d.message,
              registration: register("reference", { required: "Please enter a payment reference." })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: detailOpen,
        onClose: () => setDetailOpen(false),
        title: (selectedInvoice == null ? void 0 : selectedInvoice.invoiceNumber) || "Invoice details",
        description: selectedInvoice ? `${selectedInvoice.customerName} / ${selectedInvoice.orderNumber}` : "Invoice details",
        size: "lg",
        children: selectedInvoice ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Invoice summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Invoice date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatDate(selectedInvoice.invoiceDate) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Due date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatDate(selectedInvoice.dueDate) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(selectedInvoice.totalAmount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Balance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(selectedInvoice.balance) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: selectedInvoice.status, tone: invoiceTone(selectedInvoice.status) }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Payment history" }),
            selectedInvoicePayments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No payments yet", description: "No payments have been added to this invoice yet.", compact: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: selectedInvoicePayments.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatDate(payment.paymentDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  payment.paymentMethod,
                  " / ",
                  payment.reference
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-inline", children: formatCurrency(payment.amount) })
            ] }, payment.id)) })
          ] })
        ] }) : null
      }
    )
  ] });
}
export {
  Finance as default
};
