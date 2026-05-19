"use client"

import { useQuery } from "@tanstack/react-query"
import { catalogService } from "@/services/catalog.service"
import { mlService } from "@/services/ml.service"
import { useAuthStore } from "@/stores/auth.store"

export interface DashboardSummary {
  totalSKU: number
  hasData: boolean
  totalRecommendations: number
  mlHealthy: boolean
}

export function useDashboard() {
  const tenantId = useAuthStore((s) => s.tenant?.id)

  return useQuery({
    queryKey: ["dashboard", tenantId],
    queryFn: async (): Promise<DashboardSummary> => {
      const [products, recommendations, mlHealth] = await Promise.allSettled([
        catalogService.getProducts({ page: 0, size: 1 }),
        mlService.getRecommendations({ size: 1 }),
        mlService.getHealth(),
      ])

      const totalSKU = products.status === "fulfilled" ? products.value.totalElements : 0
      const totalRecommendations = recommendations.status === "fulfilled" ? recommendations.value.total : 0
      const mlHealthy = mlHealth.status === "fulfilled" && mlHealth.value?.status === "UP"

      return {
        totalSKU,
        hasData: totalSKU > 0,
        totalRecommendations,
        mlHealthy,
      }
    },
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}
