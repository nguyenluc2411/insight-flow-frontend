import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Tenant, AuthResponse } from "@/types/auth.types"
import api from "@/lib/axios"
import { clearEntitlementsCache } from "@/hooks/use-entitlements"

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

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
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
        setCookie("access_token", data.accessToken)
        if (data.user.profileComplete) {
          setCookie("profile_complete", "true", 365)
        }
      },

      setUser: (user: User) => {
        set({ user })
        if (user.profileComplete) {
          setCookie("profile_complete", "true", 365)
        } else {
          clearCookie("profile_complete")
        }
      },

      login: async (tenantSlug, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post<AuthResponse>("/api/v1/auth/login", {
            tenantSlug, email, password,
          })
          get().setAuth(data)
          // Best-effort: fetch profileComplete to set cookie; failure is non-fatal
          try {
            const { data: fullUser } = await api.get<User>("/api/v1/auth/me")
            get().setUser(fullUser)
          } catch {
            // AppLayout will call me() again and handle routing
          }
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        const currentRefresh = useAuthStore.getState().refreshTokenValue
        if (currentRefresh) {
          api.post("/api/v1/auth/logout", { refreshToken: currentRefresh }).catch(() => {})
        }
        set({ user: null, tenant: null, accessToken: null, refreshTokenValue: null, isAuthenticated: false })
        clearEntitlementsCache()
        clearCookie("access_token")
        clearCookie("profile_complete")
      },

      refreshToken: async () => {
        const currentRefreshToken = useAuthStore.getState().refreshTokenValue
        const { data } = await api.post<AuthResponse>("/api/v1/auth/refresh", {
          refreshToken: currentRefreshToken,
        })
        set({ accessToken: data.accessToken, refreshTokenValue: data.refreshToken ?? currentRefreshToken })
        setCookie("access_token", data.accessToken)
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
