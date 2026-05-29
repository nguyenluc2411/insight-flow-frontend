"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { FEATURE_META, ROUTES } from "@/lib/constants"

/**
 * Locked-feature panel shown when the tenant's plan doesn't include a feature.
 * Keeps the feature discoverable: title + description + optional preview, and an
 * upgrade CTA pointing at the billing page.
 */
export function LockedFeature({
  featureCode,
  preview,
}: {
  featureCode: string
  preview?: ReactNode
}) {
  const meta = FEATURE_META[featureCode] ?? {
    label: "Tính năng nâng cao",
    description: "Tính năng này thuộc gói cao hơn.",
    unlockPlan: "Advanced",
  }

  return (
    <div className="max-w-3xl mx-auto">
      {preview && (
        <div className="relative mb-6 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="pointer-events-none blur-sm opacity-60 select-none">{preview}</div>
          <div className="absolute inset-0 bg-white/30 dark:bg-slate-950/40" />
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{meta.label}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {meta.description}
        </p>

        <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
          Có trong gói {meta.unlockPlan}
        </div>

        <div className="mt-6">
          <Link
            href={ROUTES.SETTINGS_BILLING}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gradient text-white font-bold text-sm hover:opacity-90 transition"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            Nâng cấp để mở khóa
          </Link>
        </div>
      </div>
    </div>
  )
}
