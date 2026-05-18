import { cn } from "@/lib/utils"

interface Props {
  title: string
  items: string[]
  variant?: "purple" | "dark"
}

export function AIInsightBox({ title, items, variant = "purple" }: Props) {
  const isPurple = variant === "purple"

  return (
    <div
      className={cn(
        "rounded-xl p-5",
        isPurple
          ? "bg-indigo-50 dark:bg-indigo-950 border-l-4 border-indigo-500"
          : "bg-indigo-900 dark:bg-indigo-950 text-white"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "material-symbols-outlined text-[18px]",
            isPurple ? "text-indigo-600 dark:text-indigo-400" : "text-indigo-300"
          )}
        >
          auto_awesome
        </span>
        <p
          className={cn(
            "text-sm font-bold",
            isPurple ? "text-indigo-800 dark:text-indigo-300" : "text-white"
          )}
        >
          {title}
        </p>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className={cn(
                "material-symbols-outlined text-[14px] mt-0.5 shrink-0",
                isPurple ? "text-indigo-500 dark:text-indigo-400" : "text-indigo-300"
              )}
            >
              chevron_right
            </span>
            <span
              className={cn(
                "text-xs leading-relaxed",
                isPurple ? "text-indigo-700 dark:text-indigo-300" : "text-indigo-100"
              )}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
