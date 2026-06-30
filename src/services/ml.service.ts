import api from "@/lib/axios"
import type {
  ForecastResponse,
  ForecastSeriesResponse,
  Recommendation,
  PagedRecommendationResponse,
  RefreshJobResponse,
} from "@/types/ml.types"

export const mlService = {
  async getForecast(variantId: string, days = 30): Promise<ForecastResponse> {
    const { data } = await api.get(`/api/v1/ml/forecast/${variantId}`, { params: { days } })
    return data
  },

  /** Forecast + actual history + measured accuracy, for the chart view. */
  async getForecastSeries(
    variantId: string,
    days = 30,
    historyDays = 90,
    sku?: string,
  ): Promise<ForecastSeriesResponse> {
    const { data } = await api.get(`/api/v1/ml/forecast/${variantId}/series`, {
      params: { days, historyDays, ...(sku ? { sku } : {}) },
    })
    return data
  },

  async getForecastBatch(variantIds: string[], days = 30): Promise<ForecastResponse[]> {
    const { data } = await api.post("/api/v1/ml/forecast/batch", { variantIds, days })
    return data
  },

  async getRecommendations(params?: {
    action?: "CLEARANCE" | "RESTOCK" | "PROMOTE" | "OK"
    priority?: "HIGH" | "MEDIUM" | "LOW"
    page?: number
    size?: number
  }): Promise<PagedRecommendationResponse> {
    const { data } = await api.get("/api/v1/ml/recommendations", { params })
    return data
  },

  async refreshRecommendations(): Promise<RefreshJobResponse> {
    const { data } = await api.post("/api/v1/ml/recommendations/refresh")
    return data
  },
}

export type { Recommendation, ForecastResponse, ForecastSeriesResponse, PagedRecommendationResponse }
