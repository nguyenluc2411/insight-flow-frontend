"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { NAV_ITEMS, APP_NAME, ROUTES } from "@/lib/constants"

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState<"VI" | "EN">("VI")

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-[10px] border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <span className="text-white text-sm font-black">F</span>
            </div>
            <span className="gradient-text font-black text-lg tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-primary border-b-2 border-primary bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400"
                      : "text-slate-600 hover:text-primary hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Lang Toggle */}
            <button
              onClick={() => setLang((l) => (l === "VI" ? "EN" : "VI"))}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">language</span>
              {lang}
            </button>

            {/* Avatar */}
            <button className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 text-slate-600 dark:text-slate-400"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-primary bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400"
                      : "text-slate-600 hover:text-primary hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
