import type { AppEnvironment } from '../types'

export type ServiceKey = 'auth' | 'platform' | 'catalog' | 'inventory' | 'sales' | 'billing' | 'payments' | 'invoices'

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

const environment = (import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development') as AppEnvironment

function resolveServiceUrl(envValue: string | undefined, fallbackUrl: string) {
  return trimTrailingSlash(envValue || fallbackUrl)
}

export const apiConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Edgeonix',
  environment,
  enableLogs: import.meta.env.VITE_ENABLE_APP_LOGS === 'true' || import.meta.env.DEV,
  useMocks: false,
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS || 20000),
  authDeviceId: import.meta.env.VITE_AUTH_DEVICE_ID || 'edgeonix-erp-ui',
  storageKeys: {
    token: 'vj.erp.token',
    refreshToken: 'vj.erp.refresh-token',
    expiresAtUtc: 'vj.erp.expires-at',
    user: 'vj.erp.user'
  },
  services: {
    auth: resolveServiceUrl(import.meta.env.VITE_SERVICE_AUTH_URL, 'http://localhost:8080'),
    platform: resolveServiceUrl(import.meta.env.VITE_SERVICE_PLATFORM_URL, 'http://localhost:8081'),
    catalog: resolveServiceUrl(import.meta.env.VITE_SERVICE_CATALOG_URL, 'http://localhost:8081'),
    inventory: resolveServiceUrl(import.meta.env.VITE_SERVICE_INVENTORY_URL, 'http://localhost:8082'),
    sales: resolveServiceUrl(import.meta.env.VITE_SERVICE_SALES_URL, 'http://localhost:8083'),
    billing: resolveServiceUrl(import.meta.env.VITE_SERVICE_BILLING_URL, 'http://localhost:8084'),
    payments: resolveServiceUrl(import.meta.env.VITE_SERVICE_PAYMENTS_URL, 'http://localhost:8085'),
    invoices: resolveServiceUrl(import.meta.env.VITE_SERVICE_INVOICES_URL, 'http://localhost:8086')
  }
}
