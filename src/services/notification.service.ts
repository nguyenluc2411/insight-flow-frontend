import api from "@/lib/axios"

export interface NotificationResponse {
  id: string
  tenantId: string
  type: "LOW_STOCK" | "RECOMMENDATION" | "FORECAST" | string
  channel: "IN_APP" | "EMAIL" | string
  title: string
  body: string
  metadata?: Record<string, unknown>
  isRead: boolean
  sentAt: string
  createdAt: string
}

export interface UnreadCountResponse {
  count: number
}

export interface PreferenceResponse {
  id: string
  tenantId: string
  eventType: "LOW_STOCK" | "RECOMMENDATION" | "FORECAST"
  channel: "IN_APP" | "EMAIL"
  enabled: boolean
  threshold?: Record<string, unknown>
}

export interface UpsertPreferenceRequest {
  eventType: "LOW_STOCK" | "RECOMMENDATION" | "FORECAST"
  channel: "IN_APP" | "EMAIL"
  enabled: boolean
  threshold?: Record<string, unknown>
}

export interface NotificationPage {
  content: NotificationResponse[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export const notificationService = {
  async getNotifications(params?: {
    unreadOnly?: boolean
    type?: string
    page?: number
    size?: number
  }): Promise<NotificationPage> {
    const { data } = await api.get("/api/v1/notifications", { params })
    return data
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const { data } = await api.get("/api/v1/notifications/unread-count")
    return data
  },

  async markRead(id: string): Promise<NotificationResponse> {
    const { data } = await api.put(`/api/v1/notifications/${id}/read`)
    return data
  },

  async markAllRead(): Promise<void> {
    await api.put("/api/v1/notifications/read-all")
  },

  async getPreferences(): Promise<PreferenceResponse[]> {
    const { data } = await api.get("/api/v1/notifications/preferences")
    return data
  },

  async upsertPreference(payload: UpsertPreferenceRequest): Promise<PreferenceResponse> {
    const { data } = await api.put("/api/v1/notifications/preferences", payload)
    return data
  },
}
