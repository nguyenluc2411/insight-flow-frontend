"use client"

import { useQuery } from "@tanstack/react-query"
import { catalogService } from "@/services/catalog.service"
import { useAuthStore } from "@/stores/auth.store"

export interface HealthCheckSummary {
  totalSKU: number
  totalProducts: number
  hasData: boolean
}

export function useHealthCheck() {
  const tenantId = useAuthStore((s) => s.tenant?.id)

  return useQuery({
    queryKey: ["health-check", tenantId],
    queryFn: async (): Promise<HealthCheckSummary> => {
      const products = await catalogService.getProducts({ page: 0, size: 1 })
      return {
        totalSKU: products.totalElements,
        totalProducts: products.totalElements,
        hasData: !products.empty,
      }
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}
