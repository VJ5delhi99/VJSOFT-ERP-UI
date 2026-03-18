import type { ReactNode } from 'react'
import type { Permission, UserRole } from '../types'
import { useAuth } from '../hooks/useAuth'

interface PermissionGateProps {
  children: ReactNode
  fallback?: ReactNode
  roles?: UserRole[]
  permissions?: Permission[]
}

export default function PermissionGate({ children, fallback = null, roles, permissions }: PermissionGateProps) {
  const { canAccess } = useAuth()

  if (!canAccess(roles, permissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
