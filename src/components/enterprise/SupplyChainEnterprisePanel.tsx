import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import DataTable from '../DataTable'
import EmptyState from '../EmptyState'
import { InputField, SelectField, TextAreaField } from '../FormField'
import Modal from '../Modal'
import Spinner from '../Spinner'
import StatCard from '../StatCard'
import StatusBadge from '../StatusBadge'
import { inventoryService } from '../../services/inventoryService'
import { salesService } from '../../services/salesService'
import type {
  BranchDto,
  CompanyDto,
  FixedAssetComplianceReportDto,
  FixedAssetDto,
  ProductChangeDto,
  ProductDto,
  ProductLifecycleDto,
  ShipmentDto,
  StockTransferDto,
  WarehouseDto
} from '../../types'
import { formatCurrency, formatDate, formatDateTime } from '../../utils/format'
import { useToast } from '../../hooks/useToast'

interface TransferFormValues {
  fromWarehouseCode: string
  toWarehouseCode: string
  productId: string
  quantity: number
  reason: string
}

interface ShipmentFormValues {
  direction: string
  carrier: string
  trackingNumber: string
  originWarehouseCode: string
  destinationName: string
  scheduledShipDate: string
}

interface FixedAssetFormValues {
  name: string
  assetClass: string
  companyCode: string
  branchCode: string
  acquisitionCost: number
  salvageValue: number
  depreciationMethod: string
  usefulLifeMonths: number
  depreciationRate: number
  ownerDepartment: string
  currentLocation: string
}

interface LifecycleFormValues {
  productId: string
  version: string
  lifecycleStage: string
  componentProductId: string
  quantity: number
  unitOfMeasure: string
}

interface ChangeFormValues {
  productLifecycleId: string
  title: string
  requestedBy: string
  impactSummary: string
}

function toneFromStatus(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'capitalized':
    case 'delivered':
    case 'approved':
    case 'implemented':
    case 'healthy':
    case 'released':
      return 'success' as const
    case 'scheduled':
    case 'issued':
    case 'submitted':
    case 'in transit':
    case 'pilot':
      return 'info' as const
    case 'variance':
    case 'warning':
    case 'awarded':
      return 'warning' as const
    default:
      return 'danger' as const
  }
}

export default function SupplyChainEnterprisePanel({ products }: { products: ProductDto[] }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [warehouses, setWarehouses] = useState<WarehouseDto[]>([])
  const [transfers, setTransfers] = useState<StockTransferDto[]>([])
  const [shipments, setShipments] = useState<ShipmentDto[]>([])
  const [fixedAssets, setFixedAssets] = useState<FixedAssetDto[]>([])
  const [compliance, setCompliance] = useState<FixedAssetComplianceReportDto | null>(null)
  const [lifecycles, setLifecycles] = useState<ProductLifecycleDto[]>([])
  const [changes, setChanges] = useState<ProductChangeDto[]>([])
  const [companies, setCompanies] = useState<CompanyDto[]>([])
  const [branches, setBranches] = useState<BranchDto[]>([])
  const [transferOpen, setTransferOpen] = useState(false)
  const [shipmentOpen, setShipmentOpen] = useState(false)
  const [fixedAssetOpen, setFixedAssetOpen] = useState(false)
  const [lifecycleOpen, setLifecycleOpen] = useState(false)
  const [changeOpen, setChangeOpen] = useState(false)

  const transferForm = useForm<TransferFormValues>({ defaultValues: { fromWarehouseCode: '', toWarehouseCode: '', productId: '', quantity: 1, reason: '' } })
  const shipmentForm = useForm<ShipmentFormValues>({ defaultValues: { direction: 'Outbound', carrier: '', trackingNumber: '', originWarehouseCode: '', destinationName: '', scheduledShipDate: '' } })
  const fixedAssetForm = useForm<FixedAssetFormValues>({
    defaultValues: {
      name: '',
      assetClass: '',
      companyCode: '',
      branchCode: '',
      acquisitionCost: 0,
      salvageValue: 0,
      depreciationMethod: 'SLM',
      usefulLifeMonths: 60,
      depreciationRate: 20,
      ownerDepartment: '',
      currentLocation: ''
    }
  })
  const lifecycleForm = useForm<LifecycleFormValues>({ defaultValues: { productId: '', version: '', lifecycleStage: 'Released', componentProductId: '', quantity: 1, unitOfMeasure: 'EA' } })
  const changeForm = useForm<ChangeFormValues>({ defaultValues: { productLifecycleId: '', title: '', requestedBy: '', impactSummary: '' } })

  async function loadEnterprise() {
    setLoading(true)
    const [warehousesResult, transfersResult, shipmentsResult, fixedAssetsResult, complianceResult, lifecyclesResult, changesResult, companiesResult, branchesResult] = await Promise.allSettled([
      inventoryService.getWarehouses(),
      inventoryService.getStockTransfers(),
      inventoryService.getShipments(),
      inventoryService.getFixedAssets(),
      inventoryService.getFixedAssetComplianceReport(),
      salesService.getProductLifecycles(),
      salesService.getProductChanges(),
      salesService.getCompanies(),
      salesService.getBranches()
    ])

    setWarehouses(warehousesResult.status === 'fulfilled' ? warehousesResult.value : [])
    setTransfers(transfersResult.status === 'fulfilled' ? transfersResult.value : [])
    setShipments(shipmentsResult.status === 'fulfilled' ? shipmentsResult.value : [])
    setFixedAssets(fixedAssetsResult.status === 'fulfilled' ? fixedAssetsResult.value : [])
    setCompliance(complianceResult.status === 'fulfilled' ? complianceResult.value : null)
    setLifecycles(lifecyclesResult.status === 'fulfilled' ? lifecyclesResult.value : [])
    setChanges(changesResult.status === 'fulfilled' ? changesResult.value : [])
    setCompanies(companiesResult.status === 'fulfilled' ? companiesResult.value : [])
    setBranches(branchesResult.status === 'fulfilled' ? branchesResult.value : [])
    setLoading(false)
  }

  useEffect(() => {
    void loadEnterprise()
  }, [])

  const warehouseSummary = useMemo(
    () =>
      warehouses.map((warehouse) => ({
        id: warehouse.id,
        warehouseCode: warehouse.warehouseCode,
        name: warehouse.name,
        branchCode: warehouse.branchCode,
        type: warehouse.type,
        skuCount: warehouse.stock.length,
        onHand: warehouse.stock.reduce((sum, stock) => sum + stock.quantityOnHand, 0),
        reserved: warehouse.stock.reduce((sum, stock) => sum + stock.quantityReserved, 0)
      })),
    [warehouses]
  )

  async function submitTransfer(values: TransferFormValues) {
    await inventoryService.createStockTransfer({
      fromWarehouseCode: values.fromWarehouseCode,
      toWarehouseCode: values.toWarehouseCode,
      productId: values.productId,
      quantity: Number(values.quantity),
      reason: values.reason
    })
    showToast('Transfer completed', 'The warehouse transfer was posted successfully.', 'success')
    setTransferOpen(false)
    await loadEnterprise()
  }

  async function submitShipment(values: ShipmentFormValues) {
    await inventoryService.createShipment({
      direction: values.direction,
      carrier: values.carrier,
      trackingNumber: values.trackingNumber,
      originWarehouseCode: values.originWarehouseCode,
      destinationName: values.destinationName,
      scheduledShipDate: new Date(values.scheduledShipDate).toISOString()
    })
    showToast('Shipment scheduled', 'The shipment has been added to logistics planning.', 'success')
    setShipmentOpen(false)
    await loadEnterprise()
  }

  async function submitFixedAsset(values: FixedAssetFormValues) {
    await inventoryService.createFixedAsset({
      name: values.name,
      assetClass: values.assetClass,
      companyCode: values.companyCode,
      branchCode: values.branchCode,
      acquisitionCost: Number(values.acquisitionCost),
      salvageValue: Number(values.salvageValue),
      depreciationMethod: values.depreciationMethod,
      usefulLifeMonths: Number(values.usefulLifeMonths),
      depreciationRate: Number(values.depreciationRate),
      ownerDepartment: values.ownerDepartment,
      currentLocation: values.currentLocation
    })
    showToast('Fixed asset capitalized', 'The fixed asset register has been updated.', 'success')
    setFixedAssetOpen(false)
    await loadEnterprise()
  }

  async function submitLifecycle(values: LifecycleFormValues) {
    await salesService.createProductLifecycle({
      productId: values.productId,
      version: values.version,
      lifecycleStage: values.lifecycleStage,
      billOfMaterials: [
        {
          componentProductId: values.componentProductId,
          quantity: Number(values.quantity),
          unitOfMeasure: values.unitOfMeasure
        }
      ]
    })
    showToast('Lifecycle released', 'The product lifecycle and BOM were saved.', 'success')
    setLifecycleOpen(false)
    await loadEnterprise()
  }

  async function submitChange(values: ChangeFormValues) {
    await salesService.createProductChange(values)
    showToast('Engineering change submitted', 'The PLM change request is now in the workflow.', 'success')
    setChangeOpen(false)
    await loadEnterprise()
  }

  async function runDepreciation() {
    await inventoryService.runDepreciation({ runDate: new Date().toISOString() })
    showToast('Depreciation completed', 'The fixed-asset depreciation run has been posted.', 'success')
    await loadEnterprise()
  }

  if (loading) {
    return <Spinner label="Loading enterprise supply chain modules" />
  }

  return (
    <div className="page-stack">
      <section className="enterprise-hero">
        <div className="enterprise-hero__copy">
          <span className="page-header__eyebrow">Enterprise Expansion</span>
          <h3>Supply, asset, and engineering control tower</h3>
          <p>Review multi-location stock, fixed-asset compliance, shipments, and PLM change control from one connected operations layer.</p>
        </div>
        <div className="enterprise-hero__actions">
          <button type="button" className="ghost-button" onClick={() => setTransferOpen(true)}>New transfer</button>
          <button type="button" className="ghost-button" onClick={() => setShipmentOpen(true)}>Schedule shipment</button>
          <button type="button" className="ghost-button" onClick={() => setFixedAssetOpen(true)}>Capitalize asset</button>
          <button type="button" className="primary-button" onClick={() => void runDepreciation()}>Run depreciation</button>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard label="Warehouses" value={warehouses.length} format="number" subtitle="Active stocking locations" />
        <StatCard label="Transfers" value={transfers.length} format="number" subtitle="Inter-warehouse movements" />
        <StatCard label="Shipments in transit" value={shipments.filter((item) => item.status === 'In Transit').length} format="number" subtitle="Logistics currently moving" />
        <StatCard label="Net asset value" value={compliance?.netBookValue ?? 0} format="currency" subtitle="Fixed asset register" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Warehouses"
          description="Multi-location stock posture with reserved inventory visibility."
          columns={[
            { key: 'warehouseCode', title: 'Warehouse', sortable: true, render: (row) => <div className="table-primary"><strong>{row.warehouseCode}</strong><span>{row.name}</span></div> },
            { key: 'branchCode', title: 'Branch', sortable: true },
            { key: 'skuCount', title: 'SKUs', sortable: true, align: 'right' },
            { key: 'onHand', title: 'On hand', sortable: true, align: 'right' },
            { key: 'reserved', title: 'Reserved', sortable: true, align: 'right' }
          ]}
          data={warehouseSummary}
          rowKey="id"
          searchKeys={['warehouseCode', 'name', 'branchCode', 'type']}
          searchPlaceholder="Search warehouses"
          emptyTitle="No warehouses configured"
          emptyDescription="Warehouses will appear here when inventory locations are available."
        />

        <DataTable
          title="Stock transfers"
          description="Completed replenishment and movement activity across warehouse nodes."
          columns={[
            { key: 'transferNumber', title: 'Transfer', sortable: true, render: (row) => <div className="table-primary"><strong>{row.transferNumber}</strong><span>{row.productName}</span></div> },
            { key: 'fromWarehouseCode', title: 'Route', sortable: true, render: (row) => `${row.fromWarehouseCode} -> ${row.toWarehouseCode}` },
            { key: 'quantity', title: 'Qty', sortable: true, align: 'right' },
            { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={toneFromStatus(row.status)} /> },
            { key: 'requestedAt', title: 'When', sortable: true, render: (row) => formatDateTime(row.requestedAt) }
          ]}
          data={transfers}
          rowKey="id"
          searchKeys={['transferNumber', 'productName', 'fromWarehouseCode', 'toWarehouseCode']}
          searchPlaceholder="Search transfers"
          emptyTitle="No transfers yet"
          emptyDescription="Warehouse movements will appear here after they are posted."
        />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Shipments"
          description="Outbound and inbound logistics commitments with current delivery state."
          columns={[
            { key: 'shipmentNumber', title: 'Shipment', sortable: true, render: (row) => <div className="table-primary"><strong>{row.shipmentNumber}</strong><span>{row.destinationName}</span></div> },
            { key: 'carrier', title: 'Carrier', sortable: true, render: (row) => <div className="table-primary"><strong>{row.carrier}</strong><span>{row.trackingNumber}</span></div> },
            { key: 'direction', title: 'Direction', sortable: true },
            { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={toneFromStatus(row.status)} /> },
            { key: 'scheduledShipDate', title: 'Scheduled', sortable: true, render: (row) => formatDate(row.scheduledShipDate) }
          ]}
          data={shipments}
          rowKey="id"
          searchKeys={['shipmentNumber', 'carrier', 'trackingNumber', 'destinationName']}
          searchPlaceholder="Search shipments"
          emptyTitle="No shipments scheduled"
          emptyDescription="Shipment plans will appear here when logistics work is created."
        />

        <article className="surface-card enterprise-summary">
          <div className="section-heading">
            <div>
              <h3>Fixed asset compliance</h3>
              <p>Depreciation control, book value, and accounting watchpoints.</p>
            </div>
          </div>
          {compliance ? (
            <div className="enterprise-summary__grid">
              <div className="enterprise-summary__metric"><span>Gross book value</span><strong>{formatCurrency(compliance.grossBookValue)}</strong></div>
              <div className="enterprise-summary__metric"><span>Accumulated depreciation</span><strong>{formatCurrency(compliance.accumulatedDepreciation)}</strong></div>
              <div className="enterprise-summary__metric"><span>Assets pending depreciation</span><strong>{compliance.assetsPendingDepreciation}</strong></div>
              <div className="enterprise-summary__metric"><span>Net book value</span><strong>{formatCurrency(compliance.netBookValue)}</strong></div>
            </div>
          ) : (
            <EmptyState title="Compliance unavailable" description="Fixed-asset compliance data is not available right now." compact />
          )}
          {compliance?.complianceWarnings.length ? (
            <div className="stack-list">
              {compliance.complianceWarnings.slice(0, 4).map((warning) => (
                <div key={warning} className="list-row">
                  <div><strong>Compliance warning</strong><p>{warning}</p></div>
                  <StatusBadge label="Watch" tone="warning" />
                </div>
              ))}
            </div>
          ) : null}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Fixed assets"
          description="Capitalized assets, depreciation basis, and current ownership."
          columns={[
            { key: 'assetNumber', title: 'Asset', sortable: true, render: (row) => <div className="table-primary"><strong>{row.assetNumber}</strong><span>{row.name}</span></div> },
            { key: 'assetClass', title: 'Class', sortable: true },
            { key: 'residualValue', title: 'Residual', sortable: true, align: 'right', render: (row) => formatCurrency(row.residualValue) },
            { key: 'ownerDepartment', title: 'Owner', sortable: true },
            { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={toneFromStatus(row.status)} /> }
          ]}
          data={fixedAssets}
          rowKey="id"
          searchKeys={['assetNumber', 'name', 'assetClass', 'ownerDepartment', 'currentLocation']}
          searchPlaceholder="Search fixed assets"
          emptyTitle="No fixed assets yet"
          emptyDescription="Capitalized assets will appear here after they are posted."
        />

        <DataTable
          title="PLM lifecycles"
          description="Released versions and their bill-of-material anchors."
          columns={[
            { key: 'version', title: 'Lifecycle', sortable: true, render: (row) => <div className="table-primary"><strong>{row.version}</strong><span>{row.productName}</span></div> },
            { key: 'lifecycleStage', title: 'Stage', sortable: true, render: (row) => <StatusBadge label={row.lifecycleStage} tone={toneFromStatus(row.lifecycleStage)} /> },
            { key: 'releasedAt', title: 'Released', sortable: true, render: (row) => formatDate(row.releasedAt) },
            { key: 'billOfMaterials', title: 'BOM lines', align: 'right', render: (row) => row.billOfMaterials.length }
          ]}
          data={lifecycles}
          rowKey="id"
          searchKeys={['version', 'productName', 'lifecycleStage']}
          searchPlaceholder="Search lifecycles"
          toolbar={<div className="table-actions"><button type="button" className="ghost-button" onClick={() => setLifecycleOpen(true)}>New lifecycle</button><button type="button" className="ghost-button" onClick={() => setChangeOpen(true)}>New change</button></div>}
          emptyTitle="No lifecycle records"
          emptyDescription="Released product lifecycle records will appear here."
        />
      </section>

      <DataTable
        title="Engineering changes"
        description="Change requests submitted across active product lifecycles."
        columns={[
          { key: 'changeNumber', title: 'Change', sortable: true, render: (row) => <div className="table-primary"><strong>{row.changeNumber}</strong><span>{row.productName}</span></div> },
          { key: 'title', title: 'Title', sortable: true },
          { key: 'requestedBy', title: 'Requested by', sortable: true },
          { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={toneFromStatus(row.status)} /> },
          { key: 'requestedAt', title: 'Requested', sortable: true, render: (row) => formatDate(row.requestedAt) }
        ]}
        data={changes}
        rowKey="id"
        searchKeys={['changeNumber', 'title', 'productName', 'requestedBy', 'status']}
        searchPlaceholder="Search changes"
        emptyTitle="No engineering changes"
        emptyDescription="Engineering change requests will appear here after they are submitted."
      />

      <Modal open={transferOpen} onClose={() => setTransferOpen(false)} title="Create stock transfer" description="Move stock between warehouses without leaving the supply chain workspace." footer={<><button type="button" className="ghost-button" onClick={() => setTransferOpen(false)}>Cancel</button><button type="submit" form="transfer-form" className="primary-button" disabled={transferForm.formState.isSubmitting}>{transferForm.formState.isSubmitting ? 'Saving...' : 'Save transfer'}</button></>}>
        <form id="transfer-form" className="form-grid form-grid--two" onSubmit={transferForm.handleSubmit(submitTransfer)}>
          <SelectField label="From warehouse" registration={transferForm.register('fromWarehouseCode', { required: true })}><option value="">Select source</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.warehouseCode}>{warehouse.warehouseCode} / {warehouse.name}</option>)}</SelectField>
          <SelectField label="To warehouse" registration={transferForm.register('toWarehouseCode', { required: true })}><option value="">Select destination</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.warehouseCode}>{warehouse.warehouseCode} / {warehouse.name}</option>)}</SelectField>
          <SelectField label="Product" registration={transferForm.register('productId', { required: true })}><option value="">Select product</option>{products.filter((product) => product.isActive).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</SelectField>
          <InputField label="Quantity" type="number" registration={transferForm.register('quantity', { required: true, valueAsNumber: true, min: 1 })} />
          <TextAreaField label="Reason" registration={transferForm.register('reason', { required: true })} />
        </form>
      </Modal>

      <Modal open={shipmentOpen} onClose={() => setShipmentOpen(false)} title="Schedule shipment" description="Create a logistics movement with carrier and destination details." footer={<><button type="button" className="ghost-button" onClick={() => setShipmentOpen(false)}>Cancel</button><button type="submit" form="shipment-form" className="primary-button" disabled={shipmentForm.formState.isSubmitting}>{shipmentForm.formState.isSubmitting ? 'Saving...' : 'Save shipment'}</button></>}>
        <form id="shipment-form" className="form-grid form-grid--two" onSubmit={shipmentForm.handleSubmit(submitShipment)}>
          <SelectField label="Direction" registration={shipmentForm.register('direction', { required: true })}><option value="Outbound">Outbound</option><option value="Inbound">Inbound</option></SelectField>
          <SelectField label="Origin warehouse" registration={shipmentForm.register('originWarehouseCode', { required: true })}><option value="">Select warehouse</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.warehouseCode}>{warehouse.warehouseCode} / {warehouse.name}</option>)}</SelectField>
          <InputField label="Carrier" registration={shipmentForm.register('carrier', { required: true })} />
          <InputField label="Tracking number" registration={shipmentForm.register('trackingNumber', { required: true })} />
          <InputField label="Destination" registration={shipmentForm.register('destinationName', { required: true })} />
          <InputField label="Scheduled ship date" type="datetime-local" registration={shipmentForm.register('scheduledShipDate', { required: true })} />
        </form>
      </Modal>

      <Modal open={fixedAssetOpen} onClose={() => setFixedAssetOpen(false)} title="Capitalize fixed asset" description="Post a new fixed asset with accounting ownership and depreciation basis." footer={<><button type="button" className="ghost-button" onClick={() => setFixedAssetOpen(false)}>Cancel</button><button type="submit" form="fixed-asset-form" className="primary-button" disabled={fixedAssetForm.formState.isSubmitting}>{fixedAssetForm.formState.isSubmitting ? 'Saving...' : 'Save asset'}</button></>}>
        <form id="fixed-asset-form" className="form-grid form-grid--two" onSubmit={fixedAssetForm.handleSubmit(submitFixedAsset)}>
          <InputField label="Asset name" registration={fixedAssetForm.register('name', { required: true })} />
          <InputField label="Asset class" registration={fixedAssetForm.register('assetClass', { required: true })} />
          <SelectField label="Company" registration={fixedAssetForm.register('companyCode', { required: true })}><option value="">Select company</option>{companies.map((company) => <option key={company.id} value={company.companyCode}>{company.companyCode} / {company.name}</option>)}</SelectField>
          <SelectField label="Branch" registration={fixedAssetForm.register('branchCode', { required: true })}><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.branchCode}>{branch.branchCode} / {branch.name}</option>)}</SelectField>
          <InputField label="Acquisition cost" type="number" step="0.01" registration={fixedAssetForm.register('acquisitionCost', { required: true, valueAsNumber: true, min: 1 })} />
          <InputField label="Salvage value" type="number" step="0.01" registration={fixedAssetForm.register('salvageValue', { required: true, valueAsNumber: true, min: 0 })} />
          <SelectField label="Depreciation method" registration={fixedAssetForm.register('depreciationMethod', { required: true })}><option value="SLM">Straight line</option><option value="WDV">Written down value</option><option value="CUSTOM">Custom</option></SelectField>
          <InputField label="Useful life (months)" type="number" registration={fixedAssetForm.register('usefulLifeMonths', { required: true, valueAsNumber: true, min: 1 })} />
          <InputField label="Depreciation rate" type="number" step="0.01" registration={fixedAssetForm.register('depreciationRate', { required: true, valueAsNumber: true, min: 0 })} />
          <InputField label="Owner department" registration={fixedAssetForm.register('ownerDepartment', { required: true })} />
          <InputField label="Current location" registration={fixedAssetForm.register('currentLocation', { required: true })} />
        </form>
      </Modal>

      <Modal open={lifecycleOpen} onClose={() => setLifecycleOpen(false)} title="Release product lifecycle" description="Publish a new lifecycle version and anchor it to a BOM component." footer={<><button type="button" className="ghost-button" onClick={() => setLifecycleOpen(false)}>Cancel</button><button type="submit" form="lifecycle-form" className="primary-button" disabled={lifecycleForm.formState.isSubmitting}>{lifecycleForm.formState.isSubmitting ? 'Saving...' : 'Save lifecycle'}</button></>}>
        <form id="lifecycle-form" className="form-grid form-grid--two" onSubmit={lifecycleForm.handleSubmit(submitLifecycle)}>
          <SelectField label="Product" registration={lifecycleForm.register('productId', { required: true })}><option value="">Select product</option>{products.filter((product) => product.isActive).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</SelectField>
          <InputField label="Version" registration={lifecycleForm.register('version', { required: true })} />
          <SelectField label="Lifecycle stage" registration={lifecycleForm.register('lifecycleStage', { required: true })}><option value="Released">Released</option><option value="Pilot">Pilot</option><option value="Retired">Retired</option></SelectField>
          <SelectField label="BOM component" registration={lifecycleForm.register('componentProductId', { required: true })}><option value="">Select component</option>{products.filter((product) => product.isActive).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</SelectField>
          <InputField label="Component quantity" type="number" step="0.01" registration={lifecycleForm.register('quantity', { required: true, valueAsNumber: true, min: 0.01 })} />
          <InputField label="Unit of measure" registration={lifecycleForm.register('unitOfMeasure', { required: true })} />
        </form>
      </Modal>

      <Modal open={changeOpen} onClose={() => setChangeOpen(false)} title="Submit engineering change" description="Create a product change request for release management and review." footer={<><button type="button" className="ghost-button" onClick={() => setChangeOpen(false)}>Cancel</button><button type="submit" form="change-form" className="primary-button" disabled={changeForm.formState.isSubmitting}>{changeForm.formState.isSubmitting ? 'Saving...' : 'Submit change'}</button></>}>
        <form id="change-form" className="form-grid" onSubmit={changeForm.handleSubmit(submitChange)}>
          <SelectField label="Lifecycle" registration={changeForm.register('productLifecycleId', { required: true })}><option value="">Select lifecycle</option>{lifecycles.map((lifecycle) => <option key={lifecycle.id} value={lifecycle.id}>{lifecycle.productName} / {lifecycle.version}</option>)}</SelectField>
          <InputField label="Title" registration={changeForm.register('title', { required: true })} />
          <InputField label="Requested by" registration={changeForm.register('requestedBy', { required: true })} />
          <TextAreaField label="Impact summary" registration={changeForm.register('impactSummary', { required: true })} />
        </form>
      </Modal>
    </div>
  )
}
