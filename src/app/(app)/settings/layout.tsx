"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"

const SETTINGS_TABS = [
  { href: ROUTES.SETTINGS_PROFILE, label: "Thông tin cá nhân", icon: "person" },
  { href: ROUTES.SETTINGS_INTEGRATIONS, label: "Kết nối & Tích hợp", icon: "cable" },
  { href: ROUTES.SETTINGS_BILLING, label: "Gói dịch vụ", icon: "credit_card" },
  { href: ROUTES.SETTINGS_TRANSACTIONS, label: "Lịch sử giao dịch", icon: "receipt_long" },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div>
      <nav className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
        {SETTINGS_TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + "/")
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-primary hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </nav>
      {children}
    </div>
  )
}
