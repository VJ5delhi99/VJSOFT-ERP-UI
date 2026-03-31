import type {
  AnomalyDetectionDto,
  AssetDto,
  DemandForecastDto,
  FixedAssetComplianceReportDto,
  FixedAssetDto,
  InventoryDashboardDto,
  InventoryItemDto,
  MaintenanceForecastDto,
  ProcurementDashboardDto,
  PurchaseOrderDto,
  ReorderRecommendationDto,
  ShipmentDto,
  StockTransferDto,
  WarehouseDto,
  WorkOrderDto
} from '../types'
import { requestGet, requestPost } from './apiClient'

export interface PurchaseOrderCreatePayload {
  supplierId: string
  lines: Array<{ productId: string; quantity: number }>
  notes: string
}

export interface PurchaseOrderReceivePayload {
  receivedAt?: string
  notes: string
}

export interface InventoryAdjustmentPayload {
  quantityDelta: number
  reason: string
}

export interface AssetMaintenancePayload {
  servicedAt?: string
  conditionScore: number
  notes: string
}

export interface WorkOrderCreatePayload {
  productId?: string
  productName: string
  workCenter: string
  quantity: number
  plannedDurationHours: number
}

export interface WorkOrderStatusPayload {
  status: string
  producedQuantity?: number
}

export interface StockTransferCreatePayload {
  fromWarehouseCode: string
  toWarehouseCode: string
  productId: string
  quantity: number
  reason: string
}

export interface ShipmentCreatePayload {
  direction: string
  carrier: string
  trackingNumber: string
  originWarehouseCode: string
  destinationName: string
  salesOrderId?: string
  purchaseOrderId?: string
  scheduledShipDate: string
}

export interface ShipmentStatusPayload {
  status: string
}

export interface FixedAssetCreatePayload {
  operationalAssetId?: string
  name: string
  assetClass: string
  companyCode: string
  branchCode: string
  acquisitionCost: number
  salvageValue: number
  depreciationMethod: string
  usefulLifeMonths: number
  depreciationRate: number
  ownerDepartment: string
  currentLocation: string
}

export interface FixedAssetTransferPayload {
  branchCode: string
  currentLocation: string
  ownerDepartment: string
}

export interface FixedAssetRevaluationPayload {
  revaluationAmount: number
}

export interface DepreciationRunPayload {
  runDate: string
}

export const inventoryService = {
  getDashboard() {
    return requestGet<InventoryDashboardDto>('inventory', '/api/inventory/dashboard')
  },
  getItems() {
    return requestGet<InventoryItemDto[]>('inventory', '/api/inventory/items')
  },
  getProcurementDashboard() {
    return requestGet<ProcurementDashboardDto>('inventory', '/api/inventory/procurement/dashboard')
  },
  getPurchaseOrders(status?: string) {
    return requestGet<PurchaseOrderDto[]>('inventory', '/api/inventory/purchase-orders', {
      params: { status: status || undefined }
    })
  },
  createPurchaseOrder(payload: PurchaseOrderCreatePayload) {
    return requestPost<PurchaseOrderDto, PurchaseOrderCreatePayload>('inventory', '/api/inventory/purchase-orders', payload)
  },
  receivePurchaseOrder(id: string, payload: PurchaseOrderReceivePayload) {
    return requestPost<PurchaseOrderDto, PurchaseOrderReceivePayload>('inventory', `/api/inventory/purchase-orders/${id}/receive`, payload)
  },
  getReorderRecommendations(horizonDays = 14) {
    return requestGet<ReorderRecommendationDto[]>('inventory', '/api/inventory/reorder-recommendations', {
      params: { horizonDays }
    })
  },
  getDemandForecast(horizonDays = 14) {
    return requestGet<DemandForecastDto[]>('inventory', '/api/inventory/demand-forecast', {
      params: { horizonDays }
    })
  },
  adjustInventory(productId: string, payload: InventoryAdjustmentPayload) {
    return requestPost<InventoryItemDto, InventoryAdjustmentPayload>('inventory', `/api/inventory/${productId}/adjust`, payload)
  },
  getAssets(dueForMaintenanceOnly = false) {
    return requestGet<AssetDto[]>('inventory', '/api/inventory/assets', {
      params: { dueForMaintenanceOnly: dueForMaintenanceOnly || undefined }
    })
  },
  recordMaintenance(id: string, payload: AssetMaintenancePayload) {
    return requestPost<AssetDto, AssetMaintenancePayload>('inventory', `/api/inventory/assets/${id}/maintenance`, payload)
  },
  getMaintenanceForecast(horizonDays = 30) {
    return requestGet<MaintenanceForecastDto[]>('inventory', '/api/inventory/maintenance-forecast', {
      params: { horizonDays }
    })
  },
  getWarehouses() {
    return requestGet<WarehouseDto[]>('inventory', '/api/inventory/supply-chain/warehouses')
  },
  getStockTransfers(status?: string) {
    return requestGet<StockTransferDto[]>('inventory', '/api/inventory/supply-chain/transfers', {
      params: { status: status || undefined }
    })
  },
  createStockTransfer(payload: StockTransferCreatePayload) {
    return requestPost<StockTransferDto, StockTransferCreatePayload>('inventory', '/api/inventory/supply-chain/transfers', payload)
  },
  getShipments(status?: string) {
    return requestGet<ShipmentDto[]>('inventory', '/api/inventory/supply-chain/shipments', {
      params: { status: status || undefined }
    })
  },
  createShipment(payload: ShipmentCreatePayload) {
    return requestPost<ShipmentDto, ShipmentCreatePayload>('inventory', '/api/inventory/supply-chain/shipments', payload)
  },
  updateShipmentStatus(id: string, payload: ShipmentStatusPayload) {
    return requestPost<ShipmentDto, ShipmentStatusPayload>('inventory', `/api/inventory/supply-chain/shipments/${id}/status`, payload)
  },
  getFixedAssets(status?: string) {
    return requestGet<FixedAssetDto[]>('inventory', '/api/inventory/fixed-assets', {
      params: { status: status || undefined }
    })
  },
  createFixedAsset(payload: FixedAssetCreatePayload) {
    return requestPost<FixedAssetDto, FixedAssetCreatePayload>('inventory', '/api/inventory/fixed-assets', payload)
  },
  transferFixedAsset(id: string, payload: FixedAssetTransferPayload) {
    return requestPost<FixedAssetDto, FixedAssetTransferPayload>('inventory', `/api/inventory/fixed-assets/${id}/transfer`, payload)
  },
  revalueFixedAsset(id: string, payload: FixedAssetRevaluationPayload) {
    return requestPost<FixedAssetDto, FixedAssetRevaluationPayload>('inventory', `/api/inventory/fixed-assets/${id}/revalue`, payload)
  },
  runDepreciation(payload: DepreciationRunPayload) {
    return requestPost<FixedAssetComplianceReportDto, DepreciationRunPayload>('inventory', '/api/inventory/fixed-assets/depreciation/run', payload)
  },
  getFixedAssetComplianceReport() {
    return requestGet<FixedAssetComplianceReportDto>('inventory', '/api/inventory/fixed-assets/compliance-report')
  },
  getWorkOrders(status?: string) {
    return requestGet<WorkOrderDto[]>('inventory', '/api/inventory/manufacturing/work-orders', {
      params: { status: status || undefined }
    })
  },
  createWorkOrder(payload: WorkOrderCreatePayload) {
    return requestPost<WorkOrderDto, WorkOrderCreatePayload>('inventory', '/api/inventory/manufacturing/work-orders', payload)
  },
  updateWorkOrderStatus(id: string, payload: WorkOrderStatusPayload) {
    return requestPost<WorkOrderDto, WorkOrderStatusPayload>('inventory', `/api/inventory/manufacturing/work-orders/${id}/status`, payload)
  },
  getAnomalies(maxResults = 10) {
    return requestGet<AnomalyDetectionDto[]>('inventory', '/api/inventory/anomalies', {
      params: { maxResults }
    })
  }
}
