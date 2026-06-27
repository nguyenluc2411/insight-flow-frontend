import api from "@/lib/axios"

export interface AnalyticsEventRequest {
  sessionId: string
  tenantId?: string
  eventType: "PAGE_VIEW" | "SIGNUP_CLICK" | "REGISTER_SUCCESS" | "UPGRADE_SUCCESS" | "HEARTBEAT"
  url?: string
  utmSource?: string
  metadata?: Record<string, any>
}

export interface FunnelStep {
  stepName: string
  value: number
}

export interface AccessHistoryItem {
  id: string
  visitorType: string
  plan: string
  accessTime: string
  duration: string
  device: string
  location: string
}

export interface AdminFunnelResponse {
  totalVisitors: number
  totalRegistered: number
  totalPaidCustomers: number
  conversionRates: {
    visitorToRegisterPct: number
    registerToPaidPct: number
  }
  funnelSteps: FunnelStep[]
  accessHistory: AccessHistoryItem[]
}

export const analyticsService = {
  async trackEvent(req: AnalyticsEventRequest): Promise<void> {
    await api.post("/api/v1/analytics/track", req)
  },

  async getAdminFunnel(fromDate?: string, toDate?: string): Promise<AdminFunnelResponse> {
    const { data } = await api.get("/api/v1/admin/analytics/funnel", {
      params: { 
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {})
      }
    })
    return data
  }
}
