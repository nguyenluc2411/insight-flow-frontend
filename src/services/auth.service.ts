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
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post("/api/v1/auth/refresh", { refreshToken })
    return data
  },
  async logout(refreshToken: string): Promise<void> {
    await api.post("/api/v1/auth/logout", { refreshToken })
  },
  async me(): Promise<User> {
    const { data } = await api.get("/api/v1/auth/me")
    return data
  },
  // Returns full UserInfo with settings after update
  async updateProfile(settings: TenantSettings): Promise<User> {
    const { data } = await api.put("/api/v1/auth/me", settings)
    return data
  },
  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post("/api/v1/auth/forgot-password", { email })
    return data
  },
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await api.post("/api/v1/auth/reset-password", { token, newPassword })
    return data
  },
}
