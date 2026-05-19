import { mlApi } from "@/lib/axios"
import type { ForecastResponse, Recommendation, RecommendationSummary } from "@/types/ml.types"

export interface MlPageResponse<T> {
  items: T[]
  page: number
  size: number
  total: number
}

export const mlService = {
  async getForecast(variantId: string, days = 30): Promise<ForecastResponse> {
    const { data } = await mlApi.get(`/api/v1/ml/forecast/${variantId}`, { params: { days } })
    return data
  },
  async getForecastBatch(variantIds: string[], days = 30): Promise<ForecastResponse[]> {
    const { data } = await mlApi.post("/api/v1/ml/forecast/batch", { variantIds, days })
    return data
  },
  async getRecommendations(params?: {
    action?: string; priority?: string; page?: number; size?: number
  }): Promise<MlPageResponse<Recommendation>> {
    const { data } = await mlApi.get("/api/v1/ml/recommendations", { params })
    return data
  },
  async refreshRecommendations(): Promise<{ jobId: string; status: string }> {
    const { data } = await mlApi.post("/api/v1/ml/recommendations/refresh")
    return data
  },
  async getSummary(): Promise<RecommendationSummary> {
    const { data } = await mlApi.get("/api/v1/ml/recommendations/summary")
    return data
  },
  async getHealth() {
    const { data } = await mlApi.get("/api/v1/ml/health")
    return data
  },
}
