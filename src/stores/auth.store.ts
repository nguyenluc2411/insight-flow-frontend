import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Tenant, AuthResponse } from "@/types/auth.types"
import api from "@/lib/axios"

interface AuthState {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (tenantSlug: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  setAuth: (data: AuthResponse) => void
  updateTenantSettings: (settings: Record<string, unknown>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (data: AuthResponse) => {
        set({
          user: data.user,
          tenant: data.tenant,
          accessToken: data.accessToken,
          isAuthenticated: true,
        })
      },

      login: async (tenantSlug, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post<AuthResponse>("/api/v1/auth/login", {
            tenantSlug, email, password,
          })
          get().setAuth(data)
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, tenant: null, accessToken: null, isAuthenticated: false })
      },

      refreshToken: async () => {
        const { data } = await api.post<AuthResponse>("/api/v1/auth/refresh")
        set({ accessToken: data.accessToken })
      },

      updateTenantSettings: (settings) => {
        set((state) => ({
          tenant: state.tenant
            ? { ...state.tenant, settings: { ...state.tenant.settings, ...settings } }
            : null,
        }))
      },
    }),
    { name: "auth-storage", partialize: (state) => ({ tenant: state.tenant, user: state.user }) }
  )
)
