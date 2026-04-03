import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { apiConfig, type ServiceKey } from '../config/api'
import { handleDemoRequest } from '../demo/demoApi'
import { store } from '../store'
import { clearSession } from '../store/authSlice'
import { pushToast } from '../store/uiSlice'
import type { ApiEnvelope, ApiError } from '../types'
import { logger } from '../utils/logger'

const clients = new Map<ServiceKey, AxiosInstance>()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function createClient(service: ServiceKey) {
  const client = axios.create({
    baseURL: apiConfig.services[service],
    timeout: apiConfig.requestTimeoutMs,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  client.interceptors.request.use((request) => {
    const { auth } = store.getState()
    const headers = (request.headers || {}) as Record<string, string>

    if (auth.token) {
      headers.Authorization = `Bearer ${auth.token}`
    }

    if (auth.user?.tenantId) {
      headers['X-Tenant-Id'] = auth.user.tenantId
    }

    request.headers = headers
    return request
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalizedError = normalizeApiError(error)

      if (normalizedError.status === 401) {
        store.dispatch(clearSession())
      }

      if (!apiConfig.useMocks) {
        store.dispatch(
          pushToast({
            title: 'Could not complete action',
            message: normalizedError.message,
            tone: normalizedError.status && normalizedError.status >= 500 ? 'danger' : 'warning'
          })
        )
      }

      logger.error('API request failed', normalizedError)
      return Promise.reject(normalizedError)
    }
  )

  return client
}

function getClient(service: ServiceKey) {
  const existingClient = clients.get(service)

  if (existingClient) {
    return existingClient
  }

  const client = createClient(service)
  clients.set(service, client)
  return client
}

function unwrapPayload<T>(payload: ApiEnvelope<T> | T): T {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data as T
  }

  return payload as T
}

export function normalizeApiError(error: unknown): ApiError {
  if (isRecord(error) && 'message' in error && typeof error.message === 'string' && 'status' in error) {
    return error as ApiError
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status
    const responseData = error.response?.data

    if (isRecord(responseData) && typeof responseData.message === 'string') {
      return {
        message: responseData.message,
        status,
        code:
          typeof responseData.errorCode === 'string'
            ? responseData.errorCode
            : typeof responseData.code === 'string'
              ? responseData.code
              : undefined
      }
    }

    if (!status && (error.code === AxiosError.ERR_NETWORK || error.message === 'Network Error')) {
      return {
        message: "We couldn't connect right now. Check your connection or try again in a moment."
      }
    }

    const message =
      status === 401
        ? 'Your sign-in details are not correct.'
        : status === 403
          ? 'You do not have access to do this.'
          : status === 404
            ? "We couldn't find what you were looking for."
            : status && status >= 500
              ? 'This information is not available right now. Please try again shortly.'
              : "We couldn't complete your request. Please try again."

    return { message, status }
  }

  return {
    message: "We couldn't complete your request. Please try again."
  }
}

async function executeRequest<T>(
  service: ServiceKey,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  request: (client: AxiosInstance) => Promise<{ data: ApiEnvelope<T> | T }>,
  payload?: unknown,
  config?: AxiosRequestConfig
) {
  if (apiConfig.demoModeEnabled) {
    try {
      return await handleDemoRequest<T>(service, method, path, payload, config)
    } catch (error) {
      const normalizedError = normalizeApiError(error)
      logger.error('Demo API request failed', normalizedError)
      return Promise.reject(normalizedError)
    }
  }

  const client = getClient(service)
  const response = await request(client)
  return unwrapPayload(response.data)
}

export function requestGet<T>(service: ServiceKey, path = '', config?: AxiosRequestConfig) {
  return executeRequest<T>(service, 'GET', path, (client) => client.get(path, config), undefined, config)
}

export function requestPost<T, TPayload = unknown>(service: ServiceKey, path = '', payload?: TPayload, config?: AxiosRequestConfig) {
  return executeRequest<T>(service, 'POST', path, (client) => client.post(path, payload, config), payload, config)
}

export function requestPut<T, TPayload = unknown>(service: ServiceKey, path = '', payload?: TPayload, config?: AxiosRequestConfig) {
  return executeRequest<T>(service, 'PUT', path, (client) => client.put(path, payload, config), payload, config)
}

export function requestPatch<T, TPayload = unknown>(service: ServiceKey, path = '', payload?: TPayload, config?: AxiosRequestConfig) {
  return executeRequest<T>(service, 'PATCH', path, (client) => client.patch(path, payload, config), payload, config)
}

export function requestDelete<T>(service: ServiceKey, path = '', config?: AxiosRequestConfig) {
  return executeRequest<T>(service, 'DELETE', path, (client) => client.delete(path, config), undefined, config)
}

export function ensureListResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (!isRecord(payload)) {
    return []
  }

  const candidateKeys = ['items', 'results', 'records', 'rows', 'data']

  for (const key of candidateKeys) {
    const value = payload[key]

    if (Array.isArray(value)) {
      return value as T[]
    }

    if (isRecord(value)) {
      const nestedList = ensureListResponse<T>(value)

      if (nestedList.length > 0) {
        return nestedList
      }
    }
  }

  return []
}

export async function withServiceFallback<T>(label: string, request: () => Promise<T>, fallback: () => Promise<T>) {
  if (apiConfig.useMocks) {
    logger.info(`Using local mock for ${label}`)
    return fallback()
  }

  return request()
}
