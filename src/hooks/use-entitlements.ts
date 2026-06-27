"use client"

import { useEffect, useState } from "react"
import { billingService } from "@/services/billing.service"
import { useAuthStore } from "@/stores/auth.store"

// Module-level cache so navigating between pages doesn't refetch.
// Cleared on logout (see auth store) and on billing error (to allow retry).
let featuresCache: string[] | null = null
let planCodeCache: string | null = null
let inflight: Promise<{ features: string[]; planCode: string | null }> | null = null

function loadSubscription(): Promise<{ features: string[]; planCode: string | null }> {
  if (featuresCache !== null) return Promise.resolve({ features: featuresCache, planCode: planCodeCache })
  if (!inflight) {
    inflight = billingService
      .getCurrentSubscription()
      .then((s) => {
        featuresCache = s.featuresAtSubscription ?? []
        planCodeCache = s.packageCode ?? null
        return { features: featuresCache, planCode: planCodeCache }
      })
      .catch(() => {
        featuresCache = null
        planCodeCache = null
        return { features: [] as string[], planCode: null }
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function clearEntitlementsCache() {
  featuresCache = null
  planCodeCache = null
  inflight = null
}

/**
 * Returns the tenant's entitled feature codes (from the active subscription
 * snapshot) and a hasFeature() helper for client-side feature gating.
 * Also syncs the resolved package code into the auth store so all pages
 * (e.g. dashboard KPI) show the live plan without re-login.
 */
export function useEntitlements() {
  const [features, setFeatures] = useState<string[]>(featuresCache ?? [])
  const [loaded, setLoaded] = useState(featuresCache !== null)
  const updateTenantPlan = useAuthStore((s) => s.updateTenantPlan)

  useEffect(() => {
    let active = true
    loadSubscription().then(({ features: f, planCode }) => {
      if (active) {
        setFeatures(f)
        setLoaded(true)
        if (planCode) updateTenantPlan(planCode.toLowerCase())
      }
    })
    return () => {
      active = false
    }
  }, [updateTenantPlan])

  return {
    features,
    loaded,
    hasFeature: (code: string) => features.includes(code),
  }
}
