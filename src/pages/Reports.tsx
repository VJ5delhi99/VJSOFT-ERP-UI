import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import AIAssistant from '../components/AIAssistant'
import { CategoryBarChart } from '../components/Charts'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import { SelectField, TextAreaField } from '../components/FormField'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useToast } from '../hooks/useToast'
import { financeService } from '../services/financeService'
import type { DocumentExtractionResultDto, InvoiceAgingReportDto, InvoiceDto, ReportingSnapshotDto } from '../types'
import { exportToCsv } from '../utils/export'
import { formatCurrency } from '../utils/format'

interface ExtractionFormValues {
  documentType: string
  content: string
}

function toLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export default function Reports() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [snapshot, setSnapshot] = useState<ReportingSnapshotDto | null>(null)
  const [aging, setAging] = useState<InvoiceAgingReportDto | null>(null)
  const [overdueInvoices, setOverdueInvoices] = useState<InvoiceDto[]>([])
  const [extractionResult, setExtractionResult] = useState<DocumentExtractionResultDto | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ExtractionFormValues>({
    defaultValues: {
      documentType: 'Invoice',
      content: ''
    }
  })

  useEffect(() => {
    let isMounted = true

    async function loadReports() {
      setLoading(true)

      const [snapshotResult, agingResult, overdueInvoicesResult] = await Promise.allSettled([
        financeService.getReportingSnapshot(),
        financeService.getInvoiceAging(),
        financeService.getInvoices(true)
      ])

      if (!isMounted) {
        return
      }

      setSnapshot(snapshotResult.status === 'fulfilled' ? snapshotResult.value : null)
      setAging(agingResult.status === 'fulfilled' ? agingResult.value : null)
      setOverdueInvoices(overdueInvoicesResult.status === 'fulfilled' ? overdueInvoicesResult.value : [])
      setLoading(false)
    }

    void loadReports()

    return () => {
      isMounted = false
    }
  }, [])

  async function exportReport() {
    exportToCsv(
      'erp-reporting-snapshot.csv',
      overdueInvoices.map((invoice) => ({
        InvoiceNumber: invoice.invoiceNumber,
        CustomerName: invoice.customerName,
        DueDate: invoice.dueDate,
        TotalAmount: invoice.totalAmount,
        Balance: invoice.balance,
        Status: invoice.status,
        DaysOverdue: invoice.daysOverdue
      }))
    )
    showToast('Export ready', 'Past-due invoice details were exported to CSV.', 'success')
  }

  async function extractDocument(values: ExtractionFormValues) {
    const result = await financeService.extractDocument({
      documentType: values.documentType,
      content: values.content
    })

    setExtractionResult(result)
    showToast('Review complete', `${result.documentType} details were reviewed with ${result.confidencePercent}% confidence.`, 'success')
    reset(values)
  }

  const agingBars = useMemo(
    () =>
      aging?.buckets.map((item) => ({
        label: item.label,
        value: item.amount
      })) || [],
    [aging]
  )

  const operationalBars = useMemo(() => {
    if (!snapshot) {
      return []
    }

    return [
      { label: 'Open Projects', value: snapshot.openProjects },
      { label: 'Open Tickets', value: snapshot.openTickets },
      { label: 'Open Work Orders', value: snapshot.openWorkOrders }
    ]
  }, [snapshot])

  if (loading) {
    return <Spinner fullPage label="Loading reports and insights" />
  }

  if (!snapshot) {
    return <EmptyState title="Reports unavailable" description="We could not load the reporting summary right now." />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Reporting"
        title="Reports and insights"
        description="Review key results, export lists, and summarize performance."
        actions={
          <button type="button" className="primary-button" onClick={() => void exportReport()} disabled={overdueInvoices.length === 0}>
            Export CSV
          </button>
        }
      />

      <section className="stat-grid">
        <StatCard label="Sales last 30 days" value={snapshot.revenueLast30Days} format="currency" subtitle="Recent sales activity" />
        <StatCard label="Collections last 30 days" value={snapshot.collectionsLast30Days} format="currency" subtitle="Recent payments received" />
        <StatCard label="Inventory value" value={snapshot.inventoryValue} format="currency" subtitle="Current stock value" />
        <StatCard label="Outstanding balance" value={snapshot.outstandingBalance} format="currency" subtitle="Open balance still unpaid" />
      </section>

      <section className="dashboard-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Invoice aging distribution</h3>
              <p>Open balances grouped by how long they have been outstanding.</p>
            </div>
          </div>
          {agingBars.length > 0 ? (
            <CategoryBarChart data={agingBars} valueLabel="currency" />
          ) : (
            <EmptyState title="No aging data" description="Invoice aging details are not available right now." compact />
          )}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Operational workload</h3>
              <p>Open work across projects, support, and production.</p>
            </div>
          </div>
          <CategoryBarChart data={operationalBars} />
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <AIAssistant
          title="Reporting assistant"
          description="Ask for a plain-language summary of the numbers on this page."
          initialMessage="Ask for a summary of sales, collections, past-due invoices, or open work."
          suggestions={['Summarize current revenue and collections', 'What needs leadership attention?', 'How exposed are overdue invoices?']}
          generateResponse={async (question) => {
            const response = await financeService.askReportingAssistant({ question })
            const metrics = Object.entries(response.metrics)
              .slice(0, 3)
              .map(([key, value]) => `${toLabel(key)}: ${value}`)
              .join(' | ')

            return metrics ? `${response.narrative} ${metrics}` : response.narrative
          }}
        />

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Document extraction</h3>
              <p>Paste invoice, receipt, or statement text to pull out key details.</p>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleSubmit(extractDocument)}>
            <SelectField
              label="Document type"
              error={errors.documentType?.message}
              registration={register('documentType', { required: 'Please choose a document type.' })}
            >
              <option value="Invoice">Invoice</option>
              <option value="Receipt">Receipt</option>
              <option value="Statement">Statement</option>
            </SelectField>
            <TextAreaField
              label="Document text"
              placeholder="Paste text from a document to review key details"
              error={errors.content?.message}
              registration={register('content', { required: 'Please paste the document text.' })}
            />
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Reviewing...' : 'Review document'}
            </button>
          </form>

          {extractionResult ? (
            <div className="stack-list report-result">
              <div className="list-row">
                <div>
                  <strong>{extractionResult.documentType}</strong>
                  <p>Key details found</p>
                </div>
                <StatusBadge
                  label={`${extractionResult.confidencePercent}% confidence`}
                  tone={extractionResult.confidencePercent >= 80 ? 'success' : 'warning'}
                />
              </div>
              {Object.entries(extractionResult.fields).map(([key, value]) => (
                <div key={key} className="list-row">
                  <div>
                    <strong>{toLabel(key)}</strong>
                    <p>{value}</p>
                  </div>
                  <StatusBadge label="Field" tone="info" />
                </div>
              ))}
              {extractionResult.warnings.map((warning) => (
                <div key={warning} className="list-row">
                  <div>
                    <strong>Needs review</strong>
                    <p>{warning}</p>
                  </div>
                  <StatusBadge label="Review" tone="warning" />
                </div>
              ))}
            </div>
          ) : null}
        </article>
      </section>

      <DataTable
        title="Past-due invoices"
        description="Past-due invoice list used for exports and follow-up."
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
            title: 'Due date',
            sortable: true
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
            key: 'status',
            title: 'Status',
            sortable: true,
            render: (row) => <StatusBadge label={row.status} tone={row.daysOverdue > 30 ? 'danger' : 'warning'} />
          }
        ]}
        data={overdueInvoices}
        rowKey="id"
        searchKeys={['invoiceNumber', 'customerName', 'status']}
        searchPlaceholder="Search past-due invoices"
        emptyTitle="No past-due invoices"
        emptyDescription="There are no past-due invoices to review right now."
      />
    </div>
  )
}
