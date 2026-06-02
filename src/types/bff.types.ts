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
  sku?: string
  forecastDays30: number
  confidence: string
}

export interface ForecastSummaryResponse {
  categoryTrends: CategoryTrend[]
  topProducts: TopProduct[]
  overallConfidence: number
  partial: boolean
  hasColdStart?: boolean
  message?: string
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
  avgDiscountPct?: number
}

export interface RecommendationsSummaryResponse {
  total: number
  byAction: Record<string, number>
  topActions: TopAction[]
  estimatedImpact: EstimatedImpact
  partial: boolean
  lastUpdated: string
}

export interface MarketKpis {
  opportunityScore: number | null
  opportunityScoreDelta: number
  potentialProductGroups: number
  bestChannel: string | null
  bestChannelScorePct: number
  competitionLevel: string | null
  competitionHotCategories: string[]
}

export interface ProductOpportunity {
  name: string
  category: string
  badge: string
  trendPct: number
  insight: string | null
  imageUrl: string | null
}

export interface ChannelOpportunity {
  channel: string
  score: number
  growthPct: number
}

export interface RegionDemand {
  region: string
  demandLevel: string
  growthPct: number
}

export interface TrendHighlight {
  name: string
  tag: string
  growthPct: number
}

export interface MarketSummaryResponse {
  period: string
  location: string
  kpis: MarketKpis
  productOpportunities: ProductOpportunity[]
  channelOpportunities: ChannelOpportunity[]
  regionDemand: RegionDemand[]
  trendHighlights: TrendHighlight[]
  partial: boolean
  lastUpdated: string
}
