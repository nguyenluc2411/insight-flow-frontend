"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { mlService } from "@/services/ml.service"
import { bffService } from "@/services/bff.service"
import { useAuthStore } from "@/stores/auth.store"

export function useRecommendations(filters?: {
  action?: "CLEARANCE" | "RESTOCK" | "PROMOTE" | "OK"
  priority?: "HIGH" | "MEDIUM" | "LOW"
  page?: number
}) {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery({
    queryKey: ["recommendations", tenantId, filters],
    queryFn: () => mlService.getRecommendations({ ...filters, size: 20 }),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecommendationsSummary() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery({
    queryKey: ["recommendations-summary", tenantId],
    queryFn: () => bffService.getRecommendationsSummary(),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRefreshRecommendations() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => mlService.refreshRecommendations(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] })
      queryClient.invalidateQueries({ queryKey: ["recommendations-summary"] })
    },
  })
}
