import { apiConfig } from '../config/api'

function log(method: 'info' | 'warn' | 'error', message: string, payload?: unknown) {
  if (!apiConfig.enableLogs) {
    return
  }

  if (payload === undefined) {
    console[method](`[${apiConfig.appName}] ${message}`)
    return
  }

  console[method](`[${apiConfig.appName}] ${message}`, payload)
}

export const logger = {
  info: (message: string, payload?: unknown) => log('info', message, payload),
  warn: (message: string, payload?: unknown) => log('warn', message, payload),
  error: (message: string, payload?: unknown) => log('error', message, payload)
}
