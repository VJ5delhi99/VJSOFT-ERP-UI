import { h as useToast, r as reactExports, j as jsxRuntimeExports, S as Spinner, e as formatDateTime, b as StatusBadge, u as useAuth, i as formatDate, f as formatCurrency } from "./index-CbdSSOK5.js";
import { u as useForm, S as SelectField, I as InputField, T as TextAreaField } from "./FormField-COL4ilW-.js";
import { D as DataTable } from "./DataTable-BVqaoBLJ.js";
import { S as StatCard, E as EmptyState, P as PageHeader } from "./StatCard--pOubCUx.js";
import { M as Modal, S as SegmentedControl } from "./SegmentedControl-Bk_4e3lR.js";
import { s as salesService } from "./salesService-CVFnTIbv.js";
import { r as roleGroups } from "./rbac-DoPO7Lc7.js";
import { c as catalogService } from "./catalogService-DKXKGJBm.js";
function tone(status) {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "scheduled":
      return "info";
    case "in progress":
      return "warning";
    default:
      return "danger";
  }
}
function FieldServicePanel({ tickets }) {
  const { showToast } = useToast();
  const [loading, setLoading] = reactExports.useState(true);
  const [jobs, setJobs] = reactExports.useState([]);
  const [jobOpen, setJobOpen] = reactExports.useState(false);
  const [statusOpen, setStatusOpen] = reactExports.useState(false);
  const [selectedJob, setSelectedJob] = reactExports.useState(null);
  const jobForm = useForm({
    defaultValues: {
      serviceTicketId: "",
      customerName: "",
      technicianName: "",
      scheduledStart: "",
      scheduledEnd: "",
      offlineSyncEnabled: "true",
      latitude: 12.9716,
      longitude: 77.5946
    }
  });
  const statusForm = useForm({ defaultValues: { status: "Scheduled", serviceReport: "" } });
  async function loadJobs() {
    setLoading(true);
    try {
      setJobs(await salesService.getFieldServiceJobs());
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    void loadJobs();
  }, []);
  async function submitJob(values) {
    await salesService.createFieldServiceJob({
      serviceTicketId: values.serviceTicketId || void 0,
      customerName: values.customerName || void 0,
      technicianName: values.technicianName,
      scheduledStart: new Date(values.scheduledStart).toISOString(),
      scheduledEnd: new Date(values.scheduledEnd).toISOString(),
      offlineSyncEnabled: values.offlineSyncEnabled === "true",
      latitude: Number(values.latitude),
      longitude: Number(values.longitude)
    });
    showToast("Field service scheduled", "The technician assignment is ready for execution.", "success");
    setJobOpen(false);
    await loadJobs();
  }
  async function submitStatus(values) {
    if (!selectedJob) {
      return;
    }
    await salesService.updateFieldServiceJob(selectedJob.id, values);
    showToast("Field service updated", `${selectedJob.jobNumber} has been updated.`, "success");
    setStatusOpen(false);
    await loadJobs();
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { label: "Loading field service operations" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "enterprise-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-hero__copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-header__eyebrow", children: "Field Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Dispatch, offline execution, and service completion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Coordinate technicians against service tickets with location context and offline-ready job reporting." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "enterprise-hero__actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => setJobOpen(true), children: "Schedule field job" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Scheduled jobs", value: jobs.filter((job) => job.status === "Scheduled").length, format: "number", subtitle: "Ready for dispatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Offline-enabled", value: jobs.filter((job) => job.offlineSyncEnabled).length, format: "number", subtitle: "Mobile-first work packs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Completed jobs", value: jobs.filter((job) => job.status === "Completed").length, format: "number", subtitle: "Service visits closed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open service tickets", value: tickets.filter((ticket) => ticket.status !== "Resolved").length, format: "number", subtitle: "Potential field demand" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Field jobs",
          description: "Technician assignments, job windows, and onsite completion details.",
          columns: [
            { key: "jobNumber", title: "Job", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.jobNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.customerName })
            ] }) },
            { key: "technicianName", title: "Technician", sortable: true },
            { key: "scheduledStart", title: "Window", sortable: true, render: (row) => `${formatDateTime(row.scheduledStart)} -> ${formatDateTime(row.scheduledEnd)}` },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: tone(row.status) }) },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => {
              setSelectedJob(row);
              statusForm.reset({ status: row.status, serviceReport: row.serviceReport });
              setStatusOpen(true);
            }, children: "Update" }) }
          ],
          data: jobs,
          rowKey: "id",
          searchKeys: ["jobNumber", "customerName", "technicianName", "status"],
          searchPlaceholder: "Search field jobs",
          emptyTitle: "No field jobs yet",
          emptyDescription: "Field assignments will appear here after dispatch scheduling."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Service tickets ready for dispatch",
          description: "Support issues that can be converted into field appointments.",
          columns: [
            { key: "ticketNumber", title: "Ticket", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.ticketNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.subject })
            ] }) },
            { key: "customerName", title: "Customer", sortable: true },
            { key: "assignedTeam", title: "Team", sortable: true },
            { key: "priority", title: "Priority", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.priority, tone: row.priority === "High" ? "danger" : row.priority === "Medium" ? "warning" : "info" }) },
            { key: "dueAt", title: "Due", sortable: true, render: (row) => formatDateTime(row.dueAt) }
          ],
          data: tickets,
          rowKey: "id",
          searchKeys: ["ticketNumber", "customerName", "subject", "assignedTeam"],
          searchPlaceholder: "Search service tickets",
          emptyTitle: "No service tickets",
          emptyDescription: "Tickets available for field dispatch will appear here."
        }
      )
    ] }),
    jobs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Field service just opened", description: "Schedule a technician visit to start using the new field service workflow.", compact: true }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: jobOpen, onClose: () => setJobOpen(false), title: "Schedule field job", description: "Create a technician assignment linked to a support ticket or standalone customer visit.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setJobOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "job-form", className: "primary-button", disabled: jobForm.formState.isSubmitting, children: jobForm.formState.isSubmitting ? "Saving..." : "Save job" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "job-form", className: "form-grid form-grid--two", onSubmit: jobForm.handleSubmit(submitJob), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Service ticket", registration: jobForm.register("serviceTicketId"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Standalone job" }),
        tickets.map((ticket) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: ticket.id, children: [
          ticket.ticketNumber,
          " / ",
          ticket.customerName
        ] }, ticket.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Customer name", registration: jobForm.register("customerName"), helperText: "Optional when a service ticket is selected." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Technician name", registration: jobForm.register("technicianName", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Offline sync", registration: jobForm.register("offlineSyncEnabled", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "true", children: "Enabled" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "false", children: "Disabled" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Scheduled start", type: "datetime-local", registration: jobForm.register("scheduledStart", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Scheduled end", type: "datetime-local", registration: jobForm.register("scheduledEnd", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Latitude", type: "number", step: "0.0001", registration: jobForm.register("latitude", { required: true, valueAsNumber: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Longitude", type: "number", step: "0.0001", registration: jobForm.register("longitude", { required: true, valueAsNumber: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: statusOpen, onClose: () => setStatusOpen(false), title: (selectedJob == null ? void 0 : selectedJob.jobNumber) || "Update job", description: "Update field execution state and close out the service report.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setStatusOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "status-form", className: "primary-button", disabled: statusForm.formState.isSubmitting, children: statusForm.formState.isSubmitting ? "Saving..." : "Save update" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "status-form", className: "form-grid", onSubmit: statusForm.handleSubmit(submitStatus), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Status", registration: statusForm.register("status", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Scheduled", children: "Scheduled" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "In Progress", children: "In Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Completed", children: "Completed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cancelled", children: "Cancelled" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextAreaField, { label: "Service report", registration: statusForm.register("serviceReport") })
    ] }) })
  ] });
}
function orderTone(status) {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    case "approved":
    case "processing":
      return "info";
    default:
      return "warning";
  }
}
function projectTone(status) {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "active":
      return "info";
    case "at risk":
    case "on hold":
      return "danger";
    default:
      return "warning";
  }
}
function ticketTone(status) {
  switch (status.toLowerCase()) {
    case "resolved":
      return "success";
    case "in progress":
      return "info";
    case "escalated":
      return "danger";
    default:
      return "warning";
  }
}
function priorityTone(priority) {
  return priority.toLowerCase() === "high" ? "danger" : priority.toLowerCase() === "medium" ? "warning" : "info";
}
function Orders() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const { canAccess } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = reactExports.useState(true);
  const [activeView, setActiveView] = reactExports.useState("revenue");
  const [customers, setCustomers] = reactExports.useState([]);
  const [products, setProducts] = reactExports.useState([]);
  const [orders, setOrders] = reactExports.useState([]);
  const [metrics, setMetrics] = reactExports.useState(null);
  const [projects, setProjects] = reactExports.useState([]);
  const [tickets, setTickets] = reactExports.useState([]);
  const [customerSegmentFilter, setCustomerSegmentFilter] = reactExports.useState("");
  const [orderStatusFilter, setOrderStatusFilter] = reactExports.useState("");
  const [projectStatusFilter, setProjectStatusFilter] = reactExports.useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = reactExports.useState("");
  const [customerModalOpen, setCustomerModalOpen] = reactExports.useState(false);
  const [orderModalOpen, setOrderModalOpen] = reactExports.useState(false);
  const [projectModalOpen, setProjectModalOpen] = reactExports.useState(false);
  const [ticketModalOpen, setTicketModalOpen] = reactExports.useState(false);
  const [customerInsight, setCustomerInsight] = reactExports.useState(null);
  const [customerInsightOpen, setCustomerInsightOpen] = reactExports.useState(false);
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [orderDetailOpen, setOrderDetailOpen] = reactExports.useState(false);
  const [pendingOrderStatus, setPendingOrderStatus] = reactExports.useState("Pending");
  const [workflowTarget, setWorkflowTarget] = reactExports.useState(null);
  const [workflowOpen, setWorkflowOpen] = reactExports.useState(false);
  const [pendingWorkflowStatus, setPendingWorkflowStatus] = reactExports.useState("");
  const [pendingProjectPercent, setPendingProjectPercent] = reactExports.useState(0);
  const canViewSales = canAccess(roleGroups.salesAccess);
  const canViewOperations = canAccess(roleGroups.operationsAccess);
  const canViewCatalog = canAccess(roleGroups.catalogAccess);
  const customerForm = useForm({
    defaultValues: { name: "", email: "", contactNumber: "", segment: "SMB" }
  });
  const orderForm = useForm({
    defaultValues: { customerId: "", productId: "", quantity: 1, paymentMethod: "Bank Transfer" }
  });
  const projectForm = useForm({
    defaultValues: { name: "", customerName: "", projectManager: "", budget: 0, dueDate: "" }
  });
  const ticketForm = useForm({
    defaultValues: { customerId: "", customerName: "", subject: "", priority: "Medium", assignedTeam: "Support", dueInHours: 24 }
  });
  async function loadSalesOps() {
    setLoading(true);
    const [customersResult, ordersResult, metricsResult, productsResult, projectsResult, ticketsResult] = await Promise.allSettled([
      canViewSales ? salesService.getCustomers(customerSegmentFilter || void 0) : Promise.resolve([]),
      canViewSales ? salesService.getOrders(orderStatusFilter || void 0) : Promise.resolve([]),
      canViewSales ? salesService.getOrderMetrics() : Promise.resolve(null),
      canViewSales && canViewCatalog ? catalogService.getProducts(void 0, false) : Promise.resolve([]),
      canViewOperations ? salesService.getProjects(projectStatusFilter || void 0) : Promise.resolve([]),
      canViewOperations ? salesService.getTickets(ticketStatusFilter || void 0) : Promise.resolve([])
    ]);
    setCustomers(customersResult.status === "fulfilled" ? customersResult.value : []);
    setOrders(ordersResult.status === "fulfilled" ? ordersResult.value : []);
    setMetrics(metricsResult.status === "fulfilled" ? metricsResult.value : null);
    setProducts(productsResult.status === "fulfilled" ? productsResult.value : []);
    setProjects(projectsResult.status === "fulfilled" ? projectsResult.value : []);
    setTickets(ticketsResult.status === "fulfilled" ? ticketsResult.value : []);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void loadSalesOps();
  }, [canViewCatalog, canViewOperations, canViewSales, customerSegmentFilter, orderStatusFilter, projectStatusFilter, ticketStatusFilter]);
  const operationalBacklog = reactExports.useMemo(
    () => projects.filter((item) => item.status !== "Completed").length + tickets.filter((item) => item.status !== "Resolved").length,
    [projects, tickets]
  );
  function openCustomerModal() {
    customerForm.reset({ name: "", email: "", contactNumber: "", segment: customerSegmentFilter || "SMB" });
    setCustomerModalOpen(true);
  }
  function openOrderModal() {
    var _a2, _b2;
    orderForm.reset({
      customerId: ((_a2 = customers[0]) == null ? void 0 : _a2.id) || "",
      productId: ((_b2 = products[0]) == null ? void 0 : _b2.id) || "",
      quantity: 1,
      paymentMethod: "Bank Transfer"
    });
    setOrderModalOpen(true);
  }
  function openProjectModal() {
    var _a2;
    projectForm.reset({ name: "", customerName: ((_a2 = customers[0]) == null ? void 0 : _a2.name) || "", projectManager: "", budget: 0, dueDate: "" });
    setProjectModalOpen(true);
  }
  function openTicketModal() {
    var _a2, _b2;
    ticketForm.reset({
      customerId: ((_a2 = customers[0]) == null ? void 0 : _a2.id) || "",
      customerName: ((_b2 = customers[0]) == null ? void 0 : _b2.name) || "",
      subject: "",
      priority: "Medium",
      assignedTeam: "Support",
      dueInHours: 24
    });
    setTicketModalOpen(true);
  }
  async function submitCustomer(values) {
    await salesService.createCustomer(values);
    showToast("Customer added", `${values.name} is now available in your organization.`, "success");
    setCustomerModalOpen(false);
    await loadSalesOps();
  }
  async function submitOrder(values) {
    await salesService.createOrder({
      customerId: values.customerId,
      paymentMethod: values.paymentMethod,
      lines: [{ productId: values.productId, quantity: Number(values.quantity) }]
    });
    showToast("Order created", "The customer order has been saved.", "success");
    setOrderModalOpen(false);
    await loadSalesOps();
  }
  async function submitProject(values) {
    await salesService.createProject({
      name: values.name,
      customerName: values.customerName,
      projectManager: values.projectManager,
      budget: Number(values.budget),
      dueDate: new Date(values.dueDate).toISOString()
    });
    showToast("Project added", `${values.name} has been added to the work plan.`, "success");
    setProjectModalOpen(false);
    await loadSalesOps();
  }
  async function submitTicket(values) {
    await salesService.createTicket({
      customerId: values.customerId || void 0,
      customerName: values.customerName,
      subject: values.subject,
      priority: values.priority,
      assignedTeam: values.assignedTeam,
      dueInHours: Number(values.dueInHours)
    });
    showToast("Case created", "The support case has been added to the queue.", "success");
    setTicketModalOpen(false);
    await loadSalesOps();
  }
  async function openCustomerIntelligence(customerId) {
    const intelligence = await salesService.getCustomerIntelligence(customerId);
    setCustomerInsight(intelligence);
    setCustomerInsightOpen(true);
  }
  async function openOrderDetail(orderId) {
    const order = await salesService.getOrder(orderId);
    setSelectedOrder(order);
    setPendingOrderStatus(order.status);
    setOrderDetailOpen(true);
  }
  async function updateOrderStatus() {
    if (!selectedOrder) {
      return;
    }
    const updated = await salesService.updateOrderStatus(selectedOrder.id, { status: pendingOrderStatus });
    setSelectedOrder(updated);
    showToast("Order updated", `${updated.orderNumber} is now ${updated.status}.`, "success");
    await loadSalesOps();
  }
  function openWorkflowModal(target) {
    if (!target) {
      return;
    }
    setWorkflowTarget(target);
    setPendingWorkflowStatus(target.record.status);
    if (target.kind === "project") {
      setPendingProjectPercent(target.record.percentComplete);
    }
    setWorkflowOpen(true);
  }
  async function updateWorkflow() {
    if (!workflowTarget) {
      return;
    }
    if (workflowTarget.kind === "project") {
      const updated = await salesService.updateProjectStatus(workflowTarget.record.id, {
        status: pendingWorkflowStatus,
        percentComplete: pendingProjectPercent
      });
      setWorkflowTarget({ kind: "project", record: updated });
      showToast("Project updated", `${updated.projectCode} is now ${updated.status}.`, "success");
    } else {
      const updated = await salesService.updateTicketStatus(workflowTarget.record.id, { status: pendingWorkflowStatus });
      setWorkflowTarget({ kind: "ticket", record: updated });
      showToast("Case updated", `${updated.ticketNumber} is now ${updated.status}.`, "success");
    }
    await loadSalesOps();
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading sales and service information" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Sales & Delivery",
        title: "Sales and delivery",
        description: "Manage customer accounts, orders, projects, and support work in one connected operating area.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          canViewSales ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: openCustomerModal, children: "Add customer" }) : null,
          canViewSales && canViewCatalog ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: openOrderModal, disabled: customers.length === 0 || products.length === 0, children: "New order" }) : null,
          canViewOperations ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: openProjectModal, children: "New project" }) : null,
          canViewOperations ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: openTicketModal, children: "New support case" }) : null
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open orders", value: (metrics == null ? void 0 : metrics.openOrders) ?? orders.length, format: "number", subtitle: "Orders still in progress" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Completed orders", value: (metrics == null ? void 0 : metrics.completedOrders) ?? 0, format: "number", subtitle: "Orders finished recently" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Sales last 30 days", value: (metrics == null ? void 0 : metrics.revenueLast30Days) ?? 0, format: "currency", subtitle: "Recent sales activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open work", value: operationalBacklog, format: "number", subtitle: "Projects and cases still open" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SegmentedControl,
      {
        label: "Sales and delivery sections",
        value: activeView,
        onChange: (value) => setActiveView(value),
        options: [
          {
            value: "revenue",
            label: "Revenue operations",
            description: "Customers, orders, and account insight"
          },
          {
            value: "delivery",
            label: "Delivery operations",
            description: "Projects and customer service work"
          },
          {
            value: "field",
            label: "Field service",
            description: "Technician dispatch, offline jobs, and service execution"
          }
        ]
      }
    ),
    activeView === "revenue" ? canViewSales ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Orders",
          description: "Review customer orders, current status, and order details.",
          columns: [
            { key: "orderNumber", title: "Order", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.orderNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.customerName })
            ] }) },
            { key: "orderDate", title: "Ordered", sortable: true, render: (row) => formatDate(row.orderDate) },
            { key: "totalAmount", title: "Total", sortable: true, align: "right", render: (row) => formatCurrency(row.totalAmount) },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: orderTone(row.status) }) },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void openOrderDetail(row.id), children: "View details" }) }
          ],
          data: orders,
          rowKey: "id",
          searchKeys: ["orderNumber", "customerName", "status"],
          searchPlaceholder: "Search orders",
          toolbar: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: orderStatusFilter, onChange: (event) => setOrderStatusFilter(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pending", children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Processing", children: "Processing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Completed", children: "Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cancelled", children: "Cancelled" })
          ] }),
          emptyTitle: "No orders found",
          emptyDescription: "Try a different filter or come back after new orders are created."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Customers",
          description: "Review customers and open a quick summary for each account.",
          columns: [
            { key: "name", title: "Customer", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.email })
            ] }) },
            { key: "segment", title: "Segment", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.segment, tone: "info" }) },
            { key: "lifetimeValue", title: "Lifetime value", sortable: true, align: "right", render: (row) => formatCurrency(row.lifetimeValue) },
            { key: "outstandingBalance", title: "Outstanding", sortable: true, align: "right", render: (row) => formatCurrency(row.outstandingBalance) },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => void openCustomerIntelligence(row.id), children: "View insights" }) }
          ],
          data: customers,
          rowKey: "id",
          searchKeys: ["name", "email", "segment", "contactNumber"],
          searchPlaceholder: "Search customers",
          toolbar: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: customerSegmentFilter, onChange: (event) => setCustomerSegmentFilter(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All segments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SMB", children: "SMB" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Enterprise", children: "Enterprise" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Strategic", children: "Strategic" })
          ] }),
          emptyTitle: "No customers found",
          emptyDescription: "Try a different segment or add a new customer."
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sales area unavailable", description: "This account does not currently have access to sales information.", compact: true }) : null,
    activeView === "delivery" ? canViewOperations ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Projects",
          description: "Track project progress, customer commitments, and current status.",
          columns: [
            { key: "projectCode", title: "Project", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.projectCode }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.name })
            ] }) },
            { key: "customerName", title: "Customer", sortable: true },
            { key: "budget", title: "Budget", sortable: true, align: "right", render: (row) => formatCurrency(row.budget) },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: projectTone(row.status) }) },
            { key: "percentComplete", title: "Complete", sortable: true, align: "right", render: (row) => `${row.percentComplete}%` },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openWorkflowModal({ kind: "project", record: row }), children: "Update status" }) }
          ],
          data: projects,
          rowKey: "id",
          searchKeys: ["projectCode", "name", "customerName", "projectManager", "status"],
          searchPlaceholder: "Search projects",
          toolbar: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: projectStatusFilter, onChange: (event) => setProjectStatusFilter(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Planning", children: "Planning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "At Risk", children: "At Risk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Completed", children: "Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "On Hold", children: "On Hold" })
          ] }),
          emptyTitle: "No projects found",
          emptyDescription: "Try a different status filter or add a new project."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Support cases",
          description: "Review support work, priorities, due dates, and progress.",
          columns: [
            { key: "ticketNumber", title: "Case", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.ticketNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.subject })
            ] }) },
            { key: "customerName", title: "Customer", sortable: true },
            { key: "priority", title: "Priority", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.priority, tone: priorityTone(row.priority) }) },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: ticketTone(row.status) }) },
            { key: "dueAt", title: "Due", sortable: true, render: (row) => formatDateTime(row.dueAt) },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openWorkflowModal({ kind: "ticket", record: row }), children: "Update status" }) }
          ],
          data: tickets,
          rowKey: "id",
          searchKeys: ["ticketNumber", "customerName", "subject", "assignedTeam", "status"],
          searchPlaceholder: "Search tickets",
          toolbar: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: ticketStatusFilter, onChange: (event) => setTicketStatusFilter(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "New", children: "New" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "In Progress", children: "In Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Resolved", children: "Resolved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Escalated", children: "Escalated" })
          ] }),
          emptyTitle: "No support cases found",
          emptyDescription: "Try a different filter or add a new case."
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Operations area unavailable", description: "This account does not currently have access to project or support information.", compact: true }) : null,
    activeView === "field" ? canViewOperations ? /* @__PURE__ */ jsxRuntimeExports.jsx(FieldServicePanel, { tickets }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Field service unavailable", description: "This account does not currently have access to field-service workflows.", compact: true }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: customerModalOpen,
        onClose: () => setCustomerModalOpen(false),
        title: "Add customer",
        description: "Add a new customer to your organization.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setCustomerModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "customer-form", className: "primary-button", disabled: customerForm.formState.isSubmitting, children: customerForm.formState.isSubmitting ? "Saving..." : "Add customer" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "customer-form", className: "form-grid form-grid--two", onSubmit: customerForm.handleSubmit(submitCustomer), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Customer name", error: (_a = customerForm.formState.errors.name) == null ? void 0 : _a.message, registration: customerForm.register("name", { required: "Please enter a customer name." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Email", type: "email", error: (_b = customerForm.formState.errors.email) == null ? void 0 : _b.message, registration: customerForm.register("email", { required: "Please enter an email address." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Contact number", error: (_c = customerForm.formState.errors.contactNumber) == null ? void 0 : _c.message, registration: customerForm.register("contactNumber", { required: "Please enter a contact number." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Segment", error: (_d = customerForm.formState.errors.segment) == null ? void 0 : _d.message, registration: customerForm.register("segment", { required: "Please choose a segment." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SMB", children: "SMB" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Enterprise", children: "Enterprise" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Strategic", children: "Strategic" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: orderModalOpen,
        onClose: () => setOrderModalOpen(false),
        title: "New order",
        description: "Create a new customer order.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setOrderModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "order-form", className: "primary-button", disabled: orderForm.formState.isSubmitting, children: orderForm.formState.isSubmitting ? "Saving..." : "Save order" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "order-form", className: "form-grid form-grid--two", onSubmit: orderForm.handleSubmit(submitOrder), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Customer", error: (_e = orderForm.formState.errors.customerId) == null ? void 0 : _e.message, registration: orderForm.register("customerId", { required: "Please choose a customer." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select customer" }),
            customers.map((customer) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: customer.id, children: customer.name }, customer.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Product", error: (_f = orderForm.formState.errors.productId) == null ? void 0 : _f.message, registration: orderForm.register("productId", { required: "Please choose a product." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select product" }),
            products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: product.id, children: [
              product.name,
              " / ",
              product.sku
            ] }, product.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Quantity", type: "number", error: (_g = orderForm.formState.errors.quantity) == null ? void 0 : _g.message, registration: orderForm.register("quantity", { required: "Please enter a quantity.", valueAsNumber: true, min: 1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Payment method", error: (_h = orderForm.formState.errors.paymentMethod) == null ? void 0 : _h.message, registration: orderForm.register("paymentMethod", { required: "Please choose a payment method." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Bank Transfer", children: "Bank Transfer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Card", children: "Card" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: projectModalOpen,
        onClose: () => setProjectModalOpen(false),
        title: "New project",
        description: "Add a new project to the work plan.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setProjectModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "project-form", className: "primary-button", disabled: projectForm.formState.isSubmitting, children: projectForm.formState.isSubmitting ? "Saving..." : "Save project" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "project-form", className: "form-grid form-grid--two", onSubmit: projectForm.handleSubmit(submitProject), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Project name", error: (_i = projectForm.formState.errors.name) == null ? void 0 : _i.message, registration: projectForm.register("name", { required: "Please enter a project name." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Customer name", error: (_j = projectForm.formState.errors.customerName) == null ? void 0 : _j.message, registration: projectForm.register("customerName", { required: "Please enter the customer name." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Project manager", error: (_k = projectForm.formState.errors.projectManager) == null ? void 0 : _k.message, registration: projectForm.register("projectManager", { required: "Please enter a project manager." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Budget", type: "number", step: "0.01", error: (_l = projectForm.formState.errors.budget) == null ? void 0 : _l.message, registration: projectForm.register("budget", { required: "Please enter a budget.", valueAsNumber: true, min: 1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Due date", type: "date", error: (_m = projectForm.formState.errors.dueDate) == null ? void 0 : _m.message, registration: projectForm.register("dueDate", { required: "Please choose a due date." }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: ticketModalOpen,
        onClose: () => setTicketModalOpen(false),
        title: "New support case",
        description: "Create a new case for the support team.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setTicketModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "ticket-form", className: "primary-button", disabled: ticketForm.formState.isSubmitting, children: ticketForm.formState.isSubmitting ? "Saving..." : "Save case" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "ticket-form", className: "form-grid form-grid--two", onSubmit: ticketForm.handleSubmit(submitTicket), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Customer", registration: ticketForm.register("customerId"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select existing customer (optional)" }),
            customers.map((customer) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: customer.id, children: customer.name }, customer.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Customer name", error: (_n = ticketForm.formState.errors.customerName) == null ? void 0 : _n.message, registration: ticketForm.register("customerName", { required: "Please enter the customer name." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Subject", error: (_o = ticketForm.formState.errors.subject) == null ? void 0 : _o.message, registration: ticketForm.register("subject", { required: "Please enter a subject." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Priority", error: (_p = ticketForm.formState.errors.priority) == null ? void 0 : _p.message, registration: ticketForm.register("priority", { required: "Please choose a priority." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Low", children: "Low" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Medium", children: "Medium" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "High", children: "High" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Assigned team", error: (_q = ticketForm.formState.errors.assignedTeam) == null ? void 0 : _q.message, registration: ticketForm.register("assignedTeam", { required: "Please enter an assigned team." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Due in hours", type: "number", error: (_r = ticketForm.formState.errors.dueInHours) == null ? void 0 : _r.message, registration: ticketForm.register("dueInHours", { required: "Please enter the due time in hours.", valueAsNumber: true, min: 1 }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: customerInsightOpen, onClose: () => setCustomerInsightOpen(false), title: (customerInsight == null ? void 0 : customerInsight.customerName) || "Customer insights", description: "Customer value, payment position, and growth guidance.", children: customerInsight ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Account summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Lifetime value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(customerInsight.lifetimeValue) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Average order value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(customerInsight.averageOrderValue) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: customerInsight.ordersCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Outstanding balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(customerInsight.outstandingBalance) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Growth outlook" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Retention risk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                customerInsight.churnRiskScore,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Retention", tone: customerInsight.churnRiskScore > 60 ? "danger" : "warning" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Growth potential" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                customerInsight.expansionScore,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Growth", tone: customerInsight.expansionScore > 60 ? "success" : "info" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row list-row--stacked", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Recommended next step" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: customerInsight.nextBestAction })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Recommendation", tone: "info" })
          ] })
        ] })
      ] })
    ] }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: orderDetailOpen,
        onClose: () => setOrderDetailOpen(false),
        title: (selectedOrder == null ? void 0 : selectedOrder.orderNumber) || "Order details",
        description: selectedOrder ? `${selectedOrder.customerName} / ${formatDate(selectedOrder.orderDate)}` : "Order details",
        size: "lg",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setOrderDetailOpen(false), children: "Close" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => void updateOrderStatus(), children: "Update status" })
        ] }),
        children: selectedOrder ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Order summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "detail-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: selectedOrder.status, tone: orderTone(selectedOrder.status) }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Subtotal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(selectedOrder.subtotal) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Tax" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(selectedOrder.taxAmount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: formatCurrency(selectedOrder.totalAmount) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Order progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__label", children: "Order status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: pendingOrderStatus, onChange: (event) => setPendingOrderStatus(event.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pending", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Processing", children: "Processing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Completed", children: "Completed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cancelled", children: "Cancelled" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-card detail-card--full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Items" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: selectedOrder.lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: line.productName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "Qty ",
                  line.quantity
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-inline", children: formatCurrency(line.lineTotal) })
            ] }, `${selectedOrder.id}-${line.productId}`)) })
          ] })
        ] }) : null
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: workflowOpen,
        onClose: () => setWorkflowOpen(false),
        title: workflowTarget ? `${workflowTarget.kind === "project" ? workflowTarget.record.projectCode : workflowTarget.record.ticketNumber}` : "Update status",
        description: workflowTarget ? `Choose the latest ${workflowTarget.kind === "project" ? "project" : "case"} status.` : "Choose the latest status.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setWorkflowOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => void updateWorkflow(), children: "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-grid form-grid--two", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__label", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "select", value: pendingWorkflowStatus, onChange: (event) => setPendingWorkflowStatus(event.target.value), children: (workflowTarget == null ? void 0 : workflowTarget.kind) === "project" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Planning", children: "Planning" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "At Risk", children: "At Risk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Completed", children: "Completed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "On Hold", children: "On Hold" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "New", children: "New" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "In Progress", children: "In Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Resolved", children: "Resolved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Escalated", children: "Escalated" })
            ] }) })
          ] }),
          (workflowTarget == null ? void 0 : workflowTarget.kind) === "project" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__label", children: "Completion (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", type: "number", min: "0", max: "100", value: pendingProjectPercent, onChange: (event) => setPendingProjectPercent(Number(event.target.value)) })
          ] }) : null
        ] })
      }
    )
  ] });
}
export {
  Orders as default
};
