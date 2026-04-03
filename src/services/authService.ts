import type { LoginPayload, LoginResponse } from '../types'
import { apiConfig } from '../config/api'
import { getDemoProfile, loginWithDemo, logoutDemoSession, refreshDemoSession } from '../demo/demoAuth'
import { store } from '../store'
import { requestGet, requestPost } from './apiClient'

export const authService = {
  login(payload: LoginPayload) {
    if (apiConfig.demoModeEnabled) {
      return loginWithDemo(payload)
    }

    return requestPost<LoginResponse, LoginPayload>('auth', '/api/auth/login', payload)
  },
  me() {
    if (apiConfig.demoModeEnabled) {
      return getDemoProfile(store.getState().auth.token)
    }

    return requestGet<LoginResponse['user']>('auth', '/api/auth/me')
  },
  refresh(refreshToken: string, deviceId: string) {
    if (apiConfig.demoModeEnabled) {
      return refreshDemoSession(refreshToken)
    }

    return requestPost<LoginResponse, { refreshToken: string; deviceId: string }>('auth', '/api/auth/refresh', {
      refreshToken,
      deviceId
    })
  },
  logout(refreshToken?: string) {
    if (apiConfig.demoModeEnabled) {
      return logoutDemoSession()
    }

    return requestPost<void, { refreshToken?: string }>('auth', '/api/auth/logout', {
      refreshToken
    })
  }
}
