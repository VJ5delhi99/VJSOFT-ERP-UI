export type SharedModuleGroup = 'Operate' | 'Govern'
export type SharedModuleIcon = 'dashboard' | 'access' | 'tenant' | 'orders' | 'products' | 'finance' | 'reports' | 'settings' | 'platform'

export interface SharedModuleSection {
  key: string
  label: string
  description: string
}

export interface SharedModuleDefinition {
  key: string
  group: SharedModuleGroup
  label: string
  path: string
  legacyPaths?: string[]
  description: string
  audience: string
  icon: SharedModuleIcon
  mobilePriority: 'primary' | 'secondary' | 'admin'
  roles?: string[]
  permissions?: string[]
  sections?: SharedModuleSection[]
}

export const sharedModules: SharedModuleDefinition[] = [
  {
    key: 'dashboard',
    group: 'Operate',
    label: 'Command Center',
    path: '/dashboard',
    description: 'Role-aware priorities, cash, stock, and business signals',
    audience: 'Executives, managers, and daily operators',
    icon: 'dashboard',
    mobilePriority: 'primary'
  },
  {
    key: 'organization',
    group: 'Operate',
    label: 'Organization Hub',
    path: '/organization',
    legacyPaths: ['/companies'],
    description: 'Company profile, operational readiness, and business updates',
    audience: 'Organization admins and leadership',
    icon: 'tenant',
    mobilePriority: 'secondary',
    sections: [
      { key: 'overview', label: 'Overview', description: 'Company profile and health indicators' },
      { key: 'updates', label: 'Updates', description: 'Announcements, reminders, and follow-up items' },
      { key: 'readiness', label: 'Readiness', description: 'AI and environment readiness for the organization' }
    ]
  },
  {
    key: 'sales-operations',
    group: 'Operate',
    label: 'Sales & Delivery',
    path: '/sales-operations',
    legacyPaths: ['/orders'],
    description: 'Customers, orders, projects, and customer service work',
    audience: 'Sales, delivery, and service teams',
    icon: 'orders',
    mobilePriority: 'primary',
    roles: ['Admin', 'SalesManager', 'ProjectManager', 'SupportLead', 'AssetManager', 'ManufacturingPlanner', 'HRManager'],
    sections: [
      { key: 'revenue', label: 'Revenue', description: 'Orders, pipeline, and customer accounts' },
      { key: 'delivery', label: 'Delivery', description: 'Projects, cases, and service commitments' }
    ]
  },
  {
    key: 'catalog-operations',
    group: 'Operate',
    label: 'Supply Chain',
    path: '/supply-chain',
    legacyPaths: ['/products'],
    description: 'Catalog, stock, purchasing, assets, and manufacturing work',
    audience: 'Catalog, inventory, procurement, and asset teams',
    icon: 'products',
    mobilePriority: 'primary',
    roles: ['Admin', 'CatalogManager', 'InventoryManager', 'ProcurementManager', 'SalesManager', 'FinanceManager', 'AssetManager', 'ManufacturingPlanner'],
    sections: [
      { key: 'catalog', label: 'Catalog', description: 'Products, categories, and suppliers' },
      { key: 'inventory', label: 'Inventory', description: 'Stock control, replenishment, and purchasing' },
      { key: 'operations', label: 'Operations', description: 'Assets, maintenance, and work orders' }
    ]
  },
  {
    key: 'finance',
    group: 'Operate',
    label: 'Finance',
    path: '/finance',
    description: 'Receivables, collections, payroll, and cash outlook',
    audience: 'Finance, payroll, and leadership teams',
    icon: 'finance',
    mobilePriority: 'primary',
    permissions: ['CanViewFinance'],
    sections: [
      { key: 'receivables', label: 'Receivables', description: 'Invoices, aging, and payment follow-up' },
      { key: 'cash', label: 'Cash', description: 'Cash outlook and collection risk' },
      { key: 'payroll', label: 'Payroll', description: 'Payroll run-rate and approvals' }
    ]
  },
  {
    key: 'analytics',
    group: 'Operate',
    label: 'Analytics & Exports',
    path: '/analytics',
    legacyPaths: ['/reports'],
    description: 'Reporting snapshots, exports, and document intelligence',
    audience: 'Leaders, analysts, and finance teams',
    icon: 'reports',
    mobilePriority: 'secondary',
    permissions: ['CanViewFinance']
  },
  {
    key: 'access-control',
    group: 'Govern',
    label: 'Access & Audit',
    path: '/access-control',
    legacyPaths: ['/users'],
    description: 'Roles, permissions, audit trail, and delivery history',
    audience: 'Platform admins and access managers',
    icon: 'access',
    mobilePriority: 'admin',
    permissions: ['CanManageUsers']
  },
  {
    key: 'platform-ops',
    group: 'Govern',
    label: 'Platform Operations',
    path: '/platform-operations',
    description: 'Service health, delivery backlog, and support diagnostics',
    audience: 'Platform admins and support teams',
    icon: 'platform',
    mobilePriority: 'admin',
    permissions: ['CanManageUsers']
  },
  {
    key: 'configuration',
    group: 'Govern',
    label: 'Configuration',
    path: '/configuration',
    legacyPaths: ['/settings'],
    description: 'Session controls, integrations, and environment setup',
    audience: 'Organization admins',
    icon: 'settings',
    mobilePriority: 'admin'
  }
]

export function findSharedModule(pathname: string) {
  return sharedModules.find((module) =>
    pathname === module.path ||
    pathname.startsWith(`${module.path}/`) ||
    module.legacyPaths?.some((legacyPath) => pathname === legacyPath || pathname.startsWith(`${legacyPath}/`))
  )
}
