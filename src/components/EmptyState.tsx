interface EmptyStateProps {
  title: string
  description: string
  compact?: boolean
}

export default function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  return (
    <div className={compact ? 'empty-state empty-state--compact' : 'empty-state'}>
      <div className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v9A2.5 2.5 0 0 1 17.5 18H11l-3.5 2.5V18h-1A2.5 2.5 0 0 1 4 15.5v-9Zm2.5-.5a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5H9.5v.61L11.64 16h5.86a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-11Z" />
        </svg>
      </div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
