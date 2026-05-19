"use client"

import { useQuery } from "@tanstack/react-query"
import { mlService } from "@/services/ml.service"

export function useForecast(variantId?: string) {
  return useQuery({
    queryKey: ["forecast", variantId],
    queryFn: () => mlService.getForecast(variantId!, 30),
    enabled: !!variantId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useForecastBatch(variantIds: string[]) {
  return useQuery({
    queryKey: ["forecast-batch", variantIds],
    queryFn: () => mlService.getForecastBatch(variantIds, 30),
    enabled: variantIds.length > 0,
    staleTime: 10 * 60 * 1000,
  })
}
