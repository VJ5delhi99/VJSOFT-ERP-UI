import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CategoryBarChart } from '../components/Charts'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import { InputField, SelectField } from '../components/FormField'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import SegmentedControl from '../components/SegmentedControl'
import Spinner from '../components/Spinner'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import SupplyChainEnterprisePanel from '../components/enterprise/SupplyChainEnterprisePanel'
import { roleGroups } from '../config/rbac'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { catalogService } from '../services/catalogService'
import { inventoryService } from '../services/inventoryService'
import type {
  AnomalyDetectionDto,
  AssetDto,
  CategorySummaryDto,
  DemandForecastDto,
  InventoryDashboardDto,
  InventoryItemDto,
  ProductDto,
  PurchaseOrderDto,
  ReorderRecommendationDto,
  SupplierDto,
  WorkOrderDto
} from '../types'
import { formatCurrency, formatDate, formatDateTime } from '../utils/format'

interface CategoryFormValues {
  name: string
}

interface SupplierFormValues {
  name: string
  contactName: string
  email: string
  leadTimeDays: number
}

interface ProductFormValues {
  name: string
  description: string
  categoryName: string
  supplierName: string
  price: number
  cost: number
  stockQuantity: number
  reorderLevel: number
  isActive: string
}

interface AdjustmentFormValues {
  quantityDelta: number
  reason: string
}

interface PurchaseOrderFormValues {
  supplierId: string
  productId: string
  quantity: number
  notes: string
}

interface MaintenanceFormValues {
  servicedAt: string
  conditionScore: number
  notes: string
}

interface WorkOrderFormValues {
  productId: string
  productName: string
  workCenter: string
  quantity: number
  plannedDurationHours: number
}

function inventoryTone(isLowStock: boolean) {
  return isLowStock ? 'danger' : 'success'
}

function purchaseOrderTone(status: string) {
  return status.toLowerCase() === 'received' ? 'success' : 'warning'
}

function workOrderTone(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success' as const
    case 'blocked':
      return 'danger' as const
    case 'in progress':
      return 'info' as const
    default:
      return 'warning' as const
  }
}

function anomalyTone(value: string) {
  switch (value.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'danger' as const
    case 'medium':
      return 'warning' as const
    default:
      return 'info' as const
  }
}

export default function Products() {
  const { canAccess, user } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'catalog' | 'inventory' | 'operations' | 'enterprise'>('catalog')
  const [catalogOverview, setCatalogOverview] = useState<Awaited<ReturnType<typeof catalogService.getOverview>> | null>(null)
  const [inventoryDashboard, setInventoryDashboard] = useState<InventoryDashboardDto | null>(null)
  const [categories, setCategories] = useState<CategorySummaryDto[]>([])
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItemDto[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderDto[]>([])
  const [reorderRecommendations, setReorderRecommendations] = useState<ReorderRecommendationDto[]>([])
  const [demandForecast, setDemandForecast] = useState<DemandForecastDto[]>([])
  const [assets, setAssets] = useState<AssetDto[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrderDto[]>([])
  const [anomalies, setAnomalies] = useState<AnomalyDetectionDto[]>([])
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [supplierModalOpen, setSupplierModalOpen] = useState(false)
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false)
  const [purchaseOrderModalOpen, setPurchaseOrderModalOpen] = useState(false)
  const [receiveModalOpen, setReceiveModalOpen] = useState(false)
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false)
  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false)
  const [workOrderStatusOpen, setWorkOrderStatusOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategorySummaryDto | null>(null)
  const [editingSupplier, setEditingSupplier] = useState<SupplierDto | null>(null)
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItemDto | null>(null)
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrderDto | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<AssetDto | null>(null)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderDto | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<ProductDto | null>(null)
  const [archiveSubmitting, setArchiveSubmitting] = useState(false)
  const [receiveNotes, setReceiveNotes] = useState('')
  const [receiveAt, setReceiveAt] = useState('')
  const [pendingWorkOrderStatus, setPendingWorkOrderStatus] = useState('Scheduled')
  const [pendingProducedQuantity, setPendingProducedQuantity] = useState(0)

  const canViewCatalog = canAccess(roleGroups.catalogAccess)
  const canViewInventory = canAccess(roleGroups.inventoryAccess)
  const canManageInventory = canAccess(undefined, ['CanManageInventory'])
  const canApprovePurchase = canAccess(undefined, ['CanApprovePurchase'])

  const categoryForm = useForm<CategoryFormValues>({ defaultValues: { name: '' } })
  const supplierForm = useForm<SupplierFormValues>({ defaultValues: { name: '', contactName: '', email: '', leadTimeDays: 7 } })
  const productForm = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      categoryName: '',
      supplierName: '',
      price: 0,
      cost: 0,
      stockQuantity: 0,
      reorderLevel: 0,
      isActive: 'true'
    }
  })
  const adjustmentForm = useForm<AdjustmentFormValues>({ defaultValues: { quantityDelta: 0, reason: '' } })
  const purchaseOrderForm = useForm<PurchaseOrderFormValues>({ defaultValues: { supplierId: '', productId: '', quantity: 1, notes: '' } })
  const maintenanceForm = useForm<MaintenanceFormValues>({ defaultValues: { servicedAt: '', conditionScore: 80, notes: '' } })
  const workOrderForm = useForm<WorkOrderFormValues>({ defaultValues: { productId: '', productName: '', workCenter: '', quantity: 1, plannedDurationHours: 8 } })

  async function loadWorkspace() {
    setLoading(true)

    const [
      catalogOverviewResult,
      categoriesResult,
      suppliersResult,
      productsResult,
      inventoryDashboardResult,
      inventoryItemsResult,
      purchaseOrdersResult,
      reorderRecommendationsResult,
      demandForecastResult,
      assetsResult,
      workOrdersResult,
      anomaliesResult
    ] = await Promise.allSettled([
      canViewCatalog ? catalogService.getOverview() : Promise.resolve(null),
      canViewCatalog ? catalogService.getCategories() : Promise.resolve([]),
      canViewCatalog ? catalogService.getSuppliers() : Promise.resolve([]),
      canViewCatalog ? catalogService.getProducts(undefined, true) : Promise.resolve([]),
      canViewInventory ? inventoryService.getDashboard() : Promise.resolve(null),
      canViewInventory ? inventoryService.getItems() : Promise.resolve([]),
      canViewInventory ? inventoryService.getPurchaseOrders() : Promise.resolve([]),
      canViewInventory ? inventoryService.getReorderRecommendations(14) : Promise.resolve([]),
      canViewInventory ? inventoryService.getDemandForecast(14) : Promise.resolve([]),
      canViewInventory ? inventoryService.getAssets(false) : Promise.resolve([]),
      canViewInventory ? inventoryService.getWorkOrders() : Promise.resolve([]),
      canViewInventory ? inventoryService.getAnomalies(6) : Promise.resolve([])
    ])

    setCatalogOverview(catalogOverviewResult.status === 'fulfilled' ? catalogOverviewResult.value : null)
    setCategories(categoriesResult.status === 'fulfilled' ? categoriesResult.value : [])
    setSuppliers(suppliersResult.status === 'fulfilled' ? suppliersResult.value : [])
    setProducts(productsResult.status === 'fulfilled' ? productsResult.value : [])
    setInventoryDashboard(inventoryDashboardResult.status === 'fulfilled' ? inventoryDashboardResult.value : null)
    setInventoryItems(inventoryItemsResult.status === 'fulfilled' ? inventoryItemsResult.value : [])
    setPurchaseOrders(purchaseOrdersResult.status === 'fulfilled' ? purchaseOrdersResult.value : [])
    setReorderRecommendations(reorderRecommendationsResult.status === 'fulfilled' ? reorderRecommendationsResult.value.slice(0, 6) : [])
    setDemandForecast(demandForecastResult.status === 'fulfilled' ? demandForecastResult.value.slice(0, 6) : [])
    setAssets(assetsResult.status === 'fulfilled' ? assetsResult.value : [])
    setWorkOrders(workOrdersResult.status === 'fulfilled' ? workOrdersResult.value : [])
    setAnomalies(anomaliesResult.status === 'fulfilled' ? anomaliesResult.value : [])
    setLoading(false)
  }

  useEffect(() => {
    void loadWorkspace()
  }, [canViewCatalog, canViewInventory])

  const demandBars = useMemo(
    () => demandForecast.map((item) => ({ label: item.productName, value: item.forecastUnits })),
    [demandForecast]
  )

  function openCategoryModal(category?: CategorySummaryDto) {
    setEditingCategory(category || null)
    categoryForm.reset({ name: category?.name || '' })
    setCategoryModalOpen(true)
  }

  function openSupplierModal(supplier?: SupplierDto) {
    setEditingSupplier(supplier || null)
    supplierForm.reset({
      name: supplier?.name || '',
      contactName: supplier?.contactName || '',
      email: supplier?.email || '',
      leadTimeDays: supplier?.leadTimeDays || 7
    })
    setSupplierModalOpen(true)
  }

  function openProductModal(product?: ProductDto) {
    setEditingProduct(product || null)
    productForm.reset({
      name: product?.name || '',
      description: product?.description || '',
      categoryName: product?.category || categories[0]?.name || '',
      supplierName: product?.supplier || suppliers[0]?.name || '',
      price: product?.price || 0,
      cost: product?.cost || 0,
      stockQuantity: product?.stockQuantity || 0,
      reorderLevel: product?.reorderLevel || 0,
      isActive: String(product?.isActive ?? true)
    })
    setProductModalOpen(true)
  }

  function openAdjustmentModal(item: InventoryItemDto) {
    setSelectedInventoryItem(item)
    adjustmentForm.reset({ quantityDelta: 0, reason: '' })
    setAdjustmentModalOpen(true)
  }

  function openPurchaseOrderModal() {
    purchaseOrderForm.reset({
      supplierId: suppliers[0]?.id || '',
      productId: products.find((item) => item.isActive)?.id || '',
      quantity: 1,
      notes: ''
    })
    setPurchaseOrderModalOpen(true)
  }

  function openReceiveModal(order: PurchaseOrderDto) {
    setSelectedPurchaseOrder(order)
    setReceiveNotes('')
    setReceiveAt('')
    setReceiveModalOpen(true)
  }

  function openMaintenanceModal(asset: AssetDto) {
    setSelectedAsset(asset)
    maintenanceForm.reset({ servicedAt: '', conditionScore: asset.conditionScore, notes: '' })
    setMaintenanceModalOpen(true)
  }

  function openWorkOrderModal() {
    const product = products.find((item) => item.isActive)
    workOrderForm.reset({
      productId: product?.id || '',
      productName: product?.name || '',
      workCenter: '',
      quantity: 1,
      plannedDurationHours: 8
    })
    setWorkOrderModalOpen(true)
  }

  function openWorkOrderStatusModal(workOrder: WorkOrderDto) {
    setSelectedWorkOrder(workOrder)
    setPendingWorkOrderStatus(workOrder.status)
    setPendingProducedQuantity(workOrder.producedQuantity)
    setWorkOrderStatusOpen(true)
  }

  async function submitCategory(values: CategoryFormValues) {
    if (editingCategory) {
      await catalogService.updateCategory(editingCategory.id, values)
      showToast('Category saved', `${values.name} has been updated.`, 'success')
    } else {
      await catalogService.createCategory(values)
      showToast('Category saved', `${values.name} has been added.`, 'success')
    }
    setCategoryModalOpen(false)
    await loadWorkspace()
  }

  async function submitSupplier(values: SupplierFormValues) {
    const payload = { ...values, leadTimeDays: Number(values.leadTimeDays) }
    if (editingSupplier) {
      await catalogService.updateSupplier(editingSupplier.id, payload)
      showToast('Supplier saved', `${values.name} has been updated.`, 'success')
    } else {
      await catalogService.createSupplier(payload)
      showToast('Supplier saved', `${values.name} has been added.`, 'success')
    }
    setSupplierModalOpen(false)
    await loadWorkspace()
  }

  async function submitProduct(values: ProductFormValues) {
    const payload = {
      name: values.name,
      description: values.description,
      categoryName: values.categoryName,
      supplierName: values.supplierName,
      price: Number(values.price),
      cost: Number(values.cost),
      stockQuantity: Number(values.stockQuantity),
      reorderLevel: Number(values.reorderLevel),
      isActive: values.isActive === 'true'
    }

    if (editingProduct) {
      await catalogService.updateProduct(editingProduct.id, payload)
      showToast('Product saved', `${values.name} has been updated.`, 'success')
    } else {
      await catalogService.createProduct(payload)
      showToast('Product saved', `${values.name} has been added.`, 'success')
    }
    setProductModalOpen(false)
    await loadWorkspace()
  }

  async function archiveProduct() {
    if (!archiveTarget) {
      return
    }

    setArchiveSubmitting(true)

    try {
      await catalogService.removeProduct(archiveTarget.id)
      showToast('Product archived', `${archiveTarget.name} has been marked inactive.`, 'warning')
      setArchiveTarget(null)
      await loadWorkspace()
    } finally {
      setArchiveSubmitting(false)
    }
  }

  async function submitAdjustment(values: AdjustmentFormValues) {
    if (!selectedInventoryItem) {
      return
    }

    await inventoryService.adjustInventory(selectedInventoryItem.productId, {
      quantityDelta: Number(values.quantityDelta),
      reason: values.reason
    })
    showToast('Stock updated', `${selectedInventoryItem.productName} stock has been updated.`, 'success')
    setAdjustmentModalOpen(false)
    await loadWorkspace()
  }

  async function submitPurchaseOrder(values: PurchaseOrderFormValues) {
    await inventoryService.createPurchaseOrder({
      supplierId: values.supplierId,
      lines: [{ productId: values.productId, quantity: Number(values.quantity) }],
      notes: values.notes
    })
    showToast('Purchase order created', 'The purchase order has been saved.', 'success')
    setPurchaseOrderModalOpen(false)
    await loadWorkspace()
  }

  async function submitMaintenance(values: MaintenanceFormValues) {
    if (!selectedAsset) {
      return
    }

    await inventoryService.recordMaintenance(selectedAsset.id, {
      servicedAt: values.servicedAt ? new Date(values.servicedAt).toISOString() : undefined,
      conditionScore: Number(values.conditionScore),
      notes: values.notes
    })
    showToast('Maintenance saved', `${selectedAsset.assetTag} maintenance has been recorded.`, 'success')
    setMaintenanceModalOpen(false)
    await loadWorkspace()
  }

  async function submitWorkOrder(values: WorkOrderFormValues) {
    const selectedProduct = products.find((item) => item.id === values.productId)
    await inventoryService.createWorkOrder({
      productId: values.productId || undefined,
      productName: selectedProduct?.name || values.productName,
      workCenter: values.workCenter,
      quantity: Number(values.quantity),
      plannedDurationHours: Number(values.plannedDurationHours)
    })
    showToast('Work order created', 'The work order has been created.', 'success')
    setWorkOrderModalOpen(false)
    await loadWorkspace()
  }

  async function receivePurchaseOrder() {
    if (!selectedPurchaseOrder) {
      return
    }

    await inventoryService.receivePurchaseOrder(selectedPurchaseOrder.id, {
      receivedAt: receiveAt ? new Date(receiveAt).toISOString() : undefined,
      notes: receiveNotes
    })
    showToast('Goods received', `${selectedPurchaseOrder.purchaseOrderNumber} has been received.`, 'success')
    setReceiveModalOpen(false)
    await loadWorkspace()
  }

  async function updateWorkOrderStatus() {
    if (!selectedWorkOrder) {
      return
    }

    await inventoryService.updateWorkOrderStatus(selectedWorkOrder.id, {
      status: pendingWorkOrderStatus,
      producedQuantity: pendingProducedQuantity
    })
    showToast('Work order updated', `${selectedWorkOrder.workOrderNumber} is now ${pendingWorkOrderStatus}.`, 'success')
    setWorkOrderStatusOpen(false)
    await loadWorkspace()
  }

  if (loading) {
    return <Spinner fullPage label="Loading product and inventory information" />
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Supply Chain"
        title="Supply chain"
        description="Manage catalog setup, stock, purchasing, assets, and work orders from one operational area."
        actions={
          <>
            {canViewCatalog && canManageInventory ? (
              <button type="button" className="ghost-button" onClick={() => openProductModal()}>
                Add product
              </button>
            ) : null}
            {canViewCatalog && canViewInventory && canApprovePurchase ? (
              <button type="button" className="ghost-button" onClick={openPurchaseOrderModal}>
                New purchase order
              </button>
            ) : null}
            {canViewInventory && canManageInventory ? (
              <button type="button" className="primary-button" onClick={openWorkOrderModal}>
                New work order
              </button>
            ) : null}
          </>
        }
      />

      <section className="stat-grid">
        <StatCard label="Active products" value={catalogOverview?.activeProducts ?? products.filter((item) => item.isActive).length} format="number" subtitle="Products available today" />
        <StatCard label="Low-stock products" value={inventoryDashboard?.lowStockProducts ?? catalogOverview?.lowStockProducts ?? 0} format="number" subtitle="Items needing replenishment" />
        <StatCard label="Inventory value" value={inventoryDashboard?.inventoryValue ?? catalogOverview?.inventoryValue ?? 0} format="currency" subtitle="Current stock value" />
        <StatCard label="Open purchase orders" value={purchaseOrders.filter((item) => item.status !== 'Received').length} format="number" subtitle="Orders still in progress" />
      </section>

      <SegmentedControl
        label="Supply chain work areas"
        value={activeView}
        onChange={(value) => setActiveView(value as 'catalog' | 'inventory' | 'operations' | 'enterprise')}
        options={[
          { value: 'catalog', label: 'Catalog', description: 'Products, categories, and suppliers' },
          { value: 'inventory', label: 'Inventory', description: 'Stock, purchasing, and replenishment' },
          { value: 'operations', label: 'Operations', description: 'Assets, maintenance, and work orders' },
          { value: 'enterprise', label: 'Enterprise', description: 'Warehouses, fixed assets, logistics, and PLM' }
        ]}
      />

      {activeView === 'inventory' ? (
      <section className="dashboard-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Demand forecast</h3>
              <p>Expected demand for the next planning period.</p>
            </div>
          </div>
          {demandBars.length > 0 ? <CategoryBarChart data={demandBars} /> : <EmptyState title="No demand outlook" description="Demand forecast information is not available for this account." compact />}
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <h3>Priority actions</h3>
              <p>Warnings and reorder suggestions to review first.</p>
            </div>
          </div>
          <div className="stack-list">
            {anomalies.map((item) => (
              <div key={`${item.domain}-${item.title}`} className="list-row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.narrative}</p>
                </div>
                <StatusBadge label={item.severity} tone={anomalyTone(item.severity)} />
              </div>
            ))}
            {reorderRecommendations.map((item) => (
              <div key={item.productId} className="list-row">
                <div>
                  <strong>{item.productName}</strong>
                  <p>
                    {item.currentStock} on hand / order {item.recommendedOrderQuantity}
                  </p>
                </div>
                <StatusBadge label={item.urgency} tone={anomalyTone(item.urgency)} />
              </div>
            ))}
            {anomalies.length === 0 && reorderRecommendations.length === 0 ? (
              <EmptyState title="No priority actions" description="There are no urgent issues or reorder recommendations right now." compact />
            ) : null}
          </div>
        </article>
      </section>
      ) : null}

      {activeView === 'catalog' ? (canViewCatalog ? (
        <>
          <section className="dashboard-grid dashboard-grid--balanced">
            <article className="surface-card">
              <div className="section-heading">
                <div>
                  <h3>Categories</h3>
                  <p>Organize products into clear categories.</p>
                </div>
                {canManageInventory ? (
                  <button type="button" className="ghost-button" onClick={() => openCategoryModal()}>
                    Add category
                  </button>
                ) : null}
              </div>
              <div className="stack-list">
                {categories.map((item) => (
                  <div key={item.id} className="list-row">
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.activeProductsCount} active products / {item.lowStockProducts} low on stock
                      </p>
                    </div>
                    {canManageInventory ? (
                      <button type="button" className="ghost-button" onClick={() => openCategoryModal(item)}>
                        Edit
                      </button>
                    ) : (
                      <StatusBadge label="Read only" tone="info" />
                    )}
                  </div>
                ))}
                {categories.length === 0 ? <EmptyState title="No categories" description="Add a category to organize your products." compact /> : null}
              </div>
            </article>

            <article className="surface-card">
              <div className="section-heading">
                <div>
                  <h3>Suppliers</h3>
                  <p>Suppliers used for purchasing and replenishment.</p>
                </div>
                {canApprovePurchase ? (
                  <button type="button" className="ghost-button" onClick={() => openSupplierModal()}>
                    Add supplier
                  </button>
                ) : null}
              </div>
              <div className="stack-list">
                {suppliers.map((item) => (
                  <div key={item.id} className="list-row">
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.openPurchaseOrders} open orders / lead time {item.leadTimeDays} days
                      </p>
                    </div>
                    {canApprovePurchase ? (
                      <button type="button" className="ghost-button" onClick={() => openSupplierModal(item)}>
                        Edit
                      </button>
                    ) : (
                      <StatusBadge label={`${item.fulfillmentRiskScore}% risk`} tone={item.fulfillmentRiskScore > 70 ? 'danger' : 'warning'} />
                    )}
                  </div>
                ))}
                {suppliers.length === 0 ? <EmptyState title="No suppliers" description="Add a supplier to support purchasing." compact /> : null}
              </div>
            </article>
          </section>

          <DataTable
            title="Products"
            description="Manage product details, stock status, and availability."
            columns={[
              { key: 'name', title: 'Product', sortable: true, render: (row) => <div className="table-primary"><strong>{row.name}</strong><span>{row.sku}</span></div> },
              { key: 'category', title: 'Category', sortable: true },
              { key: 'supplier', title: 'Supplier', sortable: true },
              { key: 'price', title: 'Price', sortable: true, align: 'right', render: (row) => formatCurrency(row.price) },
              { key: 'stockQuantity', title: 'Stock', sortable: true, render: (row) => <StatusBadge label={`${row.stockQuantity}`} tone={inventoryTone(row.isLowStock)} /> },
              { key: 'isActive', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.isActive ? 'Active' : 'Inactive'} tone={row.isActive ? 'success' : 'warning'} /> },
              { key: 'actions', title: 'Actions', render: (row) => canManageInventory ? <div className="table-actions"><button type="button" className="ghost-button" onClick={() => openProductModal(row)}>Edit</button><button type="button" className="danger-button" onClick={() => setArchiveTarget(row)}>Archive</button></div> : 'View details' }
            ]}
            data={products}
            rowKey="id"
            searchKeys={['name', 'sku', 'category', 'supplier', 'description']}
            searchPlaceholder="Search products"
            emptyTitle="No products found"
            emptyDescription="Add a product or try a different search."
          />
        </>
      ) : (
        <EmptyState title="Catalog unavailable" description="This account does not currently have access to product details." compact />
      )) : null}

      {activeView === 'inventory' ? (canViewInventory ? (
        <>
          <section className="dashboard-grid dashboard-grid--balanced">
            <DataTable
              title="Inventory items"
              description="Current stock levels and quick adjustments."
              columns={[
                { key: 'productName', title: 'Item', sortable: true, render: (row) => <div className="table-primary"><strong>{row.productName}</strong><span>{row.sku}</span></div> },
                { key: 'supplier', title: 'Supplier', sortable: true },
                { key: 'stockQuantity', title: 'On hand', sortable: true, align: 'right' },
                { key: 'availableCoverDays', title: 'Cover days', sortable: true, align: 'right' },
                { key: 'inventoryValue', title: 'Value', sortable: true, align: 'right', render: (row) => formatCurrency(row.inventoryValue) },
                { key: 'actions', title: 'Actions', render: (row) => canManageInventory ? <button type="button" className="ghost-button" onClick={() => openAdjustmentModal(row)}>Adjust stock</button> : 'View details' }
              ]}
              data={inventoryItems}
              rowKey="productId"
              searchKeys={['productName', 'sku', 'supplier']}
              searchPlaceholder="Search inventory"
              emptyTitle="No inventory items"
              emptyDescription="Stock items will appear here when inventory is available."
            />

            <DataTable
              title="Purchase orders"
              description="Track purchase orders and received goods."
              columns={[
                { key: 'purchaseOrderNumber', title: 'Purchase order', sortable: true, render: (row) => <div className="table-primary"><strong>{row.purchaseOrderNumber}</strong><span>{row.supplierName}</span></div> },
                { key: 'expectedDeliveryDate', title: 'Expected', sortable: true, render: (row) => formatDate(row.expectedDeliveryDate) },
                { key: 'totalCost', title: 'Total cost', sortable: true, align: 'right', render: (row) => formatCurrency(row.totalCost) },
                { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={purchaseOrderTone(row.status)} /> },
                { key: 'actions', title: 'Actions', render: (row) => canApprovePurchase && row.status !== 'Received' ? <button type="button" className="ghost-button" onClick={() => openReceiveModal(row)}>Receive goods</button> : 'Closed' }
              ]}
              data={purchaseOrders}
              rowKey="id"
              searchKeys={['purchaseOrderNumber', 'supplierName', 'status']}
              searchPlaceholder="Search purchase orders"
              emptyTitle="No purchase orders"
              emptyDescription="Purchase orders will appear here after they are created."
            />
          </section>
        </>
      ) : (
        <EmptyState title="Inventory unavailable" description="This account does not currently have access to inventory information." compact />
      )) : null}

      {activeView === 'operations' ? (canViewInventory ? (
        <section className="dashboard-grid dashboard-grid--balanced">
          <DataTable
            title="Assets"
            description="Equipment and maintenance planning."
            columns={[
              { key: 'assetTag', title: 'Asset', sortable: true, render: (row) => <div className="table-primary"><strong>{row.assetTag}</strong><span>{row.name}</span></div> },
              { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={row.maintenanceRiskScore > 70 ? 'danger' : 'info'} /> },
              { key: 'nextServiceDueAt', title: 'Next service', sortable: true, render: (row) => formatDate(row.nextServiceDueAt) },
              { key: 'conditionScore', title: 'Condition', sortable: true, align: 'right', render: (row) => `${row.conditionScore}%` },
              { key: 'actions', title: 'Actions', render: (row) => canManageInventory ? <button type="button" className="ghost-button" onClick={() => openMaintenanceModal(row)}>Record maintenance</button> : 'View details' }
            ]}
            data={assets}
            rowKey="id"
            searchKeys={['assetTag', 'name', 'category', 'status']}
            searchPlaceholder="Search assets"
            emptyTitle="No assets"
            emptyDescription="Assets will appear here when they are added to the organization."
          />

          <DataTable
            title="Work orders"
            description="Production work and status updates."
            columns={[
              { key: 'workOrderNumber', title: 'Work order', sortable: true, render: (row) => <div className="table-primary"><strong>{row.workOrderNumber}</strong><span>{row.productName}</span></div> },
              { key: 'workCenter', title: 'Work center', sortable: true },
              { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={workOrderTone(row.status)} /> },
              { key: 'scheduledStart', title: 'Start', sortable: true, render: (row) => formatDateTime(row.scheduledStart) },
              { key: 'actions', title: 'Actions', render: (row) => canManageInventory ? <button type="button" className="ghost-button" onClick={() => openWorkOrderStatusModal(row)}>Update status</button> : 'View details' }
            ]}
            data={workOrders}
            rowKey="id"
            searchKeys={['workOrderNumber', 'productName', 'workCenter', 'status']}
            searchPlaceholder="Search work orders"
            emptyTitle="No work orders"
            emptyDescription="Work orders will appear here after they are created."
          />
        </section>
      ) : (
        <EmptyState title="Operations unavailable" description="This account does not currently have access to asset or work-order information." compact />
      )) : null}

      {activeView === 'enterprise' ? (canViewInventory ? (
        <SupplyChainEnterprisePanel products={products} />
      ) : (
        <EmptyState title="Enterprise supply chain unavailable" description="This account does not currently have access to enterprise supply and asset workflows." compact />
      )) : null}

      <Modal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'Edit category' : 'Add category'}
        description="Create or update a product category."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="category-form" className="primary-button" disabled={categoryForm.formState.isSubmitting}>
              {categoryForm.formState.isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <form id="category-form" className="form-grid" onSubmit={categoryForm.handleSubmit(submitCategory)}>
          <InputField label="Category name" error={categoryForm.formState.errors.name?.message} registration={categoryForm.register('name', { required: 'Please enter a category name.' })} />
        </form>
      </Modal>

      <Modal
        open={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        title={editingSupplier ? 'Edit supplier' : 'Add supplier'}
        description="Create or update supplier details."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setSupplierModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="supplier-form" className="primary-button" disabled={supplierForm.formState.isSubmitting}>
              {supplierForm.formState.isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <form id="supplier-form" className="form-grid form-grid--two" onSubmit={supplierForm.handleSubmit(submitSupplier)}>
          <InputField label="Supplier name" error={supplierForm.formState.errors.name?.message} registration={supplierForm.register('name', { required: 'Please enter a supplier name.' })} />
          <InputField label="Contact name" error={supplierForm.formState.errors.contactName?.message} registration={supplierForm.register('contactName', { required: 'Please enter a contact name.' })} />
          <InputField label="Email" type="email" error={supplierForm.formState.errors.email?.message} registration={supplierForm.register('email', { required: 'Please enter an email address.' })} />
          <InputField label="Lead time (days)" type="number" error={supplierForm.formState.errors.leadTimeDays?.message} registration={supplierForm.register('leadTimeDays', { required: 'Please enter lead time in days.', valueAsNumber: true, min: 1 })} />
        </form>
      </Modal>

      <Modal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Edit product' : 'Add product'}
        description="Create or update a product."
        size="lg"
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setProductModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="product-form" className="primary-button" disabled={productForm.formState.isSubmitting}>
              {productForm.formState.isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <form id="product-form" className="form-grid form-grid--two" onSubmit={productForm.handleSubmit(submitProduct)}>
          <InputField label="Product name" error={productForm.formState.errors.name?.message} registration={productForm.register('name', { required: 'Please enter a product name.' })} />
          <InputField label="Description" error={productForm.formState.errors.description?.message} registration={productForm.register('description', { required: 'Please enter a description.' })} />
          <SelectField label="Category" error={productForm.formState.errors.categoryName?.message} registration={productForm.register('categoryName', { required: 'Please choose a category.' })}>
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </SelectField>
          <SelectField label="Supplier" error={productForm.formState.errors.supplierName?.message} registration={productForm.register('supplierName', { required: 'Please choose a supplier.' })}>
            <option value="">Select supplier</option>
            {suppliers.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </SelectField>
          <InputField label="Price" type="number" step="0.01" error={productForm.formState.errors.price?.message} registration={productForm.register('price', { required: 'Please enter a price.', valueAsNumber: true, min: 0 })} />
          <InputField label="Cost" type="number" step="0.01" error={productForm.formState.errors.cost?.message} registration={productForm.register('cost', { required: 'Please enter a cost.', valueAsNumber: true, min: 0 })} />
          <InputField label="Stock quantity" type="number" error={productForm.formState.errors.stockQuantity?.message} registration={productForm.register('stockQuantity', { required: 'Please enter stock quantity.', valueAsNumber: true, min: 0 })} />
          <InputField label="Reorder level" type="number" error={productForm.formState.errors.reorderLevel?.message} registration={productForm.register('reorderLevel', { required: 'Please enter a reorder level.', valueAsNumber: true, min: 0 })} />
          <SelectField label="Status" registration={productForm.register('isActive')}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </SelectField>
        </form>
      </Modal>

      <Modal
        open={adjustmentModalOpen}
        onClose={() => setAdjustmentModalOpen(false)}
        title={selectedInventoryItem ? `Adjust ${selectedInventoryItem.productName}` : 'Adjust stock'}
        description="Update stock for the selected item."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setAdjustmentModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="adjustment-form" className="primary-button" disabled={adjustmentForm.formState.isSubmitting}>
              {adjustmentForm.formState.isSubmitting ? 'Saving...' : 'Save stock update'}
            </button>
          </>
        }
      >
        <form id="adjustment-form" className="form-grid" onSubmit={adjustmentForm.handleSubmit(submitAdjustment)}>
          <InputField label="Quantity change" type="number" error={adjustmentForm.formState.errors.quantityDelta?.message} registration={adjustmentForm.register('quantityDelta', { required: 'Please enter the stock change.', valueAsNumber: true })} />
          <InputField label="Reason" error={adjustmentForm.formState.errors.reason?.message} registration={adjustmentForm.register('reason', { required: 'Please enter a reason.' })} />
        </form>
      </Modal>

      <Modal
        open={purchaseOrderModalOpen}
        onClose={() => setPurchaseOrderModalOpen(false)}
        title="Create purchase order"
        description="Create a purchase order for a supplier and product."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setPurchaseOrderModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="purchase-order-form" className="primary-button" disabled={purchaseOrderForm.formState.isSubmitting}>
              {purchaseOrderForm.formState.isSubmitting ? 'Saving...' : 'Save purchase order'}
            </button>
          </>
        }
      >
        <form id="purchase-order-form" className="form-grid form-grid--two" onSubmit={purchaseOrderForm.handleSubmit(submitPurchaseOrder)}>
          <SelectField label="Supplier" error={purchaseOrderForm.formState.errors.supplierId?.message} registration={purchaseOrderForm.register('supplierId', { required: 'Please choose a supplier.' })}>
            <option value="">Select supplier</option>
            {suppliers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </SelectField>
          <SelectField label="Product" error={purchaseOrderForm.formState.errors.productId?.message} registration={purchaseOrderForm.register('productId', { required: 'Please choose a product.' })}>
            <option value="">Select product</option>
            {products.filter((item) => item.isActive).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </SelectField>
          <InputField label="Quantity" type="number" error={purchaseOrderForm.formState.errors.quantity?.message} registration={purchaseOrderForm.register('quantity', { required: 'Please enter a quantity.', valueAsNumber: true, min: 1 })} />
          <InputField label="Notes" error={purchaseOrderForm.formState.errors.notes?.message} registration={purchaseOrderForm.register('notes')} />
        </form>
      </Modal>

      <Modal
        open={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        title={selectedPurchaseOrder?.purchaseOrderNumber || 'Receive goods'}
        description="Record received goods for this purchase order."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setReceiveModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="primary-button" onClick={() => void receivePurchaseOrder()}>
              Save receipt
            </button>
          </>
        }
      >
        <div className="form-grid">
          <label className="field">
            <span className="field__label">Received on</span>
            <input className="input" type="datetime-local" value={receiveAt} onChange={(event) => setReceiveAt(event.target.value)} />
          </label>
          <label className="field">
            <span className="field__label">Notes</span>
            <input className="input" value={receiveNotes} onChange={(event) => setReceiveNotes(event.target.value)} />
          </label>
        </div>
      </Modal>

      <Modal
        open={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        title={selectedAsset?.assetTag || 'Record maintenance'}
        description="Record maintenance work for the selected asset."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setMaintenanceModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="maintenance-form" className="primary-button" disabled={maintenanceForm.formState.isSubmitting}>
              {maintenanceForm.formState.isSubmitting ? 'Saving...' : 'Save maintenance'}
            </button>
          </>
        }
      >
        <form id="maintenance-form" className="form-grid form-grid--two" onSubmit={maintenanceForm.handleSubmit(submitMaintenance)}>
          <InputField label="Serviced at" type="datetime-local" error={maintenanceForm.formState.errors.servicedAt?.message} registration={maintenanceForm.register('servicedAt')} />
          <InputField label="Condition score" type="number" error={maintenanceForm.formState.errors.conditionScore?.message} registration={maintenanceForm.register('conditionScore', { required: 'Please enter a condition score.', valueAsNumber: true, min: 0, max: 100 })} />
          <InputField label="Notes" error={maintenanceForm.formState.errors.notes?.message} registration={maintenanceForm.register('notes', { required: 'Please enter maintenance notes.' })} />
        </form>
      </Modal>

      <Modal
        open={workOrderModalOpen}
        onClose={() => setWorkOrderModalOpen(false)}
        title="Create work order"
        description="Create a new work order for production."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setWorkOrderModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="work-order-form" className="primary-button" disabled={workOrderForm.formState.isSubmitting}>
              {workOrderForm.formState.isSubmitting ? 'Saving...' : 'Save work order'}
            </button>
          </>
        }
      >
        <form id="work-order-form" className="form-grid form-grid--two" onSubmit={workOrderForm.handleSubmit(submitWorkOrder)}>
          <SelectField label="Product" registration={workOrderForm.register('productId')}>
            <option value="">Select product</option>
            {products.filter((item) => item.isActive).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </SelectField>
          <InputField label="Product name (if not selected above)" error={workOrderForm.formState.errors.productName?.message} registration={workOrderForm.register('productName')} />
          <InputField label="Work center" error={workOrderForm.formState.errors.workCenter?.message} registration={workOrderForm.register('workCenter', { required: 'Please enter a work center.' })} />
          <InputField label="Quantity" type="number" error={workOrderForm.formState.errors.quantity?.message} registration={workOrderForm.register('quantity', { required: 'Please enter a quantity.', valueAsNumber: true, min: 1 })} />
          <InputField label="Planned duration (hours)" type="number" error={workOrderForm.formState.errors.plannedDurationHours?.message} registration={workOrderForm.register('plannedDurationHours', { required: 'Please enter the planned duration.', valueAsNumber: true, min: 1 })} />
        </form>
      </Modal>

      <Modal
        open={workOrderStatusOpen}
        onClose={() => setWorkOrderStatusOpen(false)}
        title={selectedWorkOrder?.workOrderNumber || 'Update work order'}
        description="Update the current work order status."
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setWorkOrderStatusOpen(false)}>
              Cancel
            </button>
            <button type="button" className="primary-button" onClick={() => void updateWorkOrderStatus()}>
              Save
            </button>
          </>
        }
      >
        <div className="form-grid form-grid--two">
          <label className="field">
            <span className="field__label">Status</span>
            <select className="select" value={pendingWorkOrderStatus} onChange={(event) => setPendingWorkOrderStatus(event.target.value)}>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </label>
          <label className="field">
            <span className="field__label">Produced quantity</span>
            <input className="input" type="number" min="0" value={pendingProducedQuantity} onChange={(event) => setPendingProducedQuantity(Number(event.target.value))} />
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        onClose={() => {
          if (!archiveSubmitting) {
            setArchiveTarget(null)
          }
        }}
        onConfirm={() => void archiveProduct()}
        title={archiveTarget ? `Archive ${archiveTarget.name}?` : 'Archive product?'}
        description="The product will be marked inactive and removed from active product lists."
        note={user?.isDemoUser ? 'This only changes sample organization data and can be refreshed from the sample banner.' : undefined}
        confirmLabel="Archive product"
        loading={archiveSubmitting}
      />
    </div>
  )
}
