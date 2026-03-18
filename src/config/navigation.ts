import { roleGroups } from './rbac'
import type { NavigationItem } from '../types'

export const navigationItems: NavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Cross-service KPIs and insights',
    icon: 'dashboard'
  },
  {
    key: 'users',
    label: 'Access Control',
    path: '/users',
    description: 'Roles, permissions, audit',
    icon: 'access',
    permissions: ['CanManageUsers']
  },
  {
    key: 'companies',
    label: 'Tenant Workspace',
    path: '/companies',
    description: 'Tenant context and platform feed',
    icon: 'tenant'
  },
  {
    key: 'orders',
    label: 'Sales Ops',
    path: '/orders',
    description: 'Customers, orders, projects, tickets',
    icon: 'orders',
    roles: [...new Set([...roleGroups.salesAccess, ...roleGroups.operationsAccess])]
  },
  {
    key: 'products',
    label: 'Catalog & Inventory',
    path: '/products',
    description: 'Products, stock, procurement, assets',
    icon: 'products',
    roles: [...new Set([...roleGroups.catalogAccess, ...roleGroups.inventoryAccess])]
  },
  {
    key: 'finance',
    label: 'Finance',
    path: '/finance',
    description: 'Billing, payments, invoices, payroll',
    icon: 'finance',
    roles: roleGroups.financeAccess
  },
  {
    key: 'reports',
    label: 'Reports',
    path: '/reports',
    description: 'Analytics, assistant, exports',
    icon: 'reports',
    permissions: ['CanViewFinance']
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    description: 'Platform readiness and service config',
    icon: 'settings'
  }
]

export interface BreadcrumbItem {
  label: string
  path?: string
}

function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function findNavigationItem(pathname: string) {
  return navigationItems.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
}

export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return [{ label: 'Workspace' }]
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Workspace', path: '/dashboard' }]
  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const navigationItem = navigationItems.find((item) => item.path === currentPath)
    const isLast = index === segments.length - 1

    breadcrumbs.push({
      label: navigationItem?.label || toTitleCase(segment),
      path: isLast ? undefined : currentPath
    })
  })

  return breadcrumbs
}
