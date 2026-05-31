"use client"

import { useEffect, useState } from "react"
import { billingService } from "@/services/billing.service"

// Module-level cache so navigating between pages doesn't refetch.
// Cleared on logout (see auth store) and on billing error (to allow retry).
let featuresCache: string[] | null = null
let inflight: Promise<string[]> | null = null

function loadFeatures(): Promise<string[]> {
  if (featuresCache !== null) return Promise.resolve(featuresCache)
  if (!inflight) {
    inflight = billingService
      .getCurrentSubscription()
      .then((s) => {
        featuresCache = s.featuresAtSubscription ?? []
        return featuresCache
      })
      .catch(() => {
        // Billing down or no subscription → do NOT cache, allow retry on next mount.
        // Return empty array for this render only.
        featuresCache = null
        return [] as string[]
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function clearEntitlementsCache() {
  featuresCache = null
  inflight = null
}

/**
 * Returns the tenant's entitled feature codes (from the active subscription
 * snapshot) and a hasFeature() helper for client-side feature gating.
 */
export function useEntitlements() {
  const [features, setFeatures] = useState<string[]>(featuresCache ?? [])
  const [loaded, setLoaded] = useState(featuresCache !== null)

  useEffect(() => {
    let active = true
    loadFeatures().then((f) => {
      if (active) {
        setFeatures(f)
        setLoaded(true)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return {
    features,
    loaded,
    hasFeature: (code: string) => features.includes(code),
  }
}
