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
    return <Spinner fullPage label="Loading access control workspace" />
  }

  const pendingOutbox = outboxMessages.filter((item) =>
    ['pending', 'retry', 'inflight'].includes(item.status.toLowerCase())
  ).length

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Access"
        title="Access control"
        description="The backend exposes authenticated user context, audit, outbox, and role policy metadata. User provisioning itself remains owned by AuthService rather than a CRUD API."
      />

      <section className="stat-grid">
        <StatCard label="Assigned roles" value={user?.roles.length ?? 0} format="number" subtitle="Current authenticated principal" />
        <StatCard label="Effective permissions" value={user?.permissions.length ?? 0} format="number" subtitle="Resolved from role catalog" />
        <StatCard label="Audit entries" value={auditTrail.length} format="number" subtitle="Recent platform audit trail" />
        <StatCard label="Pending outbox" value={pendingOutbox} format="number" subtitle="Messages awaiting downstream delivery" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Current principal</h3>
              <p>AuthService identity and runtime tenant context for the signed-in user.</p>
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
                  <dt>Tenant</dt>
                  <dd>{user?.tenantId || '-'}</dd>
                </div>
                <div>
                  <dt>Active</dt>
                  <dd>{user?.isActive ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>Platform context</h4>
              <dl className="detail-list">
                <div>
                  <dt>User id</dt>
                  <dd>{context?.userId || '-'}</dd>
                </div>
                <div>
                  <dt>Correlation id</dt>
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
              <h3>Backend capability boundary</h3>
              <p>The current platform does not expose `/api/users` or tenant CRUD endpoints.</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="list-row list-row--stacked">
              <div>
                <strong>User lifecycle remains service-owned</strong>
                <p>Frontend RBAC is enforced from JWT roles and permissions plus backend authorization policies.</p>
              </div>
              <StatusBadge label="Auth contract" tone="info" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Audit and outbox are operational controls</strong>
                <p>Admin users can review changes, integration events, and role coverage without fabricating unsupported CRUD flows.</p>
              </div>
              <StatusBadge label="Platform APIs" tone="success" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Role policies drive UI visibility</strong>
                <p>Page access and action buttons follow the same policy boundaries used by the microservices.</p>
              </div>
              <StatusBadge label="RBAC aligned" tone="warning" />
            </div>
          </div>
        </article>
      </section>

      <DataTable
        title="Role catalog"
        description="Roles and effective permissions mirrored from the backend authorization catalog."
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
            title: 'Module coverage',
            render: (row) => row.modules.join(', ') || 'Authenticated only'
          },
          {
            key: 'permissions',
            title: 'Permissions',
            render: (row) => (row.permissions.length > 0 ? row.permissions.join(', ') : 'Inherited by role only')
          }
        ]}
        data={roleMatrix}
        rowKey="id"
        searchKeys={['role', 'modules', 'permissions']}
        searchPlaceholder="Search roles, modules, or permissions"
      />

      <DataTable
        title="Audit trail"
        description="Recent platform actions visible to administrators with user-management permission."
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
        searchPlaceholder="Search audit records"
        emptyTitle="No audit activity"
        emptyDescription="No audit entries were returned for the current tenant."
      />

      <DataTable
        title="Outbox monitor"
        description="Operational integration messages emitted by the platform outbox."
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
            title: 'Aggregate',
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
        searchPlaceholder="Search outbox messages"
        emptyTitle="No outbox messages"
        emptyDescription="No integration events were returned for the current tenant."
      />

      {auditTrail.length === 0 && outboxMessages.length === 0 ? (
        <EmptyState title="Admin telemetry is quiet" description="Audit and outbox streams did not return recent entries." compact />
      ) : null}
    </div>
  )
}
