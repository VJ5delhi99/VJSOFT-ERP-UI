import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { erpRoles, roleGroups, rolePermissionMap } from '../config/rbac'
import { useAuth } from '../hooks/useAuth'
import { platformService } from '../services/platformService'
import type { AuditTrailEntryDto, OutboxMessageDto, PlatformContextDto, Permission, UserRole } from '../types'
import { formatDateTime } from '../utils/format'

interface RoleMatrixRow {
  id: string
  role: UserRole
  permissions: Permission[]
  modules: string[]
}

function toneFromStatus(value: string) {
  switch (value.toLowerCase()) {
    case 'success':
    case 'processed':
    case 'published':
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

function modulesForRole(role: UserRole) {
  const modules = []

  if (roleGroups.catalogAccess.includes(role)) {
    modules.push('Catalog')
  }
  if (roleGroups.inventoryAccess.includes(role)) {
    modules.push('Inventory')
  }
  if (roleGroups.salesAccess.includes(role)) {
    modules.push('Sales')
  }
  if (roleGroups.financeAccess.includes(role)) {
    modules.push('Finance')
  }
  if (roleGroups.operationsAccess.includes(role)) {
    modules.push('Operations')
  }

  return modules
}

export default function Users() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState<PlatformContextDto | null>(null)
  const [auditTrail, setAuditTrail] = useState<AuditTrailEntryDto[]>([])
  const [outboxMessages, setOutboxMessages] = useState<OutboxMessageDto[]>([])

  const roleMatrix = useMemo<RoleMatrixRow[]>(
    () =>
      erpRoles.map((role) => ({
        id: role,
        role,
        permissions: rolePermissionMap[role],
        modules: modulesForRole(role)
      })),
    []
  )

  useEffect(() => {
    let isMounted = true

    async function loadAccessControl() {
      setLoading(true)

      const [contextResult, auditResult, outboxResult] = await Promise.allSettled([
        platformService.getContext(),
        platformService.getAudit(25),
        platformService.getOutbox(undefined, 25)
      ])

      if (!isMounted) {
        return
      }

      setContext(contextResult.status === 'fulfilled' ? contextResult.value : null)
      setAuditTrail(auditResult.status === 'fulfilled' ? auditResult.value : [])
      setOutboxMessages(outboxResult.status === 'fulfilled' ? outboxResult.value : [])
      setLoading(false)
    }

    void loadAccessControl()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <Spinner fullPage label="Loading access information" />
  }

  const pendingOutbox = outboxMessages.filter((item) =>
    ['pending', 'retry', 'inflight'].includes(item.status.toLowerCase())
  ).length

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Access"
        title="User access"
        description="Review access roles, recent activity, and message delivery in one place."
      />

      <section className="stat-grid">
        <StatCard label="Assigned roles" value={user?.roles.length ?? 0} format="number" subtitle="Roles on this account" />
        <StatCard label="Effective permissions" value={user?.permissions.length ?? 0} format="number" subtitle="Available actions" />
        <StatCard label="Recent activity" value={auditTrail.length} format="number" subtitle="Latest access and admin changes" />
        <StatCard label="Pending messages" value={pendingOutbox} format="number" subtitle="Updates waiting to be delivered" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Signed-in user</h3>
              <p>Signed-in user details and current workspace information.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Identity</h4>
              <dl className="detail-list">
                <div>
                  <dt>User</dt>
                  <dd>{user?.userName || '-'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{user?.email || '-'}</dd>
                </div>
                <div>
                  <dt>Workspace</dt>
                  <dd>{user?.tenantId || '-'}</dd>
                </div>
                <div>
                  <dt>Active</dt>
                  <dd>{user?.isActive ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>Session details</h4>
              <dl className="detail-list">
                <div>
                  <dt>User id</dt>
                  <dd>{context?.userId || '-'}</dd>
                </div>
                <div>
                  <dt>Support reference</dt>
                  <dd>{context?.correlationId || '-'}</dd>
                </div>
                <div>
                  <dt>Roles</dt>
                  <dd>{user?.roles.join(', ') || '-'}</dd>
                </div>
                <div>
                  <dt>Permissions</dt>
                  <dd>{user?.permissions.join(', ') || 'No direct permissions'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>What this page covers</h3>
              <p>This area focuses on user access, activity history, and message delivery.</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="list-row list-row--stacked">
              <div>
                <strong>User access is role-based</strong>
                <p>Pages and actions follow the same role and permission rules used by the backend.</p>
              </div>
              <StatusBadge label="Access rules" tone="info" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Activity and message delivery are visible here</strong>
                <p>Administrators can review recent changes and outbound updates from one page.</p>
              </div>
              <StatusBadge label="Admin tools" tone="success" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Visibility stays aligned with access</strong>
                <p>Menu items and buttons only appear when the signed-in role can use them.</p>
              </div>
              <StatusBadge label="Aligned" tone="warning" />
            </div>
          </div>
        </article>
      </section>

      <DataTable
        title="Roles and access"
        description="Roles and the actions available to each one."
        columns={[
          {
            key: 'role',
            title: 'Role',
            sortable: true,
            render: (row) => (
              <div className="table-primary">
                <strong>{row.role}</strong>
                <span>{row.modules.join(', ') || 'General access'}</span>
              </div>
            )
          },
          {
            key: 'modules',
            title: 'Areas',
            render: (row) => row.modules.join(', ') || 'Signed-in access only'
          },
          {
            key: 'permissions',
            title: 'Permissions',
            render: (row) => (row.permissions.length > 0 ? row.permissions.join(', ') : 'Handled through the role')
          }
        ]}
        data={roleMatrix}
        rowKey="id"
        searchKeys={['role', 'modules', 'permissions']}
        searchPlaceholder="Search roles, areas, or permissions"
      />

      <DataTable
        title="Recent activity"
        description="Recent access and admin changes."
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
            render: (row) => <StatusBadge label={row.outcome} tone={toneFromStatus(row.outcome)} />
          },
          {
            key: 'details',
            title: 'Details',
            render: (row) => row.details
          }
        ]}
        data={auditTrail}
        rowKey="id"
        searchKeys={['userName', 'action', 'entityType', 'details']}
        searchPlaceholder="Search recent activity"
        emptyTitle="No recent activity"
        emptyDescription="There are no recent access or admin updates to review."
      />

      <DataTable
        title="Message delivery"
        description="Outbound messages and delivery progress."
        columns={[
          {
            key: 'occurredAt',
            title: 'Occurred',
            sortable: true,
            render: (row) => formatDateTime(row.occurredAt)
          },
          {
            key: 'topic',
            title: 'Topic',
            sortable: true,
            render: (row) => (
              <div className="table-primary">
                <strong>{row.topic}</strong>
                <span>{row.eventType}</span>
              </div>
            )
          },
          {
            key: 'aggregateType',
            title: 'Reference',
            sortable: true,
            render: (row) => `${row.aggregateType}${row.aggregateId ? ` / ${row.aggregateId}` : ''}`
          },
          {
            key: 'status',
            title: 'Status',
            sortable: true,
            render: (row) => <StatusBadge label={row.status} tone={toneFromStatus(row.status)} />
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
        searchPlaceholder="Search messages"
        emptyTitle="No messages"
        emptyDescription="There are no outbound messages to review right now."
      />

      {auditTrail.length === 0 && outboxMessages.length === 0 ? (
        <EmptyState title="Nothing new to review" description="Recent activity and message delivery are both clear right now." compact />
      ) : null}
    </div>
  )
}
