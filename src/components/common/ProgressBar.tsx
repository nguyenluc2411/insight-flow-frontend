import { cn } from "@/lib/utils"

interface Props {
  value: number
  max?: number
  color?: string
  label?: string
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, max = 100, color, label, showLabel = false, className }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn("w-full", className)}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>}
          {showLabel && (
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color ?? "bg-primary"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
