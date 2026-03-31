import type {
  AccessControlSummaryDto,
  BranchDto,
  CompanyDto,
  CustomerDto,
  CustomerIntelligenceDto,
  FieldServiceJobDto,
  OrderDto,
  OrderMetricsDto,
  ProductChangeDto,
  ProductLifecycleDto,
  ProjectDto,
  ServiceTicketDto
} from '../types'
import { requestGet, requestPost } from './apiClient'

export interface CustomerUpsertPayload {
  name: string
  email: string
  contactNumber: string
  segment: string
}

export interface OrderCreatePayload {
  customerId: string
  lines: Array<{ productId: string; quantity: number }>
  paymentMethod: string
}

export interface OrderStatusPayload {
  status: string
}

export interface ProjectCreatePayload {
  name: string
  customerName: string
  projectManager: string
  budget: number
  dueDate: string
}

export interface ProjectStatusPayload {
  status: string
  percentComplete: number
}

export interface ServiceTicketCreatePayload {
  customerId?: string
  customerName: string
  subject: string
  priority: string
  assignedTeam: string
  dueInHours: number
}

export interface TicketStatusPayload {
  status: string
}

export interface FieldServiceJobCreatePayload {
  serviceTicketId?: string
  customerName?: string
  technicianName: string
  scheduledStart: string
  scheduledEnd: string
  offlineSyncEnabled: boolean
  latitude: number
  longitude: number
}

export interface FieldServiceJobUpdatePayload {
  status: string
  serviceReport: string
}

export interface ProductLifecycleCreatePayload {
  productId: string
  version: string
  lifecycleStage: string
  billOfMaterials: Array<{ componentProductId: string; quantity: number; unitOfMeasure: string }>
}

export interface ProductChangeCreatePayload {
  productLifecycleId: string
  title: string
  requestedBy: string
  impactSummary: string
}

export interface ProductChangeStatusPayload {
  status: string
}

export const salesService = {
  getCustomers(segment?: string) {
    return requestGet<CustomerDto[]>('sales', '/api/customers/', {
      params: { segment: segment || undefined }
    })
  },
  getCustomer(id: string) {
    return requestGet<CustomerDto>('sales', `/api/customers/${id}`)
  },
  createCustomer(payload: CustomerUpsertPayload) {
    return requestPost<CustomerDto, CustomerUpsertPayload>('sales', '/api/customers/', payload)
  },
  getCustomerIntelligence(id: string) {
    return requestGet<CustomerIntelligenceDto>('sales', `/api/customers/${id}/intelligence`)
  },
  getOrders(status?: string) {
    return requestGet<OrderDto[]>('sales', '/api/orders/', {
      params: { status: status || undefined }
    })
  },
  getOrder(id: string) {
    return requestGet<OrderDto>('sales', `/api/orders/${id}`)
  },
  getOrderMetrics() {
    return requestGet<OrderMetricsDto>('sales', '/api/orders/metrics')
  },
  createOrder(payload: OrderCreatePayload) {
    return requestPost<OrderDto, OrderCreatePayload>('sales', '/api/orders/', payload)
  },
  updateOrderStatus(id: string, payload: OrderStatusPayload) {
    return requestPost<OrderDto, OrderStatusPayload>('sales', `/api/orders/${id}/status`, payload)
  },
  getProjects(status?: string) {
    return requestGet<ProjectDto[]>('sales', '/api/projects/', {
      params: { status: status || undefined }
    })
  },
  createProject(payload: ProjectCreatePayload) {
    return requestPost<ProjectDto, ProjectCreatePayload>('sales', '/api/projects/', payload)
  },
  updateProjectStatus(id: string, payload: ProjectStatusPayload) {
    return requestPost<ProjectDto, ProjectStatusPayload>('sales', `/api/projects/${id}/status`, payload)
  },
  getTickets(status?: string) {
    return requestGet<ServiceTicketDto[]>('sales', '/api/service-desk/tickets', {
      params: { status: status || undefined }
    })
  },
  createTicket(payload: ServiceTicketCreatePayload) {
    return requestPost<ServiceTicketDto, ServiceTicketCreatePayload>('sales', '/api/service-desk/tickets', payload)
  },
  updateTicketStatus(id: string, payload: TicketStatusPayload) {
    return requestPost<ServiceTicketDto, TicketStatusPayload>('sales', `/api/service-desk/tickets/${id}/status`, payload)
  },
  getFieldServiceJobs(status?: string) {
    return requestGet<FieldServiceJobDto[]>('sales', '/api/field-service/jobs', {
      params: { status: status || undefined }
    })
  },
  createFieldServiceJob(payload: FieldServiceJobCreatePayload) {
    return requestPost<FieldServiceJobDto, FieldServiceJobCreatePayload>('sales', '/api/field-service/jobs', payload)
  },
  updateFieldServiceJob(id: string, payload: FieldServiceJobUpdatePayload) {
    return requestPost<FieldServiceJobDto, FieldServiceJobUpdatePayload>('sales', `/api/field-service/jobs/${id}/status`, payload)
  },
  getProductLifecycles(productId?: string) {
    return requestGet<ProductLifecycleDto[]>('sales', '/api/plm/lifecycles', {
      params: { productId: productId || undefined }
    })
  },
  createProductLifecycle(payload: ProductLifecycleCreatePayload) {
    return requestPost<ProductLifecycleDto, ProductLifecycleCreatePayload>('sales', '/api/plm/lifecycles', payload)
  },
  getProductChanges(status?: string) {
    return requestGet<ProductChangeDto[]>('sales', '/api/plm/changes', {
      params: { status: status || undefined }
    })
  },
  createProductChange(payload: ProductChangeCreatePayload) {
    return requestPost<ProductChangeDto, ProductChangeCreatePayload>('sales', '/api/plm/changes', payload)
  },
  updateProductChangeStatus(id: string, payload: ProductChangeStatusPayload) {
    return requestPost<ProductChangeDto, ProductChangeStatusPayload>('sales', `/api/plm/changes/${id}/status`, payload)
  },
  getAccessControlSummary() {
    return requestGet<AccessControlSummaryDto>('sales', '/api/access-control/summary')
  },
  getCompanies() {
    return requestGet<CompanyDto[]>('sales', '/api/access-control/companies')
  },
  getBranches() {
    return requestGet<BranchDto[]>('sales', '/api/access-control/branches')
  }
}
