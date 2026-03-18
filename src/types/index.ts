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
  label: string
  path: string
  description: string
  icon: 'dashboard' | 'access' | 'tenant' | 'orders' | 'products' | 'finance' | 'reports' | 'settings'
  roles?: UserRole[]
  permissions?: Permission[]
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
