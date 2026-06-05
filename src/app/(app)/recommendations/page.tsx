"use client"

import { KPICard } from "@/components/common/KPICard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { RiskBadge } from "@/components/common/RiskBadge"
import { ConfidenceBadge } from "@/components/common/ConfidenceBadge"
import { AIInsightBox } from "@/components/common/AIInsightBox"
import { ProgressBar } from "@/components/common/ProgressBar"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { useRecommendations, useRecommendationsSummary, useRefreshRecommendations } from "@/hooks/useRecommendations"
import { ACTION_LABELS } from "@/lib/constants"
import { FeatureGate } from "@/components/feature/FeatureGate"
import { useToast } from "@/hooks/use-toast"
import { getForecastPeriod } from "@/lib/utils"
import type { TopAction } from "@/types/bff.types"
import { useQuery } from "@tanstack/react-query"
import { catalogService } from "@/services/catalog.service"
import { useAuthStore } from "@/stores/auth.store"

// Action type → icon mapping
const ACTION_ICONS: Record<string, string> = {
  CLEARANCE: "sell",
  RESTOCK: "local_shipping",
  PROMOTE: "campaign",
  OK: "check_circle",
}

// Priority → badge color
const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  LOW: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900",
}

const PRIORITY_LABEL: Record<string, string> = {
  HIGH: "ƯU TIÊN CAO",
  MEDIUM: "ƯU TIÊN VỪA",
  LOW: "CHIẾN LƯỢC",
}

const CONFIDENCE_FROM_PRIORITY: Record<string, number> = { HIGH: 90, MEDIUM: 75, LOW: 60 }

const AI_LOGIC_RULES = [
  "Ưu tiên hành động nếu tỷ lệ bán ra <30% và tuổi tồn kho >45 ngày",
  "Chuyển kho nếu khu vực hiện tại có nhu cầu thấp hơn khu vực khác >20%",
  "Giảm giá 10-15% nếu còn >60 ngày đến cuối mùa và tỷ lệ bán ra <40%",
  "Đề xuất nhập thêm nếu tỷ lệ bán ra >75% và nguy cơ hết hàng >60%",
]

// Prefer the SKU (e.g. ATB-001-M-WHITE) over the raw variant UUID for readability.
function variantLabel(variantId: string, skuMap: Map<string, string>): string {
  return skuMap.get(variantId) ?? `Mã hàng ${variantId.slice(-6)}`
}

function buildTopActionCard(item: TopAction, skuMap: Map<string, string>) {
  const impact = item.action === "CLEARANCE" && item.suggestedDiscountPct
    ? `Đề xuất giảm ${item.suggestedDiscountPct}% — thoát ${item.currentStock ?? "?"} sản phẩm tồn`
    : item.action === "RESTOCK" && item.suggestedRestockQty
    ? `Nhập thêm ${item.suggestedRestockQty} sản phẩm để tránh hết hàng`
    : item.reason ?? "Xem chi tiết tại bảng đề xuất"

  return {
    priority: PRIORITY_LABEL[item.priority] ?? item.priority,
    priorityColor: PRIORITY_COLOR[item.priority] ?? PRIORITY_COLOR.LOW,
    icon: ACTION_ICONS[item.action] ?? "recommend",
    title: `${ACTION_LABELS[item.action] ?? item.action} — ${variantLabel(item.variantId, skuMap)}`,
    description: item.reason ?? "Phân tích dựa trên dữ liệu bán hàng và tồn kho hiện tại",
    impact,
    confidence: CONFIDENCE_FROM_PRIORITY[item.priority] ?? 70,
  }
}

export default function RecommendationsPage() {
  return (
    <FeatureGate featureCode="INVENTORY_RECOMMEND">
      <RecommendationsPageContent />
    </FeatureGate>
  )
}

function RecommendationsPageContent() {
  const { toast } = useToast()
  const { data: recoData, isLoading } = useRecommendations()
  const { data: summary } = useRecommendationsSummary()
  const { mutate: refresh, isPending: isRefreshing } = useRefreshRecommendations()
  const { tenant } = useAuthStore()

  // Resolve variantId -> SKU so cards/table show readable identifiers instead of UUIDs.
  const { data: variantsPage } = useQuery({
    queryKey: ["catalog-variants", tenant?.id],
    queryFn: () => catalogService.getAllVariants(500),
    staleTime: 5 * 60_000,
  })
  const skuMap = new Map<string, string>(
    (variantsPage?.content ?? []).map((v) => [v.id, v.sku])
  )

  const realItems = recoData?.items ?? []
  const totalActions = summary?.total ?? recoData?.total ?? 0

  // KPIs from real summary data
  const impact = summary?.estimatedImpact
  const kpis = [
    {
      label: "Tổng hành động",
      value: isLoading ? "..." : String(totalActions),
      subtitle: "khuyến nghị của AI",
      trendType: "neutral" as const,
    },
    {
      label: "Cần thanh lý",
      value: isLoading ? "..." : String(impact?.clearanceItems ?? 0),
      subtitle: "mã hàng cần thanh lý",
      trendType: (impact?.clearanceItems ?? 0) > 0 ? ("down" as const) : ("neutral" as const),
    },
    {
      label: "Cần nhập thêm",
      value: isLoading ? "..." : String(impact?.restockItems ?? 0),
      subtitle: "mã hàng cần nhập thêm",
      trendType: (impact?.restockItems ?? 0) > 0 ? ("up" as const) : ("neutral" as const),
    },
    {
      label: "Giảm giá đề xuất",
      value: isLoading ? "..." : (impact?.avgDiscountPct ? `${impact.avgDiscountPct}%` : "—"),
      subtitle: "trung bình cho hàng thanh lý",
      trendType: "neutral" as const,
    },
  ]

  // Top 3 actions from BFF summary
  const topActionCards = (summary?.topActions ?? []).slice(0, 3).map((a) => buildTopActionCard(a, skuMap))

  // Action distribution from BFF summary.byAction
  const byAction = summary?.byAction ?? {}
  const actionDistTotal = Object.values(byAction).reduce((a, b) => a + b, 0)
  const actionDist = Object.entries(byAction).map(([action, count]) => ({
    label: ACTION_LABELS[action] ?? action,
    count,
    pct: actionDistTotal > 0 ? Math.round((count / actionDistTotal) * 100) : 0,
  }))

  function handleRefresh() {
    refresh(undefined, {
      onSuccess: () => toast({ title: "Đang làm mới đề xuất...", description: "Dữ liệu sẽ cập nhật sau vài giây" }),
      onError: () => toast({ title: "Không thể làm mới", variant: "destructive" }),
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status="complete" />
            <StatusBadge status="ready" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Đề xuất AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Dựa trên dữ liệu bán hàng và phân tích thị trường
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 disabled:opacity-50 transition"
        >
          <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? "animate-spin" : ""}`}>
            refresh
          </span>
          Làm mới
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Top Actions + AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Actions — real BFF data */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            3 hành động ưu tiên cao
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topActionCards.length > 0 ? (
            <div className="space-y-4">
              {topActionCards.map((action, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[16px]">{action.icon}</span>
                      </div>
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded border uppercase tracking-wider ${action.priorityColor}`}>
                        {action.priority}
                      </span>
                    </div>
                    <ConfidenceBadge value={action.confidence} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">{action.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{action.description}</p>
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    {action.impact}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-slate-400 text-4xl mb-3 block">recommend</span>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Chưa có đề xuất</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Tải dữ liệu bán hàng hoặc nhấn "Làm mới" để AI phân tích
              </p>
            </div>
          )}
        </div>

        {/* Right — AI Insight + Simulation */}
        <div className="space-y-4">
          <AIInsightBox
            title="Tại sao AI đề xuất điều này?"
            items={[
              "Phân tích tồn kho và dữ liệu bán hàng thực tế của shop",
              "So sánh với xu hướng thị trường thời trang Việt Nam",
              "Áp dụng quy tắc theo Giai đoạn 1 — tồn lâu, tỷ lệ bán ra thấp",
            ]}
            variant="purple"
          />

          {/* Simulation Preview — static estimates */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
              Mô phỏng sau 30 ngày
            </p>
            <div className="space-y-3">
              {[
                { label: "Mã hàng thanh lý", before: impact?.clearanceItems ?? 0, after: 0, pct: 100 },
                { label: "Mã hàng nhập thêm", before: 0, after: impact?.restockItems ?? 0, pct: Math.min(100, (impact?.restockItems ?? 0) * 10) },
              ].map((sim) => (
                <div key={sim.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">{sim.label}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {sim.before} → {sim.after}
                    </span>
                  </div>
                  <ProgressBar value={sim.pct} color="bg-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table — real ML data, empty state when no data */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Tất cả đề xuất {realItems.length > 0 && <span className="text-primary">({realItems.length})</span>}
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
          </div>
        ) : realItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["Mã hàng", "Danh mục", "Hành động", "Lý do", "Ưu tiên", "Tin cậy"].map((h) => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-500 tracking-wider pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {realItems.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-500">{variantLabel(row.variantId, skuMap)}</td>
                    <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">—</td>
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">{ACTION_LABELS[row.action] ?? row.action}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-400 text-xs max-w-[200px] truncate">{row.reason ?? "—"}</td>
                    <td className="py-3 pr-4"><RiskBadge level={row.priority} /></td>
                    <td className="py-3"><ConfidenceBadge value={CONFIDENCE_FROM_PRIORITY[row.priority] ?? 70} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-slate-300 text-4xl mb-3 block">table_rows</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có đề xuất nào</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Tải dữ liệu bán hàng hoặc nhấn "Làm mới" để AI tạo đề xuất
            </p>
          </div>
        )}
      </div>

      {/* Action Distribution (real) + AI Logic Rules (static) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Distribution — real byAction data */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
            Phân bổ theo loại hành động
          </h3>
          {actionDist.length > 0 ? (
            <div className="space-y-3">
              {actionDist.map((dist) => (
                <div key={dist.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{dist.label}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{dist.count} hành động</span>
                  </div>
                  <ProgressBar value={dist.pct} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
              Chưa có dữ liệu phân bổ
            </p>
          )}
        </div>

        {/* AI Logic Rules — factual, static */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
            Quy tắc AI sử dụng
          </h3>
          <div className="space-y-3">
            {AI_LOGIC_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-primary text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="bg-brand-gradient text-white rounded-xl p-5 flex items-center gap-4 hover:opacity-90 transition">
          <span className="material-symbols-outlined text-2xl">download</span>
          <div className="text-left">
            <p className="font-bold">Xuất kế hoạch hành động</p>
            <p className="text-indigo-200 text-sm">
              {totalActions > 0 ? `Excel / PDF với ${totalActions} đề xuất` : "Chưa có đề xuất để xuất"}
            </p>
          </div>
        </button>
        <Link
          href={ROUTES.FORECAST}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 hover:border-primary/50 transition"
        >
          <span className="material-symbols-outlined text-primary text-2xl">insights</span>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">Xem dự báo xu hướng</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Xu hướng sản phẩm {getForecastPeriod()}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
