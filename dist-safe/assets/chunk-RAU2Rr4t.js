import { j as jsxRuntimeExports, r as reactExports, u as useForm } from "./chunk-dJI1vi8Z.js";
import { C as CategoryBarChart } from "./chunk-BksghESX.js";
import { M as Modal, S as SegmentedControl } from "./chunk-DQM-MyuJ.js";
import { D as DataTable } from "./chunk-BhPLEvpZ.js";
import { S as StatCard, E as EmptyState, P as PageHeader } from "./chunk-CaIpWVc3.js";
import { S as SelectField, I as InputField, T as TextAreaField } from "./chunk-Nxb3cxB-.js";
import { h as useToast, S as Spinner, b as StatusBadge, e as formatDateTime, i as formatDate, f as formatCurrency, u as useAuth } from "./app-C4Pvg4H3.js";
import { i as inventoryService } from "./chunk-BzDiCWHV.js";
import { s as salesService } from "./chunk-BTMvV6bG.js";
import { r as roleGroups } from "./chunk-DoPO7Lc7.js";
import { c as catalogService } from "./chunk-SLBPMIve.js";
import "./chunk-CsYwSQuG.js";
import "./chunk-CzznHu47.js";
import "./chunk-DYvrnLMg.js";
import "./chunk-BFW3X9Eb.js";
function ConfirmDialog({
  open,
  title,
  description,
  note = "Please confirm that you want to continue.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  tone = "danger",
  onConfirm,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title,
      description,
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: onClose, disabled: loading, children: cancelLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: tone === "danger" ? "danger-button" : "primary-button", onClick: onConfirm, disabled: loading, children: loading ? "Processing..." : confirmLabel })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "confirm-dialog", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: note }) })
    }
  );
}
function toneFromStatus(status) {
  switch (status.toLowerCase()) {
    case "completed":
    case "capitalized":
    case "delivered":
    case "approved":
    case "implemented":
    case "healthy":
    case "released":
      return "success";
    case "scheduled":
    case "issued":
    case "submitted":
    case "in transit":
    case "pilot":
      return "info";
    case "variance":
    case "warning":
    case "awarded":
      return "warning";
    default:
      return "danger";
  }
}
function SupplyChainEnterprisePanel({ products }) {
  const { showToast } = useToast();
  const [loading, setLoading] = reactExports.useState(true);
  const [warehouses, setWarehouses] = reactExports.useState([]);
  const [transfers, setTransfers] = reactExports.useState([]);
  const [shipments, setShipments] = reactExports.useState([]);
  const [fixedAssets, setFixedAssets] = reactExports.useState([]);
  const [compliance, setCompliance] = reactExports.useState(null);
  const [lifecycles, setLifecycles] = reactExports.useState([]);
  const [changes, setChanges] = reactExports.useState([]);
  const [companies, setCompanies] = reactExports.useState([]);
  const [branches, setBranches] = reactExports.useState([]);
  const [transferOpen, setTransferOpen] = reactExports.useState(false);
  const [shipmentOpen, setShipmentOpen] = reactExports.useState(false);
  const [fixedAssetOpen, setFixedAssetOpen] = reactExports.useState(false);
  const [lifecycleOpen, setLifecycleOpen] = reactExports.useState(false);
  const [changeOpen, setChangeOpen] = reactExports.useState(false);
  const [shipmentStatusOpen, setShipmentStatusOpen] = reactExports.useState(false);
  const [assetTransferOpen, setAssetTransferOpen] = reactExports.useState(false);
  const [assetRevalueOpen, setAssetRevalueOpen] = reactExports.useState(false);
  const [changeStatusOpen, setChangeStatusOpen] = reactExports.useState(false);
  const [selectedShipment, setSelectedShipment] = reactExports.useState(null);
  const [selectedFixedAsset, setSelectedFixedAsset] = reactExports.useState(null);
  const [selectedChange, setSelectedChange] = reactExports.useState(null);
  const transferForm = useForm({ defaultValues: { fromWarehouseCode: "", toWarehouseCode: "", productId: "", quantity: 1, reason: "" } });
  const shipmentForm = useForm({ defaultValues: { direction: "Outbound", carrier: "", trackingNumber: "", originWarehouseCode: "", destinationName: "", scheduledShipDate: "" } });
  const fixedAssetForm = useForm({
    defaultValues: {
      name: "",
      assetClass: "",
      companyCode: "",
      branchCode: "",
      acquisitionCost: 0,
      salvageValue: 0,
      depreciationMethod: "SLM",
      usefulLifeMonths: 60,
      depreciationRate: 20,
      ownerDepartment: "",
      currentLocation: ""
    }
  });
  const lifecycleForm = useForm({ defaultValues: { productId: "", version: "", lifecycleStage: "Released", componentProductId: "", quantity: 1, unitOfMeasure: "EA" } });
  const changeForm = useForm({ defaultValues: { productLifecycleId: "", title: "", requestedBy: "", impactSummary: "" } });
  const shipmentStatusForm = useForm({ defaultValues: { status: "Scheduled" } });
  const fixedAssetTransferForm = useForm({ defaultValues: { branchCode: "", currentLocation: "", ownerDepartment: "" } });
  const fixedAssetRevalueForm = useForm({ defaultValues: { revaluationAmount: 0 } });
  const changeStatusForm = useForm({ defaultValues: { status: "Approved" } });
  async function loadEnterprise() {
    setLoading(true);
    const [warehousesResult, transfersResult, shipmentsResult, fixedAssetsResult, complianceResult, lifecyclesResult, changesResult, companiesResult, branchesResult] = await Promise.allSettled([
      inventoryService.getWarehouses(),
      inventoryService.getStockTransfers(),
      inventoryService.getShipments(),
      inventoryService.getFixedAssets(),
      inventoryService.getFixedAssetComplianceReport(),
      salesService.getProductLifecycles(),
      salesService.getProductChanges(),
      salesService.getCompanies(),
      salesService.getBranches()
    ]);
    setWarehouses(warehousesResult.status === "fulfilled" ? warehousesResult.value : []);
    setTransfers(transfersResult.status === "fulfilled" ? transfersResult.value : []);
    setShipments(shipmentsResult.status === "fulfilled" ? shipmentsResult.value : []);
    setFixedAssets(fixedAssetsResult.status === "fulfilled" ? fixedAssetsResult.value : []);
    setCompliance(complianceResult.status === "fulfilled" ? complianceResult.value : null);
    setLifecycles(lifecyclesResult.status === "fulfilled" ? lifecyclesResult.value : []);
    setChanges(changesResult.status === "fulfilled" ? changesResult.value : []);
    setCompanies(companiesResult.status === "fulfilled" ? companiesResult.value : []);
    setBranches(branchesResult.status === "fulfilled" ? branchesResult.value : []);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void loadEnterprise();
  }, []);
  const warehouseSummary = reactExports.useMemo(
    () => warehouses.map((warehouse) => ({
      id: warehouse.id,
      warehouseCode: warehouse.warehouseCode,
      name: warehouse.name,
      branchCode: warehouse.branchCode,
      type: warehouse.type,
      skuCount: warehouse.stock.length,
      onHand: warehouse.stock.reduce((sum, stock) => sum + stock.quantityOnHand, 0),
      reserved: warehouse.stock.reduce((sum, stock) => sum + stock.quantityReserved, 0)
    })),
    [warehouses]
  );
  async function submitTransfer(values) {
    await inventoryService.createStockTransfer({
      fromWarehouseCode: values.fromWarehouseCode,
      toWarehouseCode: values.toWarehouseCode,
      productId: values.productId,
      quantity: Number(values.quantity),
      reason: values.reason
    });
    showToast("Transfer completed", "The warehouse transfer was posted successfully.", "success");
    setTransferOpen(false);
    await loadEnterprise();
  }
  async function submitShipment(values) {
    await inventoryService.createShipment({
      direction: values.direction,
      carrier: values.carrier,
      trackingNumber: values.trackingNumber,
      originWarehouseCode: values.originWarehouseCode,
      destinationName: values.destinationName,
      scheduledShipDate: new Date(values.scheduledShipDate).toISOString()
    });
    showToast("Shipment scheduled", "The shipment has been added to logistics planning.", "success");
    setShipmentOpen(false);
    await loadEnterprise();
  }
  async function submitFixedAsset(values) {
    await inventoryService.createFixedAsset({
      name: values.name,
      assetClass: values.assetClass,
      companyCode: values.companyCode,
      branchCode: values.branchCode,
      acquisitionCost: Number(values.acquisitionCost),
      salvageValue: Number(values.salvageValue),
      depreciationMethod: values.depreciationMethod,
      usefulLifeMonths: Number(values.usefulLifeMonths),
      depreciationRate: Number(values.depreciationRate),
      ownerDepartment: values.ownerDepartment,
      currentLocation: values.currentLocation
    });
    showToast("Fixed asset capitalized", "The fixed asset register has been updated.", "success");
    setFixedAssetOpen(false);
    await loadEnterprise();
  }
  async function submitLifecycle(values) {
    await salesService.createProductLifecycle({
      productId: values.productId,
      version: values.version,
      lifecycleStage: values.lifecycleStage,
      billOfMaterials: [
        {
          componentProductId: values.componentProductId,
          quantity: Number(values.quantity),
          unitOfMeasure: values.unitOfMeasure
        }
      ]
    });
    showToast("Lifecycle released", "The product lifecycle and BOM were saved.", "success");
    setLifecycleOpen(false);
    await loadEnterprise();
  }
  async function submitChange(values) {
    await salesService.createProductChange(values);
    showToast("Engineering change submitted", "The PLM change request is now in the workflow.", "success");
    setChangeOpen(false);
    await loadEnterprise();
  }
  async function runDepreciation() {
    await inventoryService.runDepreciation({ runDate: (/* @__PURE__ */ new Date()).toISOString() });
    showToast("Depreciation completed", "The fixed-asset depreciation run has been posted.", "success");
    await loadEnterprise();
  }
  function openShipmentStatusModal(shipment) {
    setSelectedShipment(shipment);
    shipmentStatusForm.reset({ status: shipment.status });
    setShipmentStatusOpen(true);
  }
  function openFixedAssetTransferModal(asset) {
    setSelectedFixedAsset(asset);
    fixedAssetTransferForm.reset({
      branchCode: asset.branchCode,
      currentLocation: asset.currentLocation,
      ownerDepartment: asset.ownerDepartment
    });
    setAssetTransferOpen(true);
  }
  function openFixedAssetRevalueModal(asset) {
    setSelectedFixedAsset(asset);
    fixedAssetRevalueForm.reset({ revaluationAmount: 0 });
    setAssetRevalueOpen(true);
  }
  function openChangeStatusModal(change) {
    setSelectedChange(change);
    changeStatusForm.reset({ status: change.status });
    setChangeStatusOpen(true);
  }
  async function submitShipmentStatus(values) {
    if (!selectedShipment) {
      return;
    }
    await inventoryService.updateShipmentStatus(selectedShipment.id, values);
    showToast("Shipment updated", `${selectedShipment.shipmentNumber} is now ${values.status}.`, "success");
    setShipmentStatusOpen(false);
    await loadEnterprise();
  }
  async function submitFixedAssetTransfer(values) {
    if (!selectedFixedAsset) {
      return;
    }
    await inventoryService.transferFixedAsset(selectedFixedAsset.id, values);
    showToast("Fixed asset transferred", `${selectedFixedAsset.assetNumber} ownership has been updated.`, "success");
    setAssetTransferOpen(false);
    await loadEnterprise();
  }
  async function submitFixedAssetRevalue(values) {
    if (!selectedFixedAsset) {
      return;
    }
    await inventoryService.revalueFixedAsset(selectedFixedAsset.id, {
      revaluationAmount: Number(values.revaluationAmount)
    });
    showToast("Fixed asset revalued", `${selectedFixedAsset.assetNumber} book value has been updated.`, "success");
    setAssetRevalueOpen(false);
    await loadEnterprise();
  }
  async function submitChangeStatus(values) {
    if (!selectedChange) {
      return;
    }
    await salesService.updateProductChangeStatus(selectedChange.id, values);
    showToast("Engineering change updated", `${selectedChange.changeNumber} is now ${values.status}.`, "success");
    setChangeStatusOpen(false);
    await loadEnterprise();
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { label: "Loading enterprise supply chain modules" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "enterprise-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-hero__copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-header__eyebrow", children: "Enterprise Expansion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Supply, asset, and engineering control tower" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Review multi-location stock, fixed-asset compliance, shipments, and PLM change control from one connected operations layer." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-hero__actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setTransferOpen(true), children: "New transfer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setShipmentOpen(true), children: "Schedule shipment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setFixedAssetOpen(true), children: "Capitalize asset" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => void runDepreciation(), children: "Run depreciation" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Warehouses", value: warehouses.length, format: "number", subtitle: "Active stocking locations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Transfers", value: transfers.length, format: "number", subtitle: "Inter-warehouse movements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Shipments in transit", value: shipments.filter((item) => item.status === "In Transit").length, format: "number", subtitle: "Logistics currently moving" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Net asset value", value: (compliance == null ? void 0 : compliance.netBookValue) ?? 0, format: "currency", subtitle: "Fixed asset register" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Warehouses",
          description: "Multi-location stock posture with reserved inventory visibility.",
          columns: [
            { key: "warehouseCode", title: "Warehouse", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.warehouseCode }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.name })
            ] }) },
            { key: "branchCode", title: "Branch", sortable: true },
            { key: "skuCount", title: "SKUs", sortable: true, align: "right" },
            { key: "onHand", title: "On hand", sortable: true, align: "right" },
            { key: "reserved", title: "Reserved", sortable: true, align: "right" }
          ],
          data: warehouseSummary,
          rowKey: "id",
          searchKeys: ["warehouseCode", "name", "branchCode", "type"],
          searchPlaceholder: "Search warehouses",
          emptyTitle: "No warehouses configured",
          emptyDescription: "Warehouses will appear here when inventory locations are available."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Stock transfers",
          description: "Completed replenishment and movement activity across warehouse nodes.",
          columns: [
            { key: "transferNumber", title: "Transfer", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.transferNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.productName })
            ] }) },
            { key: "fromWarehouseCode", title: "Route", sortable: true, render: (row) => `${row.fromWarehouseCode} -> ${row.toWarehouseCode}` },
            { key: "quantity", title: "Qty", sortable: true, align: "right" },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: toneFromStatus(row.status) }) },
            { key: "requestedAt", title: "When", sortable: true, render: (row) => formatDateTime(row.requestedAt) }
          ],
          data: transfers,
          rowKey: "id",
          searchKeys: ["transferNumber", "productName", "fromWarehouseCode", "toWarehouseCode"],
          searchPlaceholder: "Search transfers",
          emptyTitle: "No transfers yet",
          emptyDescription: "Warehouse movements will appear here after they are posted."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Shipments",
          description: "Outbound and inbound logistics commitments with current delivery state.",
          columns: [
            { key: "shipmentNumber", title: "Shipment", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.shipmentNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.destinationName })
            ] }) },
            { key: "carrier", title: "Carrier", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.carrier }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.trackingNumber })
            ] }) },
            { key: "direction", title: "Direction", sortable: true },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: toneFromStatus(row.status) }) },
            { key: "scheduledShipDate", title: "Scheduled", sortable: true, render: (row) => formatDate(row.scheduledShipDate) },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openShipmentStatusModal(row), children: "Update status" }) }
          ],
          data: shipments,
          rowKey: "id",
          searchKeys: ["shipmentNumber", "carrier", "trackingNumber", "destinationName"],
          searchPlaceholder: "Search shipments",
          emptyTitle: "No shipments scheduled",
          emptyDescription: "Shipment plans will appear here when logistics work is created."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card enterprise-summary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Fixed asset compliance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Depreciation control, book value, and accounting watchpoints." })
        ] }) }),
        compliance ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gross book value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(compliance.grossBookValue) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Accumulated depreciation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(compliance.accumulatedDepreciation) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Assets pending depreciation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: compliance.assetsPendingDepreciation })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "enterprise-summary__metric", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Net book value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatCurrency(compliance.netBookValue) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Compliance unavailable", description: "Fixed-asset compliance data is not available right now.", compact: true }),
        (compliance == null ? void 0 : compliance.complianceWarnings.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stack-list", children: compliance.complianceWarnings.slice(0, 4).map((warning) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Compliance warning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: warning })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Watch", tone: "warning" })
        ] }, warning)) }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Fixed assets",
          description: "Capitalized assets, depreciation basis, and current ownership.",
          columns: [
            { key: "assetNumber", title: "Asset", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.assetNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.name })
            ] }) },
            { key: "assetClass", title: "Class", sortable: true },
            { key: "residualValue", title: "Residual", sortable: true, align: "right", render: (row) => formatCurrency(row.residualValue) },
            { key: "ownerDepartment", title: "Owner", sortable: true },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: toneFromStatus(row.status) }) },
            { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-actions", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openFixedAssetTransferModal(row), children: "Transfer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openFixedAssetRevalueModal(row), children: "Revalue" })
            ] }) }
          ],
          data: fixedAssets,
          rowKey: "id",
          searchKeys: ["assetNumber", "name", "assetClass", "ownerDepartment", "currentLocation"],
          searchPlaceholder: "Search fixed assets",
          emptyTitle: "No fixed assets yet",
          emptyDescription: "Capitalized assets will appear here after they are posted."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "PLM lifecycles",
          description: "Released versions and their bill-of-material anchors.",
          columns: [
            { key: "version", title: "Lifecycle", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.version }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.productName })
            ] }) },
            { key: "lifecycleStage", title: "Stage", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.lifecycleStage, tone: toneFromStatus(row.lifecycleStage) }) },
            { key: "releasedAt", title: "Released", sortable: true, render: (row) => formatDate(row.releasedAt) },
            { key: "billOfMaterials", title: "BOM lines", align: "right", render: (row) => row.billOfMaterials.length }
          ],
          data: lifecycles,
          rowKey: "id",
          searchKeys: ["version", "productName", "lifecycleStage"],
          searchPlaceholder: "Search lifecycles",
          toolbar: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setLifecycleOpen(true), children: "New lifecycle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setChangeOpen(true), children: "New change" })
          ] }),
          emptyTitle: "No lifecycle records",
          emptyDescription: "Released product lifecycle records will appear here."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        title: "Engineering changes",
        description: "Change requests submitted across active product lifecycles.",
        columns: [
          { key: "changeNumber", title: "Change", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.changeNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.productName })
          ] }) },
          { key: "title", title: "Title", sortable: true },
          { key: "requestedBy", title: "Requested by", sortable: true },
          { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: toneFromStatus(row.status) }) },
          { key: "requestedAt", title: "Requested", sortable: true, render: (row) => formatDate(row.requestedAt) },
          { key: "actions", title: "Actions", render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openChangeStatusModal(row), children: "Update status" }) }
        ],
        data: changes,
        rowKey: "id",
        searchKeys: ["changeNumber", "title", "productName", "requestedBy", "status"],
        searchPlaceholder: "Search changes",
        emptyTitle: "No engineering changes",
        emptyDescription: "Engineering change requests will appear here after they are submitted."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: transferOpen, onClose: () => setTransferOpen(false), title: "Create stock transfer", description: "Move stock between warehouses without leaving the supply chain workspace.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setTransferOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "transfer-form", className: "primary-button", disabled: transferForm.formState.isSubmitting, children: transferForm.formState.isSubmitting ? "Saving..." : "Save transfer" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "transfer-form", className: "form-grid form-grid--two", onSubmit: transferForm.handleSubmit(submitTransfer), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "From warehouse", registration: transferForm.register("fromWarehouseCode", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select source" }),
        warehouses.map((warehouse) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: warehouse.warehouseCode, children: [
          warehouse.warehouseCode,
          " / ",
          warehouse.name
        ] }, warehouse.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "To warehouse", registration: transferForm.register("toWarehouseCode", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select destination" }),
        warehouses.map((warehouse) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: warehouse.warehouseCode, children: [
          warehouse.warehouseCode,
          " / ",
          warehouse.name
        ] }, warehouse.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Product", registration: transferForm.register("productId", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select product" }),
        products.filter((product) => product.isActive).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: product.id, children: product.name }, product.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Quantity", type: "number", registration: transferForm.register("quantity", { required: true, valueAsNumber: true, min: 1 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextAreaField, { label: "Reason", registration: transferForm.register("reason", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: shipmentOpen, onClose: () => setShipmentOpen(false), title: "Schedule shipment", description: "Create a logistics movement with carrier and destination details.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setShipmentOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "shipment-form", className: "primary-button", disabled: shipmentForm.formState.isSubmitting, children: shipmentForm.formState.isSubmitting ? "Saving..." : "Save shipment" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "shipment-form", className: "form-grid form-grid--two", onSubmit: shipmentForm.handleSubmit(submitShipment), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Direction", registration: shipmentForm.register("direction", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Outbound", children: "Outbound" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Inbound", children: "Inbound" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Origin warehouse", registration: shipmentForm.register("originWarehouseCode", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select warehouse" }),
        warehouses.map((warehouse) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: warehouse.warehouseCode, children: [
          warehouse.warehouseCode,
          " / ",
          warehouse.name
        ] }, warehouse.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Carrier", registration: shipmentForm.register("carrier", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Tracking number", registration: shipmentForm.register("trackingNumber", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Destination", registration: shipmentForm.register("destinationName", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Scheduled ship date", type: "datetime-local", registration: shipmentForm.register("scheduledShipDate", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: fixedAssetOpen, onClose: () => setFixedAssetOpen(false), title: "Capitalize fixed asset", description: "Post a new fixed asset with accounting ownership and depreciation basis.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setFixedAssetOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "fixed-asset-form", className: "primary-button", disabled: fixedAssetForm.formState.isSubmitting, children: fixedAssetForm.formState.isSubmitting ? "Saving..." : "Save asset" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "fixed-asset-form", className: "form-grid form-grid--two", onSubmit: fixedAssetForm.handleSubmit(submitFixedAsset), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Asset name", registration: fixedAssetForm.register("name", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Asset class", registration: fixedAssetForm.register("assetClass", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Company", registration: fixedAssetForm.register("companyCode", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select company" }),
        companies.map((company) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: company.companyCode, children: [
          company.companyCode,
          " / ",
          company.name
        ] }, company.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Branch", registration: fixedAssetForm.register("branchCode", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select branch" }),
        branches.map((branch) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: branch.branchCode, children: [
          branch.branchCode,
          " / ",
          branch.name
        ] }, branch.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Acquisition cost", type: "number", step: "0.01", registration: fixedAssetForm.register("acquisitionCost", { required: true, valueAsNumber: true, min: 1 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Salvage value", type: "number", step: "0.01", registration: fixedAssetForm.register("salvageValue", { required: true, valueAsNumber: true, min: 0 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Depreciation method", registration: fixedAssetForm.register("depreciationMethod", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SLM", children: "Straight line" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "WDV", children: "Written down value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CUSTOM", children: "Custom" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Useful life (months)", type: "number", registration: fixedAssetForm.register("usefulLifeMonths", { required: true, valueAsNumber: true, min: 1 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Depreciation rate", type: "number", step: "0.01", registration: fixedAssetForm.register("depreciationRate", { required: true, valueAsNumber: true, min: 0 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Owner department", registration: fixedAssetForm.register("ownerDepartment", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Current location", registration: fixedAssetForm.register("currentLocation", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: lifecycleOpen, onClose: () => setLifecycleOpen(false), title: "Release product lifecycle", description: "Publish a new lifecycle version and anchor it to a BOM component.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setLifecycleOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "lifecycle-form", className: "primary-button", disabled: lifecycleForm.formState.isSubmitting, children: lifecycleForm.formState.isSubmitting ? "Saving..." : "Save lifecycle" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "lifecycle-form", className: "form-grid form-grid--two", onSubmit: lifecycleForm.handleSubmit(submitLifecycle), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Product", registration: lifecycleForm.register("productId", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select product" }),
        products.filter((product) => product.isActive).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: product.id, children: product.name }, product.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Version", registration: lifecycleForm.register("version", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Lifecycle stage", registration: lifecycleForm.register("lifecycleStage", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Released", children: "Released" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pilot", children: "Pilot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Retired", children: "Retired" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "BOM component", registration: lifecycleForm.register("componentProductId", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select component" }),
        products.filter((product) => product.isActive).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: product.id, children: product.name }, product.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Component quantity", type: "number", step: "0.01", registration: lifecycleForm.register("quantity", { required: true, valueAsNumber: true, min: 0.01 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Unit of measure", registration: lifecycleForm.register("unitOfMeasure", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: changeOpen, onClose: () => setChangeOpen(false), title: "Submit engineering change", description: "Create a product change request for release management and review.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setChangeOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "change-form", className: "primary-button", disabled: changeForm.formState.isSubmitting, children: changeForm.formState.isSubmitting ? "Saving..." : "Submit change" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "change-form", className: "form-grid", onSubmit: changeForm.handleSubmit(submitChange), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Lifecycle", registration: changeForm.register("productLifecycleId", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select lifecycle" }),
        lifecycles.map((lifecycle) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: lifecycle.id, children: [
          lifecycle.productName,
          " / ",
          lifecycle.version
        ] }, lifecycle.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Title", registration: changeForm.register("title", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Requested by", registration: changeForm.register("requestedBy", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextAreaField, { label: "Impact summary", registration: changeForm.register("impactSummary", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: shipmentStatusOpen, onClose: () => setShipmentStatusOpen(false), title: (selectedShipment == null ? void 0 : selectedShipment.shipmentNumber) || "Update shipment", description: "Advance or close out the shipment state.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setShipmentStatusOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "shipment-status-form", className: "primary-button", disabled: shipmentStatusForm.formState.isSubmitting, children: shipmentStatusForm.formState.isSubmitting ? "Saving..." : "Save status" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { id: "shipment-status-form", className: "form-grid", onSubmit: shipmentStatusForm.handleSubmit(submitShipmentStatus), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Status", registration: shipmentStatusForm.register("status", { required: true }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Scheduled", children: "Scheduled" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "In Transit", children: "In Transit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Delivered", children: "Delivered" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Delayed", children: "Delayed" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: assetTransferOpen, onClose: () => setAssetTransferOpen(false), title: (selectedFixedAsset == null ? void 0 : selectedFixedAsset.assetNumber) || "Transfer asset", description: "Move the fixed asset to a new branch, owner, or location.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setAssetTransferOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "asset-transfer-form", className: "primary-button", disabled: fixedAssetTransferForm.formState.isSubmitting, children: fixedAssetTransferForm.formState.isSubmitting ? "Saving..." : "Save transfer" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "asset-transfer-form", className: "form-grid form-grid--two", onSubmit: fixedAssetTransferForm.handleSubmit(submitFixedAssetTransfer), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Branch", registration: fixedAssetTransferForm.register("branchCode", { required: true }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select branch" }),
        branches.map((branch) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: branch.branchCode, children: [
          branch.branchCode,
          " / ",
          branch.name
        ] }, branch.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Owner department", registration: fixedAssetTransferForm.register("ownerDepartment", { required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Current location", registration: fixedAssetTransferForm.register("currentLocation", { required: true }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: assetRevalueOpen, onClose: () => setAssetRevalueOpen(false), title: (selectedFixedAsset == null ? void 0 : selectedFixedAsset.assetNumber) || "Revalue asset", description: "Post a fixed-asset revaluation to the register.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setAssetRevalueOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "asset-revalue-form", className: "primary-button", disabled: fixedAssetRevalueForm.formState.isSubmitting, children: fixedAssetRevalueForm.formState.isSubmitting ? "Saving..." : "Save revaluation" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { id: "asset-revalue-form", className: "form-grid", onSubmit: fixedAssetRevalueForm.handleSubmit(submitFixedAssetRevalue), children: /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Revaluation amount", type: "number", step: "0.01", registration: fixedAssetRevalueForm.register("revaluationAmount", { required: true, valueAsNumber: true }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: changeStatusOpen, onClose: () => setChangeStatusOpen(false), title: (selectedChange == null ? void 0 : selectedChange.changeNumber) || "Update engineering change", description: "Move the engineering change through review, approval, or implementation.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setChangeStatusOpen(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "change-status-form", className: "primary-button", disabled: changeStatusForm.formState.isSubmitting, children: changeStatusForm.formState.isSubmitting ? "Saving..." : "Save change" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { id: "change-status-form", className: "form-grid", onSubmit: changeStatusForm.handleSubmit(submitChangeStatus), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Status", registration: changeStatusForm.register("status", { required: true }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Approved", children: "Approved" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Rejected", children: "Rejected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Implemented", children: "Implemented" })
    ] }) }) })
  ] });
}
function inventoryTone(isLowStock) {
  return isLowStock ? "danger" : "success";
}
function purchaseOrderTone(status) {
  return status.toLowerCase() === "received" ? "success" : "warning";
}
function workOrderTone(status) {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "blocked":
      return "danger";
    case "in progress":
      return "info";
    default:
      return "warning";
  }
}
function anomalyTone(value) {
  switch (value.toLowerCase()) {
    case "critical":
    case "high":
      return "danger";
    case "medium":
      return "warning";
    default:
      return "info";
  }
}
function Products() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
  const { canAccess, user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = reactExports.useState(true);
  const [activeView, setActiveView] = reactExports.useState("catalog");
  const [catalogOverview, setCatalogOverview] = reactExports.useState(null);
  const [inventoryDashboard, setInventoryDashboard] = reactExports.useState(null);
  const [categories, setCategories] = reactExports.useState([]);
  const [suppliers, setSuppliers] = reactExports.useState([]);
  const [products, setProducts] = reactExports.useState([]);
  const [inventoryItems, setInventoryItems] = reactExports.useState([]);
  const [purchaseOrders, setPurchaseOrders] = reactExports.useState([]);
  const [reorderRecommendations, setReorderRecommendations] = reactExports.useState([]);
  const [demandForecast, setDemandForecast] = reactExports.useState([]);
  const [assets, setAssets] = reactExports.useState([]);
  const [workOrders, setWorkOrders] = reactExports.useState([]);
  const [anomalies, setAnomalies] = reactExports.useState([]);
  const [productModalOpen, setProductModalOpen] = reactExports.useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = reactExports.useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = reactExports.useState(false);
  const [adjustmentModalOpen, setAdjustmentModalOpen] = reactExports.useState(false);
  const [purchaseOrderModalOpen, setPurchaseOrderModalOpen] = reactExports.useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = reactExports.useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = reactExports.useState(false);
  const [workOrderModalOpen, setWorkOrderModalOpen] = reactExports.useState(false);
  const [workOrderStatusOpen, setWorkOrderStatusOpen] = reactExports.useState(false);
  const [editingCategory, setEditingCategory] = reactExports.useState(null);
  const [editingSupplier, setEditingSupplier] = reactExports.useState(null);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = reactExports.useState(null);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = reactExports.useState(null);
  const [selectedAsset, setSelectedAsset] = reactExports.useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = reactExports.useState(null);
  const [archiveTarget, setArchiveTarget] = reactExports.useState(null);
  const [archiveSubmitting, setArchiveSubmitting] = reactExports.useState(false);
  const [receiveNotes, setReceiveNotes] = reactExports.useState("");
  const [receiveAt, setReceiveAt] = reactExports.useState("");
  const [pendingWorkOrderStatus, setPendingWorkOrderStatus] = reactExports.useState("Scheduled");
  const [pendingProducedQuantity, setPendingProducedQuantity] = reactExports.useState(0);
  const canViewCatalog = canAccess(roleGroups.catalogAccess);
  const canViewInventory = canAccess(roleGroups.inventoryAccess);
  const canManageInventory = canAccess(void 0, ["CanManageInventory"]);
  const canApprovePurchase = canAccess(void 0, ["CanApprovePurchase"]);
  const categoryForm = useForm({ defaultValues: { name: "" } });
  const supplierForm = useForm({ defaultValues: { name: "", contactName: "", email: "", leadTimeDays: 7 } });
  const productForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      categoryName: "",
      supplierName: "",
      price: 0,
      cost: 0,
      stockQuantity: 0,
      reorderLevel: 0,
      isActive: "true"
    }
  });
  const adjustmentForm = useForm({ defaultValues: { quantityDelta: 0, reason: "" } });
  const purchaseOrderForm = useForm({ defaultValues: { supplierId: "", productId: "", quantity: 1, notes: "" } });
  const maintenanceForm = useForm({ defaultValues: { servicedAt: "", conditionScore: 80, notes: "" } });
  const workOrderForm = useForm({ defaultValues: { productId: "", productName: "", workCenter: "", quantity: 1, plannedDurationHours: 8 } });
  async function loadWorkspace() {
    setLoading(true);
    const [
      catalogOverviewResult,
      categoriesResult,
      suppliersResult,
      productsResult,
      inventoryDashboardResult,
      inventoryItemsResult,
      purchaseOrdersResult,
      reorderRecommendationsResult,
      demandForecastResult,
      assetsResult,
      workOrdersResult,
      anomaliesResult
    ] = await Promise.allSettled([
      canViewCatalog ? catalogService.getOverview() : Promise.resolve(null),
      canViewCatalog ? catalogService.getCategories() : Promise.resolve([]),
      canViewCatalog ? catalogService.getSuppliers() : Promise.resolve([]),
      canViewCatalog ? catalogService.getProducts(void 0, true) : Promise.resolve([]),
      canViewInventory ? inventoryService.getDashboard() : Promise.resolve(null),
      canViewInventory ? inventoryService.getItems() : Promise.resolve([]),
      canViewInventory ? inventoryService.getPurchaseOrders() : Promise.resolve([]),
      canViewInventory ? inventoryService.getReorderRecommendations(14) : Promise.resolve([]),
      canViewInventory ? inventoryService.getDemandForecast(14) : Promise.resolve([]),
      canViewInventory ? inventoryService.getAssets(false) : Promise.resolve([]),
      canViewInventory ? inventoryService.getWorkOrders() : Promise.resolve([]),
      canViewInventory ? inventoryService.getAnomalies(6) : Promise.resolve([])
    ]);
    setCatalogOverview(catalogOverviewResult.status === "fulfilled" ? catalogOverviewResult.value : null);
    setCategories(categoriesResult.status === "fulfilled" ? categoriesResult.value : []);
    setSuppliers(suppliersResult.status === "fulfilled" ? suppliersResult.value : []);
    setProducts(productsResult.status === "fulfilled" ? productsResult.value : []);
    setInventoryDashboard(inventoryDashboardResult.status === "fulfilled" ? inventoryDashboardResult.value : null);
    setInventoryItems(inventoryItemsResult.status === "fulfilled" ? inventoryItemsResult.value : []);
    setPurchaseOrders(purchaseOrdersResult.status === "fulfilled" ? purchaseOrdersResult.value : []);
    setReorderRecommendations(reorderRecommendationsResult.status === "fulfilled" ? reorderRecommendationsResult.value.slice(0, 6) : []);
    setDemandForecast(demandForecastResult.status === "fulfilled" ? demandForecastResult.value.slice(0, 6) : []);
    setAssets(assetsResult.status === "fulfilled" ? assetsResult.value : []);
    setWorkOrders(workOrdersResult.status === "fulfilled" ? workOrdersResult.value : []);
    setAnomalies(anomaliesResult.status === "fulfilled" ? anomaliesResult.value : []);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void loadWorkspace();
  }, [canViewCatalog, canViewInventory]);
  const demandBars = reactExports.useMemo(
    () => demandForecast.map((item) => ({ label: item.productName, value: item.forecastUnits })),
    [demandForecast]
  );
  function openCategoryModal(category) {
    setEditingCategory(category || null);
    categoryForm.reset({ name: (category == null ? void 0 : category.name) || "" });
    setCategoryModalOpen(true);
  }
  function openSupplierModal(supplier) {
    setEditingSupplier(supplier || null);
    supplierForm.reset({
      name: (supplier == null ? void 0 : supplier.name) || "",
      contactName: (supplier == null ? void 0 : supplier.contactName) || "",
      email: (supplier == null ? void 0 : supplier.email) || "",
      leadTimeDays: (supplier == null ? void 0 : supplier.leadTimeDays) || 7
    });
    setSupplierModalOpen(true);
  }
  function openProductModal(product) {
    var _a2, _b2;
    setEditingProduct(product || null);
    productForm.reset({
      name: (product == null ? void 0 : product.name) || "",
      description: (product == null ? void 0 : product.description) || "",
      categoryName: (product == null ? void 0 : product.category) || ((_a2 = categories[0]) == null ? void 0 : _a2.name) || "",
      supplierName: (product == null ? void 0 : product.supplier) || ((_b2 = suppliers[0]) == null ? void 0 : _b2.name) || "",
      price: (product == null ? void 0 : product.price) || 0,
      cost: (product == null ? void 0 : product.cost) || 0,
      stockQuantity: (product == null ? void 0 : product.stockQuantity) || 0,
      reorderLevel: (product == null ? void 0 : product.reorderLevel) || 0,
      isActive: String((product == null ? void 0 : product.isActive) ?? true)
    });
    setProductModalOpen(true);
  }
  function openAdjustmentModal(item) {
    setSelectedInventoryItem(item);
    adjustmentForm.reset({ quantityDelta: 0, reason: "" });
    setAdjustmentModalOpen(true);
  }
  function openPurchaseOrderModal() {
    var _a2, _b2;
    purchaseOrderForm.reset({
      supplierId: ((_a2 = suppliers[0]) == null ? void 0 : _a2.id) || "",
      productId: ((_b2 = products.find((item) => item.isActive)) == null ? void 0 : _b2.id) || "",
      quantity: 1,
      notes: ""
    });
    setPurchaseOrderModalOpen(true);
  }
  function openReceiveModal(order) {
    setSelectedPurchaseOrder(order);
    setReceiveNotes("");
    setReceiveAt("");
    setReceiveModalOpen(true);
  }
  function openMaintenanceModal(asset) {
    setSelectedAsset(asset);
    maintenanceForm.reset({ servicedAt: "", conditionScore: asset.conditionScore, notes: "" });
    setMaintenanceModalOpen(true);
  }
  function openWorkOrderModal() {
    const product = products.find((item) => item.isActive);
    workOrderForm.reset({
      productId: (product == null ? void 0 : product.id) || "",
      productName: (product == null ? void 0 : product.name) || "",
      workCenter: "",
      quantity: 1,
      plannedDurationHours: 8
    });
    setWorkOrderModalOpen(true);
  }
  function openWorkOrderStatusModal(workOrder) {
    setSelectedWorkOrder(workOrder);
    setPendingWorkOrderStatus(workOrder.status);
    setPendingProducedQuantity(workOrder.producedQuantity);
    setWorkOrderStatusOpen(true);
  }
  async function submitCategory(values) {
    if (editingCategory) {
      await catalogService.updateCategory(editingCategory.id, values);
      showToast("Category saved", `${values.name} has been updated.`, "success");
    } else {
      await catalogService.createCategory(values);
      showToast("Category saved", `${values.name} has been added.`, "success");
    }
    setCategoryModalOpen(false);
    await loadWorkspace();
  }
  async function submitSupplier(values) {
    const payload = { ...values, leadTimeDays: Number(values.leadTimeDays) };
    if (editingSupplier) {
      await catalogService.updateSupplier(editingSupplier.id, payload);
      showToast("Supplier saved", `${values.name} has been updated.`, "success");
    } else {
      await catalogService.createSupplier(payload);
      showToast("Supplier saved", `${values.name} has been added.`, "success");
    }
    setSupplierModalOpen(false);
    await loadWorkspace();
  }
  async function submitProduct(values) {
    const payload = {
      name: values.name,
      description: values.description,
      categoryName: values.categoryName,
      supplierName: values.supplierName,
      price: Number(values.price),
      cost: Number(values.cost),
      stockQuantity: Number(values.stockQuantity),
      reorderLevel: Number(values.reorderLevel),
      isActive: values.isActive === "true"
    };
    if (editingProduct) {
      await catalogService.updateProduct(editingProduct.id, payload);
      showToast("Product saved", `${values.name} has been updated.`, "success");
    } else {
      await catalogService.createProduct(payload);
      showToast("Product saved", `${values.name} has been added.`, "success");
    }
    setProductModalOpen(false);
    await loadWorkspace();
  }
  async function archiveProduct() {
    if (!archiveTarget) {
      return;
    }
    setArchiveSubmitting(true);
    try {
      await catalogService.removeProduct(archiveTarget.id);
      showToast("Product archived", `${archiveTarget.name} has been marked inactive.`, "warning");
      setArchiveTarget(null);
      await loadWorkspace();
    } finally {
      setArchiveSubmitting(false);
    }
  }
  async function submitAdjustment(values) {
    if (!selectedInventoryItem) {
      return;
    }
    await inventoryService.adjustInventory(selectedInventoryItem.productId, {
      quantityDelta: Number(values.quantityDelta),
      reason: values.reason
    });
    showToast("Stock updated", `${selectedInventoryItem.productName} stock has been updated.`, "success");
    setAdjustmentModalOpen(false);
    await loadWorkspace();
  }
  async function submitPurchaseOrder(values) {
    await inventoryService.createPurchaseOrder({
      supplierId: values.supplierId,
      lines: [{ productId: values.productId, quantity: Number(values.quantity) }],
      notes: values.notes
    });
    showToast("Purchase order created", "The purchase order has been saved.", "success");
    setPurchaseOrderModalOpen(false);
    await loadWorkspace();
  }
  async function submitMaintenance(values) {
    if (!selectedAsset) {
      return;
    }
    await inventoryService.recordMaintenance(selectedAsset.id, {
      servicedAt: values.servicedAt ? new Date(values.servicedAt).toISOString() : void 0,
      conditionScore: Number(values.conditionScore),
      notes: values.notes
    });
    showToast("Maintenance saved", `${selectedAsset.assetTag} maintenance has been recorded.`, "success");
    setMaintenanceModalOpen(false);
    await loadWorkspace();
  }
  async function submitWorkOrder(values) {
    const selectedProduct = products.find((item) => item.id === values.productId);
    await inventoryService.createWorkOrder({
      productId: values.productId || void 0,
      productName: (selectedProduct == null ? void 0 : selectedProduct.name) || values.productName,
      workCenter: values.workCenter,
      quantity: Number(values.quantity),
      plannedDurationHours: Number(values.plannedDurationHours)
    });
    showToast("Work order created", "The work order has been created.", "success");
    setWorkOrderModalOpen(false);
    await loadWorkspace();
  }
  async function receivePurchaseOrder() {
    if (!selectedPurchaseOrder) {
      return;
    }
    await inventoryService.receivePurchaseOrder(selectedPurchaseOrder.id, {
      receivedAt: receiveAt ? new Date(receiveAt).toISOString() : void 0,
      notes: receiveNotes
    });
    showToast("Goods received", `${selectedPurchaseOrder.purchaseOrderNumber} has been received.`, "success");
    setReceiveModalOpen(false);
    await loadWorkspace();
  }
  async function updateWorkOrderStatus() {
    if (!selectedWorkOrder) {
      return;
    }
    await inventoryService.updateWorkOrderStatus(selectedWorkOrder.id, {
      status: pendingWorkOrderStatus,
      producedQuantity: pendingProducedQuantity
    });
    showToast("Work order updated", `${selectedWorkOrder.workOrderNumber} is now ${pendingWorkOrderStatus}.`, "success");
    setWorkOrderStatusOpen(false);
    await loadWorkspace();
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { fullPage: true, label: "Loading product and inventory information" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: "Supply Chain",
        title: "Supply chain",
        description: "Manage catalog setup, stock, purchasing, assets, and work orders from one operational area.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          canViewCatalog && canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openProductModal(), children: "Add product" }) : null,
          canViewCatalog && canViewInventory && canApprovePurchase ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: openPurchaseOrderModal, children: "New purchase order" }) : null,
          canViewInventory && canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: openWorkOrderModal, children: "New work order" }) : null
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "stat-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Active products", value: (catalogOverview == null ? void 0 : catalogOverview.activeProducts) ?? products.filter((item) => item.isActive).length, format: "number", subtitle: "Products available today" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Low-stock products", value: (inventoryDashboard == null ? void 0 : inventoryDashboard.lowStockProducts) ?? (catalogOverview == null ? void 0 : catalogOverview.lowStockProducts) ?? 0, format: "number", subtitle: "Items needing replenishment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Inventory value", value: (inventoryDashboard == null ? void 0 : inventoryDashboard.inventoryValue) ?? (catalogOverview == null ? void 0 : catalogOverview.inventoryValue) ?? 0, format: "currency", subtitle: "Current stock value" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Open purchase orders", value: purchaseOrders.filter((item) => item.status !== "Received").length, format: "number", subtitle: "Orders still in progress" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SegmentedControl,
      {
        label: "Supply chain work areas",
        value: activeView,
        onChange: (value) => setActiveView(value),
        options: [
          { value: "catalog", label: "Catalog", description: "Products, categories, and suppliers" },
          { value: "inventory", label: "Inventory", description: "Stock, purchasing, and replenishment" },
          { value: "operations", label: "Operations", description: "Assets, maintenance, and work orders" },
          { value: "enterprise", label: "Enterprise", description: "Warehouses, fixed assets, logistics, and PLM" }
        ]
      }
    ),
    activeView === "inventory" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Demand forecast" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Expected demand for the next planning period." })
        ] }) }),
        demandBars.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBarChart, { data: demandBars }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No demand outlook", description: "Demand forecast information is not available for this account.", compact: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Priority actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Warnings and reorder suggestions to review first." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
          anomalies.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.narrative })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.severity, tone: anomalyTone(item.severity) })
          ] }, `${item.domain}-${item.title}`)),
          reorderRecommendations.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                item.currentStock,
                " on hand / order ",
                item.recommendedOrderQuantity
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: item.urgency, tone: anomalyTone(item.urgency) })
          ] }, item.productId)),
          anomalies.length === 0 && reorderRecommendations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No priority actions", description: "There are no urgent issues or reorder recommendations right now.", compact: true }) : null
        ] })
      ] })
    ] }) : null,
    activeView === "catalog" ? canViewCatalog ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Categories" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Organize products into clear categories." })
            ] }),
            canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openCategoryModal(), children: "Add category" }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
            categories.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  item.activeProductsCount,
                  " active products / ",
                  item.lowStockProducts,
                  " low on stock"
                ] })
              ] }),
              canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openCategoryModal(item), children: "Edit" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: "Read only", tone: "info" })
            ] }, item.id)),
            categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No categories", description: "Add a category to organize your products.", compact: true }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "surface-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Suppliers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Suppliers used for purchasing and replenishment." })
            ] }),
            canApprovePurchase ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openSupplierModal(), children: "Add supplier" }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stack-list", children: [
            suppliers.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "list-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  item.openPurchaseOrders,
                  " open orders / lead time ",
                  item.leadTimeDays,
                  " days"
                ] })
              ] }),
              canApprovePurchase ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openSupplierModal(item), children: "Edit" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: `${item.fulfillmentRiskScore}% risk`, tone: item.fulfillmentRiskScore > 70 ? "danger" : "warning" })
            ] }, item.id)),
            suppliers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No suppliers", description: "Add a supplier to support purchasing.", compact: true }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Products",
          description: "Manage product details, stock status, and availability.",
          columns: [
            { key: "name", title: "Product", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.sku })
            ] }) },
            { key: "category", title: "Category", sortable: true },
            { key: "supplier", title: "Supplier", sortable: true },
            { key: "price", title: "Price", sortable: true, align: "right", render: (row) => formatCurrency(row.price) },
            { key: "stockQuantity", title: "Stock", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: `${row.stockQuantity}`, tone: inventoryTone(row.isLowStock) }) },
            { key: "isActive", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.isActive ? "Active" : "Inactive", tone: row.isActive ? "success" : "warning" }) },
            { key: "actions", title: "Actions", render: (row) => canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-actions", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openProductModal(row), children: "Edit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "danger-button", onClick: () => setArchiveTarget(row), children: "Archive" })
            ] }) : "View details" }
          ],
          data: products,
          rowKey: "id",
          searchKeys: ["name", "sku", "category", "supplier", "description"],
          searchPlaceholder: "Search products",
          emptyTitle: "No products found",
          emptyDescription: "Add a product or try a different search."
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Catalog unavailable", description: "This account does not currently have access to product details.", compact: true }) : null,
    activeView === "inventory" ? canViewInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Inventory items",
          description: "Current stock levels and quick adjustments.",
          columns: [
            { key: "productName", title: "Item", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.sku })
            ] }) },
            { key: "supplier", title: "Supplier", sortable: true },
            { key: "stockQuantity", title: "On hand", sortable: true, align: "right" },
            { key: "availableCoverDays", title: "Cover days", sortable: true, align: "right" },
            { key: "inventoryValue", title: "Value", sortable: true, align: "right", render: (row) => formatCurrency(row.inventoryValue) },
            { key: "actions", title: "Actions", render: (row) => canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openAdjustmentModal(row), children: "Adjust stock" }) : "View details" }
          ],
          data: inventoryItems,
          rowKey: "productId",
          searchKeys: ["productName", "sku", "supplier"],
          searchPlaceholder: "Search inventory",
          emptyTitle: "No inventory items",
          emptyDescription: "Stock items will appear here when inventory is available."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Purchase orders",
          description: "Track purchase orders and received goods.",
          columns: [
            { key: "purchaseOrderNumber", title: "Purchase order", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.purchaseOrderNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.supplierName })
            ] }) },
            { key: "expectedDeliveryDate", title: "Expected", sortable: true, render: (row) => formatDate(row.expectedDeliveryDate) },
            { key: "totalCost", title: "Total cost", sortable: true, align: "right", render: (row) => formatCurrency(row.totalCost) },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: purchaseOrderTone(row.status) }) },
            { key: "actions", title: "Actions", render: (row) => canApprovePurchase && row.status !== "Received" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openReceiveModal(row), children: "Receive goods" }) : "Closed" }
          ],
          data: purchaseOrders,
          rowKey: "id",
          searchKeys: ["purchaseOrderNumber", "supplierName", "status"],
          searchPlaceholder: "Search purchase orders",
          emptyTitle: "No purchase orders",
          emptyDescription: "Purchase orders will appear here after they are created."
        }
      )
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Inventory unavailable", description: "This account does not currently have access to inventory information.", compact: true }) : null,
    activeView === "operations" ? canViewInventory ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "dashboard-grid dashboard-grid--balanced", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Assets",
          description: "Equipment and maintenance planning.",
          columns: [
            { key: "assetTag", title: "Asset", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.assetTag }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.name })
            ] }) },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: row.maintenanceRiskScore > 70 ? "danger" : "info" }) },
            { key: "nextServiceDueAt", title: "Next service", sortable: true, render: (row) => formatDate(row.nextServiceDueAt) },
            { key: "conditionScore", title: "Condition", sortable: true, align: "right", render: (row) => `${row.conditionScore}%` },
            { key: "actions", title: "Actions", render: (row) => canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openMaintenanceModal(row), children: "Record maintenance" }) : "View details" }
          ],
          data: assets,
          rowKey: "id",
          searchKeys: ["assetTag", "name", "category", "status"],
          searchPlaceholder: "Search assets",
          emptyTitle: "No assets",
          emptyDescription: "Assets will appear here when they are added to the organization."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          title: "Work orders",
          description: "Production work and status updates.",
          columns: [
            { key: "workOrderNumber", title: "Work order", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.workOrderNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.productName })
            ] }) },
            { key: "workCenter", title: "Work center", sortable: true },
            { key: "status", title: "Status", sortable: true, render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { label: row.status, tone: workOrderTone(row.status) }) },
            { key: "scheduledStart", title: "Start", sortable: true, render: (row) => formatDateTime(row.scheduledStart) },
            { key: "actions", title: "Actions", render: (row) => canManageInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => openWorkOrderStatusModal(row), children: "Update status" }) : "View details" }
          ],
          data: workOrders,
          rowKey: "id",
          searchKeys: ["workOrderNumber", "productName", "workCenter", "status"],
          searchPlaceholder: "Search work orders",
          emptyTitle: "No work orders",
          emptyDescription: "Work orders will appear here after they are created."
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Operations unavailable", description: "This account does not currently have access to asset or work-order information.", compact: true }) : null,
    activeView === "enterprise" ? canViewInventory ? /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyChainEnterprisePanel, { products }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Enterprise supply chain unavailable", description: "This account does not currently have access to enterprise supply and asset workflows.", compact: true }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: categoryModalOpen,
        onClose: () => setCategoryModalOpen(false),
        title: editingCategory ? "Edit category" : "Add category",
        description: "Create or update a product category.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setCategoryModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "category-form", className: "primary-button", disabled: categoryForm.formState.isSubmitting, children: categoryForm.formState.isSubmitting ? "Saving..." : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { id: "category-form", className: "form-grid", onSubmit: categoryForm.handleSubmit(submitCategory), children: /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Category name", error: (_a = categoryForm.formState.errors.name) == null ? void 0 : _a.message, registration: categoryForm.register("name", { required: "Please enter a category name." }) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: supplierModalOpen,
        onClose: () => setSupplierModalOpen(false),
        title: editingSupplier ? "Edit supplier" : "Add supplier",
        description: "Create or update supplier details.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setSupplierModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "supplier-form", className: "primary-button", disabled: supplierForm.formState.isSubmitting, children: supplierForm.formState.isSubmitting ? "Saving..." : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "supplier-form", className: "form-grid form-grid--two", onSubmit: supplierForm.handleSubmit(submitSupplier), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Supplier name", error: (_b = supplierForm.formState.errors.name) == null ? void 0 : _b.message, registration: supplierForm.register("name", { required: "Please enter a supplier name." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Contact name", error: (_c = supplierForm.formState.errors.contactName) == null ? void 0 : _c.message, registration: supplierForm.register("contactName", { required: "Please enter a contact name." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Email", type: "email", error: (_d = supplierForm.formState.errors.email) == null ? void 0 : _d.message, registration: supplierForm.register("email", { required: "Please enter an email address." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Lead time (days)", type: "number", error: (_e = supplierForm.formState.errors.leadTimeDays) == null ? void 0 : _e.message, registration: supplierForm.register("leadTimeDays", { required: "Please enter lead time in days.", valueAsNumber: true, min: 1 }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: productModalOpen,
        onClose: () => setProductModalOpen(false),
        title: editingProduct ? "Edit product" : "Add product",
        description: "Create or update a product.",
        size: "lg",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setProductModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "product-form", className: "primary-button", disabled: productForm.formState.isSubmitting, children: productForm.formState.isSubmitting ? "Saving..." : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "product-form", className: "form-grid form-grid--two", onSubmit: productForm.handleSubmit(submitProduct), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Product name", error: (_f = productForm.formState.errors.name) == null ? void 0 : _f.message, registration: productForm.register("name", { required: "Please enter a product name." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Description", error: (_g = productForm.formState.errors.description) == null ? void 0 : _g.message, registration: productForm.register("description", { required: "Please enter a description." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Category", error: (_h = productForm.formState.errors.categoryName) == null ? void 0 : _h.message, registration: productForm.register("categoryName", { required: "Please choose a category." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select category" }),
            categories.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.name, children: item.name }, item.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Supplier", error: (_i = productForm.formState.errors.supplierName) == null ? void 0 : _i.message, registration: productForm.register("supplierName", { required: "Please choose a supplier." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select supplier" }),
            suppliers.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.name, children: item.name }, item.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Price", type: "number", step: "0.01", error: (_j = productForm.formState.errors.price) == null ? void 0 : _j.message, registration: productForm.register("price", { required: "Please enter a price.", valueAsNumber: true, min: 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Cost", type: "number", step: "0.01", error: (_k = productForm.formState.errors.cost) == null ? void 0 : _k.message, registration: productForm.register("cost", { required: "Please enter a cost.", valueAsNumber: true, min: 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Stock quantity", type: "number", error: (_l = productForm.formState.errors.stockQuantity) == null ? void 0 : _l.message, registration: productForm.register("stockQuantity", { required: "Please enter stock quantity.", valueAsNumber: true, min: 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Reorder level", type: "number", error: (_m = productForm.formState.errors.reorderLevel) == null ? void 0 : _m.message, registration: productForm.register("reorderLevel", { required: "Please enter a reorder level.", valueAsNumber: true, min: 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Status", registration: productForm.register("isActive"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "true", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "false", children: "Inactive" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: adjustmentModalOpen,
        onClose: () => setAdjustmentModalOpen(false),
        title: selectedInventoryItem ? `Adjust ${selectedInventoryItem.productName}` : "Adjust stock",
        description: "Update stock for the selected item.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setAdjustmentModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "adjustment-form", className: "primary-button", disabled: adjustmentForm.formState.isSubmitting, children: adjustmentForm.formState.isSubmitting ? "Saving..." : "Save stock update" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "adjustment-form", className: "form-grid", onSubmit: adjustmentForm.handleSubmit(submitAdjustment), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Quantity change", type: "number", error: (_n = adjustmentForm.formState.errors.quantityDelta) == null ? void 0 : _n.message, registration: adjustmentForm.register("quantityDelta", { required: "Please enter the stock change.", valueAsNumber: true }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Reason", error: (_o = adjustmentForm.formState.errors.reason) == null ? void 0 : _o.message, registration: adjustmentForm.register("reason", { required: "Please enter a reason." }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: purchaseOrderModalOpen,
        onClose: () => setPurchaseOrderModalOpen(false),
        title: "Create purchase order",
        description: "Create a purchase order for a supplier and product.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setPurchaseOrderModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "purchase-order-form", className: "primary-button", disabled: purchaseOrderForm.formState.isSubmitting, children: purchaseOrderForm.formState.isSubmitting ? "Saving..." : "Save purchase order" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "purchase-order-form", className: "form-grid form-grid--two", onSubmit: purchaseOrderForm.handleSubmit(submitPurchaseOrder), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Supplier", error: (_p = purchaseOrderForm.formState.errors.supplierId) == null ? void 0 : _p.message, registration: purchaseOrderForm.register("supplierId", { required: "Please choose a supplier." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select supplier" }),
            suppliers.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.id, children: item.name }, item.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Product", error: (_q = purchaseOrderForm.formState.errors.productId) == null ? void 0 : _q.message, registration: purchaseOrderForm.register("productId", { required: "Please choose a product." }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select product" }),
            products.filter((item) => item.isActive).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.id, children: item.name }, item.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Quantity", type: "number", error: (_r = purchaseOrderForm.formState.errors.quantity) == null ? void 0 : _r.message, registration: purchaseOrderForm.register("quantity", { required: "Please enter a quantity.", valueAsNumber: true, min: 1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Notes", error: (_s = purchaseOrderForm.formState.errors.notes) == null ? void 0 : _s.message, registration: purchaseOrderForm.register("notes") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: receiveModalOpen,
        onClose: () => setReceiveModalOpen(false),
        title: (selectedPurchaseOrder == null ? void 0 : selectedPurchaseOrder.purchaseOrderNumber) || "Receive goods",
        description: "Record received goods for this purchase order.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setReceiveModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => void receivePurchaseOrder(), children: "Save receipt" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__label", children: "Received on" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", type: "datetime-local", value: receiveAt, onChange: (event) => setReceiveAt(event.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__label", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: receiveNotes, onChange: (event) => setReceiveNotes(event.target.value) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: maintenanceModalOpen,
        onClose: () => setMaintenanceModalOpen(false),
        title: (selectedAsset == null ? void 0 : selectedAsset.assetTag) || "Record maintenance",
        description: "Record maintenance work for the selected asset.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setMaintenanceModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "maintenance-form", className: "primary-button", disabled: maintenanceForm.formState.isSubmitting, children: maintenanceForm.formState.isSubmitting ? "Saving..." : "Save maintenance" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "maintenance-form", className: "form-grid form-grid--two", onSubmit: maintenanceForm.handleSubmit(submitMaintenance), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Serviced at", type: "datetime-local", error: (_t = maintenanceForm.formState.errors.servicedAt) == null ? void 0 : _t.message, registration: maintenanceForm.register("servicedAt") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Condition score", type: "number", error: (_u = maintenanceForm.formState.errors.conditionScore) == null ? void 0 : _u.message, registration: maintenanceForm.register("conditionScore", { required: "Please enter a condition score.", valueAsNumber: true, min: 0, max: 100 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Notes", error: (_v = maintenanceForm.formState.errors.notes) == null ? void 0 : _v.message, registration: maintenanceForm.register("notes", { required: "Please enter maintenance notes." }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: workOrderModalOpen,
        onClose: () => setWorkOrderModalOpen(false),
        title: "Create work order",
        description: "Create a new work order for production.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setWorkOrderModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "work-order-form", className: "primary-button", disabled: workOrderForm.formState.isSubmitting, children: workOrderForm.formState.isSubmitting ? "Saving..." : "Save work order" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "work-order-form", className: "form-grid form-grid--two", onSubmit: workOrderForm.handleSubmit(submitWorkOrder), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectField, { label: "Product", registration: workOrderForm.register("productId"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select product" }),
            products.filter((item) => item.isActive).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.id, children: item.name }, item.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Product name (if not selected above)", error: (_w = workOrderForm.formState.errors.productName) == null ? void 0 : _w.message, registration: workOrderForm.register("productName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Work center", error: (_x = workOrderForm.formState.errors.workCenter) == null ? void 0 : _x.message, registration: workOrderForm.register("workCenter", { required: "Please enter a work center." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Quantity", type: "number", error: (_y = workOrderForm.formState.errors.quantity) == null ? void 0 : _y.message, registration: workOrderForm.register("quantity", { required: "Please enter a quantity.", valueAsNumber: true, min: 1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { label: "Planned duration (hours)", type: "number", error: (_z = workOrderForm.formState.errors.plannedDurationHours) == null ? void 0 : _z.message, registration: workOrderForm.register("plannedDurationHours", { required: "Please enter the planned duration.", valueAsNumber: true, min: 1 }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: workOrderStatusOpen,
        onClose: () => setWorkOrderStatusOpen(false),
        title: (selectedWorkOrder == null ? void 0 : selectedWorkOrder.workOrderNumber) || "Update work order",
        description: "Update the current work order status.",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ghost-button", onClick: () => setWorkOrderStatusOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "primary-button", onClick: () => void updateWorkOrderStatus(), children: "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-grid form-grid--two", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__label", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: pendingWorkOrderStatus, onChange: (event) => setPendingWorkOrderStatus(event.target.value), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Scheduled", children: "Scheduled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "In Progress", children: "In Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Completed", children: "Completed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Blocked", children: "Blocked" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field__label", children: "Produced quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", type: "number", min: "0", value: pendingProducedQuantity, onChange: (event) => setPendingProducedQuantity(Number(event.target.value)) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: Boolean(archiveTarget),
        onClose: () => {
          if (!archiveSubmitting) {
            setArchiveTarget(null);
          }
        },
        onConfirm: () => void archiveProduct(),
        title: archiveTarget ? `Archive ${archiveTarget.name}?` : "Archive product?",
        description: "The product will be marked inactive and removed from active product lists.",
        note: (user == null ? void 0 : user.isDemoUser) ? "This only changes sample organization data and can be refreshed from the sample banner." : void 0,
        confirmLabel: "Archive product",
        loading: archiveSubmitting
      }
    )
  ] });
}
export {
  Products as default
};
