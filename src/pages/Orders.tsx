import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import { InputField, SelectField } from '../components/FormField'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { roleGroups } from '../config/rbac'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { catalogService } from '../services/catalogService'
import { salesService } from '../services/salesService'
import type {
  CustomerDto,
  CustomerIntelligenceDto,
  OrderDto,
  OrderMetricsDto,
  ProductDto,
  ProjectDto,
  ServiceTicketDto
} from '../types'
import { formatCurrency, formatDate, formatDateTime } from '../utils/format'

interface CustomerFormValues {
  name: string
  email: string
  contactNumber: string
  segment: string
}

interface OrderFormValues {
  customerId: string
  productId: string
  quantity: number
  paymentMethod: string
}

interface ProjectFormValues {
  name: string
  customerName: string
  projectManager: string
  budget: number
  dueDate: string
}

interface TicketFormValues {
  customerId: string
  customerName: string
  subject: string
  priority: string
  assignedTeam: string
  dueInHours: number
}

type WorkflowTarget =
  | { kind: 'project'; record: ProjectDto }
  | { kind: 'ticket'; record: ServiceTicketDto }
  | null

function orderTone(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success' as const
    case 'cancelled':
      return 'danger' as const
    case 'approved':
    case 'processing':
      return 'info' as const
    default:
      return 'warning' as const
  }
}

function projectTone(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success' as const
    case 'active':
      return 'info' as const
    case 'at risk':
    case 'on hold':
      return 'danger' as const
    default:
      return 'warning' as const
  }
}

function ticketTone(status: string) {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'success' as const
    case 'in progress':
      return 'info' as const
    case 'escalated':
      return 'danger' as const
    default:
      return 'warning' as const
  }
}

function priorityTone(priority: string) {
  return priority.toLowerCase() === 'high' ? 'danger' : priority.toLowerCase() === 'medium' ? 'warning' : 'info'
}

export default function Orders() {
  const { canAccess } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<CustomerDto[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [metrics, setMetrics] = useState<OrderMetricsDto | null>(null)
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [tickets, setTickets] = useState<ServiceTicketDto[]>([])
  const [customerSegmentFilter, setCustomerSegmentFilter] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('')
  const [projectStatusFilter, setProjectStatusFilter] = useState('')
  const [ticketStatusFilter, setTicketStatusFilter] = useState('')
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [customerInsight, setCustomerInsight] = useState<CustomerIntelligenceDto | null>(null)
  const [customerInsightOpen, setCustomerInsightOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [pendingOrderStatus, setPendingOrderStatus] = useState('Pending')
  const [workflowTarget, setWorkflowTarget] = useState<WorkflowTarget>(null)
  const [workflowOpen, setWorkflowOpen] = useState(false)
  const [pendingWorkflowStatus, setPendingWorkflowStatus] = useState('')
  const [pendingProjectPercent, setPendingProjectPercent] = useState(0)

  const canViewSales = canAccess(roleGroups.salesAccess)
  const canViewOperations = canAccess(roleGroups.operationsAccess)
  const canViewCatalog = canAccess(roleGroups.catalogAccess)

  const customerForm = useForm<CustomerFormValues>({
    defaultValues: { name: '', email: '', contactNumber: '', segment: 'SMB' }
  })
  const orderForm = useForm<OrderFormValues>({
    defaultValues: { customerId: '', productId: '', quantity: 1, paymentMethod: 'Bank Transfer' }
  })
  const projectForm = useForm<ProjectFormValues>({
    defaultValues: { name: '', customerName: '', projectManager: '', budget: 0, dueDate: '' }
  })
  const ticketForm = useForm<TicketFormValues>({
    defaultValues: { customerId: '', customerName: '', subject: '', priority: 'Medium', assignedTeam: 'Support', dueInHours: 24 }
  })

  async function loadSalesOps() {
    setLoading(true)

    const [customersResult, ordersResult, metricsResult, productsResult, projectsResult, ticketsResult] = await Promise.allSettled([
      canViewSales ? salesService.getCustomers(customerSegmentFilter || undefined) : Promise.resolve([]),
      canViewSales ? salesService.getOrders(orderStatusFilter || undefined) : Promise.resolve([]),
      canViewSales ? salesService.getOrderMetrics() : Promise.resolve(null),
      canViewSales && canViewCatalog ? catalogService.getProducts(undefined, false) : Promise.resolve([]),
      canViewOperations ? salesService.getProjects(projectStatusFilter || undefined) : Promise.resolve([]),
      canViewOperations ? salesService.getTickets(ticketStatusFilter || undefined) : Promise.resolve([])
    ])

    setCustomers(customersResult.status === 'fulfilled' ? customersResult.value : [])
    setOrders(ordersResult.status === 'fulfilled' ? ordersResult.value : [])
    setMetrics(metricsResult.status === 'fulfilled' ? metricsResult.value : null)
    setProducts(productsResult.status === 'fulfilled' ? productsResult.value : [])
    setProjects(projectsResult.status === 'fulfilled' ? projectsResult.value : [])
    setTickets(ticketsResult.status === 'fulfilled' ? ticketsResult.value : [])
    setLoading(false)
  }

  useEffect(() => {
    void loadSalesOps()
  }, [canViewCatalog, canViewOperations, canViewSales, customerSegmentFilter, orderStatusFilter, projectStatusFilter, ticketStatusFilter])

  const operationalBacklog = useMemo(
    () => projects.filter((item) => item.status !== 'Completed').length + tickets.filter((item) => item.status !== 'Resolved').length,
    [projects, tickets]
  )

  function openCustomerModal() {
    customerForm.reset({ name: '', email: '', contactNumber: '', segment: customerSegmentFilter || 'SMB' })
    setCustomerModalOpen(true)
  }

  function openOrderModal() {
    orderForm.reset({
      customerId: customers[0]?.id || '',
      productId: products[0]?.id || '',
      quantity: 1,
      paymentMethod: 'Bank Transfer'
    })
    setOrderModalOpen(true)
  }

  function openProjectModal() {
    projectForm.reset({ name: '', customerName: customers[0]?.name || '', projectManager: '', budget: 0, dueDate: '' })
    setProjectModalOpen(true)
  }

  function openTicketModal() {
    ticketForm.reset({
      customerId: customers[0]?.id || '',
      customerName: customers[0]?.name || '',
      subject: '',
      priority: 'Medium',
      assignedTeam: 'Support',
      dueInHours: 24
    })
    setTicketModalOpen(true)
  }

  async function submitCustomer(values: CustomerFormValues) {
    await salesService.createCustomer(values)
    showToast('Customer created', `${values.name} was added to the sales workspace.`, 'success')
    setCustomerModalOpen(false)
    await loadSalesOps()
  }

  async function submitOrder(values: OrderFormValues) {
    await salesService.createOrder({
      customerId: values.customerId,
      paymentMethod: values.paymentMethod,
      lines: [{ productId: values.productId, quantity: Number(values.quantity) }]
    })
    showToast('Order created', 'A new order was submitted to the order-processing service.', 'success')
    setOrderModalOpen(false)
    await loadSalesOps()
  }

  async function submitProject(values: ProjectFormValues) {
    await salesService.createProject({
      name: values.name,
      customerName: values.customerName,
      projectManager: values.projectManager,
      budget: Number(values.budget),
      dueDate: new Date(values.dueDate).toISOString()
    })
    showToast('Project created', `${values.name} was added to the operations portfolio.`, 'success')
    setProjectModalOpen(false)
    await loadSalesOps()
  }

  async function submitTicket(values: TicketFormValues) {
    await salesService.createTicket({
      customerId: values.customerId || undefined,
      customerName: values.customerName,
      subject: values.subject,
      priority: values.priority,
      assignedTeam: values.assignedTeam,
      dueInHours: Number(values.dueInHours)
    })
    showToast('Ticket created', 'The service ticket was created in the operations queue.', 'success')
    setTicketModalOpen(false)
    await loadSalesOps()
  }

  async function openCustomerIntelligence(customerId: string) {
    const intelligence = await salesService.getCustomerIntelligence(customerId)
    setCustomerInsight(intelligence)
    setCustomerInsightOpen(true)
  }

  async function openOrderDetail(orderId: string) {
    const order = await salesService.getOrder(orderId)
    setSelectedOrder(order)
    setPendingOrderStatus(order.status)
    setOrderDetailOpen(true)
  }

  async function updateOrderStatus() {
    if (!selectedOrder) {
      return
    }

    const updated = await salesService.updateOrderStatus(selectedOrder.id, { status: pendingOrderStatus })
    setSelectedOrder(updated)
    showToast('Order updated', `${updated.orderNumber} is now ${updated.status}.`, 'success')
    await loadSalesOps()
  }

  function openWorkflowModal(target: WorkflowTarget) {
    if (!target) {
      return
    }

    setWorkflowTarget(target)
    setPendingWorkflowStatus(target.record.status)

    if (target.kind === 'project') {
      setPendingProjectPercent(target.record.percentComplete)
    }

    setWorkflowOpen(true)
  }

  async function updateWorkflow() {
    if (!workflowTarget) {
      return
    }

    if (workflowTarget.kind === 'project') {
      const updated = await salesService.updateProjectStatus(workflowTarget.record.id, {
        status: pendingWorkflowStatus,
        percentComplete: pendingProjectPercent
      })
      setWorkflowTarget({ kind: 'project', record: updated })
      showToast('Project updated', `${updated.projectCode} moved to ${updated.status}.`, 'success')
    } else {
      const updated = await salesService.updateTicketStatus(workflowTarget.record.id, { status: pendingWorkflowStatus })
      setWorkflowTarget({ kind: 'ticket', record: updated })
      showToast('Ticket updated', `${updated.ticketNumber} moved to ${updated.status}.`, 'success')
    }

    await loadSalesOps()
  }

  if (loading) {
    return <Spinner fullPage label="Loading sales and operations workspace" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Sales Ops"
        title="Sales and service operations"
        description="Manage customers, orders, delivery projects, and service tickets with fewer clicks and clearer workflow visibility."
        actions={
          <>
            {canViewSales ? (
              <button type="button" className="ghost-button" onClick={openCustomerModal}>
                Add customer
              </button>
            ) : null}
            {canViewSales && canViewCatalog ? (
              <button type="button" className="primary-button" onClick={openOrderModal} disabled={customers.length === 0 || products.length === 0}>
                Create order
              </button>
            ) : null}
            {canViewOperations ? (
              <button type="button" className="ghost-button" onClick={openProjectModal}>
                Create project
              </button>
            ) : null}
            {canViewOperations ? (
              <button type="button" className="ghost-button" onClick={openTicketModal}>
                Log ticket
              </button>
            ) : null}
          </>
        }
      />

      <section className="stat-grid">
        <StatCard label="Open orders" value={metrics?.openOrders ?? orders.length} format="number" subtitle="Sales fulfillment queue" />
        <StatCard label="Completed orders" value={metrics?.completedOrders ?? 0} format="number" subtitle="Closed order throughput" />
        <StatCard label="Revenue (30 days)" value={metrics?.revenueLast30Days ?? 0} format="currency" subtitle="Recent commercial activity" />
        <StatCard label="Operational backlog" value={operationalBacklog} format="number" subtitle="Projects and tickets still open" />
      </section>

      {canViewSales ? (
        <>
          <DataTable
            title="Orders"
            description="Order list, workflow status, and detail drill-down for the sales domain."
            columns={[
              { key: 'orderNumber', title: 'Order', sortable: true, render: (row) => <div className="table-primary"><strong>{row.orderNumber}</strong><span>{row.customerName}</span></div> },
              { key: 'orderDate', title: 'Ordered', sortable: true, render: (row) => formatDate(row.orderDate) },
              { key: 'totalAmount', title: 'Total', sortable: true, align: 'right', render: (row) => formatCurrency(row.totalAmount) },
              { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={orderTone(row.status)} /> },
              { key: 'actions', title: 'Actions', render: (row) => <button type="button" className="ghost-button" onClick={() => void openOrderDetail(row.id)}>View detail</button> }
            ]}
            data={orders}
            rowKey="id"
            searchKeys={['orderNumber', 'customerName', 'status']}
            searchPlaceholder="Search orders"
            toolbar={<select className="select" value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)}><option value="">All statuses</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Processing">Processing</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select>}
            emptyTitle="No orders returned"
            emptyDescription="No order records matched the current filter."
          />

          <DataTable
            title="Customers"
            description="Customer master view with intelligence drill-down from the sales service."
            columns={[
              { key: 'name', title: 'Customer', sortable: true, render: (row) => <div className="table-primary"><strong>{row.name}</strong><span>{row.email}</span></div> },
              { key: 'segment', title: 'Segment', sortable: true, render: (row) => <StatusBadge label={row.segment} tone="info" /> },
              { key: 'lifetimeValue', title: 'Lifetime value', sortable: true, align: 'right', render: (row) => formatCurrency(row.lifetimeValue) },
              { key: 'outstandingBalance', title: 'Outstanding', sortable: true, align: 'right', render: (row) => formatCurrency(row.outstandingBalance) },
              { key: 'actions', title: 'Actions', render: (row) => <button type="button" className="ghost-button" onClick={() => void openCustomerIntelligence(row.id)}>View intelligence</button> }
            ]}
            data={customers}
            rowKey="id"
            searchKeys={['name', 'email', 'segment', 'contactNumber']}
            searchPlaceholder="Search customers"
            toolbar={<select className="select" value={customerSegmentFilter} onChange={(event) => setCustomerSegmentFilter(event.target.value)}><option value="">All segments</option><option value="SMB">SMB</option><option value="Enterprise">Enterprise</option><option value="Strategic">Strategic</option></select>}
            emptyTitle="No customers returned"
            emptyDescription="No customers matched the selected segment."
          />
        </>
      ) : (
        <EmptyState title="Sales module hidden" description="The current role does not include sales-domain access." compact />
      )}

      {canViewOperations ? (
        <section className="dashboard-grid dashboard-grid--balanced">
          <DataTable
            title="Projects"
            description="Operations project portfolio and status workflow."
            columns={[
              { key: 'projectCode', title: 'Project', sortable: true, render: (row) => <div className="table-primary"><strong>{row.projectCode}</strong><span>{row.name}</span></div> },
              { key: 'customerName', title: 'Customer', sortable: true },
              { key: 'budget', title: 'Budget', sortable: true, align: 'right', render: (row) => formatCurrency(row.budget) },
              { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={projectTone(row.status)} /> },
              { key: 'percentComplete', title: 'Complete', sortable: true, align: 'right', render: (row) => `${row.percentComplete}%` },
              { key: 'actions', title: 'Actions', render: (row) => <button type="button" className="ghost-button" onClick={() => openWorkflowModal({ kind: 'project', record: row })}>Update</button> }
            ]}
            data={projects}
            rowKey="id"
            searchKeys={['projectCode', 'name', 'customerName', 'projectManager', 'status']}
            searchPlaceholder="Search projects"
            toolbar={<select className="select" value={projectStatusFilter} onChange={(event) => setProjectStatusFilter(event.target.value)}><option value="">All statuses</option><option value="Planning">Planning</option><option value="Active">Active</option><option value="At Risk">At Risk</option><option value="Completed">Completed</option><option value="On Hold">On Hold</option></select>}
            emptyTitle="No projects returned"
            emptyDescription="No projects matched the current status filter."
          />

          <DataTable
            title="Service desk"
            description="Ticket queue and status workflow for support operations."
            columns={[
              { key: 'ticketNumber', title: 'Ticket', sortable: true, render: (row) => <div className="table-primary"><strong>{row.ticketNumber}</strong><span>{row.subject}</span></div> },
              { key: 'customerName', title: 'Customer', sortable: true },
              { key: 'priority', title: 'Priority', sortable: true, render: (row) => <StatusBadge label={row.priority} tone={priorityTone(row.priority)} /> },
              { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={ticketTone(row.status)} /> },
              { key: 'dueAt', title: 'Due', sortable: true, render: (row) => formatDateTime(row.dueAt) },
              { key: 'actions', title: 'Actions', render: (row) => <button type="button" className="ghost-button" onClick={() => openWorkflowModal({ kind: 'ticket', record: row })}>Update</button> }
            ]}
            data={tickets}
            rowKey="id"
            searchKeys={['ticketNumber', 'customerName', 'subject', 'assignedTeam', 'status']}
            searchPlaceholder="Search tickets"
            toolbar={<select className="select" value={ticketStatusFilter} onChange={(event) => setTicketStatusFilter(event.target.value)}><option value="">All statuses</option><option value="New">New</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option><option value="Escalated">Escalated</option></select>}
            emptyTitle="No tickets returned"
            emptyDescription="No tickets matched the selected filter."
          />
        </section>
      ) : (
        <EmptyState title="Operations module hidden" description="The current role does not include operations-domain access." compact />
      )}

      <Modal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Add customer"
        description="Create a new customer record in the sales service."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setCustomerModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="customer-form" className="primary-button" disabled={customerForm.formState.isSubmitting}>
              {customerForm.formState.isSubmitting ? 'Saving...' : 'Create customer'}
            </button>
          </>
        }
      >
        <form id="customer-form" className="form-grid form-grid--two" onSubmit={customerForm.handleSubmit(submitCustomer)}>
          <InputField label="Customer name" error={customerForm.formState.errors.name?.message} registration={customerForm.register('name', { required: 'Customer name is required.' })} />
          <InputField label="Email" type="email" error={customerForm.formState.errors.email?.message} registration={customerForm.register('email', { required: 'Email is required.' })} />
          <InputField label="Contact number" error={customerForm.formState.errors.contactNumber?.message} registration={customerForm.register('contactNumber', { required: 'Contact number is required.' })} />
          <SelectField label="Segment" error={customerForm.formState.errors.segment?.message} registration={customerForm.register('segment', { required: 'Segment is required.' })}>
            <option value="SMB">SMB</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Strategic">Strategic</option>
          </SelectField>
        </form>
      </Modal>

      <Modal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title="Create order"
        description="Submit a new sales order with a simple line-item payload."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setOrderModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="order-form" className="primary-button" disabled={orderForm.formState.isSubmitting}>
              {orderForm.formState.isSubmitting ? 'Saving...' : 'Create order'}
            </button>
          </>
        }
      >
        <form id="order-form" className="form-grid form-grid--two" onSubmit={orderForm.handleSubmit(submitOrder)}>
          <SelectField label="Customer" error={orderForm.formState.errors.customerId?.message} registration={orderForm.register('customerId', { required: 'Customer is required.' })}>
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </SelectField>
          <SelectField label="Product" error={orderForm.formState.errors.productId?.message} registration={orderForm.register('productId', { required: 'Product is required.' })}>
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} / {product.sku}
              </option>
            ))}
          </SelectField>
          <InputField label="Quantity" type="number" error={orderForm.formState.errors.quantity?.message} registration={orderForm.register('quantity', { required: 'Quantity is required.', valueAsNumber: true, min: 1 })} />
          <SelectField label="Payment method" error={orderForm.formState.errors.paymentMethod?.message} registration={orderForm.register('paymentMethod', { required: 'Payment method is required.' })}>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
          </SelectField>
        </form>
      </Modal>

      <Modal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title="Create project"
        description="Register a project in the operations portfolio."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setProjectModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="project-form" className="primary-button" disabled={projectForm.formState.isSubmitting}>
              {projectForm.formState.isSubmitting ? 'Saving...' : 'Create project'}
            </button>
          </>
        }
      >
        <form id="project-form" className="form-grid form-grid--two" onSubmit={projectForm.handleSubmit(submitProject)}>
          <InputField label="Project name" error={projectForm.formState.errors.name?.message} registration={projectForm.register('name', { required: 'Project name is required.' })} />
          <InputField label="Customer name" error={projectForm.formState.errors.customerName?.message} registration={projectForm.register('customerName', { required: 'Customer is required.' })} />
          <InputField label="Project manager" error={projectForm.formState.errors.projectManager?.message} registration={projectForm.register('projectManager', { required: 'Project manager is required.' })} />
          <InputField label="Budget" type="number" step="0.01" error={projectForm.formState.errors.budget?.message} registration={projectForm.register('budget', { required: 'Budget is required.', valueAsNumber: true, min: 1 })} />
          <InputField label="Due date" type="date" error={projectForm.formState.errors.dueDate?.message} registration={projectForm.register('dueDate', { required: 'Due date is required.' })} />
        </form>
      </Modal>

      <Modal
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Log service ticket"
        description="Create a service-desk ticket in the operations queue."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setTicketModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="ticket-form" className="primary-button" disabled={ticketForm.formState.isSubmitting}>
              {ticketForm.formState.isSubmitting ? 'Saving...' : 'Create ticket'}
            </button>
          </>
        }
      >
        <form id="ticket-form" className="form-grid form-grid--two" onSubmit={ticketForm.handleSubmit(submitTicket)}>
          <SelectField label="Customer" registration={ticketForm.register('customerId')}>
            <option value="">Select existing customer (optional)</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </SelectField>
          <InputField label="Customer name" error={ticketForm.formState.errors.customerName?.message} registration={ticketForm.register('customerName', { required: 'Customer name is required.' })} />
          <InputField label="Subject" error={ticketForm.formState.errors.subject?.message} registration={ticketForm.register('subject', { required: 'Subject is required.' })} />
          <SelectField label="Priority" error={ticketForm.formState.errors.priority?.message} registration={ticketForm.register('priority', { required: 'Priority is required.' })}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </SelectField>
          <InputField label="Assigned team" error={ticketForm.formState.errors.assignedTeam?.message} registration={ticketForm.register('assignedTeam', { required: 'Assigned team is required.' })} />
          <InputField label="Due in hours" type="number" error={ticketForm.formState.errors.dueInHours?.message} registration={ticketForm.register('dueInHours', { required: 'Due-in-hours is required.', valueAsNumber: true, min: 1 })} />
        </form>
      </Modal>

      <Modal open={customerInsightOpen} onClose={() => setCustomerInsightOpen(false)} title={customerInsight?.customerName || 'Customer intelligence'} description="Customer value and churn-expansion guidance from the sales intelligence endpoint.">
        {customerInsight ? (
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Commercial profile</h4>
              <dl className="detail-list">
                <div><dt>Lifetime value</dt><dd>{formatCurrency(customerInsight.lifetimeValue)}</dd></div>
                <div><dt>Average order value</dt><dd>{formatCurrency(customerInsight.averageOrderValue)}</dd></div>
                <div><dt>Orders</dt><dd>{customerInsight.ordersCount}</dd></div>
                <div><dt>Outstanding balance</dt><dd>{formatCurrency(customerInsight.outstandingBalance)}</dd></div>
              </dl>
            </div>
            <div className="detail-card">
              <h4>Growth signals</h4>
              <div className="stack-list">
                <div className="list-row"><div><strong>Churn risk</strong><p>{customerInsight.churnRiskScore}%</p></div><StatusBadge label="Retention" tone={customerInsight.churnRiskScore > 60 ? 'danger' : 'warning'} /></div>
                <div className="list-row"><div><strong>Expansion score</strong><p>{customerInsight.expansionScore}%</p></div><StatusBadge label="Growth" tone={customerInsight.expansionScore > 60 ? 'success' : 'info'} /></div>
                <div className="list-row list-row--stacked"><div><strong>Next best action</strong><p>{customerInsight.nextBestAction}</p></div><StatusBadge label="Recommendation" tone="info" /></div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={orderDetailOpen}
        onClose={() => setOrderDetailOpen(false)}
        title={selectedOrder?.orderNumber || 'Order detail'}
        description={selectedOrder ? `${selectedOrder.customerName} / ${formatDate(selectedOrder.orderDate)}` : 'Order detail'}
        size="lg"
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setOrderDetailOpen(false)}>
              Close
            </button>
            <button type="button" className="primary-button" onClick={() => void updateOrderStatus()}>
              Update status
            </button>
          </>
        }
      >
        {selectedOrder ? (
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Order summary</h4>
              <dl className="detail-list">
                <div><dt>Status</dt><dd><StatusBadge label={selectedOrder.status} tone={orderTone(selectedOrder.status)} /></dd></div>
                <div><dt>Subtotal</dt><dd>{formatCurrency(selectedOrder.subtotal)}</dd></div>
                <div><dt>Tax</dt><dd>{formatCurrency(selectedOrder.taxAmount)}</dd></div>
                <div><dt>Total</dt><dd>{formatCurrency(selectedOrder.totalAmount)}</dd></div>
              </dl>
            </div>
            <div className="detail-card">
              <h4>Workflow</h4>
              <label className="field">
                <span className="field__label">Order status</span>
                <select className="select" value={pendingOrderStatus} onChange={(event) => setPendingOrderStatus(event.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>
            </div>
            <div className="detail-card detail-card--full">
              <h4>Line items</h4>
              <div className="stack-list">
                {selectedOrder.lines.map((line) => (
                  <div key={`${selectedOrder.id}-${line.productId}`} className="list-row">
                    <div><strong>{line.productName}</strong><p>Qty {line.quantity}</p></div>
                    <span className="metric-inline">{formatCurrency(line.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={workflowOpen}
        onClose={() => setWorkflowOpen(false)}
        title={workflowTarget ? `${workflowTarget.kind === 'project' ? workflowTarget.record.projectCode : workflowTarget.record.ticketNumber} workflow` : 'Workflow update'}
        description={workflowTarget ? `Update ${workflowTarget.kind} status using the operations service workflow endpoints.` : 'Workflow update'}
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setWorkflowOpen(false)}>
              Cancel
            </button>
            <button type="button" className="primary-button" onClick={() => void updateWorkflow()}>
              Save
            </button>
          </>
        }
      >
        <div className="form-grid form-grid--two">
          <label className="field">
            <span className="field__label">Status</span>
            <select className="select" value={pendingWorkflowStatus} onChange={(event) => setPendingWorkflowStatus(event.target.value)}>
              {workflowTarget?.kind === 'project' ? (
                <>
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </>
              ) : (
                <>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </>
              )}
            </select>
          </label>
          {workflowTarget?.kind === 'project' ? (
            <label className="field">
              <span className="field__label">Percent complete</span>
              <input className="input" type="number" min="0" max="100" value={pendingProjectPercent} onChange={(event) => setPendingProjectPercent(Number(event.target.value))} />
            </label>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}
