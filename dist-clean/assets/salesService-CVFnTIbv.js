import { k as requestGet, l as requestPost } from "./index-CbdSSOK5.js";
const salesService = {
  getCustomers(segment) {
    return requestGet("sales", "/api/customers/", {
      params: { segment: segment || void 0 }
    });
  },
  getCustomer(id) {
    return requestGet("sales", `/api/customers/${id}`);
  },
  createCustomer(payload) {
    return requestPost("sales", "/api/customers/", payload);
  },
  getCustomerIntelligence(id) {
    return requestGet("sales", `/api/customers/${id}/intelligence`);
  },
  getOrders(status) {
    return requestGet("sales", "/api/orders/", {
      params: { status: status || void 0 }
    });
  },
  getOrder(id) {
    return requestGet("sales", `/api/orders/${id}`);
  },
  getOrderMetrics() {
    return requestGet("sales", "/api/orders/metrics");
  },
  createOrder(payload) {
    return requestPost("sales", "/api/orders/", payload);
  },
  updateOrderStatus(id, payload) {
    return requestPost("sales", `/api/orders/${id}/status`, payload);
  },
  getProjects(status) {
    return requestGet("sales", "/api/projects/", {
      params: { status: status || void 0 }
    });
  },
  createProject(payload) {
    return requestPost("sales", "/api/projects/", payload);
  },
  updateProjectStatus(id, payload) {
    return requestPost("sales", `/api/projects/${id}/status`, payload);
  },
  getTickets(status) {
    return requestGet("sales", "/api/service-desk/tickets", {
      params: { status: status || void 0 }
    });
  },
  createTicket(payload) {
    return requestPost("sales", "/api/service-desk/tickets", payload);
  },
  updateTicketStatus(id, payload) {
    return requestPost("sales", `/api/service-desk/tickets/${id}/status`, payload);
  },
  getFieldServiceJobs(status) {
    return requestGet("sales", "/api/field-service/jobs", {
      params: { status: status || void 0 }
    });
  },
  createFieldServiceJob(payload) {
    return requestPost("sales", "/api/field-service/jobs", payload);
  },
  updateFieldServiceJob(id, payload) {
    return requestPost("sales", `/api/field-service/jobs/${id}/status`, payload);
  },
  getProductLifecycles(productId) {
    return requestGet("sales", "/api/plm/lifecycles", {
      params: { productId: productId || void 0 }
    });
  },
  createProductLifecycle(payload) {
    return requestPost("sales", "/api/plm/lifecycles", payload);
  },
  getProductChanges(status) {
    return requestGet("sales", "/api/plm/changes", {
      params: { status: status || void 0 }
    });
  },
  createProductChange(payload) {
    return requestPost("sales", "/api/plm/changes", payload);
  },
  updateProductChangeStatus(id, payload) {
    return requestPost("sales", `/api/plm/changes/${id}/status`, payload);
  },
  getAccessControlSummary() {
    return requestGet("sales", "/api/access-control/summary");
  },
  getCompanies() {
    return requestGet("sales", "/api/access-control/companies");
  },
  getBranches() {
    return requestGet("sales", "/api/access-control/branches");
  }
};
export {
  salesService as s
};
