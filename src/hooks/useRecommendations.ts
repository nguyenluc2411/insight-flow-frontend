"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { mlService } from "@/services/ml.service"

export function useRecommendations(filters?: { action?: string; priority?: string; page?: number }) {
  return useQuery({
    queryKey: ["recommendations", filters],
    queryFn: () => mlService.getRecommendations({ ...filters, size: 20 }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecommendationSummary() {
  return useQuery({
    queryKey: ["recommendations-summary"],
    queryFn: () => mlService.getSummary(),
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
