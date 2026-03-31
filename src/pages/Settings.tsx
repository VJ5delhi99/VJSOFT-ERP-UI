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
import { salesService } from '../services/salesService'
import type { AccessControlSummaryDto, AiReadinessDto, IndustryProfileDto, PlatformContextDto, ServiceHealthDto, WorkflowTemplateDto } from '../types'
import { formatDateTime } from '../utils/format'

export default function Settings() {
  const { user, expiresAtUtc, canAccess } = useAuth()
  const [loading, setLoading] = useState(true)
  const [context, setContext] = useState<PlatformContextDto | null>(null)
  const [aiReadiness, setAiReadiness] = useState<AiReadinessDto | null>(null)
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthDto[]>([])
  const [industryProfiles, setIndustryProfiles] = useState<IndustryProfileDto[]>([])
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplateDto[]>([])
  const [accessSummary, setAccessSummary] = useState<AccessControlSummaryDto | null>(null)
  const [activatingIndustry, setActivatingIndustry] = useState<string | null>(null)

  const canManageUsers = canAccess(undefined, ['CanManageUsers'])

  useEffect(() => {
    let isMounted = true

    async function loadConfiguration() {
      setLoading(true)

      const [contextResult, aiReadinessResult, healthResult, profilesResult, workflowsResult, accessSummaryResult] = await Promise.allSettled([
        platformService.getContext(),
        canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null),
        canManageUsers ? operationsService.getServiceHealth() : Promise.resolve([]),
        platformService.getIndustryProfiles(),
        platformService.getWorkflowTemplates(),
        salesService.getAccessControlSummary()
      ])

      if (!isMounted) {
        return
      }

      setContext(contextResult.status === 'fulfilled' ? contextResult.value : null)
      setAiReadiness(aiReadinessResult.status === 'fulfilled' ? aiReadinessResult.value : null)
      setServiceHealth(healthResult.status === 'fulfilled' ? healthResult.value : [])
      setIndustryProfiles(profilesResult.status === 'fulfilled' ? profilesResult.value : [])
      setWorkflowTemplates(workflowsResult.status === 'fulfilled' ? workflowsResult.value : [])
      setAccessSummary(accessSummaryResult.status === 'fulfilled' ? accessSummaryResult.value : null)
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
  const activeIndustry = useMemo(
    () => industryProfiles.find((profile) => profile.isActive) || null,
    [industryProfiles]
  )

  async function activateIndustryProfile(industryCode: string) {
    setActivatingIndustry(industryCode)

    try {
      const [profiles, workflows] = await Promise.all([
        platformService.activateIndustryProfile(industryCode).then(() => platformService.getIndustryProfiles()),
        platformService.getWorkflowTemplates(industryCode)
      ])

      setIndustryProfiles(profiles)
      setWorkflowTemplates(workflows)
    } finally {
      setActivatingIndustry(null)
    }
  }

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
        <article className="surface-card enterprise-summary">
          <div className="section-heading">
            <div>
              <h3>Industry configuration</h3>
              <p>Activate the operating profile that best matches your current business model and workflow defaults.</p>
            </div>
          </div>
          {activeIndustry ? (
            <>
              <div className="stack-list">
                <div className="list-row list-row--stacked">
                  <div>
                    <strong>{activeIndustry.name}</strong>
                    <p>{activeIndustry.description}</p>
                  </div>
                  <StatusBadge label="Active profile" tone="success" />
                </div>
              </div>
              <div className="tag-cloud">
                {activeIndustry.enabledModules.map((module) => <span key={module} className="tag-chip">{module}</span>)}
              </div>
            </>
          ) : (
            <EmptyState title="No industry profile active" description="Activate an industry profile to align workflows and reporting focus." compact />
          )}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Access coverage</h3>
              <p>Current tenant roles, permissions, and organization structure.</p>
            </div>
          </div>
          {accessSummary ? (
            <div className="stack-list">
              <div className="list-row">
                <div>
                  <strong>Roles</strong>
                  <p>{accessSummary.roles.join(', ')}</p>
                </div>
                <span className="metric-inline">{accessSummary.roles.length}</span>
              </div>
              <div className="list-row">
                <div>
                  <strong>Permissions</strong>
                  <p>{accessSummary.permissions.join(', ')}</p>
                </div>
                <span className="metric-inline">{accessSummary.permissions.length}</span>
              </div>
              <div className="list-row">
                <div>
                  <strong>Companies / branches</strong>
                  <p>{accessSummary.companies.length} companies and {accessSummary.branches.length} branches are currently configured.</p>
                </div>
                <StatusBadge label="Tenant aware" tone="info" />
              </div>
            </div>
          ) : (
            <EmptyState title="Access summary unavailable" description="Access coverage details are not available right now." compact />
          )}
        </article>
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

      <DataTable
        title="Industry profiles"
        description="Supported industry operating models and their activation state."
        columns={[
          {
            key: 'name',
            title: 'Industry',
            sortable: true,
            render: (row) => (
              <div className="table-primary">
                <strong>{row.name}</strong>
                <span>{row.description}</span>
              </div>
            )
          },
          {
            key: 'enabledModules',
            title: 'Modules',
            render: (row) => row.enabledModules.join(', ')
          },
          {
            key: 'workflowTemplates',
            title: 'Workflow packs',
            render: (row) => row.workflowTemplates.join(', ')
          },
          {
            key: 'isActive',
            title: 'State',
            sortable: true,
            render: (row) => <StatusBadge label={row.isActive ? 'Active' : 'Available'} tone={row.isActive ? 'success' : 'info'} />
          },
          {
            key: 'actions',
            title: 'Actions',
            render: (row) =>
              row.isActive ? (
                'In use'
              ) : (
                <button type="button" className="ghost-button" onClick={() => void activateIndustryProfile(row.industryCode)} disabled={activatingIndustry === row.industryCode}>
                  {activatingIndustry === row.industryCode ? 'Activating...' : 'Activate'}
                </button>
              )
          }
        ]}
        data={industryProfiles}
        rowKey="industryCode"
        searchKeys={['industryCode', 'name', 'description']}
        searchPlaceholder="Search industry profiles"
        emptyTitle="No industry profiles"
        emptyDescription="Industry operating profiles are not available right now."
      />

      <DataTable
        title="Workflow templates"
        description="Default workflow stages and SLAs published by the active industry model."
        columns={[
          {
            key: 'name',
            title: 'Workflow',
            sortable: true,
            render: (row) => (
              <div className="table-primary">
                <strong>{row.name}</strong>
                <span>{row.department}</span>
              </div>
            )
          },
          {
            key: 'industryCode',
            title: 'Industry',
            sortable: true
          },
          {
            key: 'stages',
            title: 'Stages',
            render: (row) => row.stages.join(' -> ')
          },
          {
            key: 'slaHours',
            title: 'SLA',
            sortable: true,
            render: (row) => `${row.slaHours}h`
          },
          {
            key: 'isDefault',
            title: 'Default',
            sortable: true,
            render: (row) => <StatusBadge label={row.isDefault ? 'Default' : 'Optional'} tone={row.isDefault ? 'success' : 'neutral'} />
          }
        ]}
        data={workflowTemplates}
        rowKey="id"
        searchKeys={['templateCode', 'name', 'industryCode', 'department']}
        searchPlaceholder="Search workflow templates"
        emptyTitle="No workflow templates"
        emptyDescription="Workflow definitions are not available right now."
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
