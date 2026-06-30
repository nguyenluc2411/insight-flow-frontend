/** Matches ML service ForecastPoint schema */
export interface ForecastPoint {
  date: string
  predicted: number
  lowerBound: number
  upperBound: number
}

/** Forecast basis returned by ml-service */
export type ForecastBasis =
  | "variant"
  | "market_trends_hcm"
  | "market_trends_hcm_generic"
  | "no_base_model"

export type Confidence = "high" | "medium" | "low" | "none"

/** Measured backtest error for a variant model (null/absent for cold-start) */
export interface AccuracyInfo {
  wape: number | null // Weighted Absolute % Error, e.g. 0.23 = 23%
  rmse: number | null
  holdoutDays: number | null
  modelVersion: string | null
  measured: boolean
}

/** Matches ML service ForecastResponse schema */
export interface ForecastResponse {
  variantId: string
  tenantId: string
  forecastDays: number
  confidence: Confidence
  basis: ForecastBasis
  predictions: ForecastPoint[]
  accuracy?: AccuracyInfo | null
  generatedAt: string
}

/** One actual-sales history point (for the forecast chart) */
export interface HistoryPoint {
  date: string
  actual: number
}

/** Matches ML service ForecastSeriesResponse schema */
export interface ForecastSeriesResponse {
  variantId: string
  tenantId: string
  forecastDays: number
  confidence: Confidence
  basis: ForecastBasis
  history: HistoryPoint[]
  predictions: ForecastPoint[]
  accuracy?: AccuracyInfo | null
  generatedAt: string
  warning?: string | null
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
