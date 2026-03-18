import type { CatalogOverviewDto, CatalogReferenceDataDto, CategorySummaryDto, ProductDto, SupplierDto } from '../types'
import { requestDelete, requestGet, requestPost, requestPut } from './apiClient'

export interface CategoryUpsertPayload {
  name: string
}

export interface SupplierUpsertPayload {
  name: string
  contactName: string
  email: string
  leadTimeDays: number
}

export interface ProductUpsertPayload {
  name: string
  description: string
  categoryName: string
  supplierName: string
  price: number
  cost: number
  stockQuantity: number
  reorderLevel: number
  isActive: boolean
}

export const catalogService = {
  getOverview() {
    return requestGet<CatalogOverviewDto>('catalog', '/api/catalog/overview')
  },
  getReferenceData() {
    return requestGet<CatalogReferenceDataDto>('catalog', '/api/catalog/reference-data')
  },
  getCategories() {
    return requestGet<CategorySummaryDto[]>('catalog', '/api/categories')
  },
  createCategory(payload: CategoryUpsertPayload) {
    return requestPost<CategorySummaryDto, CategoryUpsertPayload>('catalog', '/api/categories', payload)
  },
  updateCategory(id: string, payload: CategoryUpsertPayload) {
    return requestPut<CategorySummaryDto, CategoryUpsertPayload>('catalog', `/api/categories/${id}`, payload)
  },
  getSuppliers() {
    return requestGet<SupplierDto[]>('catalog', '/api/suppliers')
  },
  createSupplier(payload: SupplierUpsertPayload) {
    return requestPost<SupplierDto, SupplierUpsertPayload>('catalog', '/api/suppliers', payload)
  },
  updateSupplier(id: string, payload: SupplierUpsertPayload) {
    return requestPut<SupplierDto, SupplierUpsertPayload>('catalog', `/api/suppliers/${id}`, payload)
  },
  getProducts(search?: string, includeInactive = false) {
    return requestGet<ProductDto[]>('catalog', '/api/products', {
      params: {
        search: search || undefined,
        includeInactive
      }
    })
  },
  getProduct(id: string) {
    return requestGet<ProductDto>('catalog', `/api/products/${id}`)
  },
  createProduct(payload: ProductUpsertPayload) {
    return requestPost<ProductDto, ProductUpsertPayload>('catalog', '/api/products', payload)
  },
  updateProduct(id: string, payload: ProductUpsertPayload) {
    return requestPut<ProductDto, ProductUpsertPayload>('catalog', `/api/products/${id}`, payload)
  },
  removeProduct(id: string) {
    return requestDelete<void>('catalog', `/api/products/${id}`)
  }
}
