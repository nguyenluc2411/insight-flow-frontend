/** Matches ML service ForecastPoint schema */
export interface ForecastPoint {
  date: string
  predicted: number
  lowerBound: number
  upperBound: number
}

/** Matches ML service ForecastResponse schema */
export interface ForecastResponse {
  variantId: string
  tenantId: string
  forecastDays: number
  confidence: "high" | "medium" | "low" | "none"
  basis: "variant" | "category" | "moving_average"
  predictions: ForecastPoint[]
  generatedAt: string
}

/** Matches ML service RecommendationResponse schema */
export interface Recommendation {
  id: string
  tenantId: string
  variantId: string
  action: "CLEARANCE" | "RESTOCK" | "PROMOTE" | "OK"
  reason?: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  suggestedDiscountPct?: number
  suggestedRestockQty?: number
  stockAgeDays?: number
  currentStock?: number
  salesVelocity30d?: number
  createdAt: string
}

/** Matches ML service PagedRecommendationResponse schema */
export interface PagedRecommendationResponse {
  items: Recommendation[]
  page: number
  size: number
  total: number
}

/** Matches ML service RefreshJobResponse schema */
export interface RefreshJobResponse {
  jobId: string
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED"
}
