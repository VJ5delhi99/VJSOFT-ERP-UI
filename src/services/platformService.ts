import type { AiReadinessDto, AuditTrailEntryDto, DemoStatusDto, NotificationDto, OutboxMessageDto, PlatformContextDto } from '../types'
import { requestGet, requestPost } from './apiClient'

export const platformService = {
  getDemoStatus() {
    return requestGet<DemoStatusDto>('platform', '/api/demo/status')
  },
  resetDemo() {
    return requestPost<void, Record<string, never>>('platform', '/api/demo/reset', {})
  },
  getContext() {
    return requestGet<PlatformContextDto>('platform', '/api/platform/context')
  },
  getAudit(take = 50) {
    return requestGet<AuditTrailEntryDto[]>('platform', '/api/platform/audit', {
      params: { take }
    })
  },
  getNotifications(unreadOnly = false) {
    return requestGet<NotificationDto[]>('platform', '/api/platform/notifications', {
      params: { unreadOnly: unreadOnly || undefined }
    })
  },
  acknowledgeNotification(id: string) {
    return requestPost<void, Record<string, never>>('platform', `/api/platform/notifications/${id}/ack`, {})
  },
  getOutbox(status?: string, take = 50) {
    return requestGet<OutboxMessageDto[]>('platform', '/api/platform/outbox', {
      params: {
        status: status || undefined,
        take
      }
    })
  },
  getAiReadiness() {
    return requestGet<AiReadinessDto>('platform', '/api/platform/ai/readiness')
  }
}
