import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DataTable from '../DataTable'
import EmptyState from '../EmptyState'
import { InputField, SelectField, TextAreaField } from '../FormField'
import Modal from '../Modal'
import Spinner from '../Spinner'
import StatCard from '../StatCard'
import StatusBadge from '../StatusBadge'
import { financeService } from '../../services/financeService'
import type {
  IntegrationConnectionDto,
  IntegrationOverviewDto,
  ProductDto,
  PurchaseRequisitionDto,
  RequestForQuoteDto,
  SupplierDto,
  ThreeWayMatchDto,
  WebhookSubscriptionDto
} from '../../types'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/format'
import { useToast } from '../../hooks/useToast'

interface RequisitionFormValues {
  department: string
  requestedBy: string
  justification: string
  productId: string
  quantity: number
  estimatedUnitCost: number
}

interface RfqFormValues {
  requisitionId: string
  title: string
  responseWindowDays: number
  supplierId: string
  quotedAmount: number
  leadTimeDays: number
}

interface IntegrationFormValues {
  name: string
  type: string
  provider: string
  endpointUrl: string
}

interface WebhookFormValues {
  name: string
  topic: string
  targetUrl: string
  secretReference: string
}

function tone(status: string) {
  switch (status.toLowerCase()) {
    case 'healthy':
    case 'approved':
    case 'matched':
    case 'delivered':
    case 'awarded':
      return 'success' as const
    case 'submitted':
    case 'issued':
    case 'configured':
      return 'info' as const
    case 'variance':
    case 'pending':
      return 'warning' as const
    default:
      return 'danger' as const
  }
}

export default function FinanceEnterprisePanel({ products, suppliers }: { products: ProductDto[]; suppliers: SupplierDto[] }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [requisitions, setRequisitions] = useState<PurchaseRequisitionDto[]>([])
  const [rfqs, setRfqs] = useState<RequestForQuoteDto[]>([])
  const [matches, setMatches] = useState<ThreeWayMatchDto[]>([])
  const [integrationOverview, setIntegrationOverview] = useState<IntegrationOverviewDto | null>(null)
  const [connections, setConnections] = useState<IntegrationConnectionDto[]>([])
  const [webhooks, setWebhooks] = useState<WebhookSubscriptionDto[]>([])
  const [requisitionOpen, setRequisitionOpen] = useState(false)
  const [rfqOpen, setRfqOpen] = useState(false)
  const [integrationOpen, setIntegrationOpen] = useState(false)
  const [webhookOpen, setWebhookOpen] = useState(false)

  const requisitionForm = useForm<RequisitionFormValues>({ defaultValues: { department: '', requestedBy: '', justification: '', productId: '', quantity: 1, estimatedUnitCost: 0 } })
  const rfqForm = useForm<RfqFormValues>({ defaultValues: { requisitionId: '', title: '', responseWindowDays: 7, supplierId: '', quotedAmount: 0, leadTimeDays: 7 } })
  const integrationForm = useForm<IntegrationFormValues>({ defaultValues: { name: '', type: 'CRM', provider: '', endpointUrl: '' } })
  const webhookForm = useForm<WebhookFormValues>({ defaultValues: { name: '', topic: 'sales', targetUrl: '', secretReference: '' } })

  async function loadFinanceEnterprise() {
    setLoading(true)
    const [requisitionsResult, rfqsResult, matchesResult, overviewResult, connectionsResult, webhooksResult] = await Promise.allSettled([
      financeService.getPurchaseRequisitions(),
      financeService.getRequestForQuotes(),
      financeService.getThreeWayMatches(),
      financeService.getIntegrationOverview(),
      financeService.getIntegrationConnections(),
      financeService.getWebhookSubscriptions()
    ])

    setRequisitions(requisitionsResult.status === 'fulfilled' ? requisitionsResult.value : [])
    setRfqs(rfqsResult.status === 'fulfilled' ? rfqsResult.value : [])
    setMatches(matchesResult.status === 'fulfilled' ? matchesResult.value : [])
    setIntegrationOverview(overviewResult.status === 'fulfilled' ? overviewResult.value : null)
    setConnections(connectionsResult.status === 'fulfilled' ? connectionsResult.value : [])
    setWebhooks(webhooksResult.status === 'fulfilled' ? webhooksResult.value : [])
    setLoading(false)
  }

  useEffect(() => {
    void loadFinanceEnterprise()
  }, [])

  async function submitRequisition(values: RequisitionFormValues) {
    await financeService.createPurchaseRequisition({
      department: values.department,
      requestedBy: values.requestedBy,
      justification: values.justification,
      lines: [{ productId: values.productId, quantity: Number(values.quantity), estimatedUnitCost: Number(values.estimatedUnitCost) }]
    })
    showToast('Requisition created', 'The procurement intake request was saved.', 'success')
    setRequisitionOpen(false)
    await loadFinanceEnterprise()
  }

  async function submitRfq(values: RfqFormValues) {
    await financeService.createRequestForQuote({
      requisitionId: values.requisitionId || undefined,
      title: values.title,
      responseWindowDays: Number(values.responseWindowDays),
      supplierQuotes: [{ supplierId: values.supplierId, quotedAmount: Number(values.quotedAmount), leadTimeDays: Number(values.leadTimeDays) }]
    })
    showToast('RFQ created', 'The sourcing request is now visible in procurement.', 'success')
    setRfqOpen(false)
    await loadFinanceEnterprise()
  }

  async function submitIntegration(values: IntegrationFormValues) {
    await financeService.createIntegrationConnection(values)
    showToast('Integration saved', 'The external connector is now registered.', 'success')
    setIntegrationOpen(false)
    await loadFinanceEnterprise()
  }

  async function submitWebhook(values: WebhookFormValues) {
    await financeService.createWebhookSubscription(values)
    showToast('Webhook saved', 'The integration delivery subscription is now active.', 'success')
    setWebhookOpen(false)
    await loadFinanceEnterprise()
  }

  if (loading) {
    return <Spinner label="Loading procurement and integration controls" />
  }

  return (
    <div className="page-stack">
      <section className="enterprise-hero">
        <div className="enterprise-hero__copy">
          <span className="page-header__eyebrow">Enterprise Finance Controls</span>
          <h3>Procure-to-pay and integration command center</h3>
          <p>Manage sourcing intake, supplier RFQs, three-way match posture, and open architecture integrations from one finance workspace.</p>
        </div>
        <div className="enterprise-hero__actions">
          <button type="button" className="ghost-button" onClick={() => setRequisitionOpen(true)}>New requisition</button>
          <button type="button" className="ghost-button" onClick={() => setRfqOpen(true)}>New RFQ</button>
          <button type="button" className="ghost-button" onClick={() => setIntegrationOpen(true)}>Add integration</button>
          <button type="button" className="primary-button" onClick={() => setWebhookOpen(true)}>Add webhook</button>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard label="Requisitions" value={requisitions.length} format="number" subtitle="Procurement demand intake" />
        <StatCard label="RFQs awarded" value={rfqs.filter((rfq) => rfq.status === 'Awarded').length} format="number" subtitle="Competitive sourcing closed" />
        <StatCard label="Active integrations" value={integrationOverview?.activeConnections ?? connections.length} format="number" subtitle="Open architecture connectors" />
        <StatCard label="Webhook subscriptions" value={integrationOverview?.activeWebhooks ?? webhooks.length} format="number" subtitle="Event delivery endpoints" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Purchase requisitions"
          description="Department demand requests waiting for sourcing or already approved."
          columns={[
            { key: 'requisitionNumber', title: 'Requisition', sortable: true, render: (row) => <div className="table-primary"><strong>{row.requisitionNumber}</strong><span>{row.department}</span></div> },
            { key: 'requestedBy', title: 'Requested by', sortable: true },
            { key: 'estimatedTotal', title: 'Estimated total', sortable: true, align: 'right', render: (row) => formatCurrency(row.estimatedTotal) },
            { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={tone(row.status)} /> },
            { key: 'requestedAt', title: 'Requested', sortable: true, render: (row) => formatDate(row.requestedAt) }
          ]}
          data={requisitions}
          rowKey="id"
          searchKeys={['requisitionNumber', 'department', 'requestedBy', 'status']}
          searchPlaceholder="Search requisitions"
          emptyTitle="No requisitions yet"
          emptyDescription="Procurement intake requests will appear here after submission."
        />

        <DataTable
          title="RFQs"
          description="Supplier quote rounds and awarded sourcing decisions."
          columns={[
            { key: 'rfqNumber', title: 'RFQ', sortable: true, render: (row) => <div className="table-primary"><strong>{row.rfqNumber}</strong><span>{row.title}</span></div> },
            { key: 'supplierQuotes', title: 'Quotes', align: 'right', render: (row) => row.supplierQuotes.length },
            { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={tone(row.status)} /> },
            { key: 'responseDueAt', title: 'Due', sortable: true, render: (row) => formatDate(row.responseDueAt) }
          ]}
          data={rfqs}
          rowKey="id"
          searchKeys={['rfqNumber', 'title', 'status']}
          searchPlaceholder="Search RFQs"
          emptyTitle="No RFQs yet"
          emptyDescription="RFQ activity will appear here after sourcing rounds are created."
        />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Three-way match"
          description="PO, receipt, and invoice agreement checks for payables control."
          columns={[
            { key: 'purchaseOrderNumber', title: 'Purchase order', sortable: true, render: (row) => <div className="table-primary"><strong>{row.purchaseOrderNumber}</strong><span>{row.supplierName}</span></div> },
            { key: 'purchaseOrderTotal', title: 'PO total', sortable: true, align: 'right', render: (row) => formatCurrency(row.purchaseOrderTotal) },
            { key: 'receivedValue', title: 'Received', sortable: true, align: 'right', render: (row) => formatCurrency(row.receivedValue) },
            { key: 'variance', title: 'Variance', sortable: true, align: 'right', render: (row) => formatCurrency(row.variance) },
            { key: 'matchStatus', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.matchStatus} tone={tone(row.matchStatus)} /> }
          ]}
          data={matches}
          rowKey="purchaseOrderId"
          searchKeys={['purchaseOrderNumber', 'supplierName', 'matchStatus']}
          searchPlaceholder="Search matching results"
          emptyTitle="No three-way match data"
          emptyDescription="Purchase matching information will appear here when procurement activity exists."
        />

        <article className="surface-card enterprise-summary">
          <div className="section-heading">
            <div>
              <h3>Integration overview</h3>
              <p>Connector health, webhook posture, and retry visibility for the open integration layer.</p>
            </div>
          </div>
          {integrationOverview ? (
            <div className="enterprise-summary__grid">
              <div className="enterprise-summary__metric"><span>Healthy connections</span><strong>{integrationOverview.activeConnections}</strong></div>
              <div className="enterprise-summary__metric"><span>Active webhooks</span><strong>{integrationOverview.activeWebhooks}</strong></div>
              <div className="enterprise-summary__metric"><span>Failed syncs</span><strong>{integrationOverview.failedSyncs}</strong></div>
              <div className="enterprise-summary__metric"><span>Connector types</span><strong>{integrationOverview.supportedConnectors.length}</strong></div>
            </div>
          ) : (
            <EmptyState title="Integration overview unavailable" description="Connection health data is not available right now." compact />
          )}
          <div className="tag-cloud">
            {integrationOverview?.supportedConnectors.map((connector) => (
              <span key={connector} className="tag-chip">{connector}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Integration connections"
          description="Registered external systems, providers, and their latest sync result."
          columns={[
            { key: 'name', title: 'Connection', sortable: true, render: (row) => <div className="table-primary"><strong>{row.name}</strong><span>{row.provider}</span></div> },
            { key: 'type', title: 'Type', sortable: true },
            { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={tone(row.status)} /> },
            { key: 'lastSyncAt', title: 'Last sync', sortable: true, render: (row) => formatDateTime(row.lastSyncAt) }
          ]}
          data={connections}
          rowKey="id"
          searchKeys={['name', 'type', 'provider', 'status']}
          searchPlaceholder="Search integrations"
          emptyTitle="No integrations configured"
          emptyDescription="External connector registrations will appear here after setup."
        />

        <DataTable
          title="Webhook subscriptions"
          description="Event subscribers for downstream CRM, commerce, banking, and workflow systems."
          columns={[
            { key: 'name', title: 'Webhook', sortable: true, render: (row) => <div className="table-primary"><strong>{row.name}</strong><span>{row.topic}</span></div> },
            { key: 'targetUrl', title: 'Target', sortable: true },
            { key: 'lastDeliveryStatus', title: 'Delivery', sortable: true, render: (row) => <StatusBadge label={row.lastDeliveryStatus} tone={tone(row.lastDeliveryStatus)} /> },
            { key: 'lastDeliveredAt', title: 'Last delivered', sortable: true, render: (row) => row.lastDeliveredAt ? formatDateTime(row.lastDeliveredAt) : 'Not yet' }
          ]}
          data={webhooks}
          rowKey="id"
          searchKeys={['name', 'topic', 'targetUrl', 'lastDeliveryStatus']}
          searchPlaceholder="Search webhooks"
          emptyTitle="No webhooks configured"
          emptyDescription="Webhook subscriptions will appear here after configuration."
        />
      </section>

      <Modal open={requisitionOpen} onClose={() => setRequisitionOpen(false)} title="Create requisition" description="Raise a new procurement request directly from finance controls." footer={<><button type="button" className="ghost-button" onClick={() => setRequisitionOpen(false)}>Cancel</button><button type="submit" form="requisition-form" className="primary-button" disabled={requisitionForm.formState.isSubmitting}>{requisitionForm.formState.isSubmitting ? 'Saving...' : 'Save requisition'}</button></>}>
        <form id="requisition-form" className="form-grid form-grid--two" onSubmit={requisitionForm.handleSubmit(submitRequisition)}>
          <InputField label="Department" registration={requisitionForm.register('department', { required: true })} />
          <InputField label="Requested by" registration={requisitionForm.register('requestedBy', { required: true })} />
          <SelectField label="Product" registration={requisitionForm.register('productId', { required: true })}>
            <option value="">Select product</option>
            {products.filter((product) => product.isActive).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </SelectField>
          <InputField label="Quantity" type="number" registration={requisitionForm.register('quantity', { required: true, valueAsNumber: true, min: 1 })} />
          <InputField label="Estimated unit cost" type="number" step="0.01" registration={requisitionForm.register('estimatedUnitCost', { required: true, valueAsNumber: true, min: 0 })} />
          <TextAreaField label="Justification" registration={requisitionForm.register('justification', { required: true })} />
        </form>
      </Modal>

      <Modal open={rfqOpen} onClose={() => setRfqOpen(false)} title="Create RFQ" description="Run a sourcing round against a requisition and nominated supplier." footer={<><button type="button" className="ghost-button" onClick={() => setRfqOpen(false)}>Cancel</button><button type="submit" form="rfq-form" className="primary-button" disabled={rfqForm.formState.isSubmitting}>{rfqForm.formState.isSubmitting ? 'Saving...' : 'Save RFQ'}</button></>}>
        <form id="rfq-form" className="form-grid form-grid--two" onSubmit={rfqForm.handleSubmit(submitRfq)}>
          <SelectField label="Requisition" registration={rfqForm.register('requisitionId')}>
            <option value="">Standalone RFQ</option>
            {requisitions.map((requisition) => <option key={requisition.id} value={requisition.id}>{requisition.requisitionNumber}</option>)}
          </SelectField>
          <InputField label="Title" registration={rfqForm.register('title', { required: true })} />
          <SelectField label="Supplier" registration={rfqForm.register('supplierId', { required: true })}>
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
          </SelectField>
          <InputField label="Quoted amount" type="number" step="0.01" registration={rfqForm.register('quotedAmount', { required: true, valueAsNumber: true, min: 0 })} />
          <InputField label="Lead time days" type="number" registration={rfqForm.register('leadTimeDays', { required: true, valueAsNumber: true, min: 1 })} />
          <InputField label="Response window days" type="number" registration={rfqForm.register('responseWindowDays', { required: true, valueAsNumber: true, min: 1 })} />
        </form>
      </Modal>

      <Modal open={integrationOpen} onClose={() => setIntegrationOpen(false)} title="Register integration" description="Add a new external connector for finance, CRM, commerce, or banking workflows." footer={<><button type="button" className="ghost-button" onClick={() => setIntegrationOpen(false)}>Cancel</button><button type="submit" form="integration-form" className="primary-button" disabled={integrationForm.formState.isSubmitting}>{integrationForm.formState.isSubmitting ? 'Saving...' : 'Save integration'}</button></>}>
        <form id="integration-form" className="form-grid form-grid--two" onSubmit={integrationForm.handleSubmit(submitIntegration)}>
          <InputField label="Connection name" registration={integrationForm.register('name', { required: true })} />
          <SelectField label="Type" registration={integrationForm.register('type', { required: true })}>
            <option value="CRM">CRM</option>
            <option value="PaymentGateway">Payment gateway</option>
            <option value="Banking">Banking</option>
            <option value="ECommerce">E-commerce</option>
          </SelectField>
          <InputField label="Provider" registration={integrationForm.register('provider', { required: true })} />
          <InputField label="Endpoint URL" registration={integrationForm.register('endpointUrl', { required: true })} />
        </form>
      </Modal>

      <Modal open={webhookOpen} onClose={() => setWebhookOpen(false)} title="Create webhook subscription" description="Register a downstream event subscriber with a topic and secret reference." footer={<><button type="button" className="ghost-button" onClick={() => setWebhookOpen(false)}>Cancel</button><button type="submit" form="webhook-form" className="primary-button" disabled={webhookForm.formState.isSubmitting}>{webhookForm.formState.isSubmitting ? 'Saving...' : 'Save webhook'}</button></>}>
        <form id="webhook-form" className="form-grid form-grid--two" onSubmit={webhookForm.handleSubmit(submitWebhook)}>
          <InputField label="Webhook name" registration={webhookForm.register('name', { required: true })} />
          <SelectField label="Topic" registration={webhookForm.register('topic', { required: true })}>
            <option value="sales">Sales</option>
            <option value="procurement">Procurement</option>
            <option value="finance">Finance</option>
            <option value="integration">Integration</option>
          </SelectField>
          <InputField label="Target URL" registration={webhookForm.register('targetUrl', { required: true })} />
          <InputField label="Secret reference" registration={webhookForm.register('secretReference', { required: true })} />
        </form>
      </Modal>
    </div>
  )
}
