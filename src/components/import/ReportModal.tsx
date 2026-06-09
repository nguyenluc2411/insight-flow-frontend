"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ErrorState } from "@/components/common/ErrorState"
import { useWorkspaceAdvice } from "@/hooks/useWorkspaces"
import type {
  InventoryStrategyItem,
  StrategyPriority,
  TrendForecastItem,
} from "@/types/workspace.types"

const PRIORITY_BADGE: Record<StrategyPriority, { label: string; className: string }> = {
  HIGH: {
    label: "Ưu tiên cao",
    className: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
  },
  MEDIUM: {
    label: "Ưu tiên vừa",
    className: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  },
  LOW: {
    label: "Ưu tiên thấp",
    className: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  },
}

interface Props {
  workspaceId: string | null
  open: boolean
  onClose: () => void
}

export function ReportModal({ workspaceId, open, onClose }: Props) {
  const { data, isError, refetch } = useWorkspaceAdvice(workspaceId, open)

  const status = data?.status
  const isPolling = !data || status === "PENDING" || status === "PROCESSING"
  const inventory = data?.result?.inventory_strategy ?? []
  const trends = data?.result?.trend_forecasting ?? []

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            Báo cáo phân tích AI
          </DialogTitle>
        </DialogHeader>

        {isError ? (
          <ErrorState message="Không tải được báo cáo. Vui lòng thử lại." onRetry={() => refetch()} />
        ) : status === "ERROR" ? (
          <div className="py-10 text-center">
            <span className="material-symbols-outlined text-5xl text-red-400 mb-3">report</span>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Phân tích thất bại</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto break-words">
              {data?.error_log || "AI không thể xử lý dữ liệu này."}
            </p>
          </div>
        ) : isPolling ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4">
              progress_activity
            </span>
            <p className="font-semibold text-slate-700 dark:text-slate-300">AI đang phân tích dữ liệu…</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Quá trình này có thể mất vài phút. Cửa sổ sẽ tự cập nhật khi hoàn tất.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <InventorySection items={inventory} />
            <TrendSection items={trends} />
            <SummarySection inventoryCount={inventory.length} trendCount={trends.length} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SectionTitle({ icon, color, children }: { icon: string; color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`material-symbols-outlined text-[20px] ${color}`}>{icon}</span>
      <h3 className="font-bold text-slate-900 dark:text-slate-100">{children}</h3>
    </div>
  )
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-500 dark:text-slate-400 italic">{children}</p>
}

function InventorySection({ items }: { items: InventoryStrategyItem[] }) {
  return (
    <section>
      <SectionTitle icon="inventory_2" color="text-amber-500">
        Chiến lược tồn kho
      </SectionTitle>
      {items.length === 0 ? (
        <EmptyHint>Không có khuyến nghị xử lý tồn kho.</EmptyHint>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {it.item_id_or_category || "Danh mục chung"}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {it.priority && PRIORITY_BADGE[it.priority] && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${PRIORITY_BADGE[it.priority].className}`}
                    >
                      {PRIORITY_BADGE[it.priority].label}
                    </span>
                  )}
                  {it.action && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {it.action}
                    </span>
                  )}
                </div>
              </div>
              {it.issue && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vấn đề: {it.issue}</p>
              )}
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {typeof it.discount_percentage_recommendation === "number" &&
                  it.discount_percentage_recommendation > 0 && (
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                      Giảm giá đề xuất: {it.discount_percentage_recommendation}%
                    </span>
                  )}
                {typeof it.suggested_restock_quantity === "number" &&
                  it.suggested_restock_quantity > 0 && (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      Đề xuất nhập thêm: ~{it.suggested_restock_quantity}
                    </span>
                  )}
                {it.target_channel && (
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Kênh: {it.target_channel}
                  </span>
                )}
              </div>
              {it.reasoning && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {it.reasoning}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function TrendSection({ items }: { items: TrendForecastItem[] }) {
  return (
    <section>
      <SectionTitle icon="trending_up" color="text-indigo-500">
        Dự báo xu hướng
      </SectionTitle>
      {items.length === 0 ? (
        <EmptyHint>Không có dự báo xu hướng.</EmptyHint>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900"
            >
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {it.suggested_item || "Mặt hàng gợi ý"}
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {typeof it.estimated_import_quantity === "number" && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Nhập ~{it.estimated_import_quantity}
                  </span>
                )}
                {it.expected_retail_price_range && (
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Giá: {it.expected_retail_price_range}
                  </span>
                )}
              </div>
              {it.relevance_to_current_inventory && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Liên quan tồn kho: {it.relevance_to_current_inventory}
                </p>
              )}
              {it.trend_evidence && (
                <p className="mt-2 inline-flex items-start gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                  <span className="material-symbols-outlined text-[14px] leading-4">trending_up</span>
                  <span>{it.trend_evidence}</span>
                </p>
              )}
              {it.market_trend_reasoning && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {it.market_trend_reasoning}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function SummarySection({ inventoryCount, trendCount }: { inventoryCount: number; trendCount: number }) {
  return (
    <section className="rounded-xl bg-brand-gradient p-5 text-white">
      <SectionTitle icon="recommend" color="text-white">
        <span className="text-white">Tổng kết khuyến nghị</span>
      </SectionTitle>
      <p className="text-sm text-white/90 leading-relaxed">
        AI đã phân tích và đưa ra <strong>{inventoryCount}</strong> khuyến nghị xử lý tồn kho và{" "}
        <strong>{trendCount}</strong> gợi ý xu hướng nhập hàng. Hãy ưu tiên các mặt hàng tồn kho cao
        để tối ưu dòng vốn trước.
      </p>
    </section>
  )
}
