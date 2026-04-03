import axios from 'axios'
import { apiConfig } from '../config/api'
import { getDemoServiceHealth } from '../demo/demoApi'
import type { ServiceHealthDto } from '../types'

interface HealthResponse {
  service?: string
  status?: string
  utc?: string
  tenants?: number
  pendingOutboxMessages?: number
}

const serviceCatalog = [
  { id: 'auth', service: 'Authentication', area: 'Identity & access', baseUrl: apiConfig.services.auth },
  { id: 'platform', service: 'Platform', area: 'Shared platform services', baseUrl: apiConfig.services.platform },
  { id: 'catalog', service: 'Catalog', area: 'Catalog and reference setup', baseUrl: apiConfig.services.catalog },
  { id: 'inventory', service: 'Inventory', area: 'Inventory, procurement, and assets', baseUrl: apiConfig.services.inventory },
  { id: 'sales', service: 'Sales', area: 'Customers, orders, and delivery', baseUrl: apiConfig.services.sales },
  { id: 'billing', service: 'Billing', area: 'Billing and reporting', baseUrl: apiConfig.services.billing },
  { id: 'payments', service: 'Payments', area: 'Payments and collections', baseUrl: apiConfig.services.payments },
  { id: 'invoices', service: 'Invoices', area: 'Invoice detail and extraction', baseUrl: apiConfig.services.invoices }
] as const

function joinHealthPath(baseUrl: string) {
  return `${baseUrl.replace(/\/+$/, '')}/health`
}

function toStatusLabel(status: ServiceHealthDto['status']) {
  switch (status) {
    case 'online':
      return 'Healthy'
    case 'degraded':
      return 'Needs review'
    default:
      return 'Offline'
  }
}

function toOfflineHealth(service: (typeof serviceCatalog)[number]): ServiceHealthDto {
  return {
    id: service.id,
    service: service.service,
    area: service.area,
    status: 'offline',
    statusLabel: toStatusLabel('offline'),
    baseUrl: service.baseUrl,
    checkedAt: new Date().toISOString(),
    detail: 'The service did not respond to the health check.'
  }
}

export const operationsService = {
  async getServiceHealth() {
    if (apiConfig.demoModeEnabled) {
      return getDemoServiceHealth()
    }

    const results = await Promise.all(
      serviceCatalog.map(async (service) => {
        try {
          const response = await axios.get<HealthResponse>(joinHealthPath(service.baseUrl), {
            timeout: 5000
          })
          const status = response.data.status?.toLowerCase() === 'ok' ? 'online' : 'degraded'

          return {
            id: service.id,
            service: service.service,
            area: service.area,
            status,
            statusLabel: toStatusLabel(status),
            baseUrl: service.baseUrl,
            checkedAt: response.data.utc || new Date().toISOString(),
            detail:
              typeof response.data.pendingOutboxMessages === 'number'
                ? `${response.data.pendingOutboxMessages} messages waiting for delivery`
                : 'Service is responding to health checks.',
            pendingOutboxMessages: response.data.pendingOutboxMessages,
            tenants: response.data.tenants
          } satisfies ServiceHealthDto
        } catch {
          return toOfflineHealth(service)
        }
      })
    )

    return results
  }
}
