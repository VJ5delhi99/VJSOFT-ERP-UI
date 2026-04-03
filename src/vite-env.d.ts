/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_ENV?: 'development' | 'staging' | 'production'
  readonly VITE_ENABLE_APP_LOGS?: 'true' | 'false'
  readonly VITE_ENABLE_DEMO_MODE?: 'true' | 'false'
  readonly VITE_DEMO_CACHE_TTL_HOURS?: string
  readonly VITE_API_TIMEOUT_MS?: string
  readonly VITE_SERVICE_AUTH_URL?: string
  readonly VITE_SERVICE_PLATFORM_URL?: string
  readonly VITE_SERVICE_CATALOG_URL?: string
  readonly VITE_SERVICE_INVENTORY_URL?: string
  readonly VITE_SERVICE_SALES_URL?: string
  readonly VITE_SERVICE_BILLING_URL?: string
  readonly VITE_SERVICE_PAYMENTS_URL?: string
  readonly VITE_SERVICE_INVOICES_URL?: string
  readonly VITE_AUTH_DEVICE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
