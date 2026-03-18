import { useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { navigationItems } from '../config/navigation'
import { useAuth } from '../hooks/useAuth'

function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, ReactNode> = {
    dashboard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7V11h-7v9Zm0-16v5h7V4h-7Z" />
      </svg>
    ),
    access: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 1 3 5v6c0 5.25 3.84 10.18 9 11 5.16-.82 9-5.75 9-11V5l-9-4Zm0 11h7c-.53 3.98-3.1 7.39-7 8.69V12H5V6.3l7-3.11V12Z" />
      </svg>
    ),
    tenant: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 21h16v-2H4v2Zm1-4h4V5H5v12Zm5 0h4V3h-4v14Zm5 0h4V9h-4v8Z" />
      </svg>
    ),
    orders: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17 14h9.95c.75 0 1.41-.41 1.75-1.03L22 6.76 20.25 6l-3.13 6H8.1L4.27 4H1v2h2l3.6 7.59-1.35 2.44C4.52 17.37 5.48 19 7 19h12v-2H7l1.17-2Z" />
      </svg>
    ),
    products: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m21 8-9-5-9 5 9 5 9-5Zm-9 7L3 10v6l9 5 9-5v-6l-9 5Z" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 22h16v-2H4v2Zm2-4h3V9H6v9Zm5 0h3V2h-3v16Zm5 0h3v-6h-3v6Z" />
      </svg>
    ),
    finance: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 17h3.5l3-7 4 9 3-6H21v-2h-3.2l-2.2 4.4L11.6 6l-3 7H3v4Z" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m19.14 12.94.04-.94-.04-.94 2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94L14.5 2.7a.5.5 0 0 0-.49-.4h-4.02a.5.5 0 0 0-.49.4l-.36 2.62c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.6 8.84a.5.5 0 0 0 .12.64l2.03 1.58-.04.94.04.94L2.72 14.52a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.4 1.05.72 1.63.94l.36 2.62a.5.5 0 0 0 .49.4h4.02a.5.5 0 0 0 .49-.4l.36-2.62c.58-.23 1.12-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z" />
      </svg>
    )
  }

  return icons[icon] || icons.dashboard
}

export default function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, canAccess } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const visibleNavigation = navigationItems.filter((item) => canAccess(item.roles, item.permissions))
  const activeItem =
    visibleNavigation.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`)) || visibleNavigation[0]

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={`app-shell ${sidebarOpen ? 'app-shell--sidebar-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">VJ</div>
          <div>
            <strong>VJ ERP</strong>
            <span>Microservice workspace</span>
          </div>
        </div>

        <div className="sidebar__tenant-card">
          <span className="sidebar__tenant-badge">Workspace</span>
          <strong>{user?.tenantId || 'Tenant context pending'}</strong>
          <p>{user ? `${user.roles.length} role assignments` : 'Authenticate to load context'}</p>
        </div>

        <nav className="sidebar__nav">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => (isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link')}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__icon">
                <NavIcon icon={item.icon} />
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-shell__main">
        <header className="topbar">
          <div className="topbar__left">
            <button type="button" className="ghost-button ghost-button--icon" onClick={() => setSidebarOpen((current) => !current)}>
              Menu
            </button>
            <div>
              <span className="topbar__eyebrow">Enterprise Control Panel</span>
              <h2>{activeItem?.label || 'Dashboard'}</h2>
            </div>
          </div>

          <div className="topbar__right">
            <div className="topbar__meta">
              <span>Active scope</span>
              <strong>{user?.roles[0] || 'Authenticated user'}</strong>
            </div>
            <div className="topbar__profile">
              <div className="topbar__avatar">{user?.userName?.slice(0, 1).toUpperCase() || 'U'}</div>
              <div>
                <strong>{user?.userName || 'Unknown user'}</strong>
                <span>{user?.email || user?.tenantId || 'Tenant context unavailable'}</span>
              </div>
            </div>
            <button type="button" className="ghost-button" onClick={() => void handleLogout()}>
              Logout
            </button>
          </div>
        </header>

        <main className="content-shell">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
