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
    return <Spinner fullPage label="Loading workspace information" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Workspace"
        title="Workspace updates"
        description="Review workspace details, recent updates, and available AI setup."
        actions={
          <button type="button" className="ghost-button" onClick={() => setUnreadOnly((current) => !current)}>
            {unreadOnly ? 'Show all updates' : 'Show unread only'}
          </button>
        }
      />

      <section className="stat-grid">
        <StatCard label="Assigned roles" value={user?.roles.length ?? 0} format="number" subtitle="Roles on this workspace" />
        <StatCard label="Unread updates" value={unreadCount} format="number" subtitle="New items to review" />
        <StatCard label="Permissions" value={user?.permissions.length ?? 0} format="number" subtitle="Available actions" />
        <StatCard label="Active AI use cases" value={enabledAiUseCases} format="number" subtitle="Available AI setup" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Workspace details</h3>
              <p>Workspace details used to keep your data in the right place.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Workspace identity</h4>
              <dl className="detail-list">
                <div>
                  <dt>Workspace id</dt>
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
                  <dt>Support reference</dt>
                  <dd>{context?.correlationId || '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>How access works</h4>
              <div className="stack-list">
                <div className="list-row list-row--stacked">
                  <div>
                    <strong>Workspace checks stay in sync</strong>
                    <p>The system verifies that your signed-in workspace matches each request.</p>
                  </div>
                  <StatusBadge label="Protected" tone="warning" />
                </div>
                <div className="list-row list-row--stacked">
                  <div>
                    <strong>Updates are shared here</strong>
                    <p>Workspace news, reminders, and alerts are collected in one place for every signed-in user.</p>
                  </div>
                  <StatusBadge label="Available" tone="info" />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>AI setup</h3>
              <p>Available AI setup and business use cases for this workspace.</p>
            </div>
          </div>
          {aiReadiness ? (
            <div className="stack-list">
              <div className="list-row">
                <div>
                  <strong>{aiReadiness.provider}</strong>
                  <p>Current provider</p>
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
              title="AI setup is limited"
              description="AI setup details are available only to users who manage access."
              compact
            />
          )}
        </article>
      </section>

      <DataTable
        title="Workspace updates"
        description="Review updates and mark them as read from this page."
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
            render: (row) => <StatusBadge label={row.isRead ? 'Read' : 'Unread'} tone={row.isRead ? 'success' : 'warning'} />
          },
          {
            key: 'actions',
            title: 'Actions',
            render: (row) =>
              row.isRead ? (
                'Read'
              ) : (
                <button
                  type="button"
                  className="ghost-button"
                  disabled={acknowledgingId === row.id}
                  onClick={() => void acknowledgeNotification(row.id)}
                >
                  {acknowledgingId === row.id ? 'Saving...' : 'Mark as read'}
                </button>
              )
          }
        ]}
        data={notifications}
        rowKey="id"
        searchKeys={['title', 'type', 'message', 'severity']}
        searchPlaceholder="Search updates"
        emptyTitle="No updates"
        emptyDescription="Your workspace is up to date."
      />
    </div>
  )
}
