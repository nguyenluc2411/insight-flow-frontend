/** Types matching Dashboard BFF — GET /api/v1/dashboard/* */

export interface DashboardOverviewResponse {
  totalSKU: number
  ordersToday?: number
  revenueToday?: number
  highPriorityAlerts: number
  mlStatus: "UP" | "DOWN" | string
  partial: boolean
  lastUpdated: string
}

export interface CategoryRisk {
  category: string
  units: number
  riskLevel: "HIGH" | "MEDIUM" | "LOW" | string
}

export interface ChannelPerformance {
  channel: string
  orders: number
  rate: number
}

export interface HealthSummaryResponse {
  inventoryPressurePct: number
  sellThroughRate?: number
  slowMovingSKUCount: number
  categoryRisks: CategoryRisk[]
  channelPerformance: ChannelPerformance[]
  partial: boolean
  lastUpdated: string
}

export interface CategoryTrend {
  category: string
  trend: string
  pct: number
}

export interface TopProduct {
  variantId: string
  forecastDays30: number
  confidence: string
}

export interface ForecastSummaryResponse {
  categoryTrends: CategoryTrend[]
  topProducts: TopProduct[]
  overallConfidence: number
  partial: boolean
  lastUpdated: string
}

export interface TopAction {
  variantId: string
  action: string
  priority: "HIGH" | "MEDIUM" | "LOW" | "STRATEGIC" | string
  reason: string
  suggestedDiscountPct?: number
  suggestedRestockQty?: number
  stockAgeDays?: number
  currentStock?: number
}

export interface EstimatedImpact {
  clearanceItems: number
  restockItems: number
  promoteItems: number
}

export interface RecommendationsSummaryResponse {
  total: number
  byAction: Record<string, number>
  topActions: TopAction[]
  estimatedImpact: EstimatedImpact
  partial: boolean
  lastUpdated: string
}
