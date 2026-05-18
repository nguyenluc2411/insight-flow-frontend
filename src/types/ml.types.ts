export interface ForecastPoint {
  date: string
  predicted: number
  lowerBound: number
  upperBound: number
}

export interface ForecastResponse {
  variantId: string
  tenantId: string
  forecastDays: number
  confidence: "high" | "medium" | "low" | "none"
  basis: "variant" | "category" | "moving_average"
  predictions: ForecastPoint[]
  generatedAt: string
}

export interface Recommendation {
  id: string
  variantId: string
  variantName?: string
  sku?: string
  category?: string
  action: "CLEARANCE" | "RESTOCK" | "PROMOTE" | "OK"
  reason: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  suggestedDiscountPct?: number
  suggestedRestockQty?: number
  stockAgeDays: number
  currentStock: number
  salesVelocity30d: number
  confidence?: number
  expectedImpact?: string
  createdAt: string
}

export interface RecommendationSummary {
  total: number
  byAction: Record<string, number>
  estimatedBacklogReduction: number
  estimatedSellThroughIncrease: number
  estimatedMarkdownRiskReduction: number
}
