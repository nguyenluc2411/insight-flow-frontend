import api from "@/lib/axios"
import type { AuthResponse, LoginRequest, RegisterRequest, TenantSettings, User } from "@/types/auth.types"

export const authService = {
  async login(req: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post("/api/v1/auth/login", req)
    return data
  },
  async register(req: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post("/api/v1/auth/register-tenant", req)
    return data
  },
  async refresh(): Promise<AuthResponse> {
    const { data } = await api.post("/api/v1/auth/refresh")
    return data
  },
  async logout(): Promise<void> {
    await api.post("/api/v1/auth/logout")
  },
  async me(): Promise<User> {
    const { data } = await api.get("/api/v1/auth/me")
    return data
  },
  async updateProfile(settings: TenantSettings): Promise<void> {
    await api.put("/api/v1/auth/me", settings)
  },
}
