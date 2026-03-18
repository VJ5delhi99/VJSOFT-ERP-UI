import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { apiConfig } from '../config/api'
import type { AuthState, LoginResponse } from '../types'
import { readJsonStorage, readStorage, removeStorage, writeJsonStorage, writeStorage } from '../utils/storage'

const token = readStorage(apiConfig.storageKeys.token, null)
const refreshToken = readStorage(apiConfig.storageKeys.refreshToken, null)
const expiresAtUtc = readStorage(apiConfig.storageKeys.expiresAtUtc, null)
const user = readJsonStorage<AuthState['user']>(apiConfig.storageKeys.user, null)

const initialState: AuthState = {
  token,
  refreshToken,
  expiresAtUtc,
  user,
  status: token && user ? 'authenticated' : 'idle'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStarted(state) {
      state.status = 'loading'
    },
    loginFailed(state) {
      state.status = state.token && state.user ? 'authenticated' : 'idle'
    },
    setSession(state, action: PayloadAction<LoginResponse>) {
      state.token = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.expiresAtUtc = action.payload.expiresAtUtc
      state.user = action.payload.user
      state.status = 'authenticated'
      writeStorage(apiConfig.storageKeys.token, action.payload.accessToken)
      writeStorage(apiConfig.storageKeys.refreshToken, action.payload.refreshToken)
      writeStorage(apiConfig.storageKeys.expiresAtUtc, action.payload.expiresAtUtc)
      writeJsonStorage(apiConfig.storageKeys.user, action.payload.user)
    },
    setCurrentUser(state, action: PayloadAction<AuthState['user']>) {
      state.user = action.payload

      if (action.payload) {
        writeJsonStorage(apiConfig.storageKeys.user, action.payload)
      }
    },
    clearSession(state) {
      state.token = null
      state.refreshToken = null
      state.expiresAtUtc = null
      state.user = null
      state.status = 'idle'
      removeStorage(apiConfig.storageKeys.token)
      removeStorage(apiConfig.storageKeys.refreshToken)
      removeStorage(apiConfig.storageKeys.expiresAtUtc)
      removeStorage(apiConfig.storageKeys.user)
    }
  }
})

export const { loginStarted, loginFailed, setSession, setCurrentUser, clearSession } = authSlice.actions
export default authSlice.reducer
