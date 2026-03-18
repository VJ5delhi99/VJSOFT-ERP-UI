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
  NaturalLanguageQueryResultDto,
  PaymentDto,
  PayrollSummaryDto,
  ReportingSnapshotDto
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
