"use client"

import { useEffect, useState } from "react"
import { billingService } from "@/services/billing.service"

// Module-level cache so navigating between pages doesn't refetch. Warmed on the
// first app-shell mount; cleared on logout (see auth store).
let featuresCache: string[] | null = null
let inflight: Promise<string[]> | null = null

function loadFeatures(): Promise<string[]> {
  if (featuresCache) return Promise.resolve(featuresCache)
  if (!inflight) {
    inflight = billingService
      .getCurrentSubscription()
      .then((s) => {
        featuresCache = s.featuresAtSubscription ?? []
        return featuresCache
      })
      .catch(() => {
        // No subscription yet / billing down → fail safe: no premium features.
        featuresCache = []
        return featuresCache
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
