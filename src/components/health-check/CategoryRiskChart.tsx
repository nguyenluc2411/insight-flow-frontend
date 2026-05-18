"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CategoryData {
  name: string
  value: number
  total: number
}

interface Props {
  categories: CategoryData[]
}

export function CategoryRiskChart({ categories }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const max = Math.max(...categories.map((c) => c.value))

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const pct = (cat.value / max) * 100
        return (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {cat.value.toLocaleString("vi-VN")} đv
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-primary rounded-full transition-all duration-700",
                  mounted ? "" : "w-0"
                )}
                style={{ width: mounted ? `${pct}%` : "0%" }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
