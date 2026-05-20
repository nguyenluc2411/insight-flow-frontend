"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/services/auth.service"
import { ROUTES } from "@/lib/constants"
import type { TenantSettings } from "@/types/auth.types"

export function useAuth() {
  const router = useRouter()
  const store = useAuthStore()

  async function login(tenantSlug: string, email: string, password: string) {
    await store.login(tenantSlug, email, password)
    const user = useAuthStore.getState().user
    if (user?.profileComplete) {
      router.push(ROUTES.DASHBOARD)
    } else {
      router.push(ROUTES.ONBOARDING)
    }
  }

  async function logout() {
    store.logout()
    router.push(ROUTES.LOGIN)
  }

  async function updateProfile(settings: TenantSettings) {
    const updatedUser = await authService.updateProfile(settings)
    store.setUser(updatedUser)
    return updatedUser
  }

  return {
    user: store.user,
    tenant: store.tenant,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login,
    logout,
    updateProfile,
  }
}
