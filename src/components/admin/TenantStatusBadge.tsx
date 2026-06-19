import { cn } from "@/lib/utils"

const STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  trial: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  suspended: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
}

const LABELS: Record<string, string> = {
  active: "Hoạt động",
  trial: "Dùng thử",
  suspended: "Tạm ngưng",
  cancelled: "Đã huỷ",
}

/** Colored pill for a tenant status string (active/trial/suspended/…). */
export function TenantStatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status?.toLowerCase()
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        STYLES[key] ?? STYLES.cancelled,
        className
      )}
    >
      {LABELS[key] ?? status}
    </span>
  )
}
