interface SpinnerProps {
  label?: string
  fullPage?: boolean
}

export default function Spinner({ label = 'Loading data', fullPage = false }: SpinnerProps) {
  return (
    <div className={fullPage ? 'spinner spinner--full' : 'spinner'} role="status" aria-live="polite">
      <span className="spinner__ring" />
      <span className="spinner__label">{label}</span>
    </div>
  )
}
