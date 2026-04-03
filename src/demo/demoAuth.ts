import type { AuthUser, LoginPayload, LoginResponse } from '../types'
import { apiConfig } from '../config/api'

export interface DemoAccountDefinition {
  label: string
  userNameOrEmail: string
  password: string
  description: string
  user: AuthUser
}

const ttlMs = apiConfig.demoCacheTtlHours * 60 * 60 * 1000

function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, 120))
}

function buildSession(user: AuthUser): LoginResponse {
  const issuedAt = Date.now()
  return {
    accessToken: `demo-token-${user.userId}-${issuedAt}`,
    refreshToken: `demo-refresh-${user.userId}-${issuedAt}`,
    tokenType: 'Bearer',
    expiresAtUtc: new Date(issuedAt + ttlMs).toISOString(),
    user
  }
}

export const demoAccounts: DemoAccountDefinition[] = [
  {
    label: 'Admin',
    userNameOrEmail: 'admin@demo.com',
    password: 'Password123!',
    description: 'Full access across the organization.',
    user: {
      userId: 'demo-admin',
      userName: 'Demo Admin',
      email: 'admin@demo.com',
      tenantId: 'tenant-demo',
      roles: ['Admin', 'UserAdministrator'],
      permissions: ['CanManageUsers', 'CanViewFinance', 'CanApprovePurchase', 'CanManageInventory', 'CanRunPayroll'],
      isDemoUser: true,
      isActive: true
    }
  },
  {
    label: 'Manager',
    userNameOrEmail: 'manager@demo.com',
    password: 'Password123!',
    description: 'Best for daily operations and reporting.',
    user: {
      userId: 'demo-manager',
      userName: 'Demo Manager',
      email: 'manager@demo.com',
      tenantId: 'tenant-demo',
      roles: ['InventoryManager', 'SalesManager', 'FinanceManager'],
      permissions: ['CanViewFinance', 'CanApprovePurchase', 'CanManageInventory'],
      isDemoUser: true,
      isActive: true
    }
  },
  {
    label: 'User',
    userNameOrEmail: 'user@demo.com',
    password: 'Password123!',
    description: 'Basic access for product and service work.',
    user: {
      userId: 'demo-user',
      userName: 'Demo User',
      email: 'user@demo.com',
      tenantId: 'tenant-demo',
      roles: ['AssetManager', 'SupportLead'],
      permissions: ['CanManageInventory'],
      isDemoUser: true,
      isActive: true
    }
  }
]

export async function loginWithDemo(payload: LoginPayload) {
  await delay()
  const account = demoAccounts.find((item) => item.userNameOrEmail.toLowerCase() === payload.userNameOrEmail.trim().toLowerCase() && item.password === payload.password)
  if (!account) {
    throw { message: 'Your sign-in details are not correct.', status: 401 }
  }

  return buildSession(account.user)
}

export async function getDemoProfile(accessToken: string | null | undefined) {
  await delay()
  const account = demoAccounts.find((item) => accessToken?.includes(item.user.userId))
  if (!account) {
    throw { message: 'You are not signed in.', status: 401 }
  }

  return account.user
}

export async function refreshDemoSession(refreshToken: string) {
  await delay()
  const account = demoAccounts.find((item) => refreshToken.includes(item.user.userId))
  if (!account) {
    throw { message: 'Your session has expired.', status: 401 }
  }

  return buildSession(account.user)
}

export async function logoutDemoSession() {
  await delay()
}
