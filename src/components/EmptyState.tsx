interface EmptyStateProps {
  title: string
  description: string
  compact?: boolean
}

export default function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  return (
    <div className={compact ? 'empty-state empty-state--compact' : 'empty-state'}>
      <span className="empty-state__icon">+</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
