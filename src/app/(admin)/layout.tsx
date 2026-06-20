"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/Logo"

const ADMIN_ROLE = "SUPER_ADMIN"

const NAV = [
  { label: "Tổng quan", href: "/admin", icon: "monitoring" },
  { label: "Khách hàng", href: "/admin/tenants", icon: "groups" },
  { label: "Gói & Giá", href: "/admin/plans", icon: "sell" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const isAdmin = !!user?.roles?.includes(ADMIN_ROLE)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }
    // Authenticated but not a platform admin → bounce to the normal app.
    if (user && !isAdmin) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, user, isAdmin, router])

  function handleLogout() {
    logout()
    router.replace("/login")
  }

  if (!isAuthenticated || !user || !isAdmin) return null

  return (
    <div className="min-h-screen bg-bg-base dark:bg-bg-dark">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen sticky top-0">
          <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Logo />
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Admin
            </span>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                    active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                {user.fullName || "Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Về ứng dụng
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Mobile top nav */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium whitespace-nowrap px-2 py-1 rounded",
                  pathname === item.href
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-slate-500 dark:text-slate-400"
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="ml-auto shrink-0 flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400 px-2 py-1"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Đăng xuất
            </button>
          </div>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
