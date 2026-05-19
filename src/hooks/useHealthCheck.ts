"use client"

import { useQuery } from "@tanstack/react-query"
import { bffService } from "@/services/bff.service"
import { useAuthStore } from "@/stores/auth.store"
import type { HealthSummaryResponse } from "@/types/bff.types"

export type { HealthSummaryResponse }

export function useHealthCheck() {
  const tenantId = useAuthStore((s) => s.tenant?.id)

  return useQuery<HealthSummaryResponse>({
    queryKey: ["health-summary", tenantId],
    queryFn: () => bffService.getHealthSummary(),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}
