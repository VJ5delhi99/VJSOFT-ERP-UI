import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { clearSession, loginFailed, loginStarted, setCurrentUser, setSession } from '../store/authSlice'
import { pushToast } from '../store/uiSlice'
import type { Permission, UserRole } from '../types'
import { hasAccess, hasAnyPermission, hasAnyRole } from '../utils/access'
import { authService } from '../services/authService'
import { apiConfig } from '../config/api'

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)

  async function login(userNameOrEmail: string, password: string) {
    dispatch(loginStarted())

    try {
      const session = await authService.login({
        userNameOrEmail,
        password,
        deviceId: apiConfig.authDeviceId
      })
      dispatch(setSession(session))
      dispatch(
        pushToast({
          title: 'Signed in',
          message: `You are signed in as ${session.user.userName}.`,
          tone: 'success'
        })
      )
      return session
    } catch (error) {
      dispatch(loginFailed())
      throw error
    }
  }

  async function refreshSession() {
    if (!auth.refreshToken) {
      return null
    }

    const session = await authService.refresh(auth.refreshToken, apiConfig.authDeviceId)
    dispatch(setSession(session))
    return session
  }

  async function loadProfile() {
    if (!auth.token) {
      return null
    }

    const currentUser = await authService.me()
    dispatch(setCurrentUser(currentUser))
    return currentUser
  }

  async function logout() {
    try {
      if (auth.token) {
        await authService.logout(auth.refreshToken || undefined)
      }
    } catch {
      // Clearing client state is the priority if the logout call fails.
    }

    dispatch(clearSession())
    dispatch(
      pushToast({
        title: 'Signed out',
        message: 'You have been signed out.',
        tone: 'info'
      })
    )
  }

  function canAccess(roles?: UserRole[], permissions?: Permission[]) {
    return hasAccess(auth.user, roles, permissions)
  }

  return {
    ...auth,
    login,
    refreshSession,
    loadProfile,
    logout,
    canAccess,
    hasPermission: (permission: Permission) => hasAnyPermission(auth.user, [permission]),
    isAuthenticated: Boolean(auth.token && auth.user),
    hasRole: (role: UserRole) => auth.user?.roles.includes(role) || false
  }
}
