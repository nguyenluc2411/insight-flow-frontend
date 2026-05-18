import { cn } from "@/lib/utils"

type Status = "complete" | "ready" | "processing"

interface Props {
  status: Status
}

const config: Record<Status, { classes: string; label: string; icon: string }> = {
  complete: {
    classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
    label: "Phân tích hoàn tất",
    icon: "check_circle",
  },
  ready: {
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900",
    label: "Sẵn sàng cho khuyến nghị",
    icon: "recommend",
  },
  processing: {
    classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    label: "Đang xử lý...",
    icon: "autorenew",
  },
}

export function StatusBadge({ status }: Props) {
  const { classes, label, icon } = config[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border uppercase tracking-wider",
        classes
      )}
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </span>
  )
}
