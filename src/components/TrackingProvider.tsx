"use client"

import { Suspense } from "react"
import { useTracking } from "@/hooks/useTracking"

function TrackingLogic() {
  useTracking()
  return null
}

export function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingLogic />
    </Suspense>
  )
}
