import api from "@/lib/axios"

/** Matches ProductResponse from catalog-service */
export interface Product {
  id: string
  tenantId: string
  skuRoot: string        // was incorrectly "sku" — backend field is skuRoot
  name: string
  description?: string
  categoryId?: string    // UUID — backend does NOT return category name here
  brand?: string
  season?: string
  gender?: string
  tags?: string[]
  status?: string
  createdAt?: string
  updatedAt?: string
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

/** Matches VariantResponse from catalog-service */
export interface ProductVariant {
  id: string
  tenantId: string
  productId: string
  sku: string
  barcode?: string
  size?: string
  color?: string
  colorHex?: string
  costPrice?: number
  sellingPrice?: number
  compareAtPrice?: number
  status?: string
  createdAt?: string
  updatedAt?: string
}

/** Matches InventoryLevelResponse from catalog-service */
export interface InventoryLevel {
  id: string
  variantId: string
  locationId: string
  locationName?: string
  quantityOnHand: number
  quantityReserved: number
  quantityAvailable: number
  reorderPoint?: number
  updatedAt?: string
}

/** Matches InventoryMovementResponse from catalog-service */
export interface InventoryMovement {
  id: number
  variantId: string
  locationId: string
  movementType: "IN" | "OUT"
  quantityChange: number
  referenceType?: string
  referenceId?: string
  notes?: string
  createdBy?: string
  createdAt: string
}

export interface RecordMovementRequest {
  variantId: string
  locationId: string
  movementType: "IN" | "OUT"
  quantityChange: number
  notes?: string
}

export const catalogService = {
  async getProducts(params?: { page?: number; size?: number; search?: string }): Promise<SpringPage<Product>> {
    const { data } = await api.get("/api/v1/catalog/products", { params })
    return data
  },

  async getProduct(id: string): Promise<Product> {
    const { data } = await api.get(`/api/v1/catalog/products/${id}`)
    return data
  },

  // Returns InventoryLevelResponse[] for a specific variantId
  async getInventoryLevels(variantId: string): Promise<InventoryLevel[]> {
    const { data } = await api.get(`/api/v1/catalog/inventory/variants/${variantId}`)
    return data
  },

  async getInventoryMovements(variantId: string): Promise<SpringPage<InventoryMovement>> {
    const { data } = await api.get(`/api/v1/catalog/inventory/movements/${variantId}`)
    return data
  },

  async recordMovement(payload: RecordMovementRequest): Promise<InventoryMovement> {
    const { data } = await api.post("/api/v1/catalog/inventory/movements", payload)
    return data
  },

  async getLocations() {
    const { data } = await api.get("/api/v1/catalog/locations")
    return data
  },
}
