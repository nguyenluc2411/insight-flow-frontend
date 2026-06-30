"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/common/StatusBadge"
import { ConfidenceBadge } from "@/components/common/ConfidenceBadge"
import { RiskBadge } from "@/components/common/RiskBadge"
import { TrendIndicator } from "@/components/common/TrendIndicator"
import { AIInsightBox } from "@/components/common/AIInsightBox"
import { ForecastChart } from "@/components/forecast/ForecastChart"
import { useForecastSummary, useForecastSeries } from "@/hooks/useForecast"
import { useCategories } from "@/hooks/useCatalog"
import { useRecommendations } from "@/hooks/useRecommendations"
import { FeatureGate } from "@/components/feature/FeatureGate"
import { getForecastPeriod } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { catalogService } from "@/services/catalog.service"
import { useAuthStore } from "@/stores/auth.store"

const CONFIDENCE_VALUE: Record<string, number> = { HIGH: 90, MEDIUM: 75, LOW: 60 }

type PillDir = "up" | "down" | "neutral"

const PILL_STYLES: Record<PillDir, string> = {
  up: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
  down: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
  neutral: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
}

function ActionPill({ dir, text }: { dir: PillDir; text: string }) {
  const icon = dir === "up" ? "arrow_upward" : dir === "down" ? "arrow_downward" : "remove"
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wider ${PILL_STYLES[dir]}`}
    >
      <span className="material-symbols-outlined text-[13px]">{icon}</span>
      {text}
    </span>
  )
}

function StatCard({
  label,
  value,
  subtitle,
  pill,
}: {
  label: string
  value: string
  subtitle: string
  pill?: { dir: PillDir; text: string } | null
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-4xl font-black text-slate-900 dark:text-slate-100 leading-none">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>
      {pill && (
        <div className="mt-3">
          <ActionPill dir={pill.dir} text={pill.text} />
        </div>
      )}
    </div>
  )
}

export default function ForecastPage() {
  return (
    <FeatureGate featureCode="DEMAND_FORECAST">
      <ForecastPageContent />
    </FeatureGate>
  )
}

function ForecastPageContent() {
  const { data: forecast, isLoading } = useForecastSummary()
  const { data: categories } = useCategories()
  const { data: clearanceData } = useRecommendations({ action: "CLEARANCE" })
  const { data: restockData } = useRecommendations({ action: "RESTOCK" })

  // Resolve variantId -> sku / product name / category so cards & table show readable
  // identifiers instead of raw UUIDs.
  const { tenant } = useAuthStore()
  const { data: variantsPage } = useQuery({
    queryKey: ["catalog-variants", tenant?.id],
    queryFn: () => catalogService.getAllVariants(500),
    staleTime: 5 * 60_000,
  })
  const { data: productsPage } = useQuery({
    queryKey: ["catalog-products-all", tenant?.id],
    queryFn: () => catalogService.getProducts({ size: 500 }),
    staleTime: 5 * 60_000,
  })

  const categoryNameMap = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]))
  const variantById = new Map((variantsPage?.content ?? []).map((v) => [v.id, v]))
  const productById = new Map((productsPage?.content ?? []).map((p) => [p.id, p]))

  // variantId -> suggested restock qty (for "Đề xuất nhập thêm +N" on product cards)
  const restockByVariant = new Map(
    (restockData?.items ?? [])
      .filter((r) => r.suggestedRestockQty != null)
      .map((r) => [r.variantId, r.suggestedRestockQty as number])
  )

  // Resolve a readable name + category for a variantId.
  function resolve(variantId: string, fallbackSku?: string) {
    const v = variantById.get(variantId)
    const p = v ? productById.get(v.productId) : undefined
    const category = p?.categoryId ? categoryNameMap[p.categoryId] : undefined
    return {
      sku: v?.sku ?? fallbackSku ?? variantId.slice(0, 8) + "…",
      name: p?.name ?? v?.sku ?? fallbackSku ?? `Mã hàng ${variantId.slice(-6)}`,
      category: category ?? "Sản phẩm",
    }
  }

  // ML clearance recommendations → avoid-products table
  const avoidProducts = (clearanceData?.items ?? []).map((item) => {
    const r = resolve(item.variantId)
    return {
      sku: r.sku,
      name: r.name,
      category: r.category,
      reason: item.reason ?? "Nhu cầu thấp / tồn lâu ngày",
      risk: item.priority as "HIGH" | "MEDIUM" | "LOW",
    }
  })

  const categoryTrends = forecast?.categoryTrends ?? []
  const topProducts = forecast?.topProducts ?? []
  const confidence = Math.round((forecast?.overallConfidence ?? 0) * 100)
  const upCount = categoryTrends.filter((c) => c.trend === "UP").length
  const downCount = categoryTrends.filter((c) => c.trend === "DOWN").length

  // Average measured error across backtested models, shown as a real metric.
  const overallWape = forecast?.overallWape ?? null
  const overallAccuracyPct = overallWape != null ? Math.max(0, Math.round((1 - overallWape) * 100)) : null

  // Per-variant chart: default to the top forecast product, fall back to the
  // first catalog variant; user can switch via the selector.
  const allVariants = variantsPage?.content ?? []
  const defaultVariantId = topProducts[0]?.variantId ?? allVariants[0]?.id
  const [pickedVariantId, setPickedVariantId] = useState<string | undefined>(undefined)
  const selectedVariantId = pickedVariantId ?? defaultVariantId
  const selectedSku = selectedVariantId ? variantById.get(selectedVariantId)?.sku : undefined
  const { data: chartSeries, isLoading: chartLoading } = useForecastSeries(
    selectedVariantId,
    30,
    90,
    selectedSku,
  )

  // AI strategy bullets derived from REAL forecast data (no hardcoded copy).
  const strategyItems: string[] = []
  if (overallAccuracyPct != null) {
    strategyItems.push(
      `Mô hình đang đạt độ chính xác kiểm thử ~${overallAccuracyPct}% (sai số ~${Math.round(overallWape! * 100)}%) trên các sản phẩm đã đủ dữ liệu.`,
    )
  }
  if (topProducts.length > 0) {
    const names = topProducts
      .slice(0, 3)
      .map((p) => resolve(p.variantId, p.sku).name)
      .join(", ")
    strategyItems.push(`Ưu tiên nhập kỳ tới: ${names}.`)
  }
  if (avoidProducts.length > 0) {
    strategyItems.push(
      `${avoidProducts.length} mã hàng nên giảm/ngừng nhập do nhu cầu thấp — xem bảng "Sản phẩm không nên nhập thêm".`,
    )
  }
  if (forecast?.hasColdStart) {
    strategyItems.push(
      "Một số sản phẩm chưa đủ lịch sử bán — dự báo đang dựa trên xu hướng thị trường HCM, độ chính xác sẽ tăng sau ~4 tuần có dữ liệu thực.",
    )
  }
  if (strategyItems.length === 0) {
    strategyItems.push(
      "Chưa đủ dữ liệu bán hàng để đưa ra chiến lược. Hãy kết nối POS hoặc nhập lịch sử bán hàng để kích hoạt dự báo.",
    )
  }

  const stats: { label: string; value: string; subtitle: string; pill?: { dir: PillDir; text: string } | null }[] = [
    {
      label: "Nhóm sản phẩm tăng",
      value: isLoading ? "…" : String(upCount),
      subtitle: "danh mục nên đầu tư",
      pill: { dir: "up", text: "Tăng nhập" },
    },
    {
      label: "SKU ưu tiên nhập",
      value: isLoading ? "…" : String(topProducts.length),
      subtitle: "sản phẩm được đề xuất",
      pill: null,
    },
    {
      label: "Mã hàng rủi ro",
      value: isLoading ? "…" : String(downCount),
      subtitle: "danh mục cần xem xét",
      pill: { dir: "down", text: "Giảm nhập" },
    },
    {
      label: "Độ tin cậy AI",
      value: isLoading ? "…" : confidence > 0 ? `${confidence}%` : "—",
      subtitle: overallAccuracyPct != null ? `sai số kiểm thử ~${100 - overallAccuracyPct}%` : "dựa trên dữ liệu thực",
      pill: confidence >= 80 ? { dir: "up", text: "Cao" } : confidence >= 60 ? { dir: "neutral", text: "Trung bình" } : null,
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status="ready" />
            <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[11px] font-bold rounded-full border border-indigo-200 dark:border-indigo-900 uppercase tracking-wider">
              Kỳ dự báo {getForecastPeriod()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dự báo Xu hướng</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Phân tích xu hướng sản phẩm thời trang {getForecastPeriod()}
          </p>
        </div>
        {confidence > 0 && <ConfidenceBadge value={confidence} />}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Cold-start banner */}
      {forecast?.hasColdStart && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">info</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Dự báo dựa trên xu hướng thị trường HCM</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Shop chưa có đủ lịch sử bán hàng. AI đang dùng dữ liệu Google Trends ngành thời trang HCM làm cơ sở.
              Độ chính xác tăng dần sau 4 tuần có dữ liệu thực.
            </p>
          </div>
        </div>
      )}

      {/* No products message */}
      {forecast?.message && topProducts.length === 0 && (
        <div className="mb-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-slate-400 text-4xl mb-3 block">inventory_2</span>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{forecast.message}</p>
        </div>
      )}

      {/* Per-variant forecast chart */}
      {selectedVariantId && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Biểu đồ dự báo theo sản phẩm</h2>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Sản phẩm:</span>
              <select
                value={selectedVariantId}
                onChange={(e) => setPickedVariantId(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 max-w-[260px]"
              >
                {allVariants.map((v) => {
                  const r = resolve(v.id, v.sku)
                  return (
                    <option key={v.id} value={v.id}>
                      {r.name}
                    </option>
                  )
                })}
              </select>
            </label>
          </div>
          <ForecastChart series={chartSeries} isLoading={chartLoading} />
        </div>
      )}

      {/* Category Trends */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Xu hướng theo danh mục</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        ) : categoryTrends.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {categoryTrends.map((cat) => {
              const isDown = cat.trend === "DOWN"
              return (
                <div key={cat.category} className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <p className="flex-1 min-w-[160px] text-sm font-medium text-slate-700 dark:text-slate-300">
                    {categoryNameMap[cat.category] ?? cat.category}
                  </p>
                  <TrendIndicator value={cat.pct} />
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded border uppercase tracking-wider ${
                      isDown ? PILL_STYLES.down : cat.trend === "UP" ? PILL_STYLES.up : PILL_STYLES.neutral
                    }`}
                  >
                    {cat.trend === "UP" ? "Tăng nhập" : isDown ? "Giảm nhập" : "Giữ nguyên"}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Chưa có dữ liệu xu hướng — tải dữ liệu bán hàng để kích hoạt dự báo.
          </p>
        )}
      </div>

      {/* Top Products — priority restock */}
      {topProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Sản phẩm ưu tiên nhập kỳ tới</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((p) => {
              const r = resolve(p.variantId, p.sku)
              const restock = restockByVariant.get(p.variantId)
              return (
                <div
                  key={p.variantId}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 hover:shadow-soft transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900 uppercase tracking-wider truncate max-w-[55%]">
                      {r.category}
                    </span>
                    <ConfidenceBadge value={CONFIDENCE_VALUE[p.confidence] ?? 75} />
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 truncate" title={r.name}>
                    {r.name}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Dự báo bán 30 ngày</span>
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {Math.round(p.forecastDays30)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Đề xuất nhập thêm</span>
                    <span className="text-lg font-black text-green-600 dark:text-green-400">
                      {restock != null ? `+ ${restock}` : "—"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Avoid Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
          Sản phẩm không nên nhập thêm
          {avoidProducts.length > 0 && (
            <span className="ml-2 text-xs font-normal text-primary">({avoidProducts.length} từ AI)</span>
          )}
        </h2>
        {avoidProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {["Mã hàng", "Tên sản phẩm", "Danh mục", "Lý do không nhập", "Mức rủi ro"].map((h) => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-slate-500 tracking-wider pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {avoidProducts.map((p) => (
                  <tr key={p.sku}>
                    <td className="py-3 pr-4 text-xs font-mono text-slate-500">{p.sku}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">{p.name}</td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{p.category}</td>
                    <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-400">{p.reason}</td>
                    <td className="py-3">
                      <RiskBadge level={p.risk} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
            Chưa có dữ liệu — tải lịch sử bán hàng để AI xác định sản phẩm rủi ro.
          </p>
        )}
      </div>

      {/* AI Strategy Box — derived from real forecast data */}
      <AIInsightBox title={`Chiến lược AI cho ${getForecastPeriod()}`} items={strategyItems} variant="dark" />
    </div>
  )
}
