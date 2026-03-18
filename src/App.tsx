import { Suspense, lazy, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Spinner from './components/Spinner'
import MainLayout from './layouts/MainLayout'
import { useAuth } from './hooks/useAuth'
import type { Permission, UserRole } from './types'

const DashboardPage = lazy(() => import('./pages/Dashboard'))
const UsersPage = lazy(() => import('./pages/Users'))
const CompaniesPage = lazy(() => import('./pages/Companies'))
const OrdersPage = lazy(() => import('./pages/Orders'))
const ProductsPage = lazy(() => import('./pages/Products'))
const FinancePage = lazy(() => import('./pages/Finance'))
const ReportsPage = lazy(() => import('./pages/Reports'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const LoginPage = lazy(() => import('./pages/Login'))
const UnauthorizedPage = lazy(() => import('./pages/Unauthorized'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <MainLayout />
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function AccessGuard({
  roles,
  permissions,
  children
}: {
  roles?: UserRole[]
  permissions?: Permission[]
  children: ReactNode
}) {
  const { canAccess } = useAuth()
  return canAccess(roles, permissions) ? <>{children}</> : <Navigate to="/unauthorized" replace />
}

export default function App() {
  return (
    <Suspense fallback={<Spinner fullPage label="Preparing workspace" />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="users"
            element={
              <AccessGuard permissions={['CanManageUsers']}>
                <UsersPage />
              </AccessGuard>
            }
          />
          <Route path="companies" element={<CompaniesPage />} />
          <Route
            path="orders"
            element={
              <AccessGuard
                roles={['Admin', 'SalesManager', 'ProjectManager', 'SupportLead', 'AssetManager', 'ManufacturingPlanner', 'HRManager']}
              >
                <OrdersPage />
              </AccessGuard>
            }
          />
          <Route
            path="products"
            element={
              <AccessGuard
                roles={['Admin', 'CatalogManager', 'InventoryManager', 'ProcurementManager', 'SalesManager', 'FinanceManager', 'AssetManager', 'ManufacturingPlanner']}
              >
                <ProductsPage />
              </AccessGuard>
            }
          />
          <Route
            path="finance"
            element={
              <AccessGuard permissions={['CanViewFinance']}>
                <FinancePage />
              </AccessGuard>
            }
          />
          <Route
            path="reports"
            element={
              <AccessGuard permissions={['CanViewFinance']}>
                <ReportsPage />
              </AccessGuard>
            }
          />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
