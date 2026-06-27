"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/Logo"

const ADMIN_ROLE = "SUPER_ADMIN"

type NavLeaf = { label: string; href: string; icon?: string }
type NavGroup = { label: string; icon: string; children: NavLeaf[] }
type NavItem = NavLeaf | NavGroup

const NAV: NavItem[] = [
  { label: "Tổng quan", href: "/admin", icon: "monitoring" },
  { label: "Phân tích Phễu", href: "/admin/analytics", icon: "filter_alt" },
  { label: "Tin tức", href: "/admin/news", icon: "newspaper" },
  { label: "Khách hàng", href: "/admin/tenants", icon: "groups" },
  {
    label: "Giao dịch",
    icon: "receipt_long",
    children: [
      { label: "Đã trả tiền thành công", href: "/admin/transactions/paid" },
      { label: "Hoàn tiền", href: "/admin/transactions/refunds" },
      { label: "Đã hoàn tiền", href: "/admin/transactions/refunded" },
      { label: "Giao dịch rác", href: "/admin/transactions/junk" },
    ],
  },
  { label: "Gói & Giá", href: "/admin/plans", icon: "sell" },
]

// Flattened leaf links for the compact mobile top-nav.
const MOBILE_LINKS: NavLeaf[] = NAV.flatMap((i) => ("children" in i ? i.children : [i]))

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
            {NAV.map((item) =>
              "children" in item ? (
                <NavGroupItem key={item.label} item={item} pathname={pathname} />
              ) : (
                <NavLink key={item.href} item={item} active={pathname === item.href} />
              )
            )}
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
            {MOBILE_LINKS.map((item) => (
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

/** A single sidebar link. */
function NavLink({ item, active }: { item: NavLeaf; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
        active
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
      )}
    >
      {item.icon && <span className="material-symbols-outlined text-[20px]">{item.icon}</span>}
      {item.label}
    </Link>
  )
}

/** A collapsible sidebar group that expands to its child links. */
function NavGroupItem({ item, pathname }: { item: NavGroup; pathname: string }) {
  const anyActive = item.children.some((c) => pathname === c.href)
  const [open, setOpen] = useState(anyActive)

  // Auto-expand when navigating into one of its children.
  useEffect(() => {
    if (anyActive) setOpen(true)
  }, [anyActive])

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
          anyActive
            ? "text-indigo-700 dark:text-indigo-300"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        )}
      >
        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        {item.label}
        <span
          className={cn(
            "material-symbols-outlined text-[20px] ml-auto transition-transform",
            open && "rotate-180"
          )}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="mt-1 ml-3 pl-3 border-l border-slate-200 dark:border-slate-700 space-y-1">
          {item.children.map((c) => {
            const active = pathname === c.href
            return (
              <Link
                key={c.href}
                href={c.href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium transition",
                  active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {c.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
