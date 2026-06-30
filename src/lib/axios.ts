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
    const isAuthEndpoint = /\/auth\/(login|logout|register-tenant|refresh|forgot-password|reset-password)/.test(original?.url ?? "")
    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true
      try {
        await useAuthStore.getState().refreshToken()
        const token = useAuthStore.getState().accessToken
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
        if (typeof window !== "undefined") {
          const path = window.location.pathname
          const isPublicPage = path === "/" || path === "/login" || path === "/register" || path.startsWith("/news")
          if (!isPublicPage) {
            window.location.href = "/login"
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
