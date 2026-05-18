import { cn } from "@/lib/utils"

interface Props {
  label: string
  value: string | number
  subtitle?: string
  trend?: string
  trendType?: "up" | "down" | "neutral"
  className?: string
}

export function KPICard({ label, value, subtitle, trend, trendType = "neutral", className }: Props) {
  const trendColor = {
    up: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
    down: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  }[trendType]

  const trendIcon = {
    up: "arrow_upward",
    down: "arrow_downward",
    neutral: "remove",
  }[trendType]

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl p-6 shadow-soft border border-slate-100 dark:border-slate-800",
        className
      )}
    >
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      )}
      {trend && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 mt-2 px-2 py-0.5 rounded-full text-[11px] font-bold",
            trendColor
          )}
        >
          <span className="material-symbols-outlined text-[13px]">{trendIcon}</span>
          {trend}
        </span>
      )}
    </div>
  )
}
