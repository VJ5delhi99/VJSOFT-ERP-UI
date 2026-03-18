interface SpinnerProps {
  label?: string
  fullPage?: boolean
}

export default function Spinner({ label = 'Loading data', fullPage = false }: SpinnerProps) {
  if (fullPage) {
    return (
      <div className="spinner spinner--full" role="status" aria-live="polite">
        <div className="spinner__panel">
          <div className="spinner__ring" />
          <div className="spinner__content">
            <strong>{label}</strong>
            <span className="spinner__label">Preparing the workspace and loading the latest operational data.</span>
          </div>
        </div>
        <div className="spinner__skeleton-grid" aria-hidden="true">
          <span className="skeleton spinner__skeleton-card" />
          <span className="skeleton spinner__skeleton-card" />
          <span className="skeleton spinner__skeleton-card" />
          <span className="skeleton spinner__skeleton-card" />
        </div>
      </div>
    )
  }

  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__ring" />
      <span className="spinner__label">{label}</span>
    </div>
  )
}
