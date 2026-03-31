import type {
  AiReadinessDto,
  AuditTrailEntryDto,
  DemoStatusDto,
  IndustryProfileDto,
  NotificationDto,
  OrganizationOverviewDto,
  OutboxMessageDto,
  PlatformContextDto,
  PlatformOperationsSummaryDto,
  WorkflowTemplateDto
} from '../types'
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
  getOrganizationOverview() {
    return requestGet<OrganizationOverviewDto>('platform', '/api/platform/organization-overview')
  },
  getOperationsSummary() {
    return requestGet<PlatformOperationsSummaryDto>('platform', '/api/platform/operations-summary')
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
  },
  getIndustryProfiles() {
    return requestGet<IndustryProfileDto[]>('platform', '/api/platform/industry-profiles')
  },
  activateIndustryProfile(industryCode: string) {
    return requestPost<IndustryProfileDto, { industryCode: string }>('platform', '/api/platform/industry-profiles/activate', { industryCode })
  },
  getWorkflowTemplates(industryCode?: string) {
    return requestGet<WorkflowTemplateDto[]>('platform', '/api/platform/workflow-templates', {
      params: { industryCode: industryCode || undefined }
    })
  }
}
