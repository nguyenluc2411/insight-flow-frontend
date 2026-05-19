import api from "@/lib/axios"

export interface Product {
  id: string
  tenantId: string
  name: string
  sku: string
  category?: string
  price?: number
  status?: string
}

export interface SpringPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface InventoryVariant {
  id: string
  productId: string
  sku: string
  quantityOnHand: number
  quantitySold?: number
}

export interface InventoryMovement {
  id: string
  variantId: string
  type: "IN" | "OUT"
  quantity: number
  note?: string
  createdAt: string
}

export const catalogService = {
  async getProducts(params?: { page?: number; size?: number; category?: string; search?: string }): Promise<SpringPage<Product>> {
    const { data } = await api.get("/api/v1/catalog/products", { params })
    return data
  },

  async getInventory(variantId: string): Promise<InventoryVariant> {
    const { data } = await api.get(`/api/v1/catalog/inventory/variants/${variantId}`)
    return data
  },

  async getInventoryMovements(variantId: string): Promise<SpringPage<InventoryMovement>> {
    const { data } = await api.get(`/api/v1/catalog/inventory/movements/${variantId}`)
    return data
  },

  async recordMovement(payload: { variantId: string; type: "IN" | "OUT"; quantity: number; note?: string }): Promise<InventoryMovement> {
    const { data } = await api.post("/api/v1/catalog/inventory/movements", payload)
    return data
  },
}
