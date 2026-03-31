import type {
  AlertDto,
  AnomalyDetectionDto,
  BillingDashboardDto,
  CashFlowForecastDto,
  CollectionRiskReportDto,
  DocumentExtractionResultDto,
  ExecutiveDashboardDto,
  FinanceDashboardDto,
  InvoiceAgingReportDto,
  InvoiceDto,
  IntegrationConnectionDto,
  IntegrationOverviewDto,
  NaturalLanguageQueryResultDto,
  PaymentDto,
  PayrollSummaryDto,
  PurchaseRequisitionDto,
  RequestForQuoteDto,
  ReportingSnapshotDto,
  ThreeWayMatchDto,
  VendorComparisonDto,
  WebhookSubscriptionDto
} from '../types'
import { requestGet, requestPost } from './apiClient'

export interface PaymentCreatePayload {
  invoiceId: string
  amount: number
  paymentMethod: string
  reference: string
}

export interface NaturalLanguageQueryPayload {
  question: string
}

export interface DocumentExtractionPayload {
  documentType: string
  content: string
}

export interface PurchaseRequisitionCreatePayload {
  department: string
  requestedBy: string
  justification: string
  lines: Array<{ productId: string; quantity: number; estimatedUnitCost: number }>
}

export interface PurchaseRequisitionApprovalPayload {
  status: string
}

export interface RequestForQuoteCreatePayload {
  requisitionId?: string
  title: string
  responseWindowDays: number
  supplierQuotes: Array<{ supplierId: string; quotedAmount: number; leadTimeDays: number }>
}

export interface IntegrationConnectionCreatePayload {
  name: string
  type: string
  provider: string
  endpointUrl: string
}

export interface WebhookSubscriptionCreatePayload {
  name: string
  topic: string
  targetUrl: string
  secretReference: string
}

export interface WebhookDeliveryPayload {
  deliveryStatus: string
}

export const financeService = {
  getBillingDashboard() {
    return requestGet<BillingDashboardDto>('billing', '/api/billing/dashboard')
  },
  getExecutiveDashboard() {
    return requestGet<ExecutiveDashboardDto>('billing', '/api/billing/executive-dashboard')
  },
  getBillingAlerts(maxAlerts = 10) {
    return requestGet<AlertDto[]>('billing', '/api/billing/alerts', {
      params: { maxAlerts }
    })
  },
  getFinanceDashboard() {
    return requestGet<FinanceDashboardDto>('billing', '/api/finance/dashboard')
  },
  getPayrollSummary() {
    return requestGet<PayrollSummaryDto>('billing', '/api/finance/payroll')
  },
  getPurchaseRequisitions(status?: string) {
    return requestGet<PurchaseRequisitionDto[]>('billing', '/api/procurement/requisitions', {
      params: { status: status || undefined }
    })
  },
  createPurchaseRequisition(payload: PurchaseRequisitionCreatePayload) {
    return requestPost<PurchaseRequisitionDto, PurchaseRequisitionCreatePayload>('billing', '/api/procurement/requisitions', payload)
  },
  updatePurchaseRequisitionStatus(id: string, payload: PurchaseRequisitionApprovalPayload) {
    return requestPost<PurchaseRequisitionDto, PurchaseRequisitionApprovalPayload>('billing', `/api/procurement/requisitions/${id}/status`, payload)
  },
  getRequestForQuotes(status?: string) {
    return requestGet<RequestForQuoteDto[]>('billing', '/api/procurement/rfqs', {
      params: { status: status || undefined }
    })
  },
  createRequestForQuote(payload: RequestForQuoteCreatePayload) {
    return requestPost<RequestForQuoteDto, RequestForQuoteCreatePayload>('billing', '/api/procurement/rfqs', payload)
  },
  getVendorComparison(id: string) {
    return requestGet<VendorComparisonDto>('billing', `/api/procurement/rfqs/${id}/comparison`)
  },
  getThreeWayMatches() {
    return requestGet<ThreeWayMatchDto[]>('billing', '/api/procurement/three-way-match')
  },
  getIntegrationOverview() {
    return requestGet<IntegrationOverviewDto>('billing', '/api/integration/overview')
  },
  getIntegrationConnections() {
    return requestGet<IntegrationConnectionDto[]>('billing', '/api/integration/connections')
  },
  createIntegrationConnection(payload: IntegrationConnectionCreatePayload) {
    return requestPost<IntegrationConnectionDto, IntegrationConnectionCreatePayload>('billing', '/api/integration/connections', payload)
  },
  getWebhookSubscriptions() {
    return requestGet<WebhookSubscriptionDto[]>('billing', '/api/integration/webhooks')
  },
  createWebhookSubscription(payload: WebhookSubscriptionCreatePayload) {
    return requestPost<WebhookSubscriptionDto, WebhookSubscriptionCreatePayload>('billing', '/api/integration/webhooks', payload)
  },
  recordWebhookDelivery(id: string, payload: WebhookDeliveryPayload) {
    return requestPost<WebhookSubscriptionDto, WebhookDeliveryPayload>('billing', `/api/integration/webhooks/${id}/deliveries`, payload)
  },
  getReportingSnapshot() {
    return requestGet<ReportingSnapshotDto>('billing', '/api/reporting/snapshot')
  },
  askReportingAssistant(payload: NaturalLanguageQueryPayload) {
    return requestPost<NaturalLanguageQueryResultDto, NaturalLanguageQueryPayload>('billing', '/api/reporting/assistant', payload)
  },
  getFinanceAnomalies(maxResults = 10) {
    return requestGet<AnomalyDetectionDto[]>('billing', '/api/anomalies', {
      params: { maxResults }
    })
  },
  getPayments() {
    return requestGet<PaymentDto[]>('payments', '/api/payments/')
  },
  getCollectionRisk() {
    return requestGet<CollectionRiskReportDto>('payments', '/api/payments/collection-risk')
  },
  getCashForecast(horizonDays = 30) {
    return requestGet<CashFlowForecastDto>('payments', '/api/payments/cash-forecast', {
      params: { horizonDays }
    })
  },
  createPayment(payload: PaymentCreatePayload) {
    return requestPost<PaymentDto, PaymentCreatePayload>('payments', '/api/payments/', payload)
  },
  getPaymentAnomalies(maxResults = 10) {
    return requestGet<AnomalyDetectionDto[]>('payments', '/api/payments/anomalies', {
      params: { maxResults }
    })
  },
  getInvoices(overdueOnly = false) {
    return requestGet<InvoiceDto[]>('invoices', '/api/invoices', {
      params: { overdueOnly: overdueOnly || undefined }
    })
  },
  getInvoice(id: string) {
    return requestGet<InvoiceDto>('invoices', `/api/invoices/${id}`)
  },
  getInvoicePayments(id: string) {
    return requestGet<PaymentDto[]>('invoices', `/api/invoices/${id}/payments`)
  },
  getInvoiceAging() {
    return requestGet<InvoiceAgingReportDto>('invoices', '/api/invoices/aging')
  },
  extractDocument(payload: DocumentExtractionPayload) {
    return requestPost<DocumentExtractionResultDto, DocumentExtractionPayload>('invoices', '/api/invoices/document-extraction', payload)
  }
}
