import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CategoryBarChart, TrendLineChart } from '../components/Charts'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import { InputField, SelectField } from '../components/FormField'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import SegmentedControl from '../components/SegmentedControl'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import FinanceEnterprisePanel from '../components/enterprise/FinanceEnterprisePanel'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { catalogService } from '../services/catalogService'
import { financeService } from '../services/financeService'
import type {
  AlertDto,
  AnomalyDetectionDto,
  CashFlowForecastDto,
  InvoiceAgingReportDto,
  InvoiceDto,
  PaymentDto,
  PayrollSummaryDto,
  ProductDto,
  SupplierDto
} from '../types'
import { formatCurrency, formatDate } from '../utils/format'

interface PaymentFormValues {
  invoiceId: string
  amount: number
  paymentMethod: string
  reference: string
}

interface FinanceState {
  invoices: InvoiceDto[]
  payments: PaymentDto[]
  cashForecasts: CashFlowForecastDto[]
  aging: InvoiceAgingReportDto | null
  alerts: AlertDto[]
  anomalies: AnomalyDetectionDto[]
  payroll: PayrollSummaryDto | null
  products: ProductDto[]
  suppliers: SupplierDto[]
}

const initialState: FinanceState = {
  invoices: [],
  payments: [],
  cashForecasts: [],
  aging: null,
  alerts: [],
  anomalies: [],
  payroll: null,
  products: [],
  suppliers: []
}

function invoiceTone(status: string) {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success' as const
    case 'overdue':
      return 'danger' as const
    case 'partially paid':
      return 'warning' as const
    default:
      return 'info' as const
  }
}

function severityTone(value: string) {
  switch (value.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'danger' as const
    case 'medium':
    case 'warning':
      return 'warning' as const
    default:
      return 'info' as const
  }
}

export default function Finance() {
  const { hasPermission } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'receivables' | 'cash' | 'payroll' | 'controls'>('receivables')
  const [overdueOnly, setOverdueOnly] = useState(false)
  const [billingDashboard, setBillingDashboard] = useState<Awaited<ReturnType<typeof financeService.getBillingDashboard>> | null>(null)
  const [executiveDashboard, setExecutiveDashboard] = useState<Awaited<ReturnType<typeof financeService.getExecutiveDashboard>> | null>(null)
  const [financeDashboard, setFinanceDashboard] = useState<Awaited<ReturnType<typeof financeService.getFinanceDashboard>> | null>(null)
  const [collectionRisk, setCollectionRisk] = useState<Awaited<ReturnType<typeof financeService.getCollectionRisk>> | null>(null)
  const [state, setState] = useState<FinanceState>(initialState)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDto | null>(null)
  const [selectedInvoicePayments, setSelectedInvoicePayments] = useState<PaymentDto[]>([])

  const canRunPayroll = hasPermission('CanRunPayroll')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PaymentFormValues>({
    defaultValues: {
      invoiceId: '',
      amount: 0,
      paymentMethod: 'Bank Transfer',
      reference: ''
    }
  })

  async function loadFinanceWorkspace(currentOverdueOnly: boolean) {
    setLoading(true)

    const [
      billingDashboardResult,
      executiveDashboardResult,
      financeDashboardResult,
      invoicesResult,
      paymentsResult,
      collectionRiskResult,
      agingResult,
      cash7Result,
      cash14Result,
      cash30Result,
      alertsResult,
      financeAnomaliesResult,
      paymentAnomaliesResult,
      payrollResult,
      productsResult,
      suppliersResult
    ] = await Promise.allSettled([
      financeService.getBillingDashboard(),
      financeService.getExecutiveDashboard(),
      financeService.getFinanceDashboard(),
      financeService.getInvoices(currentOverdueOnly),
      financeService.getPayments(),
      financeService.getCollectionRisk(),
      financeService.getInvoiceAging(),
      financeService.getCashForecast(7),
      financeService.getCashForecast(14),
      financeService.getCashForecast(30),
      financeService.getBillingAlerts(6),
      financeService.getFinanceAnomalies(6),
      financeService.getPaymentAnomalies(6),
      canRunPayroll ? financeService.getPayrollSummary() : Promise.resolve(null),
      catalogService.getProducts(undefined, false),
      catalogService.getSuppliers()
    ])

    setBillingDashboard(billingDashboardResult.status === 'fulfilled' ? billingDashboardResult.value : null)
    setExecutiveDashboard(executiveDashboardResult.status === 'fulfilled' ? executiveDashboardResult.value : null)
    setFinanceDashboard(financeDashboardResult.status === 'fulfilled' ? financeDashboardResult.value : null)
    setCollectionRisk(collectionRiskResult.status === 'fulfilled' ? collectionRiskResult.value : null)
    setState({
      invoices: invoicesResult.status === 'fulfilled' ? invoicesResult.value : [],
      payments: paymentsResult.status === 'fulfilled' ? paymentsResult.value : [],
      aging: agingResult.status === 'fulfilled' ? agingResult.value : null,
      cashForecasts: [cash7Result, cash14Result, cash30Result]
        .filter((item): item is PromiseFulfilledResult<CashFlowForecastDto> => item.status === 'fulfilled')
        .map((item) => item.value)
        .sort((left, right) => left.horizonDays - right.horizonDays),
      alerts: alertsResult.status === 'fulfilled' ? alertsResult.value : [],
      anomalies: [
        ...(financeAnomaliesResult.status === 'fulfilled' ? financeAnomaliesResult.value : []),
        ...(paymentAnomaliesResult.status === 'fulfilled' ? paymentAnomaliesResult.value : [])
      ].slice(0, 8),
      payroll: payrollResult.status === 'fulfilled' ? payrollResult.value : null,
      products: productsResult.status === 'fulfilled' ? productsResult.value : [],
      suppliers: suppliersResult.status === 'fulfilled' ? suppliersResult.value : []
    })
    setLoading(false)
  }

  useEffect(() => {
    void loadFinanceWorkspace(overdueOnly)
  }, [canRunPayroll, overdueOnly])

  async function openInvoice(invoiceId: string) {
    const [invoice, payments] = await Promise.all([
      financeService.getInvoice(invoiceId),
      financeService.getInvoicePayments(invoiceId)
    ])

    setSelectedInvoice(invoice)
    setSelectedInvoicePayments(payments)
    setDetailOpen(true)
  }

  function openPaymentModal() {
    reset({
      invoiceId: state.invoices[0]?.id || '',
      amount: state.invoices[0]?.balance || 0,
      paymentMethod: 'Bank Transfer',
      reference: ''
    })
    setPaymentModalOpen(true)
  }

  async function submitPayment(values: PaymentFormValues) {
    await financeService.createPayment({
      invoiceId: values.invoiceId,
      amount: Number(values.amount),
      paymentMethod: values.paymentMethod,
      reference: values.reference
    })

    showToast('Payment saved', 'The payment has been added to the invoice.', 'success')
    setPaymentModalOpen(false)
    await loadFinanceWorkspace(overdueOnly)
  }

  const cashForecastData = useMemo(
    () =>
      state.cashForecasts.map((item) => ({
        label: `${item.horizonDays}d`,
        value: item.expectedCollections,
        secondaryValue: item.overdueExposure
      })),
    [state.cashForecasts]
  )

  const agingBars = useMemo(
    () =>
      state.aging?.buckets.map((item) => ({
        label: item.label,
        value: item.amount
      })) || [],
    [state.aging]
  )

  const collectionRiskRows = collectionRisk?.items.slice(0, 8) || []

  if (loading) {
    return <Spinner fullPage label="Loading finance information" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Finance"
        title="Finance and collections"
        description="Track invoices, payments, cash outlook, and follow-up priorities in one place."
        actions={
          <>
            <button type="button" className="ghost-button" onClick={() => setOverdueOnly((current) => !current)}>
              {overdueOnly ? 'Show all invoices' : 'Show past-due only'}
            </button>
            <button type="button" className="primary-button" onClick={openPaymentModal} disabled={state.invoices.length === 0}>
              Add payment
            </button>
          </>
        }
      />

      <section className="stat-grid">
        <StatCard label="Total invoiced" value={billingDashboard?.totalInvoiced ?? 0} format="currency" subtitle="Invoices issued" />
        <StatCard label="Collected" value={billingDashboard?.collectedAmount ?? 0} format="currency" subtitle="Payments received" />
        <StatCard label="Outstanding" value={billingDashboard?.outstandingBalance ?? 0} format="currency" subtitle="Open receivables" />
        <StatCard label="Past-due balance" value={billingDashboard?.overdueBalance ?? 0} format="currency" subtitle="Needs follow-up" />
      </section>

      <SegmentedControl
        label="Finance work areas"
        value={activeView}
        onChange={(value) => setActiveView(value as 'receivables' | 'cash' | 'payroll' | 'controls')}
        options={[
          { value: 'receivables', label: 'Receivables', description: 'Invoices, payments, and collections' },
          { value: 'cash', label: 'Cash outlook', description: 'Forecasts, aging, and finance alerts' },
          { value: 'payroll', label: 'Payroll', description: 'Workforce payroll visibility' },
          { value: 'controls', label: 'Enterprise controls', description: 'Procurement and integration operations' }
        ]}
      />

      {activeView === 'cash' ? (
      <>
      <section className="dashboard-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Cash forecast</h3>
              <p>Expected cash in and past-due exposure over the next few planning periods.</p>
            </div>
          </div>
          {cashForecastData.length > 0 ? (
            <TrendLineChart
              data={cashForecastData}
              valueLabel="currency"
              primaryLabel="Expected collections"
              secondaryLabel="Overdue exposure"
            />
          ) : (
            <EmptyState title="Cash outlook unavailable" description="Cash forecast information is not available right now." compact />
          )}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Invoice aging</h3>
              <p>Open balance grouped by how long invoices have been outstanding.</p>
            </div>
          </div>
          {agingBars.length > 0 ? (
            <CategoryBarChart data={agingBars} valueLabel="currency" />
          ) : (
            <EmptyState title="Aging data unavailable" description="Invoice aging details are not available right now." compact />
          )}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Cash position</h3>
              <p>Quick guidance on working capital and collections.</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="list-row list-row--stacked">
              <div>
                <strong>Working capital indicator</strong>
                <p>{financeDashboard ? financeDashboard.workingCapitalIndicator.toFixed(2) : 'Not available'}</p>
              </div>
              <StatusBadge
                label={financeDashboard && financeDashboard.workingCapitalIndicator >= 1 ? 'Healthy' : 'Watch'}
                tone={financeDashboard && financeDashboard.workingCapitalIndicator >= 1 ? 'success' : 'warning'}
              />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Collections summary</strong>
                <p>{financeDashboard?.narrative || 'A summary is not available right now.'}</p>
              </div>
              <StatusBadge label="Summary" tone="info" />
            </div>
            <div className="list-row list-row--stacked">
              <div>
                <strong>Follow-up priority</strong>
                <p>
                  {executiveDashboard
                    ? `${executiveDashboard.highRiskCollections} high-risk collections and ${executiveDashboard.overdueInvoices} past-due invoices are currently open.`
                    : 'Finance summary information is not available right now.'}
                </p>
              </div>
              <StatusBadge label="Attention" tone="warning" />
            </div>
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Finance updates</h3>
              <p>Warnings and unusual items that may need follow-up.</p>
            </div>
          </div>
          {state.alerts.length === 0 && state.anomalies.length === 0 ? (
            <EmptyState title="No finance updates" description="There are no active warnings to review right now." compact />
          ) : (
            <div className="stack-list">
              {state.alerts.map((item) => (
                <div key={`${item.area}-${item.message}`} className="list-row">
                  <div>
                    <strong>{item.area}</strong>
                    <p>{item.message}</p>
                  </div>
                  <StatusBadge label={item.severity} tone={severityTone(item.severity)} />
                </div>
              ))}
              {state.anomalies.map((item) => (
                <div key={`${item.domain}-${item.title}`} className="list-row">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.narrative}</p>
                  </div>
                  <StatusBadge label={item.severity} tone={severityTone(item.severity)} />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
      </>
      ) : null}

      {activeView === 'payroll' ? (state.payroll ? (
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Payroll summary</h3>
              <p>Payroll details available for users with payroll access.</p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Workforce</h4>
              <dl className="detail-list">
                <div>
                  <dt>Active employees</dt>
                  <dd>{state.payroll.activeEmployees}</dd>
                </div>
                <div>
                  <dt>Monthly gross payroll</dt>
                  <dd>{formatCurrency(state.payroll.monthlyGrossPayroll)}</dd>
                </div>
                <div>
                  <dt>Average salary</dt>
                  <dd>{formatCurrency(state.payroll.averageMonthlySalary)}</dd>
                </div>
              </dl>
            </div>
            <div className="detail-card">
              <h4>Payroll cycle</h4>
              <dl className="detail-list">
                <div>
                  <dt>Next payroll date</dt>
                  <dd>{formatDate(state.payroll.nextPayrollDate)}</dd>
                </div>
                <div>
                  <dt>Pending approvals</dt>
                  <dd>{state.payroll.pendingPayrollApprovals}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{state.payroll.status}</dd>
                </div>
              </dl>
            </div>
          </div>
        </article>
      ) : (
        <EmptyState title="Payroll visibility unavailable" description="Payroll details are available to accounts with payroll access." compact />
      )) : null}

      {activeView === 'controls' ? (
        <FinanceEnterprisePanel products={state.products} suppliers={state.suppliers} />
      ) : null}

      {activeView === 'receivables' ? (
      <>
      <DataTable
        title="Invoices"
        description="Review invoices and open each one for payment details."
        columns={[
          {
            key: 'invoiceNumber',
            title: 'Invoice',
            sortable: true,
            render: (row) => (
              <div className="table-primary">
                <strong>{row.invoiceNumber}</strong>
                <span>{row.customerName}</span>
              </div>
            )
          },
          {
            key: 'dueDate',
            title: 'Due',
            sortable: true,
            render: (row) => formatDate(row.dueDate)
          },
          {
            key: 'totalAmount',
            title: 'Total',
            sortable: true,
            align: 'right',
            render: (row) => formatCurrency(row.totalAmount)
          },
          {
            key: 'balance',
            title: 'Balance',
            sortable: true,
            align: 'right',
            render: (row) => formatCurrency(row.balance)
          },
          {
            key: 'status',
            title: 'Status',
            sortable: true,
            render: (row) => <StatusBadge label={row.status} tone={invoiceTone(row.status)} />
          },
          {
            key: 'actions',
            title: 'Actions',
            render: (row) => (
              <button type="button" className="ghost-button" onClick={() => void openInvoice(row.id)}>
                View details
              </button>
            )
          }
        ]}
        data={state.invoices}
        rowKey="id"
        searchKeys={['invoiceNumber', 'customerName', 'status']}
        searchPlaceholder="Search invoices"
        emptyTitle="No invoices found"
        emptyDescription="Try a different filter or come back when more invoices are available."
      />

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Payments"
          description="Recent customer payments."
          columns={[
            {
              key: 'paymentDate',
              title: 'Date',
              sortable: true,
              render: (row) => formatDate(row.paymentDate)
            },
            {
              key: 'invoiceNumber',
              title: 'Payment',
              sortable: true,
              render: (row) => (
                <div className="table-primary">
                  <strong>{row.invoiceNumber}</strong>
                  <span>{row.customerName}</span>
                </div>
              )
            },
            {
              key: 'amount',
              title: 'Amount',
              sortable: true,
              align: 'right',
              render: (row) => formatCurrency(row.amount)
            },
            {
              key: 'paymentMethod',
              title: 'Method',
              sortable: true
            }
          ]}
          data={state.payments}
          rowKey="id"
          searchKeys={['invoiceNumber', 'customerName', 'paymentMethod', 'reference']}
          searchPlaceholder="Search payments"
          emptyTitle="No payments found"
          emptyDescription="Payments will appear here after they are recorded."
        />

        <DataTable
          title="Collection risk"
          description="Accounts with the highest follow-up risk."
          columns={[
            {
              key: 'invoiceNumber',
              title: 'Invoice',
              sortable: true,
              render: (row) => (
                <div className="table-primary">
                  <strong>{row.invoiceNumber}</strong>
                  <span>{row.customerName}</span>
                </div>
              )
            },
            {
              key: 'balance',
              title: 'Balance',
              sortable: true,
              align: 'right',
              render: (row) => formatCurrency(row.balance)
            },
            {
              key: 'daysOverdue',
              title: 'Days overdue',
              sortable: true,
              align: 'right'
            },
            {
              key: 'riskBand',
              title: 'Risk',
              sortable: true,
              render: (row) => <StatusBadge label={`${row.riskBand} / ${row.riskScore}`} tone={severityTone(row.riskBand)} />
            }
          ]}
          data={collectionRiskRows}
          rowKey="invoiceId"
          searchKeys={['invoiceNumber', 'customerName', 'riskBand']}
          searchPlaceholder="Search collection risk"
          emptyTitle="No follow-up risk found"
          emptyDescription="There are no high-risk balances to review right now."
        />
      </section>
      </>
      ) : null}

      <Modal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Add payment"
        description="Add a payment to an invoice."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="payment-form" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save payment'}
            </button>
          </>
        }
      >
        <form id="payment-form" className="form-grid form-grid--two" onSubmit={handleSubmit(submitPayment)}>
          <SelectField
            label="Invoice"
            error={errors.invoiceId?.message}
            registration={register('invoiceId', { required: 'Please choose an invoice.' })}
          >
            <option value="">Select invoice</option>
            {state.invoices
              .filter((invoice) => invoice.balance > 0)
              .map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} / {invoice.customerName} / {formatCurrency(invoice.balance)}
                </option>
              ))}
          </SelectField>
          <InputField
            label="Amount"
            type="number"
            step="0.01"
            error={errors.amount?.message}
            registration={register('amount', { required: 'Please enter an amount.', valueAsNumber: true, min: 1 })}
          />
          <SelectField
            label="Payment method"
            error={errors.paymentMethod?.message}
            registration={register('paymentMethod', { required: 'Please choose a payment method.' })}
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="Wire">Wire</option>
          </SelectField>
          <InputField
            label="Reference"
            placeholder="Payment reference"
            error={errors.reference?.message}
            registration={register('reference', { required: 'Please enter a payment reference.' })}
          />
        </form>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selectedInvoice?.invoiceNumber || 'Invoice details'}
        description={selectedInvoice ? `${selectedInvoice.customerName} / ${selectedInvoice.orderNumber}` : 'Invoice details'}
        size="lg"
      >
        {selectedInvoice ? (
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Invoice summary</h4>
              <dl className="detail-list">
                <div>
                  <dt>Invoice date</dt>
                  <dd>{formatDate(selectedInvoice.invoiceDate)}</dd>
                </div>
                <div>
                  <dt>Due date</dt>
                  <dd>{formatDate(selectedInvoice.dueDate)}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatCurrency(selectedInvoice.totalAmount)}</dd>
                </div>
                <div>
                  <dt>Balance</dt>
                  <dd>{formatCurrency(selectedInvoice.balance)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <StatusBadge label={selectedInvoice.status} tone={invoiceTone(selectedInvoice.status)} />
                  </dd>
                </div>
              </dl>
            </div>

            <div className="detail-card">
              <h4>Payment history</h4>
              {selectedInvoicePayments.length === 0 ? (
                <EmptyState title="No payments yet" description="No payments have been added to this invoice yet." compact />
              ) : (
                <div className="stack-list">
                  {selectedInvoicePayments.map((payment) => (
                    <div key={payment.id} className="list-row">
                      <div>
                        <strong>{formatDate(payment.paymentDate)}</strong>
                        <p>
                          {payment.paymentMethod} / {payment.reference}
                        </p>
                      </div>
                      <span className="metric-inline">{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
