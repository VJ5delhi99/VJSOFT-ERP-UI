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
            ? 'Platform endpoints are mounted on a service host and expose context, notifications, and admin telemetry.'
            : 'Base URL is environment-driven and should map to the corresponding microservice.'
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
        title="Environment settings"
        description="Review session details, service endpoints, and AI readiness settings that affect how the ERP workspace operates."
      />

      <section className="stat-grid">
        <StatCard label="Registered services" value={services.length} format="number" subtitle="Environment URL registry" />
        <StatCard label="Assigned roles" value={user?.roles.length ?? 0} format="number" subtitle="Current session scope" />
        <StatCard label="Effective permissions" value={user?.permissions.length ?? 0} format="number" subtitle="Current RBAC grants" />
        <StatCard
          label="AI use cases"
          value={aiReadiness?.useCases.filter((item) => item.enabled).length ?? 0}
          format="number"
          subtitle="Admin-visible readiness catalog"
        />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Session context</h3>
              <p>Authentication and tenant state persisted in the frontend store.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Authenticated user</h4>
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
                  <dt>Expires</dt>
                  <dd>{expiresAtUtc ? formatDateTime(expiresAtUtc) : '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>Platform runtime</h4>
              <dl className="detail-list">
                <div>
                  <dt>Environment</dt>
                  <dd>{apiConfig.environment}</dd>
                </div>
                <div>
                  <dt>Correlation id</dt>
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
              <h3>Integration notes</h3>
              <p>Operational expectations for frontend to microservice communication.</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="list-row list-row--stacked">
              <div>
                <strong>All services are config-driven</strong>
                <p>Module pages consume the shared service registry through centralized Axios clients instead of embedding hostnames in components.</p>
              </div>
              <StatusBadge label="Config-first" tone="success" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Tenant header must be forwarded</strong>
                <p>The request interceptor attaches the tenant header from the authenticated user and the platform validates it against JWT claims.</p>
              </div>
              <StatusBadge label="Required" tone="warning" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Cross-origin access must be enabled operationally</strong>
                <p>When the frontend runs on a different origin than the services, the backend environment must allow that origin or a proxy must be used.</p>
              </div>
              <StatusBadge label="Deployment check" tone="danger" />
            </div>
          </div>
        </article>
      </section>

      <DataTable
        title="Service registry"
        description="Environment-backed base URLs for each microservice module."
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
            title: 'Base URL',
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
            <h3>AI readiness</h3>
            <p>Admin-only platform readiness exposed through the platform API.</p>
          </div>
        </div>
        {aiReadiness ? (
          <div className="stack-list">
            <div className="list-row">
              <div>
                <strong>{aiReadiness.provider}</strong>
                <p>Configured AI provider</p>
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
            title="AI readiness is restricted"
            description="The platform exposes AI readiness only to users with the user-management permission."
            compact
          />
        )}
      </article>
    </div>
  )
}
