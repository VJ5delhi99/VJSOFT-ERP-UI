import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ToastMessage } from '../types'

interface UiState {
  toasts: ToastMessage[]
}

const initialState: UiState = {
  toasts: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    pushToast(state, action: PayloadAction<Omit<ToastMessage, 'id'> & { id?: string }>) {
      state.toasts.push({
        id: action.payload.id || crypto.randomUUID(),
        title: action.payload.title,
        message: action.payload.message,
        tone: action.payload.tone
      })
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    }
  }
})

export const { pushToast, dismissToast } = uiSlice.actions
export default uiSlice.reducer
