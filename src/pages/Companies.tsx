import { useEffect, useMemo, useState } from 'react'
import { formatOrganizationName, formatRoleName } from '@shared/index'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../hooks/useAuth'
import { operationsService } from '../services/operationsService'
import { platformService } from '../services/platformService'
import type { AiReadinessDto, NotificationDto, OrganizationOverviewDto, PlatformContextDto, ServiceHealthDto } from '../types'
import { formatCurrency, formatDateTime } from '../utils/format'

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
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthDto[]>([])
  const [organizationOverview, setOrganizationOverview] = useState<OrganizationOverviewDto | null>(null)

  const canManageUsers = canAccess(undefined, ['CanManageUsers'])

  async function loadOrganizationHub(currentUnreadOnly: boolean) {
    setLoading(true)

    const [contextResult, notificationsResult, aiReadinessResult, serviceHealthResult, overviewResult] = await Promise.allSettled([
      platformService.getContext(),
      platformService.getNotifications(currentUnreadOnly),
      canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null),
      canManageUsers ? operationsService.getServiceHealth() : Promise.resolve([]),
      platformService.getOrganizationOverview()
    ])

    setContext(contextResult.status === 'fulfilled' ? contextResult.value : null)
    setNotifications(notificationsResult.status === 'fulfilled' ? notificationsResult.value : [])
    setAiReadiness(aiReadinessResult.status === 'fulfilled' ? aiReadinessResult.value : null)
    setServiceHealth(serviceHealthResult.status === 'fulfilled' ? serviceHealthResult.value : [])
    setOrganizationOverview(overviewResult.status === 'fulfilled' ? overviewResult.value : null)
    setLoading(false)
  }

  useEffect(() => {
    void loadOrganizationHub(unreadOnly)
  }, [canManageUsers, unreadOnly])

  async function acknowledgeNotification(notificationId: string) {
    setAcknowledgingId(notificationId)

    try {
      await platformService.acknowledgeNotification(notificationId)
      await loadOrganizationHub(unreadOnly)
    } finally {
      setAcknowledgingId(null)
    }
  }

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications])
  const enabledAiUseCases = aiReadiness?.useCases.filter((item) => item.enabled).length ?? 0
  const onlineServices = serviceHealth.filter((item) => item.status === 'online').length
  const organizationName = formatOrganizationName(context?.tenantId || user?.tenantId)

  if (loading) {
    return <Spinner fullPage label="Loading organization hub" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Organization Hub"
        title={organizationName}
        description="Review business health, organization updates, and readiness indicators from one place."
        actions={
          <button type="button" className="ghost-button" onClick={() => setUnreadOnly((current) => !current)}>
            {unreadOnly ? 'Show all updates' : 'Show unread only'}
          </button>
        }
      />

      <section className="stat-grid">
        <StatCard label="Open orders" value={organizationOverview?.openOrders ?? 0} format="number" subtitle="Customer commitments still in progress" />
        <StatCard
          label="Low-stock items"
          value={organizationOverview?.lowStockProducts ?? 0}
          format="number"
          subtitle="Items that need replenishment attention"
        />
        <StatCard
          label="Outstanding balance"
          value={organizationOverview?.outstandingBalance ?? 0}
          format="currency"
          subtitle="Open receivables still awaiting collection"
        />
        <StatCard label="Unread updates" value={unreadCount} format="number" subtitle="New organization notices and alerts" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Organization profile</h3>
              <p>Business context, access posture, and support details for this company.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Company context</h4>
              <dl className="detail-list">
                <div>
                  <dt>Organization</dt>
                  <dd>{organizationName}</dd>
                </div>
                <div>
                  <dt>Organization ID</dt>
                  <dd>{context?.tenantId || user?.tenantId || '-'}</dd>
                </div>
                <div>
                  <dt>Support reference</dt>
                  <dd>{context?.correlationId || '-'}</dd>
                </div>
                <div>
                  <dt>Signed-in user</dt>
                  <dd>{context?.userName || user?.userName || '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>Access posture</h4>
              <div className="stack-list">
                <div className="list-row list-row--stacked">
                  <div>
                    <strong>Active access roles</strong>
                    <p>{user?.roles.map((role) => formatRoleName(role)).join(', ') || 'No active roles'}</p>
                  </div>
                  <StatusBadge label={`${user?.roles.length ?? 0} roles`} tone="info" />
                </div>
                <div className="list-row list-row--stacked">
                  <div>
                    <strong>Operational coverage</strong>
                    <p>{onlineServices > 0 ? `${onlineServices} services are responding to health checks.` : 'Service health data is limited for this account.'}</p>
                  </div>
                  <StatusBadge label={onlineServices > 0 ? 'Connected' : 'Limited'} tone={onlineServices > 0 ? 'success' : 'warning'} />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Readiness overview</h3>
              <p>Signals that help determine whether the organization is ready for scaled daily use.</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="list-row list-row--stacked">
              <div>
                <strong>Catalog and stock visibility</strong>
                <p>
                  {organizationOverview
                    ? `${organizationOverview.activeProducts} active products with ${organizationOverview.lowStockProducts} items needing replenishment follow-up.`
                    : 'Catalog visibility is not available for this account.'}
                </p>
              </div>
              <StatusBadge label={organizationOverview ? 'Available' : 'Restricted'} tone={organizationOverview ? 'success' : 'warning'} />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Finance follow-up posture</strong>
                <p>
                  {organizationOverview
                    ? `${organizationOverview.overdueInvoices} past-due invoices with ${formatCurrency(organizationOverview.outstandingBalance)} still awaiting collection.`
                    : 'Finance visibility is not available for this account.'}
                </p>
              </div>
              <StatusBadge label={organizationOverview ? 'Tracked' : 'Restricted'} tone={organizationOverview ? 'info' : 'warning'} />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Open operational workload</strong>
                <p>
                  {organizationOverview
                    ? `${organizationOverview.openProjects} projects, ${organizationOverview.openTickets} service cases, and ${organizationOverview.openWorkOrders} work orders are still open.`
                    : 'Operational workload is not available right now.'}
                </p>
              </div>
              <StatusBadge label={organizationOverview ? 'Visible' : 'Restricted'} tone={organizationOverview ? 'success' : 'warning'} />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>AI and automation readiness</strong>
                <p>
                  {aiReadiness
                    ? `${enabledAiUseCases} active AI use cases with ${aiReadiness.provider} as the configured provider.`
                    : 'AI readiness details are limited to administrators.'}
                </p>
              </div>
              <StatusBadge label={aiReadiness?.aiEnabled ? 'Enabled' : aiReadiness ? 'Configured' : 'Restricted'} tone={aiReadiness?.aiEnabled ? 'success' : 'warning'} />
            </div>
          </div>
        </article>
      </section>

      <DataTable
        title="Organization updates"
        description="Review organization notices and mark them as read from this hub."
        columns={[
          {
            key: 'createdAt',
            title: 'Created',
            sortable: true,
            render: (row) => formatDateTime(row.createdAt)
          },
          {
            key: 'title',
            title: 'Update',
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
            title: 'Details',
            render: (row) => row.message
          },
          {
            key: 'severity',
            title: 'Priority',
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
            title: 'Action',
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
        searchPlaceholder="Search organization updates"
        emptyTitle="No organization updates"
        emptyDescription="This organization is up to date."
      />

      {canManageUsers ? (
        <DataTable
          title="Service readiness"
          description="Service health checks available to administrators."
          columns={[
            {
              key: 'service',
              title: 'Service',
              sortable: true,
              render: (row) => (
                <div className="table-primary">
                  <strong>{row.service}</strong>
                  <span>{row.area}</span>
                </div>
              )
            },
            {
              key: 'statusLabel',
              title: 'Status',
              sortable: true,
              render: (row) => <StatusBadge label={row.statusLabel} tone={row.status === 'online' ? 'success' : row.status === 'degraded' ? 'warning' : 'danger'} />
            },
            {
              key: 'detail',
              title: 'Operational note',
              render: (row) => row.detail
            }
          ]}
          data={serviceHealth}
          rowKey="id"
          searchKeys={['service', 'area', 'detail', 'statusLabel']}
          searchPlaceholder="Search service readiness"
          emptyTitle="No readiness data"
          emptyDescription="Service readiness data is not available right now."
        />
      ) : (
        <EmptyState title="Admin readiness data is limited" description="Service readiness and AI setup details are available to administrators only." compact />
      )}
    </div>
  )
}
