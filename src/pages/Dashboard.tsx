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
    return `Revenue for the current 30-day view is ${formatCurrency(revenue)}. ${insights[0]?.description || 'No additional revenue insight is available for your role.'}`
  }

  if (normalizedQuestion.includes('stock') || normalizedQuestion.includes('inventory')) {
    const lowStock = dashboard.inventoryDashboard?.lowStockProducts ?? dashboard.executiveDashboard?.lowStockProducts ?? 0
    const inventoryValue = dashboard.inventoryDashboard?.inventoryValue ?? dashboard.catalogOverview?.inventoryValue ?? 0
    return `${lowStock} products are currently flagged for low stock, with inventory value at ${formatCurrency(inventoryValue)}.`
  }

  if (normalizedQuestion.includes('customer')) {
    const topCustomer = dashboard.topCustomers[0]
    return topCustomer
      ? `${topCustomer.name} is the strongest current customer signal with lifetime value of ${formatCurrency(topCustomer.lifetimeValue)} and outstanding balance of ${formatCurrency(topCustomer.outstandingBalance)}.`
      : 'Customer intelligence is not available for your current access scope.'
  }

  if (normalizedQuestion.includes('alert') || normalizedQuestion.includes('anomal')) {
    const alertCount = dashboard.alerts.length + dashboard.anomalies.length
    return alertCount > 0
      ? `There are ${alertCount} active alerts or anomaly indicators across the services visible to your role. Prioritize the highest severity records in the activity and anomaly panels.`
      : 'No alerting signals are currently active in the services visible to your role.'
  }

  return insights[0]?.description || 'The dashboard is ready. Ask about revenue, stock, customers, or operational alerts.'
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
        label: 'Revenue (30 days)',
        value: dashboard.orderMetrics?.revenueLast30Days ?? dashboard.executiveDashboard?.revenueLast30Days ?? 0,
        format: 'currency' as const,
        subtitle: 'Sales and billing services'
      })
      cards.push({
        label: 'Open Orders',
        value: dashboard.orderMetrics?.openOrders ?? dashboard.executiveDashboard?.openOrders ?? 0,
        format: 'number' as const,
        subtitle: 'Pending operational throughput'
      })
    }

    if (dashboard.inventoryDashboard || dashboard.catalogOverview) {
      cards.push({
        label: 'Inventory Value',
        value: dashboard.inventoryDashboard?.inventoryValue ?? dashboard.catalogOverview?.inventoryValue ?? 0,
        format: 'currency' as const,
        subtitle: 'Catalog and warehouse exposure'
      })
    }

    if (dashboard.financeDashboard || dashboard.executiveDashboard) {
      cards.push({
        label: 'Overdue Exposure',
        value: dashboard.financeDashboard?.overdueReceivables ?? dashboard.executiveDashboard?.outstandingBalance ?? 0,
        format: 'currency' as const,
        subtitle: 'Receivables requiring attention'
      })
    }

    if (cards.length === 0) {
      cards.push(
        {
          label: 'Unread Notifications',
          value: dashboard.notifications.filter((item) => !item.isRead).length,
          format: 'number' as const,
          subtitle: 'Cross-service operational feed'
        },
        {
          label: 'Assigned Roles',
          value: user?.roles.length ?? 0,
          format: 'number' as const,
          subtitle: 'Current identity scope'
        }
      )
    }

    return cards.slice(0, 4)
  }, [dashboard, user])

  const lineChart = useMemo(() => {
    if (dashboard.cashForecasts.length > 0) {
      return {
        title: 'Cash forecast',
        description: 'Expected collections and open receivables across finance horizons.',
        valueLabel: 'currency' as const,
        primaryLabel: 'Expected collections',
        secondaryLabel: 'Open receivables',
        data: dashboard.cashForecasts.map<TrendDatum>((item) => ({
          label: `${item.horizonDays}d`,
          value: item.expectedCollections,
          secondaryValue: item.openReceivables
        }))
      }
    }

    if (dashboard.demandForecast.length > 0) {
      return {
        title: 'Demand signal',
        description: 'Forecast units for the products with the highest near-term demand.',
        valueLabel: 'number' as const,
        primaryLabel: 'Forecast units',
        secondaryLabel: 'Forecast units',
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
        title: 'Top forecasted demand',
        description: 'Products likely to drive replenishment pressure in the next planning window.',
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
        description: 'Highest lifetime value customers from the sales service.',
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
        title: 'Low-stock pressure is building',
        description: `${dashboard.executiveDashboard.lowStockProducts} SKUs are low on stock with ${formatCurrency(dashboard.executiveDashboard.atRiskRevenue)} of revenue at risk.`,
        tone: 'warning'
      })
    }

    if (dashboard.financeDashboard && dashboard.financeDashboard.workingCapitalIndicator >= 1) {
      items.push({
        id: 'working-capital',
        title: 'Working capital remains stable',
        description: `Working capital indicator is ${dashboard.financeDashboard.workingCapitalIndicator.toFixed(2)} with payroll run rate at ${formatCurrency(dashboard.financeDashboard.monthlyPayrollRunRate)}.`,
        tone: 'success'
      })
    }

    if (dashboard.topCustomers[0]) {
      items.push({
        id: 'customer-focus',
        title: 'Customer concentration is visible',
        description: `${dashboard.topCustomers[0].name} currently leads customer value with ${formatCurrency(dashboard.topCustomers[0].lifetimeValue)} in lifetime value.`,
        tone: 'info'
      })
    }

    if (dashboard.aiReadiness) {
      items.push({
        id: 'ai-readiness',
        title: 'AI readiness is configured',
        description: `${dashboard.aiReadiness.provider} is ${dashboard.aiReadiness.aiEnabled ? 'enabled' : 'disabled'} with ${dashboard.aiReadiness.useCases.filter((item) => item.enabled).length} active use cases.`,
        tone: dashboard.aiReadiness.aiEnabled ? 'success' : 'warning'
      })
    }

    if (items.length === 0) {
      items.push({
        id: 'baseline',
        title: 'Dashboard is active',
        description: 'Notifications and service health data are available even when role-restricted modules are hidden.',
        tone: 'info'
      })
    }

    return items.slice(0, 4)
  }, [dashboard.aiReadiness, dashboard.executiveDashboard, dashboard.financeDashboard, dashboard.topCustomers])

  if (loading) {
    return <Spinner fullPage label="Loading cross-service dashboard" />
  }

  const hasPrimaryData =
    statCards.length > 0 || dashboard.notifications.length > 0 || dashboard.topCustomers.length > 0 || dashboard.anomalies.length > 0

  if (!hasPrimaryData) {
    return <EmptyState title="Dashboard unavailable" description="No accessible dashboard services returned data for the current session." />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Overview"
        title="Enterprise dashboard"
        description="Track core KPIs, operational risk, and AI-ready insights in a single executive workspace designed for fast daily review."
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
              <p>{lineChart?.description || 'Trend data becomes available when finance or inventory forecasting endpoints are accessible.'}</p>
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
            <EmptyState title="Trend data unavailable" description="No forecast-capable service is visible to your role." compact />
          )}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>{barData?.title || 'Operational mix'}</h3>
              <p>{barData?.description || 'Open catalog or sales access to populate the comparison chart.'}</p>
            </div>
          </div>
          {barData ? (
            <CategoryBarChart data={barData.data} valueLabel={barData.valueLabel} />
          ) : (
            <EmptyState title="Comparison unavailable" description="No ranked comparison data is available for the current role scope." compact />
          )}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Recent activity</h3>
              <p>Notification feed spanning platform events, alerts, and workflow signals.</p>
            </div>
          </div>
          {dashboard.notifications.length === 0 ? (
            <EmptyState title="No recent notifications" description="The notification feed is currently clear." compact />
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
              <p>Backend-derived commentary prepared for future AI or predictive workflows.</p>
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
              <p>Customer concentration and outstanding balance from the sales domain.</p>
            </div>
          </div>
          {dashboard.topCustomers.length === 0 ? (
            <EmptyState title="Customer intelligence unavailable" description="Sales access is required to view customer ranking." compact />
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
              <p>Signals aggregated from inventory and payment anomaly endpoints.</p>
            </div>
          </div>
          {dashboard.anomalies.length === 0 ? (
            <EmptyState title="No anomalies detected" description="No anomaly service returned actionable signals." compact />
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
              <p>Executive and collections alerts surfaced from the finance services.</p>
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
        initialMessage="I can summarize the dashboard signals visible to your current role. Ask about revenue, stock, customers, or alerts."
        suggestions={['Where is the biggest operational risk?', 'Summarize revenue and receivables', 'What should ops review first?']}
        generateResponse={(question) => buildAssistantResponse(question, dashboard, insights)}
      />
    </div>
  )
}
