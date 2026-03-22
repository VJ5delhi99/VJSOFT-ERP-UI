import { useEffect, useMemo, useState } from 'react'
import { formatOrganizationName, formatRoleName } from '@shared/index'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { apiConfig } from '../config/api'
import { useAuth } from '../hooks/useAuth'
import { operationsService } from '../services/operationsService'
import { platformService } from '../services/platformService'
import type { AiReadinessDto, PlatformContextDto, ServiceHealthDto } from '../types'
import { formatDateTime } from '../utils/format'

export default function Settings() {
  const { user, expiresAtUtc, canAccess } = useAuth()
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState<PlatformContextDto | null>(null)
  const [aiReadiness, setAiReadiness] = useState<AiReadinessDto | null>(null)
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthDto[]>([])

  const canManageUsers = canAccess(undefined, ['CanManageUsers'])

  useEffect(() => {
    let isMounted = true

    async function loadConfiguration() {
      setLoading(true)

      const [contextResult, aiReadinessResult, healthResult] = await Promise.allSettled([
        platformService.getContext(),
        canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null),
        canManageUsers ? operationsService.getServiceHealth() : Promise.resolve([])
      ])

      if (!isMounted) {
        return
      }

      setContext(contextResult.status === 'fulfilled' ? contextResult.value : null)
      setAiReadiness(aiReadinessResult.status === 'fulfilled' ? aiReadinessResult.value : null)
      setServiceHealth(healthResult.status === 'fulfilled' ? healthResult.value : [])
      setLoading(false)
    }

    void loadConfiguration()

    return () => {
      isMounted = false
    }
  }, [canManageUsers])

  const activeIntegrations = useMemo(
    () => serviceHealth.filter((service) => service.status === 'online').length,
    [serviceHealth]
  )
  const enabledAiUseCases = aiReadiness?.useCases.filter((item) => item.enabled).length ?? 0
  const organizationName = formatOrganizationName(context?.tenantId || user?.tenantId)

  if (loading) {
    return <Spinner fullPage label="Loading configuration" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Configuration"
        title="Configuration and integrations"
        description="Review session context, connection readiness, and AI setup for this organization."
      />

      <section className="stat-grid">
        <StatCard label="Connected services" value={serviceHealth.length || Object.keys(apiConfig.services).length} format="number" subtitle="Configured ERP modules" />
        <StatCard label="Healthy integrations" value={activeIntegrations} format="number" subtitle="Services responding to health checks" />
        <StatCard label="Access roles" value={user?.roles.length ?? 0} format="number" subtitle="Roles assigned to this account" />
        <StatCard label="AI use cases" value={enabledAiUseCases} format="number" subtitle="Enabled AI capabilities" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Session context</h3>
              <p>Current sign-in and support details for this organization.</p>
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
                  <dt>Organization</dt>
                  <dd>{organizationName}</dd>
                </div>
                <div>
                  <dt>Session expires</dt>
                  <dd>{expiresAtUtc ? formatDateTime(expiresAtUtc) : '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>Support details</h4>
              <dl className="detail-list">
                <div>
                  <dt>Support reference</dt>
                  <dd>{context?.correlationId || '-'}</dd>
                </div>
                <div>
                  <dt>Environment</dt>
                  <dd>{apiConfig.environment}</dd>
                </div>
                <div>
                  <dt>Primary role</dt>
                  <dd>{user?.roles[0] ? formatRoleName(user.roles[0]) : '-'}</dd>
                </div>
                <div>
                  <dt>Request timeout</dt>
                  <dd>{apiConfig.requestTimeoutMs} ms</dd>
                </div>
              </dl>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Configuration guidance</h3>
              <p>Operational reminders for keeping the organization healthy and supportable.</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="list-row list-row--stacked">
              <div>
                <strong>Connections are centrally configured</strong>
                <p>Each business area uses the shared service registry so connection changes stay consistent across the product.</p>
              </div>
              <StatusBadge label="Centralized" tone="success" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Organization context is enforced</strong>
                <p>Requests carry organization context so each service returns the correct business data.</p>
              </div>
              <StatusBadge label="Protected" tone="warning" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Support references matter</strong>
                <p>Use the support reference above whenever you need to trace activity with the product or platform team.</p>
              </div>
              <StatusBadge label="Support ready" tone="info" />
            </div>
          </div>
        </article>
      </section>

      <DataTable
        title="Connected modules"
        description="Connection readiness across the ERP service landscape."
        columns={[
          {
            key: 'service',
            title: 'Module',
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
            title: 'Readiness',
            sortable: true,
            render: (row) => <StatusBadge label={row.statusLabel} tone={row.status === 'online' ? 'success' : row.status === 'degraded' ? 'warning' : 'danger'} />
          },
          {
            key: 'detail',
            title: 'Operational note',
            render: (row) => row.detail
          },
          {
            key: 'baseUrl',
            title: 'Address',
            render: (row) => row.baseUrl
          }
        ]}
        data={serviceHealth}
        rowKey="id"
        searchKeys={['service', 'area', 'detail', 'baseUrl']}
        searchPlaceholder="Search connected modules"
        emptyTitle="No connection details"
        emptyDescription="Connection details are not available right now."
      />

      <article className="surface-card">
        <div className="section-heading">
          <div>
            <h3>AI readiness</h3>
            <p>Available AI provider and enabled use cases for this organization.</p>
          </div>
        </div>
        {aiReadiness ? (
          <div className="stack-list">
            <div className="list-row">
              <div>
                <strong>{aiReadiness.provider}</strong>
                <p>Configured AI provider</p>
              </div>
              <StatusBadge label={aiReadiness.aiEnabled ? 'Enabled' : 'Configured only'} tone={aiReadiness.aiEnabled ? 'success' : 'warning'} />
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
          <EmptyState title="AI readiness is limited" description="AI setup details are available to administrators who manage access and platform setup." compact />
        )}
      </article>
    </div>
  )
}
