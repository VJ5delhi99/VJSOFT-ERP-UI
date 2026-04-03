const erpRoles = [
  "Admin",
  "CatalogManager",
  "InventoryManager",
  "ProcurementManager",
  "SalesManager",
  "FinanceManager",
  "HRManager",
  "ProjectManager",
  "AssetManager",
  "SupportLead",
  "ManufacturingPlanner",
  "UserAdministrator"
];
const roleGroups = {
  catalogAccess: ["Admin", "CatalogManager", "InventoryManager", "ProcurementManager", "SalesManager", "FinanceManager"],
  inventoryAccess: ["Admin", "InventoryManager", "AssetManager", "ManufacturingPlanner", "ProcurementManager"],
  salesAccess: ["Admin", "SalesManager", "ProjectManager", "SupportLead"],
  financeAccess: ["Admin", "FinanceManager", "HRManager"],
  operationsAccess: ["Admin", "ProjectManager", "AssetManager", "SupportLead", "ManufacturingPlanner", "HRManager"]
};
const rolePermissionMap = {
  Admin: ["CanManageUsers", "CanViewFinance", "CanApprovePurchase", "CanManageInventory", "CanRunPayroll"],
  UserAdministrator: ["CanManageUsers"],
  FinanceManager: ["CanViewFinance"],
  HRManager: ["CanViewFinance", "CanRunPayroll"],
  InventoryManager: ["CanManageInventory"],
  CatalogManager: ["CanManageInventory"],
  AssetManager: ["CanManageInventory"],
  ManufacturingPlanner: ["CanManageInventory"],
  ProcurementManager: ["CanApprovePurchase"],
  SalesManager: [],
  ProjectManager: [],
  SupportLead: []
};
export {
  rolePermissionMap as a,
  erpRoles as e,
  roleGroups as r
};
