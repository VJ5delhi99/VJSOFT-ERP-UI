import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { apiConfig } from '../config/api'
import { useAuth } from '../hooks/useAuth'
import { platformService } from '../services/platformService'
import type { AiReadinessDto, PlatformContextDto } from '../types'
import { formatDateTime } from '../utils/format'

interface ServiceRow {
  id: string
  service: string
  url: string
  note: string
}

export default function Settings() {
  const { user, expiresAtUtc, canAccess } = useAuth()
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState<PlatformContextDto | null>(null)
  const [aiReadiness, setAiReadiness] = useState<AiReadinessDto | null>(null)

  const canManageUsers = canAccess(undefined, ['CanManageUsers'])

  useEffect(() => {
    let isMounted = true

    async function loadSettings() {
      setLoading(true)

      const [contextResult, aiReadinessResult] = await Promise.allSettled([
        platformService.getContext(),
        canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null)
      ])

      if (!isMounted) {
        return
      }

      setContext(contextResult.status === 'fulfilled' ? contextResult.value : null)
      setAiReadiness(aiReadinessResult.status === 'fulfilled' ? aiReadinessResult.value : null)
      setLoading(false)
    }

    void loadSettings()

    return () => {
      isMounted = false
    }
  }, [canManageUsers])

  const services = useMemo<ServiceRow[]>(
    () =>
      Object.entries(apiConfig.services).map(([service, url]) => ({
        id: service,
        service,
        url,
        note:
          service === 'platform'
            ? 'Handles shared workspace details, updates, and admin tools.'
            : 'Set from configuration for this area of the ERP.'
      })),
    []
  )

  if (loading) {
    return <Spinner fullPage label="Loading settings" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Settings"
        title="System settings"
        description="Review sign-in details, connected services, and AI setup for this workspace."
      />

      <section className="stat-grid">
        <StatCard label="Connected services" value={services.length} format="number" subtitle="Available system connections" />
        <StatCard label="Assigned roles" value={user?.roles.length ?? 0} format="number" subtitle="Roles on this account" />
        <StatCard label="Effective permissions" value={user?.permissions.length ?? 0} format="number" subtitle="Available actions" />
        <StatCard
          label="AI use cases"
          value={aiReadiness?.useCases.filter((item) => item.enabled).length ?? 0}
          format="number"
          subtitle="Active AI setup items"
        />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Session details</h3>
              <p>Current sign-in details for this workspace.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Signed-in user</h4>
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
                  <dt>Expires</dt>
                  <dd>{expiresAtUtc ? formatDateTime(expiresAtUtc) : '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>System details</h4>
              <dl className="detail-list">
                <div>
                  <dt>Environment</dt>
                  <dd>{apiConfig.environment}</dd>
                </div>
                <div>
                  <dt>Support reference</dt>
                  <dd>{context?.correlationId || '-'}</dd>
                </div>
                <div>
                  <dt>Request timeout</dt>
                  <dd>{apiConfig.requestTimeoutMs} ms</dd>
                </div>
                <div>
                  <dt>Auth device id</dt>
                  <dd>{apiConfig.authDeviceId}</dd>
                </div>
              </dl>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Connection notes</h3>
              <p>Helpful reminders about how this workspace connects to the ERP.</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="list-row list-row--stacked">
              <div>
                <strong>Connections are config-driven</strong>
                <p>Each module uses the shared service list instead of storing addresses inside pages.</p>
              </div>
              <StatusBadge label="Configured" tone="success" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Workspace information is sent with each request</strong>
                <p>The app includes the signed-in workspace so each service returns the right data.</p>
              </div>
              <StatusBadge label="Required" tone="warning" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Browsers must be allowed to reach each service</strong>
                <p>If the app and APIs run on different addresses, those connections must be allowed in the environment.</p>
              </div>
              <StatusBadge label="Check setup" tone="danger" />
            </div>
          </div>
        </article>
      </section>

      <DataTable
        title="Connected services"
        description="Connection details for each ERP area."
        columns={[
          {
            key: 'service',
            title: 'Service',
            sortable: true,
            render: (row) => (
              <div className="table-primary">
                <strong>{row.service}</strong>
                <span>{row.note}</span>
              </div>
            )
          },
          {
            key: 'url',
            title: 'Address',
            render: (row) => row.url
          }
        ]}
        data={services}
        rowKey="id"
        searchKeys={['service', 'url', 'note']}
        searchPlaceholder="Search services"
      />

      <article className="surface-card">
        <div className="section-heading">
          <div>
            <h3>AI setup</h3>
            <p>Available AI provider and use-case setup for this workspace.</p>
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
    </div>
  )
}
