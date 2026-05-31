"use client"

import { useQuery } from "@tanstack/react-query"
import { catalogService, type InventorySummary, type CategorySummary, type ProductVariant } from "@/services/catalog.service"
import { useAuthStore } from "@/stores/auth.store"

export function useInventorySummary() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery<InventorySummary>({
    queryKey: ["inventory-summary", tenantId],
    queryFn: () => catalogService.getInventorySummary(),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategories() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery<CategorySummary[]>({
    queryKey: ["categories", tenantId],
    queryFn: () => catalogService.getCategories(),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useProductVariants(productId: string | undefined) {
  return useQuery<ProductVariant[]>({
    queryKey: ["product-variants", productId],
    queryFn: () => catalogService.getProductVariants(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useActiveVariants() {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery<ProductVariant[]>({
    queryKey: ["active-variants", tenantId],
    queryFn: () => catalogService.getActiveVariants(),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}
