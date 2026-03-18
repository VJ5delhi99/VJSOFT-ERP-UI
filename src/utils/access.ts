import type { AuthUser, Permission, UserRole } from '../types'

export function hasAnyRole(user: AuthUser | null, roles?: UserRole[]) {
  if (!roles || roles.length === 0) {
    return true
  }

  if (!user) {
    return false
  }

  return roles.some((role) => user.roles.includes(role))
}

export function hasAnyPermission(user: AuthUser | null, permissions?: Permission[]) {
  if (!permissions || permissions.length === 0) {
    return true
  }

  if (!user) {
    return false
  }

  return permissions.some((permission) => user.permissions.includes(permission))
}

export function hasAccess(user: AuthUser | null, roles?: UserRole[], permissions?: Permission[]) {
  return hasAnyRole(user, roles) && hasAnyPermission(user, permissions)
}
