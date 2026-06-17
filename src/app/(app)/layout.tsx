"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAxiosError } from "axios"
import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/services/auth.service"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/Header"
import { ROUTES } from "@/lib/constants"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, setUser, logout } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()

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
      .catch((err) => {
        // Only a genuine 401 means the session is invalid → sign out.
        // Network/5xx errors must NOT silently bounce the user back to login
        // (that hid a backend outage behind a clean console before).
        if (isAxiosError(err) && err.response?.status === 401) {
          logout()
          router.push(ROUTES.LOGIN)
          return
        }
        console.error("Failed to load current user:", err)
        toast({
          title: "Không tải được phiên đăng nhập",
          description: "Máy chủ tạm thời không phản hồi. Vui lòng thử lại.",
          variant: "destructive",
        })
      })
  }, [isAuthenticated, accessToken, setUser, logout, router, toast])

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
