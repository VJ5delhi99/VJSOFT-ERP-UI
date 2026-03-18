import Modal from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  tone?: 'primary' | 'danger'
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  tone = 'danger',
  onConfirm,
  onClose
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <button type="button" className="ghost-button" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className={tone === 'danger' ? 'danger-button' : 'primary-button'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Working...' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-dialog">
        <p>This action affects live ERP records. Confirm to continue.</p>
      </div>
    </Modal>
  )
}
