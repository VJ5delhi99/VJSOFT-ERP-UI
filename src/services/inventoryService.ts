import type {
  AnomalyDetectionDto,
  AssetDto,
  DemandForecastDto,
  InventoryDashboardDto,
  InventoryItemDto,
  MaintenanceForecastDto,
  ProcurementDashboardDto,
  PurchaseOrderDto,
  ReorderRecommendationDto,
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
