import type { Permission, UserRole } from '../types'

export const erpRoles: UserRole[] = [
  'Admin',
  'CatalogManager',
  'InventoryManager',
  'ProcurementManager',
  'SalesManager',
  'FinanceManager',
  'HRManager',
  'ProjectManager',
  'AssetManager',
  'SupportLead',
  'ManufacturingPlanner',
  'UserAdministrator'
]

export const erpPermissions: Permission[] = [
  'CanManageUsers',
  'CanViewFinance',
  'CanApprovePurchase',
  'CanManageInventory',
  'CanRunPayroll'
]

export const roleGroups = {
  catalogAccess: ['Admin', 'CatalogManager', 'InventoryManager', 'ProcurementManager', 'SalesManager', 'FinanceManager'] as UserRole[],
  inventoryAccess: ['Admin', 'InventoryManager', 'AssetManager', 'ManufacturingPlanner', 'ProcurementManager'] as UserRole[],
  salesAccess: ['Admin', 'SalesManager', 'ProjectManager', 'SupportLead'] as UserRole[],
  financeAccess: ['Admin', 'FinanceManager', 'HRManager'] as UserRole[],
  operationsAccess: ['Admin', 'ProjectManager', 'AssetManager', 'SupportLead', 'ManufacturingPlanner', 'HRManager'] as UserRole[]
}

export const rolePermissionMap: Record<UserRole, Permission[]> = {
  Admin: ['CanManageUsers', 'CanViewFinance', 'CanApprovePurchase', 'CanManageInventory', 'CanRunPayroll'],
  UserAdministrator: ['CanManageUsers'],
  FinanceManager: ['CanViewFinance'],
  HRManager: ['CanViewFinance', 'CanRunPayroll'],
  InventoryManager: ['CanManageInventory'],
  CatalogManager: ['CanManageInventory'],
  AssetManager: ['CanManageInventory'],
  ManufacturingPlanner: ['CanManageInventory'],
  ProcurementManager: ['CanApprovePurchase'],
  SalesManager: [],
  ProjectManager: [],
  SupportLead: []
}
