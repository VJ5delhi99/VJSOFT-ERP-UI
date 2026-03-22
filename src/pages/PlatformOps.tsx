import { useEffect, useMemo, useState } from 'react'
import { formatOrganizationName } from '@shared/index'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { operationsService } from '../services/operationsService'
import { platformService } from '../services/platformService'
import type { AuditTrailEntryDto, NotificationDto, OutboxMessageDto, PlatformContextDto, PlatformOperationsSummaryDto, ServiceHealthDto } from '../types'
import { formatDateTime, formatRelative } from '../utils/format'

function healthTone(status: ServiceHealthDto['status']) {
  switch (status) {
    case 'online':
      return 'success' as const
    case 'degraded':
      return 'warning' as const
    default:
      return 'danger' as const
  }
}

function messageTone(status: string) {
  switch (status.toLowerCase()) {
    case 'processed':
    case 'published':
    case 'success':
      return 'success' as const
    case 'failed':
    case 'error':
      return 'danger' as const
    case 'retry':
    case 'pending':
    case 'inflight':
      return 'warning' as const
    default:
      return 'info' as const
  }
}

function severityTone(value: string) {
  switch (value.toLowerCase()) {
    case 'critical':
    case 'high':
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

export default function PlatformOps() {
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState<PlatformContextDto | null>(null)
  const [operationsSummary, setOperationsSummary] = useState<PlatformOperationsSummaryDto | null>(null)
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthDto[]>([])
  const [auditTrail, setAuditTrail] = useState<AuditTrailEntryDto[]>([])
  const [outboxMessages, setOutboxMessages] = useState<OutboxMessageDto[]>([])
  const [notifications, setNotifications] = useState<NotificationDto[]>([])

  useEffect(() => {
    let isMounted = true

    async function loadPlatformOps() {
      setLoading(true)

      const [contextResult, summaryResult, serviceHealthResult, auditResult, outboxResult, notificationResult] = await Promise.allSettled([
        platformService.getContext(),
        platformService.getOperationsSummary(),
        operationsService.getServiceHealth(),
        platformService.getAudit(40),
        platformService.getOutbox(undefined, 40),
        platformService.getNotifications(false)
      ])

      if (!isMounted) {
        return
      }

      setContext(contextResult.status === 'fulfilled' ? contextResult.value : null)
      setOperationsSummary(summaryResult.status === 'fulfilled' ? summaryResult.value : null)
      setServiceHealth(serviceHealthResult.status === 'fulfilled' ? serviceHealthResult.value : [])
      setAuditTrail(auditResult.status === 'fulfilled' ? auditResult.value : [])
      setOutboxMessages(outboxResult.status === 'fulfilled' ? outboxResult.value : [])
      setNotifications(notificationResult.status === 'fulfilled' ? notificationResult.value.slice(0, 8) : [])
      setLoading(false)
    }

    void loadPlatformOps()

    return () => {
      isMounted = false
    }
  }, [])

  const healthyServices = useMemo(() => serviceHealth.filter((item) => item.status === 'online').length, [serviceHealth])
  const servicesNeedingReview = useMemo(() => serviceHealth.filter((item) => item.status !== 'online').length, [serviceHealth])
  const deliveryBacklog = operationsSummary?.pendingOutboxMessages ?? outboxMessages.filter((item) => ['pending', 'retry', 'inflight', 'failed', 'error'].includes(item.status.toLowerCase())).length
  const unreadUpdates = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications])
  const issueFeed = useMemo(
    () =>
      notifications
        .filter((item) => ['critical', 'high', 'warning', 'medium'].includes(item.severity.toLowerCase()))
        .slice(0, 5),
    [notifications]
  )

  if (loading) {
    return <Spinner fullPage label="Loading platform operations" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Platform Operations"
        title="Platform operations"
        description="Track service health, delivery backlog, audit activity, and support diagnostics from one admin control center."
      />

      <section className="stat-grid">
        <StatCard label="Healthy services" value={healthyServices} format="number" subtitle="Responding to health checks" />
        <StatCard label="Needs review" value={servicesNeedingReview} format="number" subtitle="Services with degraded or offline status" />
        <StatCard label="Unread updates" value={operationsSummary?.unreadNotifications ?? unreadUpdates} format="number" subtitle="Platform and organization updates" />
        <StatCard label="Delivery backlog" value={deliveryBacklog} format="number" subtitle="Messages waiting for delivery or retry" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Support context</h3>
              <p>Reference details to use when reviewing activity or troubleshooting issues.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Organization</h4>
              <dl className="detail-list">
                <div>
                  <dt>Organization</dt>
                  <dd>{formatOrganizationName(context?.tenantId || null)}</dd>
                </div>
                <div>
                  <dt>Organization ID</dt>
                  <dd>{context?.tenantId || '-'}</dd>
                </div>
                <div>
                  <dt>Support reference</dt>
                  <dd>{operationsSummary?.correlationId || context?.correlationId || '-'}</dd>
                </div>
              </dl>
            </div>
            <div className="detail-card">
              <h4>Platform posture</h4>
              <dl className="detail-list">
                <div>
                  <dt>Durable database</dt>
                  <dd>{operationsSummary?.usesDurableDatabase ? 'Enabled' : 'Local file persistence'}</dd>
                </div>
                <div>
                  <dt>Dead-letter backlog</dt>
                  <dd>{operationsSummary?.deadLetteredOutboxMessages ?? 0}</dd>
                </div>
                <div>
                  <dt>Recent audit records</dt>
                  <dd>{operationsSummary?.recentAuditEntries ?? auditTrail.length}</dd>
                </div>
                <div>
                  <dt>Current operator</dt>
                  <dd>{context?.userName || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Priority issues</h3>
              <p>The latest warnings and updates that may need platform follow-up.</p>
            </div>
          </div>
          {issueFeed.length === 0 ? (
            <EmptyState title="No urgent platform issues" description="There are no high-priority updates to review right now." compact />
          ) : (
            <div className="stack-list">
              {issueFeed.map((item) => (
                <div key={item.id} className="list-row list-row--stacked">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    <small>{formatRelative(item.createdAt)}</small>
                  </div>
                  <StatusBadge label={item.severity} tone={severityTone(item.severity)} />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <DataTable
        title="Service health"
        description="Live health checks across the ERP service estate."
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
            render: (row) => <StatusBadge label={row.statusLabel} tone={healthTone(row.status)} />
          },
          {
            key: 'detail',
            title: 'Operational note',
            render: (row) => row.detail
          },
          {
            key: 'checkedAt',
            title: 'Checked',
            sortable: true,
            render: (row) => formatDateTime(row.checkedAt)
          }
        ]}
        data={serviceHealth}
        rowKey="id"
        searchKeys={['service', 'area', 'statusLabel', 'detail']}
        searchPlaceholder="Search services"
        emptyTitle="No service health data"
        emptyDescription="Health checks are not available right now."
      />

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Message delivery"
          description="Delivery status for platform messages and integrations."
          columns={[
            {
              key: 'occurredAt',
              title: 'Occurred',
              sortable: true,
              render: (row) => formatDateTime(row.occurredAt)
            },
            {
              key: 'topic',
              title: 'Message',
              sortable: true,
              render: (row) => (
                <div className="table-primary">
                  <strong>{row.topic}</strong>
                  <span>{row.eventType}</span>
                </div>
              )
            },
            {
              key: 'status',
              title: 'Status',
              sortable: true,
              render: (row) => <StatusBadge label={row.status} tone={messageTone(row.status)} />
            },
            {
              key: 'attemptCount',
              title: 'Attempts',
              align: 'right',
              sortable: true
            }
          ]}
          data={outboxMessages}
          rowKey="id"
          searchKeys={['topic', 'eventType', 'aggregateType', 'status']}
          searchPlaceholder="Search delivery backlog"
          emptyTitle="No delivery records"
          emptyDescription="There are no platform delivery records to review."
        />

        <DataTable
          title="Audit trail"
          description="Recent administrative and business events."
          columns={[
            {
              key: 'occurredAt',
              title: 'Occurred',
              sortable: true,
              render: (row) => formatDateTime(row.occurredAt)
            },
            {
              key: 'userName',
              title: 'Actor',
              sortable: true
            },
            {
              key: 'action',
              title: 'Action',
              sortable: true,
              render: (row) => (
                <div className="table-primary">
                  <strong>{row.action}</strong>
                  <span>{row.entityType}</span>
                </div>
              )
            },
            {
              key: 'outcome',
              title: 'Outcome',
              sortable: true,
              render: (row) => <StatusBadge label={row.outcome} tone={messageTone(row.outcome)} />
            }
          ]}
          data={auditTrail}
          rowKey="id"
          searchKeys={['userName', 'action', 'entityType', 'details', 'correlationId']}
          searchPlaceholder="Search audit trail"
          emptyTitle="No audit activity"
          emptyDescription="There are no recent audit records to review."
        />
      </section>
    </div>
  )
}
