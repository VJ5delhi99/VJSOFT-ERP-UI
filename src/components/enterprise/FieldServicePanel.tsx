import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DataTable from '../DataTable'
import EmptyState from '../EmptyState'
import { InputField, SelectField, TextAreaField } from '../FormField'
import Modal from '../Modal'
import Spinner from '../Spinner'
import StatCard from '../StatCard'
import StatusBadge from '../StatusBadge'
import { salesService } from '../../services/salesService'
import type { FieldServiceJobDto, ServiceTicketDto } from '../../types'
import { formatDateTime } from '../../utils/format'
import { useToast } from '../../hooks/useToast'

interface JobFormValues {
  serviceTicketId: string
  customerName: string
  technicianName: string
  scheduledStart: string
  scheduledEnd: string
  offlineSyncEnabled: string
  latitude: number
  longitude: number
}

interface StatusFormValues {
  status: string
  serviceReport: string
}

function tone(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success' as const
    case 'scheduled':
      return 'info' as const
    case 'in progress':
      return 'warning' as const
    default:
      return 'danger' as const
  }
}

export default function FieldServicePanel({ tickets }: { tickets: ServiceTicketDto[] }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<FieldServiceJobDto[]>([])
  const [jobOpen, setJobOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<FieldServiceJobDto | null>(null)

  const jobForm = useForm<JobFormValues>({
    defaultValues: {
      serviceTicketId: '',
      customerName: '',
      technicianName: '',
      scheduledStart: '',
      scheduledEnd: '',
      offlineSyncEnabled: 'true',
      latitude: 12.9716,
      longitude: 77.5946
    }
  })
  const statusForm = useForm<StatusFormValues>({ defaultValues: { status: 'Scheduled', serviceReport: '' } })

  async function loadJobs() {
    setLoading(true)
    try {
      setJobs(await salesService.getFieldServiceJobs())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadJobs()
  }, [])

  async function submitJob(values: JobFormValues) {
    await salesService.createFieldServiceJob({
      serviceTicketId: values.serviceTicketId || undefined,
      customerName: values.customerName || undefined,
      technicianName: values.technicianName,
      scheduledStart: new Date(values.scheduledStart).toISOString(),
      scheduledEnd: new Date(values.scheduledEnd).toISOString(),
      offlineSyncEnabled: values.offlineSyncEnabled === 'true',
      latitude: Number(values.latitude),
      longitude: Number(values.longitude)
    })
    showToast('Field service scheduled', 'The technician assignment is ready for execution.', 'success')
    setJobOpen(false)
    await loadJobs()
  }

  async function submitStatus(values: StatusFormValues) {
    if (!selectedJob) {
      return
    }

    await salesService.updateFieldServiceJob(selectedJob.id, values)
    showToast('Field service updated', `${selectedJob.jobNumber} has been updated.`, 'success')
    setStatusOpen(false)
    await loadJobs()
  }

  if (loading) {
    return <Spinner label="Loading field service operations" />
  }

  return (
    <div className="page-stack">
      <section className="enterprise-hero">
        <div className="enterprise-hero__copy">
          <span className="page-header__eyebrow">Field Service</span>
          <h3>Dispatch, offline execution, and service completion</h3>
          <p>Coordinate technicians against service tickets with location context and offline-ready job reporting.</p>
        </div>
        <div className="enterprise-hero__actions">
          <button type="button" className="primary-button" onClick={() => setJobOpen(true)}>Schedule field job</button>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard label="Scheduled jobs" value={jobs.filter((job) => job.status === 'Scheduled').length} format="number" subtitle="Ready for dispatch" />
        <StatCard label="Offline-enabled" value={jobs.filter((job) => job.offlineSyncEnabled).length} format="number" subtitle="Mobile-first work packs" />
        <StatCard label="Completed jobs" value={jobs.filter((job) => job.status === 'Completed').length} format="number" subtitle="Service visits closed" />
        <StatCard label="Open service tickets" value={tickets.filter((ticket) => ticket.status !== 'Resolved').length} format="number" subtitle="Potential field demand" />
      </section>

      <section className="dashboard-grid dashboard-grid--balanced">
        <DataTable
          title="Field jobs"
          description="Technician assignments, job windows, and onsite completion details."
          columns={[
            { key: 'jobNumber', title: 'Job', sortable: true, render: (row) => <div className="table-primary"><strong>{row.jobNumber}</strong><span>{row.customerName}</span></div> },
            { key: 'technicianName', title: 'Technician', sortable: true },
            { key: 'scheduledStart', title: 'Window', sortable: true, render: (row) => `${formatDateTime(row.scheduledStart)} -> ${formatDateTime(row.scheduledEnd)}` },
            { key: 'status', title: 'Status', sortable: true, render: (row) => <StatusBadge label={row.status} tone={tone(row.status)} /> },
            { key: 'actions', title: 'Actions', render: (row) => <button type="button" className="ghost-button" onClick={() => { setSelectedJob(row); statusForm.reset({ status: row.status, serviceReport: row.serviceReport }); setStatusOpen(true) }}>Update</button> }
          ]}
          data={jobs}
          rowKey="id"
          searchKeys={['jobNumber', 'customerName', 'technicianName', 'status']}
          searchPlaceholder="Search field jobs"
          emptyTitle="No field jobs yet"
          emptyDescription="Field assignments will appear here after dispatch scheduling."
        />

        <DataTable
          title="Service tickets ready for dispatch"
          description="Support issues that can be converted into field appointments."
          columns={[
            { key: 'ticketNumber', title: 'Ticket', sortable: true, render: (row) => <div className="table-primary"><strong>{row.ticketNumber}</strong><span>{row.subject}</span></div> },
            { key: 'customerName', title: 'Customer', sortable: true },
            { key: 'assignedTeam', title: 'Team', sortable: true },
            { key: 'priority', title: 'Priority', sortable: true, render: (row) => <StatusBadge label={row.priority} tone={row.priority === 'High' ? 'danger' : row.priority === 'Medium' ? 'warning' : 'info'} /> },
            { key: 'dueAt', title: 'Due', sortable: true, render: (row) => formatDateTime(row.dueAt) }
          ]}
          data={tickets}
          rowKey="id"
          searchKeys={['ticketNumber', 'customerName', 'subject', 'assignedTeam']}
          searchPlaceholder="Search service tickets"
          emptyTitle="No service tickets"
          emptyDescription="Tickets available for field dispatch will appear here."
        />
      </section>

      {jobs.length === 0 ? (
        <EmptyState title="Field service just opened" description="Schedule a technician visit to start using the new field service workflow." compact />
      ) : null}

      <Modal open={jobOpen} onClose={() => setJobOpen(false)} title="Schedule field job" description="Create a technician assignment linked to a support ticket or standalone customer visit." footer={<><button type="button" className="ghost-button" onClick={() => setJobOpen(false)}>Cancel</button><button type="submit" form="job-form" className="primary-button" disabled={jobForm.formState.isSubmitting}>{jobForm.formState.isSubmitting ? 'Saving...' : 'Save job'}</button></>}>
        <form id="job-form" className="form-grid form-grid--two" onSubmit={jobForm.handleSubmit(submitJob)}>
          <SelectField label="Service ticket" registration={jobForm.register('serviceTicketId')}>
            <option value="">Standalone job</option>
            {tickets.map((ticket) => <option key={ticket.id} value={ticket.id}>{ticket.ticketNumber} / {ticket.customerName}</option>)}
          </SelectField>
          <InputField label="Customer name" registration={jobForm.register('customerName')} helperText="Optional when a service ticket is selected." />
          <InputField label="Technician name" registration={jobForm.register('technicianName', { required: true })} />
          <SelectField label="Offline sync" registration={jobForm.register('offlineSyncEnabled', { required: true })}>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </SelectField>
          <InputField label="Scheduled start" type="datetime-local" registration={jobForm.register('scheduledStart', { required: true })} />
          <InputField label="Scheduled end" type="datetime-local" registration={jobForm.register('scheduledEnd', { required: true })} />
          <InputField label="Latitude" type="number" step="0.0001" registration={jobForm.register('latitude', { required: true, valueAsNumber: true })} />
          <InputField label="Longitude" type="number" step="0.0001" registration={jobForm.register('longitude', { required: true, valueAsNumber: true })} />
        </form>
      </Modal>

      <Modal open={statusOpen} onClose={() => setStatusOpen(false)} title={selectedJob?.jobNumber || 'Update job'} description="Update field execution state and close out the service report." footer={<><button type="button" className="ghost-button" onClick={() => setStatusOpen(false)}>Cancel</button><button type="submit" form="status-form" className="primary-button" disabled={statusForm.formState.isSubmitting}>{statusForm.formState.isSubmitting ? 'Saving...' : 'Save update'}</button></>}>
        <form id="status-form" className="form-grid" onSubmit={statusForm.handleSubmit(submitStatus)}>
          <SelectField label="Status" registration={statusForm.register('status', { required: true })}>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </SelectField>
          <TextAreaField label="Service report" registration={statusForm.register('serviceReport')} />
        </form>
      </Modal>
    </div>
  )
}
