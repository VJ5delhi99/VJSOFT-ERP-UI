import { n as requestDelete, o as requestPut, l as requestPost, k as requestGet } from "./index-CbdSSOK5.js";
const catalogService = {
  getOverview() {
    return requestGet("catalog", "/api/catalog/overview");
  },
  getReferenceData() {
    return requestGet("catalog", "/api/catalog/reference-data");
  },
  getCategories() {
    return requestGet("catalog", "/api/categories");
  },
  createCategory(payload) {
    return requestPost("catalog", "/api/categories", payload);
  },
  updateCategory(id, payload) {
    return requestPut("catalog", `/api/categories/${id}`, payload);
  },
  getSuppliers() {
    return requestGet("catalog", "/api/suppliers");
  },
  createSupplier(payload) {
    return requestPost("catalog", "/api/suppliers", payload);
  },
  updateSupplier(id, payload) {
    return requestPut("catalog", `/api/suppliers/${id}`, payload);
  },
  getProducts(search, includeInactive = false) {
    return requestGet("catalog", "/api/products", {
      params: {
        search: search || void 0,
        includeInactive
      }
    });
  },
  getProduct(id) {
    return requestGet("catalog", `/api/products/${id}`);
  },
  createProduct(payload) {
    return requestPost("catalog", "/api/products", payload);
  },
  updateProduct(id, payload) {
    return requestPut("catalog", `/api/products/${id}`, payload);
  },
  removeProduct(id) {
    return requestDelete("catalog", `/api/products/${id}`);
  }
};
export {
  catalogService as c
};
