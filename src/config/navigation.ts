import { roleGroups } from './rbac'
import type { NavigationItem } from '../types'

export const navigationItems: NavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Business performance and key updates',
    icon: 'dashboard'
  },
  {
    key: 'users',
    label: 'User Access',
    path: '/users',
    description: 'Roles, permissions, and activity',
    icon: 'access',
    permissions: ['CanManageUsers']
  },
  {
    key: 'companies',
    label: 'Workspace',
    path: '/companies',
    description: 'Workspace details and updates',
    icon: 'tenant'
  },
  {
    key: 'orders',
    label: 'Sales & Service',
    path: '/orders',
    description: 'Customers, orders, projects, and support',
    icon: 'orders',
    roles: [...new Set([...roleGroups.salesAccess, ...roleGroups.operationsAccess])]
  },
  {
    key: 'products',
    label: 'Products & Inventory',
    path: '/products',
    description: 'Products, stock, purchasing, and assets',
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
    description: 'Reports, exports, and insights',
    icon: 'reports',
    permissions: ['CanViewFinance']
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    description: 'Workspace settings and connections',
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
    return [{ label: 'Home' }]
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/dashboard' }]
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
