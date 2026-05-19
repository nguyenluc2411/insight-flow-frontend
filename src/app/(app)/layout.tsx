"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/services/auth.service"
import { Header } from "@/components/layout/Header"
import { ROUTES } from "@/lib/constants"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, setUser, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      router.push(ROUTES.LOGIN)
      return
    }
    authService.me()
      .then((updatedUser) => {
        setUser(updatedUser)
        if (!updatedUser.profileComplete) {
          router.push(ROUTES.ONBOARDING)
        }
      })
      .catch(() => {
        logout()
        router.push(ROUTES.LOGIN)
      })
  }, [isAuthenticated, accessToken, setUser, logout, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-bg-base dark:bg-bg-dark">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
