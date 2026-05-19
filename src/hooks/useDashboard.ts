"use client"

import { useQuery } from "@tanstack/react-query"
import { bffService } from "@/services/bff.service"
import { useAuthStore } from "@/stores/auth.store"
import type { DashboardOverviewResponse } from "@/types/bff.types"

export type { DashboardOverviewResponse }

export function useDashboard() {
  const tenantId = useAuthStore((s) => s.tenant?.id)

  return useQuery<DashboardOverviewResponse>({
    queryKey: ["dashboard-overview", tenantId],
    queryFn: () => bffService.getOverview(),
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}
