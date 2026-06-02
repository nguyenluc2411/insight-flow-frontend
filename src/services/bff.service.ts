import api from "@/lib/axios"
import type {
  DashboardOverviewResponse,
  HealthSummaryResponse,
  ForecastSummaryResponse,
  RecommendationsSummaryResponse,
  MarketSummaryResponse,
} from "@/types/bff.types"

export const bffService = {
  async getOverview(): Promise<DashboardOverviewResponse> {
    const { data } = await api.get("/api/v1/dashboard/overview")
    return data
  },

  async getHealthSummary(): Promise<HealthSummaryResponse> {
    const { data } = await api.get("/api/v1/dashboard/health-summary")
    return data
  },

  async getForecastSummary(): Promise<ForecastSummaryResponse> {
    const { data } = await api.get("/api/v1/dashboard/forecast-summary")
    return data
  },

  async getRecommendationsSummary(): Promise<RecommendationsSummaryResponse> {
    const { data } = await api.get("/api/v1/dashboard/recommendations-summary")
    return data
  },

  async getMarketSummary(location = "hcmc", period?: string): Promise<MarketSummaryResponse> {
    const params = new URLSearchParams({ location })
    if (period) params.set("period", period)
    const { data } = await api.get(`/api/v1/dashboard/market-summary?${params}`)
    return data
  },
}
