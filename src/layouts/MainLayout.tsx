import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { formatOrganizationName, formatRoleName } from '@shared/index'
import { buildBreadcrumbs, findNavigationItem, navigationItems } from '../config/navigation'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { platformService } from '../services/platformService'
import type { DemoStatusDto, NavigationItem, NotificationDto } from '../types'
import { formatRelative } from '../utils/format'
import StatusBadge from '../components/StatusBadge'

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
    ),
    platform: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 5h18v4H3V5Zm2 6h6v8H5v-8Zm8 0h6v3h-6v-3Zm0 5h6v3h-6v-3Z" />
      </svg>
    )
  }

  return icons[icon] || icons.dashboard
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16v2H4V7Zm0 8h16v2H4v-2Zm0-4h16v2H4v-2Z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5L3 18v1h18v-1l-2-2Z" />
    </svg>
  )
}

function severityTone(value: string) {
  switch (value.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'danger' as const
    case 'medium':
    case 'warning':
      return 'warning' as const
    case 'low':
      return 'success' as const
    default:
      return 'info' as const
  }
}

function groupNavigation(items: NavigationItem[]) {
  return [
    { label: 'Operate', items: items.filter((item) => item.group === 'Operate') },
    { label: 'Manage', items: items.filter((item) => item.group === 'Govern') }
  ].filter((group) => group.items.length > 0)
}

export default function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, canAccess } = useAuth()
  const { showToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [demoStatus, setDemoStatus] = useState<DemoStatusDto | null>(null)
  const [resettingDemo, setResettingDemo] = useState(false)
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null)
  const notificationPanelRef = useRef<HTMLDivElement | null>(null)

  const visibleNavigation = useMemo(
    () => navigationItems.filter((item) => canAccess(item.roles, item.permissions)),
    [canAccess]
  )
  const groupedNavigation = useMemo(() => groupNavigation(visibleNavigation), [visibleNavigation])
  const activeItem = findNavigationItem(pathname) || visibleNavigation[0]
  const breadcrumbs = buildBreadcrumbs(pathname)
  const unreadCount = notifications.length
  const organizationName = formatOrganizationName(user?.tenantId)

  useEffect(() => {
    setSidebarOpen(false)
    setNotificationsOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    if (notificationsOpen) {
      document.addEventListener('mousedown', handlePointerDown)
    }

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [notificationsOpen])

  useEffect(() => {
    let isMounted = true

    async function loadNotifications() {
      try {
        const items = await platformService.getNotifications(true)
        if (isMounted) {
          setNotifications(items.slice(0, 5))
        }
      } catch {
        if (isMounted) {
          setNotifications([])
        }
      }
    }

    void loadNotifications()
    const intervalId = window.setInterval(() => {
      void loadNotifications()
    }, 90000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadDemoStatus() {
      try {
        const status = await platformService.getDemoStatus()
        if (isMounted) {
          setDemoStatus(status)
        }
      } catch {
        if (isMounted) {
          setDemoStatus(null)
        }
      }
    }

    if (user?.isDemoUser) {
      void loadDemoStatus()
    } else {
      setDemoStatus(null)
    }

    return () => {
      isMounted = false
    }
  }, [user?.isDemoUser, user?.tenantId])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  async function handleResetDemo() {
    setResettingDemo(true)

    try {
      await platformService.resetDemo()
      showToast('Sample organization reset', 'The demonstration organization has been refreshed with the default sample business data.', 'success')
      window.location.reload()
    } catch {
      showToast('Reset did not complete', 'The sample organization could not be refreshed right now. Please try again shortly.', 'danger')
    } finally {
      setResettingDemo(false)
    }
  }

  async function acknowledgeNotification(notificationId: string) {
    setAcknowledgingId(notificationId)

    try {
      await platformService.acknowledgeNotification(notificationId)
      setNotifications((current) => current.filter((item) => item.id !== notificationId))
    } finally {
      setAcknowledgingId(null)
    }
  }

  return (
    <div className={`app-shell ${sidebarOpen ? 'app-shell--sidebar-open' : ''}`}>
      {sidebarOpen ? <button type="button" className="app-shell__backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" /> : null}

      <aside className="sidebar" aria-label="Primary navigation">
        <div className="sidebar__brand">
          <div className="sidebar__logo">EX</div>
          <div>
            <strong>Edgeonix ERP</strong>
            <span>Enterprise operations platform</span>
          </div>
        </div>

        <div className="sidebar__tenant-card">
          <span className="sidebar__tenant-badge">Current organization</span>
          <strong>{organizationName}</strong>
          <p>{user ? `${user.roles.length} access roles active for this company context` : 'Sign in to view organization details'}</p>
        </div>

        <div className="sidebar__section">
          {groupedNavigation.map((group) => (
            <div key={group.label} className="sidebar__section-group">
              <span className="sidebar__section-label">{group.label}</span>
              <nav className="sidebar__nav" aria-label={`${group.label} navigation`}>
                {group.items.map((item) => (
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
            </div>
          ))}
        </div>

        <div className="sidebar__footer">
          <span className="status-chip status-chip--success">Signed in</span>
          <p>{user?.userName || 'Signed-in user'}</p>
        </div>
      </aside>

      <div className="app-shell__main">
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="ghost-button ghost-button--icon"
              onClick={() => setSidebarOpen((current) => !current)}
              aria-label="Toggle navigation"
              aria-expanded={sidebarOpen}
            >
              <MenuIcon />
            </button>
            <div className="topbar__title">
              <nav className="topbar__breadcrumbs" aria-label="Breadcrumb">
                <ol>
                  {breadcrumbs.map((item, index) => (
                    <li key={`${item.label}-${index}`}>{item.label}</li>
                  ))}
                </ol>
              </nav>
              <span className="topbar__eyebrow">{organizationName}</span>
              <h2>{activeItem?.label || 'Command Center'}</h2>
            </div>
          </div>

          <div className="topbar__right">
            <div className="topbar__meta">
              <span>Current role</span>
              <strong>{user?.roles[0] ? formatRoleName(user.roles[0]) : 'Signed-in session'}</strong>
            </div>

            <div ref={notificationPanelRef} className="topbar__notifications">
              <button
                type="button"
                className="ghost-button topbar__notification-button"
                onClick={() => setNotificationsOpen((current) => !current)}
                aria-expanded={notificationsOpen}
                aria-label={`Updates${unreadCount > 0 ? `, ${unreadCount} new` : ''}`}
              >
                <BellIcon />
                <span>Updates</span>
                {unreadCount > 0 ? <span className="notification-dot">{unreadCount}</span> : null}
              </button>

              {notificationsOpen ? (
                <div className="notification-popover" role="dialog" aria-label="Updates">
                  <div className="notification-popover__header">
                    <div>
                      <strong>Organization updates</strong>
                      <span>{unreadCount > 0 ? `${unreadCount} new items` : "You're all caught up"}</span>
                    </div>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        navigate('/organization')
                        setNotificationsOpen(false)
                      }}
                    >
                      View all
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="notification-popover__empty">
                      <strong>No new updates</strong>
                      <p>Your organization is up to date.</p>
                    </div>
                  ) : (
                    <div className="notification-popover__list">
                      {notifications.map((item) => (
                        <article key={item.id} className="notification-item">
                          <div className="notification-item__body">
                            <div className="notification-item__header">
                              <strong>{item.title}</strong>
                              <StatusBadge label={item.severity} tone={severityTone(item.severity)} />
                            </div>
                            <p>{item.message}</p>
                            <small>{formatRelative(item.createdAt)}</small>
                          </div>
                          <button
                            type="button"
                            className="ghost-button"
                            disabled={acknowledgingId === item.id}
                            onClick={() => void acknowledgeNotification(item.id)}
                          >
                            {acknowledgingId === item.id ? 'Saving...' : 'Mark as read'}
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="topbar__profile">
              <div className="topbar__avatar">{user?.userName?.slice(0, 1).toUpperCase() || 'U'}</div>
              <div className="topbar__profile-copy">
                <strong>{user?.userName || 'User account'}</strong>
                <span>{user?.email || organizationName}</span>
              </div>
            </div>

            <button type="button" className="ghost-button" onClick={() => void handleLogout()}>
              Sign out
            </button>
          </div>
        </header>

        <main className="content-shell">
          {user?.isDemoUser ? (
            <section className="demo-banner" aria-label="Demo mode status">
              <div className="demo-banner__copy">
                <span className="page-header__eyebrow">Sample organization</span>
                <strong>You are viewing demonstration business data.</strong>
                <p>Changes stay inside the sample organization and can be refreshed at any time.</p>
              </div>
              {demoStatus?.canReset ? (
                <button type="button" className="ghost-button" onClick={() => void handleResetDemo()} disabled={resettingDemo}>
                  {resettingDemo ? 'Refreshing sample data...' : 'Refresh sample data'}
                </button>
              ) : null}
            </section>
          ) : null}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
