import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useStore'
import { dismissToast } from '../store/uiSlice'

function ToastItem({ id, title, message, tone }: { id: string; title: string; message: string; tone: string }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dispatch(dismissToast(id))
    }, 3500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [dispatch, id])

  return (
    <article className={`toast toast--${tone}`}>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <button type="button" className="ghost-button" onClick={() => dispatch(dismissToast(id))}>
        Dismiss
      </button>
    </article>
  )
}

export default function ToastViewport() {
  const toasts = useAppSelector((state) => state.ui.toasts)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} title={toast.title} message={toast.message} tone={toast.tone} />
      ))}
    </div>
  )
}
