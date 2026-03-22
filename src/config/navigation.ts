import { findSharedModule, sharedModules, toRouteLabel } from '@shared/index'
import type { NavigationItem, Permission, UserRole } from '../types'

export const navigationItems: NavigationItem[] = sharedModules.map((module) => ({
  key: module.key,
  group: module.group,
  label: module.label,
  path: module.path,
  description: module.description,
  icon: module.icon,
  roles: module.roles as UserRole[] | undefined,
  permissions: module.permissions as Permission[] | undefined
}))

export interface BreadcrumbItem {
  label: string
  path?: string
}

export function findNavigationItem(pathname: string) {
  const sharedModule = findSharedModule(pathname)
  return sharedModule ? navigationItems.find((item) => item.key === sharedModule.key) : undefined
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
    const navigationItem = findNavigationItem(currentPath)
    const isLast = index === segments.length - 1

    breadcrumbs.push({
      label: navigationItem?.label || toRouteLabel(segment),
      path: isLast ? undefined : currentPath
    })
  })

  return breadcrumbs
}
