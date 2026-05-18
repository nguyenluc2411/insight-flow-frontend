import { cn } from "@/lib/utils"

interface Props {
  value: number
  unit?: string
}

export function TrendIndicator({ value, unit = "%" }: Props) {
  const isPositive = value > 0
  const isNeutral = value === 0

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-bold",
        isNeutral
          ? "text-slate-500 dark:text-slate-400"
          : isPositive
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
      )}
    >
      <span className="material-symbols-outlined text-[16px]">
        {isNeutral ? "remove" : isPositive ? "arrow_upward" : "arrow_downward"}
      </span>
      {isPositive && "+"}
      {value}
      {unit}
    </span>
  )
}
