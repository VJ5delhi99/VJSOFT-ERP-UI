import type { AxiosRequestConfig } from 'axios'
import { apiConfig, type ServiceKey } from '../config/api'
import { demoAccounts } from './demoAuth'
import type {
  AccessControlSummaryDto,
  AiReadinessDto,
  AlertDto,
  AnomalyDetectionDto,
  AssetDto,
  AuditTrailEntryDto,
  BillingDashboardDto,
  BranchDto,
  CashFlowForecastDto,
  CatalogOverviewDto,
  CatalogReferenceDataDto,
  CategorySummaryDto,
  CollectionRiskReportDto,
  CompanyDto,
  CustomerDto,
  CustomerIntelligenceDto,
  DemoStatusDto,
  DemandForecastDto,
  DocumentExtractionResultDto,
  ExecutiveDashboardDto,
  FieldServiceJobDto,
  FinanceDashboardDto,
  FixedAssetComplianceReportDto,
  FixedAssetDto,
  IndustryProfileDto,
  IntegrationConnectionDto,
  IntegrationOverviewDto,
  InventoryDashboardDto,
  InventoryItemDto,
  InvoiceAgingReportDto,
  InvoiceDto,
  NotificationDto,
  OrderDto,
  OrderMetricsDto,
  OrganizationOverviewDto,
  OutboxMessageDto,
  PaymentDto,
  PayrollSummaryDto,
  PlatformContextDto,
  PlatformOperationsSummaryDto,
  ProductChangeDto,
  ProductLifecycleDto,
  ProductDto,
  ProjectDto,
  PurchaseOrderDto,
  PurchaseRequisitionDto,
  ReferenceValueDto,
  ReportingSnapshotDto,
  RequestForQuoteDto,
  ReorderRecommendationDto,
  ServiceHealthDto,
  ServiceTicketDto,
  ShipmentDto,
  SupplierDto,
  SupplierReferenceDto,
  ThreeWayMatchDto,
  VendorComparisonDto,
  WarehouseDto,
  WebhookSubscriptionDto,
  WorkflowTemplateDto,
  WorkOrderDto
} from '../types'

interface DemoState {
  companies: CompanyDto[]
  branches: BranchDto[]
  categories: CategorySummaryDto[]
  suppliers: SupplierDto[]
  products: ProductDto[]
  inventoryItems: InventoryItemDto[]
  purchaseOrders: PurchaseOrderDto[]
  reorderRecommendations: ReorderRecommendationDto[]
  demandForecast: DemandForecastDto[]
  assets: AssetDto[]
  maintenanceForecast: Array<{ assetId: string; assetTag: string; assetName: string; nextServiceDueAt: string; maintenanceRiskScore: number; recommendedAction: string }>
  warehouses: WarehouseDto[]
  transfers: Array<{ id: string; transferNumber: string; fromWarehouseCode: string; toWarehouseCode: string; productId: string; productName: string; quantity: number; status: string; requestedAt: string; completedAt: string | null; reason: string }>
  shipments: ShipmentDto[]
  fixedAssets: FixedAssetDto[]
  fixedAssetCompliance: FixedAssetComplianceReportDto
  workOrders: WorkOrderDto[]
  anomalies: AnomalyDetectionDto[]
  customers: CustomerDto[]
  orders: OrderDto[]
  orderMetrics: OrderMetricsDto
  projects: ProjectDto[]
  tickets: ServiceTicketDto[]
  fieldServiceJobs: FieldServiceJobDto[]
  productLifecycles: ProductLifecycleDto[]
  productChanges: ProductChangeDto[]
  accessSummary: AccessControlSummaryDto
  billingDashboard: BillingDashboardDto
  executiveDashboard: ExecutiveDashboardDto
  financeDashboard: FinanceDashboardDto
  payrollSummary: PayrollSummaryDto
  requisitions: PurchaseRequisitionDto[]
  rfqs: RequestForQuoteDto[]
  vendorComparisons: Record<string, VendorComparisonDto>
  threeWayMatches: ThreeWayMatchDto[]
  integrationOverview: IntegrationOverviewDto
  integrations: IntegrationConnectionDto[]
  webhooks: WebhookSubscriptionDto[]
  reportingSnapshot: ReportingSnapshotDto
  payments: PaymentDto[]
  collectionRisk: CollectionRiskReportDto
  invoices: InvoiceDto[]
  invoiceAging: InvoiceAgingReportDto
  notifications: NotificationDto[]
  auditTrail: AuditTrailEntryDto[]
  outbox: OutboxMessageDto[]
  aiReadiness: AiReadinessDto
  industryProfiles: IndustryProfileDto[]
  workflowTemplates: WorkflowTemplateDto[]
  organizationOverview: OrganizationOverviewDto
  operationsSummary: PlatformOperationsSummaryDto
  serviceHealth: ServiceHealthDto[]
}

interface DemoEnvelope {
  expiresAtUtc: string
  state: DemoState
}

const ttlMs = apiConfig.demoCacheTtlHours * 60 * 60 * 1000
const cacheKey = apiConfig.storageKeys.demoCache

function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, 120))
}

function nowIso() {
  return new Date().toISOString()
}

function addDays(value: number) {
  return new Date(Date.now() + value * 24 * 60 * 60 * 1000).toISOString()
}

function addHours(value: number) {
  return new Date(Date.now() + value * 60 * 60 * 1000).toISOString()
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function readEnvelope() {
  if (typeof window === 'undefined') {
    return null
  }

  const clearExpiredDemoState = () => {
    window.localStorage.removeItem(cacheKey)
    window.localStorage.removeItem(apiConfig.storageKeys.token)
    window.localStorage.removeItem(apiConfig.storageKeys.refreshToken)
    window.localStorage.removeItem(apiConfig.storageKeys.expiresAtUtc)
    window.localStorage.removeItem(apiConfig.storageKeys.user)
  }

  const raw = window.localStorage.getItem(cacheKey)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as DemoEnvelope
    if (new Date(parsed.expiresAtUtc).getTime() <= Date.now()) {
      clearExpiredDemoState()
      return null
    }

    return parsed
  } catch {
    clearExpiredDemoState()
    return null
  }
}

function writeEnvelope(envelope: DemoEnvelope) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(cacheKey, JSON.stringify(envelope))
}

function buildState(): DemoState {
  const companies: CompanyDto[] = [
    { id: 'company-vjsoft', companyCode: 'VJH', name: 'VJ Soft Holdings', baseCurrency: 'USD', taxRegistrationNumber: 'GSTIN-DEMO-001' }
  ]

  const branches: BranchDto[] = [
    { id: 'branch-hq', branchCode: 'HQ', companyCode: 'VJH', name: 'Head Office', city: 'Bengaluru', timeZone: 'Asia/Calcutta' },
    { id: 'branch-wh1', branchCode: 'WH1', companyCode: 'VJH', name: 'West Distribution', city: 'Pune', timeZone: 'Asia/Calcutta' }
  ]

  const categories: CategorySummaryDto[] = [
    { id: 'cat-electronics', name: 'Electronics', productCount: 3, activeProductsCount: 3, lowStockProducts: 1 },
    { id: 'cat-warehouse', name: 'Warehouse', productCount: 1, activeProductsCount: 1, lowStockProducts: 0 },
    { id: 'cat-office', name: 'Office Operations', productCount: 1, activeProductsCount: 1, lowStockProducts: 0 },
    { id: 'cat-service', name: 'Field Service', productCount: 1, activeProductsCount: 1, lowStockProducts: 0 }
  ]

  const suppliers: SupplierDto[] = [
    { id: 'sup-northwind', name: 'Northwind Components', contactName: 'Rita Patel', email: 'rita.patel@northwind.local', leadTimeDays: 9, productCount: 2, openPurchaseOrders: 0, onTimeDeliveryScore: 96, fulfillmentRiskScore: 12 },
    { id: 'sup-alpine', name: 'Alpine Office Supply', contactName: 'Samir Khan', email: 'samir.khan@alpine.local', leadTimeDays: 12, productCount: 1, openPurchaseOrders: 0, onTimeDeliveryScore: 91, fulfillmentRiskScore: 18 },
    { id: 'sup-skyline', name: 'Skyline Industrial', contactName: 'Vera Gomez', email: 'vera.gomez@skyline.local', leadTimeDays: 16, productCount: 3, openPurchaseOrders: 1, onTimeDeliveryScore: 88, fulfillmentRiskScore: 22 }
  ]

  const products: ProductDto[] = [
    { id: 'prod-pos-terminal', sku: 'SKU-1001', name: 'Surface POS Terminal', description: 'Counter-top point of sale terminal.', category: 'Electronics', supplier: 'Northwind Components', price: 1499, cost: 980, stockQuantity: 18, reorderLevel: 10, marginPercent: 34.62, isLowStock: false, isActive: true },
    { id: 'prod-scanner', sku: 'SKU-1002', name: 'Barcode Scanner Pro', description: 'Warehouse and checkout scanner.', category: 'Electronics', supplier: 'Northwind Components', price: 289, cost: 168, stockQuantity: 14, reorderLevel: 10, marginPercent: 41.87, isLowStock: false, isActive: true },
    { id: 'prod-printer', sku: 'SKU-1003', name: 'Thermal Label Printer', description: 'Shipping label printer.', category: 'Warehouse', supplier: 'Skyline Industrial', price: 449, cost: 262, stockQuantity: 8, reorderLevel: 6, marginPercent: 41.65, isLowStock: false, isActive: true },
    { id: 'prod-chair', sku: 'SKU-1004', name: 'Ergonomic Chair', description: 'Back-office seating.', category: 'Office Operations', supplier: 'Alpine Office Supply', price: 329, cost: 205, stockQuantity: 26, reorderLevel: 8, marginPercent: 37.69, isLowStock: false, isActive: true },
    { id: 'prod-tablet', sku: 'SKU-1005', name: 'Ledger Tablet', description: 'Field-service and approval tablet.', category: 'Field Service', supplier: 'Skyline Industrial', price: 799, cost: 540, stockQuantity: 11, reorderLevel: 7, marginPercent: 32.42, isLowStock: false, isActive: true },
    { id: 'prod-kiosk', sku: 'SKU-1006', name: 'Guest Check-In Kiosk', description: 'Interactive self-service kiosk.', category: 'Field Service', supplier: 'Skyline Industrial', price: 2199, cost: 1450, stockQuantity: 5, reorderLevel: 5, marginPercent: 34.06, isLowStock: true, isActive: true }
  ]

  const inventoryItems: InventoryItemDto[] = products.map((product) => ({
    productId: product.id,
    sku: product.sku,
    productName: product.name,
    supplier: product.supplier,
    stockQuantity: product.stockQuantity,
    reorderLevel: product.reorderLevel,
    availableCoverDays: Math.max(3, Math.round(product.stockQuantity / 2)),
    inventoryValue: Number((product.stockQuantity * product.cost).toFixed(2)),
    isLowStock: product.isLowStock
  }))

  const purchaseOrders: PurchaseOrderDto[] = [
    { id: 'po-1', purchaseOrderNumber: 'PO-20260331-1', supplierId: 'sup-northwind', supplierName: 'Northwind Components', createdAt: addDays(-20), expectedDeliveryDate: addDays(-10), receivedAt: addDays(-12), status: 'Received', lines: [{ productId: 'prod-scanner', productName: 'Barcode Scanner Pro', quantity: 16, unitCost: 168, lineTotal: 2688 }], totalCost: 2688, notes: 'Historical replenishment' },
    { id: 'po-2', purchaseOrderNumber: 'PO-20260331-2', supplierId: 'sup-skyline', supplierName: 'Skyline Industrial', createdAt: addDays(-6), expectedDeliveryDate: addDays(8), receivedAt: null, status: 'Open', lines: [{ productId: 'prod-printer', productName: 'Thermal Label Printer', quantity: 5, unitCost: 262, lineTotal: 1310 }, { productId: 'prod-tablet', productName: 'Ledger Tablet', quantity: 5, unitCost: 540, lineTotal: 2700 }], totalCost: 4010, notes: 'Inbound warehouse replenishment' }
  ]

  const reorderRecommendations: ReorderRecommendationDto[] = [
    { productId: 'prod-kiosk', productName: 'Guest Check-In Kiosk', currentStock: 5, reorderLevel: 5, forecastedLeadTimeDemand: 8, recommendedOrderQuantity: 6, urgency: 'High' },
    { productId: 'prod-printer', productName: 'Thermal Label Printer', currentStock: 8, reorderLevel: 6, forecastedLeadTimeDemand: 11, recommendedOrderQuantity: 4, urgency: 'Medium' }
  ]

  const demandForecast: DemandForecastDto[] = products.slice(0, 5).map((product, index) => ({
    productId: product.id,
    productName: product.name,
    horizonDays: 14,
    forecastUnits: 8 + index * 2,
    trendDirection: index % 2 === 0 ? 'Up' : 'Stable',
    confidencePercent: 78 + index * 2
  }))

  const assets: AssetDto[] = [
    { id: 'asset-1', assetTag: 'AST-4101', name: 'Packaging Conveyor A', category: 'Manufacturing', status: 'Operational', lastServicedAt: addDays(-52), nextServiceDueAt: addDays(8), criticality: 9, conditionScore: 72, maintenanceRiskScore: 88 },
    { id: 'asset-2', assetTag: 'AST-4102', name: 'Forklift Unit 7', category: 'Logistics', status: 'Operational', lastServicedAt: addDays(-31), nextServiceDueAt: addDays(22), criticality: 7, conditionScore: 81, maintenanceRiskScore: 63 }
  ]

  const maintenanceForecast = assets.map((asset) => ({ assetId: asset.id, assetTag: asset.assetTag, assetName: asset.name, nextServiceDueAt: asset.nextServiceDueAt, maintenanceRiskScore: asset.maintenanceRiskScore, recommendedAction: asset.maintenanceRiskScore >= 80 ? 'Prioritize this week.' : 'Monitor in next cycle.' }))
  const warehouses: WarehouseDto[] = [
    { id: 'warehouse-main', warehouseCode: 'MAIN', name: 'Main Warehouse', branchCode: 'HQ', type: 'Distribution', isPrimary: true, stock: inventoryItems.map((item, index) => ({ productId: item.productId, productName: item.productName, quantityOnHand: Math.max(0, item.stockQuantity - 2), quantityReserved: 1, defaultBin: `A-${index + 1}`, batchNumber: `BATCH-${item.sku}`, serialNumber: item.stockQuantity > 10 ? `SER-${item.sku}` : null })) },
    { id: 'warehouse-field', warehouseCode: 'FIELD', name: 'Field Service Hub', branchCode: 'WH1', type: 'Service', isPrimary: false, stock: inventoryItems.map((item, index) => ({ productId: item.productId, productName: item.productName, quantityOnHand: Math.min(3, item.stockQuantity), quantityReserved: 0, defaultBin: `FS-${index + 1}`, batchNumber: null, serialNumber: null })) }
  ]
  const transfers = [{ id: 'transfer-1', transferNumber: 'TRF-20260331-1', fromWarehouseCode: 'MAIN', toWarehouseCode: 'FIELD', productId: 'prod-tablet', productName: 'Ledger Tablet', quantity: 2, status: 'Completed', requestedAt: addDays(-6), completedAt: addDays(-5), reason: 'Field buffer stock' }]
  const shipments: ShipmentDto[] = [{ id: 'shipment-1', shipmentNumber: 'SHP-20260331-1', direction: 'Outbound', status: 'In Transit', carrier: 'BlueDart', trackingNumber: 'TRK-ERP-1001', originWarehouseCode: 'MAIN', destinationName: 'Acme Retail', salesOrderId: 'order-1', purchaseOrderId: null, scheduledShipDate: nowIso(), deliveredAt: null }]
  const fixedAssets: FixedAssetDto[] = [
    { id: 'fa-1', assetNumber: 'FA-1001', name: 'Packaging Conveyor A', assetClass: 'Manufacturing', status: 'Capitalized', companyCode: 'VJH', branchCode: 'HQ', capitalizedOn: addDays(-540), acquisitionCost: 50000, salvageValue: 2500, residualValue: 32000, accumulatedDepreciation: 18000, depreciationMethod: 'SLM', usefulLifeMonths: 60, depreciationRate: 20, revaluationAmount: 0, ownerDepartment: 'Operations', currentLocation: 'Assembly Line 1', lastDepreciatedOn: addDays(-35), operationalAssetId: 'asset-1' },
    { id: 'fa-2', assetNumber: 'FA-1002', name: 'Forklift Unit 7', assetClass: 'Logistics', status: 'Capitalized', companyCode: 'VJH', branchCode: 'WH1', capitalizedOn: addDays(-420), acquisitionCost: 62000, salvageValue: 3000, residualValue: 40000, accumulatedDepreciation: 22000, depreciationMethod: 'WDV', usefulLifeMonths: 72, depreciationRate: 18, revaluationAmount: 0, ownerDepartment: 'Warehouse', currentLocation: 'West Yard', lastDepreciatedOn: addDays(-35), operationalAssetId: 'asset-2' }
  ]
  const fixedAssetCompliance: FixedAssetComplianceReportDto = {
    totalAssets: fixedAssets.length,
    grossBookValue: fixedAssets.reduce((sum, item) => sum + item.acquisitionCost, 0),
    netBookValue: fixedAssets.reduce((sum, item) => sum + item.residualValue, 0),
    accumulatedDepreciation: fixedAssets.reduce((sum, item) => sum + item.accumulatedDepreciation, 0),
    assetsPendingDepreciation: 0,
    complianceWarnings: []
  }
  const workOrders: WorkOrderDto[] = [{ id: 'wo-1', workOrderNumber: 'WO-20260331-1', productName: 'Thermal Label Printer', workCenter: 'Assembly-2', status: 'Scheduled', scheduledStart: addDays(1), expectedCompletion: addDays(2), quantity: 16, producedQuantity: 0 }, { id: 'wo-2', workOrderNumber: 'WO-20260331-2', productName: 'Barcode Scanner Pro', workCenter: 'Calibration-1', status: 'In Progress', scheduledStart: addDays(-1), expectedCompletion: nowIso(), quantity: 24, producedQuantity: 11 }]
  const anomalies: AnomalyDetectionDto[] = [{ domain: 'Inventory', severity: 'High', title: 'Low stock risk for kiosks', narrative: 'Guest Check-In Kiosk is at its reorder threshold.', score: 91, referenceType: 'Product', referenceId: 'prod-kiosk' }, { domain: 'Payments', severity: 'Medium', title: 'Overdue balance emerging', narrative: 'One receivable is partially paid and nearing escalation.', score: 76, referenceType: 'Invoice', referenceId: 'invoice-2' }, { domain: 'Maintenance', severity: 'Medium', title: 'Preventive maintenance due', narrative: 'Packaging Conveyor A should be serviced in the next week.', score: 71, referenceType: 'Asset', referenceId: 'asset-1' }]
  const customers: CustomerDto[] = [{ id: 'cust-acme', name: 'Acme Retail', email: 'buyers@acmeretail.local', contactNumber: '+1-555-0101', segment: 'Enterprise', createdAt: addDays(-90), lifetimeValue: 3537.64, outstandingBalance: 0 }, { id: 'cust-beta', name: 'Beta Foods', email: 'ops@betafoods.local', contactNumber: '+1-555-0102', segment: 'Mid-Market', createdAt: addDays(-80), lifetimeValue: 1752.3, outstandingBalance: 1352.3 }, { id: 'cust-cedar', name: 'Cedar Logistics', email: 'finance@cedarlogistics.local', contactNumber: '+1-555-0103', segment: 'Enterprise', createdAt: addDays(-70), lifetimeValue: 2002.46, outstandingBalance: 2002.46 }]
  const orders: OrderDto[] = [{ id: 'order-1', orderNumber: 'SO-20260301-1', customerId: 'cust-acme', customerName: 'Acme Retail', orderDate: addDays(-25), status: 'Completed', lines: [{ productId: 'prod-pos-terminal', productName: 'Surface POS Terminal', quantity: 2, unitPrice: 1499, lineTotal: 2998 }], subtotal: 2998, taxAmount: 539.64, totalAmount: 3537.64, invoiceId: 'invoice-1' }, { id: 'order-2', orderNumber: 'SO-20260310-2', customerId: 'cust-beta', customerName: 'Beta Foods', orderDate: addDays(-16), status: 'Processing', lines: [{ productId: 'prod-scanner', productName: 'Barcode Scanner Pro', quantity: 4, unitPrice: 289, lineTotal: 1156 }, { productId: 'prod-chair', productName: 'Ergonomic Chair', quantity: 1, unitPrice: 329, lineTotal: 329 }], subtotal: 1485, taxAmount: 267.3, totalAmount: 1752.3, invoiceId: 'invoice-2' }, { id: 'order-3', orderNumber: 'SO-20260318-3', customerId: 'cust-cedar', customerName: 'Cedar Logistics', orderDate: addDays(-8), status: 'Pending', lines: [{ productId: 'prod-printer', productName: 'Thermal Label Printer', quantity: 2, unitPrice: 449, lineTotal: 898 }, { productId: 'prod-tablet', productName: 'Ledger Tablet', quantity: 1, unitPrice: 799, lineTotal: 799 }], subtotal: 1697, taxAmount: 305.46, totalAmount: 2002.46, invoiceId: 'invoice-3' }]
  const orderMetrics: OrderMetricsDto = { openOrders: 2, completedOrders: 1, revenueLast30Days: 7292.4, averageOrderValue: 2430.8, lowStockBlockers: 1 }
  const projects: ProjectDto[] = [{ id: 'project-1', projectCode: 'PRJ-2026-1', name: 'Retail Modernization Program', customerName: 'Acme Retail', projectManager: 'Noah Chen', status: 'Active', budget: 185000, recognizedRevenue: 112000, percentComplete: 62, startDate: addDays(-75), dueDate: addDays(45) }, { id: 'project-2', projectCode: 'PRJ-2026-2', name: 'Warehouse Mobility Rollout', customerName: 'Cedar Logistics', projectManager: 'Iris Walker', status: 'Planning', budget: 98000, recognizedRevenue: 24000, percentComplete: 28, startDate: addDays(-21), dueDate: addDays(70) }]
  const tickets: ServiceTicketDto[] = [{ id: 'ticket-1', ticketNumber: 'TKT-20260331-1', customerName: 'Acme Retail', subject: 'POS sync intermittent failures', priority: 'High', status: 'In Progress', openedAt: addHours(-18), dueAt: addHours(6), assignedTeam: 'Field Service' }, { id: 'ticket-2', ticketNumber: 'TKT-20260331-2', customerName: 'Beta Foods', subject: 'Printer calibration request', priority: 'Medium', status: 'New', openedAt: addHours(-4), dueAt: addHours(20), assignedTeam: 'Support Desk' }]
  const fieldServiceJobs: FieldServiceJobDto[] = [{ id: 'job-1', jobNumber: 'FS-20260331-1', serviceTicketId: 'ticket-1', customerName: 'Acme Retail', technicianName: 'Lena Ortiz', status: 'Scheduled', scheduledStart: addHours(4), scheduledEnd: addHours(8), offlineSyncEnabled: true, latitude: 12.9716, longitude: 77.5946, serviceReport: '' }]
  const productLifecycles: ProductLifecycleDto[] = [{ id: 'plm-1', productId: 'prod-pos-terminal', productName: 'Surface POS Terminal', version: 'v2.1', lifecycleStage: 'Released', releasedAt: addDays(-120), billOfMaterials: [{ componentProductId: 'prod-scanner', componentName: 'Barcode Scanner Pro', quantity: 1, unitOfMeasure: 'EA' }, { componentProductId: 'prod-printer', componentName: 'Thermal Label Printer', quantity: 1, unitOfMeasure: 'EA' }] }]
  const productChanges: ProductChangeDto[] = [{ id: 'change-1', changeNumber: 'ECO-20260331-1', productLifecycleId: 'plm-1', productName: 'Surface POS Terminal', title: 'Improve thermal resistance', status: 'Approved', requestedBy: 'Quality Engineering', requestedAt: addDays(-60), approvedAt: addDays(-56), impactSummary: 'Updated enclosure material and validation checklist.' }]
  const accessSummary: AccessControlSummaryDto = { tenantId: 'tenant-demo', roles: demoAccounts[0].user.roles, permissions: demoAccounts[0].user.permissions, companies, branches }
  const billingDashboard: BillingDashboardDto = { totalInvoiced: 7292.4, collectedAmount: 3937.64, outstandingBalance: 3354.76, overdueBalance: 1352.3, overdueInvoices: 1, collectionEfficiencyPercent: 53.99 }
  const executiveDashboard: ExecutiveDashboardDto = { inventoryValue: 42897, lowStockProducts: 1, openOrders: 2, revenueLast30Days: 7292.4, outstandingBalance: 3354.76, overdueInvoices: 1, highRiskCollections: 1, collectionEfficiencyPercent: 87, atRiskRevenue: 10995 }
  const financeDashboard: FinanceDashboardDto = { cashCollectedLast30Days: 3937.64, outstandingReceivables: 3354.76, overdueReceivables: 1352.3, monthlyPayrollRunRate: 28000, assetMaintenanceReserve: 14500, workingCapitalIndicator: 1.24, narrative: 'Cash collections are healthy, but one partially paid invoice needs follow-up.' }
  const payrollSummary: PayrollSummaryDto = { activeEmployees: 12, monthlyGrossPayroll: 28000, averageMonthlySalary: 2333.33, nextPayrollDate: addDays(3), pendingPayrollApprovals: 2, status: 'Ready for review' }
  const requisitions: PurchaseRequisitionDto[] = [{ id: 'req-1', requisitionNumber: 'PR-20260331-1', department: 'Operations', requestedBy: 'Marcus Reed', status: 'Approved', requestedAt: addDays(-7), justification: 'Restore safety stock for high-velocity scanners.', lines: [{ productId: 'prod-scanner', productName: 'Barcode Scanner Pro', quantity: 12, estimatedUnitCost: 168, estimatedLineTotal: 2016 }], estimatedTotal: 2016 }]
  const rfqs: RequestForQuoteDto[] = [{ id: 'rfq-1', rfqNumber: 'RFQ-20260331-1', requisitionId: 'req-1', title: 'Scanner replenishment', status: 'Awarded', issuedAt: addDays(-6), responseDueAt: addDays(-3), supplierQuotes: [{ supplierId: 'sup-northwind', supplierName: 'Northwind Components', quotedAmount: 1600, leadTimeDays: 9, score: 92, isAwarded: true }, { supplierId: 'sup-skyline', supplierName: 'Skyline Industrial', quotedAmount: 1740, leadTimeDays: 16, score: 84, isAwarded: false }] }]
  const vendorComparisons: Record<string, VendorComparisonDto> = { 'rfq-1': { rfqId: 'rfq-1', rfqNumber: 'RFQ-20260331-1', recommendedSupplierName: 'Northwind Components', recommendedQuote: 1600, recommendedLeadTimeDays: 9, options: rfqs[0].supplierQuotes } }
  const threeWayMatches: ThreeWayMatchDto[] = [{ purchaseOrderId: 'po-1', purchaseOrderNumber: 'PO-20260331-1', supplierName: 'Northwind Components', purchaseOrderTotal: 2688, receivedValue: 2688, invoiceValue: 2688, matchStatus: 'Matched', variance: 0 }]
  const integrationOverview: IntegrationOverviewDto = { activeConnections: 2, activeWebhooks: 1, failedSyncs: 0, supportedConnectors: ['Payment gateways', 'Banking systems', 'External CRMs', 'E-commerce platforms'] }
  const integrations: IntegrationConnectionDto[] = [{ id: 'int-1', name: 'Primary Payment Gateway', type: 'PaymentGateway', provider: 'Stripe', status: 'Healthy', endpointUrl: 'https://payments.example.local/stripe', lastSyncAt: addHours(-2), lastSyncResult: 'Success', retryCount: 0 }, { id: 'int-2', name: 'Core Banking Host', type: 'Banking', provider: 'HSBC Host Link', status: 'Healthy', endpointUrl: 'https://banking.example.local/host', lastSyncAt: addHours(-4), lastSyncResult: 'Success', retryCount: 0 }]
  const webhooks: WebhookSubscriptionDto[] = [{ id: 'webhook-1', name: 'CRM Order Sync', topic: 'sales', targetUrl: 'https://crm.example.local/webhooks/orders', secretReference: 'kv://erp/crm-order-sync', isActive: true, createdAt: addDays(-10), lastDeliveredAt: addHours(-1), lastDeliveryStatus: 'Delivered' }]
  const reportingSnapshot: ReportingSnapshotDto = { revenueLast30Days: 7292.4, collectionsLast30Days: 3937.64, inventoryValue: 42897, outstandingBalance: 3354.76, openProjects: 2, openTickets: 2, openWorkOrders: 2, monthlyPayrollRunRate: 28000, predictedMaintenanceExposure: 14500 }
  const payments: PaymentDto[] = [{ id: 'payment-1', invoiceId: 'invoice-1', invoiceNumber: 'INV-20260301-1', customerId: 'cust-acme', customerName: 'Acme Retail', paymentDate: addDays(-20), amount: 3537.64, paymentMethod: 'Card', reference: 'CARD-1001', isRefund: false }, { id: 'payment-2', invoiceId: 'invoice-2', invoiceNumber: 'INV-20260310-2', customerId: 'cust-beta', customerName: 'Beta Foods', paymentDate: addDays(-4), amount: 400, paymentMethod: 'Bank Transfer', reference: 'WIRE-2241', isRefund: false }]
  const collectionRisk: CollectionRiskReportDto = { items: [{ invoiceId: 'invoice-2', invoiceNumber: 'INV-20260310-2', customerName: 'Beta Foods', balance: 1352.3, daysOverdue: 2, riskScore: 72, riskBand: 'High' }, { invoiceId: 'invoice-3', invoiceNumber: 'INV-20260318-3', customerName: 'Cedar Logistics', balance: 2002.46, daysOverdue: 0, riskScore: 58, riskBand: 'Medium' }], totalExposure: 3354.76 }
  const invoices: InvoiceDto[] = [{ id: 'invoice-1', invoiceNumber: 'INV-20260301-1', salesOrderId: 'order-1', orderNumber: 'SO-20260301-1', customerId: 'cust-acme', customerName: 'Acme Retail', invoiceDate: addDays(-25), dueDate: addDays(-11), totalAmount: 3537.64, paidAmount: 3537.64, balance: 0, status: 'Paid', paymentMethod: 'Card', daysOverdue: 0 }, { id: 'invoice-2', invoiceNumber: 'INV-20260310-2', salesOrderId: 'order-2', orderNumber: 'SO-20260310-2', customerId: 'cust-beta', customerName: 'Beta Foods', invoiceDate: addDays(-16), dueDate: addDays(-2), totalAmount: 1752.3, paidAmount: 400, balance: 1352.3, status: 'Partially Paid', paymentMethod: 'Bank Transfer', daysOverdue: 2 }, { id: 'invoice-3', invoiceNumber: 'INV-20260318-3', salesOrderId: 'order-3', orderNumber: 'SO-20260318-3', customerId: 'cust-cedar', customerName: 'Cedar Logistics', invoiceDate: addDays(-8), dueDate: addDays(6), totalAmount: 2002.46, paidAmount: 0, balance: 2002.46, status: 'Unpaid', paymentMethod: 'Bank Transfer', daysOverdue: 0 }]
  const invoiceAging: InvoiceAgingReportDto = { buckets: [{ label: 'Current', amount: 2002.46 }, { label: '1-30 days', amount: 1352.3 }, { label: '31-60 days', amount: 0 }, { label: '60+ days', amount: 0 }], overdueInvoices: 1, totalOverdue: 1352.3 }
  const notifications: NotificationDto[] = [{ id: 'note-1', createdAt: addHours(-3), type: 'Collections', title: 'Overdue exposure rising', message: 'Beta Foods has invoices nearing escalation thresholds.', severity: 'High', isRead: false, referenceType: 'Invoice', referenceId: 'invoice-2' }, { id: 'note-2', createdAt: addHours(-2), type: 'Procurement', title: 'Critical replenishment open', message: 'Open scanner replenishment requires sourcing review.', severity: 'Medium', isRead: false, referenceType: 'PurchaseOrder', referenceId: 'po-2' }, { id: 'note-3', createdAt: addHours(-1), type: 'Projects', title: 'Warehouse rollout at risk', message: 'The warehouse mobility rollout needs a milestone review.', severity: 'Warning', isRead: false, referenceType: 'Project', referenceId: 'project-2' }]
  const auditTrail: AuditTrailEntryDto[] = [{ id: 'audit-1', occurredAt: addHours(-5), tenantId: 'tenant-demo', userId: 'demo-admin', userName: 'Demo Admin', action: 'WorkspaceSeeded', entityType: 'TenantWorkspace', entityId: null, outcome: 'Succeeded', details: 'Initialized demo workspace.', correlationId: 'corr-demo-1' }]
  const outbox: OutboxMessageDto[] = [{ id: 'outbox-1', occurredAt: addHours(-4), topic: 'sales', eventType: 'SalesOrderCreated', aggregateType: 'SalesOrder', aggregateId: 'order-3', status: 'Dispatched', attemptCount: 1, payload: '{"orderNumber":"SO-20260318-3"}' }]
  const aiReadiness: AiReadinessDto = { provider: 'Edgeonix Demo AI', aiEnabled: true, useBackgroundPredictions: true, structuredBusinessEventsEnabled: true, useCases: [{ name: 'Collections prioritization', enabled: true, dataSource: 'Payments', integrationPattern: 'Background predictions' }, { name: 'Demand forecasting', enabled: true, dataSource: 'Inventory', integrationPattern: 'Scheduled forecast' }, { name: 'Service anomaly review', enabled: false, dataSource: 'Field service', integrationPattern: 'Advisory only' }] }
  const industryProfiles: IndustryProfileDto[] = [{ industryCode: 'manufacturing', name: 'Manufacturing', description: 'Controls production planning and BOM governance.', enabledModules: ['Inventory', 'Supply Chain', 'Procurement', 'PLM', 'Maintenance', 'Finance'], workflowTemplates: ['manufacturing-eco', 'manufacturing-wo'], reportingFocus: ['Yield variance', 'Work center utilization'], isActive: true }, { industryCode: 'automotive', name: 'Automotive', description: 'Coordinates serialized inventory and supplier readiness.', enabledModules: ['Inventory', 'Supply Chain', 'Procurement', 'PLM', 'Field Service', 'Finance'], workflowTemplates: ['automotive-supplier-readiness'], reportingFocus: ['Supplier PPM', 'Serialized traceability'], isActive: false }, { industryCode: 'chemical', name: 'Chemical', description: 'Adds batch traceability and safety review workflows.', enabledModules: ['Inventory', 'Supply Chain', 'Procurement', 'Maintenance', 'Finance'], workflowTemplates: ['chemical-batch-release'], reportingFocus: ['Batch yield'], isActive: false }, { industryCode: 'pharma-medical', name: 'Pharma & Medical', description: 'Supports controlled inventory and compliance reporting.', enabledModules: ['Inventory', 'Supply Chain', 'Procurement', 'Field Service', 'Maintenance', 'Finance'], workflowTemplates: ['pharma-capa'], reportingFocus: ['Cold-chain compliance'], isActive: false }, { industryCode: 'furniture', name: 'Furniture', description: 'Optimizes make-to-order planning.', enabledModules: ['Sales', 'Inventory', 'Supply Chain', 'PLM', 'Manufacturing', 'Finance'], workflowTemplates: ['furniture-custom-order'], reportingFocus: ['Backlog'], isActive: false }, { industryCode: 'packaging', name: 'Packaging', description: 'Supports high-throughput replenishment and maintenance tracking.', enabledModules: ['Inventory', 'Supply Chain', 'Manufacturing', 'Maintenance', 'Field Service', 'Finance'], workflowTemplates: ['packaging-line-maintenance'], reportingFocus: ['Shipment OTIF'], isActive: false }]
  const workflowTemplates: WorkflowTemplateDto[] = [{ id: 'wf-1', templateCode: 'manufacturing-eco', name: 'Manufacturing engineering change', industryCode: 'manufacturing', department: 'Engineering', slaHours: 48, isDefault: true, stages: ['Submitted', 'Impact Review', 'Cost Review', 'Approved', 'Implemented'], triggers: ['PLM change request'] }, { id: 'wf-2', templateCode: 'manufacturing-wo', name: 'Production work order release', industryCode: 'manufacturing', department: 'Production', slaHours: 24, isDefault: true, stages: ['Planned', 'Material Check', 'Released', 'In Progress', 'Closed'], triggers: ['Demand plan'] }, { id: 'wf-3', templateCode: 'packaging-line-maintenance', name: 'Packaging line maintenance escalation', industryCode: 'packaging', department: 'Maintenance', slaHours: 8, isDefault: true, stages: ['Alerted', 'Diagnosed', 'Resolved'], triggers: ['Predictive alert'] }]
  const organizationOverview: OrganizationOverviewDto = { tenantId: 'tenant-demo', activeProducts: products.length, lowStockProducts: 1, openOrders: 2, overdueInvoices: 1, openProjects: 2, openTickets: 2, openWorkOrders: 2, inventoryValue: 42897, outstandingBalance: 3354.76, unreadNotifications: notifications.filter((item) => !item.isRead).length }
  const operationsSummary: PlatformOperationsSummaryDto = { tenantId: 'tenant-demo', correlationId: 'corr-demo-ops', pendingOutboxMessages: 1, deadLetteredOutboxMessages: 0, unreadNotifications: notifications.filter((item) => !item.isRead).length, recentAuditEntries: auditTrail.length, usesDurableDatabase: false }
  const serviceHealth: ServiceHealthDto[] = ['auth', 'platform', 'catalog', 'inventory', 'sales', 'billing', 'payments', 'invoices'].map((id) => ({ id, service: id[0].toUpperCase() + id.slice(1), area: 'Demo service', status: 'online', statusLabel: 'Healthy', baseUrl: `demo://${id}`, checkedAt: nowIso(), detail: 'Demo mode virtual service is ready.', tenants: 1 }))

  return { companies, branches, categories, suppliers, products, inventoryItems, purchaseOrders, reorderRecommendations, demandForecast, assets, maintenanceForecast, warehouses, transfers, shipments, fixedAssets, fixedAssetCompliance, workOrders, anomalies, customers, orders, orderMetrics, projects, tickets, fieldServiceJobs, productLifecycles, productChanges, accessSummary, billingDashboard, executiveDashboard, financeDashboard, payrollSummary, requisitions, rfqs, vendorComparisons, threeWayMatches, integrationOverview, integrations, webhooks, reportingSnapshot, payments, collectionRisk, invoices, invoiceAging, notifications, auditTrail, outbox, aiReadiness, industryProfiles, workflowTemplates, organizationOverview, operationsSummary, serviceHealth }
}

function getEnvelope() {
  const existing = readEnvelope()
  if (existing) return existing
  const envelope = { expiresAtUtc: new Date(Date.now() + ttlMs).toISOString(), state: buildState() }
  writeEnvelope(envelope)
  return envelope
}

function saveState(state: DemoState) {
  const envelope: DemoEnvelope = {
    expiresAtUtc: new Date(Date.now() + ttlMs).toISOString(),
    state
  }

  writeEnvelope(envelope)
  return envelope
}

function updateState<T>(mutator: (state: DemoState) => T) {
  const envelope = getEnvelope()
  const state = clone(envelope.state)
  const result = mutator(state)
  saveState(state)
  return clone(result)
}

function normalizePath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

function readParam(config: AxiosRequestConfig | undefined, key: string) {
  const params = config?.params as Record<string, unknown> | undefined
  return params?.[key]
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : null
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function createCatalogOverview(state: DemoState): CatalogOverviewDto {
  const activeProducts = state.products.filter((item) => item.isActive)
  const inventoryValue = activeProducts.reduce((sum, item) => sum + item.stockQuantity * item.cost, 0)
  const averageGrossMarginPercent = activeProducts.length
    ? activeProducts.reduce((sum, item) => sum + item.marginPercent, 0) / activeProducts.length
    : 0

  return {
    activeProducts: activeProducts.length,
    categories: state.categories.length,
    suppliers: state.suppliers.length,
    lowStockProducts: activeProducts.filter((item) => item.isLowStock).length,
    averageGrossMarginPercent: Number(averageGrossMarginPercent.toFixed(2)),
    inventoryValue: Number(inventoryValue.toFixed(2))
  }
}

function createCatalogReferenceData(state: DemoState): CatalogReferenceDataDto {
  return {
    categories: state.categories.map((item) => ({ id: item.id, name: item.name })),
    suppliers: state.suppliers.map((item) => ({
      id: item.id,
      name: item.name,
      contactName: item.contactName,
      email: item.email,
      leadTimeDays: item.leadTimeDays
    }))
  }
}

function createInventoryDashboard(state: DemoState): InventoryDashboardDto {
  return {
    totalProducts: state.products.length,
    totalUnitsOnHand: state.inventoryItems.reduce((sum, item) => sum + item.stockQuantity, 0),
    lowStockProducts: state.inventoryItems.filter((item) => item.isLowStock).length,
    inventoryValue: Number(state.inventoryItems.reduce((sum, item) => sum + item.inventoryValue, 0).toFixed(2)),
    atRiskRevenue: Number(
      state.products.filter((item) => item.isLowStock).reduce((sum, item) => sum + item.price * item.reorderLevel, 0).toFixed(2)
    )
  }
}

function createProcurementDashboard(state: DemoState): ProcurementDashboardDto {
  const openPurchaseOrders = state.purchaseOrders.filter((item) => item.status !== 'Received')
  return {
    openPurchaseOrders: openPurchaseOrders.length,
    pendingReceipts: openPurchaseOrders.length,
    committedSpend: Number(openPurchaseOrders.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)),
    inboundStockValue: Number(openPurchaseOrders.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)),
    urgentReorders: state.reorderRecommendations.filter((item) => item.urgency === 'High').length,
    averageSupplierLeadTimeDays: Number((state.suppliers.reduce((sum, item) => sum + item.leadTimeDays, 0) / state.suppliers.length).toFixed(1))
  }
}

function createBillingAlerts(state: DemoState, maxAlerts: number): AlertDto[] {
  return [
    {
      severity: 'High',
      area: 'Collections',
      message: 'One partially paid invoice is overdue and needs follow-up.',
      referenceType: 'Invoice',
      referenceId: 'invoice-2'
    },
    {
      severity: 'Medium',
      area: 'Inventory',
      message: 'Guest Check-In Kiosk inventory is at the reorder threshold.',
      referenceType: 'Product',
      referenceId: 'prod-kiosk'
    },
    {
      severity: 'Info',
      area: 'Integration',
      message: 'All configured demo integrations completed their latest sync.',
      referenceType: 'Integration',
      referenceId: 'int-1'
    }
  ].slice(0, maxAlerts)
}

function createCashForecast(state: DemoState, horizonDays: number): CashFlowForecastDto {
  return {
    horizonDays,
    openReceivables: Number(state.invoices.reduce((sum, item) => sum + item.balance, 0).toFixed(2)),
    expectedCollections: Number((state.invoices.reduce((sum, item) => sum + item.balance, 0) * 0.78).toFixed(2)),
    overdueExposure: Number(state.invoices.filter((item) => item.daysOverdue > 0).reduce((sum, item) => sum + item.balance, 0).toFixed(2)),
    highRiskInvoices: state.collectionRisk.items.filter((item) => item.riskScore >= 70).length,
    confidencePercent: 82,
    narrative: 'Collections remain healthy in demo mode, with one overdue invoice needing timely follow-up.'
  }
}

function createCustomerIntelligence(state: DemoState, customerId: string): CustomerIntelligenceDto {
  const customer = state.customers.find((item) => item.id === customerId)
  const orders = state.orders.filter((item) => item.customerId === customerId)
  const totalValue = orders.reduce((sum, item) => sum + item.totalAmount, 0)

  return {
    customerId,
    customerName: customer?.name ?? 'Unknown customer',
    lifetimeValue: customer?.lifetimeValue ?? totalValue,
    averageOrderValue: orders.length ? Number((totalValue / orders.length).toFixed(2)) : 0,
    lastOrderDate: orders[0]?.orderDate ?? null,
    ordersCount: orders.length,
    churnRiskScore: customer?.outstandingBalance ? 46 : 18,
    expansionScore: customer?.segment === 'Enterprise' ? 88 : 68,
    outstandingBalance: customer?.outstandingBalance ?? 0,
    nextBestAction: customer?.outstandingBalance ? 'Review receivable exposure and schedule follow-up.' : 'Offer upsell bundle for active product lines.'
  }
}

function createPlatformContext(): PlatformContextDto {
  return {
    tenantId: 'tenant-demo',
    userId: demoAccounts[0].user.userId,
    userName: demoAccounts[0].user.userName,
    roles: demoAccounts[0].user.roles,
    correlationId: `corr-${Date.now()}`
  }
}

function createDemoStatus(): DemoStatusDto {
  return {
    isEnabled: true,
    isDemoTenant: true,
    isDemoUser: true,
    canReset: true,
    demoTenantId: 'tenant-demo',
    currentTenantId: 'tenant-demo'
  }
}

export async function getDemoServiceHealth() {
  await delay()
  return clone(getEnvelope().state.serviceHealth)
}

export async function resetDemoData() {
  await delay()
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(cacheKey)
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function filterByStatus<T extends { status: string }>(items: T[], status: string | null) {
  if (!status) {
    return items
  }

  return items.filter((item) => item.status.toLowerCase() === status.toLowerCase())
}

function notFound(path: string): never {
  throw {
    message: `Demo route not configured for ${path}.`,
    status: 404,
    code: 'DEMO_ROUTE_NOT_FOUND'
  }
}

export async function handleDemoRequest<T>(
  service: ServiceKey,
  method: string,
  path = '',
  payload?: unknown,
  config?: AxiosRequestConfig
) {
  await delay()

  const normalizedMethod = method.toUpperCase() as HttpMethod
  const normalizedPath = normalizePath(path)

  if (service === 'platform' && normalizedMethod === 'GET' && normalizedPath === '/api/demo/status') {
    return clone(createDemoStatus()) as T
  }

  if (service === 'platform' && normalizedMethod === 'POST' && normalizedPath === '/api/demo/reset') {
    await resetDemoData()
    return undefined as T
  }

  const state = getEnvelope().state

  if (service === 'catalog') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/catalog/overview') return clone(createCatalogOverview(state)) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/catalog/reference-data') return clone(createCatalogReferenceData(state)) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/categories') return clone(state.categories) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/suppliers') return clone(state.suppliers) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/products') {
      const search = asString(readParam(config, 'search'))?.toLowerCase()
      const includeInactive = asBoolean(readParam(config, 'includeInactive'))
      return clone(
        state.products.filter((item) => (includeInactive || item.isActive) && (!search || `${item.name} ${item.sku}`.toLowerCase().includes(search)))
      ) as T
    }

    if (normalizedMethod === 'GET' && normalizedPath.startsWith('/api/products/')) {
      const id = normalizedPath.split('/').pop()
      const product = state.products.find((item) => item.id === id)
      if (!product) notFound(normalizedPath)
      return clone(product) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/categories') {
      return updateState((draft) => {
        const name = asString((payload as { name?: string })?.name) ?? 'New Category'
        const category: CategorySummaryDto = {
          id: nextId('cat'),
          name,
          productCount: 0,
          activeProductsCount: 0,
          lowStockProducts: 0
        }
        draft.categories.unshift(category)
        return category
      }) as T
    }
    if (normalizedMethod === 'PUT' && normalizedPath.startsWith('/api/categories/')) {
      const categoryId = normalizedPath.split('/')[3]
      return updateState((draft) => {
        const category = draft.categories.find((item) => item.id === categoryId)
        if (!category) notFound(normalizedPath)
        category.name = asString((payload as { name?: string })?.name) ?? category.name
        return category
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/suppliers') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const supplier: SupplierDto = {
          id: nextId('sup'),
          name: asString(data.name) ?? 'New Supplier',
          contactName: asString(data.contactName) ?? 'Demo Contact',
          email: asString(data.email) ?? 'contact@demo.local',
          leadTimeDays: asNumber(data.leadTimeDays, 10),
          productCount: 0,
          openPurchaseOrders: 0,
          onTimeDeliveryScore: 90,
          fulfillmentRiskScore: 15
        }
        draft.suppliers.unshift(supplier)
        return supplier
      }) as T
    }
    if (normalizedMethod === 'PUT' && normalizedPath.startsWith('/api/suppliers/')) {
      const supplierId = normalizedPath.split('/')[3]
      return updateState((draft) => {
        const supplier = draft.suppliers.find((item) => item.id === supplierId)
        if (!supplier) notFound(normalizedPath)
        const data = payload as Record<string, unknown>
        supplier.name = asString(data.name) ?? supplier.name
        supplier.contactName = asString(data.contactName) ?? supplier.contactName
        supplier.email = asString(data.email) ?? supplier.email
        supplier.leadTimeDays = asNumber(data.leadTimeDays, supplier.leadTimeDays)
        return supplier
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/products') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const product: ProductDto = {
          id: nextId('prod'),
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          name: asString(data.name) ?? 'New Product',
          description: asString(data.description) ?? '',
          category: asString(data.categoryName) ?? 'General',
          supplier: asString(data.supplierName) ?? 'Demo Supplier',
          price: asNumber(data.price, 0),
          cost: asNumber(data.cost, 0),
          stockQuantity: asNumber(data.stockQuantity, 0),
          reorderLevel: asNumber(data.reorderLevel, 0),
          marginPercent: asNumber(data.price, 0) > 0 ? Number((((asNumber(data.price, 0) - asNumber(data.cost, 0)) / asNumber(data.price, 1)) * 100).toFixed(2)) : 0,
          isLowStock: asNumber(data.stockQuantity, 0) <= asNumber(data.reorderLevel, 0),
          isActive: asBoolean(data.isActive, true)
        }
        draft.products.unshift(product)
        draft.inventoryItems.unshift({
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          supplier: product.supplier,
          stockQuantity: product.stockQuantity,
          reorderLevel: product.reorderLevel,
          availableCoverDays: Math.max(3, Math.round(product.stockQuantity / 2)),
          inventoryValue: Number((product.stockQuantity * product.cost).toFixed(2)),
          isLowStock: product.isLowStock
        })
        return product
      }) as T
    }
    if (normalizedMethod === 'PUT' && normalizedPath.startsWith('/api/products/')) {
      const productId = normalizedPath.split('/')[3]
      return updateState((draft) => {
        const product = draft.products.find((item) => item.id === productId)
        if (!product) notFound(normalizedPath)
        const data = payload as Record<string, unknown>
        product.name = asString(data.name) ?? product.name
        product.description = asString(data.description) ?? product.description
        product.category = asString(data.categoryName) ?? product.category
        product.supplier = asString(data.supplierName) ?? product.supplier
        product.price = asNumber(data.price, product.price)
        product.cost = asNumber(data.cost, product.cost)
        product.stockQuantity = asNumber(data.stockQuantity, product.stockQuantity)
        product.reorderLevel = asNumber(data.reorderLevel, product.reorderLevel)
        product.isActive = asBoolean(data.isActive, product.isActive)
        product.isLowStock = product.stockQuantity <= product.reorderLevel
        product.marginPercent = product.price > 0 ? Number((((product.price - product.cost) / product.price) * 100).toFixed(2)) : 0
        const inventoryItem = draft.inventoryItems.find((item) => item.productId === productId)
        if (inventoryItem) {
          inventoryItem.productName = product.name
          inventoryItem.supplier = product.supplier
          inventoryItem.stockQuantity = product.stockQuantity
          inventoryItem.reorderLevel = product.reorderLevel
          inventoryItem.availableCoverDays = Math.max(3, Math.round(product.stockQuantity / 2))
          inventoryItem.inventoryValue = Number((product.stockQuantity * product.cost).toFixed(2))
          inventoryItem.isLowStock = product.isLowStock
        }
        return product
      }) as T
    }
    if (normalizedMethod === 'DELETE' && normalizedPath.startsWith('/api/products/')) {
      const productId = normalizedPath.split('/')[3]
      updateState((draft) => {
        draft.products = draft.products.filter((item) => item.id !== productId)
        draft.inventoryItems = draft.inventoryItems.filter((item) => item.productId !== productId)
      })
      return undefined as T
    }
  }

  if (service === 'inventory') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/dashboard') return clone(createInventoryDashboard(state)) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/items') return clone(state.inventoryItems) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/procurement/dashboard') return clone(createProcurementDashboard(state)) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/purchase-orders') {
      return clone(filterByStatus(state.purchaseOrders, asString(readParam(config, 'status')))) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/reorder-recommendations') return clone(state.reorderRecommendations) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/demand-forecast') return clone(state.demandForecast) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/assets') {
      const dueOnly = asBoolean(readParam(config, 'dueForMaintenanceOnly'))
      return clone(dueOnly ? state.assets.filter((item) => item.maintenanceRiskScore >= 80) : state.assets) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/maintenance-forecast') return clone(state.maintenanceForecast) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/supply-chain/warehouses') return clone(state.warehouses) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/supply-chain/transfers') {
      return clone(filterByStatus(state.transfers, asString(readParam(config, 'status')))) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/supply-chain/shipments') {
      return clone(filterByStatus(state.shipments, asString(readParam(config, 'status')))) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/fixed-assets') {
      return clone(filterByStatus(state.fixedAssets, asString(readParam(config, 'status')))) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/fixed-assets/compliance-report') return clone(state.fixedAssetCompliance) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/manufacturing/work-orders') {
      return clone(filterByStatus(state.workOrders, asString(readParam(config, 'status')))) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/inventory/anomalies') {
      return clone(state.anomalies.slice(0, asNumber(readParam(config, 'maxResults'), 10))) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/inventory/purchase-orders') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const lines = Array.isArray(data.lines) ? (data.lines as Array<Record<string, unknown>>) : []
        const supplier = draft.suppliers.find((item) => item.id === asString(data.supplierId))
        const purchaseOrder: PurchaseOrderDto = {
          id: nextId('po'),
          purchaseOrderNumber: `PO-${Date.now()}`,
          supplierId: supplier?.id ?? 'sup-demo',
          supplierName: supplier?.name ?? 'Demo Supplier',
          createdAt: nowIso(),
          expectedDeliveryDate: addDays(7),
          receivedAt: null,
          status: 'Open',
          lines: lines.map((line) => {
            const product = draft.products.find((item) => item.id === asString(line.productId))
            const quantity = asNumber(line.quantity, 1)
            const unitCost = product?.cost ?? 0
            return {
              productId: product?.id ?? nextId('prod'),
              productName: product?.name ?? 'Demo Product',
              quantity,
              unitCost,
              lineTotal: Number((quantity * unitCost).toFixed(2))
            }
          }),
          totalCost: 0,
          notes: asString(data.notes) ?? ''
        }
        purchaseOrder.totalCost = Number(purchaseOrder.lines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2))
        draft.purchaseOrders.unshift(purchaseOrder)
        return purchaseOrder
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/inventory/purchase-orders/') && normalizedPath.endsWith('/receive')) {
      const orderId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const purchaseOrder = draft.purchaseOrders.find((item) => item.id === orderId)
        if (!purchaseOrder) notFound(normalizedPath)
        purchaseOrder.status = 'Received'
        purchaseOrder.receivedAt = asString((payload as { receivedAt?: string })?.receivedAt) ?? nowIso()
        purchaseOrder.lines.forEach((line) => {
          const inventoryItem = draft.inventoryItems.find((item) => item.productId === line.productId)
          if (inventoryItem) {
            inventoryItem.stockQuantity += line.quantity
            inventoryItem.inventoryValue = Number((inventoryItem.stockQuantity * (inventoryItem.inventoryValue / Math.max(inventoryItem.stockQuantity - line.quantity, 1))).toFixed(2))
            inventoryItem.isLowStock = inventoryItem.stockQuantity <= inventoryItem.reorderLevel
          }
        })
        return purchaseOrder
      }) as T
    }
    if (normalizedMethod === 'POST' && /\/api\/inventory\/[^/]+\/adjust$/.test(normalizedPath)) {
      const productId = normalizedPath.split('/')[3]
      return updateState((draft) => {
        const inventoryItem = draft.inventoryItems.find((item) => item.productId === productId)
        const product = draft.products.find((item) => item.id === productId)
        if (!inventoryItem || !product) notFound(normalizedPath)
        const delta = asNumber((payload as { quantityDelta?: number })?.quantityDelta, 0)
        inventoryItem.stockQuantity = Math.max(0, inventoryItem.stockQuantity + delta)
        inventoryItem.availableCoverDays = Math.max(3, Math.round(inventoryItem.stockQuantity / 2))
        inventoryItem.inventoryValue = Number((inventoryItem.stockQuantity * product.cost).toFixed(2))
        inventoryItem.isLowStock = inventoryItem.stockQuantity <= inventoryItem.reorderLevel
        product.stockQuantity = inventoryItem.stockQuantity
        product.isLowStock = inventoryItem.isLowStock
        return inventoryItem
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/inventory/assets/') && normalizedPath.endsWith('/maintenance')) {
      const assetId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const asset = draft.assets.find((item) => item.id === assetId)
        if (!asset) notFound(normalizedPath)
        asset.lastServicedAt = asString((payload as { servicedAt?: string })?.servicedAt) ?? nowIso()
        asset.conditionScore = asNumber((payload as { conditionScore?: number })?.conditionScore, asset.conditionScore)
        asset.maintenanceRiskScore = Math.max(10, 100 - asset.conditionScore)
        asset.nextServiceDueAt = addDays(30)
        return asset
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/inventory/supply-chain/transfers') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const transfer = {
          id: nextId('transfer'),
          transferNumber: `TRF-${Date.now()}`,
          fromWarehouseCode: asString(data.fromWarehouseCode) ?? 'MAIN',
          toWarehouseCode: asString(data.toWarehouseCode) ?? 'FIELD',
          productId: asString(data.productId) ?? 'prod-demo',
          productName: draft.products.find((item) => item.id === asString(data.productId))?.name ?? 'Demo Product',
          quantity: asNumber(data.quantity, 1),
          status: 'Requested',
          requestedAt: nowIso(),
          completedAt: null,
          reason: asString(data.reason) ?? ''
        }
        draft.transfers.unshift(transfer)
        return transfer
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/inventory/supply-chain/shipments/') && normalizedPath.endsWith('/status')) {
      const shipmentId = normalizedPath.split('/')[5]
      return updateState((draft) => {
        const shipment = draft.shipments.find((item) => item.id === shipmentId)
        if (!shipment) notFound(normalizedPath)
        shipment.status = asString((payload as { status?: string })?.status) ?? shipment.status
        shipment.deliveredAt = shipment.status.toLowerCase() === 'delivered' ? nowIso() : shipment.deliveredAt
        return shipment
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/inventory/supply-chain/shipments') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const shipment: ShipmentDto = {
          id: nextId('shipment'),
          shipmentNumber: `SHP-${Date.now()}`,
          direction: asString(data.direction) ?? 'Outbound',
          status: 'Scheduled',
          carrier: asString(data.carrier) ?? 'Demo Carrier',
          trackingNumber: asString(data.trackingNumber) ?? `TRK-${Date.now()}`,
          originWarehouseCode: asString(data.originWarehouseCode) ?? 'MAIN',
          destinationName: asString(data.destinationName) ?? 'Demo destination',
          salesOrderId: asString(data.salesOrderId),
          purchaseOrderId: asString(data.purchaseOrderId),
          scheduledShipDate: asString(data.scheduledShipDate) ?? nowIso(),
          deliveredAt: null
        }
        draft.shipments.unshift(shipment)
        return shipment
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/inventory/fixed-assets/') && normalizedPath.endsWith('/transfer')) {
      const assetId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const asset = draft.fixedAssets.find((item) => item.id === assetId)
        if (!asset) notFound(normalizedPath)
        const data = payload as Record<string, unknown>
        asset.branchCode = asString(data.branchCode) ?? asset.branchCode
        asset.currentLocation = asString(data.currentLocation) ?? asset.currentLocation
        asset.ownerDepartment = asString(data.ownerDepartment) ?? asset.ownerDepartment
        return asset
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/inventory/fixed-assets/') && normalizedPath.endsWith('/revalue')) {
      const assetId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const asset = draft.fixedAssets.find((item) => item.id === assetId)
        if (!asset) notFound(normalizedPath)
        const amount = asNumber((payload as { revaluationAmount?: number })?.revaluationAmount, 0)
        asset.revaluationAmount = amount
        asset.residualValue = Number((asset.residualValue + amount).toFixed(2))
        return asset
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/inventory/fixed-assets/depreciation/run') {
      return updateState((draft) => {
        draft.fixedAssets.forEach((item) => {
          item.lastDepreciatedOn = asString((payload as { runDate?: string })?.runDate) ?? nowIso()
        })
        draft.fixedAssetCompliance.assetsPendingDepreciation = 0
        return draft.fixedAssetCompliance
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/inventory/fixed-assets') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const asset: FixedAssetDto = {
          id: nextId('fa'),
          assetNumber: `FA-${Date.now().toString().slice(-6)}`,
          name: asString(data.name) ?? 'New Fixed Asset',
          assetClass: asString(data.assetClass) ?? 'General',
          status: 'Capitalized',
          companyCode: asString(data.companyCode) ?? 'VJH',
          branchCode: asString(data.branchCode) ?? 'HQ',
          capitalizedOn: nowIso(),
          acquisitionCost: asNumber(data.acquisitionCost, 0),
          salvageValue: asNumber(data.salvageValue, 0),
          residualValue: asNumber(data.acquisitionCost, 0),
          accumulatedDepreciation: 0,
          depreciationMethod: asString(data.depreciationMethod) ?? 'SLM',
          usefulLifeMonths: asNumber(data.usefulLifeMonths, 60),
          depreciationRate: asNumber(data.depreciationRate, 10),
          revaluationAmount: 0,
          ownerDepartment: asString(data.ownerDepartment) ?? 'Operations',
          currentLocation: asString(data.currentLocation) ?? 'Head Office',
          lastDepreciatedOn: nowIso(),
          operationalAssetId: asString(data.operationalAssetId)
        }
        draft.fixedAssets.unshift(asset)
        return asset
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/inventory/manufacturing/work-orders') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const order: WorkOrderDto = {
          id: nextId('wo'),
          workOrderNumber: `WO-${Date.now()}`,
          productName: asString(data.productName) ?? draft.products.find((item) => item.id === asString(data.productId))?.name ?? 'Demo Work Order',
          workCenter: asString(data.workCenter) ?? 'Assembly',
          status: 'Scheduled',
          scheduledStart: nowIso(),
          expectedCompletion: addHours(asNumber(data.plannedDurationHours, 8)),
          quantity: asNumber(data.quantity, 1),
          producedQuantity: 0
        }
        draft.workOrders.unshift(order)
        return order
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/inventory/manufacturing/work-orders/') && normalizedPath.endsWith('/status')) {
      const workOrderId = normalizedPath.split('/')[5]
      return updateState((draft) => {
        const order = draft.workOrders.find((item) => item.id === workOrderId)
        if (!order) notFound(normalizedPath)
        order.status = asString((payload as { status?: string })?.status) ?? order.status
        order.producedQuantity = asNumber((payload as { producedQuantity?: number })?.producedQuantity, order.producedQuantity)
        return order
      }) as T
    }
  }

  if (service === 'sales') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/customers') {
      const segment = asString(readParam(config, 'segment'))
      return clone(segment ? state.customers.filter((item) => item.segment === segment) : state.customers) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath.startsWith('/api/customers/') && normalizedPath.endsWith('/intelligence')) {
      const customerId = normalizedPath.split('/')[3]
      return clone(createCustomerIntelligence(state, customerId)) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath.startsWith('/api/customers/')) {
      const customerId = normalizedPath.split('/')[3]
      const customer = state.customers.find((item) => item.id === customerId)
      if (!customer) notFound(normalizedPath)
      return clone(customer) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/orders/metrics') return clone(state.orderMetrics) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/orders') return clone(filterByStatus(state.orders, asString(readParam(config, 'status')))) as T
    if (normalizedMethod === 'GET' && normalizedPath.startsWith('/api/orders/')) {
      const orderId = normalizedPath.split('/')[3]
      const order = state.orders.find((item) => item.id === orderId)
      if (!order) notFound(normalizedPath)
      return clone(order) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/projects') return clone(filterByStatus(state.projects, asString(readParam(config, 'status')))) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/service-desk/tickets') return clone(filterByStatus(state.tickets, asString(readParam(config, 'status')))) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/field-service/jobs') return clone(filterByStatus(state.fieldServiceJobs, asString(readParam(config, 'status')))) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/plm/lifecycles') {
      const productId = asString(readParam(config, 'productId'))
      return clone(productId ? state.productLifecycles.filter((item) => item.productId === productId) : state.productLifecycles) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/plm/changes') return clone(filterByStatus(state.productChanges, asString(readParam(config, 'status')))) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/access-control/summary') return clone(state.accessSummary) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/access-control/companies') return clone(state.companies) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/access-control/branches') return clone(state.branches) as T
    if (normalizedMethod === 'POST' && normalizedPath === '/api/customers') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const customer: CustomerDto = {
          id: nextId('cust'),
          name: asString(data.name) ?? 'New Customer',
          email: asString(data.email) ?? 'customer@demo.local',
          contactNumber: asString(data.contactNumber) ?? '',
          segment: asString(data.segment) ?? 'Mid-Market',
          createdAt: nowIso(),
          lifetimeValue: 0,
          outstandingBalance: 0
        }
        draft.customers.unshift(customer)
        return customer
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/orders') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const customer = draft.customers.find((item) => item.id === asString(data.customerId))
        const lines = Array.isArray(data.lines) ? (data.lines as Array<Record<string, unknown>>) : []
        const orderLines = lines.map((line) => {
          const product = draft.products.find((item) => item.id === asString(line.productId))
          const quantity = asNumber(line.quantity, 1)
          const unitPrice = product?.price ?? 0
          return {
            productId: product?.id ?? nextId('prod'),
            productName: product?.name ?? 'Demo Product',
            quantity,
            unitPrice,
            lineTotal: Number((quantity * unitPrice).toFixed(2))
          }
        })
        const subtotal = Number(orderLines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2))
        const taxAmount = Number((subtotal * 0.18).toFixed(2))
        const order: OrderDto = {
          id: nextId('order'),
          orderNumber: `SO-${Date.now()}`,
          customerId: customer?.id ?? 'cust-demo',
          customerName: customer?.name ?? 'Demo Customer',
          orderDate: nowIso(),
          status: 'Pending',
          lines: orderLines,
          subtotal,
          taxAmount,
          totalAmount: Number((subtotal + taxAmount).toFixed(2)),
          invoiceId: nextId('invoice')
        }
        draft.orders.unshift(order)
        draft.orderMetrics.openOrders += 1
        return order
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/orders/') && normalizedPath.endsWith('/status')) {
      const orderId = normalizedPath.split('/')[3]
      return updateState((draft) => {
        const order = draft.orders.find((item) => item.id === orderId)
        if (!order) notFound(normalizedPath)
        order.status = asString((payload as { status?: string })?.status) ?? order.status
        return order
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/projects') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const project: ProjectDto = {
          id: nextId('project'),
          projectCode: `PRJ-${Date.now()}`,
          name: asString(data.name) ?? 'New Project',
          customerName: asString(data.customerName) ?? 'Demo Customer',
          projectManager: asString(data.projectManager) ?? 'Demo Manager',
          status: 'Planning',
          budget: asNumber(data.budget, 0),
          recognizedRevenue: 0,
          percentComplete: 0,
          startDate: nowIso(),
          dueDate: asString(data.dueDate) ?? addDays(30)
        }
        draft.projects.unshift(project)
        return project
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/projects/') && normalizedPath.endsWith('/status')) {
      const projectId = normalizedPath.split('/')[3]
      return updateState((draft) => {
        const project = draft.projects.find((item) => item.id === projectId)
        if (!project) notFound(normalizedPath)
        project.status = asString((payload as { status?: string })?.status) ?? project.status
        project.percentComplete = asNumber((payload as { percentComplete?: number })?.percentComplete, project.percentComplete)
        return project
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/service-desk/tickets') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const ticket: ServiceTicketDto = {
          id: nextId('ticket'),
          ticketNumber: `TKT-${Date.now()}`,
          customerName: asString(data.customerName) ?? 'Demo Customer',
          subject: asString(data.subject) ?? 'New support case',
          priority: asString(data.priority) ?? 'Medium',
          status: 'New',
          openedAt: nowIso(),
          dueAt: addHours(asNumber(data.dueInHours, 8)),
          assignedTeam: asString(data.assignedTeam) ?? 'Support Desk'
        }
        draft.tickets.unshift(ticket)
        return ticket
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/service-desk/tickets/') && normalizedPath.endsWith('/status')) {
      const ticketId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const ticket = draft.tickets.find((item) => item.id === ticketId)
        if (!ticket) notFound(normalizedPath)
        ticket.status = asString((payload as { status?: string })?.status) ?? ticket.status
        return ticket
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/field-service/jobs') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const job: FieldServiceJobDto = {
          id: nextId('job'),
          jobNumber: `FS-${Date.now()}`,
          serviceTicketId: asString(data.serviceTicketId),
          customerName: asString(data.customerName) ?? 'Demo Customer',
          technicianName: asString(data.technicianName) ?? 'Demo Technician',
          status: 'Scheduled',
          scheduledStart: asString(data.scheduledStart) ?? addHours(2),
          scheduledEnd: asString(data.scheduledEnd) ?? addHours(4),
          offlineSyncEnabled: asBoolean(data.offlineSyncEnabled, true),
          latitude: asNumber(data.latitude, 12.9716),
          longitude: asNumber(data.longitude, 77.5946),
          serviceReport: ''
        }
        draft.fieldServiceJobs.unshift(job)
        return job
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/field-service/jobs/') && normalizedPath.endsWith('/status')) {
      const jobId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const job = draft.fieldServiceJobs.find((item) => item.id === jobId)
        if (!job) notFound(normalizedPath)
        job.status = asString((payload as { status?: string })?.status) ?? job.status
        job.serviceReport = asString((payload as { serviceReport?: string })?.serviceReport) ?? job.serviceReport
        return job
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/plm/lifecycles') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const product = draft.products.find((item) => item.id === asString(data.productId))
        const billOfMaterials = Array.isArray(data.billOfMaterials) ? (data.billOfMaterials as Array<Record<string, unknown>>) : []
        const lifecycle: ProductLifecycleDto = {
          id: nextId('plm'),
          productId: product?.id ?? nextId('prod'),
          productName: product?.name ?? 'Demo Product',
          version: asString(data.version) ?? 'v1.0',
          lifecycleStage: asString(data.lifecycleStage) ?? 'Draft',
          releasedAt: nowIso(),
          billOfMaterials: billOfMaterials.map((line) => {
            const component = draft.products.find((item) => item.id === asString(line.componentProductId))
            return {
              componentProductId: component?.id ?? nextId('comp'),
              componentName: component?.name ?? 'Demo Component',
              quantity: asNumber(line.quantity, 1),
              unitOfMeasure: asString(line.unitOfMeasure) ?? 'EA'
            }
          })
        }
        draft.productLifecycles.unshift(lifecycle)
        return lifecycle
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/plm/changes') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const lifecycle = draft.productLifecycles.find((item) => item.id === asString(data.productLifecycleId))
        const change: ProductChangeDto = {
          id: nextId('change'),
          changeNumber: `ECO-${Date.now()}`,
          productLifecycleId: lifecycle?.id ?? nextId('plm'),
          productName: lifecycle?.productName ?? 'Demo Product',
          title: asString(data.title) ?? 'New engineering change',
          status: 'Submitted',
          requestedBy: asString(data.requestedBy) ?? 'Engineering',
          requestedAt: nowIso(),
          approvedAt: null,
          impactSummary: asString(data.impactSummary) ?? ''
        }
        draft.productChanges.unshift(change)
        return change
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/plm/changes/') && normalizedPath.endsWith('/status')) {
      const changeId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const change = draft.productChanges.find((item) => item.id === changeId)
        if (!change) notFound(normalizedPath)
        change.status = asString((payload as { status?: string })?.status) ?? change.status
        change.approvedAt = change.status.toLowerCase() === 'approved' ? nowIso() : change.approvedAt
        return change
      }) as T
    }
  }

  if (service === 'billing') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/billing/dashboard') return clone(state.billingDashboard) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/billing/executive-dashboard') return clone(state.executiveDashboard) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/billing/alerts') {
      return clone(createBillingAlerts(state, asNumber(readParam(config, 'maxAlerts'), 10))) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/finance/dashboard') return clone(state.financeDashboard) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/finance/payroll') return clone(state.payrollSummary) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/procurement/requisitions') return clone(filterByStatus(state.requisitions, asString(readParam(config, 'status')))) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/procurement/rfqs') return clone(filterByStatus(state.rfqs, asString(readParam(config, 'status')))) as T
    if (normalizedMethod === 'GET' && normalizedPath.startsWith('/api/procurement/rfqs/') && normalizedPath.endsWith('/comparison')) {
      const rfqId = normalizedPath.split('/')[4]
      const comparison = state.vendorComparisons[rfqId]
      if (!comparison) notFound(normalizedPath)
      return clone(comparison) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/procurement/three-way-match') return clone(state.threeWayMatches) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/integration/overview') return clone(state.integrationOverview) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/integration/connections') return clone(state.integrations) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/integration/webhooks') return clone(state.webhooks) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/reporting/snapshot') return clone(state.reportingSnapshot) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/anomalies') {
      return clone(state.anomalies.slice(0, asNumber(readParam(config, 'maxResults'), 10))) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/procurement/requisitions') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const lines = Array.isArray(data.lines) ? (data.lines as Array<Record<string, unknown>>) : []
        const requisition: PurchaseRequisitionDto = {
          id: nextId('req'),
          requisitionNumber: `PR-${Date.now()}`,
          department: asString(data.department) ?? 'Operations',
          requestedBy: asString(data.requestedBy) ?? 'Demo Requester',
          status: 'Submitted',
          requestedAt: nowIso(),
          justification: asString(data.justification) ?? '',
          lines: lines.map((line) => {
            const product = draft.products.find((item) => item.id === asString(line.productId))
            const quantity = asNumber(line.quantity, 1)
            const estimatedUnitCost = asNumber(line.estimatedUnitCost, product?.cost ?? 0)
            return {
              productId: product?.id ?? nextId('prod'),
              productName: product?.name ?? 'Demo Product',
              quantity,
              estimatedUnitCost,
              estimatedLineTotal: Number((quantity * estimatedUnitCost).toFixed(2))
            }
          }),
          estimatedTotal: 0
        }
        requisition.estimatedTotal = Number(requisition.lines.reduce((sum, line) => sum + line.estimatedLineTotal, 0).toFixed(2))
        draft.requisitions.unshift(requisition)
        return requisition
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/procurement/requisitions/') && normalizedPath.endsWith('/status')) {
      const requisitionId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const requisition = draft.requisitions.find((item) => item.id === requisitionId)
        if (!requisition) notFound(normalizedPath)
        requisition.status = asString((payload as { status?: string })?.status) ?? requisition.status
        return requisition
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/procurement/rfqs') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const quotes = Array.isArray(data.supplierQuotes) ? (data.supplierQuotes as Array<Record<string, unknown>>) : []
        const rfq: RequestForQuoteDto = {
          id: nextId('rfq'),
          rfqNumber: `RFQ-${Date.now()}`,
          requisitionId: asString(data.requisitionId),
          title: asString(data.title) ?? 'Demo RFQ',
          status: 'Issued',
          issuedAt: nowIso(),
          responseDueAt: addDays(asNumber(data.responseWindowDays, 5)),
          supplierQuotes: quotes.map((quote) => {
            const supplier = draft.suppliers.find((item) => item.id === asString(quote.supplierId))
            return {
              supplierId: supplier?.id ?? nextId('sup'),
              supplierName: supplier?.name ?? 'Demo Supplier',
              quotedAmount: asNumber(quote.quotedAmount, 0),
              leadTimeDays: asNumber(quote.leadTimeDays, 10),
              score: 85,
              isAwarded: false
            }
          })
        }
        draft.rfqs.unshift(rfq)
        draft.vendorComparisons[rfq.id] = {
          rfqId: rfq.id,
          rfqNumber: rfq.rfqNumber,
          recommendedSupplierName: rfq.supplierQuotes[0]?.supplierName ?? 'Demo Supplier',
          recommendedQuote: rfq.supplierQuotes[0]?.quotedAmount ?? 0,
          recommendedLeadTimeDays: rfq.supplierQuotes[0]?.leadTimeDays ?? 0,
          options: rfq.supplierQuotes
        }
        return rfq
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/integration/connections') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const connection: IntegrationConnectionDto = {
          id: nextId('int'),
          name: asString(data.name) ?? 'Demo Integration',
          type: asString(data.type) ?? 'External',
          provider: asString(data.provider) ?? 'Demo Provider',
          status: 'Healthy',
          endpointUrl: asString(data.endpointUrl) ?? 'https://demo.local/integration',
          lastSyncAt: nowIso(),
          lastSyncResult: 'Success',
          retryCount: 0
        }
        draft.integrations.unshift(connection)
        return connection
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/integration/webhooks') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const webhook: WebhookSubscriptionDto = {
          id: nextId('webhook'),
          name: asString(data.name) ?? 'Demo Webhook',
          topic: asString(data.topic) ?? 'general',
          targetUrl: asString(data.targetUrl) ?? 'https://demo.local/webhook',
          secretReference: asString(data.secretReference) ?? 'kv://demo/webhook',
          isActive: true,
          createdAt: nowIso(),
          lastDeliveredAt: null,
          lastDeliveryStatus: 'Pending'
        }
        draft.webhooks.unshift(webhook)
        return webhook
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/integration/webhooks/') && normalizedPath.endsWith('/deliveries')) {
      const webhookId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const webhook = draft.webhooks.find((item) => item.id === webhookId)
        if (!webhook) notFound(normalizedPath)
        webhook.lastDeliveredAt = nowIso()
        webhook.lastDeliveryStatus = asString((payload as { deliveryStatus?: string })?.deliveryStatus) ?? webhook.lastDeliveryStatus
        return webhook
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/reporting/assistant') {
      const question = asString((payload as { question?: string })?.question) ?? 'What changed?'
      return clone({
        intent: 'BusinessSummary',
        narrative: `Demo insight for "${question}": revenue is steady, collections need one follow-up, and inventory risk is concentrated in kiosks.`,
        metrics: {
          revenueLast30Days: '$7,292.40',
          overdueExposure: '$1,352.30',
          lowStockProducts: '1'
        },
        followUpQuestions: ['Show the overdue invoice details.', 'Which products need replenishment next?', 'What is the procurement exposure?']
      }) as T
    }
  }

  if (service === 'payments') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/payments') return clone(state.payments) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/payments/collection-risk') return clone(state.collectionRisk) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/payments/cash-forecast') {
      return clone(createCashForecast(state, asNumber(readParam(config, 'horizonDays'), 30))) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/payments/anomalies') {
      return clone(state.anomalies.filter((item) => item.domain === 'Payments').slice(0, asNumber(readParam(config, 'maxResults'), 10))) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/payments') {
      return updateState((draft) => {
        const data = payload as Record<string, unknown>
        const invoice = draft.invoices.find((item) => item.id === asString(data.invoiceId))
        if (!invoice) notFound(normalizedPath)
        const amount = asNumber(data.amount, 0)
        const payment: PaymentDto = {
          id: nextId('payment'),
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customerId: invoice.customerId,
          customerName: invoice.customerName,
          paymentDate: nowIso(),
          amount,
          paymentMethod: asString(data.paymentMethod) ?? 'Bank Transfer',
          reference: asString(data.reference) ?? `PAY-${Date.now()}`,
          isRefund: false
        }
        draft.payments.unshift(payment)
        invoice.paidAmount = Number((invoice.paidAmount + amount).toFixed(2))
        invoice.balance = Number(Math.max(0, invoice.totalAmount - invoice.paidAmount).toFixed(2))
        invoice.status = invoice.balance === 0 ? 'Paid' : 'Partially Paid'
        return payment
      }) as T
    }
  }

  if (service === 'invoices') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/invoices') {
      const overdueOnly = asBoolean(readParam(config, 'overdueOnly'))
      return clone(overdueOnly ? state.invoices.filter((item) => item.daysOverdue > 0) : state.invoices) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/invoices/aging') return clone(state.invoiceAging) as T
    if (normalizedMethod === 'GET' && normalizedPath.startsWith('/api/invoices/') && normalizedPath.endsWith('/payments')) {
      const invoiceId = normalizedPath.split('/')[3]
      return clone(state.payments.filter((item) => item.invoiceId === invoiceId)) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath.startsWith('/api/invoices/')) {
      const invoiceId = normalizedPath.split('/')[3]
      const invoice = state.invoices.find((item) => item.id === invoiceId)
      if (!invoice) notFound(normalizedPath)
      return clone(invoice) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/invoices/document-extraction') {
      const data = payload as Record<string, unknown>
      return clone({
        documentType: asString(data.documentType) ?? 'Invoice',
        confidencePercent: 97,
        fields: {
          supplier: 'Demo Supplier',
          invoiceNumber: 'INV-DEMO-1001',
          totalAmount: '2450.00'
        },
        warnings: []
      }) as T
    }
  }

  if (service === 'platform') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/context') return clone(createPlatformContext()) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/organization-overview') return clone(state.organizationOverview) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/operations-summary') return clone(state.operationsSummary) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/audit') return clone(state.auditTrail.slice(0, asNumber(readParam(config, 'take'), 50))) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/notifications') {
      const unreadOnly = asBoolean(readParam(config, 'unreadOnly'))
      return clone(unreadOnly ? state.notifications.filter((item) => !item.isRead) : state.notifications) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/outbox') {
      const status = asString(readParam(config, 'status'))
      const take = asNumber(readParam(config, 'take'), 50)
      return clone(filterByStatus(state.outbox, status).slice(0, take)) as T
    }
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/ai/readiness') return clone(state.aiReadiness) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/industry-profiles') return clone(state.industryProfiles) as T
    if (normalizedMethod === 'GET' && normalizedPath === '/api/platform/workflow-templates') {
      const industryCode = asString(readParam(config, 'industryCode'))
      return clone(industryCode ? state.workflowTemplates.filter((item) => item.industryCode === industryCode) : state.workflowTemplates) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath === '/api/platform/industry-profiles/activate') {
      return updateState((draft) => {
        const industryCode = asString((payload as { industryCode?: string })?.industryCode)
        if (!industryCode) notFound(normalizedPath)
        draft.industryProfiles.forEach((item) => {
          item.isActive = item.industryCode === industryCode
        })
        return draft.industryProfiles.find((item) => item.industryCode === industryCode) ?? draft.industryProfiles[0]
      }) as T
    }
    if (normalizedMethod === 'POST' && normalizedPath.startsWith('/api/platform/notifications/') && normalizedPath.endsWith('/ack')) {
      const notificationId = normalizedPath.split('/')[4]
      return updateState((draft) => {
        const notification = draft.notifications.find((item) => item.id === notificationId)
        if (notification) {
          notification.isRead = true
        }
        return undefined
      }) as T
    }
  }

  if (service === 'auth') {
    if (normalizedMethod === 'GET' && normalizedPath === '/api/auth/me') {
      return clone(demoAccounts[0].user) as T
    }
  }

  notFound(`${service}:${normalizedPath}`)
}
