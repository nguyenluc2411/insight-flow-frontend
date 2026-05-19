"use client"

import { useQuery } from "@tanstack/react-query"
import { bffService } from "@/services/bff.service"
import { useAuthStore } from "@/stores/auth.store"
import type { ForecastSummaryResponse } from "@/types/bff.types"

export type { ForecastSummaryResponse }

export function useForecastSummary() {
  const tenantId = useAuthStore((s) => s.tenant?.id)

  return useQuery<ForecastSummaryResponse>({
    queryKey: ["forecast-summary", tenantId],
    queryFn: () => bffService.getForecastSummary(),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  })
}
