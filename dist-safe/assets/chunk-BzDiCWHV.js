import { r as requestGet, j as requestPost } from "./app-C4Pvg4H3.js";
const inventoryService = {
  getDashboard() {
    return requestGet("inventory", "/api/inventory/dashboard");
  },
  getItems() {
    return requestGet("inventory", "/api/inventory/items");
  },
  getProcurementDashboard() {
    return requestGet("inventory", "/api/inventory/procurement/dashboard");
  },
  getPurchaseOrders(status) {
    return requestGet("inventory", "/api/inventory/purchase-orders", {
      params: { status: status || void 0 }
    });
  },
  createPurchaseOrder(payload) {
    return requestPost("inventory", "/api/inventory/purchase-orders", payload);
  },
  receivePurchaseOrder(id, payload) {
    return requestPost("inventory", `/api/inventory/purchase-orders/${id}/receive`, payload);
  },
  getReorderRecommendations(horizonDays = 14) {
    return requestGet("inventory", "/api/inventory/reorder-recommendations", {
      params: { horizonDays }
    });
  },
  getDemandForecast(horizonDays = 14) {
    return requestGet("inventory", "/api/inventory/demand-forecast", {
      params: { horizonDays }
    });
  },
  adjustInventory(productId, payload) {
    return requestPost("inventory", `/api/inventory/${productId}/adjust`, payload);
  },
  getAssets(dueForMaintenanceOnly = false) {
    return requestGet("inventory", "/api/inventory/assets", {
      params: { dueForMaintenanceOnly: dueForMaintenanceOnly || void 0 }
    });
  },
  recordMaintenance(id, payload) {
    return requestPost("inventory", `/api/inventory/assets/${id}/maintenance`, payload);
  },
  getMaintenanceForecast(horizonDays = 30) {
    return requestGet("inventory", "/api/inventory/maintenance-forecast", {
      params: { horizonDays }
    });
  },
  getWarehouses() {
    return requestGet("inventory", "/api/inventory/supply-chain/warehouses");
  },
  getStockTransfers(status) {
    return requestGet("inventory", "/api/inventory/supply-chain/transfers", {
      params: { status: status || void 0 }
    });
  },
  createStockTransfer(payload) {
    return requestPost("inventory", "/api/inventory/supply-chain/transfers", payload);
  },
  getShipments(status) {
    return requestGet("inventory", "/api/inventory/supply-chain/shipments", {
      params: { status: status || void 0 }
    });
  },
  createShipment(payload) {
    return requestPost("inventory", "/api/inventory/supply-chain/shipments", payload);
  },
  updateShipmentStatus(id, payload) {
    return requestPost("inventory", `/api/inventory/supply-chain/shipments/${id}/status`, payload);
  },
  getFixedAssets(status) {
    return requestGet("inventory", "/api/inventory/fixed-assets", {
      params: { status: status || void 0 }
    });
  },
  createFixedAsset(payload) {
    return requestPost("inventory", "/api/inventory/fixed-assets", payload);
  },
  transferFixedAsset(id, payload) {
    return requestPost("inventory", `/api/inventory/fixed-assets/${id}/transfer`, payload);
  },
  revalueFixedAsset(id, payload) {
    return requestPost("inventory", `/api/inventory/fixed-assets/${id}/revalue`, payload);
  },
  runDepreciation(payload) {
    return requestPost("inventory", "/api/inventory/fixed-assets/depreciation/run", payload);
  },
  getFixedAssetComplianceReport() {
    return requestGet("inventory", "/api/inventory/fixed-assets/compliance-report");
  },
  getWorkOrders(status) {
    return requestGet("inventory", "/api/inventory/manufacturing/work-orders", {
      params: { status: status || void 0 }
    });
  },
  createWorkOrder(payload) {
    return requestPost("inventory", "/api/inventory/manufacturing/work-orders", payload);
  },
  updateWorkOrderStatus(id, payload) {
    return requestPost("inventory", `/api/inventory/manufacturing/work-orders/${id}/status`, payload);
  },
  getAnomalies(maxResults = 10) {
    return requestGet("inventory", "/api/inventory/anomalies", {
      params: { maxResults }
    });
  }
};
export {
  inventoryService as i
};
