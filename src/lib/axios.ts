import axios from "axios"
import { useAuthStore } from "@/stores/auth.store"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await useAuthStore.getState().refreshToken()
        const token = useAuthStore.getState().accessToken
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export const mlApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ML_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
})

mlApi.interceptors.request.use((config) => {
  const { accessToken, tenant } = useAuthStore.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  if (tenant?.id) config.headers["X-Tenant-Id"] = tenant.id
  return config
})

export default api
