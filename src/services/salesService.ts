import type { CustomerDto, CustomerIntelligenceDto, OrderDto, OrderMetricsDto, ProjectDto, ServiceTicketDto } from '../types'
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
  }
}
