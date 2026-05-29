"use client"

import type { ReactNode } from "react"
import { useEntitlements } from "@/hooks/use-entitlements"
import { LockedFeature } from "./LockedFeature"

/**
 * Renders children only if the tenant's plan includes `featureCode`.
 * Otherwise shows a LockedFeature panel (description + upgrade CTA).
 * Children are not mounted while locked, so their data-fetching hooks don't run.
 */
export function FeatureGate({
  featureCode,
  preview,
  children,
}: {
  featureCode: string
  preview?: ReactNode
  children: ReactNode
}) {
  const { hasFeature, loaded } = useEntitlements()

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">
          progress_activity
        </span>
      </div>
    )
  }

  if (hasFeature(featureCode)) {
    return <>{children}</>
  }

  return <LockedFeature featureCode={featureCode} preview={preview} />
}
