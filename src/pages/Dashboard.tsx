import { useEffect, useMemo, useState } from 'react'
import AIAssistant from '../components/AIAssistant'
import { CategoryBarChart, TrendLineChart } from '../components/Charts'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { roleGroups } from '../config/rbac'
import { useAuth } from '../hooks/useAuth'
import { catalogService } from '../services/catalogService'
import { financeService } from '../services/financeService'
import { inventoryService } from '../services/inventoryService'
import { platformService } from '../services/platformService'
import { salesService } from '../services/salesService'
import type { CashFlowForecastDto, ChartDatum, DashboardBundle, DemandForecastDto, TrendDatum } from '../types'
import { formatCurrency, formatRelative } from '../utils/format'

interface DashboardState extends DashboardBundle {
  cashForecasts: CashFlowForecastDto[]
  demandForecast: DemandForecastDto[]
}

const initialState: DashboardState = {
  catalogOverview: null,
  inventoryDashboard: null,
  orderMetrics: null,
  executiveDashboard: null,
  financeDashboard: null,
  notifications: [],
  alerts: [],
  anomalies: [],
  topCustomers: [],
  aiReadiness: null,
  cashForecasts: [],
  demandForecast: []
}

function readResult<T>(result: PromiseSettledResult<T>, fallback: T) {
  return result.status === 'fulfilled' ? result.value : fallback
}

function severityTone(value: string) {
  switch (value.toLowerCase()) {
    case 'high':
    case 'critical':
    case 'danger':
      return 'danger' as const
    case 'medium':
    case 'warning':
      return 'warning' as const
    case 'low':
    case 'success':
      return 'success' as const
    default:
      return 'info' as const
  }
}

function buildAssistantResponse(question: string, dashboard: DashboardState, insights: Array<{ title: string; description: string }>) {
  const normalizedQuestion = question.toLowerCase()

  if (normalizedQuestion.includes('revenue')) {
    const revenue = dashboard.orderMetrics?.revenueLast30Days ?? dashboard.executiveDashboard?.revenueLast30Days ?? 0
    return `Sales for the last 30 days are ${formatCurrency(revenue)}. ${insights[0]?.description || 'No additional sales insight is available for your access level.'}`
  }

  if (normalizedQuestion.includes('stock') || normalizedQuestion.includes('inventory')) {
    const lowStock = dashboard.inventoryDashboard?.lowStockProducts ?? dashboard.executiveDashboard?.lowStockProducts ?? 0
    const inventoryValue = dashboard.inventoryDashboard?.inventoryValue ?? dashboard.catalogOverview?.inventoryValue ?? 0
    return `${lowStock} products are currently low on stock, with inventory valued at ${formatCurrency(inventoryValue)}.`
  }

  if (normalizedQuestion.includes('customer')) {
    const topCustomer = dashboard.topCustomers[0]
    return topCustomer
      ? `${topCustomer.name} is the leading customer right now, with lifetime value of ${formatCurrency(topCustomer.lifetimeValue)} and an open balance of ${formatCurrency(topCustomer.outstandingBalance)}.`
      : 'Customer details are not available for your current access level.'
  }

  if (normalizedQuestion.includes('alert') || normalizedQuestion.includes('anomal')) {
    const alertCount = dashboard.alerts.length + dashboard.anomalies.length
    return alertCount > 0
      ? `There are ${alertCount} active warnings or unusual items in the areas available to you. Start with the highest-priority items in Recent activity and Priority items.`
      : 'There are no active warnings in the areas currently available to you.'
  }

  return insights[0]?.description || 'The dashboard is ready. Ask about sales, stock, customers, or priority items.'
}

export default function Dashboard() {
  const { canAccess, user } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardState>(initialState)
  const [loading, setLoading] = useState(true)

  const canViewCatalog = canAccess(roleGroups.catalogAccess)
  const canViewInventory = canAccess(roleGroups.inventoryAccess)
  const canViewSales = canAccess(roleGroups.salesAccess)
  const canViewFinance = canAccess(undefined, ['CanViewFinance'])
  const canManageUsers = canAccess(undefined, ['CanManageUsers'])

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setLoading(true)

      const [
        catalogOverviewResult,
        inventoryDashboardResult,
        orderMetricsResult,
        executiveDashboardResult,
        financeDashboardResult,
        notificationsResult,
        alertsResult,
        inventoryAnomaliesResult,
        paymentAnomaliesResult,
        customersResult,
        aiReadinessResult,
        demandForecastResult,
        cash7Result,
        cash14Result,
        cash30Result
      ] = await Promise.allSettled([
        canViewCatalog ? catalogService.getOverview() : Promise.resolve(null),
        canViewInventory ? inventoryService.getDashboard() : Promise.resolve(null),
        canViewSales ? salesService.getOrderMetrics() : Promise.resolve(null),
        canViewFinance ? financeService.getExecutiveDashboard() : Promise.resolve(null),
        canViewFinance ? financeService.getFinanceDashboard() : Promise.resolve(null),
        platformService.getNotifications(true),
        canViewFinance ? financeService.getBillingAlerts(6) : Promise.resolve([]),
        canViewInventory ? inventoryService.getAnomalies(6) : Promise.resolve([]),
        canViewFinance ? financeService.getPaymentAnomalies(6) : Promise.resolve([]),
        canViewSales ? salesService.getCustomers() : Promise.resolve([]),
        canManageUsers ? platformService.getAiReadiness() : Promise.resolve(null),
        canViewInventory ? inventoryService.getDemandForecast(14) : Promise.resolve([]),
        canViewFinance ? financeService.getCashForecast(7) : Promise.resolve(null),
        canViewFinance ? financeService.getCashForecast(14) : Promise.resolve(null),
        canViewFinance ? financeService.getCashForecast(30) : Promise.resolve(null)
      ])

      if (!isMounted) {
        return
      }

      const topCustomers = [...readResult(customersResult, [])]
        .sort((left, right) => right.lifetimeValue - left.lifetimeValue)
        .slice(0, 5)

      const cashForecasts = [cash7Result, cash14Result, cash30Result]
        .map((result) => readResult<CashFlowForecastDto | null>(result, null))
        .filter((item): item is CashFlowForecastDto => Boolean(item))
        .sort((left, right) => left.horizonDays - right.horizonDays)

      const anomalies = [...readResult(inventoryAnomaliesResult, []), ...readResult(paymentAnomaliesResult, [])]
        .sort((left, right) => right.score - left.score)
        .slice(0, 6)

      setDashboard({
        catalogOverview: readResult(catalogOverviewResult, null),
        inventoryDashboard: readResult(inventoryDashboardResult, null),
        orderMetrics: readResult(orderMetricsResult, null),
        executiveDashboard: readResult(executiveDashboardResult, null),
        financeDashboard: readResult(financeDashboardResult, null),
        notifications: readResult(notificationsResult, []).slice(0, 5),
        alerts: readResult(alertsResult, []).slice(0, 5),
        anomalies,
        topCustomers,
        aiReadiness: readResult(aiReadinessResult, null),
        demandForecast: readResult(demandForecastResult, []).slice(0, 6),
        cashForecasts
      })
      setLoading(false)
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [canManageUsers, canViewCatalog, canViewFinance, canViewInventory, canViewSales])

  const statCards = useMemo(() => {
    const cards = []

    if (dashboard.orderMetrics || dashboard.executiveDashboard) {
      cards.push({
        label: 'Sales last 30 days',
        value: dashboard.orderMetrics?.revenueLast30Days ?? dashboard.executiveDashboard?.revenueLast30Days ?? 0,
        format: 'currency' as const,
        subtitle: 'Recent sales activity'
      })
      cards.push({
        label: 'Open Orders',
        value: dashboard.orderMetrics?.openOrders ?? dashboard.executiveDashboard?.openOrders ?? 0,
        format: 'number' as const,
        subtitle: 'Orders still in progress'
      })
    }

    if (dashboard.inventoryDashboard || dashboard.catalogOverview) {
      cards.push({
        label: 'Inventory Value',
        value: dashboard.inventoryDashboard?.inventoryValue ?? dashboard.catalogOverview?.inventoryValue ?? 0,
        format: 'currency' as const,
        subtitle: 'Current stock value'
      })
    }

    if (dashboard.financeDashboard || dashboard.executiveDashboard) {
      cards.push({
        label: 'Past-due balance',
        value: dashboard.financeDashboard?.overdueReceivables ?? dashboard.executiveDashboard?.outstandingBalance ?? 0,
        format: 'currency' as const,
        subtitle: 'Open balance needing follow-up'
      })
    }

    if (cards.length === 0) {
      cards.push(
        {
          label: 'Unread updates',
          value: dashboard.notifications.filter((item) => !item.isRead).length,
          format: 'number' as const,
          subtitle: 'New updates to review'
        },
        {
          label: 'Access roles',
          value: user?.roles.length ?? 0,
          format: 'number' as const,
          subtitle: 'Roles on this account'
        }
      )
    }

    return cards.slice(0, 4)
  }, [dashboard, user])

  const lineChart = useMemo(() => {
    if (dashboard.cashForecasts.length > 0) {
      return {
        title: 'Cash outlook',
        description: 'Expected incoming cash and open balances over the next few planning periods.',
        valueLabel: 'currency' as const,
        primaryLabel: 'Expected cash in',
        secondaryLabel: 'Open balance',
        data: dashboard.cashForecasts.map<TrendDatum>((item) => ({
          label: `${item.horizonDays}d`,
          value: item.expectedCollections,
          secondaryValue: item.openReceivables
        }))
      }
    }

    if (dashboard.demandForecast.length > 0) {
      return {
        title: 'Demand outlook',
        description: 'Expected demand for the products most likely to need attention soon.',
        valueLabel: 'number' as const,
        primaryLabel: 'Expected units',
        secondaryLabel: 'Expected units',
        data: dashboard.demandForecast.map<TrendDatum>((item) => ({
          label: item.productName,
          value: item.forecastUnits
        }))
      }
    }

    return null
  }, [dashboard.cashForecasts, dashboard.demandForecast])

  const barData = useMemo(() => {
    if (dashboard.demandForecast.length > 0) {
      return {
        title: 'Expected demand',
        description: 'Products most likely to drive replenishment needs soon.',
        valueLabel: 'number' as const,
        data: dashboard.demandForecast.map<ChartDatum>((item) => ({
          label: item.productName,
          value: item.forecastUnits
        }))
      }
    }

    if (dashboard.topCustomers.length > 0) {
      return {
        title: 'Top customers',
        description: 'Customers contributing the most long-term value.',
        valueLabel: 'currency' as const,
        data: dashboard.topCustomers.map<ChartDatum>((item) => ({
          label: item.name,
          value: item.lifetimeValue
        }))
      }
    }

    return null
  }, [dashboard.demandForecast, dashboard.topCustomers])

  const insights = useMemo(() => {
    const items: Array<{ id: string; title: string; description: string; tone: 'success' | 'warning' | 'info' }> = []

    if (dashboard.executiveDashboard && dashboard.executiveDashboard.lowStockProducts > 0) {
      items.push({
        id: 'stock-pressure',
        title: 'Low stock needs attention',
        description: `${dashboard.executiveDashboard.lowStockProducts} products are running low, with ${formatCurrency(dashboard.executiveDashboard.atRiskRevenue)} in sales potentially affected.`,
        tone: 'warning'
      })
    }

    if (dashboard.financeDashboard && dashboard.financeDashboard.workingCapitalIndicator >= 1) {
      items.push({
        id: 'working-capital',
        title: 'Cash position is steady',
        description: `Working capital is ${dashboard.financeDashboard.workingCapitalIndicator.toFixed(2)} with payroll running at ${formatCurrency(dashboard.financeDashboard.monthlyPayrollRunRate)} per month.`,
        tone: 'success'
      })
    }

    if (dashboard.topCustomers[0]) {
      items.push({
        id: 'customer-focus',
        title: 'One customer stands out',
        description: `${dashboard.topCustomers[0].name} currently leads customer value with ${formatCurrency(dashboard.topCustomers[0].lifetimeValue)} in lifetime value.`,
        tone: 'info'
      })
    }

    if (dashboard.aiReadiness) {
      items.push({
        id: 'ai-readiness',
        title: 'AI setup is available',
        description: `${dashboard.aiReadiness.provider} is ${dashboard.aiReadiness.aiEnabled ? 'enabled' : 'disabled'} with ${dashboard.aiReadiness.useCases.filter((item) => item.enabled).length} active use cases.`,
        tone: dashboard.aiReadiness.aiEnabled ? 'success' : 'warning'
      })
    }

    if (items.length === 0) {
      items.push({
        id: 'baseline',
        title: 'Dashboard is ready',
        description: 'Updates and account-level information are available even when some areas are hidden by role.',
        tone: 'info'
      })
    }

    return items.slice(0, 4)
  }, [dashboard.aiReadiness, dashboard.executiveDashboard, dashboard.financeDashboard, dashboard.topCustomers])

  if (loading) {
    return <Spinner fullPage label="Loading your dashboard" />
  }

  const hasPrimaryData =
    statCards.length > 0 || dashboard.notifications.length > 0 || dashboard.topCustomers.length > 0 || dashboard.anomalies.length > 0

  if (!hasPrimaryData) {
    return <EmptyState title="Dashboard unavailable" description="We could not load dashboard information for this session." />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Command Center"
        title="Business command center"
        description="Review revenue, cash, supply, and current priorities from one role-aware dashboard."
      />

      <section className="stat-grid">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} format={card.format} subtitle={card.subtitle} />
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>{lineChart?.title || 'Forecast trend'}</h3>
              <p>{lineChart?.description || 'Trend information appears here when forecast data is available.'}</p>
            </div>
          </div>
          {lineChart ? (
            <TrendLineChart
              data={lineChart.data}
              valueLabel={lineChart.valueLabel}
              primaryLabel={lineChart.primaryLabel}
              secondaryLabel={lineChart.secondaryLabel}
            />
          ) : (
            <EmptyState title="Trend data unavailable" description="Forecast information is not available for your current access level." compact />
          )}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>{barData?.title || 'Operational mix'}</h3>
              <p>{barData?.description || 'Comparison details appear here when customer or demand data is available.'}</p>
            </div>
          </div>
          {barData ? (
            <CategoryBarChart data={barData.data} valueLabel={barData.valueLabel} />
          ) : (
            <EmptyState title="Comparison unavailable" description="There is no ranked comparison data available for your current access level." compact />
          )}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Recent activity</h3>
              <p>Recent updates, reminders, and workflow changes.</p>
            </div>
          </div>
          {dashboard.notifications.length === 0 ? (
            <EmptyState title="No recent updates" description="There are no new updates to review right now." compact />
          ) : (
            <div className="stack-list">
              {dashboard.notifications.map((item) => (
                <div key={item.id} className="list-row">
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

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Insights panel</h3>
              <p>Short highlights to help you focus on what needs attention.</p>
            </div>
          </div>
          <div className="stack-list">
            {insights.map((item) => (
              <div key={item.id} className="list-row list-row--stacked">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <StatusBadge label={item.tone} tone={item.tone} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Top customers</h3>
              <p>Customers generating the most value and open balance.</p>
            </div>
          </div>
          {dashboard.topCustomers.length === 0 ? (
            <EmptyState title="Customer details unavailable" description="Customer rankings are not available for your current access level." compact />
          ) : (
            <div className="stack-list">
              {dashboard.topCustomers.map((customer) => (
                <div key={customer.id} className="list-row">
                  <div>
                    <strong>{customer.name}</strong>
                    <p>{customer.segment}</p>
                  </div>
                  <div className="metric-stack">
                    <strong>{formatCurrency(customer.lifetimeValue)}</strong>
                    <span>{formatCurrency(customer.outstandingBalance)} outstanding</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Anomaly indicators</h3>
              <p>Priority items that may need follow-up.</p>
            </div>
          </div>
          {dashboard.anomalies.length === 0 ? (
            <EmptyState title="No priority items" description="There are no unusual items needing attention right now." compact />
          ) : (
            <div className="stack-list">
              {dashboard.anomalies.map((item) => (
                <div key={`${item.domain}-${item.title}`} className="list-row list-row--stacked">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.narrative}</p>
                  </div>
                  <StatusBadge label={`${item.domain} / ${item.severity}`} tone={severityTone(item.severity)} />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      {dashboard.alerts.length > 0 ? (
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Finance alerts</h3>
              <p>Items needing follow-up from billing and collections.</p>
            </div>
          </div>
          <div className="stack-list">
            {dashboard.alerts.map((item) => (
              <div key={`${item.area}-${item.message}`} className="list-row">
                <div>
                  <strong>{item.area}</strong>
                  <p>{item.message}</p>
                </div>
                <StatusBadge label={item.severity} tone={severityTone(item.severity)} />
              </div>
            ))}
          </div>
        </article>
      ) : null}

      <AIAssistant
        initialMessage="I can summarize the key numbers and highlights on this dashboard. Ask about sales, stock, customers, or priority items."
        suggestions={['Where is the biggest operational risk?', 'Summarize revenue and receivables', 'What should ops review first?']}
        generateResponse={(question) => buildAssistantResponse(question, dashboard, insights)}
      />
    </div>
  )
}
