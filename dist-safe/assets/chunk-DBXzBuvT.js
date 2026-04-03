import { r as reactExports, u as useForm, j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
import { A as AIAssistant } from "./chunk-75NoTDq9.js";
import { C as CategoryBarChart } from "./chunk-BksghESX.js";
import { D as DataTable } from "./chunk-BhPLEvpZ.js";
import { E as EmptyState, P as PageHeader, S as StatCard } from "./chunk-CaIpWVc3.js";
import { S as SelectField, T as TextAreaField } from "./chunk-Nxb3cxB-.js";
import { h as useToast, S as Spinner, b as StatusBadge, f as formatCurrency } from "./app-C4Pvg4H3.js";
import { f as financeService } from "./chunk-sniMbSt7.js";
import { P as Papa } from "./chunk-WpjEHaE1.js";
import "./chunk-CsYwSQuG.js";
import "./chunk-CzznHu47.js";
import "./chunk-DYvrnLMg.js";
import "./chunk-BFW3X9Eb.js";
function exportToCsv(filename, rows) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
function toLabel(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
function Reports() {
  var _a, _b;
  const { showToast } = useToast();
  const [loading, setLoading] = reactExports.useState(true);
  const [snapshot, setSnapshot] = reactExports.useState(null);
  const [aging, setAging] = reactExports.useState(null);
  const [overdueInvoices, setOverdueInvoices] = reactExports.useState([]);
  const [extractionResult, setExtractionResult] = reactExports.useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      documentType: "Invoice",
      content: ""
    }
  });
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadReports() {
      setLoading(true);
      const [snapshotResult, agingResult, overdueInvoicesResult] = await Promise.allSettled([
        financeService.getReportingSnapshot(),
        financeService.getInvoiceAging(),
        financeService.getInvoices(true)
      ]);
      if (!isMounted) {
        return;
      }
      setSnapshot(snapshotResult.status === "fulfilled" ? snapshotResult.value : null);
      setAging(agingResult.status === "fulfilled" ? agingResult.value : null);
      setOverdueInvoices(overdueInvoicesResult.status === "fulfilled" ? overdueInvoicesResult.value : []);
      setLoading(false);
    }
    void loadReports();
    return () => {
      isMounted = false;
    };
  }, []);
  async function exportReport() {
    exportToCsv(
      "erp-reporting-snapshot.csv",
      overdueInvoices.map((invoice) => ({
        InvoiceNumber: invoice.invoiceNumber,
        CustomerName: invoice.customerName,
        DueDate: invoice.dueDate,
        TotalAmount: invoice.totalAmount,
        Balance: invoice.balance,
        Status: invoice.status,
        DaysOverdue: invoice.daysOverdue
      }))
    );
    showToast("Export ready", "Past-due invoice details were exported to CSV.", "success");
  }
  async function extractDocument(values) {
    const result = await financeService.extractDocument({
      documentType: values.documentType,
      content: values.content
    });
    setExtractionResult(result);
    showToast("Review complete", `${result.documentType} details were reviewed with ${result.confidencePercent}% confidence.`, "success");
    reset(values);
  }
  const agingBars = reactExports.useMemo(
    () => (aging == null ? void 0 : aging.buckets.map((item) => ({
      label: item.label,
      value: item.amount
    }))) || [],
    [aging]
  );
  const operationalBars = reactExports.useMemo(() => {
    if (!snapshot) {
      return [];
    }
    return [
      { label: "Open Projects", value: snapshot.openProjects },
      { label: "Open Tickets", value: snapshot.openTickets },
      { label: "Open Work Orders", value: snapshot.openWorkOrders }
    ];
  }, [snapshot]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading reports and insights" });
  }
  if (!snapshot) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Reports unavailable", description: "We could not load the reporting summary right now." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Analytics",
        title: "Analytics and exports",
        description: "Review key results, export lists, and summarize performance.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => void exportReport(), disabled: overdueInvoices.length === 0, children: "Export CSV" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Sales last 30 days", value: snapshot.revenueLast30Days, format: "currency", subtitle: "Recent sales activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Collections last 30 days", value: snapshot.collectionsLast30Days, format: "currency", subtitle: "Recent payments received" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Inventory value", value: snapshot.inventoryValue, format: "currency", subtitle: "Current stock value" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Outstanding balance", value: snapshot.outstandingBalance, format: "currency", subtitle: "Open balance still unpaid" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Invoice aging distribution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Open balances grouped by how long they have been outstanding." })
        ] }) }),
        agingBars.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBarChart, { data: agingBars, valueLabel: "currency" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No aging data", description: "Invoice aging details are not available right now.", compact: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Operational workload" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Open work across projects, support, and production." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBarChart, { data: operationalBars })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AIAssistant,
        {
          title: "Reporting assistant",
          description: "Ask for a plain-language summary of the numbers on this page.",
          initialMessage: "Ask for a summary of sales, collections, past-due invoices, or open work.",
          suggestions: ["Summarize current revenue and collections", "What needs leadership attention?", "How exposed are overdue invoices?"],
          generateResponse: async (question) => {
            const response = await financeService.askReportingAssistant({ question });
            const metrics = Object.entries(response.metrics).slice(0, 3).map(([key, value]) => `${toLabel(key)}: ${value}`).join(" | ");
            return metrics ? `${response.narrative} ${metrics}` : response.narrative;
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Document extraction" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Paste invoice, receipt, or statement text to pull out key details." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "form-grid", onSubmit: handleSubmit(extractDocument), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SelectField,
            {
              label: "Document type",
              error: (_a = errors.documentType) == null ? void 0 : _a.message,
              registration: register("documentType", { required: "Please choose a document type." }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Invoice", children: "Invoice" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Receipt", children: "Receipt" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Statement", children: "Statement" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextAreaField,
            {
              label: "Document text",
              placeholder: "Paste text from a document to review key details",
              error: (_b = errors.content) == null ? void 0 : _b.message,
              registration: register("content", { required: "Please paste the document text." })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "primary-button", disabled: isSubmitting, children: isSubmitting ? "Reviewing..." : "Review document" })
        ] }),
        extractionResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list report-result", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: extractionResult.documentType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Key details found" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusBadge,
              {
                label: `${extractionResult.confidencePercent}% confidence`,
                tone: extractionResult.confidencePercent >= 80 ? "success" : "warning"
              }
            )
          ] }),
          Object.entries(extractionResult.fields).map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: toLabel(key) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Field", tone: "info" })
          ] }, key)),
          extractionResult.warnings.map((warning) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Needs review" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: warning })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Review", tone: "warning" })
          ] }, warning))
        ] }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Past-due invoices",
        description: "Past-due invoice list used for exports and follow-up.",
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
            title: "Due date",
            sortable: true
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
            key: "status",
            title: "Status",
            sortable: true,
            render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: row.daysOverdue > 30 ? "danger" : "warning" })
          }
        ],
        data: overdueInvoices,
        rowKey: "id",
        searchKeys: ["invoiceNumber", "customerName", "status"],
        searchPlaceholder: "Search past-due invoices",
        emptyTitle: "No past-due invoices",
        emptyDescription: "There are no past-due invoices to review right now."
      }
    )
  ] });
}
export {
  Reports as default
};
