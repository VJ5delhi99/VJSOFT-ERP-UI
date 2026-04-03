import { l as requestPost, k as requestGet } from "./index-CbdSSOK5.js";
const financeService = {
  getBillingDashboard() {
    return requestGet("billing", "/api/billing/dashboard");
  },
  getExecutiveDashboard() {
    return requestGet("billing", "/api/billing/executive-dashboard");
  },
  getBillingAlerts(maxAlerts = 10) {
    return requestGet("billing", "/api/billing/alerts", {
      params: { maxAlerts }
    });
  },
  getFinanceDashboard() {
    return requestGet("billing", "/api/finance/dashboard");
  },
  getPayrollSummary() {
    return requestGet("billing", "/api/finance/payroll");
  },
  getPurchaseRequisitions(status) {
    return requestGet("billing", "/api/procurement/requisitions", {
      params: { status: status || void 0 }
    });
  },
  createPurchaseRequisition(payload) {
    return requestPost("billing", "/api/procurement/requisitions", payload);
  },
  updatePurchaseRequisitionStatus(id, payload) {
    return requestPost("billing", `/api/procurement/requisitions/${id}/status`, payload);
  },
  getRequestForQuotes(status) {
    return requestGet("billing", "/api/procurement/rfqs", {
      params: { status: status || void 0 }
    });
  },
  createRequestForQuote(payload) {
    return requestPost("billing", "/api/procurement/rfqs", payload);
  },
  getVendorComparison(id) {
    return requestGet("billing", `/api/procurement/rfqs/${id}/comparison`);
  },
  getThreeWayMatches() {
    return requestGet("billing", "/api/procurement/three-way-match");
  },
  getIntegrationOverview() {
    return requestGet("billing", "/api/integration/overview");
  },
  getIntegrationConnections() {
    return requestGet("billing", "/api/integration/connections");
  },
  createIntegrationConnection(payload) {
    return requestPost("billing", "/api/integration/connections", payload);
  },
  getWebhookSubscriptions() {
    return requestGet("billing", "/api/integration/webhooks");
  },
  createWebhookSubscription(payload) {
    return requestPost("billing", "/api/integration/webhooks", payload);
  },
  recordWebhookDelivery(id, payload) {
    return requestPost("billing", `/api/integration/webhooks/${id}/deliveries`, payload);
  },
  getReportingSnapshot() {
    return requestGet("billing", "/api/reporting/snapshot");
  },
  askReportingAssistant(payload) {
    return requestPost("billing", "/api/reporting/assistant", payload);
  },
  getFinanceAnomalies(maxResults = 10) {
    return requestGet("billing", "/api/anomalies", {
      params: { maxResults }
    });
  },
  getPayments() {
    return requestGet("payments", "/api/payments/");
  },
  getCollectionRisk() {
    return requestGet("payments", "/api/payments/collection-risk");
  },
  getCashForecast(horizonDays = 30) {
    return requestGet("payments", "/api/payments/cash-forecast", {
      params: { horizonDays }
    });
  },
  createPayment(payload) {
    return requestPost("payments", "/api/payments/", payload);
  },
  getPaymentAnomalies(maxResults = 10) {
    return requestGet("payments", "/api/payments/anomalies", {
      params: { maxResults }
    });
  },
  getInvoices(overdueOnly = false) {
    return requestGet("invoices", "/api/invoices", {
      params: { overdueOnly: overdueOnly || void 0 }
    });
  },
  getInvoice(id) {
    return requestGet("invoices", `/api/invoices/${id}`);
  },
  getInvoicePayments(id) {
    return requestGet("invoices", `/api/invoices/${id}/payments`);
  },
  getInvoiceAging() {
    return requestGet("invoices", "/api/invoices/aging");
  },
  extractDocument(payload) {
    return requestPost("invoices", "/api/invoices/document-extraction", payload);
  }
};
export {
  financeService as f
};
