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

/** Matches InventorySummaryResponse from catalog-service */
export interface InventorySummary {
  totalSKU: number
  totalQuantity: number
  lowStockCount: number
}

/** Matches CategorySummaryItem from catalog-service */
export interface CategorySummary {
  id: string
  name: string
  productCount: number
}

export interface CreateProductRequest {
  skuRoot?: string
  name?: string
  description?: string
  categoryId?: string
  brand?: string
  season?: string
  gender?: string
  tags?: string[]
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  categoryId?: string
  brand?: string
  season?: string
  gender?: string
  tags?: string[]
  status?: string
}

export interface CreateVariantRequest {
  sku?: string
  barcode?: string
  size?: string
  color?: string
  colorHex?: string
  costPrice?: number
  sellingPrice: number
  compareAtPrice?: number
  status?: string
}

export interface LocationResponse {
  id: string
  tenantId: string
  name: string
  type: string
  address?: string
  city?: string
  active: boolean
  createdAt: string
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

  async createProduct(payload: CreateProductRequest): Promise<Product> {
    const { data } = await api.post("/api/v1/catalog/products", payload)
    return data
  },

  async updateProduct(id: string, payload: UpdateProductRequest): Promise<Product> {
    const { data } = await api.put(`/api/v1/catalog/products/${id}`, payload)
    return data
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/api/v1/catalog/products/${id}`)
  },

  async createVariant(productId: string, payload: CreateVariantRequest): Promise<ProductVariant> {
    const { data } = await api.post(`/api/v1/catalog/products/${productId}/variants`, payload)
    return data
  },

  async createLocation(payload: { name?: string; type: string; address?: string; city?: string }): Promise<LocationResponse> {
    const { data } = await api.post("/api/v1/catalog/locations", payload)
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

  async getLocations(): Promise<LocationResponse[]> {
    const { data } = await api.get("/api/v1/catalog/locations")
    return data
  },

  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const { data } = await api.get(`/api/v1/catalog/products/${productId}/variants`)
    return data
  },

  async getInventorySummary(): Promise<InventorySummary> {
    const { data } = await api.get("/api/v1/catalog/inventory/summary")
    return data
  },

  async getCategories(): Promise<CategorySummary[]> {
    const { data } = await api.get("/api/v1/catalog/categories")
    return data
  },
}
