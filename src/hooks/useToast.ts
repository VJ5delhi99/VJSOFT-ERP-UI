import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { dismissToast, pushToast } from '../store/uiSlice'
import type { ToastTone } from '../types'

export function useToast() {
  const dispatch = useDispatch<AppDispatch>()

  return {
    showToast(title: string, message: string, tone: ToastTone = 'info') {
      dispatch(pushToast({ title, message, tone }))
    },
    dismissToast(id: string) {
      dispatch(dismissToast(id))
    }
  }
}
