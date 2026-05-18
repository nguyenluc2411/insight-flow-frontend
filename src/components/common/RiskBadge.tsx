import { cn } from "@/lib/utils"

type RiskLevel = "HIGH" | "MEDIUM" | "LOW" | "STRATEGIC"

interface Props {
  level: RiskLevel
}

const config: Record<RiskLevel, { classes: string; label: string }> = {
  HIGH: {
    classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
    label: "Rủi ro cao",
  },
  MEDIUM: {
    classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    label: "Rủi ro trung bình",
  },
  LOW: {
    classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
    label: "Ổn định",
  },
  STRATEGIC: {
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900",
    label: "Chiến lược",
  },
}

export function RiskBadge({ level }: Props) {
  const { classes, label } = config[level]
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded border uppercase tracking-wider",
        classes
      )}
    >
      {label}
    </span>
  )
}
