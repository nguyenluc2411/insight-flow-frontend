import { cn } from "@/lib/utils"

interface Props {
  value: number
}

export function ConfidenceBadge({ value }: Props) {
  const classes =
    value >= 80
      ? "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-900"
      : value >= 60
        ? "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-900"
        : "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-900"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded border",
        classes
      )}
    >
      <span className="material-symbols-outlined text-[12px]">verified</span>
      {value}%
    </span>
  )
}
