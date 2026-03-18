import type { LoginPayload, LoginResponse } from '../types'
import { requestGet, requestPost } from './apiClient'

export const authService = {
  login(payload: LoginPayload) {
    return requestPost<LoginResponse, LoginPayload>('auth', '/api/auth/login', payload)
  },
  me() {
    return requestGet<LoginResponse['user']>('auth', '/api/auth/me')
  },
  refresh(refreshToken: string, deviceId: string) {
    return requestPost<LoginResponse, { refreshToken: string; deviceId: string }>('auth', '/api/auth/refresh', {
      refreshToken,
      deviceId
    })
  },
  logout(refreshToken?: string) {
    return requestPost<void, { refreshToken?: string }>('auth', '/api/auth/logout', {
      refreshToken
    })
  }
}
