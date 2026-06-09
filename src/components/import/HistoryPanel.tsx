"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useWorkspaceHistory } from "@/hooks/useWorkspaces"
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton"
import { ErrorState } from "@/components/common/ErrorState"
import type { WorkspaceStatus } from "@/types/workspace.types"

interface Props {
  /** Called when a COMPLETED item is clicked — opens the report modal. */
  onOpenReport: (workspaceId: string) => void
  /** Currently opened workspace, for active highlighting. */
  activeId?: string | null
}

const STATUS_META: Record<WorkspaceStatus, { label: string; classes: string; icon: string }> = {
  INIT: {
    label: "Khởi tạo",
    classes: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
    icon: "schedule",
  },
  PROCESSING: {
    label: "Đang xử lý",
    classes: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950",
    icon: "autorenew",
  },
  COMPLETED: {
    label: "Hoàn tất",
    classes: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
    icon: "check_circle",
  },
  FAILED: {
    label: "Thất bại",
    classes: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950",
    icon: "error",
  },
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function HistoryPanel({ onOpenReport, activeId }: Props) {
  const { data, isLoading, isError, refetch } = useWorkspaceHistory()
  const [search, setSearch] = useState("")

  const items = useMemo(() => {
    const list = data ?? []
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.created_at ?? "").toLowerCase().includes(q)
    )
  }, [data, search])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-[20px]">history</span>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Lịch sử phân tích</p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc ngày..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <LoadingSkeleton rows={4} type="card" />
        ) : isError ? (
          <ErrorState message="Không tải được lịch sử phân tích." onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">
              folder_open
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search ? "Không tìm thấy phiên phù hợp" : "Chưa có phiên phân tích nào"}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((w) => {
              const meta = STATUS_META[w.status] ?? STATUS_META.INIT
              const clickable = w.status === "COMPLETED"
              const isActive = activeId === w.id
              return (
                <li key={w.id}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={clickable ? () => onOpenReport(w.id) : undefined}
                    className={cn(
                      "w-full text-left rounded-lg border p-3 transition",
                      clickable
                        ? "cursor-pointer border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800"
                        : "cursor-default border-slate-100 dark:border-slate-800 opacity-80",
                      isActive && "border-primary ring-1 ring-primary/40 bg-indigo-50 dark:bg-indigo-950"
                    )}
                  >
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {w.name}
                    </p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {formatDate(w.created_at)}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                          meta.classes
                        )}
                      >
                        <span className="material-symbols-outlined text-[12px]">{meta.icon}</span>
                        {meta.label}
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
