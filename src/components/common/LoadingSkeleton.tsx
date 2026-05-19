interface Props {
  rows?: number
  type?: "card" | "table" | "kpi"
}

export function LoadingSkeleton({ rows = 3, type = "card" }: Props) {
  if (type === "kpi") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 animate-pulse">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (type === "table") {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded mb-2" />
          <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  )
}
