"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogService, type Product } from "@/services/catalog.service"
import { useAuthStore } from "@/stores/auth.store"

export function useProducts(params?: { page?: number; size?: number; search?: string }) {
  const tenantId = useAuthStore((s) => s.tenant?.id)
  return useQuery({
    queryKey: ["products", tenantId, params],
    queryFn: () => catalogService.getProducts(params),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(id: string | undefined) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => catalogService.getProduct(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof catalogService.createProduct>[0]) =>
      catalogService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof catalogService.updateProduct>[1] }) =>
      catalogService.updateProduct(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product", id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => catalogService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] })
    },
  })
}
