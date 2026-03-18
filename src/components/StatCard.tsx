import { formatCompactNumber, formatCurrency, formatPercent } from '../utils/format'

interface StatCardProps {
  label: string
  value: number
  change?: number
  format: 'currency' | 'number'
  subtitle: string
}

export default function StatCard({ label, value, change, format, subtitle }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card__header">
        <span>{label}</span>
        {typeof change === 'number' ? (
          <span className={change >= 0 ? 'status-chip status-chip--success' : 'status-chip status-chip--warning'}>
            {formatPercent(change)}
          </span>
        ) : null}
      </div>
      <strong>{format === 'currency' ? formatCurrency(value) : formatCompactNumber(value)}</strong>
      <p>{subtitle}</p>
    </article>
  )
}
