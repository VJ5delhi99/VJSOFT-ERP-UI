import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return []
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute('aria-hidden'))
}

export default function Modal({ open, title, description, onClose, children, footer, size = 'md' }: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const initialFocusTarget = getFocusableElements(panelRef.current)[0] || closeButtonRef.current || panelRef.current
    initialFocusTarget?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (!panelRef.current) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusableElements(panelRef.current)

      if (focusableElements.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [onClose, open])

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => (event.target === event.currentTarget ? onClose() : undefined)}>
      <div
        ref={panelRef}
        className={`modal-panel modal-panel--${size}`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className="modal-panel__header">
          <div>
            <h3 id={titleId}>{title}</h3>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <button ref={closeButtonRef} type="button" className="ghost-button modal-panel__close" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>
        <div className="modal-panel__body">{children}</div>
        {footer ? <div className="modal-panel__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body
  )
}
