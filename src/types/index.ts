import type { ReactNode } from 'react'

export type AppEnvironment = 'development' | 'staging' | 'production'
export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export type UserRole =
  | 'Admin'
  | 'CatalogManager'
  | 'InventoryManager'
  | 'ProcurementManager'
  | 'SalesManager'
  | 'FinanceManager'
  | 'HRManager'
  | 'ProjectManager'
  | 'AssetManager'
  | 'SupportLead'
  | 'ManufacturingPlanner'
  | 'UserAdministrator'

export type Permission =
  | 'CanManageUsers'
  | 'CanViewFinance'
  | 'CanApprovePurchase'
  | 'CanManageInventory'
  | 'CanRunPayroll'

export interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data: T
  meta?: Record<string, unknown>
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: string[]
}

export interface AuthUser {
  userId: string
  userName: string
  email: string | null
  tenantId: string
  roles: UserRole[]
  permissions: Permission[]
  isDemoUser: boolean
  isActive: boolean
}

export interface AuthState {
  token: string | null
  refreshToken: string | null
  expiresAtUtc: string | null
  user: AuthUser | null
  status: 'idle' | 'loading' | 'authenticated'
}

export interface LoginPayload {
  userNameOrEmail: string
  password: string
  deviceId?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAtUtc: string
  user: AuthUser
}

export interface ToastMessage {
  id: string
  title: string
  message: string
  tone: ToastTone
}

export interface ChartDatum {
  label: string
  value: number
}

export interface TrendDatum {
  label: string
  value: number
  secondaryValue?: number
}

export interface NavigationItem {
  key: string
  group: 'Operate' | 'Govern'
  label: string
  path: string
  description: string
  icon: 'dashboard' | 'access' | 'tenant' | 'orders' | 'products' | 'finance' | 'reports' | 'settings' | 'platform'
  roles?: UserRole[]
  permissions?: Permission[]
}

export interface ServiceHealthDto {
  id: string
  service: string
  area: string
  status: 'online' | 'degraded' | 'offline'
  statusLabel: string
  baseUrl: string
  checkedAt: string
  detail: string
  pendingOutboxMessages?: number
  tenants?: number
}

export interface DataTableColumn<T> {
  key: string
  title: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  render?: (row: T) => ReactNode
}

export interface ReferenceValueDto {
  id: string
  name: string
}

export interface SupplierReferenceDto {
  id: string
  name: string
  contactName: string
  email: string
  leadTimeDays: number
}

export interface CatalogReferenceDataDto {
  categories: ReferenceValueDto[]
  suppliers: SupplierReferenceDto[]
}

export interface CategorySummaryDto {
  id: string
  name: string
  productCount: number
  activeProductsCount: number
  lowStockProducts: number
}

export interface SupplierDto {
  id: string
  name: string
  contactName: string
  email: string
  leadTimeDays: number
  productCount: number
  openPurchaseOrders: number
  onTimeDeliveryScore: number
  fulfillmentRiskScore: number
}

export interface CatalogOverviewDto {
  activeProducts: number
  categories: number
  suppliers: number
  lowStockProducts: number
  averageGrossMarginPercent: number
  inventoryValue: number
}

export interface ProductDto {
  id: string
  sku: string
  name: string
  description: string
  category: string
  supplier: string
  price: number
  cost: number
  stockQuantity: number
  reorderLevel: number
  marginPercent: number
  isLowStock: boolean
  isActive: boolean
}

export interface InventoryItemDto {
  productId: string
  sku: string
  productName: string
  supplier: string
  stockQuantity: number
  reorderLevel: number
  availableCoverDays: number
  inventoryValue: number
  isLowStock: boolean
}

export interface InventoryDashboardDto {
  totalProducts: number
  totalUnitsOnHand: number
  lowStockProducts: number
  inventoryValue: number
  atRiskRevenue: number
}

export interface ReorderRecommendationDto {
  productId: string
  productName: string
  currentStock: number
  reorderLevel: number
  forecastedLeadTimeDemand: number
  recommendedOrderQuantity: number
  urgency: string
}

export interface DemandForecastDto {
  productId: string
  productName: string
  horizonDays: number
  forecastUnits: number
  trendDirection: string
  confidencePercent: number
}

export interface PurchaseOrderLineDto {
  productId: string
  productName: string
  quantity: number
  unitCost: number
  lineTotal: number
}

export interface PurchaseOrderDto {
  id: string
  purchaseOrderNumber: string
  supplierId: string
  supplierName: string
  createdAt: string
  expectedDeliveryDate: string
  receivedAt: string | null
  status: string
  lines: PurchaseOrderLineDto[]
  totalCost: number
  notes: string
}

export interface ProcurementDashboardDto {
  openPurchaseOrders: number
  pendingReceipts: number
  committedSpend: number
  inboundStockValue: number
  urgentReorders: number
  averageSupplierLeadTimeDays: number
}

export interface AssetDto {
  id: string
  assetTag: string
  name: string
  category: string
  status: string
  lastServicedAt: string | null
  nextServiceDueAt: string
  criticality: number
  conditionScore: number
  maintenanceRiskScore: number
}

export interface MaintenanceForecastDto {
  assetId: string
  assetTag: string
  assetName: string
  nextServiceDueAt: string
  maintenanceRiskScore: number
  recommendedAction: string
}

export interface WorkOrderDto {
  id: string
  workOrderNumber: string
  productName: string
  workCenter: string
  status: string
  scheduledStart: string
  expectedCompletion: string
  quantity: number
  producedQuantity: number
}

export interface CompanyDto {
  id: string
  companyCode: string
  name: string
  baseCurrency: string
  taxRegistrationNumber: string
}

export interface BranchDto {
  id: string
  branchCode: string
  companyCode: string
  name: string
  city: string
  timeZone: string
}

export interface WarehouseStockDto {
  productId: string
  productName: string
  quantityOnHand: number
  quantityReserved: number
  defaultBin: string | null
  batchNumber: string | null
  serialNumber: string | null
}

export interface WarehouseDto {
  id: string
  warehouseCode: string
  name: string
  branchCode: string
  type: string
  isPrimary: boolean
  stock: WarehouseStockDto[]
}

export interface StockTransferDto {
  id: string
  transferNumber: string
  fromWarehouseCode: string
  toWarehouseCode: string
  productId: string
  productName: string
  quantity: number
  status: string
  requestedAt: string
  completedAt: string | null
  reason: string
}

export interface ShipmentDto {
  id: string
  shipmentNumber: string
  direction: string
  status: string
  carrier: string
  trackingNumber: string
  originWarehouseCode: string
  destinationName: string
  salesOrderId: string | null
  purchaseOrderId: string | null
  scheduledShipDate: string
  deliveredAt: string | null
}

export interface FixedAssetDto {
  id: string
  assetNumber: string
  name: string
  assetClass: string
  status: string
  companyCode: string
  branchCode: string
  capitalizedOn: string
  acquisitionCost: number
  salvageValue: number
  residualValue: number
  accumulatedDepreciation: number
  depreciationMethod: string
  usefulLifeMonths: number
  depreciationRate: number
  revaluationAmount: number
  ownerDepartment: string
  currentLocation: string
  lastDepreciatedOn: string
  operationalAssetId: string | null
}

export interface FixedAssetComplianceReportDto {
  totalAssets: number
  grossBookValue: number
  netBookValue: number
  accumulatedDepreciation: number
  assetsPendingDepreciation: number
  complianceWarnings: string[]
}

export interface CustomerDto {
  id: string
  name: string
  email: string
  contactNumber: string
  segment: string
  createdAt: string
  lifetimeValue: number
  outstandingBalance: number
}

export interface CustomerIntelligenceDto {
  customerId: string
  customerName: string
  lifetimeValue: number
  averageOrderValue: number
  lastOrderDate: string | null
  ordersCount: number
  churnRiskScore: number
  expansionScore: number
  outstandingBalance: number
  nextBestAction: string
}

export interface OrderLineDto {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface OrderDto {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  orderDate: string
  status: string
  lines: OrderLineDto[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  invoiceId: string
}

export interface OrderMetricsDto {
  openOrders: number
  completedOrders: number
  revenueLast30Days: number
  averageOrderValue: number
  lowStockBlockers: number
}

export interface ProjectDto {
  id: string
  projectCode: string
  name: string
  customerName: string
  projectManager: string
  status: string
  budget: number
  recognizedRevenue: number
  percentComplete: number
  startDate: string
  dueDate: string
}

export interface ServiceTicketDto {
  id: string
  ticketNumber: string
  customerName: string
  subject: string
  priority: string
  status: string
  openedAt: string
  dueAt: string
  assignedTeam: string
}

export interface FieldServiceJobDto {
  id: string
  jobNumber: string
  serviceTicketId: string | null
  customerName: string
  technicianName: string
  status: string
  scheduledStart: string
  scheduledEnd: string
  offlineSyncEnabled: boolean
  latitude: number
  longitude: number
  serviceReport: string
}

export interface AlertDto {
  severity: string
  area: string
  message: string
  referenceType: string
  referenceId: string | null
}

export interface ExecutiveDashboardDto {
  inventoryValue: number
  lowStockProducts: number
  openOrders: number
  revenueLast30Days: number
  outstandingBalance: number
  overdueInvoices: number
  highRiskCollections: number
  collectionEfficiencyPercent: number
  atRiskRevenue: number
}

export interface FinanceDashboardDto {
  cashCollectedLast30Days: number
  outstandingReceivables: number
  overdueReceivables: number
  monthlyPayrollRunRate: number
  assetMaintenanceReserve: number
  workingCapitalIndicator: number
  narrative: string
}

export interface PayrollSummaryDto {
  activeEmployees: number
  monthlyGrossPayroll: number
  averageMonthlySalary: number
  nextPayrollDate: string
  pendingPayrollApprovals: number
  status: string
}

export interface PurchaseRequisitionLineDto {
  productId: string
  productName: string
  quantity: number
  estimatedUnitCost: number
  estimatedLineTotal: number
}

export interface PurchaseRequisitionDto {
  id: string
  requisitionNumber: string
  department: string
  requestedBy: string
  status: string
  requestedAt: string
  justification: string
  lines: PurchaseRequisitionLineDto[]
  estimatedTotal: number
}

export interface RfqSupplierQuoteDto {
  supplierId: string
  supplierName: string
  quotedAmount: number
  leadTimeDays: number
  score: number
  isAwarded: boolean
}

export interface RequestForQuoteDto {
  id: string
  rfqNumber: string
  requisitionId: string | null
  title: string
  status: string
  issuedAt: string
  responseDueAt: string
  supplierQuotes: RfqSupplierQuoteDto[]
}

export interface VendorComparisonDto {
  rfqId: string
  rfqNumber: string
  recommendedSupplierName: string
  recommendedQuote: number
  recommendedLeadTimeDays: number
  options: RfqSupplierQuoteDto[]
}

export interface ThreeWayMatchDto {
  purchaseOrderId: string
  purchaseOrderNumber: string
  supplierName: string
  purchaseOrderTotal: number
  receivedValue: number
  invoiceValue: number
  matchStatus: string
  variance: number
}

export interface ReportingSnapshotDto {
  revenueLast30Days: number
  collectionsLast30Days: number
  inventoryValue: number
  outstandingBalance: number
  openProjects: number
  openTickets: number
  openWorkOrders: number
  monthlyPayrollRunRate: number
  predictedMaintenanceExposure: number
}

export interface NaturalLanguageQueryResultDto {
  intent: string
  narrative: string
  metrics: Record<string, string>
  followUpQuestions: string[]
}

export interface DocumentExtractionResultDto {
  documentType: string
  confidencePercent: number
  fields: Record<string, string>
  warnings: string[]
}

export interface AnomalyDetectionDto {
  domain: string
  severity: string
  title: string
  narrative: string
  score: number
  referenceType: string
  referenceId: string | null
}

export interface InvoiceDto {
  id: string
  invoiceNumber: string
  salesOrderId: string
  orderNumber: string
  customerId: string
  customerName: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  balance: number
  status: string
  paymentMethod: string
  daysOverdue: number
}

export interface BillingDashboardDto {
  totalInvoiced: number
  collectedAmount: number
  outstandingBalance: number
  overdueBalance: number
  overdueInvoices: number
  collectionEfficiencyPercent: number
}

export interface InvoiceAgingBucketDto {
  label: string
  amount: number
}

export interface InvoiceAgingReportDto {
  buckets: InvoiceAgingBucketDto[]
  overdueInvoices: number
  totalOverdue: number
}

export interface PaymentDto {
  id: string
  invoiceId: string
  invoiceNumber: string
  customerId: string
  customerName: string
  paymentDate: string
  amount: number
  paymentMethod: string
  reference: string
  isRefund: boolean
}

export interface CollectionRiskItemDto {
  invoiceId: string
  invoiceNumber: string
  customerName: string
  balance: number
  daysOverdue: number
  riskScore: number
  riskBand: string
}

export interface CollectionRiskReportDto {
  items: CollectionRiskItemDto[]
  totalExposure: number
}

export interface CashFlowForecastDto {
  horizonDays: number
  openReceivables: number
  expectedCollections: number
  overdueExposure: number
  highRiskInvoices: number
  confidencePercent: number
  narrative: string
}

export interface PlatformContextDto {
  tenantId: string
  userId: string
  userName: string
  roles: UserRole[]
  correlationId: string
}

export interface OrganizationOverviewDto {
  tenantId: string
  activeProducts: number
  lowStockProducts: number
  openOrders: number
  overdueInvoices: number
  openProjects: number
  openTickets: number
  openWorkOrders: number
  inventoryValue: number
  outstandingBalance: number
  unreadNotifications: number
}

export interface PlatformOperationsSummaryDto {
  tenantId: string
  correlationId: string
  pendingOutboxMessages: number
  deadLetteredOutboxMessages: number
  unreadNotifications: number
  recentAuditEntries: number
  usesDurableDatabase: boolean
}

export interface IndustryProfileDto {
  industryCode: string
  name: string
  description: string
  enabledModules: string[]
  workflowTemplates: string[]
  reportingFocus: string[]
  isActive: boolean
}

export interface WorkflowTemplateDto {
  id: string
  templateCode: string
  name: string
  industryCode: string
  department: string
  slaHours: number
  isDefault: boolean
  stages: string[]
  triggers: string[]
}

export interface DemoStatusDto {
  isEnabled: boolean
  isDemoTenant: boolean
  isDemoUser: boolean
  canReset: boolean
  demoTenantId: string
  currentTenantId: string | null
}

export interface AuditTrailEntryDto {
  id: string
  occurredAt: string
  tenantId: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string | null
  outcome: string
  details: string
  correlationId: string
}

export interface NotificationDto {
  id: string
  createdAt: string
  type: string
  title: string
  message: string
  severity: string
  isRead: boolean
  referenceType: string
  referenceId: string | null
}

export interface OutboxMessageDto {
  id: string
  occurredAt: string
  topic: string
  eventType: string
  aggregateType: string
  aggregateId: string | null
  status: string
  attemptCount: number
  payload: string
}

export interface AiUseCaseDto {
  name: string
  enabled: boolean
  dataSource: string
  integrationPattern: string
}

export interface AiReadinessDto {
  provider: string
  aiEnabled: boolean
  useBackgroundPredictions: boolean
  structuredBusinessEventsEnabled: boolean
  useCases: AiUseCaseDto[]
}

export interface BillOfMaterialLineDto {
  componentProductId: string
  componentName: string
  quantity: number
  unitOfMeasure: string
}

export interface ProductLifecycleDto {
  id: string
  productId: string
  productName: string
  version: string
  lifecycleStage: string
  releasedAt: string
  billOfMaterials: BillOfMaterialLineDto[]
}

export interface ProductChangeDto {
  id: string
  changeNumber: string
  productLifecycleId: string
  productName: string
  title: string
  status: string
  requestedBy: string
  requestedAt: string
  approvedAt: string | null
  impactSummary: string
}

export interface IntegrationConnectionDto {
  id: string
  name: string
  type: string
  provider: string
  status: string
  endpointUrl: string
  lastSyncAt: string
  lastSyncResult: string
  retryCount: number
}

export interface WebhookSubscriptionDto {
  id: string
  name: string
  topic: string
  targetUrl: string
  secretReference: string
  isActive: boolean
  createdAt: string
  lastDeliveredAt: string | null
  lastDeliveryStatus: string
}

export interface IntegrationOverviewDto {
  activeConnections: number
  activeWebhooks: number
  failedSyncs: number
  supportedConnectors: string[]
}

export interface AccessControlSummaryDto {
  tenantId: string
  roles: UserRole[]
  permissions: Permission[]
  companies: CompanyDto[]
  branches: BranchDto[]
}

export interface DashboardBundle {
  catalogOverview: CatalogOverviewDto | null
  inventoryDashboard: InventoryDashboardDto | null
  orderMetrics: OrderMetricsDto | null
  executiveDashboard: ExecutiveDashboardDto | null
  financeDashboard: FinanceDashboardDto | null
  notifications: NotificationDto[]
  alerts: AlertDto[]
  anomalies: AnomalyDetectionDto[]
  topCustomers: CustomerDto[]
  aiReadiness: AiReadinessDto | null
}
