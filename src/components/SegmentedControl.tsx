interface SegmentedControlOption {
  value: string
  label: string
  description?: string
}

interface SegmentedControlProps {
  value: string
  label: string
  options: SegmentedControlOption[]
  onChange: (value: string) => void
}

export default function SegmentedControl({ value, label, options, onChange }: SegmentedControlProps) {
  return (
    <div className="segmented-control" role="tablist" aria-label={label}>
      {options.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            className={selected ? 'segmented-control__option segmented-control__option--active' : 'segmented-control__option'}
            onClick={() => onChange(option.value)}
          >
            <strong>{option.label}</strong>
            {option.description ? <span>{option.description}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
