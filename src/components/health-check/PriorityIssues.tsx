import { cn } from "@/lib/utils"

interface PriorityIssue {
  icon: string
  title: string
  description: string
  severity: "NGHIÊM TRỌNG" | "CHIẾN LƯỢC" | "QUAN TRỌNG"
}

interface Props {
  issues: PriorityIssue[]
}

const severityColor: Record<string, string> = {
  "NGHIÊM TRỌNG": "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
  "CHIẾN LƯỢC": "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900",
  "QUAN TRỌNG": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
}

export function PriorityIssues({ issues }: Props) {
  return (
    <div className="space-y-3">
      {issues.map((issue, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-[18px]">
              {issue.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{issue.title}</p>
              <span
                className={cn(
                  "shrink-0 px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider",
                  severityColor[issue.severity]
                )}
              >
                {issue.severity}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{issue.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
