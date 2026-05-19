import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Tenant, AuthResponse } from "@/types/auth.types"
import api from "@/lib/axios"

interface AuthState {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  refreshTokenValue: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (tenantSlug: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  setAuth: (data: AuthResponse) => void
  setUser: (user: User) => void
  updateTenantSettings: (settings: Record<string, unknown>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      accessToken: null,
      refreshTokenValue: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (data: AuthResponse) => {
        // Build tenant from response or from user fields when login doesn't return tenant
        const tenant: Tenant = data.tenant ?? {
          id: data.user.tenantId,
          name: data.user.tenantSlug,
          slug: data.user.tenantSlug,
          plan: "trial",
        }
        set({
          user: data.user,
          tenant,
          accessToken: data.accessToken,
          refreshTokenValue: data.refreshToken,
          isAuthenticated: true,
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      login: async (tenantSlug, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post<AuthResponse>("/api/v1/auth/login", {
            tenantSlug, email, password,
          })
          get().setAuth(data)
          // Fetch full user profile (includes profileComplete) after auth token is set
          const { data: fullUser } = await api.get<User>("/api/v1/auth/me")
          set({ user: fullUser })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, tenant: null, accessToken: null, refreshTokenValue: null, isAuthenticated: false })
      },

      refreshToken: async () => {
        const currentRefreshToken = useAuthStore.getState().refreshTokenValue
        const { data } = await api.post<AuthResponse>("/api/v1/auth/refresh", {
          refreshToken: currentRefreshToken,
        })
        set({ accessToken: data.accessToken, refreshTokenValue: data.refreshToken ?? currentRefreshToken })
      },

      updateTenantSettings: (settings) => {
        set((state) => ({
          tenant: state.tenant
            ? { ...state.tenant, settings: { ...state.tenant.settings, ...settings } }
            : null,
        }))
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        accessToken: state.accessToken,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
