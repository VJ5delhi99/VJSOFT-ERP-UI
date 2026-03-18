import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../hooks/useAuth'
import { platformService } from '../services/platformService'
import type { AiReadinessDto, NotificationDto, PlatformContextDto } from '../types'
import { formatDateTime } from '../utils/format'

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

export default function Companies() {
  const { user, canAccess } = useAuth()
  const [loading, setLoading] = useState(true)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null)
  const [context, setContext] = useState<PlatformContextDto | null>(null)
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [aiReadiness, setAiReadiness] = useState<AiReadinessDto | null>(null)

  const canManageUsers = canAccess(undefined, ['CanManageUsers'])

  async function loadWorkspace(currentUnreadOnly: boolean) {
    setLoading(true)

    const [contextResult, notificationsResult, aiReadinessResult] = await Promise.allSettled([
      platformService.getContext(),
      platformService.getNotifications(currentUnreadOnly),
      canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null)
    ])

    setContext(contextResult.status === 'fulfilled' ? contextResult.value : null)
    setNotifications(notificationsResult.status === 'fulfilled' ? notificationsResult.value : [])
    setAiReadiness(aiReadinessResult.status === 'fulfilled' ? aiReadinessResult.value : null)
    setLoading(false)
  }

  useEffect(() => {
    void loadWorkspace(unreadOnly)
  }, [canManageUsers, unreadOnly])

  async function acknowledgeNotification(notificationId: string) {
    setAcknowledgingId(notificationId)

    try {
      await platformService.acknowledgeNotification(notificationId)
      await loadWorkspace(unreadOnly)
    } finally {
      setAcknowledgingId(null)
    }
  }

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications])
  const enabledAiUseCases = aiReadiness?.useCases.filter((item) => item.enabled).length ?? 0

  if (loading) {
    return <Spinner fullPage label="Loading tenant workspace" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Tenant"
        title="Tenant workspace"
        description="The current backend exposes tenant context, notifications, and platform readiness rather than company CRUD. This screen is aligned to that contract."
        actions={
          <button type="button" className="ghost-button" onClick={() => setUnreadOnly((current) => !current)}>
            {unreadOnly ? 'Show all notifications' : 'Show unread only'}
          </button>
        }
      />

      <section className="stat-grid">
        <StatCard label="Assigned roles" value={user?.roles.length ?? 0} format="number" subtitle="Current tenant access scope" />
        <StatCard label="Unread notifications" value={unreadCount} format="number" subtitle="Open platform feed items" />
        <StatCard label="Permission grants" value={user?.permissions.length ?? 0} format="number" subtitle="Effective permission set" />
        <StatCard label="Enabled AI use cases" value={enabledAiUseCases} format="number" subtitle="Admin-visible readiness catalog" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Tenant context</h3>
              <p>Header and claim values used by the microservices for tenant isolation.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Workspace identity</h4>
              <dl className="detail-list">
                <div>
                  <dt>Tenant id</dt>
                  <dd>{context?.tenantId || user?.tenantId || '-'}</dd>
                </div>
                <div>
                  <dt>User id</dt>
                  <dd>{context?.userId || user?.userId || '-'}</dd>
                </div>
                <div>
                  <dt>User name</dt>
                  <dd>{context?.userName || user?.userName || '-'}</dd>
                </div>
                <div>
                  <dt>Correlation id</dt>
                  <dd>{context?.correlationId || '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>Runtime contract</h4>
              <div className="stack-list">
                <div className="list-row list-row--stacked">
                  <div>
                    <strong>X-Tenant-Id must match the JWT tenant</strong>
                    <p>The platform rejects authenticated API calls when the tenant header and token claims differ.</p>
                  </div>
                  <StatusBadge label="Isolation enforced" tone="warning" />
                </div>
                <div className="list-row list-row--stacked">
                  <div>
                    <strong>Notifications are the tenant-facing feed</strong>
                    <p>Company settings and tenant CRUD are not currently exposed by the backend services.</p>
                  </div>
                  <StatusBadge label="Backend-aligned" tone="info" />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>AI readiness</h3>
              <p>Administrative AI and integration readiness published by the platform.</p>
            </div>
          </div>
          {aiReadiness ? (
            <div className="stack-list">
              <div className="list-row">
                <div>
                  <strong>{aiReadiness.provider}</strong>
                  <p>Provider / orchestration setting</p>
                </div>
                <StatusBadge label={aiReadiness.aiEnabled ? 'Enabled' : 'Disabled'} tone={aiReadiness.aiEnabled ? 'success' : 'warning'} />
              </div>
              {aiReadiness.useCases.map((item) => (
                <div key={item.name} className="list-row">
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.dataSource} / {item.integrationPattern}
                    </p>
                  </div>
                  <StatusBadge label={item.enabled ? 'Active' : 'Inactive'} tone={item.enabled ? 'success' : 'neutral'} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Admin-only readiness data"
              description="AI readiness is exposed only to users with the user-management permission."
              compact
            />
          )}
        </article>
      </section>

      <DataTable
        title="Tenant notifications"
        description="Notifications are available to all authenticated users and can be acknowledged from the workspace."
        columns={[
          {
            key: 'createdAt',
            title: 'Created',
            sortable: true,
            render: (row) => formatDateTime(row.createdAt)
          },
          {
            key: 'title',
            title: 'Notification',
            sortable: true,
            render: (row) => (
              <div className="table-primary">
                <strong>{row.title}</strong>
                <span>{row.type}</span>
              </div>
            )
          },
          {
            key: 'message',
            title: 'Message',
            render: (row) => row.message
          },
          {
            key: 'severity',
            title: 'Severity',
            sortable: true,
            render: (row) => <StatusBadge label={row.severity} tone={severityTone(row.severity)} />
          },
          {
            key: 'isRead',
            title: 'Status',
            sortable: true,
            render: (row) => <StatusBadge label={row.isRead ? 'Acknowledged' : 'Unread'} tone={row.isRead ? 'success' : 'warning'} />
          },
          {
            key: 'actions',
            title: 'Actions',
            render: (row) =>
              row.isRead ? (
                'Acknowledged'
              ) : (
                <button
                  type="button"
                  className="ghost-button"
                  disabled={acknowledgingId === row.id}
                  onClick={() => void acknowledgeNotification(row.id)}
                >
                  {acknowledgingId === row.id ? 'Updating...' : 'Acknowledge'}
                </button>
              )
          }
        ]}
        data={notifications}
        rowKey="id"
        searchKeys={['title', 'type', 'message', 'severity']}
        searchPlaceholder="Search notifications"
        emptyTitle="No notifications"
        emptyDescription="The tenant feed is currently clear."
      />
    </div>
  )
}
