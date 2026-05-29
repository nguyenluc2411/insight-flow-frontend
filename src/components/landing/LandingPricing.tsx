"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { billingService } from "@/services/billing.service"
import type { Package } from "@/types/billing.types"
import { FEATURE_META, ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

function formatVnd(price: number): string {
  if (price === 0) return "Miễn phí"
  return new Intl.NumberFormat("vi-VN").format(price) + "đ"
}

function monthlyPrice(pkg: Package): number {
  const m = pkg.plans.find((p) => p.billingCycle === "MONTHLY") ?? pkg.plans[0]
  return m?.priceVnd ?? 0
}

export function LandingPricing() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    billingService
      .getPackages()
      .then((pkgs) =>
        setPackages(
          pkgs
            .filter((p) => ["BASIC", "ADVANCED", "PRO"].includes(p.code))
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        )
      )
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="pricing" className="py-20 px-4 bg-white dark:bg-slate-950 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-primary text-xs font-bold mb-3">
            <span className="material-symbols-outlined text-[14px]">sell</span>
            Bảng giá
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            Chọn gói phù hợp với shop của bạn
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Bắt đầu với <span className="font-semibold text-primary">30 ngày dùng thử miễn phí</span> đầy đủ tính năng —
            không cần thẻ thanh toán. Nâng cấp bất cứ lúc nào.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
          </div>
        ) : packages.length === 0 ? (
          <p className="text-center text-slate-400">Không tải được bảng giá. Vui lòng thử lại sau.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg) => {
              const highlight = pkg.code === "ADVANCED"
              const price = monthlyPrice(pkg)
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "relative bg-white dark:bg-slate-900 rounded-2xl border-2 p-6 flex flex-col transition-all",
                    highlight
                      ? "border-primary shadow-soft md:-translate-y-2"
                      : "border-slate-100 dark:border-slate-800"
                  )}
                >
                  {highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-gradient text-white text-xs font-bold px-3 py-1 rounded-full">
                        Phổ biến nhất
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{pkg.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{formatVnd(price)}</span>
                      {price > 0 && <span className="text-sm text-slate-500 dark:text-slate-400">/ tháng</span>}
                    </div>
                    {pkg.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{pkg.description}</p>
                    )}
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {pkg.featureCodes.map((code) => (
                      <li key={code} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[16px] text-green-500 mt-0.5 shrink-0">check</span>
                        {FEATURE_META[code]?.label ?? code}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={ROUTES.REGISTER}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-bold text-center transition",
                      highlight
                        ? "bg-brand-gradient text-white hover:opacity-90"
                        : "border-2 border-primary text-primary hover:bg-primary/5"
                    )}
                  >
                    Dùng thử miễn phí
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
