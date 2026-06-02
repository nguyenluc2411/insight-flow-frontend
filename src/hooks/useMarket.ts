"use client"

import { useQuery } from "@tanstack/react-query"
import { bffService } from "@/services/bff.service"
import { useAuthStore } from "@/stores/auth.store"

export function useMarketSummary(location?: string) {
  const tenant = useAuthStore((s) => s.tenant)
  const resolvedLocation = location ?? "hcmc"

  return useQuery({
    queryKey: ["market-summary", resolvedLocation],
    queryFn: () => bffService.getMarketSummary(resolvedLocation),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!tenant,
  })
}
