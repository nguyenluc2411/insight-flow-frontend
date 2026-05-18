import { cn } from "@/lib/utils"

const STEPS = [
  { label: "Tải Dữ liệu", icon: "cloud_upload", desc: "CSV, XLSX, JSON" },
  { label: "AI Chuẩn hóa", icon: "auto_awesome", desc: "Làm sạch & phân loại" },
  { label: "Tạo Thông tin", icon: "insights", desc: "Báo cáo & dự báo" },
]

interface Props {
  activeStep?: number
}

export function WorkflowSteps({ activeStep = 1 }: Props) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const stepNum = i + 1
        const isActive = stepNum === activeStep
        const isDone = stepNum < activeStep

        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                  isDone
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-brand-gradient text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-700"
                )}
              >
                {isDone ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isActive
                      ? "text-primary"
                      : isDone
                        ? "text-green-600 dark:text-green-400"
                        : "text-slate-400 dark:text-slate-500"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 mb-7 mx-1",
                  isDone ? "bg-green-400" : "bg-slate-200 dark:bg-slate-700"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
