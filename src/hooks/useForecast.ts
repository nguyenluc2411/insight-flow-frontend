"use client"

import { useQuery } from "@tanstack/react-query"
import { bffService } from "@/services/bff.service"
import { mlService } from "@/services/ml.service"
import { useAuthStore } from "@/stores/auth.store"
import type { ForecastSummaryResponse, ForecastResponse } from "@/types"

export type { ForecastSummaryResponse }

/** Forecast summary from BFF — category trends + top products overview */
export function useForecastSummary() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery<ForecastSummaryResponse>({
    queryKey: ["forecast-summary", tenantId],
    queryFn: () => bffService.getForecastSummary(),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  })
}

/** Per-variant forecast from ML service */
export function useForecast(variantId: string | undefined, days = 30) {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery<ForecastResponse>({
    queryKey: ["forecast", tenantId, variantId, days],
    queryFn: () => mlService.getForecast(variantId!, days),
    enabled: !!tenantId && !!variantId,
    staleTime: 10 * 60 * 1000,
  })
}
