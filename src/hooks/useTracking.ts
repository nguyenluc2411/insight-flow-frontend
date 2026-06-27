"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { analyticsService, AnalyticsEventRequest } from "@/services/analytics.service"
import { useAuthStore } from "@/stores/auth.store"

const SESSION_KEY = "if_visitor_session_id"

function getOrCreateSessionId() {
  if (typeof window === "undefined") return "server-side"
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export function useTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page view on route change
  useEffect(() => {
    if (typeof window === "undefined") return

    const sessionId = getOrCreateSessionId()
    const url = window.location.href
    const utmSource = searchParams?.get("utm_source") || undefined

    const trackPageView = async () => {
      try {
        let device = "Unknown"
        let location = "Unknown"
        
        if (typeof navigator !== "undefined") {
          const ua = navigator.userAgent
          if (ua.includes("Windows")) device = "Windows"
          else if (ua.includes("Mac OS")) device = "MacOS"
          else if (ua.includes("Linux")) device = "Linux"
          else if (ua.includes("Android")) device = "Android"
          else if (ua.includes("iOS") || ua.includes("iPhone")) device = "iOS"
          else device = navigator.userAgent.substring(0, 20)
        }
        
        if (typeof Intl !== "undefined") {
          location = Intl.DateTimeFormat().resolvedOptions().timeZone
        }

        const tenantId = useAuthStore.getState().user?.tenantId

        const baseEvent = {
          sessionId,
          tenantId,
          url,
          utmSource,
          metadata: { device, location }
        }

        await analyticsService.trackEvent({ ...baseEvent, eventType: "PAGE_VIEW" })

        // Heartbeat để tính thời gian sử dụng nếu user chỉ ở 1 trang
        const intervalId = setInterval(() => {
          analyticsService.trackEvent({ ...baseEvent, eventType: "HEARTBEAT" }).catch(() => {})
        }, 10000) // 10 giây báo cáo 1 lần

        return () => clearInterval(intervalId)
      } catch (err) {
        console.error("Failed to track page view:", err)
      }
    }

    const cleanup = trackPageView()

    return () => {
      cleanup.then(cleanFn => cleanFn && cleanFn())
    }
  }, [pathname, searchParams])

  // Expose a method to manually track clicks/events
  const trackEvent = async (eventType: AnalyticsEventRequest["eventType"], metadata?: Record<string, any>) => {
    try {
      const sessionId = getOrCreateSessionId()
      const tenantId = useAuthStore.getState().user?.tenantId

      await analyticsService.trackEvent({
        sessionId,
        tenantId,
        eventType,
        url: window.location.href,
        metadata
      })
    } catch (err) {
      console.error("Failed to track event:", err)
    }
  }

  return { trackEvent }
}
